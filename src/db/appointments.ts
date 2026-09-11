import { db } from './index.ts';
import { appointments } from './schema.ts';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function createAppointment(data: { hospitalId: string, doctorId: string, userId: string, patientName: string, date: string, time: string, symptoms?: string }) {
  try {
    const newId = uuidv4();
    const [appointment] = await db.insert(appointments).values({
      id: newId,
      hospitalId: data.hospitalId,
      doctorId: data.doctorId,
      userId: data.userId,
      patientName: data.patientName,
      date: data.date,
      time: data.time,
      symptoms: data.symptoms || '',
      status: 'pending',
    }).returning();
        
    return appointment;
  } catch (error) {
    console.error("Database appointment error:", error);
    throw new Error("Failed to book appointment.", { cause: error });
  }
}

export async function getDoctorAppointments(doctorId: string) {
  try {
    return await db.select().from(appointments).where(eq(appointments.doctorId, doctorId)).all();
  } catch (error) {
    console.error("Database fetch doctor appointments error:", error);
    throw new Error("Failed to fetch doctor appointments.", { cause: error });
  }
}

export async function getUserAppointments(userId: string) {
  try {
    return await db.select().from(appointments).where(eq(appointments.userId, userId)).all();
  } catch (error) {
    console.error("Database fetch appointments error:", error);
    throw new Error("Failed to fetch appointments.", { cause: error });
  }
}

export async function updateAppointmentStatus(id: string, userId: string, status: 'pending' | 'confirmed' | 'cancelled') {
  try {
    // Note: userId is passed to verify ownership if needed, but not enforced at this db query layer.
    // Ensure the route handler enforces it.
    const [appointment] = await db.update(appointments)
      .set({ status, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
      
    if (!appointment) {
      throw new Error("Appointment not found.");
    }
        
    return appointment;
  } catch (error) {
    console.error("Database update appointment error:", error);
    throw new Error("Failed to update appointment status.", { cause: error });
  }
}
