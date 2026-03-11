import Head from 'next/head';
import Link from 'next/link';
import PreferencesClient from './PreferencesClient';
import styles from './Preferences.module.css';

export const metadata = {
    title: 'Preferences & Settings | Bhilai EE Labs',
    description: 'Manage your profile, print preferences, and application settings.',
};

export default function PreferencesPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link href="/" style={{ color: 'var(--secondary-color)', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            Back to Home
                        </Link>
                    </div>
                    <h1 className={styles.title}>⚙️ Preferences & Settings</h1>
                    <p className={styles.subtitle}>
                        Customize your experience, configure print settings, and manage your local data.
                    </p>
                </div>
            </header>

            <main className={styles.main}>
                <PreferencesClient />
            </main>
        </div>
    );
}
