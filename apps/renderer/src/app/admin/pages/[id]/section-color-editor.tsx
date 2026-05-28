'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Palette, ChevronDown } from 'lucide-react';

type ColorOverrides = Record<string, string>;

/* ─── All available color fields with categories ─── */
export type ColorFieldKey =
  | 'sectionBg' | 'sectionBgAlt' | 'cardBg'
  | 'headingColor' | 'subheadingColor' | 'bodyColor' | 'mutedColor'
  | 'iconColor' | 'accentColor'
  | 'btnBg' | 'btnText' | 'btnSecondaryBg' | 'btnSecondaryText'
  | 'badgeBg' | 'badgeText' | 'badgeBorder'
  | 'borderColor' | 'dividerColor'
  | 'cardRadius' | 'cardShadow' | 'buttonRadius';

type FieldType = 'color' | 'size';

const FIELD_DEFS: Record<ColorFieldKey, { cssVar: string; label: string; description: string; type?: FieldType }> = {
  sectionBg:        { cssVar: '--style-section-bg',       label: 'Hintergrund',            description: 'Hintergrundfarbe der Sektion' },
  sectionBgAlt:     { cssVar: '--style-section-bg-alt',   label: 'Hintergrund (Alt)',      description: 'Alternativer Hintergrund (z.B. für gerade/ungerade Sektionen)' },
  cardBg:           { cssVar: '--style-card-bg',          label: 'Karten-Hintergrund',     description: 'Hintergrund von Karten/Containern' },
  headingColor:     { cssVar: '--style-heading-color',    label: 'Headline',               description: 'Farbe der Hauptüberschrift' },
  subheadingColor:  { cssVar: '--style-subheading-color', label: 'Subheadline',            description: 'Farbe der Unterüberschrift' },
  bodyColor:        { cssVar: '--style-body-color',       label: 'Fließtext',              description: 'Farbe des Fließtexts' },
  mutedColor:       { cssVar: '--style-text-muted',       label: 'Dezenter Text',          description: 'Dezente Texte, Labels, Eyebrow' },
  iconColor:        { cssVar: '--style-icon-color',       label: 'Icons',                  description: 'Farbe der Icons' },
  accentColor:      { cssVar: '--style-accent-color',     label: 'Akzentfarbe',            description: 'Akzente, Linien, Hervorhebungen' },
  btnBg:            { cssVar: '--brand-btn-bg',           label: 'Button Hintergrund',     description: 'CTA-Button Hintergrund' },
  btnText:          { cssVar: '--brand-btn-text',         label: 'Button Text',            description: 'CTA-Button Textfarbe' },
  btnSecondaryBg:   { cssVar: '--brand-btn-secondary-bg', label: 'Sekundär-Button BG',    description: 'Sekundärer Button Hintergrund' },
  btnSecondaryText: { cssVar: '--brand-btn-secondary-text',label: 'Sekundär-Button Text', description: 'Sekundärer Button Textfarbe' },
  badgeBg:          { cssVar: '--style-badge-bg',         label: 'Badge/Eyebrow BG',       description: 'Badge/Eyebrow Hintergrund' },
  badgeText:        { cssVar: '--style-badge-text',       label: 'Badge/Eyebrow Text',     description: 'Badge/Eyebrow Textfarbe' },
  badgeBorder:      { cssVar: '--style-badge-border',     label: 'Badge/Eyebrow Rahmen',   description: 'Badge/Eyebrow Rahmenfarbe' },
  borderColor:      { cssVar: '--style-border-color',     label: 'Rahmenfarbe',            description: 'Rahmen/Border von Karten' },
  dividerColor:     { cssVar: '--style-divider-color',    label: 'Trennlinie',             description: 'Trennlinien zwischen Elementen' },
  cardRadius:       { cssVar: '--style-card-radius',      label: 'Karten-Radius',          description: 'Abrundung der Kartenecken', type: 'size' },
  cardShadow:       { cssVar: '--style-card-shadow',      label: 'Karten-Schatten',        description: 'Schatten der Karten', type: 'size' },
  buttonRadius:     { cssVar: '--style-button-radius',    label: 'Button-Radius',          description: 'Abrundung der Buttons', type: 'size' },
};

/* ─── Mapping: section type → relevant fields ─── */
const SECTION_FIELDS: Record<string, ColorFieldKey[]> = {
  // HANDWERK
  servicesGrid:          ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  processSteps:          ['cardBg', 'mutedColor', 'badgeBg', 'badgeText', 'headingColor'],
  textImage:             ['badgeBg', 'badgeText', 'headingColor'],
  faq:                   ['badgeBg', 'badgeText', 'headingColor'],
  testimonials:          ['badgeBg', 'badgeText', 'headingColor'],
  ctaBand:               ['sectionBg', 'headingColor', 'accentColor'],
  contact:               ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  team:                  ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  galleryGrid:           ['headingColor', 'bodyColor'],
  stats:                 ['headingColor'],
  logoCloud:             ['bodyColor'],
  newsPreview:           ['headingColor', 'bodyColor'],
  newsGrid:              ['headingColor', 'bodyColor'],
  portfolio:             ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  serviceDetail:         ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  ctaLinks:              ['headingColor', 'bodyColor'],
  map:                   ['headingColor'],
  // SHARED / PREMIUM
  additionalLocations:   ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor'],
  glowHero:              ['sectionBg', 'headingColor', 'subheadingColor', 'accentColor', 'btnBg', 'btnText', 'badgeText'],
  floristHero:           ['sectionBg', 'headingColor', 'subheadingColor', 'accentColor', 'btnBg', 'btnText', 'badgeText'],
  fitnessHero:           ['sectionBg', 'headingColor', 'subheadingColor', 'accentColor', 'btnBg', 'btnText', 'badgeText'],
  cinematicHero:         ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  spotlightCards:        ['cardBg', 'headingColor', 'bodyColor', 'iconColor', 'borderColor', 'cardRadius', 'badgeBg', 'badgeText'],
  scrollStory:           ['cardBg', 'headingColor', 'bodyColor', 'borderColor', 'cardRadius'],
  immersiveCtaBanner:    ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  proofWall:             ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'badgeBg', 'badgeText', 'borderColor'],
  editorialFeatureRail:  ['accentColor'],
  bentoGrid:             ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  testimonialMarquee:    ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  featureShowcase:       ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  beforeAfterSlider:     ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor'],
  horizontalScrollShowcase: ['sectionBg', 'bodyColor'],
  verticalTimeline:      ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'dividerColor'],
  beforeAfterStoryPro:   ['cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'badgeBg', 'badgeText'],
  signatureGrid:         ['cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor', 'borderColor'],
  comparisonCardsPro:    ['cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'badgeBg', 'badgeText'],
  premiumComparison:     ['cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'borderColor', 'cardRadius', 'badgeBg', 'badgeText'],
  offerCampaignStrip:    ['accentColor', 'btnBg', 'btnText'],
  principlesGrid:        ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor'],
  templateAdvantage:     ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'btnBg', 'btnText', 'badgeText', 'borderColor'],
  productShowcase:       ['cardBg', 'cardRadius', 'cardShadow'],
  categoryMosaic:        ['cardRadius'],
  brandShowroom:         ['cardRadius', 'buttonRadius'],
  consultationBooking:   ['cardBg', 'cardRadius', 'cardShadow', 'buttonRadius'],
  materialGallery:       ['cardRadius'],
  inspirationGrid:       ['cardRadius'],
  socialProofBar:        ['cardBg'],
  popup:                 ['cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'cardRadius', 'buttonRadius'],
  comparisonTable:       ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  timeline:              ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  videoEmbed:            ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  embed:                 ['headingColor', 'bodyColor'],
  beforeAfter:           ['cardRadius', 'cardShadow'],
  // SHOP
  // WEDDING
  coupleStory:           ['badgeBg', 'badgeText', 'headingColor'],
  eventSchedule:         ['badgeBg', 'badgeText', 'headingColor'],
  venueInfo:             ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  weddingParty:          ['badgeBg', 'badgeText', 'headingColor'],
  giftRegistry:          ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  dresscode:             ['badgeBg', 'badgeText', 'headingColor'],
  rsvp:                  ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  weddingMenu:           ['badgeBg', 'badgeText', 'headingColor'],
  faqGallery:            ['badgeBg', 'badgeText', 'headingColor'],
  // PHOTOGRAPHY
  portfolioGallery:      ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  photographerAbout:     ['badgeBg', 'badgeText', 'headingColor'],
  shootingProcess:       ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  servicePackages:       ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  // CONSULTING
  practiceAreas:         ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  feeTable:              ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  publications:          ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  // TATTOO
  tattooBookingCta:      ['btnBg', 'btnText'],
  // MEDICAL
  // RESTAURANT
  // HOTEL
  // SALON
  // TOURISM
  // CAFÉ
  // REAL ESTATE
  // FITNESS
  programGrid:           ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  courseSchedule:        ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  trainerProfiles:       ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  membershipPlans:       ['cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'badgeBg', 'badgeText'],
  trialSessionCta:       ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  transformationStories: ['cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'badgeBg', 'badgeText'],
  studioAmenities:       ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  // LOCATION
  locationHero:          ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  spaceShowcase:         ['cardBg', 'cardRadius', 'cardShadow'],
  eventTypes:            ['cardRadius'],
  availabilityCta:       ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  locationPackages:      ['cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'badgeBg', 'badgeText'],
  amenitiesGrid:         ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  floorPlanOverview:     ['badgeBg', 'badgeText', 'headingColor'],
  galleryMoodboard:      ['headingColor', 'bodyColor'],
  locationAccess:        ['headingColor'],
  hostTeam:              ['badgeBg', 'badgeText', 'headingColor', 'bodyColor'],
  // FLORIST
  bouquetShowcase:       ['cardBg', 'cardRadius', 'cardShadow'],
  occasionMosaic:        ['cardRadius'],
  weddingFloristry:      ['cardRadius', 'buttonRadius'],
  workshopBooking:       ['cardBg', 'cardRadius', 'cardShadow', 'buttonRadius'],
  seasonalCampaign:      ['accentColor', 'btnBg', 'btnText'],
  floristMaterials:      ['cardRadius'],
};

function getFieldsForSection(sectionType: string): ColorFieldKey[] {
  return SECTION_FIELDS[sectionType] ?? ['sectionBg', 'headingColor', 'bodyColor'];
}


export function SectionColorEditor({ value, onChange, sectionType, resolvedVars, iframeRef, sectionId }: { value: ColorOverrides | null; onChange: (overrides: ColorOverrides | null) => void; sectionType?: string; resolvedVars?: Record<string, string>; iframeRef?: React.RefObject<HTMLIFrameElement | null>; sectionId?: string }) {
  const [open, setOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [computedVars, setComputedVars] = useState<Record<string, string>>({});
  const probeRef = useRef<HTMLDivElement>(null);
  const overrides = value || {};
  const activeCount = Object.values(overrides).filter(Boolean).length;
  const allFields = sectionType ? getFieldsForSection(sectionType) : Object.keys(FIELD_DEFS) as ColorFieldKey[];
  
  // Split into color fields and design token fields
  const colorFields = allFields.filter(f => FIELD_DEFS[f]?.type !== 'size');
  const designFields = allFields.filter(f => FIELD_DEFS[f]?.type === 'size');

  // All CSS vars we need to read
  const allVarKeys = [
    ...allFields.map(f => FIELD_DEFS[f]?.cssVar).filter(Boolean),
    '--style-text-primary', '--style-text-secondary', '--brand-primary', '--brand-accent', '--brand-dark', '--brand-secondary',
    '--style-card-bg', '--style-section-bg', '--style-section-bg-alt', '--style-card-border', '--style-border-color',
    '--style-divider-color', '--style-text-muted', '--style-badge-bg', '--style-badge-text', '--style-badge-border',
    '--style-card-radius', '--style-card-shadow', '--style-button-radius', '--style-icon-color', '--style-accent-color',
    '--style-heading-color', '--style-subheading-color', '--style-body-color', '--brand-btn-bg', '--brand-btn-text',
    '--brand-btn-secondary-bg', '--brand-btn-secondary-text',
  ];

  const readComputedStyles = useCallback(() => {
    const result: Record<string, string> = {};

    // Strategy 1: Read from preview iframe (100% accurate)
    if (iframeRef?.current && sectionId) {
      try {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          const el = doc.querySelector(`[data-section-id="${CSS.escape(sectionId)}"]`);
          if (el) {
            const styles = getComputedStyle(el);
            for (const v of allVarKeys) {
              const val = styles.getPropertyValue(v).trim();
              if (val) result[v] = val;
            }
            if (Object.keys(result).length > 0) { setComputedVars(result); return; }
          }
        }
      } catch { /* iframe not accessible */ }
    }

    // Strategy 2: Read from local probe element (works without preview)
    if (probeRef.current) {
      const styles = getComputedStyle(probeRef.current);
      for (const v of allVarKeys) {
        const val = styles.getPropertyValue(v).trim();
        if (val) result[v] = val;
      }
    }

    setComputedVars(result);
  }, [iframeRef, sectionId, allVarKeys]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(readComputedStyles, 50);
      return () => clearTimeout(t);
    }
  }, [open, readComputedStyles]);

  // Comprehensive fallback chain for resolving display colors
  const getResolvedColor = (cssVar: string): string | undefined => {
    // 1. Computed from iframe/probe (100% accurate)
    if (computedVars[cssVar]) return computedVars[cssVar];
    // 2. From resolvedVars (style + brand combined)
    if (resolvedVars?.[cssVar]) return resolvedVars[cssVar];
    // 3. Fallback chain for vars that derive from others
    const fallbacks: Record<string, string[]> = {
      '--style-heading-color': ['--style-text-primary', '--brand-dark'],
      '--style-subheading-color': ['--style-text-secondary', '--style-text-primary'],
      '--style-body-color': ['--style-text-secondary', '--style-text-primary'],
      '--style-text-muted': ['--style-text-secondary'],
      '--style-icon-color': ['--brand-primary', '--style-accent-color', '--brand-accent'],
      '--style-accent-color': ['--brand-accent', '--brand-primary'],
      '--style-border-color': ['--style-card-border'],
      '--style-divider-color': ['--style-border-color', '--style-card-border'],
      '--brand-btn-bg': ['--brand-accent', '--brand-primary'],
      '--brand-btn-text': ['--brand-dark'],
      '--brand-btn-secondary-bg': ['--style-section-bg'],
      '--brand-btn-secondary-text': ['--brand-primary'],
      '--style-badge-bg': ['--brand-primary'],
      '--style-badge-text': ['--brand-primary'],
      '--style-badge-border': ['--brand-primary'],
      '--style-section-bg-alt': ['--style-section-bg'],
      '--style-card-bg': ['--style-section-bg'],
    };
    const chain = fallbacks[cssVar];
    if (chain) {
      for (const fb of chain) {
        const val = computedVars[fb] || resolvedVars?.[fb];
        if (val) return val;
      }
    }
    return undefined;
  };

  const handleChange = (key: string, color: string) => {
    const next = { ...overrides, [key]: color };
    // Sync related vars
    if (key === '--style-accent-color') {
      next['--brand-primary'] = color;
      next['--brand-accent'] = color;
    }
    if (key === '--style-border-color') {
      next['--style-card-border'] = `1px solid ${color}`;
    }
    Object.keys(next).forEach(k => { if (!next[k]) delete next[k]; });
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  const handleClear = (key: string) => {
    const next = { ...overrides };
    delete next[key];
    if (key === '--style-accent-color') {
      delete next['--brand-primary'];
      delete next['--brand-accent'];
    }
    if (key === '--style-border-color') {
      delete next['--style-card-border'];
    }
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  function renderColorField(fieldKey: ColorFieldKey) {
    const def = FIELD_DEFS[fieldKey];
    if (!def) return null;
    const currentOverride = overrides[def.cssVar]
      || (def.cssVar === '--style-accent-color' ? overrides['--brand-primary'] : '')
      || (def.cssVar === '--style-border-color' ? (overrides['--style-card-border'] || '').replace(/^1px solid\s+/, '') : '')
      || '';
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
  }

  function renderDesignField(fieldKey: ColorFieldKey) {
    const def = FIELD_DEFS[fieldKey];
    if (!def) return null;
    const currentOverride = overrides[def.cssVar] || '';
    const resolved = computedVars[def.cssVar] || resolvedVars?.[def.cssVar] || '';
    return (
      <label key={fieldKey} className="block">
        <span className="text-gray-600 text-xs" title={def.description}>{def.label}</span>
        <div className="flex items-center gap-2 mt-1">
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
  }

  return (
    <details className="mt-4" open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary className="text-xs text-gray-500 cursor-pointer flex items-center gap-1">
        <Palette size={12} /> Farben anpassen
        {activeCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium">{activeCount}</span>}
      </summary>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {colorFields.map(renderColorField)}
      </div>
      {designFields.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-100">
          <button type="button" className="text-xs text-zinc-500 flex items-center gap-1 mb-2" onClick={() => setShowAdvanced(!showAdvanced)}>
            <ChevronDown size={12} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            Design-Tokens (Radius, Schatten)
          </button>
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {designFields.map(renderDesignField)}
            </div>
          )}
        </div>
      )}
      {activeCount > 0 && (
        <button type="button" className="mt-3 text-xs text-red-500 hover:text-red-700" onClick={() => onChange(null)}>
          Alle Farb-Overrides entfernen
        </button>
      )}
      {/* Hidden probe element to read computed CSS vars without needing the preview iframe */}
      {open && <div ref={probeRef} data-style="" style={resolvedVars as React.CSSProperties} className="hidden" aria-hidden="true" />}
    </details>
  );
}
