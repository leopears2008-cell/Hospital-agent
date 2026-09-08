const fs = require('fs');

let content = fs.readFileSync('src/PatientApp.tsx', 'utf8');

// Import AuthModal
content = content.replace(/import \{ Navbar \} from '.\/components\/Navbar';/, "import { Navbar } from './components/Navbar';\nimport { AuthModal } from './components/AuthModal';");

// Add state
const oldState = `const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);`;
const newState = `const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);\n  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);`;
content = content.replace(oldState, newState);

// Update LandingPage usage
const oldLandingPage = `  if (!userId) {
    return (
      <>
        <LandingPage onOpenAuth={() => {}} />
      </>
    );
  }`;
  
const newLandingPage = `  if (!userId) {
    return (
      <>
        <LandingPage onOpenAuth={(mode) => setAuthModalMode(mode)} />
        <AuthModal 
          isOpen={authModalMode !== null} 
          onClose={() => setAuthModalMode(null)} 
          initialView={authModalMode || 'login'} 
        />
      </>
    );
  }`;
content = content.replace(oldLandingPage, newLandingPage);

// Update Navbar usage
const oldNavbar = `currentUser={currentUser}
        onOpenAuth={() => {}}`;
const newNavbar = `currentUser={currentUser}
        onOpenAuth={(mode) => setAuthModalMode(mode)}`;
content = content.replace(oldNavbar, newNavbar);

fs.writeFileSync('src/PatientApp.tsx', content);
