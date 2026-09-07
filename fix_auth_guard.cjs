const fs = require('fs');
let content = `import { useState, useEffect } from 'react';

export interface AuthState {
  user: any | null;
  role: 'admin' | 'patient' | 'doctor' | null;
  loading: boolean;
  doctorId?: string;
}

export function useAuthGuard() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    // Determine mock role based on URL to allow testing both interfaces
    const isAdmin = window.location.pathname.startsWith('/admin');
    const role = isAdmin ? 'admin' : 'patient';
    
    setAuthState({
      user: {
        id: 'mock-user-123',
        uid: 'mock-user-123',
        email: isAdmin ? 'admin@example.com' : 'patient@example.com',
        user_metadata: { full_name: isAdmin ? 'Admin User' : 'Test Patient' }
      },
      role: role,
      loading: false
    });
  }, []);

  return authState;
}
`;
fs.writeFileSync('src/lib/auth-guard.ts', content);
