const fs = require('fs');
let code = fs.readFileSync('src/components/DoctorDashboard.tsx', 'utf8');

const target = `<span className={\\\`px-3 py-1 rounded-full text-xs font-bold capitalize \\\${`;
code = code.replace(/\\`/g, '`').replace(/\\\$/g, '$');

fs.writeFileSync('src/components/DoctorDashboard.tsx', code);
