const fs = require('fs');

let content = fs.readFileSync('src/PatientApp.tsx', 'utf8');

content = content.replace(/const \{ id, \.\.\.featureData \} = payload\.new;/g, 
  `const payloadNew = payload.new as any;
          const { id, ...featureData } = payloadNew;`);

fs.writeFileSync('src/PatientApp.tsx', content);
