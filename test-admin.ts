import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp({ projectId: firebaseConfig.projectId });
const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
console.log(db.collection('test').id);
