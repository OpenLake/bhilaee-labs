'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getRecentlyViewed } from '@/lib/db';
import { getAllExperiments } from '@/data/labs';
import ExperimentCard from '@/components/ExperimentCard';
import styles from '@/app/preferences/Preferences.module.css';
import homeStyles from '@/components/SearchBar.module.css';

export default function HistoryPage() {
    const { user, loading: authLoading } = useAuth();
    const [historyItems, setHistoryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && user) {
            fetchHistory();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const fetchHistory = async () => {
        const { data, error } = await getRecentlyViewed(user.id);
        if (!error && data) {
            const allExps = getAllExperiments();
            const enriched = data.map(item => {
                let labId, expId;
                if (item.experiment_id.includes('/')) {
                    [labId, expId] = item.experiment_id.split('/');
                } else {
                    expId = item.experiment_id;
                }

                const found = allExps.find(e => 
                    String(e.id) === String(expId) && 
                    (!labId || String(e.labId) === String(labId))
                );
                return found ? { ...found, viewed_at: item.viewed_at } : null;
            }).filter(Boolean);
            setHistoryItems(enriched);
        }
        setLoading(false);
    };

    if (authLoading || loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>Loading your history...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.container}>
                <div className={styles.authPrompt}>
                    <h2>Please Log In</h2>
                    <p>Sign in to sync your laboratory navigation history across devices.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Recently Viewed</h1>
                <p className={styles.subtitle}>Your last 10 visits, automatically synced to the cloud</p>
            </header>

            {historyItems.length > 0 ? (
                <div className={homeStyles.resultsGrid}>
                    {historyItems.map((exp) => (
                        <ExperimentCard 
                            key={`${exp.labId}-${exp.id}-${exp.viewed_at}`} 
                            exp={exp} 
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>🕒</span>
                    <h3>No history found</h3>
                    <p>Start exploring labs to see your recently viewed experiments here.</p>
                </div>
            )}
        </div>
    );
}
