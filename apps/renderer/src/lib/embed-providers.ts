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
  icon: string; // Lucide icon name
  fields: ProviderField[];
  buildUrl: (config: Record<string, string>) => string | null;
  defaultHeight: number;
  allowedDomains: string[]; // For CSP / validation
};

export const EMBED_PROVIDERS: EmbedProvider[] = [
  // ─── Buchung ────────────────────────────────────────────
  {
    id: 'doctolib',
    label: 'Doctolib',
    category: 'booking',
    icon: 'CalendarCheck',
    fields: [
      { key: 'slug', label: 'Praxis-Slug', placeholder: 'dr-mueller-berlin', help: 'Dein Slug aus der Doctolib-URL: doctolib.de/praxis/[DEIN-SLUG]', required: true },
    ],
    buildUrl: (c) => c.slug ? `https://www.doctolib.de/booking/availabilities?practitioner_slug=${encodeURIComponent(c.slug)}` : null,
    defaultHeight: 600,
    allowedDomains: ['www.doctolib.de'],
  },
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

  // ─── Bewertungen ────────────────────────────────────────
  {
    id: 'provenexpert',
    label: 'ProvenExpert',
    category: 'reviews',
    icon: 'Star',
    fields: [
      { key: 'profileId', label: 'Profil-ID / Slug', placeholder: 'mueller-sanitaer', help: 'Dein ProvenExpert-Profil-Slug aus provenexpert.com/[SLUG]', required: true },
    ],
    buildUrl: (c) => c.profileId ? `https://www.provenexpert.com/widget/richsnippet?id=${encodeURIComponent(c.profileId)}` : null,
    defaultHeight: 300,
    allowedDomains: ['www.provenexpert.com'],
  },
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
    id: 'google-reviews',
    label: 'Google Bewertungen',
    category: 'reviews',
    icon: 'MessageSquare',
    fields: [
      { key: 'placeId', label: 'Google Place-ID', placeholder: 'ChIJ...', help: 'Finde deine Place-ID unter: developers.google.com/maps/documentation/places/web-service/place-id-lookup', required: true },
    ],
    buildUrl: (c) => c.placeId ? `https://www.google.com/maps/embed/v1/place?key=GOOGLE_MAPS_KEY&q=place_id:${encodeURIComponent(c.placeId)}` : null,
    defaultHeight: 400,
    allowedDomains: ['www.google.com'],
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

  // ─── Hotel & Buchungsportale ────────────────────────────
  {
    id: 'booking',
    label: 'Booking.com',
    category: 'booking',
    icon: 'BedDouble',
    fields: [
      { key: 'hotelId', label: 'Hotel-ID', placeholder: '123456', help: 'Deine Booking.com Hotel-ID aus dem Extranet/Partner-Bereich', required: true },
    ],
    buildUrl: (c) => c.hotelId ? `https://www.booking.com/hotel/de/.de.html?aid=304142&dest_id=${encodeURIComponent(c.hotelId)}` : null,
    defaultHeight: 400,
    allowedDomains: ['www.booking.com'],
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
      { key: 'postUrl', label: 'Post-URL', placeholder: 'https://www.instagram.com/p/ABC123/', help: 'Die vollständige URL eines Instagram-Posts', required: true },
    ],
    buildUrl: (c) => c.postUrl ? `${c.postUrl}embed` : null,
    defaultHeight: 500,
    allowedDomains: ['www.instagram.com'],
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

export function getProvider(id: string): EmbedProvider | undefined {
  return EMBED_PROVIDERS.find(p => p.id === id);
}
