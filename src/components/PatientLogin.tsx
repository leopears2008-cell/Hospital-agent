import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthModal } from './AuthModal';
import { User } from '../types';
import { useAuthGuard } from '../lib/auth-guard';

export default function PatientLogin() {
  const navigate = useNavigate();
  const { user, role, loading } = useAuthGuard();

  useEffect(() => {
    if (!loading && user) {
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, role, loading, navigate]);

  return (
    <div className="w-screen h-screen bg-slate-100 flex items-center justify-center">
      <AuthModal 
        initialMode="login" 
        onClose={() => navigate('/')} 
        onLoginSuccess={(user: User) => {
          // the guard will handle the actual navigation
        }} 
      />
    </div>
  );
}
