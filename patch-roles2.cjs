const fs = require('fs');
let code = fs.readFileSync('src/PatientApp.tsx', 'utf8');

code = code.replace(
  /\{viewMode === 'admin' && currentUser\?.email === 'leopears2008@gmail\.com' && \([\s\S]*?<\/AdminDashboard>\s*\)\s*\}/,
  ""
);

fs.writeFileSync('src/PatientApp.tsx', code);
