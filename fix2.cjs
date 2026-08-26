const fs = require('fs');
let code = fs.readFileSync('src/OldApp.tsx', 'utf8');

const replacement = `  useEffect(() => {
    import('./lib/firebase').then(({ auth }) => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          setCurrentUser({
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            role: user.email === 'leopears2008@gmail.com' ? 'admin' : 'user'
          });
          try {
            const token = await user.getIdToken();
            await fetch('/api/auth/sync', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${token}\`
              },
              body: JSON.stringify({
                email: user.email,
                name: user.displayName || user.email?.split('@')[0] || 'User'
              })
            });
          } catch (err) {
            console.error("Failed to sync user with database:", err);
          }
        } else {
          setCurrentUser(null);
        }
        setLoadingAuth(false);
      });
      return () => unsubscribe();
    }).catch(err => {
      console.error("Failed to load firebase auth", err);
      setLoadingAuth(false);
    });
  }, []);`;

// Remove from `  useEffect(() => {` down to `  }, []);` and insert the new block.
const startIdx = code.indexOf("  useEffect(() => {\n    auth.onAuthStateChanged(");
if (startIdx !== -1) {
  const endIdx = code.indexOf("  }, []);", startIdx) + "  }, []);".length;
  code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
  fs.writeFileSync('src/OldApp.tsx', code);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Fixed!");
} else {
  console.log("Could not find start block");
}
