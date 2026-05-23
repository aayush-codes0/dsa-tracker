import express from 'express';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const [revisions] = await pool.query(`
      SELECT r.*, p.title, p.difficulty 
      FROM revision_schedules r
      JOIN problems p ON r.problem_id = p.problem_id
      WHERE r.user_id = ? AND r.completed = FALSE
      ORDER BY r.next_revision_date ASC
    `, [req.user.user_id]);
    res.json({ revisions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { problem_id } = req.body;
    await pool.query(
      `INSERT INTO revision_schedules (user_id, problem_id, next_revision_date) 
       VALUES (?, ?, DATE_ADD(CURDATE(), INTERVAL 1 DAY))
       ON DUPLICATE KEY UPDATE completed = FALSE, revision_level = 1, next_revision_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)`,
      [req.user.user_id, problem_id]
    );
    res.status(201).json({ message: 'Added to revision schedule' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/complete', auth, async (req, res) => {
  try {
    const [[rev]] = await pool.query('SELECT * FROM revision_schedules WHERE revision_id = ? AND user_id = ?', [req.params.id, req.user.user_id]);
    if (!rev) return res.status(404).json({ error: 'Not found' });

    let nextInterval = 0;
    let completed = false;
    
    if (rev.revision_level === 1) nextInterval = 3;
    else if (rev.revision_level === 2) nextInterval = 7;
    else if (rev.revision_level === 3) nextInterval = 30;
    else completed = true;

    if (completed) {
      await pool.query('UPDATE revision_schedules SET completed = TRUE WHERE revision_id = ?', [req.params.id]);
    } else {
      await pool.query(
        'UPDATE revision_schedules SET revision_level = revision_level + 1, next_revision_date = DATE_ADD(CURDATE(), INTERVAL ? DAY) WHERE revision_id = ?',
        [nextInterval, req.params.id]
      );
    }
    res.json({ message: 'Revision updated', completed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
