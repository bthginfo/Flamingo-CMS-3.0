import assert from 'node:assert/strict';
import test from 'node:test';
import React, { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { EditionHero } from '../templates/shared/edition-hero';
import { CinematicHeroSection } from '../templates/shared/cinematic-hero';
import { SignaturePathSection } from '../templates/advanced/signature-path';
import { TeamSpotlightSection } from '../templates/shared/team-spotlight';
import { getAllSectionContracts } from './section-contracts';
import { ScrollStorySection } from '../templates/shared/scroll-story';
import { GuidedChoiceSection } from '../templates/advanced/guided-choice';
import { FaqAccordion } from '../templates/shared/faq-accordion';
import { getSectionSchemas } from './section-data-schemas';
import { validateBrandPayload } from './color-validation';
import { readFileSync } from 'node:fs';

(globalThis as typeof globalThis & { React: typeof React }).React = React;

test('photo and portrait openings expose the photo before the page heading in server markup', () => {
  for (const layout of ['edition', 'portrait']) {
    const markup = renderToStaticMarkup(createElement(EditionHero, { data: { layout, headline: 'Persönliche Beratung', text: '<p>Ein verständlicher Einstieg.</p>', imagePrimary: '/hero.jpg', imageAlt: 'Das tatsächliche Motiv', imagePrimaryPosition: '62% 28%', primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' } } }));
    assert.equal((markup.match(/<h1\b/g) || []).length, 1);
    assert.ok(markup.indexOf('<figure') < markup.indexOf('<h1'));
    assert.ok(markup.includes('alt="Das tatsächliche Motiv"'));
    assert.ok(markup.includes('object-position:62% 28%'));
    assert.ok(markup.includes('href="/kontakt"'));
    assert.ok(markup.includes('/_next/image?'), 'Photographic opening must use optimized image delivery');
  }
});

test('cinematic image focal point and ordinary secondary navigation survive rendering', () => {
  const markup = renderToStaticMarkup(createElement(CinematicHeroSection, { data: { headline: 'Ein klarer Einstieg', image: '/road.jpg', imageAlt: 'Straße von oben', imagePosition: '30% 65%', imageEffect: 'none', secondaryCta: { label: 'Anrufen', href: 'tel:+49841935570' } } }));
  assert.ok(markup.includes('object-position:30% 65%'));
  assert.ok(markup.includes('alt="Straße von oben"'));
  assert.ok(markup.includes('href="tel:+49841935570"'));
  assert.ok(!markup.includes('lucide-play'));
});

test('all seven advertised path stations and optional text survive server rendering', () => {
  const items = Array.from({ length: 7 }, (_, index) => ({ title: `Sichtbare Station ${index + 1}`, ...(index === 6 ? {} : { text: `Inhalt ${index + 1}` }) }));
  const markup = renderToStaticMarkup(createElement(SignaturePathSection, { data: { headline: 'Ein vollständiger Weg', items } }));
  for (const item of items) assert.ok(markup.includes(item.title), item.title);
});

test('a directory can be the page opening while preserving qualification and person link', () => {
  const markup = renderToStaticMarkup(createElement(TeamSpotlightSection, { data: { layout: 'directory', titleAs: 'h1', headline: 'Die Menschen', members: [{ name: 'Eine Person', role: 'Die genaue Qualifikation', image: '/portrait.jpg', imageAlt: 'Authentisches Porträt', href: '/profil' }] } }));
  assert.equal((markup.match(/<h1\b/g) || []).length, 1);
  assert.equal((markup.match(/<h2\b/g) || []).length, 1);
  assert.equal((markup.match(/<h3\b/g) || []).length, 0);
  assert.ok(markup.includes('Die genaue Qualifikation'));
  assert.ok(markup.includes('href="/profil"'));
});

test('a path uses the authored item action while retaining legacy title fallback', () => {
  const markup = renderToStaticMarkup(createElement(SignaturePathSection, { data: { headline: 'Vorbereitung', showKickers: false, items: [{ title: 'Der erste Schritt', text: 'Termin und Thema abstimmen.', href: '/kontakt', ctaLabel: 'Termin abstimmen' }, { title: 'Der zweite Schritt', text: 'Vorhandene Unterlagen ordnen.', href: '/service' }] } }));
  assert.ok(markup.includes('Termin abstimmen'));
  assert.ok(markup.includes('href="/service"'));
  assert.ok(!markup.includes('Entdecken'));
  assert.ok(!markup.includes('Station 01'));
  const schemas = getSectionSchemas('consulting') as Record<string, { fields: Record<string, string> }>;
  assert.ok(schemas.signaturePath.fields.items.includes('ctaLabel'));
});

test('editorial reading options hide scaffolding while preserving content and controls', () => {
  const story = renderToStaticMarkup(createElement(ScrollStorySection, { data: { headline: 'Beratung', showKickers: false, steps: [{ kicker: 'Redundantes Label', title: 'Ihre Frage', text: 'Der Zusammenhang bleibt lesbar.' }, { title: 'Die nächste Entscheidung', text: 'Auch ohne Kicker.' }] } }));
  assert.ok(story.includes('Ihre Frage'));
  assert.ok(!story.includes('Redundantes Label'));
  assert.ok(!story.includes('>02<'));
  const faq = renderToStaticMarkup(createElement(FaqAccordion, { showNumbers: false, items: [{ question: 'Wie beginnt die Beratung?', answer: 'Mit Ihrer konkreten Frage.' }] }));
  assert.ok(faq.includes('<summary'));
  assert.ok(!faq.includes('cms-accordion-index'));
  const choice = renderToStaticMarkup(createElement(GuidedChoiceSection, { data: { headline: 'Themen finden', mode: 'branch', showKickers: false, questions: [{ id: 'start', label: 'Was beschäftigt Sie?', answers: [{ id: 'a', label: 'Arbeit', resultId: 'arbeit' }, { id: 'b', label: 'Familie', resultId: 'familie' }] }], results: [{ id: 'arbeit', title: 'Arbeitsrecht' }, { id: 'familie', title: 'Familienrecht' }] } }));
  assert.ok(choice.includes('Was beschäftigt Sie?'));
  assert.ok(choice.includes('Arbeit'));
  assert.ok(!choice.includes('Passender nächster Schritt'));
  assert.ok(!choice.includes('Frage 1'));
});

test('navigation mode validates and the actual layout option labels retain UTF-8', () => {
  assert.equal(validateBrandPayload({ navMode: 'solid', navBgColor: '#f5f3ed', navLinkColor: '#172e40' }).filter(issue => issue.severity === 'error').length, 0);
  assert.ok(validateBrandPayload({ navMode: 'invalid' }).some(issue => issue.location === 'brand.navMode' && issue.severity === 'error'));
  const editor = readFileSync(new URL('../app/admin/pages/[id]/section-data-editor.tsx', import.meta.url), 'utf8');
  assert.ok(editor.includes("['portrait', 'Porträt – Person im Einstieg']"));
  assert.ok(editor.includes("['edition', 'Edition – Fototitelseite']"));
  assert.ok(editor.includes("['journal', 'Journal – Titel und Bildstrecke']"));
});

test('new hero layouts and focal fields remain public CMS/API choices', () => {
  const contracts = getAllSectionContracts();
  const editorial = contracts.find(contract => contract.type === 'editorialHero')!;
  const layout = editorial.fields.find(field => field.key === 'layout')!;
  for (const value of ['edition', 'portrait', 'journal']) assert.ok(layout.options?.includes(value));
  const cinematic = contracts.find(contract => contract.type === 'cinematicHero')!;
  assert.equal(cinematic.fields.find(field => field.key === 'image')?.supportsFocalPoint, true);
  assert.equal(cinematic.fields.find(field => field.key === 'imagePosition')?.type, 'text');
  assert.equal(cinematic.fields.find(field => field.key === 'imageAlt')?.type, 'text');
});
