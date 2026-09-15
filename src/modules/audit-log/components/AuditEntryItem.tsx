import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CaretRight, Clock, PencilSimple, Trash, UserPlus, type Icon } from '@phosphor-icons/react';
import clsx from 'clsx';
import { formatRelativeTime } from '../../../lib/formatRelativeTime';
import { formatDateTime } from '../../../lib/formatDateTime';
import { AuditSentence } from './AuditSentence';
import type { AuditLogEntry } from '../types';

const ACTION_META: Record<string, { icon: Icon; bg: string; fg: string }> = {
  'user.created': { icon: UserPlus, bg: 'bg-success-subtle', fg: 'text-success' },
  'user.updated': { icon: PencilSimple, bg: 'bg-info-subtle', fg: 'text-info' },
  'user.deleted': { icon: Trash, bg: 'bg-danger-subtle', fg: 'text-danger' },
};
const DEFAULT_META = { icon: Clock, bg: 'bg-surface-2', fg: 'text-muted' };

export function AuditEntryItem({ entry }: { entry: AuditLogEntry }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const meta = ACTION_META[entry.action] ?? DEFAULT_META;
  const IconComponent = meta.icon;
  const keys = Array.from(
    new Set([...Object.keys(entry.before ?? {}), ...Object.keys(entry.after ?? {})]),
  );
  const hasDetail = keys.length > 0;

  return (
    <li className="border-t border-border first:border-t-0">
      <div className="flex items-start gap-3 py-3">
        <span
          className={clsx('mt-0.5 grid size-8 shrink-0 place-items-center rounded-full', meta.bg)}
        >
          <IconComponent size={16} aria-hidden className={meta.fg} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text">
            <AuditSentence actor={entry.actor} target={entry.target} action={entry.action} />
          </p>
          <p className="mt-0.5 flex items-center gap-2 text-xs text-faint">
            <bdi className="font-mono">{entry.action}</bdi>
            <span aria-hidden>·</span>
            <span title={formatDateTime(entry.createdAt, i18n.language)}>
              {formatRelativeTime(entry.createdAt, undefined, i18n.language)}
            </span>
          </p>
          {open && hasDetail ? (
            <dl className="mt-2 rounded-md border border-border bg-surface p-2 text-xs">
              {keys.map((key) => (
                <div key={key} className="flex gap-2 py-0.5">
                  <dt className="w-24 shrink-0 text-muted">{key}</dt>
                  <dd className="flex-1">
                    {entry.before?.[key] !== undefined ? (
                      <span className="text-danger line-through">
                        {String(entry.before?.[key])}
                      </span>
                    ) : null}
                    {entry.before?.[key] !== undefined && entry.after?.[key] !== undefined ? (
                      <span className="mx-1 text-faint">→</span>
                    ) : null}
                    {entry.after?.[key] !== undefined ? (
                      <span className="text-success">{String(entry.after?.[key])}</span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        {hasDetail ? (
          <button
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={t('auditLog.toggleDetails')}
            className="shrink-0 rounded-md p-1 text-muted hover:bg-surface hover:text-text focus-visible:outline-2 focus-visible:outline-accent"
          >
            <CaretRight
              size={16}
              aria-hidden
              className={clsx('transition-transform rtl:-scale-x-100', open && 'rotate-90')}
            />
          </button>
        ) : null}
      </div>
    </li>
  );
}
