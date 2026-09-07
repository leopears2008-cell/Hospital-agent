const fs = require('fs');

let content = fs.readFileSync('src/AdminApp.tsx', 'utf8');

content = content.replace(/return \(\) => \{ unsubscribeLogs\(\); \}/, 'return () => { if (unsubscribeLogs) unsubscribeLogs(); }');
// The original was likely an unsubscribe returned from onSnapshot. Wait, no, it was `unsubscribeLogs` which isn't defined?
// Let's look closely at what onSnapshot returns.
content = content.replace(/const unsubscribeLogs = onSnapshot/, 'let unsubscribeLogs = onSnapshot');
if (!content.includes('let unsubscribeLogs')) {
   content = content.replace(/onSnapshot\(/, 'const unsubscribeLogs = onSnapshot(');
}

fs.writeFileSync('src/AdminApp.tsx', content);
