-- =============================================================================
-- DSA TRACKER — Database Schema (MySQL 8)
-- File   : schema.sql
-- Purpose: Creates the `dsa_tracker` database and all 10 tables in 3NF.
-- Author : Auto-generated for DSA Tracker Project
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. Create & select the database
-- ─────────────────────────────────────────────────────────────────────────────
DROP DATABASE IF EXISTS dsa_tracker;
CREATE DATABASE dsa_tracker
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE dsa_tracker;

-- =============================================================================
-- TABLE 1 : users
-- Stores registered user accounts and top-level stats (streak, total_solved).
-- =============================================================================
CREATE TABLE users (
    user_id        INT            AUTO_INCREMENT PRIMARY KEY,
    username       VARCHAR(50)    NOT NULL UNIQUE       COMMENT 'Login handle – must be unique',
    email          VARCHAR(100)   NOT NULL UNIQUE       COMMENT 'Email address – must be unique',
    password_hash  VARCHAR(255)   NOT NULL              COMMENT 'Bcrypt-hashed password',
    full_name      VARCHAR(100)                         COMMENT 'Display name',
    avatar_url     VARCHAR(255)                         COMMENT 'URL to profile picture',
    role           ENUM('user', 'admin') DEFAULT 'user' COMMENT 'Authorization role',
    current_streak INT            DEFAULT 0             COMMENT 'Current consecutive-day streak',
    max_streak     INT            DEFAULT 0             COMMENT 'All-time longest streak',
    total_solved   INT            DEFAULT 0             COMMENT 'Total distinct problems solved',
    joined_date    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation timestamp'
) ENGINE=InnoDB COMMENT='Registered user accounts';


-- =============================================================================
-- TABLE 2 : topics
-- Master list of DSA topics (Arrays, Graphs, DP, etc.).
-- =============================================================================
CREATE TABLE topics (
    topic_id       INT            AUTO_INCREMENT PRIMARY KEY,
    topic_name     VARCHAR(50)    NOT NULL UNIQUE       COMMENT 'Human-readable topic label',
    icon           VARCHAR(50)                          COMMENT 'Emoji or icon identifier',
    color_hex      VARCHAR(7)                           COMMENT 'Hex colour for UI (#RRGGBB)',
    description    TEXT                                 COMMENT 'Brief topic explanation',
    total_problems INT            DEFAULT 0             COMMENT 'Cached count of problems in topic'
) ENGINE=InnoDB COMMENT='DSA topic categories';


-- =============================================================================
-- TABLE 3 : problems
-- Every DSA problem tracked in the app, linked to one topic.
-- =============================================================================
CREATE TABLE problems (
    problem_id       INT            AUTO_INCREMENT PRIMARY KEY,
    title            VARCHAR(200)   NOT NULL              COMMENT 'Problem title (e.g. "Two Sum")',
    platform         VARCHAR(50)                          COMMENT 'Source platform (LeetCode, GFG, …)',
    difficulty       ENUM('Easy', 'Medium', 'Hard') NOT NULL COMMENT 'Difficulty tier',
    topic_id         INT                                  COMMENT 'FK → topics.topic_id',
    problem_url      VARCHAR(500)                         COMMENT 'Direct link to the problem',
    time_complexity  VARCHAR(50)                          COMMENT 'Expected optimal time complexity',
    space_complexity VARCHAR(50)                          COMMENT 'Expected optimal space complexity',
    estimated_time   INT                                  COMMENT 'Estimated solving time in minutes',
    tags             VARCHAR(300)                         COMMENT 'Comma-separated technique tags',
    is_favorite      BOOLEAN        DEFAULT FALSE         COMMENT 'User-flagged as favourite',
    is_bookmarked    BOOLEAN        DEFAULT FALSE         COMMENT 'User-flagged as bookmarked',
    date_added       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP COMMENT 'When the problem was added',

    -- Foreign key: if a topic is deleted, keep the problem but null out topic_id
    CONSTRAINT fk_problems_topic
        FOREIGN KEY (topic_id) REFERENCES topics (topic_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='DSA problems from various platforms';


-- =============================================================================
-- TABLE 4 : submissions
-- Each attempt a user makes on a problem is recorded here.
-- =============================================================================
CREATE TABLE submissions (
    submission_id  INT            AUTO_INCREMENT PRIMARY KEY,
    user_id        INT            NOT NULL               COMMENT 'FK → users.user_id',
    problem_id     INT            NOT NULL               COMMENT 'FK → problems.problem_id',
    status         ENUM('Accepted', 'Wrong Answer', 'TLE', 'Runtime Error', 'MLE')
                                  NOT NULL               COMMENT 'Verdict of the submission',
    time_taken_min INT                                   COMMENT 'Time the user spent (minutes)',
    approach_used  VARCHAR(200)                          COMMENT 'Approach / algorithm used',
    language_used  VARCHAR(30)                           COMMENT 'Programming language',
    attempts       INT            DEFAULT 1              COMMENT 'Attempt number for this problem',
    confidence     TINYINT                               COMMENT 'Self-rated confidence 1–5',
    submitted_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP COMMENT 'Submission timestamp',

    -- Confidence must be between 1 and 5 (inclusive)
    CONSTRAINT chk_confidence CHECK (confidence BETWEEN 1 AND 5),

    -- Foreign keys
    CONSTRAINT fk_submissions_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_submissions_problem
        FOREIGN KEY (problem_id) REFERENCES problems (problem_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='User submission attempts on problems';


-- =============================================================================
-- TABLE 5 : contests
-- Competitive-programming contests a user participated in.
-- =============================================================================
CREATE TABLE contests (
    contest_id     INT            AUTO_INCREMENT PRIMARY KEY,
    user_id        INT            NOT NULL               COMMENT 'FK → users.user_id',
    contest_name   VARCHAR(200)   NOT NULL               COMMENT 'Name of the contest',
    platform       VARCHAR(50)                           COMMENT 'Platform hosting the contest',
    rank_achieved  INT                                   COMMENT 'Rank the user achieved',
    score          INT                                   COMMENT 'Score obtained',
    total_problems INT                                   COMMENT 'Total problems in the contest',
    solved_count   INT                                   COMMENT 'Problems the user solved',
    contest_date   DATE                                  COMMENT 'Date of the contest',
    contest_url    VARCHAR(500)                          COMMENT 'Link to the contest page',
    created_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation time',

    CONSTRAINT fk_contests_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Competitive-programming contest records';


-- =============================================================================
-- TABLE 6 : progress
-- Per-user, per-topic progress tracker (how many solved out of total).
-- A composite UNIQUE key prevents duplicate (user, topic) rows.
-- =============================================================================
CREATE TABLE progress (
    progress_id    INT            AUTO_INCREMENT PRIMARY KEY,
    user_id        INT            NOT NULL               COMMENT 'FK → users.user_id',
    topic_id       INT            NOT NULL               COMMENT 'FK → topics.topic_id',
    solved_count   INT            DEFAULT 0              COMMENT 'Problems solved in this topic',
    total_count    INT            DEFAULT 0              COMMENT 'Total problems in this topic',
    percentage     DECIMAL(5, 2)  DEFAULT 0.00           COMMENT 'Completion percentage',
    last_practiced TIMESTAMP      NULL                   COMMENT 'Last time user practised this topic',

    -- Each user can have only one progress row per topic
    UNIQUE KEY uq_user_topic (user_id, topic_id),

    CONSTRAINT fk_progress_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_progress_topic
        FOREIGN KEY (topic_id) REFERENCES topics (topic_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Per-user per-topic progress tracking';


-- =============================================================================
-- TABLE 7 : notes
-- Personal notes a user attaches to a specific problem.
-- =============================================================================
CREATE TABLE notes (
    note_id      INT            AUTO_INCREMENT PRIMARY KEY,
    user_id      INT            NOT NULL               COMMENT 'FK → users.user_id',
    problem_id   INT            NOT NULL               COMMENT 'FK → problems.problem_id',
    content      TEXT           NOT NULL               COMMENT 'Free-form note body (Markdown OK)',
    key_insight  VARCHAR(500)                          COMMENT 'TL;DR insight in one line',
    approach     TEXT                                  COMMENT 'Detailed approach / algorithm notes',
    created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP COMMENT 'Note creation time',
    updated_at   TIMESTAMP      NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last edit time',

    CONSTRAINT fk_notes_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_notes_problem
        FOREIGN KEY (problem_id) REFERENCES problems (problem_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='User notes linked to specific problems';


-- =============================================================================
-- TABLE 8 : user_stats
-- Daily aggregated statistics for each user (problems solved, time spent, etc.).
-- =============================================================================
CREATE TABLE user_stats (
    stat_id           INT       AUTO_INCREMENT PRIMARY KEY,
    user_id           INT       NOT NULL               COMMENT 'FK → users.user_id',
    stat_date         DATE      NOT NULL               COMMENT 'Calendar date for these stats',
    problems_solved   INT       DEFAULT 0              COMMENT 'Problems solved that day',
    time_spent_min    INT       DEFAULT 0              COMMENT 'Total minutes spent that day',
    submissions_count INT       DEFAULT 0              COMMENT 'Total submission attempts that day',

    -- One stats row per user per day
    UNIQUE KEY uq_user_date (user_id, stat_date),

    CONSTRAINT fk_user_stats_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Daily per-user activity statistics';


-- =============================================================================
-- TABLE 9 : badges
-- Master catalogue of earnable badges / achievements.
-- =============================================================================
CREATE TABLE badges (
    badge_id    INT            AUTO_INCREMENT PRIMARY KEY,
    badge_name  VARCHAR(100)   NOT NULL UNIQUE         COMMENT 'Badge display name',
    description VARCHAR(300)                           COMMENT 'What the badge is for',
    icon        VARCHAR(50)                            COMMENT 'Emoji or icon identifier',
    criteria    VARCHAR(200)                           COMMENT 'Machine-readable criteria expression',
    badge_type  ENUM('streak', 'problems', 'contest', 'topic')
                               NOT NULL               COMMENT 'Category of the badge'
) ENGINE=InnoDB COMMENT='Earnable badges and achievements catalogue';


-- =============================================================================
-- TABLE 10 : achievements
-- Join table tracking which badges each user has earned.
-- =============================================================================
CREATE TABLE achievements (
    achievement_id INT        AUTO_INCREMENT PRIMARY KEY,
    user_id        INT        NOT NULL                 COMMENT 'FK → users.user_id',
    badge_id       INT        NOT NULL                 COMMENT 'FK → badges.badge_id',
    earned_at      TIMESTAMP  DEFAULT CURRENT_TIMESTAMP COMMENT 'When the badge was earned',

    -- A user can earn each badge only once
    UNIQUE KEY uq_user_badge (user_id, badge_id),

    CONSTRAINT fk_achievements_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_achievements_badge
        FOREIGN KEY (badge_id) REFERENCES badges (badge_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Badges earned by users';


-- =============================================================================
-- TABLE 11 : sheets
-- Predefined problem lists (e.g., Blind 75, Striver A2Z)
-- =============================================================================
CREATE TABLE sheets (
    sheet_id    INT            AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)   NOT NULL UNIQUE,
    description TEXT,
    icon        VARCHAR(50)
) ENGINE=InnoDB COMMENT='Predefined problem collections';

-- =============================================================================
-- TABLE 12 : sheet_problems
-- M:N relationship mapping problems to sheets
-- =============================================================================
CREATE TABLE sheet_problems (
    sheet_id    INT NOT NULL,
    problem_id  INT NOT NULL,
    PRIMARY KEY (sheet_id, problem_id),
    CONSTRAINT fk_sheet_problems_sheet FOREIGN KEY (sheet_id) REFERENCES sheets(sheet_id) ON DELETE CASCADE,
    CONSTRAINT fk_sheet_problems_problem FOREIGN KEY (problem_id) REFERENCES problems(problem_id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Mapping problems to sheets';

-- =============================================================================
-- TABLE 13 : sheet_progress
-- User progress on specific sheets
-- =============================================================================
CREATE TABLE sheet_progress (
    user_id      INT NOT NULL,
    sheet_id     INT NOT NULL,
    solved_count INT DEFAULT 0,
    PRIMARY KEY (user_id, sheet_id),
    CONSTRAINT fk_sheet_progress_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_sheet_progress_sheet FOREIGN KEY (sheet_id) REFERENCES sheets(sheet_id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='User completion progress per sheet';

-- =============================================================================
-- TABLE 14 : user_bookmarks
-- M:N relationship tracking which problems a user has bookmarked
-- =============================================================================
CREATE TABLE user_bookmarks (
    user_id     INT NOT NULL,
    problem_id  INT NOT NULL,
    added_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, problem_id),
    CONSTRAINT fk_user_bookmarks_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_bookmarks_problem FOREIGN KEY (problem_id) REFERENCES problems(problem_id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='User personal bookmarks';

-- =============================================================================
-- TABLE 15 : companies
-- Tech companies (Google, Amazon, etc.)
-- =============================================================================
CREATE TABLE companies (
    company_id INT            AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)   NOT NULL UNIQUE
) ENGINE=InnoDB COMMENT='Tech companies for problem tagging';

-- =============================================================================
-- TABLE 16 : problem_companies
-- M:N relationship mapping problems to companies
-- =============================================================================
CREATE TABLE problem_companies (
    problem_id INT NOT NULL,
    company_id INT NOT NULL,
    PRIMARY KEY (problem_id, company_id),
    CONSTRAINT fk_problem_companies_problem FOREIGN KEY (problem_id) REFERENCES problems(problem_id) ON DELETE CASCADE,
    CONSTRAINT fk_problem_companies_company FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Mapping problems to companies';

-- =============================================================================
-- TABLE 17 : revision_schedules
-- Spaced repetition scheduler (Day 1, 3, 7, 30)
-- =============================================================================
CREATE TABLE revision_schedules (
    revision_id        INT AUTO_INCREMENT PRIMARY KEY,
    user_id            INT NOT NULL,
    problem_id         INT NOT NULL,
    revision_level     INT DEFAULT 1 COMMENT '1=Day1, 2=Day3, 3=Day7, 4=Day30',
    next_revision_date DATE NOT NULL,
    completed          BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_revision_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_revision_problem FOREIGN KEY (problem_id) REFERENCES problems(problem_id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_problem_rev (user_id, problem_id)
) ENGINE=InnoDB COMMENT='Spaced repetition schedules';

-- =============================================================================
-- INDEXES
-- Additional indexes to speed up the most common query patterns.
-- =============================================================================

-- Speed up "get user's recent submissions" queries
CREATE INDEX idx_submissions_user_date
    ON submissions (user_id, submitted_at DESC);

-- Speed up "get all submissions for a problem" queries
CREATE INDEX idx_submissions_problem
    ON submissions (problem_id);

-- Speed up daily-stats lookups
CREATE INDEX idx_user_stats_user_date
    ON user_stats (user_id, stat_date);

-- Speed up progress lookups by user
CREATE INDEX idx_progress_user
    ON progress (user_id);

-- Speed up search on problems
CREATE INDEX idx_problems_search ON problems (title);
CREATE INDEX idx_problems_topic ON problems (topic_id);
CREATE INDEX idx_problems_diff ON problems (difficulty);

-- Speed up spaced repetition queries
CREATE INDEX idx_revisions_date ON revision_schedules (next_revision_date);

-- Speed up user problem lookups
CREATE INDEX idx_user_problem ON submissions (user_id, problem_id);
    
-- =============================================================================
-- End of schema.sql
-- =============================================================================
