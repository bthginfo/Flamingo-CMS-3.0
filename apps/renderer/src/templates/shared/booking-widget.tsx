'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { CalendarCheck, CheckCircle, ChevronLeft, ChevronRight, Clock3, Loader2, MapPin, Sparkles } from 'lucide-react';
import type { SectionProps } from '../restaurant';
import { plain } from '@/lib/strip-html';

type BookingTimeModel = 'time_slot' | 'full_day' | 'date_range';

type BookingConfig = {
  enabled: boolean;
  mode: 'request' | 'instant';
  timeModel: BookingTimeModel;
  timezone: string;
  intervalMinutes: number;
  services: { id: string; name: string; durationMinutes: number | null; bufferBeforeMinutes?: number; bufferAfterMinutes?: number; priceLabel: string | null; timeModelOverride: BookingTimeModel | null; requiresResource?: boolean; minPartySize?: number | null; maxPartySize?: number | null; allowedResourceTypes?: string[]; intakeQuestions?: { id: string; label: string; type?: string; required?: boolean; options?: string[] }[] }[];
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

const FORM_CONTROL_CLASS = 'min-h-12 w-full rounded-xl border border-[var(--token-input-border)] bg-[var(--token-input-bg)] px-4 py-3 text-sm text-[color:var(--token-input-text)] outline-none placeholder:text-[color:var(--token-label)] focus:border-[var(--token-btn-bg)]';
const FORM_LABEL_CLASS = 'text-sm font-semibold text-[color:var(--token-body,#09090b)]';
const FORM_MUTED_CLASS = 'text-[color:var(--token-muted,rgba(9,9,11,.55))]';
const FORM_HELP_CLASS = 'text-xs leading-5 text-[color:var(--token-muted,rgba(9,9,11,.62))]';
const FIELDSET_CLASS = 'grid gap-3 border-0 p-0';
const LEGEND_CLASS = 'mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--token-muted,rgba(9,9,11,.62))]';
const BOOKING_NOTICE_CLASS = 'rounded-2xl p-5 text-sm';
const BOOKING_NOTICE_STYLE = {
  background: 'var(--token-badge-bg)',
  color: 'var(--token-badge-text)',
};
const BOOKING_ERROR_STYLE = { color: 'var(--token-danger)' };

function BookingField({
  id,
  label,
  required,
  help,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  help?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <label htmlFor={id} className={FORM_LABEL_CLASS}>
        {label}
        {required ? (
          <>
            <span aria-hidden="true"> *</span>
            <span className="sr-only"> (Pflichtfeld)</span>
          </>
        ) : null}
      </label>
      {children}
      {help ? <p id={`${id}-help`} className={FORM_HELP_CLASS}>{help}</p> : null}
    </div>
  );
}

function normalizeConfig(value: Partial<BookingConfig> | null | undefined): BookingConfig {
  return {
    ...PREVIEW_CONFIG,
    ...value,
    enabled: value?.enabled ?? false,
    services: Array.isArray(value?.services) ? value.services : [],
    resources: Array.isArray(value?.resources) ? value.resources : [],
  };
}

function useBookingConfig(tenantId: string) {
  const [config, setConfig] = useState<BookingConfig | null>(null);

  useEffect(() => {
    if (!tenantId) {
      setConfig(PREVIEW_CONFIG);
      return;
    }
    fetch(`/api/booking/config?tenantId=${encodeURIComponent(tenantId)}`)
      .then((res) => res.json())
      .then((json) => setConfig(normalizeConfig(json)))
      .catch(() => setConfig(normalizeConfig({ enabled: false })));
  }, [tenantId]);

  return config;
}

function useBookingSlots(input: {
  enabled?: boolean;
  tenantId: string;
  date: string;
  serviceId: string;
  resourceId: string;
  timeModel: BookingTimeModel;
  resourceRequired: boolean;
}) {
  const [slots, setSlots] = useState<{ value: string; label: string }[]>([]);
  const [suggestions, setSuggestions] = useState<{ date: string; slots: { value: string; label: string }[] }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!input.enabled || !input.date || input.timeModel !== 'time_slot') {
      setSlots([]);
      setSuggestions([]);
      return;
    }
    if (input.resourceRequired && !input.resourceId) {
      setSlots([]);
      setSuggestions([]);
      return;
    }
    if (!input.tenantId) {
      setSlots(mockSlots(input.date));
      setSuggestions([]);
      return;
    }
    const query = new URLSearchParams({
      date: input.date,
      serviceId: input.serviceId,
      resourceId: input.resourceId,
      tenantId: input.tenantId,
    });
    setLoading(true);
    fetch(`/api/booking/availability?${query.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setSlots(Array.isArray(json.slots) ? json.slots : []);
        setSuggestions(Array.isArray(json.suggestions) ? json.suggestions : []);
      })
      .catch(() => {
        setSlots([]);
        setSuggestions([]);
      })
      .finally(() => setLoading(false));
  }, [input.date, input.enabled, input.resourceId, input.resourceRequired, input.serviceId, input.tenantId, input.timeModel]);

  return { slots, suggestions, loading };
}

function mockSlots(date: string) {
  if (!date) return [];
  const day = new Date(`${date}T00:00:00`).getDay();
  if (day === 0) return [];
  return ['11:30', '12:00', '12:30', '18:00', '18:30', '19:00', '20:00'].map((value) => ({ value, label: `${value} Uhr` }));
}

function getIntakeAnswers(formData: FormData, service?: BookingConfig['services'][number]) {
  const questions = Array.isArray(service?.intakeQuestions) ? service.intakeQuestions : [];
  return Object.fromEntries(questions.map(question => [question.id, String(formData.get(`intake_${question.id}`) || '').trim()]).filter(([, value]) => Boolean(value)));
}

function IntakeQuestionFields({ service }: { service?: BookingConfig['services'][number] }) {
  const questions = Array.isArray(service?.intakeQuestions) ? service.intakeQuestions : [];
  const idPrefix = useId();
  if (!questions.length) return null;
  return (
    <fieldset className={FIELDSET_CLASS}>
      <legend className={LEGEND_CLASS}>Zusätzliche Angaben</legend>
      {questions.map((question) => {
        const fieldId = `${idPrefix}-${question.id}`;
        return (
        <BookingField key={question.id} id={fieldId} label={question.label} required={question.required}>
          {Array.isArray(question.options) && question.options.length ? (
            <select id={fieldId} name={`intake_${question.id}`} required={question.required} className={`${FORM_CONTROL_CLASS} font-normal`}>
              <option value="">Bitte wählen</option>
              {question.options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          ) : (
            <input id={fieldId} name={`intake_${question.id}`} required={question.required} className={`${FORM_CONTROL_CLASS} font-normal`} />
          )}
        </BookingField>
        );
      })}
    </fieldset>
  );
}

export function BookingWidgetSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Termin oder Anfrage senden';
  const subline = (data.subline as string) || 'Wählen Sie aus, was Sie buchen möchten. Wir melden uns mit allen Details.';
  const badge = (data.badge as string) || 'Booking';
  const submitLabel = (data.submitLabel as string) || '';
  const tenantId = (data.tenantId as string) || '';
  const formId = useId();
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
    const intakeAnswers = getIntakeAnswers(formData, selectedService);
    try {
      const res = await fetch('/api/booking/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, tenantId, intakeAnswers }),
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
      id="booking-form"
      className="relative overflow-hidden rounded-[var(--token-card-radius)] px-5 py-10 shadow-2xl sm:px-8 md:px-12"
      style={{ background: 'var(--token-section-bg, #09090b)', color: 'var(--token-card-body,var(--token-body,#ffffff))' }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 20% 10%, rgba(255,255,255,.18), transparent 28%), radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--token-accent) 22%, transparent), transparent 30%)' }}
      />
      <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]" style={{ background: 'var(--token-card-badge-bg)', color: 'var(--token-card-badge-text)' }}>
            <CalendarCheck size={15} /> <span data-edit-path="badge">{badge}</span>
          </p>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl" style={{ color: 'var(--token-card-heading,var(--token-heading,var(--token-card-body,var(--token-body,#ffffff))))' }} data-edit-path="headline">{headline}</h2>
          <p className="max-w-xl text-base leading-7" style={{ color: 'var(--token-card-body,var(--token-body,rgba(255,255,255,.72)))' }} data-edit-path="subline">{plain(subline)}</p>
          <div className="rounded-2xl border p-4 text-sm" style={{ borderColor: 'var(--token-card-border)', background: 'color-mix(in srgb, var(--token-card-bg, #ffffff) 8%, transparent)', color: 'var(--token-card-muted,var(--token-muted,rgba(255,255,255,.7)))' }}>
            {timeModel === 'full_day' && 'Diese Buchung blockiert einen ganzen Tag.'}
            {timeModel === 'date_range' && 'Diese Buchung prüft einen Datumsbereich, z.B. für Zimmer, Locations oder mehrtägige Leistungen.'}
            {timeModel === 'time_slot' && `Diese Buchung nutzt Zeitslots${config?.intervalMinutes ? ` im ${config.intervalMinutes}-Minuten-Raster` : ''}.`}
          </div>
        </div>

        <div className="rounded-[var(--token-card-radius)] border p-4 shadow-xl sm:p-6" style={{ borderColor: 'var(--token-card-border)', background: 'var(--token-card-bg, #ffffff)', color: 'var(--token-card-body,var(--token-body,#09090b))' }}>
          {config && !config.enabled ? (
            <div className={BOOKING_NOTICE_CLASS} style={BOOKING_NOTICE_STYLE}>Booking ist für diese Website noch nicht aktiviert.</div>
          ) : status === 'success' ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-center">
              <CheckCircle style={{ color: 'var(--token-check)' }} size={44} />
              <p className="text-xl font-bold">{config?.mode === 'instant' ? 'Buchung eingegangen' : 'Anfrage gesendet'}</p>
              <p className={`text-sm ${FORM_MUTED_CLASS}`}>Sie erhalten in Kürze eine Bestätigung per E-Mail.</p>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="grid gap-5"
              aria-busy={status === 'loading'}
              aria-describedby={status === 'error' ? `${formId}-error` : undefined}
            >
              <fieldset className={FIELDSET_CLASS}>
                <legend className={LEGEND_CLASS}>Kontakt</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <BookingField id={`${formId}-name`} label="Name" required>
                    <input id={`${formId}-name`} name="customerName" autoComplete="name" required className={FORM_CONTROL_CLASS} />
                  </BookingField>
                  <BookingField id={`${formId}-email`} label="E-Mail">
                    <input id={`${formId}-email`} name="customerEmail" type="email" autoComplete="email" className={FORM_CONTROL_CLASS} />
                  </BookingField>
                </div>
                <BookingField id={`${formId}-phone`} label="Telefon">
                  <input id={`${formId}-phone`} name="customerPhone" type="tel" autoComplete="tel" className={FORM_CONTROL_CLASS} />
                </BookingField>
              </fieldset>

              <fieldset className={FIELDSET_CLASS}>
                <legend className={LEGEND_CLASS}>Buchungsdetails</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <BookingField id={`${formId}-service`} label="Leistung">
                    <select id={`${formId}-service`} name="serviceId" value={selectedServiceId} onChange={(event) => { setSelectedServiceId(event.target.value); setSelectedResourceId(''); }} className={FORM_CONTROL_CLASS}>
                      <option value="">Leistung auswählen</option>
                      {config?.services.map((service) => <option key={service.id} value={service.id}>{service.name}{service.priceLabel ? ` · ${service.priceLabel}` : ''}</option>)}
                    </select>
                  </BookingField>
                  <BookingField id={`${formId}-resource`} label="Ressource" required={resourceRequired}>
                    <select id={`${formId}-resource`} name="resourceId" value={selectedResourceId} required={resourceRequired} onChange={(event) => setSelectedResourceId(event.target.value)} className={FORM_CONTROL_CLASS}>
                      <option value="">{resourceRequired ? 'Ressource auswählen' : 'Keine Präferenz'}</option>
                      {availableResources.map((resource) => <option key={resource.id} value={resource.id}>{resource.name}{resource.seats ? ` · ${resource.seats} Plätze` : ''}</option>)}
                    </select>
                  </BookingField>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <BookingField id={`${formId}-date`} label="Datum" required>
                    <input id={`${formId}-date`} name="date" type="date" required value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className={FORM_CONTROL_CLASS} />
                  </BookingField>
                  {timeModel === 'date_range' ? (
                    <BookingField id={`${formId}-end-date`} label="Enddatum" required>
                      <input id={`${formId}-end-date`} name="endDate" type="date" required className={FORM_CONTROL_CLASS} />
                    </BookingField>
                  ) : timeModel === 'time_slot' ? (
                    <BookingField id={`${formId}-time`} label="Uhrzeit" required help={slotsLoading ? 'Freie Zeiten werden geladen.' : undefined}>
                      <select id={`${formId}-time`} name="time" required disabled={!selectedDate || slotsLoading || (resourceRequired && !selectedResourceId)} aria-describedby={slotsLoading ? `${formId}-time-help` : undefined} className={`${FORM_CONTROL_CLASS} disabled:opacity-55`}>
                        <option value="">{slotsLoading ? 'Slots laden...' : selectedDate ? 'Zeit auswählen' : 'Erst Datum wählen'}</option>
                        {slots.map(slot => <option key={slot.value} value={slot.value}>{slot.label}</option>)}
                      </select>
                    </BookingField>
                  ) : (
                    <BookingField id={`${formId}-party-size`} label="Personen / Menge">
                      <input id={`${formId}-party-size`} name="partySize" type="number" min={1} defaultValue={1} className={FORM_CONTROL_CLASS} />
                    </BookingField>
                  )}
                </div>
                {timeModel !== 'full_day' && (
                  <BookingField id={`${formId}-party-size`} label="Personen / Menge">
                    <input id={`${formId}-party-size`} name="partySize" type="number" min={selectedService?.minPartySize || 1} max={selectedService?.maxPartySize || undefined} defaultValue={selectedService?.minPartySize || 1} className={FORM_CONTROL_CLASS} />
                  </BookingField>
                )}
              </fieldset>
              {timeModel === 'time_slot' && selectedDate && !slotsLoading && !slots.length ? (
                <p className="rounded-xl px-4 py-3 text-sm" role="status" style={BOOKING_NOTICE_STYLE}>Für diese Auswahl sind aktuell keine freien Slots verfügbar.</p>
              ) : null}
              <IntakeQuestionFields service={selectedService} />
              <BookingField id={`${formId}-message`} label="Nachricht" help="Optional: Anlass, Wünsche oder wichtige Hinweise.">
                <textarea id={`${formId}-message`} name="message" rows={3} aria-describedby={`${formId}-message-help`} className={FORM_CONTROL_CLASS} />
              </BookingField>
              {status === 'error' && <p id={`${formId}-error`} className="text-sm" role="alert" style={BOOKING_ERROR_STYLE}>{error}</p>}
              <button type="submit" disabled={status === 'loading'} className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--token-button-radius)] px-5 py-3 font-bold transition hover:brightness-95 disabled:opacity-60" style={{ background: 'var(--token-btn-bg)', color: 'var(--token-btn-text)' }}>
                {status === 'loading' && <Loader2 className="animate-spin" size={17} />}
                <span data-edit-path="actionLabel">{actionLabel}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function BookingSlotPickerSection({ data }: SectionProps) {
  const tenantId = (data.tenantId as string) || '';
  const badge = (data.badge as string) || 'Tisch & Termin';
  const headline = (data.headline as string) || 'Tag wählen, freie Uhrzeiten sehen.';
  const subline = (data.subline as string) || 'Ideal für Restaurants, Cafés, Salons, Trainings und Termine mit konkreten Uhrzeiten.';
  const submitLabel = (data.submitLabel as string) || 'Anfrage senden';
  const config = useBookingConfig(tenantId);
  const formId = useId();
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => toInputDate(addDays(new Date(), 1)));
  const [selectedSlot, setSelectedSlot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const selectedService = (config?.services || []).find((service) => service.id === selectedServiceId);
  const timeModel = selectedService?.timeModelOverride || config?.timeModel || 'time_slot';
  const allowedResourceTypes = Array.isArray(selectedService?.allowedResourceTypes) ? selectedService.allowedResourceTypes : [];
  const availableResources = (config?.resources || []).filter((resource) => !allowedResourceTypes.length || allowedResourceTypes.includes(resource.type));
  const resourceRequired = Boolean(selectedService?.requiresResource);
  const { slots, suggestions, loading } = useBookingSlots({
    enabled: config?.enabled,
    tenantId,
    date: selectedDate,
    serviceId: selectedServiceId,
    resourceId: selectedResourceId,
    timeModel,
    resourceRequired,
  });

  useEffect(() => setSelectedSlot(''), [selectedResourceId, selectedServiceId]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const intakeAnswers = getIntakeAnswers(formData, selectedService);
    try {
      const res = await fetch('/api/booking/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, tenantId, time: selectedSlot, timeModel: 'time_slot', intakeAnswers }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Anfrage konnte nicht gesendet werden.');
      setStatus('success');
      e.currentTarget.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    }
  }

  return (
    <section id="booking" className="relative overflow-hidden rounded-[var(--token-card-radius)] px-5 py-10 shadow-2xl sm:px-8 md:px-12" style={{ background: 'var(--token-section-bg, #09090b)', color: 'var(--token-card-body,var(--token-body,#ffffff))' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 16% 0%, color-mix(in srgb, var(--token-accent) 28%, transparent), transparent 30%)' }} />
      <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]" style={{ background: 'var(--token-card-badge-bg)', color: 'var(--token-card-badge-text)' }}><Clock3 size={15} /> <span data-edit-path="badge">{badge}</span></p>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl" style={{ color: 'var(--token-card-heading,var(--token-heading,#ffffff))' }} data-edit-path="headline">{headline}</h2>
          <p className="mt-4 max-w-xl text-base leading-7" style={{ color: 'var(--token-card-body,var(--token-body,rgba(255,255,255,.72)))' }} data-edit-path="subline">{plain(subline)}</p>
          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            {['Datum wählen', 'Slots prüfen', config?.mode === 'instant' ? 'Direkt buchen' : 'Anfrage senden'].map((item, index) => (
              <div key={item} className="rounded-2xl border p-3" style={{ borderColor: 'var(--token-card-border)', background: 'color-mix(in srgb, var(--token-card-bg, #ffffff) 8%, transparent)', color: 'var(--token-card-body,var(--token-body,rgba(255,255,255,.72)))' }} data-edit-collection="senden" data-edit-index={index}>
                <span className="mb-2 grid h-7 w-7 place-items-center rounded-full text-xs font-black" style={{ background: 'var(--token-card-badge-bg)', color: 'var(--token-card-badge-text)' }}>{index + 1}</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} aria-busy={status === 'loading'} aria-describedby={status === 'error' ? `${formId}-error` : undefined} className="rounded-[var(--token-card-radius)] border p-4 shadow-xl sm:p-6" style={{ borderColor: 'var(--token-card-border)', background: 'var(--token-card-bg, #ffffff)', color: 'var(--token-card-body,var(--token-body,#09090b))' }}>
          {config && !config.enabled ? <div className={BOOKING_NOTICE_CLASS} style={BOOKING_NOTICE_STYLE}>Booking ist für diese Website noch nicht aktiviert.</div> : null}
          {status === 'success' ? (
            <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-center" role="status">
              <CheckCircle style={{ color: 'var(--token-check)' }} size={44} />
              <p className="text-xl font-bold">Anfrage gesendet</p>
              <p className={`text-sm ${FORM_MUTED_CLASS}`}>Wir melden uns mit der Bestätigung.</p>
            </div>
          ) : (
            <div className="grid gap-5">
              <fieldset className={FIELDSET_CLASS}>
                <legend className={LEGEND_CLASS}>Termin</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <BookingField id={`${formId}-service`} label="Leistung">
                    <select id={`${formId}-service`} name="serviceId" value={selectedServiceId} onChange={(event) => { setSelectedServiceId(event.target.value); setSelectedResourceId(''); }} className={FORM_CONTROL_CLASS}>
                      <option value="">Leistung wählen</option>
                      {config?.services.map((service) => <option key={service.id} value={service.id}>{service.name}{service.priceLabel ? ` · ${service.priceLabel}` : ''}</option>)}
                    </select>
                  </BookingField>
                  <BookingField id={`${formId}-resource`} label="Ressource" required={resourceRequired}>
                    <select id={`${formId}-resource`} name="resourceId" value={selectedResourceId} required={resourceRequired} onChange={(event) => setSelectedResourceId(event.target.value)} className={FORM_CONTROL_CLASS}>
                      <option value="">{resourceRequired ? 'Ressource wählen' : 'Keine Präferenz'}</option>
                      {availableResources.map((resource) => <option key={resource.id} value={resource.id}>{resource.name}{resource.seats ? ` · ${resource.seats} Plätze` : ''}</option>)}
                    </select>
                  </BookingField>
                </div>
                <BookingField id={`${formId}-date`} label="Datum" required>
                  <input id={`${formId}-date`} name="date" type="date" required value={selectedDate} onChange={(event) => { setSelectedDate(event.target.value); setSelectedSlot(''); }} className={FORM_CONTROL_CLASS} />
                </BookingField>
              </fieldset>

              <div role="group" aria-labelledby={`${formId}-slots-label`}>
                <p id={`${formId}-slots-label`} className={`mb-2 text-xs font-bold uppercase tracking-[0.14em] ${FORM_MUTED_CLASS}`}>Verfügbare Uhrzeiten</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {loading ? <p className="col-span-full rounded-xl p-4 text-sm" role="status" style={BOOKING_NOTICE_STYLE}>Slots werden geladen...</p> : slots.length ? slots.map((slot) => (
                    <button key={slot.value} type="button" onClick={() => setSelectedSlot(slot.value)} aria-pressed={selectedSlot === slot.value} className="min-h-11 rounded-xl border px-3 py-3 text-sm font-bold transition hover:brightness-95" style={selectedSlot === slot.value ? { borderColor: 'var(--token-btn-bg)', background: 'var(--token-btn-bg)', color: 'var(--token-btn-text)' } : { borderColor: 'var(--token-card-border)', background: 'var(--token-card-bg, #ffffff)', color: 'var(--token-card-body,var(--token-body,#09090b))' }} data-edit-path="label">
                      {slot.label}
                    </button>
                  )) : <p className="col-span-full rounded-xl p-4 text-sm" role="status" style={BOOKING_NOTICE_STYLE}>Für diese Auswahl sind keine freien Uhrzeiten verfügbar.</p>}
                </div>
                {!loading && !slots.length && suggestions.length ? (
                  <div className="mt-3 rounded-xl p-3" style={{ background: 'color-mix(in srgb, var(--token-card-bg,#fff) 88%, var(--token-accent))' }}>
                    <p className={`mb-2 text-xs font-bold uppercase tracking-[0.14em] ${FORM_MUTED_CLASS}`}>Nächste freie Zeiten</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {suggestions.flatMap(suggestion => suggestion.slots.map(slot => (
                        <button key={`${suggestion.date}-${slot.value}`} type="button" onClick={() => { setSelectedDate(suggestion.date); setSelectedSlot(slot.value); }} aria-pressed={selectedDate === suggestion.date && selectedSlot === slot.value} className="min-h-11 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition hover:brightness-95" style={{ borderColor: 'var(--token-card-border)', background: 'var(--token-card-bg, #ffffff)', color: 'var(--token-card-body,var(--token-body,#09090b))' }}>
                          {formatInputDate(suggestion.date)} · <span data-edit-path="label">{slot.label}</span>
                        </button>
                      )))}
                    </div>
                  </div>
                ) : null}
              </div>
              <input type="hidden" name="time" value={selectedSlot} />
              <fieldset className={FIELDSET_CLASS}>
                <legend className={LEGEND_CLASS}>Kontakt</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <BookingField id={`${formId}-name`} label="Name" required>
                    <input id={`${formId}-name`} name="customerName" autoComplete="name" required className={FORM_CONTROL_CLASS} />
                  </BookingField>
                  <BookingField id={`${formId}-email`} label="E-Mail">
                    <input id={`${formId}-email`} name="customerEmail" type="email" autoComplete="email" className={FORM_CONTROL_CLASS} />
                  </BookingField>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <BookingField id={`${formId}-phone`} label="Telefon">
                    <input id={`${formId}-phone`} name="customerPhone" type="tel" autoComplete="tel" className={FORM_CONTROL_CLASS} />
                  </BookingField>
                  <BookingField id={`${formId}-party-size`} label="Personen / Menge">
                    <input id={`${formId}-party-size`} name="partySize" type="number" min={selectedService?.minPartySize || 1} max={selectedService?.maxPartySize || undefined} defaultValue={selectedService?.minPartySize || 2} className={FORM_CONTROL_CLASS} />
                  </BookingField>
                </div>
              </fieldset>
              <IntakeQuestionFields service={selectedService} />
              <BookingField id={`${formId}-message`} label="Nachricht" help="Optional: Wünsche oder wichtige Hinweise.">
                <textarea id={`${formId}-message`} name="message" rows={3} aria-describedby={`${formId}-message-help`} className={FORM_CONTROL_CLASS} />
              </BookingField>
              {status === 'error' && <p id={`${formId}-error`} className="text-sm" role="alert" style={BOOKING_ERROR_STYLE}>{error}</p>}
              <button type="submit" disabled={status === 'loading' || !selectedSlot} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--token-button-radius)] px-5 py-3 font-bold transition hover:brightness-95 disabled:opacity-50" style={{ background: 'var(--token-btn-bg)', color: 'var(--token-btn-text)' }}>
                {status === 'loading' && <Loader2 className="animate-spin" size={17} />}
                <span data-edit-path="submitLabel">{submitLabel}</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export function BookingDateRangeSection({ data }: SectionProps) {
  const tenantId = (data.tenantId as string) || '';
  const badge = (data.badge as string) || 'Zeitraum';
  const headline = (data.headline as string) || 'Zeitraum anfragen oder direkt buchen.';
  const subline = (data.subline as string) || 'Für Zimmer, Apartments, Locations, Räume, mehrtägige Leistungen oder ganze Projektzeiträume.';
  const submitLabel = (data.submitLabel as string) || 'Zeitraum anfragen';
  const config = useBookingConfig(tenantId);
  const formId = useId();
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [startDate, setStartDate] = useState(() => toInputDate(addDays(new Date(), 7)));
  const [endDate, setEndDate] = useState(() => toInputDate(addDays(new Date(), 9)));
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const selectedService = (config?.services || []).find((service) => service.id === selectedServiceId);
  const allowedResourceTypes = Array.isArray(selectedService?.allowedResourceTypes) ? selectedService.allowedResourceTypes : [];
  const availableResources = (config?.resources || []).filter((resource) => !allowedResourceTypes.length || allowedResourceTypes.includes(resource.type));
  const resourceRequired = Boolean(selectedService?.requiresResource);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const intakeAnswers = getIntakeAnswers(formData, selectedService);
    try {
      const res = await fetch('/api/booking/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, tenantId, date: startDate, startDate, endDate, timeModel: 'date_range', intakeAnswers }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Anfrage konnte nicht gesendet werden.');
      setStatus('success');
      e.currentTarget.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    }
  }

  return (
    <section id="booking" className="relative overflow-hidden rounded-[var(--token-card-radius)] px-5 py-10 shadow-2xl sm:px-8 md:px-12" style={{ background: 'var(--token-section-bg, #09090b)', color: 'var(--token-card-body,var(--token-body,#ffffff))' }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--token-accent) 22%, transparent), transparent 45%)' }} />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]" style={{ background: 'var(--token-card-badge-bg)', color: 'var(--token-card-badge-text)' }}><CalendarCheck size={15} /> <span data-edit-path="badge">{badge}</span></p>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl" style={{ color: 'var(--token-card-heading,var(--token-heading,#ffffff))' }} data-edit-path="headline">{headline}</h2>
          <p className="mt-4 max-w-xl text-base leading-7" style={{ color: 'var(--token-card-body,var(--token-body,rgba(255,255,255,.72)))' }} data-edit-path="subline">{plain(subline)}</p>
          <div className="mt-6 rounded-2xl border p-4" style={{ borderColor: 'var(--token-card-border)', background: 'color-mix(in srgb, var(--token-card-bg, #ffffff) 8%, transparent)' }}>
            <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--token-card-muted,var(--token-muted,rgba(255,255,255,.56)))' }}>Ausgewählter Zeitraum</p>
            <p className="mt-2 text-2xl font-black" style={{ color: 'var(--token-card-heading,var(--token-heading,#ffffff))' }}>{formatInputDate(startDate)} - {formatInputDate(endDate)}</p>
            <p className="mt-1 text-sm" style={{ color: 'var(--token-card-body,var(--token-body,rgba(255,255,255,.72)))' }}>Verfügbarkeit wird beim Absenden serverseitig geprüft.</p>
          </div>
        </div>

        <form onSubmit={submit} aria-busy={status === 'loading'} aria-describedby={status === 'error' ? `${formId}-error` : undefined} className="grid gap-5 rounded-[var(--token-card-radius)] border p-4 shadow-xl sm:p-6" style={{ borderColor: 'var(--token-card-border)', background: 'var(--token-card-bg, #ffffff)', color: 'var(--token-card-body,var(--token-body,#09090b))' }}>
          {status === 'success' ? (
            <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-center" role="status">
              <CheckCircle style={{ color: 'var(--token-check)' }} size={44} />
              <p className="text-xl font-bold">Zeitraum angefragt</p>
              <p className={`text-sm ${FORM_MUTED_CLASS}`}>Wir prüfen die Verfügbarkeit und melden uns.</p>
            </div>
          ) : (
            <>
              <fieldset className={FIELDSET_CLASS}>
                <legend className={LEGEND_CLASS}>Zeitraum und Angebot</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <BookingField id={`${formId}-start-date`} label="Anreise / Start" required>
                    <input id={`${formId}-start-date`} name="startDate" type="date" required value={startDate} onChange={(event) => setStartDate(event.target.value)} className={FORM_CONTROL_CLASS} />
                  </BookingField>
                  <BookingField id={`${formId}-end-date`} label="Abreise / Ende" required>
                    <input id={`${formId}-end-date`} name="endDate" type="date" required value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} className={FORM_CONTROL_CLASS} />
                  </BookingField>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <BookingField id={`${formId}-service`} label="Leistung">
                    <select id={`${formId}-service`} name="serviceId" value={selectedServiceId} onChange={(event) => { setSelectedServiceId(event.target.value); setSelectedResourceId(''); }} className={FORM_CONTROL_CLASS}>
                      <option value="">Leistung wählen</option>
                      {config?.services.map((service) => <option key={service.id} value={service.id}>{service.name}{service.priceLabel ? ` · ${service.priceLabel}` : ''}</option>)}
                    </select>
                  </BookingField>
                  <BookingField id={`${formId}-resource`} label="Zimmer / Raum" required={resourceRequired}>
                    <select id={`${formId}-resource`} name="resourceId" value={selectedResourceId} required={resourceRequired} onChange={(event) => setSelectedResourceId(event.target.value)} className={FORM_CONTROL_CLASS}>
                      <option value="">{resourceRequired ? 'Zimmer / Raum wählen' : 'Keine Präferenz'}</option>
                      {availableResources.map((resource) => <option key={resource.id} value={resource.id}>{resource.name}{resource.seats ? ` · ${resource.seats} Plätze` : ''}</option>)}
                    </select>
                  </BookingField>
                </div>
              </fieldset>

              <fieldset className={FIELDSET_CLASS}>
                <legend className={LEGEND_CLASS}>Kontakt</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <BookingField id={`${formId}-name`} label="Name" required>
                    <input id={`${formId}-name`} name="customerName" autoComplete="name" required className={FORM_CONTROL_CLASS} />
                  </BookingField>
                  <BookingField id={`${formId}-email`} label="E-Mail">
                    <input id={`${formId}-email`} name="customerEmail" type="email" autoComplete="email" className={FORM_CONTROL_CLASS} />
                  </BookingField>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <BookingField id={`${formId}-phone`} label="Telefon">
                    <input id={`${formId}-phone`} name="customerPhone" type="tel" autoComplete="tel" className={FORM_CONTROL_CLASS} />
                  </BookingField>
                  <BookingField id={`${formId}-party-size`} label="Personen / Menge">
                    <input id={`${formId}-party-size`} name="partySize" type="number" min={selectedService?.minPartySize || 1} max={selectedService?.maxPartySize || undefined} defaultValue={selectedService?.minPartySize || 2} className={FORM_CONTROL_CLASS} />
                  </BookingField>
                </div>
              </fieldset>
              <IntakeQuestionFields service={selectedService} />
              <BookingField id={`${formId}-message`} label="Wünsche oder Anlass" help="Optional: weitere Informationen für ein passendes Angebot.">
                <textarea id={`${formId}-message`} name="message" rows={3} aria-describedby={`${formId}-message-help`} className={FORM_CONTROL_CLASS} />
              </BookingField>
              {status === 'error' && <p id={`${formId}-error`} className="text-sm" role="alert" style={BOOKING_ERROR_STYLE}>{error}</p>}
              <button type="submit" disabled={status === 'loading'} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--token-button-radius)] px-5 py-3 font-bold transition hover:brightness-95 disabled:opacity-60" style={{ background: 'var(--token-btn-bg)', color: 'var(--token-btn-text)' }}>
                {status === 'loading' && <Loader2 className="animate-spin" size={17} />}
                <span data-edit-path="submitLabel">{submitLabel}</span>
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

export function AvailabilityCalendarSection({ data }: SectionProps) {
  const tenantId = (data.tenantId as string) || '';
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => toInputDate(new Date()));
  const config = useBookingConfig(tenantId);
  const calendarService = (config?.services || []).find(service => service.timeModelOverride !== 'date_range') || config?.services?.[0];
  const allowedResourceTypes = Array.isArray(calendarService?.allowedResourceTypes) ? calendarService.allowedResourceTypes : [];
  const calendarResource = (config?.resources || []).find(resource => !allowedResourceTypes.length || allowedResourceTypes.includes(resource.type));
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
      const query = new URLSearchParams({ date: day.date, tenantId, serviceId: calendarService?.id || '', resourceId: calendarResource?.id || '' });
      const res = await fetch(`/api/booking/availability?${query.toString()}`);
      const json = await res.json().catch(() => ({}));
      return [day.date, Array.isArray(json.slots) ? json.slots.length : 0] as const;
    })).then(entries => {
      if (!cancelled) setCounts(Object.fromEntries(entries));
    }).catch(() => {
      if (!cancelled) setCounts(Object.fromEntries(days.map(day => [day.date, null])));
    });
    return () => { cancelled = true; };
  }, [calendarResource?.id, calendarService?.id, days, tenantId]);

  return (
    <BookingShell data={data} icon={<Clock3 size={18} />} defaultBadge="Verfügbarkeit" defaultHeadline="Freie Zeiten auf einen Blick">
      <div className="mx-auto w-full max-w-sm rounded-2xl border p-3 shadow-xl" style={{ borderColor: 'var(--token-card-border)', background: 'color-mix(in srgb, var(--token-card-bg, #ffffff) 10%, transparent)' }}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <button type="button" onClick={() => setMonthOffset((value) => value - 1)} className="grid h-11 w-11 place-items-center rounded-full border transition hover:brightness-110" style={{ borderColor: 'var(--token-card-border)', color: 'var(--token-card-heading,var(--token-heading,#ffffff))' }} aria-label="Vorheriger Monat">
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <p className="text-sm font-black capitalize" style={{ color: 'var(--token-card-heading,var(--token-heading,#ffffff))' }}>{visibleMonthLabel}</p>
            <p className="text-xs" style={{ color: 'var(--token-card-body,var(--token-body,rgba(255,255,255,.68)))' }}>
              {selectedCount == null ? 'Datum auswählen' : selectedCount > 0 ? `${selectedCount} freie Slots am ausgewählten Tag` : 'An diesem Tag aktuell nichts frei'}
            </p>
          </div>
          <button type="button" onClick={() => setMonthOffset((value) => value + 1)} className="grid h-11 w-11 place-items-center rounded-full border transition hover:brightness-110" style={{ borderColor: 'var(--token-card-border)', color: 'var(--token-card-heading,var(--token-heading,#ffffff))' }} aria-label="Nächster Monat">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((label) => (
            <div key={label} className="py-1 text-center text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--token-card-muted,var(--token-muted,rgba(255,255,255,.52)))' }} data-edit-path="label">{label}</div>
          ))}
          {days.map((day) => (
          <button key={day.date} type="button" onClick={() => setSelectedDate(day.date)} aria-pressed={selectedDate === day.date} className="relative grid aspect-square min-h-11 place-items-center rounded-lg border text-sm font-bold transition hover:brightness-110" style={{ borderColor: selectedDate === day.date ? 'var(--token-btn-bg)' : 'var(--token-card-border)', background: selectedDate === day.date ? 'var(--token-btn-bg)' : day.inMonth ? 'transparent' : 'rgba(255,255,255,.03)', color: selectedDate === day.date ? 'var(--token-btn-text)' : 'var(--token-card-heading,var(--token-heading,#ffffff))', opacity: day.inMonth ? 1 : 0.42 }} aria-label={`${day.label}, ${day.day}. ${counts[day.date] ?? 0} freie Slots`}>
            {day.day}
            {day.isToday ? <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full" style={{ background: selectedDate === day.date ? 'var(--token-btn-text)' : 'var(--token-accent)' }} /> : null}
            {(counts[day.date] || 0) > 0 ? <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full" style={{ background: selectedDate === day.date ? 'var(--token-btn-text)' : 'var(--token-accent)' }} /> : null}
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
          <div key={label} className="flex items-center gap-3 rounded-2xl border p-4" style={{ borderColor: 'var(--token-card-border)', background: 'color-mix(in srgb, var(--token-card-bg, #ffffff) 10%, transparent)' }} data-edit-collection="senden" data-edit-index={index}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-black" style={{ background: 'var(--token-card-badge-bg)', color: 'var(--token-card-badge-text)' }}>{index + 1}</span>
            <p className="font-semibold" style={{ color: 'var(--token-card-heading,var(--token-heading,#ffffff))' }} data-edit-path="label">{label}</p>
          </div>
        ))}
      </div>
    </BookingShell>
  );
}

export function BookingCtaProSection({ data }: SectionProps) {
  return (
    <section
      className="relative overflow-hidden rounded-[var(--token-card-radius)] px-5 py-8 shadow-2xl sm:px-8"
      style={{ background: 'var(--token-section-bg, #09090b)', color: 'var(--token-card-body,var(--token-body,#ffffff))' }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, color-mix(in srgb, var(--token-accent) 26%, transparent), transparent 48%)' }} />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]" style={{ background: 'var(--token-card-badge-bg)', color: 'var(--token-card-badge-text)' }}>
            <Sparkles size={14} /> <span data-edit-path="badge">{(data.badge as string) || 'Booking'}</span>
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl" style={{ color: 'var(--token-card-heading,var(--token-heading,#ffffff))' }} data-edit-path="headline">{(data.headline as string) || 'Jetzt Wunschtermin sichern'}</h2>
          <p className="mt-2 text-sm leading-6" style={{ color: 'var(--token-card-body,var(--token-body,rgba(255,255,255,.74)))' }} data-edit-path="subline">{(data.subline as string) || 'Direkt buchen oder erst unverbindlich anfragen. Das System passt sich dem freigeschalteten Booking-Modus an.'}</p>
        </div>
        <a href="#booking" className="inline-flex shrink-0 items-center justify-center rounded-[var(--token-button-radius)] px-6 py-3 font-bold transition hover:brightness-95" style={{ background: 'var(--token-btn-bg)', color: 'var(--token-btn-text)' }} data-edit-path="submitLabel">
          {(data.submitLabel as string) || 'Zum Booking'}
        </a>
      </div>
    </section>
  );
}

function BookingShell({ data, icon, defaultBadge, defaultHeadline, children }: { data: SectionProps['data']; icon: ReactNode; defaultBadge: string; defaultHeadline: string; children: ReactNode }) {
  return (
    <section id="booking" className="relative overflow-hidden rounded-[var(--token-card-radius)] px-5 py-10 shadow-2xl sm:px-8 md:px-12" style={{ background: 'var(--token-section-bg, #09090b)', color: 'var(--token-card-body,var(--token-body,#ffffff))' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 15% 10%, color-mix(in srgb, var(--token-accent) 28%, transparent), transparent 28%)' }} />
      <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]" style={{ background: 'var(--token-card-badge-bg)', color: 'var(--token-card-badge-text)' }}>{icon}<span data-edit-path="badge">{(data.badge as string) || defaultBadge}</span></p>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl" style={{ color: 'var(--token-card-heading,var(--token-heading,#ffffff))' }} data-edit-path="headline">{(data.headline as string) || defaultHeadline}</h2>
          <p className="mt-4 max-w-xl text-base leading-7" style={{ color: 'var(--token-card-body,var(--token-body,rgba(255,255,255,.72)))' }} data-edit-path="subline">{(data.subline as string) || 'Ein flexibler Booking-Einstieg für Termine, Tage, Räume, Ressourcen oder Anfragen.'}</p>
          <a href={(data.ctaHref as string) || '#booking-form'} className="mt-6 inline-flex items-center justify-center rounded-[var(--token-button-radius)] px-5 py-3 font-bold transition hover:brightness-95" style={{ background: 'var(--token-btn-bg)', color: 'var(--token-btn-text)' }} data-edit-path="submitLabel">{(data.submitLabel as string) || 'Anfrage starten'}</a>
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

function formatInputDate(value: string) {
  if (!value) return '';
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}
