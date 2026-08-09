import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

function functionBody(contents: string, start: string, end: string) {
  const from = contents.indexOf(start);
  const to = contents.indexOf(end, from + start.length);
  assert.notEqual(from, -1, `missing function boundary: ${start}`);
  assert.notEqual(to, -1, `missing function boundary: ${end}`);
  return contents.slice(from, to);
}

test('draft metadata and all line replacements are one atomic SQL statement', () => {
  const actions = source('../app/admin/billing/actions.ts');
  const body = functionBody(actions, 'async function saveBillingDraftForTenant', 'export async function saveBillingDraftAction');

  assert.match(body, /WITH saved_document AS \(/);
  assert.match(body, /deleted_items AS \(/);
  assert.match(body, /inserted_items AS \(/);
  assert.match(body, /jsonb_to_recordset/);
  assert.match(body, /document\.document_number IS NULL/);
  assert.match(body, /draft_revision = document\.draft_revision \+ 1/);
  assert.match(body, /service_id: value\.lines/);
  assert.match(body, /Number\(saved\.item_count\) !== itemRows\.length/);
  assert.doesNotMatch(body, /await db\.delete\(/, 'delete-then-insert must never happen outside the atomic CTE');
  assert.doesNotMatch(body, /\.transaction\(async/, 'neon-http does not support interactive transactions');
});

test('billing audit events have a retryable, document-linear database order', () => {
  const actions = source('../app/admin/billing/actions.ts');
  const schema = source('../../../../packages/db/src/schema/index.ts');
  const migration = source('../../../../packages/db/drizzle/0031_billing_event_linear_chain.sql');
  const body = functionBody(actions, 'async function appendEvent', 'async function finalizeBillingDocumentForTenant');

  assert.match(migration, /ADD COLUMN IF NOT EXISTS "chain_position" bigint/);
  assert.match(migration, /row_number\(\) OVER/);
  assert.match(migration, /ALTER COLUMN "chain_position" SET NOT NULL/);
  assert.match(migration, /CREATE UNIQUE INDEX IF NOT EXISTS "billing_document_events_chain_position_idx"/);
  assert.match(schema, /chainPosition: bigint\('chain_position'[\s\S]*\.notNull\(\)/);
  assert.match(schema, /uniqueIndex\('billing_document_events_chain_position_idx'\)/);
  assert.match(actions, /function isBillingEventChainConflict/);
  assert.match(actions, /code === '23505'/);
  assert.match(actions, /billing_document_events_hash_idx/);
  assert.match(actions, /withBillingEventChainRetry/);
  assert.match(actions, /const maxAttempts = 8/);
  assert.match(body, /pg_advisory_xact_lock/);
  assert.match(body, /ORDER BY event\.chain_position DESC NULLS LAST, event\.created_at DESC, event\.id DESC/);
  assert.match(body, /coalesce\(previous_event\.chain_position, 0\) \+ 1/);
  assert.match(body, /previous_event\.event_hash/);
  assert.match(body, /sha256\(convert_to\(/);
  assert.match(body, /'\{"previousHash":'/);
  assert.match(body, /'\,"tenantId":'/);
  assert.match(body, /'\,"documentId":'/);
  assert.match(body, /'\,"eventType":'/);
  assert.match(body, /'\,"payload":'/);
});

test('finalization claims the exact draft snapshot and commits document plus event atomically', () => {
  const actions = source('../app/admin/billing/actions.ts');
  const schema = source('../../../../packages/db/src/schema/index.ts');
  const migration = source('../../../../packages/db/drizzle/0031_billing_event_linear_chain.sql');
  const claim = functionBody(actions, 'async function claimDocumentNumber', 'function isBillingEventChainConflict');
  const finalize = functionBody(actions, 'async function finalizeBillingDocumentForTenant', 'export async function finalizeBillingDocumentAction');

  assert.match(migration, /ADD COLUMN IF NOT EXISTS "draft_revision" bigint DEFAULT 0 NOT NULL/);
  assert.match(migration, /ADD COLUMN IF NOT EXISTS "configuration_revision" bigint DEFAULT 0 NOT NULL/);
  assert.match(schema, /draftRevision: bigint\('draft_revision'[\s\S]*\.notNull\(\)\.default\(0\)/);
  assert.match(schema, /configurationRevision: bigint\('configuration_revision'[\s\S]*\.notNull\(\)\.default\(0\)/);
  assert.match(claim, /status = 'draft'/);
  assert.match(claim, /draft_revision = \$\{expectedDraftRevision\}/);
  assert.match(claim, /draft_revision = document\.draft_revision \+ 1/);
  assert.match(claim, /settings\.configuration_revision = \$\{settings\.configurationRevision\}/);
  assert.match(claim, /document_number IS NULL/);
  assert.match(finalize, /if \(!claim\.claimed\)/);
  assert.match(finalize, /settings\.configurationRevision !== initialSettings\.configurationRevision/);
  assert.ok(
    finalize.indexOf('const claim = await claimDocumentNumber') < finalize.lastIndexOf('db.select().from(billingDocumentItems)'),
    'items must be read again after the finalization claim',
  );
  assert.match(finalize, /immutableSha256: pdfSha256/);
  assert.match(finalize, /WITH document_lock AS \(/);
  assert.match(finalize, /settings_guard AS MATERIALIZED \(/);
  assert.match(finalize, /settings\.configuration_revision = \$\{settings\.configurationRevision\}/);
  assert.match(finalize, /FOR SHARE OF settings/);
  assert.match(finalize, /finalized_document AS \(/);
  assert.match(finalize, /inserted_event AS \(/);
  assert.match(finalize, /final_document\.status = 'draft'/);
  assert.match(finalize, /final_document\.document_number = \$\{documentNumber\}/);
  assert.match(finalize, /final_document\.draft_revision = \$\{claim\.claimRevision\}/);
  assert.match(finalize, /deleteBillingArtifact\(pdfBlobUrl\)/);
  assert.match(finalize, /deleteBillingArtifact\(xmlBlobUrl\)/);
  assert.match(finalize, /const artifactResults = await Promise\.allSettled/);
  assert.match(finalize, /pdfBlobUrl = artifactResults\[0\]\.value/);
  assert.match(finalize, /xmlBlobUrl = artifactResults\[1\]\.value/);
  assert.match(finalize, /set\(\{[\s\S]*documentNumber: null,[\s\S]*draftRevision:/);
  assert.doesNotMatch(finalize, /\.transaction\(async/, 'finalization must remain compatible with neon-http');
});
