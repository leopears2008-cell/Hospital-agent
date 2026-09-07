const fs = require('fs');
let content = fs.readFileSync('src/PatientApp.tsx', 'utf8');

content = content.replace(/<Dashboard \n\s*hospitals=\{allHospitals\} \n\s*onNavigate=\{\(mode\) => setViewMode\(mode as any\)\} \n\s*currentUser=\{currentUser\}\n\s*\/>/g, 
  `<Dashboard 
            hospitals={allHospitals} 
            onOpenNavigation={(mode) => setViewMode(mode as any)} 
            currentUser={currentUser}
            onOpenAi={() => setIsAiModalOpen(true)}
            onOpenAppointments={() => setIsAppointmentsModalOpen(true)}
          />`);

fs.writeFileSync('src/PatientApp.tsx', content);
