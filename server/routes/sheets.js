import express from 'express';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/sheets
router.get('/', auth, async (req, res) => {
  try {
    const [sheets] = await pool.query(`
      SELECT 
        s.*, 
        COUNT(DISTINCT sp.problem_id) as total_problems,
        (
          SELECT COUNT(DISTINCT sub.problem_id)
          FROM submissions sub
          JOIN sheet_problems sp2 ON sub.problem_id = sp2.problem_id
          WHERE sp2.sheet_id = s.sheet_id 
            AND sub.user_id = ? 
            AND sub.status = 'Accepted'
        ) as user_solved_count
      FROM sheets s
      LEFT JOIN sheet_problems sp ON s.sheet_id = sp.sheet_id
      GROUP BY s.sheet_id
    `, [req.user.user_id]);
    res.json({ sheets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sheets/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const [sheets] = await pool.query('SELECT * FROM sheets WHERE sheet_id = ?', [req.params.id]);
    if (sheets.length === 0) return res.status(404).json({ error: 'Sheet not found' });
    
    const [problems] = await pool.query(`
      SELECT p.*, t.topic_name, 
        (SELECT status FROM submissions WHERE problem_id = p.problem_id AND user_id = ? ORDER BY submitted_at DESC LIMIT 1) as user_status
      FROM problems p
      JOIN sheet_problems sp ON p.problem_id = sp.problem_id
      LEFT JOIN topics t ON p.topic_id = t.topic_id
      WHERE sp.sheet_id = ?
    `, [req.user.user_id, req.params.id]);
    
    res.json({ sheet: sheets[0], problems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
