const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Remove the endpoints
code = code.replace(/app\.post\("\/api\/auth\/sync"[\s\S]*?\}\);/, '');
code = code.replace(/app\.post\("\/api\/appointments"[\s\S]*?\}\);/, '');
code = code.replace(/app\.get\("\/api\/appointments"[\s\S]*?\}\);/, '');
code = code.replace(/app\.get\("\/api\/doctor\/appointments"[\s\S]*?\}\);/, '');
code = code.replace(/app\.put\("\/api\/appointments\/:id\/status"[\s\S]*?\}\);/, '');
code = code.replace(/app\.put\("\/api\/appointments\/:id\/cancel"[\s\S]*?\}\);/, '');

fs.writeFileSync('server.ts', code);
