'use client';

import Link from 'next/link';
import styles from './HubSidebar.module.css';

export default function HubSidebar({ activeTab }) {
    const sidebarItems = [
        { id: 'labs', label: 'Labs', icon: 'science', href: '/' },
        { id: 'workspace', label: 'Workspace', icon: 'space_dashboard', href: '/workspace' },
        { id: 'resources', label: 'Resources', icon: 'library_books', href: '/resources' },
        { id: 'classroom', label: 'Classroom', icon: 'school', href: '/classroom' },
        { id: 'support', label: 'Support', icon: 'contact_support', href: '/support' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <h2>Bhilaee Hub</h2>
                <p>Academic Portal</p>
            </div>
            <div className={styles.navGroup}>
                {sidebarItems.map((item) => (
                    <Link 
                        key={item.id} 
                        href={item.href} 
                        className={`${styles.navItem} ${activeTab === item.id ? styles.activeNavItem : ''}`}
                    >
                        <span className={`material-symbols-outlined ${styles.navIcon}`}>
                            {item.icon}
                        </span>
                        {item.label}
                    </Link>
                ))}
            </div>
        </aside>
    );
}
