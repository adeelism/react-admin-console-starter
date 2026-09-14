import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../auth/useAuth';
import { PageHeader } from '../../../components/molecules/PageHeader';
import { Spinner } from '../../../components/atoms/Spinner';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from '../hooks';
import { useUsersTableParams } from '../useUsersTableParams';
import { UsersFilters } from '../components/UsersFilters';
import { UsersTable } from '../components/UsersTable';
import { UsersPagination } from '../components/UsersPagination';
import { BulkActionBar } from '../components/BulkActionBar';
import { UserForm } from '../components/UserForm';
import type { CreateUserInput, User } from '../types';

const EMPTY_FORM: CreateUserInput = { name: '', email: '', role: 'viewer' };

export default function UsersPage() {
  const { t } = useTranslation();
  const { can } = useAuth();
  const canWrite = can('users:write');

  const table = useUsersTableParams();
  const { data, isLoading, isError, refetch } = useUsers(table.params);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [form, setForm] = useState<CreateUserInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const rows = useMemo(() => data?.data ?? [], [data]);
  const total = data?.total ?? 0;

  const resetForm = useCallback(() => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }, []);
  const startEdit = useCallback((user: User) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, role: user.role });
  }, []);
  const submitForm = useCallback(() => {
    if (editingId) updateUser.mutate({ id: editingId, input: form }, { onSuccess: resetForm });
    else createUser.mutate(form, { onSuccess: resetForm });
  }, [editingId, form, updateUser, createUser, resetForm]);

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
  const handleDelete = useCallback(
    (user: User) => {
      deleteUser.mutate(user.id);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
    },
    [deleteUser],
  );
  const bulkDelete = useCallback(() => {
    selected.forEach((id) => deleteUser.mutate(id));
    setSelected(new Set());
  }, [selected, deleteUser]);

  return (
    <section>
      <PageHeader title={t('users.title')} description={t('users.subtitle')} />
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
          onDelete={bulkDelete}
          onClear={() => setSelected(new Set())}
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
            onEdit={startEdit}
            onDelete={handleDelete}
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

      {canWrite ? (
        <UserForm
          form={form}
          editing={editingId !== null}
          onChange={setForm}
          onSubmit={submitForm}
          onCancel={resetForm}
        />
      ) : null}
    </section>
  );
}
