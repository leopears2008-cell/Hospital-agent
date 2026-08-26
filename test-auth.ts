import { adminAuth } from './src/lib/firebase-admin.ts';
async function test() {
  try {
    await adminAuth.verifyIdToken("fake-token");
  } catch (e: any) {
    console.log("Error:", e.message);
  }
}
test();
