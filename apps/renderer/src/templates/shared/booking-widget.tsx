'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { CalendarCheck, CheckCircle, Clock3, Loader2, MapPin, Sparkles } from 'lucide-react';
import type { SectionProps } from '../restaurant';

type BookingTimeModel = 'time_slot' | 'full_day' | 'date_range';

type BookingConfig = {
  enabled: boolean;
  mode: 'request' | 'instant';
  timeModel: BookingTimeModel;
  intervalMinutes: number;
  services: { id: string; name: string; durationMinutes: number | null; priceLabel: string | null; timeModelOverride: BookingTimeModel | null }[];
  resources: { id: string; name: string; type: string; capacity: number }[];
};

export function BookingWidgetSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Termin oder Anfrage senden';
  const subline = (data.subline as string) || 'Wählen Sie aus, was Sie buchen möchten. Wir melden uns mit allen Details.';
  const badge = (data.badge as string) || 'Booking';
  const submitLabel = (data.submitLabel as string) || '';
  const [config, setConfig] = useState<BookingConfig | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/booking/config')
      .then((res) => res.json())
      .then(setConfig)
      .catch(() => setConfig({ enabled: false, mode: 'request', timeModel: 'time_slot', intervalMinutes: 30, services: [], resources: [] }));
  }, []);

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
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Buchung konnte nicht gesendet werden.');
      setStatus('success');
      e.currentTarget.reset();
      setSelectedServiceId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      setStatus('error');
    }
  }

  const selectedService = useMemo(
    () => config?.services.find((service) => service.id === selectedServiceId),
    [config?.services, selectedServiceId],
  );
  const timeModel = selectedService?.timeModelOverride || config?.timeModel || 'time_slot';
  const actionLabel = submitLabel || (config?.mode === 'instant' ? 'Jetzt buchen' : 'Anfrage senden');

  return (
    <section
      className="relative overflow-hidden rounded-[var(--style-card-radius,2rem)] px-5 py-10 shadow-2xl sm:px-8 md:px-12"
      style={{ background: 'var(--style-section-bg, #09090b)', color: 'var(--style-text-primary, #ffffff)' }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 20% 10%, rgba(255,255,255,.18), transparent 28%), radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--style-accent-color, #ec4899) 22%, transparent), transparent 30%)' }}
      />
      <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]" style={{ background: 'var(--style-badge-bg, rgba(255,255,255,.1))', color: 'var(--style-badge-text, rgba(255,255,255,.8))' }}>
            <CalendarCheck size={15} /> {badge}
          </p>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl" style={{ color: 'var(--style-heading-color, var(--style-text-primary, #ffffff))' }}>{headline}</h2>
          <p className="max-w-xl text-base leading-7" style={{ color: 'var(--style-body-color, rgba(255,255,255,.72))' }}>{subline}</p>
          <div className="rounded-2xl border p-4 text-sm" style={{ borderColor: 'var(--style-border-color, rgba(255,255,255,.12))', background: 'color-mix(in srgb, var(--style-card-bg, #ffffff) 8%, transparent)', color: 'var(--style-text-muted, rgba(255,255,255,.7))' }}>
            {timeModel === 'full_day' && 'Diese Buchung blockiert einen ganzen Tag.'}
            {timeModel === 'date_range' && 'Diese Buchung prüft einen Datumsbereich, z.B. für Zimmer, Locations oder mehrtägige Leistungen.'}
            {timeModel === 'time_slot' && `Diese Buchung nutzt Zeitslots${config?.intervalMinutes ? ` im ${config.intervalMinutes}-Minuten-Raster` : ''}.`}
          </div>
        </div>

        <div className="rounded-[var(--style-card-radius,1.5rem)] border p-4 shadow-xl sm:p-6" style={{ borderColor: 'var(--style-border-color, rgba(255,255,255,.1))', background: 'var(--style-card-bg, #ffffff)', color: 'var(--style-text-secondary, #09090b)' }}>
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
                <select name="serviceId" value={selectedServiceId} onChange={(event) => setSelectedServiceId(event.target.value)} className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900">
                  <option value="">Leistung auswählen</option>
                  {config?.services.map((service) => <option key={service.id} value={service.id}>{service.name}{service.priceLabel ? ` · ${service.priceLabel}` : ''}</option>)}
                </select>
                <select name="resourceId" className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900">
                  <option value="">Ressource optional</option>
                  {config?.resources.map((resource) => <option key={resource.id} value={resource.id}>{resource.name}</option>)}
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="date" type="date" required className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900" />
                {timeModel === 'date_range' ? (
                  <input name="endDate" type="date" required className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900" />
                ) : timeModel === 'time_slot' ? (
                  <input name="time" type="time" required className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900" />
                ) : (
                  <input name="partySize" type="number" min={1} defaultValue={1} className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-900" />
                )}
              </div>
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
  return (
    <BookingShell data={data} icon={<Clock3 size={18} />} defaultBadge="Verfügbarkeit" defaultHeadline="Freie Zeiten auf einen Blick">
      <div className="grid gap-2 sm:grid-cols-3">
        {['Heute', 'Morgen', 'Wochenende'].map((label, index) => (
          <div key={label} className="rounded-2xl border p-4" style={{ borderColor: 'var(--style-border-color, rgba(255,255,255,.14))', background: 'color-mix(in srgb, var(--style-card-bg, #ffffff) 10%, transparent)' }}>
            <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--style-text-muted, rgba(255,255,255,.62))' }}>{label}</p>
            <p className="mt-3 text-2xl font-black" style={{ color: 'var(--style-heading-color, #ffffff)' }}>{index === 0 ? '3' : index === 1 ? '5' : '8'}</p>
            <p className="text-sm" style={{ color: 'var(--style-body-color, rgba(255,255,255,.74))' }}>Slots möglich</p>
          </div>
        ))}
      </div>
    </BookingShell>
  );
}

export function ResourceBookingShowcaseSection({ data }: SectionProps) {
  return (
    <BookingShell data={data} icon={<MapPin size={18} />} defaultBadge="Ressourcen" defaultHeadline="Räume, Tische oder Teams direkt anfragen">
      <div className="grid gap-3">
        {['Ressource wählen', 'Zeitraum prüfen', 'Anfrage senden'].map((label, index) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl border p-4" style={{ borderColor: 'var(--style-border-color, rgba(255,255,255,.14))', background: 'color-mix(in srgb, var(--style-card-bg, #ffffff) 10%, transparent)' }}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-black" style={{ background: 'var(--style-accent-color, #ec4899)', color: 'var(--brand-btn-text, #09090b)' }}>{index + 1}</span>
            <p className="font-semibold" style={{ color: 'var(--style-heading-color, #ffffff)' }}>{label}</p>
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
      style={{ background: 'var(--style-section-bg, #09090b)', color: 'var(--style-text-primary, #ffffff)' }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, color-mix(in srgb, var(--style-accent-color, #ec4899) 26%, transparent), transparent 48%)' }} />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]" style={{ background: 'var(--style-badge-bg, rgba(255,255,255,.1))', color: 'var(--style-badge-text, rgba(255,255,255,.8))' }}>
            <Sparkles size={14} /> {(data.badge as string) || 'Booking'}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl" style={{ color: 'var(--style-heading-color, #ffffff)' }}>{(data.headline as string) || 'Jetzt Wunschtermin sichern'}</h2>
          <p className="mt-2 text-sm leading-6" style={{ color: 'var(--style-body-color, rgba(255,255,255,.74))' }}>{(data.subline as string) || 'Direkt buchen oder erst unverbindlich anfragen. Das System passt sich dem freigeschalteten Booking-Modus an.'}</p>
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
    <section id="booking" className="relative overflow-hidden rounded-[var(--style-card-radius,2rem)] px-5 py-10 shadow-2xl sm:px-8 md:px-12" style={{ background: 'var(--style-section-bg, #09090b)', color: 'var(--style-text-primary, #ffffff)' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 15% 10%, color-mix(in srgb, var(--style-accent-color, #ec4899) 28%, transparent), transparent 28%)' }} />
      <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]" style={{ background: 'var(--style-badge-bg, rgba(255,255,255,.1))', color: 'var(--style-badge-text, rgba(255,255,255,.8))' }}>{icon}{(data.badge as string) || defaultBadge}</p>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl" style={{ color: 'var(--style-heading-color, #ffffff)' }}>{(data.headline as string) || defaultHeadline}</h2>
          <p className="mt-4 max-w-xl text-base leading-7" style={{ color: 'var(--style-body-color, rgba(255,255,255,.72))' }}>{(data.subline as string) || 'Ein flexibler Booking-Einstieg für Termine, Tage, Räume, Ressourcen oder Anfragen.'}</p>
          <a href="#booking-form" className="mt-6 inline-flex items-center justify-center rounded-[var(--style-button-radius,.75rem)] px-5 py-3 font-bold transition hover:brightness-95" style={{ background: 'var(--brand-btn-bg, #ffffff)', color: 'var(--brand-btn-text, #09090b)' }}>{(data.submitLabel as string) || 'Anfrage starten'}</a>
        </div>
        {children}
      </div>
    </section>
  );
}
