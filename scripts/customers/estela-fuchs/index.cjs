// Estela Fuchs — Praxis für ganzheitliche Psychotherapie, Ingolstadt.
// Dreisprachig DE/EN/ES. Texte aus dem Web Archive (Snapshots 2025/2026) des
// Originals www.estela-fuchs.com; Standalone-Projekt flamingo-estela-fuchs.vercel.app.
//
// Speicherkonvention (wie Taoyin): lokalisierbare Section-Daten als
// { _localized: true, de:{…}, en:{…}, es:{…} }. flatten() legt zusätzlich die
// de-Felder FLACH auf das Objekt (Validatoren + locale-loser Render-Pfad lesen flach).

// ─── flatten: de-Felder flach + de/en/es-Kopien ──────────────────────────────
function flatten(node) {
  if (Array.isArray(node)) return node.map(flatten);
  if (node && typeof node === 'object') {
    if (node._localized && node.de) {
      return {
        ...flatten(node.de),
        _localized: true,
        de: flatten(node.de),
        en: flatten(node.en || node.de),
        es: flatten(node.es || node.de),
      };
    }
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, flatten(v)]));
  }
  return node;
}

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
const EMAIL = 'estelafuchs@hotmail.com';
const ADDRESS = 'Bei der Schleifmühle 34b, 85049 Ingolstadt';
const MAP_URL = 'https://www.google.com/maps?q=Bei%20der%20Schleifm%C3%BChle%2034b%2C%2085049%20Ingolstadt&output=embed';

// Gemeinsamer Abschluss (dreisprachig).
const CTA_BAND = {
  type: 'immersiveCtaBanner',
  data: {
    _localized: true,
    de: {
      badge: 'Kontakt',
      headline: 'Der erste Schritt beginnt mit einem Gespräch.',
      subline: 'Das Erstgespräch ist unverbindlich und kostenfrei. Lernen Sie die Kraft der Integration von Körper, Geist und Seele für sich zu nutzen.',
      image: IMG.room, overlay: 'rgba(38,48,66,0.62)',
      primaryCta: { label: `Telefon: ${PHONE}`, href: PHONE_HREF },
      secondaryCta: { label: 'E-Mail schreiben', href: `mailto:${EMAIL}` },
    },
    en: {
      badge: 'Contact',
      headline: 'The first step begins with a conversation.',
      subline: 'The initial consultation is free and without obligation. Learn to use the power of integrating body, mind and soul for yourself.',
      image: IMG.room, overlay: 'rgba(38,48,66,0.62)',
      primaryCta: { label: `Phone: ${PHONE}`, href: PHONE_HREF },
      secondaryCta: { label: 'Write an email', href: `mailto:${EMAIL}` },
    },
    es: {
      badge: 'Contacto',
      headline: 'El primer paso empieza con una conversación.',
      subline: 'La primera consulta es gratuita y sin compromiso. Aprende a usar la fuerza de la integración de cuerpo, mente y alma para ti.',
      image: IMG.room, overlay: 'rgba(38,48,66,0.62)',
      primaryCta: { label: `Teléfono: ${PHONE}`, href: PHONE_HREF },
      secondaryCta: { label: 'Escribir un correo', href: `mailto:${EMAIL}` },
    },
  },
};

const startseite = {
  slug: 'startseite',
  title: 'Startseite',
  seo: {
    metaTitle: 'Praxis für ganzheitliche Psychotherapie',
    metaDescription: 'Ganzheitliche Psychotherapie in Ingolstadt: Verhaltenstherapie und Entspannungsverfahren, ergänzt um Meditation, Qigong, Tai Chi und Ernährung nach den 5 Elementen.',
  },
  sections: [
    {
      type: 'editorialHero',
      data: {
        _localized: true,
        de: {
          eyebrow: 'Praxis für ganzheitliche Psychotherapie',
          headline: 'Herzlich willkommen in meiner Praxis.',
          text: '<p>Ich arbeite mit klassischen Verfahren wie Entspannungstechniken und Verhaltenstherapie sowie mit alternativen Methoden aus den Bereichen der Meditation, des Qigong, des Tai Chi und der Ernährung nach den 5 Elementen.</p>',
          imagePrimary: IMG.estela3, imageSecondary: IMG.room,
          primaryCta: { label: 'Erstgespräch vereinbaren', href: '/kontakt' },
          secondaryCta: { label: 'Therapien entdecken', href: '/therapien' },
          hint: 'Heilpraktikerin für Psychotherapie · Kurse und Sitzungen auch online möglich',
        },
        en: {
          eyebrow: 'Practice for holistic psychotherapy',
          headline: 'A warm welcome to my practice.',
          text: '<p>I work with classical methods such as relaxation techniques and behavioural therapy, as well as with alternative approaches from the fields of meditation, Qigong, Tai Chi and nutrition according to the Five Elements.</p>',
          imagePrimary: IMG.estela3, imageSecondary: IMG.room,
          primaryCta: { label: 'Arrange a first consultation', href: '/kontakt' },
          secondaryCta: { label: 'Discover therapies', href: '/therapien' },
          hint: 'Non-medical practitioner for psychotherapy · courses and sessions also available online',
        },
        es: {
          eyebrow: 'Consulta de psicoterapia holística',
          headline: 'Bienvenida y bienvenido a mi consulta.',
          text: '<p>Trabajo con métodos clásicos como técnicas de relajación y terapia conductual, así como con enfoques alternativos de la meditación, el Qigong, el Tai Chi y la nutrición según los cinco elementos.</p>',
          imagePrimary: IMG.estela3, imageSecondary: IMG.room,
          primaryCta: { label: 'Reservar una primera consulta', href: '/kontakt' },
          secondaryCta: { label: 'Descubrir terapias', href: '/therapien' },
          hint: 'Terapeuta de psicoterapia · cursos y sesiones también en línea',
        },
      },
    },
    {
      type: 'principlesGrid',
      data: {
        _localized: true,
        de: {
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
        en: {
          badge: 'How I can support you',
          headline: 'I am glad to advise and support you.',
          subline: 'Sometimes what is needed is a protected space and a clear view from the outside. These are the themes I most often accompany in my practice:',
          principles: [
            { eyebrow: '01', title: 'Stress', text: 'With stress and stress-related complaints — before tension becomes a permanent state.' },
            { eyebrow: '02', title: 'Burnout & depression', text: 'With burnout or depression: gently building strength and finding solid ground again.' },
            { eyebrow: '03', title: 'Sleep & exhaustion', text: 'With sleep disorders or lasting exhaustion, when recovery no longer comes on its own.' },
            { eyebrow: '04', title: 'Pain', text: 'With pain of all kinds — using methods that address body and mind together.' },
            { eyebrow: '05', title: 'Psychosomatics', text: 'With psychosomatic complaints, even when the doctor cannot name a diagnosis.' },
            { eyebrow: '06', title: 'Crises & decisions', text: 'At crossroads and in life crises: finding orientation and making sustainable decisions.' },
          ],
          cta: { label: 'Learn about the treatment', href: '/behandlung' },
        },
        es: {
          badge: 'En qué puedo apoyarte',
          headline: 'Con gusto te asesoro y acompaño.',
          subline: 'A veces hace falta un espacio protegido y una mirada clara desde fuera. Estos son los temas que acompaño con más frecuencia en mi consulta:',
          principles: [
            { eyebrow: '01', title: 'Estrés', text: 'Ante el estrés y las molestias relacionadas — antes de que la tensión se vuelva permanente.' },
            { eyebrow: '02', title: 'Burnout y depresión', text: 'Ante el burnout o la depresión: recuperar fuerzas con suavidad y volver a pisar firme.' },
            { eyebrow: '03', title: 'Sueño y agotamiento', text: 'Ante trastornos del sueño o agotamiento persistente, cuando el descanso ya no llega solo.' },
            { eyebrow: '04', title: 'Dolores', text: 'Ante dolores de todo tipo — con métodos que abordan cuerpo y mente a la vez.' },
            { eyebrow: '05', title: 'Psicosomática', text: 'Ante molestias psicosomáticas, aun cuando el médico no encuentra un diagnóstico.' },
            { eyebrow: '06', title: 'Crisis y decisiones', text: 'En encrucijadas y crisis vitales: encontrar orientación y tomar decisiones sólidas.' },
          ],
          cta: { label: 'Conocer el tratamiento', href: '/behandlung' },
        },
      },
    },
    {
      type: 'zigzagShowcase',
      data: {
        _localized: true,
        de: {
          rows: [
            { eyebrow: 'Ihr Ziel', headline: 'Orientierung, Stabilisierung, Unterstützung.', text: '<p>Sie stehen an einem Scheideweg, befinden sich in einer Krise oder leiden unter Symptomen, die Sie sich nicht erklären können? Gemeinsam finden wir heraus, was Sie gerade wirklich brauchen.</p>', image: IMG.estela52, imageAlt: 'Gespräch in der Praxis', links: [{ label: 'Ihr Ziel entdecken', href: '/ihr-ziel' }] },
            { eyebrow: 'Therapien', headline: 'Klassisch fundiert, achtsam ergänzt.', text: '<p>Von kognitiver Verhaltenstherapie über Autogenes Training und Progressive Muskelentspannung bis zu Meditation, Massage und den Tao-Praktiken — die Methode folgt Ihrem Bedürfnis, nicht umgekehrt.</p>', image: IMG.estela33, imageAlt: 'Meditation und Entspannungsverfahren', links: [{ label: 'Alle Therapien ansehen', href: '/therapien' }] },
            { eyebrow: 'Behandlung', headline: 'Vom Kennenlernen zur Veränderung.', text: '<p>Das erste Gespräch ist unverbindlich und kostenfrei. Danach gehen wir in Einzelsitzungen Schritt für Schritt auf Ihre Themen ein — auf Wunsch auch körperorientiert nach den Leitlinien des Universal Healing Tao.</p>', image: IMG.estela26, imageAlt: 'Körperorientierte Psychotherapie', links: [{ label: 'Ablauf der Behandlung', href: '/behandlung' }, { label: 'Praxisinfo & Honorar', href: '/praxisinfo-honorar' }] },
          ],
        },
        en: {
          rows: [
            { eyebrow: 'Your goal', headline: 'Orientation, stabilisation, support.', text: '<p>Are you standing at a crossroads, going through a crisis or suffering from symptoms you cannot explain? Together we find out what you really need right now.</p>', image: IMG.estela52, imageAlt: 'Conversation in the practice', links: [{ label: 'Discover your goal', href: '/ihr-ziel' }] },
            { eyebrow: 'Therapies', headline: 'Classically grounded, mindfully extended.', text: '<p>From cognitive behavioural therapy through autogenic training and progressive muscle relaxation to meditation, massage and the Tao practices — the method follows your need, not the other way around.</p>', image: IMG.estela33, imageAlt: 'Meditation and relaxation techniques', links: [{ label: 'See all therapies', href: '/therapien' }] },
            { eyebrow: 'Treatment', headline: 'From getting to know each other to change.', text: '<p>The first conversation is free and without obligation. After that we address your themes step by step in individual sessions — on request also body-oriented according to the guidelines of the Universal Healing Tao.</p>', image: IMG.estela26, imageAlt: 'Body-oriented psychotherapy', links: [{ label: 'How the treatment works', href: '/behandlung' }, { label: 'Practice info & fees', href: '/praxisinfo-honorar' }] },
          ],
        },
        es: {
          rows: [
            { eyebrow: 'Tu objetivo', headline: 'Orientación, estabilización, apoyo.', text: '<p>¿Estás en una encrucijada, atraviesas una crisis o sufres síntomas que no logras explicar? Juntos descubrimos qué necesitas realmente en este momento.</p>', image: IMG.estela52, imageAlt: 'Conversación en la consulta', links: [{ label: 'Descubrir tu objetivo', href: '/ihr-ziel' }] },
            { eyebrow: 'Terapias', headline: 'Con base clásica, complementada con atención plena.', text: '<p>Desde la terapia cognitivo-conductual, el entrenamiento autógeno y la relajación muscular progresiva hasta la meditación, el masaje y las prácticas taoístas — el método sigue tu necesidad, y no al revés.</p>', image: IMG.estela33, imageAlt: 'Meditación y técnicas de relajación', links: [{ label: 'Ver todas las terapias', href: '/therapien' }] },
            { eyebrow: 'Tratamiento', headline: 'Del primer encuentro al cambio.', text: '<p>La primera conversación es gratuita y sin compromiso. Después abordamos tus temas paso a paso en sesiones individuales — si lo deseas, también con enfoque corporal según las directrices del Universal Healing Tao.</p>', image: IMG.estela26, imageAlt: 'Psicoterapia con enfoque corporal', links: [{ label: 'Cómo es el tratamiento', href: '/behandlung' }, { label: 'Información y honorarios', href: '/praxisinfo-honorar' }] },
          ],
        },
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
        _localized: true,
        de: { eyebrow: 'Ihr Ziel', headline: 'Was darf sich für Sie verändern?', text: '<p>Jeder Weg in die Praxis beginnt mit einer eigenen Geschichte. Vielleicht erkennen Sie sich in einer dieser drei Situationen wieder.</p>', imagePrimary: IMG.estela43, primaryCta: { label: 'Gespräch vereinbaren', href: '/kontakt' }, hint: 'Das Erstgespräch ist unverbindlich und kostenfrei.' },
        en: { eyebrow: 'Your goal', headline: 'What may change for you?', text: '<p>Every path into the practice begins with its own story. Perhaps you recognise yourself in one of these three situations.</p>', imagePrimary: IMG.estela43, primaryCta: { label: 'Arrange a conversation', href: '/kontakt' }, hint: 'The initial consultation is free and without obligation.' },
        es: { eyebrow: 'Tu objetivo', headline: '¿Qué puede cambiar para ti?', text: '<p>Cada camino hacia la consulta comienza con su propia historia. Quizá te reconozcas en una de estas tres situaciones.</p>', imagePrimary: IMG.estela43, primaryCta: { label: 'Reservar una conversación', href: '/kontakt' }, hint: 'La primera consulta es gratuita y sin compromiso.' },
      },
    },
    {
      type: 'zigzagShowcase',
      data: {
        _localized: true,
        de: {
          startRight: true,
          rows: [
            { eyebrow: 'Orientierung', headline: 'Wenn wichtige Entscheidungen anstehen.', text: '<p>Sie stehen an einem Scheideweg? Wichtige Entscheidungen liegen vor Ihnen? Sie suchen nach Halt und Orientierung — nach innerer Ruhe und Sicherheit, ohne von externen Faktoren getrieben und beeinflusst zu werden? Sie suchen Distanz vom täglichen Alltag und sind auf der Suche nach Ihrem inneren Selbst?</p>', image: IMG.estela52, imageAlt: 'Orientierung finden' },
            { eyebrow: 'Stabilisierung', headline: 'Wenn das Leben aus dem Gleichgewicht gerät.', text: '<p>Sie befinden sich in einer Krise? Ihr Leben hat sich in beabsichtigter oder unbeabsichtigter Weise verändert und Sie fühlen sich überfordert? Sie finden keine Erholung und sehen wenig Alternativen? Sie fühlen sich krank oder schwach, obwohl der Arzt Ihnen keinen Befund nennen kann?</p>', image: IMG.estela33, imageAlt: 'Stabilität zurückgewinnen' },
            { eyebrow: 'Unterstützung', headline: 'Wenn Sie einen Ansprechpartner suchen.', text: '<p>Sie fühlen sich unwohl, leiden unter psychischen oder körperlichen Symptomen und machen sich Gedanken dazu? Sie suchen eine Heilpraktikerin für Psychotherapie als Ansprechpartnerin und Beraterin — und nach konkreten psychotherapeutischen Behandlungsmöglichkeiten?</p>', image: IMG.estela59, imageAlt: 'Psychotherapeutische Unterstützung' },
          ],
        },
        en: {
          startRight: true,
          rows: [
            { eyebrow: 'Orientation', headline: 'When important decisions are ahead.', text: '<p>Are you at a crossroads? Important decisions lie ahead of you? You are looking for support and orientation — for inner calm and security, without being driven and influenced by external factors? You seek distance from everyday life and are searching for your inner self?</p>', image: IMG.estela52, imageAlt: 'Finding orientation' },
            { eyebrow: 'Stabilisation', headline: 'When life loses its balance.', text: '<p>Are you in a crisis? Your life has changed, intentionally or not, and you feel overwhelmed? You find no rest and see few alternatives? You feel ill or weak even though the doctor cannot give you a diagnosis?</p>', image: IMG.estela33, imageAlt: 'Regaining stability' },
            { eyebrow: 'Support', headline: 'When you are looking for someone to turn to.', text: '<p>You feel unwell, suffer from psychological or physical symptoms and worry about them? You are looking for a non-medical psychotherapist as a contact and advisor — and for concrete psychotherapeutic treatment options?</p>', image: IMG.estela59, imageAlt: 'Psychotherapeutic support' },
          ],
        },
        es: {
          startRight: true,
          rows: [
            { eyebrow: 'Orientación', headline: 'Cuando hay decisiones importantes por delante.', text: '<p>¿Estás en una encrucijada? ¿Tienes decisiones importantes por delante? ¿Buscas sostén y orientación — calma interior y seguridad, sin dejarte llevar por factores externos? ¿Buscas distancia de la rutina diaria y estás en busca de tu ser interior?</p>', image: IMG.estela52, imageAlt: 'Encontrar orientación' },
            { eyebrow: 'Estabilización', headline: 'Cuando la vida pierde el equilibrio.', text: '<p>¿Atraviesas una crisis? ¿Tu vida ha cambiado, de forma buscada o no, y te sientes sobrepasada? ¿No encuentras descanso y ves pocas alternativas? ¿Te sientes enferma o débil aunque el médico no te da un diagnóstico?</p>', image: IMG.estela33, imageAlt: 'Recuperar la estabilidad' },
            { eyebrow: 'Apoyo', headline: 'Cuando buscas a alguien de confianza.', text: '<p>¿Te sientes mal, sufres síntomas psíquicos o físicos y les das vueltas? ¿Buscas una terapeuta de psicoterapia como interlocutora y guía — y opciones concretas de tratamiento psicoterapéutico?</p>', image: IMG.estela59, imageAlt: 'Apoyo psicoterapéutico' },
          ],
        },
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
        _localized: true,
        de: { eyebrow: 'Therapien', headline: 'Die Methode folgt Ihrem Bedürfnis.', text: '<p>Ich verbinde anerkannte psychotherapeutische Verfahren mit bewährten Entspannungstechniken und den taoistischen Praktiken. Was davon zum Einsatz kommt, entscheiden wir gemeinsam.</p>', imagePrimary: IMG.estela33, imageSecondary: IMG.estela43, primaryCta: { label: 'Beratung anfragen', href: '/kontakt' }, secondaryCta: { label: 'Ablauf ansehen', href: '/behandlung' } },
        en: { eyebrow: 'Therapies', headline: 'The method follows your need.', text: '<p>I combine recognised psychotherapeutic methods with proven relaxation techniques and the Taoist practices. Which of them we use, we decide together.</p>', imagePrimary: IMG.estela33, imageSecondary: IMG.estela43, primaryCta: { label: 'Request a consultation', href: '/kontakt' }, secondaryCta: { label: 'See how it works', href: '/behandlung' } },
        es: { eyebrow: 'Terapias', headline: 'El método sigue tu necesidad.', text: '<p>Combino métodos psicoterapéuticos reconocidos con técnicas de relajación acreditadas y las prácticas taoístas. Cuáles usamos, lo decidimos juntos.</p>', imagePrimary: IMG.estela33, imageSecondary: IMG.estela43, primaryCta: { label: 'Solicitar una consulta', href: '/kontakt' }, secondaryCta: { label: 'Ver cómo funciona', href: '/behandlung' } },
      },
    },
    {
      type: 'principlesGrid',
      data: {
        _localized: true,
        de: {
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
        en: {
          badge: 'Overview',
          headline: 'Eight ways, one goal.',
          subline: 'Behavioural therapy and relaxation methods — on their own or combined, always tailored to your situation.',
          principles: [
            { eyebrow: 'Relaxation', title: 'Autogenic training', text: 'A legally recognised relaxation method based on autosuggestion, after J. H. Schultz.' },
            { eyebrow: 'Behavioural therapy', title: 'Cognitive behavioural therapy', text: 'How we think shapes how we feel and act — recognising, examining and changing attitudes.' },
            { eyebrow: 'Bodywork', title: 'Massage', text: 'Works through the body on the whole organism — relaxing, pain-relieving, stress-reducing.' },
            { eyebrow: 'Mindfulness', title: 'Meditation', text: 'Calming and gathering the mind — with proven effects on body and psyche.' },
            { eyebrow: 'Relationship', title: 'Couples therapy', text: 'One step forward together — in individual and couples sessions, enriched with Taoist elements.' },
            { eyebrow: 'Relaxation', title: 'Progressive muscle relaxation', text: 'Deep relaxation through conscious tensing and releasing of the muscles, after Edmund Jacobson.' },
            { eyebrow: 'Dialogue', title: 'Socratic dialogue', text: 'Critical questioning as a technique — making patterns of thought visible, understandable and changeable.' },
            { eyebrow: 'Tao practices', title: 'Yoga, Qigong & Tai Chi', text: 'Working on body structure and body awareness — for a new, accepting sense of self.' },
          ],
        },
        es: {
          badge: 'Resumen',
          headline: 'Ocho caminos, un objetivo.',
          subline: 'Terapia conductual y métodos de relajación — solos o combinados, siempre adaptados a tu situación.',
          principles: [
            { eyebrow: 'Relajación', title: 'Entrenamiento autógeno', text: 'Método de relajación basado en la autosugestión y reconocido legalmente, según J. H. Schultz.' },
            { eyebrow: 'Terapia conductual', title: 'Terapia cognitivo-conductual', text: 'Cómo pensamos determina cómo sentimos y actuamos — reconocer, revisar y cambiar actitudes.' },
            { eyebrow: 'Trabajo corporal', title: 'Masaje', text: 'Actúa a través del cuerpo sobre todo el organismo — relaja, alivia el dolor y reduce el estrés.' },
            { eyebrow: 'Atención plena', title: 'Meditación', text: 'Calmar y recoger la mente — con efectos demostrados sobre el cuerpo y la psique.' },
            { eyebrow: 'Relación', title: 'Terapia de pareja', text: 'Un paso adelante juntos — en sesiones individuales y de pareja, con elementos taoístas.' },
            { eyebrow: 'Relajación', title: 'Relajación muscular progresiva', text: 'Relajación profunda tensando y soltando los músculos de forma consciente, según Edmund Jacobson.' },
            { eyebrow: 'Diálogo', title: 'Diálogo socrático', text: 'El cuestionamiento crítico como técnica — hacer visibles, comprensibles y cambiables los patrones de pensamiento.' },
            { eyebrow: 'Prácticas Tao', title: 'Yoga, Qigong y Tai Chi', text: 'Trabajo sobre la estructura y la percepción corporal — para un nuevo sentido de sí más receptivo.' },
          ],
        },
      },
    },
    {
      type: 'faq',
      data: {
        _localized: true,
        de: {
          badgeText: 'Im Detail',
          headline: 'Die Therapien im Detail',
          expandFirst: true,
          items: [
            { question: 'Autogenes Training', answer: '<p>Autogenes Training ist ein auf Autosuggestion basierendes Entspannungsverfahren. Es wurde vom Berliner Psychiater Johannes Heinrich Schultz aus der Hypnose entwickelt, 1926 erstmals vorgestellt und 1932 in seinem Buch „Das autogene Training" publiziert. Heute ist das autogene Training eine weit verbreitete und — beispielsweise in Deutschland und Österreich sogar gesetzlich — anerkannte Psychotherapiemethode.</p>' },
            { question: 'Kognitive Verhaltenstherapie', answer: '<p>Im Mittelpunkt der kognitiven Therapieverfahren stehen Kognitionen: Einstellungen, Gedanken, Bewertungen und Überzeugungen. Sie gehen davon aus, dass die Art und Weise, wie wir denken, bestimmt, wie wir uns fühlen, verhalten und körperlich reagieren. Schwerpunkte der Therapie sind:</p><ul><li>die Bewusstmachung von Kognitionen,</li><li>die Überprüfung von Kognitionen und Schlussfolgerungen auf ihre Angemessenheit,</li><li>die Korrektur von irrationalen Einstellungen,</li><li>der Transfer der korrigierten Einstellungen ins konkrete Verhalten.</li></ul>' },
            { question: 'Massage', answer: '<p>Die Massage dient der mechanischen Beeinflussung von Haut, Bindegewebe und Muskulatur durch Dehnungs-, Zug- und Druckreiz. Ihre Wirkung erstreckt sich von der behandelten Stelle über den gesamten Organismus und schließt die Psyche mit ein:</p><ul><li>Lokale Steigerung der Durchblutung, Senkung von Blutdruck und Pulsfrequenz</li><li>Entspannung der Muskulatur, Lösen von Verklebungen und Narben</li><li>Schmerzlinderung und Einwirken auf innere Organe über Reflexbögen</li><li>Psychische Entspannung, Reduktion von Stress</li></ul>' },
            { question: 'Meditation', answer: '<p>Meditation ist eine in vielen Kulturen ausgeübte spirituelle Praxis. Durch Achtsamkeits- oder Konzentrationsübungen soll sich der Geist beruhigen und sammeln. Studien belegen positive Effekte in vielen Bereichen:</p><ul><li><strong>Physisch:</strong> Reduzierung von Bluthochdruck, vertiefte Atmung, weniger Muskelspannung, Stärkung des Immunsystems</li><li><strong>Psychisch:</strong> Reduzierung von Angstzuständen, bessere Erholung bei Burnout und Depression, weniger Schlafstörungen</li><li><strong>Verhalten:</strong> Unterstützung bei Verhaltensänderungen, besserer Umgang mit Sucht und Essstörungen</li></ul>' },
            { question: 'Paartherapie', answer: '<p>Gemeinsam einen Schritt vorwärts machen — in Einzel- und Paargesprächen, ergänzt mit Elementen der taoistischen Traditionen in Meditation, Yoga und Qigong, verfolgen wir folgende Ziele:</p><ul><li>Beziehungsprobleme verstehen und herausfinden, wie Ihre Liebesbeziehung funktionieren kann</li><li>Sich selbst und den Partner besser erkennen und verstehen</li><li>Neue Werkzeuge in die Hand bekommen, die in allen Lebenslagen nützlich sind</li></ul>' },
            { question: 'Progressive Muskelentspannung nach Jacobson', answer: '<p>Bei der progressiven Muskelentspannung nach Edmund Jacobson wird durch die willentliche und bewusste An- und Entspannung bestimmter Muskelgruppen ein Zustand tiefer Entspannung des ganzen Körpers erreicht. Ziel ist eine Senkung der Muskelspannung unter das normale Niveau durch verbesserte Körperwahrnehmung. Mit der Zeit lernen Sie, muskuläre Entspannung herbeizuführen, wann immer Sie dies möchten.</p>' },
            { question: 'Sokratischer Dialog', answer: '<p>Der Sokratische Dialog ist eine Fragetechnik, derer sich Therapeuten bedienen, wenn es im therapeutisch-beratenden Gespräch um Begriffsklärung und Entscheidungsfindung geht. Es ist ein Prozess des kritischen Hinterfragens von Argumenten: Strukturen und Verhaltensmuster werden sichtbar, das eigene Denken und Handeln verstehbar — und damit auch veränderbar.</p>' },
            { question: 'Yoga, Qigong & Tai Chi', answer: '<p>Yoga, Qigong und Tai Chi sind Techniken, die an der Körperstruktur und an der Körperwahrnehmung arbeiten. In Verbindung mit Meditation und Massage führen diese Praktiken zu einem neuen Selbstbewusstsein, einer positiveren und annehmenderen Haltung zu sich selbst und zum eigenen Körper.</p>' },
          ],
        },
        en: {
          badgeText: 'In detail',
          headline: 'The therapies in detail',
          expandFirst: true,
          items: [
            { question: 'Autogenic training', answer: '<p>Autogenic training is a relaxation method based on autosuggestion. It was developed from hypnosis by the Berlin psychiatrist Johannes Heinrich Schultz, first presented in 1926 and published in 1932 in his book "Autogenic Training". Today it is a widely used and — in Germany and Austria even legally — recognised psychotherapy method.</p>' },
            { question: 'Cognitive behavioural therapy', answer: '<p>At the centre of cognitive therapy are cognitions: attitudes, thoughts, evaluations and convictions. It assumes that the way we think determines how we feel, behave and react physically. The focus of the therapy is on:</p><ul><li>becoming aware of cognitions,</li><li>examining cognitions and conclusions for their appropriateness,</li><li>correcting irrational attitudes,</li><li>transferring the corrected attitudes into concrete behaviour.</li></ul>' },
            { question: 'Massage', answer: '<p>Massage works mechanically on skin, connective tissue and muscles through stretching, pulling and pressure. Its effect extends from the treated area over the whole organism and includes the psyche:</p><ul><li>Local increase in circulation, lowering of blood pressure and pulse</li><li>Relaxation of the muscles, releasing adhesions and scars</li><li>Pain relief and effects on internal organs via reflex arcs</li><li>Psychological relaxation, reduction of stress</li></ul>' },
            { question: 'Meditation', answer: '<p>Meditation is a spiritual practice found in many cultures. Through mindfulness or concentration exercises the mind is meant to calm and gather. Studies show positive effects in many areas:</p><ul><li><strong>Physical:</strong> reduced high blood pressure, deeper breathing, less muscle tension, a stronger immune system</li><li><strong>Psychological:</strong> reduced anxiety, better recovery from burnout and depression, fewer sleep disorders</li><li><strong>Behaviour:</strong> support with behaviour change, better handling of addiction and eating disorders</li></ul>' },
            { question: 'Couples therapy', answer: '<p>Taking a step forward together — in individual and couples sessions, enriched with elements of the Taoist traditions in meditation, yoga and Qigong, we pursue these goals:</p><ul><li>Understanding relationship problems and finding out how your relationship can work</li><li>Recognising and understanding yourself and your partner better</li><li>Gaining new tools that are useful in all of life’s situations</li></ul>' },
            { question: 'Progressive muscle relaxation (Jacobson)', answer: '<p>In progressive muscle relaxation after Edmund Jacobson, a state of deep relaxation of the whole body is reached through deliberate, conscious tensing and releasing of specific muscle groups. The aim is to lower muscle tension below the normal level through improved body awareness. Over time you learn to bring about muscular relaxation whenever you wish.</p>' },
            { question: 'Socratic dialogue', answer: '<p>The Socratic dialogue is a questioning technique therapists use when a therapeutic conversation is about clarifying concepts and making decisions. It is a process of critically questioning arguments: structures and behaviour patterns become visible, your own thinking and acting become understandable — and therefore changeable.</p>' },
            { question: 'Yoga, Qigong & Tai Chi', answer: '<p>Yoga, Qigong and Tai Chi are techniques that work on body structure and body awareness. Combined with meditation and massage, these practices lead to a new sense of self, a more positive and accepting attitude towards yourself and your own body.</p>' },
          ],
        },
        es: {
          badgeText: 'En detalle',
          headline: 'Las terapias en detalle',
          expandFirst: true,
          items: [
            { question: 'Entrenamiento autógeno', answer: '<p>El entrenamiento autógeno es un método de relajación basado en la autosugestión. Fue desarrollado a partir de la hipnosis por el psiquiatra berlinés Johannes Heinrich Schultz, presentado por primera vez en 1926 y publicado en 1932 en su libro «El entrenamiento autógeno». Hoy es un método de psicoterapia ampliamente extendido y — en Alemania y Austria incluso reconocido legalmente.</p>' },
            { question: 'Terapia cognitivo-conductual', answer: '<p>En el centro de la terapia cognitiva están las cogniciones: actitudes, pensamientos, valoraciones y convicciones. Parte de que la forma en que pensamos determina cómo sentimos, actuamos y reaccionamos físicamente. El foco de la terapia está en:</p><ul><li>tomar conciencia de las cogniciones,</li><li>revisar las cogniciones y conclusiones según su adecuación,</li><li>corregir actitudes irracionales,</li><li>trasladar las actitudes corregidas a la conducta concreta.</li></ul>' },
            { question: 'Masaje', answer: '<p>El masaje actúa mecánicamente sobre la piel, el tejido conectivo y la musculatura mediante estiramiento, tracción y presión. Su efecto se extiende desde la zona tratada a todo el organismo e incluye la psique:</p><ul><li>Aumento local de la circulación, descenso de la tensión y el pulso</li><li>Relajación muscular, liberación de adherencias y cicatrices</li><li>Alivio del dolor y efecto sobre órganos internos vía arcos reflejos</li><li>Relajación psíquica, reducción del estrés</li></ul>' },
            { question: 'Meditación', answer: '<p>La meditación es una práctica espiritual presente en muchas culturas. Mediante ejercicios de atención plena o concentración, la mente se calma y se recoge. Los estudios muestran efectos positivos en muchas áreas:</p><ul><li><strong>Físico:</strong> reducción de la hipertensión, respiración más profunda, menos tensión muscular, sistema inmune más fuerte</li><li><strong>Psíquico:</strong> menos ansiedad, mejor recuperación del burnout y la depresión, menos trastornos del sueño</li><li><strong>Conducta:</strong> apoyo en el cambio de hábitos, mejor manejo de adicciones y trastornos alimentarios</li></ul>' },
            { question: 'Terapia de pareja', answer: '<p>Dar un paso adelante juntos — en sesiones individuales y de pareja, con elementos de las tradiciones taoístas de meditación, yoga y Qigong, perseguimos estos objetivos:</p><ul><li>Comprender los problemas de pareja y descubrir cómo puede funcionar vuestra relación</li><li>Conoceros mejor a vosotros mismos y a la pareja</li><li>Obtener nuevas herramientas útiles en todas las situaciones de la vida</li></ul>' },
            { question: 'Relajación muscular progresiva (Jacobson)', answer: '<p>En la relajación muscular progresiva según Edmund Jacobson se alcanza un estado de relajación profunda de todo el cuerpo tensando y soltando de forma consciente grupos musculares concretos. El objetivo es bajar la tensión muscular por debajo de lo normal mediante una mejor percepción corporal. Con el tiempo aprendes a provocar la relajación muscular cuando lo desees.</p>' },
            { question: 'Diálogo socrático', answer: '<p>El diálogo socrático es una técnica de preguntas que usan los terapeutas cuando la conversación busca aclarar conceptos y tomar decisiones. Es un proceso de cuestionar críticamente los argumentos: las estructuras y los patrones de conducta se hacen visibles, el propio pensar y actuar se vuelve comprensible — y por tanto modificable.</p>' },
            { question: 'Yoga, Qigong y Tai Chi', answer: '<p>El yoga, el Qigong y el Tai Chi son técnicas que trabajan la estructura y la percepción corporal. Junto con la meditación y el masaje, estas prácticas conducen a un nuevo sentido de sí mismo, una actitud más positiva y receptiva hacia ti y hacia tu propio cuerpo.</p>' },
          ],
        },
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
        _localized: true,
        de: { eyebrow: 'Behandlung', headline: 'Mein Angebot — Schritt für Schritt.', text: '<p>Unser Ziel ist es, dass Sie die Verantwortung für Ihre eigene Gesundheit übernehmen können und selbst entscheiden, was Ihnen gut tut.</p>', imagePrimary: IMG.estela26, primaryCta: { label: 'Erstgespräch vereinbaren', href: '/kontakt' }, secondaryCta: { label: 'Honorar ansehen', href: '/praxisinfo-honorar' }, hint: 'Kurse und Sitzungen auch online möglich.' },
        en: { eyebrow: 'Treatment', headline: 'What I offer — step by step.', text: '<p>Our goal is for you to be able to take responsibility for your own health and to decide for yourself what is good for you.</p>', imagePrimary: IMG.estela26, primaryCta: { label: 'Arrange a first consultation', href: '/kontakt' }, secondaryCta: { label: 'See the fees', href: '/praxisinfo-honorar' }, hint: 'Courses and sessions also available online.' },
        es: { eyebrow: 'Tratamiento', headline: 'Lo que ofrezco — paso a paso.', text: '<p>Nuestro objetivo es que puedas asumir la responsabilidad de tu propia salud y decidir por ti misma qué te sienta bien.</p>', imagePrimary: IMG.estela26, primaryCta: { label: 'Reservar una primera consulta', href: '/kontakt' }, secondaryCta: { label: 'Ver honorarios', href: '/praxisinfo-honorar' }, hint: 'Cursos y sesiones también en línea.' },
      },
    },
    {
      type: 'processSteps',
      data: {
        _localized: true,
        de: {
          badgeText: 'So arbeiten wir', headline: 'Drei Schritte zu Ihrer Behandlung',
          steps: [
            { icon: 'messageCircle', title: 'Beratung', text: 'Lernen Sie mich kennen. Im Gespräch tasten wir uns an Ihr ganz persönliches Bedürfnis heran und entscheiden gemeinsam die für Sie beste Vorgehensweise. Das erste Gespräch ist unverbindlich und kostenfrei.' },
            { icon: 'user', title: 'Einzelsitzungen', text: 'In einzelnen Sitzungen gehen wir Schritt für Schritt auf Ihre Bedürfnisse ein und arbeiten an den für Sie wichtigen Themen. Gerne können die verschiedenen Methoden auch nur zum Kennenlernen ausprobiert werden.' },
            { icon: 'heartHandshake', title: 'Körperorientierte Psychotherapie', text: 'Ich verbinde die Elemente der Meditation und der Massage in eine wirksame Behandlungsform nach den Leitlinien des Universal Healing Tao und des Chi Nei Tsang nach Großmeister Mantak Chia.' },
          ],
        },
        en: {
          badgeText: 'How we work', headline: 'Three steps to your treatment',
          steps: [
            { icon: 'messageCircle', title: 'Consultation', text: 'Get to know me. In conversation we feel our way to your very personal need and decide together on the best approach for you. The first conversation is free and without obligation.' },
            { icon: 'user', title: 'Individual sessions', text: 'In individual sessions we address your needs step by step and work on the themes that matter to you. The various methods can also simply be tried out to get to know them.' },
            { icon: 'heartHandshake', title: 'Body-oriented psychotherapy', text: 'I combine the elements of meditation and massage into an effective form of treatment following the guidelines of the Universal Healing Tao and Chi Nei Tsang after Grandmaster Mantak Chia.' },
          ],
        },
        es: {
          badgeText: 'Cómo trabajamos', headline: 'Tres pasos hacia tu tratamiento',
          steps: [
            { icon: 'messageCircle', title: 'Consulta', text: 'Conóceme. En la conversación nos acercamos a tu necesidad más personal y decidimos juntos el mejor enfoque para ti. La primera conversación es gratuita y sin compromiso.' },
            { icon: 'user', title: 'Sesiones individuales', text: 'En sesiones individuales atendemos tus necesidades paso a paso y trabajamos los temas que te importan. También puedes probar los distintos métodos solo para conocerlos.' },
            { icon: 'heartHandshake', title: 'Psicoterapia con enfoque corporal', text: 'Combino los elementos de la meditación y el masaje en una forma de tratamiento eficaz según las directrices del Universal Healing Tao y del Chi Nei Tsang del gran maestro Mantak Chia.' },
          ],
        },
      },
    },
    {
      type: 'ctaSplit',
      data: {
        _localized: true,
        de: {
          badge: 'Verbunden mit dem Tao Yin Zentrum',
          headline: 'Körper und Psyche gehören zusammen.',
          text: '<p>Die körperorientierte Arbeit findet in den Räumen des Tao Yin Zentrums Ingolstadt statt — demselben Ort, an dem auch Qi Gong-Kurse und Chi Nei Tsang-Behandlungen angeboten werden. So lassen sich Psychotherapie und taoistische Praxis auf Wunsch nahtlos verbinden.</p>',
          image: IMG.room,
          checklist: ['Erstgespräch unverbindlich und kostenfrei', 'Methoden zum Kennenlernen ausprobierbar', 'Sitzungen auf Deutsch, Englisch oder Spanisch'],
          primaryCta: { label: 'Termin anfragen', href: '/kontakt' },
          secondaryCta: { label: 'Tao Yin Zentrum entdecken', href: 'https://www.taoyin-zentrum.com' },
        },
        en: {
          badge: 'Connected with the Tao Yin Centre',
          headline: 'Body and mind belong together.',
          text: '<p>The body-oriented work takes place in the rooms of the Tao Yin Centre Ingolstadt — the same place where Qi Gong courses and Chi Nei Tsang treatments are offered. This lets psychotherapy and Taoist practice be combined seamlessly on request.</p>',
          image: IMG.room,
          checklist: ['First consultation free and without obligation', 'Methods can be tried out to get to know them', 'Sessions in German, English or Spanish'],
          primaryCta: { label: 'Request an appointment', href: '/kontakt' },
          secondaryCta: { label: 'Discover the Tao Yin Centre', href: 'https://www.taoyin-zentrum.com' },
        },
        es: {
          badge: 'Vinculada con el Centro Tao Yin',
          headline: 'Cuerpo y mente van juntos.',
          text: '<p>El trabajo con enfoque corporal tiene lugar en las salas del Centro Tao Yin de Ingolstadt — el mismo lugar donde se ofrecen cursos de Qi Gong y tratamientos de Chi Nei Tsang. Así, la psicoterapia y la práctica taoísta pueden combinarse sin fisuras cuando lo desees.</p>',
          image: IMG.room,
          checklist: ['Primera consulta gratuita y sin compromiso', 'Los métodos se pueden probar para conocerlos', 'Sesiones en alemán, inglés o español'],
          primaryCta: { label: 'Solicitar una cita', href: '/kontakt' },
          secondaryCta: { label: 'Descubrir el Centro Tao Yin', href: 'https://www.taoyin-zentrum.com' },
        },
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
        _localized: true,
        de: { eyebrow: 'Über mich', headline: 'Estela Fuchs', text: '<p>Heilpraktikerin für Psychotherapie, zertifizierte Tao-Lehrerin und Chi Nei Tsang Senior Teacher. Seit über 30 Jahren verbinde ich westliche Psychotherapie mit östlicher Heilkunst.</p>', imagePrimary: IMG.estela3, imageSecondary: IMG.estela26, primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' }, hint: 'Deutsch · English · Español' },
        en: { eyebrow: 'About me', headline: 'Estela Fuchs', text: '<p>Non-medical practitioner for psychotherapy, certified Tao teacher and Chi Nei Tsang Senior Teacher. For over 30 years I have combined Western psychotherapy with Eastern healing arts.</p>', imagePrimary: IMG.estela3, imageSecondary: IMG.estela26, primaryCta: { label: 'Get in touch', href: '/kontakt' }, hint: 'Deutsch · English · Español' },
        es: { eyebrow: 'Sobre mí', headline: 'Estela Fuchs', text: '<p>Terapeuta de psicoterapia, profesora certificada de Tao y Chi Nei Tsang Senior Teacher. Desde hace más de 30 años combino la psicoterapia occidental con las artes curativas orientales.</p>', imagePrimary: IMG.estela3, imageSecondary: IMG.estela26, primaryCta: { label: 'Ponte en contacto', href: '/kontakt' }, hint: 'Deutsch · English · Español' },
      },
    },
    {
      type: 'richText',
      data: {
        _localized: true,
        de: { content: '<h2>Mein Weg</h2>\n<p>Liebe Leserinnen und Leser,</p>\n<p>ich stamme aus einer Familie von Ärzten und fühlte mich schon seit der Kindheit mit der Medizin und alternativer Heilkunde verbunden. Seit 1990 beschäftige ich mich mit der Meditation und dem Universal Healing Tao nach Mantak Chia. 1992 habe ich einen Studiengang zur Geschichte und Philosophie der Weltreligionen abgeschlossen und dadurch die spirituellen Aspekte verschiedener Kulturen kennengelernt.</p>\n<p>Ich bin zertifizierte Tao-Lehrerin und Chi Nei Tsang-Senior-Teacher. Im Jahr 2013 habe ich die Schulung der Kunsttherapie im Asklepiad-Institut in München durchlaufen und mich dort auf die Heilpraktikerprüfung vorbereitet. Seit 2013 besitze ich die Erlaubnis als Heilpraktikerin der Psychotherapie.</p>\n<p>In Mexiko und in Dubai sammelte ich Erfahrungen in der Arbeit mit hilfsbedürftigen Kindern und habe mich seitdem auf die körperorientierte Psychotherapie spezialisiert.</p>\n<p>Ich wurde in Morelia, Michoacán, Mexiko geboren, bin verheiratet und habe zwei Kinder. Wir wohnen seit 2000 in Deutschland und haben von 2006 bis 2009 einige Jahre in Dubai gelebt.</p>\n<p>Ich spreche Deutsch und Englisch, meine Muttersprache ist Spanisch. Es ist mir eine Freude, meine Leistungen in diesen drei Sprachen anbieten zu können.</p>\n<p>Ich freue mich, Sie kennenzulernen.<br /><strong>Ihre Estela Fuchs</strong></p>' },
        en: { content: '<h2>My path</h2>\n<p>Dear readers,</p>\n<p>I come from a family of doctors and, since childhood, have felt connected to medicine and alternative healing. Since 1990 I have been engaged with meditation and the Universal Healing Tao after Mantak Chia. In 1992 I completed a course of study in the history and philosophy of the world religions and thereby came to know the spiritual aspects of different cultures.</p>\n<p>I am a certified Tao teacher and Chi Nei Tsang Senior Teacher. In 2013 I completed art therapy training at the Asklepiad Institute in Munich and prepared there for the non-medical practitioner examination. Since 2013 I have held the licence as a non-medical practitioner for psychotherapy.</p>\n<p>In Mexico and Dubai I gained experience working with children in need, and I have since specialised in body-oriented psychotherapy.</p>\n<p>I was born in Morelia, Michoacán, Mexico, am married and have two children. We have lived in Germany since 2000 and spent some years in Dubai from 2006 to 2009.</p>\n<p>I speak German and English, and my mother tongue is Spanish. It is a joy for me to be able to offer my services in these three languages.</p>\n<p>I look forward to meeting you.<br /><strong>Yours, Estela Fuchs</strong></p>' },
        es: { content: '<h2>Mi camino</h2>\n<p>Queridas lectoras y queridos lectores:</p>\n<p>provengo de una familia de médicos y desde la infancia me sentí unida a la medicina y a las curas alternativas. Desde 1990 me dedico a la meditación y al Universal Healing Tao de Mantak Chia. En 1992 finalicé unos estudios sobre la historia y la filosofía de las religiones del mundo y así conocí los aspectos espirituales de diferentes culturas.</p>\n<p>Soy profesora certificada de Tao y Chi Nei Tsang Senior Teacher. En 2013 realicé la formación en arteterapia en el Instituto Asklepiad de Múnich y me preparé allí para el examen de terapeuta. Desde 2013 tengo la licencia como terapeuta de psicoterapia.</p>\n<p>En México y en Dubái adquirí experiencia trabajando con niños necesitados y desde entonces me he especializado en la psicoterapia con enfoque corporal.</p>\n<p>Nací en Morelia, Michoacán, México; estoy casada y tengo dos hijos. Vivimos en Alemania desde 2000 y pasamos algunos años en Dubái entre 2006 y 2009.</p>\n<p>Hablo alemán e inglés, y mi lengua materna es el español. Es una alegría poder ofrecer mis servicios en estos tres idiomas.</p>\n<p>Me alegra conocerte.<br /><strong>Tuya, Estela Fuchs</strong></p>' },
      },
    },
    {
      type: 'galleryPro',
      data: {
        _localized: true,
        de: { badge: 'Einblicke', headline: 'Die Praxis und die Arbeit.', images: [ { src: IMG.estela52, alt: 'Estela Fuchs in der Praxis' }, { src: IMG.estela33, alt: 'Übung und Achtsamkeit' }, { src: IMG.estela59, alt: 'Körperorientierte Arbeit' }, { src: IMG.estela58, alt: 'Behandlungsraum' }, { src: IMG.estela43, alt: 'Estela Fuchs' }, { src: IMG.room, alt: 'Der Praxisraum' } ] },
        en: { badge: 'Impressions', headline: 'The practice and the work.', images: [ { src: IMG.estela52, alt: 'Estela Fuchs in the practice' }, { src: IMG.estela33, alt: 'Exercise and mindfulness' }, { src: IMG.estela59, alt: 'Body-oriented work' }, { src: IMG.estela58, alt: 'Treatment room' }, { src: IMG.estela43, alt: 'Estela Fuchs' }, { src: IMG.room, alt: 'The practice room' } ] },
        es: { badge: 'Impresiones', headline: 'La consulta y el trabajo.', images: [ { src: IMG.estela52, alt: 'Estela Fuchs en la consulta' }, { src: IMG.estela33, alt: 'Ejercicio y atención plena' }, { src: IMG.estela59, alt: 'Trabajo con enfoque corporal' }, { src: IMG.estela58, alt: 'Sala de tratamiento' }, { src: IMG.estela43, alt: 'Estela Fuchs' }, { src: IMG.room, alt: 'La sala de consulta' } ] },
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
        _localized: true,
        de: { eyebrow: 'Praxisinfo & Honorar', headline: 'Transparent und persönlich.', text: '<p>Im persönlichen, vertraulichen Gespräch behandeln wir Ihre ganz individuellen Themen. Ich erarbeite mit Ihnen ein auf Sie zugeschnittenes Programm und begleite Sie mit meinen eigenen Erfahrungen.</p>', imagePrimary: IMG.estela52, primaryCta: { label: 'Erstgespräch vereinbaren', href: '/kontakt' }, hint: 'Termine nach Vereinbarung in meiner Praxis in Ingolstadt — auch online.' },
        en: { eyebrow: 'Practice info & fees', headline: 'Transparent and personal.', text: '<p>In a personal, confidential conversation we address your very individual themes. Together we develop a programme tailored to you, and I accompany you with my own experience.</p>', imagePrimary: IMG.estela52, primaryCta: { label: 'Arrange a first consultation', href: '/kontakt' }, hint: 'Appointments by arrangement at my practice in Ingolstadt — also online.' },
        es: { eyebrow: 'Información y honorarios', headline: 'Transparente y cercano.', text: '<p>En una conversación personal y confidencial abordamos tus temas más individuales. Elaboramos juntos un programa a tu medida y te acompaño con mi propia experiencia.</p>', imagePrimary: IMG.estela52, primaryCta: { label: 'Reservar una primera consulta', href: '/kontakt' }, hint: 'Citas con reserva previa en mi consulta de Ingolstadt — también en línea.' },
      },
    },
    {
      type: 'comparisonCardsPro',
      data: {
        _localized: true,
        de: {
          badge: 'Honorar', headline: 'Klare Konditionen.',
          subline: 'Meditation, Psychotherapie und Coaching finden in Einzelsitzungen statt. Die Anzahl der Sitzungen ergibt sich aus Ihrer persönlichen Situation und wird nach dem Erstgespräch gemeinsam festgelegt.',
          plans: [
            { name: 'Erstgespräch', price: 'kostenfrei', note: 'unverbindlich', features: ['Persönliches Kennenlernen', 'Ihre Situation und Ihre Ziele', 'Gemeinsame Wahl der Vorgehensweise'], ctaLabel: 'Termin anfragen', ctaHref: '/kontakt' },
            { name: 'Psychotherapie', price: '90 €', note: 'pro Stunde (60 Minuten)', highlighted: true, features: ['Einzelsitzung in der Praxis oder online', 'Abrechnung nach Gebührenordnung (GebüH)', 'Verlängerung anteilig in 15-Minuten-Schritten'], ctaLabel: 'Termin anfragen', ctaHref: '/kontakt' },
            { name: 'Paartherapie', price: '120 €', note: 'pro Stunde (60 Minuten)', features: ['Einzel- und Paargespräche', 'Ergänzt um taoistische Elemente', 'Neue Werkzeuge für alle Lebenslagen'], ctaLabel: 'Termin anfragen', ctaHref: '/kontakt' },
          ],
        },
        en: {
          badge: 'Fees', headline: 'Clear terms.',
          subline: 'Meditation, psychotherapy and coaching take place in individual sessions. The number of sessions depends on your personal situation and is agreed together after the first consultation.',
          plans: [
            { name: 'First consultation', price: 'free', note: 'no obligation', features: ['Getting to know each other', 'Your situation and your goals', 'Choosing the approach together'], ctaLabel: 'Request an appointment', ctaHref: '/kontakt' },
            { name: 'Psychotherapy', price: '€90', note: 'per hour (60 minutes)', highlighted: true, features: ['Individual session at the practice or online', 'Billed according to the fee schedule (GebüH)', 'Extensions charged pro rata in 15-minute steps'], ctaLabel: 'Request an appointment', ctaHref: '/kontakt' },
            { name: 'Couples therapy', price: '€120', note: 'per hour (60 minutes)', features: ['Individual and couples sessions', 'Enriched with Taoist elements', 'New tools for all of life’s situations'], ctaLabel: 'Request an appointment', ctaHref: '/kontakt' },
          ],
        },
        es: {
          badge: 'Honorarios', headline: 'Condiciones claras.',
          subline: 'La meditación, la psicoterapia y el coaching se realizan en sesiones individuales. El número de sesiones depende de tu situación personal y se acuerda juntos tras la primera consulta.',
          plans: [
            { name: 'Primera consulta', price: 'gratuita', note: 'sin compromiso', features: ['Conocerse mutuamente', 'Tu situación y tus objetivos', 'Elegir el enfoque juntos'], ctaLabel: 'Solicitar una cita', ctaHref: '/kontakt' },
            { name: 'Psicoterapia', price: '90 €', note: 'por hora (60 minutos)', highlighted: true, features: ['Sesión individual en consulta o en línea', 'Facturación según el baremo (GebüH)', 'Ampliaciones a prorrata en pasos de 15 minutos'], ctaLabel: 'Solicitar una cita', ctaHref: '/kontakt' },
            { name: 'Terapia de pareja', price: '120 €', note: 'por hora (60 minutos)', features: ['Sesiones individuales y de pareja', 'Con elementos taoístas', 'Nuevas herramientas para toda situación'], ctaLabel: 'Solicitar una cita', ctaHref: '/kontakt' },
          ],
        },
      },
    },
    {
      type: 'richText',
      data: {
        _localized: true,
        de: { content: '<h2>Gut zu wissen</h2>\n<p>Ich arbeite mit Privatpatienten bzw. privaten Klienten — das heißt, Sie übernehmen die Kosten selbst. Als Heilpraktikerin für Psychotherapie rechne ich nach der Gebührenordnung (GebüH) ab.</p>\n<ul>\n<li>Private Kassen oder Beihilfestellen erstatten ganz oder teilweise. Erkundigen Sie sich bitte vor Behandlungsbeginn bei Ihrer Krankenversicherung, ob und in welchem Umfang Kosten übernommen werden — bei der Antragstellung unterstütze ich Sie gerne.</li>\n<li>Mitglieder gesetzlicher Krankenkassen ohne Zusatzversicherung übernehmen die Kosten von Heilpraktikern meist selbst.</li>\n<li>Das Honorar ist in bar fällig, in Ausnahmefällen auch auf Rechnung oder per Online-Überweisung.</li>\n<li>Terminabsprachen sind verbindlich: Termine, die nicht spätestens 24 Stunden vorher abgesagt werden, müssen voll berechnet werden.</li>\n</ul>' },
        en: { content: '<h2>Good to know</h2>\n<p>I work with private patients and private clients — that is, you cover the costs yourself. As a non-medical practitioner for psychotherapy, I bill according to the fee schedule (GebüH).</p>\n<ul>\n<li>Private health insurers or public-servant aid schemes reimburse fully or in part. Please check with your insurer before starting treatment whether and to what extent costs are covered — I am glad to help with the application.</li>\n<li>Members of statutory health insurance without supplementary cover usually pay the costs of non-medical practitioners themselves.</li>\n<li>The fee is payable in cash, in exceptional cases also by invoice or online transfer.</li>\n<li>Appointments are binding: appointments not cancelled at least 24 hours in advance are charged in full.</li>\n</ul>' },
        es: { content: '<h2>Bueno saberlo</h2>\n<p>Trabajo con pacientes y clientes privados — es decir, tú asumes los costes. Como terapeuta de psicoterapia facturo según el baremo (GebüH).</p>\n<ul>\n<li>Las aseguradoras privadas o las ayudas a funcionarios reembolsan total o parcialmente. Consulta con tu seguro antes de empezar el tratamiento si cubre los costes y en qué medida — con gusto te ayudo con la solicitud.</li>\n<li>Los afiliados al seguro público sin cobertura complementaria suelen pagar por sí mismos los servicios de los terapeutas.</li>\n<li>El honorario se paga en efectivo, en casos excepcionales también por factura o transferencia en línea.</li>\n<li>Las citas son vinculantes: las citas no canceladas con al menos 24 horas de antelación se facturan íntegramente.</li>\n</ul>' },
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
        _localized: true,
        de: { eyebrow: 'Kontakt', headline: 'Schreiben Sie mir.', text: `<p>Ob Frage, Terminwunsch oder einfach ein erstes Kennenlernen — ich freue mich auf Ihre Nachricht. Sie finden meine Praxis <strong>${ADDRESS.split(',')[0]}</strong> in Ingolstadt, beim Tao Yin Zentrum.</p>`, imagePrimary: IMG.room, imageSecondary: IMG.estela3, primaryCta: { label: 'Jetzt anrufen', href: PHONE_HREF }, secondaryCta: { label: 'E-Mail schreiben', href: `mailto:${EMAIL}` }, hint: 'Termine nach Vereinbarung — Kurse und Sitzungen auch online möglich.' },
        en: { eyebrow: 'Contact', headline: 'Write to me.', text: `<p>Whether a question, a request for an appointment or simply a first hello — I look forward to your message. You will find my practice at <strong>${ADDRESS.split(',')[0]}</strong> in Ingolstadt, at the Tao Yin Centre.</p>`, imagePrimary: IMG.room, imageSecondary: IMG.estela3, primaryCta: { label: 'Call now', href: PHONE_HREF }, secondaryCta: { label: 'Write an email', href: `mailto:${EMAIL}` }, hint: 'Appointments by arrangement — courses and sessions also online.' },
        es: { eyebrow: 'Contacto', headline: 'Escríbeme.', text: `<p>Ya sea una pregunta, una solicitud de cita o simplemente un primer saludo — me alegra tu mensaje. Encontrarás mi consulta en <strong>${ADDRESS.split(',')[0]}</strong>, en Ingolstadt, junto al Centro Tao Yin.</p>`, imagePrimary: IMG.room, imageSecondary: IMG.estela3, primaryCta: { label: 'Llamar ahora', href: PHONE_HREF }, secondaryCta: { label: 'Escribir un correo', href: `mailto:${EMAIL}` }, hint: 'Citas con reserva previa — cursos y sesiones también en línea.' },
      },
    },
    {
      type: 'contact',
      data: {
        _localized: true,
        de: { badgeText: 'Kontakt', headline: 'So erreichen Sie mich', subline: `Telefonisch unter ${PHONE} — oder über das Formular.`, introText: `<p>Anfragen zur Psychotherapie-Praxis senden Sie an <strong>${EMAIL}</strong>. Ich melde mich so schnell wie möglich zurück.</p>`, email: EMAIL, phone: PHONE, address: ADDRESS, formEnabled: true, submitLabel: 'Nachricht senden' },
        en: { badgeText: 'Contact', headline: 'How to reach me', subline: `By phone at ${PHONE} — or via the form.`, introText: `<p>Send enquiries about the psychotherapy practice to <strong>${EMAIL}</strong>. I will get back to you as soon as possible.</p>`, email: EMAIL, phone: PHONE, address: ADDRESS, formEnabled: true, submitLabel: 'Send message' },
        es: { badgeText: 'Contacto', headline: 'Cómo contactarme', subline: `Por teléfono en el ${PHONE} — o mediante el formulario.`, introText: `<p>Envía tus consultas sobre la consulta de psicoterapia a <strong>${EMAIL}</strong>. Te responderé lo antes posible.</p>`, email: EMAIL, phone: PHONE, address: ADDRESS, formEnabled: true, submitLabel: 'Enviar mensaje' },
      },
    },
    {
      type: 'map',
      data: {
        _localized: true,
        de: { headline: 'So finden Sie die Praxis', address: ADDRESS, embedUrl: MAP_URL },
        en: { headline: 'How to find the practice', address: ADDRESS, embedUrl: MAP_URL },
        es: { headline: 'Cómo encontrar la consulta', address: ADDRESS, embedUrl: MAP_URL },
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
        _localized: true,
        de: { eyebrow: 'Anfahrt', headline: 'Mitten in Ingolstadt.', text: '<p>Meine Praxis befindet sich im Stadtzentrum von Ingolstadt und ist zu Fuß sehr gut zu erreichen. Als Orientierung können Sie das Restaurant Ölbaum nehmen — die Praxis finden Sie nur ein paar Meter weiter, beim Tao Yin Zentrum.</p>', imagePrimary: IMG.estela58, primaryCta: { label: 'Termin vereinbaren', href: '/kontakt' }, hint: 'Beste und günstigste Parkgelegenheit: Parkplatz am Freibad.' },
        en: { eyebrow: 'Directions', headline: 'In the heart of Ingolstadt.', text: '<p>My practice is located in the centre of Ingolstadt and is very easy to reach on foot. As a landmark you can use the Ölbaum restaurant — the practice is just a few metres further on, at the Tao Yin Centre.</p>', imagePrimary: IMG.estela58, primaryCta: { label: 'Arrange an appointment', href: '/kontakt' }, hint: 'Best and cheapest parking: the car park by the outdoor pool.' },
        es: { eyebrow: 'Cómo llegar', headline: 'En pleno centro de Ingolstadt.', text: '<p>Mi consulta está en el centro de Ingolstadt y es muy fácil de alcanzar a pie. Como referencia puedes tomar el restaurante Ölbaum — la consulta está unos metros más allá, junto al Centro Tao Yin.</p>', imagePrimary: IMG.estela58, primaryCta: { label: 'Reservar una cita', href: '/kontakt' }, hint: 'El mejor y más económico aparcamiento: el parking de la piscina.' },
      },
    },
    {
      type: 'map',
      data: {
        _localized: true,
        de: { headline: 'Anfahrt & Parkmöglichkeiten', address: ADDRESS, embedUrl: MAP_URL },
        en: { headline: 'Directions & parking', address: ADDRESS, embedUrl: MAP_URL },
        es: { headline: 'Cómo llegar y aparcamiento', address: ADDRESS, embedUrl: MAP_URL },
      },
    },
    CTA_BAND,
  ],
};

// ─── Legal: Impressum bleibt (rechtlich) deutsch; Datenschutz trilingual. ────
const { impressum, datenschutz } = require('./_legal-localized.cjs');

module.exports = flatten({
  slug: 'estela-fuchs',
  host: 'flamingo-estela-fuchs.vercel.app',
  wipe: true,
  // i18n (de/en/es) is enabled on this tenant in the admin (paid, admin-only —
  // NOT settable via the API). The localized _localized content below only
  // renders because those locales are already enabled account-side.
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
  navigationI18n: {
    en: {
      items: [
        { label: 'Your goal', href: '/ihr-ziel' },
        { label: 'Therapies', href: '/therapien' },
        { label: 'Treatment', href: '/behandlung' },
        { label: 'Practice info & fees', href: '/praxisinfo-honorar' },
        { label: 'About me', href: '/ueber-mich' },
      ],
      ctaLabel: 'Contact', ctaHref: '/kontakt',
    },
    es: {
      items: [
        { label: 'Tu objetivo', href: '/ihr-ziel' },
        { label: 'Terapias', href: '/therapien' },
        { label: 'Tratamiento', href: '/behandlung' },
        { label: 'Información y honorarios', href: '/praxisinfo-honorar' },
        { label: 'Sobre mí', href: '/ueber-mich' },
      ],
      ctaLabel: 'Contacto', ctaHref: '/kontakt',
    },
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
  footerI18n: {
    en: {
      columns: [
        { title: 'Practice', items: [
          { text: 'Your goal', href: '/ihr-ziel' },
          { text: 'Therapies', href: '/therapien' },
          { text: 'Treatment', href: '/behandlung' },
          { text: 'Practice info & fees', href: '/praxisinfo-honorar' } ] },
        { title: 'Service', items: [
          { text: 'About me', href: '/ueber-mich' },
          { text: 'Contact', href: '/kontakt' },
          { text: 'Directions', href: '/anfahrt' },
          { text: 'Tao Yin Centre Ingolstadt', href: 'https://www.taoyin-zentrum.com' } ] },
        { title: 'Contact', items: [
          { text: ADDRESS },
          { text: PHONE },
          { text: EMAIL },
          { text: 'Appointments by arrangement — also online' } ] },
      ],
      legalLinks: [ { label: 'Legal notice', href: '/impressum' }, { label: 'Privacy', href: '/datenschutz' } ],
    },
    es: {
      columns: [
        { title: 'Consulta', items: [
          { text: 'Tu objetivo', href: '/ihr-ziel' },
          { text: 'Terapias', href: '/therapien' },
          { text: 'Tratamiento', href: '/behandlung' },
          { text: 'Información y honorarios', href: '/praxisinfo-honorar' } ] },
        { title: 'Servicio', items: [
          { text: 'Sobre mí', href: '/ueber-mich' },
          { text: 'Contacto', href: '/kontakt' },
          { text: 'Cómo llegar', href: '/anfahrt' },
          { text: 'Centro Tao Yin Ingolstadt', href: 'https://www.taoyin-zentrum.com' } ] },
        { title: 'Contacto', items: [
          { text: ADDRESS },
          { text: PHONE },
          { text: EMAIL },
          { text: 'Citas con reserva previa — también en línea' } ] },
      ],
      legalLinks: [ { label: 'Aviso legal', href: '/impressum' }, { label: 'Privacidad', href: '/datenschutz' } ],
    },
  },
  pages: [startseite, ihrZiel, therapien, behandlung, ueberMich, praxisinfo, kontakt, anfahrt, impressum, datenschutz],
  publish: true,
});
