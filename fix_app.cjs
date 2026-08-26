const fs = require('fs');
let code = fs.readFileSync('src/OldApp.tsx', 'utf8');

if (!code.includes("import { auth }")) {
  code = "import { auth } from './lib/firebase';\n" + code;
}
code = code.replace(/auth\.onAuthStateChanged\(async \(user\) => \{([\s\S]*?) \}\);\n\s*\}\);/g, "auth.onAuthStateChanged(async (user) => {$1 });");
fs.writeFileSync('src/OldApp.tsx', code);
fs.writeFileSync('src/App.tsx', code);
