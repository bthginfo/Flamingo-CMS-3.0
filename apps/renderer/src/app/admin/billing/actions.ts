'use server';

import { randomBytes, randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { and, asc, desc, eq, inArray, isNull, lte, ne, sql } from 'drizzle-orm';
import { z } from 'zod';
import {
  billingDeliveryAttempts,
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
  generateEInvoice,
  renderBillingPdf,
  sequencePeriod,
  sha256,
  validateBillingReadiness,
  validateNumberFormat,
  type BillingCustomerSnapshot,
  type BillingDocumentSnapshot,
  type BillingLine,
  type BillingSellerSnapshot,
  type BillingTaxMode,
} from '@/lib/billing-core';
import { getBillingJurisdiction, normalizeBillingCountryCode } from '@/lib/billing-jurisdictions';

const nullableText = (max: number) => z.string().trim().max(max).optional().nullable().transform(value => value || null);
const nullableUrl = (max: number) => z.string().trim().max(max).optional().nullable().transform(value => {
  if (!value) return null;
  const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(normalized);
    return url.toString();
  } catch {
    return value.trim() || null;
  }
});
const addressSchema = z.object({
  street: z.string().trim().min(1).max(255),
  addressLine2: nullableText(255),
  postalCode: z.string().trim().min(1).max(30),
  city: z.string().trim().min(1).max(120),
  countryCode: z.enum(['DE', 'AT']),
});

const settingsSchema = z.object({
  companyName: z.string().trim().min(1).max(255),
  legalForm: nullableText(120),
  street: z.string().trim().min(1).max(255),
  postalCode: z.string().trim().min(1).max(30),
  city: z.string().trim().min(1).max(120),
  countryCode: z.enum(['DE', 'AT']),
  email: z.string().trim().email().max(255),
  phone: nullableText(80),
  website: nullableUrl(500),
  taxNumber: nullableText(100),
  vatId: nullableText(100),
  registerCourt: nullableText(160),
  registerNumber: nullableText(100),
  managingDirector: nullableText(255),
  logoUrl: z.union([z.literal(''), z.string().trim().url().max(1000)]).optional().transform(value => value || null),
  logoDisplay: z.enum(['logo_and_name', 'logo_only', 'name_only']).default('logo_and_name'),
  bankName: nullableText(160),
  accountHolder: nullableText(255),
  iban: nullableText(50),
  bic: nullableText(30),
  invoicePrefix: z.string().trim().min(1).max(20),
  cancellationPrefix: z.string().trim().min(1).max(20),
  quotePrefix: z.string().trim().min(1).max(20),
  creditPrefix: z.string().trim().min(1).max(20),
  invoiceNumberFormat: z.string().trim().min(3).max(120),
  cancellationNumberFormat: z.string().trim().min(3).max(120),
  quoteNumberFormat: z.string().trim().min(3).max(120),
  creditNumberFormat: z.string().trim().min(3).max(120),
  sequenceReset: z.enum(['never', 'year', 'month']),
  nextInvoiceNumber: z.coerce.number().int().min(1).max(999_999_999),
  nextCancellationNumber: z.coerce.number().int().min(1).max(999_999_999),
  nextQuoteNumber: z.coerce.number().int().min(1).max(999_999_999),
  nextCreditNumber: z.coerce.number().int().min(1).max(999_999_999),
  currency: z.literal('EUR').default('EUR'),
  defaultPaymentTermDays: z.coerce.number().int().min(0).max(365),
  defaultCashDiscountBasisPoints: z.coerce.number().int().min(0).max(10_000),
  defaultCashDiscountDays: z.coerce.number().int().min(0).max(365),
  defaultReminderDays: z.coerce.number().int().min(1).max(365),
  defaultReminderFeeCents: z.coerce.number().int().min(0).max(10_000_000),
  paymentLinkBaseUrl: nullableUrl(1000),
  defaultIntroText: nullableText(5000),
  defaultClosingText: nullableText(5000),
  defaultFooter: nullableText(2000),
  smallBusiness: z.boolean(),
  smallBusinessNotice: z.string().trim().min(3).max(1000),
  senderName: nullableText(255),
}).superRefine((value, context) => {
  for (const [path, format] of [
    ['invoiceNumberFormat', value.invoiceNumberFormat],
    ['cancellationNumberFormat', value.cancellationNumberFormat],
    ['quoteNumberFormat', value.quoteNumberFormat],
    ['creditNumberFormat', value.creditNumberFormat],
  ] as const) {
    const formatError = validateNumberFormat(format);
    if (formatError) context.addIssue({ code: 'custom', path: [path], message: formatError });
    if (value.sequenceReset === 'year' && !/\{YYYY\}|\{YY\}/.test(format)) {
      context.addIssue({ code: 'custom', path: [path], message: 'Bei jährlichem Neustart muss das Jahr im Format stehen.' });
    }
    if (value.sequenceReset === 'month' && (!/\{YYYY\}|\{YY\}/.test(format) || !format.includes('{MM}'))) {
      context.addIssue({ code: 'custom', path: [path], message: 'Bei monatlichem Neustart müssen Jahr und Monat im Format stehen.' });
    }
  }
  if (!value.taxNumber && !value.vatId) context.addIssue({ code: 'custom', path: ['taxNumber'], message: 'Steuernummer oder USt-IdNr. angeben.' });
});

const logoSettingsSchema = z.object({
  logoUrl: z.union([z.literal(''), z.string().trim().url().max(1000)]).optional().transform(value => value || null),
  logoDisplay: z.enum(['logo_and_name', 'logo_only', 'name_only']).default('logo_and_name'),
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
  website: nullableUrl(500),
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
  discountType: z.enum(['percent', 'fixed']).default('percent'),
  discountValue: z.coerce.number().int().min(0).max(1_000_000_000).default(0),
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
  taxMode: z.enum(['standard', 'small_business', 'reverse_charge', 'intra_eu', 'exempt']).default('standard'),
  taxExemptionReason: nullableText(2000),
  discountType: z.enum(['percent', 'fixed']).default('percent'),
  discountValue: z.coerce.number().int().min(0).max(1_000_000_000).default(0),
  cashDiscountBasisPoints: z.coerce.number().int().min(0).max(10_000).default(0),
  cashDiscountDays: z.coerce.number().int().min(0).max(365).default(0),
  paymentLinkUrl: z.union([z.literal(''), z.string().trim().url().max(1000)]).optional().nullable().transform(value => value || null),
  quoteValidUntil: z.coerce.date().optional().nullable(),
  lines: z.array(lineSchema).min(1).max(500),
}).superRefine((value, context) => {
  if (value.serviceDateTo && value.serviceDateTo < value.serviceDateFrom) context.addIssue({ code: 'custom', path: ['serviceDateTo'], message: 'Das Enddatum liegt vor dem Startdatum.' });
  if (value.taxMode !== 'standard' && value.taxMode !== 'small_business' && !value.taxExemptionReason) context.addIssue({ code: 'custom', path: ['taxExemptionReason'], message: 'Für diesen Steuerfall ist ein Hinweis erforderlich.' });
  if (value.cashDiscountBasisPoints > 0 && value.cashDiscountDays < 1) context.addIssue({ code: 'custom', path: ['cashDiscountDays'], message: 'Für Skonto ist eine Frist erforderlich.' });
});

const paymentSchema = z.object({
  documentId: z.string().uuid(),
  amountCents: z.coerce.number().int().positive().max(1_000_000_000),
  paidAt: z.coerce.date(),
  method: z.enum(['bank_transfer', 'cash', 'card', 'paypal', 'stripe', 'other']).default('bank_transfer'),
  reference: nullableText(255),
  notes: nullableText(2000),
});

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
  let [settings] = await db.select().from(billingSettings).where(eq(billingSettings.tenantId, tenantId)).limit(1).catch(async (error: unknown) => {
    if (!isMissingBillingLogoDisplayColumn(error)) throw error;
    const fallback = await selectBillingSettingsWithoutLogoDisplay(tenantId);
    return fallback ? [fallback] : [];
  });
  if (!settings) throw new Error('Rechnungseinstellungen konnten nicht angelegt werden.');
  return settings;
}

function isMissingBillingLogoDisplayColumn(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /logo_display|column .* does not exist/i.test(message);
}

async function selectBillingSettingsWithoutLogoDisplay(tenantId: string) {
  const [settings] = await getDb().select({
    id: billingSettings.id, tenantId: billingSettings.tenantId, companyName: billingSettings.companyName, legalForm: billingSettings.legalForm,
    street: billingSettings.street, postalCode: billingSettings.postalCode, city: billingSettings.city, countryCode: billingSettings.countryCode,
    email: billingSettings.email, phone: billingSettings.phone, website: billingSettings.website, taxNumber: billingSettings.taxNumber, vatId: billingSettings.vatId,
    registerCourt: billingSettings.registerCourt, registerNumber: billingSettings.registerNumber, managingDirector: billingSettings.managingDirector,
    logoUrl: billingSettings.logoUrl, bankName: billingSettings.bankName, accountHolder: billingSettings.accountHolder, iban: billingSettings.iban, bic: billingSettings.bic,
    invoicePrefix: billingSettings.invoicePrefix, cancellationPrefix: billingSettings.cancellationPrefix, quotePrefix: billingSettings.quotePrefix, creditPrefix: billingSettings.creditPrefix,
    invoiceNumberFormat: billingSettings.invoiceNumberFormat, cancellationNumberFormat: billingSettings.cancellationNumberFormat,
    quoteNumberFormat: billingSettings.quoteNumberFormat, creditNumberFormat: billingSettings.creditNumberFormat, sequenceReset: billingSettings.sequenceReset,
    sequencePeriod: billingSettings.sequencePeriod, nextInvoiceNumber: billingSettings.nextInvoiceNumber, nextCancellationNumber: billingSettings.nextCancellationNumber,
    nextQuoteNumber: billingSettings.nextQuoteNumber, nextCreditNumber: billingSettings.nextCreditNumber, customerPrefix: billingSettings.customerPrefix,
    nextCustomerNumber: billingSettings.nextCustomerNumber, currency: billingSettings.currency, defaultPaymentTermDays: billingSettings.defaultPaymentTermDays,
    defaultCashDiscountBasisPoints: billingSettings.defaultCashDiscountBasisPoints, defaultCashDiscountDays: billingSettings.defaultCashDiscountDays,
    defaultReminderDays: billingSettings.defaultReminderDays, defaultReminderFeeCents: billingSettings.defaultReminderFeeCents,
    paymentLinkBaseUrl: billingSettings.paymentLinkBaseUrl, defaultIntroText: billingSettings.defaultIntroText, defaultClosingText: billingSettings.defaultClosingText,
    defaultFooter: billingSettings.defaultFooter, smallBusiness: billingSettings.smallBusiness, smallBusinessNotice: billingSettings.smallBusinessNotice,
    senderName: billingSettings.senderName, createdAt: billingSettings.createdAt, updatedAt: billingSettings.updatedAt,
  }).from(billingSettings).where(eq(billingSettings.tenantId, tenantId)).limit(1);
  return settings ? { ...settings, logoDisplay: 'logo_and_name' } as typeof billingSettings.$inferSelect : undefined;
}

export async function getBillingWorkspaceData() {
  const tenantId = await requireBillingTenant(false);
  const db = getDb();
  const settings = await ensureBillingSettings(tenantId);
  const [customerRows, fieldRows, serviceRows, documentRows, recurringRows] = await Promise.all([
    db.select().from(customers).where(and(eq(customers.tenantId, tenantId), isNull(customers.archivedAt))).orderBy(asc(customers.name)),
    db.select().from(customerCustomFieldDefinitions).where(and(eq(customerCustomFieldDefinitions.tenantId, tenantId), eq(customerCustomFieldDefinitions.active, true))).orderBy(asc(customerCustomFieldDefinitions.sortOrder)),
    db.select().from(billingServices).where(and(eq(billingServices.tenantId, tenantId), eq(billingServices.active, true))).orderBy(asc(billingServices.name)),
    db.select({
      id: billingDocuments.id, customerId: billingDocuments.customerId, originalDocumentId: billingDocuments.originalDocumentId,
      documentNumber: billingDocuments.documentNumber, documentType: billingDocuments.documentType, status: billingDocuments.status,
      issueDate: billingDocuments.issueDate, dueDate: billingDocuments.dueDate, subtotalNetCents: billingDocuments.subtotalNetCents,
      taxCents: billingDocuments.taxCents, totalGrossCents: billingDocuments.totalGrossCents, finalizedAt: billingDocuments.finalizedAt,
      amountPaidCents: billingDocuments.amountPaidCents, reminderLevel: billingDocuments.reminderLevel,
      sentAt: billingDocuments.sentAt, paidAt: billingDocuments.paidAt, cancelledAt: billingDocuments.cancelledAt,
      acceptedAt: billingDocuments.acceptedAt, rejectedAt: billingDocuments.rejectedAt, convertedAt: billingDocuments.convertedAt,
      quoteValidUntil: billingDocuments.quoteValidUntil, recurringScheduleId: billingDocuments.recurringScheduleId, createdAt: billingDocuments.createdAt,
    }).from(billingDocuments).where(eq(billingDocuments.tenantId, tenantId)).orderBy(desc(billingDocuments.createdAt)).limit(500),
    db.select().from(billingRecurringSchedules).where(eq(billingRecurringSchedules.tenantId, tenantId)).orderBy(asc(billingRecurringSchedules.nextRunAt)),
  ]);
  return { settings, customers: customerRows, customFields: fieldRows, services: serviceRows, documents: documentRows, recurringSchedules: recurringRows };
}

export async function getBillingDocumentAction(documentId: string) {
  const tenantId = await requireBillingTenant(false);
  const db = getDb();
  const [document] = await db.select().from(billingDocuments).where(and(eq(billingDocuments.id, documentId), eq(billingDocuments.tenantId, tenantId))).limit(1);
  if (!document) throw new Error('Dokument nicht gefunden.');
  const [items, payments, reminders, events] = await Promise.all([
    db.select().from(billingDocumentItems).where(and(eq(billingDocumentItems.documentId, documentId), eq(billingDocumentItems.tenantId, tenantId))).orderBy(asc(billingDocumentItems.position)),
    db.select().from(billingPayments).where(and(eq(billingPayments.documentId, documentId), eq(billingPayments.tenantId, tenantId))).orderBy(desc(billingPayments.paidAt)),
    db.select().from(billingReminders).where(and(eq(billingReminders.documentId, documentId), eq(billingReminders.tenantId, tenantId))).orderBy(desc(billingReminders.createdAt)),
    db.select().from(billingDocumentEvents).where(and(eq(billingDocumentEvents.documentId, documentId), eq(billingDocumentEvents.tenantId, tenantId))).orderBy(desc(billingDocumentEvents.createdAt)).limit(100),
  ]);
  return { document: { ...document, pdfBase64: undefined, xmlContent: undefined }, items, payments, reminders, events };
}

export async function saveBillingSettingsAction(input: unknown) {
  const tenantId = await requireBillingTenant();
  const value = settingsSchema.parse(input);
  const db = getDb();
  const [current] = await db.select({
    nextInvoiceNumber: billingSettings.nextInvoiceNumber,
    nextCancellationNumber: billingSettings.nextCancellationNumber,
    nextQuoteNumber: billingSettings.nextQuoteNumber,
    nextCreditNumber: billingSettings.nextCreditNumber,
  })
    .from(billingSettings).where(eq(billingSettings.tenantId, tenantId)).limit(1);
  if (!current) throw new Error('Rechnungseinstellungen wurden nicht gefunden.');
  const [issued] = await db.select({ id: billingDocuments.id }).from(billingDocuments)
    .where(and(eq(billingDocuments.tenantId, tenantId), ne(billingDocuments.status, 'draft'))).limit(1);
  if (issued && (
    value.nextInvoiceNumber < current.nextInvoiceNumber
    || value.nextCancellationNumber < current.nextCancellationNumber
    || value.nextQuoteNumber < current.nextQuoteNumber
    || value.nextCreditNumber < current.nextCreditNumber
  )) {
    throw new Error('Nach der ersten festgeschriebenen Rechnung dürfen laufende Nummern nur erhöht, nicht zurückgesetzt werden.');
  }
  await db.update(billingSettings).set({ ...value, updatedAt: new Date() }).where(eq(billingSettings.tenantId, tenantId)).catch(async (error: unknown) => {
    if (!isMissingBillingLogoDisplayColumn(error)) throw error;
    const { logoDisplay: _logoDisplay, ...compatibleValue } = value;
    await db.update(billingSettings).set({ ...compatibleValue, updatedAt: new Date() }).where(eq(billingSettings.tenantId, tenantId));
  });
  revalidatePath('/admin/billing');
  return { success: true as const };
}

export async function saveBillingLogoSettingsAction(input: unknown) {
  const tenantId = await requireBillingTenant();
  const value = logoSettingsSchema.parse(input);
  const db = getDb();
  await db.update(billingSettings).set({ ...value, updatedAt: new Date() }).where(eq(billingSettings.tenantId, tenantId)).catch(async (error: unknown) => {
    if (!isMissingBillingLogoDisplayColumn(error)) throw error;
    await db.update(billingSettings).set({ logoUrl: value.logoUrl, updatedAt: new Date() }).where(eq(billingSettings.tenantId, tenantId));
  });
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

async function createBillingDraftForTenant(
  tenantId: string,
  customerId?: string,
  documentTypeInput: 'invoice' | 'quote' | 'advance_invoice' | 'partial_invoice' | 'final_invoice' = 'invoice',
  originalDocumentIdInput?: string,
) {
  const settings = await ensureBillingSettings(tenantId);
  const documentType = z.enum(['invoice', 'quote', 'advance_invoice', 'partial_invoice', 'final_invoice']).parse(documentTypeInput);
  const parsedCustomerId = customerId ? z.string().uuid().parse(customerId) : null;
  const originalDocumentId = originalDocumentIdInput ? z.string().uuid().parse(originalDocumentIdInput) : null;
  if (parsedCustomerId) {
    const [customer] = await getDb().select({ id: customers.id }).from(customers)
      .where(and(eq(customers.id, parsedCustomerId), eq(customers.tenantId, tenantId), isNull(customers.archivedAt))).limit(1);
    if (!customer) throw new Error('Kunde nicht gefunden.');
  }
  const now = new Date();
  const dueDate = new Date(now.getTime() + settings.defaultPaymentTermDays * 86_400_000);
  const [document] = await getDb().insert(billingDocuments).values({
    tenantId, customerId: parsedCustomerId, originalDocumentId, documentType, issueDate: now, serviceDateFrom: now,
    dueDate, currency: 'EUR', introText: settings.defaultIntroText, closingText: settings.defaultClosingText,
    taxMode: settings.smallBusiness ? 'small_business' : 'standard',
    taxExemptionReason: settings.smallBusiness ? settings.smallBusinessNotice : null,
    cashDiscountBasisPoints: settings.defaultCashDiscountBasisPoints,
    cashDiscountDays: settings.defaultCashDiscountDays,
    paymentLinkUrl: settings.paymentLinkBaseUrl,
    quoteValidUntil: documentType === 'quote' ? dueDate : null,
  }).returning({ id: billingDocuments.id });
  revalidatePath('/admin/billing');
  return { success: true as const, id: document.id };
}

export async function createBillingDraftAction(customerId?: string, documentTypeInput: 'invoice' | 'quote' | 'advance_invoice' | 'partial_invoice' | 'final_invoice' = 'invoice', originalDocumentIdInput?: string) {
  return createBillingDraftForTenant(await requireBillingTenant(), customerId, documentTypeInput, originalDocumentIdInput);
}

async function saveBillingDraftForTenant(tenantId: string, input: unknown) {
  const value = draftSchema.parse(input);
  const totals = calculateBillingTotals(value.lines as BillingLine[], {
    taxMode: value.taxMode,
    documentDiscount: { type: value.discountType, value: value.discountValue },
  });
  const db = getDb();
  const [saved] = await db.update(billingDocuments).set({
    customerId: value.customerId, issueDate: value.issueDate, serviceDateFrom: value.serviceDateFrom, serviceDateTo: value.serviceDateTo,
    dueDate: value.dueDate, buyerReference: value.buyerReference, purchaseOrderReference: value.purchaseOrderReference,
    introText: value.introText, closingText: value.closingText, notes: value.notes,
    taxMode: value.taxMode, taxExemptionReason: value.taxExemptionReason,
    discountType: value.discountType, discountValue: value.discountValue, discountCents: totals.documentDiscountCents,
    cashDiscountBasisPoints: value.cashDiscountBasisPoints, cashDiscountDays: value.cashDiscountDays,
    paymentLinkUrl: value.paymentLinkUrl, quoteValidUntil: value.quoteValidUntil,
    subtotalNetCents: totals.subtotalNetCents, taxCents: totals.taxCents, totalGrossCents: totals.totalGrossCents,
    taxBreakdown: totals.taxBreakdown, updatedAt: new Date(),
  }).where(and(eq(billingDocuments.id, value.id), eq(billingDocuments.tenantId, tenantId), eq(billingDocuments.status, 'draft'))).returning({ id: billingDocuments.id });
  if (!saved) throw new Error('Nur Entwürfe können bearbeitet werden.');
  await db.delete(billingDocumentItems).where(and(eq(billingDocumentItems.documentId, value.id), eq(billingDocumentItems.tenantId, tenantId)));
  await db.insert(billingDocumentItems).values(totals.normalizedLines.map((line, index) => ({
    tenantId, documentId: value.id, serviceId: value.lines[index]?.serviceId || null, position: line.position,
    name: line.name, description: line.description || null, quantity: String(line.quantity), unitCode: line.unitCode, unitLabel: line.unitLabel,
    unitPriceNetCents: line.unitPriceNetCents,
    discountBasisPoints: line.discountType === 'percent' ? line.discountValue ?? line.discountBasisPoints : 0,
    discountType: line.discountType || 'percent', discountValue: line.discountValue ?? line.discountBasisPoints,
    discountCents: line.discountCents || 0,
    taxRateBasisPoints: line.taxRateBasisPoints, lineNetCents: line.lineNetCents,
  })));
  revalidatePath('/admin/billing');
  return { success: true as const };
}

export async function saveBillingDraftAction(input: unknown) {
  return saveBillingDraftForTenant(await requireBillingTenant(), input);
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
    logoDisplay: (settings.logoDisplay as BillingSellerSnapshot['logoDisplay']) || 'logo_and_name',
    bankName: settings.bankName || undefined, accountHolder: settings.accountHolder || undefined, iban: settings.iban || undefined, bic: settings.bic || undefined,
    senderName: settings.senderName || undefined,
    footer: settings.defaultFooter || undefined, smallBusiness: settings.smallBusiness, smallBusinessNotice: settings.smallBusinessNotice,
  };
}

type BillingNumberSeries = 'invoice' | 'cancellation' | 'quote' | 'credit';

function numberSeries(documentType: BillingDocumentSnapshot['documentType']): BillingNumberSeries {
  if (documentType === 'quote') return 'quote';
  if (documentType === 'credit_note') return 'credit';
  if (documentType === 'cancellation') return 'cancellation';
  return 'invoice';
}

async function allocateDocumentNumber(tenantId: string, documentId: string, settings: typeof billingSettings.$inferSelect, date: Date, type: BillingNumberSeries) {
  const period = sequencePeriod(date, settings.sequenceReset as 'never' | 'year' | 'month');
  const format = type === 'invoice' ? settings.invoiceNumberFormat
    : type === 'cancellation' ? settings.cancellationNumberFormat
      : type === 'quote' ? settings.quoteNumberFormat : settings.creditNumberFormat;
  const prefix = type === 'invoice' ? settings.invoicePrefix
    : type === 'cancellation' ? settings.cancellationPrefix
      : type === 'quote' ? settings.quotePrefix : settings.creditPrefix;
  const result = await getDb().execute(sql`
    WITH locked_document AS MATERIALIZED (
      SELECT id, document_number, document_type FROM billing_documents
      WHERE id = ${documentId}::uuid AND tenant_id = ${tenantId}::uuid AND status = 'draft'
      FOR UPDATE
    ),
    allocated AS MATERIALIZED (
      SELECT CASE
        WHEN settings.sequence_period IS NULL AND ${type} = 'invoice' THEN settings.next_invoice_number
        WHEN settings.sequence_period IS NULL AND ${type} = 'cancellation' THEN settings.next_cancellation_number
        WHEN settings.sequence_period IS NULL AND ${type} = 'quote' THEN settings.next_quote_number
        WHEN settings.sequence_period IS NULL THEN settings.next_credit_number
        WHEN settings.sequence_period IS DISTINCT FROM ${period} THEN 1
        WHEN ${type} = 'invoice' THEN settings.next_invoice_number
        WHEN ${type} = 'cancellation' THEN settings.next_cancellation_number
        WHEN ${type} = 'quote' THEN settings.next_quote_number
        ELSE settings.next_credit_number
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
        next_quote_number = CASE
          WHEN ${type} = 'quote' THEN (SELECT value + 1 FROM allocated)
          WHEN settings.sequence_period IS NOT NULL AND settings.sequence_period IS DISTINCT FROM ${period} THEN 1
          ELSE settings.next_quote_number
        END,
        next_credit_number = CASE
          WHEN ${type} = 'credit' THEN (SELECT value + 1 FROM allocated)
          WHEN settings.sequence_period IS NOT NULL AND settings.sequence_period IS DISTINCT FROM ${period} THEN 1
          ELSE settings.next_credit_number
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

async function finalizeBillingDocumentForTenant(tenantId: string, id: string) {
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
  const lines: BillingLine[] = storedItems.map(item => ({
    ...item,
    quantity: Number(item.quantity),
    description: item.description || undefined,
    discountType: item.discountType as 'percent' | 'fixed',
  }));
  const missing = validateBillingReadiness(seller, buyer, lines);
  if (missing.length) throw new Error(`Noch nicht bereit: ${missing.join(', ')}.`);
  const type = document.documentType as BillingDocumentSnapshot['documentType'];
  const taxMode = (seller.smallBusiness ? 'small_business' : document.taxMode) as BillingTaxMode;
  const totals = calculateBillingTotals(lines, {
    taxMode,
    documentDiscount: { type: document.discountType as 'percent' | 'fixed', value: document.discountValue },
  });
  const documentNumber = await allocateDocumentNumber(tenantId, documentId, settings, document.issueDate, numberSeries(type));
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
    taxMode, taxExemptionReason: document.taxExemptionReason || undefined,
    discountType: document.discountType as 'percent' | 'fixed', discountValue: document.discountValue,
    cashDiscountBasisPoints: document.cashDiscountBasisPoints, cashDiscountDays: document.cashDiscountDays,
    paymentLinkUrl: document.paymentLinkUrl || undefined, quoteValidUntil: document.quoteValidUntil || undefined,
  };
  const [pdf, xml] = await Promise.all([
    renderBillingPdf({ document: snapshot, seller, customer: buyer, lines, totals }),
    type === 'quote' ? Promise.resolve(null) : generateEInvoice({ document: snapshot, seller, customer: buyer, lines, totals }),
  ]);
  const pdfSha256 = sha256(pdf);
  const xmlSha256 = xml ? sha256(xml) : null;
  const documentSha256 = sha256(JSON.stringify({ snapshot, seller, buyer, lines: totals.normalizedLines, totals, pdfSha256, xmlSha256 }));
  const retentionUntil = new Date(document.issueDate);
  retentionUntil.setUTCFullYear(retentionUntil.getUTCFullYear() + getBillingJurisdiction(settings.countryCode).retentionYears);
  const finalizedAt = new Date();
  const finalizedStatus = type === 'quote' ? 'issued' : 'finalized';
  const [finalized] = await db.update(billingDocuments).set({
    documentNumber, sellerSnapshot: seller, customerSnapshot: buyer, paymentSnapshot: { bankName: seller.bankName, accountHolder: seller.accountHolder, iban: seller.iban, bic: seller.bic, paymentLinkUrl: document.paymentLinkUrl, cashDiscountBasisPoints: document.cashDiscountBasisPoints, cashDiscountDays: document.cashDiscountDays },
    subtotalNetCents: totals.subtotalNetCents, taxCents: totals.taxCents, totalGrossCents: totals.totalGrossCents, taxBreakdown: totals.taxBreakdown,
    discountCents: totals.documentDiscountCents,
    pdfBase64: Buffer.from(pdf).toString('base64'), xmlContent: xml, pdfSha256, xmlSha256, documentSha256,
    finalizedAt, retentionUntil, status: finalizedStatus, updatedAt: finalizedAt,
  }).where(and(eq(billingDocuments.id, documentId), eq(billingDocuments.tenantId, tenantId), eq(billingDocuments.status, 'draft'))).returning({ id: billingDocuments.id });
  if (finalized) await appendEvent(tenantId, documentId, type === 'quote' ? 'issued' : 'finalized', { documentNumber, documentSha256, pdfSha256, xmlSha256, retentionUntil: retentionUntil.toISOString() });
  revalidatePath('/admin/billing');
  return { success: true as const, documentNumber };
}

export async function finalizeBillingDocumentAction(id: string) {
  return finalizeBillingDocumentForTenant(await requireBillingTenant(), id);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] || character);
}

function documentMailLabel(type: string) {
  return ({
    invoice: 'Rechnung', cancellation: 'Stornorechnung', credit_note: 'Gutschrift', quote: 'Angebot',
    advance_invoice: 'Anzahlungsrechnung', partial_invoice: 'Abschlagsrechnung', final_invoice: 'Schlussrechnung',
  } as Record<string, string>)[type] || 'Dokument';
}

async function sendBillingDocumentForTenant(tenantId: string, id: string, recipientInput: string, idempotencyInput?: string) {
  const documentId = z.string().uuid().parse(id);
  const recipient = recipientInput.trim().toLowerCase();
  if (!isValidSmtpAddress(recipient)) throw new Error('Bitte eine gültige Empfängeradresse angeben.');
  const idempotencyKey = idempotencyInput ? z.string().uuid().parse(idempotencyInput) : randomUUID();
  const db = getDb();
  const [document] = await db.select().from(billingDocuments).where(and(eq(billingDocuments.id, documentId), eq(billingDocuments.tenantId, tenantId))).limit(1);
  if (!document?.documentNumber || !document.pdfBase64 || !document.documentSha256 || document.status === 'draft') throw new Error('Das Dokument muss zuerst festgeschrieben werden.');
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
  const label = documentMailLabel(document.documentType);
  const jurisdiction = getBillingJurisdiction(settings.countryCode);
  const attachmentDescription = document.xmlContent ? ` als PDF und ${jurisdiction.eInvoiceLabel}` : ' als PDF';
  const attachments = [
    { filename: `${document.documentNumber}.pdf`, content: Buffer.from(document.pdfBase64, 'base64'), contentType: 'application/pdf' },
    ...(document.xmlContent ? [{ filename: `${document.documentNumber}-${settings.countryCode === 'AT' ? 'ubl' : 'xrechnung'}.xml`, content: Buffer.from(document.xmlContent, 'utf8'), contentType: 'application/xml' }] : []),
  ];
  const subject = `${label} ${document.documentNumber}`;
  try {
    const info = await createHardenedRendererSmtpTransport(smtp).sendMail({
      from, to: recipient, subject,
      text: `Guten Tag,\n\nim Anhang erhalten Sie ${label.toLowerCase()} ${document.documentNumber}${attachmentDescription}.\n\nFreundliche Grüße`,
      html: `<p>Guten Tag,</p><p>im Anhang erhalten Sie ${escapeHtml(label.toLowerCase())} <strong>${escapeHtml(document.documentNumber)}</strong>${escapeHtml(attachmentDescription)}.</p><p>Freundliche Grüße</p>`,
      attachments,
      messageId: `<billing-${idempotencyKey}@flamingomedia.online>`,
    });
    const sentAt = new Date();
    await db.update(billingDeliveryAttempts).set({ status: 'sent', messageId: info.messageId, sentAt, updatedAt: sentAt }).where(eq(billingDeliveryAttempts.idempotencyKey, idempotencyKey));
    await db.update(billingDocuments).set({ sentAt, status: ['paid', 'partially_paid'].includes(document.status) ? document.status : 'sent', updatedAt: sentAt }).where(and(eq(billingDocuments.id, documentId), eq(billingDocuments.tenantId, tenantId)));
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

export async function sendBillingDocumentAction(id: string, recipientInput: string, idempotencyInput?: string) {
  return sendBillingDocumentForTenant(await requireBillingTenant(), id, recipientInput, idempotencyInput);
}

async function refreshPaymentState(tenantId: string, documentId: string) {
  const db = getDb();
  const [document, activePayments] = await Promise.all([
    db.select().from(billingDocuments).where(and(eq(billingDocuments.id, documentId), eq(billingDocuments.tenantId, tenantId))).limit(1).then(rows => rows[0]),
    db.select({ amountCents: billingPayments.amountCents, paidAt: billingPayments.paidAt }).from(billingPayments)
      .where(and(eq(billingPayments.documentId, documentId), eq(billingPayments.tenantId, tenantId), isNull(billingPayments.reversedAt))),
  ]);
  if (!document) throw new Error('Dokument nicht gefunden.');
  const amountPaidCents = activePayments.reduce((sum, payment) => sum + payment.amountCents, 0);
  const fullyPaid = amountPaidCents >= document.totalGrossCents && document.totalGrossCents > 0;
  const status = fullyPaid ? 'paid' : amountPaidCents > 0 ? 'partially_paid' : document.sentAt ? 'sent' : 'finalized';
  const paidAt = fullyPaid ? activePayments.sort((a, b) => b.paidAt.getTime() - a.paidAt.getTime())[0]?.paidAt || new Date() : null;
  await db.update(billingDocuments).set({ amountPaidCents, status, paidAt, updatedAt: new Date() })
    .where(and(eq(billingDocuments.id, documentId), eq(billingDocuments.tenantId, tenantId)));
  return { amountPaidCents, outstandingCents: Math.max(0, document.totalGrossCents - amountPaidCents), status };
}

export async function recordBillingPaymentAction(input: unknown) {
  const tenantId = await requireBillingTenant();
  const value = paymentSchema.parse(input);
  const db = getDb();
  const [document] = await db.select().from(billingDocuments)
    .where(and(eq(billingDocuments.id, value.documentId), eq(billingDocuments.tenantId, tenantId))).limit(1);
  if (!document || !['invoice', 'advance_invoice', 'partial_invoice', 'final_invoice'].includes(document.documentType) || ['draft', 'cancelled'].includes(document.status)) {
    throw new Error('Zahlungen können nur auf festgeschriebene, aktive Rechnungen gebucht werden.');
  }
  const outstanding = Math.max(0, document.totalGrossCents - document.amountPaidCents);
  if (value.amountCents > outstanding) throw new Error(`Der Zahlungseingang übersteigt den offenen Betrag von ${(outstanding / 100).toFixed(2)} €.`);
  const [payment] = await db.insert(billingPayments).values({ tenantId, ...value }).returning({ id: billingPayments.id });
  const state = await refreshPaymentState(tenantId, value.documentId);
  await appendEvent(tenantId, value.documentId, state.status === 'paid' ? 'paid' : 'payment_recorded', { paymentId: payment.id, amountCents: value.amountCents, paidAt: value.paidAt.toISOString(), method: value.method, outstandingCents: state.outstandingCents });
  revalidatePath('/admin/billing');
  return { success: true as const, paymentId: payment.id, ...state };
}

export async function reverseBillingPaymentAction(id: string, reasonInput: string) {
  const tenantId = await requireBillingTenant();
  const paymentId = z.string().uuid().parse(id);
  const reason = z.string().trim().min(3).max(2000).parse(reasonInput);
  const reversedAt = new Date();
  const [payment] = await getDb().update(billingPayments).set({ reversedAt, reversalReason: reason })
    .where(and(eq(billingPayments.id, paymentId), eq(billingPayments.tenantId, tenantId), isNull(billingPayments.reversedAt)))
    .returning({ documentId: billingPayments.documentId, amountCents: billingPayments.amountCents });
  if (!payment) throw new Error('Zahlung wurde nicht gefunden oder bereits storniert.');
  const state = await refreshPaymentState(tenantId, payment.documentId);
  await appendEvent(tenantId, payment.documentId, 'payment_reversed', { paymentId, amountCents: payment.amountCents, reason, outstandingCents: state.outstandingCents });
  revalidatePath('/admin/billing');
  return { success: true as const, ...state };
}

export async function markBillingDocumentPaidAction(id: string) {
  const tenantId = await requireBillingTenant();
  const documentId = z.string().uuid().parse(id);
  const [document] = await getDb().select().from(billingDocuments).where(and(eq(billingDocuments.id, documentId), eq(billingDocuments.tenantId, tenantId))).limit(1);
  if (!document) throw new Error('Rechnung nicht gefunden.');
  const amountCents = document.totalGrossCents - document.amountPaidCents;
  if (amountCents <= 0) return { success: true as const };
  await getDb().insert(billingPayments).values({ tenantId, documentId, amountCents, paidAt: new Date(), method: 'bank_transfer', notes: 'Als vollständig bezahlt markiert' });
  const state = await refreshPaymentState(tenantId, documentId);
  await appendEvent(tenantId, documentId, 'paid', { amountCents, paidAt: new Date().toISOString(), method: 'bank_transfer' });
  revalidatePath('/admin/billing');
  return { success: true as const, ...state };
}

export async function cancelBillingDocumentAction(id: string, reasonInput: string) {
  const tenantId = await requireBillingTenant();
  const originalId = z.string().uuid().parse(id);
  const reason = z.string().trim().min(3).max(2000).parse(reasonInput);
  const db = getDb();
  const [original] = await db.select().from(billingDocuments).where(and(
    eq(billingDocuments.id, originalId), eq(billingDocuments.tenantId, tenantId),
    inArray(billingDocuments.documentType, ['invoice', 'advance_invoice', 'partial_invoice', 'final_invoice']), ne(billingDocuments.status, 'draft'),
  )).limit(1);
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

const recurringTemplateSchema = z.object({
  documentType: z.enum(['invoice', 'advance_invoice', 'partial_invoice', 'final_invoice']).default('invoice'),
  introText: nullableText(5000),
  closingText: nullableText(5000),
  notes: nullableText(10_000),
  buyerReference: nullableText(100),
  purchaseOrderReference: nullableText(100),
  taxMode: z.enum(['standard', 'small_business', 'reverse_charge', 'intra_eu', 'exempt']).default('standard'),
  taxExemptionReason: nullableText(2000),
  discountType: z.enum(['percent', 'fixed']).default('percent'),
  discountValue: z.coerce.number().int().min(0).max(1_000_000_000).default(0),
  cashDiscountBasisPoints: z.coerce.number().int().min(0).max(10_000).default(0),
  cashDiscountDays: z.coerce.number().int().min(0).max(365).default(0),
  paymentLinkUrl: z.union([z.literal(''), z.string().trim().url().max(1000)]).optional().nullable().transform(value => value || null),
  servicePeriodDays: z.coerce.number().int().min(0).max(3660).default(0),
  lines: z.array(lineSchema).min(1).max(500),
});

const recurringScheduleSchema = z.object({
  id: z.string().uuid().optional(),
  customerId: z.string().uuid(),
  name: z.string().trim().min(1).max(255),
  status: z.enum(['active', 'paused', 'completed']).default('active'),
  intervalUnit: z.enum(['day', 'week', 'month', 'year']),
  intervalCount: z.coerce.number().int().min(1).max(120),
  startAt: z.coerce.date(),
  endAt: z.coerce.date().optional().nullable(),
  nextRunAt: z.coerce.date(),
  deliveryMode: z.enum(['draft', 'finalize', 'finalize_send']).default('draft'),
  recipient: nullableText(320),
  template: recurringTemplateSchema,
}).superRefine((value, context) => {
  if (value.endAt && value.endAt < value.startAt) context.addIssue({ code: 'custom', path: ['endAt'], message: 'Das Enddatum liegt vor dem Startdatum.' });
  if (value.deliveryMode === 'finalize_send' && !value.recipient) context.addIssue({ code: 'custom', path: ['recipient'], message: 'Für automatischen Versand ist eine E-Mail-Adresse erforderlich.' });
  if (value.recipient && !isValidSmtpAddress(value.recipient)) context.addIssue({ code: 'custom', path: ['recipient'], message: 'Bitte eine gültige E-Mail-Adresse angeben.' });
  if (value.template.taxMode !== 'standard' && value.template.taxMode !== 'small_business' && !value.template.taxExemptionReason) context.addIssue({ code: 'custom', path: ['template', 'taxExemptionReason'], message: 'Für diesen Steuerfall ist ein Hinweis erforderlich.' });
});

function nextRecurringDate(value: Date, unit: 'day' | 'week' | 'month' | 'year', count: number) {
  const next = new Date(value);
  if (unit === 'day' || unit === 'week') {
    next.setUTCDate(next.getUTCDate() + count * (unit === 'week' ? 7 : 1));
    return next;
  }
  const day = next.getUTCDate();
  next.setUTCDate(1);
  if (unit === 'month') next.setUTCMonth(next.getUTCMonth() + count);
  else next.setUTCFullYear(next.getUTCFullYear() + count);
  const maxDay = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)).getUTCDate();
  next.setUTCDate(Math.min(day, maxDay));
  return next;
}

export async function saveBillingRecurringScheduleAction(input: unknown) {
  const tenantId = await requireBillingTenant();
  const value = recurringScheduleSchema.parse(input);
  const db = getDb();
  const [customer] = await db.select({ id: customers.id }).from(customers)
    .where(and(eq(customers.id, value.customerId), eq(customers.tenantId, tenantId), isNull(customers.archivedAt))).limit(1);
  if (!customer) throw new Error('Kunde nicht gefunden.');
  const update = {
    customerId: value.customerId, name: value.name, status: value.status, intervalUnit: value.intervalUnit,
    intervalCount: value.intervalCount, startAt: value.startAt, endAt: value.endAt, nextRunAt: value.nextRunAt,
    deliveryMode: value.deliveryMode, recipient: value.recipient, template: value.template, updatedAt: new Date(),
  };
  if (value.id) {
    const [saved] = await db.update(billingRecurringSchedules).set(update)
      .where(and(eq(billingRecurringSchedules.id, value.id), eq(billingRecurringSchedules.tenantId, tenantId)))
      .returning({ id: billingRecurringSchedules.id });
    if (!saved) throw new Error('Serienvorlage nicht gefunden.');
    revalidatePath('/admin/billing');
    return { success: true as const, id: saved.id };
  }
  const [saved] = await db.insert(billingRecurringSchedules).values({ tenantId, ...update }).returning({ id: billingRecurringSchedules.id });
  revalidatePath('/admin/billing');
  return { success: true as const, id: saved.id };
}

export async function setBillingRecurringScheduleStatusAction(id: string, statusInput: string) {
  const tenantId = await requireBillingTenant();
  const status = z.enum(['active', 'paused', 'completed']).parse(statusInput);
  const [updated] = await getDb().update(billingRecurringSchedules).set({ status, updatedAt: new Date() })
    .where(and(eq(billingRecurringSchedules.id, z.string().uuid().parse(id)), eq(billingRecurringSchedules.tenantId, tenantId)))
    .returning({ id: billingRecurringSchedules.id });
  if (!updated) throw new Error('Serienvorlage nicht gefunden.');
  revalidatePath('/admin/billing');
  return { success: true as const };
}

async function runBillingRecurringScheduleForTenant(tenantId: string, id: string, scheduledForInput?: Date | string) {
  const scheduleId = z.string().uuid().parse(id);
  const db = getDb();
  const [schedule] = await db.select().from(billingRecurringSchedules)
    .where(and(eq(billingRecurringSchedules.id, scheduleId), eq(billingRecurringSchedules.tenantId, tenantId))).limit(1);
  if (!schedule || schedule.status !== 'active') throw new Error('Diese Serienvorlage ist nicht aktiv.');
  const scheduledFor = scheduledForInput ? z.coerce.date().parse(scheduledForInput) : schedule.nextRunAt;
  if (schedule.endAt && scheduledFor > schedule.endAt) throw new Error('Die Serie ist bereits beendet.');
  let [claim] = await db.insert(billingRecurringRuns).values({ tenantId, scheduleId, scheduledFor })
    .onConflictDoNothing({ target: [billingRecurringRuns.scheduleId, billingRecurringRuns.scheduledFor] })
    .returning({ id: billingRecurringRuns.id });
  if (!claim) {
    [claim] = await db.update(billingRecurringRuns).set({ status: 'running', errorCode: null, completedAt: null })
      .where(and(eq(billingRecurringRuns.scheduleId, scheduleId), eq(billingRecurringRuns.scheduledFor, scheduledFor), eq(billingRecurringRuns.status, 'failed')))
      .returning({ id: billingRecurringRuns.id });
    if (!claim) return { success: true as const, alreadyGenerated: true };
  }
  try {
    const template = recurringTemplateSchema.parse(schedule.template);
    const settings = await ensureBillingSettings(tenantId);
    const issueDate = new Date();
    const serviceDateFrom = new Date(issueDate);
    serviceDateFrom.setUTCDate(serviceDateFrom.getUTCDate() - template.servicePeriodDays);
    const dueDate = new Date(issueDate.getTime() + settings.defaultPaymentTermDays * 86_400_000);
    const created = await createBillingDraftForTenant(tenantId, schedule.customerId, template.documentType);
    await db.update(billingDocuments).set({ recurringScheduleId: scheduleId }).where(and(eq(billingDocuments.id, created.id), eq(billingDocuments.tenantId, tenantId)));
    await saveBillingDraftForTenant(tenantId, {
      id: created.id, customerId: schedule.customerId, issueDate, serviceDateFrom, serviceDateTo: issueDate, dueDate,
      buyerReference: template.buyerReference, purchaseOrderReference: template.purchaseOrderReference,
      introText: template.introText, closingText: template.closingText, notes: template.notes,
      taxMode: template.taxMode, taxExemptionReason: template.taxExemptionReason,
      discountType: template.discountType, discountValue: template.discountValue,
      cashDiscountBasisPoints: template.cashDiscountBasisPoints, cashDiscountDays: template.cashDiscountDays,
      paymentLinkUrl: template.paymentLinkUrl, quoteValidUntil: null, lines: template.lines,
    });
    if (schedule.deliveryMode !== 'draft') await finalizeBillingDocumentForTenant(tenantId, created.id);
    if (schedule.deliveryMode === 'finalize_send' && schedule.recipient) await sendBillingDocumentForTenant(tenantId, created.id, schedule.recipient, randomUUID());
    const nextRunAt = nextRecurringDate(scheduledFor, schedule.intervalUnit as 'day' | 'week' | 'month' | 'year', schedule.intervalCount);
    const completed = Boolean(schedule.endAt && nextRunAt > schedule.endAt);
    await Promise.all([
      db.update(billingRecurringRuns).set({ status: 'completed', documentId: created.id, completedAt: new Date() }).where(eq(billingRecurringRuns.id, claim.id)),
      db.update(billingRecurringSchedules).set({ status: completed ? 'completed' : schedule.status, lastRunAt: scheduledFor, nextRunAt, updatedAt: new Date() }).where(and(eq(billingRecurringSchedules.id, scheduleId), eq(billingRecurringSchedules.tenantId, tenantId))),
    ]);
    revalidatePath('/admin/billing');
    return { success: true as const, documentId: created.id, nextRunAt, completed };
  } catch (error) {
    await db.update(billingRecurringRuns).set({ status: 'failed', errorCode: (error instanceof Error ? error.name : 'generation_error').slice(0, 100), completedAt: new Date() }).where(eq(billingRecurringRuns.id, claim.id));
    throw error;
  }
}

export async function runBillingRecurringScheduleAction(id: string, scheduledForInput?: Date | string) {
  return runBillingRecurringScheduleForTenant(await requireBillingTenant(), id, scheduledForInput);
}

export async function runDueBillingRecurringSchedules(authorization: string | null, now = new Date(), limit = 50) {
  const secret = process.env.CRON_SECRET;
  if (!secret || authorization !== `Bearer ${secret}`) throw new Error('Unauthorized');
  const due = await getDb().select({ id: billingRecurringSchedules.id, tenantId: billingRecurringSchedules.tenantId, nextRunAt: billingRecurringSchedules.nextRunAt })
    .from(billingRecurringSchedules)
    .where(and(eq(billingRecurringSchedules.status, 'active'), lte(billingRecurringSchedules.nextRunAt, now)))
    .orderBy(asc(billingRecurringSchedules.nextRunAt))
    .limit(Math.min(200, Math.max(1, limit)));
  const results: Array<{ id: string; ok: boolean; alreadyGenerated?: boolean; error?: string }> = [];
  for (const schedule of due) {
    try {
      const result = await runBillingRecurringScheduleForTenant(schedule.tenantId, schedule.id, schedule.nextRunAt);
      results.push({ id: schedule.id, ok: true, alreadyGenerated: 'alreadyGenerated' in result ? result.alreadyGenerated : false });
    } catch (error) {
      results.push({ id: schedule.id, ok: false, error: error instanceof Error ? error.name : 'generation_error' });
    }
  }
  return { processed: results.length, succeeded: results.filter(result => result.ok).length, failed: results.filter(result => !result.ok).length, results };
}

export async function updateBillingQuoteStatusAction(id: string, statusInput: string) {
  const tenantId = await requireBillingTenant();
  const documentId = z.string().uuid().parse(id);
  const status = z.enum(['accepted', 'rejected']).parse(statusInput);
  const now = new Date();
  const [updated] = await getDb().update(billingDocuments).set({ status, acceptedAt: status === 'accepted' ? now : null, rejectedAt: status === 'rejected' ? now : null, updatedAt: now })
    .where(and(eq(billingDocuments.id, documentId), eq(billingDocuments.tenantId, tenantId), eq(billingDocuments.documentType, 'quote'), inArray(billingDocuments.status, ['issued', 'sent', 'accepted', 'rejected'])))
    .returning({ id: billingDocuments.id });
  if (!updated) throw new Error('Nur versendete oder ausgestellte Angebote können aktualisiert werden.');
  await appendEvent(tenantId, documentId, `quote_${status}`, { at: now.toISOString() });
  revalidatePath('/admin/billing');
  return { success: true as const };
}

export async function convertBillingQuoteToInvoiceAction(id: string) {
  const tenantId = await requireBillingTenant();
  const quoteId = z.string().uuid().parse(id);
  const detail = await getBillingDocumentAction(quoteId);
  const quote = detail.document;
  if (quote.documentType !== 'quote' || !['issued', 'sent', 'accepted'].includes(quote.status)) throw new Error('Dieses Angebot kann nicht in eine Rechnung übernommen werden.');
  const settings = await ensureBillingSettings(tenantId);
  const issueDate = new Date();
  const dueDate = new Date(issueDate.getTime() + settings.defaultPaymentTermDays * 86_400_000);
  const created = await createBillingDraftAction(quote.customerId || undefined, 'invoice', quoteId);
  await saveBillingDraftAction({
    id: created.id, customerId: quote.customerId, issueDate, serviceDateFrom: issueDate, serviceDateTo: null, dueDate,
    buyerReference: quote.buyerReference, purchaseOrderReference: quote.purchaseOrderReference,
    introText: quote.introText, closingText: quote.closingText, notes: `Übernommen aus Angebot ${quote.documentNumber}.`,
    taxMode: quote.taxMode, taxExemptionReason: quote.taxExemptionReason,
    discountType: quote.discountType, discountValue: quote.discountValue,
    cashDiscountBasisPoints: quote.cashDiscountBasisPoints, cashDiscountDays: quote.cashDiscountDays,
    paymentLinkUrl: quote.paymentLinkUrl, quoteValidUntil: null,
    lines: detail.items.map(item => ({ ...item, quantity: Number(item.quantity) })),
  });
  const now = new Date();
  await getDb().update(billingDocuments).set({ status: 'converted', convertedAt: now, updatedAt: now }).where(and(eq(billingDocuments.id, quoteId), eq(billingDocuments.tenantId, tenantId)));
  await appendEvent(tenantId, quoteId, 'quote_converted', { invoiceDraftId: created.id });
  revalidatePath('/admin/billing');
  return { success: true as const, documentId: created.id };
}

export async function createBillingCreditNoteDraftAction(id: string) {
  const tenantId = await requireBillingTenant();
  const originalId = z.string().uuid().parse(id);
  const db = getDb();
  const [original, items] = await Promise.all([
    db.select().from(billingDocuments).where(and(eq(billingDocuments.id, originalId), eq(billingDocuments.tenantId, tenantId), inArray(billingDocuments.documentType, ['invoice', 'advance_invoice', 'partial_invoice', 'final_invoice']), ne(billingDocuments.status, 'draft'))).limit(1).then(rows => rows[0]),
    db.select().from(billingDocumentItems).where(and(eq(billingDocumentItems.documentId, originalId), eq(billingDocumentItems.tenantId, tenantId))).orderBy(asc(billingDocumentItems.position)),
  ]);
  if (!original) throw new Error('Aus diesem Dokument kann keine Gutschrift erstellt werden.');
  const now = new Date();
  const [credit] = await db.insert(billingDocuments).values({
    tenantId, customerId: original.customerId, originalDocumentId: originalId, documentType: 'credit_note', issueDate: now,
    serviceDateFrom: original.serviceDateFrom || now, serviceDateTo: original.serviceDateTo, dueDate: now,
    buyerReference: original.buyerReference, purchaseOrderReference: original.purchaseOrderReference,
    introText: `Gutschrift zu ${original.documentNumber}.`, closingText: original.closingText,
    taxMode: original.taxMode, taxExemptionReason: original.taxExemptionReason,
  }).returning({ id: billingDocuments.id });
  if (items.length) await db.insert(billingDocumentItems).values(items.map(item => ({ ...item, id: randomUUID(), documentId: credit.id, createdAt: now, updatedAt: now })));
  await appendEvent(tenantId, credit.id, 'credit_note_created', { originalDocumentId: originalId });
  revalidatePath('/admin/billing');
  return { success: true as const, documentId: credit.id };
}

const reminderSchema = z.object({
  documentId: z.string().uuid(),
  feeCents: z.coerce.number().int().min(0).max(10_000_000).default(0),
  interestCents: z.coerce.number().int().min(0).max(100_000_000).default(0),
  dueDate: z.coerce.date(),
  recipient: z.string().trim().email().max(320),
  message: z.string().trim().min(3).max(10_000),
  sendNow: z.boolean().default(false),
});

export async function createBillingReminderAction(input: unknown) {
  const tenantId = await requireBillingTenant();
  const value = reminderSchema.parse(input);
  const db = getDb();
  const [document] = await db.select().from(billingDocuments).where(and(eq(billingDocuments.id, value.documentId), eq(billingDocuments.tenantId, tenantId))).limit(1);
  if (!document || !['finalized', 'sent', 'partially_paid'].includes(document.status) || document.amountPaidCents >= document.totalGrossCents) throw new Error('Nur offene, festgeschriebene Rechnungen können gemahnt werden.');
  const level = document.reminderLevel + 1;
  const reminderDate = new Date();
  const [reminder] = await db.insert(billingReminders).values({ tenantId, documentId: value.documentId, level, feeCents: value.feeCents, interestCents: value.interestCents, reminderDate, dueDate: value.dueDate, recipient: value.recipient, message: value.message }).returning({ id: billingReminders.id });
  if (value.sendNow) await sendBillingReminderAction(reminder.id);
  else {
    await db.update(billingDocuments).set({ reminderLevel: level, lastReminderAt: reminderDate, updatedAt: reminderDate }).where(and(eq(billingDocuments.id, value.documentId), eq(billingDocuments.tenantId, tenantId)));
    await appendEvent(tenantId, value.documentId, 'reminder_created', { reminderId: reminder.id, level, feeCents: value.feeCents, interestCents: value.interestCents });
  }
  revalidatePath('/admin/billing');
  return { success: true as const, reminderId: reminder.id, level };
}

export async function sendBillingReminderAction(id: string) {
  const tenantId = await requireBillingTenant();
  const reminderId = z.string().uuid().parse(id);
  const db = getDb();
  const [reminder] = await db.select().from(billingReminders).where(and(eq(billingReminders.id, reminderId), eq(billingReminders.tenantId, tenantId))).limit(1);
  if (!reminder || reminder.status !== 'draft' || !reminder.recipient) throw new Error('Mahnung wurde nicht gefunden oder bereits gesendet.');
  const [document, settings] = await Promise.all([
    db.select().from(billingDocuments).where(and(eq(billingDocuments.id, reminder.documentId), eq(billingDocuments.tenantId, tenantId))).limit(1).then(rows => rows[0]),
    ensureBillingSettings(tenantId),
  ]);
  if (!document?.pdfBase64 || !document.documentNumber) throw new Error('Die zugehörige Rechnung ist nicht verfügbar.');
  const smtp = await getEffectiveSmtp(tenantId);
  if (!smtp) throw new Error('Kein sicherer Mail-Server ist eingerichtet.');
  const senderName = (settings.senderName || settings.companyName || '').replace(/[\r\n"<>]/g, '').trim().slice(0, 160);
  const from = senderName ? `"${senderName}" <${smtp.from}>` : smtp.from;
  const info = await createHardenedRendererSmtpTransport(smtp).sendMail({
    from, to: reminder.recipient, subject: `${reminder.level}. Zahlungserinnerung zu ${document.documentNumber}`,
    text: `${reminder.message}\n\nOffener Rechnungsbetrag: ${((document.totalGrossCents - document.amountPaidCents) / 100).toFixed(2)} EUR\nNeue Frist: ${reminder.dueDate.toLocaleDateString('de-DE')}`,
    html: `<p>${escapeHtml(reminder.message).replace(/\n/g, '<br>')}</p><p><strong>Offener Rechnungsbetrag:</strong> ${((document.totalGrossCents - document.amountPaidCents) / 100).toFixed(2)} EUR<br><strong>Neue Frist:</strong> ${reminder.dueDate.toLocaleDateString('de-DE')}</p>`,
    attachments: [{ filename: `${document.documentNumber}.pdf`, content: Buffer.from(document.pdfBase64, 'base64'), contentType: 'application/pdf' }],
    messageId: `<billing-reminder-${reminderId}@flamingomedia.online>`,
  });
  const sentAt = new Date();
  await Promise.all([
    db.update(billingReminders).set({ status: 'sent', sentAt }).where(and(eq(billingReminders.id, reminderId), eq(billingReminders.tenantId, tenantId), eq(billingReminders.status, 'draft'))),
    db.update(billingDocuments).set({ reminderLevel: reminder.level, lastReminderAt: sentAt, updatedAt: sentAt }).where(and(eq(billingDocuments.id, reminder.documentId), eq(billingDocuments.tenantId, tenantId))),
  ]);
  await appendEvent(tenantId, reminder.documentId, 'reminder_sent', { reminderId, level: reminder.level, recipient: reminder.recipient, messageId: info.messageId });
  revalidatePath('/admin/billing');
  return { success: true as const };
}

export async function createBillingPortalLinkAction(id: string, validDaysInput = 30) {
  const tenantId = await requireBillingTenant();
  const documentId = z.string().uuid().parse(id);
  const validDays = z.coerce.number().int().min(1).max(365).parse(validDaysInput);
  const [document] = await getDb().select({ id: billingDocuments.id, status: billingDocuments.status }).from(billingDocuments)
    .where(and(eq(billingDocuments.id, documentId), eq(billingDocuments.tenantId, tenantId))).limit(1);
  if (!document || document.status === 'draft') throw new Error('Nur festgeschriebene Dokumente können geteilt werden.');
  const token = randomBytes(32).toString('base64url');
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + validDays * 86_400_000);
  await getDb().insert(billingPortalLinks).values({ tenantId, documentId, tokenHash, expiresAt });
  await appendEvent(tenantId, documentId, 'portal_link_created', { expiresAt: expiresAt.toISOString() });
  return { success: true as const, path: `/billing/share/${token}`, expiresAt };
}
