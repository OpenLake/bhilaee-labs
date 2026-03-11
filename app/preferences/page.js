import Head from 'next/head';
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
