#!/usr/bin/env node

/**
 * Admin Account Creation Tool
 * Seeds a default admin account into the database
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cite_es',
};

async function createAdmin() {
  let connection;
  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected successfully!');

    const adminEmail = 'admin@jmc.edu.ph';
    const adminPassword = 'admin123'; // Default password

    // Check if admin exists
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [adminEmail]);

    if (rows.length > 0) {
      console.log(`⚠️  Admin account (${adminEmail}) already exists.`);
      console.log('   Skipping creation to avoid overwriting existing data.');
    } else {
      console.log('🔐 Storing plain text password...');
      // const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const hashedPassword = adminPassword;

      const adminId = uuidv4();
      console.log('👤 Creating admin user...');

      await connection.execute(
        'INSERT INTO users (id, name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [adminId, 'System Admin', adminEmail, hashedPassword, 'dean', 1]
      );

      console.log('✅ Admin account created successfully!');
      console.log('----------------------------------------');
      console.log(`   Email:    ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log('----------------------------------------');
    }

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdmin().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
