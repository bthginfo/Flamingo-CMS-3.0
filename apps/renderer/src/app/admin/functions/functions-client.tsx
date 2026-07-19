'use client';

import { useEffect, useRef, useState, type ComponentType, type FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Check,
  Circle,
  Globe,
  Heart,
  Inbox,
  Lock,
  ShoppingBag,
  ReceiptText,
  Sparkles,
  X,
} from 'lucide-react';
import {
  createRendererContactActionIdentity,
  rendererContactRequestHeaders,
  type RendererContactActionIdentity,
} from '@/lib/renderer-contact-client-security';

type FeatureUsage = {
  rsvp: boolean;
  reservations: boolean;
  inbox: boolean;
};

type PremiumState = {
  booking: { used: boolean; ready: boolean };
  shop: { used: boolean; ready: boolean };
};

type FeatureCardProps = {
  title: string;
  description: string;
  href: string;
  action: string;
  status: string;
  statusTone: 'active' | 'attention' | 'available';
  icon: ComponentType<{ className?: string }>;
  iconTone: string;
  note?: string;
};

const INCLUDED_FEATURES = [
  {
    id: 'rsvp' as const,
    title: 'Gäste-Zusagen',
    description: 'Zu- und Absagen für Veranstaltungen übersichtlich verwalten.',
    href: '/admin/rsvp',
    icon: Heart,
    iconTone: 'bg-rose-50 text-rose-600 ring-rose-100',
  },
  {
    id: 'reservations' as const,
    title: 'Einfache Reservierungsanfragen',
    description: 'Tischwünsche entgegennehmen und anschließend persönlich bestätigen.',
    href: '/admin/functions/reservations',
    icon: CalendarDays,
    iconTone: 'bg-amber-50 text-amber-700 ring-amber-100',
  },
  {
    id: 'inbox' as const,
    title: 'Kontaktanfragen',
    description: 'Nachrichten aus den Kontaktformularen Ihrer Website bearbeiten.',
    href: '/admin/inbox',
    icon: Inbox,
    iconTone: 'bg-blue-50 text-blue-700 ring-blue-100',
  },
];

export function FunctionsClient({
  i18nEnabled,
  bookingEnabled,
  bookingRequested,
  shopEnabled,
  billingEnabled,
  featureUsage,
  premiumState,
}: {
  i18nEnabled: boolean;
  bookingEnabled: boolean;
  bookingRequested: boolean;
  shopEnabled: boolean;
  billingEnabled: boolean;
  featureUsage: FeatureUsage;
  premiumState: PremiumState;
}) {
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const supportIdentity = useRef<RendererContactActionIdentity | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function openSupportModal(message = '') {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setShowModal(true);
    setSent(false);
    setError('');
    supportIdentity.current = null;
    setForm(current => ({ ...current, message }));
  }

  function closeSupportModal() {
    setShowModal(false);
    requestAnimationFrame(() => previousFocusRef.current?.focus());
  }

  useEffect(() => {
    if (!showModal) return;
    const dialog = dialogRef.current;
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]') || []);
    focusable()[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSupportModal();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  const bookingPresentation = getPremiumPresentation({ enabled: bookingEnabled, requested: bookingRequested, ...premiumState.booking }, 'Booking');
  const shopPresentation = getPremiumPresentation({ enabled: shopEnabled, requested: false, ...premiumState.shop }, 'Shop');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setError('');
    let rotateIdempotencyKey = false;
    const payload = { name: form.name, email: form.email, message: form.message };
    supportIdentity.current = createRendererContactActionIdentity(payload, supportIdentity.current);
    try {
      const response = await fetch('/admin/api/support-request', {
        method: 'POST',
        headers: rendererContactRequestHeaders(supportIdentity.current.idempotencyKey),
        body: supportIdentity.current.serializedPayload,
      });
      const result = await response.json().catch(() => null) as { success?: boolean; error?: string; code?: string } | null;
      rotateIdempotencyKey = response.status >= 500 || result?.code === 'SUPPORT_PREVIOUSLY_FAILED';
      if (!response.ok || !result?.success) throw new Error(result?.error || 'Anfrage konnte nicht gesendet werden.');
      setSent(true);
    } catch (submitError) {
      if (rotateIdempotencyKey) supportIdentity.current = null;
      setError(submitError instanceof Error ? submitError.message : 'Anfrage konnte nicht gesendet werden.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">Website-Funktionen</p>
        <h1 className="text-2xl font-bold text-zinc-950">Was möchten Sie verwalten?</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Öffnen Sie eine aktive Funktion oder richten Sie ein neues Premium-Modul ein. Der Status zeigt, was bereits auf Ihrer Website genutzt wird.
        </p>
      </header>

      <section aria-labelledby="included-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="included-heading" className="text-lg font-semibold text-zinc-950">Inklusive Funktionen</h2>
            <p className="mt-1 text-sm text-zinc-500">Sofort verfügbar, sobald das passende Element auf Ihrer Website eingebaut ist.</p>
          </div>
          <span className="hidden text-xs font-medium text-zinc-400 sm:block">Im Paket enthalten</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {INCLUDED_FEATURES.map(feature => {
            const inUse = featureUsage[feature.id];
            return (
              <FeatureCard
                key={feature.id}
                {...feature}
                status={inUse ? 'Aktiv' : 'Nicht auf der Website genutzt'}
                statusTone={inUse ? 'active' : 'attention'}
                action={inUse ? 'Öffnen' : 'Auf Website einbauen'}
                href={inUse ? feature.href : '/admin/pages'}
                note={!inUse ? 'Die Funktion wird aktiv, sobald sie in einer Seite verwendet wird.' : undefined}
              />
            );
          })}
        </div>
      </section>

      <section aria-labelledby="premium-heading">
        <div className="mb-4">
          <h2 id="premium-heading" className="text-lg font-semibold text-zinc-950">Premium-Module</h2>
          <p className="mt-1 text-sm text-zinc-500">Leistungsfähige Erweiterungen für Verkauf, Terminplanung und internationale Inhalte.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-4">
          <FeatureCard
            title="Booking Pro"
            description="Services, Ressourcen, Kapazitäten, Kalender, Bestätigungen und Kunden-Stornierung in einem Ablauf."
            note="Anders als die einfache Reservierung prüft Booking Pro freie Zeiten und steuert den gesamten Buchungsprozess."
            href={bookingPresentation.href}
            action={bookingPresentation.action}
            status={bookingPresentation.status}
            statusTone={bookingPresentation.tone}
            icon={CalendarCheck}
            iconTone="bg-pink-50 text-pink-700 ring-pink-100"
          />
          <FeatureCard
            title="Online-Shop"
            description="Produkte, sichere Zahlungen, Bestellungen, Rechnungen, Versand und Coupons zentral verwalten."
            href={shopPresentation.href}
            action={shopPresentation.action}
            status={shopPresentation.status}
            statusTone={shopPresentation.tone}
            icon={ShoppingBag}
            iconTone="bg-emerald-50 text-emerald-700 ring-emerald-100"
          />
          {billingEnabled ? (
            <FeatureCard
              title="Rechnungen & Kunden"
              description="Angebote, Rechnungen, Kunden, Serienläufe, Zahlungen und Mahnungen in einem ruhigen Arbeitsbereich."
              note="Mit Rabatten, DE/AT-E-Rechnung, sicherem Versand und nachvollziehbaren Korrekturen."
              href="/admin/billing"
              action="Rechnungen verwalten"
              status="Aktiv"
              statusTone="active"
              icon={ReceiptText}
              iconTone="bg-blue-50 text-blue-700 ring-blue-100"
            />
          ) : (
            <article className="admin-card flex min-h-64 flex-col p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100"><ReceiptText className="size-5" /></div>
                <StatusPill tone="available" label="Premium" />
              </div>
              <h3 className="mt-5 font-semibold text-zinc-950">Rechnungen & Kunden</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-500">Angebote, Rechnungen, Kunden, Serien und Zahlungen professionell verwalten.</p>
              <p className="mt-3 border-l-2 border-blue-100 pl-3 text-xs leading-5 text-zinc-400">Mit DE/AT-E-Rechnung, Rabatten, Mahnungen, SMTP und nachvollziehbarem Storno.</p>
              <button type="button" onClick={() => openSupportModal('Ich möchte das Modul Rechnungen & Kunden für meine Website aktivieren.')} className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                Modul anfragen <ArrowRight className="size-4" />
              </button>
            </article>
          )}
          {i18nEnabled ? (
            <FeatureCard
              title="Mehrsprachigkeit"
              description="Sprachen und Sprachschalter konfigurieren; Seiteninhalte werden je Sprache im CMS gepflegt."
              note="Eine professionelle Übersetzung durch Flamingo kann separat angefragt werden."
              href="/admin/functions/i18n"
              action="Sprachen verwalten"
              status="Aktiv"
              statusTone="active"
              icon={Globe}
              iconTone="bg-violet-50 text-violet-700 ring-violet-100"
            />
          ) : (
            <article className="admin-card flex min-h-64 flex-col p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-11 place-items-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-violet-100"><Globe className="size-5" /></div>
                <StatusPill tone="available" label="Premium" />
              </div>
              <h3 className="mt-5 font-semibold text-zinc-950">Mehrsprachigkeit</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-500">Sprachen im CMS verwalten und Inhalte pro Sprache gezielt pflegen.</p>
              <p className="mt-3 text-xs leading-5 text-zinc-400">Bis zu 10 Sprachen. Übersetzung durch Flamingo auf Anfrage.</p>
              <button
                type="button"
                onClick={() => openSupportModal('Ich hätte gerne die Mehrsprachigkeit für meine Website aktiviert.')}
                className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-semibold text-violet-700 hover:text-violet-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                Mehrsprachigkeit anfragen <ArrowRight className="size-4" />
              </button>
            </article>
          )}
        </div>
      </section>

      <aside className="flex flex-col gap-4 border-t border-zinc-200 py-7 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-indigo-500" />
          <div>
            <p className="text-sm font-semibold text-zinc-800">Sie benötigen einen individuellen Ablauf?</p>
            <p className="mt-1 text-sm text-zinc-500">Wir prüfen, ob eine bestehende Funktion passt oder entwickeln eine Erweiterung.</p>
          </div>
        </div>
        <button type="button" onClick={() => openSupportModal()} className="admin-btn-secondary shrink-0">Funktion anfragen</button>
      </aside>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeSupportModal}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="support-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-4">
              <h2 id="support-title" className="text-lg font-semibold">Funktion anfragen</h2>
              <button type="button" onClick={closeSupportModal} aria-label="Dialog schließen" className="grid size-11 place-items-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"><X size={18} /></button>
            </div>
            {sent ? (
              <div role="status" className="py-10 text-center">
                <Check className="mx-auto size-8 text-emerald-600" />
                <p className="mt-3 font-medium text-emerald-700">Anfrage gesendet</p>
                <p className="mt-2 text-sm text-zinc-500">Wir melden uns zeitnah bei Ihnen.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {error ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
                <label className="block"><span className="admin-label">Name</span><input required className="admin-input" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label>
                <label className="block"><span className="admin-label">E-Mail</span><input required type="email" className="admin-input" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label>
                <label className="block"><span className="admin-label">Was möchten Sie erreichen?</span><textarea required className="admin-input min-h-28 resize-y" placeholder="Beschreiben Sie kurz den gewünschten Ablauf." value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} /></label>
                <button type="submit" disabled={sending} className="admin-btn-primary w-full">{sending ? 'Wird gesendet …' : 'Anfrage senden'}</button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FeatureCard({ title, description, href, action, status, statusTone, icon: Icon, iconTone, note }: FeatureCardProps) {
  return (
    <article className="admin-card group flex min-h-64 flex-col p-5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md focus-within:ring-2 focus-within:ring-zinc-300">
      <div className="flex items-start justify-between gap-4">
        <div className={`grid size-11 place-items-center rounded-xl ring-1 ${iconTone}`}><Icon className="size-5" /></div>
        <StatusPill tone={statusTone} label={status} />
      </div>
      <h3 className="mt-5 font-semibold text-zinc-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
      {note ? <p className="mt-3 border-l-2 border-zinc-200 pl-3 text-xs leading-5 text-zinc-400">{note}</p> : null}
      <Link href={href} className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-semibold text-zinc-800 hover:text-zinc-950 focus-visible:outline-none">
        {action} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}

function StatusPill({ tone, label }: { tone: FeatureCardProps['statusTone']; label: string }) {
  const styles = tone === 'active'
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    : tone === 'attention'
      ? 'bg-amber-50 text-amber-800 ring-amber-200'
      : 'bg-zinc-100 text-zinc-600 ring-zinc-200';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${styles}`}>
      {tone === 'active' ? <Check className="size-3" /> : tone === 'attention' ? <Circle className="size-2.5" /> : <Lock className="size-3" />}
      {label}
    </span>
  );
}

function getPremiumPresentation(
  state: { enabled: boolean; requested: boolean; used: boolean; ready: boolean },
  label: 'Booking' | 'Shop',
): { href: string; action: string; status: string; tone: FeatureCardProps['statusTone'] } {
  const moduleHref = label === 'Booking' ? '/admin/functions/booking' : '/admin/shop';
  if (!state.enabled) {
    return state.requested
      ? { href: moduleHref, action: 'Anfrage ansehen', status: 'Freischaltung angefragt', tone: 'attention' }
      : { href: moduleHref, action: `${label} kennenlernen`, status: 'Premium', tone: 'available' };
  }
  if (!state.ready) return { href: moduleHref, action: 'Jetzt einrichten', status: 'Einrichtung offen', tone: 'attention' };
  if (!state.used) return { href: '/admin/pages', action: 'Auf Website einbauen', status: 'Noch nicht auf Website', tone: 'attention' };
  return { href: moduleHref, action: `${label} verwalten`, status: 'Einsatzbereit', tone: 'active' };
}
