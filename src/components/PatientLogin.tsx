import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from './AuthModal';
import { User } from '../types';

export default function PatientLogin() {
  const navigate = useNavigate();
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
