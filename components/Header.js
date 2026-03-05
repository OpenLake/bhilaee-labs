import Link from 'next/link';
import styles from './Header.module.css';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>⚡</span>
                    <span className={styles.logoText}>Bhilai EE Labs</span>
                </Link>
                <nav className={styles.nav}>
                    <ThemeToggle />
                    <span className={styles.badge}>Electrical Engineering</span>
                </nav>
            </div>
        </header>
    );
}
