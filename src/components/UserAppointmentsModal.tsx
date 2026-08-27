import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, AlertCircle, CheckCircle2, Mail, RefreshCw } from 'lucide-react';
import { AppointmentTableSkeleton } from './Skeletons';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { TAMIL_NADU_HOSPITALS } from '../data/tamilNaduHospitals';
import { sendEmail } from '../lib/gmail';

interface UserAppointmentsModalProps {
  onClose: () => void;
}

export function UserAppointmentsModal({ onClose }: UserAppointmentsModalProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error("Authentication required");
      
      const q = query(collection(db, 'appointments'), where('userId', '==', firebaseUser.uid));
      const snapshot = await getDocs(q);
      const appts: any[] = [];
      snapshot.forEach(d => appts.push({ id: d.id, ...d.data() }));
      appts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setAppointments(appts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return;
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`/api/appointments/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
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
  };

  const handleSendEmail = async (app: any) => {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser || !firebaseUser.email) {
        alert("You must be logged in with an email to send confirmations.");
        return;
      }
      
      const hospitalName = getHospitalName(app.hospitalId);
      const emailSubject = `Appointment Details: ${hospitalName}`;
      const emailBody = `Dear ${app.patientName},\n\nHere are the details for your appointment at ${hospitalName}.\n\nDetails:\nDoctor: ${app.doctorId || app.department || 'Not specified'}\nDate: ${app.date}\nTime: ${app.time}\nStatus: ${app.status}\n\nThank you for using Hospital AI Agent.`;
      
      await sendEmail(firebaseUser.email, emailSubject, emailBody);
      alert("Appointment details sent to your Gmail successfully!");
    } catch (err) {
      alert("Failed to send email. Please check your Gmail connection.");
    }
  };

  const getHospitalName = (hospitalId: string) => {
    const h = TAMIL_NADU_HOSPITALS.find(h => h.id === hospitalId);
    return h ? h.name : 'Unknown Hospital';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">My Appointments</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No appointments found</h3>
              <p className="text-slate-500 text-sm mt-1">You haven't booked any appointments yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(app => (
                <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{getHospitalName(app.hospitalId)}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {app.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {app.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Patient: {app.patientName}</span>
                      </div>
                      {app.symptoms && (
                        <p className="text-sm text-slate-500 mt-3 border-t border-slate-100 pt-3">
                          <span className="font-medium text-slate-700">Symptoms:</span> {app.symptoms}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
                      {app.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                      {app.status === 'confirmed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                        </span>
                      )}
                      {app.status === 'cancelled' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                          <X className="w-3.5 h-3.5" /> Cancelled
                        </span>
                      )}

                      {app.status !== 'cancelled' && (
                        <div className="flex flex-col items-end gap-1 mt-2">
                          <button
                            onClick={() => handleSendEmail(app)}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" /> Email Details
                          </button>
                          <button
                            onClick={() => handleCancel(app.id)}
                            className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline"
                          >
                            Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
