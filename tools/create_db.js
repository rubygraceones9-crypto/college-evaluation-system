const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function createDb() {
  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  };
  
  try {
    const connection = await mysql.createConnection(config);
    await connection.query("CREATE DATABASE IF NOT EXISTS cite_es CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    console.log("Database cite_es created successfully.");
    await connection.end();
  } catch (error) {
    console.error("Error creating database:", error);
    process.exit(1);
  }
}

createDb();
