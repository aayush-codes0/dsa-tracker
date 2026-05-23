# DSA Tracker — API Routes Documentation

Base URL: `http://localhost:5000/api`

Authentication: Bearer Token required for protected routes.

## Auth (`/api/auth`)

*   `POST /signup`: Register a new user. Body: `{username, email, password, full_name}`. Returns JWT.
*   `POST /login`: Authenticate user. Body: `{email, password}`. Returns JWT.
*   `GET /me`: (Auth) Get current user profile.
*   `PUT /me`: (Auth) Update profile. Body: `{full_name, avatar_url}`.

## Problems (`/api/problems`)

*   `GET /`: List problems. Query Params: `topic_id`, `difficulty`, `platform`, `search`, `page`, `limit`.
*   `GET /:id`: Get single problem details.
*   `POST /`: (Admin) Create a problem.
*   `PUT /:id`: (Admin) Update a problem.
*   `DELETE /:id`: (Admin) Delete a problem.
*   `PUT /:id/bookmark`: (Auth) Toggle bookmark status.
*   `PUT /:id/favorite`: (Auth) Toggle favorite status.

## Submissions (`/api/submissions`)

*   `GET /`: (Auth) Get user submissions. Query Params: `problem_id`, `status`, `topic_id`.
*   `POST /`: (Auth) Create a submission. Body: `{problem_id, status, time_taken_min, approach_used, language_used, attempts, confidence}`.
*   `GET /recent`: (Auth) Get 10 most recent submissions.

## Topics (`/api/topics`)

*   `GET /`: List all topics.
*   `GET /:id`: Get topic by ID.
*   `POST /`: (Admin) Create topic.
*   `PUT /:id`: (Admin) Update topic.
*   `DELETE /:id`: (Admin) Delete topic.
*   `GET /:id/progress`: (Auth) Get user progress for topic.

## Contests (`/api/contests`)

*   `GET /`: (Auth) List user's contests.
*   `POST /`: (Auth) Add a contest record.
*   `PUT /:id`: (Auth) Update contest record.
*   `DELETE /:id`: (Auth) Delete contest record.

## Notes (`/api/notes`)

*   `GET /`: (Auth) List user's notes. Query param: `search`.
*   `GET /problem/:problemId`: (Auth) Get notes for a specific problem.
*   `POST /`: (Auth) Create note.
*   `PUT /:id`: (Auth) Update note.
*   `DELETE /:id`: (Auth) Delete note.

## Stats (`/api/stats`)

*   `GET /dashboard`: (Auth) Core dashboard stats.
*   `GET /heatmap`: (Auth) Daily activity array for heatmap.
*   `GET /topic-progress`: (Auth) Progress stats grouped by topic.
*   `GET /difficulty-distribution`: (Auth) Solved counts grouped by difficulty.
*   `GET /weekly-activity`: (Auth) Submission counts for last 7 days.
*   `GET /monthly-progress`: (Auth) Submission counts for last 12 months.

## Leaderboard (`/api/leaderboard`)

*   `GET /`: Publicly accessible leaderboard data.

## Admin (`/api/admin`)

*   `GET /users`: (Admin) List all users.
*   `DELETE /users/:id`: (Admin) Delete user.
*   `PUT /users/:id/role`: (Admin) Change user role.
*   `GET /stats`: (Admin) Platform-wide statistics.
