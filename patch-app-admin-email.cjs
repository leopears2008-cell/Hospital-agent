const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Strict render condition
code = code.replace(
  "{viewMode === 'admin' && currentUser?.role === 'admin' && (",
  "{viewMode === 'admin' && currentUser?.email === 'leopears2008@gmail.com' && ("
);

// 2. Strict viewMode setting
code = code.replace(
  "if (role === 'admin') setViewMode('admin');",
  "if (role === 'admin' && email === 'leopears2008@gmail.com') setViewMode('admin');"
);

fs.writeFileSync('src/App.tsx', code);
