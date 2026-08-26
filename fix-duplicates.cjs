const fs = require('fs');

const file = 'src/data/tamilNaduHospitals.ts';
let content = fs.readFileSync(file, 'utf8');

// The file exports a const array like: export const TAMIL_NADU_HOSPITALS: Hospital[] = [ ... ];
// We can just use a regex to extract the JSON-like array if it's too hard, or we can just parse it as JS.
// Wait, it's a TS file with `export const TAMIL_NADU_HOSPITALS: Hospital[] = [` and `];` at the end.
// Let's use TS node to import and rewrite, or just simple text manipulation.
