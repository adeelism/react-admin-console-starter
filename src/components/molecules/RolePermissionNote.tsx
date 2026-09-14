import { useTranslation } from 'react-i18next';
import { Check, X } from '@phosphor-icons/react';
import { useAuth } from '../../auth/useAuth';

/**
 * Turns the (invisible) permission model into something you can see: a note
 * spelling out what the current role can and cannot do. Update the role in the
 * sidebar and the checks flip live.
 */
export function RolePermissionNote() {
  const { t } = useTranslation();
  const { user, can } = useAuth();

  const capabilities = [
    { label: t('users.perm.view'), allowed: can('users:read') },
    { label: t('users.perm.manage'), allowed: can('users:write') },
    { label: t('users.perm.audit'), allowed: can('audit-log:read') },
  ];

  return (
    <div className="mb-4 rounded-lg border border-border bg-surface px-4 py-3 text-sm">
      <p className="mb-2 text-muted">
        {t('users.perm.note', { role: t(`role.names.${user.role}`) })}
      </p>
      <ul className="flex flex-wrap gap-x-5 gap-y-1">
        {capabilities.map((cap) => (
          <li key={cap.label} className="flex items-center gap-1.5">
            {cap.allowed ? (
              <Check size={14} weight="bold" className="text-success" aria-hidden />
            ) : (
              <X size={14} weight="bold" className="text-danger" aria-hidden />
            )}
            <span className={cap.allowed ? 'text-text' : 'text-muted line-through'}>
              {cap.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
