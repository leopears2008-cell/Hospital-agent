const fs = require('fs');

let code1 = fs.readFileSync('src/components/PatientLogin.tsx', 'utf8');
code1 = code1.replace(
  "import { auth } from '../lib/firebase';",
  "import { auth, db } from '../lib/firebase';\nimport { doc, getDoc } from 'firebase/firestore';"
);
code1 = code1.replace(
  "const unsub = auth.onAuthStateChanged((user) => {\n      if (user) navigate('/');\n    });",
  "const unsub = auth.onAuthStateChanged(async (user) => {\n      if (user) {\n        try {\n          const userRef = doc(db, 'users', user.uid);\n          const snap = await getDoc(userRef);\n          if (snap.exists() && snap.data().role === 'admin') {\n            window.location.href = '/admin/dashboard';\n          } else {\n            navigate('/');\n          }\n        } catch (err) {\n          navigate('/');\n        }\n      }\n    });"
);
fs.writeFileSync('src/components/PatientLogin.tsx', code1);

let code2 = fs.readFileSync('src/components/AdminLogin.tsx', 'utf8');
code2 = code2.replace(
  "import { auth } from '../lib/firebase';",
  "import { auth, db } from '../lib/firebase';\nimport { doc, getDoc } from 'firebase/firestore';"
);
code2 = code2.replace(
  "const unsub = auth.onAuthStateChanged((user) => {\n      if (user) navigate('/admin/dashboard');\n    });",
  "const unsub = auth.onAuthStateChanged(async (user) => {\n      if (user) {\n        try {\n          const userRef = doc(db, 'users', user.uid);\n          const snap = await getDoc(userRef);\n          if (snap.exists() && snap.data().role === 'admin') {\n            navigate('/admin/dashboard');\n          } else {\n            navigate('/');\n          }\n        } catch (err) {\n          navigate('/');\n        }\n      }\n    });"
);
fs.writeFileSync('src/components/AdminLogin.tsx', code2);

