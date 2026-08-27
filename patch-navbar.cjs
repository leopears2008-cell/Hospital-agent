const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const importTarget = `import { EmergencyAlertsToggle } from './EmergencyAlertsToggle';`;
const importReplacement = `import { EmergencyAlertsToggle } from './EmergencyAlertsToggle';
import { NotificationDropdown } from './NotificationDropdown';`;

code = code.replace(importTarget, importReplacement);

const authTarget = `<div className="flex items-center gap-3">
                <button`;
const authReplacement = `<div className="flex items-center gap-3">
                <NotificationDropdown />
                <button`;

code = code.replace(authTarget, authReplacement);

fs.writeFileSync('src/components/Navbar.tsx', code);
