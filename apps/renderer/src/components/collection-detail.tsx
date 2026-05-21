'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { SnapshotCollectionItem, SnapshotCollection, SnapshotSection } from '@/lib/snapshot';
import { SectionRenderer } from './section-renderer';

type Props = {
  item: SnapshotCollectionItem;
  collection: SnapshotCollection;
  collections?: SnapshotCollection[];
  backHrefPrefix?: string;
  styleVariant?: string;
  industry?: string;
};

export function CollectionDetail({ item, collection, collections, backHrefPrefix = '', styleVariant, industry }: Props) {
  const data = item.data;
  const sections = data.sections as SnapshotSection[] | undefined;

  // If the item has sections (page builder), render them
  if (sections && sections.length > 0) {
    const visibleSections = sections.filter(s => s.visible !== false);
    const heroSections = visibleSections.filter(s => s.type === 'collectionHero');
    const otherSections = visibleSections.filter(s => s.type !== 'collectionHero');

    return (
      <div className="relative">
        {/* Hero sections with overlapping back button */}
        <div className="relative">
          {heroSections.map((section) => (
            <SectionRenderer key={section.id} section={section} collections={collections} styleVariant={styleVariant} industry={industry} />
          ))}
          {/* Back button — overlaps hero bottom edge */}
          <div className="absolute bottom-0 left-0 z-30 translate-y-1/2 ml-6 md:ml-10">
            <Link href={`${backHrefPrefix}/${collection.key}`} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md ring-1 ring-black/5 hover:bg-brand-primary hover:text-white transition-colors">
              <ArrowLeft size={14} />
              {collection.label}
            </Link>
          </div>
        </div>
        {/* Remaining sections (CTA bands, etc.) */}
        {otherSections.map((section) => (
          <SectionRenderer key={section.id} section={section} collections={collections} styleVariant={styleVariant} industry={industry} />
        ))}
      </div>
    );
  }

  // Legacy flat data rendering (backward compatibility)
  const image = data.image as string | undefined;
  const description = data.description as string | undefined;
  const content = data.content as string | undefined;
  const features = data.features as string[] | undefined;
  const gallery = data.gallery as string[] | undefined;
  const price = data.price as string | undefined;
  const cta = data.cta as { label: string; href: string } | undefined;
  const excerpt = data.excerpt as string | undefined;

  return (
    <div className="py-10 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link href={`${backHrefPrefix}/${(collection.settings as Record<string, unknown>)?.pageSlug || collection.key}`} className="inline-flex items-center gap-2 text-sm text-brand-primary hover:underline mb-4 md:mb-8">
            <ArrowLeft size={16} />
            Zurück zu {collection.label}
          </Link>
        </motion.div>

        {/* Hero image */}
        {image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-[21/9] rounded-xl overflow-hidden mb-10"
          >
            <Image src={image} alt={item.title} fill className="object-cover" />
          </motion.div>
        )}

        {/* Title + Price */}
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          >
            {item.title}
          </motion.h1>
          {price && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-2xl font-semibold text-brand-primary shrink-0">
              {price}
            </motion.span>
          )}
        </div>

        {/* Date */}
        {item.createdAt && !price && (
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Calendar size={14} />
            {new Date(item.createdAt).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        )}

        {/* Description / Excerpt */}
        {(description || excerpt) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed mb-8 rt-content"
            dangerouslySetInnerHTML={{ __html: (description || excerpt)! }}
          />
        )}

        {/* Features list */}
        {features && features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-xl p-6 mb-8"
          >
            <h3 className="font-semibold text-lg mb-3">Leistungen im Detail</h3>
            <ul className="space-y-2">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Rich content */}
        {content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="prose prose-lg max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {/* CTA */}
        {cta?.label && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} className="mb-10">
            <Link href={`${backHrefPrefix}${cta.href}`} className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-dark transition-colors">
              {cta.label}
            </Link>
          </motion.div>
        )}

        {/* Gallery */}
        {gallery && gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {gallery.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                <Image src={img} alt={`${item.title} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
