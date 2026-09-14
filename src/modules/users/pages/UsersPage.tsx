import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from '@phosphor-icons/react';
import { useAuth } from '../../../auth/useAuth';
import { useToast } from '../../../components/toast/useToast';
import { PageHeader } from '../../../components/molecules/PageHeader';
import { Spinner } from '../../../components/atoms/Spinner';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { ConfirmDialog } from '../../../components/molecules/ConfirmDialog';
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from '../hooks';
import { useUsersTableParams } from '../useUsersTableParams';
import { UsersFilters } from '../components/UsersFilters';
import { UsersTable } from '../components/UsersTable';
import { UsersPagination } from '../components/UsersPagination';
import { BulkActionBar } from '../components/BulkActionBar';
import { UserFormModal } from '../components/UserFormModal';
import type { CreateUserInput, User } from '../types';

type ConfirmState = { kind: 'single'; user: User } | { kind: 'bulk' } | null;

export default function UsersPage() {
  const { t } = useTranslation();
  const { can } = useAuth();
  const toast = useToast();
  const canWrite = can('users:write');

  const table = useUsersTableParams();
  const { data, isLoading, isError, refetch } = useUsers(table.params);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const rows = useMemo(() => data?.data ?? [], [data]);
  const total = data?.total ?? 0;

  const clearSelection = useCallback(() => setSelected(new Set()), []);
  const openCreate = useCallback(() => {
    setEditingUser(null);
    setFormOpen(true);
  }, []);
  const openEdit = useCallback((user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  }, []);

  const submitForm = useCallback(
    (values: CreateUserInput) => {
      const onError = () => toast.error(t('users.toastError'));
      if (editingUser) {
        updateUser.mutate(
          { id: editingUser.id, input: values },
          {
            onSuccess: () => {
              setFormOpen(false);
              toast.success(t('users.toastUpdated'));
            },
            onError,
          },
        );
      } else {
        createUser.mutate(values, {
          onSuccess: () => {
            setFormOpen(false);
            toast.success(t('users.toastCreated'));
          },
          onError,
        });
      }
    },
    [editingUser, updateUser, createUser, toast, t],
  );

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const toggleSelectAll = useCallback(() => {
    setSelected((prev) => {
      const allSelected = rows.length > 0 && rows.every((row) => prev.has(row.id));
      const next = new Set(prev);
      rows.forEach((row) => (allSelected ? next.delete(row.id) : next.add(row.id)));
      return next;
    });
  }, [rows]);

  const confirmDelete = useCallback(() => {
    if (!confirm) return;
    const onError = () => toast.error(t('users.toastError'));
    if (confirm.kind === 'single') {
      deleteUser.mutate(confirm.user.id, {
        onSuccess: () => toast.success(t('users.toastDeleted')),
        onError,
      });
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(confirm.user.id);
        return next;
      });
    } else {
      selected.forEach((id) => deleteUser.mutate(id));
      toast.success(t('users.toastDeleted'));
      clearSelection();
    }
    setConfirm(null);
  }, [confirm, deleteUser, selected, toast, t, clearSelection]);

  const pending = createUser.isPending || updateUser.isPending;

  return (
    <section>
      <PageHeader
        title={t('users.title')}
        description={t('users.subtitle')}
        action={
          canWrite ? (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-on-accent hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Plus size={16} aria-hidden />
              {t('users.add')}
            </button>
          ) : undefined
        }
      />
      <UsersFilters
        search={table.params.search}
        role={table.params.role}
        status={table.params.status}
        onSearch={table.setSearch}
        onRole={table.setRole}
        onStatus={table.setStatus}
      />
      {canWrite ? (
        <BulkActionBar
          count={selected.size}
          onDelete={() => setConfirm({ kind: 'bulk' })}
          onClear={clearSelection}
        />
      ) : null}

      {isLoading ? (
        <Spinner label={t('common.loading')} />
      ) : isError ? (
        <ErrorState
          message={t('common.error')}
          retryLabel={t('common.retry')}
          onRetry={() => void refetch()}
        />
      ) : rows.length === 0 ? (
        <EmptyState
          title={table.isFiltered ? t('users.noMatchTitle') : t('users.empty')}
          message={table.isFiltered ? t('users.noMatchMessage') : undefined}
          action={
            table.isFiltered ? (
              <button
                onClick={table.reset}
                className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-text hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent"
              >
                {t('users.clearFilters')}
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          <UsersTable
            rows={rows}
            sort={table.params.sort}
            order={table.params.order}
            onToggleSort={table.toggleSort}
            selectedIds={selected}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            selectable={canWrite}
            canWrite={canWrite}
            onEdit={openEdit}
            onDelete={(user) => setConfirm({ kind: 'single', user })}
          />
          <UsersPagination
            page={table.params.page}
            pageSize={table.params.pageSize}
            total={total}
            onPage={table.setPage}
            onPageSize={table.setPageSize}
          />
        </>
      )}

      <UserFormModal
        open={formOpen}
        user={editingUser}
        pending={pending}
        onClose={() => setFormOpen(false)}
        onSubmit={submitForm}
      />
      <ConfirmDialog
        open={confirm !== null}
        title={
          confirm?.kind === 'bulk' ? t('users.confirmBulkTitle') : t('users.confirmDeleteTitle')
        }
        message={
          confirm?.kind === 'bulk'
            ? t('users.confirmBulkMessage', { count: selected.size })
            : t('users.confirmDeleteMessage', {
                name: confirm?.kind === 'single' ? confirm.user.name : '',
              })
        }
        confirmLabel={confirm?.kind === 'bulk' ? t('users.deleteSelected') : t('users.delete')}
        onConfirm={confirmDelete}
        onCancel={() => setConfirm(null)}
      />
    </section>
  );
}
