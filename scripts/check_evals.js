import { query } from './lib/db';

async function checkEvals() {
  const periods: any = await query('SELECT id, name FROM evaluation_periods');
  console.log('Evaluating periods:', periods);
  for (const p of periods) {
    const counts: any = await query('SELECT count(*) as total FROM evaluations WHERE period_id = ?', [p.id]);
    console.log(`Period ${p.id} (${p.name}): ${counts[0].total} evaluations`);
  }
}

checkEvals().catch(console.error);
