# DSA Tracker

A professional full-stack platform for computer science students to track Data Structures & Algorithms practice, featuring spaced repetition, advanced analytics, and GitHub-style heatmaps.

## 🚀 Features
- **Problem Tracking**: Mark problems as solved, track attempts, time taken, and confidence.
- **Spaced Repetition**: Intelligent revision scheduler (Day 1, 3, 7, 30).
- **Sheet Tracking**: Built-in support for Blind 75 and Striver A2Z.
- **Advanced Analytics**: Identify weak topics, global accuracy %, and solve ratios.
- **GitHub Heatmap**: Visual activity streak tracking.
- **Mock AI Summarizer**: Generate flashcards from problem notes.

## 💻 Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Recharts, Framer Motion
- **Backend**: Node.js, Express.js, JWT Authentication, Express Rate Limit
- **Database**: MySQL 8.0 (Normalized 3NF, Views, Triggers, Transactions, Stored Procedures)

## 🛠️ Local Setup
1. **Clone & Install Dependencies**
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
2. **Environment Variables**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=dsa_tracker
   JWT_SECRET=supersecretkey
   ```
3. **Database Initialization**
   Execute the SQL files inside `database/` in your MySQL server:
   - `schema.sql` (Creates DB and tables)
   - `views.sql` (Creates analytical views)
   - `triggers.sql` (Automates stats)
   - `procedures.sql` (Complex analytics logic)
   - `seed.sql` (Mock data)
4. **Run Application**
   - Server: `npm run dev` (Runs on http://localhost:5000)
   - Client: `npm run dev` (Runs on http://localhost:5173)

## 📸 Screenshots
*(Add screenshots of Dashboard, Heatmap, and Problems Table here)*
