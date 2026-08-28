import { FormEvent, useState } from 'react';
import { X, Shield, Mail, Lock, User as UserIcon, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { User } from '../types';
import { auth, googleSignIn } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      if (isSignup) {
        if (!name.trim()) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters long.');
          setLoading(false);
          return;
        }
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });
        // Create user document with explicit patient role
        await setDoc(doc(db, 'users', credential.user.uid), {
          name: name,
          email: credential.user.email,
          role: 'patient',
          createdAt: serverTimestamp()
        });
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
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setError('');
      setLoading(true);
      const credential = await googleSignIn();
      if (credential) {
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
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setError(''); // Silently ignore user cancellations
      } else {
        console.error('Google auth error:', err);
        setError(err.message || 'Google authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address to reset your password.');
      return;
    }
    try {
      setError('');
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMsg('Password reset email sent! Please check your inbox.');
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-teal-500"></div>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 pb-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center rotate-3 shadow-sm border border-blue-100">
              <Shield className="w-8 h-8 -rotate-3" />
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-center text-slate-900 mb-2">
            {isSignup ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-center text-slate-500 font-medium mb-8">
            {isSignup ? 'Join TN sevai for premium healthcare management.' : 'Sign in to access your dashboard.'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium flex items-start gap-3">
              <Shield className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {msg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium flex items-start gap-3">
              <Shield className="w-5 h-5 shrink-0" />
              <span>{msg}</span>
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5" htmlFor="name">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    disabled={loading}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 focus:bg-white transition-colors"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5" htmlFor="email">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 focus:bg-white transition-colors"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5" htmlFor="password">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loading}
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 focus:bg-white transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isSignup && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading || !email.trim()}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignup ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  {isSignup ? 'Create Account' : 'Sign In'}
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
            disabled={loading}
            className="mt-6 w-full bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Google
          </button>

          <div className="mt-8 text-center">
            <p className="text-slate-600 font-medium">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                  setMsg('');
                }}
                disabled={loading}
                className="ml-2 font-bold text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
              >
                {isSignup ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
