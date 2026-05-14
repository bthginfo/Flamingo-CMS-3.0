# Flamingo CMS – Copilot Instructions

## Architecture Overview

Flamingo CMS is a multi-tenant CMS monorepo (Turborepo + pnpm) with these apps:

| App | Port | Purpose |
|-----|------|---------|
| `apps/admin` | 3001 | Admin panel (Next.js 15) |
| `apps/renderer` | 3002 | Public website renderer (Next.js 15) |
| `apps/marketing` | 3000 | Marketing site (Next.js 15) |
| `apps/crm` | 3003 | CRM dashboard (Next.js 15) |

Shared packages: `packages/db` (Drizzle ORM + Neon Postgres), `packages/schemas` (Zod validation).

## ⚠️ CRITICAL: 100% Field Coverage Rule

**Every piece of text, image, link, or configurable value shown on the renderer (frontend) MUST be editable in the admin panel. No exceptions.**

### Mandatory Workflow for ANY Section/Template Change

1. **When adding a new renderer template field**: ALWAYS add a corresponding editor field in `section-data-editor.tsx`
2. **When adding a new admin editor field**: ALWAYS consume it in the renderer template
3. **NEVER hardcode user-facing text** in renderer templates. Use `data.fieldName` with a sensible fallback: `(data.myField as string) || 'Default'`
4. **After ANY template/editor change**: Verify the field appears in BOTH:
   - The admin editor's `onSave()` call (all keys must be present)
   - The renderer template's data destructuring
5. **Register new section types** in BOTH:
   - `section-data-editor.tsx` EDITORS registry
   - `section-renderer.tsx` SECTION_COMPONENTS registry

### Field Coverage Checklist (run mentally for every change)

```
□ Admin editor saves field X → renderer template reads field X
□ Renderer template reads field Y → admin editor exposes field Y
□ No hardcoded German text in renderer (use data fields with defaults)
□ Global elements (nav CTA, footer CTA, top bar) → editable via settings
□ Section meta (spacing, container, anchor, variant) → editable via SectionMetaEditor
```

## Section Architecture

### Admin Side
- **Section editors**: `apps/admin/src/app/admin/pages/[id]/section-data-editor.tsx`
  - Each section type has a dedicated editor function (e.g., `HeroEditor`, `FaqEditor`)
  - All editors are registered in the `EDITORS` map at the bottom
  - Each editor MUST include ALL fields in its `onSave()` call
- **Section meta**: `SectionMetaEditor` in `page-editor.tsx` handles spacing, container, variant, anchor
- **Global settings**: `settings-actions.ts` → brand, contact, social, navigation (with CTA), footer (with CTA)

### Renderer Side
- **Templates**: `apps/renderer/src/templates/handwerk/` — one file per section type
- **Section renderer**: `apps/renderer/src/components/section-renderer.tsx` — maps type→component
- **Global components**: `site-header.tsx` (nav + CTA + top bar), `site-footer.tsx` (footer + CTA)
- **Tenant data**: `apps/renderer/src/lib/tenant-data.ts` — loads brand, contact, nav, footer from DB

### Data Flow
```
Admin Editor → Server Action → DB (page_sections.data JSONB) → Publish Snapshot → Renderer reads snapshot → Template renders data
```

Global settings (brand, contact, nav, footer) are read LIVE from DB, not from snapshots.

## Current Section Types (19 total)

hero, uspStrip, servicesGrid, processSteps, testimonials, faq, ctaBand, contact, map, serviceDetail, portfolio, team, ctaLinks, newsPreview, stats, logoCloud, galleryGrid, richText, headerBanner

## Save & Publish Flow

1. Admin edits section → `updateSectionAction(sectionId, data, pageId)` → writes to DB + `revalidatePath`
2. Admin clicks "Veröffentlichen" → `publishAction()` → creates snapshot + revalidates renderer via `/api/revalidate`
3. **IMPORTANT**: Every server action that modifies data MUST call `revalidatePath()` with the correct path

## Style System

- Styles are defined in `apps/renderer/src/lib/styles.ts` as CSS custom properties per industry/style combo
- Applied inline on root div via `getStyleCssVars()`
- Consumed in `globals.css` component layer classes
- Style switching is immediate (reads from tenant table, not snapshot)

## Database

- Drizzle ORM with Neon Postgres
- Schema: `packages/db/src/schema/index.ts`
- Push schema: `cd packages/db && npx drizzle-kit push`
- Connection string in `DATABASE_URL` env var

## Deployment

- All apps deploy to Vercel via GitHub push (auto-deploy on main)
- Vercel team: `juliusvingelheim-2692s-projects`
- Renderer revalidation: POST `/api/revalidate` with `x-revalidate-secret` header

## Testing Expectations

- After ANY admin editor change, verify the field saves correctly and appears on the rendered page
- After ANY renderer template change, verify the field is editable in admin
- Run through ALL section types on the demo tenant to verify end-to-end
