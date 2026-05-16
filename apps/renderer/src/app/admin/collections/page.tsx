import { getCollectionsAction, ensureDefaultCollections } from './actions';
import { CollectionsManager } from './collections-manager';

export default async function CollectionsPage() {
  await ensureDefaultCollections();
  const cols = await getCollectionsAction();

  return <CollectionsManager collections={cols.map(c => ({ id: c.id, key: c.key, label: c.label }))} />;
}
