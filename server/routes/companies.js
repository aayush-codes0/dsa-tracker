import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [companies] = await pool.query('SELECT * FROM companies ORDER BY name ASC');
    res.json({ companies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
