/** Embed Provider Registry — defines available providers, their fields, and how to generate embed URLs. */

export type ProviderField = {
  key: string;
  label: string;
  placeholder: string;
  help: string;
  required?: boolean;
};

export type EmbedProvider = {
  id: string;
  label: string;
  category: 'booking' | 'reviews' | 'maps' | 'video' | 'social' | 'forms' | 'other';
  icon: string;
  type?: 'iframe' | 'script';
  fields: ProviderField[];
  buildUrl: (config: Record<string, string>) => string | null;
  /** For script-type providers: returns the script src URL */
  buildScriptUrl?: (config: Record<string, string>) => string | null;
  /** For script-type providers: JS function name to call to open the widget */
  triggerFunction?: string;
  defaultHeight: number;
  allowedDomains: string[];
};

/** Script-based providers that can be used in the navigation CTA */
export type NavScriptProvider = {
  id: string;
  label: string;
  icon: string;
  fields: ProviderField[];
  buildScriptUrl: (config: Record<string, string>) => string | null;
  triggerFunction: string;
  defaultLabel: string;
};

export const NAV_SCRIPT_PROVIDERS: NavScriptProvider[] = [
  {
    id: 'drflex',
    label: 'Dr. Flex',
    icon: 'Stethoscope',
    fields: [
      { key: 'practiceId', label: 'Praxis-ID', placeholder: '12345', help: 'Deine Dr. Flex medicalPracticeId (vom Dr. Flex Support erhalten)', required: true },
    ],
    buildScriptUrl: (c) => c.practiceId ? `https://dr-flex.de/embed.js?medicalPracticeId=${encodeURIComponent(c.practiceId)}` : null,
    triggerFunction: 'toggleDrFlexAppointments',
    defaultLabel: 'Termin online buchen',
  },
  {
    id: 'doctolib',
    label: 'Doctolib',
    icon: 'CalendarCheck',
    fields: [
      { key: 'slug', label: 'Praxis-Slug', placeholder: 'dr-mueller-berlin', help: 'Dein Slug aus der Doctolib-URL: doctolib.de/praxis/[DEIN-SLUG]', required: true },
    ],
    buildScriptUrl: (c) => c.slug ? `https://www.doctolib.de/booking/${encodeURIComponent(c.slug)}.js` : null,
    triggerFunction: 'doctolib_booking',
    defaultLabel: 'Termin buchen',
  },
];

export const EMBED_PROVIDERS: EmbedProvider[] = [
  // ─── Buchung (Script-Widgets) ──────────────────────────
  {
    id: 'drflex',
    label: 'Dr. Flex',
    category: 'booking',
    icon: 'Stethoscope',
    type: 'script',
    fields: [
      { key: 'practiceId', label: 'Praxis-ID', placeholder: '12345', help: 'Deine Dr. Flex medicalPracticeId (vom Dr. Flex Support erhalten)', required: true },
      { key: 'buttonColor', label: 'Button-Farbe', placeholder: '#0ea5e9', help: 'Hex-Farbe für den Button-Hintergrund (leer = Brand-Farbe)' },
      { key: 'buttonTextColor', label: 'Button-Textfarbe', placeholder: '#ffffff', help: 'Hex-Farbe für den Button-Text (leer = weiß)' },
    ],
    buildUrl: () => null,
    buildScriptUrl: (c) => c.practiceId ? `https://dr-flex.de/embed.js?medicalPracticeId=${encodeURIComponent(c.practiceId)}` : null,
    triggerFunction: 'toggleDrFlexAppointments',
    defaultHeight: 0,
    allowedDomains: ['dr-flex.de'],
  },
  {
    id: 'doctolib',
    label: 'Doctolib',
    category: 'booking',
    icon: 'CalendarCheck',
    type: 'script',
    fields: [
      { key: 'slug', label: 'Praxis-Slug', placeholder: 'dr-mueller-berlin', help: 'Dein Slug aus der Doctolib-URL: doctolib.de/praxis/[DEIN-SLUG]', required: true },
      { key: 'buttonColor', label: 'Button-Farbe', placeholder: '#107ACA', help: 'Hex-Farbe für den Button-Hintergrund (leer = Brand-Farbe)' },
      { key: 'buttonTextColor', label: 'Button-Textfarbe', placeholder: '#ffffff', help: 'Hex-Farbe für den Button-Text (leer = weiß)' },
    ],
    buildUrl: () => null,
    buildScriptUrl: (c) => c.slug ? `https://www.doctolib.de/booking/${encodeURIComponent(c.slug)}.js` : null,
    triggerFunction: 'doctolib_booking',
    defaultHeight: 0,
    allowedDomains: ['www.doctolib.de'],
  },

  // ─── Buchung (iframe) ─────────────────────────────────────
  {
    id: 'calendly',
    label: 'Calendly',
    category: 'booking',
    icon: 'Calendar',
    fields: [
      { key: 'username', label: 'Benutzername', placeholder: 'max-mustermann', help: 'Dein Calendly-Username aus calendly.com/[USERNAME]', required: true },
      { key: 'eventType', label: 'Event-Typ (optional)', placeholder: '30min', help: 'Optional: spezifischer Event-Typ-Slug' },
    ],
    buildUrl: (c) => c.username ? `https://calendly.com/${encodeURIComponent(c.username)}${c.eventType ? '/' + encodeURIComponent(c.eventType) : ''}` : null,
    defaultHeight: 700,
    allowedDomains: ['calendly.com'],
  },
  {
    id: 'opentable',
    label: 'OpenTable',
    category: 'booking',
    icon: 'UtensilsCrossed',
    fields: [
      { key: 'restaurantId', label: 'Restaurant-ID', placeholder: '123456', help: 'Deine OpenTable Restaurant-ID aus dem Partnerbereich', required: true },
      { key: 'language', label: 'Sprache', placeholder: 'de-DE', help: 'Sprachcode z.B. de-DE, en-US' },
    ],
    buildUrl: (c) => c.restaurantId ? `https://www.opentable.de/restref/client/?rid=${encodeURIComponent(c.restaurantId)}&lang=${c.language || 'de-DE'}` : null,
    defaultHeight: 500,
    allowedDomains: ['www.opentable.de', 'www.opentable.com'],
  },
  {
    id: 'treatwell',
    label: 'Treatwell',
    category: 'booking',
    icon: 'Scissors',
    fields: [
      { key: 'salonSlug', label: 'Salon-Slug', placeholder: 'studio-bellezza-muenchen', help: 'Dein Slug aus der Treatwell-URL: treatwell.de/salon/[DEIN-SLUG]', required: true },
    ],
    buildUrl: (c) => c.salonSlug ? `https://widget.treatwell.de/places/${encodeURIComponent(c.salonSlug)}/book` : null,
    defaultHeight: 600,
    allowedDomains: ['widget.treatwell.de'],
  },
  {
    id: 'simplybook',
    label: 'SimplyBook.me',
    category: 'booking',
    icon: 'BookOpen',
    fields: [
      { key: 'company', label: 'Firmenname', placeholder: 'meine-firma', help: 'Dein Firmenname aus [FIRMA].simplybook.me', required: true },
    ],
    buildUrl: (c) => c.company ? `https://${encodeURIComponent(c.company)}.simplybook.me/v2/` : null,
    defaultHeight: 700,
    allowedDomains: ['*.simplybook.me'],
  },
  {
    id: 'resmio',
    label: 'Resmio',
    category: 'booking',
    icon: 'UtensilsCrossed',
    fields: [
      { key: 'restaurantId', label: 'Restaurant-ID', placeholder: 'mein-restaurant', help: 'Dein Restaurant-Slug aus resmio.com/[ID]', required: true },
    ],
    buildUrl: (c) => c.restaurantId ? `https://app.resmio.com/widget/${encodeURIComponent(c.restaurantId)}` : null,
    defaultHeight: 600,
    allowedDomains: ['app.resmio.com'],
  },
  {
    id: 'thefork',
    label: 'TheFork',
    category: 'booking',
    icon: 'UtensilsCrossed',
    fields: [
      { key: 'restaurantId', label: 'Restaurant-ID', placeholder: '123456', help: 'Die numerische Restaurant-ID aus TheFork', required: true },
    ],
    buildUrl: (c) => c.restaurantId ? `https://module.thefork.com/de_DE/module/${encodeURIComponent(c.restaurantId)}` : null,
    defaultHeight: 500,
    allowedDomains: ['module.thefork.com'],
  },
  {
    id: 'getyourguide',
    label: 'GetYourGuide',
    category: 'booking',
    icon: 'MapPin',
    fields: [
      { key: 'widgetId', label: 'Widget-ID', placeholder: '12345', help: 'Die Widget-ID aus dem GetYourGuide Partner-Dashboard', required: true },
    ],
    buildUrl: (c) => c.widgetId ? `https://widget.getyourguide.com/default/activities.frame?partner_id=${encodeURIComponent(c.widgetId)}` : null,
    defaultHeight: 500,
    allowedDomains: ['widget.getyourguide.com'],
  },

  // ─── Bewertungen ────────────────────────────────────────
  {
    id: 'jameda',
    label: 'Jameda',
    category: 'reviews',
    icon: 'Heart',
    fields: [
      { key: 'doctorId', label: 'Arzt-ID', placeholder: '12345678', help: 'Die Arzt-ID aus deiner Jameda-URL: jameda.de/[NAME]/[ID]/', required: true },
    ],
    buildUrl: (c) => c.doctorId ? `https://www.jameda.de/widget/v2/${encodeURIComponent(c.doctorId)}` : null,
    defaultHeight: 400,
    allowedDomains: ['www.jameda.de'],
  },
  {
    id: 'tripadvisor',
    label: 'TripAdvisor',
    category: 'reviews',
    icon: 'Star',
    fields: [
      { key: 'widgetUrl', label: 'Widget-URL', placeholder: 'https://www.tripadvisor.de/WidgetEmbed-...', help: 'Die embed-URL aus dem TripAdvisor Widget-Generator', required: true },
    ],
    buildUrl: (c) => c.widgetUrl || null,
    defaultHeight: 400,
    allowedDomains: ['www.tripadvisor.de', 'www.tripadvisor.com'],
  },
  {
    id: 'holidaycheck',
    label: 'HolidayCheck',
    category: 'reviews',
    icon: 'Star',
    fields: [
      { key: 'hotelId', label: 'Hotel-ID', placeholder: '123456', help: 'Die Hotel-ID aus der HolidayCheck-URL', required: true },
    ],
    buildUrl: (c) => c.hotelId ? `https://www.holidaycheck.de/wi/${encodeURIComponent(c.hotelId)}` : null,
    defaultHeight: 400,
    allowedDomains: ['www.holidaycheck.de'],
  },

  // ─── Tourismus & Karten ─────────────────────────────────
  {
    id: 'outdooractive',
    label: 'Outdooractive',
    category: 'maps',
    icon: 'Mountain',
    fields: [
      { key: 'tourId', label: 'Tour-ID', placeholder: '12345678', help: 'Die ID aus deiner Outdooractive-Tour-URL', required: true },
      { key: 'displayType', label: 'Darstellung', placeholder: 'map', help: 'map = nur Karte, info = mit Infos, full = Komplett' },
    ],
    buildUrl: (c) => c.tourId ? `https://www.outdooractive.com/de/embed/${encodeURIComponent(c.tourId)}/${c.displayType || 'map'}` : null,
    defaultHeight: 500,
    allowedDomains: ['www.outdooractive.com'],
  },
  {
    id: 'komoot',
    label: 'Komoot',
    category: 'maps',
    icon: 'Route',
    fields: [
      { key: 'tourId', label: 'Tour-ID', placeholder: '123456789', help: 'Die Tour-ID aus der Komoot-URL: komoot.de/tour/[ID]', required: true },
    ],
    buildUrl: (c) => c.tourId ? `https://www.komoot.de/tour/${encodeURIComponent(c.tourId)}/embed?share_token=auto` : null,
    defaultHeight: 600,
    allowedDomains: ['www.komoot.de', 'www.komoot.com'],
  },

  // ─── Video ─────────────────────────────────────────────
  {
    id: 'youtube',
    label: 'YouTube',
    category: 'video',
    icon: 'Play',
    fields: [
      { key: 'videoId', label: 'Video-ID', placeholder: 'dQw4w9WgXcQ', help: 'Die ID aus der YouTube-URL: youtube.com/watch?v=[ID]', required: true },
    ],
    buildUrl: (c) => c.videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(c.videoId)}` : null,
    defaultHeight: 450,
    allowedDomains: ['www.youtube-nocookie.com'],
  },
  {
    id: 'vimeo',
    label: 'Vimeo',
    category: 'video',
    icon: 'Film',
    fields: [
      { key: 'videoId', label: 'Video-ID', placeholder: '123456789', help: 'Die ID aus der Vimeo-URL: vimeo.com/[ID]', required: true },
    ],
    buildUrl: (c) => c.videoId ? `https://player.vimeo.com/video/${encodeURIComponent(c.videoId)}` : null,
    defaultHeight: 450,
    allowedDomains: ['player.vimeo.com'],
  },
  {
    id: 'spotify',
    label: 'Spotify',
    category: 'video',
    icon: 'Music',
    fields: [
      { key: 'type', label: 'Typ', placeholder: 'playlist', help: 'playlist, track, album oder episode' },
      { key: 'id', label: 'Spotify-ID', placeholder: '37i9dQZF1DXcBWIGoYBM5M', help: 'Die ID aus der Spotify-URL oder dem Teilen-Link', required: true },
    ],
    buildUrl: (c) => c.id ? `https://open.spotify.com/embed/${c.type || 'playlist'}/${encodeURIComponent(c.id)}` : null,
    defaultHeight: 380,
    allowedDomains: ['open.spotify.com'],
  },

  // ─── Formulare ──────────────────────────────────────────
  {
    id: 'typeform',
    label: 'Typeform',
    category: 'forms',
    icon: 'ClipboardList',
    fields: [
      { key: 'formId', label: 'Formular-ID', placeholder: 'abc123', help: 'Die ID aus deiner Typeform-URL (nach /to/)', required: true },
    ],
    buildUrl: (c) => c.formId ? `https://form.typeform.com/to/${encodeURIComponent(c.formId)}` : null,
    defaultHeight: 600,
    allowedDomains: ['form.typeform.com'],
  },

  // ─── Social ─────────────────────────────────────────────
  {
    id: 'instagram',
    label: 'Instagram Post',
    category: 'social',
    icon: 'Instagram',
    fields: [
      { key: 'postUrl', label: 'Post-URL', placeholder: 'https://www.instagram.com/p/ABC123/', help: 'Die vollständige URL eines Instagram-Posts (mit / am Ende)', required: true },
    ],
    buildUrl: (c) => c.postUrl ? `${c.postUrl.replace(/\/$/, '')}/embed/` : null,
    defaultHeight: 500,
    allowedDomains: ['www.instagram.com'],
  },

  // ─── Sonstige ───────────────────────────────────────────
  {
    id: 'matterport',
    label: 'Matterport (3D Tour)',
    category: 'other',
    icon: 'Box',
    fields: [
      { key: 'modelId', label: 'Model-ID', placeholder: 'SxQL3iGyvPk', help: 'Die Model-ID aus der Matterport-URL: my.matterport.com/show/?m=[ID]', required: true },
    ],
    buildUrl: (c) => c.modelId ? `https://my.matterport.com/show/?m=${encodeURIComponent(c.modelId)}` : null,
    defaultHeight: 500,
    allowedDomains: ['my.matterport.com'],
  },
];

export const EMBED_CATEGORIES = [
  { id: 'booking', label: 'Buchung & Reservierung' },
  { id: 'reviews', label: 'Bewertungen' },
  { id: 'maps', label: 'Karten & Touren' },
  { id: 'video', label: 'Video & Audio' },
  { id: 'social', label: 'Social Media' },
  { id: 'forms', label: 'Formulare' },
  { id: 'other', label: 'Sonstige' },
] as const;

/** Suggested providers per industry */
export const INDUSTRY_EMBED_SUGGESTIONS: Record<string, string[]> = {
  tradesman: ['calendly', 'youtube'],
  restaurant: ['resmio', 'thefork', 'opentable', 'instagram', 'youtube'],
  cafe: ['resmio', 'instagram', 'youtube', 'spotify'],
  bar: ['resmio', 'instagram', 'youtube', 'spotify'],
  salon: ['treatwell', 'simplybook', 'instagram'],
  tattoo: ['simplybook', 'instagram', 'youtube'],
  hotel: ['holidaycheck', 'tripadvisor', 'youtube'],
  tourism: ['getyourguide', 'outdooractive', 'komoot', 'youtube'],
  medical: ['drflex', 'doctolib', 'jameda', 'calendly'],
  consulting: ['calendly', 'youtube', 'typeform'],
  fitness: ['simplybook', 'calendly', 'instagram', 'youtube'],
  wedding: ['calendly', 'instagram', 'youtube', 'spotify'],
  photography: ['instagram', 'youtube', 'vimeo'],
  realestate: ['matterport', 'calendly', 'youtube'],
  ecommerce: ['instagram', 'youtube', 'typeform'],
};

/** Find a provider by ID */
export function getProvider(id: string): EmbedProvider | undefined {
  return EMBED_PROVIDERS.find(p => p.id === id);
}

/** Find a nav script provider by ID */
export function getNavScriptProvider(id: string): NavScriptProvider | undefined {
  return NAV_SCRIPT_PROVIDERS.find(p => p.id === id);
}
