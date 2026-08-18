export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Review {
  id: string;
  hospitalId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  cityOrDistrict: string;
  specialty: string;
  address: string;
  contactNumber: string;
  emergencyAvailable: boolean;
  bedCapacity: string;
  rating: number;
  description: string;
  lat: number;
  lng: number;
  type: 'Government' | 'Private' | 'Trust/Charitable';
  facilities: string[];
  images?: string[];
  currentOccupancyRate?: number; // 0-100 percentage
  verified?: boolean;
  centerOfExcellence?: boolean;
  whatsappNumber?: string;
}

export interface Doctor {
  id: string;
  name: string;
  photo: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  hospitalId: string;
  department: string;
  consultationFee: number;
  availableDays: string[];
  availableTimeSlots: string[];
  rating: number;
}

export interface Appointment {
  id: string;
  hospitalId: string;
  doctorId?: string;
  department?: string;
  userId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  patientPhone?: string;
  date: string;
  time: string;
  symptoms?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  qrCodeData?: string;
  createdAt: number;
  updatedAt: number;
}

export interface TriageResult {
  triageAdvice: string;
  emergencyNumbers: { name: string; number: string }[];
  recommendations: Hospital[];
}

export interface SearchFilters {
  query: string;
  district: string;
  specialty: string;
  hospitalType: string;
  emergencyOnly: boolean;
}
