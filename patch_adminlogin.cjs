const fs = require('fs');
let content = fs.readFileSync('src/components/AdminLogin.tsx', 'utf8');

// Replace imports
content = content.replace(
  "import { auth, googleSignIn } from '../lib/firebase';import { signInWithEmailAndPassword } from 'firebase/auth';",
  "import { supabase } from '../lib/supabase';"
);

// Replace handleAdminLogin
content = content.replace(
  /const handleAdminLogin = async[\s\S]*?finally {[\s\S]*?}\s*};|\bconst handleAdminLogin = async[\s\S]*?setLoading\(false\);\s*}\s*};/,
`const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
    } catch (err: any) {
      setError(err.message || "Failed to login as admin.");
      await supabase.auth.signOut();
      setLoading(false);
    }
  };`
);

// Replace handleGoogleAuth
content = content.replace(
  /const handleGoogleAuth = async[\s\S]*?finally {[\s\S]*?}\s*};|\bconst handleGoogleAuth = async[\s\S]*?setLoading\(false\);\s*}\s*};/,
`const handleGoogleAuth = async () => {
    try {
      setError('');
      setLoading(true);
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (signInError) throw signInError;
    } catch (err: any) {
      setError('Google Sign In failed. Please try again.');
      setLoading(false);
    }
  };`
);

fs.writeFileSync('src/components/AdminLogin.tsx', content);
