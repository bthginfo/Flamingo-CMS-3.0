import { getCollectionByKeyAction, getItemsAction, createItemAction, deleteItemAction } from '../actions';
import { notFound } from 'next/navigation';
import { CollectionItemsList } from './items-list';

export default async function CollectionDetailPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const collection = await getCollectionByKeyAction(key);
  if (!collection) notFound();
  const items = await getItemsAction(collection.id);

  async function createAction(formData: FormData) {
    'use server';
    await createItemAction(collection.id, formData);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{collection.label}</h1>
        <form action={createAction}>
          <input name="title" placeholder="Neuer Eintrag…" required className="admin-input mr-2 w-56" />
          <button type="submit" className="admin-btn-primary">+ Erstellen</button>
        </form>
      </div>
      <CollectionItemsList items={items} collectionKey={key} deleteAction={deleteItemAction} />
    </div>
  );
}
