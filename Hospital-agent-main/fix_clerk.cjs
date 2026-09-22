const fs = require('fs');
let content = fs.readFileSync('src/middleware/auth.ts', 'utf8');

const newAuth = `import { Request, Response, NextFunction } from 'express';
import { requireAuth as clerkRequireAuth } from '@clerk/express';
import { getUserRole } from '../db/users.ts';

export interface AuthRequest extends Request {
  auth?: { userId: string; sessionId: string };
  user?: { uid: string; role: string; email?: string; name?: string };
}

// Bypass clerk if no keys
const authMiddleware = process.env.CLERK_SECRET_KEY 
  ? clerkRequireAuth() 
  : (req: AuthRequest, res: Response, next: NextFunction) => {
      req.auth = { userId: "mock-user-123", sessionId: "mock-session" };
      next();
    };

export const requireAuth = [
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const uid = req.auth?.userId;
      if (!uid) {
        return res.status(401).json({ error: 'Unauthorized: Missing Clerk Auth' });
      }
      
      const role = await getUserRole(uid);
      req.user = { uid, role };
      next();
    } catch (error) {
      console.error('Error fetching user role:', error);
      res.status(500).json({ error: 'Internal server error checking authorization' });
    }
  }
];

export const requireAdmin = [
  ...requireAuth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    next();
  }
];

export const requireDoctor = [
  ...requireAuth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'doctor') {
      return res.status(403).json({ error: 'Forbidden: Doctor access required' });
    }
    next();
  }
];
`;

fs.writeFileSync('src/middleware/auth.ts', newAuth);

let serverContent = fs.readFileSync('server.ts', 'utf8');
serverContent = serverContent.replace('app.use(clerkMiddleware());', 
  `if (process.env.CLERK_SECRET_KEY) {
  app.use(clerkMiddleware());
} else {
  // mock clerk middleware
  app.use((req: any, res, next) => {
    req.auth = { userId: "mock-user-123" };
    next();
  });
}`);
fs.writeFileSync('server.ts', serverContent);
