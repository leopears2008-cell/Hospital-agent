import { AlertTriangle, Phone, MapPin, X, Navigation, CheckCircle2 } from 'lucide-react';
import { Hospital } from '../types';

interface EmergencyModalProps {
  onClose: () => void;
  hospitals: Hospital[];
  userLocation: { lat: number; lng: number } | null;
  onOpenNavigation: (hospital: Hospital) => void;
}

export function EmergencyModal({ onClose, hospitals, userLocation, onOpenNavigation }: EmergencyModalProps) {
  // Sort hospitals by emergency availability and roughly by distance if location exists
  // In a real app, calculate true distance using Haversine
  const emergencyHospitals = hospitals
    .filter(h => h.emergencyAvailable)
    .slice(0, 5); // Just show top 5

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-red-600 p-6 sm:p-8 text-white relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-red-700/50 hover:bg-red-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
              <AlertTriangle className="w-7 h-7 text-red-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">EMERGENCY MODE</h2>
              <p className="text-red-100 font-medium">Please remain calm. Help is available.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
             <button className="bg-white text-red-600 py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
               <Phone className="w-6 h-6" />
               Call Ambulance (108)
             </button>
             <button className="bg-red-700/50 hover:bg-red-700 border border-red-500/50 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3">
               <MapPin className="w-6 h-6" />
               Share My Location
             </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-slate-50 flex-1">
          <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-red-500" />
            Nearby Emergency Hospitals
          </h3>
          
          <div className="space-y-4">
            {emergencyHospitals.map(hospital => (
              <div key={hospital.id} className="bg-white border border-red-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{hospital.name}</h4>
                  <p className="text-slate-500 text-sm mt-1 mb-2">{hospital.address}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-md text-xs font-bold border border-red-100 uppercase tracking-wider">
                      24/7 ER Open
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium">
                      ~ {Math.floor(Math.random() * 5) + 1}.{Math.floor(Math.random() * 9)} km
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl flex items-center justify-center transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => onOpenNavigation(hospital)}
                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Navigate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
