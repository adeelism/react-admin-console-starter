import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../auth/AuthProvider';
import { ThemeProvider } from '../../theme/ThemeProvider';
import i18n from '../../i18n';
import { AppLayout } from './AppLayout';

// i18n is a singleton shared across tests; reset language and the document it
// mutated so a switch in one test can't leak into the next.
afterEach(() => {
  void i18n.changeLanguage('en');
  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';
});

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

  it('toggles the theme and switches language to Arabic (RTL)', async () => {
    renderLayout();

    // Toggle the theme first, while its aria-label is still English.
    await userEvent.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(document.documentElement.dataset.theme).toBe('dark');

    // Switching to Arabic translates the nav and flips the document direction.
    await userEvent.selectOptions(screen.getByLabelText('Language'), 'ar');
    expect((await screen.findAllByText('المستخدمون')).length).toBeGreaterThan(0);
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
  });
});
