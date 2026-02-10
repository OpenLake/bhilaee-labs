/**
 * Enforces the fixed section order for all experiments.
 * These keys map to the data structure in lab data files.
 */
export const EXPERIMENT_SECTIONS = {
    AIM: 'aim',
    APPARATUS: 'apparatus',
    THEORY: 'theory',
    PRE_LAB: 'preLab',
    PROCEDURE: 'procedure',
    SIMULATION: 'simulation',
    OBSERVATION: 'observation',
    CALCULATION: 'calculation',
    RESULT: 'result',
    CONCLUSION: 'conclusion',
    POST_LAB: 'postLab', // [NEW] Viva, Assignments
    RESOURCES: 'resources' // [NEW] PDFs, Manuals
};

/**
 * Human-readable titles for sections.
 */
export const SECTION_TITLES = {
    [EXPERIMENT_SECTIONS.AIM]: 'Aim',
    [EXPERIMENT_SECTIONS.APPARATUS]: 'Apparatus & Software',
    [EXPERIMENT_SECTIONS.THEORY]: 'Theory',
    [EXPERIMENT_SECTIONS.PRE_LAB]: 'Pre-Lab / Circuit Diagram',
    [EXPERIMENT_SECTIONS.PROCEDURE]: 'Procedure',
    [EXPERIMENT_SECTIONS.SIMULATION]: 'Simulation / Execution',
    [EXPERIMENT_SECTIONS.OBSERVATION]: 'Observations',
    [EXPERIMENT_SECTIONS.CALCULATION]: 'Calculations',
    [EXPERIMENT_SECTIONS.RESULT]: 'Results & Analysis',
    [EXPERIMENT_SECTIONS.CONCLUSION]: 'Conclusion',
    [EXPERIMENT_SECTIONS.POST_LAB]: 'Post-Lab / Viva Voce',
    [EXPERIMENT_SECTIONS.RESOURCES]: 'References & Resources'
};

/**
 * Ordered array of section keys to ensure consistent rendering.
 */
export const SECTION_ORDER = [
    EXPERIMENT_SECTIONS.AIM,
    EXPERIMENT_SECTIONS.APPARATUS,
    EXPERIMENT_SECTIONS.THEORY,
    EXPERIMENT_SECTIONS.PRE_LAB,
    EXPERIMENT_SECTIONS.PROCEDURE,
    EXPERIMENT_SECTIONS.SIMULATION,
    EXPERIMENT_SECTIONS.OBSERVATION,
    EXPERIMENT_SECTIONS.CALCULATION,
    EXPERIMENT_SECTIONS.RESULT,
    EXPERIMENT_SECTIONS.CONCLUSION,
    EXPERIMENT_SECTIONS.POST_LAB,
    EXPERIMENT_SECTIONS.RESOURCES
];

/**
 * Allowed content block types for rich content rendering.
 */
export const CONTENT_TYPES = {
    TEXT: 'text',
    LIST: 'list',
    IMAGE: 'image',
    TABLE: 'table',
    CODE: 'code',
    EQUATION: 'equation'
};

/**
 * [NEW] Metadata Enums for Standardization
 */
export const EXPERIMENT_TYPE = {
    HARDWARE: 'hardware',
    SIMULATION: 'simulation',
    CODE: 'code'
};

export const STATUS = {
    GUIDE_ONLY: 'guide-only',
    SIMULATION_ONLY: 'simulation-only',
    GUIDE_SIMULATION: 'guide+simulation'
};

export const DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
};

export const CONTENT_STATE = {
    SKELETON: 'skeleton',
    PARTIAL: 'partial',
    COMPLETE: 'complete'
};

export const REVIEW_STATUS = {
    UNREVIEWED: 'unreviewed',
    REVIEWED: 'reviewed',
    APPROVED: 'approved'
};

/**
 * Factory function to create a blank experiment structure.
 * Ensures strict adherence to the schema.
 * @param {string} id - Unique experiment alphanumeric ID (e.g. 'exp-1')
 * @param {string} title - Human readable title
 */
export function createExperiment(id, title) {
    const experiment = {
        id,
        title,
        status: STATUS.GUIDE_ONLY, // Deprecated legacy field, mapped to meta.status in UI

        // [NEW] Top-level Metadata Object
        meta: {
            experimentType: EXPERIMENT_TYPE.HARDWARE, // Default
            status: STATUS.GUIDE_ONLY,
            difficulty: DIFFICULTY.MEDIUM,
            estimatedTimeMinutes: null,
            version: '1.0.0',
            contentState: CONTENT_STATE.SKELETON,
            reviewStatus: REVIEW_STATUS.UNREVIEWED
        },

        sections: {}
    };

    // Initialize all sections with default empty state
    SECTION_ORDER.forEach(sectionKey => {
        experiment.sections[sectionKey] = {
            id: sectionKey,
            title: SECTION_TITLES[sectionKey],
            isApplicable: true, // Default to true, explicit opt-out
            content: [] // Array of ContentBlocks
        };

        // Add specific fields for simulation
        if (sectionKey === EXPERIMENT_SECTIONS.SIMULATION) {
            experiment.sections[sectionKey].route = null; // Optional external link
        }
    });

    return experiment;
}
