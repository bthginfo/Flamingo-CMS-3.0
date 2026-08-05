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
  ['billing_documents', billingDocuments],
  ['billing_free_text_documents', billingFreeTextDocuments],
  ['billing_document_items', billingDocumentItems],
  ['billing_payments', billingPayments],
  ['billing_reminders', billingReminders],
  ['billing_recurring_schedules', billingRecurringSchedules],
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
  const finalizedBillingStatuses: Array<{ id: string; status: string }> = [];
  for (const [name, table] of TENANT_TABLES) {
    const rows = await (source.select() as any).from(table).where(eq((table as any).tenantId, tenantId));
    if (name === 'billing_documents') {
      // The target already has immutability triggers. Insert archived documents
      // temporarily as drafts so their line items can be restored, then restore
      // the original status after every dependent row has been copied.
      finalizedBillingStatuses.push(...rows.filter((row: { status: string }) => row.status !== 'draft').map((row: { id: string; status: string }) => ({ id: row.id, status: row.status })));
      if (rows.length) await insertChunks(target, table, rows.map((row: { status: string }) => ({ ...row, status: 'draft' })));
    } else if (rows.length) {
      await insertChunks(target, table, rows);
    }
    result.tables[name] = rows.length;
    result.totalRows += rows.length;
  }

  for (const status of ['finalized', 'sent', 'paid', 'cancelled']) {
    const ids = finalizedBillingStatuses.filter(item => item.status === status).map(item => item.id);
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
  const mismatches: Array<{ table: string; source: number; target: number }> = [];
  for (const [name, table] of TENANT_TABLES) {
    const [sourceCount] = await (source as any).select({ value: count() }).from(table).where(eq((table as any).tenantId, tenantId));
    const [targetCount] = await (target as any).select({ value: count() }).from(table).where(eq((table as any).tenantId, tenantId));
    const sourceValue = Number(sourceCount?.value || 0);
    const targetValue = Number(targetCount?.value || 0);
    if (sourceValue !== targetValue) mismatches.push({ table: name, source: sourceValue, target: targetValue });
  }
  for (const status of ['draft', 'finalized', 'sent', 'paid', 'cancelled']) {
    const [[sourceCount], [targetCount]] = await Promise.all([
      source.select({ value: count() }).from(billingDocuments).where(and(eq(billingDocuments.tenantId, tenantId), eq(billingDocuments.status, status))),
      target.select({ value: count() }).from(billingDocuments).where(and(eq(billingDocuments.tenantId, tenantId), eq(billingDocuments.status, status))),
    ]);
    const sourceValue = Number(sourceCount?.value || 0);
    const targetValue = Number(targetCount?.value || 0);
    if (sourceValue !== targetValue) mismatches.push({ table: `billing_documents:${status}`, source: sourceValue, target: targetValue });
  }
  const sourceOrders = await source.select({ id: orders.id }).from(orders).where(eq(orders.tenantId, tenantId));
  const targetOrders = await target.select({ id: orders.id }).from(orders).where(eq(orders.tenantId, tenantId));
  const countOrderHistory = async (database: Database, orderIds: string[]) => {
    let value = 0;
    for (let index = 0; index < orderIds.length; index += 500) {
      const [row] = await database.select({ value: count() }).from(orderStatusHistory).where(inArray(orderStatusHistory.orderId, orderIds.slice(index, index + 500)));
      value += Number(row?.value || 0);
    }
    return value;
  };
  const [sourceHistoryCount, targetHistoryCount] = await Promise.all([
    countOrderHistory(source, sourceOrders.map(order => order.id)),
    countOrderHistory(target, targetOrders.map(order => order.id)),
  ]);
  if (sourceHistoryCount !== targetHistoryCount) mismatches.push({ table: 'order_status_history', source: sourceHistoryCount, target: targetHistoryCount });
  const [targetTenant] = await target.select({ id: tenants.id }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  if (!targetTenant) mismatches.push({ table: 'tenants', source: 1, target: 0 });
  if (mismatches.length) {
    throw new Error(`Datenprüfung fehlgeschlagen: ${mismatches.map(item => `${item.table} ${item.source}/${item.target}`).join(', ')}`);
  }
  return { verified: true as const, tables: TENANT_TABLES.length + 2 };
}

/** Removes copied customer data from the shared database after a successful cutover. */
export async function purgeSharedTenantData(source: Database, tenantId: string) {
  const purgeTables = [...TENANT_TABLES].reverse().filter(([name]) => name !== 'tenant_domains');
  await source.transaction(async transaction => {
    // Transaction-local, tenant-bound maintenance capability. The database
    // trigger still rejects ordinary deletion of finalized correspondence.
    await transaction.execute(sql`SELECT set_config('flamingo.tenant_maintenance_tenant', ${tenantId}, true)`);
    for (const [, table] of purgeTables) {
      await (transaction as any).delete(table).where(eq((table as any).tenantId, tenantId));
    }
  });
}
