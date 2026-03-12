import styles from './LabComponents.module.css';
import ExperimentCard from './ExperimentCard';

export default function ExperimentList({ experiments, labSlug, labName, labCode }) {
    return (
        <section className={styles.grid}>
            {experiments.map((exp) => (
                <ExperimentCard 
                    key={exp.id} 
                    exp={{ ...exp, labId: labSlug, labName, labCode }} 
                />
            ))}
        </section>
    );
}
