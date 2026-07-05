// Taoyin Zentrum Ingolstadt — Neuaufbau am Original www.taoyin-zentrum.com (de/en/es).
// Seiten modular in page-*.cjs; gemeinsame Bausteine in _shared.cjs.
const startseite = require('./page-startseite.cjs');
const { about, kontakt } = require('./pages-about-kontakt.cjs');
const taoyin = require('./page-taoyin.cjs');
const qiGong = require('./page-qi-gong.cjs');
const chiNeiTsang = require('./page-chi-nei-tsang.cjs');
const psychotherapie = require('./page-psychotherapie.cjs');
const { legal, collections } = require('./_carryover.cjs');

module.exports = {
  slug: 'taoyin',
  wipe: true,
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
  pages: [startseite, taoyin, qiGong, chiNeiTsang, psychotherapie, about, kontakt, ...legal],
  publish: true,
};
