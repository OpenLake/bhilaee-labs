'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './PlatformGuideModal.module.css';

const CATEGORIES = [
    {
        id: 'getting-around',
        num: '1',
        title: 'Getting Around',
        description: 'Learn how to find labs, search for experiments, and navigate the platform.',
        icon: '🧭',
        steps: [
            'Master Lab Index',
            'Cross-lab search',
            'Sticky sidebar navigation',
            'Experiment Prev / Next',
            'Lab Prev / Next'
        ],
        purpose: 'Find labs and move through experiments.'
    },
    {
        id: 'running-experiments',
        num: '2',
        title: 'Running Experiments',
        description: 'Master the core experimental workflow from simulation to data analysis.',
        icon: '🔬',
        steps: [
            'Launch circuit simulator',
            'Fill observation tables',
            'Auto-save observations',
            'Generate charts',
            'Apply measurement variation'
        ],
        purpose: 'Actually complete the experiment.'
    },
    {
        id: 'study-tools',
        num: '3',
        title: 'Study Tools',
        description: 'Explore the theoretical resources and visualization tools available.',
        icon: '📚',
        steps: [
            'Glossary tooltips',
            'Glossary search page',
            'Flashcard mode',
            'Circuit diagram gallery',
            'Zoomable diagrams'
        ],
        purpose: 'Understand and revise concepts.'
    },
    {
        id: 'personal-workspace',
        num: '4',
        title: 'Personal Workspace',
        description: 'Organize your progress, history, and favorite experiments.',
        icon: '👤',
        steps: [
            'Star experiments',
            'Recently viewed',
            'Saved observations',
            'Pinned labs',
            'Dashboard overview'
        ],
        purpose: 'Manage personal activity.'
    },
    {
        id: 'export-utilities',
        num: '5',
        title: 'Export & Utilities',
        description: 'Output your results and provide feedback to help us improve.',
        icon: '📤',
        steps: [
            'Print to PDF',
            'Print section selection',
            'Feedback system',
            'Emoji reactions'
        ],
        purpose: 'Output and communication.'
    }
];

export default function PlatformGuideModal({ isOpen, onClose }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [highlights, setHighlights] = useState([]); // Support multiple spotlights
    const [cardStyle, setCardStyle] = useState({ opacity: 0 });

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setActiveCategory(null);
                setActiveStep(0);
            }, 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Handle element highlighting and adaptive scrolling
    useEffect(() => {
        if (activeCategory) {
            const step = activeCategory.steps[activeStep];
            const selectors = step.selectors || (step.selector ? [step.selector] : []);
            
            if (selectors.length > 0) {
                const elements = selectors.map(s => document.querySelector(s)).filter(Boolean);
                
                if (elements.length > 0) {
                if (step.title.includes('Navigation')) {
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                } else {
                    elements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                    
                    const updateHighlight = () => {
                        const newHighlights = elements.map(el => {
                            const rect = el.getBoundingClientRect();
                            return {
                                top: rect.top - 15,
                                left: rect.left - 15,
                                width: rect.width + 30,
                                height: rect.height + 30,
                                borderRadius: '12px'
                            };
                        });
                        setHighlights(newHighlights);

                        const compositeRect = elements.reduce((acc, el) => {
                            const r = el.getBoundingClientRect();
                            return {
                                left: Math.min(acc.left, r.left),
                                right: Math.max(acc.right, r.right),
                                top: Math.min(acc.top, r.top),
                                bottom: Math.max(acc.bottom, r.bottom)
                            };
                        }, { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity });

                        // Correctly calculate transient dimensions for the composite area
                        compositeRect.width = compositeRect.right - compositeRect.left;
                        compositeRect.height = compositeRect.bottom - compositeRect.top;

                        let cardTop, cardLeft;
                        const cardWidth = 320;
                        const cardHeight = 220;

                        // Detection: If highlighting a huge element (like the grid)
                        if (compositeRect.height > window.innerHeight * 0.6) {
                            // Place at a fixed "safe" top center
                            cardTop = 40;
                            cardLeft = (window.innerWidth / 2) - (cardWidth / 2);
                        }
                        // Detection: If highlighting a sidebar (left-aligned)
                        else if (compositeRect.left < 100 && compositeRect.width < 400) {
                            cardTop = Math.max(40, compositeRect.top + (compositeRect.height / 2) - (cardHeight / 2));
                            cardLeft = compositeRect.right + 40;
                        } 
                        // Detection: If highlighting navigation buttons (far apart)
                        else if (elements.length > 1 && compositeRect.width > 500) {
                            // Vertically and horizontally center in the gap, shifted up for taskbar clearance
                            cardTop = Math.max(40, (compositeRect.top + (compositeRect.height / 2) - (cardHeight / 2)) - 100);
                            cardLeft = compositeRect.left + (compositeRect.width / 2) - (cardWidth / 2);
                        }
                        // Default: Above or below the highlight
                        else {
                            cardTop = compositeRect.top + compositeRect.height + 40 > window.innerHeight - cardHeight
                                ? Math.max(40, compositeRect.top - cardHeight - 40)
                                : compositeRect.top + compositeRect.height + 40;
                            cardLeft = Math.max(20, Math.min(window.innerWidth - cardWidth - 20, compositeRect.left + (compositeRect.width / 2) - (cardWidth / 2)));
                        }

                        if (!isNaN(cardTop) && !isNaN(cardLeft)) {
                            setCardStyle({
                                top: cardTop,
                                left: cardLeft
                            });
                        }
                    };

                    const timer = setTimeout(updateHighlight, 1500);
                    const handleScroll = () => updateHighlight();
                    window.addEventListener('scroll', handleScroll, true);
                    window.addEventListener('resize', updateHighlight);
                    
                    return () => {
                        clearTimeout(timer);
                        window.removeEventListener('scroll', handleScroll, true);
                        window.removeEventListener('resize', updateHighlight);
                    };
                } else if (step.url && pathname !== step.url) {
                    setHighlights([]); 
                    router.push(step.url);
                } else {
                    setHighlights([]); 
                    const retryTimer = setTimeout(() => setActiveStep(prev => prev), 500);
                    return () => clearTimeout(retryTimer);
                }
            }
        } else {
            setHighlights([]);
            setCardStyle({ opacity: 0 });
        }
    }, [activeCategory, activeStep, pathname, router]);

    if (!isOpen && !isVisible) return null;

    const handleStartCategory = (cat) => {
        const interactiveSteps = {
            'getting-around': [
                {
                    title: 'Master Lab Index',
                    selector: '.labs-grid',
                    url: '/',
                    text: 'This is the heart of Bhilai EE Labs. All course labs are organized here. Pro tip: Pinned labs always stay at the top for quick access!'
                },
                {
                    title: 'Cross-lab search',
                    selector: 'input[placeholder*="Search experiments"]',
                    url: '/',
                    text: 'Need to find a specific experiment fast? This global search looks across all labs and experiments instantly.'
                },
                {
                    title: 'Sticky Sidebar',
                    selector: '[class*="sidebar"]', // Target the sidebar container
                    url: '/lab/digital-electronics/experiment/2',
                    text: 'Inside experiments, use this sticky sidebar to jump between sections like Theory, Procedure, or Observations instantly!'
                },
                {
                    title: 'Experiment Navigation',
                    selectors: ['[class*="experimentNav"] [class*="navLinkPrev"]', '[class*="experimentNav"] [class*="navLinkNext"]'],
                    url: '/lab/digital-electronics/experiment/2',
                    text: 'Finished your work? Use these shortcuts at the bottom to move forward through the experiment sequence.'
                },
                {
                    title: 'Lab Navigation',
                    selectors: ['[class*="labNav"] [class*="navLinkPrev"]', '[class*="labNav"] [class*="navLinkNext"]'],
                    url: '/lab/digital-electronics',
                    text: 'Switching courses? These buttons at the bottom of lab pages let you move between different course labs seamlessly.'
                }
            ]
        };

        const steps = interactiveSteps[cat.id] || [];
        if (steps.length > 0) {
            setActiveCategory({ ...cat, steps });
            setActiveStep(0);
            
            // Auto-navigate to first step's URL if needed
            if (steps[0].url && pathname !== steps[0].url) {
                router.push(steps[0].url);
            }
        }
    };

    const handleNext = () => {
        if (activeStep < activeCategory.steps.length - 1) {
            const nextStep = activeCategory.steps[activeStep + 1];
            setActiveStep(activeStep + 1);
            
            // Navigate if next step is on a different page
            if (nextStep.url && pathname !== nextStep.url) {
                router.push(nextStep.url);
            }
        } else {
            setActiveCategory(null);
            onClose();
        }
    };

    return (
        <div className={`${styles.overlay} ${isOpen ? styles.active : ''} ${activeCategory ? styles.interactiveMode : ''}`} onClick={onClose}>
            {activeCategory ? (
                /* INTERACTIVE STEP OVERLAY */
                <div className={styles.interactiveOverlay} onClick={(e) => e.stopPropagation()}>
                    <svg className={styles.svgOverlay}>
                        <defs>
                            <mask id="guide-mask">
                                <rect width="100%" height="100%" fill="white" />
                                {highlights.map((style, idx) => (
                                    <rect 
                                        key={`hole-${idx}`}
                                        x={style.left} 
                                        y={style.top} 
                                        width={style.width} 
                                        height={style.height} 
                                        rx="25"
                                        ry="25"
                                        fill="black"
                                        style={{ transition: 'all 1.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                                    />
                                ))}
                            </mask>
                        </defs>
                        <rect width="100%" height="100%" className={styles.maskBackground} mask="url(#guide-mask)" />
                        {highlights.map((style, idx) => (
                            <rect 
                                key={`border-${idx}`}
                                x={style.left} 
                                y={style.top} 
                                width={style.width} 
                                height={style.height} 
                                rx="25"
                                ry="25"
                                className={styles.highlightBorder}
                            />
                        ))}
                    </svg>
                    
                    {highlights.length > 0 && isVisible && (
                        <div className={styles.instructionCard} style={cardStyle}>
                            <div className={styles.stepHeader}>
                                <span className={styles.stepTitle}>{activeCategory.steps[activeStep].title}</span>
                                <span className={styles.stepProgress}>{activeStep + 1} / {activeCategory.steps.length}</span>
                            </div>
                            <p className={styles.stepText}>{activeCategory.steps[activeStep].text}</p>
                            <div className={styles.stepActions}>
                                <button className={styles.skipBtn} onClick={() => setActiveCategory(null)}>Exit Guide</button>
                                <button className={styles.nextBtn} onClick={handleNext}>
                                    {activeStep === activeCategory.steps.length - 1 ? 'Finish' : 'Next Step'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* CATEGORY SELECTION HUB */
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                    
                    <header className={styles.header}>
                        <h1 className={styles.title}>Welcome to Bhilai EE Labs</h1>
                        <p className={styles.subtitle}>
                            Explore different parts of the platform.
                        </p>
                    </header>

                    <div className={styles.categoryGrid}>
                        {CATEGORIES.map((cat) => (
                            <div key={cat.id} className={styles.categoryCard}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.catNum}>{cat.num}</span>
                                    <span className={styles.catIcon}>{cat.icon}</span>
                                </div>
                                <h2 className={styles.catTitle}>{cat.title}</h2>
                                <p className={styles.catDescription}>{cat.description}</p>
                                
                                <div className={styles.catMeta}>
                                    <span className={styles.purposeLabel}>Goal:</span>
                                    <span className={styles.purposeText}>{cat.purpose}</span>
                                </div>

                                <button className={styles.startBtn} onClick={() => handleStartCategory(cat)}>
                                    Explore Steps
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <footer className={styles.footer}>
                        <p>Pro Tip: Following the guide in numerical order provides the best learning experience.</p>
                    </footer>
                </div>
            )}
        </div>
    );
}
