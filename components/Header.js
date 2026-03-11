import Link from 'next/link';
import styles from './Header.module.css';
import ThemeToggle from './ThemeToggle';
import UserProfileMenu from './UserProfileMenu';

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
                    <UserProfileMenu />
                    <span className={styles.badge}>Electrical Engineering</span>
                </nav>
            </div>
        </header>
    );
}
