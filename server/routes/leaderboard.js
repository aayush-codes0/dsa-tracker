// ─── Leaderboard Routes ──────────────────────────────────────────────────────
// Public endpoint – no authentication required.
// GET / – Top 50 users ranked by total_solved, with badge counts.
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// ── GET / ────────────────────────────────────────────────────────────────────
// Returns the top 50 users ordered by total_solved DESC. Includes a count of
// badges (achievements) earned by each user via a LEFT JOIN + GROUP BY.
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.username, u.full_name, u.avatar_url,
              u.total_solved, u.current_streak,
              COUNT(a.achievement_id) AS badge_count
       FROM users u
       LEFT JOIN achievements a ON u.user_id = a.user_id
       GROUP BY u.user_id
       ORDER BY u.total_solved DESC, u.current_streak DESC
       LIMIT 50`
    );

    // Add a rank property for convenience
    const ranked = rows.map((row, index) => ({
      rank: index + 1,
      ...row,
    }));

    res.json(ranked);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Server error fetching leaderboard.' });
  }
});

export default router;
