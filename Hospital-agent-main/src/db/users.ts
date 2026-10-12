import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

function configuredRoleFor(uid: string): string {
  const admins = (process.env.ADMIN_USER_IDS || '').split(',').map((v) => v.trim()).filter(Boolean);
  const doctors = (process.env.DOCTOR_USER_IDS || '').split(',').map((v) => v.trim()).filter(Boolean);
  if (admins.includes(uid)) return 'admin';
  if (doctors.includes(uid)) return 'doctor';
  return 'patient';
}

/** Create/update a profile for a verified Clerk identity. Roles are never inferred from email. */
export async function getOrCreateUser(uid: string, email?: string, name?: string) {
  if (!uid || typeof uid !== 'string') throw new Error('A verified Clerk user ID is required.');
  try {
    const existingUser = await db.select().from(users).where(eq(users.uid, uid)).get();
    const configuredRole = configuredRoleFor(uid);

    if (!existingUser) {
      const [newUser] = await db.insert(users).values({
        uid,
        email: (email || '').slice(0, 320),
        name: (name || 'User').slice(0, 160),
        role: configuredRole,
      }).returning();
      return newUser;
    }

    // Only server-side Clerk-ID allowlists can grant privileged roles.
    const updates: { email?: string; name?: string; role?: string } = { role: configuredRole };
    if (typeof email === 'string' && email.length > 0) updates.email = email.slice(0, 320);
    if (typeof name === 'string' && name.length > 0) updates.name = name.slice(0, 160);
    const [updatedUser] = await db.update(users)
      .set(updates)
      .where(eq(users.uid, uid))
      .returning();
    return updatedUser;
  } catch (error) {
    console.error('Database user error:', error);
    throw new Error('Failed to sync user data.', { cause: error });
  }
}

export async function getUserRole(uid: string): Promise<string | null> {
  const user = await db.select({ uid: users.uid }).from(users).where(eq(users.uid, uid)).get();
  if (!user) return null;
  // Existing database role values cannot silently preserve an old email-based privilege.
  return configuredRoleFor(uid);
}
