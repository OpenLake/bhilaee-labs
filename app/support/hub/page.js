'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { submitSupportTicket } from '@/lib/db';
import HubSidebar from '@/components/HubSidebar';
import styles from '../Support.module.css';
import hubStyles from '../../hub-layout.module.css';

export default function SupportHubPage() {
    const { user } = useAuth();
    const [category, setCategory] = useState('simulation');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        const formData = new FormData(e.target);
        const ticketData = {
            userId: user?.id || null,
            category: category,
            severity: formData.get('severity'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            contextUrl: formData.get('contextUrl')
        };

        const { error } = await submitSupportTicket(ticketData);

        if (error) {
            setStatus({ type: 'error', message: 'Failed to submit ticket. Please try again later.' });
        } else {
            setStatus({ type: 'success', message: 'Your ticket has been submitted successfully! We will look into it.' });
            e.target.reset();
            setCategory('simulation');
        }
        setIsSubmitting(false);
    };

    return (
        <div className={hubStyles.pageWrapper}>
            <HubSidebar activeTab="support" />

            <main className={hubStyles.contentContainer} style={{ maxWidth: '1400px' }}>
                <header className={hubStyles.header}>
                    <nav className={hubStyles.breadcrumb}>
                        <Link href="/support" className={hubStyles.breadcrumbLink}>Support Center</Link>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
                        <span className={hubStyles.breadcrumbActive}>Support Hub</span>
                    </nav>
                    <h1 className={hubStyles.title} style={{ color: 'var(--primary-color)' }}>Submit a Ticket</h1>
                    <p className={hubStyles.description} style={{ color: 'var(--text-muted)' }}>
                        Report bugs, suggest features, or let us know if a simulation isn't working as expected.
                    </p>
                </header>

                <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        {status.message && (
                            <div className={`${styles.statusBanner} ${status.type === 'success' ? styles.success : styles.error}`} style={{ marginBottom: '2rem', borderRadius: '12px' }}>
                                {status.type === 'success' ? '✅' : '❌'} {status.message}
                            </div>
                        )}

                        <form className={styles.premiumForm} onSubmit={handleSubmit} data-tour="support-form" style={{ 
                            background: 'var(--card-bg)', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '24px', 
                            padding: '2.5rem',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                        }}>
                            
                            <div className={styles.formSectionBlock}>
                                <label className={styles.sectionLabel} style={{ color: 'var(--primary-color)', fontWeight: '700' }}>What kind of issue is this?</label>
                                <div className={styles.categoryGrid}>
                                    <label className={styles.categoryCard}>
                                        <input type="radio" name="category" value="simulation" checked={category === 'simulation'} onChange={() => setCategory('simulation')} />
                                        <div className={styles.cardContent}>
                                            <span className={styles.catIcon}>⚙️</span>
                                            <span className={styles.catText}>Simulation</span>
                                        </div>
                                    </label>
                                    <label className={styles.categoryCard}>
                                        <input type="radio" name="category" value="content_error" checked={category === 'content_error'} onChange={() => setCategory('content_error')} />
                                        <div className={styles.cardContent}>
                                            <span className={styles.catIcon}>📝</span>
                                            <span className={styles.catText}>Content/Typo</span>
                                        </div>
                                    </label>
                                    <label className={styles.categoryCard}>
                                        <input type="radio" name="category" value="ui_issue" checked={category === 'ui_issue'} onChange={() => setCategory('ui_issue')} />
                                        <div className={styles.cardContent}>
                                            <span className={styles.catIcon}>🐛</span>
                                            <span className={styles.catText}>Bug/UI</span>
                                        </div>
                                    </label>
                                    <label className={styles.categoryCard}>
                                        <input type="radio" name="category" value="feature_request" checked={category === 'feature_request'} onChange={() => setCategory('feature_request')} />
                                        <div className={styles.cardContent}>
                                            <span className={styles.catIcon}>💡</span>
                                            <span className={styles.catText}>Idea</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="subject" style={{ color: 'var(--text-color)' }}>Subject</label>
                                    <input type="text" id="subject" name="subject" placeholder="E.g., Graph not plotting in Exp 4" required suppressHydrationWarning />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="severity" style={{ color: 'var(--text-color)' }}>Severity</label>
                                    <div className={styles.selectWrapper}>
                                        <select id="severity" name="severity" required defaultValue="medium" style={{ background: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }} suppressHydrationWarning>
                                            <option value="low">Low (Minor typo)</option>
                                            <option value="medium">Medium (UI glitch)</option>
                                            <option value="high">High (Sim broken)</option>
                                            <option value="critical">Critical (Site down/Data loss)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="context-url" style={{ color: 'var(--text-color)' }}>Context URL <span className={styles.optionalTag}>Optional</span></label>
                                <div className={styles.urlInputWrapper} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                                    <span className={styles.urlPrefix} style={{ color: 'var(--text-muted)' }}>bhilaeelabs.in/</span>
                                    <input type="text" id="context-url" name="contextUrl" placeholder="lab/devices-and-circuits/experiment/4" style={{ background: 'transparent', color: 'var(--text-color)' }} suppressHydrationWarning />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="message" style={{ color: 'var(--text-color)' }}>Detailed Description</label>
                                <textarea id="message" name="message" rows="6" placeholder="What steps led to this issue? What did you expect to happen?" required style={{ background: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}></textarea>
                            </div>

                            <div className={styles.formFooter}>
                                <button type="submit" className={styles.submitBtn} disabled={isSubmitting} style={{ background: 'var(--secondary-color)', color: 'white' }}>
                                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                                    {!isSubmitting && (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <aside style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '100px' }}>
                        <div className={styles.utilityCard} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '2.5rem', borderRadius: '24px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--secondary-color)' }}>verified</span>
                                Before you submit
                            </h3>
                            <ul className={styles.checklist} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <li style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', color: 'var(--text-color)', lineHeight: '1.4' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#10b981' }}>check_circle</span>
                                    Check if the simulator type is correctly set.
                                </li>
                                <li style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', color: 'var(--text-color)', lineHeight: '1.4' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#10b981' }}>check_circle</span>
                                    Hard refresh (Ctrl+F5) the page.
                                </li>
                                <li style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', color: 'var(--text-color)', lineHeight: '1.4' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#10b981' }}>check_circle</span>
                                    Include the experiment URL if applicable.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.contactCard} style={{ background: 'var(--secondary-color)', color: 'white', padding: '2.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 8px 30px rgba(0, 99, 151, 0.2)' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-symbols-outlined">mail</span>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', opacity: 0.9, marginBottom: '4px' }}>Direct Email</h3>
                                <a href="mailto:support@bhilaeelabs.in" style={{ color: 'white', fontSize: '1.1rem', fontWeight: '800', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>support@bhilaeelabs.in</a>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
