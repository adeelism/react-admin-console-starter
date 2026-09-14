import { useTranslation } from 'react-i18next';
import { CaretDown, CaretUp, CaretUpDown, type Icon } from '@phosphor-icons/react';
import { UserRow } from './UserRow';
import type { SortOrder, User, UserSortField } from '../types';

interface UsersTableProps {
  rows: User[];
  sort: UserSortField;
  order: SortOrder;
  onToggleSort: (field: UserSortField) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  selectable: boolean;
  canWrite: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const COLUMNS: { field: UserSortField; labelKey: string }[] = [
  { field: 'name', labelKey: 'users.user' },
  { field: 'role', labelKey: 'users.role' },
  { field: 'status', labelKey: 'users.status' },
  { field: 'lastActiveAt', labelKey: 'users.lastActive' },
];

export function UsersTable(props: UsersTableProps) {
  const { rows, sort, order, onToggleSort, selectedIds, onToggleSelectAll, selectable } = props;
  const { t } = useTranslation();
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.has(row.id));

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-surface">
          <tr>
            {selectable ? (
              <th className="w-10 px-3 py-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  aria-label={t('users.selectAll')}
                  className="size-4 accent-[var(--color-accent)]"
                />
              </th>
            ) : null}
            {COLUMNS.map((col) => {
              const active = sort === col.field;
              const Caret: Icon = !active ? CaretUpDown : order === 'asc' ? CaretUp : CaretDown;
              return (
                <th
                  key={col.field}
                  aria-sort={active ? (order === 'asc' ? 'ascending' : 'descending') : 'none'}
                  className="px-3 py-2 text-left"
                >
                  <button
                    onClick={() => onToggleSort(col.field)}
                    className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-faint uppercase hover:text-text focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    {t(col.labelKey)}
                    <Caret size={12} aria-hidden />
                  </button>
                </th>
              );
            })}
            <th className="px-3 py-2 text-right text-xs font-semibold tracking-wide text-faint uppercase">
              {t('users.actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              selected={selectedIds.has(user.id)}
              selectable={selectable}
              canWrite={props.canWrite}
              onToggleSelect={props.onToggleSelect}
              onEdit={props.onEdit}
              onDelete={props.onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
