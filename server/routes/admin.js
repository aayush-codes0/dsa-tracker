// ─── Admin Routes ────────────────────────────────────────────────────────────
// Platform administration endpoints. All routes require auth + admin role.
// GET    /users          – List all users with stats
// DELETE /users/:id      – Delete a user
// PUT    /users/:id/role – Change a user's role
// GET    /stats          – Overall platform statistics
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

// Apply auth + admin to every route in this router
router.use(auth, admin);

// ── GET /users ───────────────────────────────────────────────────────────────
// List all registered users with their key stats (excluding password hashes).
router.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.username, u.email, u.full_name, u.avatar_url,
              u.role, u.current_streak, u.max_streak, u.total_solved, u.joined_date,
              COUNT(a.achievement_id) AS badge_count
       FROM users u
       LEFT JOIN achievements a ON u.user_id = a.user_id
       GROUP BY u.user_id
       ORDER BY u.joined_date DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Admin list users error:', err);
    res.status(500).json({ error: 'Server error fetching users.' });
  }
});

// ── DELETE /users/:id ────────────────────────────────────────────────────────
// Delete a user and all their associated data (depends on FK CASCADE settings).
router.delete('/users/:id', async (req, res) => {
  try {
    // Prevent admins from deleting themselves
    if (parseInt(req.params.id, 10) === req.user.user_id) {
      return res.status(400).json({ error: 'You cannot delete your own account from the admin panel.' });
    }

    const [result] = await pool.query(
      'DELETE FROM users WHERE user_id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User deleted.' });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ error: 'Server error deleting user.' });
  }
});

// ── PUT /users/:id/role ──────────────────────────────────────────────────────
// Change a user's role between 'user' and 'admin'.
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: "role must be 'user' or 'admin'." });
    }

    // Prevent admins from demoting themselves
    if (parseInt(req.params.id, 10) === req.user.user_id && role !== 'admin') {
      return res.status(400).json({ error: 'You cannot remove your own admin privileges.' });
    }

    const [result] = await pool.query(
      'UPDATE users SET role = ? WHERE user_id = ?',
      [role, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: `User role updated to '${role}'.` });
  } catch (err) {
    console.error('Admin change role error:', err);
    res.status(500).json({ error: 'Server error changing user role.' });
  }
});

// ── GET /stats ───────────────────────────────────────────────────────────────
// Overall platform statistics: total users, problems, submissions, and
// users who have been active today.
router.get('/stats', async (req, res) => {
  try {
    const [[{ total_users }]] = await pool.query('SELECT COUNT(*) AS total_users FROM users');
    const [[{ total_problems }]] = await pool.query('SELECT COUNT(*) AS total_problems FROM problems');
    const [[{ total_submissions }]] = await pool.query('SELECT COUNT(*) AS total_submissions FROM submissions');

    const [[{ active_today }]] = await pool.query(
      `SELECT COUNT(DISTINCT user_id) AS active_today
       FROM user_stats
       WHERE stat_date = CURDATE()`
    );

    res.json({ total_users, total_problems, total_submissions, active_today });
  } catch (err) {
    console.error('Admin platform stats error:', err);
    res.status(500).json({ error: 'Server error fetching platform stats.' });
  }
});

export default router;
