import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/useAuth';
import type { Role } from '../../auth/permissions';

const ROLES: Role[] = ['admin', 'auditor', 'viewer'];

/**
 * Switches the signed-in user's role so the permission gating can be seen live.
 * In a real app the role comes from the auth backend, not a picker.
 */
export function RoleSwitcher() {
  const { t } = useTranslation();
  const { user, setRole } = useAuth();

  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-muted">
      {t('role.label')}
      <select
        value={user.role}
        aria-label={t('role.label')}
        onChange={(event) => setRole(event.target.value as Role)}
        className="rounded-md border border-border bg-bg px-2 py-1.5 text-sm text-text focus-visible:outline-2 focus-visible:outline-accent"
      >
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {t(`role.names.${role}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
