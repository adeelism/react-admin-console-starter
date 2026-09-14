import { http, HttpResponse } from 'msw';
import { getAuditEntries } from './store';

export const auditLogHandlers = [
  http.get('*/api/audit-logs', ({ request }) => {
    const params = new URL(request.url).searchParams;
    const action = params.get('action');
    const actor = (params.get('actor') ?? '').toLowerCase();

    const entries = getAuditEntries()
      .filter((entry) => (action ? entry.action === action : true))
      .filter((entry) => (actor ? entry.actor.toLowerCase().includes(actor) : true))
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return HttpResponse.json(entries);
  }),
];
