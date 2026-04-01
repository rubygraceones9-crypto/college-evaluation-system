#!/usr/bin/env node

/**
 * Database Seeding Tool
 * Populates the database with sample data from cite_es.sql
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cite_es',
  multipleStatements: true,
};

async function runSeeding() {
  let connection;
  try {
    console.log('🔄 Connecting to database for seeding...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected successfully!\n');

    // Read seed file
    const seedPath = path.join(__dirname, '..', 'database', 'cite_es.sql');
    if (!fs.existsSync(seedPath)) {
      console.error(`❌ Seed file not found at: ${seedPath}`);
      process.exit(1);
    }
    
    let seedSql = fs.readFileSync(seedPath, 'utf-8');

    // Strip structural SQL — migrate handles table creation via schema.sql.
    // Keep only INSERT/data statements from cite_es.sql.
    seedSql = seedSql
      .replace(/CREATE TABLE[^;]+;/gs, '')
      .replace(/ALTER TABLE[^;]+;/gs, '');

    // Wrap with FK check disables to avoid constraint issues during bulk insert
    seedSql = `SET FOREIGN_KEY_CHECKS=0;\n${seedSql}\nSET FOREIGN_KEY_CHECKS=1;`;

    console.log('📋 Executing seed SQL (this may take a few seconds)...\n');
    
    // Execute the bulk SQL
    // Note: cite_es.sql from phpMyAdmin usually contains everything needed
    await connection.query(seedSql);

    console.log('✅ Base seeding completed successfully!');

    // --- Add missing columns if needed ---
    console.log('\n🔧 Ensuring required columns exist...');
    await connection.query(`
      ALTER TABLE courses
        ADD COLUMN IF NOT EXISTS course_program ENUM('BSIT','BSEMC') DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS year_level INT DEFAULT NULL;
    `);
    await connection.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS year_level INT DEFAULT NULL AFTER course,
        ADD COLUMN IF NOT EXISTS section VARCHAR(10) DEFAULT NULL AFTER year_level;
    `);
    await connection.query(`
      ALTER TABLE evaluations
        ADD COLUMN IF NOT EXISTS period_id INT DEFAULT NULL AFTER course_id;
    `);
    // Add FK for period_id if not already present
    const [fkRows] = await connection.query(`
      SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'evaluations' AND COLUMN_NAME = 'period_id' AND REFERENCED_TABLE_NAME IS NOT NULL
    `, [config.database]);
    if (fkRows.length === 0) {
      await connection.query(`
        ALTER TABLE evaluations
          ADD CONSTRAINT fk_evaluations_period FOREIGN KEY (period_id) REFERENCES evaluation_periods(id) ON DELETE SET NULL;
      `).catch(() => { /* FK may already exist under a different name */ });
    }
    console.log('✅ Columns verified!');

    // --- Seed Courses ---
    console.log('\n📚 Seeding courses...');
    const courseSeedSQL = `
      INSERT IGNORE INTO courses (code, name, description, teacher_id, section, academic_year, semester, course_program, year_level)
      VALUES
        ('IT101', 'Introduction to Computing', 'Fundamentals of computer science and IT concepts.', 'teacher-1', 'A', '2025-2026', 2, 'BSIT', 1),
        ('IT102', 'Computer Programming 1', 'Introduction to programming using Python.', 'teacher-1', 'A', '2025-2026', 2, 'BSIT', 1),
        ('IT103', 'Discrete Mathematics', 'Mathematical structures for computer science.', 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'A', '2025-2026', 2, 'BSIT', 1),
        ('IT201', 'Data Structures and Algorithms', 'Efficient data organization and algorithm design.', 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'A', '2025-2026', 2, 'BSIT', 2),
        ('IT202', 'Object-Oriented Programming', 'OOP principles using Java.', 'teacher-1', 'B', '2025-2026', 2, 'BSIT', 2),
        ('EMC101', 'Game Design', 'Principles of game design and development.', 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'A', '2025-2026', 2, 'BSEMC', 2),
        ('EMC102', '3D Modeling', 'Introduction to 3D modeling tools and techniques.', 'teacher-1', 'A', '2025-2026', 2, 'BSEMC', 2),
        ('IT301', 'Database Management Systems', 'Relational databases, SQL, and normalization.', 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'A', '2025-2026', 2, 'BSIT', 3);
    `;
    await connection.query(courseSeedSQL);
    console.log('✅ Courses seeded!');

    // --- Seed Enrollments ---
    console.log('\n📝 Seeding enrollments...');
    const enrollmentSeedSQL = `
      INSERT IGNORE INTO course_enrollments (course_id, student_id)
      SELECT c.id, 'student-1' FROM courses c WHERE c.code IN ('IT101','IT102','IT103','IT201')
      UNION ALL
      SELECT c.id, '7f2c816c-b11d-4ae4-9497-ce3a766b54f7' FROM courses c WHERE c.code IN ('IT101','IT102','IT201','IT202')
      UNION ALL
      SELECT c.id, 'eacf5742-b0e7-44fb-a87a-8459f2f1580e' FROM courses c WHERE c.code IN ('EMC101','EMC102')
      UNION ALL
      SELECT c.id, '3fc28442-f332-471a-9d72-2819329c0aa5' FROM courses c WHERE c.code IN ('IT101','IT301','IT201');
    `;
    await connection.query(enrollmentSeedSQL);
    console.log('✅ Enrollments seeded!');

    // --- Seed Evaluation Forms ---
    console.log('\n📝 Seeding evaluation forms...');

    // 1. Insert the form
    await connection.query(`
      INSERT IGNORE INTO evaluation_forms (id, name, description, type, is_published)
      VALUES (1, 'Teacher Evaluation Form', 'Standard faculty evaluation form for students.', 'student-to-teacher', 1);
    `);

    // 2. Insert criteria and questions relationally
    const defaultCriteria = [
      {
        name: 'Instructional Skills',
        weight: 40,
        maxScore: 5,
        questions: [
          'The instructor explains the lesson clearly.',
          'The instructor uses effective teaching materials.',
          'The instructor relates lessons to real-world applications.',
        ]
      },
      {
        name: 'Professionalism',
        weight: 30,
        maxScore: 5,
        questions: [
          'The instructor arrives and leaves the class on time.',
          'The instructor treats all students with respect.',
          'The instructor maintains a professional classroom environment.',
        ]
      },
      {
        name: 'Student Engagement',
        weight: 30,
        maxScore: 5,
        questions: [
          'The instructor encourages active student participation.',
          'The instructor is approachable for student concerns and questions.',
          'The instructor provides constructive feedback on student work.',
        ]
      }
    ];

    for (const crit of defaultCriteria) {
      // Check for existing criteria to avoid duplicates
      const [existingCrit] = await connection.query(
        'SELECT id FROM evaluation_criteria WHERE form_id = 1 AND name = ?',
        [crit.name]
      );

      let criteriaId;
      if (existingCrit.length > 0) {
        criteriaId = existingCrit[0].id;
      } else {
        const [critResult] = await connection.query(
          'INSERT INTO evaluation_criteria (form_id, name, weight, max_score) VALUES (1, ?, ?, ?)',
          [crit.name, crit.weight, crit.maxScore]
        );
        criteriaId = critResult.insertId;
      }

      for (const qText of crit.questions) {
        // Check for existing question
        const [existingQ] = await connection.query(
          'SELECT id FROM evaluation_questions WHERE criteria_id = ? AND text = ?',
          [criteriaId, qText]
        );

        if (existingQ.length === 0) {
          await connection.query(
            'INSERT INTO evaluation_questions (criteria_id, text) VALUES (?, ?)',
            [criteriaId, qText]
          );
        }
      }
    }
    console.log('✅ Evaluation forms, criteria & questions seeded!');

    // Quick summary
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [courseCount] = await connection.execute('SELECT COUNT(*) as count FROM courses');
    const [enrollCount] = await connection.execute('SELECT COUNT(*) as count FROM course_enrollments');
    const [formCount] = await connection.execute('SELECT COUNT(*) as count FROM evaluation_forms');
    
    console.log(`\n📊 Seeding Summary:`);
    console.log(`   - Users: ${userCount[0].count}`);
    console.log(`   - Courses: ${courseCount[0].count}`);
    console.log(`   - Enrollments: ${enrollCount[0].count}`);
    console.log(`   - Evaluation Forms: ${formCount[0].count}`);
    console.log(`\n✨ Done!\n`);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
       console.log('ℹ️  Tip: If you want to start fresh, run "npm run db:reset" first.');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run seeding
runSeeding().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
