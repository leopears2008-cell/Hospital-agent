const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `import { AdminDashboard } from './components/AdminDashboard';`,
  `import { AdminDashboard } from './components/AdminDashboard';\nimport { DoctorDashboard } from './components/DoctorDashboard';`
);

code = code.replace(
  `const [viewMode, setViewMode] = useState<'dashboard' | 'split' | 'map' | 'list' | 'doctors' | 'admin'>('dashboard');`,
  `const [viewMode, setViewMode] = useState<'dashboard' | 'split' | 'map' | 'list' | 'doctors' | 'admin' | 'doctorDashboard'>('dashboard');`
);

const targetView = `{viewMode === 'admin' && currentUser?.role === 'admin' && (
          <AdminDashboard 
            appointments={[]} 
            hospitals={hospitals} 
          />
        )}`;

const replacementView = `{viewMode === 'admin' && currentUser?.role === 'admin' && (
          <AdminDashboard 
            appointments={[]} 
            hospitals={hospitals} 
          />
        )}
        {viewMode === 'doctorDashboard' && currentUser?.role === 'doctor' && (
          <DoctorDashboard currentUser={currentUser} />
        )}`;

code = code.replace(targetView, replacementView);

fs.writeFileSync('src/App.tsx', code);
