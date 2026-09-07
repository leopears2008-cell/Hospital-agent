const fs = require('fs');

let content = fs.readFileSync('src/AdminApp.tsx', 'utf8');

content = content.replace(/return \(\) => \{ subscription\.unsubscribe\(\); \}/, 'return () => { unsubscribeLogs(); }');

fs.writeFileSync('src/AdminApp.tsx', content);
