import { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, query, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Appointment, User as AppUser } from '../types';

interface DoctorDashboardProps {
  currentUser: AppUser;
}

export function DoctorDashboard({ currentUser }: DoctorDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [currentUser]);

  const fetchAppointments = async () => {
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
  };

  const updateStatus = async (id: string, status: string) => {
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
  };

  if (loading) {
    return (
      <div className="p-6 w-full max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse h-32" />
          ))}
        </div>
      </div>
    );
  }

  const upcoming = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
  
  return (
    <div className="p-6 w-full max-w-6xl mx-auto space-y-6 overflow-y-auto h-full pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Welcome, Dr. {currentUser.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Appointments</p>
            <p className="text-2xl font-bold text-slate-800">{appointments.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Upcoming</p>
            <p className="text-2xl font-bold text-slate-800">{upcoming.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Your Appointments</h2>
        </div>
        
        {appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>You don't have any appointments scheduled.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {appointments.map(apt => (
              <div key={apt.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{apt.patientName}</h3>
                    <p className="text-sm text-slate-500">{apt.date} at {apt.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                    apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    apt.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {apt.status}
                  </span>
                  
                  {apt.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(apt.id, 'confirmed')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button onClick={() => updateStatus(apt.id, 'cancelled')} className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-colors">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {apt.status === 'confirmed' && (
                     <button onClick={() => updateStatus(apt.id, 'completed')} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        Mark Completed
                     </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
