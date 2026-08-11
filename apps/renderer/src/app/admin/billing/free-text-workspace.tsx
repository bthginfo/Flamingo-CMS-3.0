'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { FontSize, TextStyle } from '@tiptap/extension-text-style';
import { ArrowLeft, Bold, Check, Download, Eye, FilePenLine, Italic, Link2, List, ListOrdered, Loader2, Plus, Redo2, Save, Trash2, Underline as UnderlineIcon, Undo2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from 'react';
import { toast } from 'sonner';
import { FREE_TEXT_FONT_SIZES, FREE_TEXT_RECIPIENT_LINE_HEIGHT, freeTextRecipientFromCustomer, layoutFreeTextDocument, layoutFreeTextHeader, resolveFreeTextPreviewParties, type FreeTextDocument, type FreeTextLayoutSegment, type FreeTextNode } from '@/lib/billing-free-text-document';
import {
  createFreeTextDocumentAction, deleteFreeTextDocumentAction, finalizeFreeTextDocumentAction,
  getFreeTextDocumentAction, listFreeTextDocumentsAction, saveFreeTextDocumentAction,
} from './free-text-actions';

type Customer = { id: string; name: string; companyName: string | null; email: string; defaultBillingAddress: unknown };
type Settings = { companyName: string | null; street: string | null; postalCode: string | null; city: string | null; email: string | null; phone: string | null; website: string | null; logoUrl: string | null };
type Row = Awaited<ReturnType<typeof listFreeTextDocumentsAction>>[number];
type Detail = Awaited<ReturnType<typeof getFreeTextDocumentAction>>;
type Recipient = { displayName: string; contactLine?: string; street: string; addressLine2?: string; postalCode: string; city: string; countryCode: string; email?: string };

const field = 'min-h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-zinc-50 disabled:text-zinc-500';

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Die Aktion konnte nicht abgeschlossen werden.';
}

function dateValue(value: Date | string) { return new Date(value).toISOString().slice(0, 10); }
function shortDate(value: Date | string | null) { return value ? new Intl.DateTimeFormat('de-DE').format(new Date(value)) : '\u2013'; }
function formattedDate(value: string) { const date = new Date(value); return value && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat('de-DE').format(date) : ''; }

export function FreeTextWorkspace({ customers, settings, documentId, onOpen, onBack }: { customers: Customer[]; settings: Settings; documentId: string | null; onOpen: (id: string) => void; onBack: () => void }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'finalizing' | 'finalized'>('all');
  const [updatedAfter, setUpdatedAfter] = useState('');

  const refresh = () => startTransition(async () => {
    try { setRows(await listFreeTextDocumentsAction()); setError(null); }
    catch (nextError) { setError(errorMessage(nextError)); }
  });
  useEffect(() => { refresh(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const filteredRows = useMemo(() => (rows || []).filter(row => {
    const recipient = (row.recipientSnapshot || row.recipientDraft || {}) as Partial<Recipient>;
    const customer = customers.find(item => item.id === row.customerId);
    const haystack = [row.title, row.subject, recipient.displayName, customer?.companyName, customer?.name].filter(Boolean).join(' ').toLocaleLowerCase('de');
    return (statusFilter === 'all' || row.status === statusFilter)
      && (!query.trim() || haystack.includes(query.trim().toLocaleLowerCase('de')))
      && (!updatedAfter || new Date(row.updatedAt) >= new Date(`${updatedAfter}T00:00:00`));
  }), [customers, query, rows, statusFilter, updatedAfter]);

  async function create() {
    const result = await createFreeTextDocumentAction();
    if (!result.success) return toast.error(result.error);
    onOpen(result.id);
  }

  if (documentId) return <Composer id={documentId} customers={customers} settings={settings} onBack={() => { onBack(); refresh(); }} />;
  return (
    <section aria-labelledby="free-text-title">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">Korrespondenz</p>
          <h2 id="free-text-title" className="text-2xl font-bold tracking-tight text-zinc-950">Schreiben</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-500">Professionelle Briefe auf Ihrem Firmenbriefbogen &ndash; frei formuliert und automatisch auf A4-Seiten verteilt.</p>
        </div>
        <button type="button" disabled={pending} onClick={() => void create()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:opacity-50"><Plus className="size-4" /> Freitext-Dokument</button>
      </div>
      <div className="mb-4 grid gap-2 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm sm:grid-cols-[minmax(180px,1fr)_160px_170px]" aria-label="Schreiben filtern">
        <label className="text-xs font-semibold text-zinc-600">Suche<input className={`${field} mt-1`} value={query} onChange={event => setQuery(event.target.value)} placeholder="Titel, Betreff, Empfänger" /></label>
        <label className="text-xs font-semibold text-zinc-600">Status<select className={`${field} mt-1`} value={statusFilter} onChange={event => setStatusFilter(event.target.value as typeof statusFilter)}><option value="all">Alle</option><option value="draft">Entw&#252;rfe</option><option value="finalizing">In Verarbeitung</option><option value="finalized">PDF verf&#252;gbar</option></select></label>
        <label className="text-xs font-semibold text-zinc-600">Bearbeitet ab<input type="date" className={`${field} mt-1`} value={updatedAfter} onChange={event => setUpdatedAfter(event.target.value)} /></label>
      </div>
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {rows === null && !error ? <State icon={<Loader2 className="animate-spin" />} title="Schreiben werden geladen" text={'Ihre bearbeitbaren Schreiben und PDF-Dateien werden vorbereitet.'} /> : null}
        {error ? <State icon={<FilePenLine />} title="Schreiben konnten nicht geladen werden" text={error} action={<button onClick={refresh} className="text-sm font-semibold text-blue-700">Erneut versuchen</button>} /> : null}
        {rows?.length === 0 ? <State icon={<FilePenLine />} title="Noch kein Schreiben" text={'Erstellen Sie Ihren ersten Gesch\u00e4ftsbrief. Inhalt, Empf\u00e4nger und PDF k\u00f6nnen Sie jederzeit aktualisieren.'} action={<button onClick={() => void create()} className="text-sm font-semibold text-blue-700">Erstes Schreiben anlegen</button>} /> : null}
        {rows?.length && !filteredRows.length ? <State icon={<FilePenLine />} title="Keine passenden Schreiben" text="Passen Sie Suche, Status oder Datum an." /> : null}
        {filteredRows.length ? <div className="divide-y divide-zinc-100">{filteredRows.map(row => {
          const recipient = (row.recipientSnapshot || row.recipientDraft || {}) as Partial<Recipient>;
          const customer = customers.find(item => item.id === row.customerId);
          return <button key={row.id} type="button" onClick={() => onOpen(row.id)} className="grid w-full gap-2 px-4 py-4 text-left transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 sm:grid-cols-[minmax(0,1fr)_180px_150px_auto] sm:items-center sm:px-5">
            <span className="min-w-0"><span className="block truncate text-sm font-semibold text-zinc-950">{row.title}</span><span className="mt-0.5 block truncate text-xs text-zinc-500">{row.subject || 'Ohne Betreff'}</span></span>
            <span className="truncate text-xs text-zinc-600">{recipient.displayName || customer?.companyName || customer?.name || (row.recipientMode === 'customer' ? 'Kunde ausw\u00e4hlen' : 'Empf\u00e4nger angeben')}</span>
            <span className="text-xs text-zinc-500">{row.status === 'finalized' ? `Festgeschrieben ${shortDate(row.finalizedAt)}` : row.status === 'finalizing' ? 'PDF wird erzeugt' : `Bearbeitet ${shortDate(row.updatedAt)}`}</span>
            <span className={`w-fit rounded-lg px-2 py-1 text-[11px] font-semibold ring-1 ring-inset ${row.status === 'finalized' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-amber-50 text-amber-800 ring-amber-200'}`}>{row.status === 'finalized' ? 'Final' : row.status === 'finalizing' ? 'In Verarbeitung' : 'Entwurf'}</span>
          </button>;
        })}</div> : null}
      </div>
    </section>
  );
}

function State({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return <div className="grid min-h-72 place-items-center p-8 text-center"><div><span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">{icon}</span><h3 className="font-semibold text-zinc-950">{title}</h3><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-zinc-500">{text}</p>{action ? <div className="mt-4">{action}</div> : null}</div></div>;
}

function Composer({ id, customers, settings, onBack }: { id: string; customers: Customer[]; settings: Settings; onBack: () => void }) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [mobilePreview, setMobilePreview] = useState(false);
  const [confirmFinalize, setConfirmFinalize] = useState(false);
  useEffect(() => { let active = true; getFreeTextDocumentAction(id).then(value => active && setDetail(value)).catch(error => active && setLoadError(errorMessage(error))); return () => { active = false; }; }, [id]);
  if (loadError) return <State icon={<FilePenLine />} title={'Schreiben nicht verf\u00fcgbar'} text={loadError} action={<button onClick={onBack} className="text-sm font-semibold text-blue-700">Zur&uuml;ck zur Liste</button>} />;
  if (!detail) return <State icon={<Loader2 className="animate-spin" />} title="Schreibstudio wird geladen" text="Briefbogen und Inhalt werden vorbereitet." />;
  return <ComposerLoaded detail={detail} customers={customers} settings={settings} pending={pending} startTransition={startTransition} mobilePreview={mobilePreview} setMobilePreview={setMobilePreview} confirmFinalize={confirmFinalize} setConfirmFinalize={setConfirmFinalize} onBack={onBack} />;
}

function ComposerLoaded({ detail, customers, settings, pending, startTransition, mobilePreview, setMobilePreview, confirmFinalize, setConfirmFinalize, onBack }: {
  detail: Detail; customers: Customer[]; settings: Settings; pending: boolean; startTransition: (callback: () => void | Promise<void>) => void;
  mobilePreview: boolean; setMobilePreview: (value: boolean) => void; confirmFinalize: boolean; setConfirmFinalize: (value: boolean) => void; onBack: () => void;
}) {
  const finalized = detail.status === 'finalized';
  const locked = detail.status === 'finalizing';
  const finalizeTriggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const [title, setTitle] = useState(detail.title);
  const [subject, setSubject] = useState(detail.subject);
  const [issueDate, setIssueDate] = useState(dateValue(detail.issueDate));
  const [mode, setMode] = useState<'customer' | 'custom'>(detail.recipientMode as 'customer' | 'custom');
  const [customerId, setCustomerId] = useState(detail.customerId || '');
  const [recipient, setRecipient] = useState<Recipient>(() => ({ displayName: '', street: '', postalCode: '', city: '', countryCode: 'DE', ...((detail.recipientSnapshot || detail.recipientDraft || {}) as Partial<Recipient>) }));
  const [content, setContent] = useState<FreeTextDocument>(() => detail.content as FreeTextDocument);
  const selectedCustomer = customers.find(customer => customer.id === customerId);
  const livePreviewRecipient: Recipient = mode === 'customer' && selectedCustomer
    ? freeTextRecipientFromCustomer(selectedCustomer)
    : mode === 'customer' ? { displayName: 'Empf\u00e4nger', street: '', postalCode: '', city: '', countryCode: 'DE' } : recipient;
  const previewParties = resolveFreeTextPreviewParties({
    status: locked ? detail.status : 'draft',
    liveSeller: settings,
    liveRecipient: livePreviewRecipient,
    sellerSnapshot: detail.sellerSnapshot as Settings | null,
    recipientSnapshot: detail.recipientSnapshot as Recipient | null,
  });
  const previewRecipient = previewParties.recipient;
  const payload = () => ({ id: detail.id, recipientMode: mode, customerId: customerId || null, recipient: mode === 'custom' ? recipient : null, title, subject, issueDate, content });

  const run = (task: () => Promise<{ success: boolean; error?: string }>, success: string, after?: () => void) => startTransition(async () => {
    const result = await task();
    if (!result.success) { toast.error(result.error || 'Aktion fehlgeschlagen'); return; }
    toast.success(success); after?.();
  });
  const save = () => run(() => saveFreeTextDocumentAction(payload()), '\u00c4nderungen gespeichert', () => window.location.reload());
  const finalize = () => run(() => finalizeFreeTextDocumentAction(payload()), 'PDF erstellt', () => window.location.reload());
  const remove = () => { if (window.confirm('Dieses Schreiben mit seiner PDF-Datei wirklich l\u00f6schen?')) run(() => deleteFreeTextDocumentAction(detail.id), 'Schreiben gel\u00f6scht', onBack); };
  useEffect(() => {
    if (!confirmFinalize) return;
    confirmRef.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setConfirmFinalize(false); finalizeTriggerRef.current?.focus(); return; }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const controls = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!controls.length) return;
      const first = controls[0]; const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.removeEventListener('keydown', keydown); finalizeTriggerRef.current?.focus(); };
  }, [confirmFinalize, setConfirmFinalize]);

  return <section>
    <header className="mb-5 flex flex-wrap items-center gap-3 border-b border-zinc-200 pb-5">
      <button type="button" onClick={onBack} className="grid size-10 place-items-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100" aria-label="Zurueck zur Schreiben-Liste"><ArrowLeft className="size-4" /></button>
      <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="truncate text-xl font-bold text-zinc-950">{title}</h2><span className={`rounded-lg px-2 py-1 text-[11px] font-semibold ${finalized ? 'bg-emerald-50 text-emerald-700' : locked ? 'bg-amber-50 text-amber-800' : 'bg-blue-50 text-blue-700'}`}>{finalized ? 'PDF verf&#252;gbar' : locked ? 'PDF wird erstellt' : 'Bearbeitbar'}</span></div><p className="mt-0.5 text-xs text-zinc-500">{locked ? 'Die PDF-Datei wird gerade erzeugt.' : finalized ? `${detail.pageCount || 1} PDF-Seite${detail.pageCount === 1 ? '' : 'n'} \u00b7 Schreiben bleibt bearbeitbar` : 'Speichern, als PDF ausgeben oder jederzeit l\u00f6schen.'}</p></div>
      <button type="button" onClick={() => setMobilePreview(!mobilePreview)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 lg:hidden"><Eye className="size-4" /> {mobilePreview ? 'Editor' : 'Vorschau'}</button>
      {finalized && !locked ? <a href={`/api/billing/free-text-documents/${detail.id}/pdf?download=1`} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-zinc-300 px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"><Download className="size-4" /> PDF herunterladen</a> : null}
      {!locked ? <button type="button" disabled={pending} onClick={save} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-zinc-300 px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"><Save className="size-4" /> &Auml;nderungen speichern</button> : null}
      {!locked ? <button ref={finalizeTriggerRef} type="button" disabled={pending} onClick={() => setConfirmFinalize(true)} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"><Check className="size-4" /> {finalized ? 'PDF aktualisieren' : 'PDF erstellen'}</button> : <button type="button" disabled={pending} onClick={finalize} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-50 px-3 text-sm font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-50"><Loader2 className={`size-4 ${pending ? 'animate-spin' : ''}`} /> Status pr&#252;fen</button>}    </header>
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(390px,0.82fr)]">
      <div className={`${mobilePreview ? 'hidden' : 'space-y-5'} lg:block`}>
        <Card title={'1. Empf\u00e4nger'} subtitle={'W\u00e4hlen Sie einen Kunden oder geben Sie eine einmalige Adresse an.'}>
          <div className="mb-4 inline-grid grid-cols-2 rounded-xl bg-zinc-100 p-1" role="group" aria-label="Empfaengerart">{(['customer', 'custom'] as const).map(value => <button key={value} type="button" disabled={locked} aria-pressed={mode === value} onClick={() => setMode(value)} className={`min-h-9 rounded-lg px-3 text-xs font-semibold transition ${mode === value ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}>{value === 'customer' ? 'Kunde' : 'Eigener Empf\u00e4nger'}</button>)}</div>
          {mode === 'customer' ? <label className="block text-xs font-semibold text-zinc-600">Kunde<select disabled={locked} className={`${field} mt-1`} value={customerId} onChange={event => setCustomerId(event.target.value)}><option value="">Bitte ausw&#228;hlen</option>{customers.map(customer => <option key={customer.id} value={customer.id}>{customer.companyName || customer.name}</option>)}</select>{selectedCustomer ? <span className="mt-2 block rounded-xl bg-zinc-50 p-3 font-normal leading-5 text-zinc-600">{previewRecipient.displayName}{previewRecipient.contactLine ? <><br />{previewRecipient.contactLine}</> : null}<br />{previewRecipient.street}{previewRecipient.addressLine2 ? <><br />{previewRecipient.addressLine2}</> : null}<br />{previewRecipient.postalCode} {previewRecipient.city}<br />{previewRecipient.countryCode}</span> : null}</label> : <div className="grid gap-3 sm:grid-cols-2"><TextField label="Firma / Name" value={recipient.displayName} setValue={value => setRecipient({ ...recipient, displayName: value })} disabled={locked} /><TextField label="Ansprechpartner (optional)" value={recipient.contactLine || ''} setValue={value => setRecipient({ ...recipient, contactLine: value })} disabled={locked} /><TextField label={'Stra\u00dfe'} value={recipient.street} setValue={value => setRecipient({ ...recipient, street: value })} disabled={locked} /><TextField label="Adresszusatz (optional)" value={recipient.addressLine2 || ''} setValue={value => setRecipient({ ...recipient, addressLine2: value })} disabled={locked} /><TextField label="Postleitzahl" value={recipient.postalCode} setValue={value => setRecipient({ ...recipient, postalCode: value })} disabled={locked} /><TextField label="Ort" value={recipient.city} setValue={value => setRecipient({ ...recipient, city: value })} disabled={locked} /><TextField label={'L\u00e4ndercode'} value={recipient.countryCode} setValue={value => setRecipient({ ...recipient, countryCode: value.toUpperCase().slice(0, 2) })} disabled={locked} /><TextField label="E-Mail (optional)" value={recipient.email || ''} setValue={value => setRecipient({ ...recipient, email: value })} disabled={locked} type="email" /></div>}
        </Card>
        <Card title="2. Dokument" subtitle="Titel hilft intern beim Wiederfinden; der Betreff erscheint im Schreiben."><div className="grid gap-3 sm:grid-cols-2"><TextField label="Interner Titel" value={title} setValue={setTitle} disabled={locked} /><TextField label="Ausstellungsdatum" value={issueDate} setValue={setIssueDate} disabled={locked} type="date" /><div className="sm:col-span-2"><TextField label="Betreff" value={subject} setValue={setSubject} disabled={locked} /></div></div></Card>
        <Card title="3. Schreiben" subtitle={'Nutzen Sie \u00dcberschriften und Listen sparsam \u2013 der Umbruch erfolgt automatisch.'}><DocumentEditor value={content} onChange={setContent} disabled={locked} /></Card>
        {!locked ? <button type="button" onClick={remove} className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 hover:text-rose-800"><Trash2 className="size-4" /> Schreiben l&#246;schen</button> : null}
      </div>
      <div className={`${mobilePreview ? 'block' : 'hidden'} lg:sticky lg:top-5 lg:block`}><A4Preview settings={previewParties.seller} recipient={previewRecipient} title={title} subject={subject} issueDate={issueDate} content={content} pageCount={detail.pageCount || undefined} /></div>
    </div>
    {confirmFinalize ? <div ref={dialogRef} className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/45 p-4" role="dialog" aria-modal="true" aria-labelledby="finalize-title" aria-describedby="finalize-description"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><span className="mb-4 grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><Check /></span><h3 id="finalize-title" className="text-lg font-bold text-zinc-950">PDF erstellen?</h3><p id="finalize-description" className="mt-2 text-sm leading-6 text-zinc-600">Die aktuelle Fassung wird als PDF erzeugt. Das Schreiben bleibt danach bearbeitbar und kann erneut als PDF ausgegeben oder gel&#246;scht werden.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setConfirmFinalize(false)} className="min-h-10 rounded-xl border border-zinc-200 px-4 text-sm font-semibold">Abbrechen</button><button ref={confirmRef} disabled={pending} onClick={() => { setConfirmFinalize(false); finalize(); }} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white">{pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} PDF erstellen</button></div></div></div> : null}
  </section>;
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) { return <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5"><h3 className="text-sm font-bold text-zinc-950">{title}</h3><p className="mb-4 mt-1 text-xs leading-5 text-zinc-500">{subtitle}</p>{children}</section>; }
function TextField({ label, value, setValue, disabled, type = 'text' }: { label: string; value: string; setValue: (value: string) => void; disabled: boolean; type?: string }) { return <label className="block text-xs font-semibold text-zinc-600">{label}<input type={type} disabled={disabled} value={value} onChange={event => setValue(event.target.value)} className={`${field} mt-1`} /></label>; }

function fromEditorJson(value: any): FreeTextDocument {
  const convert = (node: any): FreeTextNode => ({
    type: node.type,
    ...(node.attrs?.level ? { attrs: { level: node.attrs.level } } : {}),
    ...(node.text !== undefined ? { text: node.text } : {}),
    ...(node.marks?.length ? { marks: node.marks.flatMap((mark: any) => mark.type === 'textStyle' && mark.attrs?.fontSize ? [{ type: 'fontSize', attrs: { size: Number(String(mark.attrs.fontSize).replace('pt', '')) } }] : ['bold', 'italic', 'underline'].includes(mark.type) ? [{ type: mark.type }] : mark.type === 'link' ? [{ type: 'link', attrs: { href: mark.attrs?.href } }] : []) } : {}),
    ...(node.content ? { content: node.content.map(convert) } : {}),
  });
  return convert(value) as FreeTextDocument;
}
function toEditorJson(value: FreeTextNode): any { return { type: value.type, ...(value.attrs ? { attrs: value.attrs } : {}), ...(value.text !== undefined ? { text: value.text } : {}), ...(value.marks ? { marks: value.marks.map(mark => mark.type === 'fontSize' ? { type: 'textStyle', attrs: { fontSize: `${mark.attrs.size}pt` } } : mark.type === 'link' ? { type: 'link', attrs: mark.attrs } : { type: mark.type }) } : {}), ...(value.content ? { content: value.content.map(toEditorJson) } : {}) }; }

function DocumentEditor({ value, onChange, disabled }: { value: FreeTextDocument; onChange: (value: FreeTextDocument) => void; disabled: boolean }) {
  const callback = useRef(onChange); callback.current = onChange;
  const editor = useEditor({ immediatelyRender: false, editable: !disabled, extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3, 4] }, link: false, underline: false }), LinkExtension.configure({ openOnClick: false, protocols: ['http', 'https', 'mailto'] }), Underline, TextStyle, FontSize.configure({ types: ['textStyle'] })], content: toEditorJson(value), onUpdate: ({ editor: instance }) => callback.current(fromEditorJson(instance.getJSON())) });
  useEffect(() => { editor?.setEditable(!disabled); }, [editor, disabled]);
  if (!editor) return <div className="grid min-h-64 place-items-center text-sm text-zinc-500"><Loader2 className="size-5 animate-spin" /></div>;
  const button = (label: string, active: boolean | undefined, action: () => void, icon: ReactNode) => <button type="button" aria-label={label} title={label} {...(active === undefined ? {} : { 'aria-pressed': active })} disabled={disabled} onClick={action} className={`grid size-8 place-items-center rounded-lg transition disabled:opacity-40 ${active ? 'bg-blue-100 text-blue-700' : 'text-zinc-600 hover:bg-zinc-100'}`}>{icon}</button>;
  return <div className="max-h-[620px] overflow-y-auto rounded-xl border border-zinc-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100"><div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-50 p-2" role="toolbar" aria-label="Schreiben formatieren"><select disabled={disabled} aria-label="Absatzformat" value={editor.isActive('heading', { level: 1 }) ? 'h1' : editor.isActive('heading', { level: 2 }) ? 'h2' : editor.isActive('heading', { level: 3 }) ? 'h3' : editor.isActive('heading', { level: 4 }) ? 'h4' : 'p'} onChange={event => { const level = Number(event.target.value.slice(1)); if (level) editor.chain().focus().setHeading({ level: level as 1 | 2 | 3 | 4 }).run(); else editor.chain().focus().setParagraph().run(); }} className="h-8 rounded-lg border border-zinc-200 bg-white px-2 text-xs font-semibold text-zinc-700"><option value="p">Absatz</option><option value="h1">&#220;berschrift 1</option><option value="h2">&#220;berschrift 2</option><option value="h3">&#220;berschrift 3</option><option value="h4">&#220;berschrift 4</option></select><select disabled={disabled} aria-label="Schriftgroesse" defaultValue="11" onChange={event => editor.chain().focus().setFontSize(`${event.target.value}pt`).run()} className="h-8 rounded-lg border border-zinc-200 bg-white px-2 text-xs text-zinc-700">{FREE_TEXT_FONT_SIZES.map(size => <option key={size} value={size}>{size} pt</option>)}</select><span className="mx-1 h-5 w-px bg-zinc-200" />{button('Fett', editor.isActive('bold'), () => { editor.chain().focus().toggleBold().run(); }, <Bold className="size-4" />)}{button('Kursiv', editor.isActive('italic'), () => { editor.chain().focus().toggleItalic().run(); }, <Italic className="size-4" />)}{button('Unterstrichen', editor.isActive('underline'), () => { editor.chain().focus().toggleUnderline().run(); }, <UnderlineIcon className="size-4" />)}<span className="mx-1 h-5 w-px bg-zinc-200" />{button('Aufz\u00e4hlung', editor.isActive('bulletList'), () => { editor.chain().focus().toggleBulletList().run(); }, <List className="size-4" />)}{button('Nummerierte Liste', editor.isActive('orderedList'), () => { editor.chain().focus().toggleOrderedList().run(); }, <ListOrdered className="size-4" />)}{button('Link', editor.isActive('link'), () => { const href = window.prompt('Sichere URL eingeben', editor.getAttributes('link').href || 'https://'); if (href === '') editor.chain().focus().unsetLink().run(); else if (href) { try { const parsed = new URL(href); if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) throw new Error(); editor.chain().focus().extendMarkRange('link').setLink({ href }).run(); } catch { toast.error('Bitte nur http-, https- oder mailto-Links verwenden.'); } } }, <Link2 className="size-4" />)}<span className="mx-1 h-5 w-px bg-zinc-200" />{button('R\u00fcckg\u00e4ngig', undefined, () => { editor.chain().focus().undo().run(); }, <Undo2 className="size-4" />)}{button('Wiederholen', undefined, () => { editor.chain().focus().redo().run(); }, <Redo2 className="size-4" />)}</div><EditorContent editor={editor} className="prose prose-sm max-w-none bg-white p-5 [&_.tiptap]:min-h-[520px] [&_.tiptap]:outline-none [&_.tiptap_h1]:text-3xl [&_.tiptap_h2]:text-2xl [&_.tiptap_h3]:text-xl [&_.tiptap_h4]:text-base" /></div>;
}

function PreviewSegment({ segment }: { segment: FreeTextLayoutSegment }) {
  const style = { fontSize: `${segment.size}pt`, fontWeight: segment.bold ? 700 : 400, fontStyle: segment.italic ? 'italic' : 'normal', textDecoration: segment.underline || segment.link ? 'underline' : 'none' };
  return segment.link ? <a href={segment.link} target="_blank" rel="noopener noreferrer" className="text-blue-700" style={style}>{segment.text}</a> : <span style={style}>{segment.text}</span>;
}

function A4Preview({ settings, recipient, title, subject, issueDate, content, pageCount }: { settings: Settings; recipient: Recipient; title: string; subject: string; issueDate: string; content: FreeTextDocument; pageCount?: number }) {
  const header = useMemo(() => layoutFreeTextHeader(recipient, subject, title), [recipient, subject, title]);
  const layout = useMemo(() => layoutFreeTextDocument(content, { firstPageStartY: header.contentStartY }), [content, header.contentStartY]);
  const count = layout.pages.length;
  const topAt = (y: number, fontSize = 0) => `${((841.89 - y - fontSize) / 841.89) * 100}%`;
  const sellerAddress = [settings.street, [settings.postalCode, settings.city].filter(Boolean).join(' ')].filter(Boolean).join(' \u00b7 ');
  return <aside aria-label="A4-Vorschau"><div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">A4-Vorschau</span><span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">{count} {count === 1 ? 'Seite' : 'Seiten'}{pageCount && pageCount !== count ? ` (PDF: ${pageCount})` : ''}</span></div>{!header.fits ? <p className="mb-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">Empf&#228;nger oder Betreff sind zu lang f&#252;r den Briefkopf.</p> : null}<div className="max-h-[calc(100vh-170px)] space-y-4 overflow-y-auto rounded-2xl bg-zinc-200 p-3 shadow-inner">{layout.pages.map((layoutPage, pageIndex) => <article key={pageIndex} className="relative mx-auto aspect-[210/297] w-full max-w-[600px] overflow-hidden bg-white text-zinc-900 shadow-lg">
    <div className="absolute left-[9.4%] right-[9.4%] top-[4.7%] flex min-h-12 items-start justify-between gap-6">{pageIndex === 0 && settings.logoUrl ? <img src={settings.logoUrl} alt="" className="max-h-11 max-w-36 object-contain object-left-top" /> : <span className="max-w-[44%] truncate text-[7pt] font-semibold text-zinc-500">{pageIndex > 0 ? title : settings.companyName || 'Unternehmensname'}</span>}<div className="max-w-[48%] text-right"><strong className="block text-[9pt] leading-tight">{settings.companyName || 'Unternehmensname'}</strong>{pageIndex === 0 && sellerAddress ? <span className="mt-1 block text-[6.5pt] leading-tight text-zinc-500">{sellerAddress}</span> : null}</div></div>
    <div className="absolute left-[9.4%] right-[9.4%] border-t border-zinc-200" style={{ top: topAt(738) }}><span className="block w-12 border-t-2 border-blue-600" /></div>
    {pageIndex === 0 ? <><p className="absolute left-[9.4%] right-[9.4%] truncate text-[6.5pt] leading-none text-zinc-500" style={{ top: topAt(723, 6.5) }}>{settings.companyName} {'\u00b7'} {sellerAddress}</p><p className="absolute left-[9.4%] text-[6pt] font-bold uppercase tracking-[0.14em] text-blue-700" style={{ top: topAt(698, 6) }}>EMPF&#196;NGER</p><p className="absolute right-[9.4%] text-right text-[6pt] font-bold uppercase tracking-[0.14em] text-blue-700" style={{ top: topAt(698, 6) }}>Datum</p>{header.recipientLines.map((line, index) => <p key={`recipient-${index}`} className={`absolute left-[9.4%] whitespace-pre text-[10pt] leading-none ${line.bold ? 'font-bold' : ''}`} style={{ top: topAt(header.recipientY - index * FREE_TEXT_RECIPIENT_LINE_HEIGHT, 10) }}>{line.text}</p>)}<p className="absolute right-[9.4%] text-right text-[9pt] text-zinc-600" style={{ top: topAt(header.recipientY, 9) }}>{formattedDate(issueDate)}</p><p className="absolute left-[9.4%] text-[6pt] font-bold uppercase tracking-[0.14em] text-blue-700" style={{ top: topAt(header.subjectLabelY, 6) }}>Betreff</p>{header.subjectLines.map((line, index) => <h2 key={`subject-${index}`} className="absolute left-[9.4%] whitespace-pre text-[15pt] font-bold leading-none" style={{ top: topAt(header.subjectY - index * 19, 15) }}>{line}</h2>)}</> : null}
    {layoutPage.lines.map((line, lineIndex) => <div key={lineIndex} className="absolute whitespace-pre" style={{ left: `${((56 + line.xOffset) / 595.28) * 100}%`, top: `${((841.89 - line.y - 10) / 841.89) * 100}%`, lineHeight: `${line.height}pt` }}>{line.prefix ? <span className="inline-block w-[18pt] text-[10.5pt]">{line.prefix}</span> : null}{line.segments.map((segment, segmentIndex) => <PreviewSegment key={segmentIndex} segment={segment} />)}</div>)}<footer className="absolute bottom-[4%] left-[9.4%] right-[9.4%] flex items-end justify-between border-t border-zinc-200 pt-2 text-[6pt] text-zinc-500"><span>{[settings.email, settings.phone, settings.website].filter(Boolean).join(' \u00b7 ')}</span><span>Seite {pageIndex + 1} von {count}</span></footer></article>)}</div></aside>;
}
