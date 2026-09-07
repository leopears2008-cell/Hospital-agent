const fs = require('fs');
let content = fs.readFileSync('src/middleware/auth.ts', 'utf8');

// Bypass requireAuth
content = content.replace(/export const requireAuth = async \([\s\S]*?\} catch \(error\) \{\n\s*console\.error\('Error verifying Supabase ID token:', error\);\n\s*return res\.status\(401\)\.json\(\{ error: 'Unauthorized: Invalid token' \}\);\n\s*\}\n\};/g, 
`export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Auth has been bypassed
  req.user = { uid: 'mock-user-123', email: 'mock@example.com', role: 'patient' };
  next();
};`);

fs.writeFileSync('src/middleware/auth.ts', content);
