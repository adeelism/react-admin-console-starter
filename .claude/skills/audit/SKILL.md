---
name: codebase-auditor
description: Full codebase quality audit for this React + TypeScript admin starter. Scans src/ against the repo standards, produces a priority-rated (HIGH/MEDIUM/LOW) report, verifies MSW coverage and test health, and returns a score out of 100. Run when asked to audit the whole codebase.
---

# Full codebase audit

Run when the user asks to audit the whole repo for quality / best practices.

## Workflow

### 1 — Signals

```bash
npm run lint          # every error and warning
npm run typecheck     # every TS error
npm run test:cov      # coverage per file + totals
```

### 2 — Folder structure

Walk `src/` and check:

1. Every module that fetches data has a `hooks.ts`/`hooks/`
2. Every module has at least one colocated `*.test.tsx`
3. Types live in the module's `types.ts`, not inline in components
4. `src/components/` holds only reusable primitives (not module-specific ones)
5. Seed/fixtures live in one file per module

### 3 — TanStack Query

- `useQuery`/`useMutation` in page/component files → **HIGH** each
- In hooks: verify `enabled`, complete query keys, all three states rendered
- Mutations invalidate cache on success

### 4 — Security / permissions

| Check                                                              | Severity |
| ----------------------------------------------------------------- | -------- |
| `ProtectedRoute` / permission gate renders regardless of role     | HIGH     |
| Viewer role can reach an edit path (not merely see a hidden button) | HIGH     |
| Hardcoded secret or API key                                        | HIGH     |
| Client/employer name, code, or identifier in this public repo      | HIGH     |

### 5 — TypeScript

- Any `any` → **HIGH** each
- Non-null `!` on a legitimately-nullable value → **MEDIUM**
- Missing return type on an exported function → **LOW**

### 6 — Styling & a11y

- Inline styles / `style={{}}` / hardcoded hex in JSX → **MEDIUM** each
- Non-Phosphor icon library imported → **MEDIUM**
- Missing focus-visible on an interactive element → **MEDIUM**

### 7 — MSW coverage

For each module: every path the `api.ts` calls has a handler; each critical route
has a success + one error path.

### 8 — i18n

Visible UI strings not wrapped in `t()` → **MEDIUM** per component; verify RTL.

## Scoring (out of 100)

| Category                  | Max | Deduction                                        |
| ------------------------- | --- | ------------------------------------------------ |
| TypeScript (no `any`)     | 15  | -3 per `any`                                       |
| Tests (meaningful, ≥80%)  | 20  | -2 per core module under gate                       |
| Query hook pattern        | 15  | -5 per inline useQuery in a page                    |
| Security / permissions    | 20  | -10 gate stub, -10 reachable edit path for viewer   |
| Styling (Tailwind-only)   | 10  | -2 per inline-style violation                       |
| MSW coverage              | 10  | -2 per missing handler                              |
| Accessibility             | 5   | -1 per missing focus/label                          |
| i18n                      | 5   | -1 per untranslated string                          |

< 70 needs work · 70–89 acceptable with fixes · ≥ 90 meets the gate.

## Return

The score, HIGH/MEDIUM/LOW counts, and the top 3 most impactful fixes first.
