const fs = require('fs');

// Fix AuthModal imports
let authModal = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');
authModal = authModal.replace(/import { auth, googleSignIn } from '\.\.\/lib\/firebase';/g, '');
if (!authModal.includes('import { supabase }')) {
  authModal = "import { supabase } from '../lib/supabase';\n" + authModal;
}
fs.writeFileSync('src/components/AuthModal.tsx', authModal);

// Fix AdminLogin imports
let adminLogin = fs.readFileSync('src/components/AdminLogin.tsx', 'utf8');
adminLogin = adminLogin.replace(/import { auth, googleSignIn } from '\.\.\/lib\/firebase';/g, '');
if (!adminLogin.includes('import { supabase }')) {
  adminLogin = "import { supabase } from '../lib/supabase';\n" + adminLogin;
}
// Fix supabase.auth.signOut
adminLogin = adminLogin.replace(/supabase\.supabase/g, 'supabase');
fs.writeFileSync('src/components/AdminLogin.tsx', adminLogin);

// Fix AIChatbot
let aiChatbot = fs.readFileSync('src/components/AIChatbot.tsx', 'utf8');
aiChatbot = aiChatbot.replace(/import { auth } from '\.\.\/lib\/firebase';/g, '');
aiChatbot = aiChatbot.replace(/firebaseUser\.getIdToken\(\)/g, '(await supabase.auth.getSession()).data.session?.access_token');
fs.writeFileSync('src/components/AIChatbot.tsx', aiChatbot);

// Fix Dashboard
let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dashboard = dashboard.replace(/import { auth } from '\.\.\/lib\/firebase';/g, '');
fs.writeFileSync('src/components/Dashboard.tsx', dashboard);

// Fix DoctorDashboard
let doctorDashboard = fs.readFileSync('src/components/DoctorDashboard.tsx', 'utf8');
doctorDashboard = doctorDashboard.replace(/import { auth } from '\.\.\/lib\/firebase';/g, '');
fs.writeFileSync('src/components/DoctorDashboard.tsx', doctorDashboard);

// Fix AppointmentModal
let appointmentModal = fs.readFileSync('src/components/AppointmentModal.tsx', 'utf8');
appointmentModal = appointmentModal.replace(/import { auth } from '\.\.\/lib\/firebase';/g, '');
fs.writeFileSync('src/components/AppointmentModal.tsx', appointmentModal);

// Fix UserAppointmentsModal
let userAppointmentsModal = fs.readFileSync('src/components/UserAppointmentsModal.tsx', 'utf8');
userAppointmentsModal = userAppointmentsModal.replace(/import { auth } from '\.\.\/lib\/firebase';/g, '');
fs.writeFileSync('src/components/UserAppointmentsModal.tsx', userAppointmentsModal);

// Fix auth-guard
let authGuard = fs.readFileSync('src/lib/auth-guard.ts', 'utf8');
authGuard = authGuard.replace(/import { auth, db } from '\.\/firebase';/g, "import { db } from './firebase';");
authGuard = authGuard.replace(/import { doc, getDoc, setDoc } from 'firebase\/firestore';/g, "import { doc, getDoc, setDoc } from 'firebase/firestore';\nimport { User as SupabaseUser } from '@supabase/supabase-js';\nimport { supabase } from './supabase';");
fs.writeFileSync('src/lib/auth-guard.ts', authGuard);

// Fix supabase.ts
let supabaseTs = fs.readFileSync('src/lib/supabase.ts', 'utf8');
supabaseTs = '/// <reference types="vite/client" />\n' + supabaseTs;
fs.writeFileSync('src/lib/supabase.ts', supabaseTs);

// Fix services/firebase.ts
let servicesFirebase = fs.readFileSync('src/services/firebase.ts', 'utf8');
servicesFirebase = servicesFirebase.replace(/export \{[\s\S]*?\};/g, 'export { db };');
fs.writeFileSync('src/services/firebase.ts', servicesFirebase);

