import Link from 'next/link';
import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, CircleHelp, Clock3, Palette, ShieldCheck } from 'lucide-react';
import { getContentHealthReport } from './actions';
import { RefreshContentHealthButton } from './refresh-button';
import { presentContentHealthIssue, type ContentHealthIssue } from '@/lib/content-health';

function sourceLabel(source: string) {
  if (source === 'color') return 'Farben & Lesbarkeit';
  if (source === 'freshness') return 'Datum & Aktualität';
  return 'Text & Inhalt';
}

function IssueCard({ issue }: { issue: ContentHealthIssue }) {
  const copy = presentContentHealthIssue(issue);
  return (
    <article className="px-4 py-5 sm:px-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${issue.severity === 'error' ? 'bg-red-50 text-red-700' : issue.source === 'freshness' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-800'}`}>{issue.severity === 'error' ? 'Muss behoben werden' : 'Empfehlung'}</span>
        <span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-600">{sourceLabel(issue.source)}</span>
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-zinc-900">{copy.title}</p>
      {issue.pair && <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-600">{issue.pair.fg && <span className="flex items-center gap-1.5"><i className="h-5 w-5 rounded border border-black/10" style={{ background: issue.pair.fg }} /> Textfarbe</span>}{issue.pair.bg && <span className="flex items-center gap-1.5"><i className="h-5 w-5 rounded border border-black/10" style={{ background: issue.pair.bg }} /> Hintergrund</span>}</div>}
      <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs leading-5 text-zinc-700"><strong className="text-zinc-900">Nächster Schritt:</strong> {copy.action}</div>
    </article>
  );
}

export default async function ContentHealthPage() {
  const report = await getContentHealthReport();
  if (!report.success) {
    return (
      <div className="admin-card mx-auto max-w-3xl p-8 text-center">
        <AlertCircle size={28} className="mx-auto text-red-600" />
        <h1 className="mt-4 text-xl font-bold">Prüfung nicht verfügbar</h1>
        <p className="mt-2 text-sm text-zinc-600">{report.error}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <RefreshContentHealthButton />
          <Link href="/admin" className="admin-btn-secondary min-h-10">Zum Dashboard</Link>
        </div>
      </div>
    );
  }
  const hasAdvisories = report.advisoryCount > 0;
  const status = report.readyToPublish ? (hasAdvisories ? 'Kann veröffentlicht werden' : 'Alles bereit') : 'Vor dem Veröffentlichen noch prüfen';
  const StatusIcon = report.readyToPublish ? CheckCircle2 : AlertTriangle;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Verbesserungsvorschläge</p><h1 className="text-2xl font-bold text-zinc-950">Website prüfen</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">Hier sehen Sie verständliche Aufgaben für Texte, Bilder, Farben und veraltete Angaben. Öffnen Sie einen Bereich und arbeiten Sie die wichtigen Punkte zuerst ab.</p></div>
        <RefreshContentHealthButton />
      </div>

      <section className={`mb-6 overflow-hidden rounded-2xl border p-5 sm:p-6 ${report.readyToPublish ? 'border-emerald-200 bg-emerald-50/70' : 'border-amber-200 bg-amber-50/70'}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${report.readyToPublish ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}><StatusIcon size={20} /></span><div><h2 className="font-semibold text-zinc-950">{status}</h2><p className="mt-1 text-sm text-zinc-600">{report.readyToPublish ? 'Es gibt keine Probleme, die eine Veröffentlichung verhindern. Empfehlungen können Sie nach und nach bearbeiten.' : `${report.blockingCount} ${report.blockingCount === 1 ? 'Problem muss' : 'Probleme müssen'} noch behoben werden, bevor die Website veröffentlicht werden kann.`}</p></div></div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-lg bg-white/80 px-3 py-2 text-red-700">{report.blockingCount} wichtig</span><span className="rounded-lg bg-white/80 px-3 py-2 text-amber-800">{report.advisoryCount} Empfehlungen</span></div>
        </div>
      </section>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Seiten geprüft', value: report.totals.pages, icon: ShieldCheck },
          { label: 'Texte & Inhalte', value: report.totals.contentErrors + report.totals.contentWarnings, icon: CircleHelp },
          { label: 'Farben & Lesbarkeit', value: report.totals.colorErrors + report.totals.colorWarnings, icon: Palette },
          { label: 'Termine prüfen', value: report.totals.freshnessWarnings, icon: Clock3 },
        ].map(item => <div key={item.label} className="admin-card p-4"><item.icon size={17} className="text-zinc-400" /><p className="mt-3 text-2xl font-bold text-zinc-950">{item.value}</p><p className="mt-0.5 text-xs text-zinc-500">{item.label}</p></div>)}
      </div>

      {report.groups.length === 0 ? (
        <div className="admin-card p-10 text-center"><CheckCircle2 size={30} className="mx-auto text-emerald-600" /><h2 className="mt-4 font-semibold text-zinc-950">Alles sieht gut aus</h2><p className="mt-2 text-sm text-zinc-500">Texte, Bilder, Farben und Datumsangaben brauchen derzeit keine Aufmerksamkeit.</p></div>
      ) : (
        <div className="space-y-3">
          {report.groups.map((group, index) => (
            <details key={group.key} open={index === 0 && group.errors > 0} className="group admin-card overflow-hidden">
              <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 sm:px-5 [&::-webkit-details-marker]:hidden">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${group.errors ? 'bg-red-500' : 'bg-amber-400'}`} />
                <div className="min-w-0 flex-1"><h2 className="truncate text-sm font-semibold text-zinc-950">{group.label}</h2><p className="mt-0.5 text-xs text-zinc-500">{group.issues.length} {group.issues.length === 1 ? 'Aufgabe' : 'Aufgaben'} · {group.errors} wichtig · {group.warnings} empfohlen</p></div>
                <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-zinc-400 transition-transform group-open:rotate-90" />
              </summary>
              <div className="divide-y divide-zinc-100 border-t border-zinc-100">
                <div className="flex justify-end px-4 py-3 sm:px-5">
                  <Link href={group.href} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Bereich bearbeiten <ArrowRight size={14} /></Link>
                </div>
                {group.issues.map((issue, issueIndex) => <IssueCard key={`${issue.code || issue.message}-${issueIndex}`} issue={issue} />)}
              </div>
            </details>
          ))}
        </div>
      )}
      <p className="mt-5 text-xs text-zinc-400">Zuletzt geprüft: {new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(report.checkedAt))}</p>
    </div>
  );
}
