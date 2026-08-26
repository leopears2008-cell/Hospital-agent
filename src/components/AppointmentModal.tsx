import { useState, FormEvent, useEffect } from 'react';
import { X, Calendar, Clock, User as UserIcon, FileText, CheckCircle, ChevronRight, ChevronLeft, MapPin, Search, QrCode } from 'lucide-react';
import { Hospital, User, Doctor } from '../types';
import { auth } from '../lib/firebase';
import { sendEmail } from '../lib/gmail';
import { MOCK_DOCTORS } from '../data/doctors';

interface AppointmentModalProps {
  hospital: Hospital;
  currentUser: User | null;
  onClose: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export function AppointmentModal({ hospital, currentUser, onClose, onOpenAuth }: AppointmentModalProps) {
  const [step, setStep] = useState(1);
  
  const [department, setDepartment] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientAge, setPatientAge] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [sendEmailConfirmation, setSendEmailConfirmation] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [appointmentId, setAppointmentId] = useState('');

  // Extract unique departments from doctors
  const departments = Array.from(new Set(MOCK_DOCTORS.map(d => d.department)));
  const availableDoctors = MOCK_DOCTORS.filter(d => !department || d.department === department);
  const selectedDoctor = MOCK_DOCTORS.find(d => d.id === doctorId);

  const handleNext = () => {
    setError('');
    if (step === 1 && !department) { setError('Please select a department.'); return; }
    if (step === 2 && !doctorId) { setError('Please select a doctor.'); return; }
    if (step === 3 && (!date || !time)) { setError('Please select both date and time.'); return; }
    if (step === 4 && (!patientName || !patientAge || !patientPhone)) { setError('Please fill all required patient details.'); return; }
    
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
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
      
      const aptId = data.appointment?.id || `APT-${Math.floor(Math.random() * 100000)}`;
      setAppointmentId(aptId);
      setSuccess(true);
      
      // Try to send confirmation email
      if (currentUser?.email && sendEmailConfirmation) {
        try {
          const emailSubject = `Appointment Confirmed: ${hospital.name}`;
          const emailBody = `Dear ${patientName},\n\nYour appointment at ${hospital.name} has been confirmed.\n\nDetails:\nDoctor: ${selectedDoctor?.name || department}\nDate: ${date}\nTime: ${time}\nAppointment ID: ${aptId}\n\nPlease arrive 15 minutes before your scheduled time.\n\nThank you for using Hospital AI Agent.`;
          await sendEmail(currentUser.email, emailSubject, emailBody);
          console.log("Confirmation email sent.");
        } catch (emailErr) {
          console.error("Failed to send confirmation email:", emailErr);
        }
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center shadow-2xl">
          <h2 className="text-xl font-bold mb-3 text-slate-800">Sign in Required</h2>
          <p className="text-slate-500 mb-8 text-sm">You must be signed in to book an appointment.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={onClose} className="flex-1 px-4 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
            <button onClick={() => { onClose(); onOpenAuth('login'); }} className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors">Login Now</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 shrink-0 relative flex items-center gap-4 border-b border-slate-800">
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Book Appointment</h2>
            <p className="text-slate-400 text-xs font-medium mt-0.5">{hospital.name}</p>
          </div>
        </div>

        {/* Success State */}
        {success ? (
          <div className="p-10 text-center flex-1 overflow-y-auto bg-slate-50 flex flex-col items-center justify-center">
             <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-200">
               <CheckCircle className="w-10 h-10" />
             </div>
             <h3 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h3>
             <p className="text-slate-500 mb-6 max-w-md">Your appointment with {selectedDoctor?.name} is scheduled for {date} at {time}. Please arrive 15 minutes early.</p>
             
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 w-full max-w-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-400"></div>
               <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">Booking Reference</div>
               <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                    <QrCode className="w-16 h-16 text-slate-400 opacity-50" />
                  </div>
               </div>
               <div className="text-2xl font-black text-slate-800 tracking-widest">{appointmentId}</div>
             </div>

             <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
               <button 
                 onClick={async () => {
                   if (currentUser?.email) {
                     try {
                       const emailSubject = `Appointment Confirmed: ${hospital.name}`;
                       const emailBody = `Dear ${patientName},\n\nYour appointment at ${hospital.name} has been confirmed.\n\nDetails:\nDoctor: ${selectedDoctor?.name || department}\nDate: ${date}\nTime: ${time}\nAppointment ID: ${appointmentId}\n\nPlease arrive 15 minutes before your scheduled time.\n\nThank you for using Hospital AI Agent.`;
                       await sendEmail(currentUser.email, emailSubject, emailBody);
                       alert("Confirmation email sent successfully!");
                     } catch (err) {
                       alert("Failed to send email. Please check your Gmail connection.");
                     }
                   }
                 }}
                 className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-6 rounded-xl border border-slate-200 transition-colors shadow-sm flex items-center justify-center gap-2"
               >
                 <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                 </svg>
                 Send to Gmail
               </button>
               <button onClick={onClose} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg">
                 Done
               </button>
             </div>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="bg-slate-50 px-6 py-4 shrink-0 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className={step >= 1 ? 'text-blue-600' : ''}>1. Dept</span>
              <ChevronRight className="w-3 h-3 opacity-30" />
              <span className={step >= 2 ? 'text-blue-600' : ''}>2. Doctor</span>
              <ChevronRight className="w-3 h-3 opacity-30" />
              <span className={step >= 3 ? 'text-blue-600' : ''}>3. Time</span>
              <ChevronRight className="w-3 h-3 opacity-30" />
              <span className={step >= 4 ? 'text-blue-600' : ''}>4. Details</span>
              <ChevronRight className="w-3 h-3 opacity-30" />
              <span className={step >= 5 ? 'text-blue-600' : ''}>5. Verify</span>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              {error && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100 flex items-center gap-2 animate-in fade-in"><X className="w-4 h-4" />{error}</div>}
              
              {/* Step 1: Department */}
              {step === 1 && (
                <div className="animate-in slide-in-from-right-4 fade-in">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Select Department</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {departments.map(dept => (
                      <button 
                        key={dept}
                        onClick={() => setDepartment(dept)}
                        className={`p-4 rounded-xl border-2 text-left font-bold transition-all ${department === dept ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-slate-300 text-slate-600'}`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Doctor */}
              {step === 2 && (
                <div className="animate-in slide-in-from-right-4 fade-in">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Select Doctor</h3>
                  <div className="space-y-3">
                    {availableDoctors.map(doc => (
                      <div 
                        key={doc.id}
                        onClick={() => setDoctorId(doc.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${doctorId === doc.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}
                      >
                        <img src={doc.photo} alt={doc.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                        <div className="flex-1">
                          <h4 className={`font-bold ${doctorId === doc.id ? 'text-blue-700' : 'text-slate-800'}`}>{doc.name}</h4>
                          <p className="text-xs text-slate-500 font-medium">{doc.qualification} • {doc.experienceYears} yrs exp</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-slate-800">₹{doc.consultationFee}</div>
                          <div className="text-[10px] text-amber-500 font-bold flex items-center justify-end gap-1">★ {doc.rating}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Date & Time */}
              {step === 3 && selectedDoctor && (
                <div className="animate-in slide-in-from-right-4 fade-in">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Select Date & Time</h3>
                  <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                    <img src={selectedDoctor.photo} alt={selectedDoctor.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{selectedDoctor.name}</div>
                      <div className="text-xs text-slate-500">Available: {selectedDoctor.availableDays.join(', ')}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Date</label>
                      <input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Available Time Slots</label>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedDoctor.availableTimeSlots.map(t => (
                          <button
                            key={t}
                            onClick={() => setTime(t)}
                            className={`py-2 px-1 text-xs font-bold rounded-lg border-2 transition-all ${time === t ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Patient Details */}
              {step === 4 && (
                <div className="animate-in slide-in-from-right-4 fade-in">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Patient Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name *</label>
                      <input 
                        type="text" value={patientName} onChange={e => setPatientName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Patient's name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Age *</label>
                        <input 
                          type="number" value={patientAge} onChange={e => setPatientAge(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Years"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone *</label>
                        <input 
                          type="tel" value={patientPhone} onChange={e => setPatientPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium" placeholder="10 digit number"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Symptoms / Reason (Optional)</label>
                      <textarea 
                        value={symptoms} onChange={e => setSymptoms(e.target.value)} rows={3}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium resize-none" placeholder="Briefly describe your condition..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Verify & Confirm */}
              {step === 5 && selectedDoctor && (
                <div className="animate-in slide-in-from-right-4 fade-in">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Review Booking</h3>
                  
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <div>
                        <div className="text-xs text-slate-500 font-bold uppercase">Hospital</div>
                        <div className="font-bold text-slate-800">{hospital.name}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <div>
                        <div className="text-xs text-slate-500 font-bold uppercase">Doctor</div>
                        <div className="font-bold text-slate-800">{selectedDoctor.name} ({selectedDoctor.department})</div>
                      </div>
                      <img src={selectedDoctor.photo} alt={selectedDoctor.name} className="w-10 h-10 rounded-full" />
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <div>
                        <div className="text-xs text-slate-500 font-bold uppercase">Date & Time</div>
                        <div className="font-bold text-slate-800">{date} at {time}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="font-bold text-slate-800">Consultation Fee</div>
                      <div className="text-xl font-black text-slate-800">₹{selectedDoctor.consultationFee}</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <input
                      type="checkbox"
                      id="emailConfirm"
                      checked={sendEmailConfirmation}
                      onChange={(e) => setSendEmailConfirmation(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="emailConfirm" className="text-sm font-medium text-slate-700">
                      Send me an email confirmation
                    </label>
                  </div>

                  <p className="text-xs text-slate-500 text-center mt-4">By confirming, you agree to pay the consultation fee at the hospital desk.</p>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-slate-100 flex justify-between shrink-0">
              {step > 1 ? (
                <button onClick={handleBack} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <button onClick={onClose} className="px-6 py-3 text-slate-400 font-bold hover:bg-slate-50 rounded-xl transition-colors">
                  Cancel
                </button>
              )}

              {step < 5 ? (
                <button onClick={handleNext} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-md transition-all flex items-center gap-2">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 disabled:opacity-70">
                  {loading ? 'Confirming...' : 'Confirm Booking'}
                </button>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
