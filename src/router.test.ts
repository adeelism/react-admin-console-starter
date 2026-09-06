import { describe, expect, it } from 'vitest';
import { router } from './router';

describe('router', () => {
  it('defines the root layout with users and audit-log routes', () => {
    expect(router.routes).toHaveLength(1);
    const children = router.routes[0].children ?? [];
    const paths = children.map((route) => route.path ?? (route.index ? 'index' : ''));
    expect(paths).toContain('users');
    expect(paths).toContain('audit-log');
    expect(paths).toContain('index');
  });
});
