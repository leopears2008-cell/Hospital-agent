const fs = require('fs');

let content = fs.readFileSync('src/PatientApp.tsx', 'utf8');

// Remove static imports
content = content.replace("import { TAMIL_NADU_HOSPITALS } from './data/tamilNaduHospitals';", "");

// Change useState initialization
content = content.replace("const [allHospitals] = useState<Hospital[]>(TAMIL_NADU_HOSPITALS);", "const [allHospitals, setAllHospitals] = useState<Hospital[]>([]);");
content = content.replace("const [hospitals] = useState<Hospital[]>(TAMIL_NADU_HOSPITALS);", "const [hospitals, setHospitals] = useState<Hospital[]>([]);");

// Add useEffect to fetch hospitals
const fetchHook = `
  useEffect(() => {
    fetch('/api/hospitals')
      .then(res => res.json())
      .then(data => {
        setAllHospitals(data);
        setHospitals(data);
      })
      .catch(err => console.error("Failed to load hospitals", err));
  }, []);
`;
content = content.replace("const [showAuthModal, setShowAuthModal] = useState(false);", "const [showAuthModal, setShowAuthModal] = useState(false);\n" + fetchHook);

fs.writeFileSync('src/PatientApp.tsx', content);
