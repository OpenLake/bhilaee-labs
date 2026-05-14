'use client';

import Link from 'next/link';
import HubSidebar from '@/components/HubSidebar';
import SpotlightCard from '@/components/SpotlightCard';
import styles from '../hub-layout.module.css';

export default function ResourcesPage() {
    const resources = [
        {
            title: "Circuit Diagram Gallery",
            description: "Browse experimental setups including Oscillators, Amplifiers, and more. Detailed schematics for every module.",
            icon: "account_tree",
            id: "diagrams",
            tags: ["Oscillators", "Amplifiers", "+12 more"],
            large: true,
            href: "/gallery"
        },
        {
            title: "Viva & Glossary Prep",
            description: "Master technical terminology and common viva questions for your practical examinations.",
            icon: "menu_book",
            id: "viva",
            action: "Start Review",
            href: "/glossary"
        },
        {
            title: "Available Simulations",
            description: "Explore interactive circuit simulations and visualizations powered by the OpenLake platform.",
            icon: "play_circle",
            id: "simulations",
            href: "https://simulator.bhilaee.openlake.in/gallery.html",
            isExternal: true
        },
        {
            title: "Experiment Manuals",
            description: "Download detailed laboratory manuals with step-by-step procedures and expected results.",
            icon: "description",
            id: "manuals",
            comingSoon: true,
            href: "#"
        },
        {
            title: "Formula Sheet",
            description: "Quick reference for EE laws. Currently in development for the next semester.",
            icon: "functions",
            id: "formulas",
            comingSoon: true,
            href: "#"
        }
    ];

    return (
        <div className={styles.pageWrapper}>
            <HubSidebar activeTab="resources" />

            <main className={styles.contentContainer}>
                <header className={styles.header}>
                    <nav className={styles.breadcrumb}>
                        <Link href="/" className={styles.breadcrumbLink}>Bhilaee Hub</Link>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
                        <span className={styles.breadcrumbActive}>Resources</span>
                    </nav>
                    <h1 className={styles.title}>Academic Resources</h1>
                    <p className={styles.description}>
                        Access comprehensive study materials, technical diagrams, and essential electrical engineering references to support your laboratory work.
                    </p>
                </header>

                <div className={styles.bentoGrid}>
                    {resources.map((item, idx) => {
                        const isExternal = item.isExternal;
                        const cardProps = isExternal 
                            ? { href: item.href, target: "_blank", rel: "noopener noreferrer", as: 'a' }
                            : { href: item.href, as: Link };

                        return (
                            <SpotlightCard 
                                key={item.id} 
                                {...cardProps}
                                className={`${styles.bentoCard} ${idx === 0 ? styles.span8 : styles.span4}`}
                                style={{ 
                                    opacity: item.comingSoon ? 0.6 : 1,
                                    cursor: item.comingSoon ? 'not-allowed' : 'pointer'
                                }}
                                onClick={(e) => item.comingSoon && e.preventDefault()}
                            >
                                {item.comingSoon && (
                                    <div style={{ 
                                        position: 'absolute', top: '1rem', right: '1rem', 
                                        background: 'var(--bg-secondary)', padding: '4px 12px', 
                                        borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' 
                                    }}>
                                        Coming Soon
                                    </div>
                                )}
                                <div className={styles.cardIconBox}>
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                </div>
                                <h3 className={styles.cardTitle}>{item.title}</h3>
                                <p className={styles.cardDescription}>{item.description}</p>
                                
                                {item.tags && (
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                                        {item.tags.map(tag => (
                                            <span key={tag} style={{ 
                                                background: 'var(--bg-secondary)', padding: '2px 10px', 
                                                borderRadius: '12px', fontSize: '0.7rem' 
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className={styles.cardFooter}>
                                    <span className={styles.footerText}>
                                        {item.comingSoon ? 'In development' : (isExternal ? 'Open Simulator' : (item.action || 'View Details'))}
                                    </span>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--secondary-color)' }}>
                                        {isExternal ? 'open_in_new' : 'arrow_forward'}
                                    </span>
                                </div>
                            </SpotlightCard>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
