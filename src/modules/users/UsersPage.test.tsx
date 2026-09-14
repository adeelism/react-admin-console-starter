import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http as mswHttp, HttpResponse } from 'msw';
import UsersPage from './pages/UsersPage';
import { renderWithProviders } from '../../test/utils';
import { server } from '../../mocks/server';

const viewer = { id: 'u', name: 'Val Viewer', role: 'viewer' as const };

describe('UsersPage', () => {
  it('lists users from the API', async () => {
    renderWithProviders(<UsersPage />);
    expect(await screen.findByText('Ada Okafor')).toBeInTheDocument();
    expect(screen.getByText('ivan.petrov@example.com')).toBeInTheDocument();
  });

  it('hides the create form and row actions for a viewer', async () => {
    renderWithProviders(<UsersPage />, { user: viewer });
    await screen.findByText('Ada Okafor');
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('creates a user as an admin', async () => {
    renderWithProviders(<UsersPage />);
    await screen.findByText('Ada Okafor');
    await userEvent.type(screen.getByLabelText('Name'), 'New Person');
    await userEvent.type(screen.getByLabelText('Email'), 'new@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('New Person')).toBeInTheDocument();
  });

  it('edits an existing user as an admin', async () => {
    renderWithProviders(<UsersPage />);
    await screen.findByText('Ada Okafor');
    const row = screen.getByText('Ada Okafor').closest('tr');
    await userEvent.click(within(row as HTMLElement).getByRole('button', { name: 'Edit' }));
    const nameInput = screen.getByLabelText('Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Ada Prime');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Ada Prime')).toBeInTheDocument();
  });

  it('deletes a user as an admin', async () => {
    renderWithProviders(<UsersPage />);
    await screen.findByText('Ivan Petrov');
    const row = screen.getByText('Ivan Petrov').closest('tr');
    await userEvent.click(within(row as HTMLElement).getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(screen.queryByText('Ivan Petrov')).not.toBeInTheDocument());
  });

  it('shows an error state when the list request fails', async () => {
    server.use(mswHttp.get('*/api/users', () => new HttpResponse(null, { status: 500 })));
    renderWithProviders(<UsersPage />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
