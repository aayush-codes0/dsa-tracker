# 🧠 DSA Tracker

> A professional full-stack platform for computer science students to track Data Structures & Algorithms practice — featuring spaced repetition, advanced analytics, GitHub-style heatmaps, and sheet tracking.

🌐 **Live Demo**: [https://dsa-tracker-wheat-tau.vercel.app](https://dsa-tracker-wheat-tau.vercel.app)

---

## 🚀 Features
- **Problem Tracking** — Mark problems as Solved/Attempted, track time taken, approach, and confidence.
- **Spaced Repetition** — Intelligent revision scheduler (Day 1, 3, 7, 30).
- **Sheet Tracking** — Built-in support for Blind 75, NeetCode 150, Striver A2Z, and Love Babbar 450.
- **Advanced Analytics** — Identify weak topics, difficulty distribution, and solve ratios.
- **GitHub Heatmap** — Visual activity streak tracking calendar.
- **Global Leaderboard** — Compete with other users by problems solved and streaks.
- **Notes** — Add personal notes to any problem.
- **Contests** — Log your contest performances and scores.

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Framer Motion |
| **Backend** | Node.js, Express.js, JWT Auth, Express Rate Limit |
| **Database** | TiDB Serverless (MySQL-compatible), Normalized 3NF schema |
| **Deployment** | Vercel (frontend) + Render (backend) + TiDB Cloud (DB) |

---

## 📸 Screenshots

> Dashboard, Heatmap, Problems Table, Analytics, Leaderboard
> *(Visit the [live demo](https://dsa-tracker-wheat-tau.vercel.app) to see the full app)*

---

## 🛠️ Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/aayush-codes0/dsa-tracker.git
cd dsa-tracker

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Database Setup (TiDB Cloud — Free)
1. Create a free cluster at [tidbcloud.com](https://tidbcloud.com)
2. Run these SQL files in order using the TiDB SQL Editor:
   - `database/schema.sql` — Creates all tables
   - `database/views.sql` — Creates analytical views
   - `database/seed.sql` — Inserts sample problems and topics

### 3. Environment Variables
Create a `.env` file in the `server/` directory:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_here

DB_HOST=your-tidb-host.tidbcloud.com
DB_USER=your-tidb-username
DB_PASSWORD=your-tidb-password
DB_PORT=4000
DB_NAME=dsa_tracker
```

### 4. Run Application
```bash
# Terminal 1 — Start Backend (runs on http://localhost:5000)
cd server && npm run dev

# Terminal 2 — Start Frontend (runs on http://localhost:5173)
cd client && npm run dev
```

---

## ☁️ Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [dsa-tracker-wheat-tau.vercel.app](https://dsa-tracker-wheat-tau.vercel.app) |
| Backend | Render | [dsa-tracker-cb9y.onrender.com](https://dsa-tracker-cb9y.onrender.com) |
| Database | TiDB Cloud | Serverless, always-on |

---

## 🗄️ Database Schema

The database follows 3NF normalization with 13 tables:
`users` · `problems` · `topics` · `submissions` · `sheets` · `sheet_problems` · `notes` · `revision_schedules` · `user_stats` · `contests` · `badges` · `user_bookmarks` · `achievements`

---

## 👤 Author

**Aayush Patel** — Built as a DBMS project demonstrating full-stack development, relational database design, and cloud deployment.
