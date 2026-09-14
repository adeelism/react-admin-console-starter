import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-10 text-center">
      <p className="font-medium text-text">{title}</p>
      {message ? <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{message}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
