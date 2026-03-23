'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import SearchBar from './SearchBar';
import ExperimentCard from './ExperimentCard';
import styles from './SearchBar.module.css';

// Simple SVG Icons for the Labs
const LabIcon = ({ type }) => {
    const icons = {
        bolt: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
        ),
        chip: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                <rect x="9" y="9" width="6" height="6" />
                <line x1="9" y1="1" x2="9" y2="4" />
                <line x1="15" y1="1" x2="15" y2="4" />
                <line x1="9" y1="20" x2="9" y2="23" />
                <line x1="15" y1="20" x2="15" y2="23" />
                <line x1="20" y1="9" x2="23" y2="9" />
                <line x1="20" y1="15" x2="23" y2="15" />
                <line x1="1" y1="9" x2="4" y2="9" />
                <line x1="1" y1="15" x2="4" y2="15" />
            </svg>
        ),
        sliders: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="2" y1="14" x2="6" y2="14" />
                <line x1="10" y1="8" x2="14" y2="8" />
                <line x1="18" y1="16" x2="22" y2="16" />
            </svg>
        ),
        tower: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 21L12 3L3 21" />
                <path d="M12 3v18" />
                <path d="M4.5 18h15" />
                <path d="M7 13h10" />
            </svg>
        ),
        waves: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 10s3-2 5-2 5 2 8 2 5-2 7-2" />
                <path d="M2 14s3-2 5-2 5 2 8 2 5-2 7-2" />
                <path d="M2 18s3-2 5-2 5 2 8 2 5-2 7-2" />
            </svg>
        ),
        "waves-alt": (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="2" />
                <path d="M16.2 7.8a6 6 0 1 1-8.4 0" />
                <path d="M19 5a10 10 0 1 1-14 0" />
            </svg>
        ),
        plug: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 2v2H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h4v2l3 3v5h2v-5l3-3v-2h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4V2" />
                <line x1="12" y1="22" x2="12" y2="13" />
            </svg>
        ),
        "bolt-alt": (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M13 7l-4 6h3l-1 4 4-6h-3l1-4z" />
            </svg>
        )
    };
    return <div className="lab-icon">{icons[type] || icons.bolt}</div>;
};

export default function HomeContent({ labs, allExperiments }) {
    const { profile, user } = useAuth();
    const [query, setQuery] = useState('');
    const [pinnedIds, setPinnedIds] = useState([]);

    // 1. Sync pinned IDs from profile or local storage
    useEffect(() => {
        const syncPinned = () => {
            if (user && profile?.default_lab) {
                setPinnedIds(profile.default_lab.split(',').filter(Boolean));
            } else {
                try {
                    const savedApp = localStorage.getItem('appSettings');
                    if (savedApp) {
                        const parsed = JSON.parse(savedApp);
                        if (parsed.pinnedLabs) setPinnedIds(parsed.pinnedLabs);
                        else setPinnedIds([]);
                    } else {
                        setPinnedIds([]);
                    }
                } catch (e) {
                    setPinnedIds([]);
                }
            }
        };

        syncPinned();

        window.addEventListener('preferencesUpdated', syncPinned);
        return () => window.removeEventListener('preferencesUpdated', syncPinned);
    }, [user, profile]);

    // 2. Sort labs: Pinned first
    const sortedLabs = useMemo(() => {
        return [...labs].sort((a, b) => {
            const aPinned = pinnedIds.includes(a.id);
            const bPinned = pinnedIds.includes(b.id);
            if (aPinned && !bPinned) return -1;
            if (!aPinned && bPinned) return 1;
            return 0;
        });
    }, [labs, pinnedIds]);

    const isSearchActive = query.trim().length > 0;

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return allExperiments.filter(exp =>
            exp.name.toLowerCase().includes(q)
        );
    }, [query, allExperiments]);

    return (
        <>
            <div className="guide-teaser">
                <span>Confused about how to use Bhilai EE Labs? Master the platform and discover all our powerful features with our comprehensive interactive Platform Guide</span>
                <span className="guide-teaser-arrow">⤴</span>
            </div>
            <section className="hero">
                <div className="hero-pill">
                    <span className="hero-pill-icon">🎓</span> IIT Bhilai
                </div>
                <h1>Bhilai EE Labs</h1>
                <p>
                    Tired of struggling with lab reports and searching for experiment details?
                    <br /><br />
                    Bhilai EE Labs makes it effortless to find practical guides, visualize circuits, and master your electrical engineering practicals.
                </p>
            </section>

            <section className="labs-section">
                <div className="labs-heading-row">
                    <h2>Explore Course Labs ({labs.length})</h2>
                    <SearchBar query={query} onQueryChange={setQuery} />
                </div>

                {isSearchActive ? (
                    /* Search results replace the labs grid */
                    <div className={styles.resultsSection}>
                        {results.length > 0 ? (
                            <>
                                <p className={styles.resultsHeading}>
                                    {results.length} experiment{results.length !== 1 ? 's' : ''} found
                                </p>
                                <div className={styles.resultsGrid}>
                                    {results.map(exp => (
                                        <ExperimentCard 
                                            key={`${exp.labId}-${exp.id}`} 
                                            exp={exp} 
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className={styles.noResults}>
                                <p>No experiments found for &ldquo;{query}&rdquo;</p>
                                <p>Try a different search term</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Normal labs grid (Sorted) */
                    <div className="labs-grid" data-tour="labs-grid">
                        {sortedLabs.map((lab) => {
                            const isPinned = pinnedIds.includes(lab.id);
                            return (
                                <Link key={lab.id} href={`/lab/${lab.id}`} className={`lab-card ${isPinned ? 'lab-card-pinned' : ''}`}>
                                    <div className="lab-card-header">
                                        <div className="lab-icon-box">
                                            <LabIcon type={lab.icon} />
                                        </div>
                                        <span className="lab-code-badge">{lab.code}</span>
                                    </div>
                                    <div className="lab-card-body">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h3>{lab.name}</h3>
                                            {isPinned && <span title="Pinned Lab" className="pin-indicator">📌</span>}
                                        </div>
                                        <p className="lab-description">{lab.description}</p>
                                    </div>
                                    <div className="lab-card-footer">
                                        <div className="lab-exp-count">
                                            <span className="exp-icon">⚗</span>
                                            <span>{lab.totalExperiments || lab.experiments.length} Experiments</span>
                                        </div>
                                        <div className="lab-card-arrow">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                                <polyline points="12 5 19 12 12 19" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </>
    );
}
