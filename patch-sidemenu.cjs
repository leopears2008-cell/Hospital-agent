const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

code = code.replace(
  "if (onNavigate) onNavigate('admin');",
  "window.location.href = '/admin/dashboard';"
);

fs.writeFileSync('src/components/SideMenu.tsx', code);
