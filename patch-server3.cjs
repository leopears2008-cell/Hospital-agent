const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /  let matchedDoctors = MOCK_DOCTORS\.filter.*?INSTRUCTIONS.*?`;\n\}\n/s;
code = code.replace(regex, '');

fs.writeFileSync('server.ts', code);
