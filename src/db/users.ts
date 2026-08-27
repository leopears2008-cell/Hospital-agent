import { adminDb } from '../lib/firebase-admin.ts';

export async function getOrCreateUser(uid: string, email: string, name: string) {
  try {
    const userRef = adminDb.collection('users').doc(uid);
    const doc = await userRef.get();
    
    if (!doc.exists) {
      // Default to patient if not leopears2008@gmail.com
      const role = email === 'leopears2008@gmail.com' ? 'admin' : 
                   email.startsWith('dr.') || email === 'doctor@example.com' ? 'doctor' : 'patient';
      const userData = { uid, email, name, role, createdAt: Date.now() };
      await userRef.set(userData);
      return userData;
    } else {
      const data = doc.data();
      await userRef.update({ email, name });
      return { ...data, email, name };
    }
  } catch (error) {
    console.error("Database user error:", error);
    throw new Error("Failed to sync user data.", { cause: error });
  }
}

export async function getUserRole(uid: string): Promise<string> {
  const userRef = adminDb.collection('users').doc(uid);
  const doc = await userRef.get();
  if (doc.exists) {
    return doc.data()?.role || 'patient';
  }
  return 'patient';
}
