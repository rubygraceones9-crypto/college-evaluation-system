const mysql = require('mysql2/promise');

async function dumpSchema() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cite_es',
  });

  const [tables] = await connection.query('SHOW TABLES');
  const tableNames = tables.map((t) => Object.values(t)[0]);

  let schemaText = '';
  for (const tableName of tableNames) {
    const [createTableResult] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
    schemaText += createTableResult[0]['Create Table'] + ';\n\n';
  }

  console.log(schemaText);
  await connection.end();
}

dumpSchema().catch(console.error);
