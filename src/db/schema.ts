import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uid: text('uid').notNull().unique(), // Clerk user ID
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('patient'), // patient, doctor, admin
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const hospitals = sqliteTable('hospitals', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  cityOrDistrict: text('city_or_district').notNull(),
  specialty: text('specialty').notNull(),
  contactNumber: text('contact_number'),
  emergencyAvailable: integer('emergency_available', { mode: 'boolean' }).notNull().default(false),
  rating: real('rating'),
  lat: real('lat'),
  lng: real('lng'),
  facilities: text('facilities', { mode: 'json' }), // Array
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const doctors = sqliteTable('doctors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  specialization: text('specialization').notNull(),
  qualification: text('qualification').notNull(),
  experienceYears: integer('experience_years').notNull(),
  hospitalId: text('hospital_id').notNull().references(() => hospitals.id),
  department: text('department').notNull(),
  consultationFee: integer('consultation_fee').notNull(),
  availableDays: text('available_days', { mode: 'json' }).notNull(),
  availableTimeSlots: text('available_time_slots', { mode: 'json' }).notNull(),
  rating: real('rating'),
  photo: text('photo'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const appointments = sqliteTable('appointments', {
  id: text('id').primaryKey(),
  hospitalId: text('hospital_id').notNull().references(() => hospitals.id),
  doctorId: text('doctor_id').notNull().references(() => doctors.id),
  userId: text('user_id').notNull().references(() => users.uid),
  patientName: text('patient_name').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  time: text('time').notNull(), // HH:MM AM/PM
  symptoms: text('symptoms'),
  status: text('status').notNull().default('pending'), // pending, confirmed, cancelled
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
