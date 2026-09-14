import { type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider';
import { ThemeProvider } from '../theme/ThemeProvider';
import { ToastProvider } from '../components/toast/ToastProvider';
import { createQueryClient } from '../lib/queryClient';
import type { AuthUser } from '../auth/auth-context';

interface Options extends Omit<RenderOptions, 'wrapper'> {
  user?: AuthUser;
  route?: string;
}

/** Renders a component inside the app's providers, with an optional seeded user. */
export function renderWithProviders(ui: ReactElement, options: Options = {}) {
  const { user, route = '/', ...rest } = options;
  const queryClient = createQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider initialUser={user}>
            <ToastProvider>
              <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...rest });
}
