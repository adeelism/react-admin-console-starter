import { useCallback, useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import type { UserListParams, UserSortField } from './types';

type UsersUrlState = {
  q: string;
  role: string;
  status: string;
  sort: string;
  order: string;
  page: number;
  pageSize: number;
};

const DEFAULTS: UsersUrlState = {
  q: '',
  role: 'all',
  status: 'all',
  sort: 'name',
  order: 'asc',
  page: 1,
  pageSize: 10,
};

export interface UsersTableParams {
  params: UserListParams;
  setSearch: (q: string) => void;
  setRole: (role: string) => void;
  setStatus: (status: string) => void;
  toggleSort: (field: UserSortField) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  reset: () => void;
  isFiltered: boolean;
}

/**
 * The Users table's state, synced to the URL. Every change except paging resets
 * to page 1 so you never land on an out-of-range page.
 */
export function useUsersTableParams(): UsersTableParams {
  const [state, setState] = useUrlState(DEFAULTS);

  const params = useMemo<UserListParams>(
    () => ({
      search: state.q,
      role: state.role as UserListParams['role'],
      status: state.status as UserListParams['status'],
      sort: state.sort as UserSortField,
      order: state.order as UserListParams['order'],
      page: state.page,
      pageSize: state.pageSize,
    }),
    [state],
  );

  const setSearch = useCallback((q: string) => setState({ q, page: 1 }), [setState]);
  const setRole = useCallback((role: string) => setState({ role, page: 1 }), [setState]);
  const setStatus = useCallback((status: string) => setState({ status, page: 1 }), [setState]);
  const setPage = useCallback((page: number) => setState({ page }), [setState]);
  const setPageSize = useCallback(
    (pageSize: number) => setState({ pageSize, page: 1 }),
    [setState],
  );
  const toggleSort = useCallback(
    (field: UserSortField) =>
      setState({
        sort: field,
        order: state.sort === field && state.order === 'asc' ? 'desc' : 'asc',
        page: 1,
      }),
    [setState, state.sort, state.order],
  );
  const reset = useCallback(() => setState(DEFAULTS), [setState]);

  const isFiltered = state.q !== '' || state.role !== 'all' || state.status !== 'all';

  return {
    params,
    setSearch,
    setRole,
    setStatus,
    toggleSort,
    setPage,
    setPageSize,
    reset,
    isFiltered,
  };
}
