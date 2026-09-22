const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const aptRoute = `
app.post("/api/appointments", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { hospitalId, doctorId, patientName, date, time, symptoms } = req.body;
    const userId = req.user?.uid;
    
    if (!userId || !hospitalId || !doctorId || !patientName || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Check double booking
    const { appointments } = require('./src/db/schema.ts');
    const { eq, and } = require('drizzle-orm');
    
    const existing = await db.select().from(appointments).where(
      and(
        eq(appointments.doctorId, doctorId),
        eq(appointments.date, date),
        eq(appointments.time, time)
      )
    ).get();
    
    if (existing) {
      return res.status(400).json({ error: "Time slot already booked" });
    }
    
    const { v4: uuidv4 } = require('uuid');
    const newId = uuidv4();
    
    const [appointment] = await db.insert(appointments).values({
      id: newId,
      hospitalId,
      doctorId,
      userId,
      patientName,
      date,
      time,
      symptoms: symptoms || '',
      status: 'pending'
    }).returning();
    
    res.json(appointment);
  } catch (error) {
    console.error("Failed to book appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
`;

if (!content.includes('/api/appointments')) {
  content = content.replace('// --- AI / RAG / Interactions ---', aptRoute + '\n\n// --- AI / RAG / Interactions ---');
  fs.writeFileSync('server.ts', content);
}
