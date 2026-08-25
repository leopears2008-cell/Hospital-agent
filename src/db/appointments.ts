export const appointmentsDb: any[] = [];
let nextAppointmentId = 1;

export async function createAppointment(data: { hospitalId: string, userId: string, patientName: string, date: string, time: string, symptoms?: string }) {
  try {
    const appointment = {
      id: nextAppointmentId++,
      hospitalId: data.hospitalId,
      userId: data.userId,
      patientName: data.patientName,
      date: data.date,
      time: data.time,
      symptoms: data.symptoms,
      status: 'pending'
    };
    appointmentsDb.push(appointment);
    return appointment;
  } catch (error) {
    console.error("Database appointment error:", error);
    throw new Error("Failed to book appointment.", { cause: error });
  }
}

export async function getUserAppointments(userId: string) {
  try {
    return appointmentsDb.filter(a => a.userId === userId);
  } catch (error) {
    console.error("Database fetch appointments error:", error);
    throw new Error("Failed to fetch appointments.", { cause: error });
  }
}

export async function updateAppointmentStatus(id: number, userId: string, status: 'pending' | 'confirmed' | 'cancelled') {
  try {
    const appointment = appointmentsDb.find(a => a.id === id);
    if (!appointment) {
      throw new Error("Appointment not found or not authorized.");
    }
    appointment.status = status;
    return appointment;
  } catch (error) {
    console.error("Database update appointment error:", error);
    throw new Error("Failed to update appointment status.", { cause: error });
  }
}
