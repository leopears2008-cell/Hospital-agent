// We re-export from our central firebase configuration to prevent double-initialization
// of the Firebase App, which causes errors. This file fulfills the requested service path.
import { auth, db, googleProvider, signInWithGoogle, logOut } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export {
  auth,
  db,
  googleProvider,
  signInWithGoogle,
  logOut,
  onAuthStateChanged
};
