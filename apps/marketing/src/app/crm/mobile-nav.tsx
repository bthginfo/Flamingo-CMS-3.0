'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Users, Target, Inbox, BarChart3, BriefcaseBusiness } from 'lucide-react';

const links = [
  { href: '/crm', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/crm/tenants', label: 'Tenants', icon: Users },
  { href: '/crm/leads', label: 'Leads', icon: Target },
  { href: '/crm/kunden', label: 'Kunden', icon: BriefcaseBusiness },
  { href: '/crm/auswertung', label: 'Auswertung', icon: BarChart3 },
  { href: '/crm/anfragen', label: 'Anfragen', icon: Inbox },
];

export function CrmMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="sm:hidden">
      <button onClick={() => setOpen(!open)} className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <div className="absolute top-14 left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50 p-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === href ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
