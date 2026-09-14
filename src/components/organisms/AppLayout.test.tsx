import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../auth/AuthProvider';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { AppLayout } from './AppLayout';

function renderLayout() {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={['/users']}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/users" element={<div>users child</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </ThemeProvider>,
  );
}

describe('AppLayout', () => {
  it('renders the sidebar nav and the routed child', () => {
    renderLayout();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('users child')).toBeInTheDocument();
  });

  it('hides nav items the current role cannot access', async () => {
    renderLayout();
    // Admin (default) sees the audit log link…
    expect(screen.getByRole('link', { name: 'Audit log' })).toBeInTheDocument();
    // …a viewer, who lacks audit-log:read, does not.
    await userEvent.selectOptions(screen.getByLabelText('Role'), 'viewer');
    expect(screen.queryByRole('link', { name: 'Audit log' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Users' })).toBeInTheDocument();
  });

  it('switches language and toggles the theme', async () => {
    renderLayout();

    await userEvent.selectOptions(screen.getByLabelText('Language'), 'xx');
    expect((await screen.findAllByText('Users (xx)')).length).toBeGreaterThan(0);

    await userEvent.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
