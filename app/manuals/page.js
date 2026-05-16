'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import HubSidebar from '@/components/HubSidebar';
import styles from '../hub-layout.module.css';
import manualStyles from './Manuals.module.css';
import { supabase } from '@/lib/supabase';
import registry from '@/data/experiments/registry.json';
import { labs } from '@/data/labs';

export default function ManualsPage() {
    const [manuals, setManuals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLab, setSelectedLab] = useState('All Modules');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Animation states
    const [showFolder, setShowFolder] = useState(true);
    const [folderOpen, setFolderOpen] = useState(false);

    // Generate comprehensive manual data natively from the central registry
    // This bypasses the database completely so you don't have to run SQL scripts.
    const registryManuals = useMemo(() => {
        const allManuals = [];
        
        Object.keys(registry.labs).forEach(labKey => {
            const lab = registry.labs[labKey];
            const labCode = labs.find(l => l.id === labKey)?.code || 'N/A';
            
            // Format folder names for the Supabase Storage Bucket
            // "Control System Lab" -> "Control Lab"
            // "Basic Electrical Engineering" -> "Basic EE Lab"
            let folderName = lab.name;
            if (lab.name === "Control System Lab") folderName = "Control Lab";
            else if (lab.name === "Basic Electrical Engineering") folderName = "Basic EE Lab";
            else if (lab.name === "Digital Electronics") folderName = "Digital Lab";
            else if (lab.name === "Devices and Circuits") folderName = "Analog Lab";

            lab.experiments.forEach(exp => {
                // If you rename a file to something completely custom in your bucket, 
                // you can map it here. Use the format 'labSlug-expId': 'CustomName.pdf'
                const customOverrides = {
                    // 'control-system-lab-1': 'Exp_01_New.pdf',
                    // 'control-system-lab-2': 'Some_Other_Name.pdf'
                };

                const overrideName = customOverrides[`${labKey}-${exp.id}`];
                const fileName = overrideName ? overrideName : `Exp${exp.id}.pdf`;
                const filePath = `${folderName}/${fileName}`;

                allManuals.push({
                    id: `${labKey}-${exp.id}`,
                    title: exp.title,
                    lab_category: lab.name,
                    course_code: labCode,
                    experiment_number: `Exp ${exp.id.padStart(2, '0')}`,
                    file_path: filePath,
                    has_pdf: true // We assume ALL of them are active so you can click them!
                });
            });
        });
        
        return allManuals;
    }, []);

    const uniqueLabs = ['All Modules', ...Object.values(registry.labs).map(l => l.name)];

    useEffect(() => {
        setLoading(true);
        let filteredData = registryManuals;
        
        if (selectedLab !== 'All Modules') {
            filteredData = filteredData.filter(m => m.lab_category === selectedLab);
        }
        
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filteredData = filteredData.filter(m => 
                m.title.toLowerCase().includes(q) || 
                m.course_code.toLowerCase().includes(q) || 
                m.experiment_number.toLowerCase().includes(q)
            );
        }
        
        setManuals(filteredData);
        setLoading(false);
    }, [selectedLab, searchQuery, registryManuals]);

    // Handle cinematic intro animation
    useEffect(() => {
        // Wait a beat, then open folder
        const t1 = setTimeout(() => {
            setFolderOpen(true);
        }, 600);
        
        // After folder opens, hide it and let cards burst out
        const t2 = setTimeout(() => {
            setShowFolder(false);
        }, 1100);

        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const getPublicUrl = (path) => {
        if (!path) return "#";
        const { data } = supabase.storage.from('experiment-pdfs').getPublicUrl(path);
        // Append a timestamp query string to instantly bust the browser/CDN cache
        // This forces it to download the latest PDF you uploaded instead of the old cached one.
        return `${data.publicUrl}?t=${new Date().getTime()}`;
    };

    return (
        <div className={styles.pageWrapper}>
            <HubSidebar activeTab="resources" />

            <main className={styles.contentContainer}>
                <div className={manualStyles.controlsHeader}>
                    <header className={styles.header} style={{ marginBottom: 0 }}>
                        <nav className={styles.breadcrumb}>
                            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
                            <Link href="/resources" className={styles.breadcrumbLink}>Resources</Link>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
                            <span className={styles.breadcrumbActive}>Manuals</span>
                        </nav>
                        <h1 className={styles.title} style={{ marginTop: '0.5rem' }}>Experiment Manuals</h1>
                        <p className={styles.description}>
                            Access technical guides and safety protocols for laboratory experiments.
                        </p>
                    </header>

                    <div className={manualStyles.filters}>
                        <select 
                            className={manualStyles.selectDropdown}
                            value={selectedLab}
                            onChange={(e) => setSelectedLab(e.target.value)}
                        >
                            {uniqueLabs.map(lab => (
                                <option key={lab} value={lab}>{lab}</option>
                            ))}
                        </select>
                        
                        <div className={manualStyles.searchBox}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--text-muted)' }}>search</span>
                            <input 
                                type="text" 
                                placeholder="Search manuals..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading manuals...</div>
                ) : (
                    <>
                        <AnimatePresence mode="wait">
                            {showFolder && (
                                <motion.div
                                    key="folder-anim"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 2, filter: "blur(10px)" }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    style={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        height: '400px', 
                                        width: '100%' 
                                    }}
                                >
                                    <motion.span 
                                        className="material-symbols-outlined"
                                        animate={folderOpen ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] } : {}}
                                        transition={{ duration: 0.3 }}
                                        style={{ fontSize: '150px', color: 'var(--secondary-color)', textShadow: '0 0 40px rgba(var(--secondary-color-rgb), 0.3)' }}
                                    >
                                        {folderOpen ? 'folder_open' : 'folder'}
                                    </motion.span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!showFolder && (
                            <motion.div 
                                className={manualStyles.manualsGrid}
                                variants={{
                                    hidden: { opacity: 0 },
                                    show: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.04, delayChildren: 0.1 }
                                    }
                                }}
                                initial="hidden"
                                animate="show"
                            >
                                {manuals.map((manual) => {
                                    const isAvailable = manual.has_pdf;
                                    return (
                                        <motion.div 
                                            key={manual.id}
                                            variants={{
                                                hidden: { opacity: 0, scale: 0.2, y: 100 },
                                                show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
                                            }}
                                            style={{ display: 'block', height: '100%' }}
                                        >
                                            <Link 
                                                href={isAvailable ? getPublicUrl(manual.file_path) : '#'}
                                                target={isAvailable ? "_blank" : "_self"}
                                                rel="noopener noreferrer"
                                                className={`${manualStyles.manualCard} ${!isAvailable ? manualStyles.disabled : ''}`}
                                                onClick={(e) => !isAvailable && e.preventDefault()}
                                            >
                                                <div className={manualStyles.cardHeader}>
                                                    <div className={manualStyles.iconBox}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                                            {isAvailable ? 'picture_as_pdf' : 'description'}
                                                        </span>
                                                    </div>
                                                    <div className={manualStyles.headerRight}>
                                                        <div className={manualStyles.courseCode}>{manual.course_code}</div>
                                                        <div className={manualStyles.expNumber}>{manual.experiment_number}</div>
                                                    </div>
                                                </div>
                                                
                                                <h3 className={manualStyles.manualTitle} title={manual.title}>
                                                    {manual.title}
                                                </h3>
                                                
                                                <div className={manualStyles.cardFooter}>
                                                    <span>{isAvailable ? 'MANUAL VIEW' : 'UNAVAILABLE'}</span>
                                                    {isAvailable && (
                                                        <span className={`material-symbols-outlined ${manualStyles.arrow}`}>
                                                            arrow_forward
                                                        </span>
                                                    )}
                                                </div>
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
