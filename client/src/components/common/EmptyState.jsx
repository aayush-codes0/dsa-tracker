import { Inbox } from 'lucide-react';

/**
 * Empty state display with icon, message, and optional action
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data found',
  message = 'There is nothing here yet.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-dark-500" />
      </div>
      <h3 className="text-lg font-semibold text-dark-200 mb-1">{title}</h3>
      <p className="text-sm text-dark-400 text-center max-w-sm mb-4">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
