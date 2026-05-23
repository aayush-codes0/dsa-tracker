# DSA Tracker — SQL Documentation

This document showcases various SQL concepts utilized in the project.

## JOINs

**1. INNER JOIN (Get Submissions with Problem Details)**
```sql
SELECT
    s.submission_id,
    s.status,
    p.title AS problem_title,
    t.topic_name
FROM submissions s
INNER JOIN problems p ON s.problem_id = p.problem_id
INNER JOIN topics t ON p.topic_id = t.topic_id
WHERE s.user_id = 1;
```
*Explanation:* Combines matching rows from submissions, problems, and topics to show a user what problems they solved and which topics they belong to.

**2. LEFT JOIN (Get All Topics with Problem Counts, Even if 0)**
```sql
SELECT
    t.topic_name,
    COUNT(p.problem_id) AS num_problems
FROM topics t
LEFT JOIN problems p ON t.topic_id = p.topic_id
GROUP BY t.topic_id;
```
*Explanation:* Ensures all topics are listed, even if there are no associated problems in the `problems` table.

## Aggregates and GROUP BY

**3. GROUP BY (Count Problems Solved by Difficulty)**
```sql
SELECT
    p.difficulty,
    COUNT(DISTINCT s.problem_id) AS solved_count
FROM submissions s
JOIN problems p ON s.problem_id = p.problem_id
WHERE s.user_id = 1 AND s.status = 'Accepted'
GROUP BY p.difficulty;
```
*Explanation:* Groups the user's accepted submissions by the problem's difficulty and counts the unique problems solved per difficulty level.

**4. HAVING (Find Topics where User Solved > 5 Problems)**
```sql
SELECT
    t.topic_name,
    COUNT(DISTINCT s.problem_id) as solved
FROM submissions s
JOIN problems p ON s.problem_id = p.problem_id
JOIN topics t ON p.topic_id = t.topic_id
WHERE s.user_id = 1 AND s.status = 'Accepted'
GROUP BY t.topic_id
HAVING solved > 5;
```
*Explanation:* Filters the grouped results to only show topics with more than 5 solved problems.

## Subqueries

**5. Nested Subquery (Users who solved more than the average)**
```sql
SELECT username, total_solved
FROM users
WHERE total_solved > (
    SELECT AVG(total_solved) FROM users
);
```
*Explanation:* Calculates the average `total_solved` across all users first, then uses that value to filter the main query.

**6. EXISTS (Find problems with notes but no accepted submission)**
```sql
SELECT title
FROM problems p
WHERE EXISTS (
    SELECT 1 FROM notes n WHERE n.problem_id = p.problem_id AND n.user_id = 1
) AND NOT EXISTS (
    SELECT 1 FROM submissions s WHERE s.problem_id = p.problem_id AND s.user_id = 1 AND s.status = 'Accepted'
);
```
*Explanation:* Uses `EXISTS` and `NOT EXISTS` to check for the presence of related records without needing to return data from those subqueries.

## Views

**7. v_leaderboard**
```sql
CREATE VIEW v_leaderboard AS
SELECT
    u.user_id,
    u.username,
    u.full_name,
    u.total_solved,
    u.current_streak,
    u.max_streak,
    COUNT(a.achievement_id) AS badge_count
FROM users u
LEFT JOIN achievements a ON u.user_id = a.user_id
GROUP BY u.user_id
ORDER BY u.total_solved DESC;
```
*Explanation:* A virtual table that pre-calculates leaderboard data, simplifying application queries.

## Triggers

**8. trg_after_submission_insert**
```sql
CREATE TRIGGER trg_after_submission_insert
AFTER INSERT ON submissions
FOR EACH ROW
BEGIN
    -- Logic to update user_stats, progress, and users.total_solved based on the new submission
END;
```
*Explanation:* Automatically runs after a new row is added to `submissions`, keeping aggregate stats in sync without application-level logic.

## Stored Procedures

**9. sp_award_badges**
```sql
CREATE PROCEDURE sp_award_badges(IN p_user_id INT)
BEGIN
    -- Logic to check criteria and INSERT into achievements if met
END;
```
*Explanation:* Encapsulates complex business logic (badge evaluation) within the database.
