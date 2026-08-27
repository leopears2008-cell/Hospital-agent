const fs = require('fs');
let code = fs.readFileSync('src/components/UserAppointmentsModal.tsx', 'utf8');

const importTarget = `import { X, Calendar, Clock, MapPin, AlertCircle, CheckCircle2, Mail } from 'lucide-react';`;
const importReplacement = `import { X, Calendar, Clock, MapPin, AlertCircle, CheckCircle2, Mail, RefreshCw } from 'lucide-react';
import { AppointmentTableSkeleton } from './Skeletons';`;
code = code.replace(importTarget, importReplacement);

const targetRender = `          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-700">No appointments found</p>
                <p className="text-sm mt-1">Book an appointment from the dashboard or a hospital's page.</p>
              </div>
            ) : (`;

const replacementRender = `          <div className="p-6">
            {loading ? (
              <AppointmentTableSkeleton />
            ) : error ? (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
                <AlertCircle className="w-10 h-10 text-rose-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-rose-800 text-lg mb-1">Failed to load appointments</h3>
                  <p>{error}</p>
                </div>
                <button onClick={fetchAppointments} className="mt-2 px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-lg transition-colors flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
                <Calendar className="w-16 h-16 text-blue-200 mx-auto mb-4" />
                <p className="text-xl font-bold text-slate-800 mb-2">You don't have any upcoming appointments.</p>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">Discover top doctors and hospitals to schedule your first consultation.</p>
                <button onClick={onClose} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                  Book an Appointment
                </button>
              </div>
            ) : (`;

code = code.replace(targetRender, replacementRender);
fs.writeFileSync('src/components/UserAppointmentsModal.tsx', code);
