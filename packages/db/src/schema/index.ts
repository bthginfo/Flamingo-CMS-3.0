import { pgTable, uuid, varchar, text, boolean, integer, jsonb, timestamp, uniqueIndex, index, pgEnum } from 'drizzle-orm/pg-core';

// ─── Enums ────────────────────────────────────────────────────────────
export const industryEnum = pgEnum('industry', [
  'tradesman', 'restaurant', 'salon', 'hotel', 'tourism',
  'consulting', 'medical', 'fitness', 'wedding', 'cafe', 'bar',
]);

export const tenantStatusEnum = pgEnum('tenant_status', ['active', 'suspended', 'provisioning']);
export const deploymentModeEnum = pgEnum('deployment_mode', ['shared', 'standalone']);
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

// ─── 1. tenants ───────────────────────────────────────────────────────
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  industry: industryEnum('industry').notNull(),
  activeStyle: varchar('active_style', { length: 50 }).notNull().default('classic'),
  status: tenantStatusEnum('status').notNull().default('active'),
  isDemo: boolean('is_demo').notNull().default(false),
  deploymentMode: deploymentModeEnum('deployment_mode').notNull().default('shared'),
  vercelProjectId: varchar('vercel_project_id', { length: 255 }),
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
