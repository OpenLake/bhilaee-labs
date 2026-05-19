'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import CardNav from './CardNav';
import Footer from './Footer';
import PlatformGuideModal from './PlatformGuideModal';

const ZONES = [
    {
        id: 'labs',
        name: 'Labs',
        icon: '⚡',
        href: '/',
        items: [
            { label: 'All Course Labs', icon: '🧪', href: '/' },
        ],
    },
    {
        id: 'workspace',
        name: 'Workspace',
        icon: '📂',
        href: '/workspace',
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
        icon: '📚',
        href: '/resources',
        items: [
            { label: 'Circuit Diagram Gallery', icon: '🖼️', href: '/gallery' },
            { label: 'Viva & Glossary Prep', icon: '🧠', href: '/glossary' },
            { label: 'Experiment Manuals', icon: '📄', href: '/manuals' },
            { label: 'Available Simulations', icon: '🎮', href: 'https://simulator.bhilaee.openlake.in/gallery.html', isExternal: true },
            { label: 'Formula Sheet', icon: '📐', href: null, comingSoon: true },
        ],
    },
    {
        id: 'classroom',
        name: 'Classroom',
        icon: '🏫',
        href: '/classroom',
        items: [
            { label: 'Classroom Features', icon: '📋', href: null, comingSoon: true },
        ],
    },
    {
        id: 'support',
        name: 'Support',
        icon: '💬',
        href: '/support',
        items: [
            { label: 'Support Hub', icon: '🛟', href: '/support/hub' },
            { label: 'Platform Guide', icon: '🔭', href: null, action: 'openGuide' },
        ],
    },
];

/**
 * AppShell — wraps the entire app providing the CardNav header, footer,
 * and shared state for the Platform Guide modal.
 */
export default function AppShell({ children }) {
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    // Listen for global guide triggers
    useEffect(() => {
        const handleOpenGuide = () => setIsGuideOpen(true);
        window.addEventListener('open-platform-guide', handleOpenGuide);
        return () => window.removeEventListener('open-platform-guide', handleOpenGuide);
    }, []);

    return (
        <div className="app-wrapper">
            {!isLoginPage && (
                <CardNav 
                    items={ZONES} 
                    onOpenGuide={() => setIsGuideOpen(true)} 
                />
            )}
            <main className={isLoginPage ? "main-content login-page-full" : "main-content"}>
                {children}
            </main>
            {!isLoginPage && <Footer />}
            <PlatformGuideModal
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
            />
        </div>
    );
}
