import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema.ts';

const remoteUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && (!remoteUrl || remoteUrl.startsWith('file:'))) {
  throw new Error('Production requires a persistent remote database. Set TURSO_DATABASE_URL (and TURSO_AUTH_TOKEN if required) or DATABASE_URL.');
}

const client = createClient({
  url: remoteUrl || 'file:./local.db',
  ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {}),
});

export const db = drizzle(client, { schema });
