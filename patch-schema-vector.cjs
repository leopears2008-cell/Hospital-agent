const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

if (!code.includes('knowledge_chunks')) {
  code += `\n
import { customType, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const vector = customType<{ data: number[], driverData: string }>({
  dataType() {
    return 'vector(768)';
  },
  toDriver(value) {
    return JSON.stringify(value);
  },
  fromDriver(value) {
    return JSON.parse(value as string);
  },
});

export const knowledge_chunks = pgTable('knowledge_chunks', {
  id: serial('id').primaryKey(),
  documentId: text('document_id').notNull(),
  documentType: text('document_type').notNull(),
  content: text('content').notNull(),
  metadata: text('metadata').notNull(), // JSON stringified metadata
  embedding: vector('embedding'),
  createdAt: timestamp('created_at').defaultNow(),
});
`;
  fs.writeFileSync('src/db/schema.ts', code);
  console.log("Updated schema.ts with knowledge_chunks");
}
