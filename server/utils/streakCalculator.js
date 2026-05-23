// ─── Streak Calculator ──────────────────────────────────────────────────────
// Queries the user_stats table to find consecutive days (counting back from
// today) where the user solved at least one problem. Returns both the current
// streak and the all-time maximum streak.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the current and maximum streak for a user.
 *
 * @param {number} userId  – The user's ID
 * @param {object} pool    – mysql2/promise pool
 * @returns {{ currentStreak: number, maxStreak: number }}
 */
export async function calculateStreak(userId, pool) {
  // Fetch all dates where the user solved at least one problem, ordered DESC
  const [rows] = await pool.query(
    `SELECT stat_date
     FROM user_stats
     WHERE user_id = ? AND problems_solved > 0
     ORDER BY stat_date DESC`,
    [userId]
  );

  if (rows.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  let currentStreak = 0;
  let maxStreak = 0;
  let streak = 0;

  // Normalise today to midnight UTC for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build a Set of date strings for O(1) lookup
  const dateSet = new Set(
    rows.map((r) => {
      const d = new Date(r.stat_date);
      d.setHours(0, 0, 0, 0);
      return d.toISOString().slice(0, 10);
    })
  );

  // Walk backwards from today to find current streak
  const checkDate = new Date(today);
  while (true) {
    const key = checkDate.toISOString().slice(0, 10);
    if (dateSet.has(key)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Walk through all dates to find max streak
  // Sort dates ascending for this calculation
  const sortedDates = [...dateSet].sort();
  streak = 1;
  maxStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak++;
      if (streak > maxStreak) maxStreak = streak;
    } else {
      streak = 1;
    }
  }

  // Edge case: if only one day exists
  if (sortedDates.length === 1) {
    maxStreak = 1;
  }

  // Ensure maxStreak is at least as large as currentStreak
  if (currentStreak > maxStreak) {
    maxStreak = currentStreak;
  }

  return { currentStreak, maxStreak };
}
