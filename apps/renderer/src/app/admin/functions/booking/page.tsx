import Link from 'next/link';
import { CalendarDays, CheckCircle2, Clock, Filter, Inbox, Lock, Mail, Settings, SlidersHorizontal, Users, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  addBookingAvailabilityRuleAction,
  addBookingBlackoutAction,
  addBookingCalendarBlockAction,
  addBookingResourceAction,
  addBookingServiceAction,
  deleteBookingAvailabilityRuleAction,
  deleteBookingBlackoutAction,
  deleteBookingCalendarBlockAction,
  deleteBookingResourceAction,
  deleteBookingServiceAction,
  getBookingAdminData,
  requestBookingAddonAction,
  saveBookingEmailTemplateAction,
  saveBookingSettingsAction,
  updateBookingAssignmentAction,
  updateBookingAvailabilityRuleAction,
  updateBookingCalendarBlockAction,
  updateBookingResourceAction,
  updateBookingServiceAction,
  updateBookingStatusAction,
} from './actions';
import { getDefaultBookingEmailTemplate, type BookingEmailTrigger } from '@/lib/booking-email';
import { ConfirmDeleteForm } from './confirm-delete-form';
import { formatBookingDate } from '@/lib/booking-time';

const TRIGGERS: { key: BookingEmailTrigger; label: string }[] = [
  { key: 'booking_requested_customer', label: 'Anfrage an Kunden' },
  { key: 'booking_requested_admin', label: 'Anfrage an Admin' },
  { key: 'booking_confirmed_customer', label: 'Bestätigung an Kunden' },
  { key: 'booking_cancelled_customer', label: 'Absage an Kunden' },
  { key: 'booking_cancelled_admin', label: 'Absage an Admin' },
];

const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const STATUSES = ['requested', 'confirmed', 'cancelled_by_customer', 'cancelled_by_admin', 'completed', 'no_show'] as const;
const RESOURCE_TYPES = [
  ['generic', 'Allgemein'],
  ['table', 'Tisch'],
  ['room', 'Raum'],
  ['space', 'Fläche'],
  ['room_unit', 'Zimmer/Einheit'],
  ['staff', 'Mitarbeiter'],
  ['equipment', 'Equipment'],
] as const;
const TIME_MODELS = [
  ['time_slot', 'Zeitslot'],
  ['full_day', 'Ganzer Tag'],
  ['date_range', 'Datumsbereich'],
] as const;
const STATUS_LABELS: Record<string, string> = {
  requested: 'Angefragt',
  confirmed: 'Bestätigt',
  cancelled_by_customer: 'Vom Kunden abgesagt',
  cancelled_by_admin: 'Abgesagt',
  completed: 'Erledigt',
  no_show: 'Nicht erschienen',
};
const TABS = [
  { key: 'overview', label: 'Übersicht', icon: SlidersHorizontal },
  { key: 'inbox', label: 'Anfragen', icon: Inbox },
  { key: 'day', label: 'Tagesplan', icon: CalendarDays },
  { key: 'calendar', label: 'Kalender & Verfügbarkeiten', icon: CalendarDays },
  { key: 'resources', label: 'Ressourcen & Leistungen', icon: Users },
  { key: 'blackouts', label: 'Sperrzeiten', icon: Lock },
  { key: 'emails', label: 'E-Mails', icon: Mail },
  { key: 'settings', label: 'Einstellungen', icon: Settings },
] as const;

type SearchParams = Record<string, string | string[] | undefined>;
type BookingTab = typeof TABS[number]['key'];
type BookingRequest = Awaited<ReturnType<typeof getBookingAdminData>>['requests'][number];
type BookingResource = Awaited<ReturnType<typeof getBookingAdminData>>['resources'][number];
type BookingService = Awaited<ReturnType<typeof getBookingAdminData>>['services'][number];
type BookingAvailabilityRule = Awaited<ReturnType<typeof getBookingAdminData>>['availabilityRules'][number];
type BookingCalendarBlock = Awaited<ReturnType<typeof getBookingAdminData>>['calendarBlocks'][number];
type BookingBlackout = Awaited<ReturnType<typeof getBookingAdminData>>['blackouts'][number];

export default async function BookingAdminPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params = await (searchParams || Promise.resolve({}));
  const activeTab = tabParam(param(params, 'tab'));
  const selectedDay = param(params, 'day') || todayInput();
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
              {data.addonRequested ? (
                <div role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <strong>Anfrage eingegangen.</strong> Wir melden uns zur Einrichtung und Freischaltung bei Ihnen.
                </div>
              ) : (
                <form action={requestBookingAddonAction}>
                  <button type="submit" className="admin-btn-primary mt-5">Booking Add-on anfragen</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const resourceById = new Map(data.resources.map(resource => [resource.id, resource]));
  const serviceById = new Map(data.services.map(service => [service.id, service]));
  const enrichedRequests = data.requests.map(request => ({
    ...request,
    service: request.serviceId ? serviceById.get(request.serviceId) : null,
    resource: request.resourceId ? resourceById.get(request.resourceId) : null,
  }));
  const filteredRequests = filterRequests(enrichedRequests, params);
  const dayRequests = enrichedRequests
    .filter(request => sameDate(request.startsAt, selectedDay))
    .filter(request => !request.status.startsWith('cancelled'))
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  const pendingCount = enrichedRequests.filter(request => request.status === 'requested').length;
  const confirmedToday = dayRequests.filter(request => request.status === 'confirmed').length;
  const nextRequest = enrichedRequests.find(request => request.startsAt.getTime() >= Date.now() && !request.status.startsWith('cancelled'));
  const templateByTrigger = new Map(data.templates.map(t => [t.trigger, t]));

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Buchungen</h1>
          <p className="text-sm text-zinc-500">Anfragen, Tagesplanung, Ressourcen, Verfügbarkeiten und Buchungs-E-Mails an einem Ort.</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-500">
          Modus: <strong className="text-zinc-900">{data.settings.mode === 'instant' ? 'Direkte Buchung' : 'Anfrage mit Bestätigung'}</strong>
        </div>
      </header>

      {param(params, 'success') ? <FeedbackMessage type="success" message={param(params, 'success')} /> : null}
      {param(params, 'error') ? <FeedbackMessage type="error" message={param(params, 'error')} /> : null}

      <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-2">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <Link
              key={tab.key}
              href={`/admin/functions/booking?tab=${tab.key}`}
              className={[
                'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium',
                active ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950',
              ].join(' ')}
            >
              <Icon size={16} /> {tab.label}
            </Link>
          );
        })}
      </nav>

      {activeTab === 'overview' ? (
        <OverviewPanel
          total={enrichedRequests.length}
          pending={pendingCount}
          confirmedToday={confirmedToday}
          resources={data.resources.length}
          resourceOptions={data.resources}
          nextRequest={nextRequest}
          day={selectedDay}
          dayRequests={dayRequests.slice(0, 5)}
        />
      ) : null}

      {activeTab === 'inbox' ? (
        <InboxPanel params={params} requests={filteredRequests} resources={data.resources} services={data.services} />
      ) : null}

      {activeTab === 'day' ? (
        <DayPanel day={selectedDay} requests={dayRequests} resources={data.resources} />
      ) : null}

      {activeTab === 'calendar' ? (
        <CalendarAvailabilityPanel day={selectedDay} blocks={data.calendarBlocks} rules={data.availabilityRules} resources={data.resources} services={data.services} timezone={data.settings.timezone} />
      ) : null}

      {activeTab === 'resources' ? (
        <ResourcesPanel resources={data.resources} services={data.services} />
      ) : null}

      {activeTab === 'blackouts' ? (
        <BlackoutsPanel blackouts={data.blackouts} resources={data.resources} />
      ) : null}

      {activeTab === 'emails' ? (
        <EmailPanel templateByTrigger={templateByTrigger} />
      ) : null}

      {activeTab === 'settings' ? (
        <SettingsPanel settings={data.settings} />
      ) : null}
    </div>
  );
}

function OverviewPanel({ total, pending, confirmedToday, resources, resourceOptions, nextRequest, day, dayRequests }: {
  total: number;
  pending: number;
  confirmedToday: number;
  resources: number;
  resourceOptions: BookingResource[];
  nextRequest?: EnrichedRequest;
  day: string;
  dayRequests: EnrichedRequest[];
}) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Alle Buchungen" value={String(total)} />
        <MetricCard label="Offene Anfragen" value={String(pending)} href="/admin/functions/booking?tab=inbox&status=requested" />
        <MetricCard label="Heute bestätigt" value={String(confirmedToday)} href={`/admin/functions/booking?tab=day&day=${day}`} />
        <MetricCard label="Aktive Ressourcen" value={String(resources)} href="/admin/functions/booking?tab=resources" />
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-5">
          <h2 className="font-semibold">Nächster Termin</h2>
          {nextRequest ? <BookingCard request={nextRequest} resources={resourceOptions} compact /> : <EmptyText>Keine kommenden Buchungen.</EmptyText>}
        </div>
        <div className="admin-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Heute im Plan</h2>
            <Link className="text-sm font-medium text-blue-600" href={`/admin/functions/booking?tab=day&day=${day}`}>Tagesplan öffnen</Link>
          </div>
          <div className="mt-4 space-y-3">
            {dayRequests.length ? dayRequests.map(request => <BookingMiniRow key={request.id} request={request} />) : <EmptyText>Heute noch keine bestätigten Buchungen.</EmptyText>}
          </div>
        </div>
      </section>
    </div>
  );
}

function InboxPanel({ params, requests, resources, services }: { params: SearchParams; requests: EnrichedRequest[]; resources: BookingResource[]; services: BookingService[] }) {
  return (
    <section className="admin-card p-5">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2"><Filter size={18} /><h2 className="font-semibold">Anfragen & Buchungen</h2></div>
          <p className="mt-1 text-sm text-zinc-500">Filtere nach Status, angefragtem Datum, Zeitraum, Ressource, Leistung oder Kundendaten.</p>
        </div>
        <Link href="/admin/functions/booking?tab=inbox" className="admin-btn-secondary text-center">Filter zurücksetzen</Link>
      </div>
      <form method="get" className="grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 md:grid-cols-6">
        <input type="hidden" name="tab" value="inbox" />
        <Field label="Status">
          <select name="status" defaultValue={param(params, 'status')} className="admin-input">
            <option value="">Alle</option>
            {STATUSES.map(status => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
          </select>
        </Field>
        <Field label="Von Datum"><input name="from" type="date" defaultValue={param(params, 'from')} className="admin-input" /></Field>
        <Field label="Bis Datum"><input name="to" type="date" defaultValue={param(params, 'to')} className="admin-input" /></Field>
        <Field label="Ressource">
          <select name="resourceId" defaultValue={param(params, 'resourceId')} className="admin-input">
            <option value="">Alle</option>
            {resources.map(resource => <option key={resource.id} value={resource.id}>{resource.name}</option>)}
          </select>
        </Field>
        <Field label="Leistung">
          <select name="serviceId" defaultValue={param(params, 'serviceId')} className="admin-input">
            <option value="">Alle</option>
            {services.map(service => <option key={service.id} value={service.id}>{service.name}</option>)}
          </select>
        </Field>
        <Field label="Suche">
          <div className="flex gap-2">
            <input name="q" defaultValue={param(params, 'q')} placeholder="Name, E-Mail, Telefon" className="admin-input" />
            <button className="admin-btn-primary">Filtern</button>
          </div>
        </Field>
      </form>
      <div className="mt-5 space-y-3">
        {requests.length ? requests.map(request => <BookingCard key={request.id} request={request} resources={resources} />) : <EmptyText>Keine Buchungen passen zu diesen Filtern.</EmptyText>}
      </div>
    </section>
  );
}

function DayPanel({ day, requests, resources }: { day: string; requests: EnrichedRequest[]; resources: BookingResource[] }) {
  const unassigned = requests.filter(request => !request.resourceId);
  return (
    <section className="admin-card p-5">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-semibold">Tagesplan</h2>
          <p className="mt-1 text-sm text-zinc-500">Sieh pro Tag, wer kommt und welcher Ressource die Buchung zugeordnet ist.</p>
        </div>
        <form method="get" className="flex gap-2">
          <input type="hidden" name="tab" value="day" />
          <input name="day" type="date" defaultValue={day} className="admin-input" />
          <button className="admin-btn-secondary">Anzeigen</button>
        </form>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {resources.map(resource => {
          const items = requests.filter(request => request.resourceId === resource.id);
          return (
            <div key={resource.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <h3 className="font-semibold">{resource.name}</h3>
              <p className="text-xs text-zinc-400">{resource.type} · {resource.capacity} Buchung(en) gleichzeitig</p>
              <div className="mt-4 space-y-3">
                {items.length ? items.map(request => <BookingMiniRow key={request.id} request={request} resources={resources} />) : <p className="text-sm text-zinc-400">Keine Buchungen.</p>}
              </div>
            </div>
          );
        })}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <h3 className="font-semibold">Ohne Ressource</h3>
          <p className="text-xs text-zinc-400">Anfragen, die keiner konkreten Ressource zugeordnet sind.</p>
          <div className="mt-4 space-y-3">
            {unassigned.length ? unassigned.map(request => <BookingMiniRow key={request.id} request={request} resources={resources} />) : <p className="text-sm text-zinc-400">Keine Buchungen.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function CalendarAvailabilityPanel({ day, blocks, rules, resources, services, timezone }: { day: string; blocks: BookingCalendarBlock[]; rules: BookingAvailabilityRule[]; resources: BookingResource[]; services: BookingService[]; timezone?: string | null }) {
  return (
    <div className="space-y-6">
      <CalendarBlocksPanel day={day} blocks={blocks} resources={resources} services={services} timezone={timezone} />
      <AvailabilityPanel rules={rules} resources={resources} services={services} />
    </div>
  );
}

function CalendarBlocksPanel({ day, blocks, resources, services, timezone }: { day: string; blocks: BookingCalendarBlock[]; resources: BookingResource[]; services: BookingService[]; timezone?: string | null }) {
  const resourceById = new Map(resources.map(resource => [resource.id, resource]));
  const serviceById = new Map(services.map(service => [service.id, service]));
  const dayBlocks = blocks
    .filter(block => sameDate(block.startsAt, day))
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  const availableCount = dayBlocks.filter(block => block.type === 'available').length;
  const blockedCount = dayBlocks.filter(block => block.type === 'blocked').length;

  return (
    <section className="admin-card p-5">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-semibold">Kalenderbasierte Verfügbarkeit</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            Nutze konkrete Tagesblöcke für Schichten, Sonderzeiten, Urlaub oder einzelne ganztägige Angebote. Diese Blöcke haben Vorrang vor den regelmäßigen Wochenregeln.
          </p>
        </div>
        <form method="get" className="flex gap-2">
          <input type="hidden" name="tab" value="calendar" />
          <input name="day" type="date" defaultValue={day} className="admin-input" />
          <button className="admin-btn-secondary">Tag anzeigen</button>
        </form>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <MetricCard label="Blöcke an diesem Tag" value={String(dayBlocks.length)} />
        <MetricCard label="Verfügbar" value={String(availableCount)} />
        <MetricCard label="Gesperrt" value={String(blockedCount)} />
      </div>

      <form action={addBookingCalendarBlockAction} className="grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 lg:grid-cols-6">
        <Field label="Typ">
          <select name="type" defaultValue="available" className="admin-input">
            <option value="available">Verfügbar</option>
            <option value="blocked">Gesperrt</option>
          </select>
        </Field>
        <Field label="Start">
          <input name="startsAt" type="datetime-local" defaultValue={`${day}T10:00`} className="admin-input" />
        </Field>
        <Field label="Ende">
          <input name="endsAt" type="datetime-local" defaultValue={`${day}T15:00`} className="admin-input" />
        </Field>
        <CapacitySlotField />
        <ResourceSelect resources={resources} />
        <ServiceSelect services={services} />
        <Field label="Notiz optional">
          <input name="note" placeholder="z.B. Maria Frühschicht, Feiertag, Event" className="admin-input" />
        </Field>
        <div className="flex items-end lg:col-span-5">
          <button className="admin-btn-primary w-full sm:w-auto">Kalenderblock hinzufügen</button>
        </div>
      </form>
      <p className="mt-2 text-xs leading-5 text-zinc-400">
        Zeitzone: {timezone || 'Europe/Berlin'}. Verfügbare Blöcke ergänzen oder überschreiben die Wochenregeln für konkrete Tage; gesperrte Blöcke blockieren immer.
      </p>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {dayBlocks.length ? dayBlocks.map(block => {
          const title = block.note || (block.type === 'available' ? 'Verfügbarer Block' : 'Sperrblock');
          return (
            <form key={block.id} action={updateBookingCalendarBlockAction} className={[
              'rounded-2xl border p-4',
              block.type === 'available' ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30',
            ].join(' ')}>
              <input type="hidden" name="id" value={block.id} />
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-zinc-950">{title}</h3>
                  <p className="text-sm text-zinc-500">
                    {[resourceById.get(block.resourceId || '')?.name, serviceById.get(block.serviceId || '')?.name].filter(Boolean).join(' · ') || 'Global'}
                  </p>
                </div>
                <span className={[
                  'inline-flex w-fit rounded-full px-2 py-1 text-xs font-medium',
                  block.type === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700',
                ].join(' ')}>
                  {block.type === 'available' ? 'Verfügbar' : 'Gesperrt'}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Typ">
                  <select name="type" defaultValue={block.type} className="admin-input">
                    <option value="available">Verfügbar</option>
                    <option value="blocked">Gesperrt</option>
                  </select>
                </Field>
                <CapacitySlotField value={block.capacity || 1} />
                <Field label="Start"><input name="startsAt" type="datetime-local" defaultValue={toDateTimeLocal(block.startsAt, timezone)} className="admin-input" /></Field>
                <Field label="Ende"><input name="endsAt" type="datetime-local" defaultValue={toDateTimeLocal(block.endsAt, timezone)} className="admin-input" /></Field>
                <ResourceSelect resources={resources} value={block.resourceId || ''} />
                <ServiceSelect services={services} value={block.serviceId || ''} />
                <Field label="Notiz"><input name="note" defaultValue={block.note || ''} className="admin-input" /></Field>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <DeleteButton action={deleteBookingCalendarBlockAction} id={block.id} label="Kalenderblock löschen" subject={title} />
                <button className="admin-btn-primary">Speichern</button>
              </div>
            </form>
          );
        }) : <EmptyText>Für diesen Tag sind noch keine Kalenderblöcke gepflegt. Es gelten die regelmäßigen Wochenregeln.</EmptyText>}
      </div>
    </section>
  );
}

function ResourcesPanel({ resources, services }: { resources: BookingResource[]; services: BookingService[] }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="admin-card p-5">
        <div className="mb-4 flex items-center gap-2"><Users size={18} /><h2 className="font-semibold">Ressourcen</h2></div>
        <form action={addBookingResourceAction} className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <Field label="Name der Ressource"><input name="name" placeholder="z.B. Tisch 4, Studio 1, Fototag" className="admin-input" /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <ResourceTypeSelect />
            <CapacityField />
            <SeatsField />
          </div>
          <Field label="Beschreibung optional"><textarea name="description" placeholder="Interne Notiz oder kurze Erklärung" className="admin-input min-h-20" /></Field>
          <button className="admin-btn-secondary">Ressource hinzufügen</button>
        </form>
        <div className="mt-4 space-y-3">
          {resources.length ? resources.map(resource => (
            <details key={resource.id} className="rounded-2xl border border-zinc-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                <div>
                  <h3 className="font-semibold text-zinc-950">{resource.name}</h3>
                  <p className="text-sm text-zinc-500">{resource.type} · Kapazität {resource.capacity}{resource.seats ? ` · ${resource.seats} Plätze` : ''}</p>
                </div>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">Bearbeiten</span>
              </summary>
              <form action={updateBookingResourceAction} className="border-t border-zinc-100 p-4">
                <input type="hidden" name="id" value={resource.id} />
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Name"><input name="name" defaultValue={resource.name} className="admin-input" /></Field>
                  <ResourceTypeSelect value={resource.type} />
                  <CapacityField value={resource.capacity} />
                  <SeatsField value={resource.seats || undefined} />
                  <Field label="Beschreibung"><textarea name="description" defaultValue={resource.description || ''} className="admin-input min-h-20" /></Field>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <DeleteButton action={deleteBookingResourceAction} id={resource.id} label="Ressource löschen" subject={resource.name} />
                  <button className="admin-btn-primary">Speichern</button>
                </div>
              </form>
            </details>
          )) : <EmptyText>Noch keine Ressourcen.</EmptyText>}
        </div>
      </section>

      <section className="admin-card p-5">
        <div className="mb-4 flex items-center gap-2"><CalendarDays size={18} /><h2 className="font-semibold">Leistungen</h2></div>
        <form action={addBookingServiceAction} className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <Field label="Name der Leistung"><input name="name" placeholder="z.B. Erstgespräch, Dinner, Hochzeitstag" className="admin-input" /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Dauer in Minuten"><input name="durationMinutes" type="number" min={0} placeholder="z.B. 60" className="admin-input" /></Field>
            <TimeModelSelect />
            <Field label="Puffer davor (Min.)"><input name="bufferBeforeMinutes" type="number" min={0} placeholder="z.B. 10" className="admin-input" /></Field>
            <Field label="Puffer danach (Min.)"><input name="bufferAfterMinutes" type="number" min={0} placeholder="z.B. 15" className="admin-input" /></Field>
            <Field label="Min. Personen/Menge"><input name="minPartySize" type="number" min={1} placeholder="optional" className="admin-input" /></Field>
            <Field label="Max. Personen/Menge"><input name="maxPartySize" type="number" min={1} placeholder="optional" className="admin-input" /></Field>
          </div>
          <Field label="Preislabel optional"><input name="priceLabel" placeholder="z.B. ab 89 €, kostenlos, auf Anfrage" className="admin-input" /></Field>
          <Field label="Beschreibung optional"><textarea name="description" placeholder="Kurz erklären, was gebucht wird" className="admin-input min-h-20" /></Field>
          <Field label="Zusatzfragen optional">
            <textarea name="intakeQuestions" placeholder={'Eine Frage pro Zeile. Stern = Pflicht. Optionen mit | trennen.\nAllergien oder Wünsche *\nBereich | Innen, Terrasse, Egal'} className="admin-input min-h-24" />
          </Field>
          <label className="flex items-center gap-2 text-sm"><input name="requiresResource" type="checkbox" /> Benötigt Ressource</label>
          <AllowedResourceTypesField />
          <button className="admin-btn-secondary">Leistung hinzufügen</button>
        </form>
        <div className="mt-4 space-y-3">
          {services.length ? services.map((service) => {
            const serviceRules = service as BookingService & {
              bufferBeforeMinutes?: number | null;
              bufferAfterMinutes?: number | null;
              minPartySize?: number | null;
              maxPartySize?: number | null;
              intakeQuestions?: unknown;
            };
            return (
            <details key={service.id} className="rounded-2xl border border-zinc-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                <div>
                  <h3 className="font-semibold text-zinc-950">{service.name}</h3>
                  <p className="text-sm text-zinc-500">{service.durationMinutes ? `${service.durationMinutes} Min.` : 'Flexible Dauer'}{service.priceLabel ? ` · ${service.priceLabel}` : ''}</p>
                </div>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">Bearbeiten</span>
              </summary>
              <form action={updateBookingServiceAction} className="border-t border-zinc-100 p-4">
                <input type="hidden" name="id" value={service.id} />
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Name"><input name="name" defaultValue={service.name} className="admin-input" /></Field>
                  <Field label="Dauer in Minuten"><input name="durationMinutes" type="number" min={0} defaultValue={service.durationMinutes || ''} className="admin-input" /></Field>
                  <TimeModelSelect value={service.timeModelOverride || ''} />
                  <Field label="Puffer davor (Min.)"><input name="bufferBeforeMinutes" type="number" min={0} defaultValue={serviceRules.bufferBeforeMinutes || 0} className="admin-input" /></Field>
                  <Field label="Puffer danach (Min.)"><input name="bufferAfterMinutes" type="number" min={0} defaultValue={serviceRules.bufferAfterMinutes || 0} className="admin-input" /></Field>
                  <Field label="Min. Personen/Menge"><input name="minPartySize" type="number" min={1} defaultValue={serviceRules.minPartySize || ''} className="admin-input" /></Field>
                  <Field label="Max. Personen/Menge"><input name="maxPartySize" type="number" min={1} defaultValue={serviceRules.maxPartySize || ''} className="admin-input" /></Field>
                  <Field label="Preislabel"><input name="priceLabel" defaultValue={service.priceLabel || ''} className="admin-input" /></Field>
                  <Field label="Beschreibung"><textarea name="description" defaultValue={service.description || ''} className="admin-input min-h-20" /></Field>
                  <Field label="Zusatzfragen">
                    <textarea name="intakeQuestions" defaultValue={formatIntakeQuestions(serviceRules.intakeQuestions)} className="admin-input min-h-24" />
                  </Field>
                  <label className="flex items-center gap-2 self-end text-sm"><input name="requiresResource" type="checkbox" defaultChecked={service.requiresResource} /> Benötigt Ressource</label>
                  <AllowedResourceTypesField value={Array.isArray(service.allowedResourceTypes) ? service.allowedResourceTypes : []} />
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <DeleteButton action={deleteBookingServiceAction} id={service.id} label="Leistung löschen" subject={service.name} />
                  <button className="admin-btn-primary">Speichern</button>
                </div>
              </form>
            </details>
          ); }) : <EmptyText>Noch keine Leistungen.</EmptyText>}
        </div>
      </section>
    </div>
  );
}

function AvailabilityPanel({ rules, resources, services }: { rules: BookingAvailabilityRule[]; resources: BookingResource[]; services: BookingService[] }) {
  return (
    <section className="admin-card p-5">
      <h2 className="mb-1 font-semibold">Verfügbarkeiten</h2>
      <p className="mb-5 text-sm text-zinc-500">Regeln können global gelten oder auf eine konkrete Ressource bzw. Leistung begrenzt werden.</p>
      <form action={addBookingAvailabilityRuleAction} className="grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 lg:grid-cols-7">
        <WeekdayField />
        <Field label="Von"><input name="startTime" type="time" className="admin-input" /></Field>
        <Field label="Bis"><input name="endTime" type="time" className="admin-input" /></Field>
        <CapacitySlotField />
        <ResourceSelect resources={resources} />
        <ServiceSelect services={services} />
        <div className="flex items-end"><button className="admin-btn-secondary w-full">Regel hinzufügen</button></div>
      </form>
      <p className="mt-2 text-xs leading-5 text-zinc-400">Die Slot-Kapazität begrenzt, wie viele Buchungen in diesem Zeitfenster parallel möglich sind, wenn kein konkreter Ressourcen-Konflikt greift.</p>
      <div className="mt-5 space-y-3">
        {rules.length ? rules.map(rule => (
          <form key={rule.id} action={updateBookingAvailabilityRuleAction} className="rounded-2xl border border-zinc-200 p-4">
            <input type="hidden" name="id" value={rule.id} />
            <div className="grid gap-3 lg:grid-cols-6">
              <WeekdayField value={rule.weekday} />
              <Field label="Von"><input name="startTime" type="time" defaultValue={rule.startTime} className="admin-input" /></Field>
              <Field label="Bis"><input name="endTime" type="time" defaultValue={rule.endTime} className="admin-input" /></Field>
              <CapacitySlotField value={rule.capacity || 1} />
              <ResourceSelect resources={resources} value={rule.resourceId || ''} />
              <ServiceSelect services={services} value={rule.serviceId || ''} />
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <DeleteButton action={deleteBookingAvailabilityRuleAction} id={rule.id} label="Regel löschen" subject={`${WEEKDAYS[rule.weekday] || 'Wochentag'} ${rule.startTime}-${rule.endTime}`} />
              <button className="admin-btn-primary">Speichern</button>
            </div>
          </form>
        )) : <EmptyText>Noch keine Verfügbarkeiten.</EmptyText>}
      </div>
    </section>
  );
}

function BlackoutsPanel({ blackouts, resources }: { blackouts: BookingBlackout[]; resources: BookingResource[] }) {
  const resourceById = new Map(resources.map(resource => [resource.id, resource]));
  return (
    <section className="admin-card p-5">
      <h2 className="mb-1 font-semibold">Sperrzeiten</h2>
      <p className="mb-5 text-sm text-zinc-500">Blockiere ganze Zeiträume global oder nur für eine bestimmte Ressource. Diese Zeiten sind im öffentlichen Booking nicht buchbar.</p>
      <form action={addBookingBlackoutAction} className="grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 lg:grid-cols-5">
        <Field label="Start">
          <input name="startsAt" type="datetime-local" className="admin-input" />
        </Field>
        <Field label="Ende">
          <input name="endsAt" type="datetime-local" className="admin-input" />
        </Field>
        <ResourceSelect resources={resources} />
        <Field label="Grund optional">
          <input name="reason" placeholder="z.B. Urlaub, Feiertag, Privatveranstaltung" className="admin-input" />
        </Field>
        <div className="flex items-end"><button className="admin-btn-secondary w-full">Sperrzeit hinzufügen</button></div>
      </form>
      <div className="mt-5 space-y-3">
        {blackouts.length ? blackouts.map(blackout => {
          const resource = blackout.resourceId ? resourceById.get(blackout.resourceId) : null;
          const title = blackout.reason || 'Sperrzeit';
          return (
            <div key={blackout.id} className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-zinc-950">{title}</h3>
                <p className="text-sm text-zinc-500">{formatDate(blackout.startsAt)} bis {formatDate(blackout.endsAt)}</p>
                <p className="text-sm text-zinc-500">{resource ? `Ressource: ${resource.name}` : 'Gilt global für alle Ressourcen'}</p>
              </div>
              <DeleteButton action={deleteBookingBlackoutAction} id={blackout.id} label="Sperrzeit löschen" subject={title} />
            </div>
          );
        }) : <EmptyText>Noch keine Sperrzeiten.</EmptyText>}
      </div>
    </section>
  );
}

function EmailPanel({ templateByTrigger }: { templateByTrigger: Map<string, { subject: string; body: string }> }) {
  return (
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
              <Field label="Betreff"><input name="subject" defaultValue={current?.subject || fallback.subject} className="admin-input" /></Field>
              <Field label="Text"><textarea name="body" defaultValue={current?.body || fallback.body} className="admin-input min-h-48 font-mono text-xs" /></Field>
              <p className="text-xs text-zinc-400">Platzhalter: {'{{customerName}}'}, {'{{bookingDate}}'}, {'{{bookingSummary}}'}, {'{{companyName}}'}, {'{{cancellationUrl}}'}</p>
              <button className="admin-btn-secondary">Vorlage speichern</button>
            </form>
          );
        })}
      </div>
    </section>
  );
}

function SettingsPanel({ settings }: { settings: NonNullable<Awaited<ReturnType<typeof getBookingAdminData>>['settings']> }) {
  return (
    <section className="admin-card p-5">
      <div className="mb-4 flex items-center gap-2"><Settings size={18} /><h2 className="font-semibold">Grundeinstellungen</h2></div>
      <form action={saveBookingSettingsAction} className="grid gap-4 md:grid-cols-2">
        <Field label="Buchungsmodus">
          <select name="mode" defaultValue={settings.mode} className="admin-input">
            <option value="request">Nur Anfrage, manuell bestätigen</option>
            <option value="instant">Direkte Self-Service-Buchung</option>
          </select>
        </Field>
        <Field label="Zeitmodell">
          <select name="timeModel" defaultValue={settings.timeModel} className="admin-input">
            {TIME_MODELS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </Field>
        <Field label="Zeitzone">
          <input name="timezone" defaultValue={settings.timezone || 'Europe/Berlin'} placeholder="Europe/Berlin" className="admin-input" />
          <p className="mt-1 text-xs leading-5 text-zinc-400">Standard ist Europe/Berlin. Wichtig für korrekte Slots, E-Mails und Tagespläne.</p>
        </Field>
        <Field label="Intervall in Minuten"><input name="intervalMinutes" type="number" min={5} max={1440} defaultValue={settings.intervalMinutes} className="admin-input" /></Field>
        <Field label="Mindest-Vorlauf in Stunden"><input name="minNoticeHours" type="number" min={0} defaultValue={settings.minNoticeHours} className="admin-input" /></Field>
        <Field label="Maximal im Voraus in Tagen"><input name="maxAdvanceDays" type="number" min={1} defaultValue={settings.maxAdvanceDays} className="admin-input" /></Field>
        <Field label="Storno-Frist in Stunden"><input name="cancellationDeadlineHours" type="number" min={0} defaultValue={settings.cancellationDeadlineHours} className="admin-input" /></Field>
        <Field label="Benachrichtigungs-E-Mail"><input name="notificationEmail" type="email" defaultValue={settings.notificationEmail || ''} placeholder="Leer = SMTP-Absenderadresse" className="admin-input" /></Field>
        <div className="space-y-3 rounded-xl border border-zinc-200 p-4">
          <label className="flex items-center gap-2 text-sm"><input name="cancellationAllowed" type="checkbox" defaultChecked={settings.cancellationAllowed} /> Kunden dürfen stornieren</label>
          <label className="flex items-center gap-2 text-sm"><input name="customerEmailEnabled" type="checkbox" defaultChecked={settings.customerEmailEnabled} /> E-Mails an Kunden senden</label>
          <label className="flex items-center gap-2 text-sm"><input name="adminEmailEnabled" type="checkbox" defaultChecked={settings.adminEmailEnabled} /> E-Mails an Admin senden</label>
        </div>
        <div className="md:col-span-2"><button className="admin-btn-primary">Einstellungen speichern</button></div>
      </form>
    </section>
  );
}

type EnrichedRequest = BookingRequest & {
  resource?: BookingResource | null;
  service?: BookingService | null;
};

function BookingCard({ request, resources, compact }: { request: EnrichedRequest; resources: BookingResource[]; compact?: boolean }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{request.customerName}</h3>
            <StatusBadge status={request.status} />
          </div>
          <p className="mt-1 text-sm text-zinc-500">{formatDate(request.startsAt)} bis {formatDate(request.endsAt)} · {request.partySize} Person(en)/Einheit(en)</p>
          <p className="text-sm text-zinc-500">{[request.service?.name, request.resource?.name].filter(Boolean).join(' · ') || 'Keine Leistung/Ressource'}</p>
          {!compact ? <p className="text-sm text-zinc-500">{[request.customerEmail, request.customerPhone].filter(Boolean).join(' · ') || 'Keine Kontaktdaten'}</p> : null}
          {!compact && request.message ? <p className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600">{request.message}</p> : null}
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <AssignmentForm request={request} resources={resources} />
          <StatusActions request={request} returnTo="/admin/functions/booking?tab=inbox" />
        </div>
      </div>
    </div>
  );
}

function BookingMiniRow({ request, resources }: { request: EnrichedRequest; resources?: BookingResource[] }) {
  const returnTo = `/admin/functions/booking?tab=day&day=${request.startsAt.toISOString().slice(0, 10)}`;
  return (
    <div className="rounded-xl bg-white p-3 text-sm shadow-sm ring-1 ring-zinc-200">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium text-zinc-900">{timeOnly(request.startsAt)} · {request.customerName}</p>
        <StatusBadge status={request.status} />
      </div>
      <p className="mt-1 text-zinc-500">{[request.service?.name, request.resource?.name, `${request.partySize} Person(en)/Einheit(en)`].filter(Boolean).join(' · ')}</p>
      {resources?.length ? <AssignmentForm request={request} resources={resources} compact /> : null}
      <div className="mt-2">
        <StatusActions request={request} returnTo={returnTo} compact />
      </div>
    </div>
  );
}

function AssignmentForm({ request, resources, compact }: { request: EnrichedRequest; resources: BookingResource[]; compact?: boolean }) {
  return (
    <form action={updateBookingAssignmentAction} className={compact ? 'mt-2 flex gap-2' : 'flex min-w-[220px] gap-2'}>
      <input type="hidden" name="id" value={request.id} />
      <input type="hidden" name="returnTo" value="/admin/functions/booking?tab=inbox" />
      <select name="resourceId" defaultValue={request.resourceId || ''} className="admin-input text-xs">
        <option value="">Keine Ressource</option>
        {resources.map(resource => <option key={resource.id} value={resource.id}>{resource.name}</option>)}
      </select>
      <button className="admin-btn-secondary whitespace-nowrap text-xs">Zuordnen</button>
    </form>
  );
}

function StatusActions({ request, returnTo, compact }: { request: EnrichedRequest; returnTo?: string; compact?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {request.status === 'requested' ? (
        <>
          <StatusAction id={request.id} status="confirmed" label="Bestätigen" returnTo={returnTo} compact={compact} />
          <StatusAction id={request.id} status="cancelled_by_admin" label="Absagen" returnTo={returnTo} compact={compact} danger />
        </>
      ) : null}
      {request.status === 'confirmed' ? (
        <>
          <StatusAction id={request.id} status="completed" label="Erledigt" returnTo={returnTo} compact={compact} />
          <StatusAction id={request.id} status="no_show" label="No-show" returnTo={returnTo} compact={compact} />
          <StatusAction id={request.id} status="cancelled_by_admin" label="Absagen" returnTo={returnTo} compact={compact} danger />
        </>
      ) : null}
    </div>
  );
}

function StatusAction({ id, status, label, returnTo = '/admin/functions/booking?tab=inbox', compact, danger }: { id: string; status: string; label: string; returnTo?: string; compact?: boolean; danger?: boolean }) {
  return (
    <form action={updateBookingStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <button className={[
        danger ? 'admin-btn-secondary text-red-600 hover:border-red-200 hover:bg-red-50' : 'admin-btn-secondary',
        compact ? 'px-2 py-1 text-xs' : '',
      ].filter(Boolean).join(' ')}>{label}</button>
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

function DeleteButton({ action, id, label, subject }: { action: (formData: FormData) => Promise<void>; id: string; label: string; subject: string }) {
  return (
    <ConfirmDeleteForm
      action={action}
      id={id}
      label={label}
      title={label}
      message={`Möchtest du „${subject}“ wirklich löschen? Die Änderung wirkt sich sofort auf neue Buchungen und Verfügbarkeiten aus.`}
    />
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="admin-label">{label}</span>{children}</label>;
}

function EmptyText({ children }: { children: ReactNode }) {
  return <p className="py-4 text-sm text-zinc-400">{children}</p>;
}

function FeedbackMessage({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div className={[
      'rounded-2xl border px-4 py-3 text-sm font-medium',
      type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800',
    ].join(' ')}>
      {message}
    </div>
  );
}

function MetricCard({ label, value, href }: { label: string; value: string; href?: string }) {
  const body = (
    <div className="admin-card p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-zinc-950">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

function ResourceTypeSelect({ value }: { value?: string }) {
  return (
    <Field label="Ressourcen-Typ">
      <select name="type" defaultValue={value || 'generic'} className="admin-input">
        {RESOURCE_TYPES.map(([type, label]) => <option key={type} value={type}>{label}</option>)}
      </select>
    </Field>
  );
}

function CapacityField({ value }: { value?: number }) {
  return (
    <Field label="Kapazität je Zeitfenster">
      <input name="capacity" type="number" min={1} defaultValue={value || 1} placeholder="z.B. 1" className="admin-input" />
      <p className="mt-1 text-xs leading-5 text-zinc-400">Wie viele Buchungen gleichzeitig auf diese Ressource dürfen. Ein einzelner Tisch ist meist 1.</p>
    </Field>
  );
}

function SeatsField({ value }: { value?: number }) {
  return (
    <Field label="Sitzplätze / Plätze optional">
      <input name="seats" type="number" min={1} defaultValue={value || ''} placeholder="z.B. 4" className="admin-input" />
      <p className="mt-1 text-xs leading-5 text-zinc-400">Für Tische, Räume oder Zimmer. Getrennt von der parallelen Buchungskapazität.</p>
    </Field>
  );
}

function AllowedResourceTypesField({ value = [] }: { value?: string[] }) {
  return (
    <div className="md:col-span-2">
      <span className="admin-label">Erlaubte Ressourcentypen optional</span>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {RESOURCE_TYPES.map(([type, label]) => (
          <label key={type} className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm">
            <input name="allowedResourceTypes" type="checkbox" value={type} defaultChecked={value.includes(type)} />
            {label}
          </label>
        ))}
      </div>
      <p className="mt-1 text-xs leading-5 text-zinc-400">Leer lassen = alle Ressourcen sind erlaubt. Aktivieren, wenn z.B. eine Massage nur Mitarbeiter und keine Räume verwenden darf.</p>
    </div>
  );
}

function CapacitySlotField({ value }: { value?: number }) {
  return (
    <Field label="Buchungen je Slot">
      <input name="capacity" type="number" min={1} defaultValue={value || 1} placeholder="z.B. 1" className="admin-input" />
    </Field>
  );
}

function TimeModelSelect({ value }: { value?: string }) {
  return (
    <Field label="Zeitmodell">
      <select name="timeModelOverride" defaultValue={value || ''} className="admin-input">
        <option value="">Standard-Zeitmodell</option>
        {TIME_MODELS.map(([model, label]) => <option key={model} value={model}>{label}</option>)}
      </select>
    </Field>
  );
}

function formatIntakeQuestions(value: unknown) {
  if (!Array.isArray(value)) return '';
  return value.map((question) => {
    if (!question || typeof question !== 'object') return '';
    const item = question as { label?: unknown; required?: unknown; options?: unknown };
    const label = typeof item.label === 'string' ? item.label.trim() : '';
    if (!label) return '';
    const options = Array.isArray(item.options) ? item.options.filter((option): option is string => typeof option === 'string' && Boolean(option.trim())) : [];
    return `${label}${item.required ? ' *' : ''}${options.length ? ` | ${options.join(', ')}` : ''}`;
  }).filter(Boolean).join('\n');
}

function WeekdayField({ value }: { value?: number }) {
  return (
    <Field label="Wochentag">
      <select name="weekday" defaultValue={value ?? 1} className="admin-input">
        {WEEKDAYS.map((day, i) => <option key={day} value={i}>{day}</option>)}
      </select>
    </Field>
  );
}

function ResourceSelect({ resources, value }: { resources: BookingResource[]; value?: string }) {
  return (
    <Field label="Ressource optional">
      <select name="resourceId" defaultValue={value || ''} className="admin-input">
        <option value="">Alle Ressourcen</option>
        {resources.map(resource => <option key={resource.id} value={resource.id}>{resource.name}</option>)}
      </select>
    </Field>
  );
}

function ServiceSelect({ services, value }: { services: BookingService[]; value?: string }) {
  return (
    <Field label="Leistung optional">
      <select name="serviceId" defaultValue={value || ''} className="admin-input">
        <option value="">Alle Leistungen</option>
        {services.map(service => <option key={service.id} value={service.id}>{service.name}</option>)}
      </select>
    </Field>
  );
}

function filterRequests(requests: EnrichedRequest[], params: SearchParams) {
  const status = param(params, 'status');
  const from = param(params, 'from');
  const to = param(params, 'to');
  const resourceId = param(params, 'resourceId');
  const serviceId = param(params, 'serviceId');
  const query = param(params, 'q').toLowerCase();
  return requests.filter(request => {
    if (status && request.status !== status) return false;
    if (resourceId && request.resourceId !== resourceId) return false;
    if (serviceId && request.serviceId !== serviceId) return false;
    if (from && request.startsAt < startOfDay(from)) return false;
    if (to && request.startsAt > endOfDay(to)) return false;
    if (query) {
      const haystack = [request.customerName, request.customerEmail, request.customerPhone, request.message, request.service?.name, request.resource?.name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  }).sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

function param(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function tabParam(value: string): BookingTab {
  return TABS.some(tab => tab.key === value) ? value as BookingTab : 'overview';
}

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}

function toDateTimeLocal(date: Date, timezone?: string | null) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone || 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const value = (type: string) => parts.find(part => part.type === type)?.value || '';
  return `${value('year')}-${value('month')}-${value('day')}T${value('hour')}:${value('minute')}`;
}

function sameDate(date: Date, input: string) {
  return date >= startOfDay(input) && date <= endOfDay(input);
}

function startOfDay(input: string) {
  return new Date(`${input}T00:00:00`);
}

function endOfDay(input: string) {
  return new Date(`${input}T23:59:59.999`);
}

function formatDate(date: Date) {
  return formatBookingDate(date);
}

function timeOnly(date: Date) {
  return new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(date);
}
