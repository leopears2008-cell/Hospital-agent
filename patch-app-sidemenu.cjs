const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />`;

const replacement = `<SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={(mode) => setViewMode(mode as any)}
      />`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
