const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (content.includes('auth.currentUser')) {
      content = content.replace(/auth\.currentUser/g, '(await supabase.auth.getSession()).data.session?.user');
      changed = true;
    }

    if (content.includes('auth.signOut()')) {
      content = content.replace(/auth\.signOut\(\)/g, 'supabase.auth.signOut()');
      changed = true;
    }
    
    if (content.includes('auth.onAuthStateChanged')) {
        content = content.replace(/auth\.onAuthStateChanged\(async \((user|firebaseUser)\) => \{/g, 'supabase.auth.onAuthStateChange(async (_event, session) => { const $1 = session?.user;');
        changed = true;
    }

    if (changed) {
      // Also ensure supabase is imported
      if (!content.includes("import { supabase } from")) {
         // Determine relative path to src/lib/supabase
         const depth = filePath.split(path.sep).length - 2;
         const prefix = depth > 0 ? '../'.repeat(depth) : './';
         content = `import { supabase } from '${prefix}lib/supabase';\n` + content;
      }
      // Remove unused auth import if needed (or just let linter handle it for now)
      fs.writeFileSync(filePath, content);
    }
  }
});
