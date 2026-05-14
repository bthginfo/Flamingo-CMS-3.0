import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../packages/db/src/schema';
import { eq, and, inArray } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const TENANT_ID = 'f50cbf53-279d-43f3-b58b-f5ae3d550ab2';

async function main() {
  // Find legal page sections that have 'html' key instead of 'content'
  const pages = await db.select({ id: schema.pages.id, slug: schema.pages.slug })
    .from(schema.pages)
    .where(and(
      eq(schema.pages.tenantId, TENANT_ID),
      inArray(schema.pages.slug, ['impressum', 'datenschutz'])
    ));

  for (const page of pages) {
    const sections = await db.select()
      .from(schema.pageSections)
      .where(and(
        eq(schema.pageSections.pageId, page.id),
        eq(schema.pageSections.type, 'richText')
      ));

    for (const section of sections) {
      const data = section.data as Record<string, unknown>;
      if (data.html && !data.content) {
        const newData = { ...data, content: data.html };
        delete newData.html;
        await db.update(schema.pageSections)
          .set({ data: newData })
          .where(eq(schema.pageSections.id, section.id));
        console.log(`Fixed ${page.slug}: renamed html -> content`);
      } else {
        console.log(`${page.slug}: already OK (keys: ${Object.keys(data).join(', ')})`);
      }
    }
  }
  console.log('Done');
}

main().catch(console.error);
