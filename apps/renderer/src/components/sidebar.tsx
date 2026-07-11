'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, FileText, FolderOpen, Newspaper, Navigation,
  Palette, Phone, Share2, Search, Code, Mail, Scale, Lock, LogOut, ImageIcon, Inbox, Zap,
  Menu, X, ClipboardList, Bot, HelpCircle, ChevronLeft, ChevronRight, ShoppingBag,
} from 'lucide-react';
import { logoutAction } from '@/app/admin/actions';
import { usePreview } from '@/components/admin/preview-context';
import { PreviewNudge } from '@/components/admin/preview-nudge';
import { MonitorPlay } from 'lucide-react';

const NAV_GROUPS = ['Übersicht', 'Inhalte', 'Anfragen & Verkauf', 'Website', 'System'] as const;
type NavGroup = typeof NAV_GROUPS[number];

const NAV: { href: string; label: string; icon: typeof LayoutDashboard; group: NavGroup; tour?: string; industry?: string }[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, group: 'Übersicht' },
  { href: '/admin/pages', label: 'Seiten', icon: FileText, group: 'Inhalte', tour: 'sidebar-pages' },
  { href: '/admin/collections', label: 'Inhalte & Daten', icon: FolderOpen, group: 'Inhalte' },
  { href: '/admin/news', label: 'News & Blog', icon: Newspaper, group: 'Inhalte' },
  { href: '/admin/media', label: 'Mediathek', icon: ImageIcon, group: 'Inhalte', tour: 'sidebar-media' },
  { href: '/admin/inbox', label: 'Posteingang', icon: Inbox, group: 'Anfragen & Verkauf' },
  { href: '/admin/contact-form', label: 'Kontaktformular', icon: ClipboardList, group: 'Anfragen & Verkauf' },
  { href: '/admin/shop', label: 'Shop', icon: ShoppingBag, group: 'Anfragen & Verkauf' },
  { href: '/admin/functions', label: 'Funktionen', icon: Zap, group: 'Anfragen & Verkauf' },
  { href: '/admin/navigation', label: 'Navigation & Footer', icon: Navigation, group: 'Website', tour: 'sidebar-nav' },
  { href: '/admin/brand', label: 'Marke & Design', icon: Palette, group: 'Website', tour: 'sidebar-brand' },
  { href: '/admin/contact', label: 'Kontakt & Zeiten', icon: Phone, group: 'Website' },
  { href: '/admin/social', label: 'Social Media', icon: Share2, group: 'Website' },
  { href: '/admin/seo', label: 'SEO & Sichtbarkeit', icon: Search, group: 'Website' },
  { href: '/admin/legal', label: 'Rechtliches', icon: Scale, group: 'Website' },
  { href: '/admin/scripts', label: 'Skripte & Tracking', icon: Code, group: 'System' },
  { href: '/admin/mail', label: 'Mail-Server', icon: Mail, group: 'System' },
  { href: '/admin/security', label: 'Passwort & Zugang', icon: Lock, group: 'System' },
  { href: '/admin/ai-api', label: 'KI-API', icon: Bot, group: 'System' },
  { href: '/admin/help', label: 'Hilfe & Anleitung', icon: HelpCircle, group: 'System' },
];

export function Sidebar({ tenantId, industry, inboxUnread = 0 }: { tenantId: string; industry: string; inboxUnread?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const preview = usePreview();
  const [open, setOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('sidebar-collapsed') === '1';
  });
  const filteredNav = NAV.filter(item => {
    if (isDemo && item.href === '/admin/ai-api') return false;
    return !item.industry || item.industry === industry;
  });
  const groupedNav = NAV_GROUPS.map(group => ({ group, items: filteredNav.filter(item => item.group === group) }))
    .filter(({ items }) => items.length > 0);

  useEffect(() => {
    setIsDemo(document.cookie.split(';').some((cookie) => cookie.trim() === `flamingo_public_demo=${tenantId}`));
  }, [tenantId]);

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
          {groupedNav.map(({ group, items }, groupIndex) => <div key={group} className={groupIndex ? 'mt-4' : ''}>
            <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-sidebar-muted/70">{group}</p>
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} data-tour={item.tour}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-white/10 text-white font-medium' : 'text-sidebar-muted hover:text-white hover:bg-white/5'}`}>
                <item.icon size={18} className={isActive ? 'text-sidebar-active' : ''} />
                <span className="flex-1 flex items-center justify-between gap-2">
                  {item.label}
                  {item.href === '/admin/inbox' && inboxUnread > 0 && <span className="min-w-[20px] rounded-full bg-admin-accent px-1.5 py-0.5 text-center text-[11px] font-bold leading-none text-white">{inboxUnread > 99 ? '99+' : inboxUnread}</span>}
                </span>
              </Link>
            );
          })}
          </div>)}
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
          {groupedNav.map(({ group, items }, groupIndex) => <div key={group} className={groupIndex ? (collapsed ? 'mt-2 border-t border-sidebar-border pt-2' : 'mt-4') : ''}>
            {!collapsed && <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-sidebar-muted/70">{group}</p>}
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} data-tour={item.tour}
                className={`flex items-center gap-3 rounded-lg text-sm transition-colors ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'} ${isActive ? 'bg-white/10 text-white font-medium' : 'text-sidebar-muted hover:text-white hover:bg-white/5'}`}>
                <span className="relative shrink-0">
                  <item.icon size={18} className={`shrink-0 ${isActive ? 'text-sidebar-active' : ''}`} />
                  {collapsed && item.href === '/admin/inbox' && inboxUnread > 0 && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-admin-accent ring-2 ring-sidebar" />}
                </span>
                {!collapsed && (
                <span className="flex-1 flex items-center justify-between gap-2">
                  {item.label}
                  {item.href === '/admin/inbox' && inboxUnread > 0 && <span className="min-w-[20px] rounded-full bg-admin-accent px-1.5 py-0.5 text-center text-[11px] font-bold leading-none text-white">{inboxUnread > 99 ? '99+' : inboxUnread}</span>}
                </span>
                )}
              </Link>
            );
          })}
          </div>)}
        </nav>

        {/* Footer */}
        <div className={`py-4 border-t border-sidebar-border space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>
          <div className="relative">
            <button onClick={() => { preview.isOpen ? preview.close() : preview.open(); }} title={collapsed ? 'Vorschau — Texte direkt in der Vorschau bearbeiten' : undefined}
              className={`flex items-center gap-3 rounded-lg text-sm text-sidebar-muted hover:text-white hover:bg-white/5 transition-colors w-full ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'}`}>
              <MonitorPlay size={18} />
              {!collapsed && 'Vorschau'}
            </button>
            {!collapsed && <PreviewNudge variant="right" compact priority={1} />}
          </div>
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
