export const usersDb = new Map();

export async function getOrCreateUser(uid: string, email: string, name: string) {
  try {
    if (!usersDb.has(uid)) {
      usersDb.set(uid, { uid, email, name });
    } else {
      usersDb.set(uid, { ...usersDb.get(uid), email, name });
    }
    return usersDb.get(uid);
  } catch (error) {
    console.error("Database user error:", error);
    throw new Error("Failed to sync user data.", { cause: error });
  }
}
