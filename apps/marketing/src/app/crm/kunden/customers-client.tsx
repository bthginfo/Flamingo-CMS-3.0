'use client';

import { useMemo, useState, useTransition } from 'react';
import { Banknote, CheckCircle2, Mail, Plus, Search, Trash2, UserPlus, X, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Lead } from '../leads/actions';
import {
  addCustomerPayment,
  convertLeadToCustomer,
  createCustomer,
  deleteCustomer,
  deleteCustomerPayment,
  updateCustomer,
  updateCustomerPayment,
  type CustomerWithPayments,
} from './actions';

type CustomerStatus = 'aktiv' | 'pausiert' | 'gekündigt';
type PaymentStatus = 'offen' | 'bezahlt' | 'überfällig' | 'storniert';

const STATUS_COLORS: Record<CustomerStatus, string> = {
  aktiv: 'bg-emerald-100 text-emerald-700',
  pausiert: 'bg-amber-100 text-amber-700',
  gekündigt: 'bg-slate-100 text-slate-600',
};

const PAYMENT_COLORS: Record<PaymentStatus, string> = {
  offen: 'bg-amber-100 text-amber-700',
  bezahlt: 'bg-emerald-100 text-emerald-700',
  überfällig: 'bg-red-100 text-red-700',
  storniert: 'bg-slate-100 text-slate-600',
};

function eur(cents: number | null | undefined) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format((cents || 0) / 100);
}

function toCents(value: string) {
  return Math.round(Number(value.replace(',', '.')) * 100) || 0;
}

function paymentTotals(customers: CustomerWithPayments[]) {
  const payments = customers.flatMap(customer => customer.payments);
  const paid = payments.filter(payment => payment.status === 'bezahlt').reduce((sum, payment) => sum + payment.amountCents, 0);
  const open = payments.filter(payment => payment.status === 'offen' || payment.status === 'überfällig').reduce((sum, payment) => sum + payment.amountCents, 0);
  const overdue = payments.filter(payment => payment.status === 'überfällig').reduce((sum, payment) => sum + payment.amountCents, 0);
  const mrr = customers.filter(customer => customer.status === 'aktiv').reduce((sum, customer) => sum + customer.hostingMonthlyCents, 0);
  return { paid, open, overdue, mrr, payments };
}

function errorMessage(error: unknown) {
  return error instanceof Error && error.message ? error.message : 'Die Aktion konnte nicht ausgeführt werden';
}

export function CustomersClient({ initialCustomers, leads }: { initialCustomers: CustomerWithPayments[]; leads: Lead[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | ''>('');
  const [packageFilter, setPackageFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'offenOderÜberfällig' | ''>('');
  const [editing, setEditing] = useState<CustomerWithPayments | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [convertLeadId, setConvertLeadId] = useState('');
  const [isPending, startTransition] = useTransition();
  const [emailCustomer, setEmailCustomer] = useState<CustomerWithPayments | null>(null);

  const packages = [...new Set(customers.map(customer => customer.packageName).filter(Boolean))] as string[];
  const openLeads = leads.filter(lead => !customers.some(customer => customer.leadId === lead.id));
  const totals = useMemo(() => paymentTotals(customers), [customers]);

  const filtered = customers.filter(customer => {
    if (statusFilter && customer.status !== statusFilter) return false;
    if (packageFilter && customer.packageName !== packageFilter) return false;
    if (paymentFilter) {
      const statuses = customer.payments.map(payment => payment.status);
      if (paymentFilter === 'offenOderÜberfällig') {
        if (!statuses.some(status => status === 'offen' || status === 'überfällig')) return false;
      } else if (!statuses.includes(paymentFilter)) return false;
    }
    if (query) {
      const haystack = [customer.company, customer.email, customer.location, customer.industry, customer.packageName, customer.contactFirstName, customer.contactLastName]
        .filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(query.toLowerCase())) return false;
    }
    return true;
  });

  function upsertCustomer(next: CustomerWithPayments) {
    setCustomers(current => current.some(customer => customer.id === next.id) ? current.map(customer => customer.id === next.id ? next : customer) : [next, ...current]);
  }

  function handleCreate(form: CustomerFormState) {
    startTransition(async () => {
      try {
        const created = await createCustomer(formToPayload(form));
        upsertCustomer(created);
        setShowNew(false);
        toast.success('Kunde angelegt');
      } catch (error) {
        toast.error(errorMessage(error));
      }
    });
  }

  function handleUpdate(form: CustomerFormState) {
    if (!editing) return;
    startTransition(async () => {
      try {
        const updated = await updateCustomer(editing.id, formToPayload(form));
        upsertCustomer(updated);
        setEditing(null);
        toast.success('Kunde gespeichert');
      } catch (error) {
        toast.error(errorMessage(error));
      }
    });
  }

  function handleConvert() {
    if (!convertLeadId) return;
    startTransition(async () => {
      try {
        const lead = openLeads.find(item => item.id === convertLeadId);
        const customer = await convertLeadToCustomer(convertLeadId, {
          packageName: 'Website Premium',
          setupPriceCents: 145000,
          hostingMonthlyCents: 4900,
          notes: lead ? `Aus Lead umgewandelt: ${lead.company}` : undefined,
        });
        upsertCustomer(customer);
        setConvertLeadId('');
        toast.success('Lead wurde in einen Kunden umgewandelt');
      } catch (error) {
        toast.error(errorMessage(error));
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Kunden wirklich löschen?')) return;
    startTransition(async () => {
      try {
        await deleteCustomer(id);
        setCustomers(customers.filter(customer => customer.id !== id));
        toast.success('Kunde gelöscht');
      } catch (error) {
        toast.error(errorMessage(error));
      }
    });
  }

  async function syncCustomer(id: string) {
    try {
      const updated = await updateCustomer(id, {});
      upsertCustomer(updated);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">CRM</p>
          <h1 className="text-2xl font-bold text-slate-900">Kunden</h1>
          <p className="mt-1 text-sm text-slate-500">Kunden, Pakete, Hosting-Umsatz und Zahlungslage an einem Ort.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select value={convertLeadId} onChange={event => setConvertLeadId(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">Lead umwandeln...</option>
            {openLeads.map(lead => <option key={lead.id} value={lead.id}>{lead.company}</option>)}
          </select>
          <button onClick={handleConvert} disabled={!convertLeadId || isPending} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
            <UserPlus size={16} /> Umwandeln
          </button>
          <button onClick={() => setShowNew(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus size={16} /> Neuer Kunde
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label="Kunden" value={customers.length} />
        <Metric label="Aktiv" value={customers.filter(customer => customer.status === 'aktiv').length} tone="green" />
        <Metric label="MRR Hosting" value={eur(totals.mrr)} tone="indigo" />
        <Metric label="Bezahlt" value={eur(totals.paid)} tone="green" />
        <Metric label="Offen" value={eur(totals.open)} tone={totals.overdue > 0 ? 'red' : 'amber'} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Kunde, Branche, Paket, Ort suchen..." className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
          </div>
          <select value={statusFilter} onChange={event => setStatusFilter(event.target.value as CustomerStatus | '')} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">Alle Status</option>
            <option value="aktiv">Aktiv</option>
            <option value="pausiert">Pausiert</option>
            <option value="gekündigt">Gekündigt</option>
          </select>
          <select value={packageFilter} onChange={event => setPackageFilter(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">Alle Pakete</option>
            {packages.map(pkg => <option key={pkg} value={pkg}>{pkg}</option>)}
          </select>
          <select value={paymentFilter} onChange={event => setPaymentFilter(event.target.value as PaymentStatus | 'offenOderÜberfällig' | '')} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">Alle Zahlungen</option>
            <option value="offenOderÜberfällig">Offen/überfällig</option>
            <option value="bezahlt">Bezahlt</option>
            <option value="storniert">Storniert</option>
          </select>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-400">
                <th className="px-4 py-3">Kunde</th>
                <th className="px-4 py-3">Paket</th>
                <th className="px-4 py-3">Setup</th>
                <th className="px-4 py-3">Hosting</th>
                <th className="px-4 py-3">Zahlungen</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(customer => <CustomerTableRow key={customer.id} customer={customer} onEdit={setEditing} onDelete={handleDelete} onMail={setEmailCustomer} onPaymentChange={syncCustomer} />)}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 lg:hidden">
          {filtered.map(customer => <CustomerCard key={customer.id} customer={customer} onEdit={setEditing} onDelete={handleDelete} onMail={setEmailCustomer} onPaymentChange={syncCustomer} />)}
        </div>

        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">Keine Kunden für diese Filter.</div>}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-900">Paket-Auswertung</h2>
          <div className="mt-4 space-y-3">
            {packages.map(pkg => {
              const list = customers.filter(customer => customer.packageName === pkg);
              const mrr = list.reduce((sum, customer) => sum + customer.hostingMonthlyCents, 0);
              return <Bar key={pkg} label={`${pkg} (${list.length})`} value={mrr} max={Math.max(totals.mrr, 1)} suffix={eur(mrr)} />;
            })}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-900">Zahlungsstatus</h2>
          <div className="mt-4 space-y-3">
            {(['offen', 'überfällig', 'bezahlt', 'storniert'] as PaymentStatus[]).map(status => {
              const value = totals.payments.filter(payment => payment.status === status).reduce((sum, payment) => sum + payment.amountCents, 0);
              return <Bar key={status} label={status} value={value} max={Math.max(totals.paid + totals.open, 1)} suffix={eur(value)} />;
            })}
          </div>
        </div>
      </section>

      {showNew && <CustomerModal title="Neuer Kunde" onClose={() => setShowNew(false)} onSave={handleCreate} pending={isPending} />}
      {editing && <CustomerModal title="Kunde bearbeiten" customer={editing} onClose={() => setEditing(null)} onSave={handleUpdate} pending={isPending} />}
      {emailCustomer && <CustomerEmailModal customer={emailCustomer} onClose={() => setEmailCustomer(null)} />}
    </div>
  );
}

type CustomerFormState = {
  company: string; email: string; phone: string; status: CustomerStatus; location: string; industry: string; websiteOld: string; flamingoLink: string; contactFirstName: string; contactLastName: string; anrede: string; responsible: string; packageName: string; setupPrice: string; hostingMonthly: string; notes: string;
};

function formFromCustomer(customer?: CustomerWithPayments): CustomerFormState {
  return {
    company: customer?.company || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    status: customer?.status || 'aktiv',
    location: customer?.location || '',
    industry: customer?.industry || '',
    websiteOld: customer?.websiteOld || '',
    flamingoLink: customer?.flamingoLink || '',
    contactFirstName: customer?.contactFirstName || '',
    contactLastName: customer?.contactLastName || '',
    anrede: customer?.anrede || '',
    responsible: customer?.responsible || 'Julius',
    packageName: customer?.packageName || 'Website Premium',
    setupPrice: String((customer?.setupPriceCents || 145000) / 100).replace('.', ','),
    hostingMonthly: String((customer?.hostingMonthlyCents || 4900) / 100).replace('.', ','),
    notes: customer?.notes || '',
  };
}

function formToPayload(form: CustomerFormState) {
  return {
    company: form.company,
    email: form.email || null,
    phone: form.phone || null,
    status: form.status,
    location: form.location || null,
    industry: form.industry || null,
    websiteOld: form.websiteOld || null,
    flamingoLink: form.flamingoLink || null,
    contactFirstName: form.contactFirstName || null,
    contactLastName: form.contactLastName || null,
    anrede: form.anrede || null,
    responsible: form.responsible || null,
    packageName: form.packageName || null,
    setupPriceCents: toCents(form.setupPrice),
    hostingMonthlyCents: toCents(form.hostingMonthly),
    notes: form.notes || null,
  };
}

function CustomerModal({ title, customer, onClose, onSave, pending }: { title: string; customer?: CustomerWithPayments; onClose: () => void; onSave: (form: CustomerFormState) => void; pending: boolean }) {
  const [form, setForm] = useState(() => formFromCustomer(customer));
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6" onClick={event => event.stopPropagation()}>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Firma *" value={form.company} onChange={value => setForm({ ...form, company: value })} className="sm:col-span-2" />
          <Field label="E-Mail" value={form.email} onChange={value => setForm({ ...form, email: value })} type="email" />
          <Field label="Telefon" value={form.phone} onChange={value => setForm({ ...form, phone: value })} />
          <Field label="Ort" value={form.location} onChange={value => setForm({ ...form, location: value })} />
          <Field label="Branche" value={form.industry} onChange={value => setForm({ ...form, industry: value })} />
          <Field label="Vorname" value={form.contactFirstName} onChange={value => setForm({ ...form, contactFirstName: value })} />
          <Field label="Nachname" value={form.contactLastName} onChange={value => setForm({ ...form, contactLastName: value })} />
          <label className="block text-sm">
            <span className="text-xs font-medium text-slate-500">Status</span>
            <select value={form.status} onChange={event => setForm({ ...form, status: event.target.value as CustomerStatus })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="aktiv">Aktiv</option>
              <option value="pausiert">Pausiert</option>
              <option value="gekündigt">Gekündigt</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-xs font-medium text-slate-500">Verantwortlich</span>
            <select value={form.responsible} onChange={event => setForm({ ...form, responsible: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="Julius">Julius</option>
              <option value="Mario">Mario</option>
            </select>
          </label>
          <Field label="Paket" value={form.packageName} onChange={value => setForm({ ...form, packageName: value })} />
          <Field label="Setup-Preis (€)" value={form.setupPrice} onChange={value => setForm({ ...form, setupPrice: value })} />
          <Field label="Hosting monatlich (€)" value={form.hostingMonthly} onChange={value => setForm({ ...form, hostingMonthly: value })} />
          <Field label="Flamingo Link" value={form.flamingoLink} onChange={value => setForm({ ...form, flamingoLink: value })} />
          <Field label="Alte Website" value={form.websiteOld} onChange={value => setForm({ ...form, websiteOld: value })} />
          <label className="block sm:col-span-2">
            <span className="text-xs font-medium text-slate-500">Notizen</span>
            <textarea value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} className="mt-1 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Abbrechen</button>
          <button onClick={() => onSave(form)} disabled={pending || !form.company.trim()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">Speichern</button>
        </div>
      </div>
    </div>
  );
}

function CustomerTableRow({ customer, onEdit, onDelete, onMail, onPaymentChange }: { customer: CustomerWithPayments; onEdit: (customer: CustomerWithPayments) => void; onDelete: (id: string) => void; onMail: (customer: CustomerWithPayments) => void; onPaymentChange: (id: string) => void }) {
  const open = customer.payments.filter(payment => payment.status === 'offen' || payment.status === 'überfällig').reduce((sum, payment) => sum + payment.amountCents, 0);
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-3">
        <button onClick={() => onEdit(customer)} className="text-left font-medium text-slate-900 hover:text-indigo-700">{customer.company}</button>
        <div className="text-xs text-slate-400">{customer.email || 'Keine E-Mail'} · {customer.industry || 'Keine Branche'}</div>
      </td>
      <td className="px-4 py-3 text-slate-600">{customer.packageName || '—'}</td>
      <td className="px-4 py-3">{eur(customer.setupPriceCents)}</td>
      <td className="px-4 py-3">{eur(customer.hostingMonthlyCents)}</td>
      <td className="px-4 py-3">
        <div className={open > 0 ? 'font-medium text-amber-700' : 'text-emerald-700'}>{open > 0 ? `${eur(open)} offen` : 'bezahlt/ok'}</div>
        <PaymentInline customer={customer} onChange={() => onPaymentChange(customer.id)} />
      </td>
      <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[customer.status]}`}>{customer.status}</span></td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => onMail(customer)} className="text-indigo-500 hover:text-indigo-700"><Mail size={15} /></button>
          <button onClick={() => onDelete(customer.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={15} /></button>
        </div>
      </td>
    </tr>
  );
}

function CustomerCard({ customer, onEdit, onDelete, onMail, onPaymentChange }: { customer: CustomerWithPayments; onEdit: (customer: CustomerWithPayments) => void; onDelete: (id: string) => void; onMail: (customer: CustomerWithPayments) => void; onPaymentChange: (id: string) => void }) {
  const open = customer.payments.filter(payment => payment.status === 'offen' || payment.status === 'überfällig').reduce((sum, payment) => sum + payment.amountCents, 0);
  return (
    <article className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <button onClick={() => onEdit(customer)} className="text-left">
          <h3 className="font-semibold text-slate-900">{customer.company}</h3>
          <p className="text-xs text-slate-500">{customer.packageName || 'Kein Paket'} · {customer.email || 'Keine E-Mail'}</p>
        </button>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[customer.status]}`}>{customer.status}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-slate-50 p-2"><span className="block text-xs text-slate-400">Setup</span>{eur(customer.setupPriceCents)}</div>
        <div className="rounded-lg bg-slate-50 p-2"><span className="block text-xs text-slate-400">Hosting</span>{eur(customer.hostingMonthlyCents)}</div>
      </div>
      <div className={`mt-3 text-sm ${open > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>{open > 0 ? `${eur(open)} offen` : 'Keine offenen Zahlungen'}</div>
      <PaymentInline customer={customer} onChange={() => onPaymentChange(customer.id)} />
      <div className="mt-3 flex justify-end gap-3">
        <button onClick={() => onMail(customer)} className="text-indigo-500"><Mail size={16} /></button>
        <button onClick={() => onDelete(customer.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
      </div>
    </article>
  );
}

function PaymentInline({ customer, onChange }: { customer: CustomerWithPayments; onChange: () => void }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [pending, startTransition] = useTransition();
  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {customer.payments.map(payment => (
          <button
            key={payment.id}
            disabled={pending}
            onClick={() => startTransition(async () => {
              try {
                await updateCustomerPayment(payment.id, { status: payment.status === 'bezahlt' ? 'offen' : 'bezahlt' });
                onChange();
              } catch (error) {
                toast.error(errorMessage(error));
              }
            })}
            className={`rounded-full px-2 py-1 text-[11px] font-medium ${PAYMENT_COLORS[payment.status]}`}
            title="Status zwischen offen und bezahlt wechseln"
          >
            {payment.title}: {eur(payment.amountCents)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_90px_auto] gap-1">
        <input value={title} onChange={event => setTitle(event.target.value)} placeholder="Zahlung" className="min-w-0 rounded-md border border-slate-200 px-2 py-1 text-xs" />
        <input value={amount} onChange={event => setAmount(event.target.value)} placeholder="€" className="min-w-0 rounded-md border border-slate-200 px-2 py-1 text-xs" />
        <button disabled={pending || !title.trim() || !amount.trim()} onClick={() => startTransition(async () => {
          try {
            await addCustomerPayment({ customerId: customer.id, title, amountCents: toCents(amount), status: 'offen', type: 'custom' });
            setTitle('');
            setAmount('');
            onChange();
          } catch (error) {
            toast.error(errorMessage(error));
          }
        })} className="rounded-md bg-slate-900 px-2 py-1 text-xs text-white disabled:opacity-40">+</button>
      </div>
    </div>
  );
}

function CustomerEmailModal({ customer, onClose }: { customer: CustomerWithPayments; onClose: () => void }) {
  const [to, setTo] = useState(customer.email || '');
  const [subject, setSubject] = useState(`Update zu Ihrem FlamingoMedia Projekt`);
  const [body, setBody] = useState(`Hallo ${customer.contactFirstName || customer.company},\n\nkurzes Update zu Ihrem Projekt: Wir melden uns mit den nächsten Schritten und offenen Punkten.\n\nViele Grüße\nMario & Julius`);
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  async function send() {
    if (!to.trim()) { toast.error('Empfänger fehlt'); return; }
    setSending(true);
    try {
      const form = new FormData();
      form.set('to', to);
      form.set('subject', subject);
      form.set('body', body);
      if (file) form.set('attachment', file);
      const res = await fetch('/api/send-lead-email', { method: 'POST', body: form });
      if (!res.ok) throw new Error('send failed');
      toast.success('E-Mail gesendet');
      onClose();
    } catch {
      toast.error('E-Mail konnte nicht gesendet werden');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6" onClick={event => event.stopPropagation()}>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><Mail size={18} className="text-indigo-600" /> E-Mail an Kunden</h2>
        <div className="mt-4 space-y-3">
          <Field label="Empfänger" value={to} onChange={setTo} type="email" />
          <Field label="Betreff" value={subject} onChange={setSubject} />
          <label className="block">
            <span className="text-xs font-medium text-slate-500">Nachricht</span>
            <textarea value={body} onChange={event => setBody(event.target.value)} className="mt-1 min-h-72 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-500">Anhang optional</span>
            <input type="file" onChange={event => setFile(event.target.files?.[0] || null)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Abbrechen</button>
          <button onClick={send} disabled={sending} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"><Mail size={14} /> {sending ? 'Sende...' : 'Senden'}</button>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, tone = 'slate' }: { label: string; value: string | number; tone?: 'slate' | 'green' | 'red' | 'amber' | 'indigo' }) {
  const color = { slate: 'text-slate-600', green: 'text-emerald-700', red: 'text-red-700', amber: 'text-amber-700', indigo: 'text-indigo-700' }[tone];
  return <div className="rounded-xl border border-slate-200 bg-white p-4"><div className={`text-2xl font-bold ${color}`}>{value}</div><div className="text-xs text-slate-500">{label}</div></div>;
}

function Field({ label, value, onChange, type = 'text', className = '' }: { label: string; value: string; onChange: (value: string) => void; type?: string; className?: string }) {
  return <label className={`block ${className}`}><span className="text-xs font-medium text-slate-500">{label}</span><input type={type} value={value} onChange={event => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>;
}

function Bar({ label, value, max, suffix }: { label: string; value: number; max: number; suffix: string }) {
  const width = Math.max(3, Math.min(100, Math.round((value / max) * 100)));
  return <div><div className="mb-1 flex justify-between gap-3 text-sm"><span className="text-slate-600">{label}</span><span className="font-medium text-slate-900">{suffix}</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${width}%` }} /></div></div>;
}
