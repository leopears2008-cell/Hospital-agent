const fs = require('fs');

// Fix PatientApp onEmergency
let content = fs.readFileSync('src/PatientApp.tsx', 'utf8');
content = content.replace(/onOpenAppointments=\{\(\) => setIsAppointmentsModalOpen\(true\)\}\n\s*\/>/g, 
  `onOpenAppointments={() => setIsAppointmentsModalOpen(true)}
            onEmergency={() => setIsEmergencyModalOpen(true)}
          />`);

// Remove AuthModal if it's still there
content = content.replace(/\{authModalMode && \([\s\S]*?AuthModal[\s\S]*?\}\s*\/>\n\s*\)\}/g, '');
fs.writeFileSync('src/PatientApp.tsx', content);

// Fix user email in UserAppointmentsModal
let userApptModal = fs.readFileSync('src/components/UserAppointmentsModal.tsx', 'utf8');
userApptModal = userApptModal.replace(/const firebaseUser = \{ id: "mock-user-123" \};/g, 'const firebaseUser = { id: "mock-user-123", email: "mock@example.com" };');
fs.writeFileSync('src/components/UserAppointmentsModal.tsx', userApptModal);

