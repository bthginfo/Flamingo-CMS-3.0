import Link from 'next/link';
import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, CircleHelp, Clock3, Palette, ShieldCheck } from 'lucide-react';
import { getContentHealthReport } from './actions';
import { RefreshContentHealthButton } from './refresh-button';

function sourceLabel(source: string) {
  if (source === 'color') return 'Farbe';
  if (source === 'freshness') return 'Aktualität';
  return 'Inhalt';
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
  const status = report.readyToPublish ? (hasAdvisories ? 'Bereit mit Hinweisen' : 'Bereit zur Veröffentlichung') : 'Noch nicht veröffentlichungsbereit';
  const StatusIcon = report.readyToPublish ? CheckCircle2 : AlertTriangle;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Qualitätszentrale</p><h1 className="text-2xl font-bold text-zinc-950">Content Health</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">Dieselbe Prüfung, die auch vor dem Veröffentlichen läuft – gruppiert nach der Stelle, an der Sie das Problem beheben können.</p></div>
        <RefreshContentHealthButton />
      </div>

      <section className={`mb-6 overflow-hidden rounded-2xl border p-5 sm:p-6 ${report.readyToPublish ? 'border-emerald-200 bg-emerald-50/70' : 'border-amber-200 bg-amber-50/70'}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${report.readyToPublish ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}><StatusIcon size={20} /></span><div><h2 className="font-semibold text-zinc-950">{status}</h2><p className="mt-1 text-sm text-zinc-600">{report.readyToPublish ? 'Es gibt keine technischen Blocker. Hinweise können nach Priorität bearbeitet werden.' : `${report.blockingCount} blockierende ${report.blockingCount === 1 ? 'Prüfung muss' : 'Prüfungen müssen'} vor dem Publish gelöst werden.`}</p></div></div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-lg bg-white/80 px-3 py-2 text-red-700">{report.blockingCount} Blocker</span><span className="rounded-lg bg-white/80 px-3 py-2 text-amber-800">{report.advisoryCount} Hinweise</span></div>
        </div>
      </section>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Seiten geprüft', value: report.totals.pages, icon: ShieldCheck },
          { label: 'Inhaltsprobleme', value: report.totals.contentErrors + report.totals.contentWarnings, icon: CircleHelp },
          { label: 'Farbprobleme', value: report.totals.colorErrors + report.totals.colorWarnings, icon: Palette },
          { label: 'Abgelaufene Daten', value: report.totals.freshnessWarnings, icon: Clock3 },
        ].map(item => <div key={item.label} className="admin-card p-4"><item.icon size={17} className="text-zinc-400" /><p className="mt-3 text-2xl font-bold text-zinc-950">{item.value}</p><p className="mt-0.5 text-xs text-zinc-500">{item.label}</p></div>)}
      </div>

      {report.groups.length === 0 ? (
        <div className="admin-card p-10 text-center"><CheckCircle2 size={30} className="mx-auto text-emerald-600" /><h2 className="mt-4 font-semibold text-zinc-950">Keine Probleme gefunden</h2><p className="mt-2 text-sm text-zinc-500">Inhalte, Farben und explizite Datumsfelder sind aktuell ohne Befund.</p></div>
      ) : (
        <div className="space-y-3">
          {report.groups.map((group, index) => (
            <details key={group.key} open={index === 0 && group.errors > 0} className="group admin-card overflow-hidden">
              <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 sm:px-5 [&::-webkit-details-marker]:hidden">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${group.errors ? 'bg-red-500' : 'bg-amber-400'}`} />
                <div className="min-w-0 flex-1"><h2 className="truncate text-sm font-semibold text-zinc-950">{group.label}</h2><p className="mt-0.5 text-xs text-zinc-500">{group.issues.length} {group.issues.length === 1 ? 'Befund' : 'Befunde'} · {group.errors} Fehler · {group.warnings} Hinweise</p></div>
                <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-zinc-400 transition-transform group-open:rotate-90" />
              </summary>
              <div className="divide-y divide-zinc-100 border-t border-zinc-100">
                <div className="flex justify-end px-4 py-3 sm:px-5">
                  <Link href={group.href} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Bereich bearbeiten <ArrowRight size={14} /></Link>
                </div>
                {group.issues.map((issue, issueIndex) => (
                  <article key={`${issue.code || issue.message}-${issueIndex}`} className="px-4 py-5 sm:px-5">
                    <div className="flex flex-wrap items-center gap-2"><span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${issue.severity === 'error' ? 'bg-red-50 text-red-700' : issue.source === 'freshness' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-800'}`}>{issue.severity === 'error' ? 'Fehler' : 'Hinweis'}</span><span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-600">{sourceLabel(issue.source)}</span>{issue.code && <code className="text-[10px] text-zinc-400">{issue.code}</code>}</div>
                    <p className="mt-3 text-sm font-medium leading-6 text-zinc-900">{issue.message}</p>
                    {issue.location && <p className="mt-1 break-all font-mono text-[11px] leading-5 text-zinc-500">{issue.location}</p>}
                    {issue.pair && <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-600">{issue.pair.fg && <span className="flex items-center gap-1.5"><i className="h-5 w-5 rounded border border-black/10" style={{ background: issue.pair.fg }} /> Text {issue.pair.fg}</span>}{issue.pair.bg && <span className="flex items-center gap-1.5"><i className="h-5 w-5 rounded border border-black/10" style={{ background: issue.pair.bg }} /> Fläche {issue.pair.bg}</span>}{issue.pair.ratio && <span>Kontrast {issue.pair.ratio.toFixed(2)}:1</span>}</div>}
                    {(issue.repair?.instruction || issue.hint) && <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs leading-5 text-zinc-700"><strong className="text-zinc-900">So beheben:</strong> {issue.repair?.instruction || issue.hint}</div>}
                  </article>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
      <p className="mt-5 text-xs text-zinc-400">Zuletzt geprüft: {new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(report.checkedAt))}</p>
    </div>
  );
}
