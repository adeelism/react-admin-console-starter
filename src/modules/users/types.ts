export type UserRole = 'admin' | 'editor' | 'auditor' | 'viewer';

export type UserStatus = 'active' | 'invited' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  /** ISO-8601 timestamp. */
  createdAt: string;
  /** ISO-8601 timestamp, or null for users who have never signed in. */
  lastActiveAt: string | null;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
}

export type UserSortField = 'name' | 'email' | 'role' | 'status' | 'createdAt' | 'lastActiveAt';

export type SortOrder = 'asc' | 'desc';

/**
 * The query the table sends to the server. The mock layer honours all of these,
 * so swapping in a real paginated endpoint needs no page changes.
 */
export interface UserListParams {
  search: string;
  role: UserRole | 'all';
  status: UserStatus | 'all';
  sort: UserSortField;
  order: SortOrder;
  page: number;
  pageSize: number;
}

export interface UserListResponse {
  data: User[];
  /** Total rows matching the filters, before pagination. */
  total: number;
}
