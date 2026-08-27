const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// Add imports
code = code.replace(
  "import { MapPin, Search, PhoneCall, Sparkles, Building2, Calendar, Stethoscope, ArrowRight, Activity, Clock, FileText } from 'lucide-react';",
  "import { MapPin, Search, PhoneCall, Sparkles, Building2, Calendar, Stethoscope, ArrowRight, Activity, Clock, FileText } from 'lucide-react';\nimport { db } from '../lib/firebase';\nimport { collection, query, where, getDocs, orderBy } from 'firebase/firestore';"
);

const target = `        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return;
        const token = await firebaseUser.getIdToken();
        const res = await fetch('/api/appointments', {
          headers: { 'Authorization': \`Bearer \${token}\` }
        });
        const data = await res.json();
        if (data.success && data.appointments.length > 0) {
          // Find closest future appointment, or just the latest pending/confirmed
          const upcoming = data.appointments.find((a: any) => a.status === 'confirmed' || a.status === 'pending');
          setUpcomingAppointment(upcoming || null);
        }`;

const replacement = `        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return;
        
        const q = query(
          collection(db, 'appointments'),
          where('userId', '==', firebaseUser.uid)
        );
        const snapshot = await getDocs(q);
        const appointments: any[] = [];
        snapshot.forEach(doc => {
          appointments.push({ id: doc.id, ...doc.data() });
        });
        
        if (appointments.length > 0) {
          // Sort descending by date roughly
          appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const upcoming = appointments.find(a => a.status === 'confirmed' || a.status === 'pending');
          setUpcomingAppointment(upcoming || null);
        }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/Dashboard.tsx', code);
