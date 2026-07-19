'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Banknote, BookOpen, Building2,
  Check, CheckCircle2, ChevronRight, CircleDollarSign, Download, Eye, FileCheck2,
  FilePlus2, FileText, Landmark, ListChecks, Mail, PackagePlus,
  Pencil, Plus, ReceiptText, Search, Send, Settings2, ShieldCheck, Trash2, UserRound,
  UsersRound, X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, useTransition, type FormEvent, type ReactNode } from 'react';
import { toast } from 'sonner';
import { ImageUploadField } from '@/components/image-upload-field';
import {
  archiveBillingCustomerAction, archiveBillingServiceAction, cancelBillingDocumentAction,
  createBillingDraftAction, deleteBillingDraftAction, deleteCustomerCustomFieldAction,
  finalizeBillingDocumentAction, getBillingDocumentAction, getBillingWorkspaceData,
  markBillingDocumentPaidAction, saveBillingCustomerAction, saveBillingDraftAction,
  saveBillingServiceAction, saveBillingSettingsAction, saveCustomerCustomFieldAction,
  sendBillingDocumentAction,
} from './actions';

type WorkspaceData = Awaited<ReturnType<typeof getBillingWorkspaceData>>;
type Customer = WorkspaceData['customers'][number];
type Service = WorkspaceData['services'][number];
type DocumentRow = WorkspaceData['documents'][number];
type CustomField = WorkspaceData['customFields'][number];
type DocumentDetail = Awaited<ReturnType<typeof getBillingDocumentAction>>;
type View = 'overview' | 'invoices' | 'customers' | 'services' | 'settings';

const VIEWS: Array<{ id: View; label: string; icon: typeof FileText }> = [
  { id: 'overview', label: 'Überblick', icon: ListChecks },
  { id: 'invoices', label: 'Rechnungen', icon: ReceiptText },
  { id: 'customers', label: 'Kunden', icon: UsersRound },
  { id: 'services', label: 'Leistungen', icon: BookOpen },
  { id: 'settings', label: 'Einstellungen', icon: Settings2 },
];

const STATUS: Record<string, { label: string; className: string }> = {
  draft: { label: 'Entwurf', className: 'bg-zinc-100 text-zinc-700 ring-zinc-200' },
  finalized: { label: 'Festgeschrieben', className: 'bg-blue-50 text-blue-700 ring-blue-200' },
  sent: { label: 'Versendet', className: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  paid: { label: 'Bezahlt', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  cancelled: { label: 'Storniert', className: 'bg-rose-50 text-rose-700 ring-rose-200' },
};

const FIELD_TYPES = [
  ['text', 'Kurzer Text'], ['textarea', 'Längerer Text'], ['number', 'Zahl'], ['date', 'Datum'],
  ['email', 'E-Mail'], ['phone', 'Telefon'], ['boolean', 'Ja/Nein'], ['select', 'Auswahl'],
] as const;

const NUMBER_PRESETS = [
  { value: '{PREFIX}-{YYYY}-{NNNN}', label: 'Präfix · Jahr · Nummer', example: 'RE-2026-0042' },
  { value: '{YYYY}/{MM}/{NNNN}', label: 'Jahr / Monat / Nummer', example: '2026/07/0042' },
  { value: '{PREFIX}-{NNNN}', label: 'Präfix · Nummer', example: 'RE-0042' },
  { value: '{YY}{MM}-{NNNN}', label: 'Kurzjahr + Monat · Nummer', example: '2607-0042' },
] as const;

function money(cents: number | null | undefined) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format((cents || 0) / 100);
}

function dateValue(value: Date | string | null | undefined) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

function shortDate(value: Date | string | null | undefined) {
  if (!value) return '–';
  return new Intl.DateTimeFormat('de-DE').format(new Date(value));
}

function isOverdue(value: Date | string | null | undefined) {
  if (!value) return false;
  const dueDate = new Date(value);
  if (Number.isNaN(dueDate.getTime())) return false;
  const endOfDueDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate() + 1);
  return new Date() >= endOfDueDay;
}

function errorMessage(error: unknown) {
  if (!(error instanceof Error)) return 'Die Aktion konnte nicht abgeschlossen werden.';
  const zodMatch = error.message.match(/"message":\s*"([^"]+)"/);
  return zodMatch?.[1] || error.message || 'Die Aktion konnte nicht abgeschlossen werden.';
}

function customerName(customer: Customer | undefined) {
  return customer?.companyName || customer?.name || 'Unbekannter Kunde';
}

function documentLabel(document: DocumentRow) {
  if (document.documentType === 'cancellation') return document.documentNumber || 'Storno-Entwurf';
  return document.documentNumber || 'Rechnungsentwurf';
}

export function BillingWorkspace({ initialData }: { initialData: WorkspaceData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [customerDialog, setCustomerDialog] = useState<Customer | 'new' | null>(null);
  const [serviceDialog, setServiceDialog] = useState<Service | 'new' | null>(null);
  const viewParam = searchParams.get('view');
  const view: View = VIEWS.some(item => item.id === viewParam) ? viewParam as View : 'overview';
  const documentId = searchParams.get('document');

  useEffect(() => setData(initialData), [initialData]);

  function navigate(next: View, document?: string) {
    const params = new URLSearchParams();
    if (next !== 'overview') params.set('view', next);
    if (document) params.set('document', document);
    router.push(`/admin/billing${params.size ? `?${params}` : ''}`);
  }

  function refresh(message?: string) {
    startTransition(() => router.refresh());
    if (message) toast.success(message);
  }

  async function createDraft(customerId?: string) {
    try {
      const result = await createBillingDraftAction(customerId);
      navigate('invoices', result.id);
      toast.success('Rechnungsentwurf angelegt');
    } catch (error) {
      toast.error('Entwurf konnte nicht angelegt werden', { description: errorMessage(error) });
    }
  }

  return (
    <div className="mx-auto max-w-[1480px] pb-16">
      <header className="mb-6 flex flex-col gap-5 border-b border-zinc-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
            <ReceiptText className="size-4 text-blue-600" /> Rechnungen & Kunden
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">Finanzen, verständlich geführt.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Kunden pflegen, Leistungen wiederverwenden und Rechnungen sicher festschreiben – ohne Buchhaltungsjargon.</p>
        </div>
        <button type="button" onClick={() => void createDraft()} disabled={isPending || data.customers.length === 0} className="admin-btn-primary min-h-11 shrink-0 disabled:cursor-not-allowed disabled:opacity-50">
          <FilePlus2 className="size-4" /> Neue Rechnung
        </button>
      </header>

      <nav aria-label="Bereiche Rechnungen und Kunden" className="mb-7 overflow-x-auto border-b border-zinc-200">
        <div className="flex min-w-max gap-1">
          {VIEWS.map(item => {
            const active = view === item.id && !documentId;
            return <button key={item.id} type="button" onClick={() => navigate(item.id)} className={`relative inline-flex min-h-12 items-center gap-2 px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset ${active ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-800'}`}>
              <item.icon className={`size-4 ${active ? 'text-blue-600' : ''}`} /> {item.label}
              {active ? <span className="absolute inset-x-2 bottom-0 h-0.5 bg-blue-600" /> : null}
            </button>;
          })}
        </div>
      </nav>

      {documentId ? (
        <InvoiceWorkspace documentId={documentId} data={data} onBack={() => navigate('invoices')} onOpenDocument={id => navigate('invoices', id)} onRefresh={refresh} />
      ) : view === 'overview' ? (
        <Overview data={data} onCreateDraft={createDraft} onNavigate={navigate} />
      ) : view === 'invoices' ? (
        <InvoicesView data={data} onOpen={id => navigate('invoices', id)} onCreateDraft={createDraft} />
      ) : view === 'customers' ? (
        <CustomersView data={data} onEdit={setCustomerDialog} onCreateInvoice={createDraft} />
      ) : view === 'services' ? (
        <ServicesView services={data.services} onEdit={setServiceDialog} />
      ) : (
        <SettingsView data={data} onSaved={refresh} />
      )}

      <CustomerDialog open={customerDialog} customFields={data.customFields} onClose={() => setCustomerDialog(null)} onSaved={() => { setCustomerDialog(null); refresh('Kundendaten gespeichert'); }} />
      <ServiceDialog open={serviceDialog} onClose={() => setServiceDialog(null)} onSaved={() => { setServiceDialog(null); refresh('Leistung gespeichert'); }} />
      {view === 'customers' && !documentId ? (
        <button type="button" onClick={() => setCustomerDialog('new')} className="fixed bottom-6 right-6 z-20 grid size-14 place-items-center rounded-2xl bg-zinc-950 text-white shadow-xl transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 lg:hidden" aria-label="Kunden anlegen"><Plus /></button>
      ) : null}
    </div>
  );
}

function Overview({ data, onCreateDraft, onNavigate }: { data: WorkspaceData; onCreateDraft: (customerId?: string) => Promise<void>; onNavigate: (view: View, document?: string) => void }) {
  const settings = data.settings;
  const readiness = [
    { label: 'Firmendaten', ready: Boolean(settings.companyName && settings.street && settings.postalCode && settings.city && settings.email && (settings.taxNumber || settings.vatId)), view: 'settings' as View },
    { label: 'Nummernkreis', ready: Boolean(settings.invoiceNumberFormat && settings.invoicePrefix), view: 'settings' as View },
    { label: 'Bankverbindung', ready: Boolean(settings.iban && settings.accountHolder), view: 'settings' as View },
    { label: 'Erster Kunde', ready: data.customers.length > 0, view: 'customers' as View },
  ];
  const openDocuments = data.documents.filter(item => !['draft', 'paid', 'cancelled'].includes(item.status));
  const overdue = openDocuments.filter(item => isOverdue(item.dueDate));
  const openAmount = openDocuments.reduce((sum, item) => sum + item.totalGrossCents, 0);
  const customerById = new Map(data.customers.map(customer => [customer.id, customer]));

  return <div className="space-y-8">
    <section aria-labelledby="readiness-title" className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="flex flex-col gap-2 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 id="readiness-title" className="font-semibold text-zinc-950">Bereit für die erste Rechnung?</h2><p className="mt-1 text-xs text-zinc-500">Diese vier Grundlagen verhindern Rückfragen beim Festschreiben.</p></div>
        <span className="text-xs font-semibold text-zinc-500">{readiness.filter(item => item.ready).length} von 4 erledigt</span>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4">
        {readiness.map((item, index) => <button key={item.label} type="button" onClick={() => onNavigate(item.view)} className={`group flex min-h-20 items-center gap-3 px-5 text-left transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset ${index ? 'border-t border-zinc-100 sm:border-l sm:border-t-0' : ''} ${index === 2 ? 'sm:border-t xl:border-t-0' : ''}`}>
          <span className={`grid size-8 shrink-0 place-items-center rounded-full ${item.ready ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{item.ready ? <Check className="size-4" /> : <span className="text-xs font-bold">{index + 1}</span>}</span>
          <span><span className="block text-sm font-semibold text-zinc-800">{item.label}</span><span className={`text-xs ${item.ready ? 'text-emerald-700' : 'text-amber-700'}`}>{item.ready ? 'Erledigt' : 'Noch einrichten'}</span></span>
          <ChevronRight className="ml-auto size-4 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-500" />
        </button>)}
      </div>
    </section>

    <section className="grid gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-3" aria-label="Finanzüberblick">
      <Metric label="Noch offen" value={money(openAmount)} detail={`${openDocuments.length} ${openDocuments.length === 1 ? 'Rechnung' : 'Rechnungen'}`} icon={CircleDollarSign} />
      <Metric label="Überfällig" value={money(overdue.reduce((sum, item) => sum + item.totalGrossCents, 0))} detail={overdue.length ? `${overdue.length} brauchen Aufmerksamkeit` : 'Alles im Zeitplan'} icon={AlertTriangle} tone={overdue.length ? 'amber' : 'green'} />
      <Metric label="Entwürfe" value={String(data.documents.filter(item => item.status === 'draft').length)} detail="Noch nicht festgeschrieben" icon={Pencil} />
    </section>

    <section className="grid gap-7 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,.55fr)]">
      <div>
        <div className="mb-3 flex items-center justify-between"><div><h2 className="font-semibold text-zinc-950">Zuletzt bearbeitet</h2><p className="mt-1 text-xs text-zinc-500">Rechnungen und Entwürfe auf einen Blick.</p></div><button onClick={() => onNavigate('invoices')} className="text-sm font-semibold text-blue-700 hover:text-blue-900">Alle anzeigen</button></div>
        <DocumentTable documents={data.documents.slice(0, 6)} customerById={customerById} onOpen={id => onNavigate('invoices', id)} />
      </div>
      <aside className="rounded-2xl bg-zinc-950 p-6 text-white shadow-sm">
        <div className="grid size-11 place-items-center rounded-xl bg-white/10"><FilePlus2 className="size-5 text-blue-300" /></div>
        <h2 className="mt-6 text-xl font-semibold tracking-tight">Nächster sinnvoller Schritt</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-300">{data.customers.length ? 'Erstellen Sie einen Entwurf. Nummer und Inhalt werden erst beim Festschreiben unveränderbar.' : 'Legen Sie zuerst einen Kunden an. Danach können Sie sofort eine Rechnung schreiben.'}</p>
        <button type="button" onClick={() => data.customers.length ? void onCreateDraft() : onNavigate('customers')} className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/40">
          {data.customers.length ? 'Rechnung beginnen' : 'Ersten Kunden anlegen'} <ArrowRight className="size-4" />
        </button>
      </aside>
    </section>
  </div>;
}

function Metric({ label, value, detail, icon: Icon, tone = 'blue' }: { label: string; value: string; detail: string; icon: typeof FileText; tone?: 'blue' | 'amber' | 'green' }) {
  const iconClass = tone === 'amber' ? 'bg-amber-50 text-amber-700' : tone === 'green' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700';
  return <article className="flex items-start gap-4 bg-white p-5"><div className={`grid size-10 shrink-0 place-items-center rounded-xl ${iconClass}`}><Icon className="size-5" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight text-zinc-950">{value}</p><p className="mt-1 text-xs text-zinc-500">{detail}</p></div></article>;
}

function InvoicesView({ data, onOpen, onCreateDraft }: { data: WorkspaceData; onOpen: (id: string) => void; onCreateDraft: () => Promise<void> }) {
  const [query, setQuery] = useState('');
  const customerById = new Map(data.customers.map(customer => [customer.id, customer]));
  const filtered = data.documents.filter(document => {
    const haystack = `${documentLabel(document)} ${customerName(document.customerId ? customerById.get(document.customerId) : undefined)} ${STATUS[document.status]?.label || document.status}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });
  return <section>
    <ViewHeader eyebrow="Dokumente" title="Rechnungen" description="Entwürfe bearbeiten, festgeschriebene Belege versenden und Zahlungseingänge dokumentieren." action={<button onClick={() => void onCreateDraft()} disabled={!data.customers.length} className="admin-btn-primary min-h-11 disabled:opacity-50"><Plus className="size-4" /> Neue Rechnung</button>} />
    <SearchField value={query} onChange={setQuery} placeholder="Nummer, Kunde oder Status suchen …" />
    <div className="mt-4"><DocumentTable documents={filtered} customerById={customerById} onOpen={onOpen} /></div>
  </section>;
}

function DocumentTable({ documents, customerById, onOpen }: { documents: DocumentRow[]; customerById: Map<string, Customer>; onOpen: (id: string) => void }) {
  if (!documents.length) return <EmptyState icon={ReceiptText} title="Noch keine Rechnungen" text="Der erste Entwurf ist in wenigen Schritten erstellt." />;
  return <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
    <div className="hidden grid-cols-[1.1fr_1.2fr_.8fr_.7fr_40px] gap-4 border-b border-zinc-100 bg-zinc-50/70 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-400 md:grid"><span>Dokument</span><span>Kunde</span><span>Datum</span><span className="text-right">Betrag</span><span /></div>
    {documents.map((document, index) => {
      const customer = document.customerId ? customerById.get(document.customerId) : undefined;
      const overdue = !['draft', 'paid', 'cancelled'].includes(document.status) && isOverdue(document.dueDate);
      return <button key={document.id} type="button" onClick={() => onOpen(document.id)} className={`group grid min-h-[72px] w-full gap-2 px-5 py-4 text-left transition hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset md:grid-cols-[1.1fr_1.2fr_.8fr_.7fr_40px] md:items-center md:gap-4 ${index ? 'border-t border-zinc-100' : ''}`}>
        <span><span className="block font-semibold text-zinc-900">{documentLabel(document)}</span><StatusPill status={overdue ? 'overdue' : document.status} /></span>
        <span className="text-sm text-zinc-600">{customerName(customer)}</span>
        <span className="text-sm text-zinc-500">{shortDate(document.issueDate || document.createdAt)}</span>
        <span className="font-semibold text-zinc-900 md:text-right">{money(document.totalGrossCents)}</span>
        <span className="hidden place-items-center text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600 md:grid"><ChevronRight className="size-4" /></span>
      </button>;
    })}
  </div>;
}

function CustomersView({ data, onEdit, onCreateInvoice }: { data: WorkspaceData; onEdit: (customer: Customer | 'new') => void; onCreateInvoice: (customerId?: string) => Promise<void> }) {
  const [query, setQuery] = useState('');
  const filtered = data.customers.filter(customer => `${customer.name} ${customer.companyName || ''} ${customer.email} ${customer.customerNumber || ''}`.toLowerCase().includes(query.toLowerCase()));
  return <section>
    <ViewHeader eyebrow="Stammdaten" title="Kunden" description="Kontaktdaten, Rechnungsanschriften und eigene Zusatzfelder zentral pflegen." action={<button onClick={() => onEdit('new')} className="admin-btn-primary min-h-11"><Plus className="size-4" /> Kunde anlegen</button>} />
    <SearchField value={query} onChange={setQuery} placeholder="Name, E-Mail oder Kundennummer suchen …" />
    {filtered.length ? <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      {filtered.map((customer, index) => <article key={customer.id} className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center ${index ? 'border-t border-zinc-100' : ''}`}>
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-zinc-100 text-zinc-600">{customer.customerType === 'company' ? <Building2 className="size-5" /> : <UserRound className="size-5" />}</div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-semibold text-zinc-950">{customerName(customer)}</h3>{customer.customerNumber ? <span className="font-mono text-[11px] text-zinc-400">{customer.customerNumber}</span> : null}</div><p className="mt-1 truncate text-sm text-zinc-500">{customer.email}{customer.phone ? ` · ${customer.phone}` : ''}</p></div>
        <div className="flex gap-2"><button onClick={() => void onCreateInvoice(customer.id)} className="admin-btn-secondary min-h-11"><FilePlus2 className="size-4" /> Rechnung</button><button onClick={() => onEdit(customer)} className="grid size-11 place-items-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50" aria-label={`${customerName(customer)} bearbeiten`}><Pencil className="size-4" /></button></div>
      </article>)}
    </div> : <div className="mt-4"><EmptyState icon={UsersRound} title={query ? 'Kein Kunde gefunden' : 'Noch keine Kunden'} text={query ? 'Versuchen Sie einen anderen Suchbegriff.' : 'Legen Sie den ersten Kunden mit Rechnungsanschrift an.'} action={!query ? <button onClick={() => onEdit('new')} className="admin-btn-primary min-h-11"><Plus className="size-4" /> Ersten Kunden anlegen</button> : undefined} /></div>}
    <CustomFieldsSection fields={data.customFields} />
  </section>;
}

function ServicesView({ services, onEdit }: { services: Service[]; onEdit: (service: Service | 'new') => void }) {
  const [query, setQuery] = useState('');
  const filtered = services.filter(service => `${service.serviceCode || ''} ${service.name} ${service.description || ''}`.toLowerCase().includes(query.toLowerCase()));
  return <section>
    <ViewHeader eyebrow="Leistungskatalog" title="Wiederkehrende Positionen" description="Preis, Steuer und Beschreibung einmal hinterlegen und in Rechnungen direkt einsetzen." action={<button onClick={() => onEdit('new')} className="admin-btn-primary min-h-11"><Plus className="size-4" /> Leistung anlegen</button>} />
    <SearchField value={query} onChange={setQuery} placeholder="Leistung oder Kürzel suchen …" />
    {filtered.length ? <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="hidden grid-cols-[90px_1fr_130px_90px_50px] gap-4 border-b border-zinc-100 bg-zinc-50/70 px-5 py-3 text-[11px] font-bold uppercase tracking-[.1em] text-zinc-400 md:grid"><span>Kürzel</span><span>Leistung</span><span className="text-right">Netto</span><span className="text-right">Steuer</span><span /></div>
      {filtered.map((service, index) => <button key={service.id} type="button" onClick={() => onEdit(service)} className={`grid min-h-[74px] w-full gap-2 px-5 py-4 text-left hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset md:grid-cols-[90px_1fr_130px_90px_50px] md:items-center md:gap-4 ${index ? 'border-t border-zinc-100' : ''}`}>
        <span className="font-mono text-xs text-zinc-400">{service.serviceCode || '—'}</span><span><span className="block font-semibold text-zinc-900">{service.name}</span><span className="mt-1 line-clamp-1 text-xs text-zinc-500">{service.description || `${service.unitLabel} · direkt einsetzbar`}</span></span><span className="font-semibold text-zinc-900 md:text-right">{money(service.unitPriceNetCents)}</span><span className="text-sm text-zinc-500 md:text-right">{service.taxRateBasisPoints / 100}%</span><span className="hidden place-items-center text-zinc-300 md:grid"><Pencil className="size-4" /></span>
      </button>)}
    </div> : <div className="mt-4"><EmptyState icon={BookOpen} title={query ? 'Keine Leistung gefunden' : 'Leistungskatalog ist leer'} text="Typische Positionen sparen bei jeder Rechnung Zeit." action={!query ? <button onClick={() => onEdit('new')} className="admin-btn-primary min-h-11"><Plus className="size-4" /> Erste Leistung anlegen</button> : undefined} /></div>}
  </section>;
}

function ViewHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">{eyebrow}</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950">{title}</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-500">{description}</p></div>{action}</div>;
}

function SearchField({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="relative block max-w-xl"><span className="sr-only">Suchen</span><Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" /><input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className="admin-input min-h-11 pl-10" /></label>;
}

function StatusPill({ status }: { status: string }) {
  const item = status === 'overdue' ? { label: 'Überfällig', className: 'bg-amber-50 text-amber-800 ring-amber-200' } : STATUS[status] || STATUS.draft;
  return <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${item.className}`}>{item.label}</span>;
}

function EmptyState({ icon: Icon, title, text, action }: { icon: typeof FileText; title: string; text: string; action?: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-zinc-100 text-zinc-500"><Icon className="size-5" /></div><h3 className="mt-4 font-semibold text-zinc-900">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">{text}</p>{action ? <div className="mt-5">{action}</div> : null}</div>;
}

function CustomFieldsSection({ fields }: { fields: CustomField[] }) {
  const [editing, setEditing] = useState<CustomField | 'new' | null>(null);
  const [isPending, startTransition] = useTransition();
  async function remove(field: CustomField) {
    if (!window.confirm(`Das Feld „${field.label}“ aus neuen Kundenformularen entfernen? Bereits gespeicherte Werte bleiben erhalten.`)) return;
    startTransition(async () => {
      try { await deleteCustomerCustomFieldAction(field.id); toast.success('Zusatzfeld entfernt'); window.location.reload(); }
      catch (error) { toast.error('Zusatzfeld konnte nicht entfernt werden', { description: errorMessage(error) }); }
    });
  }
  return <section className="mt-10 border-t border-zinc-200 pt-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="font-semibold text-zinc-950">Eigene Stammdatenfelder</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-500">Ergänzen Sie genau die Informationen, die Sie pro Kunde benötigen. Auswahlwerte werden einzeln hinzugefügt – nicht kommagetrennt.</p></div><button onClick={() => setEditing('new')} className="admin-btn-secondary min-h-11 shrink-0"><Plus className="size-4" /> Feld hinzufügen</button></div>
    {fields.length ? <div className="mt-4 flex flex-wrap gap-2">{fields.map(field => <div key={field.id} className="group inline-flex min-h-11 items-center gap-1 rounded-xl border border-zinc-200 bg-white pl-3 text-sm"><span className="font-medium text-zinc-800">{field.label}</span><span className="text-xs text-zinc-400">{FIELD_TYPES.find(type => type[0] === field.fieldType)?.[1]}</span>{field.required ? <span className="text-xs font-bold text-blue-600">Pflicht</span> : null}<button onClick={() => setEditing(field)} className="ml-1 grid size-11 place-items-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700" aria-label={`${field.label} bearbeiten`}><Pencil className="size-3.5" /></button><button disabled={isPending} onClick={() => void remove(field)} className="grid size-11 place-items-center rounded-lg text-zinc-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`${field.label} entfernen`}><X className="size-3.5" /></button></div>)}</div> : <p className="mt-4 rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-500">Noch keine eigenen Felder. Die Standard-Stammdaten sind bereits verfügbar.</p>}
    <CustomFieldDialog open={editing} onClose={() => setEditing(null)} />
  </section>;
}

function CustomFieldDialog({ open, onClose }: { open: CustomField | 'new' | null; onClose: () => void }) {
  const existing = open && open !== 'new' ? open : null;
  const [label, setLabel] = useState('');
  const [fieldType, setFieldType] = useState<(typeof FIELD_TYPES)[number][0]>('text');
  const [options, setOptions] = useState<string[]>([]);
  const [optionDraft, setOptionDraft] = useState('');
  const [required, setRequired] = useState(false);
  const [isPending, startTransition] = useTransition();
  useEffect(() => { if (!open) return; setLabel(existing?.label || ''); setFieldType((existing?.fieldType as typeof fieldType) || 'text'); setOptions(existing?.options || []); setRequired(existing?.required || false); setOptionDraft(''); }, [open, existing]);

  function addOption() {
    const value = optionDraft.trim();
    if (!value || options.some(option => option.toLowerCase() === value.toLowerCase())) return;
    setOptions(current => [...current, value]); setOptionDraft('');
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      try {
        await saveCustomerCustomFieldAction({ id: existing?.id, label, fieldType, options: fieldType === 'select' ? options : [], required });
        toast.success(existing ? 'Zusatzfeld aktualisiert' : 'Zusatzfeld hinzugefügt'); onClose(); window.location.reload();
      } catch (error) { toast.error('Zusatzfeld konnte nicht gespeichert werden', { description: errorMessage(error) }); }
    });
  }
  return <Dialog open={Boolean(open)} onClose={onClose} title={existing ? 'Stammdatenfeld bearbeiten' : 'Stammdatenfeld hinzufügen'} description="Das Feld erscheint anschließend strukturiert bei jedem Kunden.">
    <form onSubmit={submit} className="space-y-4">
      <Field label="Feldname" required><input autoFocus required value={label} onChange={event => setLabel(event.target.value)} className="admin-input" placeholder="z. B. Kostenstelle" /></Field>
      <Field label="Feldtyp"><select value={fieldType} onChange={event => setFieldType(event.target.value as typeof fieldType)} className="admin-input">{FIELD_TYPES.map(type => <option key={type[0]} value={type[0]}>{type[1]}</option>)}</select></Field>
      {fieldType === 'select' ? <Field label="Auswahlmöglichkeiten" hint="Jeden Wert einzeln hinzufügen."><div className="flex gap-2"><input value={optionDraft} onChange={event => setOptionDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addOption(); } }} className="admin-input" placeholder="z. B. Beratung" /><button type="button" onClick={addOption} className="admin-btn-secondary min-h-11 shrink-0">Hinzufügen</button></div><div className="mt-2 flex flex-wrap gap-2">{options.map(option => <span key={option} className="inline-flex min-h-11 items-center rounded-lg bg-zinc-100 pl-3 text-sm text-zinc-700">{option}<button type="button" onClick={() => setOptions(current => current.filter(item => item !== option))} className="ml-1 grid size-11 place-items-center rounded hover:bg-zinc-200" aria-label={`${option} entfernen`}><X className="size-3" /></button></span>)}</div></Field> : null}
      <label className="flex min-h-11 items-center gap-3 rounded-xl border border-zinc-200 px-3"><input type="checkbox" checked={required} onChange={event => setRequired(event.target.checked)} className="size-4 accent-blue-600" /><span className="text-sm font-medium text-zinc-800">Bei jedem Kunden als Pflichtfeld anzeigen</span></label>
      <DialogActions onCancel={onClose} pending={isPending} submitLabel="Feld speichern" />
    </form>
  </Dialog>;
}

type AddressForm = { street: string; addressLine2: string; postalCode: string; city: string; countryCode: string };
type CustomerForm = {
  customerType: 'company' | 'person'; companyName: string; salutation: string; firstName: string; lastName: string; name: string;
  email: string; phone: string; mobile: string; website: string; taxNumber: string; vatId: string; eInvoiceRoutingId: string;
  buyerReference: string; language: 'de' | 'en'; paymentTermDays: number; notes: string; billingAddress: AddressForm; customFields: Record<string, string | number | boolean | null>;
};

const EMPTY_ADDRESS: AddressForm = { street: '', addressLine2: '', postalCode: '', city: '', countryCode: 'DE' };
const EMPTY_CUSTOMER: CustomerForm = { customerType: 'company', companyName: '', salutation: '', firstName: '', lastName: '', name: '', email: '', phone: '', mobile: '', website: '', taxNumber: '', vatId: '', eInvoiceRoutingId: '', buyerReference: '', language: 'de', paymentTermDays: 14, notes: '', billingAddress: EMPTY_ADDRESS, customFields: {} };

function CustomerDialog({ open, customFields, onClose, onSaved }: { open: Customer | 'new' | null; customFields: CustomField[]; onClose: () => void; onSaved: () => void }) {
  const customer = open && open !== 'new' ? open : null;
  const [form, setForm] = useState<CustomerForm>(EMPTY_CUSTOMER);
  const [section, setSection] = useState<'core' | 'billing' | 'extra'>('core');
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (!open) return;
    const address = (customer?.defaultBillingAddress || {}) as Record<string, string | undefined>;
    setForm(customer ? {
      customerType: customer.customerType as 'company' | 'person', companyName: customer.companyName || '', salutation: customer.salutation || '', firstName: customer.firstName || '', lastName: customer.lastName || '', name: customer.name,
      email: customer.email, phone: customer.phone || '', mobile: customer.mobile || '', website: customer.website || '', taxNumber: customer.taxNumber || '', vatId: customer.vatId || '', eInvoiceRoutingId: customer.eInvoiceRoutingId || '', buyerReference: customer.buyerReference || '', language: customer.language as 'de' | 'en', paymentTermDays: customer.paymentTermDays, notes: customer.notes || '',
      billingAddress: { street: address.street || '', addressLine2: address.addressLine2 || '', postalCode: address.zip || '', city: address.city || '', countryCode: address.country || 'DE' },
      customFields: (customer.customFields || {}) as CustomerForm['customFields'],
    } : { ...EMPTY_CUSTOMER, billingAddress: { ...EMPTY_ADDRESS }, customFields: {} });
    setSection('core');
  }, [open, customer]);

  function patch(patchValue: Partial<CustomerForm>) { setForm(current => ({ ...current, ...patchValue })); }
  function patchAddress(patchValue: Partial<AddressForm>) { setForm(current => ({ ...current, billingAddress: { ...current.billingAddress, ...patchValue } })); }
  function submit(event: FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      try {
        const displayName = form.customerType === 'company' ? form.companyName : [form.firstName, form.lastName].filter(Boolean).join(' ');
        await saveBillingCustomerAction({ ...form, id: customer?.id, name: displayName || form.name, shippingAddress: null });
        onSaved();
      } catch (error) { toast.error('Kunde konnte nicht gespeichert werden', { description: errorMessage(error) }); }
    });
  }
  async function archive() {
    if (!customer || !window.confirm(`${customerName(customer)} archivieren? Bestehende Rechnungen bleiben erhalten.`)) return;
    startTransition(async () => { try { await archiveBillingCustomerAction(customer.id); toast.success('Kunde archiviert'); onSaved(); } catch (error) { toast.error('Kunde konnte nicht archiviert werden', { description: errorMessage(error) }); } });
  }

  return <Dialog open={Boolean(open)} onClose={onClose} title={customer ? customerName(customer) : 'Kunden anlegen'} description={customer?.customerNumber ? `Kundennummer ${customer.customerNumber}` : 'Stammdaten für Rechnungen und Kommunikation.'} size="xl">
    <form onSubmit={submit}>
      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-zinc-200">{([['core', 'Kontakt'], ['billing', 'Rechnung'], ['extra', 'Weitere Daten']] as const).map(item => <button key={item[0]} type="button" onClick={() => setSection(item[0])} className={`min-h-11 whitespace-nowrap border-b-2 px-3 text-sm font-semibold ${section === item[0] ? 'border-blue-600 text-blue-700' : 'border-transparent text-zinc-500'}`}>{item[1]}</button>)}</div>
      {section === 'core' ? <div className="space-y-5">
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-zinc-100 p-1" role="group" aria-label="Kundentyp"><button type="button" aria-pressed={form.customerType === 'company'} onClick={() => patch({ customerType: 'company' })} className={`min-h-11 rounded-lg text-sm font-semibold ${form.customerType === 'company' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500'}`}>Unternehmen</button><button type="button" aria-pressed={form.customerType === 'person'} onClick={() => patch({ customerType: 'person' })} className={`min-h-11 rounded-lg text-sm font-semibold ${form.customerType === 'person' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500'}`}>Privatperson</button></div>
        {form.customerType === 'company' ? <Field label="Firmenname" required><input required value={form.companyName} onChange={event => patch({ companyName: event.target.value })} className="admin-input" /></Field> : <div className="grid gap-4 sm:grid-cols-3"><Field label="Anrede"><input value={form.salutation} onChange={event => patch({ salutation: event.target.value })} className="admin-input" /></Field><Field label="Vorname"><input value={form.firstName} onChange={event => patch({ firstName: event.target.value })} className="admin-input" /></Field><Field label="Nachname"><input value={form.lastName} onChange={event => patch({ lastName: event.target.value })} className="admin-input" /></Field></div>}
        <div className="grid gap-4 sm:grid-cols-2"><Field label="E-Mail" required><input required type="email" value={form.email} onChange={event => patch({ email: event.target.value })} className="admin-input" /></Field><Field label="Telefon"><input value={form.phone} onChange={event => patch({ phone: event.target.value })} className="admin-input" /></Field><Field label="Mobil"><input value={form.mobile} onChange={event => patch({ mobile: event.target.value })} className="admin-input" /></Field><Field label="Website"><input type="url" value={form.website} onChange={event => patch({ website: event.target.value })} className="admin-input" /></Field></div>
      </div> : section === 'billing' ? <div className="space-y-5">
        <fieldset className="space-y-4"><legend className="mb-3 text-sm font-semibold text-zinc-900">Rechnungsanschrift</legend><Field label="Straße und Hausnummer" required><input required value={form.billingAddress.street} onChange={event => patchAddress({ street: event.target.value })} className="admin-input" /></Field><Field label="Adresszusatz"><input value={form.billingAddress.addressLine2} onChange={event => patchAddress({ addressLine2: event.target.value })} className="admin-input" /></Field><div className="grid gap-4 sm:grid-cols-[140px_1fr_100px]"><Field label="PLZ" required><input required value={form.billingAddress.postalCode} onChange={event => patchAddress({ postalCode: event.target.value })} className="admin-input" /></Field><Field label="Ort" required><input required value={form.billingAddress.city} onChange={event => patchAddress({ city: event.target.value })} className="admin-input" /></Field><Field label="Land"><input maxLength={2} value={form.billingAddress.countryCode} onChange={event => patchAddress({ countryCode: event.target.value.toUpperCase() })} className="admin-input uppercase" /></Field></div></fieldset>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Zahlungsziel"><div className="relative"><input type="number" min="0" max="365" value={form.paymentTermDays} onChange={event => patch({ paymentTermDays: Number(event.target.value) })} className="admin-input pr-14" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">Tage</span></div></Field><Field label="Sprache"><select value={form.language} onChange={event => patch({ language: event.target.value as 'de' | 'en' })} className="admin-input"><option value="de">Deutsch</option><option value="en">Englisch</option></select></Field><Field label="Steuernummer"><input value={form.taxNumber} onChange={event => patch({ taxNumber: event.target.value })} className="admin-input" /></Field><Field label="USt-IdNr."><input value={form.vatId} onChange={event => patch({ vatId: event.target.value })} className="admin-input" /></Field><Field label="Leitweg-ID / Routing-ID" hint="Relevant für bestimmte E-Rechnungsempfänger."><input value={form.eInvoiceRoutingId} onChange={event => patch({ eInvoiceRoutingId: event.target.value })} className="admin-input" /></Field><Field label="Standard-Bestellreferenz"><input value={form.buyerReference} onChange={event => patch({ buyerReference: event.target.value })} className="admin-input" /></Field></div>
      </div> : <div className="space-y-5">
        {customFields.length ? <div className="grid gap-4 sm:grid-cols-2">{customFields.map(field => <CustomerCustomInput key={field.id} field={field} value={form.customFields[field.fieldKey]} onChange={value => patch({ customFields: { ...form.customFields, [field.fieldKey]: value } })} />)}</div> : <p className="rounded-xl bg-zinc-50 px-4 py-4 text-sm text-zinc-500">Eigene Felder können unterhalb der Kundenliste eingerichtet werden.</p>}
        <Field label="Interne Notizen"><textarea value={form.notes} onChange={event => patch({ notes: event.target.value })} className="admin-input min-h-28 resize-y" placeholder="Nicht auf der Rechnung sichtbar" /></Field>
      </div>}
      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center">{customer ? <button type="button" onClick={() => void archive()} disabled={isPending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-rose-700 hover:bg-rose-50"><Trash2 className="size-4" /> Archivieren</button> : null}<div className="sm:ml-auto"><DialogActions onCancel={onClose} pending={isPending} submitLabel="Kunde speichern" compact /></div></div>
    </form>
  </Dialog>;
}

function CustomerCustomInput({ field, value, onChange }: { field: CustomField; value: unknown; onChange: (value: string | number | boolean | null) => void }) {
  if (field.fieldType === 'boolean') return <label className="flex min-h-11 items-center gap-3 rounded-xl border border-zinc-200 px-3"><input type="checkbox" checked={Boolean(value)} onChange={event => onChange(event.target.checked)} className="size-4 accent-blue-600" /><span className="text-sm font-medium text-zinc-800">{field.label}{field.required ? ' *' : ''}</span></label>;
  if (field.fieldType === 'select') return <Field label={field.label} required={field.required}><select required={field.required} value={String(value || '')} onChange={event => onChange(event.target.value)} className="admin-input"><option value="">Bitte wählen</option>{field.options.map(option => <option key={option}>{option}</option>)}</select></Field>;
  if (field.fieldType === 'textarea') return <Field label={field.label} required={field.required}><textarea required={field.required} value={String(value || '')} onChange={event => onChange(event.target.value)} className="admin-input min-h-24 resize-y" /></Field>;
  const type = field.fieldType === 'phone' ? 'tel' : field.fieldType;
  return <Field label={field.label} required={field.required}><input type={type} required={field.required} value={String(value || '')} onChange={event => onChange(field.fieldType === 'number' ? Number(event.target.value) : event.target.value)} className="admin-input" /></Field>;
}

function ServiceDialog({ open, onClose, onSaved }: { open: Service | 'new' | null; onClose: () => void; onSaved: () => void }) {
  const service = open && open !== 'new' ? open : null;
  const [form, setForm] = useState({ serviceCode: '', name: '', description: '', unitCode: 'C62', unitLabel: 'Stück', price: '', taxRate: '19' });
  const [isPending, startTransition] = useTransition();
  useEffect(() => { if (open) setForm(service ? { serviceCode: service.serviceCode || '', name: service.name, description: service.description || '', unitCode: service.unitCode, unitLabel: service.unitLabel, price: (service.unitPriceNetCents / 100).toFixed(2).replace('.', ','), taxRate: String(service.taxRateBasisPoints / 100) } : { serviceCode: '', name: '', description: '', unitCode: 'C62', unitLabel: 'Stück', price: '', taxRate: '19' }); }, [open, service]);
  function patch(value: Partial<typeof form>) { setForm(current => ({ ...current, ...value })); }
  function submit(event: FormEvent) { event.preventDefault(); startTransition(async () => { try { const price = Number(form.price.replace(',', '.')); await saveBillingServiceAction({ id: service?.id, serviceCode: form.serviceCode, name: form.name, description: form.description, unitCode: form.unitCode, unitLabel: form.unitLabel, unitPriceNetCents: Math.round(price * 100), taxRateBasisPoints: Math.round(Number(form.taxRate) * 100) }); onSaved(); } catch (error) { toast.error('Leistung konnte nicht gespeichert werden', { description: errorMessage(error) }); } }); }
  async function archive() { if (!service || !window.confirm(`„${service.name}“ aus dem aktiven Leistungskatalog entfernen?`)) return; startTransition(async () => { try { await archiveBillingServiceAction(service.id); toast.success('Leistung archiviert'); onSaved(); } catch (error) { toast.error('Leistung konnte nicht archiviert werden', { description: errorMessage(error) }); } }); }
  return <Dialog open={Boolean(open)} onClose={onClose} title={service ? 'Leistung bearbeiten' : 'Leistung anlegen'} description="Diese Angaben lassen sich im Rechnungseditor mit einem Klick einsetzen.">
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[120px_1fr]"><Field label="Kürzel"><input value={form.serviceCode} onChange={event => patch({ serviceCode: event.target.value })} className="admin-input font-mono" placeholder="BER-01" /></Field><Field label="Name" required><input autoFocus required value={form.name} onChange={event => patch({ name: event.target.value })} className="admin-input" /></Field></div>
      <Field label="Beschreibung"><textarea value={form.description} onChange={event => patch({ description: event.target.value })} className="admin-input min-h-24 resize-y" placeholder="Leistungsumfang, Abgrenzung oder enthaltene Bestandteile" /></Field>
      <div className="grid gap-4 sm:grid-cols-3"><Field label="Nettopreis" required><div className="relative"><input required inputMode="decimal" value={form.price} onChange={event => patch({ price: event.target.value })} className="admin-input pr-10 text-right" placeholder="0,00" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">€</span></div></Field><Field label="USt."><select value={form.taxRate} onChange={event => patch({ taxRate: event.target.value })} className="admin-input"><option value="19">19 %</option><option value="7">7 %</option><option value="0">0 %</option></select></Field><Field label="Einheit"><select value={`${form.unitCode}|${form.unitLabel}`} onChange={event => { const [unitCode, unitLabel] = event.target.value.split('|'); patch({ unitCode, unitLabel }); }} className="admin-input"><option value="C62|Stück">Stück</option><option value="HUR|Stunde">Stunde</option><option value="DAY|Tag">Tag</option><option value="MON|Monat">Monat</option><option value="LS|Pauschal">Pauschal</option></select></Field></div>
      <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-5 sm:flex-row">{service ? <button type="button" onClick={() => void archive()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-rose-700 hover:bg-rose-50"><Trash2 className="size-4" /> Archivieren</button> : null}<div className="sm:ml-auto"><DialogActions onCancel={onClose} pending={isPending} submitLabel="Leistung speichern" compact /></div></div>
    </form>
  </Dialog>;
}

type SettingsForm = {
  companyName: string; legalForm: string; street: string; postalCode: string; city: string; countryCode: string; email: string; phone: string; website: string;
  taxNumber: string; vatId: string; registerCourt: string; registerNumber: string; managingDirector: string; logoUrl: string;
  bankName: string; accountHolder: string; iban: string; bic: string; invoicePrefix: string; cancellationPrefix: string;
  invoiceNumberFormat: string; cancellationNumberFormat: string; sequenceReset: 'never' | 'year' | 'month';
  nextInvoiceNumber: number; nextCancellationNumber: number;
  defaultPaymentTermDays: number; defaultIntroText: string; defaultClosingText: string; defaultFooter: string; smallBusiness: boolean; smallBusinessNotice: string; senderName: string;
};

function settingsForm(data: WorkspaceData): SettingsForm {
  const s = data.settings;
  return {
    companyName: s.companyName || '', legalForm: s.legalForm || '', street: s.street || '', postalCode: s.postalCode || '', city: s.city || '', countryCode: s.countryCode || 'DE', email: s.email || '', phone: s.phone || '', website: s.website || '',
    taxNumber: s.taxNumber || '', vatId: s.vatId || '', registerCourt: s.registerCourt || '', registerNumber: s.registerNumber || '', managingDirector: s.managingDirector || '', logoUrl: s.logoUrl || '', bankName: s.bankName || '', accountHolder: s.accountHolder || '', iban: s.iban || '', bic: s.bic || '',
    invoicePrefix: s.invoicePrefix, cancellationPrefix: s.cancellationPrefix, invoiceNumberFormat: s.invoiceNumberFormat, cancellationNumberFormat: s.cancellationNumberFormat, sequenceReset: s.sequenceReset as SettingsForm['sequenceReset'], nextInvoiceNumber: s.nextInvoiceNumber, nextCancellationNumber: s.nextCancellationNumber, defaultPaymentTermDays: s.defaultPaymentTermDays,
    defaultIntroText: s.defaultIntroText || '', defaultClosingText: s.defaultClosingText || '', defaultFooter: s.defaultFooter || '', smallBusiness: s.smallBusiness, smallBusinessNotice: s.smallBusinessNotice, senderName: s.senderName || '',
  };
}

function SettingsView({ data, onSaved }: { data: WorkspaceData; onSaved: (message?: string) => void }) {
  const [form, setForm] = useState<SettingsForm>(() => settingsForm(data));
  const [section, setSection] = useState<'identity' | 'numbers' | 'payment' | 'texts'>('identity');
  const [isPending, startTransition] = useTransition();
  useEffect(() => setForm(settingsForm(data)), [data]);
  function patch(value: Partial<SettingsForm>) { setForm(current => ({ ...current, ...value })); }
  function submit(event: FormEvent) {
    event.preventDefault();
    const numberError = numberFormatError(form.invoiceNumberFormat)
      || numberFormatError(form.cancellationNumberFormat)
      || numberResetError(form.invoiceNumberFormat, form.sequenceReset)
      || numberResetError(form.cancellationNumberFormat, form.sequenceReset);
    if (numberError) { toast.error(numberError); setSection('numbers'); return; }
    startTransition(async () => {
      try { await saveBillingSettingsAction({ ...form, currency: 'EUR' }); onSaved('Rechnungseinstellungen gespeichert'); }
      catch (error) { toast.error('Einstellungen konnten nicht gespeichert werden', { description: errorMessage(error) }); }
    });
  }
  const checks = [
    { label: 'Absender', ready: Boolean(form.companyName && form.street && form.postalCode && form.city && form.email) },
    { label: 'Steuerangabe', ready: Boolean(form.taxNumber || form.vatId) },
    { label: 'Nummernkreis', ready: !numberFormatError(form.invoiceNumberFormat) && !numberFormatError(form.cancellationNumberFormat) && !numberResetError(form.invoiceNumberFormat, form.sequenceReset) && !numberResetError(form.cancellationNumberFormat, form.sequenceReset) },
    { label: 'Bank', ready: Boolean(form.accountHolder && form.iban) },
  ];
  return <section>
    <ViewHeader eyebrow="Grundlage jeder Rechnung" title="Rechnungseinstellungen" description="Was hier steht, wird beim Festschreiben als unveränderbarer Absender-Schnappschuss übernommen." />
    <div className="mb-6 flex flex-wrap gap-2">{checks.map(check => <span key={check.label} className={`inline-flex min-h-9 items-center gap-2 rounded-xl px-3 text-xs font-semibold ring-1 ring-inset ${check.ready ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-amber-50 text-amber-800 ring-amber-200'}`}>{check.ready ? <Check className="size-3.5" /> : <AlertTriangle className="size-3.5" />}{check.label}</span>)}</div>
    <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="self-start rounded-2xl border border-zinc-200 bg-white p-2 xl:sticky xl:top-5">{([['identity', 'Unternehmen', Building2], ['numbers', 'Nummernkreise', ReceiptText], ['payment', 'Steuer & Bank', Landmark], ['texts', 'Texte & Versand', Mail]] as const).map(item => { const Icon = item[2]; return <button key={item[0]} type="button" onClick={() => setSection(item[0])} className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${section === item[0] ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}><Icon className={`size-4 ${section === item[0] ? 'text-blue-300' : 'text-zinc-400'}`} />{item[1]}<ChevronRight className="ml-auto size-4 opacity-40" /></button>; })}</aside>
      <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7">
        {section === 'identity' ? <SettingsIdentity form={form} patch={patch} /> : section === 'numbers' ? <NumberDesigner form={form} patch={patch} /> : section === 'payment' ? <SettingsPayment form={form} patch={patch} /> : <SettingsTexts form={form} patch={patch} />}
        <div className="mt-8 flex flex-col gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-lg text-xs leading-5 text-zinc-500">Technisch für eine nachvollziehbare, unveränderbare Belegablage ausgelegt. Betriebliche Abläufe und steuerliche Prüfung bleiben in Ihrer Verantwortung.</p><button disabled={isPending} className="admin-btn-primary min-h-11 shrink-0">{isPending ? 'Wird gespeichert …' : 'Einstellungen speichern'}</button></div>
      </div>
    </form>
  </section>;
}

function SettingsIdentity({ form, patch }: { form: SettingsForm; patch: (value: Partial<SettingsForm>) => void }) {
  return <div className="space-y-6"><SectionHeading title="Unternehmensdaten" text="Diese Angaben erscheinen als Absender auf PDF und E-Rechnung." />
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Unternehmensname" required><input required value={form.companyName} onChange={event => patch({ companyName: event.target.value })} className="admin-input" /></Field><Field label="Rechtsform"><input value={form.legalForm} onChange={event => patch({ legalForm: event.target.value })} className="admin-input" placeholder="z. B. GmbH" /></Field><Field label="Straße und Hausnummer" required><input required value={form.street} onChange={event => patch({ street: event.target.value })} className="admin-input" /></Field><div className="grid grid-cols-[110px_1fr] gap-3"><Field label="PLZ" required><input required value={form.postalCode} onChange={event => patch({ postalCode: event.target.value })} className="admin-input" /></Field><Field label="Ort" required><input required value={form.city} onChange={event => patch({ city: event.target.value })} className="admin-input" /></Field></div><Field label="E-Mail" required><input required type="email" value={form.email} onChange={event => patch({ email: event.target.value })} className="admin-input" /></Field><Field label="Telefon"><input value={form.phone} onChange={event => patch({ phone: event.target.value })} className="admin-input" /></Field><Field label="Website"><input type="url" value={form.website} onChange={event => patch({ website: event.target.value })} className="admin-input" /></Field><Field label="Geschäftsführung"><input value={form.managingDirector} onChange={event => patch({ managingDirector: event.target.value })} className="admin-input" /></Field><Field label="Registergericht"><input value={form.registerCourt} onChange={event => patch({ registerCourt: event.target.value })} className="admin-input" /></Field><Field label="Registernummer"><input value={form.registerNumber} onChange={event => patch({ registerNumber: event.target.value })} className="admin-input" /></Field></div>
    <div className="border-t border-zinc-100 pt-6"><ImageUploadField label="Rechnungslogo" value={form.logoUrl} onChange={logoUrl => patch({ logoUrl })} /></div>
  </div>;
}

function NumberDesigner({ form, patch }: { form: SettingsForm; patch: (value: Partial<SettingsForm>) => void }) {
  const resetError = numberResetError(form.invoiceNumberFormat, form.sequenceReset) || numberResetError(form.cancellationNumberFormat, form.sequenceReset);
  return <div className="space-y-7"><SectionHeading title="Rechnungsnummern gestalten" text="Beim Festschreiben wird die nächste freie Nummer vergeben und danach automatisch fortlaufend weitergezählt." />
    <NumberFormatField label="Rechnungen" prefix={form.invoicePrefix} format={form.invoiceNumberFormat} counter={form.nextInvoiceNumber} onPrefix={invoicePrefix => patch({ invoicePrefix })} onFormat={invoiceNumberFormat => patch({ invoiceNumberFormat })} onCounter={nextInvoiceNumber => patch({ nextInvoiceNumber })} />
    <div className="border-t border-zinc-100 pt-7"><NumberFormatField label="Stornorechnungen" prefix={form.cancellationPrefix} format={form.cancellationNumberFormat} counter={form.nextCancellationNumber} onPrefix={cancellationPrefix => patch({ cancellationPrefix })} onFormat={cancellationNumberFormat => patch({ cancellationNumberFormat })} onCounter={nextCancellationNumber => patch({ nextCancellationNumber })} /></div>
    <div className="border-t border-zinc-100 pt-7"><Field label="Wann beginnt die laufende Nummer wieder bei 1?" hint="Ein Wechsel greift automatisch mit der nächsten passenden Rechnungsperiode."><div className="grid gap-2 sm:grid-cols-3">{([['never', 'Nie', 'Eine Folge über alle Jahre'], ['year', 'Jährlich', 'Jedes Jahr neue Folge'], ['month', 'Monatlich', 'Jeden Monat neue Folge']] as const).map(item => <button key={item[0]} type="button" onClick={() => patch({ sequenceReset: item[0] })} className={`min-h-20 rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${form.sequenceReset === item[0] ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-zinc-200 hover:border-zinc-300'}`}><span className="block text-sm font-semibold text-zinc-900">{item[1]}</span><span className="mt-1 block text-xs leading-5 text-zinc-500">{item[2]}</span></button>)}</div>{resetError ? <p role="alert" className="mt-3 text-xs font-semibold text-rose-700">{resetError}</p> : null}</Field></div>
    <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm leading-6 text-blue-900"><strong>Wichtig:</strong> Bereits vergebene Nummern bleiben unverändert. Das Format beeinflusst nur künftig festgeschriebene Rechnungen.</div>
  </div>;
}

function NumberFormatField({ label, prefix, format, counter, onPrefix, onFormat, onCounter }: { label: string; prefix: string; format: string; counter: number; onPrefix: (value: string) => void; onFormat: (value: string) => void; onCounter: (value: number) => void }) {
  const isPreset = NUMBER_PRESETS.some(preset => preset.value === format);
  const [customMode, setCustomMode] = useState(!isPreset);
  const error = numberFormatError(format);
  return <fieldset><legend className="text-sm font-semibold text-zinc-950">{label}</legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{NUMBER_PRESETS.map(preset => <button key={preset.value} type="button" onClick={() => { setCustomMode(false); onFormat(preset.value); }} className={`min-h-[76px] rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${!customMode && format === preset.value ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-zinc-200 hover:border-zinc-300'}`}><span className="block text-sm font-semibold text-zinc-900">{preset.label}</span><span className="mt-1 block font-mono text-xs text-zinc-500">{preset.example}</span></button>)}<button type="button" onClick={() => setCustomMode(true)} className={`min-h-[76px] rounded-xl border p-3 text-left transition sm:col-span-2 ${customMode ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-zinc-200 hover:border-zinc-300'}`}><span className="block text-sm font-semibold text-zinc-900">Eigenes Format</span><span className="mt-1 block text-xs text-zinc-500">Trenner und Reihenfolge frei gestalten</span></button></div>
    <div className="mt-4 grid gap-4 sm:grid-cols-[140px_170px_1fr]"><Field label="Präfix"><input maxLength={20} value={prefix} onChange={event => onPrefix(event.target.value.toUpperCase())} className="admin-input font-mono uppercase" /></Field><Field label="Nächste laufende Nummer" hint="Danach automatisch +1. Nach dem ersten Beleg nur noch erhöhbar."><input type="number" min="1" step="1" value={counter} onChange={event => onCounter(Math.max(1, Number(event.target.value) || 1))} className="admin-input font-mono" /></Field><Field label="Format" hint="Bausteine: {PREFIX}, {YYYY}, {YY}, {MM} und {N} bis {NNNNNN}."><input value={format} onChange={event => { setCustomMode(true); onFormat(event.target.value.toUpperCase()); }} className={`admin-input font-mono ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : ''}`} aria-invalid={Boolean(error)} />{error ? <p className="mt-1 text-xs font-medium text-rose-700">{error}</p> : null}</Field></div>
    <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-[#fffdfa]"><div className="border-b border-zinc-100 px-4 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-zinc-400">Nächste Nummer · Vorschau</div><div className="px-4 py-4 font-mono text-lg font-semibold tracking-tight text-zinc-950">{formatNumber(format, prefix, counter)}</div></div>
  </fieldset>;
}

function numberFormatError(format: string) {
  if (!/\{N{1,6}\}/.test(format)) return 'Fügen Sie einen Nummern-Baustein wie {NNNN} ein.';
  const leftovers = format.replace(/\{PREFIX\}|\{YYYY\}|\{YY\}|\{MM\}|\{N{1,6}\}/g, '');
  if (/[{}]/.test(leftovers)) return 'Ein Baustein ist unbekannt oder unvollständig.';
  if (format.length > 120) return 'Das Format ist zu lang.';
  return '';
}

function numberResetError(format: string, reset: SettingsForm['sequenceReset']) {
  if (reset === 'year' && !/\{YYYY\}|\{YY\}/.test(format)) return 'Beim jährlichen Neustart muss das Jahr in beiden Nummernformaten vorkommen.';
  if (reset === 'month' && (!/\{YYYY\}|\{YY\}/.test(format) || !format.includes('{MM}'))) return 'Beim monatlichen Neustart müssen Jahr und Monat in beiden Nummernformaten vorkommen.';
  return '';
}

function formatNumber(format: string, prefix: string, counter: number) {
  const now = new Date();
  return format.replace(/\{PREFIX\}/g, prefix || 'RE').replace(/\{YYYY\}/g, String(now.getFullYear())).replace(/\{YY\}/g, String(now.getFullYear()).slice(-2)).replace(/\{MM\}/g, String(now.getMonth() + 1).padStart(2, '0')).replace(/\{(N{1,6})\}/g, (_, digits: string) => String(counter).padStart(digits.length, '0'));
}

function SettingsPayment({ form, patch }: { form: SettingsForm; patch: (value: Partial<SettingsForm>) => void }) {
  return <div className="space-y-7"><SectionHeading title="Steuer und Zahlung" text="Steuerangaben und Bankverbindung werden in PDF und E-Rechnung übernommen." />
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Steuernummer"><input value={form.taxNumber} onChange={event => patch({ taxNumber: event.target.value })} className="admin-input" /></Field><Field label="USt-IdNr."><input value={form.vatId} onChange={event => patch({ vatId: event.target.value })} className="admin-input" /></Field></div>
    <label className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4"><input type="checkbox" checked={form.smallBusiness} onChange={event => patch({ smallBusiness: event.target.checked })} className="mt-1 size-4 accent-blue-600" /><span><span className="block text-sm font-semibold text-zinc-900">Kleinunternehmerregelung anwenden</span><span className="mt-1 block text-xs leading-5 text-zinc-500">Rechnungen weisen dann keine Umsatzsteuer aus. Bitte im Zweifel steuerlich prüfen lassen.</span></span></label>
    {form.smallBusiness ? <Field label="Hinweis auf der Rechnung" required><textarea required value={form.smallBusinessNotice} onChange={event => patch({ smallBusinessNotice: event.target.value })} className="admin-input min-h-20 resize-y" /></Field> : null}
    <div className="border-t border-zinc-100 pt-7"><h3 className="text-sm font-semibold text-zinc-950">Bankverbindung</h3><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Kontoinhaber"><input value={form.accountHolder} onChange={event => patch({ accountHolder: event.target.value })} className="admin-input" /></Field><Field label="Bank"><input value={form.bankName} onChange={event => patch({ bankName: event.target.value })} className="admin-input" /></Field><Field label="IBAN"><input value={form.iban} onChange={event => patch({ iban: event.target.value.toUpperCase() })} className="admin-input font-mono uppercase" /></Field><Field label="BIC"><input value={form.bic} onChange={event => patch({ bic: event.target.value.toUpperCase() })} className="admin-input font-mono uppercase" /></Field></div></div>
  </div>;
}

function SettingsTexts({ form, patch }: { form: SettingsForm; patch: (value: Partial<SettingsForm>) => void }) {
  return <div className="space-y-6"><SectionHeading title="Standardtexte und Versand" text="Neue Entwürfe starten mit diesen Angaben. Im Entwurf bleiben sie frei bearbeitbar." />
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Standard-Zahlungsziel"><div className="relative"><input type="number" min="0" max="365" value={form.defaultPaymentTermDays} onChange={event => patch({ defaultPaymentTermDays: Number(event.target.value) })} className="admin-input pr-14" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">Tage</span></div></Field><Field label="Absendername für E-Mails"><input value={form.senderName} onChange={event => patch({ senderName: event.target.value })} className="admin-input" placeholder={form.companyName || 'Unternehmensname'} /></Field></div>
    <Field label="Einleitung"><textarea value={form.defaultIntroText} onChange={event => patch({ defaultIntroText: event.target.value })} className="admin-input min-h-24 resize-y" placeholder="Vielen Dank für Ihren Auftrag. Wir berechnen folgende Leistungen:" /></Field>
    <Field label="Abschlusstext"><textarea value={form.defaultClosingText} onChange={event => patch({ defaultClosingText: event.target.value })} className="admin-input min-h-24 resize-y" placeholder="Bitte überweisen Sie den Rechnungsbetrag bis zum angegebenen Fälligkeitsdatum." /></Field>
    <Field label="Fußzeile"><textarea value={form.defaultFooter} onChange={event => patch({ defaultFooter: event.target.value })} className="admin-input min-h-24 resize-y" placeholder="Register, Geschäftsführung oder weitere Pflichtangaben" /></Field>
    <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4"><Mail className="mt-0.5 size-5 shrink-0 text-zinc-500" /><p className="text-sm leading-6 text-zinc-600">Rechnungen werden über den unter <Link href="/admin/mail" className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-2">Mail-Server</Link> eingerichteten SMTP-Zugang versendet. PDF und XRechnung werden automatisch angehängt.</p></div>
  </div>;
}

function SectionHeading({ title, text }: { title: string; text: string }) {
  return <div><h2 className="text-lg font-semibold tracking-tight text-zinc-950">{title}</h2><p className="mt-1 text-sm leading-6 text-zinc-500">{text}</p></div>;
}

type DraftLine = { id?: string; serviceId?: string | null; position: number; name: string; description: string; quantity: number; unitCode: string; unitLabel: string; unitPriceNetCents: number; discountBasisPoints: number; taxRateBasisPoints: number };
type DraftForm = { customerId: string; issueDate: string; serviceDateFrom: string; serviceDateTo: string; dueDate: string; buyerReference: string; purchaseOrderReference: string; introText: string; closingText: string; notes: string; lines: DraftLine[] };

function InvoiceWorkspace({ documentId, data, onBack, onOpenDocument, onRefresh }: { documentId: string; data: WorkspaceData; onBack: () => void; onOpenDocument: (id: string) => void; onRefresh: (message?: string) => void }) {
  const [detail, setDetail] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true; setLoading(true); setError('');
    getBillingDocumentAction(documentId).then(result => { if (active) setDetail(result); }).catch(loadError => { if (active) setError(errorMessage(loadError)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [documentId]);
  if (loading) return <div className="grid min-h-[420px] place-items-center rounded-2xl border border-zinc-200 bg-white"><div className="text-center"><div className="mx-auto size-8 animate-spin rounded-full border-2 border-zinc-200 border-t-blue-600" /><p className="mt-3 text-sm text-zinc-500">Dokument wird geladen …</p></div></div>;
  if (error || !detail) return <div><button onClick={onBack} className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-zinc-600"><ArrowLeft className="size-4" /> Zurück</button><EmptyState icon={AlertTriangle} title="Dokument konnte nicht geladen werden" text={error || 'Bitte versuchen Sie es erneut.'} /></div>;
  return detail.document.status === 'draft'
    ? <DraftComposer detail={detail} data={data} onBack={onBack} onRefresh={onRefresh} onReload={setDetail} />
    : <FinalDocument detail={detail} data={data} onBack={onBack} onOpenDocument={onOpenDocument} onRefresh={onRefresh} />;
}

function draftForm(detail: DocumentDetail): DraftForm {
  const document = detail.document;
  return {
    customerId: document.customerId || '', issueDate: dateValue(document.issueDate), serviceDateFrom: dateValue(document.serviceDateFrom), serviceDateTo: dateValue(document.serviceDateTo), dueDate: dateValue(document.dueDate),
    buyerReference: document.buyerReference || '', purchaseOrderReference: document.purchaseOrderReference || '', introText: document.introText || '', closingText: document.closingText || '', notes: document.notes || '',
    lines: detail.items.map((item, index) => ({ id: item.id, serviceId: item.serviceId, position: index + 1, name: item.name, description: item.description || '', quantity: Number(item.quantity), unitCode: item.unitCode, unitLabel: item.unitLabel, unitPriceNetCents: item.unitPriceNetCents, discountBasisPoints: item.discountBasisPoints, taxRateBasisPoints: item.taxRateBasisPoints })),
  };
}

function DraftComposer({ detail, data, onBack, onRefresh, onReload }: { detail: DocumentDetail; data: WorkspaceData; onBack: () => void; onRefresh: (message?: string) => void; onReload: (detail: DocumentDetail) => void }) {
  const [form, setForm] = useState<DraftForm>(() => draftForm(detail));
  const [showPreview, setShowPreview] = useState(false);
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const [serviceChoice, setServiceChoice] = useState('');
  const [isPending, startTransition] = useTransition();
  const customer = data.customers.find(item => item.id === form.customerId);
  const totals = useMemo(() => calculateDraftTotals(form.lines), [form.lines]);
  function patch(value: Partial<DraftForm>) { setForm(current => ({ ...current, ...value })); }
  function updateLine(index: number, value: Partial<DraftLine>) { setForm(current => ({ ...current, lines: current.lines.map((line, lineIndex) => lineIndex === index ? { ...line, ...value } : line) })); }
  function addBlankLine() { patch({ lines: [...form.lines, { position: form.lines.length + 1, name: '', description: '', quantity: 1, unitCode: 'C62', unitLabel: 'Stück', unitPriceNetCents: 0, discountBasisPoints: 0, taxRateBasisPoints: data.settings.smallBusiness ? 0 : 1900 }] }); }
  function addService(serviceId: string) {
    const service = data.services.find(item => item.id === serviceId); if (!service) return;
    patch({ lines: [...form.lines, { serviceId: service.id, position: form.lines.length + 1, name: service.name, description: service.description || '', quantity: 1, unitCode: service.unitCode, unitLabel: service.unitLabel, unitPriceNetCents: service.unitPriceNetCents, discountBasisPoints: 0, taxRateBasisPoints: data.settings.smallBusiness ? 0 : service.taxRateBasisPoints }] }); setServiceChoice('');
  }
  function payload() { return { ...form, id: detail.document.id, serviceDateTo: form.serviceDateTo || null, buyerReference: form.buyerReference || null, purchaseOrderReference: form.purchaseOrderReference || null, introText: form.introText || null, closingText: form.closingText || null, notes: form.notes || null, issueDate: new Date(`${form.issueDate}T12:00:00`), serviceDateFrom: new Date(`${form.serviceDateFrom}T12:00:00`), dueDate: new Date(`${form.dueDate}T12:00:00`), lines: form.lines.map((line, index) => ({ ...line, position: index + 1 })) }; }
  function validate() {
    if (!form.customerId) return 'Bitte wählen Sie einen Kunden.';
    if (!form.issueDate || !form.serviceDateFrom || !form.dueDate) return 'Rechnungs-, Leistungs- und Fälligkeitsdatum sind erforderlich.';
    if (!form.lines.length) return 'Fügen Sie mindestens eine Rechnungsposition hinzu.';
    if (form.lines.some(line => !line.name.trim() || line.quantity <= 0)) return 'Jede Position braucht einen Namen und eine Menge größer als 0.';
    return '';
  }
  async function save(silent = false) {
    const validation = validate(); if (validation) { toast.error(validation); return false; }
    try { await saveBillingDraftAction(payload()); const fresh = await getBillingDocumentAction(detail.document.id); onReload(fresh); if (!silent) toast.success('Entwurf gespeichert'); onRefresh(); return true; }
    catch (saveError) { toast.error('Entwurf konnte nicht gespeichert werden', { description: errorMessage(saveError) }); return false; }
  }
  function submit(event: FormEvent) { event.preventDefault(); startTransition(async () => { await save(); }); }
  function finalize() { startTransition(async () => { if (!(await save(true))) return; try { const result = await finalizeBillingDocumentAction(detail.document.id); toast.success(`Rechnung ${result.documentNumber} festgeschrieben`); setFinalizeOpen(false); onRefresh(); const fresh = await getBillingDocumentAction(detail.document.id); onReload(fresh); } catch (finalizeError) { toast.error('Rechnung konnte nicht festgeschrieben werden', { description: errorMessage(finalizeError) }); } }); }
  function removeDraft() { if (!window.confirm('Diesen Entwurf endgültig löschen?')) return; startTransition(async () => { try { await deleteBillingDraftAction(detail.document.id); toast.success('Entwurf gelöscht'); onRefresh(); onBack(); } catch (deleteError) { toast.error('Entwurf konnte nicht gelöscht werden', { description: errorMessage(deleteError) }); } }); }

  return <div>
    <div className="mb-5 flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between"><div><button type="button" onClick={onBack} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900"><ArrowLeft className="size-4" /> Rechnungen</button><div className="mt-2 flex items-center gap-3"><h2 className="text-2xl font-bold tracking-tight text-zinc-950">Rechnungsentwurf</h2><StatusPill status="draft" /></div><p className="mt-1 text-sm text-zinc-500">Die Rechnungsnummer wird erst beim Festschreiben vergeben.</p></div><div className="flex gap-2"><button type="button" onClick={() => setShowPreview(current => !current)} className="admin-btn-secondary min-h-11 lg:hidden"><Eye className="size-4" /> {showPreview ? 'Editor' : 'Vorschau'}</button><button type="button" onClick={removeDraft} className="grid size-11 place-items-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-rose-50 hover:text-rose-700" aria-label="Entwurf löschen"><Trash2 className="size-4" /></button></div></div>
    <form onSubmit={submit} className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(430px,.95fr)]">
      <div className={`${showPreview ? 'hidden lg:block' : ''} space-y-4`}>
        <ComposerSection number="1" title="Empfänger" done={Boolean(customer)}><Field label="Kunde" required><select required value={form.customerId} onChange={event => patch({ customerId: event.target.value })} className="admin-input"><option value="">Kunde auswählen …</option>{data.customers.map(item => <option key={item.id} value={item.id}>{customerName(item)}{item.customerNumber ? ` · ${item.customerNumber}` : ''}</option>)}</select></Field>{customer ? <div className="mt-3 rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600"><strong className="text-zinc-900">{customerName(customer)}</strong><br />{(customer.defaultBillingAddress as { street?: string } | null)?.street || 'Rechnungsadresse nicht vollständig'} · {customer.email}</div> : null}</ComposerSection>
        <ComposerSection number="2" title="Datum und Referenzen" done={Boolean(form.issueDate && form.serviceDateFrom && form.dueDate)}><div className="grid gap-4 sm:grid-cols-3"><Field label="Rechnungsdatum" required><input required type="date" value={form.issueDate} onChange={event => patch({ issueDate: event.target.value })} className="admin-input" /></Field><Field label="Leistungsdatum" required><input required type="date" value={form.serviceDateFrom} onChange={event => patch({ serviceDateFrom: event.target.value })} className="admin-input" /></Field><Field label="Fällig am" required><input required type="date" value={form.dueDate} onChange={event => patch({ dueDate: event.target.value })} className="admin-input" /></Field></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Kundenreferenz"><input value={form.buyerReference} onChange={event => patch({ buyerReference: event.target.value })} className="admin-input" /></Field><Field label="Bestellreferenz"><input value={form.purchaseOrderReference} onChange={event => patch({ purchaseOrderReference: event.target.value })} className="admin-input" /></Field></div></ComposerSection>
        <ComposerSection number="3" title="Positionen" done={form.lines.length > 0 && form.lines.every(line => line.name)}>
          {data.services.length ? <div className="mb-4 flex flex-col gap-2 rounded-xl border border-blue-100 bg-blue-50/50 p-3 sm:flex-row"><select value={serviceChoice} onChange={event => setServiceChoice(event.target.value)} className="admin-input bg-white"><option value="">Leistung aus Katalog wählen …</option>{data.services.map(service => <option key={service.id} value={service.id}>{service.name} · {money(service.unitPriceNetCents)}</option>)}</select><button type="button" disabled={!serviceChoice} onClick={() => addService(serviceChoice)} className="admin-btn-secondary min-h-11 shrink-0 disabled:opacity-40"><PackagePlus className="size-4" /> Einsetzen</button></div> : null}
          <div className="space-y-3">{form.lines.map((line, index) => <LineEditor key={line.id || index} line={line} index={index} onChange={value => updateLine(index, value)} onRemove={() => patch({ lines: form.lines.filter((_, lineIndex) => lineIndex !== index).map((item, position) => ({ ...item, position: position + 1 })) })} />)}</div>
          <button type="button" onClick={addBlankLine} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 text-sm font-semibold text-zinc-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"><Plus className="size-4" /> Freie Position hinzufügen</button>
          {form.lines.length ? <div className="mt-5 ml-auto max-w-xs space-y-2 border-t border-zinc-200 pt-4 text-sm"><TotalRow label="Netto" value={money(totals.net)} /><TotalRow label="Umsatzsteuer" value={money(totals.tax)} /><TotalRow label="Gesamt" value={money(totals.gross)} strong /></div> : null}
        </ComposerSection>
        <ComposerSection number="4" title="Texte" done><Field label="Einleitung"><textarea value={form.introText} onChange={event => patch({ introText: event.target.value })} className="admin-input min-h-24 resize-y" /></Field><div className="mt-4"><Field label="Abschlusstext"><textarea value={form.closingText} onChange={event => patch({ closingText: event.target.value })} className="admin-input min-h-24 resize-y" /></Field></div><div className="mt-4"><Field label="Interne Notiz" hint="Nicht auf der Rechnung sichtbar."><textarea value={form.notes} onChange={event => patch({ notes: event.target.value })} className="admin-input min-h-20 resize-y" /></Field></div></ComposerSection>
        <div className="sticky bottom-0 z-10 -mx-1 flex flex-col gap-3 border-t border-zinc-200 bg-admin-bg/95 px-1 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-end"><button type="submit" disabled={isPending} className="admin-btn-secondary min-h-11">{isPending ? 'Wird gespeichert …' : 'Entwurf speichern'}</button><button type="button" disabled={isPending} onClick={() => { const validation = validate(); if (validation) toast.error(validation); else setFinalizeOpen(true); }} className="admin-btn-primary min-h-11"><FileCheck2 className="size-4" /> Festschreiben</button></div>
      </div>
      <div className={`${showPreview ? '' : 'hidden lg:block'} lg:sticky lg:top-5`}><div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[.12em] text-zinc-400">Live-Vorschau</span><span className="text-xs text-zinc-400">Entwurf · noch änderbar</span></div><InvoicePaper settings={data.settings} form={form} customer={customer} totals={totals} /></div>
    </form>
    <Dialog open={finalizeOpen} onClose={() => setFinalizeOpen(false)} title="Rechnung festschreiben?" description="Dieser Schritt schützt den Beleg vor nachträglichen Änderungen.">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><div className="flex gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-700" /><div><p className="text-sm font-semibold text-amber-950">Danach ist der Inhalt unveränderbar.</p><ul className="mt-2 space-y-1 text-sm leading-6 text-amber-900"><li>• Die nächste fortlaufende Rechnungsnummer wird vergeben.</li><li>• Inhalte und Beträge können nicht mehr bearbeitet werden.</li><li>• Eine Korrektur ist nur durch eine Stornorechnung möglich.</li></ul></div></div></div>
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setFinalizeOpen(false)} className="admin-btn-secondary min-h-11">Noch einmal prüfen</button><button type="button" disabled={isPending} onClick={finalize} className="admin-btn-primary min-h-11">{isPending ? 'Wird festgeschrieben …' : 'Verbindlich festschreiben'}</button></div>
    </Dialog>
  </div>;
}

function ComposerSection({ number, title, done, children }: { number: string; title: string; done: boolean; children: ReactNode }) {
  return <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"><header className="flex items-center gap-3 border-b border-zinc-100 px-5 py-4"><span className={`grid size-7 place-items-center rounded-full text-xs font-bold ${done ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>{done ? <Check className="size-3.5" /> : number}</span><h3 className="font-semibold text-zinc-950">{title}</h3></header><div className="p-5">{children}</div></section>;
}

function LineEditor({ line, index, onChange, onRemove }: { line: DraftLine; index: number; onChange: (value: Partial<DraftLine>) => void; onRemove: () => void }) {
  return <div className="rounded-xl border border-zinc-200 p-4"><div className="mb-3 flex items-center justify-between"><span className="font-mono text-xs font-bold text-zinc-400">POS {String(index + 1).padStart(2, '0')}</span><button type="button" onClick={onRemove} className="grid size-11 place-items-center rounded-lg text-zinc-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Position ${index + 1} entfernen`}><Trash2 className="size-4" /></button></div><Field label="Bezeichnung" required><input required value={line.name} onChange={event => onChange({ name: event.target.value })} className="admin-input" /></Field><div className="mt-3"><Field label="Beschreibung"><textarea value={line.description} onChange={event => onChange({ description: event.target.value })} className="admin-input min-h-20 resize-y" /></Field></div><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4"><Field label="Menge"><input type="number" min="0.001" step="0.001" value={line.quantity} onChange={event => onChange({ quantity: Number(event.target.value) })} className="admin-input text-right" /></Field><Field label="Einheit"><select value={`${line.unitCode}|${line.unitLabel}`} onChange={event => { const [unitCode, unitLabel] = event.target.value.split('|'); onChange({ unitCode, unitLabel }); }} className="admin-input"><option value="C62|Stück">Stück</option><option value="HUR|Stunde">Stunde</option><option value="DAY|Tag">Tag</option><option value="MON|Monat">Monat</option><option value="LS|Pauschal">Pauschal</option></select></Field><Field label="Netto / Einheit"><input type="number" min="0" step="0.01" value={(line.unitPriceNetCents / 100).toFixed(2)} onChange={event => onChange({ unitPriceNetCents: Math.round(Number(event.target.value) * 100) })} className="admin-input text-right" /></Field><Field label="USt."><select value={line.taxRateBasisPoints} onChange={event => onChange({ taxRateBasisPoints: Number(event.target.value) })} className="admin-input"><option value={1900}>19 %</option><option value={700}>7 %</option><option value={0}>0 %</option></select></Field></div><div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 text-sm"><span className="text-zinc-500">Positionssumme</span><strong className="text-zinc-900">{money(lineNet(line))}</strong></div></div>;
}

function lineNet(line: DraftLine) { return Math.round(line.quantity * line.unitPriceNetCents * (1 - line.discountBasisPoints / 10000)); }
function calculateDraftTotals(lines: DraftLine[]) { const net = lines.reduce((sum, line) => sum + lineNet(line), 0); const tax = lines.reduce((sum, line) => sum + Math.round(lineNet(line) * line.taxRateBasisPoints / 10000), 0); return { net, tax, gross: net + tax }; }
function TotalRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) { return <div className={`flex items-center justify-between ${strong ? 'border-t border-zinc-200 pt-2 text-base font-bold text-zinc-950' : 'text-zinc-600'}`}><span>{label}</span><span>{value}</span></div>; }

function InvoicePaper({ settings, form, customer, totals }: { settings: WorkspaceData['settings']; form: DraftForm; customer?: Customer; totals: { net: number; tax: number; gross: number } }) {
  const address = (customer?.defaultBillingAddress || {}) as Record<string, string | undefined>;
  const hiddenLineCount = Math.max(0, form.lines.length - 7);
  return <article className="mx-auto flex aspect-[210/297] w-full flex-col overflow-hidden rounded-[3px] border border-stone-200 bg-[#fffdfa] px-[7%] py-[7%] text-[clamp(8px,1vw,12px)] leading-relaxed text-slate-700 shadow-[0_18px_55px_-25px_rgba(15,23,42,.35)]">
    <header className="flex min-h-[12%] items-start justify-between border-b border-slate-200 pb-[4%]">{settings.logoUrl ? <img src={settings.logoUrl} alt="" className="max-h-12 max-w-[34%] object-contain object-left" /> : <div><p className="text-[1.2em] font-bold tracking-tight text-slate-950">{settings.companyName || 'Ihr Unternehmen'}</p><p className="mt-1 text-[.8em] text-slate-400">RECHNUNG</p></div>}<div className="text-right text-[.82em] leading-[1.6]"><strong className="text-slate-900">{settings.companyName || 'Firmendaten ergänzen'}</strong><br />{settings.street}<br />{settings.postalCode} {settings.city}</div></header>
    <div className="grid min-h-[24%] grid-cols-[1.2fr_.8fr] gap-[8%] pt-[5%]"><div><p className="mb-3 border-b border-slate-300 pb-1 text-[.7em] text-slate-400">{settings.companyName} · {settings.street} · {settings.postalCode} {settings.city}</p><p className="font-semibold text-slate-950">{customerName(customer)}</p><p>{address.street || 'Rechnungsanschrift'}</p>{address.addressLine2 ? <p>{address.addressLine2}</p> : null}<p>{address.zip} {address.city}</p></div><dl className="grid grid-cols-[1fr_auto] content-start gap-x-4 gap-y-1 text-[.83em]"><dt className="text-slate-400">Rechnung</dt><dd className="font-mono text-slate-700">wird vergeben</dd><dt className="text-slate-400">Datum</dt><dd>{shortDate(form.issueDate)}</dd><dt className="text-slate-400">Leistung</dt><dd>{shortDate(form.serviceDateFrom)}</dd><dt className="text-slate-400">Fällig</dt><dd>{shortDate(form.dueDate)}</dd></dl></div>
    <div className="min-h-[10%] pt-[3%]"><h2 className="text-[1.5em] font-bold tracking-tight text-slate-950">Rechnung</h2>{form.introText ? <p className="mt-2 max-w-[85%] text-[.88em]">{form.introText}</p> : null}</div>
    <table className="mt-[3%] w-full table-fixed border-collapse text-[.78em]"><thead><tr className="border-b border-slate-400 text-left text-[.85em] uppercase tracking-[.08em] text-slate-400"><th className="w-[8%] py-2">Pos.</th><th className="w-[47%] py-2">Leistung</th><th className="w-[13%] py-2 text-right">Menge</th><th className="w-[16%] py-2 text-right">Preis</th><th className="w-[16%] py-2 text-right">Summe</th></tr></thead><tbody>{form.lines.length ? <>{form.lines.slice(0, 7).map((line, index) => <tr key={index} className="border-b border-slate-100 align-top"><td className="py-2 font-mono text-slate-400">{index + 1}</td><td className="py-2 pr-2"><strong className="font-semibold text-slate-800">{line.name || 'Neue Position'}</strong>{line.description ? <span className="mt-0.5 block line-clamp-2 text-[.88em] text-slate-500">{line.description}</span> : null}</td><td className="py-2 text-right">{line.quantity} {line.unitLabel}</td><td className="py-2 text-right">{money(line.unitPriceNetCents)}</td><td className="py-2 text-right font-semibold text-slate-800">{money(lineNet(line))}</td></tr>)}{hiddenLineCount ? <tr><td colSpan={5} className="border-b border-slate-100 py-2 text-center font-semibold text-blue-700">+ {hiddenLineCount} weitere {hiddenLineCount === 1 ? 'Position' : 'Positionen'} auf Folgeseiten</td></tr> : null}</> : <tr><td colSpan={5} className="py-8 text-center text-slate-400">Positionen hinzufügen</td></tr>}</tbody></table>
    <div className="ml-auto mt-[4%] w-[42%] space-y-1 text-[.82em]"><TotalRow label="Netto" value={money(totals.net)} /><TotalRow label="Umsatzsteuer" value={money(totals.tax)} /><div className="mt-2 flex justify-between border-t-2 border-slate-800 pt-2 text-[1.15em] font-bold text-slate-950"><span>Gesamt</span><span>{money(totals.gross)}</span></div></div>
    <div className="mt-[5%] min-h-[9%] text-[.78em]">{form.closingText ? <p>{form.closingText}</p> : null}</div>
    <footer className="mt-auto grid grid-cols-3 gap-4 border-t border-slate-200 pt-[3%] text-[.64em] leading-[1.5] text-slate-400"><p>{settings.email}<br />{settings.website}</p><p>{settings.accountHolder}<br />{settings.iban}</p><p>{settings.taxNumber ? `St-Nr. ${settings.taxNumber}` : settings.vatId ? `USt-IdNr. ${settings.vatId}` : 'Steuerangabe ergänzen'}</p>{settings.defaultFooter ? <p className="col-span-3 whitespace-pre-line border-t border-slate-100 pt-2">{settings.defaultFooter}</p> : null}</footer>
  </article>;
}

function FinalDocument({ detail, data, onBack, onOpenDocument, onRefresh }: { detail: DocumentDetail; data: WorkspaceData; onBack: () => void; onOpenDocument: (id: string) => void; onRefresh: (message?: string) => void }) {
  const document = detail.document;
  const snapshot = (document.customerSnapshot || {}) as Record<string, unknown>;
  const recipientDefault = typeof snapshot.email === 'string' ? snapshot.email : (document.customerId ? data.customers.find(customer => customer.id === document.customerId)?.email || '' : '');
  const [recipient, setRecipient] = useState(recipientDefault);
  const [sendOpen, setSendOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isPending, startTransition] = useTransition();
  const isInvoice = document.documentType === 'invoice';
  const cancellationDocument = isInvoice ? data.documents.find(item => item.originalDocumentId === document.id && item.documentType === 'cancellation') : undefined;
  const pdfUrl = `/api/billing/documents/${document.id}/pdf`;
  const xmlUrl = `/api/billing/documents/${document.id}/xrechnung`;
  function reload(message: string) { toast.success(message); onRefresh(); window.setTimeout(() => window.location.reload(), 350); }
  function send() { startTransition(async () => { try { await sendBillingDocumentAction(document.id, recipient, crypto.randomUUID()); setSendOpen(false); reload('Rechnung mit PDF und XRechnung versendet'); } catch (sendError) { toast.error('Versand nicht abgeschlossen', { description: errorMessage(sendError) }); } }); }
  function markPaid() { startTransition(async () => { try { await markBillingDocumentPaidAction(document.id); reload('Zahlungseingang dokumentiert'); } catch (paidError) { toast.error('Status konnte nicht geändert werden', { description: errorMessage(paidError) }); } }); }
  function cancel() { startTransition(async () => { try { const result = await cancelBillingDocumentAction(document.id, cancelReason); setCancelOpen(false); toast.success('Stornorechnung wurde erstellt und festgeschrieben'); onRefresh(); onOpenDocument(result.cancellationId); } catch (cancelError) { toast.error('Storno konnte nicht erstellt werden', { description: errorMessage(cancelError) }); } }); }
  const timeline = [
    { label: 'Festgeschrieben', value: document.finalizedAt, icon: FileCheck2 },
    { label: 'Versendet', value: document.sentAt, icon: Send },
    { label: 'Bezahlt', value: document.paidAt, icon: CheckCircle2 },
    { label: 'Storniert', value: document.cancelledAt, icon: X },
  ].filter(item => item.value);
  return <div>
    <div className="mb-6 flex flex-col gap-5 border-b border-zinc-200 pb-5 xl:flex-row xl:items-end xl:justify-between"><div><button type="button" onClick={onBack} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900"><ArrowLeft className="size-4" /> Rechnungen</button><div className="mt-2 flex flex-wrap items-center gap-3"><h2 className="font-mono text-2xl font-bold tracking-tight text-zinc-950">{document.documentNumber}</h2><StatusPill status={document.status} /></div><p className="mt-1 text-sm text-zinc-500">{isInvoice ? 'Rechnung' : 'Stornorechnung'} · {shortDate(document.issueDate)} · {money(document.totalGrossCents)}</p></div>
      <div className="flex flex-wrap gap-2"><a href={`${pdfUrl}?download=1`} className="admin-btn-secondary min-h-11"><Download className="size-4" /> PDF</a><a href={xmlUrl} className="admin-btn-secondary min-h-11"><FileText className="size-4" /> XRechnung</a>{document.status !== 'cancelled' ? <button onClick={() => setSendOpen(true)} className="admin-btn-primary min-h-11"><Mail className="size-4" /> Versenden</button> : null}</div>
    </div>
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">
      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200"><div className="flex items-center justify-between bg-white px-4 py-3"><div className="flex items-center gap-2 text-sm font-semibold text-zinc-800"><Eye className="size-4 text-blue-600" /> PDF-Vorschau</div><a href={pdfUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-700">In neuem Tab öffnen</a></div><iframe src={pdfUrl} title={`PDF-Vorschau ${document.documentNumber}`} className="h-[720px] w-full bg-white" /></section>
      <aside className="space-y-4 xl:sticky xl:top-5">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5"><h3 className="text-sm font-semibold text-zinc-950">Belegverlauf</h3><ol className="mt-4 space-y-0">{timeline.map((item, index) => <li key={item.label} className="relative flex gap-3 pb-5 last:pb-0">{index < timeline.length - 1 ? <span className="absolute left-[15px] top-8 h-[calc(100%-24px)] w-px bg-zinc-200" /> : null}<span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"><item.icon className="size-4" /></span><span><span className="block text-sm font-semibold text-zinc-800">{item.label}</span><span className="mt-0.5 block text-xs text-zinc-400">{shortDate(item.value)}</span></span></li>)}</ol>{cancellationDocument ? <button type="button" onClick={() => onOpenDocument(cancellationDocument.id)} className="mt-4 inline-flex min-h-11 w-full items-center justify-between rounded-xl bg-rose-50 px-3 text-sm font-semibold text-rose-800 hover:bg-rose-100"><span>Stornorechnung {cancellationDocument.documentNumber}</span><ArrowRight className="size-4" /></button> : null}</section>
        <section className="rounded-2xl border border-zinc-200 bg-white p-5"><h3 className="text-sm font-semibold text-zinc-950">Betrag</h3><div className="mt-4 space-y-2"><TotalRow label="Netto" value={money(document.subtotalNetCents)} /><TotalRow label="Umsatzsteuer" value={money(document.taxCents)} /><TotalRow label="Gesamt" value={money(document.totalGrossCents)} strong /></div>{isInvoice && ['finalized', 'sent'].includes(document.status) ? <button onClick={markPaid} disabled={isPending} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"><Banknote className="size-4" /> Als bezahlt markieren</button> : null}</section>
        <section className="rounded-2xl border border-zinc-200 bg-white p-5"><div className="flex gap-3"><ShieldCheck className="size-5 shrink-0 text-blue-600" /><p className="text-xs leading-5 text-zinc-500">Dieser Beleg ist festgeschrieben. Gespeicherte PDF- und XML-Fassung sowie der dokumentierte Verlauf bleiben unverändert.</p></div></section>
        {isInvoice && !['cancelled'].includes(document.status) ? <button onClick={() => setCancelOpen(true)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-rose-700 hover:bg-rose-50"><X className="size-4" /> Rechnung stornieren</button> : null}
      </aside>
    </div>
    <Dialog open={sendOpen} onClose={() => setSendOpen(false)} title="Rechnung versenden" description="PDF und strukturierte XRechnung werden gemeinsam angehängt.">
      <Field label="Empfänger" required><input autoFocus required type="email" value={recipient} onChange={event => setRecipient(event.target.value)} className="admin-input" /></Field><div className="mt-4 flex items-start gap-3 rounded-xl bg-zinc-50 p-4"><Mail className="mt-0.5 size-5 text-zinc-500" /><p className="text-sm leading-6 text-zinc-600">Versand über Ihren sicheren SMTP-Zugang. Bei einem unklaren Serverstatus wird kein automatischer Zweitversand ausgelöst.</p></div><div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button onClick={() => setSendOpen(false)} className="admin-btn-secondary min-h-11">Abbrechen</button><button disabled={isPending || !recipient} onClick={send} className="admin-btn-primary min-h-11">{isPending ? 'Wird versendet …' : 'Jetzt versenden'}</button></div>
    </Dialog>
    <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} title="Rechnung stornieren" description="Das Original bleibt erhalten und wird durch eine verknüpfte Stornorechnung korrigiert.">
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900"><strong>Das Original wird nicht gelöscht.</strong> Eine neue, festgeschriebene Stornorechnung erhält eine eigene fortlaufende Nummer.</div><div className="mt-4"><Field label="Grund für das Storno" required><textarea autoFocus required minLength={3} value={cancelReason} onChange={event => setCancelReason(event.target.value)} className="admin-input min-h-28 resize-y" placeholder="z. B. Auftrag wurde vollständig zurückgenommen" /></Field></div><div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button onClick={() => setCancelOpen(false)} className="admin-btn-secondary min-h-11">Abbrechen</button><button disabled={isPending || cancelReason.trim().length < 3} onClick={cancel} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50">{isPending ? 'Wird storniert …' : 'Stornorechnung erstellen'}</button></div>
    </Dialog>
  </div>;
}

function Dialog({ open, onClose, title, description, size = 'md', children }: { open: boolean; onClose: () => void; title: string; description?: string; size?: 'md' | 'xl'; children: ReactNode }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') || []);
    window.setTimeout(() => (dialog?.querySelector<HTMLElement>('[autofocus]') || focusable()[0])?.focus(), 0);
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); return; }
      if (event.key !== 'Tab') return;
      const items = focusable(); if (!items.length) return;
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); window.setTimeout(() => returnFocus.current?.focus(), 0); };
  }, [open]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-3 sm:p-6" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="billing-dialog-title" className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6 ${size === 'xl' ? 'max-w-4xl' : 'max-w-lg'}`}><header className="mb-5 flex items-start justify-between gap-5"><div><h2 id="billing-dialog-title" className="text-xl font-semibold tracking-tight text-zinc-950">{title}</h2>{description ? <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p> : null}</div><button onClick={onClose} className="grid size-11 shrink-0 place-items-center rounded-xl text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700" aria-label="Dialog schließen"><X className="size-5" /></button></header>{children}</div></div>;
}

function DialogActions({ onCancel, pending, submitLabel, compact = false }: { onCancel: () => void; pending: boolean; submitLabel: string; compact?: boolean }) {
  return <div className={`flex flex-col-reverse gap-2 sm:flex-row sm:justify-end ${compact ? '' : 'border-t border-zinc-200 pt-5'}`}><button type="button" onClick={onCancel} className="admin-btn-secondary min-h-11">Abbrechen</button><button type="submit" disabled={pending} className="admin-btn-primary min-h-11">{pending ? 'Wird gespeichert …' : submitLabel}</button></div>;
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-zinc-700">{label}{required ? <span className="ml-1 text-blue-600">*</span> : null}</span>{children}{hint ? <span className="mt-1.5 block text-[11px] leading-4 text-zinc-400">{hint}</span> : null}</label>;
}
