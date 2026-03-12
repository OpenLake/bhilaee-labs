'use client';

import Link from 'next/link';
import styles from './ExperimentCard.module.css';

function getStatusClass(status) {
    if (!status) return '';
    if (status === 'Simulation Available') return styles.statusSimulation;
    if (status === 'Hardware-Oriented') return styles.statusHardware;
    if (status === 'Software-Oriented') return styles.statusSoftware;
    return '';
}

export default function ExperimentCard({ exp }) {
    if (!exp) return null;

    const displayId = String(exp.id).replace('exp-', '').padStart(2, '0');
    const labSlug = exp.labId || exp.labSlug;
    const status = exp.status || 'Guide Only';

    return (
        <Link 
            href={`/lab/${labSlug}/experiment/${exp.id}`} 
            className={styles.resultCard}
        >
            <div className={styles.resultCardHeader}>
                <span className={styles.resultExpNumber}>{displayId}</span>
                <span className={`${styles.resultStatusTag} ${getStatusClass(status)}`}>
                    {status}
                </span>
            </div>
            <h3 className={styles.resultExpTitle}>{exp.name || exp.title}</h3>
            
            {/* Conditional Lab Badge for multi-lab lists (homepage/dashboard) */}
            {exp.labName && (
                <div className={styles.resultLabBadge}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    {exp.labName}
                </div>
            )}
        </Link>
    );
}

