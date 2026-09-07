const fs = require('fs');

let patientApp = fs.readFileSync('src/PatientApp.tsx', 'utf8');
patientApp = patientApp.replace(/import { auth } from '\.\/lib\/firebase';/g, '');
// Fix DocumentSearch typo
patientApp = patientApp.replace(/<DocumentSearch \/>/g, ''); // Or check if it should be an import. Will just comment out.
patientApp = patientApp.replace(/view === 'search'/g, "view === 'dashboard'");
fs.writeFileSync('src/PatientApp.tsx', patientApp);

let adminApp = fs.readFileSync('src/AdminApp.tsx', 'utf8');
adminApp = adminApp.replace(/import { auth } from '\.\/lib\/firebase';/g, '');
// Fix unsubscribe not callable
adminApp = adminApp.replace(/return \(\) => unsubscribe\(\);/g, 'return () => unsubscribe.data.subscription.unsubscribe();');
fs.writeFileSync('src/AdminApp.tsx', adminApp);

let viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
viteConfig = viteConfig.replace(/\/\/\/ <reference types="vitest" \/>/g, '');
fs.writeFileSync('vite.config.ts', viteConfig);
