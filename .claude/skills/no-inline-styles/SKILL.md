---
name: no-inline-styles
description: Enforces Tailwind-only styling in React components. Detects style={{}}, CSSProperties objects, onMouseEnter/onMouseLeave style mutations, and hardcoded hex/px values. Produces a Blocking list with file/line and a Tailwind replacement for each. Activate when reviewing or writing any JSX in this codebase.
---

# No Inline Styles

This project styles **exclusively with Tailwind CSS v4** utility classes. Inline
styles break the design-token system, can't be themed, and drift from the scale.

## Rule

> **Never** use `style={{}}`, `React.CSSProperties` constant objects, hardcoded
> hex/px in JSX, or `onMouseEnter`/`onMouseLeave` style mutation. Use Tailwind
> classes and the design tokens defined in `src/theme/theme.css`.

## Detection checklist (all Blocking unless noted)

| Pattern                          | Wrong                                                      |
| -------------------------------- | ---------------------------------------------------------- |
| `style={{` on a JSX element      | `<div style={{ color: 'red' }}>`                           |
| `React.CSSProperties` constant   | `const S: React.CSSProperties = { … }`                     |
| `e.currentTarget.style.X =`      | `onMouseEnter={(e) => (e.currentTarget.style.bg = …)}`     |
| Hardcoded hex in JSX             | `className="text-[#1a8a5a]"` — use a token instead         |
| `display:'flex'; gap` inline     | `style={{ display: 'flex', gap: 12 }}`                     |

## Correct patterns

```tsx
// Layout
<div className="flex items-center gap-3">
// Design tokens (defined in theme.css @theme → available as utilities)
<div className="bg-surface text-muted rounded-md border border-border">
// Status (semantic tokens, not the accent)
<span className="bg-success-subtle text-success">Active</span>
// Hover (no JS mutation)
<button className="bg-accent hover:bg-accent-hover text-on-accent">
// Focus (accessibility — always keep a visible ring)
<button className="focus-visible:outline-2 focus-visible:outline-accent">
```

## Common conversions

- `marginBottom: 24` → `mb-6`  ·  `paddingTop: 8` → `pt-2`  ·  `width:'100%'` → `w-full`
- `whiteSpace:'nowrap'` → `whitespace-nowrap`  ·  `flexShrink:0` → `shrink-0`
- `overflow:'hidden'; textOverflow:'ellipsis'` → `overflow-hidden text-ellipsis`

Spacing follows the 4px scale (`gap-1`=4px, `gap-2`=8px, `p-4`=16px, `p-6`=24px).

## Report format

```
BLOCKING — Inline styles found
  UsersPage.tsx:78  style={{ background: 'var(--color-card)', borderRadius: 12 }}
                    → className="bg-card rounded-md"
```
