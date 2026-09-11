const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const config = require('./firebase-applet-config.json');

const app = initializeApp({ projectId: config.projectId });
const db = getFirestore(app, config.firestoreDatabaseId);

db.collection('test').limit(1).get()
  .then(() => console.log('Success!'))
  .catch(e => console.error('Error:', e.message));
