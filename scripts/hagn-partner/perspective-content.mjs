/** Photograph-led publication: pure, deterministic CMS composition. No database or network access. */
import { lawyers, practices, staff } from './content.mjs';
import { practiceCopy, profileCopy } from './perspective-copy.mjs';
import { stockMedia } from './stock-media.mjs';

const p = text => text ? `<p>${text}</p>` : '';
const a = (label, href, iconSuffix = 'ArrowUpRight') => ({ label, href, iconSuffix });
const tel = value => `tel:${value.replace(/[^+\d]/g, '')}`;
const PHONE = '+49 841 93557-0';
const EMAIL = 'info@hagn-partner.de';
const emptyAction = () => a('', '', '');

export function buildPerspectiveSections({ media }) {
  const s = (type, data, options = {}) => [type, data, options];
  const attorney = key => lawyers.find(item => item.key === key);
  const practice = key => practices.find(item => item.key === key);
  const images = { verkehrsrecht: 'road', mietrecht: 'architecture', arbeitsrecht: 'hallway', familienrecht: 'family', strafrecht: 'light' };
  const officeAlts = {
    besprechung: 'Besprechungstisch mit Stühlen in der Kanzlei Hagn & Partner',
    treppenhaus: 'Wendeltreppe im Kanzleigebäude',
    gespraech: 'Persönliches Gespräch am Schreibtisch in der Kanzlei',
    empfang: 'Kanzleischild Hagn, Deckert, Stemmer & Partner',
    bibliothek: 'Juristische Fachbibliothek der Kanzlei',
    akten: 'Akten und Kanzleistempel auf einem Schreibtisch',
    unterlagen: 'Unterlagen und Kanzleistempel auf einem Schreibtisch',
  };
  const photo = (key, position = 'center') => {
    if (!key) return { image: '', imageAlt: '', imagePosition: 'center' };
    const stock = stockMedia.find(item => item.key === key);
    return stock
      ? { image: media(stock.path), imageAlt: stock.alt, imagePosition: position }
      : { image: media(`kanzlei/${key}.jpg`), imageAlt: officeAlts[key], imagePosition: position };
  };
  const hero = (layout, headline, text, key = '', settings = {}) => {
    const { meta = [], primaryCta = emptyAction(), secondaryCta = emptyAction(), position, mobilePosition = '', motion = 'subtle', imageEffect = 'none', hoverEffect = 'none', ...options } = settings;
    return s('perspectiveHero', { layout, eyebrow: '', headline, text, ...photo(key, position), imageMobilePosition: mobilePosition, caption: '', primaryCta, secondaryCta, meta, motion, imageEffect, hoverEffect }, options);
  };
  const chapter = (layout, headline, paragraphs, key, settings = {}) => {
    const { secondaryImage = '', cta = emptyAction(), position, mobilePosition = '', secondaryPosition, secondaryMobilePosition = '', motion = 'subtle', imageEffect = 'none', hoverEffect = 'zoom', ...options } = settings;
    const second = secondaryImage ? photo(secondaryImage, secondaryPosition) : photo('');
    return s('photoChapter', { layout, headline, text: (Array.isArray(paragraphs) ? paragraphs : [paragraphs]).map(p).join(''), ...photo(key, position), imageMobilePosition: mobilePosition, secondaryImage: second.image, secondaryImageAlt: second.imageAlt, secondaryImagePosition: second.imagePosition, secondaryImageMobilePosition: secondaryMobilePosition, caption: '', cta, motion, imageEffect, hoverEffect }, options);
  };
  const reader = (headline, blocks, options = {}) => s('richText', {
    titleAs: 'h2', headline,
    content: blocks.map(block => typeof block === 'string' ? p(block) : `${block.title ? `<h3>${block.title}</h3>` : ''}${p(block.text)}`).join(''),
  }, options);
  const contactBand = (headline, subline, ctaPrimary, ctaSecondary = emptyAction(), options = {}) => s('ctaBand', { layout: 'plain', headline, subline, badgeText: '', ctaPrimary, ctaSecondary }, options);
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
  const frame = (id, title, text, key, href, label, settings = {}) => ({ id, title, text, ...photo(key, settings.position), imageMobilePosition: settings.mobilePosition || '', link: a(label, href) });
  const reel = (layout, titleAs, headline, intro, items, settings = {}) => {
    const { cta = emptyAction(), motion = 'expressive', imageEffect = 'parallax', hoverEffect = 'zoom', ...options } = settings;
    return s('editorialReel', { layout, titleAs, headline, intro, items, cta, motion, imageEffect, hoverEffect }, options);
  };
  const allPeople = a('Sieben Anwälte kennenlernen', '/anwaelte-ingolstadt');
  const result = {};

  result[''] = [
    reel('opening', 'h1', 'Recht ist\npersönlich.', 'Rechtsanwälte und Fachanwälte in Ingolstadt. Für persönliche Fragen, berufliche Veränderungen und unternehmerische Entscheidungen.', [
      frame('persoenlich', 'Wenn eine Frage\nvieles verändert.', 'Wir besprechen, was passiert ist, was Sie klären möchten und welcher Schritt für Sie ansteht.', 'courtyard', '/kontakt', 'Mit uns sprechen', { position: '58% center', mobilePosition: '61% center' }),
      frame('arbeit-und-wirtschaft', 'Entscheidungen\nmit Folgen.', 'Arbeitsleben, Unternehmen und Immobilien: Finden Sie den fachlichen Schwerpunkt für Ihre Frage.', 'hallway', '/rechtsgebiete-anwalt-ingolstadt', 'Unsere Rechtsgebiete', { position: '50% center', mobilePosition: '55% center' }),
      frame('menschen', 'Beratung bleibt\npersönlich.', 'Sieben persönliche Profile mit Tätigkeitsfeldern und dem direkten Kontakt zum zuständigen Sekretariat.', 'window', '/anwaelte-ingolstadt', 'Die Menschen dahinter', { mobilePosition: '60% center' }),
    ], { cta: a('Termin vereinbaren', '/kontakt') }),
    reader('Ihre Situation.\nUnser Ausgangspunkt.', ['Ein Unfall, eine Kündigung oder eine Trennung lässt sich selten auf ein einzelnes Schreiben reduzieren. Wir betrachten die rechtliche Frage in dem Zusammenhang, in dem sie für Sie steht. Bei Verträgen, Immobilien und unternehmerischen Entscheidungen gehören die Beteiligten und Ihr wirtschaftliches Ziel von Anfang an dazu.', 'Verkehr, Miete und Wohnungseigentum, Arbeit, Familie und Strafrecht bilden fünf zentrale Beratungsfelder. Weitere individuelle Schwerpunkte ergänzen das Spektrum. Sie müssen Ihr Anliegen bei der ersten Anfrage noch nicht selbst rechtlich einordnen.']),
    chapter('spread', 'Viele Perspektiven.\nEin gemeinsamer Ort.', ['Am 1. Juni 1978 in Ingolstadt gegründet, verbindet die Kanzlei heute sieben anwaltliche Perspektiven. In der Bergbräustraße 7 treffen unterschiedliche Tätigkeitsfelder auf persönliche Zuständigkeit.', 'Ein Vertrag hält Vereinbarungen fest. Ihr Bericht erklärt den Zusammenhang. Im Gespräch führen wir beides zusammen und stimmen ab, welche Unterstützung Sie benötigen.'], 'besprechung', { secondaryImage: 'gespraech', cta: a('In der Kanzlei', '/anwaltskanzlei-ingolstadt'), soft: true }),
    people('Fachwissen hat\nein Gesicht.', 'Verkehr und Strafrecht. Miete und Eigentum. Arbeit und Familie. Drei unserer sieben anwaltlichen Perspektiven.', ['veronika-hagn', 'markus-stemmer', 'maria-haneder'], { cta: allPeople }),
    chapter('feature', 'Das erste Gespräch\nbeginnt mit Ihrer Frage.', ['Nennen Sie bei der Terminvereinbarung kurz das Thema und die Beteiligten. Vorhandene Verträge, vollständige Schreiben und eine kurze zeitliche Übersicht helfen, den Sachverhalt im Gespräch zusammenzuführen.', 'Auch der Umfang der anwaltlichen Tätigkeit und die Vergütung gehören früh in die Abstimmung. Informationen zum Ersttermin und zu möglichen Kosten finden Sie gesammelt auf einer eigenen Seite. Benötigte Vollmachten und weitere <a href="/service-anwaelte-ingolstadt">Formulare stehen im Servicebereich</a> bereit.'], 'notes', { position: '50% 42%', mobilePosition: '50% 40%', cta: a('Ersttermin & Kosten', '/anwalt-ingolstadt'), soft: true }),
    contactBand('Was möchten Sie klären?', 'Bergbräustr. 7, 85049 Ingolstadt. Persönliche Termine nach Vereinbarung. Die Tiefgarage „Am Münster“ liegt direkt neben der Kanzlei.', a('Kontakt & Termin', '/kontakt'), a(PHONE, tel(PHONE), 'Phone')),
  ];

  result['anwaltskanzlei-ingolstadt'] = [
    hero('statement', 'Ein Ort.\nViele Perspektiven.', 'Hagn, Deckert, Stemmer & Partner ist eine Rechtsanwaltskanzlei für Privatpersonen und Unternehmen in Ingolstadt. Sieben Anwältinnen und Anwälte arbeiten hier mit unterschiedlichen Schwerpunkten.', 'empfang', { primaryCta: allPeople }),
    chapter('spread', 'Raum für Ihr Gespräch.', ['Anwaltliche Beratung verbindet den Sachverhalt mit einer rechtlichen Fragestellung. Ein Vertrag zeigt eine Vereinbarung; Ihr Bericht erklärt, wie die Situation entstanden ist und welche Entscheidung nun ansteht. Beides gehört zusammen.', 'In den Besprechungsräumen können offene Punkte benannt, Zusammenhänge erläutert und die gewünschte Tätigkeit abgestimmt werden. Eine erste Beratung und eine fortlaufende Vertretung erfüllen dabei unterschiedliche Aufgaben.'], 'besprechung', { secondaryImage: 'gespraech' }),
    reader('Fachwissen.\nMit festen Kontakten.', [
      { title: 'Qualifikationen und Schwerpunkte', text: 'Veronika Hagn ist Fachanwältin für Verkehrsrecht und Strafrecht. Markus Stemmer ist Fachanwalt für Miet- und Wohnungseigentumsrecht. Gabriele Radlinger und Maria Haneder sind Fachanwältinnen für Familienrecht; Maria Haneder außerdem für Arbeitsrecht. Die genauen Berufsbezeichnungen stehen in den persönlichen Profilen.' },
      { title: 'Weitere fachliche Perspektiven', text: 'Dr. iur. Niels Deckert arbeitet im Immobilienrecht, Handels- und Gesellschaftsrecht sowie allgemeinen Zivilrecht. Ulrike Wagner nennt Familienrecht, Verkehrsrecht und allgemeines Zivilrecht als Tätigkeitsfelder. Eva Huxmann verbindet Familien-, Straf- und Verwaltungsrecht mit ihrer Qualifikation als Diplom-Verwaltungswirtin (FH).' },
      { title: 'Persönliche Zuordnung', text: 'Fünf Mitarbeiterinnen im Sekretariat unterstützen die organisatorische Zusammenarbeit. Die Kontakte sind den Anwältinnen und Anwälten persönlich zugeordnet. Bei einem bestehenden Anliegen finden Sie dadurch eine direkte Anlaufstelle. Wenn die Zuständigkeit noch offen ist, hilft die zentrale Kanzleiverbindung bei der Zuordnung.' },
      'Im Arbeitsrecht berät die Kanzlei Beschäftigte und Arbeitgeber sowie leitende Angestellte, Geschäftsführer, Betriebs- und Personalräte. Im Miet- und Wohnungseigentumsrecht gehören Mieter, Vermieter, Eigentümergemeinschaften und Verwaltung dazu; im Strafrecht auch Opfer und Zeugen. Ihre Rolle ist deshalb Teil der ersten fachlichen Zuordnung.',
    ], { soft: true }),
    chapter('diptych', 'Mitten in Ingolstadt.', ['Seit 1990 befindet sich die Kanzlei in der Bergbräustraße 7. Die Altstadt ist damit der feste Ort für persönliche Besprechungen und anwaltliche Zusammenarbeit.', 'Die Adresse lautet Bergbräustr. 7, 85049 Ingolstadt. Die Tiefgarage „Am Münster“ liegt direkt daneben. Fragen zur Anreise oder zum Zugang können Sie vorab mit dem Sekretariat klären.'], 'treppenhaus', { secondaryImage: 'bibliothek', cta: a('Kontakt & Anfahrt', '/kontakt#anfahrt') }),
    contactBand('Eine Kanzlei kennenlernen.\nMenschen begegnen.', 'Die persönlichen Profile zeigen Qualifikationen und Tätigkeitsfelder. Die Kanzleigeschichte führt von der Gründung am 1. Juni 1978 bis zum heutigen Standort.', allPeople, a('Unsere Geschichte', '/anwaltskanzlei-in-ingolstadt'), { soft: true }),
  ];

  result['anwaelte-ingolstadt'] = [
    people('Ihre Anwälte.', 'Sieben Anwältinnen und Anwälte. Qualifikationen, Tätigkeitsfelder und direkter Sekretariatskontakt im persönlichen Profil.', lawyers.map(item => item.key), { titleAs: 'h1' }),
    contactBand('Eine Frage.\nDie passende Verbindung.', 'Die Rechtsgebiete führen von typischen Situationen zum fachlichen Kontakt. Für Termine und organisatorische Fragen finden Sie unser Sekretariat mit den persönlichen Zuordnungen.', a('Rechtsgebiete entdecken', '/rechtsgebiete-anwalt-ingolstadt'), a('Unser Sekretariat', '/ingolstadt-anwaltskanzlei'), { soft: true }),
  ];

  result['rechtsgebiete-anwalt-ingolstadt'] = [
    s('imageAtlas', { titleAs: 'h1', headline: 'Rechtsgebiete.', intro: 'Wählen Sie das Thema, das Sie beschäftigt. Jedes Beratungsfeld führt zu konkreten Fragen, zur Vorbereitung und zum persönlichen anwaltlichen Kontakt.', items: practices.map(item => frame(item.key, item.title, {
      verkehrsrecht: 'Nach dem Unfall, beim Fahrzeugkauf oder bei einem Schreiben zur Fahrerlaubnis.',
      mietrecht: 'Mietverhältnis, Wohnungseigentum und die rechtlichen Fragen der Verwaltung.',
      arbeitsrecht: 'Verträge, Veränderungen und Entscheidungen im Arbeitsleben.',
      strafrecht: 'Ermittlungen, Strafverfahren und die Vertretung von Opfern und Zeugen.',
      familienrecht: 'Trennung, Kinder, Unterhalt und Vermögen in ihrem persönlichen Zusammenhang.',
    }[item.key], images[item.key], `/${item.slug}`, 'Zum Rechtsgebiet', { position: item.key === 'strafrecht' ? '50% 58%' : 'center', mobilePosition: item.key === 'strafrecht' ? '50% 58%' : 'center' })), cta: emptyAction(), motion: 'subtle', hoverEffect: 'zoom' }),
    reader('Die Frage reicht\nmanchmal weiter.', [
      'Ein Anliegen kann mehrere fachliche Zusammenhänge berühren. Ein Immobilienvertrag ist etwas anderes als die laufende Verwaltung eines Hauses; eine Frage im Unternehmen kann die Organisation der Gesellschaft oder ein einzelnes Arbeitsverhältnis betreffen. Nennen Sie deshalb das konkrete Vorhaben, die Beteiligten und die Entscheidung, die ansteht.',
      '<a href="/niels-deckert-anwalt-ingolstadt">Dr. iur. Niels Deckert</a> verbindet Immobilienrecht mit Handels- und Gesellschaftsrecht sowie allgemeinem Zivilrecht. <a href="/markus-stemmer-anwalt-ingolstadt">Markus Stemmer</a> ergänzt den Schwerpunkt Miet- und Wohnungseigentumsrecht durch seine Qualifikation als IGZ-geprüfter Zwangsverwalter mit Auszeichnung. <a href="/eva-huxmann-anwalt-ingolstadt">Eva Huxmann</a> arbeitet außerdem im Verwaltungsrecht und ist Diplom-Verwaltungswirtin (FH).',
      'Allgemeines Zivilrecht, Erbrecht, privates Baurecht und Forderungsmanagement gehören zu den weiteren von der Kanzlei genannten Bereichen. Die individuelle Zuständigkeit wird passend zu Ihrer Frage abgestimmt. Eine eigene rechtliche Einordnung vor der Kontaktaufnahme ist dafür nicht erforderlich.',
    ], { soft: true }),
    contactBand('Ihr Thema ist noch offen?', 'Beschreiben Sie kurz, was Sie klären möchten. Bei bestehenden Fristen oder kurzfristigen Terminen erreichen Sie die Kanzlei am besten telefonisch.', a('Anliegen anfragen', '/kontakt'), a(PHONE, tel(PHONE), 'Phone')),
  ];

  result[practice('verkehrsrecht').slug] = [
    hero('panorama', 'Nach dem Unfall.\nVor dem nächsten Schritt.', 'Im Verkehrsrecht beraten wir zu Unfallschäden, Fahrzeugverträgen und Verfahren. Wir betrachten die Frage, die jetzt für Sie ansteht.', 'road', { primaryCta: a('Termin im Verkehrsrecht', '/veronika-hagn-anwalt-ingolstadt#kontakt'), position: '50% 52%', mobilePosition: '50% 52%', imageEffect: 'parallax', ink: true }),
    chapter('spread', 'Ein Ereignis.\nMehrere Fragen.', [practiceCopy.verkehrsrecht.intro, ...practiceCopy.verkehrsrecht.groups.map(value => `<strong>${value.title}.</strong> ${value.text}`)], 'document', { position: '50% 48%', cta: a('Fachanwältin Veronika Hagn', '/veronika-hagn-anwalt-ingolstadt') }),
    briefing('columns', 'Was für das Gespräch hilft.', 'Welche Unterlagen gebraucht werden, hängt vom betroffenen Thema ab. Halten Sie vollständige Schreiben und bekannte Termine bereit.', { anchor: 'vorbereitung', groups: [
      group('Zum Unfallschaden', '', ['Unfallmitteilung, vorhandene Fotos und Zeugenangaben', 'Schreiben der beteiligten Versicherung und Polizei']),
      group('Zum Fahrzeugvertrag', '', ['Kauf- oder Reparaturvertrag', 'Rechnung und Korrespondenz zur betroffenen Leistung']),
      group('Zum Verfahren', '', ['Vollständiger Bescheid oder Verfahrensbrief', 'Aktenzeichen, bekannte Termine und Datum des Zugangs']),
    ], soft: true }),
    people('', 'Veronika Hagn ist Mitglied der Arbeitsgemeinschaft Verkehrsrecht im Deutschen Anwaltverein. Ihre beiden Fachanwaltsqualifikationen verbinden die zivilrechtliche und die strafrechtliche Perspektive im Verkehr.', ['veronika-hagn'], { focus: ['Verkehrsrecht', 'Strafrecht'] }),
    contactBand('Auch die nächsten Fragen\ngehören ins Gespräch.', 'Den Umfang der Beratung und die Grundlage der Vergütung besprechen Sie zu Beginn. Kommt zu dem Ereignis ein strafrechtliches Verfahren hinzu, betrachten wir auch diesen Zusammenhang.', a('Ersttermin & Kosten', '/anwalt-ingolstadt#kosten'), a('Zum Strafrecht', '/strafrecht-rechtsanwalt-ingolstadt'), { soft: true }),
  ];

  result[practice('mietrecht').slug] = [
    hero('journal', 'Räume nutzen.\nRechte klären.', 'Miet- und Wohnungseigentumsrecht betrifft Mieter, Vermieter, Eigentümer und Verwaltung aus unterschiedlichen Perspektiven. Wir beginnen mit dem Rahmen Ihres Anliegens.', 'architecture', { primaryCta: a('Markus Stemmer kennenlernen', '/markus-stemmer-anwalt-ingolstadt'), imageEffect: 'kenBurns' }),
    reader('Ihre Rolle verändert\nden Blick.', [practiceCopy.mietrecht.intro, ...practiceCopy.mietrecht.groups.slice(0, 2)], { soft: true }),
    chapter('spread', 'Verwaltung trägt\nVerantwortung.', [practiceCopy.mietrecht.groups[2].text, 'Für einen Termin zum Mietverhältnis sind der Vertrag, Ergänzungen und die betroffenen Schreiben hilfreich. Bei einer Abrechnung gehören die vertraglichen Grundlagen und die Übersicht der streitigen Zahlungen dazu. Bei Wohnungseigentum zeigen Teilungserklärung, Gemeinschaftsordnung, Beschluss und Versammlungsprotokoll den rechtlichen Zusammenhang. Halten Sie auch eine betroffene Hausgeldabrechnung bereit.'], 'window', { anchor: 'vorbereitung', cta: a('Den ersten Termin vorbereiten', '/anwalt-ingolstadt') }),
    people('', 'Markus Stemmer ist außerdem IGZ-geprüfter Zwangsverwalter mit Auszeichnung. Die rechtlichen Fragen der Immobilien- und Zwangsverwaltung ergänzen seinen Schwerpunkt.', ['markus-stemmer'], { focus: ['Miet- und WEG-Recht', 'Zwangsverwaltung'], soft: true }),
  ];

  result[practice('arbeitsrecht').slug] = [
    hero('statement', 'Arbeit\nim Wandel.', 'Im Arbeitsrecht beraten wir Beschäftigte, Arbeitgeber und betriebliche Vertretungen. Ihre Rolle und die konkrete Entscheidung bestimmen den fachlichen Blick.', 'hallway', { primaryCta: a('Ihre Fachanwältin', '/maria-haneder-anwalt-ingolstadt') }),
    chapter('feature', 'Vereinbarungen gestalten\nden Arbeitsalltag.', [practiceCopy.arbeitsrecht.intro, ...practiceCopy.arbeitsrecht.groups.map(value => `<strong>${value.title}.</strong> ${value.text}`)], 'notes', { position: '50% 44%', mobilePosition: '50% 42%', soft: true }),
    reader('Was die Frage\nkonkret macht.', [
      { title: 'Die Vereinbarung', text: 'Arbeitsvertrag, Ergänzungen und ein betroffener Vertragsentwurf zeigen, was geregelt wurde oder neu vereinbart werden soll. Nennen Sie bei der Anfrage, ob Sie als Beschäftigter, Arbeitgeber, Geschäftsführer oder betriebliche Vertretung handeln.' },
      { title: 'Die Veränderung', text: 'Liegt eine Kündigung oder Abmahnung vor, halten Sie das Schreiben vollständig bereit. Das Datum des Erhalts und darin genannte Termine gehören zur ersten Abstimmung. Für Fragen zu Vergütung oder Zeugnis sind die betroffene Abrechnung und die darauf bezogene Korrespondenz hilfreich.' },
      'Bei kurzfristigen Terminen rufen Sie bitte an. Welche weiteren Angaben gebraucht werden und auf welchem Weg Unterlagen übermittelt werden sollen, besprechen Sie mit dem Sekretariat.',
    ], { anchor: 'vorbereitung' }),
    people('', 'Maria Haneder ist seit 1999 als Rechtsanwältin zugelassen. Arbeitsrecht und Familienrecht bilden ihre beiden Fachanwaltsqualifikationen.', ['maria-haneder'], { focus: ['Arbeitsrecht'], soft: true }),
  ];

  result[practice('familienrecht').slug] = [
    hero('journal', 'Wenn sich das\nLeben verändert.', 'Familienrecht betrifft Trennung und Scheidung, Kinder, Unterhalt und Vermögen. Jede dieser Fragen hat ihren eigenen persönlichen und rechtlichen Zusammenhang.', 'family', { primaryCta: a('Ihre Ansprechpartnerinnen', '#anwaeltinnen'), mobilePosition: '54% center' }),
    chapter('spread', 'Was heute offen ist.\nWas morgen zählt.', [practiceCopy.familienrecht.intro, ...practiceCopy.familienrecht.groups.map(value => `<strong>${value.title}.</strong> ${value.text}`)], 'window', { soft: true, cta: a('Hinweise zum Ersttermin', '/anwalt-ingolstadt') }),
    people('Für Ihre Familie.', 'Gabriele Radlinger und Maria Haneder sind Fachanwältinnen für Familienrecht. Ihre persönlichen Profile führen zum direkt zugeordneten Sekretariat.', ['gabriele-radlinger', 'maria-haneder'], { anchor: 'anwaeltinnen', focus: ['Familienrecht'] }),
    reader('Mit dem beginnen,\nwas vorhanden ist.', ['Für den Einstieg helfen eine kurze Übersicht über die familiäre Situation und Ihre wichtigsten Fragen. Vorhandene Vereinbarungen zur elterlichen Sorge, gerichtliche Schreiben und weitere Verfahrensunterlagen zeigen, was bereits geregelt ist oder aktuell ansteht.', 'Einkommens- und Vermögensangaben werden passend zum konkreten Anliegen abgestimmt. Sie müssen die rechtliche Bewertung oder die vollständige wirtschaftliche Aufarbeitung nicht vor dem ersten Gespräch selbst leisten. Auch die Kosten und der gewünschte Umfang einer weiteren Begleitung gehören in die gemeinsame Abstimmung.'], { anchor: 'vorbereitung', soft: true }),
  ];

  result[practice('strafrecht').slug] = [
    hero('statement', 'Ein Vorwurf.\nIhr nächster Schritt.', 'Im Strafrecht bestimmen Ihre Rolle und der aktuelle Verfahrensstand die erste Frage. Wir beraten und vertreten in strafrechtlichen Angelegenheiten.', 'light', { primaryCta: a('Kontakt zu Veronika Hagn', '/veronika-hagn-anwalt-ingolstadt#kontakt'), position: '50% 48%', mobilePosition: '50% 48%', ink: true }),
    reader('Ihre Rolle.\nDer konkrete Stand.', [practiceCopy.strafrecht.intro, ...practiceCopy.strafrecht.groups]),
    chapter('spread', 'Ein Schreiben zeigt\nnoch nicht das Ganze.', ['Bei einer Ermittlung oder einem Strafverfahren wird zunächst eingeordnet, wer mit der Angelegenheit befasst ist und was in dem vorliegenden Schreiben bezeichnet wird. Ein Strafbefehl oder eine weitere Entscheidung wirft wiederum eigene Fragen auf. Auch Jugendstrafrecht und die rechtliche Begleitung bei Haftfragen gehören zum Tätigkeitsangebot.', 'Halten Sie eine Vorladung, einen Strafbefehl oder andere Verfahrensschreiben vollständig bereit. Absender, Aktenzeichen, Datum des Zugangs und bekannte Termine helfen bei der Zuordnung. Teilen Sie auch mit, ob Sie als Beschuldigter, Geschädigter oder Zeuge betroffen sind.', 'Umfangreiche oder sensible Verfahrensunterlagen übermitteln Sie auf dem mit der Kanzlei abgestimmten Weg. Für kurzfristige Termine und bestehende Fristen rufen Sie bitte direkt an.'], 'document', { anchor: 'vorbereitung', position: '50% 42%', cta: a('Sekretariat anrufen', tel('+49 841 93557-20'), 'Phone'), soft: true }),
    people('', 'Veronika Hagn verbindet Fachanwaltsqualifikationen für Strafrecht und Verkehrsrecht. Auch Eva Huxmann arbeitet im Strafrecht; ihr persönliches Profil erläutert ihre weiteren Tätigkeitsfelder.', ['veronika-hagn'], { focus: ['Strafrecht'], cta: a('Profil von Eva Huxmann', '/eva-huxmann-anwalt-ingolstadt') }),
    contactBand('Die weitere Tätigkeit\ngemeinsam abstimmen.', 'Eine erste Einordnung und eine fortlaufende Vertretung haben einen unterschiedlichen Umfang. Besprechen Sie Ihre Frage, die gewünschte Unterstützung und die Vergütung beim Ersttermin.', a('Ersttermin & Kosten', '/anwalt-ingolstadt#kosten'), a('Kontakt zur Kanzlei', '/kontakt'), { soft: true }),
  ];

  for (const lawyer of lawyers) {
    const copy = profileCopy[lawyer.key];
    const related = lawyer.areas.map(key => practice(key));
    const practiceLinks = related.length
      ? `Weitere Informationen zur Vorbereitung und zu typischen Fragen finden Sie in den Beratungsfeldern ${related.map(item => `<a href="/${item.slug}">${item.title}</a>`).join(', ')}.`
      : 'Die <a href="/rechtsgebiete-anwalt-ingolstadt">Rechtsgebiete der Kanzlei</a> geben einen Überblick über die zentralen Beratungsfelder und weitere individuelle Tätigkeitsgebiete.';
    result[lawyer.slug] = [
      s('perspectiveHero', { layout: 'portrait', eyebrow: '', headline: lawyer.name, text: copy.intro, image: media(`anwaelte/${lawyer.imageKey}.jpg`), imageAlt: `Porträt von ${lawyer.name}`, imagePosition: 'center 25%', imageMobilePosition: 'center 25%', caption: '', primaryCta: a('Sekretariat & Kontakt', '#kontakt'), secondaryCta: emptyAction(), meta: [lawyer.role, `Zulassung seit ${lawyer.licensed}`], motion: 'subtle', imageEffect: 'none', hoverEffect: 'none' }),
      reader(copy.headline, [...copy.groups, ...copy.qualifications.slice(3), practiceLinks], { soft: true }),
      contactBand(`Kontakt zu\n${lawyer.name}.`, `${copy.contactNote} ${lawyer.key === 'ulrike-wagner' ? 'Die E-Mail-Adresse führt direkt zu Rechtsanwältin Ulrike Wagner.' : 'Für Termine und organisatorische Rückfragen steht Ihnen das zugeordnete Sekretariat zur Verfügung.'}`, a(lawyer.phone, tel(lawyer.phone), 'Phone'), a(lawyer.email, `mailto:${lawyer.email}`, 'Mail'), { anchor: 'kontakt' }),
    ];
  }

  result['anwalt-ingolstadt'] = [
    hero('compact', 'Ihr erster Termin.\nIhre Fragen im Mittelpunkt.', 'Hier finden Sie die Informationen zu Terminvereinbarung, Vorbereitung, Vergütung und möglicher Kostenübernahme. Die konkrete Abstimmung richtet sich nach Ihrem Anliegen.', '', { primaryCta: a('Termin vereinbaren', '/kontakt'), secondaryCta: a('Zu den Kosten', '#kosten') }),
    chapter('spread', 'Gut vorbereitet.\nOffen für Ihre Fragen.', ['Melden Sie sich telefonisch oder per E-Mail und nennen Sie kurz das Thema sowie die beteiligten Personen oder Unternehmen. Bestehende Fristen und kurzfristige Termine teilen Sie bitte bereits am Telefon mit.', 'Stellen Sie die betroffenen Verträge und vollständigen Schreiben, die bisherige Korrespondenz und eine kurze zeitliche Übersicht zusammen. Wenn Unterlagen fehlen, teilen Sie mit, was bereits vorhanden ist.', 'Notieren Sie, was Sie klären möchten und welche Entscheidung ansteht. So können die Ausgangslage, offene Informationen und der gewünschte Umfang der anwaltlichen Tätigkeit gemeinsam besprochen werden. Sie müssen die rechtliche Bewertung nicht vorwegnehmen.'], 'notes', { position: '50% 42%', mobilePosition: '50% 42%', soft: true }),
    reader('Kosten gehören\nfrüh ins Gespräch.', [
      'Eine erste Beratung, eine Vertragsprüfung, außergerichtliche Korrespondenz und ein Gerichtsverfahren sind unterschiedliche Tätigkeiten. Sprechen Sie die Kosten bei der Terminvereinbarung oder zu Beginn der Beratung an. Der vorgesehene Umfang, die Grundlage der Abrechnung und eine mögliche Vergütungsvereinbarung werden im Zusammenhang mit Ihrem Anliegen besprochen.',
      { title: 'Den Umfang eingrenzen', text: 'Welche Tätigkeit ist zunächst vorgesehen? Auf welcher Grundlage wird sie abgerechnet? Und welche weiteren Kosten können bei einer Fortsetzung entstehen? Diese Fragen helfen, die erste Beratung von einer möglichen weiteren Beauftragung zu unterscheiden.' },
      { title: 'Mit Rechtsschutz.', text: 'Halten Sie die Daten einer vorhandenen Rechtsschutzversicherung bereit. Ob und in welchem Umfang eine Kostenübernahme für Ihre Angelegenheit möglich ist, muss konkret geklärt werden. Die Abstimmung mit der Versicherung kann Teil des Gesprächs sein.' },
      { title: 'Beratungs- und Prozesskostenhilfe', text: 'Beratungshilfe und Prozesskostenhilfe betreffen unterschiedliche Formen möglicher Unterstützung. Im Servicebereich stehen dafür die vorhandenen Kanzleiformulare bereit. Welche Angaben und Belege gebraucht werden und ob eine Unterstützung in Betracht kommt, wird individuell eingeordnet. Das Bereitstellen oder Ausfüllen eines Formulars enthält noch keine Zusage einer Kostenübernahme. Fragen Sie deshalb vorab nach, welches Dokument für Ihre Angelegenheit benötigt wird.' },
    ], { anchor: 'kosten' }),
    contactBand('Die Unterlagen passend\nzu Ihrem Anliegen.', 'Auf den Rechtsgebietsseiten finden Sie Hinweise zur jeweiligen Vorbereitung. Die Verwendung und die Übermittlung ausgefüllter Vollmachten und Formulare stimmen Sie mit dem Sekretariat ab. Eine Anfrage oder die Übersendung von Unterlagen allein begründet kein Mandat; die Übernahme bedarf der Annahme durch die Kanzlei.', a('Rechtsgebiete & Vorbereitung', '/rechtsgebiete-anwalt-ingolstadt'), a('Vollmachten & Formulare', '/service-anwaelte-ingolstadt#hilfen'), { soft: true }),
  ];

  result['service-anwaelte-ingolstadt'] = [
    hero('compact', 'Formulare &\nVollmachten.', 'Neun Kanzleidokumente als PDF. Stimmen Sie vor dem Ausfüllen ab, welches Formular Sie benötigen.'),
    resource('', '', [
      { id: 'mandatsbeginn', title: 'Mandatsbeginn und Daten', items: [link('Mandatsaufnahmebogen', 'Angaben zu Ihrer Person und zu der Angelegenheit, die übernommen werden soll.', media('downloads/mandatsaufnahmebogen.pdf'), 'PDF öffnen', 'PDF'), link('Hinweise zur Datenverarbeitung', 'Informationen der Kanzlei zum Umgang mit personenbezogenen Daten im Mandatsverhältnis.', media('downloads/hinweise-datenverarbeitung.pdf'), 'PDF öffnen', 'PDF')] },
      { id: 'vollmachten', title: 'Vollmachten', items: [link('Vollmacht', 'Allgemeines Vollmachtsformular für die mit der Kanzlei vereinbarte Vertretung.', media('downloads/vollmacht.pdf'), 'PDF öffnen', 'PDF'), link('Prozessvollmacht', 'Vollmachtsformular für eine Vertretung im gerichtlichen Verfahren.', media('downloads/prozessvollmacht.pdf'), 'PDF öffnen', 'PDF'), link('Strafprozessvollmacht', 'Vollmachtsformular für die vereinbarte Vertretung in Strafsachen.', media('downloads/strafprozessvollmacht.pdf'), 'PDF öffnen', 'PDF')] },
      { id: 'erklaerungen', title: 'Ergänzende Erklärungen', items: [link('Entbindung von der ärztlichen Schweigepflicht', 'Erklärung zu medizinischen Informationen, soweit diese für die konkrete Angelegenheit benötigt und mit Ihnen abgestimmt werden.', media('downloads/schweigepfilcht-entbindung.pdf'), 'PDF öffnen', 'PDF'), link('Musterwiderrufsformular', 'Das von der Kanzlei bereitgestellte Muster. Fragen zur Verwendung besprechen Sie bitte mit der Kanzlei.', media('downloads/musterwiderrufsformular.pdf'), 'PDF öffnen', 'PDF')] },
      { id: 'hilfen', title: 'Formulare zu möglichen Hilfen', items: [link('Beratungshilfe', 'Vorhandenes Formular für die individuelle Prüfung einer möglichen Beratungshilfe.', media('downloads/beratungshilfe.pdf'), 'PDF öffnen', 'PDF'), link('Prozesskostenhilfe', 'Angaben zu persönlichen und wirtschaftlichen Verhältnissen für eine mögliche Prozesskostenhilfe.', media('downloads/prozesskostenhilfe.pdf'), 'PDF öffnen', 'PDF')] },
    ], { note: 'Stimmen Sie die benötigten Angaben und die Übermittlung ausgefüllter Unterlagen mit der Kanzlei ab.' }),
    contactBand('Welches Formular\nbrauchen Sie?', 'Nennen Sie dem zuständigen Sekretariat das Dokument und Ihre Angelegenheit. Die Vollmacht richtet sich nach der vereinbarten Tätigkeit. Ergänzende Erklärungen kommen nur hinzu, wenn sie im konkreten Mandat benötigt werden. Eine Übersendung allein begründet noch keine Mandatsübernahme.', a('Ihr Sekretariat finden', '/ingolstadt-anwaltskanzlei'), a('Ersttermin & Kosten', '/anwalt-ingolstadt'), { soft: true }),
  ];

  result['anwalt-in-ingolstadt'] = [
    hero('statement', 'Gut beraten.\nBewusst entscheiden.', 'Rechtliche Möglichkeiten stehen im Zusammenhang mit Ihren persönlichen und wirtschaftlichen Zielen. Im Gespräch wird geklärt, welche Unterstützung Sie benötigen und wie die Zusammenarbeit gestaltet werden soll.', 'gespraech'),
    chapter('spread', 'Welche Aufgabe\nsollen wir übernehmen?', ['Eine Beratung kann zunächst der Orientierung dienen. Eine Dokumentenprüfung bezieht sich auf eine konkrete Vereinbarung oder ein Schreiben. Gemeinsam wird eingegrenzt, welche Frage beantwortet werden soll und welche Informationen dafür fehlen.', 'Eine weitere Vertretung kann Korrespondenz und zusätzliche Schritte umfassen. Diese Tätigkeit wird mit Ihnen abgestimmt. Die erste Frage, ein neuer Sachverhalt und die Fortsetzung einer Angelegenheit können jeweils einen eigenen Abstimmungsbedarf auslösen.'], 'window', { soft: true }),
    reader('Rechtliche Möglichkeiten.\nPraktische Folgen.', ['Eine rechtliche Möglichkeit ist zugleich eine persönliche oder wirtschaftliche Entscheidung. Ihr Ziel, der erforderliche Aufwand und die Grundlage der Vergütung gehören deshalb in denselben Zusammenhang. Fragen Sie nach, wenn eine mögliche Tätigkeit oder ihre Folgen unklar bleiben. Die Beratung soll die Entscheidung nachvollziehbar machen. Die gewünschte weitere Beauftragung und deren Umfang werden anschließend mit Ihnen abgestimmt.', 'Eine Angelegenheit kann sich verändern. Teilen Sie neue Entwicklungen, bekannte Termine und zusätzliche Unterlagen mit. Beschreiben Sie auch, wenn sich Ihr Ziel verändert hat. Der Übermittlungsweg für umfangreiche oder sensible Dokumente wird mit dem Sekretariat abgestimmt.', 'Die Profile zeigen die anwaltlichen Schwerpunkte und die zugeordneten Sekretariatskontakte. Organisatorische Fragen finden dort ihre direkte Adresse; rechtliche Fragen gehören in die anwaltliche Abstimmung.']),
    contactBand('Persönlich zugeordnet.\nKlar erreichbar.', 'Lernen Sie die fachlichen Schwerpunkte Ihrer Ansprechpartner kennen oder bereiten Sie den ersten Termin mit den Informationen zu Umfang und Vergütung vor.', allPeople, a('Ersttermin & Kosten', '/anwalt-ingolstadt'), { soft: true }),
  ];

  result['anwaltskanzlei-in-ingolstadt'] = [
    hero('journal', 'In Ingolstadt\ngewachsen.', 'Seit 1978 ist Ingolstadt der Ort unserer anwaltlichen Arbeit. Die Kanzleigeschichte führt von der Gründung zum heutigen Standort und zum aktuellen Team.', 'bibliothek'),
    s('timeline', { headline: 'Ein lokaler\nZusammenhang.', badge: '', subline: '', entries: [
      { year: '1. Juni 1978', title: 'Die Gründung', text: 'An diesem Tag wurde die Kanzlei in Ingolstadt gegründet.' },
      { year: '1990', title: 'Bergbräustraße 7', text: 'Seit 1990 befindet sich die Kanzlei am heutigen Standort, direkt neben der Tiefgarage „Am Münster“.' },
      { year: 'Heute', title: 'Sieben anwaltliche Perspektiven', text: 'Sieben Rechtsanwältinnen und Rechtsanwälte mit unterschiedlichen Tätigkeitsfeldern bilden das aktuelle anwaltliche Team.' },
    ] }, { soft: true }),
    chapter('spread', 'Ein fester Ort.\nEine Kanzlei in Bewegung.', ['Der Standort in der Ingolstädter Altstadt verbindet die Geschichte der Kanzlei mit ihrer heutigen Arbeit. Wer hier berät, welche Qualifikationen die einzelnen Anwältinnen und Anwälte mitbringen und wie Sie sie erreichen, zeigen die aktuellen persönlichen Profile.', 'Für Ihre heutige Frage zählen die Menschen, ihre unterschiedlichen fachlichen Schwerpunkte und die direkte Verbindung zum jeweiligen Sekretariat. Die Bergbräustraße 7 bleibt der gemeinsame Ort für diese Zusammenarbeit.'], 'empfang', { secondaryImage: 'besprechung', cta: allPeople }),
  ];

  result['ingolstadt-anwaltskanzlei'] = [
    s('teamSpotlight', { layout: 'contactSheet', titleAs: 'h1', badge: '', headline: 'Ihr Kontakt\nhat ein Gesicht.', subline: 'Unser Sekretariat unterstützt die Terminabstimmung und die organisatorische Zusammenarbeit. Die Kontakte sind den Anwältinnen und Anwälten direkt zugeordnet.', members: staff.map(item => ({ name: item.name, role: item.role, focus: item.focus, image: media(`sekretariat/${item.key}.jpg`), imageAlt: `Porträt von ${item.name}`, imagePosition: 'center 25%', href: `mailto:${item.email}`, contactName: '', phone: item.phone, email: item.email, quote: '' })), cta: emptyAction() }),
    reader('Organisation mit\nfachlichem Hintergrund.', [
      { title: 'Susanna Nagel', text: 'Die Bürovorsteherin ist geprüfte Rechtsfachwirtin und seit 1989 in der Kanzlei. Ihr Sekretariat ist Dr. iur. Niels Deckert zugeordnet.' },
      { title: 'Ilona Epstein', text: 'Sie gehört seit 1999 zur Kanzlei. Ihre Aufgaben umfassen unter anderem Arbeits- und Familienrecht sowie Zwangsvollstreckung; sie betreut die Sekretariate von Veronika Hagn und Maria Haneder.' },
      { title: 'Annalena Baumanis', text: 'Die geprüfte Rechtsfachwirtin betreut die Sekretariate von Ulrike Wagner und Eva Huxmann. Sie erreichen sie für Ulrike Wagner unter <a href="tel:+498419355725">+49 841 93557-25</a> und für Eva Huxmann unter <a href="tel:+498419355717">+49 841 93557-17</a>. Für Eva Huxmann führt die E-Mail-Adresse <a href="mailto:baumanis@hagn-partner.de">baumanis@hagn-partner.de</a> ins Sekretariat. <a href="mailto:rain.wagner@hagn-partner.de">rain.wagner@hagn-partner.de</a> ist die direkte E-Mail-Adresse von Rechtsanwältin Ulrike Wagner.' },
    ], { soft: true }),
    contactBand('Die Zuständigkeit\nnoch nicht bekannt?', 'Über die zentrale Verbindung schildern Sie Ihr Thema und stimmen den passenden Kontakt ab. Bei einem bestehenden Anliegen finden Sie Telefonnummer und E-Mail auch im persönlichen Anwaltsprofil.', a(PHONE, tel(PHONE), 'Phone'), a('Anwaltsprofile', '/anwaelte-ingolstadt')),
  ];

  result['kontakt'] = [
    s('contact', { layout: 'editorial', titleAs: 'h1', headline: 'Kontakt & Termin.', introText: p('Beschreiben Sie kurz Ihr Anliegen. Bei bestehenden Fristen oder kurzfristigen Terminen rufen Sie bitte an. Übermitteln Sie hier keine vertraulichen Falldokumente.'), badgeText: '', formEnabled: true, submitLabel: 'Terminanfrage senden', privacyHref: '/datenschutz', showMap: false, infoCards: [{ icon: 'Phone', label: 'Telefon', value: PHONE }, { icon: 'Mail', label: 'E-Mail', value: EMAIL }, { icon: 'Clock', label: 'Bürozeiten', value: 'Mo, Di, Do 08–12 und 14–17 Uhr · Mi, Fr 08–12 Uhr' }, { icon: 'MapPin', label: 'Kanzlei', value: 'Bergbräustr. 7, 85049 Ingolstadt' }] }, { anchor: 'nachricht' }),
    chapter('spread', 'Ihr Weg\nzu uns.', ['Die Kanzlei liegt in der Ingolstädter Altstadt, direkt neben der Tiefgarage „Am Münster“. Stimmen Sie Ihren Besprechungstermin vorab mit uns ab. Fragen zum Zugang oder zu Ihrer Anreise können Sie vor dem Besuch telefonisch klären.', 'Der Kartenlink öffnet Google Maps erst durch Ihren Klick. Für eine bestimmte Anwältin oder einen bestimmten Anwalt finden Sie die direkte organisatorische Verbindung im jeweiligen Profil. Eine Mandatsübernahme bedarf der Annahme durch die Kanzlei.'], 'empfang', { anchor: 'anfahrt', secondaryImage: 'treppenhaus', cta: a('Route in Google Maps öffnen', 'https://www.google.com/maps/search/?api=1&query=Bergbr%C3%A4ustr.%207%2C%2085049%20Ingolstadt', 'MapPin') }),
  ];

  return result;
}
