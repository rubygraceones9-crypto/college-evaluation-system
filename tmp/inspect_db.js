const { Client } = require('pg');

async function main() {
  const conn = "postgresql://neondb_owner:npg_k0h9pXrJxRcQ@ep-lingering-flower-a4gancu9-pooler.us-east-1.aws.neon.tech/neondb";
  const client = new Client({
    connectionString: conn,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    
    console.log('--- ALL USERS ---');
    const users = (await client.query("SELECT id, name, role, course, year_level, section FROM users")).rows;
    console.log(JSON.stringify(users, null, 2));

    console.log('--- ALL EVALUATIONS ---');
    const evals = (await client.query("SELECT * FROM evaluations")).rows;
    console.log(JSON.stringify(evals, null, 2));

    console.log('--- ALL ENROLLMENTS ---');
    const enrolls = (await client.query("SELECT * FROM course_enrollments")).rows;
    console.log(JSON.stringify(enrolls, null, 2));

    console.log('--- ALL COURSES ---');
    const courses = (await client.query("SELECT * FROM courses")).rows;
    console.log(JSON.stringify(courses, null, 2));

    console.log('--- ALL EVAL PERIODS ---');
    const periods = (await client.query("SELECT * FROM evaluation_periods")).rows;
    console.log(JSON.stringify(periods, null, 2));

    await client.end();
  } catch (err) {
    console.error('FAILED:', err);
    process.exit(1);
  }
}

main();
