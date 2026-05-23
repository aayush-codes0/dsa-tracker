// ─── DSA Tracker – Server Entry Point ────────────────────────────────────────
// Configures Express with CORS, JSON parsing, all API routes, and a global
// error handler. Listens on the port defined in .env (default 5000).
// ─────────────────────────────────────────────────────────────────────────────

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// ── Route imports ────────────────────────────────────────────────────────────
import authRoutes from './routes/auth.js';
import problemRoutes from './routes/problems.js';
import submissionRoutes from './routes/submissions.js';
import topicRoutes from './routes/topics.js';
import contestRoutes from './routes/contests.js';
import noteRoutes from './routes/notes.js';
import statRoutes from './routes/stats.js';
import leaderboardRoutes from './routes/leaderboard.js';
import adminRoutes from './routes/admin.js';
import sheetsRoutes from './routes/sheets.js';
import companiesRoutes from './routes/companies.js';
import revisionsRoutes from './routes/revisions.js';
import dailyChallengeRoutes from './routes/dailyChallenge.js';

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────

// Allow requests from the Vite dev server
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// ── Rate Limiting ────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 10000 requests per windowMs
  message: 'Too many requests, please try again later.',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Stricter limit for auth routes
  message: 'Too many authentication attempts, please try again later.',
});

// ── Health-check endpoint ────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Mount API routes ─────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/problems', apiLimiter, problemRoutes);
app.use('/api/submissions', apiLimiter, submissionRoutes);
app.use('/api/topics', apiLimiter, topicRoutes);
app.use('/api/contests', apiLimiter, contestRoutes);
app.use('/api/notes', apiLimiter, noteRoutes);
app.use('/api/stats', apiLimiter, statRoutes);
app.use('/api/leaderboard', apiLimiter, leaderboardRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api/sheets', apiLimiter, sheetsRoutes);
app.use('/api/companies', apiLimiter, companiesRoutes);
app.use('/api/revisions', apiLimiter, revisionsRoutes);
app.use('/api/daily-challenge', apiLimiter, dailyChallengeRoutes);

// ── 404 handler for unknown routes ──────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Global error handler ────────────────────────────────────────────────────
// Express recognises a four-argument function as an error-handling middleware.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error.',
  });
});

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 DSA Tracker API running on http://localhost:${PORT}`);
});

export default app;
