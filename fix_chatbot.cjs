const fs = require('fs');
let content = fs.readFileSync('src/components/AIChatbot.tsx', 'utf8');

// Remove supabase import
content = content.replace(/import \{ supabase \} from '\.\.\/lib\/supabase';\n/, '');

// Remove auth checks
content = content.replace(/const firebaseUser = \(await supabase\.auth\.getSession\(\)\)\.data\.session\?\.user;/g, 'const firebaseUser = { uid: "mock-user" };');
content = content.replace(/const token = firebaseUser\n\s*\? await \(await supabase\.auth\.getSession\(\)\)\.data\.session\?\.access_token\n\s*: null;/g, "const token = 'mock-token';");

// Check if any other supabase remains
content = content.replace(/supabase\./g, '/*removed*/');
fs.writeFileSync('src/components/AIChatbot.tsx', content);
