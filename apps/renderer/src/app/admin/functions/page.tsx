import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import {
  bookingAvailabilityRules,
  bookingCalendarBlocks,
  billingSettings,
  bookingServices,
  bookingSettings,
  customers,
  pages,
  pageSections,
  products,
  shippingMethods,
  shopSettings,
  tenantAddons,
  tenants,
} from '@flamingo/db';
import { and, eq, isNull } from 'drizzle-orm';
import { FunctionsClient } from './functions-client';
import { BILLING_ADDON_KEY } from '@/lib/billing-constants';

export default async function FunctionsPage() {
  const session = await getSession();
  let i18nEnabled = false;
  let bookingEnabled = false;
  let bookingRequested = false;
  let shopEnabled = false;
  let billingEnabled = false;
  let featureUsage = { rsvp: false, reservations: false, inbox: false };
  let premiumState = {
    booking: { used: false, ready: false },
    shop: { used: false, ready: false },
    billing: { ready: false, setupIssue: false },
  };
  if (session?.tenantId) {
    const db = getDb();
    const [tenant, addonRows, sections] = await Promise.all([
      db.select({ i18nEnabled: tenants.i18nEnabled }).from(tenants).where(eq(tenants.id, session.tenantId)).limit(1),
      db.select({ key: tenantAddons.addonKey, active: tenantAddons.active }).from(tenantAddons)
        .where(eq(tenantAddons.tenantId, session.tenantId)),
      db.select({ type: pageSections.type, data: pageSections.data, visible: pageSections.visible, pageStatus: pages.status })
        .from(pageSections)
        .innerJoin(pages, eq(pages.id, pageSections.pageId))
        .where(eq(pageSections.tenantId, session.tenantId)),
    ]);
    i18nEnabled = tenant[0]?.i18nEnabled ?? false;
    const bookingAddon = addonRows.find(addon => addon.key === 'booking');
    bookingEnabled = bookingAddon?.active ?? false;
    bookingRequested = Boolean(bookingAddon && !bookingAddon.active);
    shopEnabled = addonRows.some(addon => addon.key === 'shop' && addon.active);
    billingEnabled = addonRows.some(addon => addon.key === BILLING_ADDON_KEY && addon.active);
    featureUsage = {
      rsvp: sections.some(section => section.pageStatus === 'published' && section.visible && section.type === 'rsvp'),
      reservations: sections.some(section => section.pageStatus === 'published' && section.visible && section.type === 'reservation'),
      inbox: sections.some(section => section.pageStatus === 'published' && section.visible && ['contact', 'contactForm', 'smartInquiry'].includes(section.type) && section.data?.formEnabled !== false),
    };
    const publishedTypes = sections
      .filter(section => section.pageStatus === 'published' && section.visible)
      .map(section => section.type);
    const bookingUsed = publishedTypes.some(type => ['bookingWidget', 'bookingSlotPicker', 'bookingDateRange', 'availabilityCalendar', 'resourceBookingShowcase', 'bookingCtaPro'].includes(type));
    const shopUsed = publishedTypes.some(type => type.startsWith('shop'));

    if (bookingEnabled || shopEnabled) {
      const [bookingSettingsRows, bookingServiceRows, bookingRuleRows, bookingBlockRows, shopSettingsRows, productRows, shippingMethodRows] = await Promise.all([
        bookingEnabled
          ? db.select({ timeModel: bookingSettings.timeModel, adminEmailEnabled: bookingSettings.adminEmailEnabled, notificationEmail: bookingSettings.notificationEmail }).from(bookingSettings).where(eq(bookingSettings.tenantId, session.tenantId)).limit(1)
          : Promise.resolve([]),
        bookingEnabled
          ? db.select({ id: bookingServices.id }).from(bookingServices).where(and(eq(bookingServices.tenantId, session.tenantId), eq(bookingServices.active, true)))
          : Promise.resolve([]),
        bookingEnabled
          ? db.select({ id: bookingAvailabilityRules.id }).from(bookingAvailabilityRules).where(and(eq(bookingAvailabilityRules.tenantId, session.tenantId), eq(bookingAvailabilityRules.active, true)))
          : Promise.resolve([]),
        bookingEnabled
          ? db.select({ type: bookingCalendarBlocks.type, endsAt: bookingCalendarBlocks.endsAt }).from(bookingCalendarBlocks).where(and(eq(bookingCalendarBlocks.tenantId, session.tenantId), eq(bookingCalendarBlocks.active, true)))
          : Promise.resolve([]),
        shopEnabled
          ? db.select().from(shopSettings).where(eq(shopSettings.tenantId, session.tenantId)).limit(1)
          : Promise.resolve([]),
        shopEnabled
          ? db.select({ isDigital: products.isDigital, trackStock: products.trackStock, stock: products.stock }).from(products).where(and(eq(products.tenantId, session.tenantId), eq(products.status, 'active')))
          : Promise.resolve([]),
        shopEnabled
          ? db.select({ active: shippingMethods.active }).from(shippingMethods).where(and(eq(shippingMethods.tenantId, session.tenantId), eq(shippingMethods.active, true)))
          : Promise.resolve([]),
      ]);

      const bookingConfig = bookingSettingsRows[0];
      const hasRecurringAvailability = bookingRuleRows.length > 0;
      const hasFutureAvailableBlock = bookingBlockRows.some(block => block.type === 'available' && block.endsAt.getTime() > Date.now());
      const bookingAvailabilityReady = bookingConfig?.timeModel === 'time_slot'
        ? hasRecurringAvailability
        : hasRecurringAvailability || hasFutureAvailableBlock;
      const bookingNotificationReady = Boolean(bookingConfig?.adminEmailEnabled && bookingConfig.notificationEmail?.trim());

      const shopConfig = shopSettingsRows[0];
      const methods = shopConfig?.paymentMethods || [];
      const paymentReady = methods.some(method => {
        if (method === 'stripe') return Boolean(shopConfig?.stripePublicKey && shopConfig.stripeSecretKey && shopConfig.stripeWebhookSecret);
        if (method === 'paypal') return Boolean(shopConfig?.paypalClientId && shopConfig.paypalSecret);
        if (method === 'sumup') return Boolean(shopConfig?.sumupMerchantCode && shopConfig.sumupApiKey);
        if (method === 'prepayment') return Boolean(shopConfig?.bankDetails?.iban && shopConfig.bankDetails.accountHolder);
        if (method === 'pickup') return Boolean(shopConfig?.pickupEnabled);
        return false;
      });
      const company = shopConfig?.companyInfo;
      const companyReady = Boolean(company?.name && company.street && company.zip && company.city && company.country);
      const shippingReady = Boolean(shopConfig?.pickupEnabled) || shippingMethodRows.some(method => method.active);

      premiumState = {
        ...premiumState,
        booking: {
          used: bookingUsed,
          ready: bookingServiceRows.length > 0 && bookingAvailabilityReady && bookingNotificationReady,
        },
        shop: {
          used: shopUsed,
          ready: productRows.some(product => !product.isDigital && (!product.trackStock || product.stock > 0)) && paymentReady && companyReady && shippingReady,
        },
      };
    }

    if (billingEnabled) {
      try {
        const [settingsRows, customerRows] = await Promise.all([
          db.select({
            companyName: billingSettings.companyName,
            street: billingSettings.street,
            postalCode: billingSettings.postalCode,
            city: billingSettings.city,
            countryCode: billingSettings.countryCode,
            email: billingSettings.email,
            taxNumber: billingSettings.taxNumber,
            vatId: billingSettings.vatId,
            invoiceNumberFormat: billingSettings.invoiceNumberFormat,
            quoteNumberFormat: billingSettings.quoteNumberFormat,
            cancellationNumberFormat: billingSettings.cancellationNumberFormat,
            creditNumberFormat: billingSettings.creditNumberFormat,
          }).from(billingSettings).where(eq(billingSettings.tenantId, session.tenantId)).limit(1),
          db.select({ id: customers.id }).from(customers)
            .where(and(eq(customers.tenantId, session.tenantId), isNull(customers.archivedAt))).limit(1),
        ]);
        const settings = settingsRows[0];
        const senderReady = Boolean(settings?.companyName && settings.street && settings.postalCode && settings.city && settings.countryCode && settings.email);
        const taxReady = Boolean(settings?.taxNumber || settings?.vatId);
        const numbersReady = Boolean(settings?.invoiceNumberFormat && settings.quoteNumberFormat && settings.cancellationNumberFormat && settings.creditNumberFormat);
        premiumState.billing = {
          ready: senderReady && taxReady && numbersReady && customerRows.length > 0,
          setupIssue: false,
        };
      } catch (error) {
        console.error('[FunctionsPage] billing readiness unavailable', error instanceof Error ? error.message : error);
        premiumState.billing = { ready: false, setupIssue: true };
      }
    }
  }
  return <FunctionsClient i18nEnabled={i18nEnabled} bookingEnabled={bookingEnabled} bookingRequested={bookingRequested} shopEnabled={shopEnabled} billingEnabled={billingEnabled} featureUsage={featureUsage} premiumState={premiumState} />;
}
