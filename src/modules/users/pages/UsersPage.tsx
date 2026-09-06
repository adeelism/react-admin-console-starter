import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../auth/useAuth';
import { DataTable, type Column } from '../../../components/organisms/DataTable';
import { Button } from '../../../components/atoms/Button';
import { Input } from '../../../components/atoms/Input';
import { FormField } from '../../../components/molecules/FormField';
import { Spinner } from '../../../components/atoms/Spinner';
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from '../hooks';
import type { CreateUserInput, User, UserRole } from '../types';

const ROLES: UserRole[] = ['admin', 'auditor', 'viewer'];
const EMPTY_FORM: CreateUserInput = { name: '', email: '', role: 'viewer' };

export default function UsersPage() {
  const { t } = useTranslation();
  const { can } = useAuth();
  const canWrite = can('users:write');

  const { data: users, isLoading, isError } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [form, setForm] = useState<CreateUserInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const reset = (): void => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const startEdit = (user: User): void => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  const submit = (event: FormEvent): void => {
    event.preventDefault();
    if (editingId) {
      updateUser.mutate({ id: editingId, input: form }, { onSuccess: reset });
    } else {
      createUser.mutate(form, { onSuccess: reset });
    }
  };

  const columns: Column<User>[] = [
    { key: 'name', header: t('users.name'), render: (user) => user.name },
    { key: 'email', header: t('users.email'), render: (user) => user.email },
    { key: 'role', header: t('users.role'), render: (user) => user.role },
    {
      key: 'actions',
      header: t('users.actions'),
      render: (user) =>
        canWrite ? (
          <span className="row-actions">
            <Button variant="ghost" onClick={() => startEdit(user)}>
              {t('users.edit')}
            </Button>
            <Button variant="danger" onClick={() => deleteUser.mutate(user.id)}>
              {t('users.delete')}
            </Button>
          </span>
        ) : (
          <span className="muted">—</span>
        ),
    },
  ];

  if (isLoading) {
    return <Spinner label={t('common.loading')} />;
  }
  if (isError) {
    return <p role="alert">{t('common.error')}</p>;
  }

  return (
    <section>
      <h1>{t('users.title')}</h1>
      <DataTable
        columns={columns}
        rows={users ?? []}
        rowKey={(user) => user.id}
        emptyLabel={t('users.empty')}
      />

      {canWrite && (
        <form onSubmit={submit} aria-label={editingId ? t('users.edit') : t('users.add')}>
          <FormField label={t('users.name')} htmlFor="name">
            <Input
              id="name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </FormField>
          <FormField label={t('users.email')} htmlFor="email">
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </FormField>
          <FormField label={t('users.role')} htmlFor="role">
            <select
              id="role"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value as UserRole })}
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </FormField>
          <div className="form-actions">
            <Button type="submit">{t('users.save')}</Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={reset}>
                {t('users.cancel')}
              </Button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
