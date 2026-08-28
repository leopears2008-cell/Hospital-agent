const fs = require('fs');
let code = fs.readFileSync('src/PatientApp.tsx', 'utf8');

// Add settings import
code = code.replace(
  "import { db, auth } from './lib/firebase';",
  "import { db, auth } from './lib/firebase';\nimport { doc, onSnapshot } from 'firebase/firestore';"
);

// Add features state
const featuresState = `  const [features, setFeatures] = useState({
    aiAssistant: true,
    onlineConsultation: true,
    patientRegistration: true
  });
  
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'features'), (doc) => {
      if (doc.exists()) {
        setFeatures(doc.data() as any);
      }
    });
    return () => unsub();
  }, []);`;

code = code.replace(
  "const [hospitals] = useState<Hospital[]>(TAMIL_NADU_HOSPITALS);",
  "const [hospitals] = useState<Hospital[]>(TAMIL_NADU_HOSPITALS);\n" + featuresState
);

// Block AI assistant opening if disabled
code = code.replace(
  "onOpenAiAssistant={() => setIsAiModalOpen(true)}",
  "onOpenAiAssistant={() => { if(features.aiAssistant) setIsAiModalOpen(true); else alert('AI Assistant is currently disabled.'); }}"
);
code = code.replace(
  "onOpenAi={() => setIsAiModalOpen(true)}",
  "onOpenAi={() => { if(features.aiAssistant) setIsAiModalOpen(true); else alert('AI Assistant is currently disabled.'); }}"
);

// Block Auth modal mode if registration disabled
code = code.replace(
  "onOpenAuth={(mode) => setAuthModalMode(mode)}",
  "onOpenAuth={(mode) => { if(mode === 'signup' && !features.patientRegistration) { alert('Patient registration is disabled by the administrator.'); return; } setAuthModalMode(mode); }}"
);

fs.writeFileSync('src/PatientApp.tsx', code);
