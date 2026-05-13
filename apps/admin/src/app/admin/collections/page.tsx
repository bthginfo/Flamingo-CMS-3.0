import { getCollectionsAction, ensureDefaultCollections } from './actions';
import Link from 'next/link';
import { FolderOpen } from 'lucide-react';

export default async function CollectionsPage() {
  await ensureDefaultCollections();
  const cols = await getCollectionsAction();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Collections</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cols.map((col) => (
          <Link key={col.id} href={`/admin/collections/${col.key}`} className="admin-card hover:border-blue-300 transition-colors flex items-center gap-3">
            <FolderOpen size={24} className="text-blue-500 shrink-0" />
            <div>
              <p className="font-medium">{col.label}</p>
              <p className="text-xs text-gray-400">{col.key}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
