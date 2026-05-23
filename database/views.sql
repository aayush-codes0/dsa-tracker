-- =============================================================================
-- DSA TRACKER — Views (MySQL 8)
-- File   : views.sql
-- Purpose: Pre-built views that simplify common read queries for the UI.
-- Depends: schema.sql (all tables must exist first)
-- =============================================================================

USE dsa_tracker;

-- ─────────────────────────────────────────────────────────────────────────────
-- VIEW 1 : v_user_dashboard
-- Purpose: One-row-per-user summary powering the main dashboard card.
--          Includes total solved, streak info, and Easy / Medium / Hard counts.
-- Joins  : users ← submissions → problems
-- ─────────────────────────────────────────────────────────────────────────────
DROP VIEW IF EXISTS v_user_dashboard;

CREATE VIEW v_user_dashboard AS
SELECT
    u.user_id,
    u.username,
    u.full_name,
    u.avatar_url,
    u.total_solved,
    u.current_streak,
    u.max_streak,
    u.joined_date,

    -- Difficulty breakdown: count DISTINCT accepted problems per tier
    COUNT(DISTINCT CASE
        WHEN p.difficulty = 'Easy'   AND s.status = 'Accepted' THEN s.problem_id
    END) AS easy_solved,

    COUNT(DISTINCT CASE
        WHEN p.difficulty = 'Medium' AND s.status = 'Accepted' THEN s.problem_id
    END) AS medium_solved,

    COUNT(DISTINCT CASE
        WHEN p.difficulty = 'Hard'   AND s.status = 'Accepted' THEN s.problem_id
    END) AS hard_solved

FROM users u
LEFT JOIN submissions s ON u.user_id = s.user_id
LEFT JOIN problems    p ON s.problem_id = p.problem_id
GROUP BY
    u.user_id,
    u.username,
    u.full_name,
    u.avatar_url,
    u.total_solved,
    u.current_streak,
    u.max_streak,
    u.joined_date;


-- ─────────────────────────────────────────────────────────────────────────────
-- VIEW 2 : v_topic_progress
-- Purpose: Shows per-user, per-topic completion status.
--          Drives the "Topics" progress-bar section on the dashboard.
-- Joins  : progress → topics
-- ─────────────────────────────────────────────────────────────────────────────
DROP VIEW IF EXISTS v_topic_progress;

CREATE VIEW v_topic_progress AS
SELECT
    pr.user_id,
    t.topic_id,
    t.topic_name,
    t.icon,
    t.color_hex,
    pr.solved_count,
    pr.total_count,
    pr.percentage,
    pr.last_practiced
FROM progress pr
INNER JOIN topics t ON pr.topic_id = t.topic_id;


-- ─────────────────────────────────────────────────────────────────────────────
-- VIEW 3 : v_leaderboard
-- Purpose: Global leaderboard ranking users by total_solved descending.
--          Also includes badge count for bragging rights.
-- Joins  : users ← achievements (sub-query for badge count)
-- ─────────────────────────────────────────────────────────────────────────────
DROP VIEW IF EXISTS v_leaderboard;

CREATE VIEW v_leaderboard AS
SELECT
    u.user_id,
    u.username,
    u.full_name,
    u.avatar_url,
    u.total_solved,
    u.current_streak,
    u.max_streak,

    -- Correlated sub-query: count how many badges this user has earned
    (SELECT COUNT(*)
     FROM achievements a
     WHERE a.user_id = u.user_id
    ) AS badge_count,

    -- Rank using a window function (ties share the same rank)
    DENSE_RANK() OVER (ORDER BY u.total_solved DESC) AS `rank`

FROM users u
ORDER BY u.total_solved DESC;


-- ─────────────────────────────────────────────────────────────────────────────
-- VIEW 4 : v_recent_submissions
-- Purpose: Flattened submission feed with problem + topic details.
--          Powers the "Recent Activity" timeline in the UI.
-- Joins  : submissions → problems → topics
-- ─────────────────────────────────────────────────────────────────────────────
DROP VIEW IF EXISTS v_recent_submissions;

CREATE VIEW v_recent_submissions AS
SELECT
    s.submission_id,
    s.user_id,
    u.username,
    s.problem_id,
    p.title          AS problem_title,
    p.difficulty,
    p.platform,
    p.problem_url,
    t.topic_name,
    t.color_hex      AS topic_color,
    s.status,
    s.time_taken_min,
    s.approach_used,
    s.language_used,
    s.attempts,
    s.confidence,
    s.submitted_at
FROM submissions s
INNER JOIN users    u ON s.user_id    = u.user_id
INNER JOIN problems p ON s.problem_id = p.problem_id
LEFT  JOIN topics   t ON p.topic_id   = t.topic_id
ORDER BY s.submitted_at DESC;

-- =============================================================================
-- End of views.sql
-- =============================================================================
