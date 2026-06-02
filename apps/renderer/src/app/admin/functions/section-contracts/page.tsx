import { PILOT_SECTION_CONTRACTS } from '@/lib/section-contracts';

export default function SectionContractsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Intern</p>
        <h1 className="mt-2 text-2xl font-bold">Section Contract Studio</h1>
        <p className="mt-2 max-w-3xl text-sm text-zinc-500">
          Read-only Übersicht der pilotierten Section Contracts. Ein Contract beschreibt, welche Inhalte, Medien und Farbslots eine Section offiziell unterstützt.
        </p>
      </div>

      <div className="grid gap-4">
        {PILOT_SECTION_CONTRACTS.map(contract => (
          <article key={contract.type} className="admin-card p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">{contract.label}</h2>
                  <code className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-500">{contract.type}</code>
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">{contract.category}</span>
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  Wrapper: {contract.wrapper || 'standard'} · Theme: {contract.defaultTheme || 'auto'}
                </p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-lg bg-zinc-50 px-2.5 py-1.5 text-zinc-600">{contract.fields.length} Felder</span>
                <span className="rounded-lg bg-zinc-50 px-2.5 py-1.5 text-zinc-600">{contract.colorSlots.length} Farbslots</span>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-zinc-700">Content-Felder</h3>
                <div className="mt-2 overflow-hidden rounded-xl border border-zinc-200">
                  {contract.fields.map(field => (
                    <div key={field.key} className="grid grid-cols-[1fr_auto] gap-3 border-b border-zinc-100 px-3 py-2 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-zinc-800">{field.label}</p>
                        <p className="text-xs text-zinc-400">{field.key}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {field.required && <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">Pflicht</span>}
                        {field.supportsFocalPoint && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">Fokuspunkt</span>}
                        <code className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-500">{field.type}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-700">Farbslots</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {contract.colorSlots.map(slot => (
                    <code key={slot} className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600">{slot}</code>
                  ))}
                </div>
                <h3 className="mt-5 text-sm font-semibold text-zinc-700">Preview-Daten</h3>
                <pre className="mt-2 max-h-64 overflow-auto rounded-xl bg-zinc-950 p-3 text-xs text-zinc-100">
                  {JSON.stringify(contract.previewData, null, 2)}
                </pre>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
