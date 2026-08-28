const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

const oldGoogleAuth = `  const handleGoogleAuth = async () => {
    try {
      setError('');
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };`;

const newGoogleAuth = `  const handleGoogleAuth = async () => {
    try {
      setError('');
      setLoading(true);
      const credential = await googleSignIn();
      if (credential) {
        onLoginSuccess({
          id: credential.user.uid,
          name: credential.user.displayName || credential.user.email?.split('@')[0] || '',
          email: credential.user.email || ''
        });
        onClose();
      }
    } catch (err: any) {
      console.error('Google auth error:', err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setError(''); // Silently ignore user cancellations
      } else {
        setError(err.message || 'Google authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };`;

code = code.replace(oldGoogleAuth, newGoogleAuth);
fs.writeFileSync('src/components/AuthModal.tsx', code);
