# DBMS Mini-Project Viva Preparation

## 🗄️ Database (DBMS) Questions

**Q1: How did you implement normalization in this project?**
**A:** We designed the schema up to 3NF. For instance, instead of storing topic names in the `problems` table, we use a `topic_id` foreign key pointing to a separate `topics` table. We used junction tables (like `user_bookmarks`) to resolve Many-to-Many relationships.

**Q2: How do you ensure ACID properties?**
**A:** MySQL's InnoDB engine provides atomicity, consistency, isolation, and durability. Specifically, we used explicit Transactions (`BEGIN`, `COMMIT`, `ROLLBACK`) in the backend when logging a submission to ensure that the `submissions` table and the `user_stats` table update together atomically.

**Q3: Why did you use Triggers and what is an example?**
**A:** Triggers ensure data integrity at the database level. We used an `AFTER INSERT` trigger on the `submissions` table to automatically recalculate the user's progress percentage in the `progress` table without needing extra backend API calls.

**Q4: How did you optimize query performance?**
**A:** We added B-Tree Indexes on frequently queried columns, like `idx_problems_search` on `problems(title)` and composite indexes on `submissions(user_id, problem_id)`, turning O(N) sequential scans into O(log N) lookups.

## ⚙️ Backend & API Questions

**Q1: How is authentication handled?**
**A:** We used JSON Web Tokens (JWT). When a user logs in, the backend signs a token containing the `user_id`. The frontend attaches this token in the `Authorization: Bearer` header. The backend `auth` middleware verifies the token signature before allowing access to protected routes.

**Q2: What happens if someone tries to brute force the login API?**
**A:** We implemented API Rate Limiting using `express-rate-limit`. The authentication route strictly allows only 20 requests per 15 minutes per IP address, protecting against brute-force and DDoS attacks.

## 🎨 Frontend Questions

**Q1: How did you handle state management across the app?**
**A:** We used React Context (`AuthContext`) for global state like the logged-in user, and localized `useState` for component-level data.

**Q2: What is debouncing and why did you use it?**
**A:** Debouncing limits the rate at which a function fires. We used a custom `useDebounce` hook on the search input in the Problems table. It waits for the user to stop typing for a few hundred milliseconds before sending the API request, drastically reducing database load.
