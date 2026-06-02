'use client';

import { CalendarDays, CheckCircle2, Clock, Mail, SlidersHorizontal, Users } from 'lucide-react';
import Seo from '@/components/Seo';
import { LiveAdminShowcase } from '@/showcase/LiveAdminShowcase';

const DEMO_BASE = 'https://www.demo.flamingomedia.online';

const FEATURES = [
  {
    icon: CalendarDays,
    title: 'Anfrage oder direkte Buchung',
    text: 'Du entscheidest, ob Gäste erst anfragen oder direkt verbindlich buchen können. Ideal für Restaurants, Cafés, Salons, Fotografen, Hotels und Locations.',
  },
  {
    icon: Users,
    title: 'Ressourcen statt Chaos',
    text: 'Lege Tische, Räume, Mitarbeiter, Zimmer, Studios oder Equipment an und ordne Buchungen sauber zu.',
  },
  {
    icon: Clock,
    title: 'Zeitslots, ganze Tage, Zeiträume',
    text: 'Halbstündliche Termine, ein ganzer Fototag oder mehrere Nächte: Das Zeitmodell passt sich an Dein Angebot an.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Verfügbarkeiten & Sperrzeiten',
    text: 'Definiere Öffnungszeiten, buchbare Slots, Urlaub, Feiertage oder blockierte Räume direkt im CMS.',
  },
  {
    icon: Mail,
    title: 'Automatische E-Mails',
    text: 'Bestätigungen, Absagen und Storno-Links laufen automatisch über den Mailserver des Kunden oder den Flamingo-Fallback.',
  },
  {
    icon: CheckCircle2,
    title: 'Tagesplan im Admin',
    text: 'Sieh pro Tag, wer kommt, welche Ressource geblockt ist und welche Anfragen noch bestätigt werden müssen.',
  },
];

const USE_CASES = [
  ['Restaurant & Café', 'Tische, Personenzahl, Anfrage oder direkte Reservierung.'],
  ['Salon & Praxis', 'Leistungen, Dauer, Mitarbeiter und Termin-Slots.'],
  ['Hotel & Apartment', 'Zimmer, Datumsbereiche, Sperrzeiten und Anfragekalender.'],
  ['Fotografie', 'Ganztagesbuchungen, Shootings, Ressourcen und Vorgespräche.'],
  ['Location & Eventraum', 'Räume, Flächen, Zeiträume und manuelle Freigabe.'],
  ['Fitness & Coaching', 'Probetrainings, Kurse, Coach-Verfügbarkeit und Slots.'],
];

export function BookingPage() {
  return (
    <>
      <Seo
        title="Booking-Addon · FlamingoMedia"
        description="Reservierungen, Termine, Ressourcen und Kalender direkt im Flamingo CMS steuern."
      />

      <section className="pt-44 pb-14">
        <div className="container-x">
          <p className="eyebrow mb-5 reveal">Booking-Addon</p>
          <h1 className="headline-xl max-w-5xl reveal">
            Buchungen, Termine und Anfragen.<br />
            <em className="italic-pop">Direkt in Deiner Website.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted md:text-xl reveal">
            Kein externes Reservierungstool, kein zweiter Admin. Flamingo Booking verbindet Deine Website mit Anfrage-Inbox,
            Tagesplan, Ressourcen, Sperrzeiten und automatischen E-Mails.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 reveal">
            <a href="/kontakt" className="btn-primary">Booking anfragen →</a>
            <a href={`${DEMO_BASE}/admin/demo-login?industry=restaurant&public=1&next=/admin/functions/booking`} target="_blank" rel="noopener" className="btn-outline">
              Admin-Demo ansehen
            </a>
          </div>
        </div>
      </section>

      <LiveAdminShowcase mode="booking" compact showTabs={false} smallPreview />

      <section className="py-20 md:py-28 surface">
        <div className="container-x">
          <div className="max-w-3xl reveal">
            <p className="eyebrow mb-5">Was es kann</p>
            <h2 className="headline-md">Ein Booking-System, das zu Deinem Betrieb passt.</h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              Das Modul ist bewusst flexibel gebaut: einfache Anfrage, direkte Self-Service-Buchung, Ressourcenplanung oder Tagesbuchung.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3 reveal-stagger">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl border border-line bg-white p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white">
                  <Icon size={20} />
                </span>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="reveal">
            <p className="eyebrow mb-5">Für wen</p>
            <h2 className="headline-md">Ein Modul, viele Buchungslogiken.</h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              Statt für jede Branche ein eigenes Inselsystem zu bauen, nutzt Flamingo ein gemeinsames Booking-Fundament.
              Die Website-Sections und Admin-Felder passen sich an den jeweiligen Einsatz an.
            </p>
          </div>
          <div className="grid gap-3 reveal-stagger">
            {USE_CASES.map(([title, text]) => (
              <div key={title} className="flex flex-col gap-1 rounded-2xl border border-line bg-white p-5 md:flex-row md:items-center md:justify-between">
                <h3 className="font-bold">{title}</h3>
                <p className="text-sm text-muted md:max-w-md md:text-right">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-brand text-white">
        <div className="container-x text-center reveal">
          <p className="eyebrow mb-5 !text-white/60">Preis</p>
          <h2 className="headline-md max-w-3xl mx-auto">Booking als Add-on für Betriebe, die online Termine wirklich nutzen wollen.</h2>
          <div className="mx-auto mt-12 max-w-3xl rounded-[32px] border border-white/15 bg-white/8 p-8 text-left backdrop-blur">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-white/50">Einrichtung</p>
                <p className="mt-3 text-5xl font-black">399 €</p>
                <p className="mt-3 text-sm leading-7 text-white/65">Wir aktivieren das Modul, richten die Grundlogik ein und passen die Booking-Sections an Deine Website an.</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-white/50">Betrieb</p>
                <p className="mt-3 text-5xl font-black">20 €<span className="text-lg font-semibold text-white/60">/Monat</span></p>
                <p className="mt-3 text-sm leading-7 text-white/65">Für Kalenderlogik, Anfrageverwaltung, E-Mail-Automation und laufende technische Pflege des Add-ons.</p>
              </div>
            </div>
          </div>
          <a href="/kontakt" className="btn-accent mt-12 inline-flex">Booking-Addon anfragen →</a>
        </div>
      </section>
    </>
  );
}
