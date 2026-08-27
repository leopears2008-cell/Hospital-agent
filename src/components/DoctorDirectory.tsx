import { useState } from 'react';
import { Doctor, Hospital, User } from '../types';
import { MOCK_DOCTORS } from '../data/doctors';
import { TAMIL_NADU_HOSPITALS } from '../data/tamilNaduHospitals';
import { Search, Star, MapPin, Calendar, Clock, Stethoscope, ChevronRight } from 'lucide-react';
import { AppointmentModal } from './AppointmentModal';

interface DoctorDirectoryProps {
  currentUser: User;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export function DoctorDirectory({ currentUser, onOpenAuth }: DoctorDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState<{doctor: Doctor, hospital: Hospital} | null>(null);

  const specialties = ['All', ...Array.from(new Set(MOCK_DOCTORS.map(d => d.specialization)))];

  const filteredDoctors = MOCK_DOCTORS.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || d.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden w-full">
      <div className="bg-white border-b border-slate-200 p-6 shadow-sm z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Find a Doctor</h1>
            <p className="text-slate-500 mt-1">Search and book appointments with top specialists.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search doctors..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <select 
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              {specialties.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => {
            const hospital = TAMIL_NADU_HOSPITALS.find(h => h.id === doctor.hospitalId);
            if (!hospital) return null;

            return (
              <div key={doctor.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-4 items-start mb-4">
                  <img src={doctor.photo} alt={doctor.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100" />
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium text-sm flex items-center gap-1">
                      <Stethoscope className="w-4 h-4" /> {doctor.specialization}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-sm font-bold text-amber-500">
                      <Star className="w-4 h-4 fill-amber-500" />
                      {doctor.rating}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <span>{hospital.name}, {hospital.cityOrDistrict}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <Stethoscope className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{doctor.experienceYears} Years Experience</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <span className="truncate">{doctor.availableDays.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-xs text-slate-500">Consultation Fee</p>
                    <p className="font-bold text-slate-800">₹{doctor.consultationFee}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedDoctor({ doctor, hospital })}
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    Book <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredDoctors.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-xl font-bold text-slate-800 mb-2">No doctors found</p>
            <p className="text-slate-500">Try changing your search or filters to see more results.</p>
          </div>
        )}
      </div>

      {selectedDoctor && (
        <AppointmentModal
          hospital={selectedDoctor.hospital}
          currentUser={currentUser}
          onClose={() => setSelectedDoctor(null)}
          onOpenAuth={onOpenAuth}
        />
      )}
    </div>
  );
}
