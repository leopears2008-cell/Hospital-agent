const fs = require('fs');
let code = fs.readFileSync('/app/applet/src/components/SideMenu.tsx', 'utf8');

if (!code.includes('Document Search')) {
  // Add FileSearch icon import
  if (!code.includes('FileSearch')) {
    code = code.replace(/import \{([^}]+)\} from 'lucide-react';/, "import {$1, FileSearch} from 'lucide-react';");
  }

  // Find the list of navigation items
  // <button onClick={() => { onNavigate('dashboard'); onClose(); }}
  // We can just add it before the Emergency map or somewhere in the list.
  
  const searchItem = `
          <button
            onClick={() => { onNavigate('search'); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors font-medium text-left"
          >
            <FileSearch className="w-5 h-5 text-slate-400" />
            Document Search
          </button>
`;

  code = code.replace(/(<button[^>]+>\s*<Search className="w-5 h-5 text-slate-400" \/>\s*Find Doctors\s*<\/button>)/, "$1" + searchItem);
  fs.writeFileSync('/app/applet/src/components/SideMenu.tsx', code);
  console.log("Patched SideMenu.tsx");
} else {
  console.log("Already patched");
}
