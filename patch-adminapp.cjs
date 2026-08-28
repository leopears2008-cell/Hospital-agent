const fs = require('fs');
let code = fs.readFileSync('src/AdminApp.tsx', 'utf8');

// Add import
code = code.replace(
  "import { doc, getDoc, collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';",
  "import { doc, getDoc, collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';\nimport { useAuthGuard } from './lib/auth-guard';"
);

// Replace state and auth effect
const searchStr = `  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [toasts, setToasts] = useState<{id: string, message: string}[]>([]);`;

const authEffectStr = `  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);
          if (snap.exists() && snap.data().role === 'admin') {
            setAuthorized(true);
            
            // Log the login action
            if (location.pathname === '/admin/dashboard') { 
              await addDoc(collection(db, 'audit_logs'), {
                adminId: user.uid,
                action: 'ADMIN_LOGIN',
                resource: 'system',
                timestamp: serverTimestamp(),
                metadata: { email: user.email }
              });
            }
          } else {
            window.location.href = '/';
          }
        } catch (err) {
          console.error("Auth check failed:", err);
          window.location.href = '/';
        }
      } else {
        navigate('/admin/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);`;

code = code.replace(searchStr, `  const { user, role, loading } = useAuthGuard();\n  const [authorized, setAuthorized] = useState(false);\n  const [toasts, setToasts] = useState<{id: string, message: string}[]>([]);`);

code = code.replace(authEffectStr, `  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      navigate('/admin/login');
      return;
    }

    if (role === 'admin') {
      setAuthorized(true);
      // Optional logic for audit logging can be moved here if needed
    } else {
      window.location.href = '/';
    }
  }, [user, role, loading, navigate]);`);

// Fix the return statement
code = code.replace(
  "  if (loading) {\n    return <div className=\"w-screen h-screen flex items-center justify-center bg-slate-100\">Verifying access...</div>;\n  }",
  "  if (loading) {\n    return <div className=\"w-screen h-screen flex items-center justify-center bg-slate-100\">Verifying access...</div>;\n  }"
);

fs.writeFileSync('src/AdminApp.tsx', code);
