import { getCollectionByKeyAction, getItemsAction, createItemAction, deleteItemAction, getOrCreateOverviewPageAction } from '../actions';
import { notFound, redirect } from 'next/navigation';
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

  async function openOverviewPage() {
    'use server';
    const pageId = await getOrCreateOverviewPageAction(key);
    redirect(`/admin/pages/${pageId}`);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">{collection.label}</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <form action={openOverviewPage}>
            <button type="submit" className="admin-btn-secondary w-full sm:w-auto text-sm flex items-center justify-center gap-2">
              Übersichtsseite bearbeiten
            </button>
          </form>
          <form action={createAction} className="flex gap-2">
            <input name="title" placeholder="Neuer Eintrag…" required className="admin-input flex-1 sm:w-56" />
            <button type="submit" className="admin-btn-primary whitespace-nowrap">+ Erstellen</button>
          </form>
        </div>
      </div>
      <CollectionItemsList items={items} collectionKey={key} deleteAction={deleteItemAction} />
    </div>
  );
}
