import { createContext } from 'react';
import type { Permission, Role } from './permissions';

export interface AuthUser {
  id: string;
  name: string;
  role: Role;
}

export interface AuthState {
  user: AuthUser;
  can: (permission: Permission) => boolean;
  setRole: (role: Role) => void;
}

export const AuthContext = createContext<AuthState | null>(null);
