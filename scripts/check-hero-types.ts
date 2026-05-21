import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const tenants = await p.tenant.findMany({ select: { slug: true, industry: true } });
  for (const t of tenants) {
    const snap = await p.snapshot.findFirst({
      where: { tenantId: t.slug, isActive: true },
      select: { pages: { select: { slug: true, sections: { select: { type: true }, orderBy: { sortOrder: 'asc' }, take: 1 } } } }
    });
    if (!snap) { console.log(t.slug, t.industry, '-> NO SNAPSHOT'); continue; }
    const home = snap.pages.find((pg: any) => pg.slug === 'home' || pg.slug === '' || pg.slug === 'startseite');
    const firstType = home?.sections[0]?.type;
    console.log(t.slug, t.industry, '->', firstType);
  }
  await p.$disconnect();
}
main();
