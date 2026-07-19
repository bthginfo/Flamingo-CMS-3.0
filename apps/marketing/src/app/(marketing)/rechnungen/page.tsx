import type { Metadata } from 'next';
import { Check, FileCheck2, FileText, Mail, ReceiptText, ShieldCheck, UsersRound } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Rechnungen & Kunden – Kundenverwaltung, PDF und XRechnung im Flamingo CMS',
  description: 'Kunden, Leistungen, fortlaufende Rechnungsnummern, PDF-Vorschau, XRechnung, sicherer SMTP-Versand und nachvollziehbare Stornos direkt im Flamingo CMS.',
  alternates: { canonical: '/rechnungen' },
  openGraph: {
    title: 'Rechnungen & Kunden · FlamingoMedia',
    description: 'Vom Kundenstamm bis zur festgeschriebenen PDF- und XRechnung – ohne separates Rechnungstool.',
  },
};

const capabilities = [
  { icon: UsersRound, title: 'Kundenstamm, der zu Deinem Betrieb passt', text: 'Firmen und Personen, Rechnungs- und Lieferadressen, Zahlungsziel, Steuerdaten, Leitweg-ID und eigene strukturierte Stammdatenfelder.' },
  { icon: ReceiptText, title: 'Rechnungen ohne Tabellen-Bastelei', text: 'Leistungen aus dem Katalog einsetzen, Mengen und Steuern prüfen und die Rechnung während der Eingabe als echtes Dokument sehen.' },
  { icon: FileCheck2, title: 'PDF und XRechnung zusammen', text: 'Jede festgeschriebene Rechnung steht als lesbares PDF und als strukturierte XRechnung nach EN 16931 bereit.' },
  { icon: ShieldCheck, title: 'Korrekturen bleiben nachvollziehbar', text: 'Festgeschriebene Inhalte werden nicht überschrieben. Eine Korrektur erzeugt ein verknüpftes Stornodokument mit eigener Nummer und Prüfspur.' },
  { icon: Mail, title: 'Direkt sicher versenden', text: 'PDF und XML gehen gemeinsam über Deinen hinterlegten Mail-Server oder den vollständig konfigurierten Flamingo-Versand an den Kunden.' },
  { icon: FileText, title: 'Eigene Nummernlogik', text: 'Zum Beispiel RE-2026-0001, 2026/07/0001 oder ein eigenes Format – fortlaufend und mit optionalem Jahres- oder Monatswechsel.' },
];

export default function BillingMarketingPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative bg-[#0b1020] pb-24 pt-44 text-white md:pb-32 md:pt-52">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_70%_20%,rgba(242,65,113,.42),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(66,111,255,.36),transparent_34%)]" />
        <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6 text-white/60">Paid Feature · Rechnungen & Kunden</p>
            <h1 className="headline-xl max-w-5xl">Vom Kundenstamm zur Rechnung. <em className="italic-pop">In einem ruhigen Workflow.</em></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68 md:text-xl">Kein zweites Login, keine Rechnungsvorlage in Word. Kunden, Leistungen, PDF, XRechnung, Versand und Storno leben direkt in Deinem Flamingo CMS.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="/kontakt" className="btn-accent">Feature anfragen <span aria-hidden>→</span></a>
              <a href="#preise" className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold transition hover:bg-white/10">Preis ansehen</a>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rotate-[-2deg] rounded-[2rem] bg-[#fdfbf7] p-7 text-[#111827] shadow-[0_32px_100px_rgba(0,0,0,.38)] md:p-9">
              <div className="flex items-start justify-between border-b border-slate-200 pb-7">
                <div><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-600">Rechnung</p><p className="mt-2 font-mono text-sm">RE-2026-0042</p></div>
                <div className="text-right"><p className="font-bold">Musterbetrieb GmbH</p><p className="mt-1 text-xs text-slate-500">Innsbruck · DACH</p></div>
              </div>
              <div className="mt-8 rounded-2xl bg-slate-100 p-5"><p className="text-xs uppercase tracking-widest text-slate-500">Rechnungsempfänger</p><p className="mt-2 font-semibold">Beispielkunde AG</p><p className="text-sm text-slate-500">Musterstraße 12 · 80331 München</p></div>
              <div className="mt-8 space-y-4 text-sm"><div className="flex justify-between border-b border-slate-200 pb-4"><span>Strategie & Umsetzung</span><strong>2.400,00 €</strong></div><div className="flex justify-between text-slate-500"><span>USt. 19 %</span><span>456,00 €</span></div><div className="flex justify-between border-t-2 border-blue-600 pt-4 text-lg"><strong>Gesamt</strong><strong>2.856,00 €</strong></div></div>
              <div className="mt-8 flex gap-2 text-xs"><span className="rounded-full bg-emerald-100 px-3 py-1.5 font-semibold text-emerald-800">PDF bereit</span><span className="rounded-full bg-blue-100 px-3 py-1.5 font-semibold text-blue-800">XRechnung bereit</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="surface py-24 md:py-32">
        <div className="container-x">
          <p className="eyebrow mb-5">Ein Workflow statt sechs Einzellösungen</p>
          <h2 className="headline-lg max-w-4xl">Für Menschen gebaut, die Rechnungen schreiben müssen – <em className="italic-pop">nicht Buchhaltung studieren wollen.</em></h2>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl border border-line bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Icon size={21} /></div><h3 className="mt-6 text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-muted">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-brand py-24 text-white md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5"><p className="eyebrow mb-5 text-white/55">Der sichere Dokumentweg</p><h2 className="headline-lg">Entwurf bleibt flexibel. Festgeschrieben bleibt <em className="italic-pop">nachvollziehbar.</em></h2><p className="mt-6 leading-8 text-white/62">Vor dem Festschreiben prüft Flamingo Pflichtangaben. Danach sind Nummer, Inhalte und Dokumentdateien unveränderbar; Korrekturen erfolgen per Storno. Die technische Ablage ist für nachvollziehbare Belegprozesse ausgelegt. Steuerliche und organisatorische Pflichten bleiben Teil Deines Betriebs.</p></div>
          <ol className="grid gap-3 lg:col-span-7">
            {['Kunde wählen und Leistungen einsetzen', 'Pflichtangaben und Summen prüfen', 'Fortlaufende Nummer vergeben und festschreiben', 'PDF und XRechnung ansehen oder herunterladen', 'Per SMTP versenden, Zahlung markieren oder verknüpft stornieren'].map((step, index) => <li key={step} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.04] p-5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-brand">{index + 1}</span><span className="font-semibold text-white/85">{step}</span></li>)}
          </ol>
        </div>
      </section>

      <section id="preise" className="py-24 md:py-32">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6"><p className="eyebrow mb-5">Preis</p><h2 className="headline-lg">Ein integriertes Werkzeug. <em className="italic-pop">Klar kalkuliert.</em></h2><p className="mt-6 max-w-xl text-lg leading-8 text-muted">Der laufende Preis deckt Formatpflege für E-Rechnungen, sicheren Dokumentbetrieb und die Weiterentwicklung des Moduls ab.</p></div>
          <div className="lg:col-span-6 rounded-[2rem] border border-line bg-[#fff8fa] p-8 shadow-xl md:p-10">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">Rechnungen & Kunden</p><div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2"><strong className="font-display text-5xl">499 €</strong><span className="pb-1 text-muted">einmalig</span></div><p className="mt-2 text-2xl font-bold">+ 29 € / Monat</p>
            <ul className="mt-7 space-y-3 text-sm">{['Einrichtung des Moduls und Nummernkreises', 'Kunden, eigene Stammdatenfelder und Leistungskatalog', 'PDF, XRechnung, Vorschau und Download', 'SMTP-Versand, Zahlungsstatus, Storno und Prüfspur'].map(item => <li key={item} className="flex gap-3"><Check size={18} className="mt-0.5 shrink-0 text-emerald-600" /><span>{item}</span></li>)}</ul>
            <div className="mt-7 rounded-2xl bg-white p-4 text-sm leading-6 text-muted"><strong className="text-brand">Optional Done-for-you: 799 €</strong><br />inklusive Einrichtung, Übernahme vorhandener Stammdaten und fünf Leistungen.</div>
            <a href="/kontakt" className="btn-primary mt-7 inline-flex">Rechnungen & Kunden anfragen →</a>
          </div>
        </div>
      </section>
    </main>
  );
}
