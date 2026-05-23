-- =============================================================================
-- FINAL DBMS ENHANCEMENTS
-- =============================================================================

-- VIEW: vw_user_comprehensive_stats
CREATE OR REPLACE VIEW vw_user_comprehensive_stats AS
SELECT 
    u.user_id,
    u.username,
    u.total_solved,
    u.current_streak,
    u.max_streak,
    (SELECT COUNT(*) FROM submissions WHERE user_id = u.user_id) AS total_attempts,
    (SELECT COUNT(*) FROM revision_schedules WHERE user_id = u.user_id AND completed = FALSE) AS pending_revisions,
    (SELECT AVG(score) FROM contests WHERE user_id = u.user_id) AS avg_contest_score,
    IFNULL((SELECT (COUNT(CASE WHEN status = 'Accepted' THEN 1 END) / COUNT(*)) * 100 
            FROM submissions WHERE user_id = u.user_id), 0) AS global_accuracy
FROM users u;

-- EXTRA JOIN EXAMPLES
-- 1. Find all problems solved by friends
-- SELECT f.user_id_2 as friend_id, p.title
-- FROM friends f
-- JOIN submissions s ON f.user_id_2 = s.user_id
-- JOIN problems p ON s.problem_id = p.problem_id
-- WHERE f.user_id_1 = ? AND s.status = 'Accepted';

-- 2. Find weak topics compared to friends
-- SELECT t.topic_name, p.percentage as my_progress, f_prog.percentage as friend_progress
-- FROM progress p
-- JOIN topics t ON p.topic_id = t.topic_id
-- JOIN friends f ON p.user_id = f.user_id_1
-- JOIN progress f_prog ON f.user_id_2 = f_prog.user_id AND f_prog.topic_id = p.topic_id
-- WHERE p.user_id = ?;
