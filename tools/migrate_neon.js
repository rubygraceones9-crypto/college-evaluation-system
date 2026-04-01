const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ Error: DATABASE_URL environment variable is not set. Use "$env:DATABASE_URL=\'url\'; npm run db:init" in PowerShell.');
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
