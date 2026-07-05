// Taoyin Zentrum Ingolstadt — Neuaufbau am Original www.taoyin-zentrum.com (de/en/es).
// Seiten modular in page-*.cjs; gemeinsame Bausteine in _shared.cjs.
const startseite = require('./page-startseite.cjs');
const { about, kontakt } = require('./pages-about-kontakt.cjs');
const taoyin = require('./page-taoyin.cjs');
const qiGong = require('./page-qi-gong.cjs');
const chiNeiTsang = require('./page-chi-nei-tsang.cjs');
const psychotherapie = require('./page-psychotherapie.cjs');
const { legal, collections } = require('./_carryover.cjs');

// Stored convention: default-locale (de) fields live flat on the data object
// PLUS the de/en/es copies — validators and the renderer read the flat fields.
function flatten(node) {
  if (Array.isArray(node)) return node.map(flatten);
  if (node && typeof node === 'object') {
    if (node._localized && node.de) {
      const out = { ...flatten(node.de), _localized: true, de: flatten(node.de), en: flatten(node.en || {}), es: flatten(node.es || {}) };
      return out;
    }
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, flatten(v)]));
  }
  return node;
}

// Local-SEO: jede Seite bekommt Meta-Title + -Description mit Ingolstadt-Bezug.
const PAGE_SEO = {
  startseite: {
    metaTitle: 'Taoyin Zentrum Ingolstadt — Qi Gong, Tao Yin & Chi Nei Tsang',
    metaDescription: 'Taoistische Übungs- und Heilkunst in Ingolstadt: Qi Gong, Tao Yin, Chi Nei Tsang und Psychotherapie mit Estela Fuchs. Bei der Schleifmühle 34b, 85049 Ingolstadt.',
  },
  taoyin: {
    metaTitle: 'Tao Yin in Ingolstadt — taoistisches Yoga im Taoyin Zentrum',
    metaDescription: 'Tao Yin, das taoistische Yoga: sanfte Dehnungen, Atem und Stille für Faszien, Gelenke und innere Ruhe. Kurse und Einzelstunden im Taoyin Zentrum Ingolstadt.',
  },
  'qi-gong': {
    metaTitle: 'Qi Gong Kurse in Ingolstadt — Taoyin Zentrum',
    metaDescription: 'Qi Gong in Ingolstadt lernen: Kurse, Einzelunterricht und Workshops mit Estela Fuchs — über 30 Jahre taoistische Praxis. Jetzt Probestunde vereinbaren.',
  },
  'chi-nei-tsang': {
    metaTitle: 'Chi Nei Tsang Massage in Ingolstadt — Behandlung & Ausbildung',
    metaDescription: 'Chi Nei Tsang, die taoistische Bauchmassage, in Ingolstadt: Behandlungen für Verdauung, Nervensystem und emotionale Balance — plus fundierte Ausbildung.',
  },
  psychotherapie: {
    metaTitle: 'Psychotherapie in Ingolstadt — Praxis Estela Fuchs',
    metaDescription: 'Psychotherapie in Ingolstadt: ein geschützter Raum für persönliche Themen, verbunden mit körperorientierter taoistischer Praxis. Praxis Estela Fuchs.',
  },
  about: {
    metaTitle: 'Über mich — Estela Fuchs, Taoyin Zentrum Ingolstadt',
    metaDescription: 'Estela Fuchs: über 30 Jahre taoistischer Weg — Qi Gong-Lehrerin, Chi Nei Tsang-Praktikerin und Psychotherapeutin in Ingolstadt.',
  },
  kontakt: {
    metaTitle: 'Kontakt & Anfahrt — Taoyin Zentrum Ingolstadt',
    metaDescription: 'Taoyin Zentrum Ingolstadt, Bei der Schleifmühle 34b: Telefon +49 151 15539416 — Termine für Qi Gong, Chi Nei Tsang und Psychotherapie nach Vereinbarung.',
  },
  impressum: {
    metaTitle: 'Impressum — Taoyin Zentrum Ingolstadt',
    metaDescription: 'Impressum des Taoyin Zentrums Ingolstadt, Estela Fuchs, Bei der Schleifmühle 34b, 85049 Ingolstadt.',
  },
  datenschutz: {
    metaTitle: 'Datenschutz — Taoyin Zentrum Ingolstadt',
    metaDescription: 'Datenschutzerklärung des Taoyin Zentrums Ingolstadt: Informationen zur Verarbeitung personenbezogener Daten nach DSGVO.',
  },
};

const pages = [startseite, taoyin, qiGong, chiNeiTsang, psychotherapie, about, kontakt, ...legal]
  .map((page) => ({ ...page, seo: page.seo || PAGE_SEO[page.slug] }));

module.exports = flatten({
  slug: 'taoyin',
  wipe: true,
  seoGlobal: {
    titleTemplate: '%s | Taoyin Zentrum Ingolstadt',
    defaultTitle: 'Taoyin Zentrum Ingolstadt — Qi Gong, Tao Yin & Chi Nei Tsang',
    defaultDescription: 'Taoistische Übungs- und Heilkunst in Ingolstadt: Qi Gong, Tao Yin, Chi Nei Tsang und Psychotherapie mit Estela Fuchs. Bei der Schleifmühle 34b, Ingolstadt.',
    defaultOgImage: 'https://cdn.prod.website-files.com/6890d61524a7dba397203fde/689c709e31ebcac5995a9622_a9db9b1a-d5b1-4270-a1b0-8044de34b697.avif',
    locale: 'de_DE',
  },
  navigation: {
    items: [
      { label: 'Tao Yin', href: '/taoyin' },
      { label: 'Qi Gong', href: '/qi-gong' },
      { label: 'Chi Nei Tsang', href: '/chi-nei-tsang' },
      { label: 'Psychotherapie', href: '/psychotherapie' },
      { label: 'Über mich', href: '/about' },
    ],
    ctaLabel: 'Kontakt & Anfahrt',
    ctaHref: '/kontakt',
  },
  footer: {
    columns: [
      { title: 'Angebote', items: [
        { text: 'Tao Yin', href: '/taoyin' },
        { text: 'Qigong', href: '/qi-gong' },
        { text: 'Chi Nei Tsang Massage', href: '/chi-nei-tsang' },
        { text: 'Psychotherapie', href: '/psychotherapie' } ] },
      { title: 'Service', items: [
        { text: 'Anfahrt & Kontakt', href: '/kontakt' },
        { text: 'Über mich', href: '/about' } ] },
      { title: 'Kontakt', items: [
        { text: 'Bei der Schleifmühle 34b, 85049 Ingolstadt' },
        { text: '+49 151 15539416' },
        { text: 'info@taoyin-zentrum.de' },
        { text: 'info@estela-fuchs.com' } ] },
    ],
    legalLinks: [ { label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' } ],
  },
  collections,
  pages,
  publish: true,
});
