import { GoogleGenAI } from "@google/genai";
import { HospitalAIAgent } from "./src/lib/ai-agent.ts";
import * as dotenv from 'dotenv';
dotenv.config();

const testQueries = [
  { q: "Can I get an appointment with a cardiologist in Chennai?", intent: "doctor_search" },
  { q: "Is Apollo Hospitals open 24/7?", intent: "hospital_search" },
  { q: "I have severe chest pain and cannot breathe.", intent: "emergency" },
  { q: "Cancel my appointment.", intent: "general_query" }
];

async function runEvaluation() {
  console.log("Starting RAG & Intent Evaluation Pipeline...");
  
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY missing. Skipping actual API calls.");
    return;
  }
  
  const agent = new HospitalAIAgent(process.env.GEMINI_API_KEY);
  await agent.initialize();

  let passed = 0;
  console.log("--------------------------------------------------");
  for (const t of testQueries) {
    console.log(`Query: "${t.q}"`);
    try {
      const res = await agent.processQuery(t.q);
      console.log(`Detected Intent: ${res.metadata.intent} | Expected: ${t.intent}`);
      if (res.metadata.intent === t.intent || (t.intent === 'general_query' && res.metadata.intent !== 'emergency')) {
        passed++;
        console.log("✅ PASS");
      } else {
        console.log("❌ FAIL");
      }
      console.log(`Retrieved Context Chunks: ${res.metadata.retrievedChunks.length}`);
      console.log(`Response Snippet: ${res.reply.substring(0, 50)}...`);
    } catch (e) {
      console.error("Error during evaluation:", e);
    }
    console.log("--------------------------------------------------");
  }
  
  console.log(`\nEvaluation Complete. ${passed}/${testQueries.length} passed.`);
}

runEvaluation();
