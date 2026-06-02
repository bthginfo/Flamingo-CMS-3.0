'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { CalendarCheck, CheckCircle, ChevronLeft, ChevronRight, Clock3, Loader2, MapPin, Sparkles } from 'lucide-react';
import type { SectionProps } from '../restaurant';

type BookingTimeModel = 'time_slot' | 'full_day' | 'date_range';

type BookingConfig = {
  enabled: boolean;
  mode: 'request' | 'instant';
  timeModel: BookingTimeModel;
  timezone: string;
  intervalMinutes: number;
  services: { id: string; name: string; durationMinutes: number | null; priceLabel: string | null; timeModelOverride: BookingTimeModel | null; requiresResource?: boolean; allowedResourceTypes?: string[] }[];
  resources: { id: string; name: string; type: string; capacity: number; seats?: number | null }[];
};

const PREVIEW_CONFIG: BookingConfig = {
  enabled: true,
  mode: 'request',
  timeModel: 'time_slot',
  timezone: 'Europe/Berlin',
  intervalMinutes: 30,
  services: [
    { id: 'preview-service-1', name: 'Erstgespräch', durationMinutes: 30, priceLabel: 'kostenlos', timeModelOverride: null, requiresResource: false, allowedResourceTypes: [] },
    { id: 'preview-service-2', name: 'Beratung vor Ort', durationMinutes: 60, priceLabel: 'auf Anfrage', timeModelOverride: null, requiresResource: true, allowedResourceTypes: ['staff', 'room', 'generic'] },
  ],
  resources: [
    { id: 'preview-resource-1', name: 'Team Slot 1', type: 'staff', capacity: 1, seats: null },
    { id: 'preview-resource-2', name: 'Beratungsraum', type: 'room', capacity: 1, seats: 4 },
  ],
};

function normalizeConfig(value: Partial<BookingConfig> | null | undefined): BookingConfig {
  return {
    ...PREVIEW_CONFIG,
    ...value,
    enabled: value?.enabled ?? false,
    services: Array.isArray(value?.services) ? value.services : [],
    resources: Array.isArray(value?.resources) ? value.resources : [],
  };
}

export function BookingWidgetSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Termin oder Anfrage senden';
  const subline = (data.subline as string) || 'Wählen Sie aus, was Sie buchen möchten. Wir melden uns mit allen Details.';
  const badge = (data.badge as string) || 'Booking';
  const submitLabel = (data.submitLabel as string) || '';
  const tenantId = (data.tenantId as string) || '';
  const [config, setConfig] = useState<BookingConfig | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<{ value: string; label: string }[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!tenantId) {
      setConfig(PREVIEW_CONFIG);
      return;
    }
    const query = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : '';
    fetch(`/api/booking/config${query}`)
      .then((res) => res.json())
      .then((json) => setConfig(normalizeConfig(json)))
      .catch(() => setConfig(normalizeConfig({ enabled: false })));
  }, [tenantId]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    try {
      const res = await fetch('/api/booking/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, tenantId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Buchung konnte nicht gesendet werden.');
      setStatus('success');
      e.currentTarget.reset();
      setSelectedServiceId('');
      setSelectedResourceId('');
      setSelectedDate('');
      setSlots([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      setStatus('error');
    }
  }

  const selectedService = useMemo(
    () => (config?.services || []).find((service) => service.id === selectedServiceId),
    [config?.services, selectedServiceId],
  );
  const timeModel = selectedService?.timeModelOverride || config?.timeModel || 'time_slot';
  const actionLabel = submitLabel || (config?.mode === 'instant' ? 'Jetzt buchen' : 'Anfrage senden');
  const allowedResourceTypes = Array.isArray(selectedService?.allowedResourceTypes) ? selectedService.allowedResourceTypes : [];
  const availableResources = (config?.resources || []).filter(resource => !allowedResourceTypes.length || allowedResourceTypes.includes(resource.type));
  const resourceRequired = Boolean(selectedService?.requiresResource);

  useEffect(() => {
    if (!config?.enabled || !selectedDate || timeModel !== 'time_slot') {
      setSlots([]);
      return;
    }
    if (resourceRequired && !selectedResourceId) {
      setSlots([]);
      return;
    }
    const query = new URLSearchParams({
      date: selectedDate,
      serviceId: selectedServiceId,
      resourceId: selectedResourceId,
      tenantId,
    });
    setSlotsLoading(true);
    fetch(`/api/booking/availability?${query.toString()}`)
      .then(res => res.json())
      .then(json => setSlots(Array.isArray(json.slots) ? json.slots : []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [config?.enabled, resourceRequired, selectedDate, selectedResourceId, selectedServiceId, tenantId, timeModel]);

  return (
    <section
      id="booking"
      className="relative overflow-hidden rounded-[var(--style-card-radius,2rem)] px-5 py-10 shadow-2xl sm:px-8 md:px-12"
      style={{ background: 'var(--booking-section-bg, #09090b)', color: 'var(--booking-text-primary, #ffffff)' }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 20% 10%, rgba(255,255,255,.18), transparent 28%), radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--booking-accent-color, #f43f5e) 22%, transparent), transparent 30%)' }}
      />
      <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]" style={{ background: 'var(--booking-badge-bg, rgba(255,255,255,.1))', color: 'var(--booking-badge-text, rgba(255,255,255,.8))' }}>
            <CalendarCheck size={15} /> {badge}
          </p>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl" style={{ color: 'var(--booking-heading-color, var(--booking-text-primary, #ffffff))' }}>{headline}</h2>
          <p className="max-w-xl text-base leading-7" style={{ color: 'var(--booking-body-color, rgba(255,255,255,.72))' }}>{subline}</p>
          <div className="rounded-2xl border p-4 text-sm" style={{ borderColor: 'var(--booking-border-color, rgba(255,255,255,.12))', background: 'color-mix(in srgb, var(--booking-card-bg, #ffffff) 8%, transparent)', color: 'var(--booking-muted-color, rgba(255,255,255,.7))' }}>
            {timeModel === 'full_day' && 'Diese Buchung blockiert einen ganzen Tag.'}
            {timeModel === 'date_range' && 'Diese Buchung prüft einen Datumsbereich, z.B. für Zimmer, Locations oder mehrtägige Leistungen.'}
            {timeModel === 'time_slot' && `Diese Buchung nutzt Zeitslots${config?.intervalMinutes ? ` im ${config.intervalMinutes}-Minuten-Raster` : ''}.`}
          </div>
        </div>

        <div className="rounded-[var(--style-card-radius,1.5rem)] border p-4 shadow-xl sm:p-6" style={{ borderColor: 'var(--booking-border-color, rgba(255,255,255,.1))', background: 'var(--booking-card-bg, #ffffff)', color: 'var(--booking-text-secondary, #09090b)' }}>
          {config && !config.enabled ? (
            <div className="rounded-2xl bg-amber-50 p-5 text-sm text-amber-800">Booking ist für diese Website noch nicht aktiviert.</div>
          ) : status === 'success' ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-center">
              <CheckCircle className="text-emerald-500" size={44} />
              <p className="text-xl font-bold">{config?.mode === 'instant' ? 'Buchung eingegangen' : 'Anfrage gesendet'}</p>
              <p className="text-sm text-zinc-500">Sie erhalten in Kürze eine Bestätigung per E-Mail.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="customerName" required placeholder="Name *" className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900" />
                <input name="customerEmail" type="email" placeholder="E-Mail" className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900" />
              </div>
              <input name="customerPhone" type="tel" placeholder="Telefon" className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900" />
              <div className="grid gap-3 sm:grid-cols-2">
                <select name="serviceId" value={selectedServiceId} onChange={(event) => { setSelectedServiceId(event.target.value); setSelectedResourceId(''); }} className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900">
                  <option value="">Leistung auswählen</option>
                  {config?.services.map((service) => <option key={service.id} value={service.id}>{service.name}{service.priceLabel ? ` · ${service.priceLabel}` : ''}</option>)}
                </select>
                <select name="resourceId" value={selectedResourceId} required={resourceRequired} onChange={(event) => setSelectedResourceId(event.target.value)} className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900">
                  <option value="">{resourceRequired ? 'Ressource auswählen *' : 'Ressource optional'}</option>
                  {availableResources.map((resource) => <option key={resource.id} value={resource.id}>{resource.name}{resource.seats ? ` · ${resource.seats} Plätze` : ''}</option>)}
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="date" type="date" required value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900" />
                {timeModel === 'date_range' ? (
                  <input name="endDate" type="date" required className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900" />
                ) : timeModel === 'time_slot' ? (
                  <select name="time" required disabled={!selectedDate || slotsLoading || (resourceRequired && !selectedResourceId)} className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900 disabled:bg-zinc-50 disabled:text-zinc-400">
                    <option value="">{slotsLoading ? 'Slots laden...' : selectedDate ? 'Zeit auswählen' : 'Erst Datum wählen'}</option>
                    {slots.map(slot => <option key={slot.value} value={slot.value}>{slot.label}</option>)}
                  </select>
                ) : (
                  <input name="partySize" type="number" min={1} defaultValue={1} className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900" />
                )}
              </div>
              {timeModel === 'time_slot' && selectedDate && !slotsLoading && !slots.length ? (
                <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Für diese Auswahl sind aktuell keine freien Slots verfügbar.</p>
              ) : null}
              {timeModel !== 'full_day' && <input name="partySize" type="number" min={1} defaultValue={1} placeholder="Personen / Menge" className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900" />}
              <textarea name="message" rows={3} placeholder="Nachricht optional" className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900" />
              {status === 'error' && <p className="text-sm text-red-600">{error}</p>}
              <button disabled={status === 'loading'} className="mt-1 inline-flex items-center justify-center gap-2 rounded-[var(--style-button-radius,.75rem)] px-5 py-3 font-bold transition hover:brightness-95 disabled:opacity-60" style={{ background: 'var(--brand-btn-bg, #09090b)', color: 'var(--brand-btn-text, #ffffff)' }}>
                {status === 'loading' && <Loader2 className="animate-spin" size={17} />}
                {actionLabel}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function AvailabilityCalendarSection({ data }: SectionProps) {
  const tenantId = (data.tenantId as string) || '';
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => toInputDate(new Date()));
  const days = useMemo(() => {
    const today = new Date();
    const visibleMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const monthEnd = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0);
    const start = addDays(monthStart, -((monthStart.getDay() + 6) % 7));
    const end = addDays(monthEnd, 6 - ((monthEnd.getDay() + 6) % 7));
    const length = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    return Array.from({ length }, (_, index) => {
      const date = addDays(start, index);
      const dateKey = toInputDate(date);
      return {
        label: new Intl.DateTimeFormat('de-DE', { weekday: 'short' }).format(date),
        date: dateKey,
        day: date.getDate(),
        inMonth: date.getMonth() === visibleMonth.getMonth(),
        isToday: dateKey === toInputDate(today),
      };
    });
  }, [monthOffset]);
  const visibleMonthLabel = useMemo(() => {
    const today = new Date();
    const visibleMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    return new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(visibleMonth);
  }, [monthOffset]);
  const selectedCount = counts[selectedDate];

  useEffect(() => {
    if (!tenantId) {
      setCounts(Object.fromEntries(days.map((day, index) => [day.date, !day.inMonth ? null : index % 6 === 0 ? 0 : 2 + (index % 7)])));
      return;
    }
    let cancelled = false;
    Promise.all(days.map(async day => {
      const query = new URLSearchParams({ date: day.date, tenantId });
      const res = await fetch(`/api/booking/availability?${query.toString()}`);
      const json = await res.json().catch(() => ({}));
      return [day.date, Array.isArray(json.slots) ? json.slots.length : 0] as const;
    })).then(entries => {
      if (!cancelled) setCounts(Object.fromEntries(entries));
    }).catch(() => {
      if (!cancelled) setCounts(Object.fromEntries(days.map(day => [day.date, null])));
    });
    return () => { cancelled = true; };
  }, [days, tenantId]);

  return (
    <BookingShell data={data} icon={<Clock3 size={18} />} defaultBadge="Verfügbarkeit" defaultHeadline="Freie Zeiten auf einen Blick">
      <div className="rounded-[var(--style-card-radius,1.5rem)] border p-3 sm:p-4" style={{ borderColor: 'var(--booking-border-color, rgba(255,255,255,.14))', background: 'color-mix(in srgb, var(--booking-card-bg, #ffffff) 10%, transparent)' }}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <button type="button" onClick={() => setMonthOffset((value) => value - 1)} className="grid h-9 w-9 place-items-center rounded-full border transition hover:brightness-110" style={{ borderColor: 'var(--booking-border-color, rgba(255,255,255,.18))', color: 'var(--booking-heading-color, #ffffff)' }} aria-label="Vorheriger Monat">
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <p className="text-sm font-black capitalize" style={{ color: 'var(--booking-heading-color, #ffffff)' }}>{visibleMonthLabel}</p>
            <p className="text-xs" style={{ color: 'var(--booking-body-color, rgba(255,255,255,.68))' }}>
              {selectedCount == null ? 'Datum auswählen' : selectedCount > 0 ? `${selectedCount} freie Slots am ausgewählten Tag` : 'An diesem Tag aktuell nichts frei'}
            </p>
          </div>
          <button type="button" onClick={() => setMonthOffset((value) => value + 1)} className="grid h-9 w-9 place-items-center rounded-full border transition hover:brightness-110" style={{ borderColor: 'var(--booking-border-color, rgba(255,255,255,.18))', color: 'var(--booking-heading-color, #ffffff)' }} aria-label="Nächster Monat">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((label) => (
            <div key={label} className="py-1 text-center text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--booking-muted-color, rgba(255,255,255,.52))' }}>{label}</div>
          ))}
          {days.map((day) => (
          <button key={day.date} type="button" onClick={() => setSelectedDate(day.date)} className="min-h-[76px] rounded-2xl border p-2 text-left transition hover:-translate-y-0.5 hover:brightness-110" style={{ borderColor: selectedDate === day.date ? 'var(--booking-accent-color, #f43f5e)' : 'var(--booking-border-color, rgba(255,255,255,.14))', background: selectedDate === day.date ? 'color-mix(in srgb, var(--booking-accent-color, #f43f5e) 22%, transparent)' : day.inMonth ? 'color-mix(in srgb, var(--booking-card-bg, #ffffff) 8%, transparent)' : 'rgba(255,255,255,.03)', opacity: day.inMonth ? 1 : 0.42 }} aria-label={`${day.label}, ${day.day}. ${counts[day.date] ?? 0} freie Slots`}>
            <span className="flex items-start justify-between gap-1">
              <span className="text-xs font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--booking-muted-color, rgba(255,255,255,.62))' }}>{day.label}</span>
              {day.isToday ? <span className="h-2 w-2 rounded-full" style={{ background: 'var(--booking-accent-color, #f43f5e)' }} /> : null}
            </span>
            <span className="mt-1 block text-lg font-black" style={{ color: 'var(--booking-heading-color, #ffffff)' }}>{day.day}</span>
            <p className="mt-3 text-2xl font-black" style={{ color: 'var(--booking-heading-color, #ffffff)' }}>{counts[day.date] ?? '–'}</p>
            <p className="text-sm" style={{ color: 'var(--booking-body-color, rgba(255,255,255,.74))' }}>Slots möglich</p>
          </button>
          ))}
        </div>
      </div>
    </BookingShell>
  );
}

export function ResourceBookingShowcaseSection({ data }: SectionProps) {
  return (
    <BookingShell data={data} icon={<MapPin size={18} />} defaultBadge="Ressourcen" defaultHeadline="Räume, Tische oder Teams direkt anfragen">
      <div className="grid gap-3">
        {['Ressource wählen', 'Zeitraum prüfen', 'Anfrage senden'].map((label, index) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl border p-4" style={{ borderColor: 'var(--booking-border-color, rgba(255,255,255,.14))', background: 'color-mix(in srgb, var(--booking-card-bg, #ffffff) 10%, transparent)' }}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-black" style={{ background: 'var(--booking-accent-color, #f43f5e)', color: 'var(--brand-btn-text, #09090b)' }}>{index + 1}</span>
            <p className="font-semibold" style={{ color: 'var(--booking-heading-color, #ffffff)' }}>{label}</p>
          </div>
        ))}
      </div>
    </BookingShell>
  );
}

export function BookingCtaProSection({ data }: SectionProps) {
  return (
    <section
      className="relative overflow-hidden rounded-[var(--style-card-radius,2rem)] px-5 py-8 shadow-2xl sm:px-8"
      style={{ background: 'var(--booking-section-bg, #09090b)', color: 'var(--booking-text-primary, #ffffff)' }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, color-mix(in srgb, var(--booking-accent-color, #f43f5e) 26%, transparent), transparent 48%)' }} />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]" style={{ background: 'var(--booking-badge-bg, rgba(255,255,255,.1))', color: 'var(--booking-badge-text, rgba(255,255,255,.8))' }}>
            <Sparkles size={14} /> {(data.badge as string) || 'Booking'}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl" style={{ color: 'var(--booking-heading-color, #ffffff)' }}>{(data.headline as string) || 'Jetzt Wunschtermin sichern'}</h2>
          <p className="mt-2 text-sm leading-6" style={{ color: 'var(--booking-body-color, rgba(255,255,255,.74))' }}>{(data.subline as string) || 'Direkt buchen oder erst unverbindlich anfragen. Das System passt sich dem freigeschalteten Booking-Modus an.'}</p>
        </div>
        <a href="#booking" className="inline-flex shrink-0 items-center justify-center rounded-[var(--style-button-radius,.75rem)] px-6 py-3 font-bold transition hover:brightness-95" style={{ background: 'var(--brand-btn-bg, #ffffff)', color: 'var(--brand-btn-text, #09090b)' }}>
          {(data.submitLabel as string) || 'Zum Booking'}
        </a>
      </div>
    </section>
  );
}

function BookingShell({ data, icon, defaultBadge, defaultHeadline, children }: { data: SectionProps['data']; icon: ReactNode; defaultBadge: string; defaultHeadline: string; children: ReactNode }) {
  return (
    <section id="booking" className="relative overflow-hidden rounded-[var(--style-card-radius,2rem)] px-5 py-10 shadow-2xl sm:px-8 md:px-12" style={{ background: 'var(--booking-section-bg, #09090b)', color: 'var(--booking-text-primary, #ffffff)' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 15% 10%, color-mix(in srgb, var(--booking-accent-color, #f43f5e) 28%, transparent), transparent 28%)' }} />
      <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]" style={{ background: 'var(--booking-badge-bg, rgba(255,255,255,.1))', color: 'var(--booking-badge-text, rgba(255,255,255,.8))' }}>{icon}{(data.badge as string) || defaultBadge}</p>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl" style={{ color: 'var(--booking-heading-color, #ffffff)' }}>{(data.headline as string) || defaultHeadline}</h2>
          <p className="mt-4 max-w-xl text-base leading-7" style={{ color: 'var(--booking-body-color, rgba(255,255,255,.72))' }}>{(data.subline as string) || 'Ein flexibler Booking-Einstieg für Termine, Tage, Räume, Ressourcen oder Anfragen.'}</p>
          <a href="#booking" className="mt-6 inline-flex items-center justify-center rounded-[var(--style-button-radius,.75rem)] px-5 py-3 font-bold transition hover:brightness-95" style={{ background: 'var(--brand-btn-bg, #ffffff)', color: 'var(--brand-btn-text, #09090b)' }}>{(data.submitLabel as string) || 'Anfrage starten'}</a>
        </div>
        {children}
      </div>
    </section>
  );
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function nextWeekend(date: Date) {
  const next = new Date(date);
  const day = next.getDay();
  const daysUntilSaturday = (6 - day + 7) % 7 || 7;
  next.setDate(next.getDate() + daysUntilSaturday);
  return next;
}

function toInputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
