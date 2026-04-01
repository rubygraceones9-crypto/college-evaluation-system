const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cite_es',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  try {
    const conn = await pool.getConnection();
    try {
      const [users] = await conn.execute('SELECT id, name, email, role, created_at FROM users ORDER BY created_at LIMIT 10');
      console.log('=== USERS SAMPLE ===');
      console.log(JSON.stringify(users, null, 2));

      const [comments] = await conn.execute('SELECT id, entity_type, entity_id, author_id, content, created_at FROM comments ORDER BY created_at LIMIT 10');
      console.log('\n=== COMMENTS SAMPLE ===');
      console.log(JSON.stringify(comments, null, 2));

      const [[uCount]] = await conn.query('SELECT COUNT(*) as cnt FROM users');
      const [[cCount]] = await conn.query('SELECT COUNT(*) as cnt FROM comments');
      console.log('\n=== COUNTS ===');
      console.log({ users: uCount.cnt, comments: cCount.cnt });
    } finally {
      conn.release();
    }
  } catch (e) {
    console.error('DB_ERR', e.message);
    process.exit(1);
  }
  process.exit(0);
})();
