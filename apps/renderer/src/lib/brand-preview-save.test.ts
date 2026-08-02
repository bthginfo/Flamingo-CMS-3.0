import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  applyCssVarPatch,
  applyCssVarLayerPatches,
  buildCssVarPatch,
  composeCssVarLayers,
  createLivePreviewRelay,
  mergeLivePreviewPayload,
} from '../components/admin/preview-live-data';
import { getDesignCssVars, normalizeDesignStringRecord } from './design-vars';

function source(relative: string) {
  return readFileSync(new URL(relative, import.meta.url), 'utf8');
}

test('live preview retains partial CSS and brand fields', () => {
  const merged = mergeLivePreviewPayload(
    {
      cssVars: { '--color-nav-bg': '#111111', '--color-nav-text': '#ffffff' },
      brand: { companyName: 'Flamingo', logoUrl: '/old.svg' },
    },
    {
      cssVars: { '--color-nav-bg': '#222222' },
      brand: { logoUrl: '/new.svg' },
    },
  );

  assert.deepEqual(merged.cssVars, {
    '--color-nav-bg': '#222222',
    '--color-nav-text': '#ffffff',
  });
  assert.deepEqual(merged.brand, {
    companyName: 'Flamingo',
    logoUrl: '/new.svg',
  });
});

test('live preview CSS patches explicitly remove reset variables', () => {
  const patch = buildCssVarPatch(
    { '--token-heading': '#111111', '--token-body': '#222222' },
    { '--token-heading': '#333333' },
  );

  assert.deepEqual(patch, {
    '--token-heading': '#333333',
    '--token-body': null,
  });
  assert.deepEqual(
    applyCssVarPatch(
      { '--token-heading': '#111111', '--token-body': '#222222' },
      patch,
    ),
    { '--token-heading': '#333333' },
  );
});

test('independent preview layers reveal brand values when a design override is reset', () => {
  const brand = { '--token-heading': '#102030', '--token-body': '#405060' };
  let layers = applyCssVarLayerPatches({}, {
    design: { '--token-heading': '#ffffff' },
    brand,
  });

  assert.deepEqual(composeCssVarLayers({}, layers), {
    '--token-heading': '#ffffff',
    '--token-body': '#405060',
  });

  layers = applyCssVarLayerPatches(layers, {
    design: { '--token-heading': null },
  });
  assert.deepEqual(composeCssVarLayers({}, layers), brand);
});

test('legacy non-string design JSON is ignored without breaking CSS generation', () => {
  const legacy = {
    sectionBg: '#ffffff',
    sectionBgAlt: 123,
    cardBg: { value: '#000000' },
    textOnSectionBg: '  #111111  ',
  };

  assert.deepEqual(normalizeDesignStringRecord(legacy), {
    sectionBg: '#ffffff',
    textOnSectionBg: '#111111',
  });
  assert.equal(getDesignCssVars(legacy)['--token-section-bg'], '#ffffff');
});

test('payload queued before iframe readiness is replayed after readiness', () => {
  const messages: unknown[] = [];
  const relay = createLivePreviewRelay();

  assert.equal(relay.send({ brand: { companyName: 'Flamingo' } }, null, 'https://example.test'), false);
  assert.equal(
    relay.replay(
      { postMessage: (message) => messages.push(message) },
      'https://example.test',
    ),
    true,
  );
  assert.deepEqual(messages, [{
    type: 'flamingo-live-preview',
    payload: { brand: { companyName: 'Flamingo' } },
  }]);
});

test('brand form sends prop-driven brand data and keeps failed saves dirty', () => {
  const brandForm = source('../app/admin/brand/brand-form.tsx');
  const backgroundForm = source('../app/admin/brand/background-form.tsx');

  assert.match(brandForm, /sendLiveData\(\{\s*brand: form,\s*cssVarLayers:/);
  assert.match(backgroundForm, /cssVarLayers:\s*\{\s*design:/);
  assert.match(brandForm, /if \(result\.success\) \{[\s\S]*markSaved\(\);[\s\S]*router\.refresh\(\);[\s\S]*\} else \{/);
  assert.doesNotMatch(brandForm, /\}\s*markSaved\(\);\s*router\.refresh\(\);\s*\} catch/);
  assert.match(backgroundForm, /if \(!result\.success\) \{[\s\S]*return;[\s\S]*\}\s*markSaved\(\)/);
});

test('preview provider replays only trusted same-origin iframe messages', () => {
  const provider = source('../components/admin/preview-context.tsx');

  assert.match(provider, /event\.source !== previewWindow/);
  assert.match(provider, /event\.origin !== window\.location\.origin/);
  assert.match(provider, /event\.data\?\.type !== 'flamingo-live-preview-ready'/);
  assert.match(provider, /liveRelayRef\.current\?\.replay\(previewWindow, window\.location\.origin\)/);
});

test('brand and design settings use atomic upserts without replacing unknown keys', () => {
  const actions = source('../app/admin/settings-actions.ts');
  const brandStart = actions.indexOf('export async function saveBrandSettings');
  const brandEnd = actions.indexOf('export async function getContactSettings', brandStart);
  const designStart = actions.indexOf('export async function saveDesignSettings');
  const brandAction = actions.slice(brandStart, brandEnd);
  const designAction = actions.slice(designStart);

  assert.ok(brandStart >= 0 && brandEnd > brandStart);
  assert.match(brandAction, /\.onConflictDoUpdate\(\{/);
  assert.match(brandAction, /coalesce\(\$\{globalSettings\.brand\}, '\{\}'::jsonb\) \|\| excluded\.brand/);
  assert.doesNotMatch(brandAction, /const \[existing\] = await db\.select/);
  assert.match(designAction, /\.onConflictDoUpdate\(\{/);
  assert.match(designAction, /coalesce\(\$\{globalSettings\.design\}, '\{\}'::jsonb\)/);
  assert.match(designAction, /\|\| excluded\.design/);
  assert.doesNotMatch(designAction, /design: sql`excluded\.design`/);
});

test('settings changes invalidate the tenant-scoped public cache', () => {
  const actions = source('../app/admin/settings-actions.ts');
  assert.match(actions, /function revalidateTenantPublicData\(tenantId: string\)[\s\S]*revalidateTag\(`tenant-\$\{tenantId\}`\)/);

  for (const action of [
    'saveBrandSettings',
    'saveContactSettings',
    'saveOpeningHours',
    'saveSocialLinks',
    'saveNavigationSettings',
    'saveFooterSettings',
    'saveActiveStyle',
    'saveDesignSettings',
  ]) {
    const start = actions.indexOf(`export async function ${action}`);
    const end = actions.indexOf('\nexport async function ', start + 1);
    const body = actions.slice(start, end === -1 ? undefined : end);
    assert.match(body, /revalidateTenantPublicData\(tenantId\)/, `${action} must invalidate public tenant cache`);
  }
});

test('public renderer only creates important CSS from validated colors', () => {
  const page = source('../app/[[...slug]]/page.tsx');
  assert.match(page, /const safeBrandColor = .*isValidColorString/);
  assert.match(page, /<style>\{escapeStyleElementText\(importantOverrides\.join/);
  assert.doesNotMatch(page, /importantOverrides\.join\('\\n'\) \}\} \/>/);
});

test('admin persisted sidebar state is applied only after hydration', () => {
  const sidebar = source('../components/sidebar.tsx');
  assert.match(sidebar, /const \[collapsed, setCollapsed\] = useState\(false\)/);
  assert.match(sidebar, /useEffect\(\(\) => \{\s*setCollapsed\(localStorage\.getItem\('sidebar-collapsed'\) === '1'\)/);
  assert.doesNotMatch(sidebar, /useState\(\(\) => \{[\s\S]*localStorage\.getItem\('sidebar-collapsed'\)/);
});
