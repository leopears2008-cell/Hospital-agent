const fs = require('fs');

// Fix PatientApp onNavigate
let content = fs.readFileSync('src/PatientApp.tsx', 'utf8');
content = content.replace(/onNavigateToDoctors=\{\(\) => setViewMode\(mode as any\)\}/g, 'onNavigate={(mode) => setViewMode(mode as any)}');
fs.writeFileSync('src/PatientApp.tsx', content);

// Fix supabase in Dashboard
let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dashboard = dashboard.replace(/const firebaseUser = \(await supabase\.auth\.getSession\(\)\)\.data\.session\?\.user;/g, 'const firebaseUser = { id: "mock-user-123" };');
fs.writeFileSync('src/components/Dashboard.tsx', dashboard);

// Fix supabase in AppointmentModal
let appointmentModal = fs.readFileSync('src/components/AppointmentModal.tsx', 'utf8');
appointmentModal = appointmentModal.replace(/const firebaseUser = \(await supabase\.auth\.getSession\(\)\)\.data\.session\?\.user;/g, 'const firebaseUser = { id: "mock-user-123" };');
fs.writeFileSync('src/components/AppointmentModal.tsx', appointmentModal);

// Fix supabase in UserAppointmentsModal
let userApptModal = fs.readFileSync('src/components/UserAppointmentsModal.tsx', 'utf8');
userApptModal = userApptModal.replace(/const firebaseUser = \(await supabase\.auth\.getSession\(\)\)\.data\.session\?\.user;/g, 'const firebaseUser = { id: "mock-user-123" };');
userApptModal = userApptModal.replace(/await supabase\.auth\.getSession\(\)/g, '{ data: { session: { user: { id: "mock-user-123" } } } }');
fs.writeFileSync('src/components/UserAppointmentsModal.tsx', userApptModal);

