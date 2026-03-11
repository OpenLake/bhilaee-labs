'use client';

import { useEffect, useState } from 'react';

/**
 * A client component wrapper that reads the `printPreferences` from LocalStorage
 * and dynamically applies the `.noPrint` CSS class to the section if the user
 * has toggled that section off in their settings.
 */
export default function PrintSettingsWrapper({ sectionKey, className, children }) {
    const [printPrefs, setPrintPrefs] = useState({
        theory: true,
        apparatus: true,
        procedures: true,
        observations: true,
        calculations: true
    });

    useEffect(() => {
        // Initial load
        const loadPrefs = () => {
            const saved = localStorage.getItem('printPreferences');
            if (saved) {
                setPrintPrefs(JSON.parse(saved));
            }
        };
        
        loadPrefs();

        // Listen for updates from the Preferences page
        window.addEventListener('preferencesUpdated', loadPrefs);
        return () => window.removeEventListener('preferencesUpdated', loadPrefs);
    }, []);

    // Determine if this specific section should be hidden during print
    const shouldHidePrint = printPrefs[sectionKey] === false;
    
    // We add 'noPrint' utility class which is defined in Experiment.module.css
    return (
        <section 
            id={sectionKey} 
            className={`${className} ${shouldHidePrint ? 'noPrint' : ''}`}
        >
            {children}
        </section>
    );
}
