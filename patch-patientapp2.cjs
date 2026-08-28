const fs = require('fs');
let code = fs.readFileSync('src/PatientApp.tsx', 'utf8');

// The block to remove starts around line 112 and ends around 160.
// Let's use regex to find and replace the whole useEffect block for auth.
const regex = /const \[authModalMode, setAuthModalMode\] = useState<'login' \| 'signup' \| null>\(null\);\s*useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/g;

const replaceStr = `const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);

  // Auth state from guard
  const { user, role, loading: loadingAuth, doctorId } = useAuthGuard();

  useEffect(() => {
    if (user && role) {
      setCurrentUser({
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        role: role as any,
        doctorId
      });
      if (role === 'admin') {
        window.location.href = '/admin/dashboard';
      }
    } else {
      setCurrentUser(null);
    }
  }, [user, role, doctorId]);`;

code = code.replace(regex, replaceStr);

fs.writeFileSync('src/PatientApp.tsx', code);
