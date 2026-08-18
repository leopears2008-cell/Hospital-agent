import { useState } from 'react';
import { Hospital, User, Appointment } from '../types';
import { Search, Calendar, HeartPulse, Activity, Bell, ChevronRight, Clock, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  currentUser: User;
  hospitals: Hospital[];
  onOpenNavigation: (mode: 'map' | 'list') => void;
  onOpenAi: () => void;
  onOpenAppointments: () => void;
  onEmergency: () => void;
}

export function Dashboard({ currentUser, hospitals, onOpenNavigation, onOpenAi, onOpenAppointments, onEmergency }: DashboardProps) {
  // Mock data for demonstration
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
  };

  const recentlyViewed = hospitals.slice(0, 3);
  const nearbyHospitals = hospitals.slice(3, 6); // Mocked as nearby

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Welcome */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Good morning, {currentUser.name.split(' ')[0]}</h1>
            <p className="text-slate-500 mt-1">Here is your health overview for today.</p>
          </div>
          <button 
            onClick={onEmergency}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-full font-bold hover:bg-red-100 transition-colors border border-red-200"
          >
            <AlertTriangle className="w-5 h-5" />
            Emergency Mode
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => onOpenNavigation('list')} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all flex flex-col items-center justify-center gap-3 text-slate-700 hover:text-blue-600 group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <span className="font-semibold text-sm">Find Hospital</span>
          </button>
          
          <button onClick={() => onOpenNavigation('list')} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:teal-100 transition-all flex flex-col items-center justify-center gap-3 text-slate-700 hover:text-teal-600 group">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="font-semibold text-sm">Book Visit</span>
          </button>

          <button onClick={onOpenAi} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-purple-100 transition-all flex flex-col items-center justify-center gap-3 text-slate-700 hover:text-purple-600 group">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <span className="font-semibold text-sm">Ask AI</span>
          </button>

          <button onClick={onOpenAppointments} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-orange-100 transition-all flex flex-col items-center justify-center gap-3 text-slate-700 hover:text-orange-600 group">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <span className="font-semibold text-sm">History</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Appointment */}
            {upcomingAppointment && (
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-1 shadow-lg">
                <div className="bg-white/10 backdrop-blur-md rounded-[22px] p-6 text-white">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Calendar className="w-5 h-5 opacity-80" />
                      Upcoming Appointment
                    </h2>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">Confirmed</span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 items-end">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">Date & Time</p>
                      <p className="font-semibold text-lg">{upcomingAppointment.date} at {upcomingAppointment.time}</p>
                      <p className="text-blue-100 text-sm mt-4 mb-1">Department</p>
                      <p className="font-semibold">{upcomingAppointment.department}</p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm mb-1">Hospital</p>
                      <p className="font-semibold truncate">{hospitals.find(h => h.id === upcomingAppointment.hospitalId)?.name}</p>
                      <button onClick={onOpenAppointments} className="mt-6 w-full bg-white text-blue-700 font-bold py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nearby Hospitals */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Nearby Emergency Centers</h2>
                <button onClick={() => onOpenNavigation('map')} className="text-blue-600 font-medium text-sm flex items-center hover:underline">
                  View Map <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {nearbyHospitals.map(hospital => (
                  <div key={hospital.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex gap-4" onClick={() => onOpenNavigation('list')}>
                    <div className="w-16 h-16 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden relative">
                      {hospital.images?.[0] ? (
                        <img src={hospital.images[0]} alt={hospital.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HeartPulse className="w-6 h-6 text-slate-300" />
                        </div>
                      )}
                      {hospital.verified && (
                        <div className="absolute top-1 right-1 bg-blue-500 w-3 h-3 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate">{hospital.name}</h3>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{hospital.address}</p>
                      <div className="flex items-center mt-2 text-xs font-medium">
                        <span className="text-teal-600 bg-teal-50 px-2 py-0.5 rounded flex items-center">
                          ~ 3.2 km
                        </span>
                        {hospital.emergencyAvailable && (
                          <span className="ml-2 text-red-600 bg-red-50 px-2 py-0.5 rounded flex items-center">
                            Emergency
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Notifications */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-slate-400" />
                Notifications
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3 pb-4 border-b border-slate-50">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">Appointment Reminder</p>
                    <p className="text-xs text-slate-500 mt-0.5">Your cardiology visit is tomorrow at 10:30 AM.</p>
                  </div>
                </div>
                <div className="flex gap-3 pb-4 border-b border-slate-50">
                  <div className="w-2 h-2 mt-2 rounded-full bg-slate-300 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">Profile Updated</p>
                    <p className="text-xs text-slate-500 mt-0.5">Emergency contact details were saved successfully.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recently Viewed */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Recently Viewed</h2>
              <div className="space-y-4">
                {recentlyViewed.map(hospital => (
                  <div key={hospital.id} className="flex gap-3 items-center group cursor-pointer" onClick={() => onOpenNavigation('list')}>
                     <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-blue-200 transition-colors">
                        <HeartPulse className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-600 transition-colors">{hospital.name}</p>
                        <p className="text-xs text-slate-500 truncate">{hospital.specialty}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
