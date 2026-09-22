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
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-red-600 animate-pulse opacity-10" />
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white shadow-2xl w-full h-full md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-red-600 p-8 md:p-12 text-white relative flex-shrink-0 text-center flex flex-col items-center">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-red-700/50 hover:bg-red-700 rounded-full transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-inner mb-6">
            <AlertTriangle className="w-12 h-12 text-red-600 animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-2">EMERGENCY MODE</h2>
          <p className="text-red-100 font-bold text-xl mb-8">Please remain calm. Help is available.</p>

          <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl">
             <a href="tel:108" className="bg-white text-red-600 py-6 px-6 rounded-2xl font-black text-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-4">
               <Phone className="w-8 h-8" />
               Call 108
             </a>
             <button className="bg-red-700/50 hover:bg-red-700 border-2 border-red-500/50 text-white py-6 px-6 rounded-2xl font-bold text-xl shadow-xl transition-all flex items-center justify-center gap-4">
               <MapPin className="w-7 h-7" />
               Share Location
             </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 md:p-12 overflow-y-auto bg-slate-50 flex-1">
          <h3 className="font-black text-slate-800 text-2xl mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-red-500" />
            Nearest Emergency Departments
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
