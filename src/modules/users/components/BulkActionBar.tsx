import { useTranslation } from 'react-i18next';

interface BulkActionBarProps {
  count: number;
  onDelete: () => void;
  onClear: () => void;
}

export function BulkActionBar({ count, onDelete, onClear }: BulkActionBarProps) {
  const { t } = useTranslation();
  if (count === 0) return null;

  return (
    <div className="mb-3 flex items-center justify-between rounded-lg bg-accent-subtle px-4 py-2 text-sm">
      <span className="font-medium text-accent">{t('users.selectedCount', { count })}</span>
      <div className="flex gap-2">
        <button
          onClick={onDelete}
          className="rounded-md px-2 py-1 font-medium text-danger hover:bg-danger-subtle focus-visible:outline-2 focus-visible:outline-accent"
        >
          {t('users.deleteSelected')}
        </button>
        <button
          onClick={onClear}
          className="rounded-md px-2 py-1 font-medium text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-accent"
        >
          {t('users.clearSelection')}
        </button>
      </div>
    </div>
  );
}
