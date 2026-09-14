# Engineering standards — react-admin-console-starter

Canonical coding standards for this repo. The `.claude/skills/` directory holds
the detailed, activatable versions of each rule; this file is the summary an
agent (or a human) should read first.

> This is a **public reference repo**. Keep it clean-room: no client or employer
> code, file names, identifiers, or secrets — ever. It is also a **starter**, so
> favour small, readable, dependency-light code over cleverness.

## Stack

React 19 · TypeScript (strict, **no `any`**) · Vite 6 · React Router 7 ·
TanStack Query v5 · Tailwind CSS v4 · MSW v2 · i18next · Vitest + React Testing
Library · Phosphor Icons · React Hook Form + Zod.

**No component library** (no MUI / Ant / Chakra) — UI primitives live in
`src/components/`. Global state is **React Context** (auth, theme); this starter
does not use Redux/RTK or Zustand.

## Hard rules

1. **TypeScript only, no `any`.** Use generics, `unknown` + narrowing, or precise types. No new `.js`/`.jsx`.
2. **No inline styles.** Tailwind utility classes only — no `style={{}}`, no `React.CSSProperties` constants, no `onMouseEnter` style mutation, no hardcoded hex in JSX. See `.claude/skills/no-inline-styles`.
3. **Design tokens in one file.** Palette, radii, and spacing are defined in `src/theme/theme.css` (`@theme`). One accent colour for primary actions and active nav only; status colours are separate and semantic. Both light and dark are deliberately designed.
4. **Server state via TanStack Query hooks, isolated.** `useQuery`/`useMutation`/`useQueryClient` never appear in a page or component file — they live in the module's `hooks.ts` (or `hooks/`). Mutations invalidate in the hook's `onSuccess`; UI feedback (toasts, close modal) goes in the caller's `mutate(..., { onSuccess })`. Every data fetch renders loading, error, and empty states. See `.claude/skills/query-hooks`.
5. **One typed HTTP client.** All requests go through `src/lib/http.ts`. The data layer is mock/in-memory behind that client via MSW, so swapping in a real backend is a one-file change. Filtering/sorting/pagination run against the mock but stay behind the typed boundary.
6. **MSW v2 only** (`http.*`, `HttpResponse`). One success path and at least one error path per critical route. Fixtures/seed live in an obvious single file per module. Mocks never ship to production (gated by `import.meta.env.DEV` + dynamic `import()`). See `.claude/skills/msw`.
7. **Components stay small.** ≤ ~80 lines per component body; extract list-item renderers and anything reused or stateful to its own file. No component defined inside another. Memoize only when it earns its keep. See `.claude/skills/react-component-quality`.
8. **i18n.** User-visible strings go through `t()` (react-i18next). Ships EN and AR with full RTL.
9. **Accessibility is not optional.** Keyboard navigable, visible focus rings, real labels, `aria-*` where needed, respects `prefers-reduced-motion`.
10. **Tests colocated and meaningful.** Test the parts that carry judgement — permission logic, the URL-sync hook, filtering/sorting — not coverage theatre. CI gate is ≥ 80% (`vitest --coverage`); aim higher on core logic.

## Folder structure

```
src/
├── auth/            # permission model + React Context (permissions.ts is the config)
├── components/      # UI primitives: atoms / molecules / organisms (no component lib)
├── lib/             # http.ts (the one API boundary), queryClient.ts
├── mocks/           # MSW server/browser + registry; seed data lives per module
├── modules/<name>/  # api.ts · hooks.ts · pages/ · components/ · types.ts · mocks.ts · *.test.tsx
├── theme/           # theme.css (tokens), ThemeProvider, ThemeToggle
└── i18n/            # init + locales/
```

A developer cloning this must be able to find, within a minute: the **seed file**,
the **permission config** (`src/auth/permissions.ts`), and the **API boundary**
(`src/lib/http.ts`).

## Quality gates (run before calling anything done)

```bash
npm run lint       # 0 errors, 0 warnings
npm run typecheck  # 0 errors
npm run test       # green
npm run build      # clean
```
