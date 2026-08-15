import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Polyline,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Hospital } from '../types';
import { Phone, Bed, Star, Navigation, ExternalLink } from 'lucide-react';

// Fix leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const userIcon = new L.DivIcon({
  className: '',
  html: `
    <div style="
      width:20px;
      height:20px;
      background:#2563eb;
      border:4px solid white;
      border-radius:50%;
      box-shadow:0 0 0 3px rgba(37,99,235,.3);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function MapCenter({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    if (
      center &&
      typeof center.lat === 'number' &&
      !isNaN(center.lat) &&
      typeof center.lng === 'number' &&
      !isNaN(center.lng)
    ) {
      // Leaflet crashes if flyTo is called when the map container is hidden (size 0x0)
      const size = map.getSize();
      if (size.x > 0 && size.y > 0) {
        map.flyTo([center.lat, center.lng], 13, { duration: 1.5 });
      } else {
        map.setView([center.lat, center.lng], 13);
      }
    }
  }, [center, map]);
  return null;
}

interface HospitalMapProps {
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  onSelectHospital: (hospital: Hospital) => void;
  userLocation: { lat: number; lng: number } | null;
  route: [number, number][];
  onGetRoute: (hospital: Hospital) => void;
  routeLoading: boolean;
  onOpenNavigation: (hospital: Hospital) => void;
}

// Ensure coordinates are always clean numbers
function safeNum(val: any, fallback: number): number {
  const num = Number(val);
  return isNaN(num) ? fallback : num;
}

export function HospitalMap({
  hospitals,
  selectedHospital,
  onSelectHospital,
  userLocation,
  route,
  onGetRoute,
  routeLoading,
  onOpenNavigation,
}: HospitalMapProps) {
  const defaultCenter = { lat: 11.1271, lng: 78.6569 }; // Geographic center of Tamil Nadu
  
  const rawCenter =
    selectedHospital &&
    typeof selectedHospital.lat === 'number' &&
    !isNaN(selectedHospital.lat) &&
    typeof selectedHospital.lng === 'number' &&
    !isNaN(selectedHospital.lng)
      ? { lat: selectedHospital.lat, lng: selectedHospital.lng }
      : userLocation &&
        typeof userLocation.lat === 'number' &&
        !isNaN(userLocation.lat) &&
        typeof userLocation.lng === 'number' &&
        !isNaN(userLocation.lng)
      ? userLocation
      : defaultCenter;

  const mapCenter = {
    lat: safeNum(rawCenter.lat, 11.1271),
    lng: safeNum(rawCenter.lng, 78.6569),
  };

  const validHospitals = hospitals.filter(
    (h) =>
      h &&
      typeof h.lat === 'number' &&
      !isNaN(h.lat) &&
      typeof h.lng === 'number' &&
      !isNaN(h.lng)
  ).map(h => ({
    ...h,
    lat: safeNum(h.lat, 11.1271),
    lng: safeNum(h.lng, 78.6569)
  }));

  const validRoute = (route || []).filter(
    (pt) =>
      Array.isArray(pt) &&
      pt.length >= 2 &&
      typeof pt[0] === 'number' &&
      !isNaN(pt[0]) &&
      typeof pt[1] === 'number' &&
      !isNaN(pt[1])
  ).map(pt => [safeNum(pt[0], 11.1271), safeNum(pt[1], 78.6569)] as [number, number]);
  
  const safeUserLoc = userLocation && !isNaN(Number(userLocation.lat)) && !isNaN(Number(userLocation.lng))
    ? { lat: safeNum(userLocation.lat, 11.1271), lng: safeNum(userLocation.lng, 78.6569) }
    : null;

  // Key the map container to force remount if it's completely busted initially
  const [mapReady, setMapReady] = useState(false);
  useEffect(() => { setMapReady(true); }, []);

  if (!mapReady) return <div className="w-full h-full bg-slate-100 rounded-xl border border-slate-200"></div>;

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-slate-200 shadow-xs">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={7}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapCenter center={mapCenter} />

        {/* User Location */}
        {safeUserLoc && (
            <>
              <Marker position={[safeUserLoc.lat, safeUserLoc.lng]} icon={userIcon}>
                <Popup>
                  <div className="font-sans font-bold text-xs">📍 Your Location</div>
                </Popup>
              </Marker>
              <CircleMarker
                center={[safeUserLoc.lat, safeUserLoc.lng]}
                radius={35}
                pathOptions={{ fillOpacity: 0.1, color: '#2563eb', weight: 1 }}
              />
            </>
          )}

        {/* Hospital Markers */}
        {validHospitals.map((hospital) => {
          const isSelected = selectedHospital?.id === hospital.id;
          const pinColor =
            hospital.type === 'Government'
              ? '#2563eb'
              : hospital.type === 'Trust/Charitable'
              ? '#059669'
              : '#dc2626';

          const customHospitalIcon = new L.DivIcon({
            className: '',
            html: `
              <div style="
                background: ${pinColor};
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
                border: 2px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                ${isSelected ? 'transform: scale(1.2); z-index: 1000;' : ''}
              ">🏥</div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          return (
            <Marker
              key={hospital.id}
              position={[hospital.lat, hospital.lng]}
              icon={customHospitalIcon}
              eventHandlers={{
                click: () => onSelectHospital(hospital),
              }}
            >
              <Popup>
                <div className="p-1 max-w-xs font-sans">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        hospital.type === 'Government'
                          ? 'bg-blue-100 text-blue-700'
                          : hospital.type === 'Trust/Charitable'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {hospital.type}
                    </span>
                    {hospital.emergencyAvailable && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">
                        Open 24/7
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{hospital.name}</h3>
                  <p className="text-xs text-slate-600 mb-2">{hospital.address}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Bed className="w-3.5 h-3.5 text-blue-600" /> {hospital.bedCapacity}
                    </span>
                    <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {hospital.rating}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <a
                      href={`tel:${hospital.contactNumber}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-2.5 rounded font-bold flex items-center gap-1 transition-colors"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                    <button
                      onClick={() => onGetRoute(hospital)}
                      disabled={routeLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1.5 px-2.5 rounded font-bold flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <Navigation className="w-3 h-3" /> {routeLoading ? '...' : 'Route'}
                    </button>
                    <button
                      onClick={() => onOpenNavigation(hospital)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-1.5 px-2.5 rounded font-bold flex items-center gap-1 transition-colors"
                      title="Navigate via OpenStreetMap"
                    >
                      <ExternalLink className="w-3 h-3" /> Navigate
                    </button>
                    <button
                      onClick={() => onSelectHospital(hospital)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-1.5 px-2.5 rounded font-bold transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Route Polyline */}
        {validRoute.length > 0 && (
          <Polyline
            positions={validRoute}
            pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.8 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
