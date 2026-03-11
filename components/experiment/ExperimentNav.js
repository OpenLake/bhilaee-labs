import Link from 'next/link';
import styles from './Experiment.module.css';

/**
 * Renders Previous and Next experiment navigation buttons.
 */
export default function ExperimentNav({ labId, prevExperiment, nextExperiment }) {
    if (!prevExperiment && !nextExperiment) return null;

    return (
        <nav className={styles.experimentNav} aria-label="Experiment Navigation">
            <div className={styles.navColumn}>
                {prevExperiment && (
                    <Link href={`/lab/${labId}/experiment/${prevExperiment.id}`} className={`${styles.navLink} ${styles.navLinkPrev}`}>
                        <span className={styles.navDirection}>← Previous Experiment</span>
                        <span className={styles.navTitle}>{prevExperiment.title}</span>
                    </Link>
                )}
            </div>
            
            <div className={`${styles.navColumn} ${styles.navColumnRight}`}>
                {nextExperiment && (
                    <Link href={`/lab/${labId}/experiment/${nextExperiment.id}`} className={`${styles.navLink} ${styles.navLinkNext}`}>
                        <span className={styles.navDirection}>Next Experiment →</span>
                        <span className={styles.navTitle}>{nextExperiment.title}</span>
                    </Link>
                )}
            </div>
        </nav>
    );
}
