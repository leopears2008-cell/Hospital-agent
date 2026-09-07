const fs = require('fs');
let content = fs.readFileSync('src/PatientApp.tsx', 'utf8');

content = content.replace(/onOpenAppointments=\{\(\) => setIsAppointmentsModalOpen\(true\)\}\n\s*onEmergency=\{\(\) => setIsEmergencyModalOpen\(true\)\}\n\s*\/>\n\s*<main/g, 
  `onOpenAppointments={() => setIsAppointmentsModalOpen(true)}
      />
      <main`);

fs.writeFileSync('src/PatientApp.tsx', content);
