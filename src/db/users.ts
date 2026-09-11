import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string = '', name: string = 'User') {
  try {
    const existingUser = await db.select().from(users).where(eq(users.uid, uid)).get();
    
    if (!existingUser) {
      // Default to patient if not admin/doctor based on email heuristic for now
      const role = email === 'leopears2008@gmail.com' ? 'admin' :
                    (email && email.startsWith('dr.')) || email === 'doctor@example.com' ? 'doctor' : 'patient';
      
      const [newUser] = await db.insert(users).values({
        uid,
        email,
        name,
        role,
      }).returning();
      
      return newUser;
    } else {
      if (existingUser.email !== email || existingUser.name !== name) {
        const [updatedUser] = await db.update(users)
          .set({ email, name })
          .where(eq(users.uid, uid))
          .returning();
        return updatedUser;
      }
      return existingUser;
    }
  } catch (error) {
    console.error("Database user error:", error);
    throw new Error("Failed to sync user data.", { cause: error });
  }
}

export async function getUserRole(uid: string): Promise<string> {
  const user = await db.select({ role: users.role }).from(users).where(eq(users.uid, uid)).get();
  return user?.role || 'patient';
}
