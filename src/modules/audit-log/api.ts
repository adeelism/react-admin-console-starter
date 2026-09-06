import { http } from '../../lib/http';
import type { AuditLogEntry } from './types';

export const auditLogApi = {
  list: (params?: { action?: string }): Promise<AuditLogEntry[]> => {
    const query = params?.action ? `?action=${encodeURIComponent(params.action)}` : '';
    return http.get<AuditLogEntry[]>(`/audit-logs${query}`);
  },
};
