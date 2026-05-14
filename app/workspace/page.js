'use client';

import Link from 'next/link';
import HubSidebar from '@/components/HubSidebar';
import styles from '../hub-layout.module.css';

export default function WorkspacePage() {
    const dashboardCards = [
        {
            title: "Note Readings",
            description: "Review theoretical frameworks, lecture materials, and preparatory documents for upcoming lab sessions.",
            icon: "menu_book",
            href: "/readings",
            id: "readings"
        },
        {
            title: "Saved Observations",
            description: "Access your logged data points, oscilloscope captures, and preliminary analytical results.",
            icon: "table_chart",
            href: "/observations",
            id: "observations"
        },
        {
            title: "Starred Experiments",
            description: "Quick access to pinned module setups, active circuit designs, and priority assignments.",
            icon: "star",
            fillIcon: true,
            href: "/starred",
            id: "starred"
        },
        {
            title: "Recently Viewed",
            description: "Pick up right where you left off. Review your most recently accessed schematics and logs.",
            icon: "history",
            href: "/history",
            id: "history"
        }
    ];

    return (
        <div className={styles.pageWrapper}>
            <HubSidebar activeTab="workspace" />

            <main className={styles.contentContainer}>
                {/* Workspace Header */}
                <header className={styles.header}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.title}>My Personal Workspace</h1>
                            <p className={styles.description}>
                                Your central command for engineering coursework. Access notes, review logged observations, and jump back into active experimental setups.
                            </p>
                        </div>
                        <div style={{ 
                            display: 'flex', alignItems: 'center', gap: '8px', 
                            background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                            padding: '8px 16px', borderRadius: '12px', fontSize: '0.9rem',
                            fontWeight: '600'
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cloud_done</span>
                            <span>Last Synced: Just now</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className={styles.bentoGrid}>
                    {dashboardCards.map((card) => (
                        <Link key={card.id} href={card.href} className={`${styles.bentoCard} ${styles.span6}`}>
                            <div className={styles.cardIconBox}>
                                <span 
                                    className="material-symbols-outlined" 
                                    style={{ 
                                        fontVariationSettings: card.fillIcon ? "'FILL' 1" : "'FILL' 0"
                                    }}
                                >
                                    {card.icon}
                                </span>
                            </div>
                            <h3 className={styles.cardTitle}>{card.title}</h3>
                            <p className={styles.cardDescription}>{card.description}</p>
                            
                            <div className={styles.cardFooter}>
                                <span className={styles.footerText}>Open Section</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
