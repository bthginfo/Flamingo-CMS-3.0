'use server';

import { randomUUID } from 'node:crypto';
import { and, desc, eq, isNull, lte } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { billingFreeTextDocuments, billingSettings, customers, tenantAddons } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { getSession, getWritableSession } from '@/lib/session';
import { BILLING_ADDON_KEY } from '@/lib/billing-constants';
import { sha256, type BillingSellerSnapshot } from '@/lib/billing-core';
import { deleteBillingArtifact, storeBillingArtifact } from '@/lib/billing-artifacts';
import {
  EMPTY_FREE_TEXT_DOCUMENT,
  freeTextRecipientFromCustomer,
  freeTextDocumentSchema,
  layoutFreeTextHeader,
  freeTextPlainText,
  freeTextRecipientSchema,
  renderFreeTextDocumentPdf,
  type FreeTextRecipient,
} from '@/lib/billing-free-text-document';
import { runOwnedFinalization } from '@/lib/billing-free-text-finalization';

const draftSchema = z.object({
  id: z.string().uuid(),
  recipientMode: z.enum(['customer', 'custom']),
  customerId: z.string().uuid().optional().nullable(),
  recipient: freeTextRecipientSchema.optional().nullable(),
  title: z.string().trim().min(1, 'Interner Titel fehlt.').max(255),
  subject: z.string().trim().min(1, 'Betreff fehlt.').max(500),
  issueDate: z.coerce.date(),
  content: freeTextDocumentSchema,
}).superRefine((value, context) => {
  if (value.recipientMode === 'customer' && !value.customerId) context.addIssue({ code: 'custom', path: ['customerId'], message: 'Bitte einen Kunden ausw\u00e4hlen.' });
  if (value.recipientMode === 'custom' && !value.recipient) context.addIssue({ code: 'custom', path: ['recipient'], message: 'Bitte den Empf\u00e4nger vollst\u00e4ndig angeben.' });
  if (!freeTextPlainText(value.content).trim()) context.addIssue({ code: 'custom', path: ['content'], message: 'Das Schreiben darf nicht leer sein.' });
});

async function requireFreeTextTenant(writable: boolean) {
  const session = writable ? await getWritableSession() : await getSession();
  if (!session) redirect('/admin/login');
  const [addon] = await getDb().select({ active: tenantAddons.active }).from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, BILLING_ADDON_KEY))).limit(1);
  if (!addon?.active) redirect('/admin/functions');
  return session.tenantId;
}

function actionError(error: unknown) {
  if (error instanceof z.ZodError) return error.issues.map(issue => issue.message).slice(0, 3).join(' \u00b7 ');
  if (error instanceof Error && /billing_free_text_documents|relation .* does not exist/i.test(error.message)) return 'Datenbankmigration 0028_billing_free_text_documents fehlt.';
  return error instanceof Error ? error.message : 'Die Aktion konnte nicht abgeschlossen werden.';
}

function sellerSnapshot(settings: typeof billingSettings.$inferSelect): BillingSellerSnapshot {
  return {
    companyName: settings.companyName || '', legalForm: settings.legalForm || undefined, street: settings.street || '', postalCode: settings.postalCode || '',
    city: settings.city || '', countryCode: settings.countryCode, email: settings.email || '', phone: settings.phone || undefined, website: settings.website || undefined,
    taxNumber: settings.taxNumber || undefined, vatId: settings.vatId || undefined, registerCourt: settings.registerCourt || undefined,
    registerNumber: settings.registerNumber || undefined, managingDirector: settings.managingDirector || undefined, logoUrl: settings.logoUrl || undefined,
    logoDisplay: settings.logoDisplay as BillingSellerSnapshot['logoDisplay'], bankName: settings.bankName || undefined,
    accountHolder: settings.accountHolder || undefined, iban: settings.iban || undefined, bic: settings.bic || undefined,
    footer: settings.defaultFooter || undefined, senderName: settings.senderName || undefined, smallBusiness: settings.smallBusiness,
    smallBusinessNotice: settings.smallBusinessNotice,
  };
}

export async function listFreeTextDocumentsAction() {
  const tenantId = await requireFreeTextTenant(false);
  return getDb().select({
    id: billingFreeTextDocuments.id, title: billingFreeTextDocuments.title, subject: billingFreeTextDocuments.subject,
    customerId: billingFreeTextDocuments.customerId,
    status: billingFreeTextDocuments.status, recipientMode: billingFreeTextDocuments.recipientMode,
    recipientDraft: billingFreeTextDocuments.recipientDraft, recipientSnapshot: billingFreeTextDocuments.recipientSnapshot,
    issueDate: billingFreeTextDocuments.issueDate, finalizedAt: billingFreeTextDocuments.finalizedAt,
    updatedAt: billingFreeTextDocuments.updatedAt, pageCount: billingFreeTextDocuments.pageCount,
  }).from(billingFreeTextDocuments).where(eq(billingFreeTextDocuments.tenantId, tenantId)).orderBy(desc(billingFreeTextDocuments.updatedAt)).limit(500);
}

export async function createFreeTextDocumentAction() {
  const tenantId = await requireFreeTextTenant(true);
  try {
    const [created] = await getDb().insert(billingFreeTextDocuments).values({ tenantId, content: EMPTY_FREE_TEXT_DOCUMENT }).returning({ id: billingFreeTextDocuments.id });
    revalidatePath('/admin/billing');
    return { success: true as const, id: created.id };
  } catch (error) { return { success: false as const, error: actionError(error) }; }
}

export async function getFreeTextDocumentAction(id: string) {
  const tenantId = await requireFreeTextTenant(false);
  const [document] = await getDb().select({
    id: billingFreeTextDocuments.id, customerId: billingFreeTextDocuments.customerId, status: billingFreeTextDocuments.status,
    recipientMode: billingFreeTextDocuments.recipientMode, recipientDraft: billingFreeTextDocuments.recipientDraft,
    recipientSnapshot: billingFreeTextDocuments.recipientSnapshot, sellerSnapshot: billingFreeTextDocuments.sellerSnapshot, title: billingFreeTextDocuments.title,
    subject: billingFreeTextDocuments.subject, issueDate: billingFreeTextDocuments.issueDate, content: billingFreeTextDocuments.content,
    finalizedAt: billingFreeTextDocuments.finalizedAt, pageCount: billingFreeTextDocuments.pageCount,
  }).from(billingFreeTextDocuments).where(and(eq(billingFreeTextDocuments.id, z.string().uuid().parse(id)), eq(billingFreeTextDocuments.tenantId, tenantId))).limit(1);
  if (!document) throw new Error('Schreiben nicht gefunden.');
  return document;
}

export async function saveFreeTextDocumentAction(input: unknown) {
  const tenantId = await requireFreeTextTenant(true);
  try {
    const value = draftSchema.parse(input);
    let previewRecipient: FreeTextRecipient;
    if (value.recipientMode === 'customer') {
      const [customer] = await getDb().select().from(customers).where(and(eq(customers.id, value.customerId!), eq(customers.tenantId, tenantId), isNull(customers.archivedAt))).limit(1);
      if (!customer) throw new Error('Der ausgew\u00e4hlte Kunde wurde nicht gefunden.');
      previewRecipient = freeTextRecipientFromCustomer(customer);
    } else previewRecipient = freeTextRecipientSchema.parse(value.recipient);
    if (!layoutFreeTextHeader(previewRecipient, value.subject, value.title).fits) throw new Error('Empf\u00e4nger oder Betreff sind zu lang f\u00fcr den Briefkopf. Bitte k\u00fcrzen Sie die Angaben.');
    const [saved] = await getDb().update(billingFreeTextDocuments).set({
      customerId: value.recipientMode === 'customer' ? value.customerId : null,
      recipientMode: value.recipientMode, recipientDraft: value.recipientMode === 'custom' ? value.recipient : null,
      title: value.title, subject: value.subject, issueDate: value.issueDate, content: value.content, updatedAt: new Date(),
    }).where(and(eq(billingFreeTextDocuments.id, value.id), eq(billingFreeTextDocuments.tenantId, tenantId), eq(billingFreeTextDocuments.status, 'draft'))).returning({ id: billingFreeTextDocuments.id });
    if (!saved) throw new Error('Nur Entw\u00fcrfe k\u00f6nnen bearbeitet werden.');
    revalidatePath('/admin/billing');
    return { success: true as const };
  } catch (error) { return { success: false as const, error: actionError(error) }; }
}

export async function finalizeFreeTextDocumentAction(input: unknown) {
  const tenantId = await requireFreeTextTenant(true);
  try {
    const value = draftSchema.parse(input);
    const db = getDb();
    const [settings] = await db.select().from(billingSettings).where(eq(billingSettings.tenantId, tenantId)).limit(1);
    if (!settings?.companyName || !settings.street || !settings.postalCode || !settings.city || !settings.email) throw new Error('Bitte zuerst die Unternehmensdaten in den Rechnungseinstellungen vervollst\u00e4ndigen.');
    let recipient: FreeTextRecipient;
    if (value.recipientMode === 'customer') {
      const [customer] = await db.select().from(customers).where(and(eq(customers.id, value.customerId!), eq(customers.tenantId, tenantId), isNull(customers.archivedAt))).limit(1);
      if (!customer) throw new Error('Der ausgew\u00e4hlte Kunde wurde nicht gefunden.');
      recipient = freeTextRecipientFromCustomer(customer);
    } else recipient = freeTextRecipientSchema.parse(value.recipient);
    const seller = sellerSnapshot(settings);
    if (!layoutFreeTextHeader(recipient, value.subject, value.title).fits) throw new Error('Empf\u00e4nger oder Betreff sind zu lang f\u00fcr den Briefkopf. Bitte k\u00fcrzen Sie die Angaben.');
    const claimToken = randomUUID();
    const claimValues = {
      customerId: value.recipientMode === 'customer' ? value.customerId : null, recipientMode: value.recipientMode,
      recipientDraft: value.recipientMode === 'custom' ? recipient : null, title: value.title, subject: value.subject,
      issueDate: value.issueDate, content: value.content, status: 'finalizing', finalizationToken: claimToken, updatedAt: new Date(),
    } as const;
    const claimDraft = () => db.update(billingFreeTextDocuments).set({ ...claimValues, updatedAt: new Date() })
      .where(and(eq(billingFreeTextDocuments.id, value.id), eq(billingFreeTextDocuments.tenantId, tenantId), eq(billingFreeTextDocuments.status, 'draft'))).returning({ id: billingFreeTextDocuments.id });
    let [claim] = await claimDraft();
    if (!claim) {
      const [current] = await db.select({ status: billingFreeTextDocuments.status, pageCount: billingFreeTextDocuments.pageCount, updatedAt: billingFreeTextDocuments.updatedAt, finalizationToken: billingFreeTextDocuments.finalizationToken })
        .from(billingFreeTextDocuments).where(and(eq(billingFreeTextDocuments.id, value.id), eq(billingFreeTextDocuments.tenantId, tenantId))).limit(1);
      if (current?.status === 'finalized') return { success: true as const, pageCount: current.pageCount || 1 };
      if (current?.status === 'finalizing') {
        const staleBefore = new Date(Date.now() - 10 * 60_000);
        const recovery = current.finalizationToken ? await db.update(billingFreeTextDocuments).set({ ...claimValues, updatedAt: new Date() })
          .where(and(eq(billingFreeTextDocuments.id, value.id), eq(billingFreeTextDocuments.tenantId, tenantId), eq(billingFreeTextDocuments.status, 'finalizing'), eq(billingFreeTextDocuments.finalizationToken, current.finalizationToken), lte(billingFreeTextDocuments.updatedAt, staleBefore)))
          .returning({ id: billingFreeTextDocuments.id })
          : [];
        const [recovered] = recovery;
        if (recovered) claim = recovered;
        if (!claim) throw new Error('Das Schreiben wird bereits festgeschrieben. Bitte warten Sie kurz.');
      }
      if (!claim && !current) throw new Error('Schreiben nicht gefunden.');
      if (!claim) throw new Error('Das Schreiben kann in seinem aktuellen Zustand nicht festgeschrieben werden.');
    }
    const result = await runOwnedFinalization({
      token: claimToken,
      build: async () => {
        const pdf = await renderFreeTextDocumentPdf({ title: value.title, subject: value.subject, issueDate: value.issueDate, seller, recipient, content: value.content });
        const pdfSha256 = sha256(pdf.bytes);
        const documentSha256 = sha256(JSON.stringify({ title: value.title, subject: value.subject, issueDate: value.issueDate.toISOString(), seller, recipient, content: value.content, pdfSha256 }));
        const blobUrl = await storeBillingArtifact({ tenantId, documentId: value.id, documentNumber: value.title, kind: 'pdf', content: pdf.bytes, immutableSha256: pdfSha256 });
        return { pdf, pdfSha256, documentSha256, blobUrl };
      },
      commit: async (token, artifact) => {
        const finalizedAt = new Date();
        const [finalized] = await db.update(billingFreeTextDocuments).set({
          customerId: value.recipientMode === 'customer' ? value.customerId : null, recipientMode: value.recipientMode,
          recipientDraft: value.recipientMode === 'custom' ? recipient : null, title: value.title, subject: value.subject,
          issueDate: value.issueDate, content: value.content, sellerSnapshot: seller, recipientSnapshot: recipient,
          pdfBase64: artifact.blobUrl ? null : Buffer.from(artifact.pdf.bytes).toString('base64'), pdfBlobUrl: artifact.blobUrl,
          pdfSha256: artifact.pdfSha256, documentSha256: artifact.documentSha256, pageCount: artifact.pdf.pageCount,
          status: 'finalized', finalizedAt, updatedAt: finalizedAt,
        }).where(and(eq(billingFreeTextDocuments.id, value.id), eq(billingFreeTextDocuments.tenantId, tenantId), eq(billingFreeTextDocuments.status, 'finalizing'), eq(billingFreeTextDocuments.finalizationToken, token))).returning({ pageCount: billingFreeTextDocuments.pageCount });
        return finalized ? { pageCount: finalized.pageCount || 1 } : null;
      },
      release: async token => {
        await db.update(billingFreeTextDocuments).set({ status: 'draft', finalizationToken: null, updatedAt: new Date() })
          .where(and(eq(billingFreeTextDocuments.id, value.id), eq(billingFreeTextDocuments.tenantId, tenantId), eq(billingFreeTextDocuments.status, 'finalizing'), eq(billingFreeTextDocuments.finalizationToken, token)));
      },
      cleanup: async artifact => {
        if (!artifact.blobUrl) return;
        const [current] = await db.select({ pdfBlobUrl: billingFreeTextDocuments.pdfBlobUrl }).from(billingFreeTextDocuments)
          .where(and(eq(billingFreeTextDocuments.id, value.id), eq(billingFreeTextDocuments.tenantId, tenantId))).limit(1);
        if (current?.pdfBlobUrl !== artifact.blobUrl) await deleteBillingArtifact(artifact.blobUrl);
      },
    });
    revalidatePath('/admin/billing');
    return { success: true as const, pageCount: result.pageCount };
  } catch (error) {
    return { success: false as const, error: actionError(error) };
  }
}

export async function deleteFreeTextDocumentDraftAction(id: string) {
  const tenantId = await requireFreeTextTenant(true);
  try {
    await getDb().delete(billingFreeTextDocuments).where(and(eq(billingFreeTextDocuments.id, z.string().uuid().parse(id)), eq(billingFreeTextDocuments.tenantId, tenantId), eq(billingFreeTextDocuments.status, 'draft')));
    revalidatePath('/admin/billing');
    return { success: true as const };
  } catch (error) { return { success: false as const, error: actionError(error) }; }
}
