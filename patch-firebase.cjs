const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

const oldCatch = `  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  } finally {`;

const newCatch = `  } catch (error: any) {
    if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
      console.error('Sign in error:', error);
    }
    throw error;
  } finally {`;

code = code.replace(oldCatch, newCatch);
fs.writeFileSync('src/lib/firebase.ts', code);
