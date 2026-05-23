// ─── Submissions Routes ──────────────────────────────────────────────────────
// Tracks user problem submissions with status, timing, and confidence.
// GET  /        – List user's submissions (filterable)
// POST /        – Create a submission + update daily stats
// GET  /recent  – Last 10 submissions for the user
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// ── GET / ────────────────────────────────────────────────────────────────────
// Get the authenticated user's submissions with problem and topic details.
// Optional filters: ?problem_id=, ?status=, ?topic_id=
router.get('/', auth, async (req, res) => {
  try {
    const { problem_id, status, topic_id } = req.query;

    let query = `
      SELECT s.*, p.title AS problem_title, p.difficulty, p.platform,
             t.topic_name, t.color_hex
      FROM submissions s
      JOIN problems p ON s.problem_id = p.problem_id
      LEFT JOIN topics t ON p.topic_id = t.topic_id
      WHERE s.user_id = ?
    `;
    const params = [req.user.user_id];

    if (problem_id) {
      query += ' AND s.problem_id = ?';
      params.push(problem_id);
    }
    if (status) {
      query += ' AND s.status = ?';
      params.push(status);
    }
    if (topic_id) {
      query += ' AND p.topic_id = ?';
      params.push(topic_id);
    }

    query += ' ORDER BY s.submitted_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('List submissions error:', err);
    res.status(500).json({ error: 'Server error fetching submissions.' });
  }
});

// ── GET /recent ──────────────────────────────────────────────────────────────
// Return the last 10 submissions for the authenticated user.
// NOTE: This route must be declared BEFORE /:id to avoid param conflicts.
router.get('/recent', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, p.title AS problem_title, p.difficulty, p.platform,
              t.topic_name
       FROM submissions s
       JOIN problems p ON s.problem_id = p.problem_id
       LEFT JOIN topics t ON p.topic_id = t.topic_id
       WHERE s.user_id = ?
       ORDER BY s.submitted_at DESC
       LIMIT 10`,
      [req.user.user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error('Recent submissions error:', err);
    res.status(500).json({ error: 'Server error fetching recent submissions.' });
  }
});

// ── POST / ───────────────────────────────────────────────────────────────────
// Create a new submission inside a transaction to ensure atomicity
router.post('/', auth, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      problem_id, status, time_taken_min, approach_used,
      language_used, attempts, confidence,
    } = req.body;

    if (!problem_id || !status) {
      connection.release();
      return res.status(400).json({ error: 'problem_id and status are required.' });
    }

    await connection.beginTransaction();

    // Insert the submission
    const [result] = await connection.query(
      `INSERT INTO submissions
         (user_id, problem_id, status, time_taken_min, approach_used,
          language_used, attempts, confidence, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        req.user.user_id, problem_id, status,
        time_taken_min || null, approach_used || null,
        language_used || null, attempts || 1, confidence || null,
      ]
    );

    // ── Update daily user_stats (upsert) ──────────────────────────────────
    const today = new Date().toISOString().slice(0, 10);
    const problemsSolvedIncrement = status === 'Accepted' ? 1 : 0;

    await connection.query(
      `INSERT INTO user_stats (user_id, stat_date, problems_solved, time_spent_min, submissions_count)
       VALUES (?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE
         problems_solved   = problems_solved + ?,
         time_spent_min    = time_spent_min + ?,
         submissions_count = submissions_count + 1`,
      [
        req.user.user_id, today, problemsSolvedIncrement,
        time_taken_min || 0,
        problemsSolvedIncrement, time_taken_min || 0,
      ]
    );

    if (status === 'Accepted') {
      await connection.query(
        'UPDATE users SET total_solved = total_solved + 1 WHERE user_id = ?',
        [req.user.user_id]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Submission recorded.', submission_id: result.insertId });
  } catch (err) {
    await connection.rollback();
    console.error('Create submission error:', err);
    res.status(500).json({ error: 'Server error creating submission.' });
  } finally {
    connection.release();
  }
});

export default router;
