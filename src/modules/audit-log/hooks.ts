import { useQuery } from '@tanstack/react-query';
import { auditLogApi } from './api';

export function useAuditLog(action: string) {
  return useQuery({
    queryKey: ['audit-log', { action }],
    queryFn: () => auditLogApi.list(action ? { action } : undefined),
  });
}
