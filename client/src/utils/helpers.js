/**
 * Format a date string to a readable format
 * @param {string|Date} date
 * @returns {string} e.g. "Jan 15, 2025"
 */
export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get relative time string from a date
 * @param {string|Date} date
 * @returns {string} e.g. "2 hours ago"
 */
export function timeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

/**
 * Get Tailwind color classes for a difficulty level
 */
export function getDifficultyColor(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return { text: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
    case 'medium':
      return { text: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
    case 'hard':
      return { text: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
    default:
      return { text: 'text-dark-400', bg: 'bg-dark-700', border: 'border-dark-600' };
  }
}

/**
 * Get color for submission status
 */
export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'accepted':
      return { text: 'text-emerald-400', bg: 'bg-emerald-500/15' };
    case 'wrong answer':
      return { text: 'text-rose-400', bg: 'bg-rose-500/15' };
    case 'time limit exceeded':
    case 'tle':
      return { text: 'text-amber-400', bg: 'bg-amber-500/15' };
    case 'runtime error':
      return { text: 'text-red-400', bg: 'bg-red-500/15' };
    case 'memory limit exceeded':
    case 'mle':
      return { text: 'text-purple-400', bg: 'bg-purple-500/15' };
    default:
      return { text: 'text-dark-400', bg: 'bg-dark-700' };
  }
}

/**
 * Truncate text to a max length
 */
export function truncate(str, maxLen = 50) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

/**
 * Debounce a function
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
