import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { useUrlState } from './useUrlState';

const DEFAULTS: { q: string; page: number } = { q: '', page: 1 };

function Probe() {
  const [state, setState] = useUrlState(DEFAULTS);
  const location = useLocation();
  return (
    <div>
      <span data-testid="q">{state.q || 'empty'}</span>
      <span data-testid="page">{state.page}</span>
      <span data-testid="search">{location.search || 'none'}</span>
      <button onClick={() => setState({ q: 'ada' })}>set-q</button>
      <button onClick={() => setState({ page: 2 })}>set-page</button>
      <button onClick={() => setState({ q: '' })}>clear-q</button>
    </div>
  );
}

function renderProbe(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Probe />
    </MemoryRouter>,
  );
}

describe('useUrlState', () => {
  it('reads initial values from the query string and coerces numbers', () => {
    renderProbe('/?q=ivan&page=3');
    expect(screen.getByTestId('q').textContent).toBe('ivan');
    expect(screen.getByTestId('page').textContent).toBe('3');
  });

  it('writes to the URL and omits values equal to the default', async () => {
    renderProbe('/');
    await userEvent.click(screen.getByText('set-q'));
    expect(screen.getByTestId('q').textContent).toBe('ada');
    expect(screen.getByTestId('search').textContent).toContain('q=ada');

    await userEvent.click(screen.getByText('set-page'));
    expect(screen.getByTestId('page').textContent).toBe('2');

    await userEvent.click(screen.getByText('clear-q'));
    expect(screen.getByTestId('search').textContent).not.toContain('q=');
  });
});
