const mysql = require('mysql2/promise');
(async () => {
  try {
    const conn = await mysql.createConnection({host:'127.0.0.1', user:'root', password:'Aayush@123', database:'dsa_tracker'});
    await conn.query("UPDATE users u SET total_solved = (SELECT COUNT(DISTINCT problem_id) FROM submissions WHERE user_id = u.user_id AND status = 'Accepted')");
    console.log('Fixed users total_solved');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
