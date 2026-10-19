/** Pure deterministic CMS seed. Importing this module never reads a DB or starts I/O. */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { lawyers, practices, staff } from './content.mjs';
import { sourceMedia } from './import-assets.mjs';

const require = createRequire(import.meta.url);
require('tsx/cjs');
const { getFieldsForSection } = require('../../apps/renderer/src/lib/section-color-resolver.ts');
const { FIELD_DEFS } = require('../../apps/renderer/src/lib/section-color-fields.ts');

export const HAGN_TENANT_ID = 'a1853e0f-ff90-45ee-8fb2-8bada3812f67';
const STAMP = '2026-10-19T00:00:00.000Z';
const NAME = 'Rechtsanwälte Hagn, Deckert, Stemmer & Partner PartG mbB';
const PHONE = '+49 841 93557-0';
const EMAIL = 'info@hagn-partner.de';
const ADDRESS = 'Bergbräustr. 7, 85049 Ingolstadt';
const SITE_SOURCE = 'https://www.hagn-partner.de';
const p = value => `<p>${value}</p>`;
const ul = values => `<ul>${values.map(value => `<li>${value}</li>`).join('')}</ul>`;
const a = (label, href) => ({ label, href });
const tel = phone => `tel:${phone.replace(/[^+\d]/g, '')}`;
const route = slug => slug ? `/${slug}` : '/';
const definition = type => `${type}.${['editorialHero', 'teamSpotlight'].includes(type) ? 'shared' : type === 'faq' ? 'consulting' : 'tradesman'}.v1`;

export function hagnUuid(tenantId, key) {
  const hex = createHash('sha256').update(`${tenantId}/hagn/${key}`).digest('hex').slice(0, 32).split('');
  hex[12] = '5'; hex[16] = ((parseInt(hex[16], 16) & 3) | 8).toString(16);
  const v = hex.join(''); return `${v.slice(0, 8)}-${v.slice(8, 12)}-${v.slice(12, 16)}-${v.slice(16, 20)}-${v.slice(20)}`;
}

const lightPalette = {
  '--token-section-bg': '#FAF8F3', '--token-section-bg-alt': '#EFEEE7', '--token-card-bg': '#FFFFFF',
  '--token-heading': '#103B4A', '--token-body': '#33464C', '--token-muted': '#53636A', '--token-icon': '#195D67', '--token-accent': '#195D67',
  '--token-divider': '#BBC6C5', '--token-card-border': '#BBC6C5', '--token-btn-bg': '#103B4A', '--token-btn-text': '#FFFFFF',
  '--token-btn-secondary-bg': 'transparent', '--token-btn-secondary-text': '#103B4A', '--token-btn-secondary-border': '#6E8388',
  '--token-card-heading': '#103B4A', '--token-card-body': '#33464C', '--token-card-muted': '#53636A',
  '--token-badge-bg': '#E2EBE7', '--token-badge-text': '#164D55', '--token-badge-border': '#A3B8B4',
  '--token-link': '#195D67', '--token-link-hover': '#103B4A', '--token-label': '#33464C', '--token-input-bg': '#FFFFFF', '--token-input-border': '#7E9296', '--token-input-text': '#33464C',
  '--token-card-radius': '0.125rem', '--token-btn-radius': '0.125rem', '--token-image-overlay': 'rgba(10, 25, 31, 0.72)',
};
const inkPalette = { ...lightPalette,
  '--token-section-bg': '#103B4A', '--token-section-bg-alt': '#164654', '--token-card-bg': '#194D5A',
  '--token-heading': '#FAF8F3', '--token-body': '#E1E9E7', '--token-muted': '#C0D2D0', '--token-icon': '#CADFCE', '--token-accent': '#CADFCE',
  '--token-divider': '#587780', '--token-card-border': '#587780', '--token-btn-bg': '#FAF8F3', '--token-btn-text': '#103B4A',
  '--token-btn-secondary-text': '#FAF8F3', '--token-btn-secondary-border': '#90A8AB',
  '--token-card-heading': '#FAF8F3', '--token-card-body': '#E1E9E7', '--token-card-muted': '#C0D2D0',
  '--token-link': '#FAF8F3', '--token-link-hover': '#CADFCE', '--token-label': '#E1E9E7',
};
const ownSpacing = new Set(['editorialHero', 'textImage', 'richText', 'legalContent']);

export function buildHagnContent({ tenantId = HAGN_TENANT_ID, baseUrl = 'https://flamingo-hagn-partner.vercel.app', mediaBase = '/hagn-partner', mediaMap = {}, noindex = true } = {}) {
  if (!/^[0-9a-f-]{36}$/i.test(tenantId)) throw new Error('A valid isolated tenant UUID is required.');
  const base = new URL(baseUrl).origin;
  const uid = key => hagnUuid(tenantId, key);
  const media = key => mediaMap[key] || mediaMap[`/hagn-partner/${key}`] || `${mediaBase.replace(/\/$/, '')}/${key}`;
  const absolute = value => new URL(value, `${base}/`).href;
  const practiceFor = key => practices.find(item => item.key === key);
  const members = keys => keys.map(key => lawyers.find(lawyer => lawyer.key === key)).filter(Boolean).map(lawyer => ({ name: lawyer.name, role: lawyer.role, image: media(`anwaelte/${lawyer.imageKey}.jpg`), imageAlt: `Porträt von ${lawyer.name}`, imagePosition: 'center 25%', href: route(lawyer.slug), focus: lawyer.focus, quote: keys.length === 1 ? lawyer.intro : '' }));
  const section = (type, data, options = {}) => [type, data, options];
  const rich = (headline, content, options) => section('richText', { headline, titleAs: 'h2', content }, options);
  const index = (headline, subline, cards, options) => section('servicesGrid', { layout: 'index', headline, subline, manualCards: cards }, options);
  const people = (headline, subline, keys) => section('teamSpotlight', { layout: 'directory', badge: '', headline, subline, members: members(keys) });
  const faq = (headline, items) => section('faq', { headline, badgeText: '', expandFirst: false, items: items.map(([question, answer]) => ({ question, answer })) });
  const close = (headline = 'Sprechen wir über Ihr Anliegen.', subline = 'Vereinbaren Sie einen Termin in unserer Kanzlei in Ingolstadt. Bei zeitkritischen Fragen rufen Sie bitte direkt an.') => section('ctaBand', { layout: 'plain', headline, subline, badgeText: '', ctaPrimary: a('Termin vereinbaren', '/kontakt') }, { light: true });
  const hero = (headline, text, image = '', options = {}) => section('editorialHero', {
    layout: 'correspondence', compact: options.compact !== false, headline, text: p(text), imagePrimary: image ? media(`kanzlei/${image}.jpg`) : '', imageAlt: options.imageAlt || (image ? sourceMedia.find(entry => entry[0] === `kanzlei/${image}.jpg`)?.[4] || '' : ''), imagePrimaryPosition: 'center',
    primaryCta: options.primaryCta || a('Termin vereinbaren', '/kontakt'), secondaryCta: options.secondaryCta || {},
    contactRows: options.contactRows || [{ label: 'Kanzlei Ingolstadt', value: PHONE, href: tel(PHONE) }, { label: 'Ihr Weg zu uns', value: 'Bergbräustr. 7\n85049 Ingolstadt', href: '/kontakt#anfahrt' }],
    linksLabel: options.linksLabel || 'Orientierung', links: options.links || [], hint: options.hint || '', eyebrow: '',
  });
  const imageText = (headline, text, image, options = {}) => section('textImage', { headline, text, layout: options.layout || 'image-left', image: image ? media(`kanzlei/${image}.jpg`) : '', imageAlt: image ? sourceMedia.find(entry => entry[0] === `kanzlei/${image}.jpg`)?.[4] || '' : '', imagePosition: 'center', items: options.items || [], primaryCta: options.primaryCta || {}, secondaryCta: {} }, options);
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
      const styles = Object.fromEntries(Object.entries({ ...(options?.ink ? inkPalette : lightPalette), ...(options?.style || {}) }).filter(([key]) => allowed.has(key)));
      rows.push({ id: uid(`section/${slug || 'home'}/${order}/${type}`), tenant_id: tenantId, page_id: id, type, data, variant: null, visible: true, locked: false, sort_order: order, container: 'default', spacing_top: ownSpacing.has(type) ? 'none' : 'm', spacing_bottom: ownSpacing.has(type) ? 'none' : 's', definition_key: definition(type), schema_version: 1, anchor_id: options?.anchor || null, title_internal: data.headline || type, style_overrides: styles });
    }
    const path = route(slug);
    const image = ogImage || media('kanzlei/besprechung.jpg');
    seoPages.push({ id: uid(`seo/${slug || 'home'}`), tenant_id: tenantId, page_id: id, meta_title: metaTitle, meta_description: description, og_image: absolute(image), canonical: `${base}${path}`, noindex, created_at: STAMP, updated_at: STAMP });
    routes.push({ path, pageId: id, title, metaTitle, description, sourceUrl: `${SITE_SOURCE}${route(sourceSlug)}`, canonical: `${base}${path}`, noindex });
  };

  const practiceCards = practices.map(item => ({ title: item.title, text: item.intro, href: route(item.slug), icon: '' }));
  addPage('', 'Rechtsanwälte in Ingolstadt', 'Rechtsanwälte in Ingolstadt | Hagn & Partner', 'Rechtsanwälte und Fachanwälte in Ingolstadt: Verkehrsrecht, Mietrecht, Arbeitsrecht, Strafrecht und Familienrecht. Lernen Sie Hagn & Partner kennen.', [
    hero('Klarheit für Ihre nächste Entscheidung.', 'Rechtsanwälte und Fachanwälte in Ingolstadt. Wir hören zu, ordnen Ihre rechtliche Situation und besprechen mit Ihnen einen nachvollziehbaren Weg.', 'besprechung', { compact: false, secondaryCta: a('0841 93557-0', tel(PHONE)), links: [a('Das passende Rechtsgebiet', '/rechtsgebiete-anwalt-ingolstadt'), a('Ihre Anwältinnen und Anwälte', '/anwaelte-ingolstadt'), a('Ersttermin & Kosten', '/anwalt-ingolstadt')], hint: 'Für Privatpersonen und Unternehmen. Persönliche Termine nach Vereinbarung in der Bergbräustraße 7.' }),
    index('Worum geht es bei Ihnen?', 'Ein konkretes Anliegen ist der beste Anfang. Hier finden Sie unsere wesentlichen Rechtsgebiete und die passenden Ansprechpartner.', practiceCards),
    people('Persönlich an Ihrer Seite.', 'Sieben Rechtsanwältinnen und Rechtsanwälte, unterschiedliche Schwerpunkte und ein gemeinsames Verständnis: sorgfältig beraten und verständlich kommunizieren.', ['veronika-hagn', 'markus-stemmer', 'gabriele-radlinger']),
    imageText('Seit 1978 in Ingolstadt. Im Gespräch mit Ihnen.', p('Unsere Kanzlei wurde am 1. Juni 1978 gegründet. Seit 1990 sind wir in der Bergbräustraße 7 zuhause, direkt neben der Tiefgarage „Am Münster“.') + p('Wir nehmen Ihr Anliegen persönlich auf und klären, welche rechtlichen und praktischen Fragen zuerst beantwortet werden müssen. Dazu gehört auch, die Kosten der Beratung frühzeitig anzusprechen.'), 'empfang', { primaryCta: a('Unsere Kanzlei kennenlernen', '/anwaltskanzlei-ingolstadt'), ink: true }),
    faq('Gut vorbereitet zum ersten Gespräch.', [['Wie vereinbare ich einen Termin?', 'Rufen Sie unter +49 841 93557-0 an oder nutzen Sie die Kontaktseite. Wenn Sie schon wissen, welches Rechtsgebiet betroffen ist, nennen Sie es bitte bei Ihrer Anfrage.'], ['Welche Unterlagen soll ich mitbringen?', 'Hilfreich sind eine kurze zeitliche Übersicht, die vorhandenen Verträge und Schreiben sowie Ihre wichtigsten Fragen. Weitere Unterlagen stimmen wir mit Ihnen ab.'], ['Wie werden die Kosten besprochen?', 'Die Kosten der Beratung und eine mögliche Vergütungsvereinbarung werden transparent besprochen. Informationen zu einer Rechtsschutzversicherung können Sie bereits zur Terminvereinbarung bereithalten.']]),
    close('Der erste Schritt ist ein Gespräch.'),
  ]);

  addPage('anwaltskanzlei-ingolstadt', 'Unsere Kanzlei', 'Unsere Kanzlei in Ingolstadt | Hagn & Partner', 'Lernen Sie die Ingolstädter Kanzlei Hagn, Deckert, Stemmer & Partner kennen: persönliche Beratung, klare Ansprechpartner und Rechtsanwälte seit 1978.', [
    hero('Recht ist persönlich.', 'Was für Sie auf dem Spiel steht, lässt sich nicht auf ein Aktenzeichen reduzieren. Wir beginnen deshalb mit Ihrer Situation und den Fragen, die Sie beschäftigen.', 'empfang'),
    imageText('In Ingolstadt verwurzelt.', p('Die Kanzlei wurde am 1. Juni 1978 gegründet. Seit 1990 arbeiten wir in der Bergbräustraße 7 in der Ingolstädter Altstadt. Heute beraten hier sieben Rechtsanwältinnen und Rechtsanwälte.') + p('Privatpersonen und Unternehmen finden bei uns unterschiedliche rechtliche Schwerpunkte unter einem Dach. Für Terminabstimmung und organisatorische Fragen begleitet Sie unser Sekretariat.'), 'treppenhaus', { primaryCta: a('Die Menschen der Kanzlei', '/anwaelte-ingolstadt') }),
    index('Was unsere Zusammenarbeit trägt.', 'Sorgfalt zeigt sich in der Arbeit am konkreten Anliegen.', [{ title: 'Zuerst verstehen', text: 'Wir erfassen die Ausgangslage, Ihre Unterlagen und Ihr Ziel. Offene Fragen werden benannt, bevor das weitere Vorgehen besprochen wird.', href: '/anwalt-in-ingolstadt' }, { title: 'Möglichkeiten erklären', text: 'Juristische Fragen werden in ihren praktischen Zusammenhang gestellt. Sie sollen nachvollziehen können, welche Entscheidungen anstehen.', href: '/anwalt-in-ingolstadt' }, { title: 'Kosten ansprechen', text: 'Der finanzielle Rahmen gehört zum Gespräch. Vorhandene Informationen zur Rechtsschutzversicherung helfen bei der Einordnung.', href: '/anwalt-ingolstadt' }, { title: 'Verlässlich organisieren', text: 'Unser Sekretariat stimmt Termine und die benötigten Unterlagen mit Ihnen ab und verbindet Sie mit dem passenden Ansprechpartner.', href: '/ingolstadt-anwaltskanzlei' }]),
    close('Lernen wir Ihr Anliegen kennen.'),
  ]);
  addPage('anwaelte-ingolstadt', 'Ihre Anwälte', 'Anwälte & Fachanwälte in Ingolstadt | Hagn & Partner', 'Sieben Rechtsanwälte mit individuellen Schwerpunkten. Entdecken Sie die Profile und Fachanwaltsqualifikationen der Kanzlei Hagn & Partner in Ingolstadt.', [
    hero('Die Menschen hinter Ihrer Beratung.', 'Lernen Sie unsere sieben Rechtsanwältinnen und Rechtsanwälte kennen. Die Profile zeigen Qualifikationen, Tätigkeitsschwerpunkte und die passenden Kontakte im Sekretariat.'),
    people('Ihre Anwältinnen und Anwälte.', 'Fachliche Schwerpunkte und persönliche Ansprechpartner – offen und direkt zugänglich.', lawyers.map(lawyer => lawyer.key)),
    close('Noch unsicher, wer zu Ihrer Frage passt?', 'Beschreiben Sie Ihr Anliegen kurz am Telefon. Unser Sekretariat hilft bei der Zuordnung und Terminvereinbarung.'),
  ]);

  for (const lawyer of lawyers) {
    const portrait = media(`anwaelte/${lawyer.imageKey}.jpg`);
    const profileHero = hero(lawyer.name, lawyer.role, '', { primaryCta: a('Sekretariat anrufen', tel(lawyer.phone)), secondaryCta: a('Alle Anwälte', '/anwaelte-ingolstadt'), contactRows: [{ label: 'Terminabstimmung', value: lawyer.phone, href: tel(lawyer.phone) }, { label: 'Ihr Kontakt', value: lawyer.office }, { label: 'E-Mail', value: lawyer.email, href: `mailto:${lawyer.email}` }], hint: `Als Rechtsanw${lawyer.name.includes('Niels') || lawyer.key === 'markus-stemmer' ? 'alt' : 'ältin'} zugelassen seit ${lawyer.licensed}.` });
    addPage(lawyer.slug, lawyer.name, `${lawyer.name} | Rechtsanw${['niels-deckert', 'markus-stemmer'].includes(lawyer.key) ? 'alt' : 'ältin'} Ingolstadt`, `Rechtsberatung in Ingolstadt mit ${lawyer.name}. Erfahren Sie mehr über Qualifikationen, Tätigkeitsschwerpunkte und den Kontakt zum Sekretariat.`, [
      profileHero,
      section('textImage', { headline: 'Mit dem Blick auf Ihre Situation.', text: p(lawyer.intro) + p(lawyer.text), image: portrait, imageAlt: `Porträt von ${lawyer.name}`, imagePosition: 'center 25%', layout: 'image-left', primaryCta: {}, secondaryCta: {}, items: [] }),
      rich('Tätigkeitsschwerpunkte', lawyer.matters.map(([title, text]) => `<h3>${title}</h3>${p(text)}`).join('')),
      ...(lawyer.areas.length ? [index('Mehr zu den Rechtsgebieten.', '', lawyer.areas.map(key => practiceFor(key)).filter(Boolean).map(item => ({ title: item.title, text: item.intro, href: route(item.slug) })))] : [index('Ihr Anliegen einordnen.', 'Weitere Rechtsgebiete und Ansprechpartner finden Sie in unserer Übersicht.', [{ title: 'Alle Rechtsgebiete', text: 'Zivilrecht, Immobilien und unternehmerische Fragestellungen im Zusammenhang mit unseren weiteren Tätigkeitsfeldern.', href: '/rechtsgebiete-anwalt-ingolstadt' }])]),
      close('Ein Termin mit dem passenden Ansprechpartner.', `Für die Abstimmung mit ${lawyer.name} erreichen Sie ${lawyer.office} unter ${lawyer.phone}.`),
    ], lawyer.slug, portrait);
  }

  addPage('rechtsgebiete-anwalt-ingolstadt', 'Rechtsgebiete', 'Rechtsgebiete in Ingolstadt | Hagn & Partner', 'Verkehr, Miete und WEG, Arbeit, Strafrecht und Familie: Rechtsgebiete, Fachanwälte und weitere zivilrechtliche Beratung bei Hagn & Partner in Ingolstadt.', [
    hero('Ihr Anliegen gibt die Richtung vor.', 'Rechtliche Themen greifen oft ineinander. Hier finden Sie unsere wesentlichen Beratungsfelder und die Menschen, die Sie dabei begleiten.'),
    index('Unsere Rechtsgebiete.', 'Die Detailseiten zeigen typische Anliegen, hilfreiche Unterlagen und den passenden Kontakt.', practiceCards),
    rich('Weitere rechtliche Fragestellungen', p('Wir beraten außerdem in Angelegenheiten des allgemeinen Zivilrechts, des Immobilienrechts sowie des Handels- und Gesellschaftsrechts. Zwangsverwaltung und Opfervertretung gehören ebenfalls zu unserem Tätigkeitsangebot.') + p('Für Fragen zu Erbrecht, privatem Baurecht, Forderungsmanagement oder Verwaltungsrecht schildern Sie uns bitte Ihr konkretes Anliegen. Wir klären mit Ihnen, welcher Ansprechpartner und welcher Umfang der Beratung passen.') + p('<a href="/niels-deckert-anwalt-ingolstadt">Dr. iur. Niels Deckert: Immobilien, Handels- und Gesellschaftsrecht</a><br><a href="/markus-stemmer-anwalt-ingolstadt">Markus Stemmer: Miet- und WEG-Recht, Zwangsverwaltung</a><br><a href="/eva-huxmann-anwalt-ingolstadt">Eva Huxmann: unter anderem Verwaltungsrecht</a>')),
    close('Sie müssen Ihr Anliegen noch nicht juristisch benennen.'),
  ]);

  for (const practice of practices) {
    addPage(practice.slug, practice.title, `${practice.title} Ingolstadt | Hagn & Partner`, `${practice.title} in Ingolstadt bei Hagn & Partner: typische Anliegen, Fachanwälte, hilfreiche Unterlagen und Kontakt für Ihr persönliches Beratungsgespräch.`, [
      hero(practice.headline, `${practice.title} in Ingolstadt. ${practice.intro}`, practice.image, { links: [a('Anliegen & Themen', '#themen'), a('Ihre Ansprechpartner', '#ansprechpartner'), a('Für das erste Gespräch', '#vorbereitung')] }),
      rich('Dabei können wir Sie begleiten.', practice.topics.map(([title, text]) => `<h3>${title}</h3>${p(text)}`).join(''), { anchor: 'themen' }),
      people('Fachlich fokussiert. Persönlich erreichbar.', 'Die Terminvereinbarung erfolgt über das jeweilige Sekretariat. Alle Kontaktdaten finden Sie im Profil.', practice.specialists).map((entry, i) => i === 2 ? { ...entry, anchor: 'ansprechpartner' } : entry),
      imageText('Das erste Gespräch vorbereiten.', p(practice.process) + p('Hilfreich sind insbesondere:') + ul(practice.docs), practice.image === 'bibliothek' ? 'unterlagen' : 'bibliothek', { layout: 'image-right', anchor: 'vorbereitung', ink: true }),
      faq(`Fragen zur Beratung im ${practice.title === 'Miet- und WEG-Recht' ? 'Miet- und WEG-Recht' : practice.title}.`, practice.faqs),
      close('Besprechen wir Ihre konkrete Situation.'),
    ]);
  }

  addPage('anwalt-ingolstadt', 'Ersttermin & Kosten', 'Ersttermin & Kosten der Beratung | Hagn & Partner', 'So bereiten Sie Ihren ersten Anwaltstermin in Ingolstadt vor: Terminvereinbarung, Unterlagen, Rechtsschutz und transparente Abstimmung der Beratungskosten.', [
    hero('Ein guter Anfang schafft Orientierung.', 'Sie müssen Ihre Situation nicht schon rechtlich eingeordnet haben. Für das erste Gespräch reichen Ihr Anliegen, die vorhandenen Unterlagen und Ihre Fragen.', 'telefon'),
    index('Vom ersten Kontakt zum Gespräch.', 'Eine klare Vorbereitung hilft, die verfügbare Zeit für Ihr Anliegen zu nutzen.', [{ title: 'Termin abstimmen', text: 'Rufen Sie die Kanzlei an oder senden Sie eine Anfrage. Nennen Sie kurz das Thema, die Beteiligten und vorhandene Termine oder Fristen.', href: '/kontakt' }, { title: 'Unterlagen zusammenstellen', text: 'Bringen Sie Verträge, betroffene Schreiben, eine kurze zeitliche Übersicht und Ihre wichtigsten Fragen mit. Einzelheiten stimmen wir vorab mit Ihnen ab.', href: '/service-anwaelte-ingolstadt' }, { title: 'Kosten offen besprechen', text: 'Sprechen Sie die Beratungskosten und eine mögliche Vergütungsvereinbarung zu Beginn an. Angaben zu einer Rechtsschutzversicherung können hilfreich sein.', href: '/kontakt' }, { title: 'Den nächsten Schritt festhalten', text: 'Im Gespräch werden die Ausgangslage, offene Fragen und das mögliche weitere Vorgehen besprochen. Ein Mandat setzt die Annahme durch die Kanzlei voraus.', href: '/anwalt-in-ingolstadt' }]),
    rich('Kosten sind Teil der Beratung.', p('Die konkrete Vergütung hängt vom Anliegen und dem vereinbarten Umfang der Tätigkeit ab. Wir besprechen den Kostenrahmen und eine mögliche Vergütungsvereinbarung transparent mit Ihnen.') + p('Falls eine Rechtsschutzversicherung besteht, halten Sie die Versicherungsdaten bereit. Ob und in welchem Umfang Kosten übernommen werden, muss im Einzelfall geklärt werden. Formulare zur Beratungs- und Prozesskostenhilfe finden Sie im Servicebereich; deren Voraussetzungen werden individuell besprochen.')),
    faq('Vor Ihrem ersten Termin.', [['Wie viel Zeit sollte ich für die Vorbereitung einplanen?', 'Ordnen Sie vorhandene Unterlagen und notieren Sie die wichtigsten Daten und Fragen. Es ist nicht erforderlich, den gesamten Sachverhalt vorab juristisch zu bewerten.'], ['Kann ich vorab Unterlagen schicken?', 'Bitte stimmen Sie den Übermittlungsweg zunächst mit dem Sekretariat ab. Sensible Unterlagen sollten nicht unaufgefordert über ein allgemeines Kontaktformular versandt werden.'], ['Ist mit meiner Anfrage schon ein Mandat erteilt?', 'Nein. Eine Kontaktanfrage oder die Übersendung eines Formulars allein begründet noch kein Mandat. Die Übernahme muss durch die Kanzlei bestätigt werden.']]),
    close('Ihr erster Termin. Gut vorbereitet.'),
  ]);

  const downloads = [
    ['vollmacht', 'Vollmacht', 'Allgemeine Bevollmächtigung für die anwaltliche Tätigkeit.'], ['prozessvollmacht', 'Prozessvollmacht', 'Vollmacht zur Vertretung in einem gerichtlichen Verfahren.'], ['strafprozessvollmacht', 'Strafprozessvollmacht', 'Vollmacht für die Vertretung in Strafsachen.'], ['mandatsaufnahmebogen', 'Mandatsaufnahmebogen', 'Angaben zu Ihrer Person und Ihrem Anliegen für die Aufnahme in der Kanzlei.'], ['hinweise-datenverarbeitung', 'Hinweise zur Datenverarbeitung', 'Informationen der Kanzlei zum Umgang mit Daten im Mandatsverhältnis.'], ['schweigepfilcht-entbindung', 'Entbindung von der ärztlichen Schweigepflicht', 'Erklärung für die im konkreten Fall abgestimmte Anforderung medizinischer Informationen.'], ['beratungshilfe', 'Beratungshilfe', 'Formular zur individuellen Prüfung einer möglichen Beratungshilfe.'], ['prozesskostenhilfe', 'Prozesskostenhilfe', 'Formular für Angaben zu persönlichen und wirtschaftlichen Verhältnissen.'], ['musterwiderrufsformular', 'Musterwiderrufsformular', 'Vorhandenes Formular der Kanzlei zum Widerruf.'],
  ];
  addPage('service-anwaelte-ingolstadt', 'Vollmachten & Formulare', 'Vollmachten & Formulare | Hagn & Partner Ingolstadt', 'Originalformulare der Kanzlei Hagn & Partner: Vollmachten, Mandatsaufnahme, Datenverarbeitung, Beratungs- und Prozesskostenhilfe als PDF herunterladen.', [
    hero('Unterlagen, die den Anfang erleichtern.', 'Hier finden Sie die bisherigen Formulare der Kanzlei als PDF. Bitte stimmen Sie mit uns ab, welches Dokument für Ihr Anliegen benötigt wird.', '', { primaryCta: a('Rückfrage an die Kanzlei', '/kontakt'), hint: 'Die Formulare begründen allein noch kein Mandat. Unterschriebene Unterlagen bitte auf dem mit der Kanzlei vereinbarten Weg übermitteln.' }),
    index('Vollmachten & Formulare.', 'Originaldokumente aus dem Servicebereich der Kanzlei. Die Links öffnen PDF-Dateien.', downloads.map(([key, title, text]) => ({ title: `${title} · PDF`, text, href: media(`downloads/${key}.pdf`) }))),
    close('Welches Formular ist das richtige?', 'Unser Sekretariat hilft Ihnen bei der Zuordnung und bei Fragen zur Vorbereitung Ihres Termins.'),
  ]);

  addPage('kontakt', 'Kontakt & Anfahrt', 'Kontakt & Anfahrt Ingolstadt | Hagn & Partner', 'Hagn & Partner erreichen: +49 841 93557-0, info@hagn-partner.de. Kanzlei in der Bergbräustr. 7 in Ingolstadt, neben der Tiefgarage Am Münster.', [
    hero('Wir sind für Ihr Anliegen da.', 'Vereinbaren Sie einen persönlichen Besprechungstermin. Bei bestehenden Fristen oder kurzfristigen Terminen erreichen Sie uns am besten telefonisch.', '', { primaryCta: a('0841 93557-0 anrufen', tel(PHONE)), secondaryCta: a('E-Mail schreiben', `mailto:${EMAIL}`) }),
    section('contact', { headline: 'Eine kurze Nachricht genügt für den Anfang.', introText: p('Bitte nennen Sie das Thema und Ihre Kontaktdaten. Übermitteln Sie hier keine vertraulichen Falldokumente. Ein Mandat entsteht erst, wenn die Kanzlei die Übernahme bestätigt.'), badgeText: '', formEnabled: true, submitLabel: 'Terminanfrage senden', privacyHref: '/datenschutz', showMap: false, infoCards: [{ icon: 'Phone', label: 'Telefon', value: PHONE }, { icon: 'Mail', label: 'E-Mail', value: EMAIL }, { icon: 'MapPin', label: 'Adresse', value: ADDRESS }, { icon: 'Clock', label: 'Bürozeiten', value: 'Mo, Di, Do 08–12 und 14–17 Uhr · Mi, Fr 08–12 Uhr' }] }, { anchor: 'nachricht', style: { '--token-card-shadow': 'none' } }),
    imageText('Mitten in Ingolstadt.', p('Sie finden uns in der Bergbräustraße 7, 85049 Ingolstadt, direkt neben der Tiefgarage „Am Münster“. Termine finden nach vorheriger Vereinbarung statt.') + p('Bürozeiten: Montag, Dienstag und Donnerstag 08:00–12:00 und 14:00–17:00 Uhr. Mittwoch und Freitag 08:00–12:00 Uhr.') + p('Wenn Sie Fragen zum Zugang oder zu Ihrer Anreise haben, rufen Sie bitte vor Ihrem Besuch an.'), 'treppenhaus', { anchor: 'anfahrt', primaryCta: a('Route in Google Maps öffnen', 'https://www.google.com/maps/search/?api=1&query=Bergbr%C3%A4ustr.%207%2C%2085049%20Ingolstadt') }),
  ], 'impressum');

  addPage('anwalt-in-ingolstadt', 'Unser Beratungskonzept', 'Persönliche Rechtsberatung | Hagn & Partner Ingolstadt', 'Sorgfältig zuhören, rechtliche Möglichkeiten verständlich erklären und Kosten offen besprechen: das Beratungskonzept der Kanzlei Hagn & Partner.', [
    hero('Erst verstehen. Dann entscheiden.', 'Rechtsberatung beginnt mit einer guten Frage und einem aufmerksamen Gespräch. Wir ordnen gemeinsam, was Ihnen wichtig ist und was als Nächstes geklärt werden muss.', 'gespraech'),
    rich('Sorgfältig in der Sache. Verständlich im Gespräch.', p('Eine rechtliche Einschätzung braucht einen sorgfältig erfassten Sachverhalt. Deshalb gehören Ihr Bericht und die vorhandenen Unterlagen zusammen. Widersprüche, fehlende Informationen und offene Fragen werden im Gespräch benannt.') + p('Unser Ziel ist eine nachvollziehbare Grundlage für Ihre Entscheidung. Rechtliche Möglichkeiten werden mit dem praktischen und wirtschaftlichen Zusammenhang Ihres Anliegens verbunden. Auch die Kosten der Tätigkeit gehören zu einer offenen Abstimmung.')),
    index('Was Sie zur Zusammenarbeit beitragen können.', '', [{ title: 'Die Ausgangslage schildern', text: 'Eine kurze zeitliche Übersicht zeigt, was passiert ist und welche Schreiben oder Vereinbarungen es bereits gibt.', href: '/anwalt-ingolstadt' }, { title: 'Ihre Ziele benennen', text: 'Was soll geklärt werden? Was ist Ihnen besonders wichtig? Ihre Sicht gibt dem Gespräch eine klare Richtung.', href: '/anwalt-ingolstadt' }, { title: 'Fragen stellen', text: 'Sprechen Sie an, wenn ein Begriff oder ein möglicher Schritt unklar bleibt. Verständlichkeit ist Teil der Beratung.', href: '/kontakt' }, { title: 'Änderungen mitteilen', text: 'Neue Schreiben, Termine oder Entwicklungen können für die weitere Bearbeitung relevant sein. Stimmen Sie den Austausch mit uns ab.', href: '/kontakt' }]),
    close(),
  ]);
  addPage('anwaltskanzlei-in-ingolstadt', 'Kanzleigeschichte', 'Kanzleigeschichte seit 1978 | Hagn & Partner Ingolstadt', 'Die Geschichte der Ingolstädter Rechtsanwaltskanzlei Hagn & Partner: gegründet am 1. Juni 1978, seit 1990 in der Bergbräustraße 7.', [
    hero('Eine Kanzlei. In Ingolstadt gewachsen.', 'Am 1. Juni 1978 wurde der Grundstein für unsere Kanzlei gelegt. Unsere Geschichte verbindet einen festen Standort mit unterschiedlichen juristischen Perspektiven.', 'bibliothek'),
    rich('Von 1978 bis heute.', '<h3>1978: Die Gründung</h3>' + p('Die Kanzlei wurde am 1. Juni 1978 in Ingolstadt gegründet. Die persönliche anwaltliche Beratung bildet seitdem den Ausgangspunkt ihrer Arbeit.') + '<h3>1990: Der heutige Standort</h3>' + p('Seit 1990 befindet sich die Kanzlei in der Bergbräustraße 7, neben der Tiefgarage „Am Münster“ in der Ingolstädter Altstadt.') + '<h3>Heute: Sieben juristische Perspektiven</h3>' + p('Heute stellen sich sieben Rechtsanwältinnen und Rechtsanwälte mit unterschiedlichen Schwerpunkten Ihren Fragen. Die aktuellen Profile zeigen die jeweils belegten Qualifikationen und Tätigkeitsfelder.')),
    people('Die Kanzlei heute.', 'Alle sieben aktuellen Profile finden Sie im Anwaltsverzeichnis.', ['niels-deckert', 'ulrike-wagner', 'eva-huxmann']),
    close('Lernen Sie uns persönlich kennen.'),
  ]);
  addPage('ingolstadt-anwaltskanzlei', 'Unser Sekretariat', 'Sekretariat & Ansprechpartner | Hagn & Partner', 'Termine und organisatorische Fragen: Lernen Sie das Sekretariat der Kanzlei Hagn & Partner in Ingolstadt und die zuständigen Ansprechpartner kennen.', [
    hero('Ein guter Kontakt beginnt im Sekretariat.', 'Unsere Mitarbeiterinnen koordinieren Termine und unterstützen die Organisation Ihrer Angelegenheit. Hier finden Sie die Zuordnung zu den anwaltlichen Ansprechpartnern.'),
    section('teamSpotlight', { layout: 'directory', headline: 'Unser Sekretariat.', subline: 'Ihre Ansprechpartnerinnen für Termine, Unterlagen und organisatorische Fragen.', members: staff.map(member => ({ name: member.name, role: member.role, focus: member.focus, image: media(`sekretariat/${member.key}.jpg`), imageAlt: `Porträt von ${member.name}`, imagePosition: 'center 25%', href: `mailto:${member.email}` })) }),
    index('Direkt zur richtigen Ansprechpartnerin.', 'Die Telefonnummern führen zum jeweils zugeordneten Sekretariat. Für Eva Huxmann nennt das ursprüngliche Anwaltsprofil die separate Durchwahl +49 841 93557-17.', staff.map(member => ({ title: `${member.name} · ${member.phone}`, text: `${member.focus.join(' · ')}. E-Mail: ${member.email}`, href: tel(member.phone) }))),
    close('Wir helfen Ihnen bei der Terminabstimmung.'),
  ]);

  const legalBlocks = [
    { headline: 'Anbieter und Kontakt', text: p(`${NAME}<br>${ADDRESS}<br>Telefon: ${PHONE}<br>Telefax: +49 841 93557-44<br><a href="mailto:${EMAIL}">${EMAIL}</a>`) },
    { headline: 'Register und Vertretung', text: p('Partnerschaftsregister des Amtsgerichts Ingolstadt, PR 1. Vertretungsberechtigte Gesellschafter laut Kanzleiangaben: Dr. iur. Niels Deckert, Markus Stemmer, Gabriele Radlinger und Veronika Hagn. Steuernummer: 124/162/02409.') },
    { headline: 'Berufsbezeichnungen und Kammer', text: p('Die Berufsbezeichnungen Rechtsanwalt und Rechtsanwältin wurden in der Bundesrepublik Deutschland verliehen. Zuständige Kammer ist die Rechtsanwaltskammer München, Tal 33, 80331 München. Die jeweiligen Fachanwaltsbezeichnungen stehen in den persönlichen Profilen.') + p('Zu den berufsrechtlichen Regelungen gehören BRAO, BORA, FAO, RVG und die Berufsregeln der Rechtsanwälte der Europäischen Gemeinschaft. Sie sind über die <a href="https://www.brak.de/anwaltschaft/berufsrecht/">Bundesrechtsanwaltskammer</a> zugänglich.') },
    { headline: 'Berufshaftpflicht', text: p('Als Berufshaftpflichtversicherer nennt die Kanzlei die Allianz Versicherungs-AG, Dieselstraße 8, 85774 Unterföhring. Angaben zum konkreten räumlichen Geltungsbereich und zum aktuellen Versicherungsschutz erhalten Sie bei der Kanzlei.') },
    { headline: 'Außergerichtliche Streitbeilegung', text: p('Die Kanzlei erklärt ihre grundsätzliche Bereitschaft zur Teilnahme an einem Streitbeilegungsverfahren bei der Schlichtungsstelle der Rechtsanwaltschaft. Aktuelle Anschrift der Stelle: Rauchstraße 26, 10787 Berlin. Weitere Informationen: <a href="https://www.schlichtungsstelle-der-rechtsanwaltschaft.de/">Schlichtungsstelle der Rechtsanwaltschaft</a>.') },
    { headline: 'Inhalt und Bildnachweis', text: p('Inhaltlich verantwortlich laut Kanzleiangaben: Veronika Hagn, erreichbar unter der oben genannten Anschrift. Kanzleifotografie und Porträts: Stefan Bösl Fotografie, Ingolstadt. Die übernommenen Kanzleidokumente und Fotografien stammen von der bisherigen Website.') },
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
    addPage(slug, title, `${title} | Hagn & Partner Ingolstadt`, `${title} der Rechtsanwälte Hagn, Deckert, Stemmer & Partner PartG mbB in Ingolstadt. Kontakt und Informationen zum Betrieb dieser Website.`, [section('legalContent', { headline: title, blocks }, { style: { '--token-section-bg': '#FAF8F3' } })], slug);
    // LegalContent owns its H1 and requires the same physical fixed-header space.
    rows.find(item => item.page_id === uid(`page/${slug}`)).spacing_top = 'l';
  }

  const brand = {
    companyName: 'Hagn & Partner', tagline: 'Rechtsanwälte und Fachanwälte in Ingolstadt', logoDisplay: 'logo', logoUrl: media('logo.png'), faviconUrl: media('logo.png'),
    headingFont: 'Cormorant Garamond', bodyFont: 'Manrope', customHeadingFontUrl: '', customHeadingFontName: '', customBodyFontUrl: '', customBodyFontName: '',
    primaryColor: '#103B4A', secondaryColor: '#195D67', accentColor: '#195D67', pageBg: '#FAF8F3', sectionBg: '#FAF8F3', sectionBgAlt: '#EFEEE7', cardBg: '#FFFFFF', headingColor: '#103B4A', bodyTextColor: '#33464C', mutedTextColor: '#53636A', iconColor: '#195D67', linkColor: '#195D67', linkHoverColor: '#103B4A',
    btnPrimaryBg: '#103B4A', btnPrimaryText: '#FFFFFF', btnSecondaryBg: 'transparent', btnSecondaryText: '#103B4A', btnSecondaryBorder: '#6E8388', btnOutlineBg: 'transparent', btnOutlineText: '#103B4A', btnOutlineBorder: '#6E8388',
    badgeBg: '#E2EBE7', badgeText: '#164D55', badgeBorder: '#A3B8B4', cardBorder: '#BBC6C5', borderColor: '#BBC6C5', dividerColor: '#BBC6C5', cardRadius: '0.125rem', btnRadius: '0.125rem',
    navBgColor: '#FAF8F3', navLinkColor: '#103B4A', navBrandColor: '#103B4A', navLogoColor: '', topBarColor: '#103B4A', footerColor: '#103B4A', footerTextColor: '#E1E9E7', footerLinkColor: '#FAF8F3',
    localSeo: { businessType: 'LegalService', serviceArea: 'Ingolstadt und Umgebung', sameAs: [], services: practices.map(item => ({ name: item.title, description: item.intro, url: `${base}/${item.slug}` })) },
  };
  const formFields = [{ name: 'name', label: 'Ihr Name', type: 'text', placeholder: 'Vor- und Nachname', required: true, halfWidth: true }, { name: 'email', label: 'E-Mail-Adresse', type: 'email', placeholder: 'name@beispiel.de', required: true, halfWidth: true }, { name: 'phone', label: 'Telefon (optional)', type: 'tel', placeholder: 'Für die Terminabstimmung' }, { name: 'message', label: 'Ihr Anliegen', type: 'textarea', placeholder: 'Bitte beschreiben Sie kurz das Thema. Keine vertraulichen Falldokumente.', required: true }];
  const global = { id: uid('global'), tenant_id: tenantId, brand, contact: { phone: PHONE, email: EMAIL, address: ADDRESS }, openingHours: [
    { day: 'Montag', hours: '08:00–12:00 und 14:00–17:00' }, { day: 'Dienstag', hours: '08:00–12:00 und 14:00–17:00' }, { day: 'Mittwoch', hours: '08:00–12:00' }, { day: 'Donnerstag', hours: '08:00–12:00 und 14:00–17:00' }, { day: 'Freitag', hours: '08:00–12:00' }, { day: 'Samstag', closed: true }, { day: 'Sonntag', closed: true },
  ], design: { sectionBg: '#FAF8F3', sectionBgAlt: '#EFEEE7', cardBg: '#FFFFFF', headingColor: '#103B4A', bodyColor: '#33464C', mutedColor: '#53636A', textPrimary: '#103B4A', textSecondary: '#33464C', accentColor: '#195D67', borderColor: '#BBC6C5', dividerColor: '#BBC6C5', btnBg: '#103B4A', btnText: '#FFFFFF', btnSecondaryBg: 'transparent', btnSecondaryText: '#103B4A', btnSecondaryBorder: '#6E8388' }, socialLinks: {}, formFields, autoResponse: { enabled: false, subject: '', body: '', notificationEmail: EMAIL }, businessProfile: null };
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
  const navigation = { id: uid('navigation'), tenant_id: tenantId, items: [a('Rechtsgebiete', '/rechtsgebiete-anwalt-ingolstadt'), a('Anwälte', '/anwaelte-ingolstadt'), a('Kanzlei', '/anwaltskanzlei-ingolstadt'), a('Service', '/service-anwaelte-ingolstadt')].map(item => ({ ...item, type: 'link' })), cta: { ...a('Kontakt & Termin', '/kontakt'), buttonColor: '#103B4A', buttonTextColor: '#FFFFFF', topBar: { enabled: false, text: '', linkLabel: '', linkHref: '', bgColor: '#103B4A', textColor: '#FFFFFF' } }, created_at: STAMP, updated_at: STAMP };
  const footer = { id: uid('footer'), tenant_id: tenantId, cta: { label: '', href: '', variant: 'classic' }, columns: [
    { title: 'Rechtsgebiete', items: practices.map(item => ({ text: item.title, href: route(item.slug) })) },
    { title: 'Die Kanzlei', items: [{ text: 'Unsere Anwälte', href: '/anwaelte-ingolstadt' }, { text: 'Kanzlei & Geschichte', href: '/anwaltskanzlei-ingolstadt' }, { text: 'Ersttermin & Kosten', href: '/anwalt-ingolstadt' }, { text: 'Vollmachten & Formulare', href: '/service-anwaelte-ingolstadt' }, { text: 'Unser Sekretariat', href: '/ingolstadt-anwaltskanzlei' }] },
    { title: 'Kontakt', items: [{ text: PHONE, href: tel(PHONE) }, { text: EMAIL, href: `mailto:${EMAIL}` }, { text: ADDRESS, href: '/kontakt#anfahrt' }] },
    { title: 'Bürozeiten', items: [{ text: 'Mo, Di, Do 08–12 und 14–17 Uhr' }, { text: 'Mi, Fr 08–12 Uhr' }, { text: 'Termine nach Vereinbarung' }] },
  ], legal_links: [a('Impressum', '/impressum'), a('Datenschutz', '/datenschutz')], created_at: STAMP, updated_at: STAMP };
  const snapshot = { pages: pages.map(page => ({ id: page.id, slug: page.slug, title: page.title, visible: true, sections: rows.filter(row => row.page_id === page.id).map(row => ({ id: row.id, type: row.type, definitionKey: row.definition_key, schemaVersion: row.schema_version, variant: row.variant, visible: row.visible, locked: row.locked, sortOrder: row.sort_order, container: row.container, spacingTop: row.spacing_top, spacingBottom: row.spacing_bottom, anchorId: row.anchor_id, data: structuredClone(row.data), styleOverrides: row.style_overrides })) })), collections: [], generatedAt: STAMP };
  const mediaRows = sourceMedia.map(([path, sourcePath, width, height, alt]) => ({ id: uid(`media/${path}`), tenant_id: tenantId, url: media(path), blob_url: absolute(media(path)), pathname: `hagn-partner/${path}`, filename: path.split('/').at(-1), mime_type: path.endsWith('.pdf') ? 'application/pdf' : path.endsWith('.png') ? 'image/png' : 'image/jpeg', size: 0, width, height, alt, caption: path.endsWith('.pdf') ? 'Originales Kanzleidokument der bisherigen Website' : path === 'logo.png' ? 'Originales Kanzleilogo der bisherigen Website' : 'Originales Kanzleifoto; die Quellwebsite nennt Stefan Bösl Fotografie für Kanzleifotografie und Porträts', folder: path.startsWith('downloads/') ? 'Hagn & Partner / Formulare' : 'Hagn & Partner / Originalmedien', source_url: `${SITE_SOURCE}/images/${sourcePath}` }));
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
    if (sections.filter(section => section.type === 'editorialHero' || section.type === 'legalContent' || section.type === 'richText' && section.data.titleAs === 'h1').length !== 1) throw new Error(`One H1 required: ${page.slug}`);
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
  if (doc.pages.length !== 24 || lawyers.length !== 7 || doc.media.length !== 30) throw new Error('Unexpected Hagn inventory.');
  return true;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = resolve(process.env.HAGN_CONTENT_DIR || resolve(dirname(fileURLToPath(import.meta.url)), '../../tmp/hagn-partner-2026-10-19'));
  const doc = buildHagnContent({ baseUrl: process.env.HAGN_SITE_URL || 'https://flamingo-hagn-partner.vercel.app' });
  try {
    const provenance = JSON.parse(await readFile(resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/sites/hagn-partner/MEDIA-PROVENANCE.json'), 'utf8'));
    for (const item of doc.media) { const match = provenance.assets.find(entry => entry.sourceUrl === item.source_url); if (match) { item.size = match.bytes; item.metadata = { sourceUrl: match.sourceUrl, sha256: match.sha256, credit: match.credit }; } }
  } catch { /* Assets can be imported separately; the pure builder still works. */ }
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, 'hagn-content.json'), `${JSON.stringify(doc, null, 2)}\n`);
  await writeFile(resolve(directory, 'route-manifest.json'), `${JSON.stringify(doc.routeManifest, null, 2)}\n`);
  console.log(`Hagn: ${doc.pages.length} native pages, ${doc.sections.length} editable sections, ${doc.seoPages.length} explicit SEO rows and ${doc.media.length} original assets. No database access.`);
}
