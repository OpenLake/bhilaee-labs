'use client';

import './globals.css';
import 'katex/dist/katex.min.css';
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeHandler from '@/components/ThemeHandler';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <ThemeHandler />
                    <div className="app-wrapper">
                        {!isHomePage && <Header />}
                        <main className="main-content">
                            {children}
                        </main>
                        {!isHomePage && <Footer />}
                    </div>
                </AuthProvider>
                <Analytics />
            </body>
        </html>
    );
}
