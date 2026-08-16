import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { createAppointment, getUserAppointments, updateAppointmentStatus } from "./src/db/appointments.ts";

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { email, name } = req.body;
    const uid = req.user?.uid;
    if (!uid) throw new Error("No user ID");
    
    const user = await getOrCreateUser(uid, email || req.user?.email || "", name || "User");
    res.json({ success: true, user });
  } catch (error: any) {
    console.error("Auth sync error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to sync user" });
  }
});

app.post("/api/appointments", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) throw new Error("No user ID");
    
    const data = { ...req.body, userId: uid };
    const appointment = await createAppointment(data);
    res.json({ success: true, appointment });
  } catch (error: any) {
    console.error("Booking error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to book appointment" });
  }
});

app.get("/api/appointments", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) throw new Error("No user ID");
    
    const userAppointments = await getUserAppointments(uid);
    res.json({ success: true, appointments: userAppointments });
  } catch (error: any) {
    console.error("Fetch appointments error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to fetch appointments" });
  }
});

app.put("/api/appointments/:id/cancel", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) throw new Error("No user ID");
    
    const appointmentId = parseInt(req.params.id, 10);
    if (isNaN(appointmentId)) throw new Error("Invalid appointment ID");

    const appointment = await updateAppointmentStatus(appointmentId, uid, 'cancelled');
    res.json({ success: true, appointment });
  } catch (error: any) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to cancel appointment" });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    const ai = getAiClient();
    const prompt = `You are an AI Health Assistant for Tamil Nadu Hospitals. 
    A user is asking: "${message}"
    
    Provide a helpful, brief, and medically sound response. If they ask about doctors or availability, guide them to use the search filters in the app. Remind them you are an AI and for emergencies they should call 108.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });
    
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to generate reply" });
  }
});

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

app.post("/api/ai-recommend", async (req, res) => {
  try {
    const { query, district, specialty } = req.body;
    const ai = getAiClient();

    const prompt = `You are a Tamil Nadu medical healthcare advisor and directory assistant.
The user is searching for hospitals in Tamil Nadu with the following details:
- Search Query / Symptoms: "${query || 'General checkup'}"
- District / City: "${district || 'All Tamil Nadu'}"
- Specialty needed: "${specialty || 'General / Multi-Specialty'}"

Provide a detailed response in JSON format containing:
1. "recommendations": Array of 6 top hospitals in Tamil Nadu matching this query, with fields:
   - name (string)
   - cityOrDistrict (string)
   - specialty (string)
   - address (string)
   - contactNumber (string)
   - emergencyAvailable (boolean)
   - bedCapacity (string, e.g. "500+ beds")
   - rating (number, e.g. 4.6)
   - description (string)
   - lat (number, accurate latitude for this Tamil Nadu hospital, e.g. Chennai ~13.08, Coimbatore ~11.01, Madurai ~9.92, Vellore ~12.91, Trichy ~10.79, Salem ~11.66)
   - lng (number, accurate longitude for this Tamil Nadu hospital, e.g. Chennai ~80.27, Coimbatore ~76.95, Madurai ~78.11, Vellore ~79.13, Trichy ~78.70, Salem ~78.14)
2. "triageAdvice": Medical guidance or triage advice based on the user's query.
3. "emergencyNumbers": Array of objects with name and number (e.g. [{"name": "Ambulance / Emergency", "number": "108"}, {"name": "State Health Helpline", "number": "104"}]).

Ensure the response is valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    res.json({ success: true, data, groundingChunks });
  } catch (error: any) {
    console.error("AI recommendation error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate AI recommendation" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
