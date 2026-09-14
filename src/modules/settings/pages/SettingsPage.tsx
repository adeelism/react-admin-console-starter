import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../components/molecules/PageHeader';

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <section>
      <PageHeader title={t('settings.title')} description={t('settings.subtitle')} />
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted">
        {t('settings.placeholder')}
      </div>
    </section>
  );
}
