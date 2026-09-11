import "dotenv/config";
import express from "express";
import { clerkMiddleware } from '@clerk/express';

import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { HospitalAIAgent } from "./src/lib/ai-agent.ts";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { createAppointment, getUserAppointments, getDoctorAppointments, updateAppointmentStatus } from "./src/db/appointments.ts";
import { getUserRole } from "./src/db/users.ts";
import { sendAutomatedAppointmentEmail } from "./src/lib/emailService.ts";
import { db } from "./src/db/index.ts";
import { hospitals, doctors, appointments } from "./src/db/schema.ts";
import { eq } from "drizzle-orm";


const app = express();
const PORT = 3000;

app.use(express.json());
if (process.env.CLERK_SECRET_KEY) {
  app.use(clerkMiddleware());
} else {
  // mock clerk middleware
  app.use((req: any, res, next) => {
    req.auth = { userId: "mock-user-123" };
    next();
  });
}



async function retrieveKnowledgeBase(query: string) {
  const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
  
  try {
    
    
    
    const allHospitals = await db.select().from(hospitals).all();
    let matchedHospitals = allHospitals.filter((h: any) => {
      const searchString = `${h.name} ${h.cityOrDistrict} ${h.specialty} ${h.address}`.toLowerCase();
      return keywords.some(k => searchString.includes(k));
    });
    if (matchedHospitals.length === 0) matchedHospitals = allHospitals.slice(0, 15);
    else if (matchedHospitals.length > 15) matchedHospitals = matchedHospitals.slice(0, 15);

    const allDoctors = await db.select().from(doctors).all();
    let matchedDoctors = allDoctors.filter((d: any) => {
      const searchString = `${d.name} ${d.department} ${d.specialization}`.toLowerCase();
      return keywords.some(k => searchString.includes(k));
    });
    if (matchedDoctors.length === 0) matchedDoctors = allDoctors.slice(0, 10);
    else if (matchedDoctors.length > 10) matchedDoctors = matchedDoctors.slice(0, 10);

    return `--- INTERNAL KNOWLEDGE BASE (Tamil Nadu Hospitals & Doctors) ---\nHOSPITALS:\n${JSON.stringify(matchedHospitals.map((h: any) => ({ id: h.id, name: h.name, city: h.cityOrDistrict, specialty: h.specialty, emergency: h.emergencyAvailable, address: h.address, rating: h.rating })), null, 2)}\nDOCTORS:\n${JSON.stringify(matchedDoctors.map((d: any) => ({ id: d.id, name: d.name, department: d.department, specialization: d.specialization, fee: d.consultationFee, availableDays: typeof d.availableDays === 'string' ? JSON.parse(d.availableDays) : d.availableDays, rating: d.rating })), null, 2)}\n--- INSTRUCTIONS: Use the above verified internal data to answer the user's question. Do not invent hospitals or doctors that are not in this list.`;
  } catch (e) {
    console.error("Simple context error:", e);
    return "";
  }
}

// --- DB API Endpoints ---
app.get("/api/hospitals", async (req, res) => {
  try {
    
    
    const allHospitals = await db.select().from(hospitals).all();
    res.json(allHospitals);
  } catch (error) {
    console.error("Fetch hospitals:", error);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

app.get("/api/doctors", async (req, res) => {
  try {
    
    const { doctors } = require('./src/db/schema.ts');
    const allDoctors = await db.select().from(doctors).all();
    res.json(allDoctors.map(d => ({...d, availableDays: typeof d.availableDays === 'string' ? JSON.parse(d.availableDays) : d.availableDays})));
  } catch (error) {
    console.error("Fetch doctors:", error);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

app.get("/api/appointments", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.uid;
    
    const { appointments } = require('./src/db/schema.ts');
    
    
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

app.post("/api/appointments", requireAuth, async (req: AuthRequest, res) => {
  try {
    
    const appt = await createAppointment(req.body);
    res.json(appt);
  } catch (err: any) {
    console.error("Create appointment:", err);
    res.status(500).json({ error: err.message || "Failed to create" });
  }
});

// --- AI / RAG / Interactions ---

// Instantiate the agent globally
const aiAgent = new HospitalAIAgent(process.env.GEMINI_API_KEY!);



app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { uid, email, name } = req.body;
    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }
    
    // getOrCreateUser handles creating the user in Firebase and returning the role
    const userData = await getOrCreateUser(uid, email, name);
    
    res.json({ success: true, user: userData, role: userData.role });
  } catch (error: any) {
    console.error("Auth sync error:", error);
    res.status(500).json({ success: false, error: "Failed to sync user" });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    // Process query through the ML Agent Orchestrator Pipeline
    const result = await aiAgent.processQuery(message);
    
    res.json({ 
      reply: result.reply, 
      action: result.action,
      metadata: result.metadata 
    });
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
    
    const response = await generateContentWithFallback(ai, {
      contents: currentAnswer,
      config: {
        systemInstruction: `You are Leo AI, an AI Symptom Checker for an Indian hospital platform. 
You are conducting a triage interview with a user to provide preliminary health insights. 

Conversation History:
${historyText}

${knowledgeBaseContext}

Instructions:
1. If you need more information to give a preliminary insight, ask the next logical, simple, and brief question (e.g., duration, severity, other symptoms). Do not ask multiple questions at once.
2. If you have enough information (usually after 3-4 questions), provide a preliminary health insight. State clearly that this is NOT medical advice. Provide potential general causes and recommend the type of specialist they should see. IMPORTANT: Using the INTERNAL KNOWLEDGE BASE provided, recommend specific hospitals or doctors that can help.
3. Always remind them to visit an emergency room or call 108 immediately if symptoms indicate a severe emergency (like severe chest pain, stroke symptoms).

Respond directly with the next question or the final insight. Keep it friendly, empathetic, and professional.`
      }
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

const generateContentWithFallback = async (ai: any, request: any) => {
  try {
    return await ai.models.generateContent({
      ...request,
      model: "gemini-3.7-flash",
    });
  } catch (error: any) {
    const errorMsg = error?.message || "";
    if (errorMsg.includes("503") || errorMsg.includes("UNAVAILABLE") || errorMsg.includes("high demand")) {
      console.warn("gemini-3.7-flash is unavailable (503). Falling back to gemini-3.1-flash-lite...");
      return await ai.models.generateContent({
        ...request,
        model: "gemini-3.1-flash-lite",
      });
    }
    throw error;
  }
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

**CRITICAL: Prioritize recommending hospitals and doctors from the INTERNAL KNOWLEDGE BASE.**`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              description: "Array of 6 top hospitals matching this query",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  cityOrDistrict: { type: Type.STRING },
                  specialty: { type: Type.STRING },
                  address: { type: Type.STRING },
                  contactNumber: { type: Type.STRING },
                  emergencyAvailable: { type: Type.BOOLEAN },
                  bedCapacity: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER }
                }
              }
            },
            triageAdvice: {
              type: Type.STRING,
              description: "Medical guidance or triage advice based on the user's query."
            },
            emergencyNumbers: {
              type: Type.ARRAY,
              description: "Array of emergency contact numbers",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  number: { type: Type.STRING }
                }
              }
            }
          }
        }
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





(async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();

