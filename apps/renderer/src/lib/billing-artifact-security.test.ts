import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '../..');
const source = (relative: string) => readFileSync(path.join(root, relative), 'utf8');

test('billing artifacts are private and only read with server-side credentials', () => {
  const artifacts = source('apps/renderer/src/lib/billing-artifacts.ts');
  assert.match(artifacts, /access: 'private'/);
  assert.match(artifacts, /await get\(url, \{[\s\S]*access: 'private'[\s\S]*token: process\.env\.BLOB_READ_WRITE_TOKEN/);
  assert.match(artifacts, /MAX_ARTIFACT_BYTES/);
  assert.match(artifacts, /isLegacyPublicBlobUrl/, 'already finalized legacy documents must remain readable during the private-storage rollout');
});

test('authenticated billing downloads are tenant scoped and integrity checked', () => {
  const pdfRoute = source('apps/renderer/src/app/api/billing/documents/[id]/pdf/route.ts');
  const xmlRoute = source('apps/renderer/src/app/api/billing/documents/[id]/xrechnung/route.ts');
  for (const route of [pdfRoute, xmlRoute]) {
    assert.match(route, /getWritableSession\(\)/);
    assert.match(route, /uuid\(\)\.safeParse\(id\)/);
    assert.match(route, /eq\(billingDocuments\.tenantId, session\.tenantId\)/);
    assert.match(route, /billingArtifactMatchesSha256/);
    assert.match(route, /'Cache-Control': 'private, no-store, max-age=0'/);
  }
});

test('token shares cannot cross tenant joins and reject modified artifacts', () => {
  const route = source('apps/renderer/src/app/billing/share/[token]/pdf/route.ts');
  assert.match(route, /eq\(billingDocuments\.tenantId, billingPortalLinks\.tenantId\)/);
  assert.match(route, /billingArtifactMatchesSha256\(pdf, row\.pdfSha256\)/);
  assert.match(route, /'X-Content-Type-Options': 'nosniff'/);
});
