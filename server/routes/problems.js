// ─── Problems Routes ─────────────────────────────────────────────────────────
// CRUD operations for DSA problems with filtering, pagination, and
// bookmark/favorite toggles.
// GET    /           – List problems (filterable, paginated)
// GET    /:id        – Single problem with topic details
// POST   /           – Create problem (admin only)
// PUT    /:id        – Update problem (admin only)
// DELETE /:id        – Delete problem (admin only)
// PUT    /:id/bookmark  – Toggle bookmark (auth)
// PUT    /:id/favorite  – Toggle favourite (auth)
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

// ── GET / ────────────────────────────────────────────────────────────────────
// List all problems with optional filters and pagination.
// Query params: topic_id, difficulty, platform, search, is_bookmarked,
//               is_favorite, page (default 1), limit (default 20)
router.get('/', auth, async (req, res) => {
  try {
    const {
      topic_id,
      difficulty,
      platform,
      search,
      is_bookmarked,
      is_favorite,
      company_id,
      sort_by = 'date_added',
      order = 'DESC',
      page = 1,
      limit = 20,
    } = req.query;

    let query = `
      SELECT p.*, t.topic_name, t.color_hex,
             IF(ub.problem_id IS NOT NULL, 1, 0) as is_bookmarked,
             (SELECT status FROM submissions WHERE problem_id = p.problem_id AND user_id = ? ORDER BY submitted_at DESC LIMIT 1) as user_status
      FROM problems p
      LEFT JOIN topics t ON p.topic_id = t.topic_id
      LEFT JOIN user_bookmarks ub ON p.problem_id = ub.problem_id AND ub.user_id = ?
      ${company_id ? 'JOIN problem_companies pc ON p.problem_id = pc.problem_id AND pc.company_id = ?' : ''}
      WHERE 1 = 1
    `;
    const params = [req.user.user_id, req.user.user_id];
    if (company_id) params.push(company_id);

    if (topic_id) {
      query += ' AND p.topic_id = ?';
      params.push(topic_id);
    }
    if (difficulty) {
      query += ' AND p.difficulty = ?';
      params.push(difficulty);
    }
    if (platform) {
      query += ' AND p.platform = ?';
      params.push(platform);
    }
    if (search) {
      query += ' AND (p.title LIKE ? OR p.tags LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (is_bookmarked !== undefined) {
      if (is_bookmarked === 'true') {
        query += ' AND ub.problem_id IS NOT NULL';
      } else {
        query += ' AND ub.problem_id IS NULL';
      }
    }
    if (is_favorite !== undefined) {
      query += ' AND p.is_favorite = ?';
      params.push(is_favorite === 'true' ? 1 : 0);
    }

    // Count total matching rows for pagination metadata
    const countQuery = query.replace(/SELECT p\.\*, t\.topic_name, t\.color_hex,[\s\S]*?FROM problems p/, 'SELECT COUNT(*) AS total\n      FROM problems p');
    const [countRows] = await pool.query(countQuery, params);
    const total = countRows[0].total;

    // Pagination & Sorting
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const validSortColumns = ['date_added', 'title', 'difficulty', 'estimated_time'];
    const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'date_added';
    const sortDirection = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY p.${sortColumn} ${sortDirection} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), offset);

    const [rows] = await pool.query(query, params);

    res.json({
      problems: rows,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (err) {
    console.error('List problems error:', err);
    res.status(500).json({ error: 'Server error fetching problems.' });
  }
});

// ── GET /:id ─────────────────────────────────────────────────────────────────
// Fetch a single problem by ID, including its topic details.
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, t.topic_name, t.color_hex, t.icon AS topic_icon,
              IF(ub.problem_id IS NOT NULL, 1, 0) as is_bookmarked
       FROM problems p
       LEFT JOIN topics t ON p.topic_id = t.topic_id
       LEFT JOIN user_bookmarks ub ON p.problem_id = ub.problem_id AND ub.user_id = ?
       WHERE p.problem_id = ?`,
      [req.user ? req.user.user_id : null, req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get problem error:', err);
    res.status(500).json({ error: 'Server error fetching problem.' });
  }
});

// ── POST / ───────────────────────────────────────────────────────────────────
// Create a new problem (admin only).
router.post('/', auth, admin, async (req, res) => {
  try {
    const {
      title, platform, difficulty, topic_id, problem_url,
      time_complexity, space_complexity, estimated_time, tags,
    } = req.body;

    if (!title || !difficulty) {
      return res.status(400).json({ error: 'Title and difficulty are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO problems
         (title, platform, difficulty, topic_id, problem_url,
          time_complexity, space_complexity, estimated_time, tags, date_added)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [title, platform || null, difficulty, topic_id || null, problem_url || null,
       time_complexity || null, space_complexity || null, estimated_time || null, tags || null]
    );

    // Increment total_problems on the parent topic if one was assigned
    if (topic_id) {
      await pool.query(
        'UPDATE topics SET total_problems = total_problems + 1 WHERE topic_id = ?',
        [topic_id]
      );
    }

    res.status(201).json({ message: 'Problem created.', problem_id: result.insertId });
  } catch (err) {
    console.error('Create problem error:', err);
    res.status(500).json({ error: 'Server error creating problem.' });
  }
});

// ── PUT /:id ─────────────────────────────────────────────────────────────────
// Update an existing problem (admin only).
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const {
      title, platform, difficulty, topic_id, problem_url,
      time_complexity, space_complexity, estimated_time, tags,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE problems SET
         title = ?, platform = ?, difficulty = ?, topic_id = ?, problem_url = ?,
         time_complexity = ?, space_complexity = ?, estimated_time = ?, tags = ?
       WHERE problem_id = ?`,
      [title, platform || null, difficulty, topic_id || null, problem_url || null,
       time_complexity || null, space_complexity || null, estimated_time || null,
       tags || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    res.json({ message: 'Problem updated.' });
  } catch (err) {
    console.error('Update problem error:', err);
    res.status(500).json({ error: 'Server error updating problem.' });
  }
});

// ── DELETE /:id ──────────────────────────────────────────────────────────────
// Delete a problem (admin only). Also decrements the topic's total_problems.
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    // Fetch topic_id before deletion so we can update the count
    const [prob] = await pool.query(
      'SELECT topic_id FROM problems WHERE problem_id = ?',
      [req.params.id]
    );

    const [result] = await pool.query(
      'DELETE FROM problems WHERE problem_id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    // Decrement topic counter
    if (prob.length > 0 && prob[0].topic_id) {
      await pool.query(
        'UPDATE topics SET total_problems = GREATEST(total_problems - 1, 0) WHERE topic_id = ?',
        [prob[0].topic_id]
      );
    }

    res.json({ message: 'Problem deleted.' });
  } catch (err) {
    console.error('Delete problem error:', err);
    res.status(500).json({ error: 'Server error deleting problem.' });
  }
});

// ── PUT /:id/bookmark ────────────────────────────────────────────────────────
// Toggle the bookmark status for the current user.
router.put('/:id/bookmark', auth, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const problemId = req.params.id;

    const [existing] = await pool.query(
      'SELECT 1 FROM user_bookmarks WHERE user_id = ? AND problem_id = ?',
      [userId, problemId]
    );

    let isBookmarked = false;
    if (existing.length > 0) {
      await pool.query(
        'DELETE FROM user_bookmarks WHERE user_id = ? AND problem_id = ?',
        [userId, problemId]
      );
    } else {
      await pool.query(
        'INSERT INTO user_bookmarks (user_id, problem_id) VALUES (?, ?)',
        [userId, problemId]
      );
      isBookmarked = true;
    }

    res.json({ message: 'Bookmark toggled.', is_bookmarked: isBookmarked });
  } catch (err) {
    console.error('Toggle bookmark error:', err);
    res.status(500).json({ error: 'Server error toggling bookmark.' });
  }
});

// ── PUT /:id/favorite ────────────────────────────────────────────────────────
// Toggle the is_favorite flag on a problem.
router.put('/:id/favorite', auth, async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE problems SET is_favorite = NOT is_favorite WHERE problem_id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    const [rows] = await pool.query(
      'SELECT is_favorite FROM problems WHERE problem_id = ?',
      [req.params.id]
    );

    res.json({ message: 'Favorite toggled.', is_favorite: !!rows[0].is_favorite });
  } catch (err) {
    console.error('Toggle favorite error:', err);
    res.status(500).json({ error: 'Server error toggling favorite.' });
  }
});

export default router;
