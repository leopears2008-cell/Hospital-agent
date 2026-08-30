import { db } from '../db/index.ts';
import { knowledge_chunks } from '../db/schema.ts';
import { sql, and, eq, desc, gte } from 'drizzle-orm';
import { IngestedChunk } from './rag-ingestion.ts';

// ---------------------------------------------------------
// 1. Embedding Provider Abstraction
// ---------------------------------------------------------
/**
 * An interface to abstract the embedding model, making it easy to swap
 * between Gemini, OpenAI, or local embedding models without changing the vector store.
 */
export interface EmbeddingProvider {
  /**
   * Generates a single vector embedding for a given text.
   */
  embedText(text: string): Promise<number[]>;
  
  /**
   * Generates multiple vector embeddings for batch ingestion.
   */
  embedBatch(texts: string[]): Promise<number[][]>;
}

// ---------------------------------------------------------
// 2. Search Interfaces
// ---------------------------------------------------------
export interface VectorSearchFilter {
  documentType?: string;
  hospitalId?: string;
  department?: string;
}

export interface SearchResult {
  id: number;
  documentId: string;
  documentType: string;
  content: string;
  metadata: any;
  similarity: number;
}

// ---------------------------------------------------------
// 3. PostgreSQL Vector Store Implementation
// ---------------------------------------------------------
export class PgVectorStore {
  private embeddingProvider: EmbeddingProvider;

  constructor(embeddingProvider: EmbeddingProvider) {
    this.embeddingProvider = embeddingProvider;
  }

  /**
   * Ingests chunks into the PostgreSQL vector database.
   */
  public async addChunks(chunks: IngestedChunk[]): Promise<void> {
    if (chunks.length === 0) return;

    // Generate embeddings for all chunks via the abstracted provider
    const texts = chunks.map(c => c.content);
    const embeddings = await this.embeddingProvider.embedBatch(texts);

    const insertData = chunks.map((chunk, i) => ({
      documentId: chunk.metadata.document_id,
      documentType: chunk.metadata.document_type,
      content: chunk.content,
      // The schema currently defines metadata as a string.
      // We stringify it here. For a JSONB column, it would be passed directly or cast.
      metadata: JSON.stringify(chunk.metadata), 
      embedding: embeddings[i],
    }));

    // Batch insert into pgvector table
    try {
      await db.insert(knowledge_chunks).values(insertData);
    } catch (e) {
      console.warn("Database not connected, skipping insert.");
    }
  }

  /**
   * Performs semantic search using pgvector cosine distance.
   * 
   * @param query The search query string
   * @param topK Number of results to return
   * @param filter Optional metadata filters (e.g. restrict to hospital or department)
   * @param similarityThreshold Minimum similarity score (0 to 1)
   */
  public async similaritySearch(
    query: string,
    topK: number = 5,
    filter?: VectorSearchFilter,
    similarityThreshold: number = 0.5
  ): Promise<SearchResult[]> {
    
    // 1. Generate query embedding
    const queryVector = await this.embeddingProvider.embedText(query);
    const queryVectorStr = JSON.stringify(queryVector);

    // 2. Calculate Cosine Similarity: 1 - (embedding <=> query_vector)
    // pgvector uses `<=>` for cosine distance. Distance 0 = exactly the same (similarity 1).
    const similarityScore = sql`1 - (${knowledge_chunks.embedding} <=> ${queryVectorStr}::vector)`;

    // 3. Build dynamic filters
    const conditions = [];
    
    // Filter by threshold
    conditions.push(gte(similarityScore, similarityThreshold));

    // Metadata filters
    if (filter?.documentType) {
      conditions.push(eq(knowledge_chunks.documentType, filter.documentType));
    }
    
    // Dynamically querying a stringified JSON column by casting it to JSONB on the fly.
    // If you plan to filter by metadata frequently, it is recommended to alter the schema 
    // to use `jsonb` instead of `text` for better index performance.
    if (filter?.hospitalId) {
      conditions.push(sql`${knowledge_chunks.metadata}::jsonb ->> 'hospital_id' = ${filter.hospitalId}`);
    }
    if (filter?.department) {
      conditions.push(sql`${knowledge_chunks.metadata}::jsonb ->> 'department' = ${filter.department}`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 4. Execute query
    try {
      const results = await db
        .select({
          id: knowledge_chunks.id,
          documentId: knowledge_chunks.documentId,
          documentType: knowledge_chunks.documentType,
          content: knowledge_chunks.content,
          metadata: knowledge_chunks.metadata,
          similarity: similarityScore,
        })
        .from(knowledge_chunks)
        .where(whereClause)
        .orderBy(desc(similarityScore))
        .limit(topK);

      return results.map((row: any) => ({
        ...row,
        similarity: Number(row.similarity), 
        metadata: row.metadata ? JSON.parse(row.metadata) : {}
      }));
    } catch (e) {
      console.warn("Database not connected, returning empty vector search results.");
      return [];
    }
  }
}
