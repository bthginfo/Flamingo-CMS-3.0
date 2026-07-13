import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('product foundations admin semantics', () => {
  it('keeps Content Health summaries free of nested interactive links', () => {
    const source = readFileSync(new URL('../app/admin/content-health/page.tsx', import.meta.url), 'utf8');
    const summaries = [...source.matchAll(/<summary\b[\s\S]*?<\/summary>/g)].map(match => match[0]);
    assert.ok(summaries.length > 0);
    assert.ok(summaries.every(summary => !summary.includes('<Link')));
    assert.match(source, /<\/summary>\s*<div[^>]*>[\s\S]*?<Link href=\{group\.href\}/);
  });

  it('offers retry and a safe escape from the Content Health error state', () => {
    const source = readFileSync(new URL('../app/admin/content-health/page.tsx', import.meta.url), 'utf8');
    assert.match(source, /Prüfung nicht verfügbar/);
    assert.match(source, /<RefreshContentHealthButton \/>/);
    assert.match(source, /<Link href="\/admin"/);
  });

  it('places profile readiness before the form on mobile and uses a saved baseline', () => {
    const source = readFileSync(new URL('../app/admin/business-profile/profile-form.tsx', import.meta.url), 'utf8');
    assert.match(source, /savedBaseline\.current = businessProfileFingerprint\(result\.profile\);\s*setProfile\(result\.profile\)/);
    assert.match(source, /<aside className="order-first[^\"]*lg:order-none/);
  });
});
