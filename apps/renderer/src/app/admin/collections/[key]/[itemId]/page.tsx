import { getItemAction } from '../../actions';
import { notFound } from 'next/navigation';
import { ItemEditor } from './item-editor';

export default async function CollectionItemEditPage({ params }: { params: Promise<{ key: string; itemId: string }> }) {
  const { key, itemId } = await params;
  const item = await getItemAction(itemId);
  if (!item) notFound();
  return <ItemEditor item={item} collectionKey={key} />;
}
