import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Search, MapPin, Phone, Bed, Star, ShieldAlert, Building2, Navigation, Compass, ExternalLink, ShieldCheck, Award, MessageCircle } from 'lucide-react';
import { Hospital, SearchFilters } from '../types';
import { TAMIL_NADU_DISTRICTS, MEDICAL_SPECIALTIES } from '../data/tamilNaduHospitals';

interface HospitalListProps {
  hospitals: Hospital[];
  filters: SearchFilters;
  setFilters: Dispatch<SetStateAction<SearchFilters>>;
  onSelectHospital: (hospital: Hospital) => void;
  selectedHospitalId?: string;
  userLocation: { lat: number; lng: number } | null;
  onDetectLocation: () => void;
  locating: boolean;
  locError: string | null;
  onGetRoute: (hospital: Hospital) => void;
  routeLoading: boolean;
  onOpenNavigation: (hospital: Hospital) => void;
}

// Haversine formula helper
function calculateDrivingStats(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;
  
  const drivingKm = straightKm * 1.25;
  const minutes = Math.round((drivingKm / 35) * 60);

  return {
    distanceText: drivingKm < 1 ? `${Math.round(drivingKm * 1000)} m` : `${drivingKm.toFixed(1)} km`,
    timeText: minutes < 60 ? `${minutes} mins` : `${(minutes / 60).toFixed(1)} hrs`,
  };
}

export function HospitalList({
  hospitals,
  filters,
  setFilters,
  onSelectHospital,
  selectedHospitalId,
  userLocation,
  onDetectLocation,
  locating,
  locError,
  onGetRoute,
  routeLoading,
  onOpenNavigation,
}: HospitalListProps) {
  const [isSearching, setIsSearching] = useState(false);

  // Simulate network delay to show professional skeletons when filters change
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleWhatsApp = (e: React.MouseEvent, hospital: Hospital) => {
    e.stopPropagation();
    const text = encodeURIComponent(`Hello ${hospital.name}, I would like to inquire about booking an appointment.`);
    const targetNumber = hospital.whatsappNumber || hospital.contactNumber;
    const cleanNumber = targetNumber.replace(/\D/g, '');
    const finalNumber = cleanNumber.length === 10 ? '91' + cleanNumber : cleanNumber;
    const whatsappUrl = `https://wa.me/${finalNumber}?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] border-r border-slate-200 overflow-hidden font-sans">
      {/* Search & Filter Controls */}
      <div className="p-4 bg-white border-b border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hospitals by name, city, or specialty..."
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <button
            onClick={onDetectLocation}
            disabled={locating}
            className={`px-3 py-2 rounded text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs ${
              userLocation ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
            title="Use My Current Location"
          >
            <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Locating...' : userLocation ? 'Location Active' : 'My Location'}</span>
          </button>
        </div>

        {locError && (
          <p className="text-[11px] text-rose-600 font-medium">{locError}</p>
        )}

        <div className="grid grid-cols-2 gap-2">
          {/* District Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">District</label>
            <select
              value={filters.district}
              onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
              className="w-full py-1.5 px-3 bg-slate-100 border border-slate-200 rounded text-xs text-slate-800 font-medium focus:bg-white focus:border-blue-500 outline-none"
            >
              {TAMIL_NADU_DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Specialty Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Specialty</label>
            <select
              value={filters.specialty}
              onChange={(e) => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
              className="w-full py-1.5 px-3 bg-slate-100 border border-slate-200 rounded text-xs text-slate-800 font-medium focus:bg-white focus:border-blue-500 outline-none"
            >
              {MEDICAL_SPECIALTIES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, emergencyOnly: !prev.emergencyOnly }))}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                filters.emergencyOnly 
                  ? 'bg-rose-100 text-rose-700 border border-rose-200 shadow-xs' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" /> 24/7 ER
            </button>
            <select
              value={filters.hospitalType}
              onChange={(e) => setFilters(prev => ({ ...prev, hospitalType: e.target.value }))}
              className="py-1.5 px-2.5 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Trust/Charitable">Trust / Charitable</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-bold">
            {hospitals.length} Results
          </span>
        </div>
      </div>

      {/* Hospital List Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isSearching ? (
          // Skeleton Loading State
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white p-4 rounded border border-slate-200 animate-pulse">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="h-4 w-16 bg-slate-200 rounded-full"></div>
                    <div className="h-4 w-20 bg-slate-200 rounded"></div>
                  </div>
                  <div className="h-5 w-3/4 bg-slate-200 rounded mb-1"></div>
                </div>
                <div className="h-6 w-10 bg-slate-200 rounded"></div>
              </div>
              <div className="h-3 w-full bg-slate-200 rounded mb-4"></div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="h-4 w-12 bg-slate-200 rounded"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-14 bg-slate-200 rounded"></div>
                  <div className="h-6 w-14 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : hospitals.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 mb-1">No hospitals found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search filters or district selection.</p>
          </div>
        ) : (
          hospitals.map((hospital) => {
            const isSelected = selectedHospitalId === hospital.id;
            const drivingStats = userLocation ? calculateDrivingStats(userLocation.lat, userLocation.lng, hospital.lat, hospital.lng) : null;

            return (
              <div
                key={hospital.id}
                onClick={() => onSelectHospital(hospital)}
                className={`bg-white p-4 rounded border transition-all cursor-pointer text-left shadow-xs ${
                  isSelected 
                    ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/20' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        hospital.type === 'Government' ? 'bg-blue-100 text-blue-700' :
                        hospital.type === 'Trust/Charitable' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {hospital.type}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        {hospital.cityOrDistrict}
                      </span>
                      {hospital.emergencyAvailable && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">
                          Open 24/7
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight hover:text-blue-600 transition-colors flex items-center gap-1.5 flex-wrap">
                      {hospital.name}
                      {hospital.verified && (
                        <ShieldCheck className="w-4 h-4 text-blue-500" title="Verified Hospital" />
                      )}
                      {hospital.centerOfExcellence && (
                        <Award className="w-4 h-4 text-amber-500" title="Center of Excellence" />
                      )}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-bold shrink-0 border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{hospital.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-1 mb-2.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{hospital.address}</span>
                </p>

                {drivingStats && (
                  <div className="mb-3">
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-xs flex items-center gap-1.5 inline-flex">
                      <Compass className="w-3.5 h-3.5 text-emerald-600" /> Driving: {drivingStats.distanceText} ({drivingStats.timeText})
                    </span>
                  </div>
                )}

                {hospital.currentOccupancyRate !== undefined && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      <span className="text-slate-500">Current Occupancy</span>
                      <span className={
                        hospital.currentOccupancyRate > 85 ? 'text-rose-600' : 
                        hospital.currentOccupancyRate > 65 ? 'text-amber-600' : 'text-emerald-600'
                      }>
                        {hospital.currentOccupancyRate > 85 ? 'High / Busy' : 
                         hospital.currentOccupancyRate > 65 ? 'Moderate' : 'Low / Available'} ({hospital.currentOccupancyRate}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          hospital.currentOccupancyRate > 85 ? 'bg-rose-500' : 
                          hospital.currentOccupancyRate > 65 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${hospital.currentOccupancyRate}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-blue-600" /> {hospital.bedCapacity}
                  </span>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleWhatsApp(e, hospital)}
                      className="bg-green-500 hover:bg-green-600 text-white px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors shadow-2xs"
                      title="Book via WhatsApp"
                    >
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </button>
                    <button
                      onClick={() => onGetRoute(hospital)}
                      disabled={routeLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <Navigation className="w-3 h-3" /> Route
                    </button>
                    <button
                      onClick={() => onOpenNavigation(hospital)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors"
                      title="Navigate on OpenStreetMap"
                    >
                      <ExternalLink className="w-3 h-3" /> Map
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
