'use client';

import Link from 'next/link';
import { FileText, GripVertical, Eye, MoreHorizontal } from 'lucide-react';

const PAGES = [
  { id: '1', title: 'Startseite', slug: '/', sections: 12, updatedAt: 'Heute, 14:32' },
  { id: '2', title: 'Leistungen', slug: '/leistungen', sections: 6, updatedAt: 'Gestern, 09:15' },
  { id: '3', title: 'Über uns', slug: '/ueber-uns', sections: 5, updatedAt: '12.05.2026' },
  { id: '4', title: 'Projekte', slug: '/projekte', sections: 3, updatedAt: '10.05.2026' },
  { id: '5', title: 'Kontakt', slug: '/kontakt', sections: 2, updatedAt: '08.05.2026' },
];

export default function DemoPagesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Seiten</h1>
        <div className="flex gap-2">
          <input placeholder="Neue Seite…" className="admin-input w-56" readOnly />
          <button className="admin-btn-primary opacity-60 cursor-not-allowed">+ Erstellen</button>
        </div>
      </div>
      <div className="admin-card divide-y divide-zinc-100">
        {PAGES.map((page) => (
          <Link key={page.id} href={`/demo/admin/pages/${page.id}`}
            className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 transition-colors group">
            <GripVertical size={16} className="text-zinc-300" />
            <FileText size={18} className="text-zinc-400 group-hover:text-admin-accent transition-colors" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-zinc-900">{page.title}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{page.slug} · {page.sections} Sections</p>
            </div>
            <span className="text-xs text-zinc-400">{page.updatedAt}</span>
            <Eye size={16} className="text-zinc-300" />
            <MoreHorizontal size={16} className="text-zinc-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
