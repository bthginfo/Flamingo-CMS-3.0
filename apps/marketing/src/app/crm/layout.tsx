import Link from 'next/link';
import { Toaster } from 'sonner';
import { CrmMobileNav } from './mobile-nav';

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/80">
      <Toaster position="top-right" richColors />
      {/* Top nav */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-14">
          <Link href="/crm" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-indigo-200 group-hover:shadow-md transition-shadow">F</div>
            <span className="font-semibold text-slate-900 hidden sm:inline">Flamingo <span className="text-slate-400 font-normal">CRM</span></span>
          </Link>
          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1 text-sm">
            <Link href="/crm" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all font-medium">Dashboard</Link>
            <Link href="/crm/tenants" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all font-medium">Tenants</Link>
            <Link href="/crm/leads" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all font-medium">Leads</Link>
            <Link href="/crm/kunden" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all font-medium">Kunden</Link>
            <Link href="/crm/auswertung" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all font-medium">Auswertung</Link>
            <Link href="/crm/blog" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all font-medium">Blog</Link>
            <Link href="/crm/anfragen" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all font-medium">Anfragen</Link>
          </nav>
          {/* Mobile nav */}
          <CrmMobileNav />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
}
