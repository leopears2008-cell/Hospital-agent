const fs = require('fs');
let code = fs.readFileSync('src/components/PatientLogin.tsx', 'utf8');

if (!code.includes("useEffect")) {
  code = code.replace(
    "import { useNavigate } from 'react-router-dom';",
    "import { useNavigate } from 'react-router-dom';\nimport { useEffect } from 'react';\nimport { auth } from '../lib/firebase';"
  );
  
  code = code.replace(
    "export default function PatientLogin() {\n  const navigate = useNavigate();",
    "export default function PatientLogin() {\n  const navigate = useNavigate();\n  useEffect(() => {\n    const unsub = auth.onAuthStateChanged((user) => {\n      if (user) navigate('/');\n    });\n    return () => unsub();\n  }, [navigate]);"
  );
  
  fs.writeFileSync('src/components/PatientLogin.tsx', code);
}

let code2 = fs.readFileSync('src/components/AdminLogin.tsx', 'utf8');

if (!code2.includes("useEffect")) {
  code2 = code2.replace(
    "import { useState, FormEvent } from 'react';",
    "import { useState, FormEvent, useEffect } from 'react';"
  );
  
  code2 = code2.replace(
    "export default function AdminLogin() {\n  const navigate = useNavigate();",
    "export default function AdminLogin() {\n  const navigate = useNavigate();\n  useEffect(() => {\n    const unsub = auth.onAuthStateChanged((user) => {\n      if (user) navigate('/admin/dashboard');\n    });\n    return () => unsub();\n  }, [navigate]);"
  );
  
  fs.writeFileSync('src/components/AdminLogin.tsx', code2);
}
