import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useAuth } from '../../auth/useAuth';
import { NAV_ITEMS } from './nav-items';
import { RoleSwitcher } from '../molecules/RoleSwitcher';
import { LanguageSwitcher } from '../molecules/LanguageSwitcher';
import { ThemeToggle } from '../../theme/ThemeToggle';

export function Sidebar() {
  const { t } = useTranslation();
  const { can } = useAuth();
  const items = NAV_ITEMS.filter((item) => !item.requires || can(item.requires));

  return (
    <aside className="flex h-full flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-4 py-4">
        <span
          className="grid size-8 place-items-center rounded-md bg-accent text-sm font-bold text-on-accent"
          aria-hidden
        >
          A
        </span>
        <span className="font-semibold tracking-tight text-text">{t('app.title')}</span>
      </div>

      <nav className="flex-1 px-2 py-2" aria-label={t('nav.primary')}>
        <ul className="flex flex-col gap-1">
          {items.map(({ to, labelKey, icon: IconComponent }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-accent',
                    isActive
                      ? 'bg-accent-subtle text-accent'
                      : 'text-muted hover:bg-surface-2 hover:text-text',
                  )
                }
              >
                <IconComponent size={18} aria-hidden />
                {t(labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col gap-3 border-t border-border px-4 py-4">
        <RoleSwitcher />
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </aside>
  );
}
