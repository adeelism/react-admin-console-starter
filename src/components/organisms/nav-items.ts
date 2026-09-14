import { House, Users, ClipboardText, Gear, type Icon } from '@phosphor-icons/react';
import type { Permission } from '../../auth/permissions';

export interface NavItem {
  to: string;
  /** i18n key for the label. */
  labelKey: string;
  icon: Icon;
  /** When set, the item is only shown to roles holding this permission. */
  requires?: Permission;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', labelKey: 'nav.dashboard', icon: House },
  { to: '/users', labelKey: 'nav.users', icon: Users, requires: 'users:read' },
  { to: '/audit-log', labelKey: 'nav.auditLog', icon: ClipboardText, requires: 'audit-log:read' },
  { to: '/settings', labelKey: 'nav.settings', icon: Gear },
];
