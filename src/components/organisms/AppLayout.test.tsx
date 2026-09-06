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
  it('renders the nav and the routed child', () => {
    renderLayout();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('users child')).toBeInTheDocument();
  });

  it('switches role and language and toggles the theme', async () => {
    renderLayout();

    await userEvent.selectOptions(screen.getByLabelText('Role'), 'viewer');
    expect((screen.getByLabelText('Role') as HTMLSelectElement).value).toBe('viewer');

    await userEvent.selectOptions(screen.getByLabelText('language'), 'xx');
    expect(await screen.findByText('Users (xx)')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button'));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
