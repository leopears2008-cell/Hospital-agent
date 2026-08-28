const fs = require('fs');
let code = fs.readFileSync('src/AdminApp.tsx', 'utf8');

code = code.replace(
  "import { AdminSettings } from './components/AdminSettings';",
  "import { AdminSettings } from './components/AdminSettings';\nimport { AdminAuditLogs } from './components/AdminAuditLogs';"
);

code = code.replace(
  "const AdminAuditLogs = () => <div className=\"p-6\"><h2 className=\"text-2xl font-bold mb-4\">Audit Logs</h2><p>System audit trail for administrative actions.</p></div>;",
  ""
);

fs.writeFileSync('src/AdminApp.tsx', code);
