// ─── Contests Routes ─────────────────────────────────────────────────────────
// CRUD for user contest participation records.
// GET    /     – List user's contests
// POST   /     – Add a contest
// PUT    /:id  – Update contest (owner only)
// DELETE /:id  – Delete contest (owner only)
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// ── GET / ────────────────────────────────────────────────────────────────────
// List all contests for the authenticated user, newest first.
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM contests
       WHERE user_id = ?
       ORDER BY contest_date DESC`,
      [req.user.user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('List contests error:', err);
    res.status(500).json({ error: 'Server error fetching contests.' });
  }
});

// ── POST / ───────────────────────────────────────────────────────────────────
// Record a new contest entry.
router.post('/', auth, async (req, res) => {
  try {
    const {
      contest_name, platform, rank_achieved, score,
      total_problems, solved_count, contest_date, contest_url,
    } = req.body;

    if (!contest_name) {
      return res.status(400).json({ error: 'contest_name is required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO contests
         (user_id, contest_name, platform, rank_achieved, score,
          total_problems, solved_count, contest_date, contest_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        req.user.user_id, contest_name, platform || null,
        rank_achieved || null, score || null,
        total_problems || null, solved_count || null,
        contest_date || null, contest_url || null,
      ]
    );

    res.status(201).json({ message: 'Contest added.', contest_id: result.insertId });
  } catch (err) {
    console.error('Create contest error:', err);
    res.status(500).json({ error: 'Server error creating contest.' });
  }
});

// ── PUT /:id ─────────────────────────────────────────────────────────────────
// Update a contest. Only the owner may modify their record.
router.put('/:id', auth, async (req, res) => {
  try {
    // Verify ownership
    const [existing] = await pool.query(
      'SELECT user_id FROM contests WHERE contest_id = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Contest not found.' });
    }
    if (existing[0].user_id !== req.user.user_id) {
      return res.status(403).json({ error: 'You can only update your own contests.' });
    }

    const {
      contest_name, platform, rank_achieved, score,
      total_problems, solved_count, contest_date, contest_url,
    } = req.body;

    await pool.query(
      `UPDATE contests SET
         contest_name = ?, platform = ?, rank_achieved = ?, score = ?,
         total_problems = ?, solved_count = ?, contest_date = ?, contest_url = ?
       WHERE contest_id = ?`,
      [
        contest_name, platform || null, rank_achieved || null, score || null,
        total_problems || null, solved_count || null,
        contest_date || null, contest_url || null,
        req.params.id,
      ]
    );

    res.json({ message: 'Contest updated.' });
  } catch (err) {
    console.error('Update contest error:', err);
    res.status(500).json({ error: 'Server error updating contest.' });
  }
});

// ── DELETE /:id ──────────────────────────────────────────────────────────────
// Delete a contest. Only the owner may delete their record.
router.delete('/:id', auth, async (req, res) => {
  try {
    const [existing] = await pool.query(
      'SELECT user_id FROM contests WHERE contest_id = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Contest not found.' });
    }
    if (existing[0].user_id !== req.user.user_id) {
      return res.status(403).json({ error: 'You can only delete your own contests.' });
    }

    await pool.query('DELETE FROM contests WHERE contest_id = ?', [req.params.id]);
    res.json({ message: 'Contest deleted.' });
  } catch (err) {
    console.error('Delete contest error:', err);
    res.status(500).json({ error: 'Server error deleting contest.' });
  }
});

export default router;
