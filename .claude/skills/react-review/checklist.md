# React / TypeScript review checklist

Walk each section against the changed files.

## 1 — Tooling & tests

- [ ] Lint: **0** errors, **0** warnings (`npm run lint`)
- [ ] `npm run typecheck` passes with **0** errors
- [ ] Meaningful tests on changed core logic; coverage gate **≥ 80%** (`npm run test:cov`)
- [ ] Prettier-formatted (`npm run format`)
- [ ] **DRY** — no needless duplication

## 2 — TypeScript & correctness

- [ ] TypeScript only; **no `any`** (use generics / `unknown` + narrowing)
- [ ] Types align with the module's `types.ts` / the API contract
- [ ] Effects/hooks have correct dependencies; no stale closures
- [ ] Loading, error, and empty states handled for every user-facing fetch

## 3 — TanStack Query

- [ ] `useQuery`/`useMutation`/`useQueryClient` live in `hooks.ts` — never inline in pages/components
- [ ] Query keys include all variables the query depends on
- [ ] `enabled` guard when the key has a maybe-undefined param
- [ ] Mutations invalidate/update cache on success — no stale reads after writes

## 4 — API & mocking

- [ ] All requests go through `src/lib/http.ts`
- [ ] MSW v2 (`http.*`, `HttpResponse`); handlers reuse `types.ts`
- [ ] Success + at least one error path per critical route
- [ ] Seed/fixtures in the module's single `mocks.ts`
- [ ] Mocks excluded from the production bundle

## 5 — Styling & UI

- [ ] **No inline styles** — Tailwind classes only; no `!important`
- [ ] Colours come from `theme.css` tokens; one accent, semantic status colours
- [ ] Light and dark both look deliberate
- [ ] Large components split; reused UI moved to `src/components/`
- [ ] **Phosphor Icons** only

## 6 — Accessibility

- [ ] Keyboard navigable; visible focus rings
- [ ] Labels on inputs; `aria-*` where semantics need it
- [ ] Respects `prefers-reduced-motion`

## 7 — i18n

- [ ] User-visible strings use `t()` — no raw literals in JSX
- [ ] Works in EN and AR (RTL) — layout doesn't break under RTL

## 8 — Security & config

- [ ] No hardcoded secrets — `import.meta.env.*` only
- [ ] Permission checks use the real role, not a stub that always passes
- [ ] No client/employer code, names, or identifiers (public repo)

## 9 — Folder structure

- [ ] Module fetching data has a `hooks.ts`/`hooks/`
- [ ] Module has at least one colocated `*.test.tsx`
- [ ] Types in `types.ts` — not inline in components
- [ ] Module-specific components stay in the module; only reusable ones in `src/components/`
