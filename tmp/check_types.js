const { Client } = require('pg');
async function main() {
  const conn = "postgresql://neondb_owner:npg_k0h9pXrJxRcQ@ep-lingering-flower-a4gancu9-pooler.us-east-1.aws.neon.tech/neondb";
  const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
  await client.connect();
  const ruby = (await client.query("SELECT id FROM users WHERE name LIKE '%Ruby Grace%'")).rows[0];
  if (ruby) {
    const types = await client.query("SELECT DISTINCT evaluation_type FROM evaluations WHERE evaluator_id = $1", [ruby.id]);
    console.log('TYPES FOR RUBY:', types.rows);
    const evals = await client.query("SELECT id, period_id, evaluation_type, status FROM evaluations WHERE evaluator_id = $1", [ruby.id]);
    console.log('EVALS FOR RUBY:', evals.rows.slice(0, 5));
  }
  await client.end();
}
main().catch(console.error);
