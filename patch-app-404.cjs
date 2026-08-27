const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importTarget = `import { AdminDashboard } from './components/AdminDashboard';`;
const importReplacement = `import { AdminDashboard } from './components/AdminDashboard';
import { NotFound } from './components/NotFound';`;
code = code.replace(importTarget, importReplacement);

const stateTarget = `const [viewMode, setViewMode] = useState<'dashboard' | 'split' | 'map' | 'list' | 'doctors' | 'admin' | 'doctorDashboard'>('dashboard');`;
const stateReplacement = `const [viewMode, setViewMode] = useState<'dashboard' | 'split' | 'map' | 'list' | 'doctors' | 'admin' | 'doctorDashboard' | '404'>(window.location.pathname === '/' ? 'dashboard' : '404');

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/') setViewMode('dashboard');
      else setViewMode('404');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);`;
code = code.replace(stateTarget, stateReplacement);

const viewTarget = `{viewMode === 'doctorDashboard' && currentUser?.role === 'doctor' && (
          <DoctorDashboard currentUser={currentUser} />
        )}`;
const viewReplacement = `{viewMode === 'doctorDashboard' && currentUser?.role === 'doctor' && (
          <DoctorDashboard currentUser={currentUser} />
        )}
        {viewMode === '404' && (
          <NotFound onGoHome={() => setViewMode('dashboard')} />
        )}`;
code = code.replace(viewTarget, viewReplacement);

fs.writeFileSync('src/App.tsx', code);
