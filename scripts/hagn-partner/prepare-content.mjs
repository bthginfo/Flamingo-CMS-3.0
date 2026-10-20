/** Pure deterministic CMS seed. Importing this module never reads a DB or starts I/O. */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { lawyers, practices, staff } from './content.mjs';
import { sourceMedia } from './import-assets.mjs';
import { stockMedia } from './stock-media.mjs';
import { buildPerspectiveSections } from './perspective-content.mjs';
import { pageMetadata } from './page-metadata.mjs';

const require = createRequire(import.meta.url);
require('tsx/cjs');
const { getFieldsForSection } = require('../../apps/renderer/src/lib/section-color-resolver.ts');
const { FIELD_DEFS } = require('../../apps/renderer/src/lib/section-color-fields.ts');

export const HAGN_TENANT_ID = 'a1853e0f-ff90-45ee-8fb2-8bada3812f67';
const STAMP = '2026-10-20T00:00:00.000Z';
const NAME = 'Rechtsanwälte Hagn, Deckert, Stemmer & Partner PartG mbB';
const PHONE = '+49 841 93557-0';
const EMAIL = 'info@hagn-partner.de';
const ADDRESS = 'Bergbräustr. 7, 85049 Ingolstadt';
const SITE_SOURCE = 'https://www.hagn-partner.de';
const p = value => `<p>${value}</p>`;
const a = (label, href) => ({ label, href });
const tel = phone => `tel:${phone.replace(/[^+\d]/g, '')}`;
const route = slug => slug ? `/${slug}` : '/';
const SHARED = new Set(['editorialReel', 'imageAtlas', 'perspectiveHero', 'photoChapter', 'topicExplorer', 'editorialBriefing', 'resourceList', 'contact', 'editorialHero', 'teamSpotlight', 'cinematicHero', 'categoryMosaic', 'materialAtelier', 'cinematicChapters', 'serviceTabs', 'signaturePath', 'signatureGrid', 'scrollStory', 'ctaSplit', 'faqContactSplit', 'guidedChoice', 'timeline']);
const definition = type => `${type}.${SHARED.has(type) ? 'shared' : type === 'faq' ? 'consulting' : 'tradesman'}.v1`;

export function hagnUuid(tenantId, key) {
  const hex = createHash('sha256').update(`${tenantId}/hagn/${key}`).digest('hex').slice(0, 32).split('');
  hex[12] = '5'; hex[16] = ((parseInt(hex[16], 16) & 3) | 8).toString(16);
  const v = hex.join(''); return `${v.slice(0, 8)}-${v.slice(8, 12)}-${v.slice(12, 16)}-${v.slice(16, 20)}-${v.slice(20)}`;
}

const lightPalette = {
  '--token-section-bg': '#FFFFFF', '--token-section-bg-alt': '#F2F5F7', '--token-card-bg': '#FFFFFF',
  '--token-heading': '#101820', '--token-body': '#364451', '--token-muted': '#596674', '--token-icon': '#0B55C4', '--token-accent': '#0B55C4',
  '--token-divider': '#CED6DD', '--token-card-border': '#CED6DD', '--token-btn-bg': '#101820', '--token-btn-text': '#FFFFFF',
  '--token-btn-secondary-bg': 'transparent', '--token-btn-secondary-text': '#101820', '--token-btn-secondary-border': '#8393A1',
  '--token-card-heading': '#101820', '--token-card-body': '#364451', '--token-card-muted': '#596674',
  '--token-badge-bg': '#EAF0FA', '--token-badge-text': '#174B91', '--token-badge-border': '#A9BEDB',
  '--token-link': '#0B55C4', '--token-link-hover': '#103B79', '--token-label': '#364451', '--token-input-bg': '#FFFFFF', '--token-input-border': '#8393A1', '--token-input-text': '#364451',
  '--token-on-dark-heading': '#FFFFFF', '--token-on-dark-body': '#EEF3F8', '--token-on-dark-muted': '#CBD5E1', '--token-eyebrow': '#596674', '--token-check': '#0B55C4', '--token-shadow': 'rgba(16, 24, 32, .12)',
  '--token-card-radius': '1rem', '--token-button-radius': '0.5rem', '--token-image-overlay': '#09121B',
};
const inkPalette = { ...lightPalette,
  '--token-section-bg': '#101820', '--token-section-bg-alt': '#182634', '--token-card-bg': '#1C2E3E',
  '--token-heading': '#FFFFFF', '--token-body': '#DCE4EB', '--token-muted': '#B9C7D3', '--token-icon': '#BBD4FF', '--token-accent': '#BBD4FF',
  '--token-divider': '#526677', '--token-card-border': '#526677', '--token-btn-bg': '#FFFFFF', '--token-btn-text': '#101820',
  '--token-btn-secondary-text': '#FFFFFF', '--token-btn-secondary-border': '#95A8BA',
  '--token-card-heading': '#FFFFFF', '--token-card-body': '#DCE4EB', '--token-card-muted': '#B9C7D3',
  '--token-link': '#BBD4FF', '--token-link-hover': '#FFFFFF', '--token-label': '#DCE4EB', '--token-eyebrow': '#B9C7D3',
};
const ownSpacing = new Set(['editorialReel', 'imageAtlas', 'perspectiveHero', 'photoChapter', 'topicExplorer', 'editorialBriefing', 'resourceList', 'teamSpotlight', 'contact', 'editorialHero', 'textImage', 'richText', 'legalContent']);

export function buildHagnContent({ tenantId = HAGN_TENANT_ID, baseUrl = 'https://flamingo-hagn-partner.vercel.app', mediaBase = '/hagn-partner', mediaMap = {}, noindex = true } = {}) {
  if (!/^[0-9a-f-]{36}$/i.test(tenantId)) throw new Error('A valid isolated tenant UUID is required.');
  const base = new URL(baseUrl).origin;
  const uid = key => hagnUuid(tenantId, key);
  const media = key => mediaMap[key] || mediaMap[`/hagn-partner/${key}`] || `${mediaBase.replace(/\/$/, '')}/${key}`;
  const absolute = value => new URL(value, `${base}/`).href;
  const section = (type, data, options = {}) => [type, data, options];
  const pages = [];
  const rows = [];
  const seoPages = [];
  const routes = [];
  const addPage = (slug, title, metaTitle, description, specs, sourceSlug = slug, ogImage) => {
    metaTitle = metaTitle.replace(/ \| Hagn & Partner Ingolstadt$/, ' | Hagn & Partner');
    if (metaTitle.length > 70 || description.length > 170) throw new Error(`SEO field too long: ${slug}`);
    const id = uid(`page/${slug || 'home'}`);
    const page = { id, tenant_id: tenantId, slug, title, type: 'free', status: 'published', visible: true, sort_order: pages.length, created_at: STAMP, updated_at: STAMP };
    pages.push(page);
    for (const [[type, data, options], order] of specs.map((spec, order) => [spec, order])) {
      const allowed = new Set(getFieldsForSection(type, 'consulting', definition(type)).map(field => FIELD_DEFS[field].cssVar));
      const styles = Object.fromEntries(Object.entries({ ...(options?.ink ? inkPalette : lightPalette), ...(options?.soft ? { '--token-section-bg': '#F2F5F7', '--token-section-bg-alt': '#E8EDF2' } : {}), ...(options?.style || {}) }).filter(([key]) => allowed.has(key)));
      rows.push({ id: uid(`section/${slug || 'home'}/${order}/${type}`), tenant_id: tenantId, page_id: id, type, data, variant: null, visible: true, locked: false, sort_order: order, container: 'default', spacing_top: ownSpacing.has(type) ? 'none' : 'm', spacing_bottom: ownSpacing.has(type) ? 'none' : 's', definition_key: definition(type), schema_version: 1, anchor_id: options?.anchor || null, title_internal: data.headline || type, style_overrides: styles });
    }
    const path = route(slug);
    const image = ogImage || media('kanzlei/besprechung.jpg');
    seoPages.push({ id: uid(`seo/${slug || 'home'}`), tenant_id: tenantId, page_id: id, meta_title: metaTitle, meta_description: description, og_image: absolute(image), canonical: `${base}${path}`, noindex, created_at: STAMP, updated_at: STAMP });
    routes.push({ path, pageId: id, title, metaTitle, description, sourceUrl: `${SITE_SOURCE}${route(sourceSlug)}`, canonical: `${base}${path}`, noindex });
  };

  const editionSections = buildPerspectiveSections({ media });
  for (const meta of pageMetadata) {
    const specs = editionSections[meta.slug];
    if (!specs) throw new Error(`Missing perspective publication page: ${meta.slug}`);
    const lawyer = lawyers.find(item => item.slug === meta.slug);
    addPage(meta.slug, meta.title, meta.metaTitle, meta.description, specs, meta.sourceSlug, lawyer ? media(`anwaelte/${lawyer.imageKey}.jpg`) : undefined);
  }

  const legalBlocks = [
    { headline: 'Anbieter und Kontakt', text: p(`${NAME}<br>${ADDRESS}<br>Telefon: ${PHONE}<br>Telefax: +49 841 93557-44<br><a href="mailto:${EMAIL}">${EMAIL}</a>`) },
    { headline: 'Register und Vertretung', text: p('Partnerschaftsregister des Amtsgerichts Ingolstadt, PR 1. Vertretungsberechtigte Gesellschafter laut Kanzleiangaben: Dr. iur. Niels Deckert, Markus Stemmer, Gabriele Radlinger und Veronika Hagn. Steuernummer: 124/162/02409.') },
    { headline: 'Berufsbezeichnungen und Kammer', text: p('Die Berufsbezeichnungen Rechtsanwalt und Rechtsanwältin wurden in der Bundesrepublik Deutschland verliehen. Zuständige Kammer ist die Rechtsanwaltskammer München, Tal 33, 80331 München. Die jeweiligen Fachanwaltsbezeichnungen stehen in den persönlichen Profilen.') + p('Zu den berufsrechtlichen Regelungen gehören BRAO, BORA, FAO, RVG und die Berufsregeln der Rechtsanwälte der Europäischen Gemeinschaft. Sie sind über die <a href="https://www.brak.de/anwaltschaft/berufsrecht/">Bundesrechtsanwaltskammer</a> zugänglich.') },
    { headline: 'Berufshaftpflicht', text: p('Als Berufshaftpflichtversicherer nennt die Kanzlei die Allianz Versicherungs-AG, Dieselstraße 8, 85774 Unterföhring. Angaben zum konkreten räumlichen Geltungsbereich und zum aktuellen Versicherungsschutz erhalten Sie bei der Kanzlei.') },
    { headline: 'Außergerichtliche Streitbeilegung', text: p('Die Kanzlei erklärt ihre grundsätzliche Bereitschaft zur Teilnahme an einem Streitbeilegungsverfahren bei der Schlichtungsstelle der Rechtsanwaltschaft. Aktuelle Anschrift der Stelle: Rauchstraße 26, 10787 Berlin. Weitere Informationen: <a href="https://www.schlichtungsstelle-der-rechtsanwaltschaft.de/">Schlichtungsstelle der Rechtsanwaltschaft</a>.') },
    { headline: 'Inhalt und Bildnachweis', text: p('Inhaltlich verantwortlich laut Kanzleiangaben: Veronika Hagn, erreichbar unter der oben genannten Anschrift. Kanzleifotografie und Porträts: Stefan Bösl Fotografie, Ingolstadt. Die übernommenen Kanzleidokumente und Fotografien stammen von der bisherigen Website.') + p('Ergänzende Symbolbilder: Filip Zrnzević, Juliane Liebermann, set.sj, Nastuh Abootalebi, Cytonn Photography, Moritz Kindler und Ruan Richard Rodrigues über Unsplash. Diese Motive zeigen weder Kanzleimitarbeiter oder Mandanten noch Räume oder Standorte der Kanzlei. <a href="https://unsplash.com/license">Unsplash-Lizenz</a>.') },
    { headline: 'Hinweise zur Kontaktaufnahme', text: p('Eine Kontaktaufnahme oder die Übermittlung von Formularen begründet allein noch kein Mandatsverhältnis. Die Mandatsübernahme bedarf der Annahme durch die Kanzlei. Für dringende Angelegenheiten und bestehende Fristen nehmen Sie bitte telefonisch Kontakt auf.') },
  ];
  const privacyBlocks = [
    { headline: 'Verantwortlicher', text: p(`${NAME}, ${ADDRESS}. Bei Fragen zum Umgang mit Ihren Daten erreichen Sie uns unter <a href="mailto:${EMAIL}">${EMAIL}</a> oder ${PHONE}.`) },
    { headline: 'Aufruf dieser Website', text: p('Bei der Bereitstellung der Website werden technische Verbindungsdaten verarbeitet, insbesondere IP-Adresse, Zeitpunkt des Aufrufs, angeforderte Adresse, Browserinformationen und gegebenenfalls die zuvor besuchte Seite. Die Verarbeitung dient der Auslieferung, Sicherheit und Fehleranalyse des Angebots. Grundlage ist Art. 6 Abs. 1 Buchst. f DSGVO; unser berechtigtes Interesse ist ein sicherer und funktionsfähiger Internetauftritt.') },
    { headline: 'Hosting und technische Dienstleister', text: p('Diese Website wird über Vercel bereitgestellt; die Serverfunktionen sind in Frankfurt eingerichtet. Für redaktionelle Daten und Kontaktanfragen wird eine gesonderte PostgreSQL-Datenbank bei Neon in der Region Frankfurt verwendet. Der E-Mail-Versand erfolgt über IONOS. Technische Dienstleister können die dafür erforderlichen Daten im Auftrag verarbeiten. Informationen: <a href="https://vercel.com/legal/privacy-policy">Vercel Datenschutz</a>, <a href="https://neon.com/privacy-policy">Neon Datenschutz</a> und <a href="https://www.ionos.de/terms-gtc/datenschutzerklaerung/">IONOS Datenschutz</a>. Soweit eine Verarbeitung außerhalb der EU stattfindet, sind die einschlägigen datenschutzrechtlichen Anforderungen an eine Übermittlung zu beachten.') },
    { headline: 'Kontaktformular, E-Mail und Telefon', text: p('Wenn Sie uns kontaktieren, verarbeiten wir die von Ihnen übermittelten Angaben zur Bearbeitung und Beantwortung Ihres Anliegens. Im Formular werden Name, E-Mail-Adresse, eine optionale Telefonnummer und Ihre Nachricht abgefragt. Bitte übermitteln Sie dort keine vertraulichen Falldokumente.') + p('Dient die Anfrage der Vorbereitung eines Mandats, erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 Buchst. b DSGVO. Sonstige Anfragen werden auf Grundlage von Art. 6 Abs. 1 Buchst. f DSGVO bearbeitet. Eine gegebenenfalls erteilte Einwilligung ist Art. 6 Abs. 1 Buchst. a DSGVO zuzuordnen. Die technischen Angaben zur Missbrauchsabwehr werden zum Schutz des Formulars verarbeitet.') },
    { headline: 'Speicherung und Löschung', text: p('Wir speichern personenbezogene Daten nur so lange, wie sie für den jeweiligen Zweck erforderlich sind oder gesetzliche Aufbewahrungspflichten bestehen. Für eine anwaltliche Beauftragung gelten die mandatsbezogenen Informationen zum Datenschutz. Technische Protokolle dienen der Sicherheit und Fehleranalyse und werden im Rahmen der eingesetzten Hosting-Konfiguration vorgehalten.') },
    { headline: 'Lokale Speicherung und optionale Dienste', text: p('Die Website kann Ihre Datenschutz-Auswahl lokal im Browser speichern. Für diese Bereitstellung sind keine externen Analyse- oder Werbeprofile eingerichtet. Die eingebundenen Kanzleifotos und PDF-Dokumente werden über diese Website ausgeliefert; Schriftdateien werden über die Website bereitgestellt. Eine Karte wird nicht automatisch geladen. Ein Kartenlink öffnet den externen Anbieter erst, wenn Sie ihn selbst aufrufen.') },
    { headline: 'Ihre Rechte', text: p('Nach Maßgabe der DSGVO können Sie Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit verlangen. Soweit eine Verarbeitung auf berechtigten Interessen beruht, steht Ihnen unter den gesetzlichen Voraussetzungen ein Widerspruchsrecht zu. Eine Einwilligung können Sie für die Zukunft widerrufen. Außerdem können Sie sich bei einer Datenschutzaufsichtsbehörde beschweren. Zuständig für nichtöffentliche Stellen in Bayern ist das <a href="https://www.lda.bayern.de/">Bayerische Landesamt für Datenschutzaufsicht</a>.') },
    { headline: 'Externe Links und Formulare', text: p('Bei Links zu externen Angeboten gelten die Datenschutzinformationen des jeweiligen Anbieters. Die im Servicebereich übernommenen PDF-Formulare sind eigenständige Kanzleidokumente. Bitte stimmen Sie die Verwendung und die Übermittlung ausgefüllter Unterlagen mit uns ab.') },
  ];
  for (const [slug, title, blocks] of [['impressum', 'Impressum', legalBlocks], ['datenschutz', 'Datenschutz', privacyBlocks]]) {
    addPage(slug, title, `${title} | Hagn & Partner Ingolstadt`, `${title} der Rechtsanwälte Hagn, Deckert, Stemmer & Partner PartG mbB in Ingolstadt. Kontakt und Informationen zum Betrieb dieser Website.`, [section('legalContent', { headline: title, blocks }, { style: { '--token-section-bg': '#FFFFFF' } })], slug);
    // LegalContent owns its H1 and requires the same physical fixed-header space.
    rows.find(item => item.page_id === uid(`page/${slug}`)).spacing_top = 'l';
  }

  const brand = {
    companyName: 'Hagn & Partner', tagline: 'Rechtsanwälte und Fachanwälte in Ingolstadt', logoDisplay: 'logo', logoUrl: media('logo.png'), faviconUrl: media('logo.png'),
    headingFont: 'Manrope', bodyFont: 'Manrope', customHeadingFontUrl: '', customHeadingFontName: '', customBodyFontUrl: '', customBodyFontName: '',
    primaryColor: '#101820', secondaryColor: '#0B55C4', accentColor: '#0B55C4', pageBg: '#FFFFFF', sectionBg: '#FFFFFF', sectionBgAlt: '#F2F5F7', cardBg: '#FFFFFF', headingColor: '#101820', bodyTextColor: '#364451', mutedTextColor: '#596674', iconColor: '#0B55C4', linkColor: '#0B55C4', linkHoverColor: '#103B79',
    btnPrimaryBg: '#101820', btnPrimaryText: '#FFFFFF', btnSecondaryBg: 'transparent', btnSecondaryText: '#101820', btnSecondaryBorder: '#8393A1', btnOutlineBg: 'transparent', btnOutlineText: '#101820', btnOutlineBorder: '#8393A1',
    badgeBg: '#EAF0FA', badgeText: '#174B91', badgeBorder: '#A9BEDB', cardBorder: '#CED6DD', borderColor: '#CED6DD', dividerColor: '#CED6DD', cardRadius: '1rem', btnRadius: '0.5rem',
    navMode: 'solid', navBgColor: '#FFFFFF', navLinkColor: '#101820', navBrandColor: '#101820', navLogoColor: '', topBarColor: '#101820', footerColor: '#101820', footerTextColor: '#DCE4EB', footerLinkColor: '#FFFFFF',
    localSeo: { businessType: 'LegalService', serviceArea: 'Ingolstadt und Umgebung', sameAs: [], services: practices.map(item => ({ name: item.title, description: item.intro, url: `${base}/${item.slug}` })) },
  };
  const formFields = [{ name: 'name', label: 'Ihr Name', type: 'text', placeholder: 'Vor- und Nachname', required: true, halfWidth: true }, { name: 'email', label: 'E-Mail-Adresse', type: 'email', placeholder: 'name@beispiel.de', required: true, halfWidth: true }, { name: 'phone', label: 'Telefon (optional)', type: 'tel', placeholder: 'Für die Terminabstimmung' }, { name: 'message', label: 'Ihr Anliegen', type: 'textarea', placeholder: 'Bitte beschreiben Sie kurz das Thema. Keine vertraulichen Falldokumente.', required: true }];
  const global = { id: uid('global'), tenant_id: tenantId, brand, contact: { phone: PHONE, email: EMAIL, address: ADDRESS }, openingHours: [
    { day: 'Montag', hours: '08:00–12:00 und 14:00–17:00' }, { day: 'Dienstag', hours: '08:00–12:00 und 14:00–17:00' }, { day: 'Mittwoch', hours: '08:00–12:00' }, { day: 'Donnerstag', hours: '08:00–12:00 und 14:00–17:00' }, { day: 'Freitag', hours: '08:00–12:00' }, { day: 'Samstag', closed: true }, { day: 'Sonntag', closed: true },
  ], design: { sectionBg: '#FFFFFF', sectionBgAlt: '#F2F5F7', cardBg: '#FFFFFF', headingColor: '#101820', bodyColor: '#364451', mutedColor: '#596674', textPrimary: '#101820', textSecondary: '#364451', accentColor: '#0B55C4', borderColor: '#CED6DD', dividerColor: '#CED6DD', btnBg: '#101820', btnText: '#FFFFFF', btnSecondaryBg: 'transparent', btnSecondaryText: '#101820', btnSecondaryBorder: '#8393A1' }, socialLinks: {}, formFields, autoResponse: { enabled: false, subject: '', body: '', notificationEmail: EMAIL }, businessProfile: null };
  // The business-profile editor and AI context share this strict versioned contract.
  global.businessProfile = {
    schemaVersion: '1.0',
    identity: { businessName: 'Hagn & Partner', legalName: NAME, locations: [{ city: 'Ingolstadt', region: 'Bayern', country: 'Deutschland', address: ADDRESS }], serviceAreas: ['Ingolstadt und Umgebung'] },
    audience: { primary: 'Privatpersonen und Unternehmen im Raum Ingolstadt mit rechtlichem Beratungsbedarf', needs: ['Ein rechtliches Anliegen verständlich einordnen', 'Den passenden Rechtsanwalt finden', 'Einen persönlichen Besprechungstermin vereinbaren'], objections: ['Unklarheit über Beratungskosten', 'Unsicherheit über erforderliche Unterlagen', 'Unklare Zuordnung zu einem Rechtsgebiet'] },
    goals: { primary: 'Qualifizierte Kontaktaufnahme und Terminvereinbarung', conversions: ['Telefonanruf', 'Terminanfrage', 'Kontakt zum passenden Sekretariat'] },
    offers: practices.map(item => ({ name: item.title, outcome: item.intro, proof: `Tätigkeitsgebiet auf ${SITE_SOURCE}/${item.slug}`, ctaLabel: 'Beratung vereinbaren', ctaHref: '/kontakt' })),
    voice: { attributes: ['Verständlich', 'Sachlich', 'Persönlich', 'Ansprache Sie'], avoid: ['Juristische Erfolgsgarantien', 'Unbestätigte Qualifikationen', 'Druck oder Angst als Werbemittel'] },
    facts: { approvedClaims: ['Kanzlei gegründet am 1. Juni 1978', 'Seit 1990 in der Bergbräustraße 7 in Ingolstadt', 'Sieben aktuelle Rechtsanwältinnen und Rechtsanwälte', 'Termine nach Vereinbarung', 'Eine Kontaktanfrage allein begründet kein Mandat'], prohibitedClaims: ['Erfolgsquoten oder erfundene Bewertungen', 'Garantierte Ergebnisse', '24-Stunden-Reaktionszusage', 'Nicht belegte Fachanwaltstitel'], unknowns: ['Individuelle Beratungskosten', 'Aktueller Geltungsbereich der Berufshaftpflichtversicherung', 'Betreiberfreigabe der neuen technischen Datenschutzhinweise'] },
  };
  // Keep exactly the central form definition as the section definition too.
  rows.filter(row => row.type === 'contact').forEach(row => { row.data.formFields = structuredClone(formFields); });
  const navigation = { id: uid('navigation'), tenant_id: tenantId, items: [a('Rechtsgebiete', '/rechtsgebiete-anwalt-ingolstadt'), a('Anwälte', '/anwaelte-ingolstadt'), a('Kanzlei', '/anwaltskanzlei-ingolstadt'), a('Service', '/service-anwaelte-ingolstadt')].map(item => ({ ...item, type: 'link' })), cta: { ...a('Kontakt & Termin', '/kontakt'), buttonColor: '#101820', buttonTextColor: '#FFFFFF', topBar: { enabled: false, text: '', linkLabel: '', linkHref: '', bgColor: '#101820', textColor: '#FFFFFF' } }, created_at: STAMP, updated_at: STAMP };
  const footer = { id: uid('footer'), tenant_id: tenantId, cta: { label: '', href: '', variant: 'classic' }, columns: [
    { title: 'Rechtsgebiete', items: practices.map(item => ({ text: item.title, href: route(item.slug) })) },
    { title: 'Die Kanzlei', items: [{ text: 'Unsere Anwälte', href: '/anwaelte-ingolstadt' }, { text: 'Kanzlei & Geschichte', href: '/anwaltskanzlei-ingolstadt' }, { text: 'Ersttermin & Kosten', href: '/anwalt-ingolstadt' }, { text: 'Vollmachten & Formulare', href: '/service-anwaelte-ingolstadt' }, { text: 'Unser Sekretariat', href: '/ingolstadt-anwaltskanzlei' }] },
    { title: 'Kontakt', items: [{ text: PHONE, href: tel(PHONE) }, { text: EMAIL, href: `mailto:${EMAIL}` }, { text: ADDRESS, href: '/kontakt#anfahrt' }] },
    { title: 'Bürozeiten', items: [{ text: 'Mo, Di, Do 08–12 und 14–17 Uhr' }, { text: 'Mi, Fr 08–12 Uhr' }, { text: 'Termine nach Vereinbarung' }] },
  ], legal_links: [a('Impressum', '/impressum'), a('Datenschutz', '/datenschutz')], created_at: STAMP, updated_at: STAMP };
  const snapshot = { pages: pages.map(page => ({ id: page.id, slug: page.slug, title: page.title, visible: true, sections: rows.filter(row => row.page_id === page.id).map(row => ({ id: row.id, type: row.type, definitionKey: row.definition_key, schemaVersion: row.schema_version, variant: row.variant, visible: row.visible, locked: row.locked, sortOrder: row.sort_order, container: row.container, spacingTop: row.spacing_top, spacingBottom: row.spacing_bottom, anchorId: row.anchor_id, data: structuredClone(row.data), styleOverrides: row.style_overrides })) })), collections: [], generatedAt: STAMP };
  const mediaRows = sourceMedia.map(([path, sourcePath, width, height, alt]) => ({ id: uid(`media/${path}`), tenant_id: tenantId, url: media(path), blob_url: absolute(media(path)), pathname: `hagn-partner/${path}`, filename: path.split('/').at(-1), mime_type: path.endsWith('.pdf') ? 'application/pdf' : path.endsWith('.png') ? 'image/png' : 'image/jpeg', size: 0, width, height, alt, caption: path.endsWith('.pdf') ? 'Originales Kanzleidokument der bisherigen Website' : path === 'logo.png' ? 'Originales Kanzleilogo der bisherigen Website' : 'Originales Kanzleifoto; die Quellwebsite nennt Stefan Bösl Fotografie für Kanzleifotografie und Porträts', folder: path.startsWith('downloads/') ? 'Hagn & Partner / Formulare' : 'Hagn & Partner / Originalmedien', source_url: `${SITE_SOURCE}/images/${sourcePath}` }));
  mediaRows.push(...stockMedia.map(item => ({ id: uid(`media/${item.path}`), tenant_id: tenantId, url: media(item.path), blob_url: absolute(media(item.path)), pathname: `hagn-partner/${item.path}`, filename: item.path.split('/').at(-1), mime_type: item.mimeType, size: item.bytes, width: item.width, height: item.height, alt: `${item.alt} · Symbolbild`, caption: `Symbolbild · ${item.credit}. Keine Darstellung der Kanzlei, ihrer Mitarbeiter, Mandanten oder Ingolstadts.`, folder: 'Hagn & Partner / Symbolbilder', source_url: item.sourceUrl, metadata: { sourceUrl: item.sourceUrl, downloadUrl: item.downloadUrl, creator: item.creator, credit: item.credit, license: item.license, symbolic: true, sha256: item.sha256 } })));
  const result = { tenant: { id: tenantId, name: NAME, slug: 'hagn-partner', industry: 'consulting', status: 'active', plan: 'standalone', deployment_mode: 'standalone', active_style: 'classic', is_demo: false, is_lead: false, i18n_enabled: false, i18n_locales: 'de', i18n_default_locale: 'de', created_at: STAMP, updated_at: STAMP }, global, navigation, footer, pages, sections: rows, collections: [], items: [], seo: { id: uid('seo-global'), tenant_id: tenantId, default_title: 'Rechtsanwälte in Ingolstadt | Hagn & Partner', title_template: '%s | Hagn & Partner', default_description: 'Rechtsanwälte und Fachanwälte in Ingolstadt. Persönliche Beratung für Privatpersonen und Unternehmen bei Hagn, Deckert, Stemmer & Partner.', default_og_image: absolute(media('kanzlei/besprechung.jpg')), canonical_base: base, locale: 'de_DE', robots: noindex ? 'noindex,nofollow' : 'index,follow', created_at: STAMP, updated_at: STAMP }, seoPages, seoItems: [], media: mediaRows, active: { id: uid('snapshot/initial'), tenant_id: tenantId, version: 1, is_active: true, created_at: STAMP, snapshot }, routeManifest: routes, sourceManifest: { source: SITE_SOURCE, checkedOn: '2026-10-19', isolated: true, noCentralDatabaseAccess: true, noindex, originalDomainNotChanged: true, legalEditorialStatus: 'Operator, profile and service facts checked against the original site. Technical privacy draft reflects the new stack; operator must confirm contractual processor/retention and insurance details before moving the existing public domain.', externalReferences: ['https://www.schlichtungsstelle-der-rechtsanwaltschaft.de/', 'https://www.rak-muenchen.de/', 'https://www.brak.de/anwaltschaft/berufsrecht/'], assets: mediaRows.map(item => ({ url: item.url, sourceUrl: item.source_url, generated: false })) } };
  validateHagnContent(result);
  return result;
}

export function validateHagnContent(doc) {
  const ids = new Set();
  const paths = new Set();
  for (const page of doc.pages) {
    if (ids.has(page.id) || paths.has(page.slug)) throw new Error(`Duplicate page: ${page.slug}`);
    ids.add(page.id); paths.add(page.slug);
    const sections = doc.sections.filter(section => section.page_id === page.id);
    if (sections.filter(section => ['perspectiveHero', 'editorialHero', 'cinematicHero', 'legalContent'].includes(section.type) || ['editorialReel', 'imageAtlas', 'richText', 'teamSpotlight', 'contact'].includes(section.type) && section.data.titleAs === 'h1').length !== 1) throw new Error(`One H1 required: ${page.slug}`);
    if (!doc.seoPages.find(seo => seo.page_id === page.id)) throw new Error(`SEO missing: ${page.slug}`);
  }
  const check = value => {
    if (Array.isArray(value)) value.forEach(check);
    else if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) {
      if (key === 'href' && typeof item === 'string' && item.startsWith('/') && !item.startsWith('/hagn-partner/')) {
        const slug = item.split('#')[0].slice(1);
        if (!paths.has(slug)) throw new Error(`Broken internal page: ${item}`);
      }
      check(item);
    }
  };
  check(doc.sections); check(doc.navigation); check(doc.footer);
  if (doc.pages.length !== 24 || lawyers.length !== 7 || doc.media.length !== sourceMedia.length + stockMedia.length) throw new Error('Unexpected Hagn inventory.');
  return true;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = resolve(process.env.HAGN_CONTENT_DIR || resolve(dirname(fileURLToPath(import.meta.url)), '../../tmp/hagn-perspective-2026-10-20'));
  const doc = buildHagnContent({ baseUrl: process.env.HAGN_SITE_URL || 'https://flamingo-hagn-partner.vercel.app' });
  try {
    const provenance = JSON.parse(await readFile(resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/sites/hagn-partner/MEDIA-PROVENANCE.json'), 'utf8'));
    for (const item of doc.media) { const match = provenance.assets.find(entry => entry.sourceUrl === item.source_url); if (match) { item.size = match.bytes; item.metadata = { ...item.metadata, sourceUrl: match.sourceUrl, sha256: match.sha256, credit: match.credit }; } }
  } catch { /* Assets can be imported separately; the pure builder still works. */ }
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, 'hagn-content.json'), `${JSON.stringify(doc, null, 2)}\n`);
  await writeFile(resolve(directory, 'route-manifest.json'), `${JSON.stringify(doc.routeManifest, null, 2)}\n`);
  console.log(`Hagn: ${doc.pages.length} native pages, ${doc.sections.length} editable sections, ${doc.seoPages.length} explicit SEO rows and ${doc.media.length} original and contextual assets. No database access.`);
}
