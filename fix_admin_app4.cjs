const fs = require('fs');

let content = fs.readFileSync('src/AdminApp.tsx', 'utf8');

content = content.replace(/const unsubscribe = const unsubscribeLogs = onSnapshot/, 'const unsubscribe = onSnapshot');
content = content.replace(/return \(\) => \{ if \(unsubscribeLogs\) unsubscribeLogs\(\); \}/, 'return () => { if (unsubscribe) unsubscribe(); }');

fs.writeFileSync('src/AdminApp.tsx', content);
