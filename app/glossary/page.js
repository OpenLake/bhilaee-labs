import fs from 'fs';
import path from 'path';
import GlossaryClient from './GlossaryClient';
import { getAllExperiments } from '@/data/labs';

// This runs on the server to gather all terms
async function fetchAllGlossaryTerms() {
    const allExps = getAllExperiments();
    const terms = [];
    const termSet = new Set(); // Prevent exact duplicates across different lab references if any

    for (const exp of allExps) {
        try {
            const filePath = path.join(process.cwd(), 'data', 'experiments', `${exp.id}.json`);
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const expData = JSON.parse(fileContent);

                if (expData.glossary && Array.isArray(expData.glossary)) {
                    expData.glossary.forEach(item => {
                        // Create a unique key for the term+definition to avoid spamming the same common term
                        const uniqueKey = `${item.term.trim().toLowerCase()}-${item.definition.trim().toLowerCase()}`;
                        
                        if (!termSet.has(uniqueKey)) {
                            termSet.add(uniqueKey);
                            terms.push({
                                term: item.term.trim(),
                                definition: item.definition.trim(),
                                sourceExpId: exp.id,
                                sourceExpName: exp.name,
                                sourceLabId: expData.metadata?.courseCode || expData.id.split('-')[0] // EEL101 etc
                            });
                        }
                    });
                }
            }
        } catch (error) {
            console.error(`Error loading glossary data for ${exp.id}:`, error);
        }
    }

    return terms;
}

export default async function GlossaryRoute() {
    const terms = await fetchAllGlossaryTerms();
    
    return <GlossaryClient initialTerms={terms} />;
}
