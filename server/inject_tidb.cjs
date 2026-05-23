const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runSQL() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST.trim(),
      user: process.env.DB_USER.trim(),
      password: process.env.DB_PASS.trim(),
      database: process.env.DB_NAME.trim(),
      port: parseInt(process.env.DB_PORT, 10) || 4000,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      },
      multipleStatements: true
    });

    console.log('Connected to TiDB successfully!');

    const filesToRun = [
      'procedures.sql',
      'triggers.sql',
      'seed.sql'
    ];

    for (const file of filesToRun) {
      console.log(`Executing ${file}...`);
      let sql = fs.readFileSync(path.join(__dirname, '../database', file), 'utf8');
      
      sql = sql.replace(/USE dsa_tracker;/g, '');
      
      await connection.query(sql);
      console.log(`✅ Successfully executed ${file}`);
    }

    await connection.end();
    console.log('All files executed! Connection closed.');
  } catch (error) {
    console.error('Error executing SQL:', error.message);
  }
}

runSQL();
