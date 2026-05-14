'use client';

import Link from 'next/link';
import { FileText, Trash2, Eye, EyeOff, Pencil, ChevronRight } from 'lucide-react';
import { useTransition } from 'react';

type Page = {
  id: string;
  title: string;
  slug: string;
  status: string;
  visible: boolean;
  type: string;
  updatedAt: Date;
};

export function PagesList({ pages, deleteAction }: { pages: Page[]; deleteAction: (id: string) => Promise<void> }) {
  const [pending, startTransition] = useTransition();

  if (pages.length === 0) {
    return (
      <div className="admin-card text-center py-12">
        <FileText className="mx-auto mb-3 text-gray-400" size={48} />
        <p className="text-gray-500">Noch keine Seiten erstellt.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pages.map((page) => (
        <div key={page.id} className="admin-card p-0 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="flex items-center">
            <Link href={`/admin/pages/${page.id}`} className="flex-1 flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                <FileText size={18} className="text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{page.title}</p>
                <p className="text-xs text-zinc-400 mt-0.5">/{page.slug || '(Startseite)'}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium ${page.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {page.status === 'published' ? 'Live' : 'Entwurf'}
                </span>
                {page.visible ? <Eye size={14} className="text-emerald-500" /> : <EyeOff size={14} className="text-zinc-300" />}
                <div className="flex items-center gap-1 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil size={14} />
                  <span className="text-xs font-medium">Bearbeiten</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>
            <div className="px-3 border-l">
              <button
                disabled={pending}
                onClick={() => {
                  if (confirm(`Seite "${page.title}" wirklich löschen?`)) {
                    startTransition(() => deleteAction(page.id));
                  }
                }}
                className="text-zinc-300 hover:text-red-500 p-2 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
