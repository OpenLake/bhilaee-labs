import fs from 'fs';
import path from 'path';

let cachedGlossary = null;

/**
 * Loads glossary.json and returns a Map of term → definition.
 * Only includes entries that have a non-empty definition.
 * Results are cached after first call.
 */
export function getGlossary() {
    if (cachedGlossary) return cachedGlossary;

    const filePath = path.join(process.cwd(), 'data', 'glossary.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    const glossary = new Map();
    for (const [term, definition] of Object.entries(data)) {
        if (definition && definition.trim().length > 0) {
            glossary.set(term.toLowerCase(), definition.trim());
        }
    }

    cachedGlossary = glossary;
    return glossary;
}
