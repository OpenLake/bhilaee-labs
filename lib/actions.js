'use server';

import { getExperiment } from '@/data/experiments';

/**
 * Server Action to fetch full experiment JSON payload.
 * Useful for Client Components that need original structure (e.g. table headers).
 * 
 * @param {string} slug - The lab slug (e.g. "sensor-lab")
 * @param {string} experimentId - The experiment ID (e.g. "exp-1")
 * @returns {object|null} The experiment data or null if not found
 */
export async function fetchExperimentData(slug, experimentId) {
    try {
        const experiment = await getExperiment(slug, experimentId);
        return experiment;
    } catch (error) {
        console.error(`fetchExperimentData failed for ${slug}/${experimentId}`, error);
        return null;
    }
}
