import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { TAMIL_NADU_HOSPITALS } from '../data/tamilNaduHospitals';
import { getDistanceInKm } from '../lib/geo';

export function EmergencyAlertsToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [notifiedHospitals, setNotifiedHospitals] = useState<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const toggleAlerts = async () => {
    if (isEnabled) {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      setIsEnabled(false);
      setWatchId(null);
      return;
    }

    // Request Notification Permission
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return;
    }
    
    let permission = Notification.permission;
    if (permission !== "granted" && permission !== "denied") {
      try {
        permission = await Notification.requestPermission();
      } catch (err) {
        console.error("Failed to request notification permission:", err);
      }
    }

    if (permission !== "granted") {
      alert("Notification permission is required for emergency alerts. Please enable notifications in your browser settings.");
      return;
    }

    // Request Geolocation
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        checkProximity(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);
        // Only alert once on failure to avoid spamming the user
        if (!isEnabled) {
          alert("Error getting location: " + error.message + ". Please ensure location permissions are granted.");
        }
        setIsEnabled(false);
        if (watchId !== null) setWatchId(null);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    setWatchId(id);
    setIsEnabled(true);
  };

  const checkProximity = (lat: number, lng: number) => {
    const emergencyHospitals = TAMIL_NADU_HOSPITALS.filter(h => h.emergencyAvailable);
    
    for (const hospital of emergencyHospitals) {
      const distance = getDistanceInKm(lat, lng, hospital.lat, hospital.lng);
      
      // If within 5km and haven't notified about this specific hospital yet
      if (distance <= 5.0 && !notifiedHospitals.has(hospital.id)) {
        try {
          new Notification("Emergency Hospital Nearby", {
            body: `You are within 5km of ${hospital.name}. Distance: ${distance.toFixed(1)}km.`,
            icon: "https://cdn-icons-png.flaticon.com/512/1032/1032986.png" // generic medical cross icon
          });
          
          setNotifiedHospitals(prev => {
            const next = new Set(prev);
            next.add(hospital.id);
            return next;
          });
        } catch (e) {
          console.error("Notification failed:", e);
        }
      }
    }
  };

  return (
    <button
      onClick={toggleAlerts}
      className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors cursor-pointer ${
        isEnabled 
          ? 'bg-rose-100 border-rose-200 text-rose-700 hover:bg-rose-200' 
          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
      }`}
      title={isEnabled ? "Disable nearby emergency alerts" : "Enable nearby emergency alerts (within 5km)"}
    >
      {isEnabled ? <Bell className="w-4 h-4 animate-pulse" /> : <BellOff className="w-4 h-4" />}
      <span className="text-xs font-bold hidden sm:inline">Alerts</span>
    </button>
  );
}
