const fs = require('fs');
let content = fs.readFileSync('src/components/EmergencyAlertsToggle.tsx', 'utf8');

content = content.replace("import { TAMIL_NADU_HOSPITALS } from '../data/tamilNaduHospitals';", "");

content = content.replace("export function EmergencyAlertsToggle() {", 
`export function EmergencyAlertsToggle() {
  const [TAMIL_NADU_HOSPITALS, setHospitals] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/hospitals').then(res => res.json()).then(setHospitals).catch(console.error);
  }, []);
`);

fs.writeFileSync('src/components/EmergencyAlertsToggle.tsx', content);
