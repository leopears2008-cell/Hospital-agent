const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

// Ensure import has googleSignIn
if (!code.includes('googleSignIn')) {
  code = code.replace(
    "import { auth } from '../lib/firebase';",
    "import { auth, googleSignIn } from '../lib/firebase';"
  );
}

// Add handleGoogleAuth logic
const handleGoogleAuthCode = `  const handleGoogleAuth = async () => {
    try {
      setError('');
      setLoading(true);
      const result = await googleSignIn();
      if (result && result.user) {
        onClose();
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError('Google Sign In failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };\n\n  const handleForgotPassword`;

code = code.replace("  const handleForgotPassword", handleGoogleAuthCode);

// Add the Google button
const adminLinkHtml = `          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a 
              href="/admin/login" 
              className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Shield className="w-4 h-4 text-slate-500" />
              Hospital Administrator Portal
            </a>
          </div>`;

const newButtons = `          <div className="mt-8 relative">
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
          
          <div className="mt-4 text-center">
            <a 
              href="/admin/login" 
              className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Shield className="w-4 h-4 text-slate-500" />
              Hospital Administrator Portal
            </a>
          </div>`;

code = code.replace(adminLinkHtml, newButtons);

fs.writeFileSync('src/components/AuthModal.tsx', code);
