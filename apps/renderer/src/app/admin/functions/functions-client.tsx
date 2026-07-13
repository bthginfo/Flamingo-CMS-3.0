'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Heart, CalendarDays, Inbox, ShoppingBag, Sparkles, X, Globe, Lock, Check, CalendarCheck } from 'lucide-react';
import {
  createRendererContactActionIdentity,
  rendererContactRequestHeaders,
  type RendererContactActionIdentity,
} from '@/lib/renderer-contact-client-security';

const FEATURES = [
  {
    id: 'rsvp',
    label: 'RSVP – Gäste',
    description: 'Zu- und Absagen Ihrer Gäste verwalten.',
    requiredSection: 'rsvp',
    href: '/admin/rsvp',
    icon: Heart,
    color: 'text-rose-500',
  },
  {
    id: 'reservations',
    label: 'Reservierungen',
    description: 'Tisch-Reservierungen Ihrer Gäste einsehen und verwalten.',
    requiredSection: 'reservation',
    href: '/admin/functions/reservations',
    icon: CalendarDays,
    color: 'text-amber-500',
  },
  {
    id: 'inbox',
    label: 'Kontaktanfragen',
    description: 'Eingegangene Nachrichten aus dem Kontaktformular.',
    requiredSection: 'contact (formEnabled: true)',
    href: '/admin/inbox',
    icon: Inbox,
    color: 'text-blue-500',
  },
];

export function FunctionsClient({ i18nEnabled, bookingEnabled, bookingRequested, shopEnabled }: { i18nEnabled: boolean; bookingEnabled: boolean; bookingRequested: boolean; shopEnabled: boolean }) {
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const supportIdentity = useRef<RendererContactActionIdentity | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function openSupportModal(message = '') {
    setShowModal(true);
    setSent(false);
    setError('');
    supportIdentity.current = null;
    setForm(current => ({ ...current, message }));
  }

  async function handleSubmit(e: React.FormEvent) {
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
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Anfrage konnte nicht gesendet werden.');
      }
      setSent(true);
    } catch (submitError) {
      if (rotateIdempotencyKey) supportIdentity.current = null;
      setError(submitError instanceof Error ? submitError.message : 'Anfrage konnte nicht gesendet werden.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Funktionen</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Interaktive Features Ihrer Website. Jede Funktion benötigt die passende Section auf einer Ihrer Seiten.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <Link
            key={f.id}
            href={f.href}
            className="admin-card p-5 flex items-start gap-4 transition hover:ring-2 hover:ring-zinc-300"
          >
            <f.icon className={`w-6 h-6 mt-0.5 shrink-0 ${f.color}`} />
            <div>
              <p className="font-semibold">{f.label}</p>
              <p className="text-sm text-zinc-500 mt-0.5">{f.description}</p>
              <p className="text-xs text-zinc-400 mt-2">
                Benötigt Section: <code className="bg-zinc-100 px-1 rounded">{f.requiredSection}</code>
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Premium Addons */}
      <h2 className="text-lg font-semibold mt-10 mb-4">Premium-Erweiterungen</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/functions/booking"
          className={`admin-card p-5 flex items-start gap-4 transition hover:ring-2 ${bookingEnabled ? 'hover:ring-pink-300' : 'opacity-80 hover:ring-amber-300'}`}
        >
          <CalendarCheck className="w-6 h-6 mt-0.5 shrink-0 text-pink-500" />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">Booking</p>
              {bookingEnabled ? <Check size={12} className="text-green-500" /> : <Lock size={12} className="text-zinc-400" />}
            </div>
            <p className="text-sm text-zinc-500 mt-0.5">Anfragen oder direkte Buchungen mit Ressourcen, Leistungen, Kalender und E-Mails.</p>
            <p className={`text-xs mt-2 font-medium ${bookingEnabled ? 'text-green-600' : 'text-zinc-400'}`}>
              {bookingEnabled ? 'Aktiv · Einstellungen verwalten →' : bookingRequested ? 'Anfrage eingegangen · Wir melden uns' : 'Premium Add-on · Anfragen →'}
            </p>
          </div>
        </Link>
        <Link
          href="/admin/shop"
          className={`admin-card p-5 flex items-start gap-4 transition hover:ring-2 ${shopEnabled ? 'hover:ring-emerald-300' : 'opacity-80 hover:ring-amber-300'}`}
        >
          <ShoppingBag className="w-6 h-6 mt-0.5 shrink-0 text-emerald-500" />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">Online-Shop</p>
              {shopEnabled ? <Check size={12} className="text-green-500" /> : <Lock size={12} className="text-zinc-400" />}
            </div>
            <p className="text-sm text-zinc-500 mt-0.5">Produkte, Zahlungen, Bestellungen, Rechnungen, Versand und Gutscheine.</p>
            <p className={`text-xs mt-2 font-medium ${shopEnabled ? 'text-green-600' : 'text-zinc-400'}`}>
              {shopEnabled ? 'Aktiv · Shop verwalten →' : 'Premium Add-on · Details ansehen →'}
            </p>
          </div>
        </Link>
        {i18nEnabled ? (
          <Link
            href="/admin/functions/i18n"
            className="admin-card p-5 flex items-start gap-4 transition hover:ring-2 hover:ring-violet-300"
          >
            <Globe className="w-6 h-6 mt-0.5 shrink-0 text-violet-500" />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">Mehrsprachigkeit (i18n)</p>
                <Check size={12} className="text-green-500" />
              </div>
              <p className="text-sm text-zinc-500 mt-0.5">Website in mehreren Sprachen — automatische Übersetzung inklusive.</p>
              <p className="text-xs text-green-600 mt-2 font-medium">Aktiv · Einstellungen verwalten →</p>
            </div>
          </Link>
        ) : (
          <div className="admin-card p-5 flex items-start gap-4 opacity-75 relative">
            <Globe className="w-6 h-6 mt-0.5 shrink-0 text-violet-500" />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">Mehrsprachigkeit (i18n)</p>
                <Lock size={12} className="text-zinc-400" />
              </div>
              <p className="text-sm text-zinc-500 mt-0.5">Website in mehreren Sprachen — automatische Übersetzung inklusive.</p>
              <p className="text-xs text-zinc-400 mt-2">Ab 290€ einmalig · Bis zu 10 Sprachen</p>
              <button
                onClick={() => openSupportModal('Ich hätte gerne die Mehrsprachigkeit (i18n) für meine Website aktiviert.')}
                className="mt-2 text-xs font-medium text-violet-600 hover:text-violet-700 underline underline-offset-2"
              >
                Jetzt anfragen →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CTA for custom features */}
      <div className="mt-10 border border-dashed border-zinc-200 rounded-xl p-6 text-center bg-zinc-50/50">
        <Sparkles className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
        <p className="text-sm text-zinc-600">Sie möchten individuelle Funktionen zusätzlich haben?</p>
        <button
          onClick={() => openSupportModal()}
          className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
        >
          Jetzt bei Flamingo Media anfragen →
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Individuelle Funktion anfragen</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-600"><X size={18} /></button>
            </div>
            {sent ? (
              <div className="py-8 text-center">
                <p className="text-green-600 font-medium">Anfrage gesendet! ✓</p>
                <p className="text-sm text-zinc-500 mt-2">Wir melden uns zeitnah bei Ihnen.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                  <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-zinc-500">Name *</label>
                  <input required className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500">E-Mail *</label>
                  <input required type="email" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500">Welche Funktion wünschen Sie sich? *</label>
                  <textarea required className="w-full border rounded-lg px-3 py-2 text-sm mt-1 min-h-[100px] resize-y" placeholder="z.B. Online-Terminbuchung, Mitgliederbereich, Newsletter..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" disabled={sending} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                  {sending ? 'Wird gesendet...' : 'Anfrage senden'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
