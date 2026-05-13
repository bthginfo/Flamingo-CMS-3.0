'use client';

import Link from 'next/link';
import { FileText, Trash2, Eye, EyeOff } from 'lucide-react';
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
    <div className="admin-card overflow-hidden p-0">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Titel</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Sichtbar</th>
            <th className="px-4 py-3 font-medium text-right">Aktionen</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {pages.map((page) => (
            <tr key={page.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <Link href={`/admin/pages/${page.id}`} className="text-blue-600 hover:underline font-medium">
                  {page.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-500">/{page.slug}</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${page.status === 'published' ? 'bg-green-100 text-green-800' : page.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                  {page.status === 'published' ? 'Veröffentlicht' : page.status === 'draft' ? 'Entwurf' : page.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {page.visible ? <Eye size={16} className="text-green-600" /> : <EyeOff size={16} className="text-gray-400" />}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  disabled={pending}
                  onClick={() => {
                    if (confirm(`Seite "${page.title}" wirklich löschen?`)) {
                      startTransition(() => deleteAction(page.id));
                    }
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
