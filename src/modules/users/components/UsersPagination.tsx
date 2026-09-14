import { useTranslation } from 'react-i18next';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

interface UsersPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
}

const PAGE_SIZES = [10, 20, 50];
const BTN =
  'rounded-md border border-border bg-card p-1.5 text-muted hover:text-text disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-accent';

export function UsersPagination({
  page,
  pageSize,
  total,
  onPage,
  onPageSize,
}: UsersPaginationProps) {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
      <label className="flex items-center gap-2">
        {t('users.rowsPerPage')}
        <select
          value={pageSize}
          onChange={(event) => onPageSize(Number(event.target.value))}
          className="rounded-md border border-border bg-bg px-2 py-1 text-text focus-visible:outline-2 focus-visible:outline-accent"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-center gap-3">
        <span className="tabular-nums">{t('users.pageInfo', { from, to, total })}</span>
        <div className="flex gap-1">
          <button
            onClick={() => onPage(page - 1)}
            disabled={page <= 1}
            aria-label={t('users.prev')}
            className={BTN}
          >
            <CaretLeft size={16} aria-hidden />
          </button>
          <button
            onClick={() => onPage(page + 1)}
            disabled={page >= totalPages}
            aria-label={t('users.next')}
            className={BTN}
          >
            <CaretRight size={16} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
