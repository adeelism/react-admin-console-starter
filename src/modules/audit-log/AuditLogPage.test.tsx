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
  });

  it('filters entries by action', async () => {
    renderWithProviders(<AuditLogPage />);
    await screen.findByText('user.created');
    await userEvent.type(screen.getByLabelText('Filter by action'), 'deleted');
    await waitFor(() => {
      expect(screen.queryByText('user.created')).not.toBeInTheDocument();
      expect(screen.getByText('user.deleted')).toBeInTheDocument();
    });
  });

  it('shows an error state when the request fails', async () => {
    server.use(mswHttp.get('*/api/audit-logs', () => new HttpResponse(null, { status: 500 })));
    renderWithProviders(<AuditLogPage />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
