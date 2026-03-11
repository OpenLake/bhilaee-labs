'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function UserProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.addEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className={styles.profileContainer} ref={menuRef}>
            <button 
                className={`${styles.profileBtn} ${isOpen ? styles.profileBtnOpen : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="User Profile Menu"
                aria-expanded={isOpen}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </button>

            {isOpen && (
                <div className={styles.dropdownMenu}>
                    {/* Placeholder links - no DB connection yet */}
                    <Link href="#" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
                        <span className={styles.menuIcon}>⭐</span>
                        Starred Experiments
                    </Link>
                    <Link href="#" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
                        <span className={styles.menuIcon}>🕒</span>
                        Recently Viewed
                    </Link>
                    
                    <div className={styles.divider}></div>
                    
                    <button className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
                        <svg className={styles.menuIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                            <polyline points="10 17 15 12 10 7"></polyline>
                            <line x1="15" y1="12" x2="3" y2="12"></line>
                        </svg>
                        Log In / Sign Up
                    </button>
                </div>
            )}
        </div>
    );
}
