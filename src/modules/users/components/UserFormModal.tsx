import { useEffect, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../components/organisms/Modal';
import type { CreateUserInput, User, UserRole } from '../types';

const ROLES: UserRole[] = ['admin', 'editor', 'auditor', 'viewer'];

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'auditor', 'viewer']),
});
type FormValues = z.infer<typeof schema>;

const CONTROL =
  'rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus-visible:outline-2 focus-visible:outline-accent';

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-text">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}

interface UserFormModalProps {
  open: boolean;
  user: User | null;
  pending: boolean;
  onClose: () => void;
  onSubmit: (values: CreateUserInput) => void;
}

export function UserFormModal({ open, user, pending, onClose, onSubmit }: UserFormModalProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', role: 'viewer' },
  });

  useEffect(() => {
    if (!open) return;
    reset(
      user
        ? { name: user.name, email: user.email, role: user.role }
        : { name: '', email: '', role: 'viewer' },
    );
  }, [open, user, reset]);

  return (
    <Modal open={open} onClose={onClose} title={user ? t('users.editUser') : t('users.add')}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Field
          label={t('users.name')}
          htmlFor="name"
          error={errors.name && t('users.errors.nameRequired')}
        >
          <input id="name" {...register('name')} className={CONTROL} />
        </Field>
        <Field
          label={t('users.email')}
          htmlFor="email"
          error={errors.email && t('users.errors.emailInvalid')}
        >
          <input id="email" type="email" {...register('email')} className={CONTROL} />
        </Field>
        <Field label={t('users.role')} htmlFor="role">
          <select id="role" {...register('role')} className={CONTROL}>
            {ROLES.map((value) => (
              <option key={value} value={value}>
                {t(`role.names.${value}`)}
              </option>
            ))}
          </select>
        </Field>
        <div className="mt-1 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-text hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={!isValid || pending}
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-on-accent hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50"
          >
            {pending ? t('common.saving') : t('users.save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
