import { useState, useEffect } from 'react';
import { useUser, useOrganizationList, useAuth } from '@clerk/react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface AuthState {
  user: any | null;
  role: 'admin' | 'patient' | 'doctor' | null;
  loading: boolean;
  doctorId?: string;
}

export function useAuthGuard() {
  const { user, isLoaded: userLoaded } = useUser();
  const { getToken } = useAuth();
  const { userMemberships, isLoaded: orgsLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userLoaded || !orgsLoaded) {
      setAuthState(prev => ({ ...prev, loading: true }));
      return;
    }

    if (!user) {
      setAuthState({ user: null, role: null, loading: false });
      return;
    }

    const isOrgRoute = location.pathname.startsWith('/org');
    
    // Check if the user is part of an organization
    const hasOrg = userMemberships && userMemberships.data && userMemberships.data.length > 0;

    if (hasOrg) {
      if (!isOrgRoute) {
        navigate('/org', { replace: true });
      }
      setAuthState({
        user: {
          id: user.id,
          uid: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          user_metadata: { full_name: user.fullName }
        },
        role: 'admin',
        loading: false
      });
      return;
    } else {
      if (isOrgRoute) {
        navigate('/', { replace: true });
      }
    }

    // Sync with the backend working model
    const syncUser = async () => {
      try {
        const token = await getToken();
        const response = await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            uid: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            name: user.fullName || user.username || 'User'
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          setAuthState({
            user: {
              ...data.user,
              user_metadata: { full_name: data.user.name }
            },
            role: data.role,
            loading: false
          });
        } else {
          // Fallback if backend fails
          setAuthState({
            user: {
              id: user.id,
              uid: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              user_metadata: { full_name: user.fullName }
            },
            role: 'patient',
            loading: false
          });
        }
      } catch (err) {
        console.error("Failed to sync user:", err);
        setAuthState({
          user: {
            id: user.id,
            uid: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            user_metadata: { full_name: user.fullName }
          },
          role: 'patient',
          loading: false
        });
      }
    };
    
    syncUser();
  }, [user, userLoaded, orgsLoaded, userMemberships, location.pathname, navigate, getToken]);

  return authState;
}
