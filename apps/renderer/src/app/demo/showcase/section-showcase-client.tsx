'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';

export type ShowcaseSection = {
  type: string;
  label: string;
  description: string;
  category: string;
  industry: string;
  industryLabel: string;
};

function previewUrl(section: ShowcaseSection) {
  const params = new URLSearchParams({
    type: section.type,
    industry: section.industry,
    style: 'classic',
  });
  return `/section-preview?${params.toString()}`;
}

export function SectionShowcaseClient({ sections, categories }: { sections: ShowcaseSection[]; categories: string[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Alle');
  const [selectedType, setSelectedType] = useState(sections[0]?.type || '');

  const selected = sections.find(section => section.type === selectedType) || sections[0];

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return sections.filter(section => {
      const matchesCategory = category === 'Alle' || section.category === category;
      const matchesQuery = !needle || [section.type, section.label, section.description, section.industryLabel]
        .join(' ')
        .toLowerCase()
        .includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [category, query, sections]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase text-zinc-400">Flamingo CMS</p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">Section Showcase</h1>
            <p className="mt-4 text-base leading-7 text-zinc-300 md:text-lg">
              Alle im Admin auswählbaren Sections an einem Ort. Die Vorschau nutzt dieselbe isolierte Preview-Route wie der CMS-Editor.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_260px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Section suchen..."
                className="h-12 w-full rounded-lg border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/25 focus:bg-white/8"
              />
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-12 rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-white/25"
            >
              <option className="bg-zinc-950" value="Alle">Alle Kategorien</option>
              {categories.map(item => (
                <option className="bg-zinc-950" key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-zinc-400">{filtered.length} von {sections.length} Sections sichtbar</div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 md:px-8 lg:grid-cols-[360px_1fr]">
        <aside className="max-h-[78vh] overflow-y-auto pr-1">
          <div className="grid gap-2">
            {filtered.map(section => {
              const active = section.type === selected.type;
              return (
                <button
                  key={section.type}
                  type="button"
                  onClick={() => setSelectedType(section.type)}
                  className={`rounded-lg border p-4 text-left transition ${active ? 'border-white/35 bg-white text-zinc-950' : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold">{section.label}</div>
                      <div className={`mt-1 text-xs ${active ? 'text-zinc-500' : 'text-zinc-500'}`}>{section.type}</div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${active ? 'bg-zinc-100 text-zinc-600' : 'bg-white/8 text-zinc-400'}`}>
                      {section.category}
                    </span>
                  </div>
                  <p className={`mt-3 line-clamp-2 text-sm leading-5 ${active ? 'text-zinc-600' : 'text-zinc-400'}`}>{section.description}</p>
                  <div className={`mt-3 text-xs ${active ? 'text-zinc-500' : 'text-zinc-500'}`}>Preview-Kontext: {section.industryLabel}</div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-h-[78vh] overflow-hidden rounded-xl border border-white/10 bg-white">
          {selected ? (
            <div className="flex h-full flex-col">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-950">
                <div>
                  <div className="text-sm font-bold">{selected.label}</div>
                  <div className="text-xs text-zinc-500">{selected.type} · {selected.category} · {selected.industryLabel}</div>
                </div>
                <a
                  href={previewUrl(selected)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-zinc-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-zinc-800"
                >
                  Vollansicht
                  <ExternalLink size={14} />
                </a>
              </div>
              <iframe
                key={`${selected.type}-${selected.industry}`}
                title={`${selected.label} Vorschau`}
                src={previewUrl(selected)}
                className="h-[72vh] w-full bg-white"
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-10 text-center text-zinc-500">Keine Section ausgewählt.</div>
          )}
        </div>
      </section>
    </main>
  );
}
