'use client';

import Link from 'next/link';
import HubSidebar from '@/components/HubSidebar';
import SpotlightCard from '@/components/SpotlightCard';
import styles from '../hub-layout.module.css';

export default function ClassroomPage() {
    const categories = [
        {
            title: "My Classrooms",
            description: "Access your joined courses, live lab sessions, and collaborative study groups.",
            icon: "school",
            id: "courses",
            footer: "3 Active Courses",
            fillIcon: true
        },
        {
            title: "Pending Assignments",
            description: "View upcoming lab reports, technical drafts, and peer review deadlines.",
            icon: "pending_actions",
            id: "assignments",
            footer: "2 Due Soon",
            footerColor: "#ba1a1a",
            fillIcon: true
        },
        {
            title: "My Submissions",
            description: "Track your graded work, instructor feedback, and historical performance metrics.",
            icon: "inventory_2",
            id: "submissions",
            footer: "View History",
            fillIcon: true
        }
    ];

    const activity = [
        { id: 1, title: "New Lab Session Available", time: "2 hours ago", desc: "Prof. Sharma scheduled a new virtual session for 'Advanced Circuit Analysis'.", icon: "science" },
        { id: 2, title: "Assignment Graded", time: "Yesterday", desc: "Your submission for 'Lab Report 3: Oscilloscope Fundamentals' has been graded.", icon: "check_circle" }
    ];

    return (
        <div className={styles.pageWrapper}>
            <HubSidebar activeTab="classroom" />

            <main className={styles.contentContainer}>
                <header className={styles.header}>
                    <nav className={styles.breadcrumb}>
                        <Link href="/" className={styles.breadcrumbLink}>Bhilaee Hub</Link>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
                        <span className={styles.breadcrumbActive}>Classroom Hub</span>
                    </nav>
                    <h1 className={styles.title}>Classroom Hub</h1>
                    <p className={styles.description}>
                        Your central collaborative environment for electrical engineering courses, lab sessions, and academic progress tracking.
                    </p>
                </header>

                <div className={styles.bentoGrid}>
                    {categories.map((card) => (
                        <SpotlightCard 
                            key={card.id} 
                            as={Link} 
                            href={`/classroom/${card.id}`} 
                            className={`${styles.bentoCard} ${styles.span4}`}
                        >
                            <div className={styles.cardIconBox} style={card.footerColor ? { color: card.footerColor } : {}}>
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: card.fillIcon ? "'FILL' 1" : "'FILL' 0" }}>
                                    {card.icon}
                                </span>
                            </div>
                            <h3 className={styles.cardTitle}>{card.title}</h3>
                            <p className={styles.cardDescription}>{card.description}</p>
                            
                            <div className={styles.cardFooter}>
                                <span className={styles.footerText} style={{ color: card.footerColor }}>{card.footer}</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>

                <section style={{ marginTop: '4rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Recent Activity</h2>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
                        {activity.map((item, idx) => (
                            <div key={item.id} style={{ 
                                padding: '1.5rem', 
                                borderBottom: idx !== activity.length - 1 ? '1px solid var(--border-color)' : 'none',
                                display: 'flex',
                                gap: '1rem',
                                transition: 'background 0.2s',
                                cursor: 'pointer'
                            }}>
                                <div style={{ 
                                    width: '40px', height: '40px', borderRadius: '50%', 
                                    background: 'var(--bg-secondary)', display: 'flex', 
                                    alignItems: 'center', justifyContent: 'center' 
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{item.icon}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>{item.title}</h4>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.time}</span>
                                    </div>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
