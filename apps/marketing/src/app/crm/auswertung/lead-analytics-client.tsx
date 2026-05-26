'use client';

import { useEffect, useMemo, useState } from 'react';
import { BarChart3, CheckCircle2, Clock3, Lightbulb, Plus, Search, Target, TrendingUp, XCircle } from 'lucide-react';
import type { Lead } from '../leads/actions';

type IndustryRow = {
  name: string;
  canonical: string;
  aliases: string[];
  total: number;
  open: number;
  contacted: number;
  accepted: number;
  rejected: number;
  acceptanceRate: number;
  score: number;
  source: 'crm' | 'manual' | 'recommended';
};

const MANUAL_STORAGE_KEY = 'flamingo-crm-manual-industries-v2';

const INDUSTRY_GROUPS = [
  { name: 'Medizin & Praxen', patterns: ['arzt', 'ärzte', 'facharzt', 'zahnarzt', 'praxis', 'physio', 'therapie', 'medizin', 'orthopädie', 'dermatologie'] },
  { name: 'Gastronomie & Genuss', patterns: ['restaurant', 'café', 'cafe', 'bar', 'bäckerei', 'konditorei', 'gastronomie', 'wein', 'vinothek'] },
  { name: 'Beauty & Körper', patterns: ['salon', 'friseur', 'kosmetik', 'beauty', 'spa', 'massage', 'tattoo', 'nagel'] },
  { name: 'Handwerk & Bau', patterns: ['handwerk', 'maler', 'sanitär', 'heizung', 'klima', 'dach', 'bau', 'fenster', 'türen', 'garten', 'landschaft'] },
  { name: 'Wohnen & Einrichtung', patterns: ['möbel', 'küche', 'küchen', 'interior', 'innenarchitektur', 'einrichtung', 'bad', 'akustik', 'ergonomie'] },
  { name: 'Immobilien', patterns: ['immobilien', 'makler', 'hausverwaltung', 'property', 'real estate'] },
  { name: 'Hotel & Tourismus', patterns: ['hotel', 'pension', 'ferien', 'tourismus', 'reise', 'unterkunft', 'destination'] },
  { name: 'Beratung & Recht', patterns: ['kanzlei', 'anwalt', 'steuer', 'berater', 'consulting', 'coaching', 'notar'] },
  { name: 'Kreative Dienstleistungen', patterns: ['fotograf', 'design', 'agentur', 'marketing', 'video', 'film'] },
  { name: 'Sport & Bildung', patterns: ['fitness', 'studio', 'fahrschule', 'schule', 'kurs', 'bildung'] },
];

const RECOMMENDED_INDUSTRIES = [
  'Küchenstudios',
  'Möbelhäuser',
  'Innenarchitektur',
  'Bad & Sanitär',
  'Solar & Energie',
  'Heizung & Klima',
  'Fenster & Türen',
  'Immobilienmakler',
  'Hotels & Pensionen',
  'Restaurants',
  'Cafés & Bäckereien',
  'Zahnarztpraxen',
  'Facharztpraxen',
  'Kosmetikstudios',
  'Friseursalons',
  'Tattoo-Studios',
  'Fotografen',
  'Hochzeitslocations',
  'Steuerberater',
  'Kanzleien',
  'Physiotherapie',
  'Fitnessstudios',
  'Garten- und Landschaftsbau',
  'Bestatter',
  'Optiker & Hörakustiker',
  'Fahrschulen',
];

function normalize(value: string | null | undefined, fallback = 'Nicht angegeben') {
  const trimmed = (value || '').trim();
  return trimmed || fallback;
}

function canonicalIndustry(value: string | null | undefined) {
  const name = normalize(value, 'Nicht angegeben');
  const lower = name.toLowerCase();
  const group = INDUSTRY_GROUPS.find(candidate => candidate.patterns.some(pattern => lower.includes(pattern)));
  return group?.name || name;
}

function rate(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function qualityScore(accepted: number, rejected: number, contacted: number, total: number) {
  const decided = accepted + rejected;
  const decisionRate = total > 0 ? decided / total : 0;
  const acceptance = decided > 0 ? accepted / decided : 0;
  const contactSignal = total > 0 ? contacted / total : 0;
  return Math.round((acceptance * 70 + decisionRate * 20 + contactSignal * 10) * 100);
}

function groupBy<T extends string>(leads: Lead[], getKey: (lead: Lead) => T) {
  const map = new Map<T, Lead[]>();
  for (const lead of leads) {
    const key = getKey(lead);
    map.set(key, [...(map.get(key) || []), lead]);
  }
  return map;
}

function buildIndustryRows(leads: Lead[], manualIndustries: string[]): IndustryRow[] {
  const byGroup = groupBy(leads, lead => canonicalIndustry(lead.industry));
  const recommendedGroups = RECOMMENDED_INDUSTRIES.map(canonicalIndustry);
  const manualGroups = manualIndustries.map(canonicalIndustry);
  const allNames = new Set<string>([...recommendedGroups, ...manualGroups, ...byGroup.keys()]);

  return Array.from(allNames).map(name => {
    const items = byGroup.get(name) || [];
    const total = items.length;
    const accepted = items.filter(lead => lead.status === 'angenommen').length;
    const rejected = items.filter(lead => lead.status === 'abgelehnt').length;
    const contacted = items.filter(lead => lead.status === 'kontaktiert').length;
    const open = items.filter(lead => lead.status === 'offen').length;
    const aliases = Array.from(new Set([
      ...items.map(lead => normalize(lead.industry)),
      ...RECOMMENDED_INDUSTRIES.filter(industry => canonicalIndustry(industry) === name),
      ...manualIndustries.filter(industry => canonicalIndustry(industry) === name),
    ])).filter(alias => alias !== name && alias !== 'Nicht angegeben');
    const source: IndustryRow['source'] = total > 0 ? 'crm' : manualGroups.includes(name) ? 'manual' : 'recommended';
    return {
      name,
      canonical: name,
      aliases,
      total,
      open,
      contacted,
      accepted,
      rejected,
      acceptanceRate: rate(accepted, accepted + rejected),
      score: qualityScore(accepted, rejected, contacted, total),
      source,
    };
  }).sort((a, b) => b.score - a.score || b.total - a.total || a.name.localeCompare(b.name, 'de'));
}

function buildRegionRows(leads: Lead[]) {
  return Array.from(groupBy(leads, lead => normalize(lead.location)).entries()).map(([location, items]) => {
    const accepted = items.filter(lead => lead.status === 'angenommen').length;
    const rejected = items.filter(lead => lead.status === 'abgelehnt').length;
    const topIndustry = Array.from(groupBy(items, lead => canonicalIndustry(lead.industry)).entries()).sort((a, b) => b[1].length - a[1].length)[0]?.[0] || 'Nicht angegeben';
    return {
      location,
      total: items.length,
      accepted,
      rejected,
      open: items.filter(lead => lead.status === 'offen').length,
      contacted: items.filter(lead => lead.status === 'kontaktiert').length,
      acceptanceRate: rate(accepted, accepted + rejected),
      topIndustry,
    };
  }).sort((a, b) => b.acceptanceRate - a.acceptanceRate || b.total - a.total);
}

export function LeadAnalyticsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [query, setQuery] = useState('');
  const [manualIndustries, setManualIndustries] = useState<string[]>([]);
  const [newIndustry, setNewIndustry] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(MANUAL_STORAGE_KEY);
      if (stored) setManualIndustries(JSON.parse(stored));
    } catch {
      setManualIndustries([]);
    }
  }, []);

  function saveManualIndustries(next: string[]) {
    setManualIndustries(next);
    localStorage.setItem(MANUAL_STORAGE_KEY, JSON.stringify(next));
  }

  function addIndustry() {
    const name = newIndustry.trim();
    if (!name) return;
    const canonical = canonicalIndustry(name);
    const exists = [...manualIndustries, ...RECOMMENDED_INDUSTRIES].some(item => canonicalIndustry(item).toLowerCase() === canonical.toLowerCase() || item.toLowerCase() === name.toLowerCase());
    if (!exists) saveManualIndustries([...manualIndustries, name].sort((a, b) => canonicalIndustry(a).localeCompare(canonicalIndustry(b), 'de')));
    setNewIndustry('');
  }

  const statusCounts = useMemo(() => ({
    total: initialLeads.length,
    open: initialLeads.filter(lead => lead.status === 'offen').length,
    contacted: initialLeads.filter(lead => lead.status === 'kontaktiert').length,
    accepted: initialLeads.filter(lead => lead.status === 'angenommen').length,
    rejected: initialLeads.filter(lead => lead.status === 'abgelehnt').length,
  }), [initialLeads]);

  const industryRows = useMemo(() => buildIndustryRows(initialLeads, manualIndustries), [initialLeads, manualIndustries]);
  const regionRows = useMemo(() => buildRegionRows(initialLeads), [initialLeads]);
  const filteredIndustries = industryRows.filter(row => `${row.name} ${row.aliases.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  const bestIndustries = industryRows.filter(row => row.total > 0).slice(0, 5);
  const potentialIndustries = industryRows.filter(row => row.total === 0).slice(0, 8);
  const acceptanceRate = rate(statusCounts.accepted, statusCounts.accepted + statusCounts.rejected);
  const suggestedGroup = newIndustry.trim() ? canonicalIndustry(newIndustry) : '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">CRM Intelligence</p>
          <h1 className="text-2xl font-bold text-slate-900">Lead-Auswertung</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-500">
            Branchen werden automatisch zu sinnvollen Gruppen zusammengeführt, z. B. Facharzt, Arzt und Zahnarzt zu Medizin & Praxen.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric icon={Target} label="Leads gesamt" value={statusCounts.total} />
        <Metric icon={CheckCircle2} label="Angenommen" value={statusCounts.accepted} tone="green" />
        <Metric icon={XCircle} label="Abgelehnt" value={statusCounts.rejected} tone="red" />
        <Metric icon={TrendingUp} label="Annahmequote" value={`${acceptanceRate}%`} tone="indigo" />
        <Metric icon={Clock3} label="Offen/Kontaktiert" value={`${statusCounts.open}/${statusCounts.contacted}`} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">Status-Funnel</h2>
              <p className="text-xs text-slate-500">Wo stehen Leads gerade?</p>
            </div>
            <BarChart3 size={18} className="text-indigo-600" />
          </div>
          <div className="space-y-3">
            <Bar label="Offen" value={statusCounts.open} max={statusCounts.total} color="bg-amber-500" />
            <Bar label="Kontaktiert" value={statusCounts.contacted} max={statusCounts.total} color="bg-blue-500" />
            <Bar label="Angenommen" value={statusCounts.accepted} max={statusCounts.total} color="bg-emerald-500" />
            <Bar label="Abgelehnt" value={statusCounts.rejected} max={statusCounts.total} color="bg-red-500" />
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-900">Top-Branchen</h2>
          <div className="mt-4 space-y-3">
            {bestIndustries.map(row => <Bar key={row.name} label={row.name} value={row.total} max={Math.max(...bestIndustries.map(item => item.total), 1)} color="bg-indigo-600" suffix={`${row.accepted} Abschlüsse`} />)}
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Branchen-Ranking</h2>
              <p className="text-xs text-slate-500">Anfragen = Leads gesamt, Abschlüsse = Status angenommen.</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Branche oder Alias suchen..." className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
            </div>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[780px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-400">
                  <th className="px-4 py-3 font-semibold">Gruppe</th>
                  <th className="px-4 py-3 font-semibold">Anfragen</th>
                  <th className="px-4 py-3 font-semibold">Abschlüsse</th>
                  <th className="px-4 py-3 font-semibold">Abgelehnt</th>
                  <th className="px-4 py-3 font-semibold">Offen</th>
                  <th className="px-4 py-3 font-semibold">Quote</th>
                  <th className="px-4 py-3 font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>{filteredIndustries.map(row => <IndustryTableRow key={row.name} row={row} />)}</tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {filteredIndustries.map(row => <IndustryCard key={row.name} row={row} />)}
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <Plus size={16} className="text-indigo-600" />
              <h2 className="font-semibold text-slate-900">Branche ergänzen</h2>
            </div>
            <div className="flex gap-2">
              <input value={newIndustry} onChange={event => setNewIndustry(event.target.value)} onKeyDown={event => event.key === 'Enter' && addIndustry()} placeholder="z.B. Tierarztpraxen" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
              <button onClick={addIndustry} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">Hinzufügen</button>
            </div>
            {suggestedGroup && <p className="mt-2 text-xs text-slate-500">Wird einsortiert unter: <span className="font-medium text-slate-700">{suggestedGroup}</span></p>}
            {manualIndustries.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {manualIndustries.map(industry => (
                  <button key={industry} onClick={() => saveManualIndustries(manualIndustries.filter(item => item !== industry))} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 hover:bg-red-50 hover:text-red-600">
                    {industry} <span className="text-slate-400">→ {canonicalIndustry(industry)}</span>
                    <XCircle size={12} />
                  </button>
                ))}
              </div>
            )}
          </section>

          <InsightList title="Beste Gruppen" icon={BarChart3} rows={bestIndustries.map(row => `${row.name}: ${row.accepted}/${row.total} Abschlüsse, ${row.acceptanceRate}% Quote`)} empty="Noch keine belastbaren Branchen-Daten." />
          <InsightList title="Spannende Gruppen" icon={Lightbulb} rows={potentialIndustries.map(row => row.name)} empty="Alle Vorschläge haben bereits Leads." />
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-4">
          <h2 className="font-semibold text-slate-900">Regionen</h2>
          <p className="text-xs text-slate-500">Welche Orte liefern bereits Leads und wo ist die Annahmequote am besten?</p>
        </div>
        <div className="grid gap-3 p-4 md:hidden">
          {regionRows.map(row => <div key={row.location} className="rounded-lg border border-slate-100 p-3"><div className="font-medium text-slate-900">{row.location}</div><div className="mt-1 text-xs text-slate-500">{row.total} Leads · {row.accepted} angenommen · Top: {row.topIndustry}</div></div>)}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-400">
                <th className="px-4 py-3 font-semibold">Ort/Region</th>
                <th className="px-4 py-3 font-semibold">Leads</th>
                <th className="px-4 py-3 font-semibold">Angenommen</th>
                <th className="px-4 py-3 font-semibold">Abgelehnt</th>
                <th className="px-4 py-3 font-semibold">Annahmequote</th>
                <th className="px-4 py-3 font-semibold">Top-Gruppe</th>
              </tr>
            </thead>
            <tbody>
              {regionRows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">Noch keine regionalen Lead-Daten vorhanden.</td></tr>
              ) : regionRows.map(row => (
                <tr key={row.location} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.location}</td>
                  <td className="px-4 py-3">{row.total}</td>
                  <td className="px-4 py-3 text-emerald-700">{row.accepted}</td>
                  <td className="px-4 py-3 text-red-600">{row.rejected}</td>
                  <td className="px-4 py-3">{row.accepted + row.rejected > 0 ? `${row.acceptanceRate}%` : '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{row.topIndustry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function IndustryTableRow({ row }: { row: IndustryRow }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-3">
        <div className="font-medium text-slate-900">{row.name}</div>
        <div className="text-xs text-slate-400">{row.aliases.slice(0, 4).join(', ') || (row.source === 'crm' ? 'aus CRM-Daten' : row.source === 'manual' ? 'manuell ergänzt' : 'Vorschlag')}</div>
      </td>
      <td className="px-4 py-3 font-medium">{row.total}</td>
      <td className="px-4 py-3 text-emerald-700">{row.accepted}</td>
      <td className="px-4 py-3 text-red-600">{row.rejected}</td>
      <td className="px-4 py-3 text-slate-500">{row.open}</td>
      <td className="px-4 py-3">{row.total > 0 ? `${row.acceptanceRate}%` : '—'}</td>
      <td className="px-4 py-3"><Score score={row.score} /></td>
    </tr>
  );
}

function IndustryCard({ row }: { row: IndustryRow }) {
  return (
    <article className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{row.name}</h3>
          <p className="mt-1 text-xs text-slate-500">{row.aliases.slice(0, 3).join(', ') || 'Noch keine Unterbranchen'}</p>
        </div>
        <Score score={row.score} />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
        <Mini label="Anfragen" value={row.total} />
        <Mini label="Abschluss" value={row.accepted} tone="green" />
        <Mini label="Offen" value={row.open} />
        <Mini label="Quote" value={row.total > 0 ? `${row.acceptanceRate}%` : '—'} />
      </div>
    </article>
  );
}

function Metric({ icon: Icon, label, value, tone = 'slate' }: { icon: React.ElementType; label: string; value: string | number; tone?: 'slate' | 'green' | 'red' | 'indigo' }) {
  const toneClass = { slate: 'bg-slate-100 text-slate-600', green: 'bg-emerald-100 text-emerald-700', red: 'bg-red-100 text-red-700', indigo: 'bg-indigo-100 text-indigo-700' }[tone];
  return <div className="rounded-xl border border-slate-200 bg-white p-4"><div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${toneClass}`}><Icon size={17} /></div><div className="text-2xl font-bold text-slate-900">{value}</div><div className="text-xs text-slate-500">{label}</div></div>;
}

function InsightList({ title, icon: Icon, rows, empty }: { title: string; icon: React.ElementType; rows: string[]; empty: string }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4"><div className="mb-3 flex items-center gap-2"><Icon size={16} className="text-indigo-600" /><h2 className="font-semibold text-slate-900">{title}</h2></div>{rows.length === 0 ? <p className="text-sm text-slate-400">{empty}</p> : <ul className="space-y-2">{rows.map(row => <li key={row} className="text-sm leading-5 text-slate-600">{row}</li>)}</ul>}</section>;
}

function Score({ score }: { score: number }) {
  return <div className="flex items-center gap-2"><div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${Math.min(score, 100)}%` }} /></div><span className="text-xs font-medium text-slate-600">{score}</span></div>;
}

function Mini({ label, value, tone = 'slate' }: { label: string; value: string | number; tone?: 'slate' | 'green' }) {
  return <div className="rounded-lg bg-slate-50 p-2"><div className={tone === 'green' ? 'font-semibold text-emerald-700' : 'font-semibold text-slate-900'}>{value}</div><div className="text-[10px] text-slate-400">{label}</div></div>;
}

function Bar({ label, value, max, color, suffix }: { label: string; value: number; max: number; color: string; suffix?: string }) {
  const width = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0;
  return <div><div className="mb-1 flex justify-between gap-3 text-sm"><span className="text-slate-600">{label}</span><span className="font-medium text-slate-900">{suffix || value}</span></div><div className="h-2 rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} /></div></div>;
}
