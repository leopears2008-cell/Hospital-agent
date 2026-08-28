const fs = require('fs');
let code = fs.readFileSync('src/AdminApp.tsx', 'utf8');

code = code.replace(
  "import { AdminPatients } from './components/AdminPatients';",
  "import { AdminPatients } from './components/AdminPatients';\nimport { AdminSettings } from './components/AdminSettings';"
);

code = code.replace(
  "const AdminSettings = () => <div className=\"p-6\"><h2 className=\"text-2xl font-bold mb-4\">Hospital Settings</h2><p>Configuration for hospital details, notifications, and features.</p></div>;",
  ""
);

if (!code.includes("Calendar as CalendarIcon")) {
  code = code.replace(
    "import { \n  LayoutDashboard, Users, Activity, Settings as SettingsIcon, \n  LogOut, Shield, FileText, Database \n} from 'lucide-react';",
    "import { \n  LayoutDashboard, Users, Activity, Settings as SettingsIcon, \n  LogOut, Shield, FileText, Database, Calendar as CalendarIcon \n} from 'lucide-react';"
  );
}

fs.writeFileSync('src/AdminApp.tsx', code);
