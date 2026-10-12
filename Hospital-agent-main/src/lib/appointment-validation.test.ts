import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAppointmentInput } from './appointment-validation.ts';

const valid = {
  hospitalId: 'hospital-1',
  doctorId: 'doctor-1',
  patientName: 'Test Patient',
  date: '2099-12-31',
  time: '10:30 AM',
  symptoms: 'Routine check-up',
};

test('accepts a valid appointment payload', () => {
  assert.equal(validateAppointmentInput(valid, '2099-01-01'), null);
});

test('rejects missing hospital and doctor IDs', () => {
  assert.equal(validateAppointmentInput({ ...valid, hospitalId: ' ' }), 'Invalid appointment details.');
  assert.equal(validateAppointmentInput({ ...valid, doctorId: '' }), 'Invalid appointment details.');
});

test('rejects invalid patient names and oversized symptoms', () => {
  assert.equal(validateAppointmentInput({ ...valid, patientName: 'A' }), 'Invalid appointment details.');
  assert.equal(validateAppointmentInput({ ...valid, patientName: 'P'.repeat(161) }), 'Invalid appointment details.');
  assert.equal(validateAppointmentInput({ ...valid, symptoms: 'x'.repeat(2001) }), 'Invalid appointment details.');
});

test('accepts valid 12-hour time formats and rejects malformed times', () => {
  assert.equal(validateAppointmentInput({ ...valid, time: '9:05 PM' }, '2099-01-01'), null);
  assert.equal(validateAppointmentInput({ ...valid, time: '13:70 PM' }), 'Invalid appointment details.');
  assert.equal(validateAppointmentInput({ ...valid, time: '10:30 pm extra' }), 'Invalid appointment details.');
});

test('rejects malformed, impossible, and past dates', () => {
  assert.equal(validateAppointmentInput({ ...valid, date: '31-12-2099' }), 'Invalid appointment details.');
  assert.equal(validateAppointmentInput({ ...valid, date: '2099-02-30' }), 'Appointment date must be valid and not in the past.');
  assert.equal(validateAppointmentInput({ ...valid, date: '2000-01-01' }, '2026-01-01'), 'Appointment date must be valid and not in the past.');
});

test('accepts a real leap-day date', () => {
  assert.equal(validateAppointmentInput({ ...valid, date: '2028-02-29' }, '2028-01-01'), null);
});
