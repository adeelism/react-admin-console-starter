---
name: review-reactjs-code
description: >
  File or module-level review for React/TypeScript in this starter. Walks lint, typecheck,
  tests, DRY, no `any`, the single HTTP client, MSW mocking, Tailwind-only styling, t() i18n,
  the TanStack Query hook pattern, accessibility, and folder structure. Produces a
  Blocking / Warnings / Suggestions report.

  SCOPE: a specific component, hook, page, or module. For a full branch/PR use `code-reviewer`.

  Trigger: "review this component / hook / file", "check this page", "audit this module".
---

# Review React / TypeScript code

Systematic review of a specific file or module against this repo's standards.

## Workflow

1. **Scope** — the file(s)/module named. If unclear, ask.
2. **Signals** — run and summarise:
   ```bash
   npm run lint       # 0 errors, 0 warnings
   npm run typecheck  # 0 errors
   npm run test       # green (npm run test:cov for coverage)
   ```
3. **Checklist** — walk [checklist.md](checklist.md) against the changed files, noting file/line gaps.
4. **Report** — Blocking / Warnings / Suggestions, tagged with a category
   (Correctness, TypeScript, Testing, DRY, API client, MSW, i18n, Styling,
   Performance, Accessibility, Architecture, TanStack Query, Folder Structure).

## Competency quick-reference

| Area        | Expectation                                                                       |
| ----------- | --------------------------------------------------------------------------------- |
| Lint        | 0 errors, 0 warnings                                                               |
| Types       | TypeScript only; **no `any`**                                                       |
| Tests       | Colocated; meaningful on core logic (permissions, url-sync hook, filtering); ≥80% gate |
| API calls   | Single typed client in `src/lib/http.ts`                                            |
| Mocking     | MSW v2 (`http.*`, `HttpResponse`); success + one error path per critical route      |
| Styling     | Tailwind classes only; no inline CSS; no `!important`; tokens from `theme.css`       |
| Icons       | Phosphor Icons only                                                                 |
| i18n        | User-visible strings wrapped in `t()`; EN + AR (RTL)                                |
| Server state| TanStack Query hooks in `hooks.ts` — never inline in pages/components               |
| A11y        | Keyboard nav, visible focus, labels, `aria-*`, `prefers-reduced-motion`             |
| UX states   | Loading (skeleton) / error (retry) / empty rendered for every fetch                 |

## Notes for this starter

- Global state is **React Context** (auth, theme) — there is no Redux/RTK or Zustand here; don't flag their absence.
- Data lists filter/sort/paginate against the mock layer, but stay behind the typed client so the boundary can become server-side without touching pages.
- Keep it a **starter**: flag unjustified dependencies and over-engineering as Warnings.
