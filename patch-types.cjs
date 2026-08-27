const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  `  role?: 'admin' | 'user';`,
  `  role?: 'admin' | 'patient' | 'doctor';\n  doctorId?: string;`
);

code += `

export interface Notification {
  id: string;
  userId: string;
  title: string;
  description: string;
  timestamp: number;
  read: boolean;
  type: 'appointment' | 'medical' | 'system';
  actionUrl?: string;
}
`;

fs.writeFileSync('src/types.ts', code);
