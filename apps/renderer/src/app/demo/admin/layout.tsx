'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, FolderOpen, Newspaper, Navigation,
  Palette, Phone, Share2, Search, Code, Mail, Scale, Lock, ImageIcon, Inbox, Eye, X,
} from 'lucide-react';
import { Toaster } from 'sonner';
import { useState } from 'react';

const NAV = [
  { href: '/demo/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/demo/admin/pages', label: 'Seiten', icon: FileText },
  { href: '/demo/admin/collections', label: 'Collections', icon: FolderOpen },
  { href: '/demo/admin/news', label: 'News & Blog', icon: Newspaper },
  { href: '/demo/admin/media', label: 'Mediathek', icon: ImageIcon },
  { href: '/demo/admin/inbox', label: 'Posteingang', icon: Inbox },
  { href: '/demo/admin/navigation', label: 'Navigation & Footer', icon: Navigation },
  { href: '/demo/admin/brand', label: 'Marke & Design', icon: Palette },
  { href: '/demo/admin/contact', label: 'Kontakt & Zeiten', icon: Phone },
  { href: '/demo/admin/social', label: 'Social Media', icon: Share2 },
  { href: '/demo/admin/seo', label: 'SEO & Sichtbarkeit', icon: Search },
  { href: '/demo/admin/scripts', label: 'Skripte & Tracking', icon: Code },
  { href: '/demo/admin/mail', label: 'Mail-Server', icon: Mail },
  { href: '/demo/admin/legal', label: 'Impressum & Datenschutz', icon: Scale },
  { href: '/demo/admin/security', label: 'Passwort & Zugang', icon: Lock },
];

function DemoBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-sm">
      <p className="text-amber-800">
        <strong>Demo-Modus</strong> — Du siehst eine Vorschau des Flamingo CMS Admin-Panels. Änderungen werden nicht gespeichert.
      </p>
      <div className="flex items-center gap-3">
        <a href="https://flamingo-cms.de" className="text-amber-700 font-semibold hover:underline">Jetzt starten →</a>
        <button onClick={() => setVisible(false)} className="text-amber-400 hover:text-amber-600"><X size={16} /></button>
      </div>
    </div>
  );
}

function MockSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 bg-sidebar text-sidebar-fg flex flex-col h-full border-r border-sidebar-border">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-admin-accent text-white flex items-center justify-center text-sm font-bold">F</div>
          <div>
            <p className="text-sm font-semibold">Flamingo CMS</p>
            <p className="text-[11px] text-sidebar-muted">Demo · Handwerk</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {NAV.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/demo/admin' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-white/10 text-white font-medium' : 'text-sidebar-muted hover:text-white hover:bg-white/5'}`}>
              <item.icon size={18} className={isActive ? 'text-sidebar-active' : ''} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-sidebar-border">
        <a href="/demo/handwerk" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-muted hover:text-white hover:bg-white/5 transition-colors w-full">
          <Eye size={18} /> Vorschau
        </a>
      </div>
    </aside>
  );
}

export default function DemoAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-admin-bg text-zinc-900 antialiased" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <MockSidebar />
      <main className="flex-1 overflow-y-auto bg-admin-bg">
        <DemoBanner />
        <div className="mx-auto max-w-7xl px-6 py-8">
          {children}
        </div>
      </main>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
