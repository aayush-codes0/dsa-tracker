// ─── Stats Routes ────────────────────────────────────────────────────────────
// Aggregated analytics for the authenticated user's dashboard.
// GET /dashboard              – Key summary metrics
// GET /heatmap                – Daily activity for the past year
// GET /topic-progress         – Progress per topic
// GET /difficulty-distribution – Accepted submissions by difficulty
// GET /weekly-activity        – Last 7 days submission counts
// GET /monthly-progress       – Last 12 months submission counts
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';
import { calculateStreak } from '../utils/streakCalculator.js';

const router = Router();

// ── GET /dashboard ───────────────────────────────────────────────────────────
// Returns high-level metrics: totals, streaks, counts.
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Total solved (from users table)
    const [userRow] = await pool.query(
      'SELECT total_solved, current_streak, max_streak FROM users WHERE user_id = ?',
      [userId]
    );

    // Difficulty breakdown from accepted submissions
    const [diffRows] = await pool.query(
      `SELECT p.difficulty, COUNT(*) AS count
       FROM submissions s
       JOIN problems p ON s.problem_id = p.problem_id
       WHERE s.user_id = ? AND s.status = 'Accepted'
       GROUP BY p.difficulty`,
      [userId]
    );
    const diffMap = { Easy: 0, Medium: 0, Hard: 0 };
    diffRows.forEach((r) => { diffMap[r.difficulty] = r.count; });

    // Total submissions
    const [subCount] = await pool.query(
      'SELECT COUNT(*) AS total FROM submissions WHERE user_id = ?',
      [userId]
    );

    // Total contests
    const [contestCount] = await pool.query(
      'SELECT COUNT(*) AS total FROM contests WHERE user_id = ?',
      [userId]
    );

    // Total notes
    const [noteCount] = await pool.query(
      'SELECT COUNT(*) AS total FROM notes WHERE user_id = ?',
      [userId]
    );

    // Live streak calculation
    const { currentStreak, maxStreak } = await calculateStreak(userId, pool);

    // Persist streaks back to user row
    await pool.query(
      'UPDATE users SET current_streak = ?, max_streak = ? WHERE user_id = ?',
      [currentStreak, maxStreak, userId]
    );

    res.json({
      total_solved: userRow[0]?.total_solved || 0,
      easy_count: diffMap.Easy,
      medium_count: diffMap.Medium,
      hard_count: diffMap.Hard,
      current_streak: currentStreak,
      max_streak: maxStreak,
      total_submissions: subCount[0].total,
      total_contests: contestCount[0].total,
      total_notes: noteCount[0].total,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Server error fetching dashboard stats.' });
  }
});

// ── GET /heatmap ─────────────────────────────────────────────────────────────
// Returns daily activity data for the past year as [{ date, count }].
router.get('/heatmap', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT stat_date AS date, problems_solved AS count
       FROM user_stats
       WHERE user_id = ? AND stat_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
       ORDER BY stat_date ASC`,
      [req.user.user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Heatmap error:', err);
    res.status(500).json({ error: 'Server error fetching heatmap data.' });
  }
});

// ── GET /topic-progress ──────────────────────────────────────────────────────
// Returns progress per topic: topic_name, color_hex, solved_count,
// total_count, percentage.
router.get('/topic-progress', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.topic_name, t.color_hex,
              COALESCE(pr.solved_count, 0) AS solved_count,
              COALESCE(pr.total_count, t.total_problems) AS total_count,
              COALESCE(pr.percentage, 0) AS percentage
       FROM topics t
       LEFT JOIN progress pr ON pr.topic_id = t.topic_id AND pr.user_id = ?
       ORDER BY t.topic_name ASC`,
      [req.user.user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Topic progress error:', err);
    res.status(500).json({ error: 'Server error fetching topic progress.' });
  }
});

// ── GET /difficulty-distribution ─────────────────────────────────────────────
// Returns { easy, medium, hard } counts from accepted submissions.
router.get('/difficulty-distribution', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.difficulty, COUNT(*) AS count
       FROM submissions s
       JOIN problems p ON s.problem_id = p.problem_id
       WHERE s.user_id = ? AND s.status = 'Accepted'
       GROUP BY p.difficulty`,
      [req.user.user_id]
    );

    const distribution = { easy: 0, medium: 0, hard: 0 };
    rows.forEach((r) => {
      distribution[r.difficulty.toLowerCase()] = r.count;
    });

    res.json(distribution);
  } catch (err) {
    console.error('Difficulty distribution error:', err);
    res.status(500).json({ error: 'Server error fetching difficulty distribution.' });
  }
});

// ── GET /weekly-activity ─────────────────────────────────────────────────────
// Returns submissions per day for the last 7 days.
router.get('/weekly-activity', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DATE(submitted_at) AS date, COUNT(*) AS count
       FROM submissions
       WHERE user_id = ? AND submitted_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(submitted_at)
       ORDER BY date ASC`,
      [req.user.user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Weekly activity error:', err);
    res.status(500).json({ error: 'Server error fetching weekly activity.' });
  }
});

// ── GET /monthly-progress ────────────────────────────────────────────────────
// Returns submissions per month for the last 12 months.
router.get('/monthly-progress', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DATE_FORMAT(submitted_at, '%Y-%m') AS month, COUNT(*) AS count
       FROM submissions
       WHERE user_id = ? AND submitted_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
       GROUP BY month
       ORDER BY month ASC`,
      [req.user.user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Monthly progress error:', err);
    res.status(500).json({ error: 'Server error fetching monthly progress.' });
  }
});

// ── GET /advanced ────────────────────────────────────────────────────────────
// Advanced analytics: weak topics, accuracy, solve ratio, contest performance
router.get('/advanced', auth, async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    // 1. Weakest Topics (Topics with lowest accuracy or lowest solved_count)
    const [weakTopics] = await pool.query(`
      SELECT t.topic_name, p.solved_count, p.total_count, 
             IFNULL((p.solved_count / NULLIF(p.total_count, 0)) * 100, 0) as completion_rate
      FROM progress p
      JOIN topics t ON p.topic_id = t.topic_id
      WHERE p.user_id = ?
      ORDER BY completion_rate ASC
      LIMIT 3
    `, [userId]);

    // 2. Accuracy % (Total Accepted / Total Submissions)
    const [[accuracyData]] = await pool.query(`
      SELECT 
        COUNT(CASE WHEN status = 'Accepted' THEN 1 END) as accepted,
        COUNT(*) as total,
        IFNULL((COUNT(CASE WHEN status = 'Accepted' THEN 1 END) / NULLIF(COUNT(*), 0)) * 100, 0) as accuracy
      FROM submissions
      WHERE user_id = ?
    `, [userId]);

    // 3. Easy/Medium/Hard Ratio (Accepted Problems)
    const [difficultyRatio] = await pool.query(`
      SELECT p.difficulty, COUNT(DISTINCT p.problem_id) as count
      FROM submissions s
      JOIN problems p ON s.problem_id = p.problem_id
      WHERE s.user_id = ? AND s.status = 'Accepted'
      GROUP BY p.difficulty
    `, [userId]);

    // 4. Contest Performance Average
    const [[contestAvg]] = await pool.query(`
      SELECT AVG(score) as avg_score, AVG(solved_count) as avg_solved
      FROM contests
      WHERE user_id = ?
    `, [userId]);

    res.json({
      weakTopics,
      accuracy: accuracyData.accuracy,
      difficultyRatio,
      contestPerformance: contestAvg
    });
  } catch (err) {
    console.error('Advanced analytics error:', err);
    res.status(500).json({ error: 'Server error fetching advanced analytics.' });
  }
});

export default router;
