'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './BhilaeeHub.module.css';

/* ============================================
   Zone Configuration
   ============================================ */
const ZONES = [
    {
        id: 'labs',
        name: 'Labs',
        desc: 'Explore course experiments',
        icon: '⚡',
        className: styles.zoneLabs,
        directLink: '/',
        items: [
            { label: 'All Course Labs', icon: '🧪', href: '/' },
        ],
    },
    {
        id: 'workspace',
        name: 'Workspace',
        desc: 'Your personal lab desk',
        icon: '📂',
        className: styles.zoneWorkspace,
        items: [
            { label: 'Note Readings', icon: '📝', href: '/readings' },
            { label: 'Saved Observations', icon: '📊', href: '/observations' },
            { label: 'Starred Experiments', icon: '⭐', href: '/starred' },
            { label: 'Recently Viewed', icon: '🕒', href: '/history' },
        ],
    },
    {
        id: 'resources',
        name: 'Resources',
        desc: 'Reference material & tools',
        icon: '📚',
        className: styles.zoneResources,
        items: [
            { label: 'Circuit Diagram Gallery', icon: '🖼️', href: '/gallery' },
            { label: 'Viva & Glossary Prep', icon: '🧠', href: '/glossary' },
            { label: 'Formula Sheet', icon: '📐', href: null, comingSoon: true },
        ],
    },
    {
        id: 'classroom',
        name: 'Classroom',
        desc: 'Collaborative learning',
        icon: '🏫',
        className: styles.zoneClassroom,
        items: [
            { label: 'Classroom Features', icon: '📋', href: null, comingSoon: true },
        ],
    },
    {
        id: 'support',
        name: 'Support',
        desc: 'Help & platform guide',
        icon: '💬',
        className: styles.zoneSupport,
        items: [
            { label: 'Support Hub', icon: '🛟', href: '/support' },
            { label: 'Platform Guide', icon: '🔭', href: null, action: 'openGuide' },
        ],
    },
    {
        id: 'account',
        name: 'Account',
        desc: 'Settings & profile',
        icon: '👤',
        className: styles.zoneAccount,
        items: [], // dynamically populated based on auth
    },
];

/* ============================================
   Detect active zone from pathname
   ============================================ */
function getActiveZone(pathname) {
    if (pathname.startsWith('/lab') || pathname === '/') return 'labs';
    if (pathname.startsWith('/observations') || pathname.startsWith('/starred') || pathname.startsWith('/history') || pathname.startsWith('/readings')) return 'workspace';
    if (pathname.startsWith('/gallery') || pathname.startsWith('/glossary')) return 'resources';
    if (pathname.startsWith('/support')) return 'support';
    if (pathname.startsWith('/preferences') || pathname.startsWith('/login')) return 'account';
    return 'labs';
}

/* ============================================
   The Bhilaee Hub Component
   ============================================ */
export default function BhilaeeHub({ isOpen, onClose, onOpenGuide }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, profile, signOut } = useAuth();
    const overlayRef = useRef(null);

    const activeZone = getActiveZone(pathname);
    const activeZoneData = ZONES.find(z => z.id === activeZone);

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close overlay on navigation
    useEffect(() => {
        onClose();
    }, [pathname]);

    const handleItemClick = useCallback((item) => {
        if (item.comingSoon) return;
        if (item.action === 'openGuide') {
            onClose();
            onOpenGuide?.();
            return;
        }
        if (item.action === 'logout') {
            onClose();
            signOut?.().then(() => {
                router.push('/');
                router.refresh();
            });
            return;
        }
        if (item.href) {
            onClose();
            router.push(item.href);
        }
    }, [onOpenGuide, onClose, signOut, router]);

    // Build account items dynamically
    const getAccountItems = () => {
        const items = [
            { label: 'Preferences', icon: '⚙️', href: '/preferences' },
        ];
        if (user) {
            items.push({ label: 'Log Out', icon: '🚪', href: null, action: 'logout' });
        } else {
            items.push({ label: 'Log In / Sign Up', icon: '🔑', href: '/login' });
        }
        return items;
    };

    return (
        <>
            {/* Full-screen Command Center */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
                ref={overlayRef}
                role="dialog"
                aria-modal="true"
                aria-label="Bhilaee Hub"
            >
                <div
                    className={styles.overlayBackdrop}
                    onClick={onClose}
                />
                <div className={styles.commandCenter}>
                    {/* Header */}
                    <div className={styles.ccHeader}>
                        <div>
                            <div className={styles.ccTitle}>
                                {user ? `Hey, ${profile?.full_name || user.email.split('@')[0]}` : 'Bhilai EE Labs'}
                            </div>
                            <div className={styles.ccSubtitle}>Where do you want to go?</div>
                        </div>
                        <button
                            className={styles.ccClose}
                            onClick={onClose}
                            aria-label="Close Bhilaee Hub"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Zone Grid */}
                    <div className={styles.zoneGrid}>
                        {ZONES.map((zone) => {
                            const isActive = zone.id === activeZone;
                            const items = zone.id === 'account' ? getAccountItems() : zone.items;

                            return (
                                <div
                                    key={zone.id}
                                    className={`${styles.zoneCard} ${zone.className} ${isActive ? styles.active : ''}`}
                                >
                                    <span className={styles.zoneActiveDot} />

                                    {/* Zone Header */}
                                    <div className={styles.zoneCardHead}>
                                        <div className={styles.zoneIcon}>{zone.icon}</div>
                                        <div>
                                            <div className={styles.zoneName}>{zone.name}</div>
                                            <div className={styles.zoneDesc}>{zone.desc}</div>
                                        </div>
                                    </div>

                                    {/* Zone Items */}
                                    <div className={styles.zoneItems}>
                                        {items.map((item, i) => (
                                            item.comingSoon ? (
                                                <div key={i} className={styles.zoneItem} style={{ opacity: 0.45, cursor: 'default' }}>
                                                    <span className={styles.zoneItemIcon}>{item.icon}</span>
                                                    <span className={styles.zoneItemLabel}>{item.label}</span>
                                                    <span className={styles.comingSoon}>Soon</span>
                                                </div>
                                            ) : item.href ? (
                                                <Link
                                                    key={i}
                                                    href={item.href}
                                                    className={styles.zoneItem}
                                                    onClick={onClose}
                                                >
                                                    <span className={styles.zoneItemIcon}>{item.icon}</span>
                                                    <span className={styles.zoneItemLabel}>{item.label}</span>
                                                    <span className={styles.zoneItemArrow}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="9 18 15 12 9 6" />
                                                        </svg>
                                                    </span>
                                                </Link>
                                            ) : (
                                                <button
                                                    key={i}
                                                    className={styles.zoneItem}
                                                    onClick={() => handleItemClick(item)}
                                                >
                                                    <span className={styles.zoneItemIcon}>{item.icon}</span>
                                                    <span className={styles.zoneItemLabel}>{item.label}</span>
                                                    <span className={styles.zoneItemArrow}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="9 18 15 12 9 6" />
                                                        </svg>
                                                    </span>
                                                </button>
                                            )
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Keyboard shortcut hint */}
                    <div className={styles.shortcutHint}>
                        <span className={styles.kbdKey}>Ctrl</span>
                        <span>+</span>
                        <span className={styles.kbdKey}>K</span>
                        <span>to toggle anytime</span>
                    </div>
                </div>
            </div>
        </>
    );
}
