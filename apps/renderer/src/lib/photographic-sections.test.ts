import assert from 'node:assert/strict';
import test from 'node:test';
import React, { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { EditorialReelSection } from '../templates/shared/editorial-reel';
import { ImageAtlasSection } from '../templates/shared/image-atlas';
import { PerspectiveLink } from '../templates/shared/perspective-link';
import { PerspectiveHeroSection } from '../templates/shared/perspective-hero';
import { PhotoChapterSection } from '../templates/shared/photo-chapter';
import { action } from '../templates/shared/perspective-utils';
import { editorialItems, editorialItemPanelId, duplicateEditorialItem, moveEditorialItem, newEditorialItem } from './perspective-editor-items';
import { getSectionDefinitionByKey, resolveSectionDefinition } from '../templates';
import { getAllSectionContracts } from './section-contracts';
import { getCatalogSectionSchemas } from './section-data-schemas';
import { getSectionTypesForIndustry } from '../app/admin/pages/[id]/section-types';
import { getFieldsForSection } from './section-color-resolver';
import { PERSPECTIVE_SECTION_PREVIEW_DATA, withPerspectiveEditorDefaults } from './perspective-section-data';
import { PerspectiveContactBandEditor, PerspectiveSectionEditor } from '../app/admin/pages/[id]/perspective-section-editor';
import { DetailLinkField } from '../components/button-field';

(globalThis as typeof globalThis & { React: typeof React }).React = React;
const render = (Component: React.ComponentType<{ data: Record<string, unknown> }>, data: Record<string, unknown>) => renderToStaticMarkup(createElement(Component, { data }));
const item = (index: number) => ({ id: `topic-${index}`, title: `Thema ${index}`, text: `Eine konkrete Situation ${index}.`, image: '/topic.webp', imageAlt: `Motiv ${index}`, imagePosition: '65% 30%', imageMobilePosition: '72% 40%', link: { label: `Thema ${index} öffnen`, href: `/thema-${index}#kontakt`, iconPrefix: '', iconSuffix: 'ArrowUpRight' } });

test('photographic types resolve with formal nested field, AI, catalog, preview and independent color contracts', () => {
  for (const type of ['editorialReel', 'imageAtlas']) {
    assert.ok(getSectionDefinitionByKey(`${type}.shared.v1`));
    const contract = getAllSectionContracts().find(row => row.type === type)!;
    assert.equal(contract.wrapper, 'fullBleed');
    assert.equal(contract.maturity, 'formal');
    assert.deepEqual(contract.fields.find(row => row.key === 'titleAs')?.options, ['h1', 'h2']);
    for (const field of Object.keys(PERSPECTIVE_SECTION_PREVIEW_DATA[type])) assert.ok(contract.fields.some(row => row.key === field), `${type}: ${field}`);
    const fields = contract.fields.find(row => row.key === 'items')?.itemFields || [];
    for (const field of Object.keys(item(0))) assert.ok(fields.some(row => row.key === field), `${type}.items.${field}`);
    const link = fields.find(row => row.key === 'link')!;
    for (const key of ['label', 'href', 'iconPrefix', 'iconSuffix']) assert.ok(link.itemFields?.some(row => row.key === key));
    for (const industry of ['consulting', 'hotel', 'tradesman']) {
      assert.equal(resolveSectionDefinition({ type, industry })?.key, `${type}.shared.v1`);
      assert.ok(getSectionTypesForIndustry(industry).some(row => row.type === type));
      const schema = getCatalogSectionSchemas(industry)[type] as { fields: Record<string, string> };
      assert.match(schema.fields.items, /stable unique ID/);
      assert.match(schema.fields.items, /imageMobilePosition/);
      assert.match(schema.fields.items, /iconSuffix/);
      assert.match(schema.fields.motion, /none disables/);
      const colors = getFieldsForSection(type, industry, `${type}.shared.v1`);
      for (const field of ['sectionBg', 'sectionBgAlt', 'headingColor', 'bodyColor', 'imageOverlay', 'onDarkHeading', 'onDarkBody', 'linkColor', 'linkHoverColor']) assert.ok(colors.includes(field as never), `${type}: ${field}`);
    }
  }
  for (const type of ['editorialBriefing', 'resourceList']) assert.equal(getFieldsForSection(type, 'consulting', `${type}.shared.v1`).includes('imageOverlay'), false, `${type} must not expose an unused photographic control`);
});

test('reel and atlas keep every authored image, title and native destination in SSR at arbitrary item counts', () => {
  for (const count of [0, 1, 2, 5, 6]) {
    for (const Component of [EditorialReelSection, ImageAtlasSection]) {
      const html = render(Component, { titleAs: 'h1', layout: 'opening', headline: 'Die eigene Perspektive.', intro: 'Eine persönliche Frage.', items: Array.from({ length: count }, (_, index) => item(index)), motion: 'subtle', hoverEffect: 'zoom' });
      assert.equal((html.match(/<h1\b/g) || []).length, 1);
      for (let index = 0; index < count; index++) {
        assert.match(html, new RegExp(`href="/thema-${index}#kontakt"`));
        assert.match(html, new RegExp(`data-item-id="topic-${index}"`));
        assert.match(html, new RegExp(`alt="Motiv ${index}"`));
        assert.match(html, new RegExp(`Eine konkrete Situation ${index}`));
      }
      assert.equal((html.match(/data-edit-index=/g) || []).length, count);
      assert.doesNotMatch(html, /opacity-0|visibility:hidden|320vh|autoplay/);
      if (count > 0) assert.match(html, /--perspective-mobile-focal:72% 40%/);
      if (Component === ImageAtlasSection) assert.equal((html.match(/<a\b/g) || []).length, count, 'atlas whole-tile links must not contain a second anchor');
      if (Component === EditorialReelSection && count > 1) {
        assert.match(html, /aria-label="Vorheriges Kapitel" disabled=""/);
        assert.match(html, /aria-label="Nächstes Kapitel"/);
        assert.match(html, /data-editorial-reel-track/);
      }
    }
  }
  assert.equal(render(EditorialReelSection, {}), '');
  assert.equal(render(ImageAtlasSection, {}), '');
});

test('new visual collections retain authored indexes after malformed entries and clear executable targets', () => {
  for (const Component of [EditorialReelSection, ImageAtlasSection]) {
    const html = render(Component, { headline: 'Ein Thema.', items: [null, {}, { ...item(1), link: { label: 'Unsicherer Link', href: 'javascript:alert(1)' } }, item(2)] });
    assert.match(html, /data-edit-index="2"/);
    assert.match(html, /data-edit-index="3"/);
    assert.doesNotMatch(html, /data-edit-index="0"|data-edit-index="1"|javascript:|Unsicherer Link/);
    assert.match(html, /href="\/thema-2#kontakt"/);
  }
});

test('links preserve real icon edits, explicit clear, legacy suffix, and native/external target behavior', () => {
  const link = (value: unknown) => renderToStaticMarkup(createElement(PerspectiveLink, { cta: action(value) }));
  assert.match(link({ label: 'Anrufen', href: 'tel:+49841123', iconPrefix: 'Phone', iconSuffix: '' }), /lucide-phone/);
  assert.doesNotMatch(link({ label: 'Anrufen', href: 'tel:+49841123', iconPrefix: 'Phone', iconSuffix: '' }), /lucide-arrow-up-right|target="_blank"/);
  assert.match(link({ label: 'PDF', href: '/media/formular.pdf', icon: 'Download' }), /lucide-download/);
  assert.match(link({ label: 'Profil', href: '/profil#kontakt' }), /lucide-arrow-up-right/);
  const external = link({ label: 'Externe Informationen', href: 'https://example.org/information', iconSuffix: '' });
  assert.match(external, /target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(external, /<svg/);
  const hero = render(PerspectiveHeroSection, { layout: 'compact', headline: 'Kontakt.', primaryCta: { label: 'Anrufen', href: 'tel:+49841123', iconPrefix: 'Phone', iconSuffix: '' }, secondaryCta: { label: 'Schreiben', href: 'mailto:post@example.org', iconSuffix: 'Mail' } });
  assert.match(hero, /lucide-phone/);
  assert.match(hero, /lucide-mail/);
  assert.doesNotMatch(hero, /lucide-arrow/);
});

test('spread keeps sanitized rich copy and independently authored desktop/mobile image positions', () => {
  const html = render(PhotoChapterSection, { layout: 'spread', headline: 'Raum für Fragen.', text: '<p>Eine <strong>persönliche</strong> Frage.</p><script>unsafe()</script>', image: '/one.webp', imageAlt: 'Ein Raum', imagePosition: '68% 45%', imageMobilePosition: '80% 35%', secondaryImage: '/two.webp', secondaryImageAlt: 'Ein anderer Raum', secondaryImagePosition: '20% 70%', secondaryImageMobilePosition: '10% 60%', cta: { label: 'Kontakt', href: '/kontakt', iconSuffix: '' } });
  assert.match(html, /data-photo-layout="spread"/);
  assert.match(html, /<strong>persönliche<\/strong>/);
  for (const value of ['object-position:68% 45%', '--perspective-mobile-focal:80% 35%', 'object-position:20% 70%', '--perspective-mobile-focal:10% 60%']) assert.ok(html.includes(value));
  assert.doesNotMatch(html, /unsafe\(\)|<script|lucide-arrow/);
});

test('CMS item operations keep stable identities, exact content and separate nested clones through reorder/delete', () => {
  const first = newEditorialItem('first', '/first.webp', 'Erstes Motiv');
  first.title = 'Eigener Titel';
  first.link = { label: 'Zum Profil', href: '/profil#kontakt', iconPrefix: 'Phone', iconSuffix: '' };
  const original = [first, { ...newEditorialItem('last'), title: 'Letztes Thema' }];
  const duplicate = duplicateEditorialItem(original, 'first', 'copy');
  assert.deepEqual(duplicate.map(row => row.id), ['first', 'copy', 'last']);
  assert.deepEqual(duplicate[1].link, first.link);
  (duplicate[1].link as Record<string, unknown>).label = 'Eigene Beschriftung';
  assert.equal((first.link as Record<string, unknown>).label, 'Zum Profil');
  const reordered = moveEditorialItem(duplicate, 'copy', 1);
  assert.deepEqual(reordered.map(row => row.id), ['first', 'last', 'copy']);
  const deleted = reordered.filter(row => row.id !== 'first');
  assert.deepEqual(deleted.map(row => row.id), ['last', 'copy']);
  assert.equal(deleted[1].title, 'Eigener Titel');
  assert.equal((deleted[1].link as Record<string, unknown>).iconSuffix, '');
  assert.deepEqual(original.map(row => row.id), ['first', 'last']);
  assert.equal(moveEditorialItem(original, 'first', -1), original);
  assert.deepEqual(editorialItems([{ title: 'Ohne ID' }, { id: 'same' }, { id: 'same' }]).map(row => row.id), ['item-1', 'same', 'same-copy']);
});

test('partial visual data exposes empty optional controls while preserving explicitly cleared icons', () => {
  const stored = { headline: 'Eigene Frage.', items: [{ id: 'one', title: 'Eigenes Thema', link: { label: 'Profil', href: '/profil#kontakt', iconSuffix: '' } }] };
  const merged = withPerspectiveEditorDefaults('editorialReel', stored, PERSPECTIVE_SECTION_PREVIEW_DATA.editorialReel);
  const first = (merged.items as Record<string, unknown>[])[0];
  assert.equal(first.text, '');
  assert.equal(first.imageMobilePosition, '');
  assert.equal((first.link as Record<string, unknown>).iconSuffix, '');
  assert.equal(stored.items.length, 1);
  assert.deepEqual(withPerspectiveEditorDefaults('imageAtlas', { headline: 'Noch ohne Themen.' }, PERSPECTIVE_SECTION_PREVIEW_DATA.imageAtlas).items, []);
});

test('editing the real plain contact-band headline preserves both secretary destinations, icons and unrelated authored fields', () => {
  const data = {
    layout: 'plain', headline: 'Ihr Sekretariat.', subline: 'Persönlich erreichbar.',
    ctaPrimary: { label: '+49 841 123', href: 'tel:+49841123', iconPrefix: 'Phone', iconSuffix: '' },
    ctaSecondary: { label: 'sekretariat@example.org', href: 'mailto:sekretariat@example.org', iconPrefix: '', iconSuffix: 'Mail' },
    authoredExtension: { keep: true },
  };
  let next: Record<string, unknown> | undefined;
  const view = PerspectiveContactBandEditor({ type: 'ctaBand', data, onChange: value => { next = value; } });
  const fields = React.Children.toArray(view.props.children) as React.ReactElement<{ label: string; onChange: (value: string) => void }>[];
  const headline = fields.find(field => field.props.label === 'Überschrift');
  assert.ok(headline, 'the editor must expose the headline control');
  headline.props.onChange('Ein direkter Kontakt.');
  assert.deepEqual(next, { ...data, headline: 'Ein direkter Kontakt.' });
  assert.deepEqual(fields.map(field => field.props.label), ['Überschrift', 'Text', 'Primäre Aktion', 'Sekundäre Aktion']);
});

test('scoped resource and profile-link controls expose an editable native PDF or compound-anchor destination', () => {
  for (const href of ['/media/formular.pdf', '/profil#kontakt']) {
    const html = renderToStaticMarkup(createElement(DetailLinkField, { label: 'Link-Ziel', value: href, onChange: () => {}, allowCustomHref: true }));
    assert.match(html, /Link-Ziel frei eingeben/);
    assert.ok(html.includes(`value="${href}"`));
    assert.match(html, /<input/);
  }
});

test('photo copy binds the existing local inverse foreground contract across its entire dynamic text plane', () => {
  for (const Component of [EditorialReelSection, ImageAtlasSection]) {
    const html = render(Component, { titleAs: 'h1', headline: 'Ein Titel außerhalb des Bildes.', items: [item(0), { ...item(1), image: '' }] });
    assert.equal((html.match(/data-color-context="dark"/g) || []).length, 1, 'only actual image copy gets inverse text roles');
    assert.equal((html.match(/data-photo-copy-plane/g) || []).length, 2);
    assert.match(html, /max\(alpha, \.88\)/);
    assert.match(html, /calc\(100% - 3rem\)/);
    assert.match(html, /Eine konkrete Situation 0/);
    assert.match(html, /text-\[color:var\(--token-heading\)\]/);
  }
});

test('modest original profile portraits keep a source-matched plane and aspect ratio', () => {
  const html = render(PerspectiveHeroSection, { layout: 'portrait', headline: 'Eine echte Person.', image: '/portrait.jpg' });
  assert.match(html, /max-w-\[430px\]/);
  assert.match(html, /aspect-\[13\/12\]/);
  assert.match(html, /sizes="\(min-width:768px\) 430px, calc\(100vw - 48px\)"/);
  assert.doesNotMatch(html, /700px|aspect-\[4\/5\]/);
});

test('repeatable editors use persistent section/item panel IDs and reference only their mounted panel', () => {
  const data = { headline: 'Eigene Themen.', items: [item(0), item(1)] };
  for (const type of ['editorialReel', 'imageAtlas']) {
    const editor = createElement(PerspectiveSectionEditor, { type, data, sectionId: 'stable-section', onChange: () => {} });
    const direct = renderToStaticMarkup(editor);
    const nested = renderToStaticMarkup(createElement('div', null, createElement('span', null, 'Andere Baumform'), editor));
    for (const html of [direct, nested]) {
      const controls = [...html.matchAll(/aria-controls="(item-editor-[^"]+)"/g)].map(match => match[1]);
      assert.deepEqual(controls, [editorialItemPanelId('stable-section', 'topic-0')]);
      for (const id of controls) assert.ok(html.includes(`id="${id}"`), `missing controlled panel: ${id}`);
      assert.doesNotMatch(html, /aria-controls="item-editor-[^"]*topic-1"/);
    }
  }
});
