# DSA Tracker — Relationships Documentation

This document explains the relationships between the entities in the DSA Tracker database, including foreign keys and cascade behaviors.

## 1:N Relationships

1.  **TOPICS (1) to PROBLEMS (N)**
    *   **Description:** A single topic (like "Arrays") contains multiple problems.
    *   **Foreign Key:** `problems.topic_id` references `topics.topic_id`.
    *   **Behavior:** `ON DELETE SET NULL`. If a topic is deleted, the problems remain but their `topic_id` becomes NULL.

2.  **USERS (1) to SUBMISSIONS (N)**
    *   **Description:** A single user can make multiple submissions.
    *   **Foreign Key:** `submissions.user_id` references `users.user_id`.
    *   **Behavior:** `ON DELETE CASCADE`. If a user is deleted, all their submissions are deleted.

3.  **PROBLEMS (1) to SUBMISSIONS (N)**
    *   **Description:** A single problem can have multiple submissions (from different users or multiple attempts by the same user).
    *   **Foreign Key:** `submissions.problem_id` references `problems.problem_id`.
    *   **Behavior:** `ON DELETE CASCADE`. If a problem is deleted, all submissions for that problem are deleted.

4.  **USERS (1) to CONTESTS (N)**
    *   **Description:** A user can record participation in multiple contests.
    *   **Foreign Key:** `contests.user_id` references `users.user_id`.
    *   **Behavior:** `ON DELETE CASCADE`.

5.  **USERS (1) to NOTES (N)**
    *   **Description:** A user can write multiple notes.
    *   **Foreign Key:** `notes.user_id` references `users.user_id`.
    *   **Behavior:** `ON DELETE CASCADE`.

6.  **PROBLEMS (1) to NOTES (N)**
    *   **Description:** A problem can have multiple notes attached to it (by different users).
    *   **Foreign Key:** `notes.problem_id` references `problems.problem_id`.
    *   **Behavior:** `ON DELETE CASCADE`.

7.  **USERS (1) to USER_STATS (N)**
    *   **Description:** A user has a daily stats record for each day they are active.
    *   **Foreign Key:** `user_stats.user_id` references `users.user_id`.
    *   **Behavior:** `ON DELETE CASCADE`.

## M:N Relationships (Resolved via Junction Tables)

8.  **USERS and TOPICS (M:N) via PROGRESS**
    *   **Description:** A user has progress across multiple topics, and a topic tracks progress for multiple users.
    *   **Junction Table:** `progress`.
    *   **Foreign Keys:**
        *   `progress.user_id` references `users.user_id` (`ON DELETE CASCADE`).
        *   `progress.topic_id` references `topics.topic_id` (`ON DELETE CASCADE`).
    *   **Constraint:** `UNIQUE KEY (user_id, topic_id)` ensures only one progress record per user per topic.

9.  **USERS and BADGES (M:N) via ACHIEVEMENTS**
    *   **Description:** A user can earn multiple badges, and a badge can be earned by multiple users.
    *   **Junction Table:** `achievements`.
    *   **Foreign Keys:**
        *   `achievements.user_id` references `users.user_id` (`ON DELETE CASCADE`).
        *   `achievements.badge_id` references `badges.badge_id` (`ON DELETE CASCADE`).
    *   **Constraint:** `UNIQUE KEY (user_id, badge_id)` ensures a user only earns a specific badge once.
