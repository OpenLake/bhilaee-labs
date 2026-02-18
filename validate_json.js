const fs = require('fs');
const path = require('path');

const file1 = 'e:\\MyApp\\MyApp2\\data\\experiments\\digital-electronics\\exp-1.json';
const file2 = 'e:\\MyApp\\MyApp2\\data\\experiments\\digital-electronics\\exp-1.assets.json';

try {
    const content1 = fs.readFileSync(file1, 'utf8');
    JSON.parse(content1);
    console.log('exp-1.json is VALID');
} catch (e) {
    console.error('exp-1.json is INVALID:', e.message);
}

try {
    const content2 = fs.readFileSync(file2, 'utf8');
    JSON.parse(content2);
    console.log('exp-1.assets.json is VALID');
} catch (e) {
    console.error('exp-1.assets.json is INVALID:', e.message);
}
