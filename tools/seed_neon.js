const { Client } = require('pg');

async function seed() {
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
    console.log('Connecting to Neon for seeding...');
    await client.connect();

    // 1. Create Default Admin
    // Using simple ID format to match project style
    const adminId = 'admin-001';
    const checkAdmin = await client.query('SELECT * FROM users WHERE email = $1', ['admin@cite.edu']);
    
    if (checkAdmin.rows.length === 0) {
      console.log('Creating Admin Account...');
      await client.query(
        'INSERT INTO users (id, name, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5, $6)',
        [adminId, 'CITE System Admin', 'admin@cite.edu', 'admin', 'dean', true]
      );
      console.log('✅ Admin account created: admin@cite.edu / admin');
    } else {
      console.log('✅ Admin account already exists.');
    }

    // 2. Clear out any old audit logs/sessions for a fresh start
    // await client.query('TRUNCATE audit_logs, sessions CASCADE');

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await client.end();
  }
}

seed();
