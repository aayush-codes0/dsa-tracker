// ─── Topics Routes ───────────────────────────────────────────────────────────
// CRUD for DSA topics (e.g. Arrays, Trees, Graphs) plus per-user progress.
// GET    /              – List all topics with problem counts
// GET    /:id           – Single topic with its problems
// POST   /              – Create topic (admin)
// PUT    /:id           – Update topic (admin)
// DELETE /:id           – Delete topic (admin)
// GET    /:id/progress  – User's progress for one topic (auth)
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

// ── GET / ────────────────────────────────────────────────────────────────────
// List every topic. Includes a live count of problems per topic via sub-query.
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*,
              (SELECT COUNT(*) FROM problems p WHERE p.topic_id = t.topic_id) AS problem_count
       FROM topics t
       ORDER BY t.topic_name ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error('List topics error:', err);
    res.status(500).json({ error: 'Server error fetching topics.' });
  }
});

// ── GET /:id ─────────────────────────────────────────────────────────────────
// Get a single topic together with all its problems.
router.get('/:id', async (req, res) => {
  try {
    const [topics] = await pool.query(
      'SELECT * FROM topics WHERE topic_id = ?',
      [req.params.id]
    );

    if (topics.length === 0) {
      return res.status(404).json({ error: 'Topic not found.' });
    }

    const [problems] = await pool.query(
      'SELECT * FROM problems WHERE topic_id = ? ORDER BY difficulty ASC, title ASC',
      [req.params.id]
    );

    res.json({ ...topics[0], problems });
  } catch (err) {
    console.error('Get topic error:', err);
    res.status(500).json({ error: 'Server error fetching topic.' });
  }
});

// ── POST / ───────────────────────────────────────────────────────────────────
// Create a new topic (admin only).
router.post('/', auth, admin, async (req, res) => {
  try {
    const { topic_name, icon, color_hex, description } = req.body;

    if (!topic_name) {
      return res.status(400).json({ error: 'topic_name is required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO topics (topic_name, icon, color_hex, description, total_problems)
       VALUES (?, ?, ?, ?, 0)`,
      [topic_name, icon || null, color_hex || null, description || null]
    );

    res.status(201).json({ message: 'Topic created.', topic_id: result.insertId });
  } catch (err) {
    console.error('Create topic error:', err);
    res.status(500).json({ error: 'Server error creating topic.' });
  }
});

// ── PUT /:id ─────────────────────────────────────────────────────────────────
// Update a topic (admin only).
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { topic_name, icon, color_hex, description } = req.body;

    const [result] = await pool.query(
      `UPDATE topics SET topic_name = ?, icon = ?, color_hex = ?, description = ?
       WHERE topic_id = ?`,
      [topic_name, icon || null, color_hex || null, description || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Topic not found.' });
    }

    res.json({ message: 'Topic updated.' });
  } catch (err) {
    console.error('Update topic error:', err);
    res.status(500).json({ error: 'Server error updating topic.' });
  }
});

// ── DELETE /:id ──────────────────────────────────────────────────────────────
// Delete a topic (admin only). Problems under this topic will have their
// topic_id set to NULL (or be deleted, depending on FK constraints).
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM topics WHERE topic_id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Topic not found.' });
    }

    res.json({ message: 'Topic deleted.' });
  } catch (err) {
    console.error('Delete topic error:', err);
    res.status(500).json({ error: 'Server error deleting topic.' });
  }
});

// ── GET /:id/progress ────────────────────────────────────────────────────────
// Get the authenticated user's progress for a specific topic.
router.get('/:id/progress', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT pr.*, t.topic_name, t.color_hex
       FROM progress pr
       JOIN topics t ON pr.topic_id = t.topic_id
       WHERE pr.user_id = ? AND pr.topic_id = ?`,
      [req.user.user_id, req.params.id]
    );

    if (rows.length === 0) {
      // No progress row yet – return zero-state
      const [topic] = await pool.query(
        'SELECT topic_name, color_hex, total_problems FROM topics WHERE topic_id = ?',
        [req.params.id]
      );

      if (topic.length === 0) {
        return res.status(404).json({ error: 'Topic not found.' });
      }

      return res.json({
        topic_name: topic[0].topic_name,
        color_hex: topic[0].color_hex,
        solved_count: 0,
        total_count: topic[0].total_problems,
        percentage: 0,
        last_practiced: null,
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get topic progress error:', err);
    res.status(500).json({ error: 'Server error fetching topic progress.' });
  }
});

export default router;
