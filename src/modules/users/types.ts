export type UserRole = 'admin' | 'auditor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
}
