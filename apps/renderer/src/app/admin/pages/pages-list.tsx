'use client';

import Link from 'next/link';
import { FileText, Trash2, Eye, EyeOff, Pencil, ChevronRight, ShoppingBag, AlertTriangle, Copy } from 'lucide-react';
import { useTransition, useState } from 'react';

type Page = {
  id: string;
  title: string;
  slug: string;
  status: string;
  visible: boolean;
  type: string;
  updatedAt: Date;
};

type ShopPageInfo = { slug: string; title: string; exists: boolean };

function ShopDeleteModal({ page, onConfirm, onCancel }: { page: Page; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold">Shop-Seite löschen?</h3>
        </div>
        <p className="text-sm text-zinc-600 mb-2">
          Du bist dabei, die Seite <strong>&quot;{page.title}&quot;</strong> (/{page.slug}) zu löschen.
        </p>
        <p className="text-sm text-red-600 font-medium mb-6">
          ⚠️ Der Shop funktioniert ohne diese Seite nicht korrekt. Du kannst sie später über &quot;Shop-Seite hinzufügen&quot; wiederherstellen.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm border rounded-lg hover:bg-zinc-50">Abbrechen</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Trotzdem löschen</button>
        </div>
      </div>
    </div>
  );
}

function AddShopPageModal({ shopPages, onAdd, onClose }: { shopPages: ShopPageInfo[]; onAdd: (slug: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <ShoppingBag size={20} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">Shop-Seite hinzufügen</h3>
        </div>
        <p className="text-sm text-zinc-500 mb-4">Wähle eine Shop-Seite zum Hinzufügen. Jede Seite kann nur einmal existieren.</p>
        <div className="space-y-2">
          {shopPages.map(sp => (
            <button
              key={sp.slug}
              disabled={sp.exists}
              onClick={() => onAdd(sp.slug)}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${sp.exists ? 'bg-zinc-50 text-zinc-400 cursor-not-allowed border-zinc-200' : 'hover:bg-blue-50 hover:border-blue-300 border-zinc-200'}`}
            >
              <span className="font-medium">{sp.title}</span>
              <span className="ml-2 text-xs text-zinc-400">/{sp.slug}</span>
              {sp.exists && <span className="ml-2 text-xs text-emerald-600">(bereits vorhanden)</span>}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm border rounded-lg hover:bg-zinc-50">Schließen</button>
        </div>
      </div>
    </div>
  );
}

const SHOP_SLUGS = new Set(['shop', 'warenkorb', 'checkout', 'bestellung-abgeschlossen', 'agb', 'widerrufsbelehrung']);

export function PagesList({ pages, deleteAction, duplicateAction, hasShop, shopPages, addShopPageAction }: {
  pages: Page[];
  deleteAction: (id: string) => Promise<void>;
  duplicateAction?: (id: string) => Promise<{ success?: boolean; id?: string; error?: string }>;
  hasShop?: boolean;
  shopPages?: ShopPageInfo[];
  addShopPageAction?: (slug: string) => Promise<{ success?: boolean; error?: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [shopDeleteTarget, setShopDeleteTarget] = useState<Page | null>(null);
  const [showAddShop, setShowAddShop] = useState(false);

  if (pages.length === 0) {
    return (
      <div className="admin-card text-center py-16 px-6">
        <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center">
          <FileText className="text-pink-500" size={28} />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 mb-1">Noch keine Seiten</h3>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-5">
          Lege deine erste Seite an. Du kannst Titel, Sektionen und SEO später jederzeit anpassen.
          Standardseiten (Startseite, Impressum, Datenschutz) werden automatisch erzeugt.
        </p>
        <a href="#new-page-input" onClick={(e) => { e.preventDefault(); document.querySelector<HTMLInputElement>('input[name="title"]')?.focus(); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 transition-colors">
          + Erste Seite anlegen
        </a>
      </div>
    );
  }

  return (
    <>
      {hasShop && shopPages && addShopPageAction && (
        <div className="mb-4">
          <button onClick={() => setShowAddShop(true)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-blue-200 text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <ShoppingBag size={16} />
            Shop-Seite hinzufügen
          </button>
        </div>
      )}
      <div className="space-y-3">
        {pages.map((page) => (
          <div key={page.id} className="admin-card p-0 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="flex items-center">
              <Link href={`/admin/pages/${page.id}`} className="flex-1 flex items-center gap-4 px-5 py-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${SHOP_SLUGS.has(page.slug) ? 'bg-purple-50 group-hover:bg-purple-100' : 'bg-blue-50 group-hover:bg-blue-100'}`}>
                  {SHOP_SLUGS.has(page.slug) ? <ShoppingBag size={18} className="text-purple-500" /> : <FileText size={18} className="text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{page.title}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">/{page.slug || '(Startseite)'}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium ${page.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {page.status === 'published' ? 'Live' : 'Entwurf'}
                  </span>
                  {page.visible ? <Eye size={14} className="text-emerald-500 hidden sm:block" /> : <EyeOff size={14} className="text-zinc-300 hidden sm:block" />}
                  <div className="hidden sm:flex items-center gap-1 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil size={14} />
                    <span className="text-xs font-medium">Bearbeiten</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
              <div className="px-2 sm:px-3 border-l flex items-center gap-1">
                {duplicateAction && (
                  <button
                    type="button"
                    disabled={pending}
                    title="Seite duplizieren"
                    onClick={() => {
                      startTransition(async () => {
                        const result = await duplicateAction(page.id);
                        if (result?.id) {
                          window.location.href = `/admin/pages/${result.id}`;
                        } else if (result?.error) {
                          alert(result.error);
                        }
                      });
                    }}
                    className="text-zinc-400 hover:text-blue-600 p-2.5 transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                )}
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    if (SHOP_SLUGS.has(page.slug)) {
                      setShopDeleteTarget(page);
                    } else {
                      if (confirm(`Seite "${page.title}" wirklich löschen?`)) {
                        startTransition(() => deleteAction(page.id));
                      }
                    }
                  }}
                  className="text-zinc-400 hover:text-red-500 p-2.5 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {shopDeleteTarget && (
        <ShopDeleteModal
          page={shopDeleteTarget}
          onCancel={() => setShopDeleteTarget(null)}
          onConfirm={() => {
            startTransition(() => deleteAction(shopDeleteTarget.id));
            setShopDeleteTarget(null);
          }}
        />
      )}
      {showAddShop && shopPages && addShopPageAction && (
        <AddShopPageModal
          shopPages={shopPages}
          onClose={() => setShowAddShop(false)}
          onAdd={(slug) => {
            startTransition(async () => {
              await addShopPageAction(slug);
              setShowAddShop(false);
            });
          }}
        />
      )}
    </>
  );
}
