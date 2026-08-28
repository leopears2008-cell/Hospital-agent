const fs = require('fs');
let code = fs.readFileSync('src/components/UserAppointmentsModal.tsx', 'utf8');

const targetStr = "app.status !== 'cancelled' && (";
const replacementStr = "(app.status === 'pending' || app.status === 'confirmed') && (";

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/UserAppointmentsModal.tsx', code);
