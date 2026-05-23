import { Loader2 } from 'lucide-react';

/**
 * Animated loading spinner with optional label
 */
export default function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 animate-fade-in">
      <Loader2 className={`${sizes[size]} text-emerald-500 animate-spin`} />
      {label && <p className="text-sm text-dark-400">{label}</p>}
    </div>
  );
}

/**
 * Skeleton loader — a shimmering placeholder block
 */
export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

/**
 * Card skeleton — mimics a stat card during loading
 */
export function CardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

/**
 * Table row skeleton
 */
export function RowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
