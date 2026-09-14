import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useAuth } from '../../auth/useAuth';
import { NAV_ITEMS } from './nav-items';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Topbar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [term, setTerm] = useState('');

  const active = NAV_ITEMS.find((item) => pathname.startsWith(item.to));
  const title = active ? t(active.labelKey) : t('app.title');

  // Global search scopes to the Users table (which reads `q` from the URL).
  const onSearch = (event: FormEvent): void => {
    event.preventDefault();
    const q = term.trim();
    navigate(q ? `/users?q=${encodeURIComponent(q)}` : '/users');
  };

  return (
    <header className="flex items-center gap-4 border-b border-border bg-bg px-6 py-3">
      <h2 className="text-sm font-semibold text-text">{title}</h2>

      <form role="search" onSubmit={onSearch} className="ml-auto w-full max-w-xs">
        <div className="relative">
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
            aria-hidden
          />
          <input
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder={t('search.placeholder')}
            aria-label={t('search.label')}
            className="w-full rounded-md border border-border bg-surface py-2 pr-3 pl-9 text-sm text-text placeholder:text-faint focus-visible:outline-2 focus-visible:outline-accent"
          />
        </div>
      </form>

      <div className="flex items-center gap-2">
        <span
          className="grid size-8 place-items-center rounded-full bg-accent-subtle text-sm font-semibold text-accent"
          aria-hidden
        >
          {initials(user.name)}
        </span>
        <div className="hidden leading-tight sm:block">
          <p className="text-sm font-medium text-text">{user.name}</p>
          <p className="text-xs text-muted">{t(`role.names.${user.role}`)}</p>
        </div>
      </div>
    </header>
  );
}
