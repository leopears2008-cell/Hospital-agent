const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const importClerk = `import { clerkMiddleware } from '@clerk/express';\n`;
if (!content.includes(importClerk)) {
  content = content.replace('import express from "express";', `import express from "express";\n${importClerk}`);
}

const useClerk = `app.use(express.json());\napp.use(clerkMiddleware());\n`;
if (!content.includes('app.use(clerkMiddleware())')) {
  content = content.replace('app.use(express.json());', useClerk);
}

fs.writeFileSync('server.ts', content);
