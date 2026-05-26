'use server';

import { getDb } from '@/lib/db';
import { crmCustomerPayments, crmCustomers, leads } from '@flamingo/db';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export type CrmCustomer = typeof crmCustomers.$inferSelect;
export type CrmCustomerPayment = typeof crmCustomerPayments.$inferSelect;
type CrmCustomerInsert = typeof crmCustomers.$inferInsert;
type CrmPaymentInsert = typeof crmCustomerPayments.$inferInsert;

export type CustomerWithPayments = CrmCustomer & { payments: CrmCustomerPayment[] };

const MISSING_CUSTOMER_SCHEMA_MESSAGE = 'Die CRM-Kundentabellen sind in der Datenbank noch nicht angelegt.';

function isMissingCustomerSchemaError(error: unknown) {
  const maybeError = error as { code?: string; message?: string } | null;
  const message = maybeError?.message || '';
  return maybeError?.code === '42P01'
    || maybeError?.code === '42704'
    || message.includes('crm_customers')
    || message.includes('crm_customer_payments')
    || message.includes('crm_customer_status')
    || message.includes('crm_payment_status');
}

function handleCustomerSchemaError(error: unknown): never {
  if (isMissingCustomerSchemaError(error)) {
    throw new Error(MISSING_CUSTOMER_SCHEMA_MESSAGE);
  }
  throw error;
}

function revalidateCustomers() {
  revalidatePath('/crm/kunden');
  revalidatePath('/crm/auswertung');
  revalidatePath('/crm/leads');
}

export async function getCustomers(): Promise<CustomerWithPayments[]> {
  const db = getDb();
  try {
    const [customers, payments] = await Promise.all([
      db.select().from(crmCustomers).orderBy(desc(crmCustomers.createdAt)),
      db.select().from(crmCustomerPayments).orderBy(desc(crmCustomerPayments.createdAt)),
    ]);
    return customers.map(customer => ({
      ...customer,
      payments: payments.filter(payment => payment.customerId === customer.id),
    }));
  } catch (error) {
    if (isMissingCustomerSchemaError(error)) {
      console.warn(`[CRM Kunden] ${MISSING_CUSTOMER_SCHEMA_MESSAGE}`);
      return [];
    }
    throw error;
  }
}

export async function createCustomer(data: Omit<CrmCustomerInsert, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomerWithPayments> {
  const db = getDb();
  try {
    const [customer] = await db.insert(crmCustomers).values(data).returning();
    revalidateCustomers();
    return { ...customer, payments: [] };
  } catch (error) {
    handleCustomerSchemaError(error);
  }
}

export async function updateCustomer(id: string, data: Partial<Omit<CrmCustomerInsert, 'id' | 'createdAt'>>): Promise<CustomerWithPayments> {
  const db = getDb();
  try {
    const [customer] = await db.update(crmCustomers).set({ ...data, updatedAt: new Date() }).where(eq(crmCustomers.id, id)).returning();
    const payments = await db.select().from(crmCustomerPayments).where(eq(crmCustomerPayments.customerId, id)).orderBy(desc(crmCustomerPayments.createdAt));
    revalidateCustomers();
    return { ...customer, payments };
  } catch (error) {
    handleCustomerSchemaError(error);
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  const db = getDb();
  try {
    await db.delete(crmCustomers).where(eq(crmCustomers.id, id));
    revalidateCustomers();
  } catch (error) {
    handleCustomerSchemaError(error);
  }
}

export async function convertLeadToCustomer(leadId: string, data: {
  packageName?: string;
  setupPriceCents?: number;
  hostingMonthlyCents?: number;
  notes?: string;
}): Promise<CustomerWithPayments> {
  const db = getDb();
  try {
    const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
    if (!lead) throw new Error('Lead nicht gefunden');

    const [customer] = await db.insert(crmCustomers).values({
      company: lead.company,
      email: lead.email,
      status: 'aktiv',
      location: lead.location,
      industry: lead.industry,
      websiteOld: lead.websiteOld,
      flamingoLink: lead.flamingoLink,
      contact: lead.contact,
      contactFirstName: lead.contactFirstName,
      contactLastName: lead.contactLastName,
      anrede: lead.anrede,
      responsible: lead.responsible,
      tenantId: lead.tenantId,
      leadId: lead.id,
      adminPassword: lead.adminPassword,
      packageName: data.packageName || null,
      setupPriceCents: data.setupPriceCents || 0,
      hostingMonthlyCents: data.hostingMonthlyCents || 0,
      notes: data.notes || null,
    }).returning();

    const paymentRows: CrmPaymentInsert[] = [];
    if ((data.setupPriceCents || 0) > 0) {
      paymentRows.push({
        customerId: customer.id,
        type: 'setup',
        title: `Einrichtung ${data.packageName || 'Website'}`,
        amountCents: data.setupPriceCents || 0,
        status: 'offen',
      });
    }
    if ((data.hostingMonthlyCents || 0) > 0) {
      paymentRows.push({
        customerId: customer.id,
        type: 'hosting',
        title: 'Hosting monatlich',
        amountCents: data.hostingMonthlyCents || 0,
        status: 'offen',
      });
    }
    if (paymentRows.length) await db.insert(crmCustomerPayments).values(paymentRows);
    await db.update(leads).set({ status: 'angenommen', updatedAt: new Date() }).where(eq(leads.id, leadId));

    const payments = await db.select().from(crmCustomerPayments).where(eq(crmCustomerPayments.customerId, customer.id)).orderBy(desc(crmCustomerPayments.createdAt));
    revalidateCustomers();
    return { ...customer, payments };
  } catch (error) {
    handleCustomerSchemaError(error);
  }
}

export async function addCustomerPayment(data: Omit<CrmPaymentInsert, 'id' | 'createdAt'>): Promise<CrmCustomerPayment> {
  const db = getDb();
  try {
    const [payment] = await db.insert(crmCustomerPayments).values(data).returning();
    revalidateCustomers();
    return payment;
  } catch (error) {
    handleCustomerSchemaError(error);
  }
}

export async function updateCustomerPayment(id: string, data: Partial<Omit<CrmPaymentInsert, 'id' | 'createdAt'>>): Promise<CrmCustomerPayment> {
  const db = getDb();
  const patch: Partial<CrmPaymentInsert> & { paidAt?: Date | null } = { ...data };
  if (patch.status === 'bezahlt' && !patch.paidAt) patch.paidAt = new Date();
  if (patch.status && patch.status !== 'bezahlt') patch.paidAt = null;
  try {
    const [payment] = await db.update(crmCustomerPayments).set(patch).where(eq(crmCustomerPayments.id, id)).returning();
    revalidateCustomers();
    return payment;
  } catch (error) {
    handleCustomerSchemaError(error);
  }
}

export async function deleteCustomerPayment(id: string): Promise<void> {
  const db = getDb();
  try {
    await db.delete(crmCustomerPayments).where(eq(crmCustomerPayments.id, id));
    revalidateCustomers();
  } catch (error) {
    handleCustomerSchemaError(error);
  }
}
