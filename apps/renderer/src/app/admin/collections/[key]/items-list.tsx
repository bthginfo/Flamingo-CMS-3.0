'use client';

import Link from 'next/link';
import { Copy, Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

type Item = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  priority: number;
  updatedAt: Date;
};

export function CollectionItemsList({
  items,
  collectionKey,
  deleteAction,
  duplicateAction,
}: {
  items: Item[];
  collectionKey: string;
  deleteAction: (id: string) => Promise<void>;
  duplicateAction?: (id: string) => Promise<{ success?: boolean; id?: string; error?: string }>;
}) {
  const [pending, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <div className="admin-card text-center py-16 px-6">
        <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
          <span className="text-emerald-500 text-2xl">✨</span>
        </div>
        <h3 className="text-base font-semibold text-zinc-900 mb-1">Noch keine Einträge</h3>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-5">
          Füge oben einen Titel ein und klicke „Erstellen“. Anschließend kannst du Felder, Bilder und Inhalte pflegen.
        </p>
        <button type="button" onClick={() => document.querySelector<HTMLInputElement>('input[name="title"]')?.focus()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors">
          + Ersten Eintrag anlegen
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="admin-card overflow-hidden p-0 hidden md:block">
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
                  {duplicateAction && (
                    <button
                      type="button"
                      disabled={pending}
                      title="Eintrag duplizieren"
                      onClick={() => {
                        startTransition(async () => {
                          const result = await duplicateAction(item.id);
                          if (result?.id) {
                            window.location.href = `/admin/collections/${collectionKey}/${result.id}`;
                          } else if (result?.error) {
                            toast.error(result.error);
                          }
                        });
                      }}
                      className="text-gray-400 hover:text-blue-600 p-1 mr-2"
                    >
                      <Copy size={16} />
                    </button>
                  )}
                  <button
                    type="button"
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

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {items.map((item) => (
          <div key={item.id} className="admin-card p-4">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/admin/collections/${collectionKey}/${item.id}`} className="flex-1 min-w-0">
                <p className="font-medium text-blue-600 truncate">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">/{item.slug}</p>
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {item.published ? 'Live' : 'Entwurf'}
                </span>
                {duplicateAction && (
                  <button
                    type="button"
                    disabled={pending}
                    title="Eintrag duplizieren"
                    onClick={() => {
                      startTransition(async () => {
                        const result = await duplicateAction(item.id);
                        if (result?.id) {
                          window.location.href = `/admin/collections/${collectionKey}/${result.id}`;
                        } else if (result?.error) {
                          toast.error(result.error);
                        }
                      });
                    }}
                    className="text-gray-400 hover:text-blue-600 p-1"
                  >
                    <Copy size={16} />
                  </button>
                )}
                <button
                  type="button"
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
