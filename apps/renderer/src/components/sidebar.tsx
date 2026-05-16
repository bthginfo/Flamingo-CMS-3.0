'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, FileText, FolderOpen, Newspaper, Navigation,
  Palette, Phone, Share2, Search, Code, Mail, Scale, Lock, LogOut, ImageIcon, Inbox, Eye, Heart,
  Menu, X, ClipboardList,
} from 'lucide-react';
import { logoutAction } from '@/app/admin/actions';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pages', label: 'Seiten', icon: FileText },
  { href: '/admin/collections', label: 'Collections', icon: FolderOpen },
  { href: '/admin/news', label: 'News & Blog', icon: Newspaper },
  { href: '/admin/media', label: 'Mediathek', icon: ImageIcon },
  { href: '/admin/inbox', label: 'Posteingang', icon: Inbox },
  { href: '/admin/rsvp', label: 'RSVP-Gäste', icon: Heart },
  { href: '/admin/navigation', label: 'Navigation & Footer', icon: Navigation },
  { href: '/admin/brand', label: 'Marke & Design', icon: Palette },
  { href: '/admin/contact', label: 'Kontakt & Zeiten', icon: Phone },
  { href: '/admin/social', label: 'Social Media', icon: Share2 },
  { href: '/admin/seo', label: 'SEO & Sichtbarkeit', icon: Search },
  { href: '/admin/scripts', label: 'Skripte & Tracking', icon: Code },
  { href: '/admin/mail', label: 'Mail-Server', icon: Mail },
  { href: '/admin/contact-form', label: 'Kontaktformular', icon: ClipboardList },
  { href: '/admin/legal', label: 'Impressum & Datenschutz', icon: Scale },
  { href: '/admin/security', label: 'Passwort & Zugang', icon: Lock },
];

const RENDERER_URL = '';

export function Sidebar({ tenantId }: { tenantId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const navContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-admin-accent text-white flex items-center justify-center text-sm font-bold">
            F
          </div>
          <div>
            <p className="text-sm font-semibold">Flamingo CMS</p>
            <p className="text-[11px] text-sidebar-muted truncate max-w-[160px]">{tenantId.slice(0, 8)}…</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="md:hidden text-sidebar-muted hover:text-white p-1">
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {NAV.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-sidebar-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-sidebar-active' : ''} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        <a
          href={RENDERER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-muted hover:text-white hover:bg-white/5 transition-colors w-full"
        >
          <Eye size={18} />
          Vorschau
        </a>
        <button
          onClick={async () => {
            await logoutAction();
            router.push('/admin/login');
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-muted hover:text-white hover:bg-white/5 transition-colors w-full"
        >
          <LogOut size={18} />
          Abmelden
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile burger button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-sidebar text-white p-2 rounded-lg shadow-lg"
        aria-label="Menü öffnen"
      >
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-sidebar text-sidebar-fg flex flex-col transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-sidebar text-sidebar-fg flex-col h-full border-r border-sidebar-border">
        {navContent}
      </aside>
    </>
  );
}
