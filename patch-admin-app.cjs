const fs = require('fs');
let code = fs.readFileSync('src/AdminApp.tsx', 'utf8');

code = code.replace(
  "const AdminAppointments = () => <div className=\"p-6\"><h2 className=\"text-2xl font-bold mb-4\">Appointments Management</h2><p>Full appointment list with filters will go here.</p></div>;",
  "import { AdminAppointments } from './components/AdminAppointments';"
);

code = code.replace(
  "const AdminPatients = () => <div className=\"p-6\"><h2 className=\"text-2xl font-bold mb-4\">Patients</h2><p>Patient directory and management.</p></div>;",
  "import { AdminPatients } from './components/AdminPatients';"
);

fs.writeFileSync('src/AdminApp.tsx', code);
