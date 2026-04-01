const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cite_es'
  });

  const authorId = '0766b9f2-01de-46b4-bdb0-692b8494ce13';
  const teacherId = '4be63e43-28aa-406f-ae44-296d09523a04';
  
  // Find evaluation
  const [evals] = await connection.execute(
    "SELECT * FROM evaluations WHERE evaluator_id = ? AND evaluatee_id = ? AND status = 'submitted'",
    [authorId, teacherId]
  );
  
  console.log("Evaluations found:", JSON.stringify(evals, null, 2));

  if (evals.length > 0) {
    const evalId = evals[0].id;
    const [responses] = await connection.execute(
      "SELECT * FROM evaluation_responses WHERE evaluation_id = ?",
      [evalId]
    );
    console.log("Responses found:", JSON.stringify(responses, null, 2));
  }

  await connection.end();
}

run().catch(console.error);
