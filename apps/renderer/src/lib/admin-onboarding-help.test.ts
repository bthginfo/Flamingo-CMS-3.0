import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  ONBOARDING_STEPS,
  onboardingStorageKey,
} from '../components/admin/onboarding-tour';

function source(relative: string) {
  return readFileSync(new URL(relative, import.meta.url), 'utf8');
}

const tourSource = source('../components/admin/onboarding-tour.tsx');
const helpPageSource = source('../app/admin/help/page.tsx');
const helpHubSource = source('../app/admin/help/help-hub.tsx');
const checklistSource = source('../components/admin/onboarding-checklist.tsx');

test('help feature checks are read-only safe for demo sessions', () => {
  assert.match(helpPageSource, /getSession\(\)/);
  assert.match(helpPageSource, /select\(\{ key: tenantAddons\.addonKey \}\)/);
  assert.match(helpPageSource, /eq\(tenantAddons\.active, true\)/);
  assert.doesNotMatch(helpPageSource, /getWritableSession|isShopActive|use server/);
});

test('onboarding progress is tenant and version scoped', () => {
  assert.equal(
    onboardingStorageKey('tenant-123'),
    'flamingo:onboarding:v2:tenant-123',
  );
  assert.match(checklistSource, /flamingo:onboarding:checklist:v2:\$\{tenantId\}/);
  assert.match(checklistSource, /deferred\?: ChecklistStepId\[\]/);
});

test('orientation tour has valid route-safe targets and no dashboard publish FAB target', () => {
  assert.ok(ONBOARDING_STEPS.length <= 5);
  assert.ok(ONBOARDING_STEPS.every(step => step.target && step.fallbackHref.startsWith('/admin')));
  assert.doesNotMatch(tourSource, /publish-fab/);
  assert.match(tourSource, /data-tour="admin-preview"/);
});

test('orientation tour is an accessible dismissible dialog', () => {
  assert.match(tourSource, /role="dialog"/);
  assert.match(tourSource, /aria-modal="true"/);
  assert.match(tourSource, /event\.key === 'Escape'/);
  assert.match(tourSource, /event\.key !== 'Tab'/);
  assert.match(tourSource, /aria-label="Tour schließen und später fortsetzen"/);
  assert.match(tourSource, /<ol aria-label=/);
  assert.match(tourSource, /sessionStorage\.setItem\(onboardingDismissedKey/);
  assert.doesNotMatch(tourSource, /onClick=\{finish\}[^>]*\/>/);
});

test('task checklist exposes all six actionable onboarding steps', () => {
  for (const title of [
    'Unternehmensdaten bestätigen',
    'Marke und Design prüfen',
    'Seiten, Collections und Inhalte prüfen',
    'Navigation, Footer und Rechtliches prüfen',
    'Desktop- und Mobile-Vorschau öffnen',
    'Website veröffentlichen',
  ]) {
    assert.match(checklistSource, new RegExp(title));
  }
  assert.match(checklistSource, />Später</);
  assert.match(checklistSource, /preview\.open\(\)/);
});

test('help hub has search, quick actions, deep links and feature-specific states', () => {
  assert.match(helpHubSource, /id="help-search"/);
  assert.match(helpHubSource, /Ich möchte …/);
  assert.match(helpHubSource, /href=\{`#hilfe-\$\{category\.id\}`\}/);
  for (const category of [
    'Inhalte',
    'Design',
    'Navigation und Sichtbarkeit',
    'Bearbeiten',
    'Anfragen und bezahlte Funktionen',
    'Website-Check und Fehlerbehebung',
  ]) {
    assert.match(helpHubSource, new RegExp(category));
  }
  for (const module of ['Online-Shop', 'Booking Pro', 'Rechnungen und Kunden', 'Mehrsprachigkeit']) {
    assert.match(helpHubSource, new RegExp(module));
  }
  assert.match(helpHubSource, /statusEntry\(features\.shop/);
  assert.match(helpHubSource, /statusEntry\(features\.booking/);
  assert.match(helpHubSource, /statusEntry\(features\.billing/);
  assert.match(helpHubSource, /statusEntry\(features\.i18n/);
});
