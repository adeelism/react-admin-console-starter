import clsx from 'clsx';
import { CheckCircle, WarningCircle, X } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import type { Toast } from './toast-context';

interface ToastViewportProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  const { t } = useTranslation();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 end-4 z-[60] flex w-80 flex-col gap-2" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.tone === 'error' ? 'alert' : 'status'}
          className={clsx(
            'flex items-start gap-2 rounded-lg border p-3 text-sm shadow-lg',
            toast.tone === 'success'
              ? 'border-[color-mix(in_srgb,var(--color-success)_30%,transparent)] bg-success-subtle'
              : 'border-[color-mix(in_srgb,var(--color-danger)_30%,transparent)] bg-danger-subtle',
          )}
        >
          {toast.tone === 'success' ? (
            <CheckCircle size={18} weight="fill" className="text-success" aria-hidden />
          ) : (
            <WarningCircle size={18} weight="fill" className="text-danger" aria-hidden />
          )}
          <span className="flex-1 text-text">{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            aria-label={t('common.dismiss')}
            className="text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-accent"
          >
            <X size={14} aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}
