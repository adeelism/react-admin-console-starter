import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import DashboardPage from './pages/DashboardPage';
import { renderWithProviders } from '../../test/utils';

describe('DashboardPage', () => {
  it('shows user stat cards derived from the seed data', async () => {
    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText('Total users')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument(); // total users in the seed
    expect(screen.getByText('Pending invites')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument(); // active users in the seed
  });

  it('shows recent activity pulled from the audit log', async () => {
    renderWithProviders(<DashboardPage />);
    expect(await screen.findByText('Recent activity')).toBeInTheDocument();
    expect(await screen.findByText('aisha.bello@example.com')).toBeInTheDocument();
  });
});
