const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const connectionString = process.argv[2];
  if (!connectionString) {
    console.error('Usage: node migrate_neon.js <DATABASE_URL>');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Neon...');
    await client.connect();
    console.log('Connected!');

    const schemaPath = path.join(__dirname, '..', 'database', 'schema_neon.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Applying Postgres Schema...');
    await client.query(schema);
    console.log('✅ Schema migration successful!');

  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
