'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { updateProfile, clearAllBookmarks, clearAllObservations, clearAllHistory, getStarredExperimentsDetailed, getAllSavedObservations } from '@/lib/db';
import { labs } from '@/data/labs';
import styles from './PreferencesNew.module.css';

export default function PreferencesClient() {
    const router = useRouter();
    const { user, profile: dbProfile, loading: authLoading } = useAuth();

    // -- State Definitions --
    const [profile, setProfile] = useState({ name: '', rollNumber: '' });
    const [appSettings, setAppSettings] = useState({ theme: 'dark', pinnedLabs: [] });
    const [stats, setStats] = useState({ observations: 0, bookmarks: 0 });
    const [printPrefs, setPrintPrefs] = useState({
        theory: true,
        apparatus: true,
        observation: true,
        calculation: true,
        postLab: false
    });
    
    // Status tracking for UX
    const [saveStatus, setSaveStatus] = useState('');

    // -- Load specific keys on mount --
    useEffect(() => {
        if (user) {
            // Once we have a user, wait specifically for the profile
            if (dbProfile) {
                setProfile({ 
                    name: dbProfile.full_name || '', 
                    rollNumber: dbProfile.roll_number || '' 
                });
                setAppSettings({ 
                    theme: dbProfile.theme || 'dark', 
                    pinnedLabs: dbProfile.default_lab ? dbProfile.default_lab.split(',').filter(Boolean) : [] 
                });
                if (dbProfile.print_preferences) {
                    const prefs = dbProfile.print_preferences;
                    setPrintPrefs({
                        theory: prefs.theory ?? true,
                        apparatus: prefs.apparatus ?? true,
                        procedure: prefs.procedure ?? prefs.procedures ?? true,
                        observation: prefs.observation ?? prefs.observations ?? true,
                        calculation: prefs.calculation ?? prefs.calculations ?? true
                    });
                }
            }
            // If user exists but dbProfile is null, we stay in 'Loading' state handled by authLoading
        } else if (!authLoading) {
            // Only fall back to Guest data if we are definitively NOT logged in and NOT loading
            try {
                const savedProfile = localStorage.getItem('userProfile');
                if (savedProfile) setProfile(JSON.parse(savedProfile));

                const savedApp = localStorage.getItem('appSettings');
                if (savedApp) setAppSettings(JSON.parse(savedApp));

                const savedPrint = localStorage.getItem('printPreferences');
                if (savedPrint) setPrintPrefs(JSON.parse(savedPrint));
            } catch (e) {
                console.error("Failed to load local preferences", e);
            }
        }
    }, [user, dbProfile, authLoading]);

    // Independent stats fetcher
    useEffect(() => {
        const fetchStats = async () => {
            let obsCount = 0;
            let starredCount = 0;

            try {
                if (user) {
                    // Cloud Data
                    const { data: starred } = await getStarredExperimentsDetailed(user.id);
                    starredCount = starred?.length || 0;

                    const { data: obs } = await getAllSavedObservations(user.id);
                    obsCount = obs?.length || 0;
                } else {
                    // Local Data (Guest)
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.includes('-draftData')) obsCount++;
                    }
                    const bookmarks = JSON.parse(localStorage.getItem('starredExperiments') || '[]');
                    starredCount = bookmarks.length;
                }
                setStats({ observations: obsCount, bookmarks: starredCount });
            } catch (e) {
                console.error("Stats fetching failed", e);
            }
        };

        if (!authLoading) {
            fetchStats();
        }

        // Sync with instant updates (like unstarring from another tab)
        const handleUpdate = () => fetchStats();
        window.addEventListener('workspace-updated', handleUpdate);
        return () => window.removeEventListener('workspace-updated', handleUpdate);
    }, [user, authLoading]);

    // Handle external updates (e.g. from ThemeToggle in Header)
    useEffect(() => {
        const syncFromLocal = () => {
            try {
                const savedApp = localStorage.getItem('appSettings');
                if (savedApp) {
                    const parsed = JSON.parse(savedApp);
                    setAppSettings(prev => ({ 
                        ...prev, 
                        theme: parsed.theme || prev.theme,
                        pinnedLabs: parsed.pinnedLabs || prev.pinnedLabs
                    }));
                }
            } catch (e) {
                console.error('Error syncing preferences from local storage:', e);
            }
        };

        window.addEventListener('preferencesUpdated', syncFromLocal);
        return () => window.removeEventListener('preferencesUpdated', syncFromLocal);
    }, []);

    // -- Handlers --
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleAppChange = (e) => {
        const { name, value } = e.target;
        setAppSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleLabPinToggle = (labId) => {
        setAppSettings(prev => {
            const isPinned = prev.pinnedLabs.includes(labId);
            const newPins = isPinned 
                ? prev.pinnedLabs.filter(id => id !== labId)
                : [...prev.pinnedLabs, labId];
            return { ...prev, pinnedLabs: newPins };
        });
    };

    const handlePrintToggle = (key) => {
        setPrintPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSavePrimary = async () => {
        setSaveStatus('Saving...');
        try {
            if (user) {
                // Save to Supabase
                const { error } = await updateProfile(user.id, {
                    full_name: profile.name,
                    roll_number: profile.rollNumber,
                    theme: appSettings.theme,
                    default_lab: appSettings.pinnedLabs.join(','),
                    print_preferences: printPrefs
                });
                if (error) throw error;
            } else {
                // Save to localStorage (Guest)
                localStorage.setItem('userProfile', JSON.stringify(profile));
                localStorage.setItem('appSettings', JSON.stringify(appSettings));
                localStorage.setItem('printPreferences', JSON.stringify(printPrefs));
            }
            
            // Trigger a custom event so Header/ExperimentLayout can re-read if needed
            window.dispatchEvent(new Event('preferencesUpdated'));

            setSaveStatus('Preferences saved successfully!');
            setTimeout(() => setSaveStatus(''), 3000);
        } catch (e) {
            console.error(e);
            setSaveStatus('Error saving preferences.');
        }
    };

    // -- Danger Zone Handlers --
    const clearTableData = async () => {
        if (confirm("Are you sure? This will wipe ALL your manually entered observations and plot points across all experiments.")) {
            if (user) {
                setSaveStatus('Clearing cloud observations...');
                await clearAllObservations(user.id);
            }

            // Local storage cleanup
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.includes('-draftData')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
            setSaveStatus('Cleared observations.');
            setTimeout(() => setSaveStatus(''), 3000);
            alert(`Cleared ${keysToRemove.length} local observation tables and cloud data.`);
        }
    };

    const clearStarred = async () => {
        if (confirm("Remove all starred experiments from your bookmarks?")) {
            if (user) {
                setSaveStatus('Clearing cloud bookmarks...');
                await clearAllBookmarks(user.id);
            }

            localStorage.removeItem('starredExperiments');
            window.dispatchEvent(new Event('bookmarksUpdated'));
            setSaveStatus('Bookmarks cleared.');
            setTimeout(() => setSaveStatus(''), 3000);
            alert('Bookmarks cleared from local and cloud.');
        }
    };

    const factoryReset = async () => {
        if (confirm("FACTORY RESET: This will delete ALL local data, including preferences, bookmarks, and observations. Proceed?")) {
            if (user) {
                setSaveStatus('Performing cloud factory reset...');
                await Promise.all([
                    clearAllBookmarks(user.id),
                    clearAllObservations(user.id),
                    clearAllHistory(user.id)
                ]);
            }

            localStorage.clear();
            alert("All data wiped. Returning to homepage.");
            router.push('/');
        }
    };

    if (authLoading) {
        return <div className={styles.loading}>Connecting to cloud...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.prefGrid}>
                
                {/* Left Column */}
                <div className={styles.column}>
                    
                    {/* Section A: User Identity */}
                    <section className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <h2><span className="material-symbols-outlined">fingerprint</span> USER IDENTITY</h2>
                            <p>Identity parameters for report headers and session tracking.</p>
                        </div>
                        <div className={styles.sectionBody}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="name">Research Personnel Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={profile.name} 
                                    onChange={handleProfileChange}
                                    placeholder="e.g. Dr. Akshay Ravikanti"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="rollNumber">Lab Roll Number / ID</label>
                                <input 
                                    type="text" 
                                    id="rollNumber" 
                                    name="rollNumber" 
                                    value={profile.rollNumber} 
                                    onChange={handleProfileChange}
                                    placeholder="e.g. BIT-EE-2024-008"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section B: Environment Parameters */}
                    <section className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <h2><span className="material-symbols-outlined">settings_applications</span> ENVIRONMENT PARAMETERS</h2>
                            <p>Customize the visual interface and priority access.</p>
                        </div>
                        <div className={styles.sectionBody}>
                            <div className={styles.inputGroup}>
                                <label>Visual Interface Mode</label>
                                <div className={styles.themeToggleGrid}>
                                    {[
                                        { id: 'light', icon: 'light_mode', label: 'Lab Light' },
                                        { id: 'dark', icon: 'dark_mode', label: 'Visual Dark' },
                                        { id: 'system', icon: 'monitor_weight', label: 'System Sync' }
                                    ].map(t => (
                                        <button 
                                            key={t.id}
                                            className={`${styles.themeBtn} ${appSettings.theme === t.id ? styles.themeBtnActive : ''}`}
                                            onClick={() => handleAppChange({ target: { name: 'theme', value: t.id } })}
                                        >
                                            <span className="material-symbols-outlined">{t.icon}</span>
                                            <span>{t.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Priority laboratory access (Pinned)</label>
                                <div className={styles.labTagGroup}>
                                    {labs.map(lab => {
                                        const isPinned = appSettings.pinnedLabs.includes(lab.id);
                                        return (
                                            <div 
                                                key={lab.id} 
                                                className={`${styles.labTag} ${!isPinned ? styles.labTagUnselected : ''}`}
                                                onClick={() => handleLabPinToggle(lab.id)}
                                            >
                                                {lab.name}
                                                {isPinned && <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>}
                                                {!isPinned && <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                                <small className={styles.helpText}>Pinned labs appear at the top of your homepage dashboard.</small>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column */}
                <div className={styles.column}>
                    
                    {/* Section C: Report Generation */}
                    <section className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <h2><span className="material-symbols-outlined">print</span> REPORT GENERATION</h2>
                            <p>Select components for PDF export and documentation.</p>
                        </div>
                        <div className={styles.sectionBody}>
                            <div className={styles.toggleList}>
                                {[
                                    { key: 'theory', label: 'Theoretical Framework', desc: 'Include background and principles', icon: 'menu_book' },
                                    { key: 'apparatus', label: 'Apparatus Inventory', desc: 'List technical specifications', icon: 'precision_manufacturing' },
                                    { key: 'procedure', label: 'Procedural Steps', desc: 'Sequence of operations', icon: 'reorder' },
                                    { key: 'observation', label: 'Data Observations', desc: 'Telemetry tables and logs', icon: 'monitoring' },
                                    { key: 'calculation', label: 'Result Calculations', desc: 'Formulas and final outputs', icon: 'calculate' }
                                ].map(item => (
                                    <div key={item.key} className={styles.toggleRow} onClick={() => handlePrintToggle(item.key)}>
                                        <div className={styles.toggleInfo}>
                                            <span className={`material-symbols-outlined ${styles.toggleIcon}`}>{item.icon}</span>
                                            <div className={styles.toggleText}>
                                                <strong>{item.label}</strong>
                                                <span>{item.desc}</span>
                                            </div>
                                        </div>
                                        <div className={`${styles.switch} ${printPrefs[item.key] ? styles.switchActive : ''}`}>
                                            <span className={styles.slider}></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section E: Laboratory Activity (Useful Replacement) */}
                    <div className={styles.statusCard}>
                        <div className={styles.statusHeader}>
                            <div className={styles.statusIndicator}>
                                <div className={styles.statusDot}></div>
                                LAB STATUS: ACTIVE
                            </div>
                            <span className={styles.versionTag}>V2.1.0-STABLE</span>
                        </div>
                        
                        <div className={styles.metricsGrid}>
                            <div className={styles.metricItem}>
                                <span className={styles.metricLabel}>Total Observations</span>
                                <span className={styles.metricValue}>{stats.observations} Tables</span>
                            </div>
                            <div className={styles.metricItem}>
                                <span className={styles.metricLabel}>Starred Experiments</span>
                                <span className={styles.metricValue}>{stats.bookmarks} Saved</span>
                            </div>
                        </div>

                        <div className={styles.metricItem}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span className={styles.metricLabel}>Local Storage Integrity</span>
                                <span className={styles.versionTag}>Nominal</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Save Button Bar */}
            <div className={styles.saveBar}>
                {saveStatus && <span className={styles.statusMsg}>{saveStatus}</span>}
                <button className={styles.saveBtn} onClick={handleSavePrimary}>
                    Save Preferences
                </button>
            </div>

            {/* Section D: Danger Zone */}
            <section className={styles.dangerZone}>
                <div className={styles.dangerHeader}>
                    <h3><span className="material-symbols-outlined">warning</span> CRUCIAL: MAINTENANCE</h3>
                </div>
                <div className={styles.dangerGrid}>
                    <div className={styles.dangerActionCard} onClick={clearTableData}>
                        <div className={styles.dangerInfo}>
                            <strong>Clear Observations</strong>
                            <p>PURGE ALL LOCAL TELEMETRY LOGS</p>
                        </div>
                        <span className={`material-symbols-outlined ${styles.dangerIcon}`}>delete_sweep</span>
                    </div>
                    <div className={styles.dangerActionCard} onClick={clearStarred}>
                        <div className={styles.dangerInfo}>
                            <strong>Delete Bookmarks</strong>
                            <p>WIPE STARRED EXPERIMENT CACHE</p>
                        </div>
                        <span className={`material-symbols-outlined ${styles.dangerIcon}`}>bookmark_remove</span>
                    </div>
                    <div className={styles.dangerActionCard} onClick={factoryReset}>
                        <div className={styles.dangerInfo}>
                            <strong>Factory Reset</strong>
                            <p>RESTORE OS TO INITIAL DEFAULTS</p>
                        </div>
                        <span className={`material-symbols-outlined ${styles.dangerIcon}`}>factory</span>
                    </div>
                </div>
            </section>

        </div>
    );
}
