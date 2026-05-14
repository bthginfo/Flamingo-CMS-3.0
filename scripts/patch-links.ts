/**
 * Patch existing demo data: add CTA buttons and detail links to servicesGrid and portfolio sections.
 * Run with: npx tsx scripts/patch-links.ts
 */
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { pageSections } from '../packages/db/src/schema/index';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL required');

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

async function main() {
  // Find all servicesGrid sections and add ctaLabel/ctaHref + href to cards
  const servicesSections = await db.select().from(pageSections).where(eq(pageSections.type, 'servicesGrid'));
  
  for (const section of servicesSections) {
    const data = section.data as Record<string, unknown>;
    if (data.ctaLabel) continue; // Already patched
    
    const updatedData = {
      ...data,
      ctaLabel: 'Alle Leistungen ansehen',
      ctaHref: '/leistungen',
      manualCards: ((data.manualCards as Record<string, unknown>[]) || []).map(card => ({
        ...card,
        href: card.href || '/leistungen',
      })),
    };
    
    await db.update(pageSections).set({ data: updatedData }).where(eq(pageSections.id, section.id));
    console.log(`✓ Patched servicesGrid section ${section.id}`);
  }

  // Find all portfolio sections and add ctaLabel/ctaHref + href to projects
  const portfolioSections = await db.select().from(pageSections).where(eq(pageSections.type, 'portfolio'));
  
  for (const section of portfolioSections) {
    const data = section.data as Record<string, unknown>;
    if (data.ctaLabel) continue; // Already patched
    
    const updatedData = {
      ...data,
      ctaLabel: 'Alle Referenzen ansehen',
      ctaHref: '/referenzen',
      projects: ((data.projects as Record<string, unknown>[]) || []).map(proj => ({
        ...proj,
        href: proj.href || '/referenzen',
      })),
    };
    
    await db.update(pageSections).set({ data: updatedData }).where(eq(pageSections.id, section.id));
    console.log(`✓ Patched portfolio section ${section.id}`);
  }

  console.log('\nDone! All sections patched with CTA buttons and detail links.');
}

main().catch(console.error);
