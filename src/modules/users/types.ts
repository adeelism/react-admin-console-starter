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
