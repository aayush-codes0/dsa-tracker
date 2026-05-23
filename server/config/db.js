// ─── Database Connection Pool ────────────────────────────────────────────────
// Creates and exports a MySQL connection pool using mysql2/promise.
// All queries across the app share this pool for efficient connection reuse.
// ─────────────────────────────────────────────────────────────────────────────

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  ssl: process.env.DB_HOST?.includes('tidbcloud') ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
