import { Pool } from 'pg';

// For Neon Cloud, we use a single connection string (DATABASE_URL or DATABASE_URI)
const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URI;

const globalForDb = globalThis as unknown as { __dbPool?: Pool };

const pool = globalForDb.__dbPool ?? new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Increased for concurrent Cloud users
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // 10s wait for Neon to wake up
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
  // Strip backticks entirely as they often cause case-sensitivity issues in Postgres
  const cleanedSql = sql.replace(/`/g, ''); 
  return cleanedSql.replace(/\?/g, () => `$${index++}`);
}

export async function query(sql: string, values?: any[]) {
  try {
    const translatedSql = translateSql(sql);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('DB_QUERY:', { sql: translatedSql, values });
    }

    const res = await pool.query(translatedSql, values || []);
    return res.rows || [];
  } catch (error: any) {
    console.error('DATABASE_ERROR:', {
      sql,
      message: error.message,
      detail: error.detail,
    });
    // Return empty array instead of crashing to prevent 502s on soft-failures
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
