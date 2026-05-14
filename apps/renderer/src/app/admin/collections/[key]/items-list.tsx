'use client';

import Link from 'next/link';
import { Trash2, ExternalLink } from 'lucide-react';
import { useTransition } from 'react';

type Item = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  priority: number;
  updatedAt: Date;
};

export function CollectionItemsList({ items, collectionKey, deleteAction }: { items: Item[]; collectionKey: string; deleteAction: (id: string) => Promise<void> }) {
  const [pending, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <div className="admin-card text-center py-12">
        <p className="text-gray-500">Noch keine Einträge in dieser Collection.</p>
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
            <th className="px-4 py-3 font-medium">Priorität</th>
            <th className="px-4 py-3 font-medium text-right">Aktionen</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <Link href={`/admin/collections/${collectionKey}/${item.id}`} className="text-blue-600 hover:underline font-medium">
                  {item.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-500">{item.slug}</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${item.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {item.published ? 'Veröffentlicht' : 'Entwurf'}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">{item.priority}</td>
              <td className="px-4 py-3 text-right">
                <button
                  disabled={pending}
                  onClick={() => {
                    if (confirm(`"${item.title}" wirklich löschen?`)) {
                      startTransition(() => deleteAction(item.id));
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
