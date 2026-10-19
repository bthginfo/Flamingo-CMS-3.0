import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CorrespondenceHero } from './correspondence-hero';
import { TeamSpotlightSection } from './team-spotlight';

(globalThis as typeof globalThis & { React: typeof React }).React = React;

test('correspondence CMS changes update the actual headline, phone, media and reading rail', () => {
  const render = (phone: string, image: string, label: string) => renderToStaticMarkup(React.createElement(CorrespondenceHero, { data: {
    headline: 'Eine konkrete Entscheidung.', text: '<p>Eine verständliche Einordnung.</p>', imagePrimary: image, imageAlt: 'Eigener Besprechungsraum',
    contactRows: [{ label: 'Terminabstimmung', value: phone, href: `tel:${phone}` }], linksLabel: 'Ihre Orientierung', links: [{ label, href: '/profil' }],
    primaryCta: { label: 'Termin vereinbaren', href: '/kontakt' },
  } }));
  const before = render('+498411111', '/eigene-aufnahme.jpg', 'Zum Profil');
  const after = render('+498412222', '/anderes-bild.jpg', 'Zum Team');
  assert.equal((after.match(/<h1\b/g) || []).length, 1);
  assert.match(after, /href="tel:\+498412222"/);
  assert.match(after, /src="\/anderes-bild.jpg"/);
  assert.match(after, /alt="Eigener Besprechungsraum"/);
  assert.match(after, /aria-label="Ihre Orientierung"/);
  assert.match(after, /Zum Team/);
  assert.doesNotMatch(after, /Zum Profil|\+498411111|opacity-0/);
  assert.notEqual(before, after);
  assert.ok(after.includes('--opening-header-clearance'));
  assert.match(after, /stroke="currentColor"/);
});

test('untrusted rail and action URLs cannot become executable links', () => {
  const html = renderToStaticMarkup(React.createElement(CorrespondenceHero, { data: {
    headline: 'Sichere Links', links: [{ label: 'Unsicher', href: 'javascript:alert(1)' }], contactRows: [{ label: 'Telefon', value: 'Erreichbar', href: 'data:text/html,unsafe' }], primaryCta: { label: 'Unsicher', href: 'javascript:alert(2)' },
  } }));
  assert.doesNotMatch(html, /javascript:|data:text\/html|Unsicher/);
  assert.match(html, /Erreichbar/);
});

test('directory profiles keep their qualification visible and preserve editable profile links', () => {
  const html = renderToStaticMarkup(React.createElement(TeamSpotlightSection, { data: {
    layout: 'directory', headline: 'Die Anwälte', members: [{ name: 'Anna Beispiel', role: 'Fachanwältin für Familienrecht', image: '/anna.jpg', imageAlt: 'Porträt von Anna Beispiel', href: '/anna-profil', focus: ['Familienrecht', 'Zivilrecht'] }],
  } }));
  assert.match(html, /href="\/anna-profil"/);
  assert.match(html, /Fachanwältin für Familienrecht/);
  assert.match(html, /Familienrecht · Zivilrecht/);
  assert.match(html, /alt="Porträt von Anna Beispiel"/);
  assert.doesNotMatch(html, /max-h-0|opacity-0|whileInView|on-dark/);
  assert.match(html, /data-edit-collection="members"/);
});
