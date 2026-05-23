# Deployment Guide

## 1. Database (MySQL) Deployment
- **Platform**: Aiven / PlanetScale / AWS RDS
- **Steps**:
  1. Provision a managed MySQL 8.0 instance.
  2. Copy the connection URI.
  3. Execute `schema.sql`, `views.sql`, `triggers.sql`, `procedures.sql`, and `seed.sql` against the remote database using MySQL Workbench or DBeaver.

## 2. Backend (Node/Express) Deployment
- **Platform**: Render / Railway / Heroku
- **Steps**:
  1. Push the `server/` directory to GitHub.
  2. Link the repository to Render/Railway as a Web Service.
  3. Set Environment Variables:
     - `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` (From step 1)
     - `JWT_SECRET` (Generate a secure random string)
  4. Start command: `npm start` (ensure `node server.js` is set).

## 3. Frontend (React/Vite) Deployment
- **Platform**: Vercel / Netlify
- **Steps**:
  1. Push the `client/` directory to GitHub.
  2. Link the repository to Vercel.
  3. Set Environment Variable: `VITE_API_BASE_URL` to your deployed backend URL (e.g., `https://dsa-api.onrender.com/api`).
  4. Build command: `npm run build`. Vercel will handle the deployment automatically.
