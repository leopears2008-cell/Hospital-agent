export type AppointmentRequestBody = {
  hospitalId?: unknown;
  doctorId?: unknown;
  patientName?: unknown;
  date?: unknown;
  time?: unknown;
  symptoms?: unknown;
};

/** Returns a client-safe validation error, or null when the payload is structurally valid. */
export function validateAppointmentInput(body: AppointmentRequestBody, today = new Date().toISOString().slice(0, 10)): string | null {
  const { hospitalId, doctorId, patientName, date, time, symptoms } = body ?? {};
  if (typeof hospitalId !== 'string' || !hospitalId.trim() ||
      typeof doctorId !== 'string' || !doctorId.trim() ||
      typeof patientName !== 'string' || patientName.trim().length < 2 || patientName.trim().length > 160 ||
      typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      typeof time !== 'string' || !/^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i.test(time) ||
      (symptoms !== undefined && (typeof symptoms !== 'string' || symptoms.length > 2000))) {
    return 'Invalid appointment details.';
  }

  const parsedDate = new Date(date + 'T00:00:00Z');
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date || date < today) {
    return 'Appointment date must be valid and not in the past.';
  }
  return null;
}
