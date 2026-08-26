import fs from 'fs';

const file = 'src/data/tamilNaduHospitals.ts';
let content = fs.readFileSync(file, 'utf8');

// The file has export const TAMIL_NADU_HOSPITALS: Hospital[] = [ ... ];
// We will extract everything between the start and the end of the array, parse it using eval, deduplicate, and stringify.
// It might be easier to use a regex to remove the second block.
// Let's find where the second block starts. 
// "gh-ariyalur" at line 912.
