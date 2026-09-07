const fs = require('fs');
let content = fs.readFileSync('src/lib/auth-guard.ts', 'utf8');

// Replace imports
content = content.replace(
  "import { User as FirebaseUser } from 'firebase/auth';import { doc, getDoc, setDoc } from 'firebase/firestore';import { auth, db } from './firebase';",
  "import { User as SupabaseUser } from '@supabase/supabase-js';import { doc, getDoc, setDoc } from 'firebase/firestore';import { db } from './firebase';import { supabase } from './supabase';"
);

// Replace AuthState type
content = content.replace(
  "user: FirebaseUser | null;",
  "user: SupabaseUser & { uid: string } | null;"
);

// Replace useEffect
content = content.replace(
  /useEffect\(\(\) => \{[\s\S]*?return \(\) => unsubscribe\(\);\s*\}, \[\]\);/,
`useEffect(() => {
    const handleAuth = async (session: any) => {
      const sbUser = session?.user;
      if (sbUser) {
        try {
          const userRef = doc(db, 'users', sbUser.id);
          const snap = await getDoc(userRef);
          
          const extendedUser = { ...sbUser, uid: sbUser.id } as SupabaseUser & { uid: string };
                    
          if (snap.exists()) {
            const data = snap.data();
            setAuthState({
              user: extendedUser,
              role: data.role || 'patient',
              doctorId: data.doctorId,
              loading: false,
            });
          } else {
            const email = sbUser.email || '';
            const name = sbUser.user_metadata?.full_name || email.split('@')[0] || 'User';
            const role = email === 'leopears2008@gmail.com' ? 'admin' :
                         (email.startsWith('dr.') || email === 'doctor@example.com') ? 'doctor' : 'patient';
                                     
            await setDoc(userRef, {
              uid: sbUser.id,
              email,
              name,
              role,
              createdAt: Date.now()
            });
            
            setAuthState({
              user: extendedUser,
              role,
              loading: false,
            });
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setAuthState({
            user: { ...sbUser, uid: sbUser.id } as SupabaseUser & { uid: string },
            role: null,
            loading: false,
          });
        }
      } else {
        setAuthState({ user: null, role: null, loading: false });
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuth(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuth(session);
    });

    return () => subscription.unsubscribe();
  }, []);`
);

fs.writeFileSync('src/lib/auth-guard.ts', content);
