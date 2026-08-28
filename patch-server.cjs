const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const importRegex = /import \{ GoogleGenAI, Type \} from "@google\/genai";/g;
if (!code.includes('import { HospitalAIAgent }')) {
  code = code.replace(importRegex, 'import { GoogleGenAI, Type } from "@google/genai";\nimport { HospitalAIAgent } from "./src/lib/ai-agent.ts";');
}

// Remove the old retrieveKnowledgeBase
const retRegex = /function retrieveKnowledgeBase.*?\}\n\n/s;
code = code.replace(retRegex, '');

// Replace the /api/chat route logic
const routeRegex = /app\.post\("\/api\/chat", async \(req, res\) => \{.*?catch \(error: any\) \{.*?\}\n\}\);/s;

const newRoute = `
// Instantiate the agent globally
const aiAgent = new HospitalAIAgent(process.env.GEMINI_API_KEY!);

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
`;

code = code.replace(routeRegex, newRoute.trim());

fs.writeFileSync('server.ts', code);
console.log("Updated server.ts with HospitalAIAgent");
