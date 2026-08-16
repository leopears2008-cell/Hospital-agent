import { useState, FormEvent } from 'react';
import { X, Calendar, Clock, User as UserIcon, FileText, CheckCircle } from 'lucide-react';
import { Hospital, User } from '../types';
import { auth } from '../lib/firebase';

interface AppointmentModalProps {
  hospital: Hospital;
  currentUser: User | null;
  onClose: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export function AppointmentModal({ hospital, currentUser, onClose, onOpenAuth }: AppointmentModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [symptoms, setSymptoms] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error("Authentication required");
      const token = await firebaseUser.getIdToken();

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hospitalId: hospital.id,
          patientName,
          date,
          time,
          symptoms,
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to book appointment.');
      }
      setSuccess(true);
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
        <div className="bg-white rounded-lg max-w-sm w-full p-6 text-center shadow-xl">
          <h2 className="text-xl font-bold mb-3">Sign in Required</h2>
          <p className="text-slate-600 mb-6 text-sm">You must be signed in to book an appointment.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={onClose} className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-100 rounded">Cancel</button>
            <button onClick={() => { onClose(); onOpenAuth('login'); }} className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700">Login Now</button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center shadow-xl flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Appointment Requested</h2>
          <p className="text-slate-600 mb-6 text-sm">
            Your appointment request at <strong>{hospital.name}</strong> for {date} at {time} has been sent successfully. The hospital will confirm it shortly.
          </p>
          <button onClick={onClose} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded transition-colors">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-2xl relative">
        <div className="bg-blue-600 text-white p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-blue-200 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">Book Appointment</h2>
          <p className="text-blue-100 text-sm mt-1">{hospital.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-rose-50 text-rose-700 p-3 rounded text-sm">{error}</div>}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Patient Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded focus:border-blue-500 outline-none text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded focus:border-blue-500 outline-none text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input
                  type="time"
                  required
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded focus:border-blue-500 outline-none text-slate-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Symptoms / Reason</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                rows={3}
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="Briefly describe your symptoms..."
                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded focus:border-blue-500 outline-none text-slate-900 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded shadow mt-4"
          >
            {loading ? 'Submitting...' : 'Request Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
