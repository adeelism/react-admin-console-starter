import { useTranslation } from 'react-i18next';
import { useAuditLog } from '../../audit-log/hooks';
import { formatRelativeTime } from '../../../lib/formatRelativeTime';
import { Skeleton } from '../../../components/atoms/Skeleton';

const VERB_KEY: Record<string, string> = {
  'user.created': 'auditLog.verbCreated',
  'user.updated': 'auditLog.verbUpdated',
  'user.deleted': 'auditLog.verbDeleted',
};

export function RecentActivity() {
  const { t } = useTranslation();
  const { data, isLoading } = useAuditLog({ action: '', actor: '' });
  const entries = (data ?? []).slice(0, 5);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-sm font-semibold text-text">{t('dashboard.recentActivity')}</h2>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted">{t('auditLog.empty')}</p>
      ) : (
        <ul className="divide-y divide-border">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="min-w-0 truncate text-text">
                <span className="font-medium">{entry.actor}</span>{' '}
                <span className="text-muted">
                  {VERB_KEY[entry.action] ? t(VERB_KEY[entry.action]) : entry.action}
                </span>{' '}
                <span className="font-medium">{entry.target}</span>
              </span>
              <span className="shrink-0 text-xs text-faint">
                {formatRelativeTime(entry.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
