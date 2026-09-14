import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http as mswHttp, HttpResponse } from 'msw';
import AuditLogPage from './pages/AuditLogPage';
import { renderWithProviders } from '../../test/utils';
import { server } from '../../mocks/server';

describe('AuditLogPage', () => {
  it('lists audit entries', async () => {
    renderWithProviders(<AuditLogPage />);
    expect(await screen.findByText('user.created')).toBeInTheDocument();
    expect(screen.getByText('user.updated')).toBeInTheDocument();
    expect(screen.getByText('user.deleted')).toBeInTheDocument();
  });

  it('filters by action', async () => {
    renderWithProviders(<AuditLogPage />);
    await screen.findByText('user.created');
    await userEvent.selectOptions(screen.getByLabelText('Filter by action'), 'user.deleted');
    await waitFor(() => {
      expect(screen.queryByText('user.created')).not.toBeInTheDocument();
      expect(screen.getByText('user.deleted')).toBeInTheDocument();
    });
  });

  it('filters by actor', async () => {
    renderWithProviders(<AuditLogPage />);
    await screen.findByText('user.created');
    await userEvent.type(screen.getByLabelText('Filter by actor'), 'aisha');
    await waitFor(() => {
      expect(screen.getByText('user.deleted')).toBeInTheDocument();
      expect(screen.queryByText('user.created')).not.toBeInTheDocument();
    });
  });

  it('expands an entry to reveal the before/after detail', async () => {
    renderWithProviders(<AuditLogPage />);
    await screen.findByText('user.deleted');
    const toggles = screen.getAllByRole('button', { name: 'Toggle details' });
    await userEvent.click(toggles[0]); // newest entry is the deleted seed record
    expect(await screen.findByText('Legacy User')).toBeInTheDocument();
  });

  it('shows an error state when the request fails', async () => {
    server.use(mswHttp.get('*/api/audit-logs', () => new HttpResponse(null, { status: 500 })));
    renderWithProviders(<AuditLogPage />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
