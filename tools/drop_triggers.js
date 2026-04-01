const { Client } = require('pg');

async function dropTriggers() {
  const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URI;
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const tables = ['users', 'courses', 'course_enrollments', 'academic_periods', 'evaluation_periods', 'evaluations', 'evaluation_forms', 'evaluation_criteria', 'evaluation_questions', 'evaluation_responses', 'comments', 'audit_logs', 'sessions'];

    for (const table of tables) {
      try {
        await client.query(`DROP TRIGGER IF EXISTS trigger_update_updated_at ON ${table}`);
        console.log(`Dropped trigger on ${table}`);
      } catch (e) {
        console.log(`No trigger on ${table}: ${e.message}`);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

dropTriggers();