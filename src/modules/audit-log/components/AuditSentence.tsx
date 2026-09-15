import { Trans } from 'react-i18next';
import type { ReactElement } from 'react';

// Known actions get a dedicated template so the verb is baked into the sentence
// (and can be positioned per language); anything else falls back to `generic`,
// which interpolates the raw action string as the verb.
const ACTION_SLUG: Record<string, 'created' | 'updated' | 'deleted'> = {
  'user.created': 'created',
  'user.updated': 'updated',
  'user.deleted': 'deleted',
};

interface AuditSentenceProps {
  actor: string;
  target: string;
  action: string;
}

/**
 * Renders "<actor> created <target>" as one interpolated, translatable sentence
 * rather than fragment-joined spans, so Arabic can reorder actor / verb / target
 * naturally. The two slots keep actor and target bold; `<bdi>` isolates them from
 * the surrounding bidi context (names and emails may run either direction).
 */
export function AuditSentence({ actor, target, action }: AuditSentenceProps): ReactElement {
  const slug = ACTION_SLUG[action] ?? 'generic';
  return (
    <Trans
      i18nKey={`auditLog.sentence.${slug}`}
      values={{ actor, target, action }}
      components={[<bdi className="font-medium" />, <bdi className="font-medium" />]}
    />
  );
}
