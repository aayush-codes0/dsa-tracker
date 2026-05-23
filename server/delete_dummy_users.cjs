const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Aayush@123',
    database: 'dsa_tracker'
  });

  await conn.query('DELETE FROM users WHERE username IN ("admin", "demo", "testuser")');
  console.log('Dummy users deleted');
  process.exit(0);
})();
