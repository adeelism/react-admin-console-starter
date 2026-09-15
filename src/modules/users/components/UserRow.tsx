import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Badge, type BadgeTone } from '../../../components/atoms/Badge';
import { Avatar } from '../../../components/molecules/Avatar';
import { formatRelativeTime } from '../../../lib/formatRelativeTime';
import type { User, UserStatus } from '../types';

const STATUS_TONE: Record<UserStatus, BadgeTone> = {
  active: 'success',
  invited: 'info',
  suspended: 'danger',
};

interface UserRowProps {
  user: User;
  selected: boolean;
  selectable: boolean;
  canWrite: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserRow = memo(function UserRow({
  user,
  selected,
  selectable,
  canWrite,
  onToggleSelect,
  onEdit,
  onDelete,
}: UserRowProps) {
  const { t, i18n } = useTranslation();

  return (
    <tr
      className={clsx('border-t border-border hover:bg-surface-2', selected && 'bg-accent-subtle')}
    >
      {selectable ? (
        <td className="px-3 py-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(user.id)}
            aria-label={t('users.selectRow', { name: user.name })}
            className="size-4 accent-[var(--color-accent)]"
          />
        </td>
      ) : null}
      <td className="px-3 py-2">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-2">
        <Badge tone="neutral">{t(`role.names.${user.role}`)}</Badge>
      </td>
      <td className="px-3 py-2">
        <Badge tone={STATUS_TONE[user.status]}>{t(`users.statuses.${user.status}`)}</Badge>
      </td>
      <td className="px-3 py-2 text-sm whitespace-nowrap text-muted">
        {user.lastActiveAt
          ? formatRelativeTime(user.lastActiveAt, undefined, i18n.language)
          : t('users.never')}
      </td>
      <td className="px-3 py-2 text-end">
        {canWrite ? (
          <div className="flex justify-end gap-1">
            <button
              onClick={() => onEdit(user)}
              className="rounded-md px-2 py-1 text-xs font-medium text-muted hover:bg-surface hover:text-text focus-visible:outline-2 focus-visible:outline-accent"
            >
              {t('users.edit')}
            </button>
            <button
              onClick={() => onDelete(user)}
              className="rounded-md px-2 py-1 text-xs font-medium text-danger hover:bg-danger-subtle focus-visible:outline-2 focus-visible:outline-accent"
            >
              {t('users.delete')}
            </button>
          </div>
        ) : (
          <span className="text-muted">—</span>
        )}
      </td>
    </tr>
  );
});
