import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, HeartPulse, FileText, Bell, ShieldAlert, Plus, ArrowRight, CheckCircle, MapPin, Search } from 'lucide-react';
import { useAuth } from '@clerk/react';
import { motion } from 'motion/react';

interface PatientDashboardProps {
  onOpenAppointments: () => void;
  onOpenAiAssistant: () => void;
}

export function PatientDashboard({ onOpenAppointments, onOpenAiAssistant }: PatientDashboardProps) {
  const { getToken } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getToken();
        const res = await fetch('/api/appointments', {
          headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
        });
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (err) {
        console.error("Failed to load dashboard appointments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [getToken]);

  const upcomingCount = appointments.filter(a => a.status !== 'cancelled' && a.status !== 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-300 animate-pulse" /> Patient Portal Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Welcome to Your Health Hub</h1>
          <p className="text-blue-100 text-sm max-w-xl">
            Manage your appointments, consult with top specialists across Tamil Nadu, and track your medical reports seamlessly.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 z-10">
          <button 
            onClick={onOpenAppointments}
            className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 text-sm cursor-pointer"
          >
            <Calendar className="w-4 h-4" /> View My Appointments ({upcomingCount})
          </button>
          <button 
            onClick={onOpenAiAssistant}
            className="bg-blue-800/80 hover:bg-blue-800 text-white border border-blue-400/30 font-bold px-5 py-3 rounded-2xl backdrop-blur-md transition-all flex items-center gap-2 text-sm cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-400" /> AI Symptom Checker
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{upcomingCount}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Bookings</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{appointments.length}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Consultations</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center font-bold">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">Normal</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Health Status</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">108 / 112</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emergency Helpline</div>
          </div>
        </div>
      </div>

      {/* Recent Appointments & Health Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Appointments</h2>
            <button 
              onClick={onOpenAppointments}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading your appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No appointments scheduled</p>
              <p className="text-xs text-slate-500 mt-1">Search for a hospital or doctor to book your first visit.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 3).map((app, index) => (
                <motion.div 
                  key={app.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{app.patientName}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{app.date} at {app.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                      app.status === 'cancelled' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}>
                      {app.status || 'Pending'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Health Advisory & AI Quick Access */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-blue-600/30 text-blue-400 rounded-xl flex items-center justify-center font-bold">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">AI Health Assistant</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Have questions about your symptoms or need specialist recommendations across Tamil Nadu? Chat with our medical AI assistant anytime.
            </p>
          </div>
          <button
            onClick={onOpenAiAssistant}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            Start AI Consultation <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
