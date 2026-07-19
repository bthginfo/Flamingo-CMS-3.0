import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { billingDocuments, billingPortalLinks } from '@flamingo/db';
import { Download, ExternalLink, FileCheck2, ShieldCheck } from 'lucide-react';
import { sha256, type BillingCustomerSnapshot, type BillingSellerSnapshot } from '@/lib/billing-core';
import { getDb } from '@/lib/db';

export const metadata: Metadata = { title: 'Sicherer Dokumentzugang', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

function money(cents: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}
function date(value: Date | null) {
  return value ? new Intl.DateTimeFormat('de-DE').format(value) : '—';
}

export default async function BillingSharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) notFound();
  const db = getDb();
  const [row] = await db.select({ link: billingPortalLinks, document: billingDocuments })
    .from(billingPortalLinks)
    .innerJoin(billingDocuments, eq(billingDocuments.id, billingPortalLinks.documentId))
    .where(and(eq(billingPortalLinks.tokenHash, sha256(token)), isNull(billingPortalLinks.revokedAt), gt(billingPortalLinks.expiresAt, new Date())))
    .limit(1);
  if (!row || row.document.status === 'draft') notFound();
  const seller = (row.document.sellerSnapshot || {}) as Partial<BillingSellerSnapshot>;
  const customer = (row.document.customerSnapshot || {}) as Partial<BillingCustomerSnapshot>;
  const payment = (row.document.paymentSnapshot || {}) as { paymentLinkUrl?: string };
  const outstanding = Math.max(0, row.document.totalGrossCents - row.document.amountPaidCents);

  return <main className="min-h-screen bg-zinc-100 px-4 py-10 text-zinc-950 sm:py-16">
    <article className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/60">
      <header className="border-b border-zinc-100 px-6 py-7 sm:px-9">
        <div className="flex items-start justify-between gap-5">
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-blue-700">Sicherer Dokumentzugang</p><h1 className="mt-2 text-2xl font-bold tracking-tight">{row.document.documentNumber}</h1></div>
          <div className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><ShieldCheck className="size-5" /></div>
        </div>
        <p className="mt-4 text-sm leading-6 text-zinc-500">Bereitgestellt von {seller.companyName || 'Ihrem Anbieter'} für {customer.displayName || 'Sie'}.</p>
      </header>
      <section className="grid gap-px bg-zinc-100 sm:grid-cols-3">
        <div className="bg-white p-6"><p className="text-xs font-semibold text-zinc-400">Ausgestellt</p><p className="mt-2 font-semibold">{date(row.document.issueDate)}</p></div>
        <div className="bg-white p-6"><p className="text-xs font-semibold text-zinc-400">Gesamt</p><p className="mt-2 font-semibold">{money(row.document.totalGrossCents)}</p></div>
        <div className="bg-white p-6"><p className="text-xs font-semibold text-zinc-400">Noch offen</p><p className={`mt-2 font-semibold ${outstanding ? 'text-amber-700' : 'text-emerald-700'}`}>{money(outstanding)}</p></div>
      </section>
      <section className="space-y-3 px-6 py-7 sm:px-9">
        <a href={`/billing/share/${token}/pdf`} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"><Download className="size-4" /> PDF herunterladen</a>
        {payment.paymentLinkUrl && outstanding > 0 ? <a href={payment.paymentLinkUrl} rel="nofollow noreferrer" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 text-sm font-semibold text-blue-800 transition hover:bg-blue-100">Online bezahlen <ExternalLink className="size-4" /></a> : null}
      </section>
      <footer className="flex items-start gap-3 border-t border-zinc-100 bg-zinc-50 px-6 py-5 text-xs leading-5 text-zinc-500 sm:px-9"><FileCheck2 className="mt-0.5 size-4 shrink-0 text-zinc-400" /> Dieser Link ist zeitlich begrenzt. Teilen Sie ihn nur mit berechtigten Personen.</footer>
    </article>
  </main>;
}
