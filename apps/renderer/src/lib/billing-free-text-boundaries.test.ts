import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '../..');
const source = (relative: string) => readFileSync(path.join(root, relative), 'utf8');

test('free-text reads, writes and downloads are tenant scoped and add-on gated', () => {
  const actions = source('apps/renderer/src/app/admin/billing/free-text-actions.ts');
  const route = source('apps/renderer/src/app/api/billing/free-text-documents/[id]/pdf/route.ts');
  const artifacts = source('apps/renderer/src/lib/billing-artifacts.ts');
  assert.match(actions, /eq\(billingFreeTextDocuments\.tenantId, tenantId\)/);
  assert.match(actions, /eq\(tenantAddons\.tenantId, session\.tenantId\)/);
  assert.match(actions, /eq\(billingFreeTextDocuments\.status, 'draft'\)/);
  const finalization = actions.slice(actions.indexOf('export async function finalizeFreeTextDocumentAction'));
  const claim = finalization.indexOf("status: 'finalizing'");
  const render = finalization.indexOf('renderFreeTextDocumentPdf');
  assert.ok(claim > 0 && render > claim, 'one request must atomically claim finalization before rendering or uploading');
  assert.match(actions, /immutableSha256: pdfSha256/);
  assert.match(actions, /Date\.now\(\) - 10 \* 60_000/);
  assert.match(actions, /lte\(billingFreeTextDocuments\.updatedAt, staleBefore\)/);
  assert.match(actions, /const claimToken = randomUUID\(\)/);
  assert.match(actions, /eq\(billingFreeTextDocuments\.finalizationToken, current\.finalizationToken\)/, 'stale recovery must replace the exact old claim');
  assert.match(actions, /eq\(billingFreeTextDocuments\.finalizationToken, token\)/, 'commit and release must be claim-owner scoped');
  assert.match(route, /eq\(billingFreeTextDocuments\.tenantId, session\.tenantId\)/);
  assert.match(route, /eq\(billingFreeTextDocuments\.status, 'finalized'\)/);
  assert.match(route, /uuid\(\)\.safeParse\(id\)/);
  assert.match(route, /artifactSha256\(pdf\) !== document\.pdfSha256/);
  assert.match(artifacts, /allowOverwrite: !input\.immutableSha256/);
  assert.match(artifacts, /deleteBillingArtifact/);
});

test('migration enforces immutability without blocking tenant cascade deletion', () => {
  const migration = source('packages/db/drizzle/0028_billing_free_text_documents.sql');
  assert.match(migration, /OLD\.status = 'finalized'/);
  assert.match(migration, /EXISTS \(SELECT 1 FROM tenants WHERE id = OLD\.tenant_id\)/);
  assert.match(migration, /current_setting\('flamingo\.tenant_maintenance_tenant', true\)/);
  assert.match(migration, /finalized_artifact_check/);
  assert.match(migration, /finalization_claim_check/);
  assert.match(migration, /ON DELETE CASCADE/);
  assert.match(migration, /IF TG_OP = 'DELETE' THEN[\s\S]*RETURN OLD;/, 'allowed DELETE operations and tenant cascades must not be suppressed by a null NEW row');
});

test('standalone tenant copies include the dedicated correspondence table', () => {
  const migration = source('apps/marketing/src/lib/tenant-data-migration.ts');
  assert.match(migration, /\['billing_free_text_documents', billingFreeTextDocuments\]/);
});
