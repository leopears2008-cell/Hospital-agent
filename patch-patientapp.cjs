const fs = require('fs');
let code = fs.readFileSync('src/PatientApp.tsx', 'utf8');

// Add import
code = code.replace(
  "import { EmergencyModal } from './components/EmergencyModal';",
  "import { EmergencyModal } from './components/EmergencyModal';\nimport { useAuthGuard } from './lib/auth-guard';"
);

// Replace state and auth effect
const searchStr = `  // Auth state persisted in localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);

  useEffect(() => {
    import('./lib/firebase').then(({ auth }) => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          // Temporarily set while fetching real role
          setCurrentUser({
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            role: 'patient'
          });
          
          try {
            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);
            let role = 'patient';
            let doctorId = undefined;
            const name = user.displayName || user.email?.split('@')[0] || 'User';
            const email = user.email || '';

            if (!docSnap.exists()) {
              role = email === 'leopears2008@gmail.com' ? 'admin' :
                     (email.startsWith('dr.') || email === 'doctor@example.com') ? 'doctor' : 'patient';
                     
              await setDoc(userRef, {
                uid: user.uid,
                email,
                name,
                role,
                createdAt: Date.now()
              });
            } else {
              const userData = docSnap.data();
              role = userData.role || 'patient';
              doctorId = userData.doctorId;
              await updateDoc(userRef, { email, name });
            }

            setCurrentUser({
              id: user.uid,
              name,
              email,
              role: role as any,
              doctorId
            });
            
            if (role === 'admin') {
              window.location.href = '/admin/dashboard';
            }
          } catch (err) {
            console.error("Error fetching user data:", err);
          }
        } else {
          setCurrentUser(null);
        }
        setLoadingAuth(false);
      });
      return () => unsubscribe();
    });
  }, []);`;

const replaceStr = `  // Auth state from guard
  const { user, role, loading: loadingAuth, doctorId } = useAuthGuard();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);

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

code = code.replace(searchStr, replaceStr);

fs.writeFileSync('src/PatientApp.tsx', code);
