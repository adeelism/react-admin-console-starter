# Spec: Module-first admin console

- **Status:** implemented
- **Owner:** Muhammad Adeel

## 1. Summary

An admin console shell that hosts feature modules. Each module owns its routes, data
access, and mocks. Access to a module and to write actions within it is gated by the
current user's role. The shell provides navigation, a role switcher (to demonstrate
gating), language switching, and a light/dark theme.

## 2. User stories

| ID | As a… | I want to… | So that… |
| --- | --- | --- | --- |
| US-01 | operator | see only the modules and actions my role allows | I cannot perform actions I lack rights for |
| US-02 | admin | list, create, edit, and delete users | I can manage accounts |
| US-03 | auditor | read and filter the audit log | I can review activity |
| US-04 | developer | mock any subset of modules | I can build one module without a full backend |

## 3. Acceptance criteria

| ID | Story | Given / When / Then |
| --- | --- | --- |
| AC-01 | US-01 | Given a viewer, when they open Users, then the list shows but create/edit/delete are hidden. |
| AC-02 | US-01 | Given a user without a route's permission, when they navigate there, then a "no permission" notice shows instead of the page. |
| AC-02b | US-02 | Given an admin, when they submit the create form, then the new user appears in the list. |
| AC-03 | US-02 | Given an admin, when they edit a user, then the row reflects the change. |
| AC-04 | US-02 | Given an admin, when they delete a user, then the row disappears. |
| AC-05 | US-03 | Given audit entries, when a filter term is typed, then only matching actions remain. |
| AC-06 | US-04 | Given `VITE_MOCK_MODULES=users`, when the app loads, then only the users module is served by mocks. |
| AC-07 | US-01 | Given any list request fails, then an error state is shown, not a blank page. |

## 4. Business rules

- **BR-01:** Role → permission mapping — admin: all; auditor: read users + read audit-log;
  viewer: read users only.
- **BR-02:** A route requires exactly one permission; a page may additionally gate actions.
- **BR-03:** Every API call goes through the single HTTP client; non-2xx responses raise a
  typed `HttpError` carrying the status.
- **BR-04:** Mock activation is per module and driven by env (`VITE_ENABLE_MOCKS`,
  `VITE_MOCK_MODULES`); `all` enables every module.

## 5. Modules

- **users** — table of users; create/edit/delete gated by `users:write`.
- **audit-log** — read-only, client-driven filter by action substring.

## 6. Cross-cutting

- i18n via i18next (`en` plus an `xx` stub proving fallback).
- Theme via CSS variables toggled on `document.documentElement[data-theme]`.
- Routes are lazy-loaded and code-split.

## 7. Out of scope

- Real authentication / a login screen (the role switcher stands in).
- Server-side pagination and sorting.
- Persisting theme or language across reloads.

## 8. Open questions

None.
