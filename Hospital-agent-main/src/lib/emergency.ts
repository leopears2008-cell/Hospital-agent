export interface EmergencyAlert {
  id: string;
  userId: string;
  userName: string;
  location: { lat: number; lng: number };
  timestamp: number;
  status: 'active' | 'dispatched' | 'resolved';
  severity: 'critical' | 'high' | 'moderate';
}

const activeEmergencies: EmergencyAlert[] = [];

export function triggerEmergencySOS(userId: string, userName: string, lat: number, lng: number, severity: EmergencyAlert['severity'] = 'critical'): EmergencyAlert {
  const alert: EmergencyAlert = {
    id: 'emg_' + Math.random().toString(36).substring(2, 9),
    userId,
    userName,
    location: { lat, lng },
    timestamp: Date.now(),
    status: 'active',
    severity,
  };

  activeEmergencies.unshift(alert);
  return alert;
}

export function getActiveEmergencies(): EmergencyAlert[] {
  return activeEmergencies;
}

export function updateEmergencyStatus(id: string, status: EmergencyAlert['status']): boolean {
  const alert = activeEmergencies.find(a => a.id === id);
  if (alert) {
    alert.status = status;
    return true;
  }
  return false;
}
