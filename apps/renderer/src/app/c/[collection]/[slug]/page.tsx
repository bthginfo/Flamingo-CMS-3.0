import type { Metadata } from 'next';
import { generateCollectionItemMetadata, renderCollectionItemPage } from './collection-item-page';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ collection: string; slug: string }> }): Promise<Metadata> {
  return generateCollectionItemMetadata(params);
}

export default async function CollectionItemPage({ params }: { params: Promise<{ collection: string; slug: string }> }) {
  return renderCollectionItemPage(params);
}
