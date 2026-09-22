const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const importAuth = `import { requireAuth, requireAdmin, requireDoctor, AuthRequest } from './src/middleware/auth.ts';\n`;
if (!content.includes("import { requireAuth")) {
  content = content.replace('import express from "express";', `import express from "express";\n${importAuth}`);
}

// Secure the sync route
content = content.replace(
`app.post("/api/auth/sync", async (req, res) => {`,
`app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {`
);

// We need to pass the req.auth.userId properly, wait, the auth sync does:
// const { uid, email, name } = req.body;
// But actually `uid` should be from `req.auth.userId`!
// Let's modify the body of that to enforce security.
content = content.replace(
`const { uid, email, name } = req.body;
  
  if (!uid || !email) {`,
`const email = req.body.email;
  const name = req.body.name;
  const uid = req.user?.uid;
  
  if (!uid || !email) {`
);

fs.writeFileSync('server.ts', content);
