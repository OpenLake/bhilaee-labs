'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAllSavedObservations } from '@/lib/db';
import { getAllExperiments } from '@/data/labs';
import { fetchExperimentData } from '@/lib/actions';
import Link from 'next/link';
import preferencesStyles from '@/app/preferences/Preferences.module.css';
import expStyles from '@/components/experiment/Experiment.module.css';

export default function ObservationsPage() {
    const { user, loading: authLoading } = useAuth();
    const [savedTables, setSavedTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (!authLoading && user) {
            fetchObservations();
        } else if (!authLoading && !user) {
            setLoading(false);
        }

        const handleUpdate = () => fetchObservations();
        window.addEventListener('workspace-updated', handleUpdate);
        return () => {
    window.removeEventListener('workspace-updated', handleUpdate);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
};
    }, [user, authLoading]);

    const fetchObservations = async () => {
        timeoutRef.current = setTimeout(() => {
            setLoading(false);
            console.warn('Fetch timed out for observations');
        }, 8000);

        try {
            const { data, error } = await getAllSavedObservations(user.id);
            if (!error && data && data.length > 0) {
                const allExps = getAllExperiments();
                
                // Fetch full experiment JSONs to get table headers
                const tableViews = await Promise.all(data.map(async (obs) => {
                    let labId, eId;
                    if (String(obs.experiment_id).includes('/')) {
                        [labId, eId] = String(obs.experiment_id).split('/');
                    } else {
                        eId = obs.experiment_id;
                    }
                    
                    const foundExpMeta = allExps.find(e => 
                        String(e.id) === String(eId) && 
                        (!labId || String(e.labId) === String(labId))
                    );

                    // Skip if missing lab mapping or orphaned data
                    if (!foundExpMeta || !labId) return null;

                    // Fetch full JSON using Server Action
                    const expData = await fetchExperimentData(labId, eId);
                    if (!expData || !expData.sections || !expData.sections[obs.section_id]) return null;

                    const section = expData.sections[obs.section_id];
                    const tableBlock = section.content?.find(b => b.type === 'table');
                    
                    // Fallback to empty structure if no table found (in case of schema changes)
                    const headers = tableBlock?.headers || [];

                    return {
                        id: `${obs.experiment_id}-${obs.section_id}`,
                        experimentName: foundExpMeta.name,
                        labName: foundExpMeta.labName,
                        sectionTitle: section.title || obs.section_id,
                        updatedAt: obs.updated_at,
                        headers: headers,
                        rows: obs.data || [],
                        linkUrl: `/lab/${labId}/experiment/${eId}`
                    };
                }));

                setSavedTables(tableViews.filter(Boolean));
            } else {
                setSavedTables([]);
            }
        } finally {
            clearTimeout(timeoutRef.current);
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className={preferencesStyles.container}>
                <div className={preferencesStyles.loadingState}>Loading your saved data...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={preferencesStyles.container} data-tour="observations-page">
                <div className={preferencesStyles.authPrompt}>
                    <h2>Please Log In</h2>
                    <p>Log in to view your saved laboratory observations and cloud-synced data.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={preferencesStyles.container} data-tour="observations-page">
            <nav className={preferencesStyles.breadcrumb}>
                <Link href="/">← Back to Home</Link>
                <span> / Saved Observations</span>
            </nav>
            <header className={preferencesStyles.header} data-tour="observations-page">
                <h1 className={preferencesStyles.title}>Saved Observations</h1>
                <p className={preferencesStyles.subtitle}>Tables of experimental data you have recorded across various labs</p>
            </header>

            {savedTables.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginTop: '2rem' }}>
                    {savedTables.map((tableData) => (
                        <div key={tableData.id} className={preferencesStyles.sectionCard}>
                            <div className={preferencesStyles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-color)', fontSize: '1.4rem', fontWeight: '600' }}>{tableData.experimentName}</h3>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ background: 'var(--bg-color)', color: 'var(--secondary-color)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500', border: '1px solid var(--border-color)' }}>
                                            {tableData.labName}
                                        </span>
                                        <span>•</span>
                                        <span>Section: {tableData.sectionTitle}</span>
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        Last updated: {new Date(tableData.updatedAt).toLocaleDateString()} at {new Date(tableData.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <Link 
                                        href={tableData.linkUrl}
                                        className={preferencesStyles.saveBtn}
                                        style={{ textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                    >
                                        Go to Experiment →
                                    </Link>
                                </div>
                            </div>

                            <div className={preferencesStyles.sectionBody}>
                                <div className={expStyles.tableScroll}>
                                    <table className={expStyles.table}>
                                        <thead>
                                            <tr>
                                                {tableData.headers.length > 0 ? (
                                                    tableData.headers.map((h, i) => <th key={i}>{h}</th>)
                                                ) : (
                                                    <th colSpan={tableData.rows[0]?.length || 1}>No Table Headers Found</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.rows.length > 0 ? (
                                                tableData.rows.map((row, i) => (
                                                    <tr key={i}>
                                                        {row.map((cell, j) => <td key={j}>{cell}</td>)}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={tableData.headers.length || 1} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                                        Table structure recognized, but no experimental rows saved.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={preferencesStyles.emptyState}>
                    <span className={preferencesStyles.emptyIcon}>📊</span>
                    <h3>No observations saved</h3>
                    <p>When you edit and save tables within an experiment, they will appear here.</p>
                </div>
            )}
        </div>
    );
}
