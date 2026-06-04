'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Palette, ChevronDown } from 'lucide-react';
import { getAllSectionContracts, type SectionColorSlot } from '@/lib/section-contracts';

type ColorOverrides = Record<string, string>;

/* ─── Color helpers: rgba ⇆ hex parsing with alpha channel (Phase 4b) ─── */
function clamp01(n: number): number { return Math.max(0, Math.min(1, n)); }
function toHex2(n: number): string { return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0'); }

export function parseColorWithAlpha(value: string | undefined): { hex: string; alpha: number | undefined } {
  if (!value) return { hex: '', alpha: undefined };
  const v = value.trim();
  // rgba(r,g,b,a) / rgb(r,g,b)
  const rgba = v.match(/^rgba?\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*(?:,\s*(-?\d+(?:\.\d+)?)\s*)?\)$/i);
  if (rgba) {
    const r = Number(rgba[1]); const g = Number(rgba[2]); const b = Number(rgba[3]);
    const a = rgba[4] !== undefined ? clamp01(Number(rgba[4])) : 1;
    return { hex: `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`, alpha: a };
  }
  // #rgb / #rgba / #rrggbb / #rrggbbaa
  const hex = v.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length === 4) h = h.split('').map((c) => c + c).join('');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const a = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return { hex: `#${h.slice(0, 6).toLowerCase()}`, alpha: a };
  }
  return { hex: '', alpha: undefined };
}

export function composeColorWithAlpha(hex: string, alpha: number | undefined): string {
  const a = alpha === undefined ? 1 : clamp01(alpha);
  const clean = hex.startsWith('#') ? hex.slice(1) : hex;
  if (clean.length !== 6) return hex;
  if (a >= 0.999) return `#${clean.toLowerCase()}`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
}

/* ─── All available color fields with categories ─── */
export type ColorFieldKey =
  | 'sectionBg' | 'sectionBgAlt' | 'cardBg'
  | 'headingColor' | 'subheadingColor' | 'bodyColor' | 'mutedColor'
  | 'textPrimary' | 'textSecondary'
  | 'imageTextColor'
  | 'iconColor' | 'accentColor'
  | 'styleBrand' | 'brandPrimary' | 'brandAccent' | 'colorPrimary'
  | 'eyebrow' | 'statValue' | 'quoteMark' | 'ratingStar' | 'check'
  | 'onDarkHeading' | 'onDarkBody' | 'onDarkMuted'
  | 'btnBg' | 'btnText' | 'btnSecondaryBg' | 'btnSecondaryText'
  | 'badgeBg' | 'badgeText' | 'badgeBorder'
  | 'imageOverlay'
  | 'borderColor' | 'dividerColor' | 'cardBorder' | 'cardBorderColor'
  | 'cardRadius' | 'cardShadow' | 'buttonRadius' | 'headingWeight' | 'headingTracking';

type FieldType = 'color' | 'size';

const FIELD_DEFS: Record<ColorFieldKey, { cssVar: string; label: string; description: string; type?: FieldType }> = {
  sectionBg:        { cssVar: '--style-section-bg',       label: 'Hintergrund',            description: 'Hintergrundfarbe der Sektion' },
  sectionBgAlt:     { cssVar: '--style-section-bg-alt',   label: 'Sekundärer Hintergrund', description: 'Nur für Sections mit einem zweiten sichtbaren Hintergrund-Layer' },
  cardBg:           { cssVar: '--style-card-bg',          label: 'Karten-Hintergrund',     description: 'Hintergrund von Karten/Containern' },
  headingColor:     { cssVar: '--style-heading-color',    label: 'Headline',               description: 'Farbe der Hauptüberschrift' },
  subheadingColor:  { cssVar: '--style-subheading-color', label: 'Subheadline',            description: 'Farbe der Unterüberschrift' },
  bodyColor:        { cssVar: '--style-body-color',       label: 'Fließtext',              description: 'Farbe des Fließtexts' },
  mutedColor:       { cssVar: '--style-text-muted',       label: 'Dezenter Text',          description: 'Dezente Texte, Labels, Eyebrow' },
  textPrimary:      { cssVar: '--style-text-primary',     label: 'Primärer Text',          description: 'Primär-Textfarbe innerhalb dieser Section' },
  textSecondary:    { cssVar: '--style-text-secondary',   label: 'Sekundärer Text',        description: 'Sekundär-Textfarbe innerhalb dieser Section' },
  imageTextColor:   { cssVar: '--style-image-text-color', label: 'Bild-Text',              description: 'Textfarbe für Texte direkt auf Bildern oder Overlays' },
  iconColor:        { cssVar: '--style-icon-color',       label: 'Icons',                  description: 'Farbe der Icons' },
  accentColor:      { cssVar: '--style-accent-color',     label: 'Akzentfarbe',            description: 'Akzente, Linien, Hervorhebungen' },
  styleBrand:       { cssVar: '--style-brand',            label: 'Brand-Akzent',           description: 'Section-spezifischer Markenakzent' },
  brandPrimary:     { cssVar: '--brand-primary',          label: 'Primärer Markenwert',    description: 'Primärer Markenwert innerhalb dieser Section' },
  brandAccent:      { cssVar: '--brand-accent',           label: 'Marken-Akzentwert',      description: 'Akzentwert innerhalb dieser Section' },
  colorPrimary:     { cssVar: '--color-primary',          label: 'Primärfarbe',            description: 'Primärfarbe für ältere Templates' },
  // ─── Layer-2 slot fields (Phase 4) — granular per-role overrides ───
  eyebrow:          { cssVar: '--token-eyebrow',          label: 'Eyebrow / Kicker',       description: 'Kleine Label-Texte über der Überschrift (in migrierten Sections)' },
  statValue:        { cssVar: '--token-stat-value',       label: 'Statistik-Wert',         description: 'Große Zahlenwerte (Stats, Metrics) in migrierten Sections' },
  quoteMark:        { cssVar: '--token-quote',            label: 'Anführungszeichen',      description: 'Anführungszeichen-Glyph in Testimonial-Karten' },
  ratingStar:       { cssVar: '--token-rating-star',      label: 'Rating-Sterne',          description: 'Sterne in Reviews / Bewertungen' },
  check:            { cssVar: '--token-check',            label: 'Checkmarks',             description: 'Häkchen in Feature-/Vergleichs-Listen' },
  // ─── Layer-2 inverse tokens (Phase 5c) — for content on DARK backgrounds ───
  onDarkHeading:    { cssVar: '--token-on-dark-heading', label: 'Headline (auf Dunkel)', description: 'Hauptüberschrift wenn auf dunklem Hintergrund (Hero, CTA, dunkle Sections)' },
  onDarkBody:       { cssVar: '--token-on-dark-body',    label: 'Fließtext (auf Dunkel)', description: 'Fließtext wenn auf dunklem Hintergrund' },
  onDarkMuted:      { cssVar: '--token-on-dark-muted',   label: 'Dezent (auf Dunkel)',    description: 'Dezenter / abgeschwächter Text auf dunklem Hintergrund' },
  btnBg:            { cssVar: '--brand-btn-bg',           label: 'Button Hintergrund',     description: 'CTA-Button Hintergrund' },
  btnText:          { cssVar: '--brand-btn-text',         label: 'Button Text',            description: 'CTA-Button Textfarbe' },
  btnSecondaryBg:   { cssVar: '--brand-btn-secondary-bg', label: 'Sekundär-Button BG',    description: 'Sekundärer Button Hintergrund' },
  btnSecondaryText: { cssVar: '--brand-btn-secondary-text',label: 'Sekundär-Button Text', description: 'Sekundärer Button Textfarbe' },
  badgeBg:          { cssVar: '--style-badge-bg',         label: 'Badge/Eyebrow BG',       description: 'Badge/Eyebrow Hintergrund' },
  badgeText:        { cssVar: '--style-badge-text',       label: 'Badge/Eyebrow Text',     description: 'Badge/Eyebrow Textfarbe' },
  badgeBorder:      { cssVar: '--style-badge-border',     label: 'Badge/Eyebrow Rahmen',   description: 'Badge/Eyebrow Rahmenfarbe' },
  imageOverlay:     { cssVar: '--style-image-overlay',    label: 'Bild-Overlay',           description: 'Abdunklung/Farbfläche über Bildern und Medien' },
  borderColor:      { cssVar: '--style-border-color',     label: 'Rahmenfarbe',            description: 'Rahmen/Border von Karten' },
  dividerColor:     { cssVar: '--style-divider-color',    label: 'Trennlinie',             description: 'Trennlinien zwischen Elementen' },
  cardBorder:       { cssVar: '--style-card-border',      label: 'Karten-Rahmen',          description: 'Kompletter Border-Wert für Karten', type: 'size' },
  cardBorderColor:  { cssVar: '--style-card-border-color',label: 'Karten-Rahmenfarbe',     description: 'Rahmenfarbe für Karten' },
  cardRadius:       { cssVar: '--style-card-radius',      label: 'Karten-Radius',          description: 'Abrundung der Kartenecken', type: 'size' },
  cardShadow:       { cssVar: '--style-card-shadow',      label: 'Karten-Schatten',        description: 'Schatten der Karten', type: 'size' },
  buttonRadius:     { cssVar: '--style-button-radius',    label: 'Button-Radius',          description: 'Abrundung der Buttons', type: 'size' },
  headingWeight:    { cssVar: '--style-heading-weight',   label: 'Headline-Stärke',        description: 'Font-Weight der Headline', type: 'size' },
  headingTracking:  { cssVar: '--style-heading-tracking', label: 'Headline-Laufweite',     description: 'Letter-Spacing der Headline', type: 'size' },
};

/* ─── Mapping: section type → relevant fields ─── */
const SECTION_FIELDS: Record<string, ColorFieldKey[]> = {
  additionalLocations: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  accommodationGrid: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  amenitiesGrid: ['cardBg', 'headingColor', 'bodyColor', 'iconColor', 'borderColor', 'textPrimary', 'textSecondary', 'colorPrimary'],
  appointmentCta: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  availabilityCta: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  beforeAfter: ['sectionBg', 'sectionBgAlt', 'cardBg', 'accentColor', 'cardRadius', 'cardShadow', 'textPrimary', 'textSecondary', 'brandPrimary', 'headingWeight', 'headingTracking'],
  beforeAfterSlider: ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  beforeAfterStoryPro: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'eyebrow', 'check', 'statValue', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'textPrimary', 'brandPrimary'],
  bentoGrid: ['cardBg', 'headingColor', 'bodyColor', 'iconColor', 'borderColor', 'textPrimary', 'textSecondary', 'colorPrimary'],
  bouquetShowcase: ['sectionBg', 'cardBg', 'mutedColor', 'cardRadius', 'cardShadow', 'textPrimary', 'textSecondary', 'brandPrimary', 'cardBorder', 'headingWeight', 'headingTracking'],
  brandShowroom: ['cardBg', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'brandPrimary'],
  categoryMosaic: ['sectionBg', 'cardRadius', 'textPrimary', 'textSecondary', 'styleBrand', 'brandPrimary', 'headingWeight', 'headingTracking'],
  cinematicHero: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'badgeBorder', 'borderColor', 'textPrimary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  collectionHero: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'iconColor', 'accentColor', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  collectionList: ['cardBg', 'mutedColor', 'borderColor', 'textSecondary', 'styleBrand'],
  comparisonCardsPro: ['cardBg', 'bodyColor', 'mutedColor', 'eyebrow', 'check', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'textPrimary', 'brandPrimary'],
  comparisonTable: ['mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary', 'colorPrimary'],
  consultationBooking: ['sectionBg', 'cardBg', 'cardRadius', 'cardShadow', 'buttonRadius', 'textPrimary', 'textSecondary', 'brandPrimary', 'headingWeight', 'headingTracking', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  contact: ['sectionBgAlt', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  courseSchedule: ['sectionBg', 'borderColor', 'textPrimary', 'textSecondary', 'colorPrimary'],
  ctaBand: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'badgeBorder', 'borderColor', 'textPrimary', 'brandPrimary', 'brandAccent', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  ctaLinks: ['sectionBgAlt', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  deliveryTimeline: ['textPrimary', 'textSecondary', 'brandPrimary', 'headingWeight', 'headingTracking'],
  destinationHighlights: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  diagnostics: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  doctorTeam: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  downloadForms: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  emergencyInfo: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  editorialFeatureRail: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'imageTextColor', 'textPrimary', 'textSecondary', 'eyebrow', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'brandPrimary'],
  embed: ['mutedColor', 'brandPrimary'],
  eventTypes: ['sectionBg', 'cardRadius', 'textPrimary', 'textSecondary', 'styleBrand', 'brandPrimary', 'headingWeight', 'headingTracking'],
  equipmentHighlights: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  experienceGrid: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  faq: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'brandAccent'],
  featureShowcase: ['sectionBg', 'textPrimary', 'textSecondary', 'colorPrimary'],
  fitnessHero: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  floorPlanOverview: ['sectionBg', 'cardBg', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  floristHero: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  floristMaterials: ['sectionBg', 'cardBg', 'borderColor', 'cardRadius', 'textPrimary', 'textSecondary', 'brandPrimary', 'headingWeight', 'headingTracking'],
  freeText: ['accentColor'],
  galleryGrid: ['sectionBg', 'sectionBgAlt', 'textPrimary'],
  galleryMoodboard: ['sectionBg', 'sectionBgAlt', 'textPrimary'],
  glowHero: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'eyebrow', 'statValue', 'accentColor', 'btnBg', 'btnText', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  headerBanner: ['sectionBg', 'accentColor', 'textPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  hero: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'badgeBorder', 'borderColor', 'textPrimary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  heroEcommerce: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  heroHandwerk: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  horizontalScrollShowcase: ['sectionBg', 'bodyColor', 'brandPrimary'],
  hostTeam: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'brandAccent'],
  immersiveCtaBanner: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'statValue', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  inspirationGrid: ['sectionBg', 'sectionBgAlt', 'cardRadius', 'textPrimary', 'textSecondary', 'styleBrand', 'brandPrimary', 'headingWeight', 'headingTracking'],
  legalContent: ['accentColor', 'textPrimary'],
  locationAccess: ['sectionBg', 'cardBg', 'headingColor', 'mutedColor', 'borderColor', 'textPrimary', 'textSecondary'],
  locationHero: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'badgeBorder', 'borderColor', 'textPrimary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  locationPackages: ['cardBg', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'textPrimary', 'brandPrimary'],
  logoCloud: ['textSecondary'],
  logoMarquee: ['sectionBg', 'mutedColor'],
  map: ['sectionBg', 'cardBg', 'headingColor', 'mutedColor', 'borderColor', 'textPrimary', 'textSecondary'],
  placesMap: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  materialGallery: ['sectionBg', 'cardBg', 'borderColor', 'cardRadius', 'textPrimary', 'textSecondary', 'brandPrimary', 'headingWeight', 'headingTracking'],
  membershipPlans: ['cardBg', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'textPrimary', 'brandPrimary'],
  newsGrid: ['headingColor', 'mutedColor', 'accentColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  newsPreview: ['headingColor', 'mutedColor', 'accentColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  noticeBanner: ['brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  occasionMosaic: ['sectionBg', 'cardRadius', 'textPrimary', 'textSecondary', 'styleBrand', 'brandPrimary', 'headingWeight', 'headingTracking'],
  offerCampaignStrip: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'eyebrow', 'check', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  openingHours: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  popup: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'eyebrow', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'textSecondary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  bookingWidget: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'textSecondary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  bookingSlotPicker: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'textSecondary'],
  bookingDateRange: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'textSecondary'],
  availabilityCalendar: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'textSecondary'],
  resourceBookingShowcase: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'textSecondary'],
  bookingCtaPro: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'textSecondary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  portfolio: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'imageOverlay', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  premiumComparison: ['cardBg', 'headingColor', 'mutedColor', 'borderColor', 'cardRadius', 'textPrimary', 'brandPrimary'],
  principlesGrid: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'iconColor', 'eyebrow', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'brandPrimary'],
  processSteps: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'brandAccent'],
  productShowcase: ['sectionBg', 'cardBg', 'mutedColor', 'cardRadius', 'cardShadow', 'textPrimary', 'textSecondary', 'brandPrimary', 'cardBorder', 'headingWeight', 'headingTracking'],
  programGrid: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'brandAccent'],
  proofWall: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'quoteMark', 'ratingStar', 'statValue', 'accentColor', 'badgeBg', 'borderColor', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  richText: ['accentColor'],
  scrollStory: ['cardBg', 'headingColor', 'bodyColor', 'borderColor', 'cardRadius', 'textPrimary', 'textSecondary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  seasonalCampaign: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  serviceDetail: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'brandAccent'],
  serviceOverview: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  servicesGrid: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'brandAccent'],
  shopCart: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  shopCategoryOverview: ['sectionBgAlt', 'cardBg', 'mutedColor', 'borderColor', 'textSecondary'],
  shopCheckout: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  shopFeaturedProducts: ['sectionBg', 'mutedColor', 'borderColor'],
  shopProductDetail: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  shopProductGrid: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  shopThankYou: ['sectionBg', 'accentColor', 'textPrimary', 'textSecondary'],
  signatureGrid: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'imageTextColor', 'iconColor', 'statValue', 'accentColor', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  socialProofBar: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'badgeText', 'accentColor', 'textPrimary', 'textSecondary', 'cardBorderColor', 'colorPrimary'],
  spaceShowcase: ['sectionBg', 'cardBg', 'mutedColor', 'cardRadius', 'cardShadow', 'textPrimary', 'textSecondary', 'brandPrimary', 'cardBorder', 'headingWeight', 'headingTracking'],
  spotlightCards: ['cardBg', 'headingColor', 'bodyColor', 'iconColor', 'borderColor', 'cardRadius', 'textPrimary', 'textSecondary', 'brandPrimary'],
  stats: ['sectionBg', 'cardBg', 'iconColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  statsCounter: ['sectionBg', 'headingColor', 'bodyColor', 'accentColor', 'badgeBg', 'badgeText', 'textPrimary', 'textSecondary', 'colorPrimary'],
  story: ['sectionBg', 'cardBg', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  studioAmenities: ['cardBg', 'headingColor', 'bodyColor', 'iconColor', 'borderColor', 'textPrimary', 'textSecondary', 'colorPrimary'],
  team: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'brandAccent'],
  templateAdvantage: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'btnBg', 'btnText', 'badgeText', 'borderColor', 'textPrimary', 'brandPrimary'],
  testimonialMarquee: ['cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  testimonials: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandAccent', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  textImage: ['sectionBg', 'cardBg', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  timeline: ['sectionBg', 'borderColor', 'textPrimary', 'textSecondary', 'colorPrimary'],
  treatmentDetail: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  tourismContact: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  tourRoutes: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  trainerProfiles: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary', 'brandAccent'],
  transformationStories: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'textPrimary', 'brandPrimary'],
  trialSessionCta: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'brandPrimary', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
  uspStrip: ['sectionBgAlt', 'cardBg', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  visitorInfo: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  verticalTimeline: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'dividerColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  videoEmbed: ['mutedColor'],
  weddingFloristry: ['cardBg', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'brandPrimary'],
  workshopBooking: ['sectionBg', 'cardBg', 'cardRadius', 'cardShadow', 'buttonRadius', 'textPrimary', 'textSecondary', 'brandPrimary', 'headingWeight', 'headingTracking', 'onDarkHeading', 'onDarkBody', 'onDarkMuted'],
};

const DEFAULT_SECTION_FIELDS: ColorFieldKey[] = [
  'sectionBg',
  'sectionBgAlt',
  'cardBg',
  'headingColor',
  'subheadingColor',
  'bodyColor',
  'mutedColor',
  'textPrimary',
  'textSecondary',
  'iconColor',
  'accentColor',
  'btnBg',
  'btnText',
  'badgeBg',
  'badgeText',
  'borderColor',
];

const CONTRACT_FIELD_BY_SLOT: Record<SectionColorSlot, ColorFieldKey> = {
  sectionBg: 'sectionBg',
  sectionBgAlt: 'sectionBgAlt',
  cardBg: 'cardBg',
  headingColor: 'headingColor',
  subheadingColor: 'subheadingColor',
  bodyColor: 'bodyColor',
  mutedColor: 'mutedColor',
  textPrimary: 'textPrimary',
  textSecondary: 'textSecondary',
  imageTextColor: 'imageTextColor',
  accentColor: 'accentColor',
  iconColor: 'iconColor',
  btnBg: 'btnBg',
  btnText: 'btnText',
  btnSecondaryBg: 'btnSecondaryBg',
  btnSecondaryText: 'btnSecondaryText',
  badgeBg: 'badgeBg',
  badgeText: 'badgeText',
  badgeBorder: 'badgeBorder',
  borderColor: 'borderColor',
  dividerColor: 'dividerColor',
  overlayColor: 'imageOverlay',
};

const CONTRACT_FIELDS_BY_TYPE = new Map(
  getAllSectionContracts().map((contract) => [
    contract.type,
    contract.colorSlots.map((slot) => CONTRACT_FIELD_BY_SLOT[slot]).filter(Boolean),
  ]),
);

function getFieldsForSection(sectionType: string): ColorFieldKey[] {
  const fields = SECTION_FIELDS[sectionType] ?? CONTRACT_FIELDS_BY_TYPE.get(sectionType) ?? DEFAULT_SECTION_FIELDS;
  return fields.filter((field) => field !== 'sectionBgAlt');
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
      // --brand-btn-secondary-* intentionally no fallback: no shared template
      // reads these from another var, so showing a borrowed swatch is misleading.
      '--style-badge-bg': ['--brand-primary'],
      '--style-badge-text': ['--brand-primary'],
      '--style-badge-border': ['--brand-primary'],
      '--style-section-bg-alt': ['--style-section-bg'],
      // --style-card-bg intentionally no fallback to section-bg: they are
      // independent in every shared template; suggesting otherwise was confusing.
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
    // Phase 4c: pickers write exactly ONE var — no hidden cross-writes.
    // (Previously --style-accent-color also wrote --brand-primary + --brand-accent,
    //  and --style-border-color also wrote --style-card-border; that made
    //  "Akzentfarbe" recolour brand vars + buttons globally.)
    const next = { ...overrides, [key]: color };
    Object.keys(next).forEach(k => { if (!next[k]) delete next[k]; });
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  const handleClear = (key: string) => {
    const next = { ...overrides };
    delete next[key];
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  function renderColorField(fieldKey: ColorFieldKey) {
    const def = FIELD_DEFS[fieldKey];
    if (!def) return null;
    const currentOverride = overrides[def.cssVar] || '';
    const resolved = getResolvedColor(def.cssVar);
    const displayColor = currentOverride || resolved || '';
    const { hex, alpha } = parseColorWithAlpha(displayColor);
    const overrideAlpha = parseColorWithAlpha(currentOverride).alpha;
    return (
      <label key={fieldKey} className="block">
        <span className="text-gray-600 text-xs" title={def.description}>{def.label}</span>
        <div className="flex items-center gap-2 mt-1">
          <div className="relative">
            <input
              type="color"
              className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0"
              value={hex || '#000000'}
              onChange={(e) => handleChange(def.cssVar, composeColorWithAlpha(e.target.value, overrideAlpha ?? alpha))}
            />
            {!currentOverride && resolved && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white" style={{ background: resolved }} title={`Aktuell: ${resolved}`} />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <input
              type="text"
              className="admin-input w-full text-xs font-mono"
              placeholder={resolved || '—'}
              value={currentOverride}
              onChange={(e) => handleChange(def.cssVar, e.target.value)}
            />
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(((overrideAlpha ?? alpha) ?? 1) * 100)}
                onChange={(e) => {
                  const a = Number(e.target.value) / 100;
                  const base = hex || '#000000';
                  handleChange(def.cssVar, composeColorWithAlpha(base, a));
                }}
                className="flex-1 h-1 accent-[var(--brand-primary,#0ea5e9)]"
                title="Transparenz (Alpha)"
              />
              <span className="w-10 text-right text-[10px] font-mono text-zinc-500">{Math.round(((overrideAlpha ?? alpha) ?? 1) * 100)}%</span>
            </div>
          </div>
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
