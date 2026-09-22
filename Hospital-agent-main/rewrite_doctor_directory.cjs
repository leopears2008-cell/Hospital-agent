const fs = require('fs');

let content = fs.readFileSync('src/components/DoctorDirectory.tsx', 'utf8');

// Remove static imports
content = content.replace("import { MOCK_DOCTORS } from '../data/doctors';", "");
content = content.replace("import { TAMIL_NADU_HOSPITALS } from '../data/tamilNaduHospitals';", "");

content = content.replace("export function DoctorDirectory() {", 
`export function DoctorDirectory() {
  const [MOCK_DOCTORS, setDoctors] = useState<Doctor[]>([]);
  const [TAMIL_NADU_HOSPITALS, setHospitals] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/doctors').then(res => res.json()).then(setDoctors).catch(console.error);
    fetch('/api/hospitals').then(res => res.json()).then(setHospitals).catch(console.error);
  }, []);
`);

content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");

fs.writeFileSync('src/components/DoctorDirectory.tsx', content);
