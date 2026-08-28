const fs = require('fs');
let code = fs.readFileSync('/app/applet/server.ts', 'utf8');

if (!code.includes('/api/semantic-search')) {
  const injection = `
import { PgVectorStore, EmbeddingProvider } from './src/lib/vector-store.ts';

class GeminiEmbeddingProvider implements EmbeddingProvider {
  private ai: any;
  constructor(ai: any) {
    this.ai = ai;
  }
  
  async embedText(text: string): Promise<number[]> {
    const response = await this.ai.models.embedContent({
      model: 'text-embedding-004',
      contents: text,
    });
    return response.embeddings[0].values;
  }
  
  async embedBatch(texts: string[]): Promise<number[][]> {
    const promises = texts.map(t => this.embedText(t));
    return Promise.all(promises);
  }
}

let vectorStore: PgVectorStore | null = null;
try {
  vectorStore = new PgVectorStore(new GeminiEmbeddingProvider(getAiClient()));
} catch (e) {
  console.error("Could not init vectorStore", e);
}

app.post("/api/semantic-search", async (req, res) => {
  try {
    const { query, topK = 5, documentType, hospitalId, department } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    
    if (!vectorStore) {
      return res.status(500).json({ error: "Vector store not initialized" });
    }
    
    const filter: any = {};
    if (documentType) filter.documentType = documentType;
    if (hospitalId) filter.hospitalId = hospitalId;
    if (department) filter.department = department;

    const results = await vectorStore.similaritySearch(query, topK, Object.keys(filter).length > 0 ? filter : undefined);
    res.json({ results });
  } catch (error: any) {
    console.error("Semantic search error:", error);
    res.status(500).json({ error: "Failed to perform semantic search" });
  }
});
`;
  code = code.replace('async function startServer() {', injection + '\nasync function startServer() {');
  fs.writeFileSync('/app/applet/server.ts', code);
  console.log("Patched server.ts successfully.");
}
