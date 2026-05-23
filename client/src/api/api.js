import api from './axios';

// ─── Auth ────────────────────────────────────────────
export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (username, email, password, full_name) =>
    api.post('/auth/signup', { username, email, password, full_name }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ─── Problems ────────────────────────────────────────
export const problems = {
  getAll: (params) => api.get('/problems', { params }),
  getById: (id) => api.get(`/problems/${id}`),
  create: (data) => api.post('/problems', data),
  update: (id, data) => api.put(`/problems/${id}`, data),
  delete: (id) => api.delete(`/problems/${id}`),
  toggleBookmark: (id) => api.put(`/problems/${id}/bookmark`),
  toggleFavorite: (id) => api.put(`/problems/${id}/favorite`),
};

// ─── Submissions ─────────────────────────────────────
export const submissions = {
  getAll: (params) => api.get('/submissions', { params }),
  create: (data) => api.post('/submissions', data),
  getRecent: () => api.get('/submissions/recent'),
};

// ─── Topics ──────────────────────────────────────────
export const topics = {
  getAll: () => api.get('/topics'),
  getById: (id) => api.get(`/topics/${id}`),
  getProgress: (id) => api.get(`/topics/${id}/progress`),
};

// ─── Contests ────────────────────────────────────────
export const contests = {
  getAll: () => api.get('/contests'),
  create: (data) => api.post('/contests', data),
  update: (id, data) => api.put(`/contests/${id}`, data),
  delete: (id) => api.delete(`/contests/${id}`),
};

// ─── Notes ───────────────────────────────────────────
export const notes = {
  getAll: (search) => api.get('/notes', { params: { search } }),
  getByProblem: (problemId) => api.get(`/notes/problem/${problemId}`),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
};

// ─── Stats ───────────────────────────────────────────
export const stats = {
  getDashboard: () => api.get('/stats/dashboard'),
  getHeatmap: () => api.get('/stats/heatmap'),
  getTopicProgress: () => api.get('/stats/topic-progress'),
  getDifficultyDistribution: () => api.get('/stats/difficulty-distribution'),
  getWeeklyActivity: () => api.get('/stats/weekly-activity'),
  getMonthlyProgress: () => api.get('/stats/monthly-progress'),
};

// ─── Leaderboard ─────────────────────────────────────
export const leaderboard = {
  getAll: () => api.get('/leaderboard'),
};

// ─── Sheets ──────────────────────────────────────────
export const sheets = {
  getAll: () => api.get('/sheets'),
  getById: (id) => api.get(`/sheets/${id}`),
};

// ─── Companies ───────────────────────────────────────
export const companies = {
  getAll: () => api.get('/companies'),
};

// ─── Revisions ───────────────────────────────────────
export const revisions = {
  getPending: () => api.get('/revisions'),
  add: (problem_id) => api.post('/revisions', { problem_id }),
  complete: (id) => api.put(`/revisions/${id}/complete`),
};

// ─── Admin ───────────────────────────────────────────
export const admin = {
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  changeRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  getStats: () => api.get('/admin/stats'),
};

// ─── Phase 4 Additions ───────────────────────────────

export const ai = {
  summarize: (notes) => api.post('/ai/summarize', { notes }),
};

export const friends = {
  getLeaderboard: () => api.get('/friends/leaderboard'),
};

export const dailyChallenge = {
  getToday: () => api.get('/daily-challenge/today'),
};
