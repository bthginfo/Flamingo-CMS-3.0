/** Complete sample shapes also seed optional nested controls in the CMS. */
export const PERSPECTIVE_SECTION_PREVIEW_DATA: Record<string, Record<string, unknown>> = {
  perspectiveHero: {
    layout: 'panorama', eyebrow: 'Perspektiven entdecken', headline: 'Raum für das,\nwas Sie bewegt.',
    text: 'Ein Einstieg mit einer klaren Aussage, einem großen Bild und einem konkreten nächsten Schritt.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Licht und klare Linien an einem modernen Gebäude', imagePosition: 'center', imageMobilePosition: '', caption: '',
    primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' }, secondaryCta: { label: 'Mehr erfahren', href: '#themen' }, meta: ['Persönliche Beratung', 'Ein klarer nächster Schritt'],
  },
  photoChapter: {
    layout: 'feature', headline: 'Eine andere Sicht\nauf das Wesentliche.',
    text: '<p>Eine fotografische Geschichte gibt dem Thema einen Ort. Der Text beschreibt die konkrete Frage und macht verständlich, was als Nächstes zählt.</p>',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85', imageAlt: 'Offener Raum mit großen Fenstern', imagePosition: 'center',
    secondaryImage: '', secondaryImageAlt: '', secondaryImagePosition: 'center', caption: '', cta: { label: 'Die Geschichte lesen', href: '/ueber-uns' },
  },
  topicExplorer: {
    headline: 'Was beschäftigt Sie?', intro: 'Wählen Sie das Thema, das zu Ihrer Situation passt. Jeder Bereich öffnet eine eigene Perspektive.',
    items: [
      { id: 'orientierung', title: 'Orientierung finden', summary: 'Die eigene Frage einordnen und Möglichkeiten verstehen.', detail: '<p>Am Anfang steht die konkrete Situation. Welche Fragen sind offen, welche Informationen liegen vor und welche Entscheidung steht an?</p>', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=82', imageAlt: 'Klare architektonische Linien', imagePosition: 'center', bullets: ['Ausgangslage beschreiben', 'Offene Fragen festhalten'], meta: ['Eine persönliche Perspektive'], cta: { label: 'Mehr zur Orientierung', href: '/beratung' } },
      { id: 'zusammenarbeit', title: 'Zusammenarbeiten', summary: 'Verantwortlichkeiten, Umfang und Austausch klären.', detail: '<p>Ein gemeinsamer Arbeitsstand macht die nächsten Schritte nachvollziehbar.</p>', image: '', imageAlt: '', imagePosition: 'center', bullets: [], meta: [], cta: { label: 'Kontakt aufnehmen', href: '/kontakt' } },
    ],
  },
  editorialBriefing: {
    layout: 'columns', headline: 'Gut informiert.\nKlar entschieden.', intro: 'Die wichtigsten Zusammenhänge in einem offenen, gut lesbaren Überblick.',
    groups: [
      { title: 'Die Ausgangslage', text: '<p>Was ist bereits bekannt? Eine genaue Beschreibung verbindet vorhandene Informationen mit den offenen Fragen.</p>', items: ['Relevante Unterlagen', 'Bisherige Absprachen'] },
      { title: 'Die Entscheidung', text: '<p>Welche Möglichkeiten bestehen und was bedeutet die jeweilige Wahl in der Praxis?</p>', items: ['Umfang der Zusammenarbeit', 'Gemeinsamer Arbeitsstand'] },
    ],
    stages: [{ title: 'Einordnen', text: 'Die Ausgangslage und Ihre Fragen besprechen.' }, { title: 'Abstimmen', text: 'Möglichkeiten und nächste Schritte festhalten.' }],
    note: '', cta: { label: 'Ein Gespräch vereinbaren', href: '/kontakt' },
  },
  resourceList: {
    headline: 'Gut vorbereitet.', intro: 'Hilfreiche Informationen und Unterlagen an einem Ort.',
    groups: [{ id: '', title: 'Informationen', items: [{ title: 'Der erste Kontakt', description: 'Ansprechpartner und Kontaktmöglichkeiten finden.', href: '/kontakt', format: '', actionLabel: 'Kontakt öffnen' }] }], note: '',
  },
};

const PERSPECTIVE_TYPES = new Set(Object.keys(PERSPECTIVE_SECTION_PREVIEW_DATA));

export const EDITORIAL_CONTACT_EDITOR_DEFAULTS: Record<string, unknown> = {
  layout: 'editorial', titleAs: 'h2', headline: '', introText: '', formEnabled: true, submitLabel: '', privacyHref: '', showMap: false, mapEmbedUrl: '',
  infoCards: [{ icon: '', label: '', value: '', href: '' }],
  formFields: [{ name: '', label: '', type: 'text', placeholder: '', required: false, halfWidth: false, options: [] }],
};

function emptyValue(value: unknown): unknown {
  if (Array.isArray(value)) return [];
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, emptyValue(child)]));
  if (typeof value === 'number') return 0;
  if (typeof value === 'boolean') return false;
  return '';
}

function mergeShape(data: Record<string, unknown>, defaults: Record<string, unknown>): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...data };
  for (const [key, sample] of Object.entries(defaults)) {
    const current = data[key];
    if (current === undefined) {
      merged[key] = key === 'layout' || key === 'titleAs' ? sample : emptyValue(sample);
    } else if (Array.isArray(current) && Array.isArray(sample)) {
      const itemShape = sample.find(item => item && typeof item === 'object' && !Array.isArray(item));
      if (itemShape) merged[key] = current.map(item => item && typeof item === 'object' && !Array.isArray(item) ? mergeShape(item, itemShape) : item);
    } else if (current && sample && typeof current === 'object' && typeof sample === 'object' && !Array.isArray(current) && !Array.isArray(sample)) {
      merged[key] = mergeShape(current as Record<string, unknown>, sample as Record<string, unknown>);
    }
  }
  return merged;
}

/** Add empty controls to partial stored data without inserting demo content or rows. */
export function withPerspectiveEditorDefaults(type: string | undefined, data: Record<string, unknown>, defaults: Record<string, unknown>): Record<string, unknown> {
  if (!type || (!PERSPECTIVE_TYPES.has(type) && !(type === 'teamSpotlight' && data.layout === 'contactSheet') && !(['contact', 'contactForm'].includes(type) && data.layout === 'editorial'))) return data;
  return mergeShape(data, defaults);
}
