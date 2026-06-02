import { pgTable, uuid, varchar, text, boolean, integer, jsonb, timestamp, uniqueIndex, index, pgEnum, numeric } from 'drizzle-orm/pg-core';

// ─── Enums ────────────────────────────────────────────────────────────
export const industryEnum = pgEnum('industry', [
  'tradesman', 'restaurant', 'salon', 'hotel', 'tourism',
  'consulting', 'medical', 'fitness', 'wedding', 'cafe', 'bar', 'photography', 'realestate', 'tattoo', 'ecommerce', 'retail', 'florist', 'location',
]);

export const tenantStatusEnum = pgEnum('tenant_status', ['active', 'suspended', 'provisioning']);
export const deploymentModeEnum = pgEnum('deployment_mode', ['shared', 'lead_shared', 'standalone']);
export const domainTypeEnum = pgEnum('domain_type', ['primary', 'alias', 'preview']);
export const pageTypeEnum = pgEnum('page_type', ['free', 'collection_overview', 'legal', 'system']);
export const pageStatusEnum = pgEnum('page_status', ['draft', 'published', 'archived']);
export const draftStatusEnum = pgEnum('draft_status', ['dirty', 'saved', 'validated']);
export const publishActionEnum = pgEnum('publish_action', ['publish', 'rollback', 'unpublish']);
export const scriptCategoryEnum = pgEnum('script_category', ['necessary', 'functional', 'analytics', 'marketing']);
export const scriptPlacementEnum = pgEnum('script_placement', ['head', 'body_start', 'body_end']);
export const routeEntityTypeEnum = pgEnum('route_entity_type', ['page', 'collection_item']);
export const routeStatusEnum = pgEnum('route_status', ['active', 'redirect', 'gone']);
export const actorTypeEnum = pgEnum('actor_type', ['admin', 'system', 'api']);

// ─── Shop Enums ───────────────────────────────────────────────────────
export const productStatusEnum = pgEnum('product_status', ['draft', 'active', 'archived']);
export const orderStatusEnum = pgEnum('order_status', ['awaiting_payment', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']);
export const couponTypeEnum = pgEnum('coupon_type', ['percent', 'fixed_amount', 'free_shipping']);
export const couponAppliesToEnum = pgEnum('coupon_applies_to', ['all', 'specific_products', 'specific_categories']);
export const promotionTypeEnum = pgEnum('promotion_type', ['free_shipping_above', 'buy_x_get_discount', 'bundle_discount', 'quantity_discount', 'first_order_discount', 'spend_x_save_y']);
export const discountTypeEnum = pgEnum('discount_type', ['percent', 'fixed']);

// Booking addon enums
export const bookingModeEnum = pgEnum('booking_mode', ['request', 'instant']);
export const bookingTimeModelEnum = pgEnum('booking_time_model', ['time_slot', 'full_day', 'date_range']);
export const bookingResourceTypeEnum = pgEnum('booking_resource_type', ['table', 'room', 'space', 'room_unit', 'staff', 'equipment', 'generic']);
export const bookingStatusEnum = pgEnum('booking_status', ['requested', 'confirmed', 'cancelled_by_customer', 'cancelled_by_admin', 'completed', 'no_show']);
export const bookingActorEnum = pgEnum('booking_actor', ['customer', 'admin', 'system']);
export const bookingEmailTriggerEnum = pgEnum('booking_email_trigger', ['booking_requested_customer', 'booking_requested_admin', 'booking_confirmed_customer', 'booking_cancelled_customer', 'booking_cancelled_admin']);

// ─── 1. tenants ───────────────────────────────────────────────────────
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  industry: industryEnum('industry').notNull(),
  activeStyle: varchar('active_style', { length: 50 }).notNull().default('classic'),
  status: tenantStatusEnum('status').notNull().default('active'),
  isDemo: boolean('is_demo').notNull().default(false),
  isLead: boolean('is_lead').notNull().default(false),
  deploymentMode: deploymentModeEnum('deployment_mode').notNull().default('shared'),
  vercelProjectId: varchar('vercel_project_id', { length: 255 }),
  // i18n
  i18nEnabled: boolean('i18n_enabled').notNull().default(false),
  i18nMaxLanguages: integer('i18n_max_languages').notNull().default(2),
  i18nDefaultLocale: varchar('i18n_default_locale', { length: 10 }).notNull().default('de'),
  i18nLocales: text('i18n_locales').notNull().default('de'), // comma-separated: "de,en,fr"
  i18nSwitcherStyle: varchar('i18n_switcher_style', { length: 20 }).notNull().default('dropdown'), // dropdown | flags | text
  i18nSwitcherPosition: varchar('i18n_switcher_position', { length: 20 }).notNull().default('nav-right'), // nav-left | nav-right | footer
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── 2. tenant_domains ────────────────────────────────────────────────
export const tenantDomains = pgTable('tenant_domains', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  domain: varchar('domain', { length: 255 }).notNull(),
  type: domainTypeEnum('type').notNull().default('primary'),
  verified: boolean('verified').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('tenant_domains_domain_idx').on(t.domain),
  index('tenant_domains_tenant_idx').on(t.tenantId),
]);

// ─── 3. admin_secrets ─────────────────────────────────────────────────
export const adminSecrets = pgTable('admin_secrets', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  passwordHash: text('password_hash').notNull(),
  passwordUpdatedAt: timestamp('password_updated_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('admin_secrets_tenant_idx').on(t.tenantId),
]);

// ─── 4. global_settings ──────────────────────────────────────────────
export const globalSettings = pgTable('global_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  brand: jsonb('brand').$type<Record<string, unknown>>().default({}),
  contact: jsonb('contact').$type<Record<string, unknown>>().default({}),
  openingHours: jsonb('opening_hours').$type<Record<string, unknown>[]>().default([]),
  socialLinks: jsonb('social_links').$type<Record<string, unknown>>().default({}),
  design: jsonb('design').$type<Record<string, unknown>>().default({}),
  banners: jsonb('banners').$type<Record<string, unknown>[]>().default([]),
  smtp: jsonb('smtp').$type<{ host: string; port: number; user: string; pass: string; from: string } | null>().default(null),
  autoResponse: jsonb('auto_response').$type<{ enabled: boolean; subject: string; body: string } | null>().default(null),
  formFields: jsonb('form_fields').$type<{ name: string; label: string; type: string; placeholder?: string; required?: boolean; options?: string[]; halfWidth?: boolean }[] | null>().default(null),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('global_settings_tenant_idx').on(t.tenantId),
]);

// ─── 5. navigation ───────────────────────────────────────────────────
export const navigation = pgTable('navigation', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  items: jsonb('items').$type<Record<string, unknown>[]>().default([]),
  cta: jsonb('cta').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('navigation_tenant_idx').on(t.tenantId),
]);

// ─── 6. footer ───────────────────────────────────────────────────────
export const footer = pgTable('footer', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  columns: jsonb('columns').$type<Record<string, unknown>[]>().default([]),
  legalLinks: jsonb('legal_links').$type<Record<string, unknown>[]>().default([]),
  cta: jsonb('cta').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('footer_tenant_idx').on(t.tenantId),
]);

// ─── 7. pages ────────────────────────────────────────────────────────
export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  type: pageTypeEnum('type').notNull().default('free'),
  status: pageStatusEnum('status').notNull().default('draft'),
  visible: boolean('visible').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('pages_tenant_slug_idx').on(t.tenantId, t.slug),
  index('pages_tenant_idx').on(t.tenantId),
]);

// ─── 8. page_sections ────────────────────────────────────────────────
export const pageSections = pgTable('page_sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  pageId: uuid('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 100 }).notNull(),
  variant: varchar('variant', { length: 50 }),
  titleInternal: varchar('title_internal', { length: 255 }),
  visible: boolean('visible').notNull().default(true),
  locked: boolean('locked').notNull().default(false),
  container: varchar('container', { length: 20 }).notNull().default('default'),
  spacingTop: varchar('spacing_top', { length: 10 }).notNull().default('m'),
  spacingBottom: varchar('spacing_bottom', { length: 10 }).notNull().default('m'),
  anchorId: varchar('anchor_id', { length: 100 }),
  styleOverrides: jsonb('style_overrides').$type<Record<string, unknown>>(),
  data: jsonb('data').$type<Record<string, unknown>>().notNull().default({}),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('page_sections_page_idx').on(t.pageId),
  index('page_sections_tenant_idx').on(t.tenantId),
]);

// ─── 9. draft_states ─────────────────────────────────────────────────
export const draftStates = pgTable('draft_states', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: uuid('entity_id').notNull(),
  data: jsonb('data').$type<Record<string, unknown>>().notNull(),
  status: draftStatusEnum('status').notNull().default('dirty'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('draft_states_entity_idx').on(t.tenantId, t.entityType, t.entityId),
  index('draft_states_tenant_idx').on(t.tenantId),
]);

// ─── 10. published_snapshots ─────────────────────────────────────────
export const publishedSnapshots = pgTable('published_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  version: integer('version').notNull(),
  snapshot: jsonb('snapshot').$type<Record<string, unknown>>().notNull(),
  checksum: varchar('checksum', { length: 64 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: varchar('created_by', { length: 100 }),
  isActive: boolean('is_active').notNull().default(false),
}, (t) => [
  index('published_snapshots_active_idx').on(t.tenantId, t.isActive),
  index('published_snapshots_tenant_idx').on(t.tenantId),
]);

// ─── 11. publish_history ─────────────────────────────────────────────
export const publishHistory = pgTable('publish_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  snapshotId: uuid('snapshot_id').notNull().references(() => publishedSnapshots.id),
  previousSnapshotId: uuid('previous_snapshot_id').references(() => publishedSnapshots.id),
  action: publishActionEnum('action').notNull(),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('publish_history_tenant_idx').on(t.tenantId),
]);

// ─── 12. seo_global ──────────────────────────────────────────────────
export const seoGlobal = pgTable('seo_global', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  defaultTitle: varchar('default_title', { length: 70 }),
  titleTemplate: varchar('title_template', { length: 100 }),
  defaultDescription: varchar('default_description', { length: 170 }),
  defaultOgImage: text('default_og_image'),
  canonicalBase: varchar('canonical_base', { length: 255 }),
  locale: varchar('locale', { length: 10 }).notNull().default('de_DE'),
  robots: varchar('robots', { length: 255 }).notNull().default('index,follow'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('seo_global_tenant_idx').on(t.tenantId),
]);

// ─── 13. seo_page ────────────────────────────────────────────────────
export const seoPage = pgTable('seo_page', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  pageId: uuid('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  metaTitle: varchar('meta_title', { length: 70 }),
  metaDescription: varchar('meta_description', { length: 170 }),
  ogImage: text('og_image'),
  canonical: text('canonical'),
  noindex: boolean('noindex').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('seo_page_page_idx').on(t.tenantId, t.pageId),
]);

// ─── 14. seo_item ────────────────────────────────────────────────────
export const seoItem = pgTable('seo_item', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  collectionItemId: uuid('collection_item_id').notNull().references(() => collectionItems.id, { onDelete: 'cascade' }),
  metaTitle: varchar('meta_title', { length: 70 }),
  metaDescription: varchar('meta_description', { length: 170 }),
  ogImage: text('og_image'),
  canonical: text('canonical'),
  noindex: boolean('noindex').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('seo_item_idx').on(t.tenantId, t.collectionItemId),
]);

// ─── 15. scripts ─────────────────────────────────────────────────────
export const scripts = pgTable('scripts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  category: scriptCategoryEnum('category').notNull(),
  placement: scriptPlacementEnum('placement').notNull().default('head'),
  code: text('code').notNull(),
  enabled: boolean('enabled').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('scripts_tenant_category_idx').on(t.tenantId, t.category),
]);

// ─── 16. consent_categories ──────────────────────────────────────────
export const consentCategories = pgTable('consent_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  key: varchar('key', { length: 50 }).notNull(),
  label: varchar('label', { length: 100 }).notNull(),
  description: text('description'),
  required: boolean('required').notNull().default(false),
  enabled: boolean('enabled').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('consent_categories_key_idx').on(t.tenantId, t.key),
]);

// ─── 17. media_assets ────────────────────────────────────────────────
export const mediaAssets = pgTable('media_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  blobUrl: text('blob_url').notNull(),
  pathname: varchar('pathname', { length: 500 }).notNull(),
  filename: varchar('filename', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(),
  width: integer('width'),
  height: integer('height'),
  alt: text('alt'),
  caption: text('caption'),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('media_assets_tenant_idx').on(t.tenantId),
  index('media_assets_mime_idx').on(t.tenantId, t.mimeType),
]);

// ─── 18. collections ─────────────────────────────────────────────────
export const collections = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  key: varchar('key', { length: 100 }).notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  schema: jsonb('schema').$type<Record<string, unknown>>().default({}),
  settings: jsonb('settings').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('collections_tenant_key_idx').on(t.tenantId, t.key),
]);

// ─── 19. collection_items ────────────────────────────────────────────
export const collectionItems = pgTable('collection_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  collectionId: uuid('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
  slug: varchar('slug', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  data: jsonb('data').$type<Record<string, unknown>>().notNull().default({}),
  published: boolean('published').notNull().default(false),
  priority: integer('priority').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('collection_items_slug_idx').on(t.tenantId, t.collectionId, t.slug),
  index('collection_items_tenant_idx').on(t.tenantId),
  index('collection_items_collection_idx').on(t.collectionId),
]);

// ─── 20. routes ──────────────────────────────────────────────────────
export const routes = pgTable('routes', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  path: varchar('path', { length: 500 }).notNull(),
  entityType: routeEntityTypeEnum('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  collectionKey: varchar('collection_key', { length: 100 }),
  status: routeStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('routes_tenant_path_idx').on(t.tenantId, t.path),
  index('routes_tenant_idx').on(t.tenantId),
]);

// ─── 21. audit_log ───────────────────────────────────────────────────
export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  actorType: actorTypeEnum('actor_type').notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: uuid('entity_id'),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('audit_log_tenant_idx').on(t.tenantId),
  index('audit_log_entity_idx').on(t.entityType, t.entityId),
]);

// ─── 22. form_submissions ────────────────────────────────────────────
export const submissionStatusEnum = pgEnum('submission_status', ['new', 'read', 'archived']);

export const formSubmissions = pgTable('form_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 320 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  message: text('message').notNull(),
  page: varchar('page', { length: 200 }),
  status: submissionStatusEnum('status').notNull().default('new'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('form_submissions_tenant_idx').on(t.tenantId),
  index('form_submissions_status_idx').on(t.tenantId, t.status),
]);

// ─── RSVP Responses (Wedding) ────────────────────────────────────────
export const rsvpResponses = pgTable('rsvp_responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  attending: boolean('attending').notNull().default(true),
  guestCount: integer('guest_count').notNull().default(1),
  guestNames: text('guest_names'),
  dietary: varchar('dietary', { length: 100 }),
  allergies: text('allergies'),
  songWish: varchar('song_wish', { length: 255 }),
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('rsvp_responses_tenant_idx').on(t.tenantId),
]);

// ─── Reservations (Restaurant/General) ───────────────────────────────
export const reservations = pgTable('reservations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  date: varchar('date', { length: 20 }).notNull(),
  time: varchar('time', { length: 10 }),
  guests: integer('guests').notNull().default(2),
  message: text('message'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('reservations_tenant_idx').on(t.tenantId),
]);

// ─── Tenant API Tokens (PAT for AI content fill) ─────────────────────
export const tenantApiTokens = pgTable('tenant_api_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  tokenHash: varchar('token_hash', { length: 128 }).notNull(),
  label: varchar('label', { length: 100 }).notNull().default('AI Content Token'),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  revoked: boolean('revoked').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('tenant_api_tokens_tenant_idx').on(t.tenantId),
  index('tenant_api_tokens_hash_idx').on(t.tokenHash),
]);

// ─── CRM Leads ───────────────────────────────────────────────────────
export const leadStatusEnum = pgEnum('lead_status', ['offen', 'kontaktiert', 'angenommen', 'abgelehnt']);

export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  company: varchar('company', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  status: leadStatusEnum('status').notNull().default('offen'),
  location: varchar('location', { length: 255 }),
  websiteOld: varchar('website_old', { length: 500 }),
  flamingoLink: varchar('flamingo_link', { length: 500 }),
  contact: varchar('contact', { length: 255 }),
  contactFirstName: varchar('contact_first_name', { length: 100 }),
  contactLastName: varchar('contact_last_name', { length: 100 }),
  anrede: varchar('anrede', { length: 10 }),
  responsible: varchar('responsible', { length: 100 }),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'set null' }),
  adminPassword: varchar('admin_password', { length: 100 }),
  industry: varchar('industry', { length: 200 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── FlamingoMedia CRM Customers ─────────────────────────────────────
export const crmCustomerStatusEnum = pgEnum('crm_customer_status', ['aktiv', 'pausiert', 'gekündigt']);
export const crmPaymentStatusEnum = pgEnum('crm_payment_status', ['offen', 'bezahlt', 'überfällig', 'storniert']);
export const crmBlogPostStatusEnum = pgEnum('crm_blog_post_status', ['draft', 'published', 'archived']);

export const crmCustomers = pgTable('crm_customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  company: varchar('company', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  status: crmCustomerStatusEnum('status').notNull().default('aktiv'),
  location: varchar('location', { length: 255 }),
  industry: varchar('industry', { length: 200 }),
  websiteOld: varchar('website_old', { length: 500 }),
  flamingoLink: varchar('flamingo_link', { length: 500 }),
  contact: varchar('contact', { length: 255 }),
  contactFirstName: varchar('contact_first_name', { length: 100 }),
  contactLastName: varchar('contact_last_name', { length: 100 }),
  anrede: varchar('anrede', { length: 10 }),
  responsible: varchar('responsible', { length: 100 }),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'set null' }),
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'set null' }),
  adminPassword: varchar('admin_password', { length: 100 }),
  packageName: varchar('package_name', { length: 120 }),
  setupPriceCents: integer('setup_price_cents').notNull().default(0),
  hostingMonthlyCents: integer('hosting_monthly_cents').notNull().default(0),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('crm_customers_company_idx').on(t.company),
  index('crm_customers_status_idx').on(t.status),
  index('crm_customers_lead_idx').on(t.leadId),
]);

export const crmCustomerPayments = pgTable('crm_customer_payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').notNull().references(() => crmCustomers.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull().default('setup'),
  title: varchar('title', { length: 255 }).notNull(),
  amountCents: integer('amount_cents').notNull(),
  status: crmPaymentStatusEnum('status').notNull().default('offen'),
  dueDate: timestamp('due_date', { withTimezone: true }),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('crm_customer_payments_customer_idx').on(t.customerId),
  index('crm_customer_payments_status_idx').on(t.status),
]);

export const crmBlogPosts = pgTable('crm_blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 180 }).notNull(),
  title: varchar('title', { length: 180 }).notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  status: crmBlogPostStatusEnum('status').notNull().default('draft'),
  category: varchar('category', { length: 120 }),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  coverImage: varchar('cover_image', { length: 700 }),
  coverAlt: varchar('cover_alt', { length: 255 }),
  authorName: varchar('author_name', { length: 120 }).notNull().default('FlamingoMedia'),
  metaTitle: varchar('meta_title', { length: 180 }),
  metaDescription: varchar('meta_description', { length: 260 }),
  ogImage: varchar('og_image', { length: 700 }),
  canonicalPath: varchar('canonical_path', { length: 255 }),
  readingMinutes: integer('reading_minutes').notNull().default(1),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('crm_blog_posts_slug_idx').on(t.slug),
  index('crm_blog_posts_status_idx').on(t.status),
  index('crm_blog_posts_published_idx').on(t.publishedAt),
]);

// ═══════════════════════════════════════════════════════════════════════
// ─── SHOP ADDON TABLES ───────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════

// ─── tenant_addons ───────────────────────────────────────────────────
export const tenantAddons = pgTable('tenant_addons', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  addonKey: varchar('addon_key', { length: 50 }).notNull(),
  active: boolean('active').notNull().default(false),
  activatedAt: timestamp('activated_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('tenant_addons_tenant_key_idx').on(t.tenantId, t.addonKey),
]);

// ─── shop_settings ───────────────────────────────────────────────────
export const shopSettings = pgTable('shop_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  currency: varchar('currency', { length: 10 }).notNull().default('EUR'),
  currencySymbol: varchar('currency_symbol', { length: 5 }).notNull().default('€'),
  paymentMethods: jsonb('payment_methods').$type<string[]>().default([]),
  bankDetails: jsonb('bank_details').$type<{ iban: string; bic: string; bankName: string; accountHolder: string } | null>().default(null),
  pickupEnabled: boolean('pickup_enabled').notNull().default(false),
  pickupInstructions: text('pickup_instructions'),
  stripePublicKey: varchar('stripe_public_key', { length: 255 }),
  stripeSecretKey: varchar('stripe_secret_key', { length: 255 }),
  stripeWebhookSecret: varchar('stripe_webhook_secret', { length: 255 }),
  paypalClientId: varchar('paypal_client_id', { length: 255 }),
  paypalSecret: varchar('paypal_secret', { length: 255 }),
  paypalMode: varchar('paypal_mode', { length: 10 }).notNull().default('sandbox'),
  sumupApiKey: varchar('sumup_api_key', { length: 255 }),
  sumupMerchantCode: varchar('sumup_merchant_code', { length: 100 }),
  sumupMode: varchar('sumup_mode', { length: 10 }).notNull().default('sandbox'),
  orderPrefix: varchar('order_prefix', { length: 10 }).notNull().default('FM'),
  invoicePrefix: varchar('invoice_prefix', { length: 10 }).notNull().default('RE'),
  nextOrderNumber: integer('next_order_number').notNull().default(1),
  nextInvoiceNumber: integer('next_invoice_number').notNull().default(1),
  notificationEmail: varchar('notification_email', { length: 255 }),
  lowStockThreshold: integer('low_stock_threshold').notNull().default(5),
  companyInfo: jsonb('company_info').$type<{ name: string; street: string; zip: string; city: string; country: string; email?: string; phone?: string; taxId?: string; vatId?: string; registerCourt?: string; registerNumber?: string; ceo?: string } | null>().default(null),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('shop_settings_tenant_idx').on(t.tenantId),
]);

// ─── product_categories ──────────────────────────────────────────────
export const productCategories = pgTable('product_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  image: varchar('image', { length: 500 }),
  parentId: uuid('parent_id'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('product_categories_tenant_slug_idx').on(t.tenantId, t.slug),
  index('product_categories_tenant_idx').on(t.tenantId),
]);

// ─── products ────────────────────────────────────────────────────────
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').references(() => productCategories.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description').notNull().default(''),
  shortDescription: varchar('short_description', { length: 500 }),
  priceCents: integer('price_cents').notNull(),
  comparePriceCents: integer('compare_price_cents'),
  currency: varchar('currency', { length: 10 }).notNull().default('EUR'),
  sku: varchar('sku', { length: 100 }),
  stock: integer('stock').notNull().default(0),
  trackStock: boolean('track_stock').notNull().default(true),
  isDigital: boolean('is_digital').notNull().default(false),
  digitalFileUrl: varchar('digital_file_url', { length: 500 }),
  status: productStatusEnum('status').notNull().default('draft'),
  images: jsonb('images').$type<string[]>().default([]),
  weightGrams: integer('weight_grams'),
  taxClass: varchar('tax_class', { length: 50 }).notNull().default('standard'),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: varchar('meta_description', { length: 500 }),
  highlights: jsonb('highlights').$type<string[]>().default([]),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('products_tenant_slug_idx').on(t.tenantId, t.slug),
  index('products_tenant_idx').on(t.tenantId),
  index('products_category_idx').on(t.categoryId),
]);

// ─── product_variants ────────────────────────────────────────────────
export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  sku: varchar('sku', { length: 100 }),
  priceCents: integer('price_cents'),
  stock: integer('stock').notNull().default(0),
  attributes: jsonb('attributes').$type<Record<string, string>>().default({}),
  image: varchar('image', { length: 500 }),
  sortOrder: integer('sort_order').notNull().default(0),
}, (t) => [
  uniqueIndex('product_variants_unique_idx').on(t.tenantId, t.productId, t.name),
  index('product_variants_product_idx').on(t.productId),
]);

// ─── variant_options ─────────────────────────────────────────────────
export const variantOptions = pgTable('variant_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  values: jsonb('values').$type<string[]>().default([]),
  sortOrder: integer('sort_order').notNull().default(0),
}, (t) => [
  index('variant_options_product_idx').on(t.productId),
]);

// ─── tax_rates ───────────────────────────────────────────────────────
export const taxRates = pgTable('tax_rates', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  rate: numeric('rate', { precision: 5, scale: 2 }).notNull(),
  country: varchar('country', { length: 2 }).notNull().default('DE'),
  region: varchar('region', { length: 100 }),
  isDefault: boolean('is_default').notNull().default(false),
  appliesToShipping: boolean('applies_to_shipping').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('tax_rates_tenant_name_country_idx').on(t.tenantId, t.name, t.country),
]);

// ─── shipping_zones ──────────────────────────────────────────────────
export const shippingZones = pgTable('shipping_zones', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  countries: jsonb('countries').$type<string[]>().default([]),
  sortOrder: integer('sort_order').notNull().default(0),
}, (t) => [
  index('shipping_zones_tenant_idx').on(t.tenantId),
]);

// ─── shipping_methods ────────────────────────────────────────────────
export const shippingMethods = pgTable('shipping_methods', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  zoneId: uuid('zone_id').notNull().references(() => shippingZones.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  priceCents: integer('price_cents').notNull(),
  freeAboveCents: integer('free_above_cents'),
  minWeightGrams: integer('min_weight_grams'),
  maxWeightGrams: integer('max_weight_grams'),
  estimatedDays: varchar('estimated_days', { length: 50 }),
  active: boolean('active').notNull().default(true),
}, (t) => [
  index('shipping_methods_zone_idx').on(t.zoneId),
]);

// ─── coupons ─────────────────────────────────────────────────────────
export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  code: varchar('code', { length: 50 }).notNull(),
  type: couponTypeEnum('type').notNull(),
  value: integer('value').notNull(),
  minOrderCents: integer('min_order_cents'),
  maxUses: integer('max_uses'),
  usedCount: integer('used_count').notNull().default(0),
  maxUsesPerCustomer: integer('max_uses_per_customer'),
  appliesTo: couponAppliesToEnum('applies_to').notNull().default('all'),
  appliesToIds: jsonb('applies_to_ids').$type<string[]>().default([]),
  validFrom: timestamp('valid_from', { withTimezone: true }),
  validUntil: timestamp('valid_until', { withTimezone: true }),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('coupons_tenant_code_idx').on(t.tenantId, t.code),
]);

// ─── promotions ──────────────────────────────────────────────────────
export const promotions = pgTable('promotions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: promotionTypeEnum('type').notNull(),
  conditions: jsonb('conditions').$type<Record<string, unknown>>().default({}),
  discountValue: integer('discount_value').notNull(),
  discountType: discountTypeEnum('discount_type').notNull(),
  active: boolean('active').notNull().default(true),
  validFrom: timestamp('valid_from', { withTimezone: true }),
  validUntil: timestamp('valid_until', { withTimezone: true }),
  stackable: boolean('stackable').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('promotions_tenant_idx').on(t.tenantId),
]);

// ─── orders ──────────────────────────────────────────────────────────
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  orderNumber: varchar('order_number', { length: 50 }).notNull(),
  status: orderStatusEnum('status').notNull().default('pending'),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }),
  shippingAddress: jsonb('shipping_address').$type<{ street: string; city: string; zip: string; country: string; company?: string }>(),
  billingAddress: jsonb('billing_address').$type<{ street: string; city: string; zip: string; country: string; company?: string }>(),
  items: jsonb('items').$type<{ productId: string; variantId?: string; title: string; variantName?: string; quantity: number; priceCents: number; taxRate: number }[]>().notNull().default([]),
  subtotalCents: integer('subtotal_cents').notNull(),
  shippingCents: integer('shipping_cents').notNull().default(0),
  discountCents: integer('discount_cents').notNull().default(0),
  taxCents: integer('tax_cents').notNull(),
  totalCents: integer('total_cents').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentId: varchar('payment_id', { length: 255 }),
  paymentStatus: varchar('payment_status', { length: 50 }),
  shippingMethod: varchar('shipping_method', { length: 255 }),
  trackingNumber: varchar('tracking_number', { length: 255 }),
  trackingUrl: varchar('tracking_url', { length: 500 }),
  couponCode: varchar('coupon_code', { length: 50 }),
  notes: text('notes'),
  customerNotes: text('customer_notes'),
  idempotencyKey: varchar('idempotency_key', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('orders_tenant_number_idx').on(t.tenantId, t.orderNumber),
  index('orders_tenant_idx').on(t.tenantId),
  index('orders_status_idx').on(t.tenantId, t.status),
  uniqueIndex('orders_idempotency_idx').on(t.tenantId, t.idempotencyKey),
]);

// ─── order_status_history ────────────────────────────────────────────
export const orderStatusHistory = pgTable('order_status_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  oldStatus: varchar('old_status', { length: 50 }),
  newStatus: varchar('new_status', { length: 50 }).notNull(),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('order_status_history_order_idx').on(t.orderId),
]);

// ─── Inquiries (FlamingoMedia CRM) ──────────────────────────────────
export const inquiryStatusEnum = pgEnum('inquiry_status', ['neu', 'gelesen', 'beantwortet', 'archiviert']);

export const inquiries = pgTable('inquiries', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 320 }).notNull(),
  branche: varchar('branche', { length: 100 }),
  paket: varchar('paket', { length: 100 }),
  message: text('message').notNull(),
  source: varchar('source', { length: 100 }),
  status: inquiryStatusEnum('status').notNull().default('neu'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('inquiries_status_idx').on(t.status),
]);

// ─── customers ───────────────────────────────────────────────────────
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  defaultShippingAddress: jsonb('default_shipping_address').$type<{ street: string; city: string; zip: string; country: string; company?: string }>(),
  defaultBillingAddress: jsonb('default_billing_address').$type<{ street: string; city: string; zip: string; country: string; company?: string }>(),
  orderCount: integer('order_count').notNull().default(0),
  totalSpentCents: integer('total_spent_cents').notNull().default(0),
  firstOrderAt: timestamp('first_order_at', { withTimezone: true }),
  lastOrderAt: timestamp('last_order_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('customers_tenant_email_idx').on(t.tenantId, t.email),
]);

// ─── invoices ────────────────────────────────────────────────────────
export const invoiceTypeEnum = pgEnum('invoice_type', ['invoice', 'credit_note']);

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull(),
  type: invoiceTypeEnum('type').notNull().default('invoice'),
  pdfUrl: varchar('pdf_url', { length: 500 }),
  amountNetCents: integer('amount_net_cents').notNull(),
  taxCents: integer('tax_cents').notNull(),
  amountGrossCents: integer('amount_gross_cents').notNull(),
  refInvoiceNumber: varchar('ref_invoice_number', { length: 50 }),
  issuedAt: timestamp('issued_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('invoices_tenant_number_idx').on(t.tenantId, t.invoiceNumber),
  index('invoices_order_idx').on(t.orderId),
]);

// ─── email_templates ─────────────────────────────────────────────────
export const bookingSettings = pgTable('booking_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  mode: bookingModeEnum('mode').notNull().default('request'),
  timeModel: bookingTimeModelEnum('time_model').notNull().default('time_slot'),
  timezone: varchar('timezone', { length: 80 }).notNull().default('Europe/Berlin'),
  intervalMinutes: integer('interval_minutes').notNull().default(30),
  minNoticeHours: integer('min_notice_hours').notNull().default(12),
  maxAdvanceDays: integer('max_advance_days').notNull().default(90),
  cancellationAllowed: boolean('cancellation_allowed').notNull().default(true),
  cancellationDeadlineHours: integer('cancellation_deadline_hours').notNull().default(24),
  notificationEmail: varchar('notification_email', { length: 255 }),
  customerEmailEnabled: boolean('customer_email_enabled').notNull().default(true),
  adminEmailEnabled: boolean('admin_email_enabled').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('booking_settings_tenant_idx').on(t.tenantId),
]);

export const bookingResources = pgTable('booking_resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  type: bookingResourceTypeEnum('type').notNull().default('generic'),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  capacity: integer('capacity').notNull().default(1),
  seats: integer('seats'),
  image: varchar('image', { length: 500 }),
  active: boolean('active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('booking_resources_tenant_idx').on(t.tenantId),
  index('booking_resources_tenant_active_idx').on(t.tenantId, t.active),
]);

export const bookingServices = pgTable('booking_services', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  durationMinutes: integer('duration_minutes'),
  timeModelOverride: bookingTimeModelEnum('time_model_override'),
  priceLabel: varchar('price_label', { length: 100 }),
  requiresResource: boolean('requires_resource').notNull().default(false),
  allowedResourceTypes: jsonb('allowed_resource_types').$type<string[]>().default([]),
  active: boolean('active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('booking_services_tenant_idx').on(t.tenantId),
  index('booking_services_tenant_active_idx').on(t.tenantId, t.active),
]);

export const bookingAvailabilityRules = pgTable('booking_availability_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  resourceId: uuid('resource_id').references(() => bookingResources.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').references(() => bookingServices.id, { onDelete: 'cascade' }),
  weekday: integer('weekday').notNull(),
  startTime: varchar('start_time', { length: 10 }).notNull(),
  endTime: varchar('end_time', { length: 10 }).notNull(),
  capacity: integer('capacity'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('booking_availability_tenant_idx').on(t.tenantId),
  index('booking_availability_lookup_idx').on(t.tenantId, t.weekday, t.active),
]);

export const bookingCalendarBlocks = pgTable('booking_calendar_blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  resourceId: uuid('resource_id').references(() => bookingResources.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').references(() => bookingServices.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 20 }).notNull().default('available'),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  capacity: integer('capacity'),
  note: varchar('note', { length: 255 }),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('booking_calendar_blocks_tenant_idx').on(t.tenantId),
  index('booking_calendar_blocks_lookup_idx').on(t.tenantId, t.startsAt, t.endsAt, t.active),
]);

export const bookingBlackouts = pgTable('booking_blackouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  resourceId: uuid('resource_id').references(() => bookingResources.id, { onDelete: 'cascade' }),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  reason: varchar('reason', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('booking_blackouts_tenant_idx').on(t.tenantId),
  index('booking_blackouts_lookup_idx').on(t.tenantId, t.startsAt, t.endsAt),
]);

export const bookingCustomers = pgTable('booking_customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 320 }),
  phone: varchar('phone', { length: 80 }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('booking_customers_tenant_idx').on(t.tenantId),
  index('booking_customers_tenant_email_idx').on(t.tenantId, t.email),
]);

export const bookingRequests = pgTable('booking_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id').references(() => bookingCustomers.id, { onDelete: 'set null' }),
  serviceId: uuid('service_id').references(() => bookingServices.id, { onDelete: 'set null' }),
  resourceId: uuid('resource_id').references(() => bookingResources.id, { onDelete: 'set null' }),
  mode: bookingModeEnum('mode').notNull().default('request'),
  timeModel: bookingTimeModelEnum('time_model').notNull().default('time_slot'),
  status: bookingStatusEnum('status').notNull().default('requested'),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerEmail: varchar('customer_email', { length: 320 }),
  customerPhone: varchar('customer_phone', { length: 80 }),
  partySize: integer('party_size').notNull().default(1),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  message: text('message'),
  cancellationTokenHash: varchar('cancellation_token_hash', { length: 128 }),
  cancellationReason: text('cancellation_reason'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('booking_requests_tenant_idx').on(t.tenantId),
  index('booking_requests_calendar_idx').on(t.tenantId, t.startsAt, t.endsAt),
  index('booking_requests_status_idx').on(t.tenantId, t.status),
]);

export const bookingStatusHistory = pgTable('booking_status_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  bookingId: uuid('booking_id').notNull().references(() => bookingRequests.id, { onDelete: 'cascade' }),
  fromStatus: bookingStatusEnum('from_status'),
  toStatus: bookingStatusEnum('to_status').notNull(),
  actor: bookingActorEnum('actor').notNull().default('system'),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('booking_status_history_booking_idx').on(t.bookingId),
  index('booking_status_history_tenant_idx').on(t.tenantId),
]);

export const emailTemplates = pgTable('email_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  trigger: varchar('trigger', { length: 50 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  body: text('body').notNull(),
  active: boolean('active').notNull().default(true),
}, (t) => [
  uniqueIndex('email_templates_tenant_trigger_idx').on(t.tenantId, t.trigger),
]);
