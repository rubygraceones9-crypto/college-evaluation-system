#!/usr/bin/env node

/**
 * Database Truncate Tool
 * Wipes all row data but keeps the schema (tables, columns, indexes) intact.
 * ⚠️  WARNING: This permanently deletes all data!
 */

const mysql = require('mysql2/promise');
const path = require('path');
const readline = require('readline');

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

async function truncateDatabase() {
  let connection;
  try {
    console.log('\n⚠️  WARNING: This will DELETE ALL DATA but keep the table structure!\n');
    const confirmed = await confirm('Type "yes" to confirm: ');

    if (!confirmed) {
      console.log('\n❌ Cancelled.\n');
      rl.close();
      return;
    }

    console.log('\n🔄 Connecting to database...');
    connection = await mysql.createConnection(config);

    const [tables] = await connection.execute(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'`,
      [config.database]
    );

    console.log(`\n🗑️  Truncating ${tables.length} tables...\n`);

    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    for (const table of tables) {
      try {
        await connection.execute(`TRUNCATE TABLE \`${table.TABLE_NAME}\``);
        console.log(`  ✅ ${table.TABLE_NAME}`);
      } catch (error) {
        console.error(`  ❌ ${table.TABLE_NAME}: ${error.message}`);
      }
    }

    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('\n✨ All data wiped. Schema intact.\n');
    console.log('💡 Run "npm run db:seed" to re-populate with sample data.\n');
  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
    rl.close();
  }
}

truncateDatabase().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
