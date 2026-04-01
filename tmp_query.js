const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cite_es'
  });

  const [rows] = await connection.execute("SELECT * FROM comments WHERE content LIKE '%niceee%'");
  console.log(JSON.stringify(rows, null, 2));
  await connection.end();
}

run().catch(console.error);
