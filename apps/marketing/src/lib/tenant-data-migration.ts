import type { Database } from '@flamingo/db';
import {
  adminSecrets,
  auditLog,
  bookingAvailabilityRules,
  bookingBlackouts,
  bookingCalendarBlocks,
  bookingCustomers,
  bookingRequests,
  bookingResources,
  bookingServices,
  bookingSettings,
  bookingStatusHistory,
  billingDeliveryAttempts,
  billingFreeTextDocuments,
  billingDocumentEvents,
  billingDocumentItems,
  billingDocuments,
  billingPayments,
  billingPortalLinks,
  billingRecurringRuns,
  billingRecurringSchedules,
  billingReminders,
  billingServices,
  billingSettings,
  collectionItems,
  collections,
  consentCategories,
  coupons,
  customFormDeliveries,
  customerCustomFieldDefinitions,
  customers,
  draftStates,
  emailTemplates,
  footer,
  formSubmissions,
  globalSettings,
  instagramConnections,
  instagramPosts,
  invoices,
  mediaAssets,
  navigation,
  orderStatusHistory,
  orders,
  pageSections,
  pages,
  productCategories,
  products,
  productVariants,
  promotions,
  publicFlowRequests,
  publishedSnapshots,
  publishHistory,
  reservations,
  routes,
  rsvpResponses,
  scripts,
  seoGlobal,
  seoItem,
  seoPage,
  shippingMethods,
  shippingZones,
  shopSettings,
  taxRates,
  tenantAddons,
  tenantApiTokens,
  tenantDomains,
  tenants,
  variantOptions,
} from '@flamingo/db';
import { and, count, eq, inArray, sql } from 'drizzle-orm';

type CopyResult = { tables: Record<string, number>; totalRows: number };

function assertTenantUuid(tenantId: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(tenantId)) {
    throw new Error('Ungültige Tenant-ID für die Datenmigration.');
  }
}

async function tenantDataSignatures(database: Database, tenantId: string) {
  assertTenantUuid(tenantId);
  const selections = TENANT_TABLES.map(([name]) => `
    SELECT '${name}' AS table_name, count(*)::integer AS row_count,
      md5(COALESCE(string_agg(row_digest, '' ORDER BY row_digest), '')) AS content_digest
    FROM (
      SELECT md5(to_jsonb(row_data)::text) AS row_digest
      FROM "${name}" AS row_data
      WHERE "tenant_id" = '${tenantId}'::uuid
    ) AS tenant_signatures`);
  selections.push(`
    SELECT 'order_status_history' AS table_name, count(*)::integer AS row_count,
      md5(COALESCE(string_agg(row_digest, '' ORDER BY row_digest), '')) AS content_digest
    FROM (
      SELECT md5(to_jsonb(history_row)::text) AS row_digest
      FROM "order_status_history" AS history_row
      INNER JOIN "orders" AS tenant_order ON tenant_order."id" = history_row."order_id"
      WHERE tenant_order."tenant_id" = '${tenantId}'::uuid
    ) AS history_signatures`);
  const result = await database.execute(sql.raw(selections.join('\nUNION ALL\n')));
  const rows = (result.rows || []) as Array<{ table_name: string; row_count?: number | string; content_digest?: string }>;
  return new Map(rows.map(row => [row.table_name, {
    count: Number(row.row_count || 0),
    digest: row.content_digest || '',
  }]));
}

const TENANT_TABLES = [
  ['tenant_domains', tenantDomains],
  ['admin_secrets', adminSecrets],
  ['global_settings', globalSettings],
  ['navigation', navigation],
  ['footer', footer],
  ['pages', pages],
  ['page_sections', pageSections],
  ['draft_states', draftStates],
  ['published_snapshots', publishedSnapshots],
  ['publish_history', publishHistory],
  ['seo_global', seoGlobal],
  ['seo_page', seoPage],
  ['scripts', scripts],
  ['consent_categories', consentCategories],
  ['media_assets', mediaAssets],
  ['collections', collections],
  ['collection_items', collectionItems],
  ['seo_item', seoItem],
  ['routes', routes],
  ['audit_log', auditLog],
  ['form_submissions', formSubmissions],
  // Metadata-only, but still tenant-owned and protected by an FK to tenants.
  // It must be present before a source tenant can be removed.
  ['custom_form_deliveries', customFormDeliveries],
  ['rsvp_responses', rsvpResponses],
  ['reservations', reservations],
  ['tenant_api_tokens', tenantApiTokens],
  ['public_flow_requests', publicFlowRequests],
  ['tenant_addons', tenantAddons],
  ['shop_settings', shopSettings],
  ['product_categories', productCategories],
  ['products', products],
  ['product_variants', productVariants],
  ['variant_options', variantOptions],
  ['tax_rates', taxRates],
  ['shipping_zones', shippingZones],
  ['shipping_methods', shippingMethods],
  ['coupons', coupons],
  ['promotions', promotions],
  ['customer_custom_field_definitions', customerCustomFieldDefinitions],
  ['customers', customers],
  ['orders', orders],
  ['invoices', invoices],
  ['billing_settings', billingSettings],
  ['billing_services', billingServices],
  // billing_documents.recurring_schedule_id has a database-level FK even
  // though the relation cannot be expressed before both Drizzle tables are
  // declared. Schedules therefore have to exist before documents are copied.
  ['billing_recurring_schedules', billingRecurringSchedules],
  ['billing_documents', billingDocuments],
  ['billing_free_text_documents', billingFreeTextDocuments],
  ['billing_document_items', billingDocumentItems],
  ['billing_payments', billingPayments],
  ['billing_reminders', billingReminders],
  ['billing_recurring_runs', billingRecurringRuns],
  ['billing_portal_links', billingPortalLinks],
  ['billing_document_events', billingDocumentEvents],
  ['billing_delivery_attempts', billingDeliveryAttempts],
  ['booking_settings', bookingSettings],
  ['booking_resources', bookingResources],
  ['booking_services', bookingServices],
  ['booking_availability_rules', bookingAvailabilityRules],
  ['booking_calendar_blocks', bookingCalendarBlocks],
  ['booking_blackouts', bookingBlackouts],
  ['booking_customers', bookingCustomers],
  ['booking_requests', bookingRequests],
  ['booking_status_history', bookingStatusHistory],
  ['email_templates', emailTemplates],
  ['instagram_connections', instagramConnections],
  ['instagram_posts', instagramPosts],
] as const;

async function insertChunks(target: Database, table: unknown, rows: unknown[]) {
  for (let index = 0; index < rows.length; index += 100) {
    await (target as any).insert(table).values(rows.slice(index, index + 100));
  }
}

/**
 * Copies the complete customer data plane into an already migrated, empty DB.
 * Flamingo's own CRM tables deliberately remain in the central control plane.
 */
export async function copyTenantData(source: Database, target: Database, tenantId: string): Promise<CopyResult> {
  const [tenant] = await source.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  if (!tenant) throw new Error('Der Quell-Tenant wurde nicht gefunden.');
  await target.insert(tenants).values({ ...tenant, deploymentMode: 'standalone', isLead: false, status: 'provisioning', vercelProjectId: null });

  const result: CopyResult = { tables: { tenants: 1 }, totalRows: 1 };
  const finalizedBillingStatuses = new Map<string, string[]>();
  for (const [name, table] of TENANT_TABLES) {
    const rows = await (source.select() as any).from(table).where(eq((table as any).tenantId, tenantId));
    if (name === 'billing_documents') {
      // The target already has immutability triggers. Insert archived documents
      // temporarily as drafts so their line items can be restored, then restore
      // the original status after every dependent row has been copied.
      for (const row of rows as Array<{ id: string; status: string }>) {
        if (row.status === 'draft') continue;
        const ids = finalizedBillingStatuses.get(row.status) || [];
        ids.push(row.id);
        finalizedBillingStatuses.set(row.status, ids);
      }
      if (rows.length) await insertChunks(target, table, rows.map((row: { status: string }) => ({ ...row, status: 'draft' })));
    } else if (rows.length) {
      await insertChunks(target, table, rows);
    }
    result.tables[name] = rows.length;
    result.totalRows += rows.length;
  }

  // Restore the exact source values instead of maintaining a partial status
  // allow-list. The source schema already validates statuses, and this keeps
  // issued, partially_paid, accepted, rejected, expired, converted and future
  // valid states from silently remaining drafts after a tenant move.
  for (const [status, ids] of finalizedBillingStatuses) {
    for (let index = 0; index < ids.length; index += 500) {
      await target.update(billingDocuments).set({ status }).where(inArray(billingDocuments.id, ids.slice(index, index + 500)));
    }
  }

  const sourceOrders = await source.select({ id: orders.id }).from(orders).where(eq(orders.tenantId, tenantId));
  const orderIds = sourceOrders.map(order => order.id);
  let historyRows: Array<typeof orderStatusHistory.$inferSelect> = [];
  for (let index = 0; index < orderIds.length; index += 500) {
    historyRows = historyRows.concat(await source.select().from(orderStatusHistory).where(inArray(orderStatusHistory.orderId, orderIds.slice(index, index + 500))));
  }
  if (historyRows.length) await insertChunks(target, orderStatusHistory, historyRows);
  result.tables.order_status_history = historyRows.length;
  result.totalRows += historyRows.length;
  return result;
}

/** Compares every tenant-owned table before the shared source may be purged. */
export async function verifyTenantDataCopy(source: Database, target: Database, tenantId: string) {
  const mismatches: Array<{ table: string; source: number; target: number; content?: boolean }> = [];
  const [sourceSignatures, targetSignatures] = await Promise.all([
    tenantDataSignatures(source, tenantId),
    tenantDataSignatures(target, tenantId),
  ]);
  for (const [name] of TENANT_TABLES) {
    const sourceSignature = sourceSignatures.get(name) || { count: 0, digest: '' };
    const targetSignature = targetSignatures.get(name) || { count: 0, digest: '' };
    if (sourceSignature.count !== targetSignature.count) {
      mismatches.push({ table: name, source: sourceSignature.count, target: targetSignature.count });
    } else if (sourceSignature.digest !== targetSignature.digest) {
      mismatches.push({ table: name, source: sourceSignature.count, target: targetSignature.count, content: true });
    }
  }
  const countBillingStatuses = async (database: Database) => {
    const rows = await database
      .select({ status: billingDocuments.status, value: count() })
      .from(billingDocuments)
      .where(eq(billingDocuments.tenantId, tenantId))
      .groupBy(billingDocuments.status);
    return new Map(rows.map(row => [row.status, Number(row.value || 0)]));
  };
  const [sourceBillingStatuses, targetBillingStatuses] = await Promise.all([
    countBillingStatuses(source),
    countBillingStatuses(target),
  ]);
  const billingStatuses = new Set([...sourceBillingStatuses.keys(), ...targetBillingStatuses.keys()]);
  for (const status of billingStatuses) {
    const sourceValue = sourceBillingStatuses.get(status) || 0;
    const targetValue = targetBillingStatuses.get(status) || 0;
    if (sourceValue !== targetValue) mismatches.push({ table: `billing_documents:${status}`, source: sourceValue, target: targetValue });
  }
  const sourceHistory = sourceSignatures.get('order_status_history') || { count: 0, digest: '' };
  const targetHistory = targetSignatures.get('order_status_history') || { count: 0, digest: '' };
  if (sourceHistory.count !== targetHistory.count) {
    mismatches.push({ table: 'order_status_history', source: sourceHistory.count, target: targetHistory.count });
  } else if (sourceHistory.digest !== targetHistory.digest) {
    mismatches.push({ table: 'order_status_history', source: sourceHistory.count, target: targetHistory.count, content: true });
  }
  const tenantProjection = {
    id: tenants.id,
    name: tenants.name,
    slug: tenants.slug,
    industry: tenants.industry,
    activeStyle: tenants.activeStyle,
    sessionVersion: tenants.sessionVersion,
    isDemo: tenants.isDemo,
    i18nEnabled: tenants.i18nEnabled,
    i18nMaxLanguages: tenants.i18nMaxLanguages,
    i18nDefaultLocale: tenants.i18nDefaultLocale,
    i18nLocales: tenants.i18nLocales,
    i18nSwitcherStyle: tenants.i18nSwitcherStyle,
    i18nSwitcherPosition: tenants.i18nSwitcherPosition,
    createdAt: tenants.createdAt,
  };
  const [[sourceTenant], [targetTenant]] = await Promise.all([
    source.select(tenantProjection).from(tenants).where(eq(tenants.id, tenantId)).limit(1),
    target.select(tenantProjection).from(tenants).where(eq(tenants.id, tenantId)).limit(1),
  ]);
  if (!targetTenant) mismatches.push({ table: 'tenants', source: sourceTenant ? 1 : 0, target: 0 });
  else if (!sourceTenant || JSON.stringify(sourceTenant) !== JSON.stringify(targetTenant)) {
    mismatches.push({ table: 'tenants', source: sourceTenant ? 1 : 0, target: 1, content: true });
  }
  if (mismatches.length) {
    throw new Error(`Datenprüfung fehlgeschlagen: ${mismatches.map(item => item.content
      ? `${item.table} Inhalt weicht ab (${item.source} Zeilen)`
      : `${item.table} ${item.source}/${item.target}`).join(', ')}`);
  }
  return { verified: true as const, tables: TENANT_TABLES.length + 2 };
}

/**
 * Registry recovery can legitimately have no readable source registry left.
 * In that case we still refuse a blind cutover: the supplied target must carry
 * a complete, bootable tenant core before it can become authoritative.
 */
export async function verifyStandaloneTargetReady(target: Database, tenantId: string) {
  const [[tenant], [secretCount], [settingsCount], [pageCount], [snapshotCount]] = await Promise.all([
    target.select({ id: tenants.id, deploymentMode: tenants.deploymentMode }).from(tenants).where(eq(tenants.id, tenantId)).limit(1),
    target.select({ value: count() }).from(adminSecrets).where(eq(adminSecrets.tenantId, tenantId)),
    target.select({ value: count() }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)),
    target.select({ value: count() }).from(pages).where(eq(pages.tenantId, tenantId)),
    target.select({ value: count() }).from(publishedSnapshots)
      .where(and(eq(publishedSnapshots.tenantId, tenantId), eq(publishedSnapshots.isActive, true))),
  ]);
  const missing = [
    !tenant ? 'tenant' : '',
    tenant && tenant.deploymentMode !== 'standalone' ? 'deployment_mode' : '',
    Number(secretCount?.value || 0) < 1 ? 'admin_secret' : '',
    Number(settingsCount?.value || 0) < 1 ? 'global_settings' : '',
    Number(pageCount?.value || 0) < 1 ? 'pages' : '',
    Number(snapshotCount?.value || 0) < 1 ? 'active_snapshot' : '',
  ].filter(Boolean);
  if (missing.length) throw new Error(`Standalone-Ziel ist nicht einsatzbereit: ${missing.join(', ')}`);
  return { verified: true as const };
}

/** Removes copied customer data from the shared database after a successful cutover. */
export async function purgeSharedTenantData(source: Database, tenantId: string) {
  await source.execute(sql.raw(buildAtomicTenantPurgeSql(tenantId)));
}

/** Atomically purges the source and completes the owner-checked operation. */
export async function purgeSharedTenantDataWithOperation(source: Database, input: {
  tenantId: string;
  operationKey: string;
  ownerToken: string;
}) {
  await source.execute(sql.raw(buildAtomicTenantPurgeSql(input.tenantId, {
    operationKey: input.operationKey,
    ownerToken: input.ownerToken,
  })));
}

/**
 * neon-http does not support Drizzle's interactive transaction callback. A DO
 * block is one PostgreSQL statement and therefore one atomic transaction: the
 * tenant-scoped maintenance capability and every delete succeed or roll back
 * together. Table names come exclusively from the static migration registry.
 */
export function buildAtomicTenantPurgeSql(tenantId: string, operation?: { operationKey: string; ownerToken: string }) {
  assertTenantUuid(tenantId);
  const purgeTables = [...TENANT_TABLES].reverse().filter(([name]) => name !== 'tenant_domains');
  const statements = purgeTables
    .map(([name]) => `DELETE FROM "${name}" WHERE "tenant_id" = '${tenantId}'::uuid;`)
    .join('\n');
  let completeOperation = '';
  let declaration = '';
  if (operation) {
    if (!/^[a-z0-9:_-]{1,180}$/i.test(operation.operationKey)) throw new Error('Ungültiger Operation-Key für die Datenbereinigung.');
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(operation.ownerToken)) {
      throw new Error('Ungültiger Operation-Owner für die Datenbereinigung.');
    }
    declaration = 'DECLARE\n  operation_rows integer;\n';
    completeOperation = `\nUPDATE "tenant_operations" SET "status" = 'completed', "phase" = 'completed', "result" = '{"purged":true}'::jsonb, "heartbeat_at" = now(), "completed_at" = now(), "updated_at" = now() WHERE "operation_key" = '${operation.operationKey}' AND "owner_token" = '${operation.ownerToken}'::uuid AND "status" = 'running';\nGET DIAGNOSTICS operation_rows = ROW_COUNT;\nIF operation_rows <> 1 THEN RAISE EXCEPTION 'tenant operation ownership lost'; END IF;`;
  }
  return `DO $flamingo_tenant_purge$\n${declaration}BEGIN\n  PERFORM set_config('flamingo.tenant_maintenance_tenant', '${tenantId}', true);\n${statements}${completeOperation}\nEND\n$flamingo_tenant_purge$;`;
}
