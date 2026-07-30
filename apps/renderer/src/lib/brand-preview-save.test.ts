import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  createLivePreviewRelay,
  mergeLivePreviewPayload,
} from '../components/admin/preview-live-data';

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

  assert.match(brandForm, /sendLiveData\(\{\s*brand: form,/);
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

test('brand and design settings use atomic upserts without replacing unknown brand keys', () => {
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
  assert.match(designAction, /design: sql`excluded\.design`/);
});
