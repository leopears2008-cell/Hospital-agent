const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      const unsubscribe = auth.onAuthStateChanged(async (user) => {
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
      });`;

const replacement = `      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          // Temporarily set while fetching real role
          setCurrentUser({
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            role: 'patient'
          });
          try {
            const token = await user.getIdToken();
            const res = await fetch('/api/auth/sync', {
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
            const data = await res.json();
            if (data.user && data.user.role) {
              setCurrentUser({
                id: user.uid,
                name: user.displayName || user.email?.split('@')[0] || 'User',
                email: user.email || '',
                role: data.user.role,
                doctorId: data.user.doctorId
              });
            }
          } catch (err) {
            console.error("Failed to sync user with database:", err);
          }
        } else {
          setCurrentUser(null);
        }
        setLoadingAuth(false);
      });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
