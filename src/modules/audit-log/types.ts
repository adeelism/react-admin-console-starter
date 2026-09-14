export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  /** ISO-8601 timestamp. */
  createdAt: string;
  /** Field values before the change (null for creates). */
  before?: Record<string, unknown> | null;
  /** Field values after the change (null for deletes). */
  after?: Record<string, unknown> | null;
}
