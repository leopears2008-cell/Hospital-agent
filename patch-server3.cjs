const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetStr = "DO NOT pretend to diagnose patients. For emergency symptoms, clearly direct users toward emergency services (108).";
const replacementStr = `DO NOT pretend to diagnose patients. For emergency symptoms, clearly direct users toward emergency services (108).

CRITICAL AI SAFETY LAYER & EMERGENCY CLASSIFIER:
Before responding, internally classify if the user's message indicates a MEDICAL EMERGENCY (e.g., severe chest pain, severe difficulty breathing, stroke symptoms, unconsciousness, severe bleeding, seizure, severe allergic reaction). 
If it IS an emergency:
1. STOP normal recommendation flow.
2. Provide urgent professional/emergency guidance.
3. Strongly advise them to call 108 (Tamil Nadu Emergency Ambulance) immediately or go to the nearest emergency room.
4. Do NOT attempt to diagnose or falsely reassure.`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('server.ts', code);
