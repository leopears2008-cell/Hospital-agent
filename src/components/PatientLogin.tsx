import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AuthModal } from './AuthModal';
import { User } from '../types';

export default function PatientLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);
          if (snap.exists() && snap.data().role === 'admin') {
            window.location.href = '/admin/dashboard';
          } else {
            navigate('/');
          }
        } catch (err) {
          navigate('/');
        }
      }
    });
    return () => unsub();
  }, [navigate]);
  return (
    <div className="w-screen h-screen bg-slate-100 flex items-center justify-center">
      <AuthModal 
        initialMode="login" 
        onClose={() => navigate('/')} 
        onLoginSuccess={(user: User) => {
          navigate('/');
        }} 
      />
    </div>
  );
}
