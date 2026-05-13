'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';
import ThemeToggle from './ThemeToggle';
import UserProfileMenu from './UserProfileMenu';
import './CardNav.css';

const CardNav = ({ items, onOpenGuide }) => {
  const pathname = usePathname();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  // Close menu on route change
  useEffect(() => {
    if (isExpanded) {
      toggleMenu();
    }
  }, [pathname]);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 65;

    const contentEl = navEl.querySelector('.card-nav-content');
    if (contentEl) {
      const wasVisible = contentEl.style.visibility;
      const wasPointerEvents = contentEl.style.pointerEvents;
      const wasPosition = contentEl.style.position;
      const wasHeight = contentEl.style.height;

      contentEl.style.visibility = 'visible';
      contentEl.style.pointerEvents = 'auto';
      contentEl.style.position = 'static';
      contentEl.style.height = 'auto';

      contentEl.offsetHeight; // trigger reflow

      const topBar = 65;
      const contentHeight = contentEl.scrollHeight;

      contentEl.style.visibility = wasVisible;
      contentEl.style.pointerEvents = wasPointerEvents;
      contentEl.style.position = wasPosition;
      contentEl.style.height = wasHeight;

      return topBar + contentHeight;
    }
    return 300; // fallback
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 65 });
    gsap.set(cardsRef.current, { y: 30, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease: 'power3.out'
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.05 }, '-=0.2');

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = i => el => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div className="card-nav-container">
      <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`}>
        
        {/* TOP BAR (Header) */}
        <div className="card-nav-top">
          <Link href="/" className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Bhilai EE Labs</span>
          </Link>

          <div className="nav-right" suppressHydrationWarning>
            <ThemeToggle />
            <UserProfileMenu />
            
            <div
              className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
              onClick={toggleMenu}
              role="button"
              aria-label={isExpanded ? 'Close menu' : 'Open menu'}
              tabIndex={0}
              suppressHydrationWarning
            >
              <div className="hamburger-line" />
              <div className="hamburger-line" />
            </div>
          </div>
        </div>

        {/* EXPANDABLE CONTENT */}
        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {items.map((zone, idx) => (
            <div
              key={zone.id}
              className="nav-card"
              ref={setCardRef(idx)}
            >
              <Link href={zone.href} className="nav-card-label">
                <span>{zone.icon}</span> {zone.name} <GoArrowUpRight className="nav-card-label-arrow" />
              </Link>
              <div className="nav-card-links">
                {zone.items.map((lnk, i) => {
                  if (lnk.comingSoon) {
                    return (
                      <span key={i} className="nav-card-link nav-card-coming-soon">
                        <span className="nav-card-link-icon">{lnk.icon}</span>
                        {lnk.label} (Soon)
                      </span>
                    );
                  }
                  
                  if (lnk.action === 'openGuide') {
                    return (
                      <button 
                        key={i} 
                        className="nav-card-link" 
                        onClick={() => {
                          toggleMenu();
                          onOpenGuide();
                        }}
                      >
                        <span className="nav-card-link-icon">{lnk.icon}</span>
                        {lnk.label}
                      </button>
                    );
                  }

                  return (
                    <Link key={i} href={lnk.href} className="nav-card-link">
                      <span className="nav-card-link-icon">{lnk.icon}</span>
                      {lnk.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
