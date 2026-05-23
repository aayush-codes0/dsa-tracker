-- =============================================================================
-- DSA TRACKER — Sample Queries (MySQL 8)
-- File   : queries.sql
-- Purpose: 12 well-commented example queries demonstrating key SQL concepts.
--          Use these as a learning reference or as starting points for the
--          application's data-access layer.
-- Depends: schema.sql, seed.sql (for meaningful results)
-- =============================================================================

USE dsa_tracker;


-- ─────────────────────────────────────────────────────────────────────────────
-- QUERY 1 : INNER JOIN
-- Concept : INNER JOIN returns only rows where a match exists in BOTH tables.
-- Purpose : Retrieve all submissions along with the problem title and topic.
--           Only submissions that reference a valid problem (and that problem
--           has a topic) will appear.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    s.submission_id,
    u.username,
    p.title          AS problem_title,
    t.topic_name,
    p.difficulty,
    s.status,
    s.time_taken_min,
    s.language_used,
    s.submitted_at
FROM submissions s
INNER JOIN users    u ON s.user_id    = u.user_id
INNER JOIN problems p ON s.problem_id = p.problem_id
INNER JOIN topics   t ON p.topic_id   = t.topic_id
ORDER BY s.submitted_at DESC;


-- ─────────────────────────────────────────────────────────────────────────────
-- QUERY 2 : LEFT JOIN
-- Concept : LEFT JOIN returns ALL rows from the left table, even if there is
--           no matching row in the right table (NULLs fill in the gaps).
-- Purpose : List every problem together with its latest submission status.
--           Problems that have never been attempted will still appear with
--           NULL submission columns — perfect for showing "unsolved" badges.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    p.problem_id,
    p.title,
    p.difficulty,
    t.topic_name,
    latest_sub.status          AS last_status,
    latest_sub.submitted_at    AS last_attempted,
    CASE
        WHEN latest_sub.status = 'Accepted' THEN '✅ Solved'
        WHEN latest_sub.status IS NOT NULL   THEN '🔄 Attempted'
        ELSE '❌ Not Started'
    END AS progress_label
FROM problems p
LEFT JOIN topics t ON p.topic_id = t.topic_id
LEFT JOIN (
    -- Sub-query: pick the most recent submission per problem for user 2
    SELECT s1.*
    FROM submissions s1
    INNER JOIN (
        SELECT problem_id, MAX(submitted_at) AS max_ts
        FROM submissions
        WHERE user_id = 2                   -- <-- parameterise for your user
        GROUP BY problem_id
    ) s2 ON s1.problem_id = s2.problem_id
        AND s1.submitted_at = s2.max_ts
        AND s1.user_id = 2
) latest_sub ON p.problem_id = latest_sub.problem_id
ORDER BY p.problem_id;


-- ─────────────────────────────────────────────────────────────────────────────
-- QUERY 3 : RIGHT JOIN
-- Concept : RIGHT JOIN returns ALL rows from the right table, even if the
--           left table has no matching rows.
-- Purpose : Show every topic alongside its problem count, including topics
--           that might have zero problems (e.g. a newly-added topic).
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    t.topic_id,
    t.topic_name,
    t.icon,
    t.color_hex,
    COUNT(p.problem_id) AS problem_count
FROM problems p
RIGHT JOIN topics t ON p.topic_id = t.topic_id
GROUP BY t.topic_id, t.topic_name, t.icon, t.color_hex
ORDER BY problem_count DESC;


-- ─────────────────────────────────────────────────────────────────────────────
-- QUERY 4 : Aggregate with GROUP BY
-- Concept : GROUP BY collapses rows sharing the same key into summary rows.
--           Aggregate functions (COUNT, SUM, AVG) compute values per group.
-- Purpose : For a given user, count how many DISTINCT problems they solved
--           in each difficulty tier.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    u.username,
    p.difficulty,
    COUNT(DISTINCT s.problem_id) AS problems_solved,
    COUNT(s.submission_id)       AS total_attempts,
    ROUND(AVG(s.time_taken_min), 1) AS avg_time_min
FROM submissions s
INNER JOIN users    u ON s.user_id    = u.user_id
INNER JOIN problems p ON s.problem_id = p.problem_id
WHERE s.status = 'Accepted'
GROUP BY u.username, p.difficulty
ORDER BY u.username,
         FIELD(p.difficulty, 'Easy', 'Medium', 'Hard');


-- ─────────────────────────────────────────────────────────────────────────────
-- QUERY 5 : Aggregate with HAVING
-- Concept : HAVING filters groups AFTER aggregation (WHERE filters rows
--           BEFORE aggregation).
-- Purpose : Find topics where a specific user has solved more than 5
--           distinct problems.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    t.topic_name,
    t.icon,
    COUNT(DISTINCT s.problem_id) AS solved_count
FROM submissions s
INNER JOIN problems p ON s.problem_id = p.problem_id
INNER JOIN topics   t ON p.topic_id   = t.topic_id
WHERE s.user_id = 2                      -- <-- parameterise
  AND s.status  = 'Accepted'
GROUP BY t.topic_id, t.topic_name, t.icon
HAVING COUNT(DISTINCT s.problem_id) > 5
ORDER BY solved_count DESC;


-- ─────────────────────────────────────────────────────────────────────────────
-- QUERY 6 : Nested Sub-query
-- Concept : A sub-query in the WHERE clause is evaluated first and its result
--           is used by the outer query.  This is a "non-correlated" sub-query
--           because it runs independently.
-- Purpose : Find users whose total_solved exceeds the overall average.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    user_id,
    username,
    full_name,
    total_solved
FROM users
WHERE total_solved > (
    -- Sub-query: compute the average problems solved across all users
    SELECT AVG(total_solved)
    FROM users
)
ORDER BY total_solved DESC;


-- ─────────────────────────────────────────────────────────────────────────────
-- QUERY 7 : Correlated Sub-query
-- Concept : A correlated sub-query references a column from the outer query,
--           so it re-executes for every row of the outer query.
-- Purpose : For each user, find the title of the hardest problem they solved
--           (prioritising 'Hard' > 'Medium' > 'Easy').
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    u.user_id,
    u.username,
    (
        SELECT p.title
        FROM submissions s
        INNER JOIN problems p ON s.problem_id = p.problem_id
        WHERE s.user_id = u.user_id           -- ← correlated reference
          AND s.status  = 'Accepted'
        ORDER BY FIELD(p.difficulty, 'Hard', 'Medium', 'Easy'),
                 s.submitted_at DESC
        LIMIT 1
    ) AS hardest_problem_solved
FROM users u;


-- ─────────────────────────────────────────────────────────────────────────────
-- QUERY 8 : Multiple JOINs (Dashboard Query)
-- Concept : Chaining several JOINs to flatten a normalised schema into a
--           single wide result set for the front-end.
-- Purpose : Build the complete dashboard feed: user info + submission details
--           + problem metadata + topic label.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    u.user_id,
    u.username,
    u.avatar_url,
    u.total_solved,
    u.current_streak,
    s.submission_id,
    p.title        AS problem_title,
    p.difficulty,
    p.platform,
    t.topic_name,
    t.color_hex    AS topic_color,
    s.status,
    s.time_taken_min,
    s.language_used,
    s.confidence,
    s.submitted_at
FROM users u
INNER JOIN submissions s ON u.user_id    = s.user_id
INNER JOIN problems    p ON s.problem_id = p.problem_id
LEFT  JOIN topics      t ON p.topic_id   = t.topic_id
WHERE u.user_id = 2                      -- <-- parameterise
ORDER BY s.submitted_at DESC
LIMIT 20;


-- ─────────────────────────────────────────────────────────────────────────────
-- QUERY 9 : UNION
-- Concept : UNION combines the result sets of two SELECT statements into one.
--           Column count and types must match.  UNION ALL keeps duplicates;
--           UNION removes them.
-- Purpose : Merge submission activity and contest activity into a single
--           chronological timeline.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    'Submission' AS activity_type,
    p.title      AS activity_name,
    s.status     AS result,
    s.submitted_at AS activity_date
FROM submissions s
INNER JOIN problems p ON s.problem_id = p.problem_id
WHERE s.user_id = 2

UNION ALL

SELECT
    'Contest'       AS activity_type,
    c.contest_name  AS activity_name,
    CONCAT('Rank #', c.rank_achieved) AS result,
    c.created_at    AS activity_date
FROM contests c
WHERE c.user_id = 2

ORDER BY activity_date DESC
LIMIT 30;


-- ─────────────────────────────────────────────────────────────────────────────
-- QUERY 10 : EXISTS Sub-query
-- Concept : EXISTS returns TRUE if the sub-query produces at least one row.
--           It's often faster than IN for large datasets.
-- Purpose : Find problems that have at least one note but NO accepted
--           submission from any user — i.e. studied but not yet solved.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    p.problem_id,
    p.title,
    p.difficulty,
    t.topic_name
FROM problems p
LEFT JOIN topics t ON p.topic_id = t.topic_id
WHERE
    -- Has at least one note
    EXISTS (
        SELECT 1
        FROM notes n
        WHERE n.problem_id = p.problem_id
    )
    -- But NO accepted submission from anyone
    AND NOT EXISTS (
        SELECT 1
        FROM submissions s
        WHERE s.problem_id = p.problem_id
          AND s.status = 'Accepted'
    );


-- ─────────────────────────────────────────────────────────────────────────────
-- QUERY 11 : Window Function
-- Concept : Window functions perform calculations across a set of rows
--           related to the current row WITHOUT collapsing them (unlike
--           GROUP BY).  RANK(), DENSE_RANK(), ROW_NUMBER() are common.
-- Purpose : Rank all users by problems solved, showing their percentile.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    user_id,
    username,
    full_name,
    total_solved,

    -- DENSE_RANK: ties get the same rank, no gaps
    DENSE_RANK() OVER (ORDER BY total_solved DESC) AS `rank`,

    -- ROW_NUMBER: unique sequential number regardless of ties
    ROW_NUMBER() OVER (ORDER BY total_solved DESC) AS row_num,

    -- PERCENT_RANK: percentile position (0 = top, 1 = bottom)
    ROUND(PERCENT_RANK() OVER (ORDER BY total_solved DESC) * 100, 1) AS top_percentile

FROM users
ORDER BY total_solved DESC;


-- ─────────────────────────────────────────────────────────────────────────────
-- QUERY 12 : Date Functions — Weekly Activity Summary
-- Concept : MySQL date functions (YEARWEEK, DATE_FORMAT, DAYNAME, etc.)
--           let you bucket and format temporal data easily.
-- Purpose : Generate a week-by-week activity summary for the current year.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    YEARWEEK(us.stat_date, 1)                          AS year_week,
    MIN(us.stat_date)                                  AS week_start,
    MAX(us.stat_date)                                  AS week_end,
    SUM(us.problems_solved)                            AS total_solved,
    SUM(us.time_spent_min)                             AS total_minutes,
    SUM(us.submissions_count)                          AS total_submissions,
    COUNT(CASE WHEN us.problems_solved > 0 THEN 1 END) AS active_days,
    ROUND(AVG(us.problems_solved), 1)                  AS avg_daily_solved
FROM user_stats us
WHERE us.user_id = 2                                   -- <-- parameterise
  AND YEAR(us.stat_date) = YEAR(CURDATE())
GROUP BY YEARWEEK(us.stat_date, 1)
ORDER BY year_week DESC;

-- =============================================================================
-- End of queries.sql
-- =============================================================================
