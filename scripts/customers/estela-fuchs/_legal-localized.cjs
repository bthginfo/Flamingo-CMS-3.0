// Trilinguale Rechtstexte. Das Impressum bleibt inhaltlich deutsch (gesetzliche
// Pflichtangaben nach § 5 TMG); nur Hero-Beiwerk wird lokalisiert. Der
// Datenschutz-Hinweis wird vollständig übersetzt.
const IMPRESSUM_HERO = 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1800&q=85';
const DATENSCHUTZ_HERO = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&q=85';

// Pflichtangaben (unverändert deutsch, in allen Locales identisch gezeigt).
const IMPRESSUM_BLOCKS = [
  { headline: 'Angaben gemäß § 5 TMG', text: '<p>Estela und Paul Fuchs<br />Universal Healing Tao Center Ingolstadt<br />Venusstrasse 10<br />85080 Gaimersheim</p>' },
  { headline: 'Kontakt', text: '<p>Telefon: +49 (0) 8458 343641<br />Telefax: +49 (0) 8458 343641<br />E-Mail: pkfuchs@hotmail.com</p>' },
  { headline: 'Berufsbezeichnung', text: '<p>Heilpraktiker/in für Psychotherapie, Bundesrepublik Deutschland<br />Aufsichtsbehörde: Landratsamt Eichstätt</p>' },
  { headline: 'Umsatzsteuer-ID', text: '<p>Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz: 171/218/80989</p>' },
  { headline: 'Berufshaftpflichtversicherung', text: '<p>Es besteht eine Berufshaftpflichtversicherung bei der Continentale-Versicherung.</p>' },
];

const impressum = {
  slug: 'impressum',
  title: 'Impressum',
  seo: { metaTitle: 'Impressum — Praxis Estela Fuchs', metaDescription: 'Impressum der Praxis für Psychotherapie Estela Fuchs, Ingolstadt — Angaben gemäß § 5 TMG.' },
  sections: [
    {
      type: 'collectionHero',
      data: {
        _localized: true,
        de: { bgImage: IMPRESSUM_HERO, category: 'Rechtliches', headline: 'Impressum', subline: 'Angaben gemäß § 5 TMG.', overlayColor: '#263042', overlayOpacity: 0.45 },
        en: { bgImage: IMPRESSUM_HERO, category: 'Legal', headline: 'Legal notice', subline: 'Information pursuant to § 5 TMG (German law).', overlayColor: '#263042', overlayOpacity: 0.45 },
        es: { bgImage: IMPRESSUM_HERO, category: 'Aviso legal', headline: 'Aviso legal', subline: 'Información según el § 5 TMG (ley alemana).', overlayColor: '#263042', overlayOpacity: 0.45 },
      },
    },
    {
      type: 'legalContent',
      data: {
        _localized: true,
        de: { headline: 'Impressum', blocks: IMPRESSUM_BLOCKS },
        en: { headline: 'Legal notice', blocks: IMPRESSUM_BLOCKS },
        es: { headline: 'Aviso legal', blocks: IMPRESSUM_BLOCKS },
      },
    },
  ],
};

const datenschutz = {
  slug: 'datenschutz',
  title: 'Datenschutz',
  seo: { metaTitle: 'Datenschutz — Praxis Estela Fuchs', metaDescription: 'Datenschutzhinweise der Praxis für Psychotherapie Estela Fuchs, Ingolstadt.' },
  sections: [
    {
      type: 'collectionHero',
      data: {
        _localized: true,
        de: { bgImage: DATENSCHUTZ_HERO, category: 'Rechtliches', headline: 'Datenschutz', subline: 'Datenschutzhinweise und Haftungsausschluss.', overlayColor: '#263042', overlayOpacity: 0.45 },
        en: { bgImage: DATENSCHUTZ_HERO, category: 'Legal', headline: 'Privacy', subline: 'Privacy notice and disclaimer.', overlayColor: '#263042', overlayOpacity: 0.45 },
        es: { bgImage: DATENSCHUTZ_HERO, category: 'Aviso legal', headline: 'Privacidad', subline: 'Aviso de privacidad y exención de responsabilidad.', overlayColor: '#263042', overlayOpacity: 0.45 },
      },
    },
    {
      type: 'legalContent',
      data: {
        _localized: true,
        de: {
          headline: 'Datenschutz und Haftung',
          blocks: [
            { headline: 'Haftung für Inhalte', text: '<p>Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.</p>' },
            { headline: 'Haftung für Links', text: '<p>Diese Website kann Links zu externen Webseiten Dritter enthalten, auf deren Inhalte kein Einfluss besteht. Für diese fremden Inhalte wird keine Gewähr übernommen.</p>' },
            { headline: 'Cookies', text: '<p>Diese Website verwendet Cookies, kleine Textdateien, die auf Ihrem Computer platziert werden, um eine bessere Benutzererfahrung zu ermöglichen.</p>' },
            { headline: 'Kontakt Datenschutz', text: '<p>Bei Fragen wenden Sie sich bitte an Estela Fuchs über die auf der Kontaktseite genannten Kontaktdaten.</p>' },
          ],
        },
        en: {
          headline: 'Privacy and liability',
          blocks: [
            { headline: 'Liability for content', text: '<p>The content of these pages was created with the greatest care. However, no guarantee can be given for the accuracy, completeness and timeliness of the content.</p>' },
            { headline: 'Liability for links', text: '<p>This website may contain links to external third-party websites over whose content we have no influence. No guarantee is given for this external content.</p>' },
            { headline: 'Cookies', text: '<p>This website uses cookies — small text files placed on your computer to enable a better user experience.</p>' },
            { headline: 'Privacy contact', text: '<p>If you have any questions, please contact Estela Fuchs using the contact details given on the contact page.</p>' },
          ],
        },
        es: {
          headline: 'Privacidad y responsabilidad',
          blocks: [
            { headline: 'Responsabilidad por los contenidos', text: '<p>Los contenidos de estas páginas se elaboraron con el máximo cuidado. No obstante, no se puede garantizar la exactitud, integridad y actualidad de los contenidos.</p>' },
            { headline: 'Responsabilidad por los enlaces', text: '<p>Este sitio puede contener enlaces a páginas externas de terceros sobre cuyos contenidos no se tiene influencia. No se asume ninguna garantía por esos contenidos ajenos.</p>' },
            { headline: 'Cookies', text: '<p>Este sitio utiliza cookies, pequeños archivos de texto que se guardan en tu ordenador para ofrecer una mejor experiencia de uso.</p>' },
            { headline: 'Contacto de privacidad', text: '<p>Si tienes preguntas, contacta con Estela Fuchs mediante los datos indicados en la página de contacto.</p>' },
          ],
        },
      },
    },
  ],
};

module.exports = { impressum, datenschutz };
