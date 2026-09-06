import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './components/organisms/AppLayout';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Spinner } from './components/atoms/Spinner';

const UsersPage = lazy(() => import('./modules/users/pages/UsersPage'));
const AuditLogPage = lazy(() => import('./modules/audit-log/pages/AuditLogPage'));

function lazyRoute(node: ReactNode): ReactNode {
  return <Suspense fallback={<Spinner />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/users" replace /> },
      {
        path: 'users',
        element: lazyRoute(
          <ProtectedRoute requires="users:read">
            <UsersPage />
          </ProtectedRoute>,
        ),
      },
      {
        path: 'audit-log',
        element: lazyRoute(
          <ProtectedRoute requires="audit-log:read">
            <AuditLogPage />
          </ProtectedRoute>,
        ),
      },
    ],
  },
]);
