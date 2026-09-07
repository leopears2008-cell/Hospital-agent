const fs = require('fs');
let content = fs.readFileSync('src/AdminApp.tsx', 'utf8');

// Remove supabase import
content = content.replace(/import \{ supabase \} from '\.\/lib\/supabase';\n/, '');

// Fix authorized state handling - we don't need to verify via supabase anymore
// Just set authorized immediately or let auth-guard handle it
content = content.replace(/const \[authorized, setAuthorized\] = useState\(false\);/, 'const [authorized, setAuthorized] = useState(true);');

// Remove the supabase.auth.onAuthStateChange block completely
content = content.replace(/useEffect\(\(\) => \{\n\s*const \{ data: \{ subscription \} \} = supabase\.auth\.onAuthStateChange\([\s\S]*?return \(\) => \{ subscription\?\.unsubscribe\(\); \}\n\s*\}, \[navigate, location\.pathname\]\);\n/g, '');

// Remove loading block
content = content.replace(/if \(loading\) \{\n\s*return <div className="w-screen h-screen flex items-center justify-center bg-slate-100">Verifying access\.\.\.<\/div>;\n\s*\}\n/g, '');

// Fix signOut function if it exists
content = content.replace(/await supabase\.auth\.signOut\(\);/g, "window.location.href = '/';");

fs.writeFileSync('src/AdminApp.tsx', content);
