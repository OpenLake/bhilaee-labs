'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { addStarredExperiment, removeStarredExperiment, getStarredExperiments } from '@/lib/db';
import styles from './BookmarkButton.module.css';

export default function BookmarkButton({ experimentId }) {
    const { user } = useAuth();
    const [starred, setStarred] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkStatus = async () => {
            setStarred(false); // Reset while loading
            if (user) {
                const { data } = await getStarredExperiments(user.id);
                if (data.some(id => String(id) === String(experimentId))) {
                    setStarred(true);
                }
            } else {
                const bookmarks = JSON.parse(localStorage.getItem('starredExperiments') || '[]');
                if (bookmarks.some(id => String(id) === String(experimentId))) {
                    setStarred(true);
                }
            }
        };
        checkStatus();
    }, [experimentId, user]);

    const [saving, setSaving] = useState(false);

    const toggleStar = async () => {
        setSaving(true);
        if (user) {
            // DB Toggle
            console.log('BookmarkButton: Toggling DB star', { userId: user.id, experimentId, currentState: starred });
            try {
                if (starred) {
                    const { error } = await removeStarredExperiment(user.id, experimentId);
                    if (error) throw error;
                } else {
                    const { error } = await addStarredExperiment(user.id, experimentId);
                    if (error) throw error;
                }
                setStarred(!starred);
            } catch (e) {
                console.error('BookmarkButton: DB update failed', e);
                alert('Cloud sync failed. Check your connection.');
            }
        } else {
            // LocalStorage Toggle (Guest)
            const bookmarks = JSON.parse(localStorage.getItem('starredExperiments') || '[]');
            let updated;
            if (starred) {
                updated = bookmarks.filter(id => id !== experimentId);
            } else {
                updated = [...bookmarks, experimentId];
            }
            localStorage.setItem('starredExperiments', JSON.stringify(updated));
            setStarred(!starred);
        }
        
        // Notify other components (like menu)
        window.dispatchEvent(new Event('bookmarksUpdated'));
        setSaving(false);
    };

    if (!mounted) return <div className={styles.placeholder} aria-hidden="true" />;

    return (
        <button
            className={`${styles.bookmarkBtn} ${starred ? styles.active : ''}`}
            onClick={toggleStar}
            title={starred ? 'Remove bookmark' : 'Bookmark this experiment'}
            aria-label={starred ? 'Remove bookmark' : 'Bookmark this experiment'}
        >
            <svg className={saving ? styles.spin : ''} width="18" height="18" viewBox="0 0 24 24" fill={Boolean(starred) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {saving ? 'Saving...' : (Boolean(starred) ? 'Starred' : 'Star')}
        </button>
    );
}
