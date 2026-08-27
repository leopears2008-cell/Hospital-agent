const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            if (data.user && data.user.role) {
              setCurrentUser({
                id: user.uid,
                name: user.displayName || user.email?.split('@')[0] || 'User',
                email: user.email || '',
                role: data.user.role,
                doctorId: data.user.doctorId
              });
            }`;

const replacement = `            if (data.user && data.user.role) {
              setCurrentUser({
                id: user.uid,
                name: user.displayName || user.email?.split('@')[0] || 'User',
                email: user.email || '',
                role: data.user.role,
                doctorId: data.user.doctorId
              });
              if (data.user.role === 'admin') setViewMode('admin');
              else if (data.user.role === 'doctor') setViewMode('doctorDashboard');
            }`;

code = code.replace(target, replacement);

fs.writeFileSync('src/App.tsx', code);
