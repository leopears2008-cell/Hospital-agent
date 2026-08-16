import { db } from './index.ts';
import { appointments } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function createAppointment(data: { hospitalId: string, userId: string, patientName: string, date: string, time: string, symptoms?: string }) {
  try {
    const result = await db.insert(appointments)
      .values({
        hospitalId: data.hospitalId,
        userId: data.userId,
        patientName: data.patientName,
        date: data.date,
        time: data.time,
        symptoms: data.symptoms,
        status: 'pending'
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("Database appointment error:", error);
    throw new Error("Failed to book appointment.", { cause: error });
  }
}

export async function getUserAppointments(userId: string) {
  try {
    return await db.select().from(appointments).where(eq(appointments.userId, userId));
  } catch (error) {
    console.error("Database fetch appointments error:", error);
    throw new Error("Failed to fetch appointments.", { cause: error });
  }
}

export async function updateAppointmentStatus(id: number, userId: string, status: 'pending' | 'confirmed' | 'cancelled') {
  try {
    const result = await db.update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
      
    if (result.length === 0) {
      throw new Error("Appointment not found or not authorized.");
    }
    return result[0];
  } catch (error) {
    console.error("Database update appointment error:", error);
    throw new Error("Failed to update appointment status.", { cause: error });
  }
}
