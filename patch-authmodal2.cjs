const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

code = code.replace(
  "      console.error('Auth error:', err);\n      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {\n        setError('Invalid email or password.');\n      } else if (err.code === 'auth/email-already-in-use') {\n        setError('An account with this email already exists.');\n      } else {\n        setError(err.message || 'Authentication failed. Please try again.');\n      }",
  "      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {\n        setError('Invalid email or password.');\n      } else if (err.code === 'auth/email-already-in-use') {\n        setError('An account with this email already exists. Switching to login...');\n        setTimeout(() => setIsSignup(false), 2000);\n      } else {\n        setError('Authentication failed: ' + (err.message || 'Please try again.'));\n      }"
);

code = code.replace(
  "    } catch (err: any) {\n      console.error('Reset password error:', err);\n      setError(err.message || 'Failed to send reset email.');\n    }",
  "    } catch (err: any) {\n      setError(err.message || 'Failed to send reset email.');\n    }"
);

fs.writeFileSync('src/components/AuthModal.tsx', code);
