import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), 'utf8');

test('all public shop entry points enforce the active paid entitlement', () => {
  for (const path of [
    '../app/api/shop/products/route.ts',
    '../app/api/shop/products/[slug]/route.ts',
    '../app/api/shop/shipping/route.ts',
    '../app/api/shop/coupon/route.ts',
    '../app/api/shop/checkout/route.ts',
  ]) {
    const source = read(path);
    assert.match(source, /isShopActive\(tenantId\)/, `${path} must gate the public shop`);
  }
  const publicPage = read('../app/[[...slug]]/page.tsx');
  assert.match(publicPage, /shopActive \|\| !s\.type\.startsWith\('shop'\)/);
});

test('product detail API never exposes the digital delivery URL', () => {
  const source = read('../app/api/shop/products/[slug]/route.ts');
  assert.doesNotMatch(source, /product:\s*\{\s*\.\.\.product/);
  assert.doesNotMatch(source.slice(source.indexOf('return NextResponse.json')), /digitalFileUrl/);
});

test('booking cancellation GET only confirms and POST performs the mutation', () => {
  const source = read('../app/api/booking/cancel/route.ts');
  const getSource = source.slice(source.indexOf('export async function GET'), source.indexOf('export async function POST'));
  const postSource = source.slice(source.indexOf('export async function POST'));
  assert.doesNotMatch(getSource, /UPDATE booking_requests|db\.update\(bookingRequests\)/);
  assert.match(getSource, /<form method="post">/);
  assert.match(postSource, /UPDATE booking_requests/);
  assert.match(postSource, /INSERT INTO booking_status_history/);
});

test('simple reservations use durable throttling, bounded bodies and fixed statuses', () => {
  const route = read('../app/api/reservation/route.ts');
  const action = read('../app/admin/functions/reservations/actions.ts');
  assert.match(route, /isTrustedRendererContactOrigin\(req\)/);
  assert.match(route, /readBoundedRendererContactJson\(req, 64 \* 1024\)/);
  assert.match(route, /consumeRendererContactRateRules/);
  assert.match(action, /\['pending', 'confirmed', 'cancelled'\]\.includes\(status\)/);
});

test('billing routes and mutations enforce tenant session and paid entitlement', () => {
  const actions = read('../app/admin/billing/actions.ts');
  const pdf = read('../app/api/billing/documents/[id]/pdf/route.ts');
  const xml = read('../app/api/billing/documents/[id]/xrechnung/route.ts');
  assert.match(actions, /getWritableSession\(\)/);
  assert.match(actions, /eq\(tenantAddons\.addonKey, BILLING_ADDON_KEY\)/);
  assert.match(actions, /eq\(billingDocuments\.tenantId, tenantId\)/);
  for (const route of [pdf, xml]) {
    assert.match(route, /getWritableSession\(\)/);
    assert.match(route, /eq\(billingDocuments\.tenantId, session\.tenantId\)/);
    assert.match(route, /Cache-Control': 'private, no-store/);
  }
});

test('billing entitlement uses one shared key and truthful active/locked admin states', () => {
  const crmActions = read('../../../marketing/src/app/crm/tenants/actions.ts');
  const crmUi = read('../../../marketing/src/app/crm/tenants/[id]/tenant-actions.tsx');
  const functionsPage = read('../app/admin/functions/page.tsx');
  const functionsClient = read('../app/admin/functions/functions-client.tsx');
  const billingPage = read('../app/admin/billing/page.tsx');
  const sharedConstant = read('../../../../packages/db/src/constants.ts');
  assert.match(sharedConstant, /BILLING_ADDON_KEY\s*=\s*'billing'/);
  assert.match(crmActions, /getTenantDataDb\(tenantId\)/, 'CRM writes must target the tenant data database');
  assert.match(crmActions, /eq\(tenantAddons\.addonKey, BILLING_ADDON_KEY\)/);
  assert.doesNotMatch(crmActions.slice(crmActions.indexOf('toggleBillingAddonAction'), crmActions.indexOf('getBillingAddonStatus')), /delete\(billing/);
  assert.match(crmUi, /toast\.error/);
  assert.match(crmUi, /Belegarchive bleiben vollständig erhalten/);
  assert.match(functionsPage, /addon\.key === BILLING_ADDON_KEY/);
  assert.match(functionsClient, /billingPresentation = billingEnabled/);
  assert.match(functionsClient, /href:\s*'\/admin\/billing'/);
  assert.match(functionsClient, /href=\{billingPresentation\?\.href \|\| '\/admin\/billing'\}/);
  assert.match(functionsClient, /Einrichtung offen/);
  assert.match(functionsClient, /Modul anfragen/);
  assert.doesNotMatch(functionsClient, /label="Verfügbar"|status: 'Verfügbar'/);
  assert.match(functionsClient, /label="Premium"/);
  assert.match(functionsClient, /status: 'Premium'/);
  assert.match(billingPage, /eq\(tenantAddons\.addonKey, BILLING_ADDON_KEY\)/);
  assert.match(billingPage, /if \(!addon\?\.active\) return <BillingPaywall/);
});

test('billing finalization is immutable, numbered atomically and delivered with PDF plus XML', () => {
  const actions = read('../app/admin/billing/actions.ts');
  const artifacts = read('../lib/billing-artifacts.ts');
  const migration = read('../../../../packages/db/drizzle/0021_billing_customer_management.sql');
  const operationsMigration = read('../../../../packages/db/drizzle/0022_billing_operations_suite.sql');
  const artifactMigration = read('../../../../packages/db/drizzle/0025_billing_artifact_blob_storage.sql');
  assert.match(actions, /WITH locked_document AS MATERIALIZED/);
  assert.match(actions, /settings\.sequence_period IS NULL AND \$\{type\} = 'invoice' THEN settings\.next_invoice_number/);
  assert.match(actions, /const finalizedStatus = type === 'quote' \? 'issued' : 'finalized'/);
  assert.match(actions, /status: finalizedStatus/);
  assert.match(actions, /storeBillingArtifact\(\{ tenantId, documentId, documentNumber, kind: 'pdf'/);
  assert.match(actions, /pdfBase64: pdfBlobUrl \? null : Buffer\.from\(pdf\)\.toString\('base64'\)/);
  assert.match(actions, /readBillingPdfArtifact\(\{ blobUrl: document\.pdfBlobUrl, base64: document\.pdfBase64 \}\)/);
  assert.match(artifacts, /isTrustedBlobUrl/);
  assert.match(artifacts, /\.public\.blob\.vercel-storage\.com/);
  assert.match(actions, /attachments: \[/);
  assert.match(actions, /application\/pdf/);
  assert.match(actions, /application\/xml/);
  assert.match(migration, /Finalized billing document content is immutable/);
  assert.match(migration, /Billing audit events are append-only/);
  assert.match(operationsMigration, /billing_recurring_runs_schedule_time_idx/);
  assert.match(operationsMigration, /Billing payment entries are append-only/);
  assert.match(artifactMigration, /pdf_blob_url/);
  assert.match(artifactMigration, /xml_blob_url/);
});

test('billing automation and customer shares fail closed and remain tenant scoped', () => {
  const actions = read('../app/admin/billing/actions.ts');
  const cron = read('../app/api/cron/billing-recurring/route.ts');
  const portal = read('../app/billing/share/[token]/page.tsx');
  const portalPdf = read('../app/billing/share/[token]/pdf/route.ts');
  assert.match(actions, /authorization !== `Bearer \$\{secret\}`/);
  assert.match(actions, /eq\(billingRecurringSchedules\.tenantId, tenantId\)/);
  assert.match(actions, /onConflictDoNothing/);
  assert.match(cron, /request\.headers\.get\('authorization'\)/);
  assert.match(portal, /sha256\(token\)/);
  assert.match(portalPdf, /sha256\(token\)/);
  assert.match(portalPdf, /readBillingPdfArtifact/);
  assert.match(portalPdf, /private, no-store/);
});
