const fs = require('fs');

// Fix AdminApp.tsx
let adminApp = fs.readFileSync('src/AdminApp.tsx', 'utf8');
adminApp = adminApp.replace(/import \{ auth \} from '\.\/lib\/firebase';/g, '');
adminApp = adminApp.replace(/const unsubscribe = supabase\.auth\.onAuthStateChange/g, 'const { data: { subscription } } = supabase.auth.onAuthStateChange');
adminApp = adminApp.replace(/return \(\) => unsubscribe\.data\.subscription\.unsubscribe\(\);/g, 'return () => subscription.unsubscribe();');
fs.writeFileSync('src/AdminApp.tsx', adminApp);

// Fix PatientApp.tsx
let patientApp = fs.readFileSync('src/PatientApp.tsx', 'utf8');
patientApp = patientApp.replace(/import \{ auth \} from '\.\/lib\/firebase';/g, '');
patientApp = patientApp.replace(/user\.displayName/g, "user.user_metadata?.full_name");
patientApp = patientApp.replace(/await auth\.signOut\(\);/g, 'await supabase.auth.signOut();');
patientApp = patientApp.replace(/<DocumentSearch \/>/g, '');
patientApp = patientApp.replace(/view === 'search'/g, "view === 'dashboard'");
fs.writeFileSync('src/PatientApp.tsx', patientApp);

// Fix AppointmentModal.tsx
let appointmentModal = fs.readFileSync('src/components/AppointmentModal.tsx', 'utf8');
appointmentModal = appointmentModal.replace(/import \{ auth \} from '\.\.\/lib\/firebase';/g, '');
fs.writeFileSync('src/components/AppointmentModal.tsx', appointmentModal);

// Fix Dashboard.tsx
let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dashboard = dashboard.replace(/import \{ auth \} from '\.\.\/lib\/firebase';/g, '');
fs.writeFileSync('src/components/Dashboard.tsx', dashboard);

// Fix DoctorDashboard.tsx
let doctorDashboard = fs.readFileSync('src/components/DoctorDashboard.tsx', 'utf8');
doctorDashboard = doctorDashboard.replace(/import \{ auth \} from '\.\.\/lib\/firebase';/g, '');
fs.writeFileSync('src/components/DoctorDashboard.tsx', doctorDashboard);

// Fix UserAppointmentsModal.tsx
let userAppointmentsModal = fs.readFileSync('src/components/UserAppointmentsModal.tsx', 'utf8');
userAppointmentsModal = userAppointmentsModal.replace(/import \{ auth \} from '\.\.\/lib\/firebase';/g, '');
fs.writeFileSync('src/components/UserAppointmentsModal.tsx', userAppointmentsModal);

// Fix services/firebase.ts
let servicesFirebase = fs.readFileSync('src/services/firebase.ts', 'utf8');
servicesFirebase = servicesFirebase.replace(/import \{ auth, db, googleProvider, signInWithGoogle, logOut \} from '\.\.\/lib\/firebase';/g, "import { db } from '../lib/firebase';");
servicesFirebase = servicesFirebase.replace(/export \{[\s\S]*?\};/g, 'export { db };');
fs.writeFileSync('src/services/firebase.ts', servicesFirebase);

