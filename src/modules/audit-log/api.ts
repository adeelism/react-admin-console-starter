import { http } from '../../lib/http';
import type { AuditLogEntry } from './types';

export const auditLogApi = {
  list: (params: { action?: string; actor?: string } = {}): Promise<AuditLogEntry[]> => {
    const query = new URLSearchParams();
    if (params.action) query.set('action', params.action);
    if (params.actor) query.set('actor', params.actor);
    const qs = query.toString();
    return http.get<AuditLogEntry[]>(`/audit-logs${qs ? `?${qs}` : ''}`);
  },
};
