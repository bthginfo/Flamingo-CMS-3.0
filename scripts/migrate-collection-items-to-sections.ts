import { requireDatabaseUrl } from './_database-url';
/**
 * Migrate all collection items to use the sections-based page builder.
 * Converts existing flat data (image, description, content, features) into proper sections.
 * Run: npx tsx scripts/migrate-collection-items-to-sections.ts
 */
import { neon } from '@neondatabase/serverless';

const sql = neon(requireDatabaseUrl());

function uid() { return crypto.randomUUID(); }

type Section = {
  id: string;
  type: string;
  variant: string | null;
  visible: boolean;
  container: string;
  spacingTop: string;
  spacingBottom: string;
  anchorId: string | null;
  data: Record<string, unknown>;
};

function makeCollectionHero(title: string, description: string, image: string, category?: string): Section {
  return {
    id: uid(), type: 'collectionHero', variant: null, visible: true,
    container: 'full', spacingTop: 'none', spacingBottom: 'none', anchorId: null,
    data: {
      headline: title,
      subline: description,
      bgImage: image,
      category: category || '',
      date: '',
      overlayColor: '#000000',
      overlayOpacity: 0.5,
    },
  };
}

function makeRichText(headline: string, content: string): Section {
  return {
    id: uid(), type: 'richText', variant: null, visible: true,
    container: 'narrow', spacingTop: 'm', spacingBottom: 'm', anchorId: null,
    data: { headline, content },
  };
}

function makeUspStrip(items: { icon: string; title: string; text: string }[]): Section {
  return {
    id: uid(), type: 'uspStrip', variant: null, visible: true,
    container: 'default', spacingTop: 'm', spacingBottom: 'm', anchorId: null,
    data: { items },
  };
}

function makeFaq(headline: string, items: { question: string; answer: string }[]): Section {
  return {
    id: uid(), type: 'faq', variant: null, visible: true,
    container: 'default', spacingTop: 'm', spacingBottom: 'm', anchorId: null,
    data: { headline, items, source: 'manual', layout: 'accordion', expandFirst: true, badgeText: '' },
  };
}

function makeCtaBand(headline: string, text: string, cta: { label: string; href: string }): Section {
  return {
    id: uid(), type: 'ctaBand', variant: null, visible: true,
    container: 'default', spacingTop: 'm', spacingBottom: 'm', anchorId: null,
    data: { headline, text, primaryCta: cta },
  };
}

/**
 * Convert a flat collection item (with image, description, content, features) into sections.
 */
function convertFlatItemToSections(title: string, data: Record<string, unknown>, category?: string): Section[] {
  const sections: Section[] = [];
  const image = (data.image as string) || '';
  const description = (data.description as string) || '';
  const content = (data.content as string) || '';
  const features = (data.features as string[]) || [];

  // 1. Collection Hero
  if (image || description) {
    sections.push(makeCollectionHero(title, description, image, category));
  }

  // 2. Features as USP strip
  if (features.length > 0) {
    const uspItems = features.map(f => ({
      icon: 'CheckCircle',
      title: f.length > 60 ? f.slice(0, 57) + '...' : f,
      text: f.length > 60 ? f : '',
    }));
    sections.push(makeUspStrip(uspItems));
  }

  // 3. Rich text content
  if (content) {
    sections.push(makeRichText('', content));
  }

  // 4. CTA band
  sections.push(makeCtaBand(
    'Interesse geweckt?',
    'Kontaktieren Sie uns für ein unverbindliches Angebot.',
    { label: 'Kontakt aufnehmen', href: '/kontakt' }
  ));

  return sections;
}

async function main() {
  console.log('🔄 Migrating collection items to sections...\n');

  // Get all items that still use flat data (no sections yet)
  const items = await sql`
    SELECT ci.id, ci.title, ci.slug, ci.data, c.key as collection_key, t.name as tenant_name, t.industry
    FROM collection_items ci
    JOIN collections c ON ci.collection_id = c.id
    JOIN tenants t ON ci.tenant_id = t.id
    ORDER BY t.name, c.key, ci.priority
  `;

  let migrated = 0;
  for (const item of items) {
    const data = item.data as Record<string, unknown>;

    // Skip items that already have sections
    if (data.sections && Array.isArray(data.sections) && (data.sections as unknown[]).length > 0) {
      console.log(`  ⏭️  ${item.tenant_name} / ${item.collection_key} / ${item.slug} — already has sections`);
      continue;
    }

    // Determine category label
    let category = '';
    if (item.collection_key === 'services') category = 'Leistung';
    else if (item.collection_key === 'mietgeraete') category = 'Mietgerät';
    else if (item.collection_key === 'news') category = 'News';
    else if (item.collection_key === 'projects') category = 'Projekt';
    else if (item.collection_key === 'rooms') category = 'Zimmer';

    const sections = convertFlatItemToSections(item.title, data, category);

    if (sections.length === 0) {
      console.log(`  ⚠️  ${item.tenant_name} / ${item.collection_key} / ${item.slug} — no convertible data`);
      continue;
    }

    // Keep original flat data alongside sections for backward compat
    const newData = { ...data, sections };
    await sql`UPDATE collection_items SET data = ${JSON.stringify(newData)}::jsonb WHERE id = ${item.id}`;
    migrated++;
    console.log(`  ✅ ${item.tenant_name} / ${item.collection_key} / ${item.slug} (${sections.length} sections)`);
  }

  console.log(`\n🎉 Migrated ${migrated} items to sections-based layout.`);
}

main().catch(console.error);
