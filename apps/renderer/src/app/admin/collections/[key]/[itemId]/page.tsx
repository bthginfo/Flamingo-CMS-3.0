import { getItemWithIndustryAction } from '../../actions';
import { notFound } from 'next/navigation';
import { ItemEditor } from './item-editor';

export const dynamic = 'force-dynamic';

export default async function CollectionItemEditPage({ params }: { params: Promise<{ key: string; itemId: string }> }) {
  const { key, itemId } = await params;
  const result = await getItemWithIndustryAction(itemId);
  if (!result) notFound();
  return <ItemEditor item={result.item} collectionKey={key} industry={result.industry} styleVariant={result.styleVariant} brand={result.brand} hasShop={result.hasShop} hasBooking={result.hasBooking} i18n={result.i18n} collections={result.collections} tenantId={result.tenantId} previewProducts={result.previewProducts} />;
}
