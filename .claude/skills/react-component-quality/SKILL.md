---
name: react-component-quality
description: Reviews React component design for size, co-location, memoization, and re-render hygiene. Flags large inline components (>80 lines), missing extractions, unstable references passed as props, and missing React.memo/useCallback/useMemo where warranted. Activate when writing or reviewing component files, or when a user reports sluggish UI or unnecessary re-renders.
---

# React Component Quality

Component extraction, composition hygiene, and re-render prevention for this
starter (React 19, TypeScript strict, Tailwind CSS v4, no component library).

## Rules (Blocking unless noted)

| Rule                         | Threshold                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------- |
| Component size               | **≤ 80 lines** per component function body                                                   |
| Inline component definitions | **Forbidden** — never define a component inside another, or in a page file (except a <10-line trivial helper) |
| Prop drilling                | Max **2 levels** before lifting to a hook or context                                         |
| Unstable object/array props  | `{}` / `[]` literals created inline in JSX and passed to a memoized child — **Blocking**; hoist or `useMemo` |
| Inline arrow handlers        | Fine for simple setters; **Blocking** when non-trivial or passed to a memoized list child    |
| Missing `React.memo`         | **Warning** on pure display components that are siblings to frequently-updating state         |

## Extraction rule

Extract a component to its own file when **any** is true:

1. Its body exceeds **80 lines**
2. It is used in more than one place
3. It manages its own local state
4. It is a **list-item renderer** (always extract — the list parent re-renders on data change)

Target paths in this repo:

```
src/modules/<module>/components/<ComponentName>.tsx
src/components/<atoms|molecules|organisms>/<ComponentName>.tsx   ← if reused across modules
```

## Re-render hygiene

```tsx
// Blocking — new array each render, breaks memo on the child
<DataTable columns={[{ key: 'name' }]} />
// Correct — hoist a constant, or useMemo when it depends on state
const COLUMNS = [{ key: 'name' }] // module scope
const columns = useMemo(() => [...], [dep])

// Blocking — anonymous handler to a memoized child changes every render
<DataTable onSort={() => setSort((s) => !s)} />
// Correct
const handleSort = useCallback(() => setSort((s) => !s), [])
```

Prefer selecting only what you need from context; a component that reads a
whole context object re-renders on any field change.

## Memoization guide

- `React.memo` — pure display component with stable props inside a busy parent.
- `useMemo` — a derived value that is expensive, or an array/object passed to a memoized child.
- `useCallback` — a handler passed to a `React.memo` child, or used as a hook dependency.

Do **not** memoize pre-emptively. Add it only after a real re-render problem is
confirmed (React DevTools Profiler).

## Report format

```
BLOCKING — Component too large / not extracted
  UsersPage.tsx:40   UsersTable (150 lines) defined inline in page file
                     → extract to src/modules/users/components/UsersTable.tsx
WARNING — Missing React.memo
  UserRow.tsx:1      pure row renderer inside a frequently-updating table
```
