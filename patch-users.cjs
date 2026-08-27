const fs = require('fs');
let code = fs.readFileSync('src/db/users.ts', 'utf8');

const target = `const role = email === 'leopears2008@gmail.com' ? 'admin' : 'patient';`;
const replacement = `const role = email === 'leopears2008@gmail.com' ? 'admin' : 
                   email.startsWith('dr.') || email === 'doctor@example.com' ? 'doctor' : 'patient';`;

code = code.replace(target, replacement);
fs.writeFileSync('src/db/users.ts', code);
