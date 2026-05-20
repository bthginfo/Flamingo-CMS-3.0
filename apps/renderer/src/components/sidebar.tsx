'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, FileText, FolderOpen, Newspaper, Navigation,
  Palette, Phone, Share2, Search, Code, Mail, Scale, Lock, LogOut, ImageIcon, Inbox, Heart,
  Menu, X, ClipboardList, Bot, HelpCircle, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { logoutAction } from '@/app/admin/actions';
import { usePreview } from '@/components/admin/preview-context';
import { MonitorPlay } from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pages', label: 'Seiten', icon: FileText, tour: 'sidebar-pages' },
  { href: '/admin/collections', label: 'Collections', icon: FolderOpen },
  { href: '/admin/news', label: 'News & Blog', icon: Newspaper },
  { href: '/admin/media', label: 'Mediathek', icon: ImageIcon, tour: 'sidebar-media' },
  { href: '/admin/inbox', label: 'Posteingang', icon: Inbox },
  { href: '/admin/rsvp', label: 'RSVP-Gäste', icon: Heart, industry: 'wedding' },
  { href: '/admin/navigation', label: 'Navigation & Footer', icon: Navigation, tour: 'sidebar-nav' },
  { href: '/admin/brand', label: 'Marke & Design', icon: Palette, tour: 'sidebar-brand' },
  { href: '/admin/contact', label: 'Kontakt & Zeiten', icon: Phone },
  { href: '/admin/social', label: 'Social Media', icon: Share2 },
  { href: '/admin/seo', label: 'SEO & Sichtbarkeit', icon: Search },
  { href: '/admin/scripts', label: 'Skripte & Tracking', icon: Code },
  { href: '/admin/mail', label: 'Mail-Server', icon: Mail },
  { href: '/admin/contact-form', label: 'Kontaktformular', icon: ClipboardList },
  { href: '/admin/legal', label: 'Impressum & Datenschutz', icon: Scale },
  { href: '/admin/security', label: 'Passwort & Zugang', icon: Lock },
  { href: '/admin/ai-api', label: 'KI-API', icon: Bot },
  { href: '/admin/help', label: 'Hilfe & Anleitung', icon: HelpCircle },
];

const RENDERER_URL = '';

export function Sidebar({ tenantId, industry }: { tenantId: string; industry: string }) {
  const filteredNav = NAV.filter(item => !item.industry || item.industry === industry);
  const pathname = usePathname();
  const router = useRouter();
  const preview = usePreview();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('sidebar-collapsed') === '1';
  });

  function toggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar-collapsed', next ? '1' : '0');
  }

  // Auto-collapse sidebar when preview opens, restore when it closes
  const prevPreviewOpen = useRef(false);
  useEffect(() => {
    if (preview.isOpen && !prevPreviewOpen.current) {
      setCollapsed(true);
      localStorage.setItem('sidebar-collapsed', '1');
    }
    prevPreviewOpen.current = preview.isOpen;
  }, [preview.isOpen]);

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
        {/* Logo */}
        <div className="px-5 py-5 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-admin-accent text-white flex items-center justify-center text-sm font-bold">F</div>
            <div>
              <p className="text-sm font-semibold">Flamingo CMS</p>
              <p className="text-[11px] text-sidebar-muted truncate max-w-[160px]">{tenantId.slice(0, 8)}…</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-sidebar-muted hover:text-white p-1">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto scrollbar-hidden py-3 px-3 space-y-0.5">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} data-tour={item.tour}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-white/10 text-white font-medium' : 'text-sidebar-muted hover:text-white hover:bg-white/5'}`}>
                <item.icon size={18} className={isActive ? 'text-sidebar-active' : ''} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
          <button onClick={() => { preview.isOpen ? preview.close() : preview.open(); setOpen(false); }} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-muted hover:text-white hover:bg-white/5 transition-colors w-full">
            <MonitorPlay size={18} /> Vorschau
          </button>
          <button onClick={async () => { await logoutAction(); router.push('/admin/login'); }} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-muted hover:text-white hover:bg-white/5 transition-colors w-full">
            <LogOut size={18} /> Abmelden
          </button>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden md:flex shrink-0 bg-sidebar text-sidebar-fg flex-col h-full border-r border-sidebar-border transition-all duration-200 relative ${collapsed ? 'w-16' : 'w-64'}`}>
        {/* Logo */}
        <div className={`py-5 border-b border-sidebar-border flex items-center ${collapsed ? 'px-3 justify-center' : 'px-5'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-admin-accent text-white flex items-center justify-center text-sm font-bold shrink-0">F</div>
            {!collapsed && (
              <div>
                <p className="text-sm font-semibold">Flamingo CMS</p>
                <p className="text-[11px] text-sidebar-muted truncate max-w-[160px]">{tenantId.slice(0, 8)}…</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto scrollbar-hidden py-3 space-y-0.5 ${collapsed ? 'px-2' : 'px-3'}`}>
          {filteredNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} data-tour={item.tour}
                className={`flex items-center gap-3 rounded-lg text-sm transition-colors ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'} ${isActive ? 'bg-white/10 text-white font-medium' : 'text-sidebar-muted hover:text-white hover:bg-white/5'}`}>
                <item.icon size={18} className={`shrink-0 ${isActive ? 'text-sidebar-active' : ''}`} />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`py-4 border-t border-sidebar-border space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>
          <button onClick={() => { preview.isOpen ? preview.close() : preview.open(); }} title={collapsed ? 'Vorschau' : undefined}
            className={`flex items-center gap-3 rounded-lg text-sm text-sidebar-muted hover:text-white hover:bg-white/5 transition-colors w-full ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'}`}>
            <MonitorPlay size={18} />
            {!collapsed && 'Vorschau'}
          </button>
          <button onClick={async () => { await logoutAction(); router.push('/admin/login'); }} title={collapsed ? 'Abmelden' : undefined}
            className={`flex items-center gap-3 rounded-lg text-sm text-sidebar-muted hover:text-white hover:bg-white/5 transition-colors w-full ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'}`}>
            <LogOut size={18} />
            {!collapsed && 'Abmelden'}
          </button>
        </div>

        {/* Collapse handle */}
        <button
          onClick={toggleCollapse}
          title={collapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
          className="absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center text-sidebar-muted hover:text-white hover:bg-white/10 transition-colors shadow-sm"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>
    </>
  );
}
