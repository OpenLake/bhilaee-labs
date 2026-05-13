'use client';

import styles from './LabComponents.module.css';
import ExperimentCard from './ExperimentCard';
import { HoverEffect } from './ui/card-hover-effect';

export default function ExperimentList({ experiments, labSlug, labName, labCode }) {
    return (
        <HoverEffect
            items={experiments}
            className={styles.grid}
            renderItem={(exp) => (
                <ExperimentCard 
                    exp={{ ...exp, labId: labSlug, labName, labCode }} 
                />
            )}
        />
    );
}
