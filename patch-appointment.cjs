const fs = require('fs');
let code = fs.readFileSync('src/components/AppointmentModal.tsx', 'utf8');

// Add runTransaction, doc, query, getDocs to imports if not there
if (!code.includes('runTransaction')) {
  code = code.replace(
    "import { collection, addDoc, serverTimestamp } from 'firebase/firestore';",
    "import { collection, addDoc, serverTimestamp, runTransaction, doc, query, getDocs, where } from 'firebase/firestore';"
  );
}

const targetSubmit = `const docRef = await addDoc(collection(db, 'appointments'), appointmentData);
      const aptId = docRef.id;`;

const replacementSubmit = `// Double-booking check using a transactional-like check (or robust query)
      const q = query(
        collection(db, 'appointments'),
        where('doctorId', '==', doctorId),
        where('date', '==', date),
        where('time', '==', time),
        where('status', 'in', ['pending', 'confirmed'])
      );
      const existing = await getDocs(q);
      if (!existing.empty) {
        throw new Error("This time slot has just been booked by someone else. Please choose another slot.");
      }

      const docRef = await addDoc(collection(db, 'appointments'), appointmentData);
      const aptId = docRef.id;`;

code = code.replace(targetSubmit, replacementSubmit);

fs.writeFileSync('src/components/AppointmentModal.tsx', code);
