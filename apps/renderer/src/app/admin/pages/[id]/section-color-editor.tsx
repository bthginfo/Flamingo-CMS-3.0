'use client';

import { useState } from 'react';
import { Palette } from 'lucide-react';

type ColorOverrides = Record<string, string>;

/* ─── All available color fields with categories ─── */
export type ColorFieldKey =
  | 'sectionBg' | 'cardBg'
  | 'headingColor' | 'subheadingColor' | 'bodyColor' | 'mutedColor'
  | 'iconColor' | 'accentColor'
  | 'btnBg' | 'btnText'
  | 'badgeBg' | 'badgeText'
  | 'borderColor' | 'dividerColor';

const FIELD_DEFS: Record<ColorFieldKey, { cssVar: string; label: string; description: string }> = {
  sectionBg:      { cssVar: '--style-section-bg',       label: 'Hintergrund',        description: 'Hintergrundfarbe der Sektion' },
  cardBg:         { cssVar: '--style-card-bg',          label: 'Karten-Hintergrund', description: 'Hintergrund von Karten/Containern' },
  headingColor:   { cssVar: '--style-heading-color',    label: 'Headline',           description: 'Farbe der Hauptüberschrift' },
  subheadingColor:{ cssVar: '--style-subheading-color', label: 'Subheadline',        description: 'Farbe der Unterüberschrift' },
  bodyColor:      { cssVar: '--style-body-color',       label: 'Fließtext',          description: 'Farbe des Fließtexts' },
  mutedColor:     { cssVar: '--style-text-muted',       label: 'Dezenter Text',      description: 'Dezente Texte, Labels' },
  iconColor:      { cssVar: '--style-icon-color',       label: 'Icons',              description: 'Farbe der Icons' },
  accentColor:    { cssVar: '--brand-primary',          label: 'Akzentfarbe',        description: 'Akzente, Linien, Hervorhebungen' },
  btnBg:          { cssVar: '--brand-btn-bg',           label: 'Button Hintergrund', description: 'CTA-Button Hintergrund' },
  btnText:        { cssVar: '--brand-btn-text',         label: 'Button Text',        description: 'CTA-Button Textfarbe' },
  badgeBg:        { cssVar: '--style-badge-bg',         label: 'Badge Hintergrund',  description: 'Badge/Label Hintergrund' },
  badgeText:      { cssVar: '--style-badge-text',       label: 'Badge Text',         description: 'Badge/Label Textfarbe' },
  borderColor:    { cssVar: '--style-border-color',     label: 'Rahmenfarbe',        description: 'Rahmen/Border von Karten' },
  dividerColor:   { cssVar: '--style-divider-color',    label: 'Trennlinie',         description: 'Trennlinien zwischen Elementen' },
};

/* ─── Mapping: section type → relevant fields ─── */
const ALWAYS: ColorFieldKey[] = ['sectionBg'];

const SECTION_FIELDS: Record<string, ColorFieldKey[]> = {
  // SHARED
  hero:              ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  servicesGrid:      ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'iconColor', 'accentColor', 'badgeBg', 'badgeText', 'borderColor'],
  processSteps:      ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'iconColor', 'badgeBg', 'badgeText', 'borderColor', 'dividerColor'],
  textImage:         ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  faq:               ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor', 'accentColor', 'borderColor', 'badgeBg', 'badgeText'],
  testimonials:      ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'borderColor', 'badgeBg', 'badgeText'],
  ctaBand:           ['sectionBg', 'headingColor', 'bodyColor', 'btnBg', 'btnText'],
  contact:           ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'borderColor'],
  team:              ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'borderColor', 'badgeBg', 'badgeText'],
  galleryGrid:       ['sectionBg', 'headingColor', 'subheadingColor', 'badgeBg', 'badgeText'],
  stats:             ['sectionBg', 'headingColor', 'bodyColor', 'accentColor'],
  statsCounter:      ['sectionBg', 'headingColor', 'bodyColor', 'accentColor'],
  logoCloud:         ['sectionBg', 'headingColor', 'mutedColor'],
  logoMarquee:       ['sectionBg', 'headingColor', 'mutedColor'],
  uspStrip:          ['sectionBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor'],
  newsPreview:       ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'borderColor', 'badgeBg', 'badgeText'],
  newsGrid:          ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'borderColor'],
  portfolio:         ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'borderColor', 'badgeBg', 'badgeText'],
  serviceDetail:     ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'borderColor'],
  servicePackages:   ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'badgeBg', 'badgeText'],
  comparisonTable:   ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'borderColor'],
  socialProofBar:    ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'borderColor'],
  timeline:          ['sectionBg', 'headingColor', 'bodyColor', 'accentColor', 'iconColor', 'dividerColor'],
  bentoGrid:         ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'borderColor'],
  testimonialMarquee:['sectionBg', 'cardBg', 'bodyColor', 'mutedColor', 'borderColor'],
  featureShowcase:   ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'iconColor', 'accentColor', 'borderColor'],
  richText:          ['sectionBg', 'headingColor', 'bodyColor', 'accentColor'],
  freeText:          ['sectionBg', 'headingColor', 'bodyColor'],
  legalContent:      ['sectionBg', 'headingColor', 'bodyColor'],
  videoEmbed:        ['sectionBg', 'headingColor', 'subheadingColor'],
  embed:             ['sectionBg'],
  noticeBanner:      ['sectionBg', 'headingColor', 'bodyColor', 'iconColor', 'btnBg', 'btnText'],
  collectionHero:    ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor', 'badgeBg', 'badgeText'],
  ctaLinks:          ['sectionBg', 'headingColor', 'accentColor'],
  headerBanner:      ['sectionBg', 'headingColor', 'bodyColor'],
  map:               ['sectionBg', 'headingColor'],
  // RESTAURANT
  menu:              ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'accentColor', 'borderColor', 'badgeBg', 'badgeText'],
  signatureDishes:   ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'badgeBg', 'badgeText'],
  reservation:       ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'btnBg', 'btnText', 'borderColor'],
  openingHours:      ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'borderColor'],
  ambience:          ['sectionBg', 'headingColor', 'bodyColor'],
  events:            ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  // HOTEL
  bookingStrip:      ['sectionBg', 'headingColor', 'btnBg', 'btnText'],
  roomShowcase:      ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'badgeBg', 'badgeText'],
  offers:            ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  amenities:         ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor'],
  wellness:          ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'btnBg', 'btnText'],
  location:          ['sectionBg', 'headingColor', 'bodyColor', 'iconColor'],
  hotelDining:       ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor'],
  eventSpaces:       ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'iconColor'],
  gallery:           ['sectionBg', 'headingColor', 'subheadingColor'],
  // SALON
  serviceMenu:       ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'borderColor', 'badgeBg', 'badgeText'],
  priceList:         ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'borderColor'],
  treatmentDetail:   ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'iconColor', 'btnBg', 'btnText'],
  packages:          ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'badgeBg', 'badgeText'],
  teamShowcase:      ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor'],
  expertiseGrid:     ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor'],
  beforeAfter:       ['sectionBg', 'headingColor', 'bodyColor', 'accentColor'],
  bookingCta:        ['sectionBg', 'headingColor', 'bodyColor', 'btnBg', 'btnText'],
  locationContact:   ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor'],
  // MEDICAL
  serviceOverview:   ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor', 'borderColor', 'badgeBg', 'badgeText'],
  diagnostics:       ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor'],
  doctorTeam:        ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor'],
  practiceTeam:      ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor'],
  certifications:    ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor'],
  patientInfo:       ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor'],
  insuranceInfo:     ['sectionBg', 'cardBg', 'headingColor', 'bodyColor'],
  downloadForms:     ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor'],
  appointmentCta:    ['sectionBg', 'headingColor', 'bodyColor', 'btnBg', 'btnText'],
  emergencyInfo:     ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor'],
  practiceGallery:   ['sectionBg', 'headingColor', 'subheadingColor'],
  equipmentHighlights:['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor'],
  valuesGrid:        ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor'],
  // TOURISM
  destinationHighlights:['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText'],
  experienceGrid:    ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor', 'badgeBg', 'badgeText'],
  seasonTeaser:      ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText'],
  eventsCalendar:    ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'badgeBg', 'badgeText'],
  placesMap:         ['sectionBg', 'headingColor', 'bodyColor'],
  sightseeingList:   ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor'],
  tourRoutes:        ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText'],
  accommodationGrid: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText'],
  visitorInfo:       ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor'],
  downloadGuides:    ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor'],
  tourismContact:    ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'btnBg', 'btnText'],
  // WEDDING
  coupleStory:       ['sectionBg', 'headingColor', 'bodyColor', 'accentColor'],
  eventSchedule:     ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor', 'dividerColor'],
  venueInfo:         ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor'],
  travelInfo:        ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor'],
  weddingParty:      ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor'],
  giftRegistry:      ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'btnBg', 'btnText'],
  dresscode:         ['sectionBg', 'headingColor', 'bodyColor'],
  rsvp:              ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'btnBg', 'btnText'],
  weddingMenu:       ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'borderColor'],
  // PHOTOGRAPHY
  portfolioGallery:  ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor'],
  photographerAbout: ['sectionBg', 'headingColor', 'bodyColor', 'accentColor'],
  shootingProcess:   ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor', 'dividerColor'],
  // CONSULTING
  practiceAreas:     ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor', 'borderColor'],
  caseResults:       ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'badgeBg', 'badgeText'],
  feeTable:          ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'borderColor'],
  publications:      ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor'],
  // REAL ESTATE
  propertyShowcase:  ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  propertySearch:    ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'btnBg', 'btnText'],
  marketReport:      ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor'],
  agentTeam:         ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor'],
  valuationCta:      ['sectionBg', 'headingColor', 'bodyColor', 'btnBg', 'btnText'],
  referencesSold:    ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'badgeBg', 'badgeText'],
  locationHighlight: ['sectionBg', 'headingColor', 'bodyColor', 'iconColor'],
  // CAFÉ
  drinkMenu:         ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'borderColor'],
  foodMenu:          ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'borderColor'],
  atmosphereGallery: ['sectionBg', 'headingColor', 'subheadingColor'],
  dailySpecials:     ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'badgeBg', 'badgeText'],
  cafeEventCalendar: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText'],
  locationVibe:      ['sectionBg', 'headingColor', 'bodyColor', 'iconColor'],
  // TATTOO
  styleGallery:      ['sectionBg', 'headingColor', 'bodyColor', 'accentColor'],
  artistGrid:        ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor'],
  artistHero:        ['sectionBg', 'headingColor', 'bodyColor', 'accentColor', 'badgeBg', 'badgeText'],
  tattooBookingCta:  ['sectionBg', 'headingColor', 'bodyColor', 'btnBg', 'btnText'],
  pricingInfo:       ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'borderColor'],
  tattooBooking:     ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'btnBg', 'btnText'],
  flashDayBanner:    ['sectionBg', 'headingColor', 'bodyColor', 'btnBg', 'btnText', 'accentColor'],
  aftercareSteps:    ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor', 'dividerColor'],
};

function getFieldsForSection(sectionType: string): ColorFieldKey[] {
  return SECTION_FIELDS[sectionType] || ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'dividerColor'];
}

export function SectionColorEditor({ value, onChange, sectionType, resolvedVars }: { value: ColorOverrides | null; onChange: (overrides: ColorOverrides | null) => void; sectionType?: string; resolvedVars?: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const overrides = value || {};
  const activeCount = Object.values(overrides).filter(Boolean).length;
  const fields = sectionType ? getFieldsForSection(sectionType) : Object.keys(FIELD_DEFS) as ColorFieldKey[];

  const getResolvedColor = (cssVar: string): string | undefined => {
    if (!resolvedVars) return undefined;
    if (resolvedVars[cssVar]) return resolvedVars[cssVar];
    // Fallback chain for granular vars
    const fallbacks: Record<string, string> = {
      '--style-heading-color': '--style-text-primary',
      '--style-subheading-color': '--style-text-secondary',
      '--style-body-color': '--style-text-secondary',
      '--style-icon-color': '--brand-primary',
      '--style-border-color': '--style-card-border',
      '--style-divider-color': '--style-card-border',
      '--brand-btn-bg': '--brand-accent',
      '--brand-btn-text': '--brand-dark',
    };
    const fb = fallbacks[cssVar];
    return fb ? resolvedVars[fb] || undefined : undefined;
  };

  const handleChange = (key: string, color: string) => {
    const next = { ...overrides, [key]: color };
    Object.keys(next).forEach(k => { if (!next[k]) delete next[k]; });
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  const handleClear = (key: string) => {
    const next = { ...overrides };
    delete next[key];
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  return (
    <details className="mt-4" open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary className="text-xs text-gray-500 cursor-pointer flex items-center gap-1">
        <Palette size={12} /> Farben anpassen
        {activeCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium">{activeCount}</span>}
      </summary>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {fields.map((fieldKey) => {
          const def = FIELD_DEFS[fieldKey];
          if (!def) return null;
          const currentOverride = overrides[def.cssVar] || '';
          const resolved = getResolvedColor(def.cssVar);
          const displayColor = currentOverride || resolved || '';
          return (
            <label key={fieldKey} className="block">
              <span className="text-gray-600 text-xs" title={def.description}>{def.label}</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="relative">
                  <input
                    type="color"
                    className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0"
                    value={displayColor || '#000000'}
                    onChange={(e) => handleChange(def.cssVar, e.target.value)}
                  />
                  {!currentOverride && resolved && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white" style={{ background: resolved }} title={`Aktuell: ${resolved}`} />
                  )}
                </div>
                <input
                  type="text"
                  className="admin-input flex-1 text-xs font-mono"
                  placeholder={resolved || '—'}
                  value={currentOverride}
                  onChange={(e) => handleChange(def.cssVar, e.target.value)}
                />
                {currentOverride && (
                  <button type="button" className="text-xs text-red-400 hover:text-red-600" onClick={() => handleClear(def.cssVar)}>✕</button>
                )}
              </div>
            </label>
          );
        })}
      </div>
      {activeCount > 0 && (
        <button type="button" className="mt-3 text-xs text-red-500 hover:text-red-700" onClick={() => onChange(null)}>
          Alle Farb-Overrides entfernen
        </button>
      )}
    </details>
  );
}
