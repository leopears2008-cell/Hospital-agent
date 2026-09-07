const fs = require('fs');

let content = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

// Replace imports
content = content.replace(
  "import { auth, googleSignIn } from '../lib/firebase';import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';",
  "import { supabase } from '../lib/supabase';"
);

// Replace handleEmailAuth
content = content.replace(
  /const handleEmailAuth = async[\s\S]*?finally {\s*setLoading\(false\);\s*}\s*};\s*const handleGoogleAuth/,
`const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);
    try {
      if (isSignup) {
        if (!name.trim()) { setError('Please provide your full name.'); setLoading(false); return; }
        if (password.length < 8) { setError('Password must be at least 8 characters long.'); setLoading(false); return; }
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email, password, options: { data: { full_name: name } }
        });
        if (signUpError) throw signUpError;
        if (authData.user) {
          await setDoc(doc(db, 'users', authData.user.id), {
            name: name, email: authData.user.email, role: 'patient', createdAt: serverTimestamp()
          });
          onLoginSuccess({ id: authData.user.id, name: name, email: authData.user.email || '' });
          onClose();
        }
      } else {
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        if (authData.user) {
          onLoginSuccess({
            id: authData.user.id,
            name: authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || '',
            email: authData.user.email || ''
          });
          onClose();
        }
      }
    } catch (err: any) {
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password.');
      } else if (err.message?.includes('User already registered')) {
        setError('An account with this email already exists. Switching to login...');
        setTimeout(() => setIsSignup(false), 2000);
      } else {
        setError('Authentication failed: ' + (err.message || 'Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleAuth`
);

// Replace handleGoogleAuth
content = content.replace(
  /const handleGoogleAuth = async[\s\S]*?finally {\s*setLoading\(false\);\s*}\s*};/,
`const handleGoogleAuth = async () => {
    try {
      setError('');
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { queryParams: { access_type: 'offline', prompt: 'consent' } }
      });
      if (error) throw error;
    } catch (err: any) {
      setError('Google Sign In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };`
);

// Replace handleForgotPassword
content = content.replace(
  /const handleForgotPassword = async[\s\S]*?finally {\s*setLoading\(false\);\s*}\s*};/,
`const handleForgotPassword = async () => {
    if (!email.trim()) { setError('Please enter your email address to reset your password.'); return; }
    try {
      setError('');
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password',
      });
      if (error) throw error;
      setMsg('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };`
);

fs.writeFileSync('src/components/AuthModal.tsx', content);
