import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Appointment } from '../types';

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'appointments'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appts: Appointment[] = [];
      snapshot.forEach(d => appts.push({ id: d.id, ...d.data() } as Appointment));
      appts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAppointments(appts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  if (loading) return <div className="p-6">Loading appointments...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">All Appointments</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-800">
            <tr>
              <th className="p-4 font-semibold">Patient</th>
              <th className="p-4 font-semibold">Date & Time</th>
              <th className="p-4 font-semibold">Doctor / Dept</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map(apt => (
              <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-slate-900">{apt.patientName}</div>
                  <div className="text-xs text-slate-500">{apt.patientPhone}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {apt.date}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-500"><Clock className="w-3 h-3"/> {apt.time}</div>
                </td>
                <td className="p-4">
                  <div className="font-medium">{apt.doctorId || 'Any Doctor'}</div>
                  <div className="text-xs text-slate-500">{apt.department}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${apt.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                      apt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 
                      apt.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 
                      'bg-rose-100 text-rose-800'}`}>
                    {apt.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    value={apt.status} 
                    onChange={(e) => updateStatus(apt.id, e.target.value)}
                    className="bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No Show</option>
                  </select>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
