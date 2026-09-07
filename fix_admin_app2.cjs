const fs = require('fs');

let content = fs.readFileSync('src/AdminApp.tsx', 'utf8');

content = content.replace(/return \(\) => \{ subscription\.unsubscribe\(\); \}/, 'return () => { subscription?.unsubscribe(); }');

fs.writeFileSync('src/AdminApp.tsx', content);
