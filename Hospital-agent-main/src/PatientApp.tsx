import { supabase } from './lib/supabase';
import { useState, useEffect, useMemo } from 'react';

import { Hospital, SearchFilters, User } from './types';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { HospitalMap } from './components/HospitalMap';
import { HospitalList } from './components/HospitalList';
import { HospitalModal } from './components/HospitalModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { UserAppointmentsModal } from './components/UserAppointmentsModal';
import { LandingPage } from './components/LandingPage';
import AIChatbot from './components/AIChatbot';
import { SideMenu } from './components/SideMenu';
import { Dashboard } from './components/Dashboard';
import { DoctorDirectory } from './components/DoctorDirectory';
import { AdminDashboard } from './components/AdminDashboard';
import { NotFound } from './components/NotFound';
import { DoctorDashboard } from './components/DoctorDashboard';

import { EmergencyModal } from './components/EmergencyModal';
import { useAuthGuard } from './lib/auth-guard';
import { useAuth } from '@clerk/react';

export default function PatientApp() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const [allHospitals, setAllHospitals] = useState<Hospital[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [features, setFeatures] = useState({
    aiAssistant: true,
    onlineConsultation: true,
    patientRegistration: true
  });
  
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'features')
        .single();
      if (data) {
        // Exclude the id field if we just want features
        const { id, ...featureData } = data;
        setFeatures(featureData as any);
      }
    };
    fetchSettings();

    const channel = supabase
      .channel('settings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings', filter: 'id=eq.features' },
        (payload) => {
          const payloadNew = payload.new as any;
          const { id, ...featureData } = payloadNew;
          setFeatures(featureData as any);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    district: 'All Tamil Nadu',
    specialty: 'All Specialties',
    hospitalType: 'All',
    emergencyOnly: false,
  });

  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);

  const handleAiAction = (action: any) => {
    if (!action) return;
    switch (action.type) {
      case 'find_doctors':
      case 'book_appointment':
        setViewMode('doctors');
        break;
      case 'find_hospitals':
        setViewMode('list');
        if (action.payload) {
          setFilters(prev => ({
            ...prev,
            district: action.payload.district || prev.district,
            specialty: action.payload.specialty || prev.specialty
          }));
        }
        break;
    }
  };
  const [viewMode, setViewMode] = useState<'dashboard' | 'split' | 'map' | 'list' | 'doctors' | 'admin' | 'doctorDashboard' | '404'>(window.location.pathname === '/' ? 'dashboard' : '404');

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/') setViewMode('dashboard');
      else setViewMode('404');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [savedHospitalIds, setSavedHospitalIds] = useState<string[]>([]);

  // Geolocation and OSRM Routing states
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [routeLoading, setRouteLoading] = useState(false);
  
  // Auth state persisted in localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  

  // Auth state from guard
  const { user, role, loading: loadingAuth, doctorId } = useAuthGuard();

  useEffect(() => {
    if (user && role) {
      setCurrentUser({
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        role: role as any,
        doctorId
      });
      if (role === 'admin') {
        window.location.href = '/admin/dashboard';
      }
    } else {
      setCurrentUser(null);
    }
  }, [user, role, doctorId]);

  const handleLogout = async () => {
    
    window.location.href = '/';
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        if (typeof lat === 'number' && !isNaN(lat) && typeof lng === 'number' && !isNaN(lng)) {
          setUserLocation({ lat, lng });
        } else {
          setLocError('Invalid coordinates received from device.');
        }
        setLocating(false);
      },
      (error: any) => {
        console.warn("Mount location error:", error.message || error);
        setLocError('Unable to retrieve your location. Please check permissions.');
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  async function getRoute(hospital: Hospital) {
    let currentLoc = userLocation;
    if (!currentLoc) {
      if (!navigator.geolocation) {
        setLocError("Geolocation is not supported by this browser.");
        return;
      }
      setLocating(true);
      try {
        const pos: GeolocationPosition = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true,
          });
        });
        currentLoc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        if (typeof currentLoc.lat === 'number' && !isNaN(currentLoc.lat) && typeof currentLoc.lng === 'number' && !isNaN(currentLoc.lng)) {
          setUserLocation(currentLoc);
        } else {
          throw new Error('Invalid coordinates');
        }
      } catch (err: any) {
        console.warn("Location error:", err.message || err);
        setLocError("Please allow your location to calculate routes.");
        setLocating(false);
        return;
      }
      setLocating(false);
    }

    setRouteLoading(true);

    try {
      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${currentLoc.lng},${currentLoc.lat};` +
        `${hospital.lng},${hospital.lat}` +
        `?overview=full&geometries=geojson`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Routing service failed");
      }

      const data = await response.json();
      if (!data.routes?.length) {
        throw new Error("No route found");
      }

      const coordinates = data.routes[0].geometry.coordinates
        .map((coordinate: [number, number]) => [coordinate[1], coordinate[0]] as [number, number])
        .filter((coord: [number, number]) => !isNaN(coord[0]) && !isNaN(coord[1]));

      setRoute(coordinates);
      setSelectedHospital(hospital);
      if (viewMode === 'list') {
        setViewMode('split');
      }
    } catch (error: any) {
      console.error("Route calculation error:", error.message || error);
      setLocError("Unable to calculate driving route.");
    } finally {
      setRouteLoading(false);
    }
  }

  function openNavigation(hospital: Hospital) {
    // If we have precise coordinates from the app, use them. 
    // Otherwise, omit origin so Google Maps automatically uses the device's live GPS location.
    let url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;
    
    if (userLocation?.lat && userLocation?.lng) {
      url += `&origin=${userLocation.lat},${userLocation.lng}`;
    }

    window.open(url, "_blank");
  }

  // Filter hospitals based on search filters
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesQuery = 
        h.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        h.cityOrDistrict.toLowerCase().includes(filters.query.toLowerCase()) ||
        h.specialty.toLowerCase().includes(filters.query.toLowerCase()) ||
        h.address.toLowerCase().includes(filters.query.toLowerCase());

      const matchesDistrict = filters.district === 'All Tamil Nadu' || h.cityOrDistrict.toLowerCase().includes(filters.district.toLowerCase());
      const matchesSpecialty = filters.specialty === 'All Specialties' || h.specialty.toLowerCase().includes(filters.specialty.toLowerCase());
      const matchesType = filters.hospitalType === 'All' || h.type === filters.hospitalType;
      const matchesEmergency = !filters.emergencyOnly || h.emergencyAvailable;

      return matchesQuery && matchesDistrict && matchesSpecialty && matchesType && matchesEmergency;
    });
  }, [hospitals, filters]);

  const toggleSaveHospital = (hospital: Hospital) => {
    setSavedHospitalIds(prev => 
      prev.includes(hospital.id) ? prev.filter(id => id !== hospital.id) : [...prev, hospital.id]
    );
  };

  if (currentPath !== '/') {
    return (
      <NotFound onGoHome={() => {
        window.history.pushState({}, '', '/');
        setCurrentPath('/');
      }} />
    );
  }

  const { isLoaded, userId } = useAuth();
  
  if (!isLoaded) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <>
        <LandingPage onOpenAuth={(mode) => setAuthModalMode(mode)} />
        <AuthModal 
          isOpen={authModalMode !== null} 
          onClose={() => setAuthModalMode(null)} 
          initialView={authModalMode || 'login'} 
        />
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar
        onOpenSideMenu={() => setIsSideMenuOpen(true)}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode as any}
        totalHospitals={allHospitals.length}
        currentUser={currentUser}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        onLogout={handleLogout}
        onOpenAppointments={() => setIsAppointmentsModalOpen(true)}
      />
      <main className="flex-1 flex overflow-hidden relative bg-slate-100">
        {viewMode === 'dashboard' && currentUser?.role !== 'doctor' && (
          <Dashboard 
            hospitals={allHospitals} 
            onOpenNavigation={(mode) => setViewMode(mode as any)} 
            currentUser={currentUser}
            onOpenAi={() => setIsAiModalOpen(true)}
            onOpenAppointments={() => setIsAppointmentsModalOpen(true)}
            onEmergency={() => setIsEmergencyModalOpen(true)}
          />
        )}
        {viewMode === 'doctors' && (
          <DoctorDirectory
            currentUser={currentUser}
            onOpenAuth={() => {}}
          />
        )}
        {viewMode === 'doctorDashboard' && currentUser?.role === 'doctor' && (
          <DoctorDashboard currentUser={currentUser} />
        )}
        
        {viewMode === '404' && (
          <NotFound onGoHome={() => setViewMode('dashboard')} />
        )}

        {/* List View / Split View Sidebar */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div className={`${viewMode === 'split' ? 'w-full md:w-96 lg:w-[420px]' : 'w-full'} h-full shrink-0 z-10`}>
            <HospitalList
              hospitals={filteredHospitals}
              allHospitals={allHospitals}
              filters={filters}
              setFilters={setFilters}
              onSelectHospital={(h) => setSelectedHospital(h)}
              selectedHospitalId={selectedHospital?.id}
              userLocation={userLocation}
              onDetectLocation={handleDetectLocation}
              locating={locating}
              locError={locError}
              onGetRoute={getRoute}
              routeLoading={routeLoading}
              onOpenNavigation={openNavigation}
            />
          </div>
        )}

        {/* Map View / Split View Main Area (Leaflet + OSRM) */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className={`${viewMode === 'split' ? 'hidden md:block flex-1' : 'w-full'} h-full relative p-2 bg-slate-100`}>
            <HospitalMap
              hospitals={filteredHospitals}
              selectedHospital={selectedHospital}
              onSelectHospital={(h) => setSelectedHospital(h)}
              userLocation={userLocation}
              route={route}
              onGetRoute={getRoute}
              routeLoading={routeLoading}
              onOpenNavigation={openNavigation}
            />
          </div>
        )}
      </main>

      {/* Detailed Hospital Modal */}
      {selectedHospital && (
        <HospitalModal
          hospital={selectedHospital}
          onClose={() => setSelectedHospital(null)}
          isSaved={savedHospitalIds.includes(selectedHospital.id)}
          onToggleSave={toggleSaveHospital}
          currentUser={currentUser}
          onOpenAuth={(mode) => setAuthModalMode(mode)}
        />
      )}

      {/* AI Health Advisor Modal */}
      {isAiModalOpen && (
        <AiAssistantModal
          onClose={() => setIsAiModalOpen(false)}
          onSelectHospital={(h) => setSelectedHospital(h)}
        />
      )}

      {/* Auth Modal (Sign Up / Login) */}
      

      {/* User Appointments Modal */}
      {isAppointmentsModalOpen && currentUser && (
        <UserAppointmentsModal onClose={() => setIsAppointmentsModalOpen(false)} />
      )}

      {/* Floating AI Chatbot */}
      <AIChatbot onAction={handleAiAction} />

      {/* Side Menu with Tools */}
      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={(mode) => setViewMode(mode as any)}
      />

      {/* Emergency Mode Modal */}
      {isEmergencyModalOpen && (
        <EmergencyModal 
          onClose={() => setIsEmergencyModalOpen(false)}
          hospitals={hospitals}
          userLocation={userLocation}
          onOpenNavigation={openNavigation}
        />
      )}
    </div>
  );
}
