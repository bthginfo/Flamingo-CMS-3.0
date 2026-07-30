import { getCollectionByKeyAction, getItemsAction, createItemAction, deleteItemAction, duplicateItemAction, getOrCreateOverviewPageAction } from '../actions';
import { notFound, redirect } from 'next/navigation';
import { LayoutTemplate, Plus } from 'lucide-react';
import { CollectionItemsList } from './items-list';
import { OverviewPageSubmit } from './overview-page-submit';

export default async function CollectionDetailPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const collectionResult = await getCollectionByKeyAction(key);
  if (!collectionResult) notFound();
  const collection = collectionResult;
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
      <div className="mb-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-[.18em] text-slate-500">Collection</p>
        <h1 className="text-2xl font-bold">{collection.label}</h1>
      </div>

      <section aria-labelledby="collection-overview-title" className="admin-card relative mb-7 grid grid-cols-[auto_1fr] items-center gap-4 overflow-hidden border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 sm:p-5 lg:grid-cols-[auto_1fr_auto]">
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-600 via-indigo-500 to-admin-accent" />
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-white shadow-sm">
          <LayoutTemplate size={21} aria-hidden="true" />
        </div>
        <div>
          <h2 id="collection-overview-title" className="font-bold text-slate-950">Öffentliche Übersichtsseite</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Hier gestaltest du die öffentliche Seite, auf der Besucher alle Einträge dieser Collection entdecken.
          </p>
        </div>
        <form action={openOverviewPage} className="col-span-2 lg:col-span-1">
          <OverviewPageSubmit />
        </form>
      </section>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Einträge</h2>
          <p className="mt-1 text-sm text-slate-500">Inhalte dieser Collection anlegen und verwalten.</p>
        </div>
        <form action={createAction} className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="new-collection-item" className="sr-only">Titel des neuen Eintrags</label>
          <input id="new-collection-item" name="title" placeholder="Titel des neuen Eintrags" required className="admin-input min-w-0 flex-1 sm:w-64" />
          <button type="submit" className="admin-btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
            <Plus size={16} aria-hidden="true" />
            Eintrag erstellen
          </button>
        </form>
      </div>
      <CollectionItemsList items={items} collectionKey={key} deleteAction={deleteItemAction} duplicateAction={duplicateItemAction} />
    </div>
  );
}
