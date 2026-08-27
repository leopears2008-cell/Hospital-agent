const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace('import { NotFound } from "./components/NotFound";\n', '');
appCode = appCode.replace('<NotFound onReturnHome={() => {', '<NotFound onGoHome={() => {');
fs.writeFileSync('src/App.tsx', appCode);

let navCode = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navCode = navCode.replace(
  `  viewMode: 'dashboard' | 'split' | 'map' | 'list' | 'doctors' | 'admin';
  setViewMode: (mode: 'dashboard' | 'split' | 'map' | 'list' | 'doctors' | 'admin') => void;`,
  `  viewMode: string;
  setViewMode: (mode: any) => void;`
);
fs.writeFileSync('src/components/Navbar.tsx', navCode);

