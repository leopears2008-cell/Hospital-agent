const fs = require('fs');

let authCode = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');
authCode = authCode.replace('Join SylvanCare for premium healthcare management.', 'Join TN sevai for premium healthcare management.');
fs.writeFileSync('src/components/AuthModal.tsx', authCode);

let landingCode = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');
landingCode = landingCode.replace('<span className="text-2xl font-black text-slate-900 tracking-tight">Sylvan<span className="text-blue-700">Care</span></span>', '<span className="text-2xl font-black text-slate-900 tracking-tight">TN <span className="text-blue-700">sevai</span></span>');
landingCode = landingCode.replace('<span className="text-xl font-black text-white tracking-tight">SylvanCare</span>', '<span className="text-xl font-black text-white tracking-tight">TN sevai</span>');
landingCode = landingCode.replace('SylvanCare Platform.', 'TN sevai Platform.');
fs.writeFileSync('src/components/LandingPage.tsx', landingCode);

let metadataCode = fs.readFileSync('metadata.json', 'utf8');
metadataCode = metadataCode.replace('"name": "Leo AI Chat"', '"name": "TN sevai"');
fs.writeFileSync('metadata.json', metadataCode);
