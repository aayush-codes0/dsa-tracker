// ─── Auth Routes ─────────────────────────────────────────────────────────────
// Handles user registration, login, and profile management.
// POST /signup  – Register a new user and return a JWT
// POST /login   – Authenticate by email/password, return JWT
// GET  /me      – Get current user's profile (auth required)
// PUT  /me      – Update current user's profile (auth required)
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// ── POST /signup ─────────────────────────────────────────────────────────────
// Register a new user account. Hashes the password with bcrypt, inserts the
// user row, and returns a JWT so the client is immediately authenticated.
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    // Check if email or username already exists
    const [existing] = await pool.query(
      'SELECT user_id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email or username already in use.' });
    }

    // Hash password (12 salt rounds)
    const password_hash = await bcrypt.hash(password, 12);

    // Insert new user
    const [result] = await pool.query(
      `INSERT INTO users (username, email, password_hash, full_name)
       VALUES (?, ?, ?, ?)`,
      [username, email, password_hash, full_name || null]
    );

    const user_id = result.insertId;

    // Generate JWT (expires in 7 days)
    const token = jwt.sign(
      { user_id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: { user_id, username, email, full_name: full_name || null, role: 'user' },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

// ── POST /login ──────────────────────────────────────────────────────────────
// Authenticate a user by email and password. Returns a JWT on success.
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Look up user by email or username
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = rows[0];

    // Compare plaintext password against stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: user.role,
        current_streak: user.current_streak,
        max_streak: user.max_streak,
        total_solved: user.total_solved,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// ── GET /me ──────────────────────────────────────────────────────────────────
// Returns the authenticated user's profile (excluding password_hash).
router.get('/me', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT user_id, username, email, full_name, avatar_url, role,
              current_streak, max_streak, total_solved, joined_date
       FROM users WHERE user_id = ?`,
      [req.user.user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Server error fetching profile.' });
  }
});

// ── PUT /me ──────────────────────────────────────────────────────────────────
// Update the authenticated user's full_name and/or avatar_url.
router.put('/me', auth, async (req, res) => {
  try {
    const { full_name, avatar_url } = req.body;

    await pool.query(
      'UPDATE users SET full_name = ?, avatar_url = ? WHERE user_id = ?',
      [full_name || null, avatar_url || null, req.user.user_id]
    );

    // Return updated profile
    const [rows] = await pool.query(
      `SELECT user_id, username, email, full_name, avatar_url, role,
              current_streak, max_streak, total_solved, joined_date
       FROM users WHERE user_id = ?`,
      [req.user.user_id]
    );

    res.json({ message: 'Profile updated.', user: rows[0] });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Server error updating profile.' });
  }
});

export default router;
