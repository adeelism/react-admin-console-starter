interface ErrorStateProps {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-[color-mix(in_srgb,var(--color-danger)_30%,transparent)] bg-danger-subtle p-10 text-center"
    >
      <p className="font-medium text-danger">{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-4 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-text hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
