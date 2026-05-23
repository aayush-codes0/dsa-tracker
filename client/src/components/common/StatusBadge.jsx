import { getStatusColor } from '../../utils/helpers';

/**
 * Submission status badge with color coding
 */
export default function StatusBadge({ status }) {
  const { text, bg } = getStatusColor(status);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${text} ${bg}`}>
      {status}
    </span>
  );
}
