const fs = require('fs');
let content = fs.readFileSync('src/components/HospitalList.tsx', 'utf8');

content = content.replace("import { TAMIL_NADU_HOSPITALS } from '../data/tamilNaduHospitals';", "");

// The HospitalList receives hospitals as props anyway!
// "export function HospitalList({ hospitals }: { hospitals: Hospital[] }) {"
// It seems it was just importing it but not using it? Wait, let's check if it uses it.

fs.writeFileSync('src/components/HospitalList.tsx', content);
