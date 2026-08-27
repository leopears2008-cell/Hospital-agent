const fs = require('fs');
let code = fs.readFileSync('src/components/DoctorDashboard.tsx', 'utf8');

code = code.replace(
  "import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';",
  "import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';\nimport { db, auth } from '../lib/firebase';\nimport { collection, query, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';"
);

const targetFetch = `  const fetchAppointments = async () => {
    try {
      const token = await (window as any).auth?.currentUser?.getIdToken();
      if (!token) return;
      
      const res = await fetch('/api/doctor/appointments', {
        headers: { 'Authorization': \`Bearer \${token}\` }
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };`;

const replaceFetch = `  const fetchAppointments = async () => {
    try {
      const q = query(collection(db, 'appointments'));
      const snapshot = await getDocs(q);
      const appts: any[] = [];
      snapshot.forEach(d => appts.push({ id: d.id, ...d.data() }));
      appts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAppointments(appts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };`;

code = code.replace(targetFetch, replaceFetch);

const targetUpdate = `  const updateStatus = async (id: string, status: string) => {
    try {
      const token = await (window as any).auth?.currentUser?.getIdToken();
      await fetch(\`/api/appointments/\${id}/status\`, {
        method: 'PUT',
        headers: { 
          'Authorization': \`Bearer \${token}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };`;

const replaceUpdate = `  const updateStatus = async (id: string, status: string) => {
    try {
      const apptRef = doc(db, 'appointments', id);
      await updateDoc(apptRef, {
        status,
        updatedAt: serverTimestamp()
      });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };`;

code = code.replace(targetUpdate, replaceUpdate);
fs.writeFileSync('src/components/DoctorDashboard.tsx', code);
