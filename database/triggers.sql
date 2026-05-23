-- =============================================================================
-- DSA TRACKER — Triggers (MySQL 8)
-- File   : triggers.sql
-- Purpose: Automatic side-effects that keep denormalised counters and streaks
--          in sync whenever rows are inserted into `submissions` or `problems`.
-- Depends: schema.sql
-- =============================================================================

USE dsa_tracker;

-- ─────────────────────────────────────────────────────────────────────────────
-- TRIGGER 1 : trg_after_submission_insert
-- Fires   : AFTER INSERT on `submissions`
-- Purpose : Keeps three denormalised caches up to date:
--           1. user_stats  — increment problems_solved (only for Accepted) and
--                            submissions_count for the submission date.
--           2. progress    — increment solved_count for the problem's topic
--                            and recalculate the percentage.
--           3. users       — increment total_solved (only for first Accepted
--                            submission on that problem).
-- ─────────────────────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS trg_after_submission_insert;



CREATE TRIGGER trg_after_submission_insert
AFTER INSERT ON submissions
FOR EACH ROW
BEGIN
    DECLARE v_topic_id      INT;
    DECLARE v_total_in_topic INT;
    DECLARE v_solved_in_topic INT;
    DECLARE v_already_accepted INT;

    -- ── 1. Upsert daily user_stats ──────────────────────────────────────────
    --    Always bump submissions_count.
    --    Only bump problems_solved when the verdict is 'Accepted'.
    INSERT INTO user_stats (user_id, stat_date, problems_solved, time_spent_min, submissions_count)
    VALUES (
        NEW.user_id,
        DATE(NEW.submitted_at),
        IF(NEW.status = 'Accepted', 1, 0),
        COALESCE(NEW.time_taken_min, 0),
        1
    )
    ON DUPLICATE KEY UPDATE
        problems_solved   = problems_solved   + IF(NEW.status = 'Accepted', 1, 0),
        time_spent_min    = time_spent_min    + COALESCE(NEW.time_taken_min, 0),
        submissions_count = submissions_count + 1;

    -- ── 2. Update topic progress (only for accepted submissions) ────────────
    IF NEW.status = 'Accepted' THEN

        -- Look up the topic for this problem
        SELECT topic_id INTO v_topic_id
        FROM problems
        WHERE problem_id = NEW.problem_id;

        IF v_topic_id IS NOT NULL THEN
            -- How many total problems exist in this topic?
            SELECT total_problems INTO v_total_in_topic
            FROM topics
            WHERE topic_id = v_topic_id;

            -- How many DISTINCT problems has this user solved in this topic?
            SELECT COUNT(DISTINCT s.problem_id) INTO v_solved_in_topic
            FROM submissions s
            INNER JOIN problems p ON s.problem_id = p.problem_id
            WHERE s.user_id  = NEW.user_id
              AND s.status   = 'Accepted'
              AND p.topic_id = v_topic_id;

            -- Upsert the progress row
            INSERT INTO progress (user_id, topic_id, solved_count, total_count, percentage, last_practiced)
            VALUES (
                NEW.user_id,
                v_topic_id,
                v_solved_in_topic,
                v_total_in_topic,
                IF(v_total_in_topic > 0,
                   ROUND((v_solved_in_topic / v_total_in_topic) * 100, 2),
                   0.00),
                NEW.submitted_at
            )
            ON DUPLICATE KEY UPDATE
                solved_count   = v_solved_in_topic,
                total_count    = v_total_in_topic,
                percentage     = IF(v_total_in_topic > 0,
                                    ROUND((v_solved_in_topic / v_total_in_topic) * 100, 2),
                                    0.00),
                last_practiced = NEW.submitted_at;
        END IF;

        -- ── 3. Increment users.total_solved only on FIRST accepted attempt ──
        --    Count previous accepted submissions for this (user, problem) pair.
        SELECT COUNT(*) INTO v_already_accepted
        FROM submissions
        WHERE user_id    = NEW.user_id
          AND problem_id = NEW.problem_id
          AND status     = 'Accepted'
          AND submission_id <> NEW.submission_id;

        IF v_already_accepted = 0 THEN
            UPDATE users
            SET total_solved = total_solved + 1
            WHERE user_id = NEW.user_id;
        END IF;
    END IF;
END;




-- ─────────────────────────────────────────────────────────────────────────────
-- TRIGGER 2 : trg_after_submission_update_streak
-- Fires   : AFTER INSERT on `submissions` (separate trigger for clarity)
-- Purpose : Manages the daily-practice streak on accepted submissions.
--           • If the user already has an accepted submission TODAY → no change.
--           • If yesterday had an accepted submission → increment streak.
--           • Otherwise → reset streak to 1.
--           • Always updates max_streak if current exceeds it.
-- Note    : MySQL 8 allows multiple triggers on the same event; ordering is
--           controlled by FOLLOWS / PRECEDES.  This trigger FOLLOWS the first.
-- ─────────────────────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS trg_after_submission_update_streak;



CREATE TRIGGER trg_after_submission_update_streak
AFTER INSERT ON submissions
FOR EACH ROW
FOLLOWS trg_after_submission_insert
BEGIN
    DECLARE v_today_count     INT DEFAULT 0;
    DECLARE v_yesterday_count INT DEFAULT 0;
    DECLARE v_current_streak  INT DEFAULT 0;

    -- Only process accepted submissions
    IF NEW.status = 'Accepted' THEN

        -- Has the user already submitted an accepted solution TODAY
        -- (excluding this very submission)?
        SELECT COUNT(*) INTO v_today_count
        FROM submissions
        WHERE user_id    = NEW.user_id
          AND status     = 'Accepted'
          AND DATE(submitted_at) = DATE(NEW.submitted_at)
          AND submission_id <> NEW.submission_id;

        -- If this is the FIRST accepted submission today, update streak
        IF v_today_count = 0 THEN

            -- Did the user have an accepted submission YESTERDAY?
            SELECT COUNT(*) INTO v_yesterday_count
            FROM submissions
            WHERE user_id    = NEW.user_id
              AND status     = 'Accepted'
              AND DATE(submitted_at) = DATE(NEW.submitted_at) - INTERVAL 1 DAY;

            IF v_yesterday_count > 0 THEN
                -- Continue the streak
                UPDATE users
                SET current_streak = current_streak + 1,
                    max_streak     = GREATEST(max_streak, current_streak + 1)
                WHERE user_id = NEW.user_id;
            ELSE
                -- Start a new streak
                UPDATE users
                SET current_streak = 1,
                    max_streak     = GREATEST(max_streak, 1)
                WHERE user_id = NEW.user_id;
            END IF;
        END IF;
    END IF;
END;




-- ─────────────────────────────────────────────────────────────────────────────
-- TRIGGER 3 : trg_after_problem_insert
-- Fires   : AFTER INSERT on `problems`
-- Purpose : Keeps topics.total_problems in sync when a new problem is added.
-- ─────────────────────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS trg_after_problem_insert;



CREATE TRIGGER trg_after_problem_insert
AFTER INSERT ON problems
FOR EACH ROW
BEGIN
    -- Only increment if the problem actually belongs to a topic
    IF NEW.topic_id IS NOT NULL THEN
        UPDATE topics
        SET total_problems = total_problems + 1
        WHERE topic_id = NEW.topic_id;
    END IF;
END;



-- =============================================================================
-- End of triggers.sql
-- =============================================================================
