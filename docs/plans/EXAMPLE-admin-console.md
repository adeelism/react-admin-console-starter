# Plan: Module-first admin console

- **Spec:** `docs/specs/EXAMPLE-admin-console.md`
- **Status:** done

## 1. Approach

A shell (`AppLayout` + `createBrowserRouter` with lazy routes) hosts feature modules under
`src/modules/<name>/`. `AuthProvider` derives permissions from a role; `ProtectedRoute`
gates each route and pages gate write actions via `can()`. Data flows Page → query hooks →
`api.ts` → the single `http` client. MSW handlers live with each module and are registered
either in the browser (per-module, env-driven) or wholesale in tests.

## 2. Acceptance-criteria coverage

| AC | Where satisfied | Test |
| --- | --- | --- |
| AC-01 | `UsersPage` `canWrite` gating | UsersPage "hides the create form … for a viewer" |
| AC-02 | `ProtectedRoute` | ProtectedRoute "blocks … lacks the permission" |
| AC-02b | `useCreateUser` + form | UsersPage "creates a user" |
| AC-03 | `useUpdateUser` + edit flow | UsersPage "edits an existing user" |
| AC-04 | `useDeleteUser` | UsersPage "deletes a user" |
| AC-05 | `useAuditLog` + filter input | AuditLogPage "filters entries by action" |
| AC-06 | `enabledModulesFromEnv` / `handlersForModules` | registry tests |
| AC-07 | page `isError` branch | UsersPage / AuditLogPage "error state" |

## 3. Components / file tree

```text
src/lib/http.ts · queryClient.ts
src/auth/{AuthProvider,useAuth,ProtectedRoute,permissions,auth-context}
src/theme/{ThemeProvider,useTheme,ThemeToggle,theme-context,theme.css}
src/components/{atoms,molecules,organisms}
src/mocks/{registry,browser,server}
src/modules/users/{pages,api,hooks,mocks,types}
src/modules/audit-log/{pages,api,hooks,mocks,types}
src/{App,router,main}.tsx · src/i18n
```

## 4. Routing

`createBrowserRouter` with an `AppLayout` parent and lazy children. `/` redirects to
`/users`. Each child wraps its lazy page in `<Suspense>` and `<ProtectedRoute requires=…>`.

## 5. Data layer

`http` exposes `get/post/patch/delete`, prepends `VITE_API_BASE_URL`, and throws `HttpError`
on non-2xx. Query hooks use a stable key per entity and invalidate on mutation success.

## 6. Test strategy

- **Unit:** http client (via MSW), permission map, registry, guard, table, button, theme.
- **Integration:** each page against MSW (list, create, edit, delete, filter, error, and
  permission gating), plus the layout's role/language/theme controls.
- Node's fetch needs an absolute base URL, so tests set `VITE_API_BASE_URL` to
  `http://localhost/api`; handlers match any origin.
- Coverage gate 80%; achieved ~99% lines / ~96% branches.

## 7. Decisions and trade-offs

- **Data router (`createBrowserRouter`).** Not rendered in unit tests — its client-side
  navigation fetch conflicts with MSW under jsdom. Covered instead via `AppLayout` +
  router-config + page tests; `App.tsx` is excluded from coverage as pure composition.
- **MSW as one mock source** for browser and tests, so mocks and tests can't diverge.
- **Module-first layout** trades a little per-module boilerplate for local, low-conflict
  changes as the app grows.

## 8. Out of scope / follow-ups

Real auth/login, server-side pagination, persisting theme/language, a third example module.
