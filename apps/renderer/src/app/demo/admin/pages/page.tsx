'use client';

import Link from 'next/link';
import { FileText, Eye, EyeOff, Pencil, ChevronRight, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const PAGES = [
  { id: 'startseite', title: 'Startseite', slug: 'startseite', status: 'published', visible: true },
  { id: 'leistungen', title: 'Leistungen', slug: 'leistungen', status: 'published', visible: true },
  { id: 'ueber-uns', title: 'Über uns', slug: 'ueber-uns', status: 'published', visible: true },
  { id: 'projekte', title: 'Projekte', slug: 'projekte', status: 'published', visible: true },
  { id: 'kontakt', title: 'Kontakt', slug: 'kontakt', status: 'published', visible: true },
];

export default function DemoPagesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Seiten</h1>
        <form onSubmit={(e) => { e.preventDefault(); toast.info('Demo-Modus — Seiten können nicht erstellt werden'); }}>
          <input name="title" placeholder="Neue Seite…" className="admin-input mr-2 w-56" />
          <button type="submit" className="admin-btn-primary">+ Erstellen</button>
        </form>
      </div>
      <div className="space-y-3">
        {PAGES.map((page) => (
          <div key={page.id} className="admin-card p-0 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="flex items-center">
              <Link href={`/demo/admin/pages/${page.id}`} className="flex-1 flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  <FileText size={18} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{page.title}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">/{page.slug}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium ${page.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {page.status === 'published' ? 'Live' : 'Entwurf'}
                  </span>
                  {page.visible ? <Eye size={14} className="text-emerald-500" /> : <EyeOff size={14} className="text-zinc-300" />}
                  <div className="flex items-center gap-1 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil size={14} />
                    <span className="text-xs font-medium">Bearbeiten</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
              <div className="px-3 border-l">
                <button
                  onClick={() => toast.info('Demo-Modus — Seiten können nicht gelöscht werden')}
                  className="text-zinc-300 hover:text-red-500 p-2 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
