'use client';

import Link from 'next/link';
import styles from './Header.module.css';
import ThemeToggle from './ThemeToggle';

export default function Header({ onOpenHub, activeZone }) {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>⚡</span>
                    <span className={styles.logoText}>Bhilai EE Labs</span>
                </Link>
                <nav className={styles.nav}>
                    <ThemeToggle />
                    <button
                        className={styles.hubBtn}
                        onClick={onOpenHub}
                        aria-label="Open Bhilaee Hub"
                        data-tour="bhilaee-hub"
                    >
                        <span className={styles.hubIcon}>{activeZone?.icon || '⚡'}</span>
                        <span className={styles.hubLabel}>{activeZone?.name || 'Menu'}</span>
                        <svg className={styles.hubChevron} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                </nav>
            </div>
        </header>
    );
}
