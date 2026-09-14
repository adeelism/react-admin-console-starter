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

  it('creates a user through the modal and toasts on success', async () => {
    renderWithProviders(<UsersPage />);
    await screen.findByText('Ada Okafor');
    await userEvent.click(screen.getByRole('button', { name: 'Add user' }));
    await userEvent.type(screen.getByLabelText('Name'), 'New Person');
    await userEvent.type(screen.getByLabelText('Email'), 'new@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('User created')).toBeInTheDocument();
  });

  it('validates the form and disables submit until valid', async () => {
    renderWithProviders(<UsersPage />);
    await screen.findByText('Ada Okafor');
    await userEvent.click(screen.getByRole('button', { name: 'Add user' }));
    const save = screen.getByRole('button', { name: 'Save' });
    expect(save).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Name'), 'X');
    await userEvent.type(screen.getByLabelText('Email'), 'bad');
    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
    expect(save).toBeDisabled();
    await userEvent.clear(screen.getByLabelText('Email'));
    await userEvent.type(screen.getByLabelText('Email'), 'good@example.com');
    await waitFor(() => expect(save).toBeEnabled());
  });

  it('toasts an error when creation fails', async () => {
    server.use(mswHttp.post('*/api/users', () => new HttpResponse(null, { status: 500 })));
    renderWithProviders(<UsersPage />);
    await screen.findByText('Ada Okafor');
    await userEvent.click(screen.getByRole('button', { name: 'Add user' }));
    await userEvent.type(screen.getByLabelText('Name'), 'New Person');
    await userEvent.type(screen.getByLabelText('Email'), 'new@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Something went wrong. Please try again.')).toBeInTheDocument();
  });

  it('edits a user through the modal', async () => {
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

  it('deletes a user after confirmation', async () => {
    renderWithProviders(<UsersPage />);
    await screen.findByText('Ada Okafor');
    await userEvent.type(screen.getByLabelText('Search'), 'ivan');
    const row = (await screen.findByText('Ivan Petrov')).closest('tr') as HTMLElement;
    await userEvent.click(within(row).getByRole('button', { name: 'Delete' }));
    const dialog = await screen.findByRole('dialog');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(screen.queryByText('Ivan Petrov')).not.toBeInTheDocument());
  });

  it('bulk-deletes selected rows after confirmation', async () => {
    renderWithProviders(<UsersPage />);
    await screen.findByText('Ada Okafor');
    await userEvent.type(screen.getByLabelText('Search'), 'ada');
    const row = (await screen.findByText('Ada Okafor')).closest('tr') as HTMLElement;
    await userEvent.click(within(row).getByRole('checkbox'));
    await userEvent.click(screen.getByRole('button', { name: 'Delete selected' }));
    const dialog = await screen.findByRole('dialog');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete selected' }));
    await waitFor(() => expect(screen.queryByText('Ada Okafor')).not.toBeInTheDocument());
  });

  it('hides create, selection, and row actions for a viewer', async () => {
    renderWithProviders(<UsersPage />, { user: viewer });
    await screen.findByText('Ada Okafor');
    expect(screen.queryByRole('button', { name: 'Add user' })).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('shows an error state when the list request fails', async () => {
    server.use(mswHttp.get('*/api/users', () => new HttpResponse(null, { status: 500 })));
    renderWithProviders(<UsersPage />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
