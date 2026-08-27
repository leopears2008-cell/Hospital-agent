const fs = require('fs');
let code = fs.readFileSync('src/components/UserAppointmentsModal.tsx', 'utf8');

code = code.replace(
  "import { auth } from '../lib/firebase';",
  "import { auth, db } from '../lib/firebase';\nimport { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';"
);

const targetFetch = `      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error("Authentication required");
      const token = await firebaseUser.getIdToken();
      const res = await fetch('/api/appointments', {
        headers: {
          'Authorization': \`Bearer \${token}\`
        }
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setAppointments(data.appointments);
      } else {
        throw new Error(data.error || "Failed to load appointments");
      }`;

const replaceFetch = `      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error("Authentication required");
      
      const q = query(collection(db, 'appointments'), where('userId', '==', firebaseUser.uid));
      const snapshot = await getDocs(q);
      const appts: any[] = [];
      snapshot.forEach(d => appts.push({ id: d.id, ...d.data() }));
      appts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setAppointments(appts);`;

code = code.replace(targetFetch, replaceFetch);

const targetCancel = `      const firebaseUser = auth.currentUser;
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
        setAppointments(appointments.map(a => 
          a.id === id ? { ...a, status: 'cancelled' } : a
        ));
      } else {
        alert(data.error || "Failed to cancel appointment");
      }`;

const replaceCancel = `      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return;
      
      const apptRef = doc(db, 'appointments', id);
      await updateDoc(apptRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp()
      });
      
      setAppointments(appointments.map(a => 
        a.id === id ? { ...a, status: 'cancelled' } : a
      ));`;

code = code.replace(targetCancel, replaceCancel);
fs.writeFileSync('src/components/UserAppointmentsModal.tsx', code);
