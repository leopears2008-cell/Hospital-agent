export interface AppointmentRuleCheck {
  isValid: boolean;
  error?: string;
}

export function validateAppointmentTime(dateStr: string, timeStr: string): AppointmentRuleCheck {
  if (!dateStr || !timeStr) {
    return { isValid: false, error: 'Date and time are required.' };
  }

  const apptDate = new Date(`${dateStr} ${timeStr}`);
  const now = new Date();

  if (isNaN(apptDate.getTime())) {
    return { isValid: false, error: 'Invalid date or time format.' };
  }

  if (apptDate < now) {
    return { isValid: false, error: 'Cannot schedule appointments in the past.' };
  }

  // Check if within working hours (e.g., 08:00 AM to 08:00 PM)
  const hours = apptDate.getHours();
  if (hours < 8 || hours >= 20) {
    return { isValid: false, error: 'Appointments must be scheduled between 8:00 AM and 8:00 PM.' };
  }

  return { isValid: true };
}

export function sanitizePatientInput(input: string): string {
  if (!input) return '';
  return input.trim().replace(/[<>]/g, '');
}
