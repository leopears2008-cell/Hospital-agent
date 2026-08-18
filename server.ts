import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { createAppointment, getUserAppointments, updateAppointmentStatus } from "./src/db/appointments.ts";
import { TAMIL_NADU_HOSPITALS } from "./src/data/tamilNaduHospitals.ts";
import { MOCK_DOCTORS } from "./src/data/doctors.ts";

function retrieveKnowledgeBase(query: string) {
  const normalizedQuery = query.toLowerCase();
  
  const matchedHospitals = TAMIL_NADU_HOSPITALS.filter(h => 
    h.name.toLowerCase().includes(normalizedQuery) ||
    h.cityOrDistrict.toLowerCase().includes(normalizedQuery) ||
    h.specialty.toLowerCase().includes(normalizedQuery) ||
    h.address.toLowerCase().includes(normalizedQuery)
  );

  const hospitalsToInclude = matchedHospitals.length > 0 ? matchedHospitals : TAMIL_NADU_HOSPITALS;

  const matchedDoctors = MOCK_DOCTORS.filter(d => 
    d.name.toLowerCase().includes(normalizedQuery) ||
    d.department.toLowerCase().includes(normalizedQuery) ||
    d.specialization.toLowerCase().includes(normalizedQuery)
  );
  
  const doctorsToInclude = matchedDoctors.length > 0 ? matchedDoctors : MOCK_DOCTORS;

  return `
--- INTERNAL KNOWLEDGE BASE (Tamil Nadu Hospitals & Doctors) ---
HOSPITALS:
${JSON.stringify(hospitalsToInclude.map(h => ({ id: h.id, name: h.name, city: h.cityOrDistrict, specialty: h.specialty, emergency: h.emergencyAvailable, address: h.address, rating: h.rating })), null, 2)}

DOCTORS:
${JSON.stringify(doctorsToInclude.map(d => ({ id: d.id, name: d.name, department: d.department, specialization: d.specialization, fee: d.consultationFee, availableDays: d.availableDays, rating: d.rating })), null, 2)}
--- 
INSTRUCTIONS: Use the above verified internal data to answer the user's question. Do not invent hospitals or doctors that are not in this list.
`;
}

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
    
    // RAG step: Retrieve internal data based on the user's message
    const knowledgeBaseContext = retrieveKnowledgeBase(message);
    
    const prompt = `You are an AI Health Assistant for Tamil Nadu Hospitals. 
    A user is asking: "${message}"
    
    ${knowledgeBaseContext}
    
    Provide a helpful, brief, and medically sound response. If they ask about specific doctors, hospitals, or availability, answer using ONLY the internal knowledge base provided. Remind them you are an AI and for emergencies they should call 108.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to generate reply" });
  }
});

app.post("/api/symptom-checker", async (req, res) => {
  try {
    const { history, currentAnswer } = req.body;
    
    const ai = getAiClient();
    
    // RAG step: Retrieve internal data based on the latest answer
    const knowledgeBaseContext = retrieveKnowledgeBase(currentAnswer);
    
    // Convert history into a string
    const historyText = history.map((item: any) => `${item.role === 'ai' ? 'AI' : 'User'}: ${item.text}`).join('\n');
    
    const prompt = `You are an AI Symptom Checker for an Indian hospital platform. 
    You are conducting a triage interview with a user to provide preliminary health insights. 
    
    Conversation History:
    ${historyText}
    User's latest response: "${currentAnswer}"
    
    ${knowledgeBaseContext}
    
    Instructions:
    1. If you need more information to give a preliminary insight, ask the next logical, simple, and brief question (e.g., duration, severity, other symptoms). Do not ask multiple questions at once.
    2. If you have enough information (usually after 3-4 questions), provide a preliminary health insight. State clearly that this is NOT medical advice. Provide potential general causes and recommend the type of specialist they should see. IMPORTANT: Using the INTERNAL KNOWLEDGE BASE provided, recommend specific hospitals or doctors that can help.
    3. Always remind them to visit an emergency room or call 108 immediately if symptoms indicate a severe emergency (like severe chest pain, stroke symptoms).
    
    Respond directly with the next question or the final insight. Keep it friendly, empathetic, and professional.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Symptom checker error:", error);
    res.status(500).json({ error: "Failed to process symptom checker" });
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
    
    // RAG step: Retrieve internal data based on the full query context
    const retrievalQuery = `${query} ${district} ${specialty}`;
    const knowledgeBaseContext = retrieveKnowledgeBase(retrievalQuery);

    const prompt = `You are a Tamil Nadu medical healthcare advisor and directory assistant.
The user is searching for hospitals in Tamil Nadu with the following details:
- Search Query / Symptoms: "${query || 'General checkup'}"
- District / City: "${district || 'All Tamil Nadu'}"
- Specialty needed: "${specialty || 'General / Multi-Specialty'}"

${knowledgeBaseContext}

Provide a detailed response in JSON format containing:
1. "recommendations": Array of 6 top hospitals matching this query. **CRITICAL: Prioritize recommending hospitals and doctors from the INTERNAL KNOWLEDGE BASE.** Include fields:
   - name (string)
   - cityOrDistrict (string)
   - specialty (string)
   - address (string)
   - contactNumber (string)
   - emergencyAvailable (boolean)
   - bedCapacity (string, e.g. "500+ beds")
   - rating (number, e.g. 4.6)
   - description (string)
   - lat (number, accurate latitude for this Tamil Nadu hospital)
   - lng (number, accurate longitude for this Tamil Nadu hospital)
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
