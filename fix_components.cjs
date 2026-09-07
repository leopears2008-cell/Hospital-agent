const fs = require('fs');

function removeSupabase(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import \{ supabase \} from '\.\.\/lib\/supabase';\n/, '');
  fs.writeFileSync(file, content);
}

removeSupabase('src/components/Dashboard.tsx');
removeSupabase('src/components/AppointmentModal.tsx');
removeSupabase('src/components/UserAppointmentsModal.tsx');
removeSupabase('src/lib/firebase.ts');

