import { z } from 'zod';
import { validateContentQuality, type SiteProfile } from './content-quality';

const MAX_SERIALIZED_BYTES = 64_000;
const MAX_LIST_ITEMS = 30;

const text = (max = 300) => z.string().trim().max(max);
const optionalText = (max = 300) => text(max).transform(value => value || undefined).optional();
const textList = (max = 300) => z.array(text(max)).max(MAX_LIST_ITEMS);

function isSafeProfileHref(value: string): boolean {
  const href = value.trim();
  if (!href || /[\u0000-\u001f\u007f]/.test(href)) return false;
  if (href.startsWith('/') && !href.startsWith('//')) return true;
  if (/^#[A-Za-z][\w:.-]*$/.test(href)) return true;
  if (/^tel:\+?[0-9 ()/.-]{3,30}$/i.test(href)) return true;
  if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(href)) return true;
  try {
    const url = new URL(href);
    return (url.protocol === 'https:' || url.protocol === 'http:')
      && !url.username
      && !url.password;
  } catch {
    return false;
  }
}

const safeHref = text(500).refine(isSafeProfileHref, 'Unsicheres oder ungültiges CTA-Ziel');

export const businessProfileSchema = z.object({
  schemaVersion: z.literal('1.0'),
  identity: z.object({
    businessName: text(255),
    legalName: optionalText(255),
    locations: z.array(z.object({
      city: text(120),
      region: optionalText(120),
      country: optionalText(120),
      address: optionalText(300),
    }).strict()).max(15),
    serviceAreas: textList(160).optional(),
  }).strict(),
  audience: z.object({
    primary: text(500),
    needs: textList(300),
    objections: textList(300),
  }).strict(),
  goals: z.object({
    primary: text(300),
    conversions: textList(200),
  }).strict(),
  offers: z.array(z.object({
    name: text(200),
    outcome: text(500),
    proof: optionalText(500),
    ctaLabel: text(80),
    ctaHref: safeHref,
  }).strict()).max(20),
  voice: z.object({
    attributes: textList(120),
    avoid: textList(300),
  }).strict(),
  facts: z.object({
    approvedClaims: textList(500),
    prohibitedClaims: textList(500),
    unknowns: textList(500),
  }).strict(),
}).strict();

export type BusinessProfileParseResult =
  | { success: true; data: SiteProfile }
  | { success: false; error: string };

function serializedSize(input: unknown): number {
  try {
    return new TextEncoder().encode(JSON.stringify(input)).length;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

/** Strict server boundary: trim safe values, reject unknown keys and oversized payloads. */
export function parseBusinessProfile(input: unknown): BusinessProfileParseResult {
  if (serializedSize(input) > MAX_SERIALIZED_BYTES) {
    return { success: false, error: 'Das Unternehmensprofil ist zu groß. Bitte kürzen Sie lange Listen oder Texte.' };
  }
  const parsed = businessProfileSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const location = first?.path.length ? first.path.join('.') : 'Profil';
    return { success: false, error: `${location}: ${first?.message || 'Ungültige Eingabe'}` };
  }
  return { success: true, data: parsed.data };
}

function seededLocation(address?: string): SiteProfile['identity']['locations'] {
  const clean = address?.trim();
  if (!clean) return [];
  const parts = clean.split(',').map(part => part.trim()).filter(Boolean);
  const locality = parts.at(-1) || '';
  const match = locality.match(/^(?:[A-Z]{1,3}-)?\d{4,5}\s+(.+)$/i);
  const city = (match?.[1] || (parts.length > 1 ? locality : '')).trim();
  return city ? [{ city, address: clean }] : [];
}

export function createSeededBusinessProfile(input: {
  tenantName: string;
  brand?: Record<string, unknown> | null;
  contact?: Record<string, unknown> | null;
}): SiteProfile {
  const companyName = typeof input.brand?.companyName === 'string' && input.brand.companyName.trim()
    ? input.brand.companyName.trim()
    : input.tenantName.trim();
  const address = typeof input.contact?.address === 'string' ? input.contact.address : undefined;
  return {
    schemaVersion: '1.0',
    identity: { businessName: companyName, locations: seededLocation(address), serviceAreas: [] },
    audience: { primary: '', needs: [], objections: [] },
    goals: { primary: '', conversions: [] },
    offers: [],
    voice: { attributes: [], avoid: [] },
    facts: { approvedClaims: [], prohibitedClaims: [], unknowns: [] },
  };
}

export type BusinessProfileCompleteness = {
  score: number;
  completed: number;
  total: number;
  missing: string[];
  readyForAi: boolean;
};

/** Stable baseline used by the editor so server normalization after save is not treated as a new edit. */
export function businessProfileFingerprint(profile: SiteProfile): string {
  return JSON.stringify(profile);
}

export function isBusinessProfileDirty(profile: SiteProfile, savedFingerprint: string): boolean {
  return businessProfileFingerprint(profile) !== savedFingerprint;
}

export function getBusinessProfileCompleteness(profile: SiteProfile): BusinessProfileCompleteness {
  const checks: Array<[string, boolean]> = [
    ['Öffentlicher Unternehmensname', Boolean(profile.identity.businessName.trim())],
    ['Mindestens ein Standort', profile.identity.locations.some(location => Boolean(location.city.trim()))],
    ['Primäre Zielgruppe', Boolean(profile.audience.primary.trim())],
    ['Mindestens zwei Kundenbedürfnisse', profile.audience.needs.filter(Boolean).length >= 2],
    ['Mindestens ein Einwand', profile.audience.objections.filter(Boolean).length >= 1],
    ['Primäres Website-Ziel', Boolean(profile.goals.primary.trim())],
    ['Mindestens eine Conversion', profile.goals.conversions.filter(Boolean).length >= 1],
    ['Mindestens ein Angebot', profile.offers.some(offer => Boolean(offer.name && offer.outcome && offer.ctaLabel && offer.ctaHref))],
    ['Mindestens zwei Tonalitätsmerkmale', profile.voice.attributes.filter(Boolean).length >= 2],
  ];
  const missing = checks.filter(([, complete]) => !complete).map(([label]) => label);
  const completed = checks.length - missing.length;
  return {
    score: Math.round((completed / checks.length) * 100),
    completed,
    total: checks.length,
    missing,
    readyForAi: profilePassesExistingValidation(profile),
  };
}

/** Uses the existing siteProfile validation gate so AI and admin readiness cannot drift. */
export function profilePassesExistingValidation(profile: SiteProfile): boolean {
  return validateContentQuality({ mode: 'profile', siteProfile: profile, pages: [] }).valid;
}

export function readPersistedBusinessProfile(value: unknown): SiteProfile | null {
  if (value == null) return null;
  const parsed = parseBusinessProfile(value);
  return parsed.success ? parsed.data : null;
}
