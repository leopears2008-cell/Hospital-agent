const fs = require('fs');
let code = fs.readFileSync('src/OldApp.tsx', 'utf8');

code = code.replace(/auth\.onAuthStateChanged\(async \(user\) => \{([\s\S]*?) \}\);\n\s*\}\);/g, "auth.onAuthStateChanged(async (user) => {$1 });");
fs.writeFileSync('src/OldApp.tsx', code);
