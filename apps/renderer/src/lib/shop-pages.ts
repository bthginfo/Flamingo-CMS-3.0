/**
 * Pure implementation of "ensure shop system pages exist for a tenant".
 * Not a server action — callers are responsible for authorising the tenantId.
 *
 * Existing callers:
 *  - apps/renderer/src/app/admin/shop/actions.ts (session-gated wrapper)
 *  - apps/renderer/src/app/api/v1/instructions/route.ts (PAT-gated)
 */
import { getDb } from '@/lib/db';
import { pages, pageSections, tenantAddons } from '@flamingo/db';
import { and, eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export const SHOP_ADDON_KEY = 'shop';

/** True when the tenant has the shop addon active. Used e.g. to surface the
 *  legally-required withdrawal (Widerruf) link in the footer on shop sites. */
export async function isShopActive(tenantId: string): Promise<boolean> {
  if (!tenantId) return false;
  return unstable_cache(async () => {
    const [row] = await getDb()
      .select({ active: tenantAddons.active })
      .from(tenantAddons)
      .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, SHOP_ADDON_KEY)))
      .limit(1);
    return Boolean(row?.active);
  }, ['public-shop-entitlement', tenantId], { revalidate: 30, tags: [`tenant-${tenantId}`] })();
}

export const SHOP_PAGES = [
  {
    slug: 'shop',
    title: 'Shop',
    sortOrder: 50,
    sections: [
      { type: 'shopProductGrid', data: { headline: 'Unsere Produkte', showCategories: true, showSearch: true, showSort: true, columns: 3 }, sortOrder: 0 },
    ],
  },
  {
    slug: 'warenkorb',
    title: 'Warenkorb',
    sortOrder: 51,
    sections: [
      { type: 'shopCart', data: { headline: 'Dein Warenkorb', emptyText: 'Dein Warenkorb ist leer.', continueShoppingLabel: 'Weiter einkaufen', checkoutLabel: 'Zur Kasse' }, sortOrder: 0 },
    ],
  },
  {
    slug: 'checkout',
    title: 'Checkout',
    sortOrder: 52,
    sections: [
      { type: 'shopCheckout', data: { headline: 'Kasse', steps: ['Kontakt', 'Versand', 'Zahlung', 'Best\u00e4tigung'] }, sortOrder: 0 },
    ],
  },
  {
    slug: 'bestellung-abgeschlossen',
    title: 'Bestellung abgeschlossen',
    sortOrder: 53,
    sections: [
      { type: 'shopThankYou', data: { headline: 'Vielen Dank f\u00fcr deine Bestellung!', subline: 'Du erh\u00e4ltst in K\u00fcrze eine Best\u00e4tigung per E-Mail.', continueShoppingLabel: 'Zur\u00fcck zum Shop' }, sortOrder: 0 },
    ],
  },
  {
    slug: 'agb',
    title: 'AGB',
    sortOrder: 54,
    sections: [
      { type: 'legalContent', data: { headline: 'Allgemeine Gesch\u00e4ftsbedingungen', blocks: [{ title: '\u00a71 Geltungsbereich', content: '<p>Diese Allgemeinen Gesch\u00e4ftsbedingungen gelten f\u00fcr alle Bestellungen \u00fcber unseren Online-Shop.</p>' }, { title: '\u00a72 Vertragsschluss', content: '<p>Die Darstellung der Produkte im Shop stellt kein rechtlich bindendes Angebot dar. Erst durch Anklicken des Bestell-Buttons geben Sie eine verbindliche Bestellung ab.</p>' }, { title: '\u00a73 Preise und Zahlung', content: '<p>Alle angegebenen Preise sind Endpreise inkl. gesetzlicher MwSt. zzgl. Versandkosten.</p>' }, { title: '\u00a74 Lieferung', content: '<p>Die Lieferzeit betr\u00e4gt, sofern nicht anders angegeben, 3-5 Werktage.</p>' }, { title: '\u00a75 Widerrufsrecht', content: '<p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gr\u00fcnden diesen Vertrag zu widerrufen.</p>' }] }, sortOrder: 0, locked: true },
    ],
  },
  {
    slug: 'widerrufsbelehrung',
    title: 'Widerrufsbelehrung',
    sortOrder: 55,
    sections: [
      { type: 'legalContent', data: { headline: 'Widerrufsbelehrung', blocks: [{ title: 'Widerrufsrecht', content: '<p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gr\u00fcnden diesen Vertrag zu widerrufen. Die Widerrufsfrist betr\u00e4gt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter die Waren in Besitz genommen haben.</p>' }, { title: 'Folgen des Widerrufs', content: '<p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverz\u00fcglich und sp\u00e4testens binnen vierzehn Tagen ab dem Tag zur\u00fcckzuzahlen, an dem die Mitteilung \u00fcber Ihren Widerruf dieses Vertrags bei uns eingegangen ist.</p>' }] }, sortOrder: 0, locked: true },
    ],
  },
] as const;

export async function ensureShopPages(tenantId: string) {
  const db = getDb();

  for (const pageDef of SHOP_PAGES) {
    const [existing] = await db.select({ id: pages.id }).from(pages)
      .where(and(eq(pages.tenantId, tenantId), eq(pages.slug, pageDef.slug)))
      .limit(1);
    if (existing) continue;

    const [page] = await db.insert(pages).values({
      tenantId,
      title: pageDef.title,
      slug: pageDef.slug,
      type: 'system',
      status: 'published',
      visible: true,
      sortOrder: pageDef.sortOrder,
    }).returning({ id: pages.id });

    for (const section of pageDef.sections) {
      await db.insert(pageSections).values({
        tenantId,
        pageId: page.id,
        type: section.type,
        data: section.data,
        sortOrder: section.sortOrder,
        locked: true,
        titleInternal: `[Shop] ${pageDef.title}`,
      });
    }
  }
}
