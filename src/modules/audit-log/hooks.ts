import { useQuery } from '@tanstack/react-query';
import { auditLogApi } from './api';

export function useAuditLog(params: { action: string; actor: string }) {
  return useQuery({
    queryKey: ['audit-log', params],
    queryFn: () =>
      auditLogApi.list({ action: params.action || undefined, actor: params.actor || undefined }),
  });
}
