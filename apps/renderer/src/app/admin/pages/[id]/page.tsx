import { getPageWithSectionsAction } from '../actions';
import { notFound } from 'next/navigation';
import { PageEditor } from './page-editor';

export const dynamic = 'force-dynamic';

export default async function PageEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getPageWithSectionsAction(id);
  if (!result) notFound();
  return <PageEditor page={result.page} sections={result.sections} industry={result.industry} styleVariant={result.styleVariant} brand={result.brand} hasShop={result.hasShop} />;
}
