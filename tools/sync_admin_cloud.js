const { Client } = require('pg');

async function main() {
  const connectionString = "postgresql://neondb_owner:npg_k0h9pXrJxRcQ@ep-lingering-flower-a4gancu9-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log('Synchronizing Admin Account on Neon Cloud...');
    
    // Clean up old potential duplicates
    await client.query('DELETE FROM users WHERE email = $1', ['admin@cite.edu.ph']);
    await client.query('DELETE FROM users WHERE email = $1', ['admin@cite.edu']);
    
    // Insert the fresh, verified admin account
    await client.query(
      'INSERT INTO users (id, name, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5, $6)',
      ['admin-001', 'CITE System Admin', 'admin@cite.edu', 'admin', 'dean', true]
    );

    console.log('✅ Admin Account Synced: admin@cite.edu / admin');
  } catch (err) {
    console.error('❌ Cloud Sync Failed:', err);
  } finally {
    await client.end();
    process.exit(0);
  }
}

main();
