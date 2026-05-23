// ─── Notes Routes ────────────────────────────────────────────────────────────
// Personal notes attached to problems – insights, approaches, etc.
// GET    /                    – List user's notes (searchable)
// GET    /problem/:problemId  – Notes for a specific problem
// POST   /                    – Create a note
// PUT    /:id                 – Update note (owner only)
// DELETE /:id                 – Delete note (owner only)
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// ── GET / ────────────────────────────────────────────────────────────────────
// List all notes for the authenticated user, with the associated problem title.
// Supports ?search= to filter by content or key_insight.
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;

    let query = `
      SELECT n.*, p.title AS problem_title, p.difficulty
      FROM notes n
      LEFT JOIN problems p ON n.problem_id = p.problem_id
      WHERE n.user_id = ?
    `;
    const params = [req.user.user_id];

    if (search) {
      query += ' AND (n.content LIKE ? OR n.key_insight LIKE ? OR n.approach LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY n.updated_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('List notes error:', err);
    res.status(500).json({ error: 'Server error fetching notes.' });
  }
});

// ── GET /problem/:problemId ──────────────────────────────────────────────────
// Get all notes the user has written for a specific problem.
router.get('/problem/:problemId', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT n.*, p.title AS problem_title
       FROM notes n
       LEFT JOIN problems p ON n.problem_id = p.problem_id
       WHERE n.user_id = ? AND n.problem_id = ?
       ORDER BY n.created_at DESC`,
      [req.user.user_id, req.params.problemId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get problem notes error:', err);
    res.status(500).json({ error: 'Server error fetching notes for problem.' });
  }
});

// ── POST / ───────────────────────────────────────────────────────────────────
// Create a new note.
router.post('/', auth, async (req, res) => {
  try {
    const { problem_id, content, key_insight, approach } = req.body;

    if (!problem_id || !content) {
      return res.status(400).json({ error: 'problem_id and content are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO notes (user_id, problem_id, content, key_insight, approach, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [req.user.user_id, problem_id, content, key_insight || null, approach || null]
    );

    res.status(201).json({ message: 'Note created.', note_id: result.insertId });
  } catch (err) {
    console.error('Create note error:', err);
    res.status(500).json({ error: 'Server error creating note.' });
  }
});

// ── PUT /:id ─────────────────────────────────────────────────────────────────
// Update a note. Only the owner may edit.
router.put('/:id', auth, async (req, res) => {
  try {
    // Verify ownership
    const [existing] = await pool.query(
      'SELECT user_id FROM notes WHERE note_id = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Note not found.' });
    }
    if (existing[0].user_id !== req.user.user_id) {
      return res.status(403).json({ error: 'You can only edit your own notes.' });
    }

    const { content, key_insight, approach } = req.body;

    await pool.query(
      `UPDATE notes SET content = ?, key_insight = ?, approach = ?, updated_at = NOW()
       WHERE note_id = ?`,
      [content, key_insight || null, approach || null, req.params.id]
    );

    res.json({ message: 'Note updated.' });
  } catch (err) {
    console.error('Update note error:', err);
    res.status(500).json({ error: 'Server error updating note.' });
  }
});

// ── DELETE /:id ──────────────────────────────────────────────────────────────
// Delete a note. Only the owner may delete.
router.delete('/:id', auth, async (req, res) => {
  try {
    const [existing] = await pool.query(
      'SELECT user_id FROM notes WHERE note_id = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Note not found.' });
    }
    if (existing[0].user_id !== req.user.user_id) {
      return res.status(403).json({ error: 'You can only delete your own notes.' });
    }

    await pool.query('DELETE FROM notes WHERE note_id = ?', [req.params.id]);
    res.json({ message: 'Note deleted.' });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ error: 'Server error deleting note.' });
  }
});

export default router;
