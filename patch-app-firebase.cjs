const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add Firestore imports
code = code.replace(
  "import { auth } from './lib/firebase';",
  "import { auth, db } from './lib/firebase';\nimport { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';"
);

const target = `            const token = await user.getIdToken();
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
              if (data.user.role === 'admin') setViewMode('admin');
              else if (data.user.role === 'doctor') setViewMode('doctorDashboard');
            }`;

const replacement = `            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);
            let role = 'patient';
            let doctorId = undefined;
            const name = user.displayName || user.email?.split('@')[0] || 'User';
            const email = user.email || '';

            if (!docSnap.exists()) {
              role = email === 'leopears2008@gmail.com' ? 'admin' :
                     (email.startsWith('dr.') || email === 'doctor@example.com') ? 'doctor' : 'patient';
              await setDoc(userRef, {
                uid: user.uid,
                email,
                name,
                role,
                createdAt: Date.now()
              });
            } else {
              const userData = docSnap.data();
              role = userData.role || 'patient';
              doctorId = userData.doctorId;
              await updateDoc(userRef, { email, name });
            }

            setCurrentUser({
              id: user.uid,
              name,
              email,
              role: role as any,
              doctorId
            });
            
            if (role === 'admin') setViewMode('admin');
            else if (role === 'doctor') setViewMode('doctorDashboard');`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
