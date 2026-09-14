import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UsersThree, UserCheck, EnvelopeSimple, Prohibit } from '@phosphor-icons/react';
import { useUsers } from '../../users/hooks';
import { PageHeader } from '../../../components/molecules/PageHeader';
import { StatCard } from '../../../components/molecules/StatCard';
import { Spinner } from '../../../components/atoms/Spinner';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data: users, isLoading, isError } = useUsers();

  const stats = useMemo(() => {
    const list = users ?? [];
    return {
      total: list.length,
      active: list.filter((user) => user.status === 'active').length,
      invited: list.filter((user) => user.status === 'invited').length,
      suspended: list.filter((user) => user.status === 'suspended').length,
    };
  }, [users]);

  if (isLoading) {
    return <Spinner label={t('common.loading')} />;
  }
  if (isError) {
    return <p role="alert">{t('common.error')}</p>;
  }

  return (
    <section>
      <PageHeader title={t('dashboard.title')} description={t('dashboard.subtitle')} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('dashboard.totalUsers')} value={stats.total} icon={UsersThree} />
        <StatCard label={t('dashboard.active')} value={stats.active} icon={UserCheck} />
        <StatCard label={t('dashboard.invited')} value={stats.invited} icon={EnvelopeSimple} />
        <StatCard label={t('dashboard.suspended')} value={stats.suspended} icon={Prohibit} />
      </div>
    </section>
  );
}
