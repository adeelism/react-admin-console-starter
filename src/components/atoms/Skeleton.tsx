import clsx from 'clsx';

/** A shimmering placeholder block. The pulse is disabled under prefers-reduced-motion. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded bg-surface-2', className)} aria-hidden />;
}
