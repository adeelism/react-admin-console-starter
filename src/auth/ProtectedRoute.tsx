import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth';
import type { Permission } from './permissions';

/** Renders children only if the current user holds `requires`; otherwise a notice. */
export function ProtectedRoute({
  requires,
  children,
}: {
  requires: Permission;
  children: ReactNode;
}) {
  const { can } = useAuth();
  const { t } = useTranslation();

  if (!can(requires)) {
    return (
      <div role="alert" className="forbidden">
        {t('forbidden')}
      </div>
    );
  }
  return <>{children}</>;
}
