import assert from 'node:assert/strict';
import test from 'node:test';
import React, { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PerspectiveHeroSection } from '../templates/shared/perspective-hero';
import { PhotoChapterSection } from '../templates/shared/photo-chapter';
import { TopicExplorerSection } from '../templates/shared/topic-explorer';
import { EditorialBriefingSection } from '../templates/shared/editorial-briefing';
import { ResourceListSection } from '../templates/shared/resource-list';
import { TeamSpotlightSection } from '../templates/shared/team-spotlight';
import { SectionRenderer } from '../components/section-renderer';
import { ContactSection } from '../templates/handwerk/contact';
import { readFileSync } from 'node:fs';
import { getSectionDefinitionByKey, resolveSectionDefinition } from '../templates';
import { getAllSectionContracts } from './section-contracts';
import { getCatalogSectionSchemas } from './section-data-schemas';
import { getSectionTypesForIndustry } from '../app/admin/pages/[id]/section-types';
import { getFieldsForSection } from './section-color-resolver';
import { normalizeStyleOverridesForSection } from './section-style-overrides';
import { EDITORIAL_CONTACT_EDITOR_DEFAULTS, PERSPECTIVE_SECTION_PREVIEW_DATA, withPerspectiveEditorDefaults } from './perspective-section-data';
import { SECTION_PREVIEW_DATA } from './section-preview-data';
import { validateSectionData } from './validate-section';
import type { SnapshotSection } from './snapshot';

(globalThis as typeof globalThis & { React: typeof React }).React = React;
const render = (Component: React.ComponentType<{ data: Record<string, unknown> }>, data: Record<string, unknown>) => renderToStaticMarkup(createElement(Component, { data }));
const types = ['perspectiveHero', 'photoChapter', 'topicExplorer', 'editorialBriefing', 'resourceList'];

test('new public types resolve to stable shared v1 definitions for any tenant industry', () => {
  const contracts = getAllSectionContracts();
  for (const type of types) {
    const key = `${type}.shared.v1`;
    const definition = getSectionDefinitionByKey(key);
    assert.ok(definition, key);
    assert.equal(definition.owner, 'shared');
    assert.equal(definition.schemaVersion, 1);
    for (const industry of ['consulting', 'hotel', 'tradesman']) {
      assert.equal(resolveSectionDefinition({ type, industry })?.key, key);
      assert.ok(getCatalogSectionSchemas(industry)[type]);
      assert.ok(getSectionTypesForIndustry(industry).some(item => item.type === type));
    }
    const contract = contracts.find(item => item.type === type)!;
    assert.equal(contract.wrapper, 'fullBleed');
    for (const field of Object.keys(PERSPECTIVE_SECTION_PREVIEW_DATA[type])) assert.ok(contract.fields.some(item => item.key === field), `${key}: ${field}`);
  }
  const hero = contracts.find(item => item.type === 'perspectiveHero')!;
  assert.deepEqual(hero.fields.find(item => item.key === 'layout')?.options, ['panorama', 'statement', 'portrait', 'journal', 'compact']);
  assert.equal(hero.fields.find(item => item.key === 'text')?.type, 'textarea');
  assert.equal(hero.fields.find(item => item.key === 'image')?.supportsFocalPoint, true);
  assert.equal(hero.fields.find(item => item.key === 'imageAlt')?.type, 'text');
  const team = contracts.find(item => item.type === 'teamSpotlight')!;
  assert.ok(team.fields.find(item => item.key === 'layout')?.options?.includes('contactSheet'));
  for (const key of ['contactName', 'phone', 'email', 'imageAlt', 'imagePosition']) assert.ok(team.fields.find(item => item.key === 'members')?.itemFields?.some(item => item.key === key));
});

test('all opening layouts keep one H1, plain newlines, optimized eager media and authored focal/CTA fields', () => {
  const markups = new Set<string>();
  for (const layout of ['panorama', 'statement', 'portrait', 'journal', 'compact']) {
    const html = render(PerspectiveHeroSection, { layout, headline: 'Mehr Klarheit.\nFür Ihre Frage.', text: 'Ein verständlicher Einstieg.', image: '/hero.webp', imageAlt: 'Das tatsächliche Motiv', imagePosition: '68% 31%', primaryCta: { label: 'Beratung besprechen', href: '/kontakt' }, meta: ['', 'Persönlich erreichbar'] });
    assert.equal((html.match(/<h1\b/g) || []).length, 1, layout);
    assert.match(html, /Mehr Klarheit\.\nFür Ihre Frage\./);
    assert.match(html, /alt="Das tatsächliche Motiv"/);
    assert.match(html, /object-position:68% 31%/);
    assert.match(html, /<link rel="preload" as="image"/);
    assert.match(html, /\/_next\/image\?/);
    assert.match(html, /href="\/kontakt"/);
    assert.match(html, /data-edit-path="meta\.1"/);
    assert.doesNotMatch(html, /opacity-0|visibility:hidden|loading="lazy"/);
    markups.add(html.replace(`data-perspective-layout="${layout}"`, ''));
  }
  assert.equal(markups.size, 5, 'layouts must have different structures');
  assert.equal(render(PerspectiveHeroSection, {}), '');
});

test('photographic chapter variants sanitize rich text and preserve independent secondary photo controls', () => {
  for (const layout of ['feature', 'immersive', 'diptych']) {
    const html = render(PhotoChapterSection, { layout, headline: 'Eine andere Perspektive', text: '<p>Eine <strong>konkrete</strong> Geschichte.</p><script>bad()</script>', image: '/primary.webp', imageAlt: 'Hauptmotiv', imagePosition: 'left 40%', secondaryImage: '/secondary.webp', secondaryImageAlt: 'Zweites Motiv', secondaryImagePosition: '75% 32%', cta: { label: 'Weiterlesen', href: 'javascript:alert(1)' } });
    assert.equal((html.match(/<h2\b/g) || []).length, 1);
    assert.match(html, /<strong>konkrete<\/strong>/);
    assert.match(html, /object-position:left 40%/);
    assert.doesNotMatch(html, /<script|bad\(\)|javascript:|Weiterlesen/);
    if (layout !== 'immersive') {
      assert.match(html, /alt="Zweites Motiv"/);
      assert.match(html, /object-position:75% 32%/);
      assert.match(html, /data-edit-image="secondaryImage"/);
    }
  }
});

test('expertise explorer renders every summary and useful first disclosure before hydration, retaining source indices', () => {
  const html = render(TopicExplorerSection, { headline: 'Was beschäftigt Sie?', intro: 'Eine eigene Situation erkennen.', items: [null, { title: ' ', summary: 'Nicht anzeigen' }, ...Array.from({ length: 5 }, (_, index) => ({ id: `topic-${index}`, title: `Rechtsgebiet ${index}`, summary: `Konkrete Ausgangslage ${index}`, detail: `<p>Vertiefung ${index}</p><script>unsafe()</script>`, image: '/topic.webp', imageAlt: 'Situationsfoto', imagePosition: '40% 60%', bullets: ['', 'Ihre konkrete Frage'], meta: ['Zuständiger Ansprechpartner'], cta: { label: `Mehr zu Thema ${index}`, href: `/thema-${index}` } }))] });
  assert.equal((html.match(/<details\b/g) || []).length, 5);
  assert.equal((html.match(/<summary\b/g) || []).length, 5);
  assert.equal((html.match(/ open=""/g) || []).length, 1);
  assert.match(html, /<details[^>]*name="topics-/);
  for (let index = 0; index < 5; index++) {
    assert.match(html, new RegExp(`Konkrete Ausgangslage ${index}`));
    assert.match(html, new RegExp(`Vertiefung ${index}`));
    assert.match(html, new RegExp(`data-edit-index="${index + 2}"`));
  }
  assert.match(html, /data-edit-path="bullets\.1"/);
  assert.match(html, /href="\/thema-4"/);
  assert.doesNotMatch(html, /<script|unsafe\(\)|opacity-0|320vh|100vh/);
});

test('briefing layouts retain all groups, phases and sanitized explanations with correct heading order', () => {
  for (const layout of ['columns', 'sequence', 'dossier']) {
    const html = render(EditorialBriefingSection, { layout, headline: 'Die konkrete Frage', groups: [null, { title: 'Die Ausgangslage', text: '<p>Sachverhalt <a href="javascript:bad()">verstehen</a>.</p>', items: ['', 'Eine besondere Unterlage'] }], stages: [{ title: 'Einordnen', text: 'Was liegt vor?' }, { title: 'Abstimmen', text: 'Wie geht es weiter?' }], note: 'Ein sachlicher Hinweis.', cta: { label: 'Kontakt aufnehmen', href: '/kontakt' } });
    assert.equal((html.match(/<h2\b/g) || []).length, 1);
    assert.equal((html.match(/<h3\b/g) || []).length, 3);
    assert.match(html, /data-edit-collection="groups" data-edit-index="1"/);
    assert.match(html, /data-edit-path="items\.1"/);
    assert.match(html, /Wie geht es weiter\?/);
    assert.match(html, /Ein sachlicher Hinweis/);
    assert.doesNotMatch(html, /javascript:|shadow-|data-card/);
  }
});

test('resource groups preserve native legacy anchors, PDF labels and safe actual links without fake metadata', () => {
  const data = { headline: 'Ihre Unterlagen', groups: [null, { id: 'vollmachten', title: 'Vollmachten', items: [null, { title: 'Prozessvollmacht', description: 'Die Vertretung im Verfahren.', href: '/dokument.pdf', format: 'PDF', actionLabel: 'PDF herunterladen' }] }, { id: 'invalid id', items: [{ title: 'Eine Beratung', href: '/kontakt', actionLabel: 'Kontakt' }, { title: 'Ungültiger Link', href: 'data:text/html,unsafe' }] }], note: 'Nur auf Anfrage ausfüllen.' };
  const html = render(ResourceListSection, data);
  assert.match(html, /id="vollmachten"/);
  assert.match(html, /href="\/dokument\.pdf"/);
  assert.match(html, /href="\/kontakt"/);
  assert.match(html, /PDF herunterladen/);
  assert.match(html, /data-edit-collection="groups" data-edit-index="1"/);
  assert.match(html, /data-edit-collection="items" data-edit-index="1"/);
  assert.equal((html.match(/<h3\b/g) || []).length, 1);
  assert.doesNotMatch(html, /<h4\b|invalid id|data:text|\d+\s?(?:KB|MB)/);
  const cleaned = validateSectionData(data);
  assert.equal((((cleaned.groups as unknown[])[2] as { items: { href: string }[] }).items[1].href), '');
});

test('contact sheet shows all seven full portrait profiles with exact explicit contact fields', () => {
  const html = render(TeamSpotlightSection, { layout: 'contactSheet', titleAs: 'h1', headline: 'Sieben Persönlichkeiten.', members: Array.from({ length: 7 }, (_, index) => ({ name: `Person ${index + 1}`, role: `Qualifikation ${index + 1}`, image: `/person-${index}.jpg`, imageAlt: `Authentisches Porträt ${index}`, imagePosition: '50% 24%', href: `/profil-${index}`, focus: ['', `Eigenes Fachgebiet ${index}`], contactName: `Sekretariat ${index}`, phone: `+49 841 93557-${index}`, email: `person${index}@example.com`, quote: 'Nicht als Kontaktdaten verwenden.' })), cta: { label: 'Das gesamte Team', href: '/team' } });
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/<h2\b/g) || []).length, 7);
  for (let index = 0; index < 7; index++) {
    assert.match(html, new RegExp(`href="/profil-${index}"`));
    assert.match(html, new RegExp(`Sekretariat ${index}`));
    assert.match(html, new RegExp(`href="tel:\\+4984193557${index}"`));
    assert.match(html, new RegExp(`href="mailto:person${index}@example.com"`));
  }
  assert.match(html, /data-edit-path="focus\.1"/);
  assert.match(html, /href="\/team"/);
  assert.doesNotMatch(html, /Nicht als Kontaktdaten|max-h-0|opacity-0|xl:grid-cols-4/);
});

test('partial existing CMS content exposes optional controls without inserting sample prose or rows', () => {
  const stored = { headline: 'Eigener Einstieg', primaryCta: { label: 'Besprechen' }, meta: ['Original'] };
  const merged = withPerspectiveEditorDefaults('perspectiveHero', stored, PERSPECTIVE_SECTION_PREVIEW_DATA.perspectiveHero);
  assert.deepEqual(merged.primaryCta, { label: 'Besprechen', href: '' });
  assert.deepEqual(merged.meta, ['Original']);
  assert.equal(merged.text, '');
  assert.equal(merged.imageAlt, '');
  assert.equal(merged.imagePosition, '');
  assert.equal(merged.layout, 'panorama');
  assert.deepEqual(stored, { headline: 'Eigener Einstieg', primaryCta: { label: 'Besprechen' }, meta: ['Original'] });
  const topic = withPerspectiveEditorDefaults('topicExplorer', { items: [{ title: 'Eigenes Thema' }] }, PERSPECTIVE_SECTION_PREVIEW_DATA.topicExplorer);
  const item = (topic.items as Record<string, unknown>[])[0];
  assert.deepEqual(item.cta, { label: '', href: '' });
  assert.deepEqual(item.bullets, []);
  assert.equal(item.imageAlt, '');
  assert.equal(item.detail, '');
  const absent = withPerspectiveEditorDefaults('topicExplorer', { headline: 'Noch ohne Themen' }, PERSPECTIVE_SECTION_PREVIEW_DATA.topicExplorer);
  assert.deepEqual(absent.items, []);
  const team = withPerspectiveEditorDefaults('teamSpotlight', { layout: 'contactSheet', members: [{ name: 'Eine Person' }] }, SECTION_PREVIEW_DATA.teamSpotlight);
  for (const field of ['phone', 'email', 'contactName', 'imageAlt', 'imagePosition']) assert.equal((team.members as Record<string, unknown>[])[0][field], '');
  const legacy = { layout: 'directory', headline: 'Bestehender Inhalt' };
  assert.equal(withPerspectiveEditorDefaults('teamSpotlight', legacy, SECTION_PREVIEW_DATA.teamSpotlight), legacy);
});

test('generated color fields accept independent normal and photo roles through the public write contract', () => {
  for (const type of types) {
    const fields = getFieldsForSection(type, 'consulting', `${type}.shared.v1`);
    for (const field of ['sectionBg', 'headingColor', 'bodyColor', 'mutedColor']) assert.ok(fields.includes(field as never), `${type}: ${field}`);
    if (type === 'perspectiveHero' || type === 'photoChapter') for (const field of ['imageOverlay', 'onDarkHeading', 'onDarkBody', 'onDarkMuted']) assert.ok(fields.includes(field as never), `${type}: ${field}`);
  }
  assert.deepEqual(normalizeStyleOverridesForSection('perspectiveHero', { sectionBg: '#ffffff', headingColor: '#111827', onDarkHeading: '#fafafa', imageOverlay: '#09121b', btnBg: '#f1f5f9', btnText: '#111827' }, 'hotel', 'perspectiveHero.shared.v1'), {
    '--token-section-bg': '#ffffff', '--token-heading': '#111827', '--token-on-dark-heading': '#fafafa', '--token-image-overlay': '#09121b', '--token-btn-bg': '#f1f5f9', '--token-btn-text': '#111827',
  });
});

test('renderer gives the new types their own pacing and preserves contained legacy team layouts', () => {
  const section = (type: string, data: Record<string, unknown>): SnapshotSection => ({ id: `test-${type}`, type, definitionKey: `${type}.shared.v1`, schemaVersion: 1, variant: null, visible: true, container: 'default', spacingTop: 'xl', spacingBottom: 'xl', anchorId: null, data });
  for (const type of types) {
    const html = renderToStaticMarkup(createElement(SectionRenderer, { section: section(type, { ...PERSPECTIVE_SECTION_PREVIEW_DATA[type], image: '', secondaryImage: '', items: [] }), industry: 'consulting' }));
    assert.match(html, /data-section-spacing-top="component"/);
    assert.doesNotMatch(html, /class="cms-section-shell /);
  }
  const contact = renderToStaticMarkup(createElement(SectionRenderer, { section: section('teamSpotlight', { layout: 'contactSheet', members: [{ name: 'Kontakt' }] }) }));
  const directory = renderToStaticMarkup(createElement(SectionRenderer, { section: section('teamSpotlight', { layout: 'directory', members: [{ name: 'Bestehend' }] }) }));
  assert.match(contact, /data-section-spacing-top="component"/);
  assert.match(directory, /class="cms-section-shell /);
});

test('utility sections without a repeated section headline promote real rows to H2 and omit empty headers', () => {
  const topic = render(TopicExplorerSection, { items: [{ title: 'Verkehrsrecht', summary: 'Nach einem Unfall.' }] });
  const resources = render(ResourceListSection, { groups: [{ title: 'Vollmachten', items: [{ title: 'Prozessvollmacht', href: '/vollmacht.pdf', format: 'PDF' }] }] });
  const briefing = render(EditorialBriefingSection, { groups: [{ title: 'Welche Abrechnung?', items: ['Die konkrete Forderung.'] }] });
  for (const html of [topic, resources, briefing]) {
    assert.equal((html.match(/<h2\b/g) || []).length, 1);
    assert.doesNotMatch(html, /<h3\b|<header/);
    assert.match(html, /pb-14 pt-5 md:pb-20 md:pt-8/);
  }
});

test('a single practice counsel uses a moderate portrait while its linked name owns the section heading', () => {
  const html = render(TeamSpotlightSection, { layout: 'contactSheet', titleAs: 'h2', subline: 'Eine konkrete fachliche Perspektive.', members: [{ name: 'Veronika Beispiel', role: 'Fachanwältin für Verkehrsrecht', image: '/portrait.jpg', imagePosition: '50% 26%', href: '/veronika', phone: '+49 841 123', contactName: 'Das zuständige Sekretariat' }] });
  assert.match(html, /data-team-composition="single"/);
  assert.match(html, /w-\[220px\]/);
  assert.match(html, /sizes="\(min-width:768px\) 360px, 220px"/);
  assert.equal((html.match(/<h2\b/g) || []).length, 1);
  assert.match(html, /href="\/veronika"/);
  assert.match(html, /Fachanwältin für Verkehrsrecht/);
  assert.match(html, /Das zuständige Sekretariat/);
  assert.doesNotMatch(html, /<h3\b|opacity-0/);
});

test('editorial contact keeps working labeled fields and places immediate contacts before the form', () => {
  const data = { layout: 'editorial', titleAs: 'h1', headline: 'Kontakt & Termin.', introText: '<p>Besprechen Sie Ihre Frage.</p>', privacyHref: '/datenschutz', formFields: [{ name: 'name', label: 'Ihr vollständiger Name', type: 'text', required: true }, { name: 'message', label: 'Ihre Nachricht', type: 'textarea', required: true }], infoCards: [null, { icon: 'Phone', label: 'Telefon', value: '+49 841 123', href: 'tel:+49841123' }, { icon: 'Mail', label: 'E-Mail', value: 'info@example.com' }, { icon: 'Clock', label: 'Sprechzeiten', value: 'Montag bis Freitag nach Vereinbarung' }, { icon: 'MapPin', label: 'Adresse', value: 'Eine echte Adresse' }] };
  const html = render(ContactSection, data);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /data-contact-layout="editorial"/);
  assert.ok(html.indexOf('href="tel:+49841123"') < html.indexOf('<form'));
  assert.ok(html.indexOf('href="mailto:info@example.com"') < html.indexOf('<form'));
  assert.ok(html.indexOf('Montag bis Freitag nach Vereinbarung') > html.indexOf('</form>'));
  assert.ok(html.indexOf('Eine echte Adresse') > html.indexOf('</form>'));
  assert.match(html, /<label[^>]*for="[^"]+-name"/);
  assert.match(html, /<input(?=[^>]*name="name")(?=[^>]*required="")[^>]*>/);
  assert.match(html, /href="\/datenschutz"/);
  assert.match(html, /data-edit-collection="infoCards" data-edit-index="1"/);
  assert.doesNotMatch(html, /cms-card|style="[^"]*box-shadow|\[box-shadow:|data-card|lucide-phone|rounded-xl bg-\[color-mix/);
  const legacy = render(ContactSection, { headline: 'Bestehender Kontakt', formEnabled: false, infoCards: [{ icon: 'Phone', label: 'Telefon', value: '+49 111' }] });
  assert.doesNotMatch(legacy, /data-contact-layout="editorial"/);
  assert.match(legacy, /cms-card/);
});

test('editorial contact layout, complete form controls and mobile focal point remain public CMS contracts', () => {
  const contact = getAllSectionContracts().find(item => item.type === 'contact')!;
  assert.ok(contact.fields.find(item => item.key === 'layout')?.options?.includes('editorial'));
  assert.deepEqual(contact.fields.find(item => item.key === 'titleAs')?.options, ['h1', 'h2']);
  assert.ok(contact.fields.find(item => item.key === 'formFields')?.itemFields?.find(item => item.key === 'type')?.options?.includes('textarea'));
  const schemas = getCatalogSectionSchemas('consulting') as Record<string, { fields: Record<string, string> }>;
  assert.match(schemas.contact.fields.layout, /contact\.shared\.v1/);
  assert.match(schemas.perspectiveHero.fields.imageMobilePosition, /inherits imagePosition/);
  const defaults = withPerspectiveEditorDefaults('contact', { layout: 'editorial', infoCards: [{ value: 'Eigener Kontakt' }], formFields: [{ name: 'name', label: 'Eigene Beschriftung', type: 'text' }] }, EDITORIAL_CONTACT_EDITOR_DEFAULTS);
  assert.equal(defaults.privacyHref, '');
  assert.equal(defaults.titleAs, 'h2');
  assert.equal((defaults.infoCards as Record<string, unknown>[])[0].href, '');
  assert.equal((defaults.formFields as Record<string, unknown>[])[0].placeholder, '');
  assert.deepEqual((defaults.formFields as Record<string, unknown>[])[0].options, []);
  const hero = render(PerspectiveHeroSection, { layout: 'panorama', headline: 'Klarheit.', image: '/courtyard.jpg', imagePosition: '58% center', imageMobilePosition: '61% center' });
  assert.match(hero, /object-position:58% center/);
  assert.match(hero, /--perspective-mobile-focal:61% center/);
});

test('display word composition and native open indication do not rely on inherited wrapping or transforms', () => {
  const css = readFileSync(new URL('../globals.css', import.meta.url), 'utf8');
  assert.match(css, /\[data-topic-explorer\] details\[open\] > summary \.topic-open-indicator \{ display: block; \}/);
  assert.match(css, /\[data-topic-explorer\] details\[open\] > summary \.topic-closed-indicator \{ display: none; \}/);
  assert.match(css, /\[data-contact-layout="editorial"\]\) :is\(h1, h2, h3\) \{\s*overflow-wrap: normal;\s*word-break: normal;/);
  const html = render(TopicExplorerSection, { items: [{ title: 'Eine offene Frage' }, { title: 'Eine zweite Frage' }] });
  assert.equal((html.match(/topic-open-indicator/g) || []).length, 2);
  assert.equal((html.match(/topic-closed-indicator/g) || []).length, 2);
  assert.doesNotMatch(html, /group-open\/topic:rotate|transition-transform/);
});
