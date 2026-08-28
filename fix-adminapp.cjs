const fs = require('fs');

let code = fs.readFileSync('src/AdminApp.tsx', 'utf8');

if (code.includes('navigate(\'/patient/login\')')) {
  code = code.replace(/navigate\('\/patient\/login'\)/g, 'window.location.href = \'/\'');
  fs.writeFileSync('src/AdminApp.tsx', code);
}
