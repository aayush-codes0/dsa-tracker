import { getDifficultyColor } from '../../utils/helpers';

/**
 * Color-coded difficulty pill: Easy = emerald, Medium = amber, Hard = rose
 */
export default function DifficultyBadge({ difficulty }) {
  const { text, bg } = getDifficultyColor(difficulty);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${text} ${bg}`}>
      {difficulty}
    </span>
  );
}
