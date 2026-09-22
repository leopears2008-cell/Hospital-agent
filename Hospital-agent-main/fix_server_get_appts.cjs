const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const getRoute = `
app.get("/api/appointments", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.uid;
    const { appointments } = require('./src/db/schema.ts');
    const { eq } = require('drizzle-orm');
    
    if (req.user?.role === 'admin' || req.user?.role === 'doctor') {
      const allAppts = await db.select().from(appointments).all();
      return res.json(allAppts);
    }
    
    const userAppts = await db.select().from(appointments).where(eq(appointments.userId, userId)).all();
    res.json(userAppts);
  } catch (error) {
    console.error("Fetch appointments:", error);
    res.status(500).json({ error: "Failed to fetch" });
  }
});
`;

if (!content.includes('/api/appointments", requireAuth, async (req: AuthRequest, res) => {\n  try {\n    const userId')) {
  content = content.replace('// --- AI / RAG / Interactions ---', getRoute + '\n\n// --- AI / RAG / Interactions ---');
  fs.writeFileSync('server.ts', content);
}
