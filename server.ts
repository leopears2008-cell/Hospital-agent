import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

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
