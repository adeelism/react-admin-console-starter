import { useTranslation } from 'react-i18next';
import { Modal } from '../organisms/Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-muted">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-text hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent"
        >
          {t('common.cancel')}
        </button>
        <button
          onClick={onConfirm}
          className="rounded-md bg-danger px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-accent"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
