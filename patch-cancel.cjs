const fs = require('fs');
let code = fs.readFileSync('src/components/UserAppointmentsModal.tsx', 'utf8');

const oldHandleCancel = `  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return;
      const token = await firebaseUser.getIdToken();
      const res = await fetch(\`/api/appointments/\${id}/cancel\`, {
        method: 'PUT',
        headers: {
          'Authorization': \`Bearer \${token}\`
        }
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Update local state
        setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: 'cancelled' } : app));
      } else {
        throw new Error(data.error || "Failed to cancel");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };`;

const newHandleCancel = `  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return;
      
      const appointmentRef = doc(db, 'appointments', id);
      await updateDoc(appointmentRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp()
      });

      // Update local state
      setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: 'cancelled' } : app));
      
    } catch (err: any) {
      alert(err.message);
    }
  };`;

code = code.replace(oldHandleCancel, newHandleCancel);
fs.writeFileSync('src/components/UserAppointmentsModal.tsx', code);
