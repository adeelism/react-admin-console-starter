import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../components/molecules/PageHeader';
import { Spinner } from '../../../components/atoms/Spinner';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { useAuditLog } from '../hooks';
import { AuditEntryItem } from '../components/AuditEntryItem';

const ACTIONS: { value: string; labelKey: string }[] = [
  { value: 'user.created', labelKey: 'auditLog.verbCreated' },
  { value: 'user.updated', labelKey: 'auditLog.verbUpdated' },
  { value: 'user.deleted', labelKey: 'auditLog.verbDeleted' },
];
const CONTROL =
  'rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus-visible:outline-2 focus-visible:outline-accent';

export default function AuditLogPage() {
  const { t } = useTranslation();
  const [action, setAction] = useState('');
  const [actor, setActor] = useState('');
  const { data, isLoading, isError, refetch } = useAuditLog({ action, actor });
  const entries = data ?? [];

  return (
    <section>
      <PageHeader title={t('auditLog.title')} description={t('auditLog.subtitle')} />

      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={action}
          onChange={(event) => setAction(event.target.value)}
          aria-label={t('auditLog.filter')}
          className={CONTROL}
        >
          <option value="">{t('auditLog.allActions')}</option>
          {ACTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {t(item.labelKey)}
            </option>
          ))}
        </select>
        <input
          type="search"
          value={actor}
          onChange={(event) => setActor(event.target.value)}
          aria-label={t('auditLog.filterActor')}
          placeholder={t('auditLog.filterActor')}
          className={CONTROL}
        />
      </div>

      {isLoading ? (
        <Spinner label={t('common.loading')} />
      ) : isError ? (
        <ErrorState
          message={t('common.error')}
          retryLabel={t('common.retry')}
          onRetry={() => void refetch()}
        />
      ) : entries.length === 0 ? (
        <EmptyState title={t('auditLog.empty')} />
      ) : (
        <ol className="rounded-lg border border-border bg-card px-4">
          {entries.map((entry) => (
            <AuditEntryItem key={entry.id} entry={entry} />
          ))}
        </ol>
      )}
    </section>
  );
}
