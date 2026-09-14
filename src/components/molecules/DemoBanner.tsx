import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from '@phosphor-icons/react';
import clsx from 'clsx';
import { useAuth } from '../../auth/useAuth';
import type { Role } from '../../auth/permissions';

const ROLES: Role[] = ['admin', 'auditor', 'viewer'];

/**
 * A dismissible strip for the hosted demo: no login, and one-click role switching
 * so a visitor immediately sees the permission model change.
 */
export function DemoBanner() {
  const { t } = useTranslation();
  const { user, setRole } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-accent px-4 py-2 text-sm text-on-accent">
      <span className="font-semibold">{t('demo.title')}</span>
      <span className="text-on-accent/85">{t('demo.hint')}</span>
      <div className="ml-auto flex items-center gap-1">
        {ROLES.map((role) => (
          <button
            key={role}
            onClick={() => setRole(role)}
            aria-pressed={user.role === role}
            className={clsx(
              'rounded px-2 py-0.5 text-xs font-medium focus-visible:outline-2 focus-visible:outline-white',
              user.role === role ? 'bg-on-accent text-accent' : 'bg-white/15 hover:bg-white/25',
            )}
          >
            {t(`role.names.${role}`)}
          </button>
        ))}
        <button
          onClick={() => setDismissed(true)}
          aria-label={t('common.dismiss')}
          className="ml-1 rounded p-1 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white"
        >
          <X size={14} aria-hidden />
        </button>
      </div>
    </div>
  );
}
