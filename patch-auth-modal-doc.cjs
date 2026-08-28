const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

const importReplacement = `import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';`;

code = code.replace(
  "import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';",
  importReplacement
);

const oldCreate = `        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });`;

const newCreate = `        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });
        // Create user document with explicit patient role
        await setDoc(doc(db, 'users', credential.user.uid), {
          name: name,
          email: credential.user.email,
          role: 'patient',
          createdAt: serverTimestamp()
        });`;

code = code.replace(oldCreate, newCreate);

const oldGoogleSuccess = `      if (credential) {
        onLoginSuccess({
          id: credential.user.uid,
          name: credential.user.displayName || credential.user.email?.split('@')[0] || '',
          email: credential.user.email || ''
        });
        onClose();
      }`;

const newGoogleSuccess = `      if (credential) {
        // Ensure user document exists for Google login
        const userRef = doc(db, 'users', credential.user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: credential.user.displayName || credential.user.email?.split('@')[0] || '',
            email: credential.user.email || '',
            role: 'patient',
            createdAt: serverTimestamp()
          });
        }
        
        onLoginSuccess({
          id: credential.user.uid,
          name: credential.user.displayName || credential.user.email?.split('@')[0] || '',
          email: credential.user.email || ''
        });
        onClose();
      }`;

code = code.replace(oldGoogleSuccess, newGoogleSuccess);

fs.writeFileSync('src/components/AuthModal.tsx', code);
