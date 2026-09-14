import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlass } from '@phosphor-icons/react';
import type { UserRole, UserStatus } from '../types';

const ROLES: UserRole[] = ['admin', 'editor', 'auditor', 'viewer'];
const STATUSES: UserStatus[] = ['active', 'invited', 'suspended'];
const SELECT =
  'rounded-md border border-border bg-bg px-2 py-2 text-sm text-text focus-visible:outline-2 focus-visible:outline-accent';

interface UsersFiltersProps {
  search: string;
  role: string;
  status: string;
  onSearch: (value: string) => void;
  onRole: (value: string) => void;
  onStatus: (value: string) => void;
}

export function UsersFilters({
  search,
  role,
  status,
  onSearch,
  onRole,
  onStatus,
}: UsersFiltersProps) {
  const { t } = useTranslation();
  const [term, setTerm] = useState(search);

  // Keep the input in sync when the URL changes elsewhere (e.g. the topbar search).
  useEffect(() => setTerm(search), [search]);

  // Debounce typing into the URL-synced search param.
  useEffect(() => {
    if (term === search) return;
    const id = setTimeout(() => onSearch(term), 300);
    return () => clearTimeout(id);
  }, [term, search, onSearch]);

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative max-w-xs grow">
        <MagnifyingGlass
          size={16}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint"
          aria-hidden
        />
        <input
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder={t('users.searchPlaceholder')}
          aria-label={t('search.label')}
          className="w-full rounded-md border border-border bg-bg py-2 pr-3 pl-9 text-sm text-text placeholder:text-faint focus-visible:outline-2 focus-visible:outline-accent"
        />
      </div>
      <select
        value={role}
        onChange={(event) => onRole(event.target.value)}
        aria-label={t('users.filterRole')}
        className={SELECT}
      >
        <option value="all">{t('users.allRoles')}</option>
        {ROLES.map((value) => (
          <option key={value} value={value}>
            {t(`role.names.${value}`)}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(event) => onStatus(event.target.value)}
        aria-label={t('users.filterStatus')}
        className={SELECT}
      >
        <option value="all">{t('users.allStatuses')}</option>
        {STATUSES.map((value) => (
          <option key={value} value={value}>
            {t(`users.statuses.${value}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
