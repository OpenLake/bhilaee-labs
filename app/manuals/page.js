'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
        // Load data synchronously from registry
        let filteredData = registryManuals;
        if (selectedLab !== 'All Modules') {
            filteredData = registryManuals.filter(m => m.lab_category === selectedLab);
        }
        setManuals(filteredData);
        setLoading(false);
    }, [selectedLab, registryManuals]);

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
                        <button className={manualStyles.downloadAllBtn}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                            Download All
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading manuals...</div>
                ) : (
                    <div className={manualStyles.manualsGrid}>
                        {manuals.map((manual) => {
                            const isAvailable = manual.has_pdf;
                            return (
                                <Link 
                                    key={manual.id} 
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
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
