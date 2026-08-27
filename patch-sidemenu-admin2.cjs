const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

code = code.replace(
  "{(currentUser.role === 'admin' || currentUser.role === 'doctor') && (",
  "{(currentUser.email === 'leopears2008@gmail.com' || currentUser.role === 'doctor') && ("
);

fs.writeFileSync('src/components/SideMenu.tsx', code);
