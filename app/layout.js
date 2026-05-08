import './globals.css';
import 'katex/dist/katex.min.css';
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from '@/context/AuthContext';
import ThemeHandler from '@/components/ThemeHandler';
import AppShell from '@/components/AppShell';

export const metadata = {
    title: 'Bhilai EE Labs',
    description: 'Electrical Engineering Lab Guide',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
            </head>
            <body suppressHydrationWarning>
                <AuthProvider>
                    <ThemeHandler />
                    <AppShell>
                        {children}
                    </AppShell>
                    <Analytics />
                </AuthProvider>
            </body>
        </html>
    );
}
