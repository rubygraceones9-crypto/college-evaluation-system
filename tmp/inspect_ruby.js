const { Client } = require('pg');
async function main() {
  const conn = "postgresql://neondb_owner:npg_k0h9pXrJxRcQ@ep-lingering-flower-a4gancu9-pooler.us-east-1.aws.neon.tech/neondb";
  const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
  await client.connect();
  const ruby = (await client.query("SELECT * FROM users WHERE name LIKE '%Ruby Grace%'")).rows[0];
  if (ruby) {
    console.log(`FOUND RUBY: ${ruby.id}`);
    const evals = (await client.query("SELECT e.*, c.code FROM evaluations e LEFT JOIN courses c ON e.course_id = c.id WHERE e.evaluator_id = $1", [ruby.id])).rows;
    console.log(`TOTAL EVALS FOR RUBY: ${evals.length}`);
    evals.forEach(e => console.log(`EvalID: ${e.id}, Period: ${e.period_id}, Course: ${e.code}, Status: ${e.status}`));
    const active = (await client.query("SELECT * FROM evaluation_periods WHERE status = 'active'")).rows;
    console.log(`ACTIVE PERIODS: ${active.length}`);
    active.forEach(p => console.log(`PeriodID: ${p.id}, AY: ${p.academic_year}, Sem: ${p.semester}`));
  }
  await client.end();
}
main().catch(console.error);
