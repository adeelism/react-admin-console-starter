import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LockSimple } from '@phosphor-icons/react';
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
      <div className="mx-auto max-w-md py-16">
        <div role="alert" className="rounded-lg border border-border bg-card p-8 text-center">
          <LockSimple size={28} className="mx-auto text-muted" aria-hidden />
          <p className="mt-3 font-medium text-text">{t('forbidden')}</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
