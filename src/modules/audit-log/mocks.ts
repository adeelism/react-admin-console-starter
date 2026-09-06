import { http, HttpResponse } from 'msw';
import type { AuditLogEntry } from './types';

const entries: AuditLogEntry[] = [
  {
    id: 'a_1',
    actor: 'ada@example.com',
    action: 'user.created',
    target: 'u_2',
    createdAt: '2026-01-02T10:00:00Z',
  },
  {
    id: 'a_2',
    actor: 'ada@example.com',
    action: 'user.updated',
    target: 'u_2',
    createdAt: '2026-01-03T11:30:00Z',
  },
  {
    id: 'a_3',
    actor: 'ivan@example.com',
    action: 'user.deleted',
    target: 'u_3',
    createdAt: '2026-01-04T09:15:00Z',
  },
];

export const auditLogHandlers = [
  http.get('*/api/audit-logs', ({ request }) => {
    const action = new URL(request.url).searchParams.get('action');
    const result = action ? entries.filter((entry) => entry.action.includes(action)) : entries;
    return HttpResponse.json(result);
  }),
];
