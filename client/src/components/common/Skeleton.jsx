import SkeletonLoader from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Skeleton({ count = 1, height, width, circle = false, className = '' }) {
  return (
    <SkeletonLoader
      count={count}
      height={height}
      width={width}
      circle={circle}
      baseColor="#1e293b" // slate-800
      highlightColor="#334155" // slate-700
      className={`rounded-xl ${className}`}
    />
  );
}
