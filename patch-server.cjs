const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const importTarget = `import { createAppointment, getUserAppointments, updateAppointmentStatus } from "./src/db/appointments.ts";`;
const importReplacement = `import { createAppointment, getUserAppointments, getDoctorAppointments, updateAppointmentStatus } from "./src/db/appointments.ts";
import { getUserRole } from "./src/db/users.ts";`;

code = code.replace(importTarget, importReplacement);

const newEndpoints = `
app.get("/api/doctor/appointments", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) throw new Error("No user ID");
    
    // We assume the user has a doctorId in their doc or uses uid as doctorId
    // For this prototype, let's just query by uid
    const appointments = await getDoctorAppointments(uid);
    res.json({ success: true, appointments });
  } catch (error: any) {
    console.error("Fetch doctor appointments error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to fetch appointments" });
  }
});

app.put("/api/appointments/:id/status", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    const { status } = req.body;
    if (!uid) throw new Error("No user ID");
    
    const appointment = await updateAppointmentStatus(req.params.id, uid, status);
    res.json({ success: true, appointment });
  } catch (error: any) {
    console.error("Update appointment error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to update appointment" });
  }
});
`;

// Insert after the app.get("/api/appointments") block
const targetEndpoint = `app.put("/api/appointments/:id/cancel", requireAuth, async (req: AuthRequest, res) => {`;
code = code.replace(targetEndpoint, newEndpoints + '\n' + targetEndpoint);

fs.writeFileSync('server.ts', code);
