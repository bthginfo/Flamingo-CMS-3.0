/** Perspective publication: pure, deterministic CMS composition. No database or network access. */
import { lawyers, practices, staff } from './content.mjs';
import { practiceCopy, profileCopy } from './perspective-copy.mjs';
import { stockMedia } from './stock-media.mjs';

const p = text => text ? `<p>${text}</p>` : '';
const a = (label, href) => ({ label, href });
const tel = value => `tel:${value.replace(/[^+\d]/g, '')}`;
const PHONE = '+49 841 93557-0';
const EMAIL = 'info@hagn-partner.de';
const emptyAction = () => a('', '');

export function buildPerspectiveSections({ media }) {
  const s = (type, data, options = {}) => [type, data, options];
  const attorney = key => lawyers.find(item => item.key === key);
  const practice = key => practices.find(item => item.key === key);
  const images = { verkehrsrecht: 'road', mietrecht: 'architecture', arbeitsrecht: 'hallway', familienrecht: 'family', strafrecht: 'light' };
  const officeAlts = {
    besprechung: 'Besprechungstisch und Stühle aus dem Bildbestand der Kanzlei',
    treppenhaus: 'Wendeltreppe aus dem Bildbestand der Kanzlei',
    gespraech: 'Besprechung am Schreibtisch aus dem Bildbestand der Kanzlei',
    empfang: 'Kanzleischild Hagn, Deckert, Stemmer & Partner',
    bibliothek: 'Juristische Fachbibliothek aus dem Bildbestand der Kanzlei',
    akten: 'Stempel und Akten aus dem Bildbestand der Kanzlei',
    unterlagen: 'Unterlagen und Kanzleistempel aus dem Bildbestand der Kanzlei',
  };
  const photo = (key, position = 'center') => {
    if (!key) return { image: '', imageAlt: '', imagePosition: 'center' };
    const stock = stockMedia.find(item => item.key === key);
    return stock
      ? { image: media(stock.path), imageAlt: `${stock.alt} · Symbolbild`, imagePosition: position }
      : { image: media(`kanzlei/${key}.jpg`), imageAlt: officeAlts[key], imagePosition: position };
  };
  const hero = (layout, headline, text, key = '', settings = {}) => {
    const { caption = '', meta = [], primaryCta = emptyAction(), secondaryCta = emptyAction(), position, mobilePosition = '', ...options } = settings;
    return s('perspectiveHero', { layout, eyebrow: '', headline, text, ...photo(key, position), imageMobilePosition: mobilePosition, caption, primaryCta, secondaryCta, meta }, options);
  };
  const chapter = (layout, headline, text, key, settings = {}) => {
    const { secondaryImage = '', caption = '', cta = emptyAction(), position, secondaryPosition, ...options } = settings;
    const second = secondaryImage ? photo(secondaryImage, secondaryPosition) : photo('');
    return s('photoChapter', { layout, headline, text: p(text), ...photo(key, position), secondaryImage: second.image, secondaryImageAlt: second.imageAlt, secondaryImagePosition: second.imagePosition, caption, cta }, options);
  };
  const group = (title, text = '', items = []) => ({ title, text: p(text), items });
  const briefing = (layout, headline, intro = '', settings = {}) => {
    const { groups = [], stages = [], note = '', cta = emptyAction(), ...options } = settings;
    return s('editorialBriefing', { layout, headline, intro, groups, stages, note, cta }, options);
  };
  const resource = (headline, intro, groups, settings = {}) => {
    const { note = '', ...options } = settings;
    return s('resourceList', { headline, intro, groups: groups.map(value => ({ id: '', ...value })), note }, options);
  };
  const link = (title, description, href, actionLabel = 'Mehr erfahren', format = '') => ({ title, description, href, format, actionLabel });
  const member = (key, focus) => {
    const person = attorney(key);
    return { name: person.name, role: person.role, image: media(`anwaelte/${person.imageKey}.jpg`), imageAlt: `Porträt von ${person.name}`, imagePosition: 'center 25%', focus: focus || person.focus, href: `/${person.slug}`, contactName: '', phone: '', email: '', quote: '' };
  };
  const people = (headline, subline, keys, settings = {}) => {
    const { titleAs = 'h2', focus, cta = emptyAction(), ...options } = settings;
    return s('teamSpotlight', { layout: 'contactSheet', titleAs, badge: '', headline, subline, members: keys.map(key => member(key, focus)), cta }, options);
  };
  const explorer = (headline, intro, directory = false, options = {}) => s('topicExplorer', {
    headline, intro,
    items: practices.map(item => {
      const copy = practiceCopy[item.key];
      return { id: item.key, title: item.title, summary: directory ? copy.summary : copy.situation,
        detail: p(directory ? copy.detail : {
          verkehrsrecht: 'Vom Unfallschaden über den Fahrzeugkauf bis zur Fahrerlaubnis: Ein Ereignis im Straßenverkehr kann ganz unterschiedliche rechtliche Fragen auslösen.',
          mietrecht: 'Mietvertrag, Abrechnung oder Beschluss: Wir betrachten das jeweilige Anliegen aus der Perspektive von Mietern, Vermietern, Eigentümern und Verwaltung.',
          arbeitsrecht: 'Wenn eine Vereinbarung geprüft, eine Veränderung gestaltet oder ein Arbeitsverhältnis beendet werden soll, sind Ihre Rolle und die konkrete Entscheidung maßgeblich.',
          familienrecht: 'Trennung, Kinder und wirtschaftliche Fragen brauchen jeweils einen eigenen Blick. Zwei Fachanwältinnen für Familienrecht gehören zu unserem Team.',
          strafrecht: 'Ermittlungsverfahren, Strafbefehl, Opfer- oder Zeugenvertretung: Der Stand der Angelegenheit und Ihre Rolle bilden den Ausgangspunkt.',
        }[item.key]),
        ...photo(images[item.key], item.key === 'strafrecht' ? '50% 58%' : 'center'),
        bullets: directory ? copy.questions : item.topics.map(([title]) => title),
        meta: item.specialists.map(key => attorney(key).name), cta: a(`${item.title} ansehen`, `/${item.slug}`) };
    }),
  }, options);
  const allPeople = a('Alle sieben Anwälte kennenlernen', '/anwaelte-ingolstadt');
  const result = {};

  result[''] = [
    hero('panorama', 'Mehr Klarheit.\nFür das, was zählt.', 'Ihre Rechtsanwälte und Fachanwälte in Ingolstadt. Sieben Anwältinnen und Anwälte beraten Sie persönlich, mit unterschiedlichen fachlichen Schwerpunkten.', 'courtyard', { primaryCta: a('Beratungstermin vereinbaren', '/kontakt'), secondaryCta: a('Unsere Rechtsgebiete', '#rechtsgebiete'), caption: 'Symbolbild · Miguel Picq / Unsplash', position: '58% center', mobilePosition: '61% center', ink: true }),
    briefing('columns', 'Ihre Frage zählt.', 'Ein rechtliches Anliegen beginnt mit einer konkreten Frage. Die fachliche Zuordnung kommt im Gespräch hinzu.', {
      groups: [
        group('Privatpersonen', 'Ein Unfall, eine Kündigung, eine Trennung oder eine Frage zur Wohnung kann vieles zugleich verändern. Wir betrachten die rechtliche Frage in dem Zusammenhang, in dem sie für Sie steht.'),
        group('Unternehmen und Verantwortung', 'Unternehmerische Entscheidungen berühren Verträge, Arbeitsverhältnisse und Vermögen. Unsere unterschiedlichen Tätigkeitsfelder geben diesen Fragen eine fachliche Adresse – mit einem persönlich zugeordneten Ansprechpartner.'),
      ],
    }),
    explorer('Was führt Sie zu uns?', 'Fünf Beratungsfelder. Wählen Sie die Situation, die zu Ihrer Frage passt.', false, { anchor: 'rechtsgebiete' }),
    people('Fachwissen hat\nein Gesicht.', 'Verkehr und Strafrecht. Miete und Eigentum. Arbeit und Familie. Drei unserer sieben anwaltlichen Perspektiven.', ['veronika-hagn', 'markus-stemmer', 'maria-haneder'], { cta: allPeople }),
    chapter('feature', 'Viele Perspektiven.\nEin Ort.', 'Am 1. Juni 1978 in Ingolstadt gegründet, verbindet die Kanzlei heute fünf zentrale Rechtsgebiete mit weiteren individuellen Tätigkeitsfeldern. Die Bergbräustraße 7 ist der Ort, an dem diese Perspektiven zusammenkommen. Fachanwaltsqualifikationen und persönliche Zuständigkeit machen sichtbar, wer Ihr Thema bearbeitet. Das Sekretariat bleibt dabei eine feste organisatorische Verbindung.', 'besprechung', { caption: 'Einblick in die Kanzlei · Originalaufnahme', cta: a('Die Kanzlei kennenlernen', '/anwaltskanzlei-ingolstadt'), soft: true }),
    resource('Gut zu wissen,\nbevor wir sprechen.', 'Drei direkte Wege zu den Informationen, die für den Einstieg helfen.', [{ title: '', items: [
      link('Ihr erster Termin', 'Terminvereinbarung, sinnvolle Vorbereitung und die Fragen, die Sie zur Vergütung stellen können.', '/anwalt-ingolstadt', 'Ersttermin & Kosten'),
      link('Vollmachten und Formulare', 'Neun Originaldokumente, nach ihrem Zweck geordnet und direkt als PDF verfügbar.', '/service-anwaelte-ingolstadt', 'Formulare finden'),
      link('Das passende Sekretariat', 'Jede Anwältin und jeder Anwalt hat einen zugeordneten Kontakt für organisatorische Fragen.', '/ingolstadt-anwaltskanzlei', 'Kontaktpersonen ansehen'),
    ] }]),
    briefing('dossier', 'Beginnen wir mit\nIhrer Frage.', 'Sie müssen Ihr Anliegen noch keinem Rechtsgebiet zuordnen. Beschreiben Sie kurz, was Sie klären möchten; wir stimmen einen persönlichen Termin mit Ihnen ab.', { groups: [group('Ingolstadt · Bergbräustraße 7', 'Die Tiefgarage „Am Münster“ liegt direkt neben der Kanzlei. Termine finden nach Vereinbarung statt.')], cta: a('Kontakt & Termin', '/kontakt'), soft: true }),
  ];

  result['anwaltskanzlei-ingolstadt'] = [
    hero('statement', 'Ein Ort.\nViele Perspektiven.', 'Hagn, Deckert, Stemmer & Partner ist eine Rechtsanwaltskanzlei für Privatpersonen und Unternehmen in Ingolstadt. Sieben Anwältinnen und Anwälte arbeiten hier mit unterschiedlichen Schwerpunkten.', 'empfang', { primaryCta: a('Unsere Anwälte', '/anwaelte-ingolstadt'), caption: 'Bergbräustraße 7 · Originalaufnahme der Kanzlei' }),
    chapter('diptych', 'Raum für Ihr Gespräch.', 'Anwaltliche Beratung verbindet den Sachverhalt mit einer rechtlichen Fragestellung. Ein Vertrag zeigt eine Vereinbarung; Ihr Bericht erklärt, wie die Situation entstanden ist und welche Entscheidung nun ansteht. Beides gehört zusammen. Die Besprechungsräume der Kanzlei geben diesem Austausch einen festen Ort. Hier können offene Punkte benannt, Zusammenhänge erläutert und die gewünschte Tätigkeit abgestimmt werden. Eine erste Beratung und eine fortlaufende Vertretung erfüllen dabei unterschiedliche Aufgaben.', 'besprechung', { secondaryImage: 'gespraech', caption: 'Besprechungsräume und Gesprächssituation · Originalaufnahmen aus dem Kanzleibestand' }),
    briefing('columns', 'Fachwissen.\nMit festen Kontakten.', 'Die Kanzlei verbindet mehrere fachliche Schwerpunkte unter einem Dach. Entscheidend bleibt, wer Ihr Anliegen bearbeitet.', { groups: [
      group('Fachanwaltsqualifikationen', 'Veronika Hagn ist Fachanwältin für Verkehrsrecht und Strafrecht. Markus Stemmer ist Fachanwalt für Miet- und Wohnungseigentumsrecht. Gabriele Radlinger und Maria Haneder sind Fachanwältinnen für Familienrecht; Maria Haneder außerdem für Arbeitsrecht. Die genauen Berufsbezeichnungen stehen in den persönlichen Profilen.'),
      group('Weitere anwaltliche Perspektiven', 'Dr. iur. Niels Deckert arbeitet im Immobilienrecht, Handels- und Gesellschaftsrecht sowie allgemeinen Zivilrecht. Ulrike Wagner nennt Familienrecht, Verkehrsrecht und allgemeines Zivilrecht als Tätigkeitsfelder. Eva Huxmann verbindet Familien-, Straf- und Verwaltungsrecht mit ihrer Qualifikation als Diplom-Verwaltungswirtin (FH).'),
      group('Organisation mit festen Kontakten', 'Fünf Mitarbeiterinnen im Sekretariat unterstützen die organisatorische Zusammenarbeit. Die Kontakte sind den Anwältinnen und Anwälten persönlich zugeordnet. Bei einem bestehenden Anliegen finden Sie dadurch eine direkte Anlaufstelle. Wenn die Zuständigkeit noch offen ist, hilft die zentrale Kanzleiverbindung bei der Zuordnung.'),
      group('Unterschiedliche Rollen', 'Im Arbeitsrecht nennt die Kanzlei neben Arbeitnehmern und Arbeitgebern auch leitende Angestellte, Geschäftsführer sowie Betriebs- und Personalräte. Das Miet- und Wohnungseigentumsrecht betrachtet Mieter und Vermieter ebenso wie Eigentümergemeinschaften und Verwaltung. Im Strafrecht gehören Opfer und Zeugen zum Tätigkeitsangebot. Welche Rolle Sie in einer Angelegenheit haben, ist deshalb Teil der fachlichen Zuordnung. Die Rechtsgebietsseiten erläutern diese Unterschiede; Ihr persönlicher Kontakt ergibt sich aus der konkreten Frage.'),
    ], soft: true }),
    briefing('dossier', 'In der Altstadt.', 'Seit 1990 befindet sich die Kanzlei in der Bergbräustraße 7. Die Tiefgarage „Am Münster“ liegt direkt daneben.', { groups: [
      group('Ihr Besuch', 'Die Adresse lautet Bergbräustr. 7, 85049 Ingolstadt. Besprechungen finden nach vorheriger Terminvereinbarung statt. Fragen zur Anreise oder zum Zugang können Sie vorab mit dem Sekretariat klären.'),
      group('Verbindung zur Kanzlei', 'Für neue Anfragen erreichen Sie die Kanzlei unter +49 841 93557-0 oder info@hagn-partner.de. Für eine bereits bekannte anwaltliche Zuständigkeit stehen die direkten Sekretariatskontakte in den Profilen bereit.'),
    ], cta: a('Kontakt & Anfahrt', '/kontakt#anfahrt') }),
    resource('Die Kanzlei entdecken.', 'Menschen, Herkunft und Zusammenarbeit haben jeweils ihren eigenen Platz.', [{ title: '', items: [
      link('Sieben persönliche Profile', 'Qualifikationen und Tätigkeitsfelder der aktuellen Anwältinnen und Anwälte.', '/anwaelte-ingolstadt', 'Zu den Anwälten'),
      link('Seit 1. Juni 1978', 'Die belegten Stationen der Kanzleigeschichte – von der Gründung bis zum heutigen Standort.', '/anwaltskanzlei-in-ingolstadt', 'Zur Geschichte'),
      link('Wie Zusammenarbeit gestaltet wird', 'Beratung, weitere Vertretung und der Austausch im Mandat.', '/anwalt-in-ingolstadt', 'Zum Beratungskonzept'),
    ] }], { soft: true }),
  ];

  result['anwaelte-ingolstadt'] = [
    people('Ihre Anwälte.', 'Sieben Anwältinnen und Anwälte. Qualifikationen, Tätigkeitsfelder und direkter Sekretariatskontakt im persönlichen Profil.', lawyers.map(item => item.key), { titleAs: 'h1' }),
    resource('Wer berät zu Ihrem Thema?', 'Die fünf zentralen Beratungsfelder und ihre Fachanwaltsqualifikationen auf einen Blick.', [{ title: 'Fachanwaltsqualifikationen', items: practices.map(item => link(item.title, item.specialists.map(key => attorney(key).name).join(' · '), `/${item.slug}`, 'Beratungsfeld ansehen')) }, { title: 'Organisation', items: [link('Unser Sekretariat', 'Fünf Mitarbeiterinnen und ihre direkt zugeordneten anwaltlichen Kontakte.', '/ingolstadt-anwaltskanzlei', 'Zum Sekretariat')] }], { soft: true }),
  ];

  result['rechtsgebiete-anwalt-ingolstadt'] = [
    hero('compact', 'Rechtsgebiete.', 'Fünf Beratungsfelder. Öffnen Sie Ihr Thema für typische Fragen und den passenden anwaltlichen Kontakt.'),
    explorer('', '', true),
    resource('Weitere Tätigkeitsfelder.', 'Unsere fachliche Breite reicht über die fünf ausführlich dargestellten Rechtsgebiete hinaus. Die persönlichen Profile zeigen die individuelle Zuordnung.', [
      { title: 'Verträge, Unternehmen und Immobilien', items: [link('Immobilienrecht · Handels- und Gesellschaftsrecht', 'Dr. iur. Niels Deckert verbindet diese Tätigkeitsfelder mit allgemeinem Zivilrecht.', '/niels-deckert-anwalt-ingolstadt', 'Profil ansehen'), link('Allgemeines Zivilrecht', 'Dieses Tätigkeitsfeld wird von mehreren Anwältinnen und Anwälten bearbeitet. Die Zuordnung ergibt sich aus Ihrem konkreten Anliegen.', '/anwaelte-ingolstadt', 'Anwälte vergleichen')] },
      { title: 'Verwaltung und Verfahren', items: [link('Zwangsverwaltung', 'Markus Stemmer ist IGZ-geprüfter Zwangsverwalter mit Auszeichnung.', '/markus-stemmer-anwalt-ingolstadt', 'Profil ansehen'), link('Verwaltungsrecht', 'Eva Huxmann ist Rechtsanwältin und Diplom-Verwaltungswirtin (FH).', '/eva-huxmann-anwalt-ingolstadt', 'Profil ansehen'), link('Opfervertretung', 'Die Begleitung von Betroffenen und Zeugen ist Teil des strafrechtlichen Tätigkeitsangebots.', '/strafrecht-rechtsanwalt-ingolstadt', 'Zum Strafrecht')] },
      { title: 'Weitere Anliegen', items: [link('Erbrecht · privates Baurecht · Forderungsmanagement', 'Diese Bereiche nennt die Kanzlei ergänzend. Schildern Sie Ihr Thema bei der Anfrage für die passende persönliche Zuordnung.', '/kontakt', 'Anliegen anfragen')] },
    ], { soft: true }),
  ];

  result[practice('verkehrsrecht').slug] = [
    hero('panorama', 'Nach dem Unfall.\nVor dem nächsten Schritt.', 'Im Verkehrsrecht beraten wir zu Unfallschäden, Fahrzeugverträgen und Verfahren. Wir betrachten die Frage, die jetzt für Sie ansteht.', 'road', { primaryCta: a('Termin im Verkehrsrecht', '/veronika-hagn-anwalt-ingolstadt#kontakt'), caption: 'Symbolbild · Filip Zrnzević / Unsplash', position: '50% 52%', ink: true }),
    briefing('columns', 'Was ist betroffen?', practiceCopy.verkehrsrecht.intro, { groups: practiceCopy.verkehrsrecht.groups.map(value => group(value.title, value.text, value.items)) }),
    briefing('columns', 'Passende Unterlagen.', '', { anchor: 'vorbereitung', groups: [
      group('Zum Unfallschaden', '', ['Unfallmitteilung, vorhandene Fotos und Zeugenangaben', 'Schreiben der beteiligten Versicherung und Polizei']),
      group('Zum Fahrzeugvertrag', '', ['Kauf- oder Reparaturvertrag', 'Rechnung und Korrespondenz zur betroffenen Leistung']),
      group('Zum Verfahren', '', ['Vollständiger Bescheid oder Verfahrensbrief', 'Aktenzeichen, bekannte Termine und Datum des Zugangs']),
    ], soft: true }),
    people('', 'Veronika Hagn ist Mitglied der Arbeitsgemeinschaft Verkehrsrecht im Deutschen Anwaltverein. Ihre beiden Fachanwaltsqualifikationen verbinden die zivilrechtliche und die strafrechtliche Perspektive im Verkehr.', ['veronika-hagn'], { focus: ['Verkehrsrecht', 'Strafrecht'] }),
    resource('Zwei hilfreiche Verbindungen.', '', [{ title: '', items: [link('Ersttermin & Kosten', 'Wie Sie die gewünschte Tätigkeit und die Grundlage der Vergütung besprechen.', '/anwalt-ingolstadt#kosten', 'Kosten einordnen'), link('Strafrecht', 'Wenn zu dem Ereignis eine strafrechtliche Frage oder ein Ermittlungsverfahren hinzukommt.', '/strafrecht-rechtsanwalt-ingolstadt', 'Zum Strafrecht')] }], { soft: true }),
  ];

  result[practice('mietrecht').slug] = [
    hero('journal', 'Räume nutzen.\nRechte klären.', 'Miet- und Wohnungseigentumsrecht betrifft Mieter, Vermieter, Eigentümer und Verwaltung aus unterschiedlichen Perspektiven. Wir beginnen mit dem Rahmen Ihres Anliegens.', 'architecture', { primaryCta: a('Markus Stemmer kennenlernen', '/markus-stemmer-anwalt-ingolstadt'), caption: 'Symbolbild · set.sj / Unsplash', position: '50% 50%' }),
    briefing('dossier', 'Aus Ihrer Sicht.', practiceCopy.mietrecht.intro, { groups: practiceCopy.mietrecht.groups.slice(0, 2).map(value => group(value.title, value.text, value.items)), soft: true }),
    briefing('columns', '', '', { anchor: 'vorbereitung', groups: [
      group('Vertrag oder Kündigung?', '', ['Mietvertrag und Ergänzungen', 'Betroffenes Schreiben und dazugehörige Korrespondenz']),
      group('Abrechnung oder Zahlung?', '', ['Betroffene Abrechnung mit den zugrunde liegenden Vereinbarungen', 'Übersicht der streitigen Forderungen oder Zahlungen']),
      group('Beschluss oder Hausgeld?', '', ['Teilungserklärung und Gemeinschaftsordnung', 'Beschluss, zugehöriges Versammlungsprotokoll oder Hausgeldabrechnung']),
    ] }),
    people('', 'Markus Stemmer ist außerdem IGZ-geprüfter Zwangsverwalter mit Auszeichnung. Die rechtlichen Fragen der Immobilien- und Zwangsverwaltung ergänzen seinen Schwerpunkt.', ['markus-stemmer'], { focus: ['Miet- und WEG-Recht', 'Zwangsverwaltung'], soft: true }),
  ];

  result[practice('arbeitsrecht').slug] = [
    hero('statement', 'Arbeit verändert sich.\nKlarheit bleibt wichtig.', 'Im Arbeitsrecht beraten wir Beschäftigte, Arbeitgeber und betriebliche Vertretungen. Ihre Rolle und die konkrete Entscheidung bestimmen den fachlichen Blick.', 'hallway', { primaryCta: a('Ihre Fachanwältin', '/maria-haneder-anwalt-ingolstadt'), caption: 'Symbolbild · Nastuh Abootalebi / Unsplash' }),
    briefing('columns', 'Für beide Seiten.\nIm Betrieb.', practiceCopy.arbeitsrecht.intro, { groups: practiceCopy.arbeitsrecht.groups.map(value => group(value.title, value.text, value.items)), soft: true }),
    people('', 'Maria Haneder ist seit 1999 als Rechtsanwältin zugelassen. Arbeitsrecht und Familienrecht bilden ihre beiden Fachanwaltsqualifikationen.', ['maria-haneder'], { focus: ['Arbeitsrecht'] }),
    resource('Frage und Dokument.', '', [{ title: '', items: [
      link('Was wurde vereinbart?', 'Arbeitsvertrag, Ergänzungen und der betroffene Vertragsentwurf zeigen die Grundlage der Frage.', '/anwalt-ingolstadt', 'Zum Ersttermin'),
      link('Was wurde mitgeteilt?', 'Vollständige Kündigung oder Abmahnung, Datum des Erhalts und darin genannte Termine.', '/maria-haneder-anwalt-ingolstadt#kontakt', 'Rückfrage zum Termin'),
      link('Welche Leistung ist betroffen?', 'Die fragliche Abrechnung oder das Zeugnis mit der darauf bezogenen Korrespondenz.', '/anwalt-ingolstadt#kosten', 'Umfang der Beratung'),
    ] }], { anchor: 'vorbereitung', soft: true }),
  ];

  result[practice('familienrecht').slug] = [
    hero('journal', 'Wenn sich das\nLeben verändert.', 'Familienrecht betrifft Trennung und Scheidung, Kinder, Unterhalt und Vermögen. Jede dieser Fragen hat ihren eigenen persönlichen und rechtlichen Zusammenhang.', 'family', { primaryCta: a('Ihre Ansprechpartnerinnen', '#anwaeltinnen'), caption: 'Symbolbild · Juliane Liebermann / Unsplash', position: '50% 50%' }),
    briefing('dossier', 'Kinder. Finanzen.\nRechtliche Schritte.', practiceCopy.familienrecht.intro, { anchor: 'vorbereitung', groups: practiceCopy.familienrecht.groups.map(value => group(value.title, value.text, value.items)), cta: a('Hinweise zum Ersttermin', '/anwalt-ingolstadt') }),
    people('Für Ihre Familie.', 'Gabriele Radlinger und Maria Haneder sind Fachanwältinnen für Familienrecht. Ihre persönlichen Profile führen zum direkt zugeordneten Sekretariat.', ['gabriele-radlinger', 'maria-haneder'], { anchor: 'anwaeltinnen', focus: ['Familienrecht'], soft: true }),
  ];

  result[practice('strafrecht').slug] = [
    hero('statement', 'Ein Vorwurf.\nIhr nächster Schritt.', 'Im Strafrecht bestimmen Ihre Rolle und der aktuelle Verfahrensstand die erste Frage. Wir beraten und vertreten in strafrechtlichen Angelegenheiten.', 'light', { primaryCta: a('Kontakt zu Veronika Hagn', '/veronika-hagn-anwalt-ingolstadt#kontakt'), caption: 'Symbolbild · set.sj / Unsplash', position: '50% 48%', ink: true }),
    briefing('dossier', 'In welcher Rolle\nsind Sie betroffen?', practiceCopy.strafrecht.intro, { groups: practiceCopy.strafrecht.groups.map(value => group(value.title, value.text, value.items)) }),
    briefing('sequence', 'Das Verfahren\nkonkret einordnen.', 'Das strafrechtliche Tätigkeitsangebot der Kanzlei umfasst mehrere Verfahrenssituationen. Eine pauschale Beschreibung ersetzt den Blick auf die tatsächlichen Unterlagen nicht.', { stages: [
      { title: 'Ermittlung und Strafverfahren', text: 'Wer ist mit der Angelegenheit befasst? Was wird in dem vorliegenden Schreiben bezeichnet? Der bekannte Stand des Verfahrens ist die Grundlage der weiteren Abstimmung.' },
      { title: 'Strafbefehl oder weitere Entscheidung', text: 'Ein bereits ergangenes Schreiben kann eigene Fragen aufwerfen. Halten Sie die Entscheidung vollständig bereit und nennen Sie das Datum, an dem sie Ihnen zugegangen ist.' },
      { title: 'Jugendstrafrecht und Haft', text: 'Auch Jugendstrafrecht und die rechtliche Begleitung bei Haftfragen gehören zu den genannten Tätigkeitsfeldern. Die konkrete Situation wird bei der Anfrage benannt.' },
    ], soft: true }),
    resource('Die Korrespondenz\nzeigt den Zusammenhang.', 'Bei der Anfrage helfen konkrete Angaben zu dem Schreiben, das Sie erhalten haben. Für kurzfristige Termine und bestehende Fristen rufen Sie bitte direkt an.', [{ title: 'Für die erste Zuordnung', items: [
      link('Absender und Aktenzeichen', 'Welche Behörde oder welches Gericht schreibt Ihnen? Unter welchem Aktenzeichen wird die Angelegenheit geführt?', '/veronika-hagn-anwalt-ingolstadt#kontakt', 'Sekretariat erreichen'),
      link('Anlass und Rolle', 'Vorladung, Strafbefehl oder weiteres Verfahrensschreiben: Nennen Sie, worum es geht und in welcher Rolle Sie angesprochen werden.', '/kontakt', 'Kontakt aufnehmen'),
      link('Termine und Übermittlung', 'Nennen Sie bereits bekannte Termine. Umfangreiche oder sensible Verfahrensunterlagen übermitteln Sie auf dem mit der Kanzlei abgestimmten Weg.', '/anwalt-ingolstadt', 'Zum Ersttermin'),
    ] }], { anchor: 'vorbereitung' }),
    people('', 'Veronika Hagn verbindet Fachanwaltsqualifikationen für Strafrecht und Verkehrsrecht. Auch Eva Huxmann arbeitet im Strafrecht; ihr persönliches Profil erläutert ihre weiteren Tätigkeitsfelder.', ['veronika-hagn'], { focus: ['Strafrecht'], cta: a('Profil von Eva Huxmann', '/eva-huxmann-anwalt-ingolstadt'), soft: true }),
  ];

  for (const lawyer of lawyers) {
    const copy = profileCopy[lawyer.key];
    const related = lawyer.areas.map(key => practice(key));
    result[lawyer.slug] = [
      s('perspectiveHero', { layout: 'portrait', eyebrow: '', headline: lawyer.name, text: copy.intro, image: media(`anwaelte/${lawyer.imageKey}.jpg`), imageAlt: `Porträt von ${lawyer.name}`, imagePosition: 'center 25%', imageMobilePosition: '', caption: 'Originalporträt · Kanzlei Hagn & Partner', primaryCta: a('Sekretariat & Kontakt', '#kontakt'), secondaryCta: emptyAction(), meta: [lawyer.role, `Zulassung seit ${lawyer.licensed}`] }),
      briefing('columns', copy.headline, 'Tätigkeitsfelder und fachlicher Hintergrund.', { groups: copy.groups.map(value => group(value.title, value.text, value.items)), note: copy.qualifications.slice(3).join(' · '), soft: true }),
      resource(`Kontakt zu ${lawyer.name}.`, copy.contactNote, [
        { title: `Sekretariat · ${lawyer.office}`, items: [link(lawyer.phone, 'Telefonischer Kontakt für Termine und organisatorische Rückfragen.', tel(lawyer.phone), 'Anrufen'), link(lawyer.email, lawyer.key === 'ulrike-wagner' ? 'Direkte E-Mail-Adresse von Rechtsanwältin Ulrike Wagner.' : `E-Mail an ${lawyer.office}.`, `mailto:${lawyer.email}`, 'E-Mail schreiben')] },
        { title: 'Weiterlesen', items: related.length ? related.map(item => link(item.title, practiceCopy[item.key].summary, `/${item.slug}`, 'Rechtsgebiet ansehen')) : [link('Rechtsgebiete der Kanzlei', 'Die zentralen Beratungsfelder und die weiteren individuellen Tätigkeitsschwerpunkte.', '/rechtsgebiete-anwalt-ingolstadt', 'Übersicht ansehen')] },
      ], { anchor: 'kontakt' }),
    ];
  }

  result['anwalt-ingolstadt'] = [
    hero('compact', 'Ihr erster Termin.\nIhre Fragen im Mittelpunkt.', 'Hier finden Sie die Informationen zu Terminvereinbarung, Vorbereitung, Vergütung und möglicher Kostenübernahme. Die konkrete Abstimmung richtet sich nach Ihrem Anliegen.', '', { primaryCta: a('Termin vereinbaren', '/kontakt'), secondaryCta: a('Zu den Kosten', '#kosten') }),
    briefing('sequence', 'Ein Gespräch\ngut vorbereiten.', 'Sie müssen die rechtliche Bewertung nicht vorwegnehmen. Ein verständlicher Überblick über den Sachverhalt und Ihr Ziel ist für den Einstieg hilfreich.', { stages: [
      { title: 'Den Termin abstimmen', text: 'Melden Sie sich telefonisch oder per E-Mail und nennen Sie kurz das Thema sowie die beteiligten Personen oder Unternehmen. Bestehende Fristen und kurzfristige Termine teilen Sie bitte bereits am Telefon mit.' },
      { title: 'Den Zusammenhang zeigen', text: 'Stellen Sie die betroffenen Verträge und vollständigen Schreiben, die bisherige Korrespondenz und eine kurze zeitliche Übersicht zusammen. Wenn Unterlagen fehlen, teilen Sie mit, was bereits vorhanden ist.' },
      { title: 'Die eigene Frage festhalten', text: 'Notieren Sie, was Sie klären möchten und welche Entscheidung ansteht. So können die Ausgangslage, offene Informationen und der gewünschte Umfang der anwaltlichen Tätigkeit gemeinsam besprochen werden.' },
    ], soft: true }),
    briefing('dossier', 'Kosten gehören\nfrüh ins Gespräch.', 'Eine erste Beratung, eine Vertragsprüfung, außergerichtliche Korrespondenz und ein Gerichtsverfahren sind unterschiedliche Tätigkeiten.', { anchor: 'kosten', groups: [
      group('Umfang und Vergütung', 'Sprechen Sie die Kosten bei der Terminvereinbarung oder zu Beginn der Beratung an. Der vorgesehene Umfang der Tätigkeit, die Grundlage der Abrechnung und eine mögliche Vergütungsvereinbarung werden im Zusammenhang mit Ihrem Anliegen besprochen.', ['Welche Tätigkeit ist zunächst vorgesehen?', 'Auf welcher Grundlage wird sie abgerechnet?', 'Welche weiteren Kosten können bei einer Fortsetzung entstehen?']),
      group('Rechtsschutzversicherung', 'Halten Sie die Daten einer vorhandenen Rechtsschutzversicherung bereit. Ob und in welchem Umfang eine Kostenübernahme für Ihre Angelegenheit möglich ist, muss konkret geklärt werden. Die Abstimmung mit der Versicherung kann Teil des Gesprächs sein.'),
    ] }),
    chapter('feature', 'Unterstützung bei Kosten.\nIndividuell zu klären.', 'Beratungshilfe und Prozesskostenhilfe betreffen unterschiedliche Formen möglicher Unterstützung. Im Servicebereich stehen dafür die vorhandenen Kanzleiformulare bereit. Welche Angaben und Belege gebraucht werden und ob eine Unterstützung für Ihre Angelegenheit in Betracht kommt, wird individuell eingeordnet. Das Bereitstellen oder Ausfüllen eines Formulars enthält noch keine Zusage einer Kostenübernahme. Fragen Sie deshalb vorab nach, welches Dokument für Ihren Fall benötigt wird.', 'notes', { caption: 'Symbolbild · Moritz Kindler / Unsplash', position: '50% 48%', cta: a('Formulare zu möglichen Hilfen', '/service-anwaelte-ingolstadt#hilfen'), soft: true }),
    resource('Die nächsten Informationen\nan einem Ort.', 'Die Unterlagen zum jeweiligen Thema sind auf den Rechtsgebietsseiten genauer beschrieben.', [{ title: '', items: [link('Vorbereitung nach Rechtsgebiet', 'Unfallunterlagen, Miet- und Gemeinschaftsunterlagen oder arbeitsrechtliche Schreiben: Wählen Sie das konkrete Thema.', '/rechtsgebiete-anwalt-ingolstadt', 'Rechtsgebiet wählen'), link('Vollmachten und Mandatsaufnahme', 'Die Verwendung der passenden Formulare wird mit der Kanzlei abgestimmt.', '/service-anwaelte-ingolstadt', 'Zu den Formularen'), link('Kontakt zum zuständigen Sekretariat', 'Termine, organisatorische Fragen und den Übermittlungsweg für Unterlagen abstimmen.', '/ingolstadt-anwaltskanzlei', 'Kontaktperson finden')] }], { note: 'Eine Anfrage oder die Übersendung von Unterlagen allein begründet kein Mandat. Die Übernahme bedarf der Annahme durch die Kanzlei.' }),
  ];

  result['service-anwaelte-ingolstadt'] = [
    hero('compact', 'Formulare &\nVollmachten.', 'Neun Kanzleidokumente als PDF. Stimmen Sie vor dem Ausfüllen ab, welches Formular Sie benötigen.'),
    resource('', '', [
      { id: 'mandatsbeginn', title: 'Mandatsbeginn und Daten', items: [link('Mandatsaufnahmebogen', 'Angaben zu Ihrer Person und zu der Angelegenheit, die übernommen werden soll.', media('downloads/mandatsaufnahmebogen.pdf'), 'PDF öffnen', 'PDF'), link('Hinweise zur Datenverarbeitung', 'Informationen der Kanzlei zum Umgang mit personenbezogenen Daten im Mandatsverhältnis.', media('downloads/hinweise-datenverarbeitung.pdf'), 'PDF öffnen', 'PDF')] },
      { id: 'vollmachten', title: 'Vollmachten', items: [link('Vollmacht', 'Allgemeines Vollmachtsformular für die mit der Kanzlei vereinbarte Vertretung.', media('downloads/vollmacht.pdf'), 'PDF öffnen', 'PDF'), link('Prozessvollmacht', 'Vollmachtsformular für eine Vertretung im gerichtlichen Verfahren.', media('downloads/prozessvollmacht.pdf'), 'PDF öffnen', 'PDF'), link('Strafprozessvollmacht', 'Vollmachtsformular für die vereinbarte Vertretung in Strafsachen.', media('downloads/strafprozessvollmacht.pdf'), 'PDF öffnen', 'PDF')] },
      { id: 'erklaerungen', title: 'Ergänzende Erklärungen', items: [link('Entbindung von der ärztlichen Schweigepflicht', 'Erklärung zu medizinischen Informationen, soweit diese für die konkrete Angelegenheit benötigt und mit Ihnen abgestimmt werden.', media('downloads/schweigepfilcht-entbindung.pdf'), 'PDF öffnen', 'PDF'), link('Musterwiderrufsformular', 'Das von der Kanzlei bereitgestellte Muster. Fragen zur Verwendung besprechen Sie bitte mit der Kanzlei.', media('downloads/musterwiderrufsformular.pdf'), 'PDF öffnen', 'PDF')] },
      { id: 'hilfen', title: 'Formulare zu möglichen Hilfen', items: [link('Beratungshilfe', 'Vorhandenes Formular für die individuelle Prüfung einer möglichen Beratungshilfe.', media('downloads/beratungshilfe.pdf'), 'PDF öffnen', 'PDF'), link('Prozesskostenhilfe', 'Angaben zu persönlichen und wirtschaftlichen Verhältnissen für eine mögliche Prozesskostenhilfe.', media('downloads/prozesskostenhilfe.pdf'), 'PDF öffnen', 'PDF')] },
    ], { note: 'Die Dokumente stammen von der bisherigen Kanzleiwebsite. Stimmen Sie die benötigten Angaben und die Übermittlung ausgefüllter Unterlagen mit der Kanzlei ab.' }),
    briefing('dossier', 'Eine kurze Abstimmung\nspart offene Fragen.', 'Wenn Sie unsicher sind, welches Dokument Sie ausfüllen sollen, nennen Sie dem zuständigen Sekretariat das Formular und Ihre Angelegenheit.', { groups: [group('Umfang und Verwendung', 'Die Vollmacht richtet sich nach der vereinbarten Tätigkeit. Ergänzende Erklärungen kommen nur hinzu, wenn sie im konkreten Mandat benötigt werden. Eine Übersendung von Formularen allein begründet noch keine Mandatsübernahme.')], cta: a('Ihr Sekretariat finden', '/ingolstadt-anwaltskanzlei'), soft: true }),
  ];

  result['anwalt-in-ingolstadt'] = [
    hero('statement', 'Gut beraten.\nBewusst entscheiden.', 'Rechtliche Möglichkeiten stehen im Zusammenhang mit Ihren persönlichen und wirtschaftlichen Zielen. Im Gespräch wird geklärt, welche Unterstützung Sie benötigen und wie die Zusammenarbeit gestaltet werden soll.', 'gespraech', { caption: 'Persönliche Besprechung · Originalaufnahme aus dem Kanzleibestand' }),
    briefing('columns', 'Welche Aufgabe\nsollen wir übernehmen?', 'Der Umfang einer Beauftragung ist eine konkrete Entscheidung. Unterschiedliche Formen anwaltlicher Tätigkeit erfüllen unterschiedliche Zwecke.', { groups: [
      group('Beraten und prüfen', 'Eine Beratung kann zunächst der Orientierung dienen. Eine Dokumentenprüfung bezieht sich auf eine konkrete Vereinbarung oder ein Schreiben. Gemeinsam wird eingegrenzt, welche Frage beantwortet werden soll und welche Informationen dafür fehlen.'),
      group('Vertreten und begleiten', 'Eine weitere Vertretung kann Korrespondenz und zusätzliche Schritte umfassen. Diese Tätigkeit wird mit Ihnen abgestimmt. Die erste Frage, ein neuer Sachverhalt und die Fortsetzung einer Angelegenheit können jeweils einen eigenen Abstimmungsbedarf auslösen.'),
    ], soft: true }),
    chapter('feature', 'Rechtliche und praktische\nFolgen zusammen betrachten.', 'Eine rechtliche Möglichkeit ist zugleich eine persönliche oder wirtschaftliche Entscheidung. Ihr Ziel, der erforderliche Aufwand und die Grundlage der Vergütung gehören deshalb in denselben Zusammenhang. Fragen Sie nach, wenn eine mögliche Tätigkeit oder ihre Folgen unklar bleiben. Die Beratung soll die Entscheidung nachvollziehbar machen. Die gewünschte weitere Beauftragung und deren Umfang werden anschließend mit Ihnen abgestimmt.', 'unterlagen', { caption: 'Unterlagen und Kanzleistempel · Originalaufnahme', cta: a('Ersttermin & Kosten', '/anwalt-ingolstadt') }),
    briefing('dossier', 'Ein guter Austausch.', 'Eine Angelegenheit kann sich verändern. Neue Schreiben oder tatsächliche Entwicklungen können die weitere Bearbeitung beeinflussen.', { groups: [
      group('Ihr Beitrag', 'Teilen Sie neue Entwicklungen, bekannte Termine und zusätzliche Unterlagen mit. Beschreiben Sie auch, wenn sich Ihr Ziel verändert hat. Der Übermittlungsweg für umfangreiche oder sensible Dokumente wird mit dem Sekretariat abgestimmt.'),
      group('Persönliche Zuständigkeit', 'Die Profile zeigen die anwaltlichen Schwerpunkte und die zugeordneten Sekretariatskontakte. Organisatorische Fragen finden dort ihre direkte Adresse; rechtliche Fragen gehören in die anwaltliche Abstimmung.'),
    ], cta: a('Ihre Ansprechpartner kennenlernen', '/anwaelte-ingolstadt'), soft: true }),
  ];

  result['anwaltskanzlei-in-ingolstadt'] = [
    hero('journal', 'In Ingolstadt\ngewachsen.', 'Die Kanzleigeschichte hat wenige, klare Stationen: die Gründung, den heutigen Standort und die Menschen, die hier heute arbeiten.', 'bibliothek', { caption: 'Aktuelle Aufnahme aus dem Bildbestand der Kanzlei' }),
    s('timeline', { headline: 'Drei Stationen.\nEin lokaler Zusammenhang.', badge: '', subline: 'Die belegten Eckdaten unserer Kanzlei.', entries: [
      { year: '1. Juni 1978', title: 'Die Gründung', text: 'An diesem Tag wurde die Kanzlei in Ingolstadt gegründet.' },
      { year: '1990', title: 'Bergbräustraße 7', text: 'Seit 1990 befindet sich die Kanzlei am heutigen Standort, direkt neben der Tiefgarage „Am Münster“.' },
      { year: 'Heute', title: 'Sieben anwaltliche Perspektiven', text: 'Sieben Rechtsanwältinnen und Rechtsanwälte mit unterschiedlichen Tätigkeitsfeldern bilden das aktuelle anwaltliche Team.' },
    ] }, { soft: true }),
    chapter('diptych', 'Ein fester Ort.\nEine Kanzlei in der Gegenwart.', 'Die aktuellen Aufnahmen zeigen die Kanzlei, in der heute beraten und gearbeitet wird. Der feste Standort in der Ingolstädter Altstadt verbindet die Geschichte mit der gegenwärtigen Praxis. Für Ihre heutige Frage zählen die aktuellen Menschen und ihre Qualifikationen: persönliche Zuständigkeiten, unterschiedliche fachliche Schwerpunkte und die direkte Verbindung zum jeweiligen Sekretariat.', 'empfang', { secondaryImage: 'besprechung', caption: 'Kanzleischild und Besprechungsraum · aktuelle Originalaufnahmen, keine historischen Dokumente' }),
    resource('Die Kanzlei von heute.', '', [{ title: '', items: [link('Das aktuelle anwaltliche Team', 'Sieben persönliche Profile mit Qualifikationen und individuellen Tätigkeitsfeldern.', '/anwaelte-ingolstadt', 'Anwälte kennenlernen'), link('Der heutige Standort', 'Kanzlei, Räume und Anreise in die Bergbräustraße 7.', '/anwaltskanzlei-ingolstadt', 'Die Kanzlei ansehen')] }], { soft: true }),
  ];

  result['ingolstadt-anwaltskanzlei'] = [
    s('teamSpotlight', { layout: 'contactSheet', titleAs: 'h1', badge: '', headline: 'Ihr Kontakt\nhat ein Gesicht.', subline: 'Unser Sekretariat unterstützt die Terminabstimmung und die organisatorische Zusammenarbeit. Die Kontakte sind den Anwältinnen und Anwälten direkt zugeordnet.', members: staff.map(item => ({ name: item.name, role: item.role, focus: item.focus, image: media(`sekretariat/${item.key}.jpg`), imageAlt: `Porträt von ${item.name}`, imagePosition: 'center 25%', href: `mailto:${item.email}`, contactName: '', phone: item.phone, email: item.email, quote: '' })), cta: emptyAction() }),
    briefing('columns', 'Organisation mit\nfachlichem Hintergrund.', '', { groups: [
      group('Susanna Nagel', 'Die Bürovorsteherin ist geprüfte Rechtsfachwirtin und seit 1989 in der Kanzlei. Ihr Sekretariat ist Dr. iur. Niels Deckert zugeordnet.'),
      group('Ilona Epstein', 'Sie gehört seit 1999 zur Kanzlei. Ihre Aufgaben umfassen unter anderem Arbeits- und Familienrecht sowie Zwangsvollstreckung; sie betreut die Sekretariate von Veronika Hagn und Maria Haneder.'),
      group('Annalena Baumanis', 'Die geprüfte Rechtsfachwirtin betreut die Sekretariate von Ulrike Wagner und Eva Huxmann. Sie erreichen sie für Ulrike Wagner unter +49 841 93557-25 und für Eva Huxmann unter +49 841 93557-17.'),
    ], soft: true }),
    resource('Direkt verbunden.', 'Die Terminabstimmung für Ulrike Wagner und Eva Huxmann übernimmt Annalena Baumanis.', [{ title: 'Zwei direkte Kontakte', items: [link('Ulrike Wagner · +49 841 93557-25', 'rain.wagner@hagn-partner.de ist die direkte E-Mail-Adresse von Rechtsanwältin Ulrike Wagner.', '/ulrike-wagner-anwalt-ingolstadt#kontakt', 'Zum persönlichen Kontakt'), link('Eva Huxmann · +49 841 93557-17', 'Für E-Mail-Anfragen erreichen Sie das Sekretariat unter baumanis@hagn-partner.de.', '/eva-huxmann-anwalt-ingolstadt#kontakt', 'Zum persönlichen Kontakt')] }], { note: 'Falls Sie die anwaltliche Zuständigkeit noch nicht kennen, erreichen Sie die Kanzlei zentral unter +49 841 93557-0.' }),
  ];

  result['kontakt'] = [
    s('contact', { layout: 'editorial', titleAs: 'h1', headline: 'Kontakt & Termin.', introText: p('Beschreiben Sie kurz Ihr Anliegen. Bei bestehenden Fristen oder kurzfristigen Terminen rufen Sie bitte an. Übermitteln Sie hier keine vertraulichen Falldokumente.'), badgeText: '', formEnabled: true, submitLabel: 'Terminanfrage senden', privacyHref: '/datenschutz', showMap: false, infoCards: [{ icon: 'Phone', label: 'Telefon', value: PHONE }, { icon: 'Mail', label: 'E-Mail', value: EMAIL }, { icon: 'Clock', label: 'Bürozeiten', value: 'Mo, Di, Do 08–12 und 14–17 Uhr · Mi, Fr 08–12 Uhr' }, { icon: 'MapPin', label: 'Kanzlei', value: 'Bergbräustr. 7, 85049 Ingolstadt' }] }, { anchor: 'nachricht' }),
    chapter('feature', 'Ihr Weg in die\nBergbräustraße.', 'Die Kanzlei liegt in der Ingolstädter Altstadt, direkt neben der Tiefgarage „Am Münster“. Stimmen Sie Ihren Besprechungstermin vorab mit uns ab. Fragen zum Zugang oder zu Ihrer Anreise können Sie vor dem Besuch telefonisch klären. Der Kartenlink öffnet Google Maps erst durch Ihren Klick. Für eine bestimmte Anwältin oder einen bestimmten Anwalt finden Sie die direkte organisatorische Verbindung im jeweiligen Profil. Eine Mandatsübernahme bedarf der Annahme durch die Kanzlei.', 'empfang', { anchor: 'anfahrt', caption: 'Kanzleischild am heutigen Standort · Originalaufnahme', cta: a('Route in Google Maps öffnen', 'https://www.google.com/maps/search/?api=1&query=Bergbr%C3%A4ustr.%207%2C%2085049%20Ingolstadt') }),
  ];

  return result;
}
