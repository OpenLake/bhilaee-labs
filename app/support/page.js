'use client';

import Link from 'next/link';
import HubSidebar from '@/components/HubSidebar';
import SpotlightCard from '@/components/SpotlightCard';
import FAQPalette from '@/components/FAQPalette';
import styles from '../hub-layout.module.css';

export default function SupportPage() {
    const handleOpenGuide = () => {
        window.dispatchEvent(new CustomEvent('open-platform-guide'));
    };

    const faqs = [
        { q: "How do I reset a simulation module?", a: "Navigate to the top toolbar of any active lab environment and click the 'Purge Data' icon to restore default parameters.", icon: "refresh" },
        { q: "Troubleshooting telemetry lag", a: "If live sensor data is lagging, ensure your connection supports WebSockets and try toggling the 'Low Bandwidth Mode' in Settings.", icon: "wifi_off" },
        { q: "Where are my auto-graded results?", a: "Results are processed chronologically. Check the 'Submissions' tab on the left navigation panel for detailed rubrics.", icon: "grading" },
        { q: "Adding custom components", a: "Only instructors can upload custom SPICE models. Students must use the approved components listed in the right-hand repository drawer.", icon: "extension" }
    ];

    return (
        <div className={styles.pageWrapper}>
            <HubSidebar activeTab="support" />

            <main className={styles.contentContainer}>
                {/* Hero Header - Theme Aware Background */}
                <header style={{ 
                    marginBottom: '3rem', 
                    borderRadius: '24px', 
                    background: 'var(--bg-secondary)', 
                    backgroundImage: 'linear-gradient(rgba(var(--secondary-color-rgb), 0.05), rgba(var(--secondary-color-rgb), 0.05)), url("https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80")', 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '3.5rem',
                    border: '1px solid var(--border-color)',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    {/* Overlay to ensure readability in both themes */}
                    <div style={{ 
                        position: 'absolute', inset: 0, 
                        background: 'var(--bg-secondary)', 
                        opacity: 0.85, zIndex: 1 
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 10, maxWidth: '750px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--secondary-color)', marginBottom: '1.25rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>support_agent</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Help Desk</span>
                        </div>
                        <h1 className={styles.title} style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', color: 'var(--primary-color)' }}>Support Center</h1>
                        <p className={styles.description} style={{ color: 'var(--text-color)', fontSize: '1.2rem', opacity: 0.9 }}>
                            Access technical assistance, report anomalies in your simulation environments, or explore comprehensive platform guides.
                        </p>
                    </div>
                </header>

                <div className={styles.bentoGrid}>
                    {/* Path 1: Support Hub */}
                    <SpotlightCard className={`${styles.bentoCard} ${styles.span5}`}>
                        <div style={{ 
                            position: 'absolute', top: '0', right: '0', 
                            padding: '24px', opacity: 0.05, pointerEvents: 'none' 
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '150px', color: 'var(--primary-color)' }}>engineering</span>
                        </div>
                        <div className={styles.cardIconBox}>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                        </div>
                        <h2 className={styles.cardTitle}>Support Hub</h2>
                        <p className={styles.cardDescription}>Submit a ticket or report an issue. Our engineering team is on standby to assist with hardware interfacing errors or calculation engine faults.</p>
                        
                        <Link href="/support/hub" style={{ textDecoration: 'none', marginTop: 'auto' }}>
                            <button style={{ 
                                width: '100%', 
                                background: 'linear-gradient(135deg, var(--secondary-color), #23005c)',
                                color: 'white', padding: '14px', borderRadius: '12px', border: 'none',
                                fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(0, 99, 151, 0.3)',
                                transition: 'transform 0.2s'
                            }}>
                                Open New Ticket
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                            </button>
                        </Link>
                    </SpotlightCard>

                    {/* Path 2: Platform Guide */}
                    <SpotlightCard className={`${styles.bentoCard} ${styles.span7}`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div className={styles.cardIconBox}>
                                <span className="material-symbols-outlined">menu_book</span>
                            </div>
                            <span style={{ 
                                background: 'var(--bg-secondary)', padding: '6px 14px', 
                                borderRadius: '20px', fontSize: '0.75rem', color: 'var(--text-muted)',
                                fontWeight: '600', border: '1px solid var(--border-color)'
                            }}>
                                v2.4 Documentation
                            </span>
                        </div>
                        <h2 className={styles.cardTitle}>Platform Guide</h2>
                        <p className={styles.cardDescription} style={{ maxWidth: '90%' }}>Interactive walkthrough of features. Master the oscilloscope modules, circuit mapping tools, and data export pipelines.</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '2rem' }}>
                            <a href="#" style={{ textDecoration: 'none' }}>
                                <div style={{ 
                                    padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                    display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem',
                                    fontWeight: '600', color: 'var(--text-color)', transition: 'all 0.2s',
                                    background: 'var(--bg-color)'
                                }}>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--secondary-color)', fontSize: '22px' }}>speed</span>
                                    Oscilloscope Basics
                                </div>
                            </a>
                            <a href="#" style={{ textDecoration: 'none' }}>
                                <div style={{ 
                                    padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                    display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem',
                                    fontWeight: '600', color: 'var(--text-color)', transition: 'all 0.2s',
                                    background: 'var(--bg-color)'
                                }}>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--secondary-color)', fontSize: '22px' }}>cable</span>
                                    Circuit Wiring Logic
                                </div>
                            </a>
                        </div>

                        <button 
                            onClick={handleOpenGuide}
                            style={{ 
                                width: 'fit-content', background: 'var(--bg-color)', 
                                border: '1px solid var(--border-color)', color: 'var(--secondary-color)',
                                padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s'
                            }}>
                            Launch Interactive Guide
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>explore</span>
                        </button>
                    </SpotlightCard>
                </div>

                {/* FAQ Section */}
                <section style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--secondary-color)', fontSize: '32px' }}>lightbulb</span>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: 'var(--primary-color)' }}>Quick Tips & FAQs</h3>
                    </div>
                    
                    <FAQPalette faqs={faqs} />
                    
                    <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                        Can't find what you're looking for? Hover over the quadrants to reveal detailed solutions.
                    </p>
                </section>
            </main>
        </div>
    );
}
