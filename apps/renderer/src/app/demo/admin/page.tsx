'use client';

import Link from 'next/link';
import { FileText, Layers, FolderOpen, Rocket, Eye } from 'lucide-react';

const STATS = [
  { label: 'Seiten', value: 5, icon: FileText, href: '/demo/admin/pages' },
  { label: 'Sections', value: 32, icon: Layers, href: '/demo/admin/pages' },
  { label: 'Collection Items', value: 12, icon: FolderOpen, href: '/demo/admin/collections' },
  { label: 'Live Snapshot', value: 'Aktiv', icon: Rocket, href: '#' },
];

export default function DemoAdminDashboard() {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Müller & Söhne Meisterbetrieb · tradesman · Stil: classic</p>
        </div>
        <div className="flex gap-2">
          <a href="/demo/handwerk" target="_blank" rel="noopener noreferrer" className="admin-btn-secondary"><Eye size={16} /> Preview</a>
          <button className="admin-btn-primary opacity-60 cursor-not-allowed" disabled><Rocket size={16} /> Veröffentlichen</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => (
          <Link key={s.label} href={s.href} className="admin-card p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-3">
              <s.icon size={20} className="text-zinc-400 group-hover:text-admin-accent transition-colors" />
            </div>
            <p className="text-2xl font-semibold text-zinc-900">{s.value}</p>
            <p className="text-sm text-zinc-500 mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card p-6">
          <h2 className="font-semibold text-zinc-900 mb-4">Schnellzugriff</h2>
          <div className="space-y-2">
            {[
              { label: 'Startseite bearbeiten', href: '/demo/admin/pages', icon: '🏠' },
              { label: 'Leistung hinzufügen', href: '/demo/admin/collections', icon: '⚡' },
              { label: 'Referenz hinzufügen', href: '/demo/admin/collections', icon: '📸' },
              { label: 'SEO prüfen', href: '/demo/admin/seo', icon: '🔍' },
            ].map((q) => (
              <Link key={q.label} href={q.href} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-50 transition-colors text-sm">
                <span>{q.icon}</span><span>{q.label}</span><span className="ml-auto text-zinc-300">→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-card p-6">
          <h2 className="font-semibold text-zinc-900 mb-4">Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600">Website</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Online</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600">Draft Status</span>
              <span className="text-emerald-600 font-medium">Aktuell</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600">Letzter Publish</span>
              <span className="text-zinc-500">Heute, 14:32</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
