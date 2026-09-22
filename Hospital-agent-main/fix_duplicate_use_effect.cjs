const fs = require('fs');
const files = [
  'src/PatientApp.tsx',
  'src/components/AppointmentModal.tsx',
  'src/components/DoctorDirectory.tsx',
  'src/components/EmergencyAlertsToggle.tsx',
  'src/components/UserAppointmentsModal.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import \{ useState, useEffect, useEffect \}/g, 'import { useState, useEffect }');
  content = content.replace(/import \{ useState, useEffect, useEffect,/g, 'import { useState, useEffect,');
  content = content.replace(/import \{ useState, useEffect, useEffect\}/g, 'import { useState, useEffect }');
  content = content.replace(/import \{ useEffect, useState, useEffect \}/g, 'import { useEffect, useState }');
  content = content.replace(/import \{ useEffect, useEffect/g, 'import { useEffect');
  
  // also fix AppointmentModal isOpen issue
  if (file.includes('AppointmentModal.tsx')) {
    // If it's missing from props, we might need to change isOpen to open
    // Let's check how the modal gets open state.
    // In Dialog, it's open={open}.
  }
  
  fs.writeFileSync(file, content);
});
