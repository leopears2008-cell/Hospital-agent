const fs = require('fs');

function removeAuthImport(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/import { auth, db } from/g, "import { db } from");
  content = content.replace(/import { db, auth } from/g, "import { db } from");
  content = content.replace(/import \{ auth \} from/g, "");
  fs.writeFileSync(filePath, content);
}

removeAuthImport('src/AdminApp.tsx');
removeAuthImport('src/PatientApp.tsx');
removeAuthImport('src/components/AppointmentModal.tsx');
removeAuthImport('src/components/Dashboard.tsx');
removeAuthImport('src/components/DoctorDashboard.tsx');
removeAuthImport('src/components/UserAppointmentsModal.tsx');

let adminApp = fs.readFileSync('src/AdminApp.tsx', 'utf8');
adminApp = adminApp.replace(/return \(\) => subscription\.unsubscribe\(\);/g, 'return () => { subscription.unsubscribe(); }');
// The actual issue might be variable scoping for subscription.
// Let's rewrite the onAuthStateChange in AdminApp to be like PatientApp if possible or just ignore if it's fine.
adminApp = adminApp.replace(/const { data: { subscription } } = supabase\.auth\.onAuthStateChange\((.*?)\);([\s\S]*?)return \(\) => subscription\.unsubscribe\(\);/g, 
`const { data: { subscription } } = supabase.auth.onAuthStateChange($1);
    $2return () => { subscription.unsubscribe(); };`);

fs.writeFileSync('src/AdminApp.tsx', adminApp);

let patientApp = fs.readFileSync('src/PatientApp.tsx', 'utf8');
patientApp = patientApp.replace(/const { auth } = await import\('\.\/lib\/firebase'\);/g, '');
patientApp = patientApp.replace(/import\('\.\/lib\/firebase'\)/g, "import('./lib/supabase')");
fs.writeFileSync('src/PatientApp.tsx', patientApp);

