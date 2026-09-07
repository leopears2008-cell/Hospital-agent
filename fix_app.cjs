const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/<Route path="\/admin\/login" element=\{<AdminLogin \/>\} \/>\n\s*/, '');
content = content.replace(/import AdminLogin from '.\/components\/AdminLogin';\n/, '');
content = content.replace(/<Route path="\/patient\/login" element=\{<PatientLogin \/>\} \/>\n\s*/, '');
content = content.replace(/import PatientLogin from '.\/components\/PatientLogin';\n/, '');
fs.writeFileSync('src/App.tsx', content);
