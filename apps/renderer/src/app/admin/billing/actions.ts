'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { and, asc, desc, eq, inArray, isNull, ne, sql } from 'drizzle-orm';
import { z } from 'zod';
import {
  billingDeliveryAttempts,
  billingDocumentEvents,
  billingDocumentItems,
  billingDocuments,
  billingServices,
  billingSettings,
  customerCustomFieldDefinitions,
  customers,
  tenantAddons,
  tenants,
} from '@flamingo/db';
import { getDb } from '@/lib/db';
import { getSession, getWritableSession } from '@/lib/session';
import { createHardenedRendererSmtpTransport, getEffectiveSmtp, isValidSmtpAddress } from '@/lib/smtp';
import {
  BILLING_ADDON_KEY,
  calculateBillingTotals,
  generateXRechnung,
  renderBillingPdf,
  sequencePeriod,
  sha256,
  validateBillingReadiness,
  validateNumberFormat,
  type BillingCustomerSnapshot,
  type BillingDocumentSnapshot,
  type BillingLine,
  type BillingSellerSnapshot,
} from '@/lib/billing-core';

const nullableText = (max: number) => z.string().trim().max(max).optional().nullable().transform(value => value || null);
const addressSchema = z.object({
  street: z.string().trim().min(1).max(255),
  addressLine2: nullableText(255),
  postalCode: z.string().trim().min(1).max(30),
  city: z.string().trim().min(1).max(120),
  countryCode: z.string().trim().length(2).transform(value => value.toUpperCase()),
});

const settingsSchema = z.object({
  companyName: z.string().trim().min(1).max(255),
  legalForm: nullableText(120),
  street: z.string().trim().min(1).max(255),
  postalCode: z.string().trim().min(1).max(30),
  city: z.string().trim().min(1).max(120),
  countryCode: z.string().trim().length(2).transform(value => value.toUpperCase()),
  email: z.string().trim().email().max(255),
  phone: nullableText(80),
  website: nullableText(500),
  taxNumber: nullableText(100),
  vatId: nullableText(100),
  registerCourt: nullableText(160),
  registerNumber: nullableText(100),
  managingDirector: nullableText(255),
  logoUrl: z.union([z.literal(''), z.string().trim().url().max(1000)]).optional().transform(value => value || null),
  bankName: nullableText(160),
  accountHolder: nullableText(255),
  iban: nullableText(50),
  bic: nullableText(30),
  invoicePrefix: z.string().trim().min(1).max(20),
  cancellationPrefix: z.string().trim().min(1).max(20),
  invoiceNumberFormat: z.string().trim().min(3).max(120),
  cancellationNumberFormat: z.string().trim().min(3).max(120),
  sequenceReset: z.enum(['never', 'year', 'month']),
  nextInvoiceNumber: z.coerce.number().int().min(1).max(999_999_999),
  nextCancellationNumber: z.coerce.number().int().min(1).max(999_999_999),
  currency: z.literal('EUR').default('EUR'),
  defaultPaymentTermDays: z.coerce.number().int().min(0).max(365),
  defaultIntroText: nullableText(5000),
  defaultClosingText: nullableText(5000),
  defaultFooter: nullableText(2000),
  smallBusiness: z.boolean(),
  smallBusinessNotice: z.string().trim().min(3).max(1000),
  senderName: nullableText(255),
}).superRefine((value, context) => {
  const invoiceError = validateNumberFormat(value.invoiceNumberFormat);
  const cancellationError = validateNumberFormat(value.cancellationNumberFormat);
  if (invoiceError) context.addIssue({ code: 'custom', path: ['invoiceNumberFormat'], message: invoiceError });
  if (cancellationError) context.addIssue({ code: 'custom', path: ['cancellationNumberFormat'], message: cancellationError });
  for (const [path, format] of [
    ['invoiceNumberFormat', value.invoiceNumberFormat],
    ['cancellationNumberFormat', value.cancellationNumberFormat],
  ] as const) {
    if (value.sequenceReset === 'year' && !/\{YYYY\}|\{YY\}/.test(format)) {
      context.addIssue({ code: 'custom', path: [path], message: 'Bei jährlichem Neustart muss das Jahr im Format stehen.' });
    }
    if (value.sequenceReset === 'month' && (!/\{YYYY\}|\{YY\}/.test(format) || !format.includes('{MM}'))) {
      context.addIssue({ code: 'custom', path: [path], message: 'Bei monatlichem Neustart müssen Jahr und Monat im Format stehen.' });
    }
  }
  if (!value.taxNumber && !value.vatId) context.addIssue({ code: 'custom', path: ['taxNumber'], message: 'Steuernummer oder USt-IdNr. angeben.' });
});

const customerSchema = z.object({
  id: z.string().uuid().optional(),
  customerType: z.enum(['company', 'person']),
  companyName: nullableText(255),
  salutation: nullableText(40),
  firstName: nullableText(120),
  lastName: nullableText(120),
  name: z.string().trim().min(1).max(255),
  email: z.string().trim().email().max(255),
  phone: nullableText(50),
  mobile: nullableText(50),
  website: nullableText(500),
  taxNumber: nullableText(100),
  vatId: nullableText(100),
  eInvoiceRoutingId: nullableText(100),
  buyerReference: nullableText(100),
  language: z.enum(['de', 'en']).default('de'),
  paymentTermDays: z.coerce.number().int().min(0).max(365),
  notes: nullableText(10_000),
  billingAddress: addressSchema,
  shippingAddress: addressSchema.optional().nullable(),
  customFields: z.record(z.string().max(80), z.union([z.string().max(5000), z.number(), z.boolean(), z.null()])).default({}),
}).superRefine((value, context) => {
  if (value.customerType === 'company' && !value.companyName) context.addIssue({ code: 'custom', path: ['companyName'], message: 'Firmenname angeben.' });
  if (value.customerType === 'person' && !value.firstName && !value.lastName) context.addIssue({ code: 'custom', path: ['firstName'], message: 'Vor- oder Nachname angeben.' });
});

const customFieldSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().trim().min(1).max(120),
  fieldType: z.enum(['text', 'textarea', 'number', 'date', 'email', 'phone', 'boolean', 'select']),
  options: z.array(z.string().trim().min(1).max(120)).max(100).default([]),
  required: z.boolean().default(false),
});

const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  serviceCode: nullableText(80),
  name: z.string().trim().min(1).max(255),
  description: nullableText(5000),
  unitCode: z.string().trim().min(1).max(10).default('C62'),
  unitLabel: z.string().trim().min(1).max(40).default('Stück'),
  unitPriceNetCents: z.coerce.number().int().min(0).max(1_000_000_000),
  taxRateBasisPoints: z.coerce.number().int().min(0).max(10_000),
});

const lineSchema = z.object({
  id: z.string().uuid().optional(),
  serviceId: z.string().uuid().optional().nullable(),
  position: z.coerce.number().int().min(1).max(10_000),
  name: z.string().trim().min(1).max(255),
  description: nullableText(5000),
  quantity: z.coerce.number().positive().max(1_000_000),
  unitCode: z.string().trim().min(1).max(10),
  unitLabel: z.string().trim().min(1).max(40),
  unitPriceNetCents: z.coerce.number().int().min(0).max(1_000_000_000),
  discountBasisPoints: z.coerce.number().int().min(0).max(10_000),
  taxRateBasisPoints: z.coerce.number().int().min(0).max(10_000),
});

const draftSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  issueDate: z.coerce.date(),
  serviceDateFrom: z.coerce.date(),
  serviceDateTo: z.coerce.date().optional().nullable(),
  dueDate: z.coerce.date(),
  buyerReference: nullableText(100),
  purchaseOrderReference: nullableText(100),
  introText: nullableText(5000),
  closingText: nullableText(5000),
  notes: nullableText(10_000),
  lines: z.array(lineSchema).min(1).max(500),
}).refine(value => !value.serviceDateTo || value.serviceDateTo >= value.serviceDateFrom, { path: ['serviceDateTo'], message: 'Das Enddatum liegt vor dem Startdatum.' });

async function requireBillingTenant(writable = true) {
  const session = writable ? await getWritableSession() : await getSession();
  if (!session) redirect('/admin/login');
  const [addon] = await getDb().select({ active: tenantAddons.active }).from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, BILLING_ADDON_KEY))).limit(1);
  if (!addon?.active) redirect('/admin/functions');
  if (writable && session.role === 'demo') throw new Error('Im Demo-Modus sind Änderungen deaktiviert.');
  return session.tenantId;
}

async function ensureBillingSettings(tenantId: string) {
  const db = getDb();
  const [tenant] = await db.select({ name: tenants.name }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  await db.insert(billingSettings).values({ tenantId, companyName: tenant?.name || null }).onConflictDoNothing({ target: billingSettings.tenantId });
  const [settings] = await db.select().from(billingSettings).where(eq(billingSettings.tenantId, tenantId)).limit(1);
  if (!settings) throw new Error('Rechnungseinstellungen konnten nicht angelegt werden.');
  return settings;
}

export async function getBillingWorkspaceData() {
  const tenantId = await requireBillingTenant(false);
  const db = getDb();
  const settings = await ensureBillingSettings(tenantId);
  const [customerRows, fieldRows, serviceRows, documentRows] = await Promise.all([
    db.select().from(customers).where(and(eq(customers.tenantId, tenantId), isNull(customers.archivedAt))).orderBy(asc(customers.name)),
    db.select().from(customerCustomFieldDefinitions).where(and(eq(customerCustomFieldDefinitions.tenantId, tenantId), eq(customerCustomFieldDefinitions.active, true))).orderBy(asc(customerCustomFieldDefinitions.sortOrder)),
    db.select().from(billingServices).where(and(eq(billingServices.tenantId, tenantId), eq(billingServices.active, true))).orderBy(asc(billingServices.name)),
    db.select({
      id: billingDocuments.id, customerId: billingDocuments.customerId, originalDocumentId: billingDocuments.originalDocumentId,
      documentNumber: billingDocuments.documentNumber, documentType: billingDocuments.documentType, status: billingDocuments.status,
      issueDate: billingDocuments.issueDate, dueDate: billingDocuments.dueDate, subtotalNetCents: billingDocuments.subtotalNetCents,
      taxCents: billingDocuments.taxCents, totalGrossCents: billingDocuments.totalGrossCents, finalizedAt: billingDocuments.finalizedAt,
      sentAt: billingDocuments.sentAt, paidAt: billingDocuments.paidAt, cancelledAt: billingDocuments.cancelledAt, createdAt: billingDocuments.createdAt,
    }).from(billingDocuments).where(eq(billingDocuments.tenantId, tenantId)).orderBy(desc(billingDocuments.createdAt)).limit(500),
  ]);
  return { settings, customers: customerRows, customFields: fieldRows, services: serviceRows, documents: documentRows };
}

export async function getBillingDocumentAction(documentId: string) {
  const tenantId = await requireBillingTenant(false);
  const db = getDb();
  const [document] = await db.select().from(billingDocuments).where(and(eq(billingDocuments.id, documentId), eq(billingDocuments.tenantId, tenantId))).limit(1);
  if (!document) throw new Error('Dokument nicht gefunden.');
  const items = await db.select().from(billingDocumentItems).where(and(eq(billingDocumentItems.documentId, documentId), eq(billingDocumentItems.tenantId, tenantId))).orderBy(asc(billingDocumentItems.position));
  return { document: { ...document, pdfBase64: undefined, xmlContent: undefined }, items };
}

export async function saveBillingSettingsAction(input: unknown) {
  const tenantId = await requireBillingTenant();
  const value = settingsSchema.parse(input);
  const db = getDb();
  const [current] = await db.select({ nextInvoiceNumber: billingSettings.nextInvoiceNumber, nextCancellationNumber: billingSettings.nextCancellationNumber })
    .from(billingSettings).where(eq(billingSettings.tenantId, tenantId)).limit(1);
  if (!current) throw new Error('Rechnungseinstellungen wurden nicht gefunden.');
  const [issued] = await db.select({ id: billingDocuments.id }).from(billingDocuments)
    .where(and(eq(billingDocuments.tenantId, tenantId), ne(billingDocuments.status, 'draft'))).limit(1);
  if (issued && (value.nextInvoiceNumber < current.nextInvoiceNumber || value.nextCancellationNumber < current.nextCancellationNumber)) {
    throw new Error('Nach der ersten festgeschriebenen Rechnung dürfen laufende Nummern nur erhöht, nicht zurückgesetzt werden.');
  }
  await db.update(billingSettings).set({ ...value, updatedAt: new Date() }).where(eq(billingSettings.tenantId, tenantId));
  revalidatePath('/admin/billing');
  return { success: true as const };
}

function fieldKey(label: string) {
  const normalized = label.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 64);
  return normalized || `feld_${randomUUID().slice(0, 8)}`;
}

export async function saveCustomerCustomFieldAction(input: unknown) {
  const tenantId = await requireBillingTenant();
  const value = customFieldSchema.parse(input);
  const db = getDb();
  if (value.id) {
    await db.update(customerCustomFieldDefinitions).set({ label: value.label, fieldType: value.fieldType, options: value.options, required: value.required, updatedAt: new Date() })
      .where(and(eq(customerCustomFieldDefinitions.id, value.id), eq(customerCustomFieldDefinitions.tenantId, tenantId)));
  } else {
    const [last] = await db.select({ sortOrder: customerCustomFieldDefinitions.sortOrder }).from(customerCustomFieldDefinitions)
      .where(eq(customerCustomFieldDefinitions.tenantId, tenantId)).orderBy(desc(customerCustomFieldDefinitions.sortOrder)).limit(1);
    let key = fieldKey(value.label);
    const [duplicate] = await db.select({ id: customerCustomFieldDefinitions.id }).from(customerCustomFieldDefinitions)
      .where(and(eq(customerCustomFieldDefinitions.tenantId, tenantId), eq(customerCustomFieldDefinitions.fieldKey, key))).limit(1);
    if (duplicate) key = `${key}_${randomUUID().slice(0, 5)}`;
    await db.insert(customerCustomFieldDefinitions).values({ tenantId, fieldKey: key, label: value.label, fieldType: value.fieldType, options: value.options, required: value.required, sortOrder: (last?.sortOrder || 0) + 10 });
  }
  revalidatePath('/admin/billing');
  return { success: true as const };
}

export async function deleteCustomerCustomFieldAction(id: string) {
  const tenantId = await requireBillingTenant();
  await getDb().update(customerCustomFieldDefinitions).set({ active: false, updatedAt: new Date() })
    .where(and(eq(customerCustomFieldDefinitions.id, z.string().uuid().parse(id)), eq(customerCustomFieldDefinitions.tenantId, tenantId)));
  revalidatePath('/admin/billing');
  return { success: true as const };
}

async function allocateCustomerNumber(tenantId: string) {
  const result = await getDb().execute(sql`
    UPDATE billing_settings
    SET next_customer_number = next_customer_number + 1, updated_at = now()
    WHERE tenant_id = ${tenantId}::uuid
    RETURNING customer_prefix || '-' || lpad((next_customer_number - 1)::text, 5, '0') AS customer_number
  `);
  const value = result.rows?.[0] as { customer_number?: string } | undefined;
  if (!value?.customer_number) throw new Error('Kundennummer konnte nicht vergeben werden.');
  return value.customer_number;
}

export async function saveBillingCustomerAction(input: unknown) {
  const tenantId = await requireBillingTenant();
  const value = customerSchema.parse(input);
  const db = getDb();
  const definitions = await db.select().from(customerCustomFieldDefinitions)
    .where(and(eq(customerCustomFieldDefinitions.tenantId, tenantId), eq(customerCustomFieldDefinitions.active, true)));
  for (const definition of definitions) {
    const customValue = value.customFields[definition.fieldKey];
    if (definition.required && (customValue === undefined || customValue === null || customValue === '')) {
      throw new Error(`Das eigene Kundenfeld „${definition.label}“ ist erforderlich.`);
    }
    if (definition.fieldType === 'select' && customValue && !(definition.options as string[]).includes(String(customValue))) {
      throw new Error(`Ungültiger Wert für „${definition.label}“.`);
    }
  }
  const billingAddress = { street: value.billingAddress.street, addressLine2: value.billingAddress.addressLine2 || undefined, zip: value.billingAddress.postalCode, city: value.billingAddress.city, country: value.billingAddress.countryCode, company: value.companyName || undefined };
  const shippingAddress = value.shippingAddress ? { street: value.shippingAddress.street, addressLine2: value.shippingAddress.addressLine2 || undefined, zip: value.shippingAddress.postalCode, city: value.shippingAddress.city, country: value.shippingAddress.countryCode, company: value.companyName || undefined } : billingAddress;
  const update = {
    customerType: value.customerType, companyName: value.companyName, salutation: value.salutation, firstName: value.firstName, lastName: value.lastName,
    name: value.name, email: value.email, phone: value.phone, mobile: value.mobile, website: value.website, taxNumber: value.taxNumber,
    vatId: value.vatId, eInvoiceRoutingId: value.eInvoiceRoutingId, buyerReference: value.buyerReference, language: value.language,
    paymentTermDays: value.paymentTermDays, notes: value.notes, customFields: value.customFields,
    defaultBillingAddress: billingAddress, defaultShippingAddress: shippingAddress, updatedAt: new Date(),
  };
  if (value.id) {
    const [saved] = await db.update(customers).set(update).where(and(eq(customers.id, value.id), eq(customers.tenantId, tenantId))).returning({ id: customers.id });
    if (!saved) throw new Error('Kunde nicht gefunden.');
    revalidatePath('/admin/billing');
    return { success: true as const, id: saved.id };
  }
  const customerNumber = await allocateCustomerNumber(tenantId);
  const [saved] = await db.insert(customers).values({ tenantId, customerNumber, ...update }).returning({ id: customers.id });
  revalidatePath('/admin/billing');
  return { success: true as const, id: saved.id };
}

export async function archiveBillingCustomerAction(id: string) {
  const tenantId = await requireBillingTenant();
  await getDb().update(customers).set({ archivedAt: new Date(), updatedAt: new Date() }).where(and(eq(customers.id, z.string().uuid().parse(id)), eq(customers.tenantId, tenantId)));
  revalidatePath('/admin/billing');
  return { success: true as const };
}

export async function saveBillingServiceAction(input: unknown) {
  const tenantId = await requireBillingTenant();
  const value = serviceSchema.parse(input);
  const db = getDb();
  const update = { serviceCode: value.serviceCode, name: value.name, description: value.description, unitCode: value.unitCode, unitLabel: value.unitLabel, unitPriceNetCents: value.unitPriceNetCents, taxRateBasisPoints: value.taxRateBasisPoints, updatedAt: new Date() };
  if (value.id) {
    const [saved] = await db.update(billingServices).set(update).where(and(eq(billingServices.id, value.id), eq(billingServices.tenantId, tenantId))).returning({ id: billingServices.id });
    if (!saved) throw new Error('Leistung nicht gefunden.');
    revalidatePath('/admin/billing');
    return { success: true as const, id: saved.id };
  }
  const [saved] = await db.insert(billingServices).values({ tenantId, ...update }).returning({ id: billingServices.id });
  revalidatePath('/admin/billing');
  return { success: true as const, id: saved.id };
}

export async function archiveBillingServiceAction(id: string) {
  const tenantId = await requireBillingTenant();
  await getDb().update(billingServices).set({ active: false, updatedAt: new Date() }).where(and(eq(billingServices.id, z.string().uuid().parse(id)), eq(billingServices.tenantId, tenantId)));
  revalidatePath('/admin/billing');
  return { success: true as const };
}

export async function createBillingDraftAction(customerId?: string) {
  const tenantId = await requireBillingTenant();
  const settings = await ensureBillingSettings(tenantId);
  const now = new Date();
  const dueDate = new Date(now.getTime() + settings.defaultPaymentTermDays * 86_400_000);
  const [document] = await getDb().insert(billingDocuments).values({
    tenantId, customerId: customerId ? z.string().uuid().parse(customerId) : null, issueDate: now, serviceDateFrom: now,
    dueDate, currency: 'EUR', introText: settings.defaultIntroText, closingText: settings.defaultClosingText,
  }).returning({ id: billingDocuments.id });
  revalidatePath('/admin/billing');
  return { success: true as const, id: document.id };
}

export async function saveBillingDraftAction(input: unknown) {
  const tenantId = await requireBillingTenant();
  const value = draftSchema.parse(input);
  const totals = calculateBillingTotals(value.lines as BillingLine[]);
  const db = getDb();
  const [saved] = await db.update(billingDocuments).set({
    customerId: value.customerId, issueDate: value.issueDate, serviceDateFrom: value.serviceDateFrom, serviceDateTo: value.serviceDateTo,
    dueDate: value.dueDate, buyerReference: value.buyerReference, purchaseOrderReference: value.purchaseOrderReference,
    introText: value.introText, closingText: value.closingText, notes: value.notes,
    subtotalNetCents: totals.subtotalNetCents, taxCents: totals.taxCents, totalGrossCents: totals.totalGrossCents,
    taxBreakdown: totals.taxBreakdown, updatedAt: new Date(),
  }).where(and(eq(billingDocuments.id, value.id), eq(billingDocuments.tenantId, tenantId), eq(billingDocuments.status, 'draft'))).returning({ id: billingDocuments.id });
  if (!saved) throw new Error('Nur Entwürfe können bearbeitet werden.');
  await db.delete(billingDocumentItems).where(and(eq(billingDocumentItems.documentId, value.id), eq(billingDocumentItems.tenantId, tenantId)));
  await db.insert(billingDocumentItems).values(totals.normalizedLines.map((line, index) => ({
    tenantId, documentId: value.id, serviceId: value.lines[index]?.serviceId || null, position: line.position,
    name: line.name, description: line.description || null, quantity: String(line.quantity), unitCode: line.unitCode, unitLabel: line.unitLabel,
    unitPriceNetCents: line.unitPriceNetCents, discountBasisPoints: line.discountBasisPoints, taxRateBasisPoints: line.taxRateBasisPoints, lineNetCents: line.lineNetCents,
  })));
  revalidatePath('/admin/billing');
  return { success: true as const };
}

export async function deleteBillingDraftAction(id: string) {
  const tenantId = await requireBillingTenant();
  await getDb().delete(billingDocuments).where(and(eq(billingDocuments.id, z.string().uuid().parse(id)), eq(billingDocuments.tenantId, tenantId), eq(billingDocuments.status, 'draft')));
  revalidatePath('/admin/billing');
  return { success: true as const };
}

function customerSnapshot(customer: typeof customers.$inferSelect): BillingCustomerSnapshot {
  const address = (customer.defaultBillingAddress || {}) as { street?: string; addressLine2?: string; zip?: string; city?: string; country?: string };
  return {
    customerNumber: customer.customerNumber || undefined, customerType: customer.customerType as 'company' | 'person', displayName: customer.name,
    companyName: customer.companyName || undefined, firstName: customer.firstName || undefined, lastName: customer.lastName || undefined,
    email: customer.email, phone: customer.phone || undefined, vatId: customer.vatId || undefined,
    eInvoiceRoutingId: customer.eInvoiceRoutingId || undefined, buyerReference: customer.buyerReference || undefined,
    street: address.street || '', addressLine2: address.addressLine2, postalCode: address.zip || '', city: address.city || '', countryCode: address.country || 'DE',
  };
}

function sellerSnapshot(settings: typeof billingSettings.$inferSelect): BillingSellerSnapshot {
  return {
    companyName: settings.companyName || '', legalForm: settings.legalForm || undefined, street: settings.street || '', postalCode: settings.postalCode || '',
    city: settings.city || '', countryCode: settings.countryCode, email: settings.email || '', phone: settings.phone || undefined, website: settings.website || undefined,
    taxNumber: settings.taxNumber || undefined, vatId: settings.vatId || undefined, registerCourt: settings.registerCourt || undefined,
    registerNumber: settings.registerNumber || undefined, managingDirector: settings.managingDirector || undefined, logoUrl: settings.logoUrl || undefined,
    bankName: settings.bankName || undefined, accountHolder: settings.accountHolder || undefined, iban: settings.iban || undefined, bic: settings.bic || undefined,
    footer: settings.defaultFooter || undefined, smallBusiness: settings.smallBusiness, smallBusinessNotice: settings.smallBusinessNotice,
  };
}

async function allocateDocumentNumber(tenantId: string, documentId: string, settings: typeof billingSettings.$inferSelect, date: Date, type: 'invoice' | 'cancellation') {
  const period = sequencePeriod(date, settings.sequenceReset as 'never' | 'year' | 'month');
  const format = type === 'invoice' ? settings.invoiceNumberFormat : settings.cancellationNumberFormat;
  const prefix = type === 'invoice' ? settings.invoicePrefix : settings.cancellationPrefix;
  const result = await getDb().execute(sql`
    WITH locked_document AS MATERIALIZED (
      SELECT id, document_number, document_type FROM billing_documents
      WHERE id = ${documentId}::uuid AND tenant_id = ${tenantId}::uuid AND status = 'draft'
      FOR UPDATE
    ),
    allocated AS MATERIALIZED (
      SELECT CASE
        WHEN settings.sequence_period IS NULL AND ${type} = 'invoice' THEN settings.next_invoice_number
        WHEN settings.sequence_period IS NULL THEN settings.next_cancellation_number
        WHEN settings.sequence_period IS DISTINCT FROM ${period} THEN 1
        WHEN ${type} = 'invoice' THEN settings.next_invoice_number
        ELSE settings.next_cancellation_number
      END AS value
      FROM billing_settings settings, locked_document document
      WHERE settings.tenant_id = ${tenantId}::uuid AND document.document_number IS NULL
      FOR UPDATE OF settings
    ),
    advanced AS (
      UPDATE billing_settings settings SET
        sequence_period = ${period},
        next_invoice_number = CASE
          WHEN ${type} = 'invoice' THEN (SELECT value + 1 FROM allocated)
          WHEN settings.sequence_period IS NOT NULL AND settings.sequence_period IS DISTINCT FROM ${period} THEN 1
          ELSE settings.next_invoice_number
        END,
        next_cancellation_number = CASE
          WHEN ${type} = 'cancellation' THEN (SELECT value + 1 FROM allocated)
          WHEN settings.sequence_period IS NOT NULL AND settings.sequence_period IS DISTINCT FROM ${period} THEN 1
          ELSE settings.next_cancellation_number
        END,
        updated_at = now()
      WHERE settings.tenant_id = ${tenantId}::uuid AND EXISTS (SELECT 1 FROM allocated)
      RETURNING settings.tenant_id
    ),
    numbered AS (
      UPDATE billing_documents document SET document_number = (
        SELECT replace(replace(replace(replace(
          regexp_replace(${format}, '\\{N+\\}', lpad(allocated.value::text, length(substring(${format} from '\\{(N+)\\}')), '0')),
          '{PREFIX}', ${prefix}), '{YYYY}', ${String(date.getUTCFullYear())}), '{YY}', ${String(date.getUTCFullYear()).slice(-2)}), '{MM}', ${String(date.getUTCMonth() + 1).padStart(2, '0')})
        FROM allocated
      ), updated_at = now()
      WHERE document.id IN (SELECT id FROM locked_document) AND document.document_number IS NULL
      RETURNING document.document_number
    )
    SELECT document_number FROM numbered
    UNION ALL SELECT document_number FROM locked_document WHERE document_number IS NOT NULL
    LIMIT 1
  `);
  const number = (result.rows?.[0] as { document_number?: string } | undefined)?.document_number;
  if (!number) throw new Error('Rechnungsnummer konnte nicht sicher vergeben werden.');
  return number;
}

async function appendEvent(tenantId: string, documentId: string, eventType: string, payload: Record<string, unknown>) {
  const db = getDb();
  const [previous] = await db.select({ eventHash: billingDocumentEvents.eventHash }).from(billingDocumentEvents)
    .where(and(eq(billingDocumentEvents.tenantId, tenantId), eq(billingDocumentEvents.documentId, documentId))).orderBy(desc(billingDocumentEvents.createdAt)).limit(1);
  const eventHash = sha256(JSON.stringify({ previousHash: previous?.eventHash || null, tenantId, documentId, eventType, payload }));
  await db.insert(billingDocumentEvents).values({ tenantId, documentId, eventType, payload, previousHash: previous?.eventHash || null, eventHash });
  return eventHash;
}

export async function finalizeBillingDocumentAction(id: string) {
  const tenantId = await requireBillingTenant();
  const documentId = z.string().uuid().parse(id);
  const db = getDb();
  const [document, settings] = await Promise.all([
    db.select().from(billingDocuments).where(and(eq(billingDocuments.id, documentId), eq(billingDocuments.tenantId, tenantId))).limit(1).then(rows => rows[0]),
    ensureBillingSettings(tenantId),
  ]);
  if (!document) throw new Error('Dokument nicht gefunden.');
  if (document.status !== 'draft') return { success: true as const, documentNumber: document.documentNumber };
  if (!document.customerId || !document.issueDate || !document.serviceDateFrom || !document.dueDate) throw new Error('Kunde, Rechnungs-, Leistungs- und Fälligkeitsdatum sind erforderlich.');
  const [customer, storedItems] = await Promise.all([
    db.select().from(customers).where(and(eq(customers.id, document.customerId), eq(customers.tenantId, tenantId), isNull(customers.archivedAt))).limit(1).then(rows => rows[0]),
    db.select().from(billingDocumentItems).where(and(eq(billingDocumentItems.documentId, documentId), eq(billingDocumentItems.tenantId, tenantId))).orderBy(asc(billingDocumentItems.position)),
  ]);
  if (!customer) throw new Error('Der ausgewählte Kunde wurde nicht gefunden.');
  const seller = sellerSnapshot(settings);
  const buyer = customerSnapshot(customer);
  const lines: BillingLine[] = storedItems.map(item => ({ ...item, quantity: Number(item.quantity), description: item.description || undefined }));
  const missing = validateBillingReadiness(seller, buyer, lines);
  if (missing.length) throw new Error(`Noch nicht bereit: ${missing.join(', ')}.`);
  const totals = calculateBillingTotals(lines, seller.smallBusiness);
  const type = document.documentType as 'invoice' | 'cancellation';
  const documentNumber = await allocateDocumentNumber(tenantId, documentId, settings, document.issueDate, type);
  let originalDocumentNumber: string | undefined;
  if (document.originalDocumentId) {
    const [original] = await db.select({ documentNumber: billingDocuments.documentNumber }).from(billingDocuments)
      .where(and(eq(billingDocuments.id, document.originalDocumentId), eq(billingDocuments.tenantId, tenantId))).limit(1);
    originalDocumentNumber = original?.documentNumber || undefined;
  }
  const snapshot: BillingDocumentSnapshot = {
    documentNumber, documentType: type, issueDate: document.issueDate, serviceDateFrom: document.serviceDateFrom,
    serviceDateTo: document.serviceDateTo || undefined, dueDate: document.dueDate, currency: 'EUR', buyerReference: document.buyerReference || undefined,
    purchaseOrderReference: document.purchaseOrderReference || undefined, introText: document.introText || undefined,
    closingText: document.closingText || undefined, notes: document.notes || undefined, originalDocumentNumber,
  };
  const [pdf, xml] = await Promise.all([
    renderBillingPdf({ document: snapshot, seller, customer: buyer, lines, totals }),
    generateXRechnung({ document: snapshot, seller, customer: buyer, lines, totals }),
  ]);
  const pdfSha256 = sha256(pdf);
  const xmlSha256 = sha256(xml);
  const documentSha256 = sha256(JSON.stringify({ snapshot, seller, buyer, lines: totals.normalizedLines, totals, pdfSha256, xmlSha256 }));
  const retentionUntil = new Date(document.issueDate);
  retentionUntil.setUTCFullYear(retentionUntil.getUTCFullYear() + 8);
  const finalizedAt = new Date();
  const [finalized] = await db.update(billingDocuments).set({
    documentNumber, sellerSnapshot: seller, customerSnapshot: buyer, paymentSnapshot: { bankName: seller.bankName, accountHolder: seller.accountHolder, iban: seller.iban, bic: seller.bic },
    subtotalNetCents: totals.subtotalNetCents, taxCents: totals.taxCents, totalGrossCents: totals.totalGrossCents, taxBreakdown: totals.taxBreakdown,
    pdfBase64: Buffer.from(pdf).toString('base64'), xmlContent: xml, pdfSha256, xmlSha256, documentSha256,
    finalizedAt, retentionUntil, status: 'finalized', updatedAt: finalizedAt,
  }).where(and(eq(billingDocuments.id, documentId), eq(billingDocuments.tenantId, tenantId), eq(billingDocuments.status, 'draft'))).returning({ id: billingDocuments.id });
  if (finalized) await appendEvent(tenantId, documentId, 'finalized', { documentNumber, documentSha256, pdfSha256, xmlSha256, retentionUntil: retentionUntil.toISOString() });
  revalidatePath('/admin/billing');
  return { success: true as const, documentNumber };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] || character);
}

export async function sendBillingDocumentAction(id: string, recipientInput: string, idempotencyInput?: string) {
  const tenantId = await requireBillingTenant();
  const documentId = z.string().uuid().parse(id);
  const recipient = recipientInput.trim().toLowerCase();
  if (!isValidSmtpAddress(recipient)) throw new Error('Bitte eine gültige Empfängeradresse angeben.');
  const idempotencyKey = idempotencyInput ? z.string().uuid().parse(idempotencyInput) : randomUUID();
  const db = getDb();
  const [document] = await db.select().from(billingDocuments).where(and(eq(billingDocuments.id, documentId), eq(billingDocuments.tenantId, tenantId))).limit(1);
  if (!document?.documentNumber || !document.pdfBase64 || !document.xmlContent || !document.documentSha256 || document.status === 'draft') throw new Error('Die Rechnung muss zuerst festgeschrieben werden.');
  if (document.status === 'cancelled') throw new Error('Eine stornierte Rechnung kann nicht erneut versendet werden. Bitte die Stornorechnung senden.');
  const requestHash = sha256(JSON.stringify({ documentId, recipient, documentSha256: document.documentSha256 }));
  const [claimed] = await db.insert(billingDeliveryAttempts).values({ idempotencyKey, tenantId, documentId, recipient, requestHash }).onConflictDoNothing({ target: billingDeliveryAttempts.idempotencyKey }).returning({ idempotencyKey: billingDeliveryAttempts.idempotencyKey });
  if (!claimed) {
    const [existing] = await db.select().from(billingDeliveryAttempts).where(and(eq(billingDeliveryAttempts.idempotencyKey, idempotencyKey), eq(billingDeliveryAttempts.tenantId, tenantId))).limit(1);
    if (existing?.status === 'sent') return { success: true as const, alreadySent: true };
    if (!existing || existing.requestHash !== requestHash) throw new Error('Der Versandauftrag ist ungültig.');
    await db.update(billingDeliveryAttempts).set({ status: 'sending', attemptCount: sql`${billingDeliveryAttempts.attemptCount} + 1`, updatedAt: new Date(), lastErrorCode: null }).where(eq(billingDeliveryAttempts.idempotencyKey, idempotencyKey));
  }
  const smtp = await getEffectiveSmtp(tenantId);
  if (!smtp) {
    await db.update(billingDeliveryAttempts).set({ status: 'failed', lastErrorCode: 'smtp_unavailable', updatedAt: new Date() }).where(eq(billingDeliveryAttempts.idempotencyKey, idempotencyKey));
    throw new Error('Kein sicherer Mail-Server ist eingerichtet.');
  }
  const settings = await ensureBillingSettings(tenantId);
  const senderName = (settings.senderName || settings.companyName || '').replace(/[\r\n"<>]/g, '').trim().slice(0, 160);
  const from = senderName ? `"${senderName}" <${smtp.from}>` : smtp.from;
  const subject = `${document.documentType === 'cancellation' ? 'Stornorechnung' : 'Rechnung'} ${document.documentNumber}`;
  try {
    const info = await createHardenedRendererSmtpTransport(smtp).sendMail({
      from, to: recipient, subject,
      text: `Guten Tag,\n\nim Anhang erhalten Sie ${document.documentType === 'cancellation' ? 'die Stornorechnung' : 'die Rechnung'} ${document.documentNumber} als PDF und XRechnung.\n\nFreundliche Grüße`,
      html: `<p>Guten Tag,</p><p>im Anhang erhalten Sie ${document.documentType === 'cancellation' ? 'die Stornorechnung' : 'die Rechnung'} <strong>${escapeHtml(document.documentNumber)}</strong> als PDF und XRechnung.</p><p>Freundliche Grüße</p>`,
      attachments: [
        { filename: `${document.documentNumber}.pdf`, content: Buffer.from(document.pdfBase64, 'base64'), contentType: 'application/pdf' },
        { filename: `${document.documentNumber}-xrechnung.xml`, content: Buffer.from(document.xmlContent, 'utf8'), contentType: 'application/xml' },
      ],
      messageId: `<billing-${idempotencyKey}@flamingomedia.online>`,
    });
    const sentAt = new Date();
    await db.update(billingDeliveryAttempts).set({ status: 'sent', messageId: info.messageId, sentAt, updatedAt: sentAt }).where(eq(billingDeliveryAttempts.idempotencyKey, idempotencyKey));
    await db.update(billingDocuments).set({ sentAt, status: document.status === 'paid' ? 'paid' : 'sent', updatedAt: sentAt }).where(and(eq(billingDocuments.id, documentId), eq(billingDocuments.tenantId, tenantId)));
    await appendEvent(tenantId, documentId, 'sent', { recipient, messageId: info.messageId, idempotencyKey });
    revalidatePath('/admin/billing');
    return { success: true as const };
  } catch (error) {
    const code = error instanceof Error ? error.name || 'smtp_error' : 'smtp_error';
    const uncertain = /timeout|socket|connection|ECONNRESET/i.test(error instanceof Error ? `${error.name} ${error.message}` : String(error));
    await db.update(billingDeliveryAttempts).set({ status: uncertain ? 'uncertain' : 'failed', lastErrorCode: code.slice(0, 100), updatedAt: new Date() }).where(eq(billingDeliveryAttempts.idempotencyKey, idempotencyKey));
    throw new Error(uncertain ? 'Der Mail-Server hat den Versand nicht eindeutig bestätigt. Bitte vor erneutem Senden im Postausgang prüfen.' : 'Die Rechnung konnte nicht versendet werden.');
  }
}

export async function markBillingDocumentPaidAction(id: string) {
  const tenantId = await requireBillingTenant();
  const documentId = z.string().uuid().parse(id);
  const paidAt = new Date();
  const [updated] = await getDb().update(billingDocuments).set({ status: 'paid', paidAt, updatedAt: paidAt })
    .where(and(eq(billingDocuments.id, documentId), eq(billingDocuments.tenantId, tenantId), eq(billingDocuments.documentType, 'invoice'), inArray(billingDocuments.status, ['finalized', 'sent']))).returning({ id: billingDocuments.id });
  if (!updated) throw new Error('Nur festgeschriebene Rechnungen können als bezahlt markiert werden.');
  await appendEvent(tenantId, documentId, 'paid', { paidAt: paidAt.toISOString() });
  revalidatePath('/admin/billing');
  return { success: true as const };
}

export async function cancelBillingDocumentAction(id: string, reasonInput: string) {
  const tenantId = await requireBillingTenant();
  const originalId = z.string().uuid().parse(id);
  const reason = z.string().trim().min(3).max(2000).parse(reasonInput);
  const db = getDb();
  const [original] = await db.select().from(billingDocuments).where(and(eq(billingDocuments.id, originalId), eq(billingDocuments.tenantId, tenantId), eq(billingDocuments.documentType, 'invoice'), ne(billingDocuments.status, 'draft'))).limit(1);
  if (!original || original.status === 'cancelled') throw new Error('Diese Rechnung kann nicht storniert werden.');
  const [existing] = await db.select({ id: billingDocuments.id }).from(billingDocuments).where(and(eq(billingDocuments.tenantId, tenantId), eq(billingDocuments.originalDocumentId, originalId), eq(billingDocuments.documentType, 'cancellation'))).limit(1);
  if (existing) {
    const result = await finalizeBillingDocumentAction(existing.id);
    const cancelledAt = new Date();
    const [updated] = await db.update(billingDocuments).set({ status: 'cancelled', cancelledAt, updatedAt: cancelledAt })
      .where(and(eq(billingDocuments.id, originalId), eq(billingDocuments.tenantId, tenantId), ne(billingDocuments.status, 'cancelled'))).returning({ id: billingDocuments.id });
    if (updated) await appendEvent(tenantId, originalId, 'cancelled', { cancellationDocumentId: existing.id, reason });
    revalidatePath('/admin/billing');
    return { ...result, cancellationId: existing.id };
  }
  const now = new Date();
  const [cancellation] = await db.insert(billingDocuments).values({
    tenantId, customerId: original.customerId, originalDocumentId: originalId, documentType: 'cancellation', issueDate: now,
    serviceDateFrom: original.serviceDateFrom || now, serviceDateTo: original.serviceDateTo, dueDate: now,
    buyerReference: original.buyerReference, purchaseOrderReference: original.purchaseOrderReference,
    introText: `Storno zu Rechnung ${original.documentNumber}.`, closingText: original.closingText, notes: reason,
  }).returning({ id: billingDocuments.id });
  const items = await db.select().from(billingDocumentItems).where(and(eq(billingDocumentItems.documentId, originalId), eq(billingDocumentItems.tenantId, tenantId))).orderBy(asc(billingDocumentItems.position));
  if (items.length) await db.insert(billingDocumentItems).values(items.map(item => ({ ...item, id: randomUUID(), documentId: cancellation.id, createdAt: now, updatedAt: now })));
  await appendEvent(tenantId, cancellation.id, 'cancellation_created', { originalDocumentId: originalId, reason });
  const result = await finalizeBillingDocumentAction(cancellation.id);
  const cancelledAt = new Date();
  await db.update(billingDocuments).set({ status: 'cancelled', cancelledAt, updatedAt: cancelledAt }).where(and(eq(billingDocuments.id, originalId), eq(billingDocuments.tenantId, tenantId)));
  await appendEvent(tenantId, originalId, 'cancelled', { cancellationDocumentId: cancellation.id, reason });
  revalidatePath('/admin/billing');
  return { ...result, cancellationId: cancellation.id };
}
