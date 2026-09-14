import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthUser } from './auth-context';
import { permissionsForRole, type Permission, type Role } from './permissions';

const DEFAULT_USER: AuthUser = { id: 'u_1', name: 'Ada Okafor', role: 'admin' };

/**
 * Holds the current user and derives their permissions. In a real app the user
 * would come from an auth backend; here a role switcher lets you demonstrate the
 * permission gating. The `IdentityProvider` from the backend starter can slot in
 * behind this later without changing consumers.
 */
export function AuthProvider({
  children,
  initialUser = DEFAULT_USER,
}: {
  children: ReactNode;
  initialUser?: AuthUser;
}) {
  const [user, setUser] = useState<AuthUser>(initialUser);

  const setRole = useCallback((role: Role) => {
    setUser((prev) => ({ ...prev, role }));
  }, []);

  const can = useCallback(
    (permission: Permission) => permissionsForRole(user.role).includes(permission),
    [user.role],
  );

  const value = useMemo(() => ({ user, can, setRole }), [user, can, setRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
