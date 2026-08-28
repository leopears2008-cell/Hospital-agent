import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { auth, googleSignIn } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthGuard } from '../lib/auth-guard';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuthGuard();
  
  useEffect(() => {
    if (!authLoading && user) {
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/'); // Route patients/doctors to their respective dashboards
      }
    }
  }, [user, role, authLoading, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Wait for useAuthGuard to handle the navigation
    } catch (err: any) {
      setError(err.message || "Failed to login as admin.");
      auth.signOut();
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setError('');
      setLoading(true);
      await googleSignIn();
      // Wait for useAuthGuard to handle the navigation
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError('Google Sign In failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-slate-800 p-6 text-center">
          <Shield className="w-12 h-12 text-blue-400 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
          <p className="text-slate-400 text-sm mt-1">Secure Hospital Administration</p>
        </div>
        <div className="p-6">
          {error && (
            <div className="bg-rose-50 text-rose-700 p-3 rounded-lg text-sm font-medium mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium"
                placeholder="admin@hospital.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 focus:ring-2 focus:ring-blue-500 font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {loading || authLoading ? 'Authenticating...' : (
                <>
                  <Lock className="w-4 h-4" /> Secure Login
                </>
              )}
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-medium">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleAuth}
            disabled={loading || authLoading}
            className="mt-6 w-full bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Google
          </button>
          
          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
              &larr; Back to Patient Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
