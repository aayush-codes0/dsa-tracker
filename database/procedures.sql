-- =============================================================================
-- DSA TRACKER — Stored Procedures (MySQL 8)
-- File   : procedures.sql
-- Purpose: Reusable business-logic routines called from the application layer.
-- Depends: schema.sql
-- =============================================================================

USE dsa_tracker;

-- ─────────────────────────────────────────────────────────────────────────────
-- PROCEDURE 1 : sp_get_user_analytics
-- Purpose: Returns a comprehensive statistics summary for a single user.
--          The application calls this to populate the Analytics page.
-- Returns: One result set with a single row of aggregate numbers.
-- ─────────────────────────────────────────────────────────────────────────────
DROP PROCEDURE IF EXISTS sp_get_user_analytics;



CREATE PROCEDURE sp_get_user_analytics(IN p_user_id INT)
BEGIN
    SELECT
        -- ── Basic counters ──────────────────────────────────────────────
        u.total_solved,
        u.current_streak,
        u.max_streak,

        -- ── Difficulty breakdown (distinct accepted problems) ───────────
        COUNT(DISTINCT CASE
            WHEN p.difficulty = 'Easy'   AND s.status = 'Accepted' THEN s.problem_id
        END) AS easy_count,

        COUNT(DISTINCT CASE
            WHEN p.difficulty = 'Medium' AND s.status = 'Accepted' THEN s.problem_id
        END) AS medium_count,

        COUNT(DISTINCT CASE
            WHEN p.difficulty = 'Hard'   AND s.status = 'Accepted' THEN s.problem_id
        END) AS hard_count,

        -- ── Total submissions (all verdicts) ────────────────────────────
        COUNT(s.submission_id) AS total_submissions,

        -- ── Average time per solved problem ─────────────────────────────
        ROUND(AVG(CASE
            WHEN s.status = 'Accepted' THEN s.time_taken_min
        END), 1) AS avg_time_per_problem,

        -- ── Most practised topic (the one with the most accepted subs) ──
        (SELECT t.topic_name
         FROM submissions s2
         INNER JOIN problems p2 ON s2.problem_id = p2.problem_id
         INNER JOIN topics   t  ON p2.topic_id   = t.topic_id
         WHERE s2.user_id = p_user_id
           AND s2.status  = 'Accepted'
         GROUP BY t.topic_id, t.topic_name
         ORDER BY COUNT(DISTINCT s2.problem_id) DESC
         LIMIT 1
        ) AS most_practiced_topic,

        -- ── Contest stats ───────────────────────────────────────────────
        (SELECT COUNT(*)
         FROM contests c
         WHERE c.user_id = p_user_id
        ) AS total_contests,

        (SELECT ROUND(AVG(c.rank_achieved), 1)
         FROM contests c
         WHERE c.user_id = p_user_id
           AND c.rank_achieved IS NOT NULL
        ) AS avg_contest_rank

    FROM users u
    LEFT JOIN submissions s ON u.user_id = s.user_id
    LEFT JOIN problems    p ON s.problem_id = p.problem_id
    WHERE u.user_id = p_user_id
    GROUP BY
        u.user_id,
        u.total_solved,
        u.current_streak,
        u.max_streak;
END;




-- ─────────────────────────────────────────────────────────────────────────────
-- PROCEDURE 2 : sp_recalculate_progress
-- Purpose: Rebuilds all progress rows for a given user from scratch by
--          counting accepted submissions per topic.  Useful if data gets
--          out of sync or after bulk-importing submissions.
-- ─────────────────────────────────────────────────────────────────────────────
DROP PROCEDURE IF EXISTS sp_recalculate_progress;



CREATE PROCEDURE sp_recalculate_progress(IN p_user_id INT)
BEGIN
    -- Use a REPLACE pattern: for every topic, compute the real counts
    -- and upsert into the progress table.
    INSERT INTO progress (user_id, topic_id, solved_count, total_count, percentage, last_practiced)
    SELECT
        p_user_id                                   AS user_id,
        t.topic_id,

        -- Distinct accepted problems in this topic for this user
        COUNT(DISTINCT CASE
            WHEN s.status = 'Accepted' THEN s.problem_id
        END)                                        AS solved_count,

        t.total_problems                            AS total_count,

        -- Calculate percentage, guarding against division by zero
        IF(t.total_problems > 0,
           ROUND(
               COUNT(DISTINCT CASE WHEN s.status = 'Accepted' THEN s.problem_id END)
               / t.total_problems * 100, 2),
           0.00
        )                                           AS percentage,

        -- Most recent accepted submission date in this topic
        MAX(CASE
            WHEN s.status = 'Accepted' THEN s.submitted_at
        END)                                        AS last_practiced

    FROM topics t
    LEFT JOIN problems p ON t.topic_id = p.topic_id
    LEFT JOIN submissions s ON p.problem_id = s.problem_id
                            AND s.user_id   = p_user_id
    GROUP BY t.topic_id, t.total_problems

    -- Upsert: if a row already exists for (user_id, topic_id), update it
    ON DUPLICATE KEY UPDATE
        solved_count   = VALUES(solved_count),
        total_count    = VALUES(total_count),
        percentage     = VALUES(percentage),
        last_practiced = VALUES(last_practiced);
END;




-- ─────────────────────────────────────────────────────────────────────────────
-- PROCEDURE 3 : sp_award_badges
-- Purpose: Checks every badge's criteria against the user's current stats
--          and awards any badges the user has earned but not yet received.
-- Design : Uses a simple IF-chain.  For a production system you might store
--          criteria as JSON and evaluate dynamically, but explicit checks
--          are clearer for beginners.
-- ─────────────────────────────────────────────────────────────────────────────
DROP PROCEDURE IF EXISTS sp_award_badges;



CREATE PROCEDURE sp_award_badges(IN p_user_id INT)
BEGIN
    DECLARE v_total_solved   INT DEFAULT 0;
    DECLARE v_current_streak INT DEFAULT 0;
    DECLARE v_max_streak     INT DEFAULT 0;
    DECLARE v_total_contests INT DEFAULT 0;
    DECLARE v_topics_covered INT DEFAULT 0;
    DECLARE v_hard_solved    INT DEFAULT 0;

    -- ── Gather the user's current stats ─────────────────────────────────
    SELECT total_solved, current_streak, max_streak
    INTO v_total_solved, v_current_streak, v_max_streak
    FROM users
    WHERE user_id = p_user_id;

    SELECT COUNT(*) INTO v_total_contests
    FROM contests
    WHERE user_id = p_user_id;

    -- Count how many distinct topics the user has at least 1 accepted problem in
    SELECT COUNT(DISTINCT p.topic_id) INTO v_topics_covered
    FROM submissions s
    INNER JOIN problems p ON s.problem_id = p.problem_id
    WHERE s.user_id = p_user_id
      AND s.status  = 'Accepted'
      AND p.topic_id IS NOT NULL;

    -- Count accepted hard problems
    SELECT COUNT(DISTINCT s.problem_id) INTO v_hard_solved
    FROM submissions s
    INNER JOIN problems p ON s.problem_id = p.problem_id
    WHERE s.user_id = p_user_id
      AND s.status  = 'Accepted'
      AND p.difficulty = 'Hard';

    -- ── Award each badge if criteria met and not already earned ──────────

    -- Badge 1: First Blood (solved >= 1)
    IF v_total_solved >= 1 THEN
        INSERT IGNORE INTO achievements (user_id, badge_id)
        SELECT p_user_id, badge_id FROM badges WHERE badge_name = 'First Blood';
    END IF;

    -- Badge 2: Getting Started (solved >= 10)
    IF v_total_solved >= 10 THEN
        INSERT IGNORE INTO achievements (user_id, badge_id)
        SELECT p_user_id, badge_id FROM badges WHERE badge_name = 'Getting Started';
    END IF;

    -- Badge 3: Problem Crusher (solved >= 50)
    IF v_total_solved >= 50 THEN
        INSERT IGNORE INTO achievements (user_id, badge_id)
        SELECT p_user_id, badge_id FROM badges WHERE badge_name = 'Problem Crusher';
    END IF;

    -- Badge 4: Centurion (solved >= 100)
    IF v_total_solved >= 100 THEN
        INSERT IGNORE INTO achievements (user_id, badge_id)
        SELECT p_user_id, badge_id FROM badges WHERE badge_name = 'Centurion';
    END IF;

    -- Badge 5: Streak Starter (streak >= 3)
    IF v_max_streak >= 3 THEN
        INSERT IGNORE INTO achievements (user_id, badge_id)
        SELECT p_user_id, badge_id FROM badges WHERE badge_name = 'Streak Starter';
    END IF;

    -- Badge 6: Streak Master (streak >= 7)
    IF v_max_streak >= 7 THEN
        INSERT IGNORE INTO achievements (user_id, badge_id)
        SELECT p_user_id, badge_id FROM badges WHERE badge_name = 'Streak Master';
    END IF;

    -- Badge 7: Streak Legend (streak >= 30)
    IF v_max_streak >= 30 THEN
        INSERT IGNORE INTO achievements (user_id, badge_id)
        SELECT p_user_id, badge_id FROM badges WHERE badge_name = 'Streak Legend';
    END IF;

    -- Badge 8: Contest Warrior (contests >= 5)
    IF v_total_contests >= 5 THEN
        INSERT IGNORE INTO achievements (user_id, badge_id)
        SELECT p_user_id, badge_id FROM badges WHERE badge_name = 'Contest Warrior';
    END IF;

    -- Badge 9: Topic Explorer (topics >= 5)
    IF v_topics_covered >= 5 THEN
        INSERT IGNORE INTO achievements (user_id, badge_id)
        SELECT p_user_id, badge_id FROM badges WHERE badge_name = 'Topic Explorer';
    END IF;

    -- Badge 10: Hard Hitter (hard_solved >= 10)
    IF v_hard_solved >= 10 THEN
        INSERT IGNORE INTO achievements (user_id, badge_id)
        SELECT p_user_id, badge_id FROM badges WHERE badge_name = 'Hard Hitter';
    END IF;

    -- Return a summary of the user's badges after awarding
    SELECT
        b.badge_name,
        b.description,
        b.icon,
        b.badge_type,
        a.earned_at
    FROM achievements a
    INNER JOIN badges b ON a.badge_id = b.badge_id
    WHERE a.user_id = p_user_id
    ORDER BY a.earned_at;
END;




-- ─────────────────────────────────────────────────────────────────────────────
-- PROCEDURE 4 : sp_get_heatmap_data
-- Purpose: Returns one row per day for the requested calendar year, with the
--          number of problems solved that day.  Drives the GitHub-style
--          contribution heatmap in the UI.
-- Design : Uses a recursive CTE to generate all 365/366 days of the year,
--          then LEFT JOINs against user_stats so days with zero activity
--          still appear (important for rendering the heatmap correctly).
-- ─────────────────────────────────────────────────────────────────────────────
DROP PROCEDURE IF EXISTS sp_get_heatmap_data;



CREATE PROCEDURE sp_get_heatmap_data(
    IN p_user_id INT,
    IN p_year    INT
)
BEGIN
    -- Recursive CTE: generate every date from Jan 1 to Dec 31 of p_year
    WITH RECURSIVE calendar AS (
        SELECT CAST(CONCAT(p_year, '-01-01') AS DATE) AS cal_date

        UNION ALL

        SELECT cal_date + INTERVAL 1 DAY
        FROM calendar
        WHERE cal_date < CAST(CONCAT(p_year, '-12-31') AS DATE)
    )
    SELECT
        c.cal_date                                    AS `date`,
        DAYOFWEEK(c.cal_date)                         AS day_of_week,   -- 1=Sun … 7=Sat
        WEEKOFYEAR(c.cal_date)                        AS week_number,
        MONTHNAME(c.cal_date)                         AS month_name,
        COALESCE(us.problems_solved, 0)               AS problems_solved,
        COALESCE(us.time_spent_min, 0)                AS time_spent_min,
        COALESCE(us.submissions_count, 0)             AS submissions_count
    FROM calendar c
    LEFT JOIN user_stats us
        ON c.cal_date = us.stat_date
       AND us.user_id = p_user_id
    ORDER BY c.cal_date;
END;



-- =============================================================================
-- End of procedures.sql
-- =============================================================================
