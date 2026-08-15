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
}

export interface TriageResult {
  recommendations: Hospital[];
  triageAdvice: string;
  emergencyNumbers: { name: string; number: string }[];
}

export interface SearchFilters {
  query: string;
  district: string;
  specialty: string;
  hospitalType: string;
  emergencyOnly: boolean;
}
