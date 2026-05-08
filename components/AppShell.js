'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import BhilaeeHub from './BhilaeeHub';
import PlatformGuideModal from './PlatformGuideModal';

// Zone config for the header button display
const ZONE_MAP = {
    labs: { icon: '⚡', name: 'Labs' },
    workspace: { icon: '📂', name: 'Workspace' },
    resources: { icon: '📚', name: 'Resources' },
    classroom: { icon: '🏫', name: 'Classroom' },
    support: { icon: '💬', name: 'Support' },
    account: { icon: '👤', name: 'Account' },
};

function getActiveZoneId(pathname) {
    if (pathname.startsWith('/lab') || pathname === '/') return 'labs';
    if (pathname.startsWith('/observations') || pathname.startsWith('/starred') || pathname.startsWith('/history') || pathname.startsWith('/readings')) return 'workspace';
    if (pathname.startsWith('/gallery') || pathname.startsWith('/glossary')) return 'resources';
    if (pathname.startsWith('/support')) return 'support';
    if (pathname.startsWith('/preferences') || pathname.startsWith('/login')) return 'account';
    return 'labs';
}

/**
 * AppShell — wraps the entire app providing the header, footer,
 * the Bhilaee Hub navigation, and shared state for the Platform Guide modal.
 */
export default function AppShell({ children }) {
    const pathname = usePathname();
    const [isHubOpen, setIsHubOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    const activeZoneId = getActiveZoneId(pathname);
    const activeZone = ZONE_MAP[activeZoneId];

    return (
        <div className="app-wrapper">
            <Header
                onOpenHub={() => setIsHubOpen(true)}
                activeZone={activeZone}
            />
            <main className="main-content">
                {children}
            </main>
            <Footer />
            <BhilaeeHub
                isOpen={isHubOpen}
                onClose={() => setIsHubOpen(false)}
                onOpenGuide={() => setIsGuideOpen(true)}
            />
            <PlatformGuideModal
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
            />
        </div>
    );
}
