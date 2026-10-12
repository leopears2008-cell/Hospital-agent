import { db } from './index.ts';
import { appointments, doctors, hospitals } from './schema.ts';
import { and, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export type AppointmentInput = {
  hospitalId: string;
  doctorId: string;
  patientName: string;
  date: string;
  time: string;
  symptoms?: string;
};

export async function createAppointment(data: AppointmentInput & { userId: string }) {
  try {
    const hospital = await db.select({ id: hospitals.id }).from(hospitals).where(eq(hospitals.id, data.hospitalId)).get();
    if (!hospital) throw new Error('Invalid hospital.');
    const doctor = await db.select({ id: doctors.id, hospitalId: doctors.hospitalId }).from(doctors).where(eq(doctors.id, data.doctorId)).get();
    if (!doctor || doctor.hospitalId !== data.hospitalId) throw new Error('Invalid doctor for the selected hospital.');

    const [appointment] = await db.insert(appointments).values({
      id: uuidv4(),
      hospitalId: data.hospitalId,
      doctorId: data.doctorId,
      userId: data.userId,
      patientName: data.patientName.trim(),
      date: data.date,
      time: data.time,
      symptoms: data.symptoms?.trim() || '',
      status: 'pending',
    }).returning();
    return appointment;
  } catch (error) {
    console.error('Database appointment error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to book appointment.', { cause: error });
  }
}

export async function getDoctorAppointments(doctorId: string) {
  return db.select().from(appointments).where(eq(appointments.doctorId, doctorId)).all();
}

export async function getUserAppointments(userId: string) {
  return db.select().from(appointments).where(eq(appointments.userId, userId)).all();
}

export async function updateAppointmentStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled', ownerUserId?: string) {
  const conditions = ownerUserId
    ? and(eq(appointments.id, id), eq(appointments.userId, ownerUserId))
    : eq(appointments.id, id);
  const [appointment] = await db.update(appointments)
    .set({ status, updatedAt: new Date() })
    .where(conditions)
    .returning();
  return appointment || null;
}
