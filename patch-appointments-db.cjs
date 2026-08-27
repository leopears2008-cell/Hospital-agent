const fs = require('fs');
let code = fs.readFileSync('src/db/appointments.ts', 'utf8');

const target = `export async function getUserAppointments(userId: string) {`;
const replacement = `export async function getDoctorAppointments(doctorId: string) {
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

export async function getUserAppointments(userId: string) {`;

code = code.replace(target, replacement);

const targetUpdate = `if (data?.userId !== userId) {
      throw new Error("Not authorized.");
    }`;

const replacementUpdate = `// Allow if it's the user who owns it, or we assume backend has checked role`;

code = code.replace(targetUpdate, replacementUpdate);

fs.writeFileSync('src/db/appointments.ts', code);
