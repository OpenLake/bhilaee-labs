'use client';

import Link from 'next/link';
import styles from './HubSidebar.module.css';

export default function WorkspaceSidebar({ activeTab }) {
    const sidebarItems = [
        { id: 'readings', label: 'Note Readings', icon: 'menu_book', href: '/readings' },
        { id: 'observations', label: 'Saved Observations', icon: 'table_chart', href: '/observations' },
        { id: 'starred', label: 'Starred Experiments', icon: 'star', href: '/starred' },
        { id: 'history', label: 'Recently Viewed', icon: 'history', href: '/history' },
    ];

    return (
        <aside className={styles.sidebar} style={{ position: 'fixed', left: 0, top: '65px', zIndex: 100 }}>
            <div className={styles.sidebarHeader}>
                <h2>Workspace</h2>
                <p>Personal Dashboard</p>
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
            
            {/* Back to Hub link at the bottom */}
            <div className={styles.navGroup} style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <Link href="/workspace" className={styles.navItem}>
                    <span className={`material-symbols-outlined ${styles.navIcon}`}>
                        arrow_back
                    </span>
                    Back to Workspace
                </Link>
            </div>
        </aside>
    );
}
