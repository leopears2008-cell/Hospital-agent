import { FormEvent, useState } from 'react';
import { X, Shield, Mail, Lock, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { User } from '../types';
import { auth, googleSignIn } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, updateProfile } from 'firebase/auth';

interface AuthModalProps {
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export function AuthModal({ initialMode = 'login', onClose, onLoginSuccess }: AuthModalProps) {
  const [isSignup, setIsSignup] = useState(initialMode === 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMsg('');

    try {
      if (isSignup) {
        if (!name.trim()) {
          setError('Please provide your name.');
          return;
        }
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });
        onLoginSuccess({
          id: credential.user.uid,
          name: name,
          email: credential.user.email || ''
        });
        onClose();
      } else {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        onLoginSuccess({
          id: credential.user.uid,
          name: credential.user.displayName || credential.user.email?.split('@')[0] || '',
          email: credential.user.email || ''
        });
        onClose();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed.');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setError('');
      const credential = await googleSignIn();
      onLoginSuccess({
        id: credential.user.uid,
        name: credential.user.displayName || credential.user.email?.split('@')[0] || '',
        email: credential.user.email || ''
      });
      onClose();
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(err.message || 'Google authentication failed.');
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address to reset your password.');
      return;
    }
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
      setMsg('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      console.error('Reset error:', err);
      setError(err.message || 'Failed to send password reset email.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold">{isSignup ? 'Create Account' : 'Portal Login'}</h2>
          </div>
          <p className="text-xs text-slate-400">
            {isSignup ? 'Register for Tamil Nadu Health Portal access' : 'Sign in to access saved hospitals and patient records'}
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded text-xs font-medium">
              {error}
            </div>
          )}
          {msg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded text-xs font-medium">
              {msg}
            </div>
          )}

          <button
            onClick={handleGoogleAuth}
            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">or Email</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Arun Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded text-sm text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                    required={isSignup}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded text-sm text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                {!isSignup && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] text-blue-600 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded text-sm text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              {isSignup ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isSignup ? 'Sign Up' : 'Login'}</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
                setMsg('');
              }}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
