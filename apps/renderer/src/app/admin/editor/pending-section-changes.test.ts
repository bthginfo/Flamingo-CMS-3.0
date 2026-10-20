import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createEmptyEditableSection, type EditableSection } from './editable-section';
import { buildLiveSections, mergeLocalizedSectionData, resolveEditableSectionData } from './live-preview-data';
import { patchPreviewSectionData } from './live-preview-path';
import { duplicateEditorialItem, editorialItems, moveEditorialItem, newEditorialItem } from '@/lib/perspective-editor-items';

/** Models PageEditor: pending refs do not render; setting the same dirty/saved booleans bails out. */
function pendingParent(type: string, commitSectionState: boolean, localized = false) {
  const initialData: Record<string, unknown> = {
    headline: 'Original', text: 'Bestehender Text', subline: 'Bestehende Einleitung', image: '/original.jpg',
    items: [newEditorialItem('original')],
    primaryCta: { label: 'Telefon', href: 'tel:+49841123', iconSuffix: 'Phone' },
    cta: { label: 'Telefon', href: 'tel:+49841123', iconSuffix: 'Phone' },
    ctaPrimary: { label: 'Telefon', href: 'tel:+49841123', iconPrefix: 'Phone', iconSuffix: '' },
    ctaSecondary: { label: 'Sekretariat', href: 'mailto:sekretariat@example.org', iconSuffix: 'Mail' },
    authoredExtension: { preserve: true },
  };
  const english = { headline: 'Keep English', text: 'Existing English copy' };
  const initialSections: EditableSection[] = [{
    ...createEmptyEditableSection(type, 'edited-section'),
    anchorId: 'kontakt', titleInternal: 'Redaktioneller Titel', spacingTop: 's', spacingBottom: 'l',
    styleOverrides: { '--token-heading': '#101820' },
    data: localized ? { ...initialData, _localized: true, de: initialData, en: english } : initialData,
  }, { ...createEmptyEditableSection('richText', 'other-section'), data: { content: 'Andere Sektion' } }];
  let sections = initialSections;
  const pending = new Map<string, Record<string, unknown>>();
  const i18n = localized ? { enabled: true, locales: ['de', 'en'], defaultLocale: 'de' } : undefined;
  let dirty = false;
  let saved = true;
  let dirtyTransitions = 0;
  let editorData = initialData;

  function render() {
    editorData = resolveEditableSectionData(pending.get('edited-section') ?? sections[0].data, i18n, 'de');
  }

  function edit(path: string, value: unknown) {
    const data = patchPreviewSectionData(editorData, path, value);
    if (!data) return; // Unchanged controlled values do not stage another edit.
    const saveData = mergeLocalizedSectionData({ sectionId: 'edited-section', data, sections, pendingChanges: pending, i18n, activeLocale: 'de' });
    pending.set('edited-section', saveData);
    if (commitSectionState) {
      sections = buildLiveSections(sections, pending, { sectionId: 'edited-section', data: saveData });
      render();
    }
    if (!dirty || saved) {
      dirty = true;
      saved = false;
      dirtyTransitions++;
      render();
    }
  }

  return { edit, initialSections, english, get data() { return editorData; }, get sections() { return sections; }, get pending() { return pending.get('edited-section')!; }, get dirtyTransitions() { return dirtyTransitions; } };
}

test('pending-ref parents retain sequential repeater edits after their dirty booleans stop rerendering', () => {
  // Reproduce the real failure: add renders once, title does not render, then description overwrites it.
  const stale = pendingParent('editorialReel', false);
  stale.edit('items', [...editorialItems(stale.data.items), newEditorialItem('added')]);
  stale.edit('items.1.title', 'Neuer Titel');
  stale.edit('items.1.text', 'Neue Beschreibung');
  assert.equal(editorialItems(stale.pending.items)[1].title, '');

  for (const type of ['editorialReel', 'imageAtlas']) {
    const model = pendingParent(type, true, true);
    model.edit('items', [...editorialItems(model.data.items), newEditorialItem('added')]);
    model.edit('items.1.title', 'Neuer Titel');
    model.edit('items.1.text', 'Neue Beschreibung');
    model.edit('items.1.image', '/edited.webp');
    model.edit('items.1.link', { label: 'PDF öffnen', href: '/media/formular.pdf', iconPrefix: 'FileText', iconSuffix: '' });
    model.edit('items', duplicateEditorialItem(editorialItems(model.data.items), 'added', 'duplicate'));
    model.edit('items', moveEditorialItem(editorialItems(model.data.items), 'duplicate', -1));
    model.edit('items', editorialItems(model.data.items).filter(row => row.id !== 'added'));
    const duplicate = editorialItems(model.data.items).find(row => row.id === 'duplicate')!;
    assert.equal(duplicate.title, 'Neuer Titel');
    assert.equal(duplicate.text, 'Neue Beschreibung');
    assert.equal(duplicate.image, '/edited.webp');
    assert.deepEqual(duplicate.link, { label: 'PDF öffnen', href: '/media/formular.pdf', iconPrefix: 'FileText', iconSuffix: '' });
    assert.equal(model.dirtyTransitions, 1, 'the dirty flags render only on the first edit');
    assert.deepEqual(model.pending, model.sections[0].data, 'save/recovery and controlled props must share the same final data');
    assert.deepEqual(model.pending.en, model.english);
    assert.deepEqual(model.pending.de, model.data);
    assert.deepEqual(model.sections[1], model.initialSections[1]);
    const { data: _before, ...metadataBefore } = model.initialSections[0];
    const { data: _after, ...metadataAfter } = model.sections[0];
    assert.deepEqual(metadataAfter, metadataBefore);
  }
});

test('the same pending-parent contract preserves repeated hero, photo and contact-band field/icon edits', () => {
  for (const type of ['perspectiveHero', 'photoChapter', 'ctaBand']) {
    const model = pendingParent(type, true);
    const copyField = type === 'ctaBand' ? 'subline' : 'text';
    const actionField = type === 'perspectiveHero' ? 'primaryCta' : type === 'photoChapter' ? 'cta' : 'ctaPrimary';
    model.edit('headline', 'Neuer Titel');
    model.edit(copyField, 'Neue Beschreibung');
    if (type !== 'ctaBand') model.edit('image', '/edited.webp');
    model.edit(`${actionField}.label`, 'Direkt anrufen');
    model.edit(`${actionField}.href`, 'tel:+498419999');
    model.edit(`${actionField}.iconPrefix`, 'Phone');
    model.edit(`${actionField}.iconSuffix`, '');
    assert.equal(model.data.headline, 'Neuer Titel');
    assert.equal(model.data[copyField], 'Neue Beschreibung');
    assert.deepEqual(model.data[actionField], { label: 'Direkt anrufen', href: 'tel:+498419999', iconPrefix: 'Phone', iconSuffix: '' });
    assert.deepEqual(model.data.ctaSecondary, { label: 'Sekretariat', href: 'mailto:sekretariat@example.org', iconSuffix: 'Mail' });
    assert.deepEqual(model.data.authoredExtension, { preserve: true });
    assert.equal(model.dirtyTransitions, 1);
    assert.deepEqual(model.sections[0].data, model.pending);
  }
});

test('page and collection integrations commit each localized pending change into the section state', () => {
  for (const path of ['../pages/[id]/page-editor.tsx', '../collections/[key]/[itemId]/item-editor.tsx']) {
    const source = readFileSync(new URL(path, import.meta.url), 'utf8');
    assert.match(source, /pendingChanges\.current\.set\(sectionId, saveData\);[\s\S]*?setSections\(current => buildLiveSections\(current, pendingChanges\.current, \{ sectionId, data: saveData \}\)\);[\s\S]*?setHasDirty\(true\);/);
  }
});
