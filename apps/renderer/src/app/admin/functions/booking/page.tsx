import { CalendarDays, CheckCircle2, Clock, Lock, Mail, Settings, Trash2, Users, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  addBookingAvailabilityRuleAction,
  addBookingResourceAction,
  addBookingServiceAction,
  deleteBookingAvailabilityRuleAction,
  deleteBookingResourceAction,
  deleteBookingServiceAction,
  getBookingAdminData,
  requestBookingAddonAction,
  saveBookingEmailTemplateAction,
  saveBookingSettingsAction,
  updateBookingStatusAction,
} from './actions';
import { getDefaultBookingEmailTemplate, type BookingEmailTrigger } from '@/lib/booking-email';

const TRIGGERS: { key: BookingEmailTrigger; label: string }[] = [
  { key: 'booking_requested_customer', label: 'Anfrage an Kunden' },
  { key: 'booking_requested_admin', label: 'Anfrage an Admin' },
  { key: 'booking_confirmed_customer', label: 'Bestätigung an Kunden' },
  { key: 'booking_cancelled_customer', label: 'Absage an Kunden' },
  { key: 'booking_cancelled_admin', label: 'Absage an Admin' },
];

const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

const STATUS_LABELS: Record<string, string> = {
  requested: 'Angefragt',
  confirmed: 'Bestätigt',
  cancelled_by_customer: 'Vom Kunden abgesagt',
  cancelled_by_admin: 'Abgesagt',
  completed: 'Erledigt',
  no_show: 'Nicht erschienen',
};

export default async function BookingAdminPage() {
  const data = await getBookingAdminData();

  if (!data.addonActive || !data.settings) {
    return (
      <div className="max-w-3xl">
        <div className="admin-card p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700"><Lock size={24} /></div>
            <div>
              <h1 className="text-2xl font-bold">Booking Add-on</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Das einfache Reservierungsformular bleibt verfügbar. Das Booking Add-on ergänzt echte Verfügbarkeiten,
                Ressourcen, Leistungen, Anfrage- oder Direktbuchung und automatische E-Mails.
              </p>
              <form action={requestBookingAddonAction}>
                <button className="admin-btn-primary mt-5">Booking Add-on anfragen</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const templateByTrigger = new Map(data.templates.map(t => [t.trigger, t]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Buchungen</h1>
        <p className="text-sm text-zinc-500">Ein System für Anfragen, direkte Buchungen, Zeitslots, ganze Tage und Datumsbereiche.</p>
      </div>

      <section className="admin-card p-5">
        <div className="mb-4 flex items-center gap-2"><Settings size={18} /><h2 className="font-semibold">Grundeinstellungen</h2></div>
        <form action={saveBookingSettingsAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Buchungsmodus">
            <select name="mode" defaultValue={data.settings.mode} className="admin-input">
              <option value="request">Nur Anfrage, manuell bestätigen</option>
              <option value="instant">Direkte Self-Service-Buchung</option>
            </select>
          </Field>
          <Field label="Zeitmodell">
            <select name="timeModel" defaultValue={data.settings.timeModel} className="admin-input">
              <option value="time_slot">Zeitslot</option>
              <option value="full_day">Ganzer Tag</option>
              <option value="date_range">Datumsbereich</option>
            </select>
          </Field>
          <Field label="Intervall in Minuten"><input name="intervalMinutes" type="number" min={5} max={1440} defaultValue={data.settings.intervalMinutes} className="admin-input" /></Field>
          <Field label="Mindest-Vorlauf in Stunden"><input name="minNoticeHours" type="number" min={0} defaultValue={data.settings.minNoticeHours} className="admin-input" /></Field>
          <Field label="Maximal im Voraus in Tagen"><input name="maxAdvanceDays" type="number" min={1} defaultValue={data.settings.maxAdvanceDays} className="admin-input" /></Field>
          <Field label="Storno-Frist in Stunden"><input name="cancellationDeadlineHours" type="number" min={0} defaultValue={data.settings.cancellationDeadlineHours} className="admin-input" /></Field>
          <Field label="Benachrichtigungs-E-Mail"><input name="notificationEmail" type="email" defaultValue={data.settings.notificationEmail || ''} placeholder="Leer = SMTP-Absenderadresse" className="admin-input" /></Field>
          <div className="space-y-3 rounded-xl border border-zinc-200 p-4">
            <label className="flex items-center gap-2 text-sm"><input name="cancellationAllowed" type="checkbox" defaultChecked={data.settings.cancellationAllowed} /> Kunden dürfen stornieren</label>
            <label className="flex items-center gap-2 text-sm"><input name="customerEmailEnabled" type="checkbox" defaultChecked={data.settings.customerEmailEnabled} /> E-Mails an Kunden senden</label>
            <label className="flex items-center gap-2 text-sm"><input name="adminEmailEnabled" type="checkbox" defaultChecked={data.settings.adminEmailEnabled} /> E-Mails an Admin senden</label>
          </div>
          <div className="md:col-span-2"><button className="admin-btn-primary">Einstellungen speichern</button></div>
        </form>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-5">
          <div className="mb-4 flex items-center gap-2"><Users size={18} /><h2 className="font-semibold">Ressourcen</h2></div>
          <form action={addBookingResourceAction} className="space-y-3">
            <input name="name" placeholder="Name, z.B. Tisch 4, Studio 1, Fototag" className="admin-input" />
            <div className="grid gap-3 sm:grid-cols-2">
              <select name="type" className="admin-input">
                <option value="generic">Allgemein</option><option value="table">Tisch</option><option value="room">Raum</option><option value="space">Fläche</option><option value="room_unit">Zimmer/Einheit</option><option value="staff">Mitarbeiter</option><option value="equipment">Equipment</option>
              </select>
              <input name="capacity" type="number" min={1} defaultValue={1} className="admin-input" />
            </div>
            <textarea name="description" placeholder="Beschreibung optional" className="admin-input min-h-20" />
            <button className="admin-btn-secondary">Ressource hinzufügen</button>
          </form>
          <div className="mt-4 space-y-2">
            {data.resources.length ? data.resources.map(resource => (
              <Row key={resource.id} title={resource.name} meta={`${resource.type} · Kapazität ${resource.capacity}`}>
                <DeleteButton action={deleteBookingResourceAction} id={resource.id} label="Ressource löschen" />
              </Row>
            )) : <p className="text-sm text-zinc-400">Noch keine Ressourcen.</p>}
          </div>
        </div>

        <div className="admin-card p-5">
          <div className="mb-4 flex items-center gap-2"><CalendarDays size={18} /><h2 className="font-semibold">Leistungen</h2></div>
          <form action={addBookingServiceAction} className="space-y-3">
            <input name="name" placeholder="Name, z.B. Erstgespräch, Dinner, Hochzeitstag" className="admin-input" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="durationMinutes" type="number" min={0} placeholder="Dauer in Minuten" className="admin-input" />
              <select name="timeModelOverride" className="admin-input">
                <option value="">Standard-Zeitmodell</option>
                <option value="time_slot">Zeitslot</option>
                <option value="full_day">Ganzer Tag</option>
                <option value="date_range">Datumsbereich</option>
              </select>
            </div>
            <input name="priceLabel" placeholder="Preislabel optional" className="admin-input" />
            <textarea name="description" placeholder="Beschreibung optional" className="admin-input min-h-20" />
            <label className="flex items-center gap-2 text-sm"><input name="requiresResource" type="checkbox" /> Benötigt Ressource</label>
            <button className="admin-btn-secondary">Leistung hinzufügen</button>
          </form>
          <div className="mt-4 space-y-2">
            {data.services.length ? data.services.map(service => (
              <Row key={service.id} title={service.name} meta={`${service.durationMinutes ? `${service.durationMinutes} Min. · ` : ''}${service.priceLabel || 'Kein Preislabel'}`}>
                <DeleteButton action={deleteBookingServiceAction} id={service.id} label="Leistung löschen" />
              </Row>
            )) : <p className="text-sm text-zinc-400">Noch keine Leistungen.</p>}
          </div>
        </div>
      </section>

      <section className="admin-card p-5">
        <h2 className="mb-4 font-semibold">Verfügbarkeiten</h2>
        <form action={addBookingAvailabilityRuleAction} className="grid gap-3 md:grid-cols-5">
          <select name="weekday" className="admin-input">{WEEKDAYS.map((day, i) => <option key={day} value={i}>{day}</option>)}</select>
          <input name="startTime" type="time" className="admin-input" />
          <input name="endTime" type="time" className="admin-input" />
          <input name="capacity" type="number" min={1} defaultValue={1} className="admin-input" />
          <button className="admin-btn-secondary">Regel hinzufügen</button>
        </form>
        <div className="mt-4 space-y-2">
          {data.availabilityRules.length ? data.availabilityRules.map(rule => (
            <Row key={rule.id} title={WEEKDAYS[rule.weekday] || 'Wochentag'} meta={`${rule.startTime}-${rule.endTime} · Kapazität ${rule.capacity || 1}`}>
              <DeleteButton action={deleteBookingAvailabilityRuleAction} id={rule.id} label="Regel löschen" />
            </Row>
          )) : <p className="text-sm text-zinc-400">Noch keine Verfügbarkeiten.</p>}
        </div>
      </section>

      <section className="admin-card p-5">
        <div className="mb-4 flex items-center gap-2"><Clock size={18} /><h2 className="font-semibold">Eingegangene Buchungen</h2></div>
        <div className="space-y-3">
          {data.requests.length ? data.requests.map(request => (
            <div key={request.id} className="rounded-xl border border-zinc-200 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{request.customerName}</h3>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">{formatDate(request.startsAt)} bis {formatDate(request.endsAt)} · {request.partySize} Person(en)/Einheit(en)</p>
                  <p className="text-sm text-zinc-500">{[request.customerEmail, request.customerPhone].filter(Boolean).join(' · ') || 'Keine Kontaktdaten'}</p>
                  {request.message ? <p className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600">{request.message}</p> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {request.status === 'requested' ? (
                    <>
                      <StatusAction id={request.id} status="confirmed" label="Bestätigen" />
                      <StatusAction id={request.id} status="cancelled_by_admin" label="Absagen" danger />
                    </>
                  ) : null}
                  {request.status === 'confirmed' ? (
                    <>
                      <StatusAction id={request.id} status="completed" label="Erledigt" />
                      <StatusAction id={request.id} status="no_show" label="No-show" />
                      <StatusAction id={request.id} status="cancelled_by_admin" label="Absagen" danger />
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )) : <p className="text-sm text-zinc-400">Noch keine Buchungen eingegangen.</p>}
        </div>
      </section>

      <section className="admin-card p-5">
        <div className="mb-4 flex items-center gap-2"><Mail size={18} /><h2 className="font-semibold">E-Mail-Vorlagen</h2></div>
        <div className="grid gap-4 lg:grid-cols-2">
          {TRIGGERS.map(({ key, label }) => {
            const current = templateByTrigger.get(key);
            const fallback = getDefaultBookingEmailTemplate(key);
            return (
              <form key={key} action={saveBookingEmailTemplateAction} className="space-y-3 rounded-xl border border-zinc-200 p-4">
                <input type="hidden" name="trigger" value={key} />
                <h3 className="font-medium">{label}</h3>
                <input name="subject" defaultValue={current?.subject || fallback.subject} className="admin-input" />
                <textarea name="body" defaultValue={current?.body || fallback.body} className="admin-input min-h-48 font-mono text-xs" />
                <p className="text-xs text-zinc-400">Platzhalter: {'{{customerName}}'}, {'{{bookingDate}}'}, {'{{bookingSummary}}'}, {'{{companyName}}'}, {'{{cancellationUrl}}'}</p>
                <button className="admin-btn-secondary">Vorlage speichern</button>
              </form>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="admin-label">{label}</span>{children}</label>;
}

function Row({ title, meta, children }: { title: string; meta: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-zinc-50 px-3 py-2 text-sm">
      <div className="min-w-0">
        <p className="truncate font-medium text-zinc-800">{title}</p>
        <p className="truncate text-zinc-500">{meta}</p>
      </div>
      {children}
    </div>
  );
}

function DeleteButton({ action, id, label }: { action: (formData: FormData) => Promise<void>; id: string; label: string }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600" title={label} aria-label={label}>
        <Trash2 size={16} />
      </button>
    </form>
  );
}

function StatusAction({ id, status, label, danger }: { id: string; status: string; label: string; danger?: boolean }) {
  return (
    <form action={updateBookingStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className={danger ? 'admin-btn-secondary text-red-600 hover:border-red-200 hover:bg-red-50' : 'admin-btn-secondary'}>{label}</button>
    </form>
  );
}

function StatusBadge({ status }: { status: string }) {
  const positive = status === 'confirmed' || status === 'completed';
  const negative = status.startsWith('cancelled') || status === 'no_show';
  return (
    <span className={[
      'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
      positive ? 'bg-emerald-50 text-emerald-700' : negative ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700',
    ].join(' ')}>
      {positive ? <CheckCircle2 size={12} /> : negative ? <XCircle size={12} /> : <Clock size={12} />}
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
