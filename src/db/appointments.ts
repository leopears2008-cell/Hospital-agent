import { adminDb } from '../lib/firebase-admin.ts';
import { FieldValue } from 'firebase-admin/firestore';

export async function createAppointment(data: { hospitalId: string, userId: string, patientName: string, date: string, time: string, symptoms?: string }) {
  try {
    const docRef = adminDb.collection('appointments').doc();
    const appointment = {
      id: docRef.id,
      hospitalId: data.hospitalId,
      userId: data.userId,
      patientName: data.patientName,
      date: data.date,
      time: data.time,
      symptoms: data.symptoms || '',
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    await docRef.set(appointment);
    
    return {
      ...appointment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Database appointment error:", error);
    throw new Error("Failed to book appointment.", { cause: error });
  }
}

export async function getDoctorAppointments(doctorId: string) {
  try {
    const snapshot = await adminDb.collection('appointments')
      .where('doctorId', '==', doctorId)
      .get();
      
    const appointments: any[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      appointments.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });
    
    return appointments;
  } catch (error) {
    console.error("Database fetch doctor appointments error:", error);
    throw new Error("Failed to fetch doctor appointments.", { cause: error });
  }
}

export async function getUserAppointments(userId: string) {
  try {
    const snapshot = await adminDb.collection('appointments')
      .where('userId', '==', userId)
      .get();
      
    const appointments: any[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      appointments.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });
    
    return appointments;
  } catch (error) {
    console.error("Database fetch appointments error:", error);
    throw new Error("Failed to fetch appointments.", { cause: error });
  }
}

export async function updateAppointmentStatus(id: string, userId: string, status: 'pending' | 'confirmed' | 'cancelled') {
  try {
    const docRef = adminDb.collection('appointments').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error("Appointment not found.");
    }
    
    const data = doc.data();
    // Allow if it's the user who owns it, or we assume backend has checked role
    
    await docRef.update({
      status,
      updatedAt: FieldValue.serverTimestamp(),
    });
    
    return {
      ...data,
      id,
      status,
    };
  } catch (error) {
    console.error("Database update appointment error:", error);
    throw new Error("Failed to update appointment status.", { cause: error });
  }
}
