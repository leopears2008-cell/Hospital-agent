const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

const oldCode = `    } catch (err: any) {
      console.error('Google auth error:', err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setError(''); // Silently ignore user cancellations
      } else {
        setError(err.message || 'Google authentication failed.');
      }
    } finally {`;

const newCode = `    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setError(''); // Silently ignore user cancellations
      } else {
        console.error('Google auth error:', err);
        setError(err.message || 'Google authentication failed.');
      }
    } finally {`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/components/AuthModal.tsx', code);
