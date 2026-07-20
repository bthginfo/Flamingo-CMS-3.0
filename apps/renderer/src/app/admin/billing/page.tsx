import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AlertTriangle, ArrowRight, FileCheck2, ReceiptText, ShieldCheck, UsersRound } from 'lucide-react';
import { and, eq } from 'drizzle-orm';
import { tenantAddons } from '@flamingo/db';
import { BILLING_ADDON_KEY } from '@/lib/billing-constants';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { getBillingWorkspaceData } from './actions';
import { BillingWorkspace } from './billing-workspace';

export const metadata = { title: 'Rechnungen & Kunden | Flamingo CMS' };

export default async function BillingPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  const [addon] = await getDb().select({ active: tenantAddons.active }).from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, BILLING_ADDON_KEY))).limit(1);
  if (!addon?.active) return <BillingPaywall />;
  const data = await getBillingWorkspaceData().catch((error: unknown) => {
    console.error('[Billing Workspace Load Error]', safeBillingErrorMessage(error), { tenantId: session.tenantId });
    return null;
  });
  if (!data) return <BillingSetupError />;
  return <BillingWorkspace initialData={data} />;
}

function safeBillingErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.replace(/postgres(?:ql)?:\/\/[^\s)]+/gi, '[redacted-db-url]').replace(/password=[^\s;)]+/gi, 'password=[redacted]');
}

function BillingSetupError() {
  return <main className="mx-auto max-w-4xl py-8 sm:py-14">
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm sm:p-8">
      <div className="flex gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-amber-700 ring-1 ring-amber-200"><AlertTriangle className="size-6" /></div>
        <section>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-amber-700">Einrichtung unvollständig</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">Rechnungen & Kunden kann für diesen Tenant noch nicht geladen werden.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">Das Modul ist freigeschaltet, aber die Datenbank dieses Standalone-Tenants ist noch nicht vollständig auf dem Billing-Schema. Bitte die Standalone-DB-Migration für diesen Tenant ausführen und die Seite danach neu laden.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Link href="/admin/functions" className="admin-btn-secondary min-h-11">Zurück zu Funktionen</Link><a href="mailto:hello@flamingomedia.online?subject=Billing%20Migration%20pruefen" className="admin-btn-primary min-h-11">Support kontaktieren</a></div>
        </section>
      </div>
    </div>
  </main>;
}

function BillingPaywall() {
  const requestHref = 'mailto:hello@flamingomedia.online?subject=Rechnungen%20%26%20Kundenverwaltung%20freischalten';
  return <main className="mx-auto max-w-5xl py-8 sm:py-14">
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.15fr_.85fr] lg:p-12">
        <section>
          <div className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100"><ReceiptText className="size-6" /></div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-blue-700">Premium-Modul</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">Rechnungen und Kunden an einem Ort.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">Kundenstammdaten, wiederverwendbare Leistungen, PDF und strukturierte XRechnung – mit einem verständlichen Ablauf vom Entwurf bis zum Storno.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href={requestHref} className="admin-btn-primary min-h-12">Freischaltung anfragen <ArrowRight className="size-4" /></a><Link href="/admin/functions" className="admin-btn-secondary min-h-12">Alle Funktionen</Link></div>
        </section>
        <aside className="rounded-2xl bg-zinc-950 p-6 text-white sm:p-7">
          <p className="text-sm font-semibold text-blue-300">499 € Einrichtung</p><p className="mt-1 text-3xl font-bold">29 € <span className="text-sm font-medium text-zinc-400">/ Monat</span></p>
          <ul className="mt-7 space-y-4 text-sm leading-6 text-zinc-300">
            <li className="flex gap-3"><UsersRound className="mt-0.5 size-5 shrink-0 text-blue-300" /> Flexible Kundenstammdaten und eigene Felder</li>
            <li className="flex gap-3"><FileCheck2 className="mt-0.5 size-5 shrink-0 text-blue-300" /> PDF, XRechnung, Storno und Belegvorschau</li>
            <li className="flex gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-300" /> Nachvollziehbare Festschreibung und Versandhistorie</li>
          </ul>
        </aside>
      </div>
    </div>
  </main>;
}
