const fs = require('fs');
let content = fs.readFileSync('src/PatientApp.tsx', 'utf8');

content = content.replace(/\{viewMode === 'search' && \([\s\S]*?<\/div>\s*\n\s*\)}/, '');
fs.writeFileSync('src/PatientApp.tsx', content);
