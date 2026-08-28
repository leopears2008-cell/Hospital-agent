const fs = require('fs');
let code = fs.readFileSync('src/components/AdminLogin.tsx', 'utf8');

code = code.replace(
  "      await signInWithEmailAndPassword(auth, email, password);\n      // For now, if login succeeds, we redirect. AdminApp will re-validate role from DB.\n      navigate('/admin/dashboard');",
  "      const credential = await signInWithEmailAndPassword(auth, email, password);\n      const userRef = doc(db, 'users', credential.user.uid);\n      const snap = await getDoc(userRef);\n      if (snap.exists() && snap.data().role === 'admin') {\n        navigate('/admin/dashboard');\n      } else {\n        await auth.signOut();\n        setError('Access denied. Administrator privileges required.');\n      }"
);

fs.writeFileSync('src/components/AdminLogin.tsx', code);
