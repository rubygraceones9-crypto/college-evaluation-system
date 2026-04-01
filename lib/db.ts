import { Pool } from 'pg';

// For Neon Cloud, we use a single connection string (DATABASE_URL)
const connectionString = process.env.DATABASE_URL;

const globalForDb = globalThis as unknown as { __dbPool?: Pool };

const pool = globalForDb.__dbPool ?? new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__dbPool = pool;
}

/**
 * Helper to translate MySQL style '?' to Postgres style '$1, $2...'
 * Also strips MySQL backticks (`) which Postgres doesn't like.
 */
function translateSql(sql: string) {
  let index = 1;
  const cleanedSql = sql.replace(/`/g, '"'); // Postgres likes double-quotes for identifiers if needed, but none is often better
  return cleanedSql.replace(/\?/g, () => `$${index++}`);
}

export async function query(sql: string, values?: any[]) {
  try {
    const client = await pool.connect();
    try {
      // Postgres uses $1, $2 instead of ?
      const translatedSql = translateSql(sql);
      const res = values 
        ? await client.query(translatedSql, values) 
        : await client.query(translatedSql);
      
      // Return .rows to match the previous mysql2 [results] format
      return res.rows || [];
    } finally {
      client.release();
    }
  } catch (error) {
    console.warn('DB query failed, returning empty result:', error);
    return [];
  }
}

export async function queryOne(sql: string, values?: any[]) {
  try {
    const results = await query(sql, values);
    return Array.isArray(results) && results.length > 0 ? results[0] : null;
  } catch (error) {
    console.warn('DB queryOne failed, returning null:', error);
    return null;
  }
}

export default pool;
