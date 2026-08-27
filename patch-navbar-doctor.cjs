const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const target = `{currentUser?.role === 'admin' && (
              <button
                onClick={() => setViewMode('admin')}
                className={\`px-3 py-1 text-xs font-medium rounded transition-all \${viewMode === 'admin' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-blue-600'}\`}
              >
                Admin
              </button>
            )}`;

const replacement = `{currentUser?.role === 'admin' && (
              <button
                onClick={() => setViewMode('admin')}
                className={\`px-3 py-1 text-xs font-medium rounded transition-all \${viewMode === 'admin' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-blue-600'}\`}
              >
                Admin Panel
              </button>
            )}
            {currentUser?.role === 'doctor' && (
              <button
                onClick={() => setViewMode('doctorDashboard')}
                className={\`px-3 py-1 text-xs font-medium rounded transition-all \${viewMode === 'doctorDashboard' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-blue-600'}\`}
              >
                Doctor Portal
              </button>
            )}`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/Navbar.tsx', code);
