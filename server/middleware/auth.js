// ─── Auth Middleware ─────────────────────────────────────────────────────────
// Extracts the Bearer token from the Authorization header, verifies it against
// JWT_SECRET, and attaches the decoded payload { user_id, role } to req.user.
// Returns 401 if the token is missing or invalid.
// ─────────────────────────────────────────────────────────────────────────────

import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request object for downstream handlers
    req.user = { user_id: decoded.user_id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
