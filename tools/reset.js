#!/usr/bin/env node

/**
 * Database Reset Tool
 * Safely drops all tables and rebuilds them
 * ⚠️  WARNING: This permanently deletes all data!
 */

const mysql = require('mysql2/promise');
const path = require('path');
const readline = require('readline');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cite_es',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function confirm(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

async function resetDatabase() {
  let connection;
  try {
    // Confirm reset
    console.log('\n⚠️  WARNING: This will DELETE ALL DATA in the database!\n');
    const confirmed = await confirm('Type "yes" to confirm reset: ');

    if (!confirmed) {
      console.log('\n❌ Reset cancelled.\n');
      rl.close();
      return;
    }

    console.log('\n🔄 Connecting to database...');
    connection = await mysql.createConnection(config);

    // Get all tables
    const [tables] = await connection.execute(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
      [config.database]
    );

    console.log(`\n🗑️  Dropping ${tables.length} tables...\n`);

    // Disable foreign key checks to avoid drop errors
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    // Drop all tables
    for (const table of tables) {
      try {
        await connection.execute(`DROP TABLE IF EXISTS \`${table.TABLE_NAME}\``);
        console.log(`✅ Dropped ${table.TABLE_NAME}`);
      } catch (error) {
        console.error(`❌ Failed to drop ${table.TABLE_NAME}: ${error.message}`);
      }
    }

    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('\n✨ Database reset complete!\n');
    console.log('💡 Next step: Run "npm run db:init" to create tables and seed data.\n');

  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
    rl.close();
  }
}

// Run reset
resetDatabase().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
