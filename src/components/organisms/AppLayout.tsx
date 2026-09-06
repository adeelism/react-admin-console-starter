import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/useAuth';
import type { Role } from '../../auth/permissions';
import { ThemeToggle } from '../../theme/ThemeToggle';

const ROLES: Role[] = ['admin', 'auditor', 'viewer'];

export function AppLayout() {
  const { t, i18n } = useTranslation();
  const { user, setRole } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <strong>{t('app.title')}</strong>
        <nav>
          <NavLink to="/users">{t('nav.users')}</NavLink>
          <NavLink to="/audit-log">{t('nav.auditLog')}</NavLink>
        </nav>
        <div className="app-header__controls">
          <label>
            {t('role.label')}{' '}
            <select
              value={user.role}
              aria-label={t('role.label')}
              onChange={(event) => setRole(event.target.value as Role)}
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
          <select
            aria-label="language"
            value={i18n.language}
            onChange={(event) => void i18n.changeLanguage(event.target.value)}
          >
            <option value="en">EN</option>
            <option value="xx">XX</option>
          </select>
          <ThemeToggle />
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
