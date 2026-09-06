import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable, type Column } from '../../../components/organisms/DataTable';
import { Input } from '../../../components/atoms/Input';
import { Spinner } from '../../../components/atoms/Spinner';
import { useAuditLog } from '../hooks';
import type { AuditLogEntry } from '../types';

export default function AuditLogPage() {
  const { t } = useTranslation();
  const [action, setAction] = useState('');
  const { data, isLoading, isError } = useAuditLog(action);

  const columns: Column<AuditLogEntry>[] = [
    { key: 'actor', header: t('auditLog.actor'), render: (entry) => entry.actor },
    { key: 'action', header: t('auditLog.action'), render: (entry) => entry.action },
    { key: 'target', header: t('auditLog.target'), render: (entry) => entry.target },
    {
      key: 'time',
      header: t('auditLog.time'),
      render: (entry) => new Date(entry.createdAt).toLocaleString(),
    },
  ];

  return (
    <section>
      <h1>{t('auditLog.title')}</h1>
      <Input
        aria-label={t('auditLog.filter')}
        placeholder={t('auditLog.filter')}
        value={action}
        onChange={(event) => setAction(event.target.value)}
      />
      {isLoading ? (
        <Spinner label={t('common.loading')} />
      ) : isError ? (
        <p role="alert">{t('common.error')}</p>
      ) : (
        <DataTable
          columns={columns}
          rows={data ?? []}
          rowKey={(entry) => entry.id}
          emptyLabel={t('auditLog.empty')}
        />
      )}
    </section>
  );
}
