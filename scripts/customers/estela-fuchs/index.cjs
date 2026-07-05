// Estela Fuchs — Praxis für ganzheitliche Psychotherapie, Ingolstadt.
// Neuaufbau am Original www.estela-fuchs.com (Texte aus dem Web Archive,
// Snapshots 2025/2026 — die Domain selbst ist bereits auf Vercel umgezogen).
// Standalone-Projekt: flamingo-estela-fuchs.vercel.app, i18n nur 'de' → flache Daten.
const legal = require('./_legal.json');

const IMG = {
  estela3:  'https://cdn.prod.website-files.com/6890d61524a7dba397203fde/68c5370c877743c4a7999300_Estela-byaylin-3.jpg',
  estela26: 'https://cdn.prod.website-files.com/6890d61524a7dba397203fde/68c5370f3e66ed943079d4c6_Estela-byaylin-26-min.jpg',
  estela33: 'https://cdn.prod.website-files.com/6890d61524a7dba397203fde/68c53713513520b6bbe5b786_Estela-byaylin-33-min.jpg',
  estela43: 'https://cdn.prod.website-files.com/6890d61524a7dba397203fde/68c53718065ce01562873ef1_Estela-byaylin-43.jpg',
  estela52: 'https://cdn.prod.website-files.com/6890d61524a7dba397203fde/68c5371146ec6241e81774b7_Estela-byaylin-52-min.jpg',
  estela58: 'https://cdn.prod.website-files.com/6890d61524a7dba397203fde/68c537205b0c2bd091d7b6a5_Estela-byaylin-58-min.jpg',
  estela59: 'https://cdn.prod.website-files.com/6890d61524a7dba397203fde/68c5371f98928ab373b92ff9_Estela-byaylin-59-min.jpg',
  room:     'https://cdn.prod.website-files.com/6890d61524a7dba397203fde/689c709e31ebcac5995a9622_a9db9b1a-d5b1-4270-a1b0-8044de34b697.avif',
};

const PHONE = '+49 151 15539416';
const PHONE_HREF = 'tel:+4915115539416';
// Die Original-Kontaktseite (Snapshot 2026) und die bestehenden Kontakt-
// Einstellungen des Tenants nutzen die Hotmail-Adresse — nicht info@… wechseln,
// solange unklar ist, ob das Domain-Postfach nach dem Umzug noch existiert.
const EMAIL = 'estelafuchs@hotmail.com';
const ADDRESS = 'Bei der Schleifmühle 34b, 85049 Ingolstadt';

// Gemeinsamer Abschluss — Zitat des Originals als Einladung statt Werbefloskel.
const CTA_BAND = {
  type: 'immersiveCtaBanner',
  data: {
    badge: 'Kontakt',
    headline: 'Der erste Schritt beginnt mit einem Gespräch.',
    subline: 'Das Erstgespräch ist unverbindlich und kostenfrei. Lernen Sie die Kraft der Integration von Körper, Geist und Seele für sich zu nutzen.',
    image: IMG.room,
    overlay: 'rgba(38,48,66,0.62)',
    primaryCta: { label: `Telefon: ${PHONE}`, href: PHONE_HREF },
    secondaryCta: { label: 'E-Mail schreiben', href: `mailto:${EMAIL}` },
  },
};

const startseite = {
  slug: 'startseite',
  title: 'Startseite',
  seo: {
    // Kein Name im Titel — das Template hängt "| Estela Fuchs Ingolstadt" an.
    metaTitle: 'Praxis für ganzheitliche Psychotherapie',
    metaDescription: 'Ganzheitliche Psychotherapie in Ingolstadt: Verhaltenstherapie und Entspannungsverfahren, ergänzt um Meditation, Qigong, Tai Chi und Ernährung nach den 5 Elementen.',
  },
  sections: [
    {
      type: 'editorialHero',
      data: {
        eyebrow: 'Praxis für ganzheitliche Psychotherapie',
        headline: 'Herzlich willkommen in meiner Praxis.',
        text: '<p>Ich arbeite mit klassischen Verfahren wie Entspannungstechniken und Verhaltenstherapie sowie mit alternativen Methoden aus den Bereichen der Meditation, des Qigong, des Tai Chi und der Ernährung nach den 5 Elementen.</p>',
        imagePrimary: IMG.estela3,
        imageSecondary: IMG.room,
        primaryCta: { label: 'Erstgespräch vereinbaren', href: '/kontakt' },
        secondaryCta: { label: 'Therapien entdecken', href: '/therapien' },
        hint: 'Heilpraktikerin für Psychotherapie · Kurse und Sitzungen auch online möglich',
      },
    },
    {
      type: 'principlesGrid',
      data: {
        badge: 'Wobei ich Sie unterstütze',
        headline: 'Ich berate und unterstütze Sie gerne.',
        subline: 'Manchmal braucht es einen geschützten Raum und einen klaren Blick von außen. Diese Themen begleite ich in meiner Praxis besonders häufig:',
        principles: [
          { eyebrow: '01', title: 'Stress', text: 'Bei Stress und stressbedingten Beschwerden — bevor aus Anspannung ein Dauerzustand wird.' },
          { eyebrow: '02', title: 'Burnout & Depression', text: 'Bei Burnout oder Depression: behutsam Kraft aufbauen und wieder Boden unter den Füßen finden.' },
          { eyebrow: '03', title: 'Schlaf & Erschöpfung', text: 'Bei Schlafstörungen oder andauernder Erschöpfung, wenn Erholung nicht mehr von allein gelingt.' },
          { eyebrow: '04', title: 'Schmerzen', text: 'Bei Schmerzen aller Art — mit Methoden, die Körper und Psyche gemeinsam ansprechen.' },
          { eyebrow: '05', title: 'Psychosomatik', text: 'Bei psychosomatischen Beschwerden, auch wenn der Arzt keinen Befund nennen kann.' },
          { eyebrow: '06', title: 'Krisen & Entscheidungen', text: 'An Scheidewegen und in Lebenskrisen: Orientierung finden und tragfähige Entscheidungen treffen.' },
        ],
        cta: { label: 'Behandlung kennenlernen', href: '/behandlung' },
      },
    },
    {
      type: 'zigzagShowcase',
      data: {
        rows: [
          {
            eyebrow: 'Ihr Ziel',
            headline: 'Orientierung, Stabilisierung, Unterstützung.',
            text: '<p>Sie stehen an einem Scheideweg, befinden sich in einer Krise oder leiden unter Symptomen, die Sie sich nicht erklären können? Gemeinsam finden wir heraus, was Sie gerade wirklich brauchen.</p>',
            image: IMG.estela52,
            imageAlt: 'Gespräch in der Praxis',
            links: [{ label: 'Ihr Ziel entdecken', href: '/ihr-ziel' }],
          },
          {
            eyebrow: 'Therapien',
            headline: 'Klassisch fundiert, achtsam ergänzt.',
            text: '<p>Von kognitiver Verhaltenstherapie über Autogenes Training und Progressive Muskelentspannung bis zu Meditation, Massage und den Tao-Praktiken — die Methode folgt Ihrem Bedürfnis, nicht umgekehrt.</p>',
            image: IMG.estela33,
            imageAlt: 'Meditation und Entspannungsverfahren',
            links: [{ label: 'Alle Therapien ansehen', href: '/therapien' }],
          },
          {
            eyebrow: 'Behandlung',
            headline: 'Vom Kennenlernen zur Veränderung.',
            text: '<p>Das erste Gespräch ist unverbindlich und kostenfrei. Danach gehen wir in Einzelsitzungen Schritt für Schritt auf Ihre Themen ein — auf Wunsch auch körperorientiert nach den Leitlinien des Universal Healing Tao.</p>',
            image: IMG.estela26,
            imageAlt: 'Körperorientierte Psychotherapie',
            links: [
              { label: 'Ablauf der Behandlung', href: '/behandlung' },
              { label: 'Praxisinfo & Honorar', href: '/praxisinfo-honorar' },
            ],
          },
        ],
      },
    },
    CTA_BAND,
  ],
};

const ihrZiel = {
  slug: 'ihr-ziel',
  title: 'Ihr Ziel',
  seo: {
    metaTitle: 'Ihr Ziel — Orientierung, Stabilisierung, Unterstützung',
    metaDescription: 'Ob Scheideweg, Krise oder unerklärliche Beschwerden: In der Praxis Estela Fuchs in Ingolstadt finden Sie Orientierung, Stabilisierung und konkrete Unterstützung.',
  },
  sections: [
    {
      type: 'editorialHero',
      data: {
        eyebrow: 'Ihr Ziel',
        headline: 'Was darf sich für Sie verändern?',
        text: '<p>Jeder Weg in die Praxis beginnt mit einer eigenen Geschichte. Vielleicht erkennen Sie sich in einer dieser drei Situationen wieder.</p>',
        imagePrimary: IMG.estela43,
        primaryCta: { label: 'Gespräch vereinbaren', href: '/kontakt' },
        hint: 'Das Erstgespräch ist unverbindlich und kostenfrei.',
      },
    },
    {
      type: 'zigzagShowcase',
      data: {
        startRight: true,
        rows: [
          {
            eyebrow: 'Orientierung',
            headline: 'Wenn wichtige Entscheidungen anstehen.',
            text: '<p>Sie stehen an einem Scheideweg? Wichtige Entscheidungen liegen vor Ihnen? Sie suchen nach Halt und Orientierung — nach innerer Ruhe und Sicherheit, ohne von externen Faktoren getrieben und beeinflusst zu werden? Sie suchen Distanz vom täglichen Alltag und sind auf der Suche nach Ihrem inneren Selbst?</p>',
            image: IMG.estela52,
            imageAlt: 'Orientierung finden',
          },
          {
            eyebrow: 'Stabilisierung',
            headline: 'Wenn das Leben aus dem Gleichgewicht gerät.',
            text: '<p>Sie befinden sich in einer Krise? Ihr Leben hat sich in beabsichtigter oder unbeabsichtigter Weise verändert und Sie fühlen sich überfordert? Sie finden keine Erholung und sehen wenig Alternativen? Sie fühlen sich krank oder schwach, obwohl der Arzt Ihnen keinen Befund nennen kann?</p>',
            image: IMG.estela33,
            imageAlt: 'Stabilität zurückgewinnen',
          },
          {
            eyebrow: 'Unterstützung',
            headline: 'Wenn Sie einen Ansprechpartner suchen.',
            text: '<p>Sie fühlen sich unwohl, leiden unter psychischen oder körperlichen Symptomen und machen sich Gedanken dazu? Sie suchen eine Heilpraktikerin für Psychotherapie als Ansprechpartnerin und Beraterin — und nach konkreten psychotherapeutischen Behandlungsmöglichkeiten?</p>',
            image: IMG.estela59,
            imageAlt: 'Psychotherapeutische Unterstützung',
          },
        ],
      },
    },
    CTA_BAND,
  ],
};

const therapien = {
  slug: 'therapien',
  title: 'Therapien',
  seo: {
    metaTitle: 'Therapien — Verhaltenstherapie & Entspannung in Ingolstadt',
    metaDescription: 'Autogenes Training, kognitive Verhaltenstherapie, Meditation, Massage, Paartherapie, Progressive Muskelentspannung, Sokratischer Dialog und Tao-Praktiken.',
  },
  sections: [
    {
      type: 'editorialHero',
      data: {
        eyebrow: 'Therapien',
        headline: 'Die Methode folgt Ihrem Bedürfnis.',
        text: '<p>Ich verbinde anerkannte psychotherapeutische Verfahren mit bewährten Entspannungstechniken und den taoistischen Praktiken. Was davon zum Einsatz kommt, entscheiden wir gemeinsam.</p>',
        imagePrimary: IMG.estela33,
        imageSecondary: IMG.estela43,
        primaryCta: { label: 'Beratung anfragen', href: '/kontakt' },
        secondaryCta: { label: 'Ablauf ansehen', href: '/behandlung' },
      },
    },
    {
      type: 'principlesGrid',
      data: {
        badge: 'Überblick',
        headline: 'Acht Wege, ein Ziel.',
        subline: 'Verhaltenstherapie und Entspannungsverfahren — einzeln oder kombiniert, immer abgestimmt auf Ihre Situation.',
        principles: [
          { eyebrow: 'Entspannung', title: 'Autogenes Training', text: 'Auf Autosuggestion basierendes, gesetzlich anerkanntes Entspannungsverfahren nach J. H. Schultz.' },
          { eyebrow: 'Verhaltenstherapie', title: 'Kognitive Verhaltenstherapie', text: 'Wie wir denken, bestimmt, wie wir fühlen und handeln — Einstellungen erkennen, prüfen, verändern.' },
          { eyebrow: 'Körperarbeit', title: 'Massage', text: 'Wirkt über den Körper auf den ganzen Organismus — entspannend, schmerzlindernd, stressreduzierend.' },
          { eyebrow: 'Achtsamkeit', title: 'Meditation', text: 'Den Geist beruhigen und sammeln — mit nachgewiesener Wirkung auf Körper und Psyche.' },
          { eyebrow: 'Beziehung', title: 'Paartherapie', text: 'Gemeinsam einen Schritt vorwärts — in Einzel- und Paargesprächen, ergänzt um taoistische Elemente.' },
          { eyebrow: 'Entspannung', title: 'Progressive Muskelentspannung', text: 'Tiefe Entspannung durch bewusstes An- und Loslassen der Muskulatur, nach Edmund Jacobson.' },
          { eyebrow: 'Gespräch', title: 'Sokratischer Dialog', text: 'Kritisches Hinterfragen als Fragetechnik — Denkmuster sichtbar, verstehbar und veränderbar machen.' },
          { eyebrow: 'Tao-Praktiken', title: 'Yoga, Qigong & Tai Chi', text: 'Arbeit an Körperstruktur und Körperwahrnehmung — für ein neues, annehmendes Selbstbewusstsein.' },
        ],
      },
    },
    {
      type: 'faq',
      data: {
        badgeText: 'Im Detail',
        headline: 'Die Therapien im Detail',
        expandFirst: true,
        items: [
          {
            question: 'Autogenes Training',
            answer: '<p>Autogenes Training ist ein auf Autosuggestion basierendes Entspannungsverfahren. Es wurde vom Berliner Psychiater Johannes Heinrich Schultz aus der Hypnose entwickelt, 1926 erstmals vorgestellt und 1932 in seinem Buch „Das autogene Training" publiziert. Heute ist das autogene Training eine weit verbreitete und — beispielsweise in Deutschland und Österreich sogar gesetzlich — anerkannte Psychotherapiemethode.</p>',
          },
          {
            question: 'Kognitive Verhaltenstherapie',
            answer: '<p>Im Mittelpunkt der kognitiven Therapieverfahren stehen Kognitionen: Einstellungen, Gedanken, Bewertungen und Überzeugungen. Sie gehen davon aus, dass die Art und Weise, wie wir denken, bestimmt, wie wir uns fühlen, verhalten und körperlich reagieren. Schwerpunkte der Therapie sind:</p><ul><li>die Bewusstmachung von Kognitionen,</li><li>die Überprüfung von Kognitionen und Schlussfolgerungen auf ihre Angemessenheit,</li><li>die Korrektur von irrationalen Einstellungen,</li><li>der Transfer der korrigierten Einstellungen ins konkrete Verhalten.</li></ul><p>Die kognitive Therapie stellt die aktive Gestaltung des Wahrnehmungsprozesses in den Vordergrund — denn in letzter Instanz entscheidet nicht die objektive Realität, sondern die subjektive Sicht über das Verhalten.</p>',
          },
          {
            question: 'Massage',
            answer: '<p>Die Massage dient der mechanischen Beeinflussung von Haut, Bindegewebe und Muskulatur durch Dehnungs-, Zug- und Druckreiz. Ihre Wirkung erstreckt sich von der behandelten Stelle über den gesamten Organismus und schließt die Psyche mit ein:</p><ul><li>Lokale Steigerung der Durchblutung, Senkung von Blutdruck und Pulsfrequenz</li><li>Entspannung der Muskulatur, Lösen von Verklebungen und Narben</li><li>Schmerzlinderung und Einwirken auf innere Organe über Reflexbögen</li><li>Psychische Entspannung, Reduktion von Stress</li><li>Beeinflussung des vegetativen Nervensystems</li></ul><p>Die Massage eignet sich hervorragend, die eigene Körperwahrnehmung zu verbessern, und kann zur Vorbeugung bei Stress und ergänzend zur Therapie von Angststörungen oder Depressionen eingesetzt werden.</p>',
          },
          {
            question: 'Meditation',
            answer: '<p>Meditation ist eine in vielen Kulturen ausgeübte spirituelle Praxis. Durch Achtsamkeits- oder Konzentrationsübungen soll sich der Geist beruhigen und sammeln. Studien belegen positive Effekte in vielen Bereichen:</p><ul><li><strong>Physisch:</strong> Reduzierung von Bluthochdruck, vertiefte Atmung, weniger Muskelspannung, Stärkung des Immunsystems, besserer Umgang mit chronischen Schmerzen</li><li><strong>Psychisch:</strong> Reduzierung von Angstzuständen, bessere Erholung bei Burnout und Depression, weniger Schlafstörungen</li><li><strong>Verhalten:</strong> Unterstützung bei Verhaltensänderungen, besserer Umgang mit Sucht und Essstörungen</li></ul>',
          },
          {
            question: 'Paartherapie',
            answer: '<p>Gemeinsam einen Schritt vorwärts machen — in Einzel- und Paargesprächen, ergänzt mit Elementen der taoistischen Traditionen in Meditation, Yoga und Qigong, verfolgen wir folgende Ziele:</p><ul><li>Beziehungsprobleme verstehen und herausfinden, wie Ihre Liebesbeziehung funktionieren kann</li><li>Sich selbst und den Partner besser erkennen und verstehen</li><li>Neue Werkzeuge in die Hand bekommen, die in allen Lebenslagen nützlich sind</li></ul>',
          },
          {
            question: 'Progressive Muskelentspannung nach Jacobson',
            answer: '<p>Bei der progressiven Muskelentspannung nach Edmund Jacobson wird durch die willentliche und bewusste An- und Entspannung bestimmter Muskelgruppen ein Zustand tiefer Entspannung des ganzen Körpers erreicht. Nacheinander werden einzelne Muskelpartien angespannt, die Spannung kurz gehalten und anschließend gelöst.</p><p>Ziel ist eine Senkung der Muskelspannung unter das normale Niveau durch verbesserte Körperwahrnehmung. Mit der Zeit lernen Sie, muskuläre Entspannung herbeizuführen, wann immer Sie dies möchten. Auch Herzklopfen, Schwitzen oder Zittern können so reduziert, Verspannungen aufgespürt und Schmerzzustände verringert werden.</p>',
          },
          {
            question: 'Sokratischer Dialog',
            answer: '<p>Der Sokratische Dialog ist eine Fragetechnik, derer sich Therapeuten bedienen, wenn es im therapeutisch-beratenden Gespräch um Begriffsklärung und Entscheidungsfindung geht. Es ist ein Prozess des kritischen Hinterfragens von Argumenten: Strukturen und Verhaltensmuster werden sichtbar, das eigene Denken und Handeln verstehbar — und damit auch veränderbar.</p>',
          },
          {
            question: 'Yoga, Qigong & Tai Chi',
            answer: '<p>Yoga, Qigong und Tai Chi sind Techniken, die an der Körperstruktur und an der Körperwahrnehmung arbeiten. In Verbindung mit Meditation und Massage führen diese Praktiken zu einem neuen Selbstbewusstsein, einer positiveren und annehmenderen Haltung zu sich selbst und zum eigenen Körper — und einem zunehmenden Gefühl für die eigene Gesundheit.</p>',
          },
        ],
      },
    },
    CTA_BAND,
  ],
};

const behandlung = {
  slug: 'behandlung',
  title: 'Behandlung',
  seo: {
    metaTitle: 'Behandlung — Beratung, Einzelsitzungen & Körperarbeit',
    metaDescription: 'Vom kostenfreien Erstgespräch über Einzelsitzungen bis zur körperorientierten Psychotherapie nach Universal Healing Tao und Chi Nei Tsang — mein Angebot in Ingolstadt.',
  },
  sections: [
    {
      type: 'editorialHero',
      data: {
        eyebrow: 'Behandlung',
        headline: 'Mein Angebot — Schritt für Schritt.',
        text: '<p>Unser Ziel ist es, dass Sie die Verantwortung für Ihre eigene Gesundheit übernehmen können und selbst entscheiden, was Ihnen gut tut.</p>',
        imagePrimary: IMG.estela26,
        primaryCta: { label: 'Erstgespräch vereinbaren', href: '/kontakt' },
        secondaryCta: { label: 'Honorar ansehen', href: '/praxisinfo-honorar' },
        hint: 'Kurse und Sitzungen auch online möglich.',
      },
    },
    {
      type: 'processSteps',
      data: {
        badgeText: 'So arbeiten wir',
        headline: 'Drei Schritte zu Ihrer Behandlung',
        steps: [
          {
            icon: 'messageCircle',
            title: 'Beratung',
            text: 'Lernen Sie mich kennen. Im Gespräch tasten wir uns an Ihr ganz persönliches Bedürfnis heran und entscheiden gemeinsam die für Sie beste Vorgehensweise. Das erste Gespräch ist unverbindlich und kostenfrei und erlaubt Ihnen, Einblick in mein Denken und Handeln zu gewinnen.',
          },
          {
            icon: 'user',
            title: 'Einzelsitzungen',
            text: 'In einzelnen Sitzungen gehen wir Schritt für Schritt auf Ihre Bedürfnisse ein und arbeiten an den für Sie wichtigen Themen. Gerne können die verschiedenen Methoden auch nur zum Kennenlernen ausprobiert werden.',
          },
          {
            icon: 'heartHandshake',
            title: 'Körperorientierte Psychotherapie',
            text: 'Ich verbinde die Elemente der Meditation und der Massage in eine wirksame Behandlungsform nach den Leitlinien des Universal Healing Tao und des Chi Nei Tsang nach Großmeister Mantak Chia — sehr gut integrierbar mit den klassischen Psychotherapieformen.',
          },
        ],
      },
    },
    {
      type: 'ctaSplit',
      data: {
        badge: 'Verbunden mit dem Tao Yin Zentrum',
        headline: 'Körper und Psyche gehören zusammen.',
        text: '<p>Die körperorientierte Arbeit findet in den Räumen des Tao Yin Zentrums Ingolstadt statt — demselben Ort, an dem auch Qi Gong-Kurse und Chi Nei Tsang-Behandlungen angeboten werden. So lassen sich Psychotherapie und taoistische Praxis auf Wunsch nahtlos verbinden.</p>',
        image: IMG.room,
        checklist: [
          'Erstgespräch unverbindlich und kostenfrei',
          'Methoden zum Kennenlernen ausprobierbar',
          'Sitzungen auf Deutsch, Englisch oder Spanisch',
        ],
        primaryCta: { label: 'Termin anfragen', href: '/kontakt' },
        secondaryCta: { label: 'Tao Yin Zentrum entdecken', href: 'https://www.taoyin-zentrum.com' },
      },
    },
    CTA_BAND,
  ],
};

const ueberMich = {
  slug: 'ueber-mich',
  title: 'Über mich',
  seo: {
    metaTitle: 'Über mich — Estela Fuchs, Heilpraktikerin für Psychotherapie',
    metaDescription: 'Zertifizierte Tao-Lehrerin und Chi Nei Tsang Senior Teacher, seit 2013 Heilpraktikerin für Psychotherapie. Beratung auf Deutsch, Englisch und Spanisch in Ingolstadt.',
  },
  sections: [
    {
      type: 'editorialHero',
      data: {
        eyebrow: 'Über mich',
        headline: 'Estela Fuchs',
        text: '<p>Heilpraktikerin für Psychotherapie, zertifizierte Tao-Lehrerin und Chi Nei Tsang Senior Teacher. Seit über 30 Jahren verbinde ich westliche Psychotherapie mit östlicher Heilkunst.</p>',
        imagePrimary: IMG.estela3,
        imageSecondary: IMG.estela26,
        primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' },
        hint: 'Deutsch · English · Español',
      },
    },
    {
      type: 'richText',
      data: {
        content: '<h2>Mein Weg</h2>\n<p>Liebe Leserinnen und Leser,</p>\n<p>ich stamme aus einer Familie von Ärzten und fühlte mich schon seit der Kindheit mit der Medizin und alternativer Heilkunde verbunden. Seit 1990 beschäftige ich mich mit der Meditation und dem Universal Healing Tao nach Mantak Chia. 1992 habe ich einen Studiengang zur Geschichte und Philosophie der Weltreligionen abgeschlossen und dadurch die spirituellen Aspekte verschiedener Kulturen kennengelernt.</p>\n<p>Ich bin zertifizierte Tao-Lehrerin und Chi Nei Tsang-Senior-Teacher. Im Jahr 2013 habe ich die Schulung der Kunsttherapie im Asklepiad-Institut in München durchlaufen und mich dort auf die Heilpraktikerprüfung vorbereitet. Seit 2013 besitze ich die Erlaubnis als Heilpraktikerin der Psychotherapie.</p>\n<p>In Mexiko und in Dubai sammelte ich Erfahrungen in der Arbeit mit hilfsbedürftigen Kindern und habe mich seitdem auf die körperorientierte Psychotherapie spezialisiert.</p>\n<p>Ich wurde in Morelia, Michoacán, Mexiko geboren, bin verheiratet und habe zwei Kinder. Wir wohnen seit 2000 in Deutschland und haben von 2006 bis 2009 einige Jahre in Dubai gelebt.</p>\n<p>Ich spreche Deutsch und Englisch, meine Muttersprache ist Spanisch. Es ist mir eine Freude, meine Leistungen in diesen drei Sprachen anbieten zu können.</p>\n<p>Ich freue mich, Sie kennenzulernen.<br /><strong>Ihre Estela Fuchs</strong></p>',
      },
    },
    {
      type: 'galleryPro',
      data: {
        badge: 'Einblicke',
        headline: 'Die Praxis und die Arbeit.',
        images: [
          { src: IMG.estela52, alt: 'Estela Fuchs in der Praxis' },
          { src: IMG.estela33, alt: 'Übung und Achtsamkeit' },
          { src: IMG.estela59, alt: 'Körperorientierte Arbeit' },
          { src: IMG.estela58, alt: 'Behandlungsraum' },
          { src: IMG.estela43, alt: 'Estela Fuchs' },
          { src: IMG.room, alt: 'Der Praxisraum' },
        ],
      },
    },
    CTA_BAND,
  ],
};

const praxisinfo = {
  slug: 'praxisinfo-honorar',
  title: 'Praxisinfo und Honorar',
  seo: {
    metaTitle: 'Praxisinfo & Honorar — Psychotherapie in Ingolstadt',
    metaDescription: 'Erstgespräch unverbindlich und kostenfrei. Psychotherapie 90 € pro Stunde, Paartherapie 120 € — Abrechnung nach GebüH, Unterstützung bei der Antragstellung.',
  },
  sections: [
    {
      type: 'editorialHero',
      data: {
        eyebrow: 'Praxisinfo & Honorar',
        headline: 'Transparent und persönlich.',
        text: '<p>Im persönlichen, vertraulichen Gespräch behandeln wir Ihre ganz individuellen Themen. Ich erarbeite mit Ihnen ein auf Sie zugeschnittenes Programm und begleite Sie mit meinen eigenen Erfahrungen.</p>',
        imagePrimary: IMG.estela52,
        primaryCta: { label: 'Erstgespräch vereinbaren', href: '/kontakt' },
        hint: 'Termine nach Vereinbarung in meiner Praxis in Ingolstadt — auch online.',
      },
    },
    {
      type: 'comparisonCardsPro',
      data: {
        badge: 'Honorar',
        headline: 'Klare Konditionen.',
        subline: 'Meditation, Psychotherapie und Coaching finden in Einzelsitzungen statt. Die Anzahl der Sitzungen ergibt sich aus Ihrer persönlichen Situation und wird nach dem Erstgespräch gemeinsam festgelegt.',
        plans: [
          {
            name: 'Erstgespräch',
            price: 'kostenfrei',
            note: 'unverbindlich',
            features: [
              'Persönliches Kennenlernen',
              'Ihre Situation und Ihre Ziele',
              'Gemeinsame Wahl der Vorgehensweise',
            ],
            ctaLabel: 'Termin anfragen',
            ctaHref: '/kontakt',
          },
          {
            name: 'Psychotherapie',
            price: '90 €',
            note: 'pro Stunde (60 Minuten)',
            highlighted: true,
            features: [
              'Einzelsitzung in der Praxis oder online',
              'Abrechnung nach Gebührenordnung (GebüH)',
              'Verlängerung anteilig in 15-Minuten-Schritten',
            ],
            ctaLabel: 'Termin anfragen',
            ctaHref: '/kontakt',
          },
          {
            name: 'Paartherapie',
            price: '120 €',
            note: 'pro Stunde (60 Minuten)',
            features: [
              'Einzel- und Paargespräche',
              'Ergänzt um taoistische Elemente',
              'Neue Werkzeuge für alle Lebenslagen',
            ],
            ctaLabel: 'Termin anfragen',
            ctaHref: '/kontakt',
          },
        ],
      },
    },
    {
      type: 'richText',
      data: {
        content: '<h2>Gut zu wissen</h2>\n<p>Ich arbeite mit Privatpatienten bzw. privaten Klienten — das heißt, Sie übernehmen die Kosten selbst. Als Heilpraktikerin für Psychotherapie rechne ich nach der Gebührenordnung (GebüH) ab.</p>\n<ul>\n<li>Private Kassen oder Beihilfestellen erstatten ganz oder teilweise. Erkundigen Sie sich bitte vor Behandlungsbeginn bei Ihrer Krankenversicherung, ob und in welchem Umfang Kosten übernommen werden — bei der Antragstellung unterstütze ich Sie gerne.</li>\n<li>Mitglieder gesetzlicher Krankenkassen ohne Zusatzversicherung übernehmen die Kosten von Heilpraktikern meist selbst.</li>\n<li>Das Honorar ist in bar fällig, in Ausnahmefällen auch auf Rechnung oder per Online-Überweisung.</li>\n<li>Terminabsprachen sind verbindlich: Termine, die nicht spätestens 24 Stunden vorher abgesagt werden, müssen voll berechnet werden.</li>\n</ul>',
      },
    },
    CTA_BAND,
  ],
};

const kontakt = {
  slug: 'kontakt',
  title: 'Kontakt',
  seo: {
    metaTitle: 'Kontakt — Praxis Estela Fuchs, Ingolstadt',
    metaDescription: 'Praxis für Psychotherapie, Bei der Schleifmühle 34b, 85049 Ingolstadt. Telefon +49 151 15539416 — Termine nach Vereinbarung, Sitzungen auch online möglich.',
  },
  sections: [
    {
      type: 'editorialHero',
      data: {
        eyebrow: 'Kontakt',
        headline: 'Schreiben Sie mir.',
        text: `<p>Ob Frage, Terminwunsch oder einfach ein erstes Kennenlernen — ich freue mich auf Ihre Nachricht. Sie finden meine Praxis <strong>${ADDRESS.split(',')[0]}</strong> in Ingolstadt, beim Tao Yin Zentrum.</p>`,
        imagePrimary: IMG.room,
        imageSecondary: IMG.estela3,
        primaryCta: { label: 'Jetzt anrufen', href: PHONE_HREF },
        secondaryCta: { label: 'E-Mail schreiben', href: `mailto:${EMAIL}` },
        hint: 'Termine nach Vereinbarung — Kurse und Sitzungen auch online möglich.',
      },
    },
    {
      type: 'contact',
      data: {
        badgeText: 'Kontakt',
        headline: 'So erreichen Sie mich',
        subline: `Telefonisch unter ${PHONE} — oder über das Formular.`,
        introText: `<p>Anfragen zur Psychotherapie-Praxis senden Sie an <strong>${EMAIL}</strong>. Ich melde mich so schnell wie möglich zurück.</p>`,
        email: EMAIL,
        phone: PHONE,
        address: ADDRESS,
        formEnabled: true,
        submitLabel: 'Nachricht senden',
      },
    },
    {
      type: 'map',
      data: {
        headline: 'So finden Sie die Praxis',
        address: ADDRESS,
        embedUrl: 'https://www.google.com/maps?q=Bei%20der%20Schleifm%C3%BChle%2034b%2C%2085049%20Ingolstadt&output=embed',
      },
    },
  ],
};

const anfahrt = {
  slug: 'anfahrt',
  title: 'Anfahrt',
  seo: {
    metaTitle: 'Anfahrt — Praxis Estela Fuchs, Bei der Schleifmühle 34b',
    metaDescription: 'Die Praxis liegt im Stadtzentrum von Ingolstadt beim Tao Yin Zentrum, wenige Meter vom Restaurant Ölbaum. Günstig parken am Parkplatz Freibad.',
  },
  sections: [
    {
      type: 'editorialHero',
      data: {
        eyebrow: 'Anfahrt',
        headline: 'Mitten in Ingolstadt.',
        text: `<p>Meine Praxis befindet sich im Stadtzentrum von Ingolstadt und ist zu Fuß sehr gut zu erreichen. Als Orientierung können Sie das Restaurant Ölbaum nehmen — die Praxis finden Sie nur ein paar Meter weiter, beim Tao Yin Zentrum.</p>`,
        imagePrimary: IMG.estela58,
        primaryCta: { label: 'Termin vereinbaren', href: '/kontakt' },
        hint: 'Beste und günstigste Parkgelegenheit: Parkplatz am Freibad.',
      },
    },
    {
      type: 'map',
      data: {
        headline: 'Anfahrt & Parkmöglichkeiten',
        address: ADDRESS,
        embedUrl: 'https://www.google.com/maps?q=Bei%20der%20Schleifm%C3%BChle%2034b%2C%2085049%20Ingolstadt&output=embed',
      },
    },
    CTA_BAND,
  ],
};

// Impressum um die Berufshaftpflicht aus dem Original ergänzen.
const impressumSections = legal.impressum.map((s) => {
  if (s.type !== 'legalContent') return s;
  const blocks = [...s.data.blocks];
  if (!blocks.some((b) => /Berufshaftpflicht/i.test(b.headline || ''))) {
    blocks.push({
      headline: 'Berufshaftpflichtversicherung',
      text: '<p>Es besteht eine Berufshaftpflichtversicherung bei der Continentale-Versicherung.</p>',
    });
  }
  return { ...s, data: { ...s.data, blocks } };
});

const impressum = {
  slug: 'impressum',
  title: 'Impressum',
  seo: { metaTitle: 'Impressum — Praxis Estela Fuchs', metaDescription: 'Impressum der Praxis für Psychotherapie Estela Fuchs, Ingolstadt — Angaben gemäß § 5 TMG.' },
  sections: impressumSections,
};

const datenschutz = {
  slug: 'datenschutz',
  title: 'Datenschutz',
  seo: { metaTitle: 'Datenschutz — Praxis Estela Fuchs', metaDescription: 'Datenschutzhinweise der Praxis für Psychotherapie Estela Fuchs, Ingolstadt.' },
  sections: legal.datenschutz,
};

module.exports = {
  slug: 'estela-fuchs',
  host: 'flamingo-estela-fuchs.vercel.app',
  wipe: true,
  seoGlobal: {
    titleTemplate: '%s | Estela Fuchs Ingolstadt',
    defaultTitle: 'Estela Fuchs — Heilpraktikerin für Psychotherapie Ingolstadt',
    defaultDescription: 'Praxis für ganzheitliche Psychotherapie in Ingolstadt: Verhaltenstherapie, Entspannungsverfahren, Meditation und körperorientierte Methoden. Termine auch online.',
    defaultOgImage: IMG.estela3,
    locale: 'de_DE',
  },
  navigation: {
    items: [
      { label: 'Ihr Ziel', href: '/ihr-ziel' },
      { label: 'Therapien', href: '/therapien' },
      { label: 'Behandlung', href: '/behandlung' },
      { label: 'Praxisinfo & Honorar', href: '/praxisinfo-honorar' },
      { label: 'Über mich', href: '/ueber-mich' },
    ],
    ctaLabel: 'Kontakt',
    ctaHref: '/kontakt',
  },
  footer: {
    columns: [
      { title: 'Praxis', items: [
        { text: 'Ihr Ziel', href: '/ihr-ziel' },
        { text: 'Therapien', href: '/therapien' },
        { text: 'Behandlung', href: '/behandlung' },
        { text: 'Praxisinfo & Honorar', href: '/praxisinfo-honorar' } ] },
      { title: 'Service', items: [
        { text: 'Über mich', href: '/ueber-mich' },
        { text: 'Kontakt', href: '/kontakt' },
        { text: 'Anfahrt', href: '/anfahrt' },
        { text: 'Tao Yin Zentrum Ingolstadt', href: 'https://www.taoyin-zentrum.com' } ] },
      { title: 'Kontakt', items: [
        { text: ADDRESS },
        { text: PHONE },
        { text: EMAIL },
        { text: 'Termine nach Vereinbarung — auch online' } ] },
    ],
    legalLinks: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
  },
  pages: [startseite, ihrZiel, therapien, behandlung, ueberMich, praxisinfo, kontakt, anfahrt, impressum, datenschutz],
  publish: true,
};
