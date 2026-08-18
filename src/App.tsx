import { useState, useMemo, useEffect } from 'react';
import { TAMIL_NADU_HOSPITALS } from './data/tamilNaduHospitals';
import { Hospital, SearchFilters, User } from './types';
import { Navbar } from './components/Navbar';
import { HospitalMap } from './components/HospitalMap';
import { HospitalList } from './components/HospitalList';
import { HospitalModal } from './components/HospitalModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AuthModal } from './components/AuthModal';
import { UserAppointmentsModal } from './components/UserAppointmentsModal';
import { LoginPage } from './components/LoginPage';
import AIChatbot from './components/AIChatbot';
import { SideMenu } from './components/SideMenu';
import { Dashboard } from './components/Dashboard';

import { EmergencyModal } from './components/EmergencyModal';

export default function App() {
  const [hospitals] = useState<Hospital[]>(TAMIL_NADU_HOSPITALS);
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
  const [viewMode, setViewMode] = useState<'dashboard' | 'split' | 'map' | 'list'>('dashboard');
  const [savedHospitalIds, setSavedHospitalIds] = useState<string[]>([]);

  // Geolocation and OSRM Routing states
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [routeLoading, setRouteLoading] = useState(false);
  
  // Auth state persisted in localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);

  useEffect(() => {
    import('./lib/firebase').then(({ auth }) => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          setCurrentUser({
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email || ''
          });

          // Sync user to PostgreSQL
          try {
            const token = await user.getIdToken();
            await fetch('/api/auth/sync', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                email: user.email,
                name: user.displayName || user.email?.split('@')[0] || 'User'
              })
            });
          } catch (err) {
            console.error("Failed to sync user with database:", err);
          }
        } else {
          setCurrentUser(null);
        }
        setLoadingAuth(false);
      });
    });
  }, []);

  const handleLogout = async () => {
    const { auth } = await import('./lib/firebase');
    await auth.signOut();
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
    let lat = userLocation?.lat;
    let lng = userLocation?.lng;

    if (!lat || !lng) {
      lat = 13.0827; // Default Chennai if location not set
      lng = 80.2707;
    }

    const url =
      `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=` +
      `${lat}%2C${lng}%3B` +
      `${hospital.lat}%2C${hospital.lng}`;

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

  if (loadingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      <Navbar
        onOpenSideMenu={() => setIsSideMenuOpen(true)}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalHospitals={filteredHospitals.length}
        currentUser={currentUser}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        onLogout={handleLogout}
        onOpenAppointments={() => setIsAppointmentsModalOpen(true)}
      />

      <main className="flex-1 flex overflow-hidden relative">
        {viewMode === 'dashboard' && (
          <Dashboard 
            currentUser={currentUser}
            hospitals={filteredHospitals}
            onOpenNavigation={(mode) => setViewMode(mode)}
            onOpenAi={() => setIsAiModalOpen(true)}
            onOpenAppointments={() => setIsAppointmentsModalOpen(true)}
            onEmergency={() => setIsEmergencyModalOpen(true)}
          />
        )}

        {/* List View / Split View Sidebar */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div className={`${viewMode === 'split' ? 'w-full md:w-96 lg:w-[420px]' : 'w-full'} h-full shrink-0 z-10`}>
            <HospitalList
              hospitals={filteredHospitals}
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
      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setAuthModalMode(null);
          }}
        />
      )}

      {/* User Appointments Modal */}
      {isAppointmentsModalOpen && currentUser && (
        <UserAppointmentsModal onClose={() => setIsAppointmentsModalOpen(false)} />
      )}

      {/* Floating AI Chatbot */}
      <AIChatbot />

      {/* Side Menu with Tools */}
      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
        currentUser={currentUser}
        onLogout={handleLogout}
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
