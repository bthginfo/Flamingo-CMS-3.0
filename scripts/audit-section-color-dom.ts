#!/usr/bin/env tsx
import { spawn, type ChildProcess } from 'node:child_process';
import { Buffer } from 'node:buffer';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import {
  SECTION_COLOR_CONTRACTS_GENERATED,
  SECTION_COLOR_CONTRACTS_GENERIC,
} from '../apps/renderer/src/lib/section-color-contracts-generated';
import {
  FIELD_DEFS,
  getCssVarsForColorField,
  type ColorFieldKey,
} from '../apps/renderer/src/lib/section-color-fields';

type FindingSeverity = 'error' | 'warning' | 'info';

type Finding = {
  severity: FindingSeverity;
  sectionType: string;
  industry: string | null;
  field?: string;
  message: string;
  detail?: unknown;
};

type DomTarget = {
  key: string;
  index: number;
  slot: string;
  text: string;
  tagName: string;
  color: string;
  backgroundColor: string;
  backgroundImage: string;
  borderTopColor: string;
  boxShadow: string;
};

type FieldAuditBaseline = {
  targets: DomTarget[];
  overrides: Record<string, string>;
};

const INDUSTRIES = [
  'tradesman',
  'restaurant',
  'hotel',
  'tourism',
  'salon',
  'medical',
  'wedding',
  'photography',
  'consulting',
  'realestate',
  'cafe',
  'tattoo',
  'ecommerce',
  'retail',
  'florist',
  'fitness',
  'location',
  'bar',
  'verein',
];

const INDUSTRY_SUFFIXES = [
  ['Tradesman', 'tradesman'],
  ['Restaurant', 'restaurant'],
  ['Hotel', 'hotel'],
  ['Tourism', 'tourism'],
  ['Salon', 'salon'],
  ['Medical', 'medical'],
  ['Wedding', 'wedding'],
  ['Photography', 'photography'],
  ['Consulting', 'consulting'],
  ['Realestate', 'realestate'],
  ['Cafe', 'cafe'],
  ['Tattoo', 'tattoo'],
  ['Ecommerce', 'ecommerce'],
  ['Retail', 'retail'],
  ['Florist', 'florist'],
  ['Fitness', 'fitness'],
  ['Location', 'location'],
] as const;

const FIELD_TEST_COLOR = '#f012be';
const FIELD_TEST_BG = '#12d6df';
const FIELD_TEST_BORDER = '#ff8a00';
const FIELD_TEST_SHADOW = '#7c3aed';
const DEFAULT_BASE_URL = 'http://127.0.0.1:3002';
const FIELD_BASE_TEXT = '#111827';
const FIELD_BASE_MUTED = '#4b5563';
const FIELD_BASE_BG = '#f8fafc';
const FIELD_BASE_CARD = '#ffffff';
const FIELD_BASE_BORDER = '#d1d5db';
const FIELD_BASE_ACCENT = '#2563eb';
const DEFAULT_CONCURRENCY = 4;
const MAX_CONCURRENCY = 16;

const FIELD_SLOT_ALIASES: Partial<Record<ColorFieldKey, string[]>> = {
  sectionBg: ['section.bg', 'sectionBg', 'section-bg', 'bg', 'background'],
  sectionBgAlt: ['section.bgAlt', 'section.altBg', 'sectionBgAlt', 'bgAlt', 'backgroundAlt'],
  cardBg: ['card.bg', 'cardBg', 'card.background'],
  headingColor: ['heading', 'headline', 'title'],
  subheadingColor: ['subheading', 'subtitle', 'subline'],
  bodyColor: ['body', 'text', 'copy', 'paragraph'],
  mutedColor: ['muted', 'meta', 'caption'],
  iconColor: ['icon'],
  accentColor: ['accent', 'accent.bg', 'accent.text', 'kicker'],
  glowColor: ['glow'],
  eyebrow: ['eyebrow', 'kicker'],
  statValue: ['stat', 'stat.value', 'metric.value'],
  quoteMark: ['quote', 'quote.mark'],
  ratingStar: ['rating', 'star', 'rating.star'],
  check: ['check', 'checkmark'],
  imageOverlay: ['image.overlay', 'overlay'],
  btnBg: ['button.bg', 'btn.bg', 'cta.bg'],
  btnText: ['button.text', 'btn.text', 'cta.text'],
  badgeBg: ['badge.bg', 'eyebrow.bg'],
  badgeText: ['badge.text', 'eyebrow.text'],
  badgeBorder: ['badge.border', 'eyebrow.border'],
  borderColor: ['border', 'card.border'],
  dividerColor: ['divider', 'line'],
  cardHeadingColor: ['card.heading', 'card.title'],
  cardBodyColor: ['card.body', 'card.text'],
  cardMutedColor: ['card.muted', 'card.meta'],
  cardBadgeBg: ['card.badge.bg'],
  cardBadgeText: ['card.badge.text'],
  cardIconColor: ['card.icon'],
  btnSecondaryBg: ['button.secondary.bg', 'btn.secondary.bg', 'secondary.button.bg'],
  btnSecondaryText: ['button.secondary.text', 'btn.secondary.text', 'secondary.button.text'],
  btnSecondaryBorder: ['button.secondary.border', 'btn.secondary.border', 'secondary.button.border'],
  linkColor: ['link'],
  linkHoverColor: ['link.hover'],
  inputBg: ['input.bg'],
  inputBorder: ['input.border'],
  inputText: ['input.text'],
  labelColor: ['label'],
  priceColor: ['price'],
  priceStrikeColor: ['price.strike', 'price.strikethrough'],
  pageBg: ['page.bg'],
  shadowColor: ['shadow'],
  successColor: ['success'],
  successBg: ['success.bg'],
  dangerColor: ['danger'],
  dangerBg: ['danger.bg'],
};

const SKIPPED_STYLE_FIELDS = new Set<ColorFieldKey>([
  'cardRadius',
  'buttonRadius',
  'cardShadow',
  'headingWeight',
  'headingTracking',
]);

function parseArgs() {
  const args = new Set(process.argv.slice(2));
  const getValue = (name: string) => {
    const prefix = `${name}=`;
    const value = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
    if (value) return value.slice(prefix.length);
    const index = process.argv.indexOf(name);
    return index >= 0 ? process.argv[index + 1] : undefined;
  };

  return {
    startServer: args.has('--start-server'),
    strict: args.has('--strict'),
    baseUrl: getValue('--base-url') || process.env.SECTION_PREVIEW_BASE_URL || DEFAULT_BASE_URL,
    type: getValue('--type'),
    max: Number(getValue('--max') || 0) || null,
    skip: Number(getValue('--skip') || 0) || 0,
    concurrency: Number(getValue('--concurrency') || DEFAULT_CONCURRENCY),
    report: getValue('--report') || process.env.SECTION_COLOR_DOM_REPORT || 'tmp/section-color-dom-audit.json',
    help: args.has('--help') || args.has('-h'),
  };
}

function printHelp() {
  console.log(`
Section Color DOM Audit

Renders /section-preview for each section color contract, mutates each public
color field via safe styleOverrides, and verifies that annotated DOM targets
with data-color-slot actually receive the computed color.

Usage:
  pnpm audit:section-color-dom -- --start-server
  pnpm audit:section-color-dom -- --base-url http://127.0.0.1:3002 --strict
  pnpm audit:section-color-dom -- --type ctaBand

Options:
  --start-server       Start @flamingo/renderer dev server on port 3002
  --base-url <url>     Existing renderer URL, default ${DEFAULT_BASE_URL}
  --type <section>     Audit one section type only
  --skip <n>           Skip first n section types, for batching
  --max <n>            Limit number of audited section types
  --concurrency <n>    Parallel browser pages, default ${DEFAULT_CONCURRENCY}, max ${MAX_CONCURRENCY}
  --report <path>      JSON report path, default tmp/section-color-dom-audit.json
  --strict             Treat missing DOM annotations as failures
`);
}

async function dynamicImport(specifier: string): Promise<any> {
  const importer = new Function('specifier', 'return import(specifier)') as (specifier: string) => Promise<any>;
  return importer(specifier);
}

async function loadPlaywright() {
  try {
    return await dynamicImport('playwright');
  } catch {
    throw new Error(
      'Playwright ist nicht installiert. Installiere es mit `pnpm add -D -w playwright` und ggf. `pnpm exec playwright install chromium`.',
    );
  }
}

function encodeStyleOverrides(overrides: Record<string, string>) {
  return Buffer.from(JSON.stringify(overrides), 'utf8').toString('base64url');
}

function sectionPreviewUrl(baseUrl: string, sectionType: string, industry: string, styleOverrides?: Record<string, string>) {
  const url = new URL('/section-preview', baseUrl);
  url.searchParams.set('type', sectionType);
  url.searchParams.set('industry', industry);
  if (styleOverrides) url.searchParams.set('styleOverrides', encodeStyleOverrides(styleOverrides));
  return url.toString();
}

function buildStyleOverrides(field: ColorFieldKey, value: string) {
  return Object.fromEntries(getCssVarsForColorField(field).map((cssVar) => [cssVar, value]));
}

function baseValueForField(field: ColorFieldKey) {
  if (field === 'sectionBg' || field === 'sectionBgAlt' || field === 'pageBg') return FIELD_BASE_BG;
  if (field === 'cardBg' || field.endsWith('Bg')) return FIELD_BASE_CARD;
  if (/border/i.test(field) || field === 'dividerColor') return FIELD_BASE_BORDER;
  if (field === 'mutedColor' || field === 'cardMutedColor') return FIELD_BASE_MUTED;
  if (field === 'accentColor' || field === 'iconColor' || field === 'cardIconColor' || field === 'glowColor') return FIELD_BASE_ACCENT;
  if (field === 'btnBg') return '#1f2937';
  if (field === 'btnText') return '#ffffff';
  return FIELD_BASE_TEXT;
}

function buildBaselineStyleOverrides(fields: ColorFieldKey[]) {
  const overrides: Record<string, string> = {};
  for (const field of fields.filter(fieldIsColor)) {
    Object.assign(overrides, buildStyleOverrides(field, baseValueForField(field)));
  }
  return overrides;
}

function expectedValueForField(field: ColorFieldKey) {
  if (/bg$/i.test(field) || field === 'sectionBg' || field === 'sectionBgAlt' || field === 'cardBg' || field === 'pageBg') {
    return FIELD_TEST_BG;
  }
  if (/border/i.test(field) || field === 'dividerColor') return FIELD_TEST_BORDER;
  if (/shadow/i.test(field)) return FIELD_TEST_SHADOW;
  return FIELD_TEST_COLOR;
}

type AuditedProperty = keyof Pick<DomTarget, 'color' | 'backgroundColor' | 'backgroundImage' | 'borderTopColor' | 'boxShadow'>;

function propertiesForField(field: ColorFieldKey): AuditedProperty[] {
  if (field === 'accentColor' || field === 'glowColor') {
    return ['color', 'backgroundColor', 'backgroundImage', 'borderTopColor'];
  }
  if (/bg$/i.test(field) || field === 'sectionBg' || field === 'sectionBgAlt' || field === 'cardBg' || field === 'pageBg') {
    return ['backgroundColor', 'backgroundImage'];
  }
  if (/border/i.test(field) || field === 'dividerColor') return ['borderTopColor'];
  if (/shadow/i.test(field)) return ['boxShadow'];
  return ['color'];
}

function fieldSlots(field: ColorFieldKey) {
  return new Set([field, ...(FIELD_SLOT_ALIASES[field] || [])].map((slot) => slot.toLowerCase()));
}

function targetMatchesField(target: DomTarget, field: ColorFieldKey) {
  const aliases = fieldSlots(field);
  return target.slot
    .split(/\s+/)
    .filter(Boolean)
    .some((slot) => aliases.has(slot.toLowerCase()));
}

function slotProperties(slot: string): Set<AuditedProperty> {
  const result = new Set<AuditedProperty>();
  const tokens = slot.toLowerCase().split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    if (token === 'accentcolor' || token === 'glowcolor') {
      result.add('color');
      result.add('backgroundColor');
      result.add('backgroundImage');
      result.add('borderTopColor');
    } else if (token.includes('bg') || token.includes('background') || token === 'overlay') {
      result.add('backgroundColor');
      result.add('backgroundImage');
    } else if (token.includes('border') || token.includes('divider') || token === 'line') {
      result.add('borderTopColor');
    } else if (token.includes('shadow')) {
      result.add('boxShadow');
    } else {
      result.add('color');
    }
  }
  return result;
}

function targetUsesAnyProperty(target: DomTarget, properties: AuditedProperty[]) {
  const targetProperties = slotProperties(target.slot);
  return properties.some((property) => targetProperties.has(property));
}

function hexToRgbFragment(value: string) {
  const hex = value.trim().replace(/^#/, '');
  if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
  const rgb = [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
  return rgb.join(', ');
}

function targetHasExpectedValue(target: DomTarget, properties: AuditedProperty[], value: string) {
  const rgbFragment = hexToRgbFragment(value);
  if (!rgbFragment) return false;
  return properties.some((property) => String(target[property]).includes(rgbFragment));
}

function targetRelevantProperties(target: DomTarget, fallbackProperties: AuditedProperty[]) {
  const targetProperties = slotProperties(target.slot);
  const relevant = fallbackProperties.filter((property) => targetProperties.has(property));
  return relevant.length ? relevant : fallbackProperties;
}

function targetChanged(before: DomTarget | undefined, after: DomTarget, properties: AuditedProperty[]) {
  if (!before) return false;
  return properties.some((property) => String(before[property]) !== String(after[property]));
}

function fieldIsColor(field: ColorFieldKey) {
  return FIELD_DEFS[field]?.type !== 'size' && !SKIPPED_STYLE_FIELDS.has(field);
}

function sectionTypes() {
  return auditTargets().map((target) => target.key);
}

function splitGeneratedContractKey(key: string): { sectionType: string; industry: string | null } {
  for (const [suffix, industry] of INDUSTRY_SUFFIXES) {
    if (key.endsWith(suffix) && key.length > suffix.length) {
      return { sectionType: key.slice(0, -suffix.length), industry };
    }
  }
  return { sectionType: key, industry: null };
}

function auditTargets() {
  const targets = new Map<string, { key: string; sectionType: string; industry: string | null; generatedKey: string | null }>();
  for (const generatedKey of Object.keys(SECTION_COLOR_CONTRACTS_GENERATED)) {
    const { sectionType, industry } = splitGeneratedContractKey(generatedKey);
    const key = `${sectionType}::${industry || 'auto'}::${generatedKey}`;
    targets.set(key, { key, sectionType, industry, generatedKey });
  }
  for (const sectionType of Object.keys(SECTION_COLOR_CONTRACTS_GENERIC)) {
    const key = `${sectionType}::auto::generic`;
    if (!targets.has(key)) targets.set(key, { key, sectionType, industry: null, generatedKey: null });
  }
  return [...targets.values()].sort((a, b) => a.key.localeCompare(b.key));
}

async function startRendererServer(): Promise<ChildProcess> {
  const child = spawn('pnpm', ['--filter', '@flamingo/renderer', 'dev'], {
    cwd: process.cwd(),
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PORT: '3002' },
  });
  child.stdout?.on('data', (chunk) => process.stdout.write(`[renderer] ${chunk}`));
  child.stderr?.on('data', (chunk) => process.stderr.write(`[renderer] ${chunk}`));
  return child;
}

async function waitForServer(baseUrl: string) {
  const url = `${baseUrl.replace(/\/$/, '')}/section-preview?type=ctaBand&industry=tradesman`;
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // keep polling
    }
    await sleep(750);
  }
  throw new Error(`Renderer preview route did not become available: ${url}`);
}

async function serverIsAvailable(baseUrl: string) {
  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/section-preview?type=ctaBand&industry=tradesman`);
    return response.ok;
  } catch {
    return false;
  }
}

async function findRenderableIndustry(page: any, baseUrl: string, sectionType: string): Promise<string | null> {
  for (const industry of INDUSTRIES) {
    const response = await page.goto(sectionPreviewUrl(baseUrl, sectionType, industry), {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    }).catch(() => null);
    if (!response || !response.ok()) continue;
    const hasRoot = await page.locator(`[data-section-id="preview-${sectionType}"]`).first().waitFor({
      state: 'attached',
      timeout: 5_000,
    }).then(() => true).catch(() => false);
    if (hasRoot) return industry;
  }
  return null;
}

async function waitForSectionRoot(page: any, sectionType: string) {
  await page.locator(`[data-section-id="preview-${sectionType}"]`).first().waitFor({
    state: 'attached',
    timeout: 15_000,
  });
}

async function waitForStableColorTargets(page: any, sectionType: string) {
  const selector = `[data-section-id="preview-${sectionType}"] [data-color-slot], [data-section-id="preview-${sectionType}"][data-color-slot]`;
  let previous = -1;
  let stableReads = 0;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const count = await page.locator(selector).count().catch(() => 0);
    if (count === previous) {
      stableReads += 1;
      if (stableReads >= 3) return;
    } else {
      stableReads = 0;
      previous = count;
    }
    await page.waitForTimeout(100);
  }
}

async function disableMotionForAudit(page: any) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }
    `,
  }).catch(() => undefined);
}

async function readTargets(page: any, sectionType: string): Promise<DomTarget[]> {
  return page.locator(`[data-section-id="preview-${sectionType}"]`).first().evaluate((root: Element) => {
    const nodes: Element[] = [];
    if (root.hasAttribute('data-color-slot')) nodes.push(root);
    nodes.push(...Array.from(root.querySelectorAll('[data-color-slot]')));
    return nodes.map((node, index) => {
      const style = window.getComputedStyle(node);
      const slot = node.getAttribute('data-color-slot') || '';
      const text = (node.textContent || '').trim().slice(0, 80);
      return {
        key: `${index}|${node.tagName.toLowerCase()}|${slot}`,
        index,
        slot,
        text,
        tagName: node.tagName.toLowerCase(),
        color: style.color,
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        borderTopColor: style.borderTopColor,
        boxShadow: style.boxShadow,
      };
    });
  });
}

async function applyStyleOverrides(page: any, sectionType: string, overrides: Record<string, string>) {
  await page.locator(`[data-section-id="preview-${sectionType}"]`).first().evaluate((node: HTMLElement, nextOverrides: Record<string, string>) => {
    for (const [cssVar, value] of Object.entries(nextOverrides)) {
      node.style.setProperty(cssVar, value);
    }
  }, overrides);
}

async function auditField(
  page: any,
  sectionType: string,
  industry: string,
  field: ColorFieldKey,
  baseline: FieldAuditBaseline,
): Promise<Finding[]> {
  const value = expectedValueForField(field);
  const properties = propertiesForField(field);

  await applyStyleOverrides(page, sectionType, baseline.overrides);
  await applyStyleOverrides(page, sectionType, buildStyleOverrides(field, value));
  await page.waitForTimeout(20);

  const targets = await readTargets(page, sectionType);
  const matchingTargets = targets.filter((target) => targetMatchesField(target, field));
  const findings: Finding[] = [];

  if (!matchingTargets.length) {
    findings.push({
      severity: 'warning',
      sectionType,
      industry,
      field,
      message: `No DOM target declares data-color-slot for field "${field}".`,
    });
    return findings;
  }

  const baselineByKey = new Map(baseline.targets.map((target) => [target.key, target]));
  const ineffective = matchingTargets.filter((target) => {
    const relevantProperties = targetRelevantProperties(target, properties);
    const before = baselineByKey.get(target.key);
    if (!before && targetHasExpectedValue(target, relevantProperties, value)) return false;
    return !targetChanged(before, target, relevantProperties);
  });
  if (ineffective.length) {
    findings.push({
      severity: 'error',
      sectionType,
      industry,
      field,
      message: `Field "${field}" did not affect ${properties.join('/')} on ${ineffective.length}/${matchingTargets.length} annotated target(s).`,
      detail: ineffective.slice(0, 5),
    });
  }

  const crosstalk = targets.filter((target) => (
    !targetMatchesField(target, field) &&
    targetUsesAnyProperty(target, properties) &&
    targetChanged(baselineByKey.get(target.key), target, properties)
  ));
  if (crosstalk.length) {
    findings.push({
      severity: 'error',
      sectionType,
      industry,
      field,
      message: `Field "${field}" also changed ${properties.join('/')} on ${crosstalk.length} unrelated annotated target(s).`,
      detail: crosstalk.slice(0, 5),
    });
  }

  return findings;
}

type AuditTarget = ReturnType<typeof auditTargets>[number];

type AuditJob = {
  target: AuditTarget;
  typeIndex: number;
  fields: ColorFieldKey[];
};

async function auditTarget(page: any, baseUrl: string, job: AuditJob): Promise<Finding[]> {
  const { target, fields } = job;
  const { sectionType } = target;
  const findings: Finding[] = [];

  const industry = target.industry || await findRenderableIndustry(page, baseUrl, sectionType);
  if (!industry) {
    findings.push({
      severity: 'warning',
      sectionType,
      industry: null,
      message: 'No renderable section-preview found for this section type.',
    });
    return findings;
  }

  const probeResponse = await page.goto(sectionPreviewUrl(baseUrl, sectionType, industry), {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  }).catch(() => null);
  const probeHasRoot = probeResponse?.ok()
    ? await page.locator(`[data-section-id="preview-${sectionType}"]`).count()
    : 0;
  if (!probeResponse?.ok() || !probeHasRoot) {
    findings.push({
      severity: 'warning',
      sectionType,
      industry,
      message: 'No renderable section-preview found for this section type and industry.',
    });
    return findings;
  }

  const baselineOverrides = buildBaselineStyleOverrides(fields);
  await page.goto(sectionPreviewUrl(baseUrl, sectionType, industry, baselineOverrides), {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });
  await disableMotionForAudit(page);
  await waitForSectionRoot(page, sectionType);
  await waitForStableColorTargets(page, sectionType);
  // Apply the baseline once more after hydration. The preview route also
  // receives these values through the URL, but client hydration may briefly
  // replace inherited colors before the section-level overrides settle.
  // Reapplying here makes the baseline and every field probe comparable.
  await applyStyleOverrides(page, sectionType, baselineOverrides);
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
  const baseline: FieldAuditBaseline = {
    targets: await readTargets(page, sectionType),
    overrides: baselineOverrides,
  };

  if (!baseline.targets.length) {
    findings.push({
      severity: 'warning',
      sectionType,
      industry,
      message: 'Section renders but has no data-color-slot annotations. DOM field ownership cannot be proven.',
    });
  }

  for (const field of fields) {
    findings.push(...await auditField(page, sectionType, industry, field, baseline));
  }

  return findings;
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }
  if (!Number.isInteger(args.concurrency) || args.concurrency < 1 || args.concurrency > MAX_CONCURRENCY) {
    throw new Error(`--concurrency must be an integer between 1 and ${MAX_CONCURRENCY}.`);
  }

  const baseUrl = args.baseUrl.replace(/\/$/, '');
  let server: ChildProcess | null = null;
  if (args.startServer) {
    if (!(await serverIsAvailable(baseUrl))) server = await startRendererServer();
    await waitForServer(baseUrl);
  }

  const findings: Finding[] = [];
  let auditedTargets = 0;
  let auditedFields = 0;
  try {
    if (!args.startServer) await waitForServer(baseUrl);

    const targets = auditTargets()
      .filter((target) => !args.type || target.sectionType === args.type || target.generatedKey === args.type)
      .slice(args.skip)
      .slice(0, args.max || undefined);

    const jobs = targets.flatMap((target, typeIndex): AuditJob[] => {
      const generatedFields = (target.generatedKey && SECTION_COLOR_CONTRACTS_GENERATED[target.generatedKey]) || [];
      const rawFields = (generatedFields.length ? generatedFields : SECTION_COLOR_CONTRACTS_GENERIC[target.sectionType] || []) as ColorFieldKey[];
      const fields = [...new Set(rawFields)].filter(fieldIsColor);
      return fields.length ? [{ target, typeIndex, fields }] : [];
    });

    auditedTargets = jobs.length;
    auditedFields = jobs.reduce((sum, job) => sum + job.fields.length, 0);
    for (const job of jobs) {
      const { target, typeIndex, fields } = job;
      console.log(`audit ${typeIndex + 1}/${targets.length}: ${target.sectionType}${target.industry ? `/${target.industry}` : ''} (${fields.length} color fields)`);
    }

    const { chromium } = await loadPlaywright();
    const browser = await chromium.launch({ headless: true });
    try {
      const results: Finding[][] = Array.from({ length: jobs.length }, () => []);
      let nextJobIndex = 0;
      const workerCount = Math.min(args.concurrency, jobs.length);
      const workers = Array.from({ length: workerCount }, async () => {
        let page: any = null;
        try {
          page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
          while (nextJobIndex < jobs.length) {
            const jobIndex = nextJobIndex;
            nextJobIndex += 1;
            results[jobIndex] = await auditTarget(page, baseUrl, jobs[jobIndex]);
          }
        } finally {
          if (page) await page.close().catch(() => undefined);
        }
      });
      const workerResults = await Promise.allSettled(workers);
      const failedWorker = workerResults.find((result): result is PromiseRejectedResult => result.status === 'rejected');
      if (failedWorker) throw failedWorker.reason;
      findings.push(...results.flat());
    } finally {
      await browser.close().catch(() => undefined);
    }
  } finally {
    if (server) {
      server.kill();
      await sleep(500);
    }
  }

  const errors = findings.filter((finding) => finding.severity === 'error');
  const warnings = findings.filter((finding) => finding.severity === 'warning');
  const reportPath = resolve(process.cwd(), args.report);
  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    baseUrl,
    strict: args.strict,
    sectionType: args.type || null,
    max: args.max,
    skip: args.skip,
    counts: {
      auditedTargets,
      auditedFields,
      findings: findings.length,
      errors: errors.length,
      warnings: warnings.length,
      info: findings.filter((finding) => finding.severity === 'info').length,
    },
    findings,
  }, null, 2));
  console.log(`section-color-dom-audit: ${errors.length} error(s), ${warnings.length} warning(s)`);
  console.log(`report: ${reportPath}`);
  for (const finding of findings.slice(0, 80)) {
    console.log(`[${finding.severity}] ${finding.sectionType}${finding.industry ? `/${finding.industry}` : ''}${finding.field ? `:${finding.field}` : ''} - ${finding.message}`);
    if (finding.detail) console.log(JSON.stringify(finding.detail, null, 2));
  }
  if (findings.length > 80) console.log(`... ${findings.length - 80} more finding(s) omitted`);

  process.exit(errors.length || (args.strict && warnings.length) ? 1 : 0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
