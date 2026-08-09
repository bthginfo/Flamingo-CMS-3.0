import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function source(relative: string) {
  return readFileSync(new URL(relative, import.meta.url), 'utf8');
}

test('public mobile navigation is a named modal with a complete keyboard contract', () => {
  const header = source('../components/site-header.tsx');
  const focusTrap = source('../hooks/use-modal-focus-trap.ts');
  assert.match(header, /aria-expanded=\{mobileOpen\}/);
  assert.match(header, /aria-controls="site-mobile-menu"/);
  assert.match(header, /id="site-mobile-menu"[\s\S]*role="dialog"[\s\S]*aria-modal="true"/);
  assert.match(header, /aria-label="Menü schließen"/);
  assert.match(focusTrap, /event\.key === 'Escape'/);
  assert.match(focusTrap, /event\.key !== 'Tab'/);
  assert.match(focusTrap, /previouslyFocused\.focus\(\)/);
});

test('preview overlays are named modals and every preview frame has a title', () => {
  const panel = source('../components/admin/preview-panel.tsx');
  assert.match(panel, /role="dialog" aria-modal="true" aria-label="Live-Vorschau"/);
  assert.match(panel, /role=\{fullscreen \? 'dialog' : undefined\}/);
  assert.match(panel, /title="Live-Vorschau"/);
  assert.match(panel, /title=\{`Live-Vorschau – \$\{device/);
  assert.equal((panel.match(/useModalFocusTrap\(\{/g) ?? []).length, 2);
  assert.match(panel, /isMobileViewport && \([\s\S]*<iframe/);
  assert.match(panel, /!isMobileViewport && \([\s\S]*<iframe/);
});
