const fs = require('fs');

let content = fs.readFileSync('src/lib/auth-guard.ts', 'utf8');

const oldEffect = `  useEffect(() => {
    if (!userLoaded || !orgsLoaded) {
      setAuthState(prev => ({ ...prev, loading: true }));
      return;
    }

    if (!user) {
      setAuthState({ user: null, role: null, loading: false });
      return;
    }

    const isAdminRoute = location.pathname.startsWith('/admin');
    const isOrgRoute = location.pathname.startsWith('/org');
    
    // Check if the user is part of an organization
    const hasOrg = userMemberships && userMemberships.data && userMemberships.data.length > 0;

    if (hasOrg) {
      // If user belongs to an org, automatically route them to the specialized org dashboard
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
      // Not in an organization, if trying to access org route, redirect home
      if (isOrgRoute) {
        navigate('/', { replace: true });
      }
    }

    // Default mock logic fallback for non-org users
    const role = isAdminRoute ? 'admin' : 'patient';
    setAuthState({
      user: {
        id: user.id,
        uid: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        user_metadata: { full_name: user.fullName }
      },
      role: role,
      loading: false
    });
  }, [user, userLoaded, orgsLoaded, userMemberships, location.pathname, navigate]);`;


const newEffect = `  useEffect(() => {
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
        const response = await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
  }, [user, userLoaded, orgsLoaded, userMemberships, location.pathname, navigate]);`;

content = content.replace(oldEffect, newEffect);
fs.writeFileSync('src/lib/auth-guard.ts', content);

