import test from 'node:test';
import assert from 'node:assert/strict';
import { buildHagnContent } from './prepare-content.mjs';
import { createRequire } from 'node:module';
const { validateHagnContent } = createRequire(import.meta.url)('./publish-content.ts');

const content = buildHagnContent();

test('the actual complete export validates before any connection is opened', () => {
  assert.doesNotThrow(() => validateHagnContent(content));
});

test('an otherwise valid export cannot cross the isolated database boundary', () => {
  assert.throws(() => validateHagnContent(content, 'postgresql://flamingo_owner:test@ep-central.invalid/flamingo'), /Only the new isolated database/);
});

test('a cross-tenant section and duplicate per-page SEO coverage fail before writes', () => {
  const crossTenant = structuredClone(content);
  crossTenant.sections[0].tenant_id = '00000000-0000-0000-0000-000000000001';
  assert.throws(() => validateHagnContent(crossTenant), /Cross-tenant payload/);
  const duplicate = structuredClone(content);
  duplicate.seoPages[1].page_id = duplicate.seoPages[0].page_id;
  assert.throws(() => validateHagnContent(duplicate), /SEO must cover distinct pages/);
});
