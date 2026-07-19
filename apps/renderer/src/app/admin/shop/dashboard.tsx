import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Circle,
  CreditCard,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Tag,
  Truck,
} from 'lucide-react';
import { getCategories, getOrders, getProducts, getShippingZones, getShopSettings } from './actions';
import { formatShopMoney } from '@/lib/shop-currency';

export async function ShopDashboard() {
  const [productList, orderList, categoryList, settings, shippingZones] = await Promise.all([
    getProducts(),
    getOrders(),
    getCategories(),
    getShopSettings(),
    getShippingZones(),
  ]);

  const activeProducts = productList.filter(product => product.status === 'active');
  const sellableProducts = activeProducts.filter(product => !product.isDigital && (!product.trackStock || product.stock > 0));
  const unsupportedDigitalProducts = activeProducts.filter(product => product.isDigital);
  const outOfStockProducts = activeProducts.filter(product => !product.isDigital && product.trackStock && product.stock <= 0);
  const actionableOrders = orderList.filter(order => ['pending', 'paid', 'processing'].includes(order.status));
  const revenueCents = orderList
    .filter(order => ['paid', 'processing', 'shipped', 'delivered'].includes(order.status))
    .reduce((sum, order) => sum + order.totalCents, 0);
  const paymentReady = hasReadyPaymentMethod(settings);
  const shippingReady = Boolean(settings?.pickupEnabled)
    || shippingZones.some(zone => zone.methods.some(method => method.active));
  const company = settings?.companyInfo;
  const companyReady = Boolean(company?.name && company.street && company.zip && company.city && company.country);
  const readiness = [
    { label: 'Verkaufsfähiges Produkt', detail: sellableProducts.length ? `${sellableProducts.length} physisches Produkt${sellableProducts.length === 1 ? '' : 'e'} verfügbar` : outOfStockProducts.length ? 'Aktive Produkte haben keinen Bestand' : unsupportedDigitalProducts.length ? 'Digitale Auslieferung ist noch nicht verfügbar' : 'Mindestens ein Produkt veröffentlichen', done: sellableProducts.length > 0, href: activeProducts.length ? '/admin/shop/products' : '/admin/shop/products/new' },
    { label: 'Kategorie', detail: categoryList.length ? `${categoryList.length} Kategorie${categoryList.length === 1 ? '' : 'n'} angelegt` : 'Sortiert Produkte für Ihre Kunden', done: categoryList.length > 0, href: '/admin/shop/categories' },
    { label: 'Unternehmensdaten', detail: companyReady ? 'Rechnungsdaten vollständig' : 'Firma und Rechnungsanschrift ergänzen', done: companyReady, href: '/admin/shop/settings' },
    { label: 'Zahlungsart', detail: paymentReady ? 'Mindestens eine Zahlungsart bereit' : 'Zahlungsart vollständig einrichten', done: paymentReady, href: '/admin/shop/settings' },
    { label: 'Versand oder Abholung', detail: shippingReady ? 'Lieferweg eingerichtet' : 'Lieferweg für Bestellungen festlegen', done: shippingReady, href: '/admin/shop/shipping' },
  ];
  const completedSteps = readiness.filter(step => step.done).length;
  const nextStep = readiness.find(step => !step.done);
  const currency = settings?.currency || 'EUR';

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">Shop-Übersicht</p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-950">Heute im Shop</h1>
          <p className="mt-1 text-sm text-zinc-500">Bestellungen bearbeiten und den Shop verkaufsbereit halten.</p>
        </div>
        <Link href="/admin/shop/products/new" className="admin-btn-primary min-h-11"><Plus className="size-4" /> Produkt anlegen</Link>
      </header>

      {nextStep ? (
        <section className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/60" aria-labelledby="shop-readiness-heading">
          <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800"><Circle className="size-3 fill-amber-500 text-amber-500" /> Nächster sinnvoller Schritt</div>
              <h2 id="shop-readiness-heading" className="mt-2 text-lg font-semibold text-zinc-950">{nextStep.label} einrichten</h2>
              <p className="mt-1 text-sm text-zinc-600">{nextStep.detail}. Danach ist Ihr Shop einen Schritt näher am sicheren Verkaufsstart.</p>
            </div>
            <Link href={nextStep.href} className="admin-btn-primary min-h-11 shrink-0">Jetzt erledigen <ArrowRight className="size-4" /></Link>
          </div>
          <div className="h-1.5 bg-amber-100"><div className="h-full bg-amber-500 transition-all" style={{ width: `${(completedSteps / readiness.length) * 100}%` }} /></div>
        </section>
      ) : (
        <section className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5" aria-label="Shop ist startbereit">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-600 text-white"><Check className="size-5" /></span>
          <div><p className="font-semibold text-emerald-950">Ihr Shop ist startbereit</p><p className="mt-0.5 text-sm text-emerald-800">Alle wichtigen Grundlagen sind eingerichtet.</p></div>
        </section>
      )}

      <section className="grid gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-3" aria-label="Shop-Kennzahlen">
        <Metric label="Bezahlter Umsatz" value={formatShopMoney(revenueCents, currency)} detail="bezahlte und erfüllte Bestellungen" icon={CreditCard} />
        <Metric label="Offene Aufgaben" value={String(actionableOrders.length)} detail="Bestellungen benötigen Aufmerksamkeit" icon={ShoppingCart} href="/admin/shop/orders" attention={actionableOrders.length > 0} />
        <Metric label="Aktive Produkte" value={String(activeProducts.length)} detail={`${productList.length - activeProducts.length} Entwürfe oder archiviert`} icon={Package} href="/admin/shop/products" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <section className="admin-card overflow-hidden" aria-labelledby="recent-orders-heading">
          <div className="flex items-center justify-between gap-4 border-b border-zinc-100 px-5 py-4">
            <div><h2 id="recent-orders-heading" className="font-semibold text-zinc-950">Letzte Bestellungen</h2><p className="mt-0.5 text-xs text-zinc-500">Die neuesten Vorgänge auf einen Blick</p></div>
            <Link href="/admin/shop/orders" className="text-sm font-semibold text-zinc-700 hover:text-zinc-950">Alle öffnen</Link>
          </div>
          {orderList.length ? (
            <div className="divide-y divide-zinc-100">
              {orderList.slice(0, 5).map(order => (
                <Link key={order.id} href={`/admin/shop/orders?order=${encodeURIComponent(order.id)}`} className="flex min-h-16 items-center gap-4 px-5 py-3 transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400">
                  <OrderStatus status={order.status} />
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-zinc-900">{order.orderNumber} · {order.customerName}</p><p className="mt-0.5 text-xs text-zinc-500">{formatDate(order.createdAt)} · {order.items.length} Position{order.items.length === 1 ? '' : 'en'}</p></div>
                  <p className="shrink-0 text-sm font-semibold text-zinc-900">{formatShopMoney(order.totalCents, currency)}</p>
                  <ChevronRight className="hidden size-4 text-zinc-400 sm:block" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center"><ShoppingCart className="mx-auto size-8 text-zinc-300" /><p className="mt-3 text-sm font-medium text-zinc-700">Noch keine Bestellungen</p><p className="mt-1 text-sm text-zinc-500">Sobald die erste Bestellung eingeht, erscheint sie hier.</p></div>
          )}
        </section>

        <section className="admin-card p-5" aria-labelledby="readiness-list-heading">
          <div className="flex items-start justify-between gap-3">
            <div><h2 id="readiness-list-heading" className="font-semibold text-zinc-950">Startklar-Check</h2><p className="mt-1 text-xs text-zinc-500">{completedSteps} von {readiness.length} Grundlagen erledigt</p></div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${completedSteps === readiness.length ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>{Math.round((completedSteps / readiness.length) * 100)}%</span>
          </div>
          <ol className="mt-5 space-y-1">
            {readiness.map(step => (
              <li key={step.label}>
                <Link href={step.href} className="group flex min-h-14 items-center gap-3 rounded-xl px-2 py-2 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
                  <span className={`grid size-7 shrink-0 place-items-center rounded-full ${step.done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>{step.done ? <Check className="size-4" /> : <Circle className="size-3" />}</span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-medium text-zinc-800">{step.label}</span><span className="block truncate text-xs text-zinc-500">{step.detail}</span></span>
                  <ChevronRight className="size-4 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-zinc-500" />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="border-t border-zinc-200 pt-6" aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="text-sm font-semibold text-zinc-800">Schnellzugriff</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <QuickLink href="/admin/shop/products/new" icon={Plus}>Produkt anlegen</QuickLink>
          <QuickLink href="/admin/shop/orders" icon={ShoppingCart}>Bestellungen</QuickLink>
          <QuickLink href="/admin/shop/shipping" icon={Truck}>Versand</QuickLink>
          <QuickLink href="/admin/shop/coupons" icon={Tag}>Coupons</QuickLink>
          <QuickLink href="/admin/shop/settings" icon={Settings}>Zahlungen & Einstellungen</QuickLink>
        </div>
      </section>
    </div>
  );
}

function hasReadyPaymentMethod(settings: Awaited<ReturnType<typeof getShopSettings>>) {
  if (!settings) return false;
  const methods = settings.paymentMethods || [];
  return methods.some(method => {
    if (method === 'stripe') return Boolean(settings.stripePublicKey && settings.stripeSecretConfigured && settings.stripeWebhookConfigured);
    if (method === 'paypal') return Boolean(settings.paypalClientId && settings.paypalSecretConfigured);
    if (method === 'sumup') return Boolean(settings.sumupMerchantCode && settings.sumupApiKeyConfigured);
    if (method === 'prepayment') return Boolean(settings.bankDetails?.iban && settings.bankDetails.accountHolder);
    if (method === 'pickup') return Boolean(settings.pickupEnabled);
    return false;
  });
}

function Metric({ label, value, detail, icon: Icon, href, attention }: { label: string; value: string; detail: string; icon: typeof Package; href?: string; attention?: boolean }) {
  const content = <><div className="flex items-center justify-between"><span className="text-sm font-medium text-zinc-500">{label}</span><Icon className={`size-4 ${attention ? 'text-amber-600' : 'text-zinc-400'}`} /></div><p className="mt-3 text-2xl font-bold tracking-tight text-zinc-950">{value}</p><p className="mt-1 text-xs text-zinc-500">{detail}</p></>;
  const className = "bg-white p-5 transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400";
  return href ? <Link href={href} className={className}>{content}</Link> : <div className={className}>{content}</div>;
}

function QuickLink({ href, icon: Icon, children }: { href: string; icon: typeof Package; children: string }) {
  return <Link href={href} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"><Icon className="size-4 text-zinc-400" />{children}</Link>;
}

function OrderStatus({ status }: { status: string }) {
  const config: Record<string, { label: string; styles: string }> = {
    awaiting_payment: { label: 'Zahlung offen', styles: 'bg-amber-50 text-amber-800 ring-amber-200' },
    pending: { label: 'Neu', styles: 'bg-amber-50 text-amber-800 ring-amber-200' },
    paid: { label: 'Bezahlt', styles: 'bg-blue-50 text-blue-800 ring-blue-200' },
    processing: { label: 'In Bearbeitung', styles: 'bg-indigo-50 text-indigo-800 ring-indigo-200' },
    shipped: { label: 'Versendet', styles: 'bg-violet-50 text-violet-800 ring-violet-200' },
    delivered: { label: 'Zugestellt', styles: 'bg-emerald-50 text-emerald-800 ring-emerald-200' },
    cancelled: { label: 'Storniert', styles: 'bg-zinc-100 text-zinc-600 ring-zinc-200' },
    refunded: { label: 'Erstattet', styles: 'bg-zinc-100 text-zinc-600 ring-zinc-200' },
  };
  const current = config[status] || { label: status, styles: 'bg-zinc-100 text-zinc-600 ring-zinc-200' };
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${current.styles}`}>{current.label}</span>;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }).format(value);
}
