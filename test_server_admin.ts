import { adminDb } from './src/lib/firebase-admin.ts';

async function test() {
  try {
    await adminDb.collection('test').limit(1).get();
    console.log('ADMIN DB WORKS IN NODE');
  } catch(e) {
    console.log('ADMIN DB FAILS', e);
  }
}
test();
