const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const toolsCode = `
    const chatTools = [{
      functionDeclarations: [
        {
          name: "book_appointment",
          description: "Trigger the UI to open the appointment booking modal for a specific department or doctor.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              department: { type: Type.STRING, description: "The medical department (e.g., Cardiology)" },
              doctorId: { type: Type.STRING, description: "The ID of the specific doctor if mentioned" }
            }
          }
        },
        {
          name: "find_doctors",
          description: "Navigate the user to the Doctor Directory with specific filters.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              specialty: { type: Type.STRING, description: "The specialty to filter by" }
            }
          }
        },
        {
          name: "find_hospitals",
          description: "Navigate the user to the Hospital Directory with specific filters.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              district: { type: Type.STRING, description: "The district or city" },
              specialty: { type: Type.STRING, description: "The specialty required" }
            }
          }
        }
      ]
    }];
`;

const replacement = `
    const ai = getAiClient();
    
    // RAG step: Retrieve internal data based on the user's message
    const knowledgeBaseContext = retrieveKnowledgeBase(message);
${toolsCode}
    const response = await generateContentWithFallback(ai, {
      contents: message,
      config: {
        tools: chatTools,
        systemInstruction: \`You are Leo AI, an AI Health Assistant for Tamil Nadu Hospitals. 
\${knowledgeBaseContext}

Instructions:
You are an ACTION-BASED AI. If the user wants to book an appointment, find doctors, or find hospitals, ALWAYS use the appropriate tool/function call (book_appointment, find_doctors, find_hospitals) instead of just replying with text.
If the user's request is informational or medical advice, provide a helpful, brief, and medically sound response. If they ask about specific doctors, hospitals, or availability, answer using ONLY the internal knowledge base provided. Remind them you are an AI and for emergencies they should call 108. Keep responses highly empathetic, polite, and professional.
DO NOT pretend to diagnose patients. For emergency symptoms, clearly direct users toward emergency services (108).
\`
      }
    });

    let action = null;
    let replyText = response.text || "";

    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      action = {
        type: call.name,
        payload: call.args
      };
      
      // Provide a brief textual response acknowledging the action
      if (call.name === "book_appointment") {
        replyText = "I'm opening the appointment booking form for you now.";
      } else if (call.name === "find_doctors") {
        replyText = "Here are the doctors matching your request.";
      } else if (call.name === "find_hospitals") {
        replyText = "I've updated the hospital directory for you.";
      }
    }
    
    res.json({ reply: replyText, action });
`;

code = code.replace(/const ai = getAiClient\(\);\s*\/\/\s*RAG step: Retrieve internal data based on the user's message\s*const knowledgeBaseContext = retrieveKnowledgeBase\(message\);\s*const response = await generateContentWithFallback\(ai, \{\s*contents: message,\s*config: \{\s*systemInstruction: [^}]+\}\s*\}\);\s*res\.json\(\{ reply: response\.text \}\);/m, replacement.trim());

fs.writeFileSync('server.ts', code);
