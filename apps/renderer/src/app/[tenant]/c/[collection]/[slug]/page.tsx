import type { Metadata } from 'next';
import { generateCollectionItemMetadata, renderCollectionItemPage } from '@/app/c/[collection]/[slug]/collection-item-page';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ tenant: string; collection: string; slug: string }> }): Promise<Metadata> {
  const { tenant, collection, slug } = await params;
  return generateCollectionItemMetadata(Promise.resolve({ collection, slug }), tenant);
}

export default async function TenantCollectionItemPage({ params }: { params: Promise<{ tenant: string; collection: string; slug: string }> }) {
  const { tenant, collection, slug } = await params;
  return renderCollectionItemPage(Promise.resolve({ collection, slug }), tenant, `/${tenant}`);
}
