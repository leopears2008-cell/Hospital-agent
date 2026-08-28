const fs = require('fs');
let code = fs.readFileSync('/app/applet/src/PatientApp.tsx', 'utf8');

if (!code.includes('import DocumentSearch')) {
  code = code.replace("import NotFound from './components/NotFound';", "import NotFound from './components/NotFound';\nimport DocumentSearch from './components/DocumentSearch';");
  
  const renderSearch = `
        {viewMode === 'search' && (
          <div className="w-full h-full p-4 md:p-6 bg-slate-100 overflow-hidden">
             <div className="max-w-4xl mx-auto h-full">
               <DocumentSearch hospitals={hospitals} />
             </div>
          </div>
        )}
  `;
  
  code = code.replace("{viewMode === '404'", renderSearch.trim() + "\n        {viewMode === '404'");
  
  fs.writeFileSync('/app/applet/src/PatientApp.tsx', code);
  console.log("Patched PatientApp.tsx");
} else {
  console.log("Already patched");
}
