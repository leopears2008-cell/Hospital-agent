const fs = require('fs');
let content = fs.readFileSync('src/components/AppointmentModal.tsx', 'utf8');

content = content.replace("import { MOCK_DOCTORS } from '../data/doctors';", "");
content = content.replace("export function AppointmentModal({", 
`export function AppointmentModal({`);

content = content.replace("const [loading, setLoading] = useState(false);", 
`const [loading, setLoading] = useState(false);
  const [MOCK_DOCTORS, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    if(isOpen) {
      fetch('/api/doctors').then(res => res.json()).then(setDoctors).catch(console.error);
    }
  }, [isOpen]);
`);

// Make sure to import useEffect
if (!content.includes("useEffect")) {
  content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
}

fs.writeFileSync('src/components/AppointmentModal.tsx', content);
