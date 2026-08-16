import { FormEvent, useState } from 'react';
import { Shield, Mail, Lock, User as UserIcon, LogIn, UserPlus, Activity, Map } from 'lucide-react';
import { User } from '../types';
import { auth, googleProvider } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, updateProfile } from 'firebase/auth';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
          setError('Please provide your name.');
          setLoading(false);
          return;
        }
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });
        onLoginSuccess({
          id: credential.user.uid,
          name: name,
          email: credential.user.email || ''
        });
      } else {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        onLoginSuccess({
          id: credential.user.uid,
          name: credential.user.displayName || credential.user.email?.split('@')[0] || '',
          email: credential.user.email || ''
        });
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setError('');
      setLoading(true);
      const credential = await signInWithPopup(auth, googleProvider);
      onLoginSuccess({
        id: credential.user.uid,
        name: credential.user.displayName || credential.user.email?.split('@')[0] || '',
        email: credential.user.email || ''
      });
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(err.message || 'Google authentication failed.');
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
      await sendPasswordResetEmail(auth, email);
      setMsg('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      console.error('Reset error:', err);
      setError(err.message || 'Failed to send password reset email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden z-10 mx-4 border border-slate-100">
        
        {/* Left Side: Branding / Info */}
        <div className="w-full md:w-5/12 bg-slate-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Tamil Nadu <br/>Health Portal</h1>
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Your Health, <br/>Our Priority.</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              Access the largest database of verified hospitals across Tamil Nadu. Book appointments, check emergency availability, and find specialized care near you.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Map className="w-5 h-5 text-blue-400" />
                <span>Interactive Hospital Map</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Activity className="w-5 h-5 text-rose-400" />
                <span>Emergency Proximity Alerts</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Secure Appointment Booking</span>
              </li>
            </ul>
          </div>
          
          <div className="relative z-10 mt-12 text-xs text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} TN Health Initiative.
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full md:w-7/12 p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h3>
            <p className="text-sm text-slate-500 mb-8">
              {isSignup ? 'Register to start managing your healthcare journey.' : 'Please enter your details to sign in.'}
            </p>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-sm font-medium mb-4">
                {error}
              </div>
            )}
            {msg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-sm font-medium mb-4">
                {msg}
              </div>
            )}

            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">or sign in with email</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-5">
              {isSignup && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Arun Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      required={isSignup}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  {!isSignup && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
                    >
                      Forgot password?
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isSignup ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                    <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-8">
              <p className="text-sm text-slate-600">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError('');
                    setMsg('');
                  }}
                  className="text-blue-600 hover:text-blue-700 hover:underline font-bold"
                >
                  {isSignup ? 'Sign in instead' : 'Create an account'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
