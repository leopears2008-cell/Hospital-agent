export interface DocumentMetadata {
  document_id: string;
  document_type: string;
  hospital_id?: string;
  department?: string;
  source?: string;
  language: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface IngestedChunk {
  id: string;
  content: string;
  metadata: DocumentMetadata;
}

/**
 * RAG Document Ingestion Pipeline
 * 
 * Handles the processing of raw knowledge base texts and markdown documents
 * into semantically boundary-aware chunks for vector embeddings.
 */
export class DocumentIngestionPipeline {
  /**
   * Generates a standardized metadata object for document chunking.
   */
  static createMetadata(
    documentId: string,
    documentType: string,
    additionalData: Partial<DocumentMetadata> = {}
  ): DocumentMetadata {
    const now = new Date().toISOString();
    return {
      document_id: documentId,
      document_type: documentType,
      language: 'en', // Default to English, can be overridden
      created_at: now,
      updated_at: now,
      ...additionalData
    };
  }

  /**
   * Semantically chunks markdown or plain text by headings and paragraphs.
   * Ensures that logical sections are kept together up to a maximum character limit,
   * and preserves the nearest preceding heading context so chunks remain grounded.
   */
  static chunkDocument(
    text: string, 
    metadata: DocumentMetadata, 
    maxChars: number = 1000
  ): IngestedChunk[] {
    const chunks: IngestedChunk[] = [];
    
    // Split text by double newlines to isolate paragraphs and headings
    const paragraphs = text.split(/\n\n+/);
    
    let currentHeading = '';
    let currentChunkContent = '';

    const finalizeChunk = () => {
      if (currentChunkContent.trim()) {
        const id = typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : Math.random().toString(36).substring(2, 15);

        // Prepend the heading context to the chunk if it isn't the heading itself
        let finalContent = currentChunkContent.trim();
        if (currentHeading && !finalContent.startsWith('#')) {
          finalContent = `Context: ${currentHeading}\n\n${finalContent}`;
        }

        chunks.push({
          id: `chunk_${id}`,
          content: finalContent,
          metadata: { ...metadata }
        });
        currentChunkContent = '';
      }
    };

    for (const p of paragraphs) {
      const trimmed = p.trim();
      if (!trimmed) continue;

      // Check if this paragraph is a Markdown heading
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)/);
      if (headingMatch) {
        // If we hit a new heading, finalize the current chunk context
        if (currentChunkContent) {
          finalizeChunk();
        }
        currentHeading = headingMatch[2]; // Keep track of the heading string
        currentChunkContent = trimmed;
      } else {
        // Normal paragraph logic
        if (currentChunkContent.length + trimmed.length > maxChars) {
          // If adding this paragraph exceeds the limit, cut a chunk here
          finalizeChunk();
          currentChunkContent = trimmed;
        } else {
          // Otherwise append it to the current accumulating block
          currentChunkContent += (currentChunkContent ? '\n\n' : '') + trimmed;
        }
      }
    }

    // Flush any remaining text in the buffer
    if (currentChunkContent) {
      finalizeChunk();
    }

    return chunks;
  }
}
