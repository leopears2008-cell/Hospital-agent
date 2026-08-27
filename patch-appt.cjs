const fs = require('fs');
let code = fs.readFileSync('src/components/AppointmentModal.tsx', 'utf8');

code = code.replace(
  "import { auth } from '../lib/firebase';",
  "import { auth, db } from '../lib/firebase';\nimport { collection, addDoc, serverTimestamp } from 'firebase/firestore';"
);

const targetFetch = `      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error("Authentication required");
      const token = await firebaseUser.getIdToken();

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`
        },
        body: JSON.stringify({
          hospitalId: hospital.id,
          doctorId,
          department,
          patientName,
          patientAge: parseInt(patientAge),
          patientPhone,
          date,
          time,
          symptoms,
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to book appointment.');
      }
      
      const aptId = data.appointment?.id || \`APT-\${Math.floor(Math.random() * 100000)}\`;`;

const replaceFetch = `      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error("Authentication required");
      
      const appointmentData = {
        hospitalId: hospital.id,
        doctorId,
        department,
        userId: firebaseUser.uid,
        patientName,
        patientAge: parseInt(patientAge),
        patientPhone,
        date,
        time,
        status: 'pending',
        symptoms,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'appointments'), appointmentData);
      const aptId = docRef.id;`;

code = code.replace(targetFetch, replaceFetch);
fs.writeFileSync('src/components/AppointmentModal.tsx', code);
