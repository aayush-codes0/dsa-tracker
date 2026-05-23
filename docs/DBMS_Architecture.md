# DSA Tracker — DBMS Architecture

## 1. Normalization (3NF)
The database is strictly normalized to the Third Normal Form (3NF) to eliminate data redundancy and insertion/deletion anomalies:
- 1NF: Atomic columns (tags are separated via M:N or comma-separated lists for frontend parsing, though M:N is ideal).
- 2NF: No partial dependencies. All non-key attributes depend fully on the primary key (e.g., `title` depends entirely on `problem_id`).
- 3NF: No transitive dependencies. E.g., User stats are tied to `user_id` and `stat_date` exclusively.

## 2. Table Relationships (17 Tables)
- **1:N (One-to-Many)**: `users` to `submissions`, `topics` to `problems`.
- **M:N (Many-to-Many)**: `sheets` ↔ `sheet_problems` ↔ `problems`. `users` ↔ `user_bookmarks` ↔ `problems`.

## 3. Advanced Features Used
- **Triggers**: Automates `progress` table updates and `user_stats` updates immediately after a row is inserted into `submissions` (`AFTER INSERT ON submissions`).
- **Stored Procedures**: `sp_award_badges` executes complex conditional logic to check if a user has hit specific milestones (e.g., 50 problems solved) and inserts records into the `achievements` table.
- **Views**: `vw_user_comprehensive_stats` abstracts multi-table JOINs for the frontend dashboard, providing pre-calculated accuracy and streak data.
- **Transactions (ACID)**: Implemented in the Node.js backend. During a submission, the system initiates a `START TRANSACTION`. If inserting the submission fails, or updating the `user_stats` fails, the system executes a `ROLLBACK`. If both succeed, it executes a `COMMIT`.
- **Indexes**: Explicit `CREATE INDEX` used on `submissions(user_id, problem_id)` and `problems(title)` to turn O(N) table scans into O(log N) B-Tree lookups, optimizing the `/api/problems` search and dashboard queries.
