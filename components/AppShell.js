'use client';

import { useState } from 'react';
import CardNav from './CardNav';
import PlatformGuideModal from './PlatformGuideModal';

const ZONES = [
    {
        id: 'labs',
        name: 'Labs',
        icon: '⚡',
        items: [
            { label: 'All Course Labs', icon: '🧪', href: '/' },
        ],
    },
    {
        id: 'workspace',
        name: 'Workspace',
        icon: '📂',
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
        items: [
            { label: 'Circuit Diagram Gallery', icon: '🖼️', href: '/gallery' },
            { label: 'Viva & Glossary Prep', icon: '🧠', href: '/glossary' },
            { label: 'Formula Sheet', icon: '📐', href: null, comingSoon: true },
        ],
    },
    {
        id: 'classroom',
        name: 'Classroom',
        icon: '🏫',
        items: [
            { label: 'Classroom Features', icon: '📋', href: null, comingSoon: true },
        ],
    },
    {
        id: 'support',
        name: 'Support',
        icon: '💬',
        items: [
            { label: 'Support Hub', icon: '🛟', href: '/support' },
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

    return (
        <div className="app-wrapper">
            <CardNav 
                items={ZONES} 
                onOpenGuide={() => setIsGuideOpen(true)} 
            />
            <main className="main-content">
                {children}
            </main>
            <PlatformGuideModal
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
            />
        </div>
    );
}
