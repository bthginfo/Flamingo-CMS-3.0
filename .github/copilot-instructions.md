# Flamingo CMS – AI Instructions

## Architecture

Monorepo (Turborepo + pnpm) with two apps:

- **`apps/renderer`** – Unified Next.js 15 app containing:
  - Frontend (tenant websites served per custom domain)
  - Admin panel (`/admin/*`)
  - Preview route (`/preview/*`)
- **`apps/marketing`** – Marketing site + CRM (`/crm/*`)

Shared packages: `@flamingo/db` (Drizzle ORM), `@flamingo/schemas` (Zod), `@flamingo/auth` (JWT).

## Style System (IMPORTANT)

The renderer supports **3 distinct visual styles**: `classic`, `modern`, `bold`.

Each tenant selects a style in Admin > Marke. The style is passed as `styleVariant` prop to every section component via `SectionRenderer`.

### Design Principles per Style

| | Classic | Modern | Bold |
|---|---|---|---|
| **Ecken** | Rund (1rem), Pill-Buttons (9999px) | Subtle (0.5rem) | Scharf (0) |
| **Buttons** | Pill, Gradient-Shimmer, soft shadow | Underline-links or subtle rounded | Eckig, uppercase, hard-offset shadow |
| **Schatten** | Weich (blur) | Keine (nur feine Borders) | Hard-Offset (4-8px solid) |
| **Headings** | font-weight: 700, normal case | font-weight: 500 (light), tight tracking | font-weight: 900, UPPERCASE, wide tracking |
| **Spacing** | Normal (5rem sections) | Großzügig (7rem), line-height 1.8 | Eng (4rem), dense |
| **Cards** | Rounded, soft shadow, hover-lift | Borderless or thin bottom-line | Thick border (3px), offset shadow |
| **Badges** | Glasmorphism pill | Text + pipe divider | Solid accent background, eckig |
| **Section BG** | White/Slate alternating | Pure white + subtle gray | White, accent blocks for contrast |
| **Overall Feel** | Vertrauenswürdig, warm | Minimalistisch, editorial | Kräftig, dynamisch, brutalist |

### Implementation Pattern

Each section component (hero, services-grid, testimonials, team, cta-band, process-steps, faq, service-detail) has 3 internal sub-components:

```tsx
export function XyzSection({ data, styleVariant }: Props) {
  if (styleVariant === 'modern') return <XyzModern {...parsed} />;
  if (styleVariant === 'bold') return <XyzBold {...parsed} />;
  return <XyzClassic {...parsed} />;
}
```

**Rules:**
- ALL data fields must be rendered in ALL variants. Never hide CMS content based on style.
- Each variant must be visually distinct — different layout, typography, spacing, NOT just tweaked CSS values.
- Classic = rounded, warm, trustworthy. Modern = clean, minimal, editorial. Bold = sharp, aggressive, brutalist.
- CSS custom properties (`--style-*`) are set on the `[data-style]` wrapper via inline styles.
- Global CSS overrides in `globals.css` remap Tailwind utilities (`rounded-*`, `shadow-*`) within `[data-style]`.

### Adding new section types

1. Create component in `apps/renderer/src/templates/handwerk/`
2. Register in `apps/renderer/src/components/section-renderer.tsx`
3. Implement ALL 3 style variants
4. Add admin editor in `section-data-editor.tsx`

## Save Flow

### Settings Pages (Brand, Contact, SEO, Navigation, etc.)
- Each has its own "Speichern" button
- On save: calls server action → toast success → `markSaved()` from `useSaveState()`
- Global `PublishFab` appears after save with "Vorschau" + "Veröffentlichen"

### Page Editor (`/admin/pages/[id]`)
- Has its own inline FAB: "Speichern" → after save shows "Vorschau" + "Veröffentlichen"
- Does NOT use the global PublishFab (handles everything locally)

### SaveContext
- `SaveProvider` wraps the admin layout
- `useSaveState()` returns `{ state, markDirty, markSaving, markSaved, reset }`
- States: `idle` → `dirty` → `saving` → `saved`

### Publishing
- `publishAction()` creates a new snapshot from current DB state
- Snapshot = frozen copy of all pages, sections, navigation, footer, brand

## Provisioning (CRM)

Located in `apps/marketing/src/lib/provisioning.ts`. 10-step pipeline:
1. Create tenant in DB
2. Hash password
3. Create settings (brand, nav, footer)
4. Create homepage + contact page
5. Publish initial snapshot
6. Add domain to renderer Vercel project
7. Activate tenant

Environment: `VERCEL_RENDERER_PROJECT` points to the single renderer Vercel project. All tenants share this project with custom domains.

## Key Conventions

- All admin routes are under `/admin/*`
- Auth: JWT cookie (`@flamingo/auth`), demo mode via `_dt` URL param
- DB: Drizzle ORM + Neon Postgres, schema in `packages/db/src/schema.ts`
- Uploads: Vercel Blob (`@vercel/blob`)
- No onChange auto-save pattern — all forms have explicit "Speichern" button
- After save → global FAB shows Vorschau + Veröffentlichen
- `section.variant` (meta field on each section) is legacy — do NOT use for style branching
- `styleVariant` prop (from tenant settings) is the correct way to branch styles
