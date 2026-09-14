import type { AuditLogEntry } from './types';

/**
 * The audit log is a shared in-memory store: the Users mock handlers append to it
 * on create/update/delete, and the audit-log handler reads from it. That is what
 * makes actions on one page visibly show up on the other.
 */
const seed: AuditLogEntry[] = [
  {
    id: 'a_1',
    actor: 'ada.okafor@example.com',
    action: 'user.created',
    target: 'ivan.petrov@example.com',
    createdAt: '2026-09-10T10:00:00Z',
    before: null,
    after: { name: 'Ivan Petrov', email: 'ivan.petrov@example.com', role: 'auditor' },
  },
  {
    id: 'a_2',
    actor: 'ada.okafor@example.com',
    action: 'user.updated',
    target: 'omar.haddad@example.com',
    createdAt: '2026-09-11T11:30:00Z',
    before: { status: 'active' },
    after: { status: 'suspended' },
  },
  {
    id: 'a_3',
    actor: 'aisha.bello@example.com',
    action: 'user.deleted',
    target: 'legacy.user@example.com',
    createdAt: '2026-09-12T09:15:00Z',
    before: { name: 'Legacy User', email: 'legacy.user@example.com', role: 'viewer' },
    after: null,
  },
];

let store: AuditLogEntry[] = [...seed];
let counter = store.length;

export function getAuditEntries(): AuditLogEntry[] {
  return store;
}

export function addAuditEntry(entry: Omit<AuditLogEntry, 'id' | 'createdAt'>): void {
  counter += 1;
  store = [{ ...entry, id: `a_${counter}`, createdAt: new Date().toISOString() }, ...store];
}

/** Reset mock state between tests. */
export function resetAuditStore(): void {
  store = [...seed];
  counter = store.length;
}
