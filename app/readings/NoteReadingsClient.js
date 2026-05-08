'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { labs } from '@/data/labs';
import { saveObservation } from '@/lib/db';
import styles from './NoteReadings.module.css';

const DEFAULT_ROWS = 5;
const DEFAULT_COLS = 3;
const MAX_ROWS = 50;
const MAX_COLS = 15;

function createEmptyTable(rows, cols) {
    return {
        headers: Array.from({ length: cols }, (_, i) => `Column ${i + 1}`),
        rows: Array.from({ length: rows }, () => Array(cols).fill('')),
    };
}

export default function NoteReadingsClient() {
    const { user } = useAuth();

    // Mode: 'lab' for lab-linked readings, 'freeform' for quick scratch tables
    const [mode, setMode] = useState('lab');

    // Lab selection
    const [selectedLabId, setSelectedLabId] = useState('');
    const [selectedExpId, setSelectedExpId] = useState('');

    // Table dimensions
    const [dimRows, setDimRows] = useState(DEFAULT_ROWS);
    const [dimCols, setDimCols] = useState(DEFAULT_COLS);

    // Table data
    const [table, setTable] = useState(createEmptyTable(DEFAULT_ROWS, DEFAULT_COLS));

    // Status
    const [status, setStatus] = useState(null); // { type: 'success'|'error', msg: '' }
    const [saving, setSaving] = useState(false);
    const statusTimeout = useRef(null);

    // Derived
    const selectedLab = labs.find(l => l.id === selectedLabId);
    const experiments = selectedLab?.experiments || [];
    const selectedExp = experiments.find(e => String(e.id) === String(selectedExpId));

    const canSave = mode === 'lab' && !!selectedLabId && !!selectedExpId && !!user;

    // Flash a status message
    const flash = useCallback((type, msg) => {
        if (statusTimeout.current) clearTimeout(statusTimeout.current);
        setStatus({ type, msg });
        statusTimeout.current = setTimeout(() => setStatus(null), 4000);
    }, []);

    // === Table Operations ===
    const updateHeader = (colIdx, value) => {
        setTable(prev => {
            const newHeaders = [...prev.headers];
            newHeaders[colIdx] = value;
            return { ...prev, headers: newHeaders };
        });
    };

    const updateCell = (rowIdx, colIdx, value) => {
        setTable(prev => {
            const newRows = prev.rows.map(r => [...r]);
            newRows[rowIdx][colIdx] = value;
            return { ...prev, rows: newRows };
        });
    };

    const addRow = () => {
        if (table.rows.length >= MAX_ROWS) return;
        setTable(prev => ({
            ...prev,
            rows: [...prev.rows, Array(prev.headers.length).fill('')],
        }));
    };

    const deleteRow = (rowIdx) => {
        if (table.rows.length <= 1) return;
        setTable(prev => ({
            ...prev,
            rows: prev.rows.filter((_, i) => i !== rowIdx),
        }));
    };

    const applyDimensions = () => {
        const r = Math.max(1, Math.min(MAX_ROWS, dimRows));
        const c = Math.max(1, Math.min(MAX_COLS, dimCols));
        setTable(prev => {
            // Preserve existing data as much as possible
            const newHeaders = Array.from({ length: c }, (_, i) =>
                prev.headers[i] || `Column ${i + 1}`
            );
            const newRows = Array.from({ length: r }, (_, ri) =>
                Array.from({ length: c }, (_, ci) =>
                    prev.rows[ri]?.[ci] ?? ''
                )
            );
            return { headers: newHeaders, rows: newRows };
        });
        setDimRows(r);
        setDimCols(c);
    };

    const clearTable = () => {
        setTable(createEmptyTable(table.rows.length, table.headers.length));
    };

    // === Save to Supabase (same as EditableTableBlock) ===
    const handleSave = async () => {
        if (!canSave) return;
        setSaving(true);
        try {
            const experimentId = `${selectedLabId}/${selectedExpId}`;
            const sectionId = 'note-readings';
            // Save headers as the first row so observations page can display them
            const dataWithHeaders = { headers: table.headers, rows: table.rows };

            // Add a timeout to prevent infinite hang
            const savePromise = saveObservation(user.id, experimentId, sectionId, dataWithHeaders);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Save timed out after 10 seconds')), 10000)
            );

            const { error } = await Promise.race([savePromise, timeoutPromise]);
            if (error) throw error;
            flash('success', 'Readings saved to your observations!');
        } catch (e) {
            console.error('Save failed:', e);
            flash('error', e.message || 'Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // === Download as CSV ===
    const downloadCSV = () => {
        const headerRow = table.headers.join(',');
        const dataRows = table.rows.map(row =>
            row.map(cell => {
                const str = String(cell);
                return str.includes(',') || str.includes('"') || str.includes('\n')
                    ? `"${str.replace(/"/g, '""')}"`
                    : str;
            }).join(',')
        );
        const csvContent = [headerRow, ...dataRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = selectedExp
            ? `${selectedLab?.name || 'Lab'} - ${selectedExp.name || 'Exp'} Readings.csv`
            : 'Note Readings.csv';
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        flash('success', 'Downloaded as CSV');
    };

    // === Download as TSV (Excel-friendly) ===
    const downloadTSV = () => {
        const headerRow = table.headers.join('\t');
        const dataRows = table.rows.map(row => row.map(String).join('\t'));
        const tsvContent = [headerRow, ...dataRows].join('\n');
        const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = selectedExp
            ? `${selectedLab?.name || 'Lab'} - ${selectedExp.name || 'Exp'} Readings.xls`
            : 'Note Readings.xls';
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        flash('success', 'Downloaded for Excel');
    };

    return (
        <div className={styles.notesContainer}>
            <nav className={styles.breadcrumb}>
                <Link href="/">← Home</Link>
                <span> / Note Readings</span>
            </nav>

            <header className={styles.header}>
                <h1 className={styles.title}>📝 Note Readings</h1>
                <p className={styles.subtitle}>
                    Create observation tables, record experimental readings, and save or export them.
                </p>
            </header>

            {/* === Setup Section === */}
            <div className={styles.setupSection}>
                {/* Mode toggle */}
                <div className={styles.modeTabs}>
                    <button
                        className={`${styles.modeTab} ${mode === 'lab' ? styles.modeTabActive : ''}`}
                        onClick={() => setMode('lab')}
                    >
                        <span>🧪</span> Lab Experiment
                    </button>
                    <button
                        className={`${styles.modeTab} ${mode === 'freeform' ? styles.modeTabActive : ''}`}
                        onClick={() => setMode('freeform')}
                    >
                        <span>📋</span> Quick Table
                    </button>
                </div>

                {/* Lab + Experiment selectors */}
                {mode === 'lab' && (
                    <>
                        <div className={styles.selectorRow}>
                            <div className={styles.selectorGroup}>
                                <label className={styles.selectorLabel}>Lab</label>
                                <select
                                    className={styles.selector}
                                    value={selectedLabId}
                                    onChange={(e) => {
                                        setSelectedLabId(e.target.value);
                                        setSelectedExpId('');
                                    }}
                                >
                                    <option value="">Select a lab...</option>
                                    {labs.map(lab => (
                                        <option key={lab.id} value={lab.id}>
                                            {lab.code} — {lab.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.selectorGroup}>
                                <label className={styles.selectorLabel}>Experiment</label>
                                <select
                                    className={styles.selector}
                                    value={selectedExpId}
                                    onChange={(e) => setSelectedExpId(e.target.value)}
                                    disabled={!selectedLabId}
                                >
                                    <option value="">
                                        {selectedLabId ? 'Select an experiment...' : 'Choose a lab first'}
                                    </option>
                                    {experiments.map(exp => (
                                        <option key={exp.id} value={exp.id}>
                                            Exp {exp.id} — {exp.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Context badge */}
                        {selectedLabId && selectedExpId && (
                            <div className={styles.contextBadge}>
                                <span className={styles.contextBadgeIcon}>📌</span>
                                <span>{selectedLab?.code} → Exp {selectedExpId}: {selectedExp?.name}</span>
                            </div>
                        )}

                        {!user && (
                            <div className={styles.saveHint}>
                                <span className={styles.saveHintIcon}>ℹ️</span>
                                <span>Log in to save readings to your cloud observations. Downloads always work.</span>
                            </div>
                        )}
                    </>
                )}

                {mode === 'freeform' && (
                    <div className={styles.saveHint}>
                        <span className={styles.saveHintIcon}>ℹ️</span>
                        <span>Quick tables are for scratch work — you can download them but saving to cloud requires linking a lab and experiment.</span>
                    </div>
                )}
            </div>

            {/* === Table Card === */}
            <div className={styles.tableCard}>
                <div className={styles.tableCardHeader}>
                    <div className={styles.tableCardTitle}>
                        <span>📊</span>
                        <span>Readings Table</span>
                        <span className={styles.tableDimensions}>
                            {table.rows.length}×{table.headers.length}
                        </span>
                    </div>
                    <div className={styles.dimControls}>
                        <div className={styles.dimGroup}>
                            <span className={styles.dimLabel}>Rows</span>
                            <input
                                type="number"
                                className={styles.dimInput}
                                value={dimRows}
                                min={1}
                                max={MAX_ROWS}
                                onChange={(e) => setDimRows(parseInt(e.target.value) || 1)}
                            />
                        </div>
                        <div className={styles.dimGroup}>
                            <span className={styles.dimLabel}>Cols</span>
                            <input
                                type="number"
                                className={styles.dimInput}
                                value={dimCols}
                                min={1}
                                max={MAX_COLS}
                                onChange={(e) => setDimCols(parseInt(e.target.value) || 1)}
                            />
                        </div>
                        <button className={styles.applyDimBtn} onClick={applyDimensions}>
                            Apply
                        </button>
                    </div>
                </div>

                <div className={styles.tableScroll}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                {table.headers.map((h, ci) => (
                                    <th key={ci}>
                                        <input
                                            type="text"
                                            className={`${styles.cellInput} ${styles.headerInput}`}
                                            value={h}
                                            onChange={(e) => updateHeader(ci, e.target.value)}
                                            placeholder={`Col ${ci + 1}`}
                                        />
                                    </th>
                                ))}
                                <th className={styles.rowAction}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {table.rows.map((row, ri) => (
                                <tr key={ri}>
                                    {row.map((cell, ci) => (
                                        <td key={ci}>
                                            <input
                                                type="text"
                                                className={styles.cellInput}
                                                value={cell}
                                                onChange={(e) => updateCell(ri, ci, e.target.value)}
                                                placeholder="—"
                                            />
                                        </td>
                                    ))}
                                    <td className={styles.rowAction}>
                                        <button
                                            className={styles.deleteRowBtn}
                                            onClick={() => deleteRow(ri)}
                                            title="Delete row"
                                            disabled={table.rows.length <= 1}
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={table.headers.length + 1}>
                                    <button className={styles.addRowBtn} onClick={addRow} disabled={table.rows.length >= MAX_ROWS}>
                                        <span>+</span> Add Row
                                    </button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* === Action Bar === */}
            <div className={styles.actionBar}>
                <div className={styles.actionGroup}>
                    <button className={styles.btnSecondary} onClick={downloadCSV}>
                        <span className={styles.btnIcon}>📄</span> Download CSV
                    </button>
                    <button className={styles.btnSecondary} onClick={downloadTSV}>
                        <span className={styles.btnIcon}>📊</span> Download Excel
                    </button>
                    <button className={styles.btnSecondary} onClick={clearTable}>
                        <span className={styles.btnIcon}>🗑️</span> Clear
                    </button>
                </div>
                <div className={styles.actionGroup}>
                    {status && (
                        <span className={`${styles.statusMsg} ${status.type === 'success' ? styles.statusSuccess : styles.statusError}`}>
                            {status.msg}
                        </span>
                    )}
                    <button
                        className={styles.btnPrimary}
                        onClick={handleSave}
                        disabled={!canSave || saving}
                        title={
                            !user ? 'Log in to save' :
                            mode === 'freeform' ? 'Switch to Lab mode and select an experiment to save' :
                            !selectedLabId || !selectedExpId ? 'Select a lab and experiment first' :
                            'Save to your cloud observations'
                        }
                    >
                        <span className={styles.btnIcon}>💾</span>
                        {saving ? 'Saving...' : 'Save to Observations'}
                    </button>
                </div>
            </div>
        </div>
    );
}
