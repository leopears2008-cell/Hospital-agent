const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

if (!code.includes("import { db } from '../lib/firebase';")) {
  code = code.replace(
    "import { auth } from '../lib/firebase';",
    "import { auth, db } from '../lib/firebase';\nimport { collection, query, where, getDocs } from 'firebase/firestore';"
  );
}
fs.writeFileSync('src/components/Dashboard.tsx', code);
