import { Outlet } from 'react-router-dom';
import { useLocaleDirection } from '../../i18n/useLocaleDirection';
import { DemoBanner } from '../molecules/DemoBanner';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout() {
  useLocaleDirection();

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <DemoBanner />
      <div className="grid flex-1 grid-cols-[15rem_1fr]">
        <Sidebar />
        <div className="flex min-w-0 flex-col">
          <Topbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
