import { Doctor } from '../types.ts';

export const MOCK_DOCTORS: Doctor[] = [
  { id: 'dr-1', name: 'Dr. Sarah Johnson', photo: 'https://i.pravatar.cc/150?u=dr1', specialization: 'Cardiologist', qualification: 'MBBS, MD', experienceYears: 15, hospitalId: 'h-1', department: 'Cardiology', consultationFee: 500, availableDays: ['Monday', 'Wednesday', 'Friday'], availableTimeSlots: ['09:00 AM', '11:00 AM', '02:00 PM'], rating: 4.8 },
  { id: 'dr-2', name: 'Dr. Rajesh Kumar', photo: 'https://i.pravatar.cc/150?u=dr2', specialization: 'Neurologist', qualification: 'MBBS, DM', experienceYears: 12, hospitalId: 'h-1', department: 'Neurology', consultationFee: 700, availableDays: ['Tuesday', 'Thursday', 'Saturday'], availableTimeSlots: ['10:00 AM', '01:00 PM', '04:00 PM'], rating: 4.6 },
  { id: 'dr-3', name: 'Dr. Anita Desai', photo: 'https://i.pravatar.cc/150?u=dr3', specialization: 'Pediatrician', qualification: 'MBBS, MD (Pediatrics)', experienceYears: 8, hospitalId: 'h-1', department: 'Pediatrics', consultationFee: 400, availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], availableTimeSlots: ['08:00 AM', '09:00 AM', '10:00 AM', '03:00 PM'], rating: 4.9 },
  { id: 'dr-4', name: 'Dr. Michael Chang', photo: 'https://i.pravatar.cc/150?u=dr4', specialization: 'Orthopedic Surgeon', qualification: 'MBBS, MS', experienceYears: 20, hospitalId: 'h-1', department: 'Orthopedics', consultationFee: 600, availableDays: ['Monday', 'Thursday'], availableTimeSlots: ['09:00 AM', '12:00 PM'], rating: 4.7 }
];
