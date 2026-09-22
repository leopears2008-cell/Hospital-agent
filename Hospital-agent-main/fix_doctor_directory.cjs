const fs = require('fs');
let content = fs.readFileSync('src/components/DoctorDirectory.tsx', 'utf8');

const hook = `  const [MOCK_DOCTORS, setDoctors] = useState<Doctor[]>([]);
  const [TAMIL_NADU_HOSPITALS, setHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    fetch('/api/doctors').then(res => res.json()).then(setDoctors).catch(console.error);
    fetch('/api/hospitals').then(res => res.json()).then(setHospitals).catch(console.error);
  }, []);
`;

content = content.replace("export function DoctorDirectory({ currentUser, onOpenAuth }: DoctorDirectoryProps) {\n  const [searchQuery, setSearchQuery] = useState('');", 
`export function DoctorDirectory({ currentUser, onOpenAuth }: DoctorDirectoryProps) {
${hook}
  const [searchQuery, setSearchQuery] = useState('');`);

fs.writeFileSync('src/components/DoctorDirectory.tsx', content);
