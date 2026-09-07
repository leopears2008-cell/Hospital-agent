const fs = require('fs');

// Fix PatientApp AuthModal import
let content = fs.readFileSync('src/PatientApp.tsx', 'utf8');
content = content.replace(/import \{ AuthModal \} from '\.\/components\/AuthModal';\n/, '');
content = content.replace(/onNavigate=\{\(mode\)/g, 'onNavigateToDoctors={()');
fs.writeFileSync('src/PatientApp.tsx', content);

// Fix supabase in Dashboard
let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dashboard = dashboard.replace(/await supabase\.auth\.getSession\(\);/, 'const { data: { session } } = { data: { session: { user: { id: "mock-user-123" } } } };');
dashboard = dashboard.replace(/const \{ data: \{ session \} \} = \{ data: \{ session: \{ user: \{ id: "mock-user-123" \} \} \} \};/g, ''); // wait, better way:
dashboard = dashboard.replace(/const \{ data: \{ session \} \} = await supabase\.auth\.getSession\(\);/g, 'const session = { user: { id: "mock-user-123" } };');
fs.writeFileSync('src/components/Dashboard.tsx', dashboard);

// Fix supabase in AppointmentModal
let appointmentModal = fs.readFileSync('src/components/AppointmentModal.tsx', 'utf8');
appointmentModal = appointmentModal.replace(/const \{ data: \{ session \} \} = await supabase\.auth\.getSession\(\);/g, 'const session = { user: { id: "mock-user-123" } };');
fs.writeFileSync('src/components/AppointmentModal.tsx', appointmentModal);

// Fix supabase in UserAppointmentsModal
let userApptModal = fs.readFileSync('src/components/UserAppointmentsModal.tsx', 'utf8');
userApptModal = userApptModal.replace(/const \{ data: \{ session \} \} = await supabase\.auth\.getSession\(\);/g, 'const session = { user: { id: "mock-user-123" } };');
fs.writeFileSync('src/components/UserAppointmentsModal.tsx', userApptModal);

