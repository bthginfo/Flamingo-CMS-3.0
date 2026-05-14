'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, FolderOpen, Newspaper, Navigation,
  Palette, Phone, Share2, Search, Code, Mail, Scale, Lock, LogOut, Rocket, ImageIcon, Inbox, Eye,
} from 'lucide-react';
import { logoutAction } from '@/app/admin/actions';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pages', label: 'Seiten', icon: FileText },
  { href: '/admin/collections', label: 'Collections', icon: FolderOpen },
  { href: '/admin/news', label: 'News & Blog', icon: Newspaper },
  { href: '/admin/media', label: 'Mediathek', icon: ImageIcon },
  { href: '/admin/inbox', label: 'Posteingang', icon: Inbox },
  { href: '/admin/publish', label: 'Veröffentlichen', icon: Rocket },
  { href: '/admin/navigation', label: 'Navigation & Footer', icon: Navigation },
  { href: '/admin/brand', label: 'Marke & Design', icon: Palette },
  { href: '/admin/contact', label: 'Kontakt & Zeiten', icon: Phone },
  { href: '/admin/social', label: 'Social Media', icon: Share2 },
  { href: '/admin/seo', label: 'SEO & Sichtbarkeit', icon: Search },
  { href: '/admin/scripts', label: 'Skripte & Tracking', icon: Code },
  { href: '/admin/mail', label: 'Mail-Server', icon: Mail },
  { href: '/admin/legal', label: 'Impressum & Datenschutz', icon: Scale },
  { href: '/admin/security', label: 'Passwort & Zugang', icon: Lock },
];

const RENDERER_URL = process.env.NEXT_PUBLIC_RENDERER_URL || 'http://localhost:3002';

export function Sidebar({ tenantId }: { tenantId: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 shrink-0 bg-sidebar text-sidebar-fg flex flex-col h-full border-r border-sidebar-border">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-admin-accent text-white flex items-center justify-center text-sm font-bold">
            F
          </div>
          <div>
            <p className="text-sm font-semibold">Flamingo CMS</p>
            <p className="text-[11px] text-sidebar-muted truncate max-w-[160px]">{tenantId.slice(0, 8)}…</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {NAV.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
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
    </aside>
  );
}
