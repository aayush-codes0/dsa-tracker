import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// ── GET /today ───────────────────────────────────────────────────────────────
// Get one deterministic random problem for the current day.
router.get('/today', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, t.topic_name, t.color_hex
      FROM problems p
      LEFT JOIN topics t ON p.topic_id = t.topic_id
      ORDER BY RAND(YEAR(CURDATE()) * 1000 + DAYOFYEAR(CURDATE()))
      LIMIT 1
    `);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No problems found for daily challenge.' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Daily challenge error:', err);
    res.status(500).json({ error: 'Server error fetching daily challenge.' });
  }
});

export default router;
