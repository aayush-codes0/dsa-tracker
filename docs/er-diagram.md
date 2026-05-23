# DSA Tracker — ER Diagram Description

This document describes the Entity-Relationship structure for the DSA Tracker database. It uses a 10-table normalized schema.

## Entities and Attributes

1.  **USERS**
    *   `user_id` (PK)
    *   `username` (UNIQUE)
    *   `email` (UNIQUE)
    *   `password_hash`
    *   `full_name`
    *   `avatar_url`
    *   `role` (ENUM: 'user', 'admin')
    *   `current_streak`
    *   `max_streak`
    *   `total_solved`
    *   `joined_date`

2.  **TOPICS**
    *   `topic_id` (PK)
    *   `topic_name` (UNIQUE)
    *   `icon`
    *   `color_hex`
    *   `description`
    *   `total_problems`

3.  **PROBLEMS**
    *   `problem_id` (PK)
    *   `title`
    *   `platform`
    *   `difficulty` (ENUM: 'Easy', 'Medium', 'Hard')
    *   `topic_id` (FK -> TOPICS)
    *   `problem_url`
    *   `time_complexity`
    *   `space_complexity`
    *   `estimated_time`
    *   `tags`
    *   `is_favorite`
    *   `is_bookmarked`
    *   `date_added`

4.  **SUBMISSIONS**
    *   `submission_id` (PK)
    *   `user_id` (FK -> USERS)
    *   `problem_id` (FK -> PROBLEMS)
    *   `status` (ENUM: 'Accepted', 'Wrong Answer', 'TLE', 'Runtime Error', 'MLE')
    *   `time_taken_min`
    *   `approach_used`
    *   `language_used`
    *   `attempts`
    *   `confidence`
    *   `submitted_at`

5.  **CONTESTS**
    *   `contest_id` (PK)
    *   `user_id` (FK -> USERS)
    *   `contest_name`
    *   `platform`
    *   `rank_achieved`
    *   `score`
    *   `total_problems`
    *   `solved_count`
    *   `contest_date`
    *   `contest_url`
    *   `created_at`

6.  **PROGRESS**
    *   `progress_id` (PK)
    *   `user_id` (FK -> USERS)
    *   `topic_id` (FK -> TOPICS)
    *   `solved_count`
    *   `total_count`
    *   `percentage`
    *   `last_practiced`

7.  **NOTES**
    *   `note_id` (PK)
    *   `user_id` (FK -> USERS)
    *   `problem_id` (FK -> PROBLEMS)
    *   `content`
    *   `key_insight`
    *   `approach`
    *   `created_at`
    *   `updated_at`

8.  **USER_STATS**
    *   `stat_id` (PK)
    *   `user_id` (FK -> USERS)
    *   `stat_date`
    *   `problems_solved`
    *   `time_spent_min`
    *   `submissions_count`

9.  **BADGES**
    *   `badge_id` (PK)
    *   `badge_name` (UNIQUE)
    *   `description`
    *   `icon`
    *   `criteria`
    *   `badge_type` (ENUM: 'streak', 'problems', 'contest', 'topic')

10. **ACHIEVEMENTS**
    *   `achievement_id` (PK)
    *   `user_id` (FK -> USERS)
    *   `badge_id` (FK -> BADGES)
    *   `earned_at`

## Relationships Overview

*   **USERS (1) -> (N) SUBMISSIONS** (A user can make many submissions)
*   **PROBLEMS (1) -> (N) SUBMISSIONS** (A problem can have many submissions)
*   **TOPICS (1) -> (N) PROBLEMS** (A topic contains many problems)
*   **USERS (1) -> (N) CONTESTS** (A user can participate in many contests)
*   **USERS (1) -> (N) NOTES** (A user can write many notes)
*   **PROBLEMS (1) -> (N) NOTES** (A problem can have many notes)
*   **USERS (1) -> (N) USER_STATS** (A user has many daily stats)
*   **USERS (1) -> (N) PROGRESS** (A user has progress records for many topics)
*   **TOPICS (1) -> (N) PROGRESS** (A topic has progress records from many users)
*   **USERS (M) -> (N) BADGES** (via ACHIEVEMENTS junction table)
