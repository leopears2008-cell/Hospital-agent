const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

// We need to add API endpoints for hospitals and doctors if they don't exist.
const newApis = `
import { db } from './src/db/index.ts';
import { hospitals, doctors } from './src/db/schema.ts';

app.get("/api/hospitals", async (req, res) => {
  try {
    const data = await db.select().from(hospitals).all();
    // parse json fields
    const parsed = data.map(h => ({
      ...h,
      facilities: typeof h.facilities === 'string' ? JSON.parse(h.facilities) : h.facilities
    }));
    res.json(parsed);
  } catch (error) {
    console.error("Fetch hospitals error:", error);
    res.status(500).json({ error: "Failed to fetch hospitals" });
  }
});

app.get("/api/doctors", async (req, res) => {
  try {
    const data = await db.select().from(doctors).all();
    const parsed = data.map(d => ({
      ...d,
      availableDays: typeof d.availableDays === 'string' ? JSON.parse(d.availableDays) : d.availableDays,
      availableTimeSlots: typeof d.availableTimeSlots === 'string' ? JSON.parse(d.availableTimeSlots) : d.availableTimeSlots,
    }));
    res.json(parsed);
  } catch (error) {
    console.error("Fetch doctors error:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});
`;

// Insert the new APIs before the AI routes
content = content.replace('// --- AI / RAG / Interactions ---', newApis + '\n\n// --- AI / RAG / Interactions ---');

fs.writeFileSync('server.ts', content);
