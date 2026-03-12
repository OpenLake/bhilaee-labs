'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getStarredExperimentsDetailed } from '@/lib/db';
import { getAllExperiments } from '@/data/labs';
import ExperimentCard from '@/components/ExperimentCard';
import styles from '@/app/preferences/Preferences.module.css'; // Reuse container styles
import homeStyles from '@/components/SearchBar.module.css'; // Reuse grid styles

export default function StarredPage() {
    const { user, loading: authLoading } = useAuth();
    const [starredItems, setStarredItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && user) {
            fetchStarred();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const fetchStarred = async () => {
        const { data, error } = await getStarredExperimentsDetailed(user.id);
        if (!error && data) {
            const allExps = getAllExperiments();
            // Map DB IDs to full experiment objects
            const enriched = data.map(item => {
                let labId, expId;
                if (item.experiment_id.includes('/')) {
                    [labId, expId] = item.experiment_id.split('/');
                } else {
                    expId = item.experiment_id;
                }

                // If we have labId, we can target the search or use it directly
                // For now, let's keep it robust and search all
                const found = allExps.find(e => 
                    String(e.id) === String(expId) && 
                    (!labId || String(e.labId) === String(labId))
                );
                
                return found ? { ...found, starred_at: item.created_at } : null;
            }).filter(Boolean);
            setStarredItems(enriched);
        }
        setLoading(false);
    };

    if (authLoading || loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>Loading your bookmarks...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.container}>
                <div className={styles.authPrompt}>
                    <h2>Please Log In</h2>
                    <p>You need to be logged in to view your cloud-synced starred experiments.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Starred Experiments</h1>
                <p className={styles.subtitle}>Experiments you've bookmarked for quick access</p>
            </header>

            {starredItems.length > 0 ? (
                <div className={homeStyles.resultsGrid}>
                    {starredItems.map((exp) => (
                        <ExperimentCard 
                            key={`${exp.labId}-${exp.id}`} 
                            exp={exp} 
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>⭐</span>
                    <h3>No bookmarks yet</h3>
                    <p>Click the star icon on any experiment to save it here.</p>
                </div>
            )}
        </div>
    );
}
