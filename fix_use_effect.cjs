const fs = require('fs');
const files = [
  'src/PatientApp.tsx',
  'src/components/DoctorDirectory.tsx',
  'src/components/AppointmentModal.tsx',
  'src/components/UserAppointmentsModal.tsx',
  'src/components/EmergencyAlertsToggle.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('useEffect') && !content.includes('useEffect,')) {
    if (content.includes("import { useState }")) {
      content = content.replace("import { useState }", "import { useState, useEffect }");
    } else if (content.includes("import { useState,")) {
      content = content.replace("import { useState,", "import { useState, useEffect,");
    }
  }
  fs.writeFileSync(file, content);
});
