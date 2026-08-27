const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const importTarget = `import { useState } from 'react';`;
const importReplacement = `import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';`;
code = code.replace(importTarget, importReplacement);

const mockTarget = `  // Mock data for demonstration
  const upcomingAppointment: Appointment | null = {
    id: 'mock-app-1',
    hospitalId: hospitals[0]?.id || '',
    userId: currentUser.id,
    patientName: currentUser.name,
    date: '2026-08-18',
    time: '10:30 AM',
    status: 'confirmed',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    department: 'Cardiology',
    doctorId: 'dr-mock-1'
  };`;

const mockReplacement = `  const [upcomingAppointment, setUpcomingAppointment] = useState<Appointment | null>(null);
  const [loadingAppt, setLoadingAppt] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const firebaseUser = auth.currentUser;
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
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingAppt(false);
      }
    };
    fetchUpcoming();
  }, [currentUser]);`;

code = code.replace(mockTarget, mockReplacement);

// Let's also patch the rendering of upcomingAppointment to show skeleton if loadingAppt is true
const renderTarget = `                <h3 className="font-bold text-slate-800 text-lg">Upcoming Appointment</h3>`;
const renderReplacement = `                <h3 className="font-bold text-slate-800 text-lg">Upcoming Appointment</h3>
              </div>
              
              {loadingAppt ? (
                <div className="animate-pulse space-y-3 mt-4">
                   <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                   <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                </div>
              ) : upcomingAppointment ? (`;

// Since I need to patch the jsx properly, I will do a regex replacement.
// Let's see the JSX for upcoming appointment in Dashboard.tsx
fs.writeFileSync('src/components/Dashboard.tsx', code);
