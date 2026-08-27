import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Hospital, User, Appointment } from '../types';
import { Search, Calendar, HeartPulse, Activity, Bell, ChevronRight, Clock, AlertTriangle, UserPlus } from 'lucide-react';

interface DashboardProps {
  currentUser: User;
  hospitals: Hospital[];
  onOpenNavigation: (mode: 'map' | 'list' | 'doctors') => void;
  onOpenAi: () => void;
  onOpenAppointments: () => void;
  onEmergency: () => void;
}

export function Dashboard({ currentUser, hospitals, onOpenNavigation, onOpenAi, onOpenAppointments, onEmergency }: DashboardProps) {
  const [upcomingAppointment, setUpcomingAppointment] = useState<Appointment | null>(null);
  const [loadingAppt, setLoadingAppt] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const firebaseUser = auth.currentUser;
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
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingAppt(false);
      }
    };
    fetchUpcoming();
  }, [currentUser]);

  const recentlyViewed = hospitals.slice(0, 3);
  const nearbyHospitals = hospitals.slice(3, 6); // Mocked as nearby

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
          <div className="relative z-10 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Find the right healthcare, faster.
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Search hospitals, doctors, specialties, and book appointments instantly. Or let our AI guide you.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onOpenNavigation('list')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Search className="w-5 h-5" /> Find Hospitals
              </button>
              <button 
                onClick={onOpenAi}
                className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-6 py-3 rounded-xl font-bold transition-colors shadow-sm flex items-center gap-2"
              >
                <Activity className="w-5 h-5" /> Talk to AI
              </button>
            </div>
          </div>
          
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none"></div>
          
          <div className="hidden md:flex gap-4 relative z-10 mt-8 md:mt-0">
             <div className="bg-white/80 backdrop-blur border border-slate-100 p-4 rounded-2xl shadow-sm rotate-[-6deg] hover:rotate-0 transition-transform cursor-pointer" onClick={() => onOpenNavigation('doctors')}>
               <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-3">
                 <UserPlus className="w-6 h-6" />
               </div>
               <p className="font-bold text-slate-800">Find Doctor</p>
             </div>
             <div className="bg-white/80 backdrop-blur border border-slate-100 p-4 rounded-2xl shadow-sm rotate-[6deg] hover:rotate-0 transition-transform cursor-pointer" onClick={onEmergency}>
               <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
                 <AlertTriangle className="w-6 h-6" />
               </div>
               <p className="font-bold text-slate-800">Emergency</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Appointment */}
            {loadingAppt ? (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-pulse">
                <div className="h-6 w-1/3 bg-slate-200 rounded mb-6" />
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
                    <div className="h-5 w-48 bg-slate-200 rounded mb-6" />
                    <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
                    <div className="h-5 w-32 bg-slate-200 rounded" />
                  </div>
                  <div>
                    <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
                    <div className="h-5 w-48 bg-slate-200 rounded mb-6" />
                    <div className="h-10 w-full bg-slate-200 rounded-xl mt-6" />
                  </div>
                </div>
              </div>
            ) : upcomingAppointment && (
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-1 shadow-lg">
                <div className="bg-white/10 backdrop-blur-md rounded-[22px] p-6 text-white">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Calendar className="w-5 h-5 opacity-80" />
                      Upcoming Appointment
                    </h2>
                    <span className={`bg-white/20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${upcomingAppointment.status === 'pending' ? 'text-amber-200' : 'text-white'}`}>{upcomingAppointment.status}</span>
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
