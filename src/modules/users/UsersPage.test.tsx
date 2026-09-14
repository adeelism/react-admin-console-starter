import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http as mswHttp, HttpResponse } from 'msw';
import UsersPage from './pages/UsersPage';
import { renderWithProviders } from '../../test/utils';
import { server } from '../../mocks/server';

const viewer = { id: 'u', name: 'Val Viewer', role: 'viewer' as const };

describe('UsersPage', () => {
  it('lists the first page of users sorted by name', async () => {
    renderWithProviders(<UsersPage />);
    expect(await screen.findByText('Ada Okafor')).toBeInTheDocument();
    expect(screen.getByText('Grace Thompson')).toBeInTheDocument();
    // Ivan Petrov falls on page 2 with the default page size.
    expect(screen.queryByText('Ivan Petrov')).not.toBeInTheDocument();
  });

  it('searches across name and email', async () => {
    renderWithProviders(<UsersPage />);
    await screen.findByText('Ada Okafor');
    await userEvent.type(screen.getByLabelText('Search'), 'ivan');
    expect(await screen.findByText('Ivan Petrov')).toBeInTheDocument();
    expect(screen.queryByText('Ada Okafor')).not.toBeInTheDocument();
  });

  it('filters by status', async () => {
    renderWithProviders(<UsersPage />);
    await screen.findByText('Ada Okafor');
    await userEvent.selectOptions(screen.getByLabelText('Filter by status'), 'suspended');
    expect(await screen.findByText('Omar Haddad')).toBeInTheDocument();
    expect(screen.queryByText('Ada Okafor')).not.toBeInTheDocument();
  });

  it('paginates to the next page', async () => {
    renderWithProviders(<UsersPage />);
    await screen.findByText('Ada Okafor');
    await userEvent.click(screen.getByLabelText('Next page'));
    expect(await screen.findByText('Ivan Petrov')).toBeInTheDocument();
    expect(screen.queryByText('Ada Okafor')).not.toBeInTheDocument();
  });

  it('shows an empty state with a clear-filters action', async () => {
    renderWithProviders(<UsersPage />);
    await screen.findByText('Ada Okafor');
    await userEvent.type(screen.getByLabelText('Search'), 'zzzzz');
    expect(await screen.findByText('No users match your filters')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(await screen.findByText('Ada Okafor')).toBeInTheDocument();
  });

  it('bulk-selects and deletes rows', async () => {
    renderWithProviders(<UsersPage />);
    await screen.findByText('Ada Okafor');
    await userEvent.type(screen.getByLabelText('Search'), 'ada');
    const row = (await screen.findByText('Ada Okafor')).closest('tr') as HTMLElement;
    await userEvent.click(within(row).getByRole('checkbox'));
    await userEvent.click(screen.getByRole('button', { name: 'Delete selected' }));
    await waitFor(() => expect(screen.queryByText('Ada Okafor')).not.toBeInTheDocument());
  });

  it('hides selection, the form, and row actions for a viewer', async () => {
    renderWithProviders(<UsersPage />, { user: viewer });
    await screen.findByText('Ada Okafor');
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('creates a user as an admin', async () => {
    renderWithProviders(<UsersPage />);
    await screen.findByText('Ada Okafor');
    await userEvent.type(screen.getByLabelText('Name'), 'New Person');
    await userEvent.type(screen.getByLabelText('Email'), 'new@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await userEvent.type(screen.getByLabelText('Search'), 'New Person');
    expect(await screen.findByText('New Person')).toBeInTheDocument();
  });

  it('edits an existing user as an admin', async () => {
    renderWithProviders(<UsersPage />);
    await screen.findByText('Ada Okafor');
    await userEvent.type(screen.getByLabelText('Search'), 'ada');
    const row = (await screen.findByText('Ada Okafor')).closest('tr') as HTMLElement;
    await userEvent.click(within(row).getByRole('button', { name: 'Edit' }));
    const nameInput = screen.getByLabelText('Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Ada Prime');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Ada Prime')).toBeInTheDocument();
  });

  it('shows an error state when the list request fails', async () => {
    server.use(mswHttp.get('*/api/users', () => new HttpResponse(null, { status: 500 })));
    renderWithProviders(<UsersPage />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
