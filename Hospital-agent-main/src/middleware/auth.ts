import type { Request, Response, NextFunction } from 'express';
import { requireAuth as clerkRequireAuth } from '@clerk/express';
import { getOrCreateUser, getUserRole } from '../db/users.ts';

export interface AuthRequest extends Request {
  auth?: { userId: string; sessionId?: string };
  user?: { uid: string; role: string; email?: string; name?: string };
}

// Authentication must fail closed. Never manufacture a user when Clerk is not configured.
const authMiddleware = clerkRequireAuth();

export const requireAuth = [
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const uid = req.auth?.userId;
      if (!uid) return res.status(401).json({ error: 'Unauthorized' });
      let role = await getUserRole(uid);
      if (!role) {
        // A verified Clerk identity needs a database row before appointment writes.
        await getOrCreateUser(uid);
        role = await getUserRole(uid) || 'patient';
      }
      req.user = { uid, role };
      return next();
    } catch (error) {
      console.error('Error fetching user role:', error);
      return res.status(500).json({ error: 'Unable to verify authorization' });
    }
  },
];

export const requireAdmin = [
  ...requireAuth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    return next();
  },
];

export const requireDoctor = [
  ...requireAuth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'doctor') return res.status(403).json({ error: 'Doctor access required' });
    return next();
  },
];
