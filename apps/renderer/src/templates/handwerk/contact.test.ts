import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SectionRenderer } from '@/components/section-renderer';
import { getFieldsForSection } from '@/lib/section-color-resolver';
import { normalizeStyleOverridesForSection } from '@/lib/section-style-overrides';
import type { SnapshotSection } from '@/lib/snapshot';

(globalThis as typeof globalThis & { React: typeof React }).React = React;

test('actual contact surfaces share an editable shadow role without changing its inherited default', () => {
  const section: SnapshotSection = {
    id: 'contact-proof', type: 'contact', definitionKey: 'contact.tradesman.v1', schemaVersion: 1,
    variant: null, visible: true, container: 'default', spacingTop: 'm', spacingBottom: 's', anchorId: null,
    data: { headline: 'Ein persönlicher Kontakt.', formEnabled: true, privacyHref: '/datenschutz', infoCards: [
      { icon: 'Phone', label: 'Telefon', value: '+49 841 12345' },
      { icon: 'Mail', label: 'E-Mail', value: 'kontakt@example.com' },
      { icon: 'MapPin', label: 'Adresse', value: 'Ingolstadt' },
      { icon: 'Clock', label: 'Bürozeiten', value: 'Nach Vereinbarung' },
    ] },
  };
  assert.ok(getFieldsForSection('contact', 'consulting', section.definitionKey).includes('cardShadow'));
  const overrides = { '--token-card-shadow': 'none' };
  const normalized = normalizeStyleOverridesForSection(section.type, overrides, 'consulting', section.definitionKey);
  assert.equal(normalized?.['--token-card-shadow'], 'none');
  const render = (styleOverrides?: Record<string, string>) => renderToStaticMarkup(React.createElement(SectionRenderer, { section: { ...section, styleOverrides }, industry: 'consulting' }));
  const inherited = render();
  const bordered = render(overrides);
  assert.doesNotMatch(inherited, /--token-card-shadow:none/);
  assert.match(bordered, /--token-card-shadow:none/);
  assert.equal((bordered.match(/style="box-shadow:var\(--token-card-shadow\)"/g) || []).length, 4);
  assert.equal((bordered.match(/<form\b/g) || []).length, 1);
  assert.ok(bordered.includes('[box-shadow:var(--token-card-shadow)]'));
  assert.match(bordered, /href="tel:\+4984112345"/);
  assert.match(bordered, /href="mailto:kontakt@example.com"/);
});
