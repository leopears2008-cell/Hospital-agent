const fs = require('fs');
let content = fs.readFileSync('src/PatientApp.tsx', 'utf8');

// Remove supabase imports if they exist
content = content.replace(/import \{ supabase \} from '\.\/lib\/supabase';\n/, '');

// Fix signOut function
content = content.replace(/await supabase\.auth\.signOut\(\);/g, "window.location.href = '/';");

// Remove AuthModal import and rendering
content = content.replace(/import AuthModal from '.\/components\/AuthModal';\n/, '');
content = content.replace(/\{authModalMode && \([\s\S]*?onOpenAuth=\{\(mode\) => setAuthModalMode\(mode\)\}\n\s*\/>\n\s*\)\}/g, '');
content = content.replace(/\{authModalMode && \([\s\S]*?<\/div>\s*\)\}/g, ''); // Alternative pattern if it exists

fs.writeFileSync('src/PatientApp.tsx', content);
