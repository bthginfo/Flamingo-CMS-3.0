import Link from 'next/link';
import { Toaster } from 'sonner';

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />
      {/* Top nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <Link href="/crm" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">F</div>
            <span className="font-semibold text-slate-900">Flamingo CRM</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/crm" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Dashboard</Link>
            <Link href="/crm/tenants" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Tenants</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
