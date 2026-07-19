import assert from 'node:assert/strict';
import test from 'node:test';
import { createEmptyEditableSection } from './editable-section';
import { mergeLocalizedSectionData, resolveEditableSectionData } from './live-preview-data';
import { parsePreviewEditPath, patchPreviewSectionData, previewValuesEqual } from './live-preview-path';

test('preview path edits clone only the edited nested branch', () => {
  const base = {
    headline: 'Alt',
    items: [
      { title: 'Eins', meta: { icon: 'Star' } },
      { title: 'Zwei', meta: { icon: 'Heart' } },
    ],
  };
  const next = patchPreviewSectionData(base, 'items.1.meta.icon', 'Sparkles');

  assert.ok(next);
  assert.equal((next.items as typeof base.items)[1].meta.icon, 'Sparkles');
  assert.equal(base.items[1].meta.icon, 'Heart');
  assert.notEqual(next.items, base.items);
  assert.equal((next.items as typeof base.items)[0], base.items[0]);
});

test('preview path edits can build missing arrays without mutating the base', () => {
  const base: Record<string, unknown> = { headline: 'Beispiel' };
  const next = patchPreviewSectionData(base, 'items.0.title', 'Erster Eintrag');

  assert.deepEqual(next, { headline: 'Beispiel', items: [{ title: 'Erster Eintrag' }] });
  assert.deepEqual(base, { headline: 'Beispiel' });
});

test('preview path edits reject unsafe, empty and excessive paths', () => {
  const base = { safe: 'Wert' };
  const excessive = Array.from({ length: 33 }, (_, index) => `level${index}`).join('.');

  for (const path of ['', '.safe', 'safe.', 'safe..child', '__proto__.polluted', 'safe.constructor.value', 'prototype.value', 'items.1001.title', excessive]) {
    assert.equal(parsePreviewEditPath(path), null, path);
    assert.equal(patchPreviewSectionData(base, path, 'Angriff'), null, path);
  }
  assert.equal(({} as Record<string, unknown>).polluted, undefined);
});

test('preview path edits preserve no-op semantics for values and link objects', () => {
  const base = {
    headline: 'Unverändert',
    primaryCta: { label: 'Kontakt', href: '/kontakt', icon: 'ArrowRight' },
  };

  assert.equal(patchPreviewSectionData(base, 'headline', 'Unverändert'), null);
  assert.equal(patchPreviewSectionData(base, 'primaryCta', { label: 'Kontakt', href: '/kontakt', icon: 'ArrowRight' }), null);
  assert.equal(previewValuesEqual(base.primaryCta, { label: 'Kontakt', href: '/kontakt', icon: 'ArrowRight' }), true);
});

test('editing a localized preview record preserves sibling locales without nesting the envelope', () => {
  const i18n = { enabled: true, locales: ['de', 'en'], defaultLocale: 'de' };
  const storedData = {
    _localized: true,
    headline: 'Deutsch gespeichert',
    de: { headline: 'Deutsch gespeichert', subline: 'Bestehender Text' },
    en: { headline: 'English stays intact', subline: 'Existing copy' },
  };
  const pendingData = {
    ...storedData,
    de: { headline: 'Deutsch pending', subline: 'Bestehender Text' },
  };
  const section = { ...createEmptyEditableSection('hero', 'section-1'), data: storedData };
  const pendingChanges = new Map([['section-1', pendingData]]);

  const editable = resolveEditableSectionData(pendingChanges.get('section-1')!, i18n, 'de');
  const patched = patchPreviewSectionData(editable, 'headline', 'Deutsch direkt bearbeitet');
  assert.ok(patched);
  const merged = mergeLocalizedSectionData({
    sectionId: section.id,
    data: patched,
    sections: [section],
    pendingChanges,
    i18n,
    activeLocale: 'de',
  });

  assert.equal((merged.de as Record<string, unknown>).headline, 'Deutsch direkt bearbeitet');
  assert.deepEqual(merged.en, storedData.en);
  assert.equal((merged.de as Record<string, unknown>)._localized, undefined);
  assert.equal(merged.headline, 'Deutsch direkt bearbeitet');
});
