import { getCollectionsAction, ensureDefaultCollections } from './actions';
import Link from 'next/link';
import { FolderOpen, ChevronRight, Database } from 'lucide-react';

export default async function CollectionsPage() {
  await ensureDefaultCollections();
  const cols = await getCollectionsAction();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Collections</h1>
          <p className="text-sm text-zinc-500 mt-1">Verwalten Sie Ihre strukturierten Inhalte</p>
        </div>
      </div>
      {cols.length === 0 ? (
        <div className="admin-card text-center py-16">
          <Database className="mx-auto mb-4 text-zinc-300" size={48} />
          <p className="text-zinc-500">Noch keine Collections vorhanden.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cols.map((col) => (
            <Link
              key={col.id}
              href={`/admin/collections/${col.key}`}
              className="admin-card p-5 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                  <FolderOpen size={20} className="text-blue-500" />
                </div>
                <ChevronRight size={16} className="text-zinc-300 group-hover:text-blue-500 transition-colors mt-1" />
              </div>
              <p className="font-semibold text-zinc-900">{col.label}</p>
              <p className="text-xs text-zinc-400 mt-1">{col.key}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
