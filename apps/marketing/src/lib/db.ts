import { createDb } from '@flamingo/db';

let db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!db) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL not set');
    db = createDb(url);
  }
  return db;
}
