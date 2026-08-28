import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface AuthState {
  user: FirebaseUser | null;
  role: 'admin' | 'patient' | 'doctor' | null;
  loading: boolean;
  doctorId?: string;
}

export function useAuthGuard() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);
          
          if (snap.exists()) {
            const data = snap.data();
            setAuthState({
              user: firebaseUser,
              role: data.role || 'patient',
              doctorId: data.doctorId,
              loading: false,
            });
          } else {
            // Document doesn't exist yet, determine default role based on logic in PatientApp
            const email = firebaseUser.email || '';
            const name = firebaseUser.displayName || email.split('@')[0] || 'User';
            const role = email === 'leopears2008@gmail.com' ? 'admin' :
                         (email.startsWith('dr.') || email === 'doctor@example.com') ? 'doctor' : 'patient';
                         
            await setDoc(userRef, {
              uid: firebaseUser.uid,
              email,
              name,
              role,
              createdAt: Date.now()
            });

            setAuthState({
              user: firebaseUser,
              role,
              loading: false,
            });
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setAuthState({
            user: firebaseUser,
            role: null,
            loading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          role: null,
          loading: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return authState;
}
