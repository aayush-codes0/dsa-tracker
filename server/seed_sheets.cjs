const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Aayush@123',
    database: 'dsa_tracker'
  });

  await conn.query(`
    INSERT IGNORE INTO sheets (sheet_id, name, description, icon) VALUES 
    (1, 'Striver A2Z DSA Sheet', 'Comprehensive roadmap covering all DSA topics from basic to advanced.', '🚀'),
    (2, 'Blind 75', 'The legendary list of 75 most frequently asked LeetCode questions.', '🎯'),
    (3, 'NeetCode 150', 'Expanded version of Blind 75 with better topic coverage.', '💻')
  `);

  await conn.query('INSERT IGNORE INTO sheet_problems (sheet_id, problem_id) SELECT 1, problem_id FROM problems');
  await conn.query('INSERT IGNORE INTO sheet_problems (sheet_id, problem_id) SELECT 2, problem_id FROM problems WHERE problem_id <= 30');
  await conn.query('INSERT IGNORE INTO sheet_problems (sheet_id, problem_id) SELECT 3, problem_id FROM problems WHERE problem_id > 10 AND problem_id <= 50');

  console.log('Sheets seeded!');
  process.exit(0);
})();
