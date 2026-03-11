import fs from 'fs/promises';
import path from 'path';
import { createExperiment } from './experiment_schema';
import registry from './experiments/registry.json';

/**
 * Data Access Layer for Experiments.
 * Reads from the static Registry and loads individual JSON files.
 */

/**
 * Retrieve experiment data by Lab ID and Experiment ID.
 * Returns null if not found in registry.
 * Returns skeleton structure if content file is missing.
 */
export async function getExperiment(labSlug, experimentId) {
    const labData = registry.labs[labSlug];
    if (!labData) return null;

    const experimentMeta = labData.experiments.find(e => e.id === experimentId);
    if (!experimentMeta) return null;

    // Default skeleton
    let experiment = createExperiment(experimentMeta.id, experimentMeta.title);
    experiment.labId = labSlug;
    experiment.status = experimentMeta.status;

    // Attach previous and next experiments for navigation
    const expIndex = labData.experiments.findIndex(e => e.id === experimentId);
    if (expIndex > 0) {
        experiment.prevExperiment = {
            id: labData.experiments[expIndex - 1].id,
            title: labData.experiments[expIndex - 1].title
        };
    }
    if (expIndex < labData.experiments.length - 1) {
        experiment.nextExperiment = {
            id: labData.experiments[expIndex + 1].id,
            title: labData.experiments[expIndex + 1].title
        };
    }

    // Try to load content file if available
    try {
        // Use fs instead of import() to avoid Webpack context issues with new files
        const contentPath = path.join(process.cwd(), 'data', 'experiments', labSlug, experimentMeta.fileName);

        // Check if file exists (optional, readFile throws anyway)
        const fileContent = await fs.readFile(contentPath, 'utf-8');
        const content = JSON.parse(fileContent);

        // Merge content into skeleton
        experiment = { ...experiment, ...content };

        // Try to load asset registry if available (sidecar file)
        try {
            // Assuming fileName is like 'exp-1.json', we want 'exp-1.assets.json'
            const assetFileName = experimentMeta.fileName.replace('.json', '.assets.json');
            const assetPath = path.join(process.cwd(), 'data', 'experiments', labSlug, assetFileName);

            const assetContent = await fs.readFile(assetPath, 'utf-8');
            const assets = JSON.parse(assetContent);

            experiment.assets = assets;
        } catch (assetError) {
            // No assets file found, ignore
        }

    } catch (error) {
        console.error(`ERROR loading content for ${labSlug}/${experimentId}:`, error);
        console.error(`Current working directory: ${process.cwd()}`);
        // Fallback to skeleton (already created)
    }

    return experiment;
}

/**
 * Helper to get all available experiment paths for static generation.
 * Returns array of { slug, experimentId }
 */
export function getAllExperimentPaths() {
    const paths = [];
    Object.keys(registry.labs).forEach(labSlug => {
        registry.labs[labSlug].experiments.forEach(exp => {
            paths.push({ slug: labSlug, experimentId: exp.id });
        });
    });
    return paths;
}
