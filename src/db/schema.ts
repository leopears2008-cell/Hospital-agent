import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  hospitalId: text('hospital_id').notNull(),
  userId: text('user_id').notNull().references(() => users.uid),
  patientName: text('patient_name').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  symptoms: text('symptoms'),
  status: text('status', { enum: ['pending', 'confirmed', 'cancelled'] }).notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.uid],
  }),
}));


import { customType, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const vector = customType<{ data: number[], driverData: string }>({
  dataType() {
    return 'vector(768)';
  },
  toDriver(value) {
    return JSON.stringify(value);
  },
  fromDriver(value) {
    return JSON.parse(value as string);
  },
});

export const knowledge_chunks = pgTable('knowledge_chunks', {
  id: serial('id').primaryKey(),
  documentId: text('document_id').notNull(),
  documentType: text('document_type').notNull(),
  content: text('content').notNull(),
  metadata: text('metadata').notNull(), // JSON stringified metadata
  embedding: vector('embedding'),
  createdAt: timestamp('created_at').defaultNow(),
});
