const fs = require('fs');
let code = fs.readFileSync('src/AdminApp.tsx', 'utf8');

code = code.replace(
  "import { AdminAuditLogs } from './components/AdminAuditLogs';",
  "import { AdminAuditLogs } from './components/AdminAuditLogs';\nimport { AdminDoctors } from './components/AdminDoctors';\nimport { AdminUsers } from './components/AdminUsers';"
);

code = code.replace(
  "const AdminDoctors = () => <div className=\"p-6\"><h2 className=\"text-2xl font-bold mb-4\">Doctors</h2><p>Doctor directory, availability, and onboarding.</p></div>;",
  ""
);

code = code.replace(
  "const AdminUsers = () => <div className=\"p-6\"><h2 className=\"text-2xl font-bold mb-4\">User Roles</h2><p>Manage system users and RBAC.</p></div>;",
  ""
);

fs.writeFileSync('src/AdminApp.tsx', code);
