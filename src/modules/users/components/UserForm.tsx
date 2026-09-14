import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/atoms/Button';
import { Input } from '../../../components/atoms/Input';
import { FormField } from '../../../components/molecules/FormField';
import type { CreateUserInput, UserRole } from '../types';

const ROLES: UserRole[] = ['admin', 'editor', 'auditor', 'viewer'];

interface UserFormProps {
  form: CreateUserInput;
  editing: boolean;
  onChange: (form: CreateUserInput) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * Inline create/edit form. Phase 3 moves this into a modal/slide-over with
 * React Hook Form + Zod; kept inline here so create/edit stays functional.
 */
export function UserForm({ form, editing, onChange, onSubmit, onCancel }: UserFormProps) {
  const { t } = useTranslation();

  const submit = (event: FormEvent): void => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={submit}
      aria-label={editing ? t('users.edit') : t('users.add')}
      className="mt-6 max-w-md rounded-lg border border-border bg-card p-4"
    >
      <h2 className="mb-3 text-sm font-semibold text-text">
        {editing ? t('users.edit') : t('users.add')}
      </h2>
      <FormField label={t('users.name')} htmlFor="name">
        <Input
          id="name"
          value={form.name}
          onChange={(event) => onChange({ ...form, name: event.target.value })}
          required
        />
      </FormField>
      <FormField label={t('users.email')} htmlFor="email">
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(event) => onChange({ ...form, email: event.target.value })}
          required
        />
      </FormField>
      <FormField label={t('users.role')} htmlFor="role">
        <select
          id="role"
          value={form.role}
          onChange={(event) => onChange({ ...form, role: event.target.value as UserRole })}
          className="input"
        >
          {ROLES.map((value) => (
            <option key={value} value={value}>
              {t(`role.names.${value}`)}
            </option>
          ))}
        </select>
      </FormField>
      <div className="mt-2 flex gap-2">
        <Button type="submit">{t('users.save')}</Button>
        {editing ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t('users.cancel')}
          </Button>
        ) : null}
      </div>
    </form>
  );
}
