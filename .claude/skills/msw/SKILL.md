---
name: msw
description: Mock Service Worker (MSW v2) conventions for this starter. The mock/in-memory layer is the app's data source and sits behind the typed HTTP client so a real backend is a one-file swap. Covers handler location, typed responses, seed/fixture placement, success + error coverage, and keeping mocks out of the production bundle. Activate when adding or reviewing data endpoints or mock handlers.
---

# MSW v2

This starter has **no backend**. MSW v2 provides the data layer behind the single
typed client in `src/lib/http.ts`, so swapping in a real API means changing that
one file — not the pages.

## Layout

```
src/mocks/
├── browser.ts      # enableMocking() — gated behind import.meta.env.DEV + dynamic import()
├── server.ts       # Node server for tests
└── registry.ts     # collects each module's handlers
src/modules/<m>/
├── api.ts          # typed calls through lib/http.ts
├── mocks.ts        # this module's handlers + seed/fixture data (the obvious swap point)
└── types.ts        # request/response types the handlers reuse
```

## Rules

- **MSW v2 only** — `http.*`, `HttpResponse`. Never `rest.*` / `res(ctx.*)`.
- Handlers import request/response types from the module's `types.ts` — never redeclare inline.
- Responses match the shape the typed client expects — no drift from the contract.
- **Seed data lives in one obvious file per module** (`mocks.ts`), so anyone cloning can swap it.
- Cover a **success path** and **at least one error path** per critical route where the UI has failure states.
- Any mock token is obviously fake (`mock-token-*`) — never resembles a real one.
- **Never ship mocks to production**: `browser.ts` guards with `import.meta.env.DEV` and a dynamic `import()`, so the MSW bundle is absent from `dist/` (verify with `grep -r msw dist/` → nothing).

## Handler example

```ts
// src/modules/users/mocks.ts
import { http, HttpResponse } from 'msw';
import type { User } from './types';

export const usersSeed: User[] = [ /* single source of seed rows */ ];

export const usersHandlers = [
  http.get('*/api/users', () => HttpResponse.json({ data: usersSeed })),
  http.post('*/api/users', async ({ request }) => {
    const body = await request.json();
    if (!body) return HttpResponse.json({ message: 'Invalid' }, { status: 422 });
    return HttpResponse.json({ data: /* created */ }, { status: 201 });
  }),
];
```

## Output when adding mocks

Report a route-coverage table (`Method | Path | Status codes`) plus verification
(`typecheck`, `lint`, prod-bundle grep) so error coverage is visible at a glance.
