# Marketing 1:1 Übernahme — Dateien & Dependencies

## Quell-Repo
`C:\Users\vonin-ju\myrep\company-template`

## Stack (Original)
- **Framework:** Vite 5 + React 18 SPA
- **Router:** react-router-dom 6.28
- **Styling:** Tailwind CSS 3.4.15
- **Animations:** Framer Motion 12.38, Lenis 1.3.23, OGL 1.0.11
- **Forms:** react-hook-form 7.54, zod 3.23
- **Toasts:** sonner 2.0.7
- **Confetti:** canvas-confetti 1.9.4
- **Fonts:** Google Fonts (Geist, Plus Jakarta Sans, Instrument Serif, Newsreader, Bricolage Grotesque, Space Grotesk, JetBrains Mono)
- **Build:** Vite + TypeScript 5.6

## Marketing-Routen

| Route | Komponente | Zeilen (in AgencyShowcase.tsx) |
|-------|-----------|-------------------------------|
| `/` | `Landing` → HeroSection, ClientLogosSection, ServicesSection, TemplatesPreviewSection, ManifestoSection, DeviceShowcaseSection, AdminPreviewSection, ProcessTimelineSection, ProductionSection, NumbersSection, TestimonialsSection, CalloutFooter | 493–1511 |
| `/prozess` | `ProcessPage` | 1691–1974 |
| `/preise` | `Pricing` | 2070–2231 |
| `/ueber-uns` | `AboutPage` | 1975–2069 |
| `/kontakt` | `Contact` | 2232–2328 |

## Benötigte Dateien

### Seiten & Layout (aus src/showcase/)
- `AgencyShowcase.tsx` — Monolith mit allen Pages + Shell (Nav, Footer, Layout)
- `Legal.tsx` — Impressum, Datenschutz
- `Blog.tsx` — Blog (optional, nicht Pflicht für 5 Marketing-Seiten)
- `Cases.tsx` — Case Studies (nur für Template-Preview)

### Komponenten (aus src/components/)
- `fx.tsx` — Marquee, AnimatedCounter, RotatingWord, ScrollProgress, Accordion, useReveal
- `motion-fx.tsx` — Tilt3DCard, MagneticButton
- `fx-21st.tsx` — SpotlightSection, AnimatedGridPattern, TextReveal, BentoCard
- `ContactForm.tsx` — Kontaktformular
- `CookieBanner.tsx` — DSGVO Cookie Banner
- `MouseGlow.tsx` — Pointer Glow Effekt
- `SmoothScroll.tsx` — Lenis Smooth Scroll
- `Seo.tsx` — SEO Meta-Tag Management
- `ShaderBackdrop.tsx` — OGL WebGL Shader (optional)

### Libraries (aus src/lib/)
- `theme.ts` — PRESETS, applyTheme, ThemePreset
- `types.ts` — SiteContent, TemplateKey
- `consent.tsx` — ConsentProvider, useConsent
- `scroll.ts` — scrollToTop
- `demo-content.ts` — DEMO_CONTENT (für Template-Previews auf der Landing)
- `demo-overrides.ts` — für Admin-Demo auf Landing

### Assets (aus public/)
- `brand/flamingo-full.png`
- `brand/flamingo-full-beside.png`
- `brand/flamingo-icon.png`
- `brand/flamingo-text-above.png`
- `brand/flamingo-text-above-v2.png`
- `brand/flamingo-text-beside.png`
- `team/julius.jpg`
- `team/mario.webp`
- `team/nikey.jpg`
- `og-image.svg`
- `favicon.svg`

### Styles
- `src/index.css` — Tailwind + Design Tokens + Showcase-Root Fonts + Template Styles
- `tailwind.config.ts` — Custom Colors, Fonts, Animations, Keyframes
- `postcss.config.js`

### Config
- `index.html` — Fonts, SEO Meta, JSON-LD Schema
- `vercel.json` — Build/Routing Config

## TECHNISCH NOTWENDIGE ANPASSUNGEN

### 1. react-router-dom → Next.js App Router
- `<Routes>/<Route>` → Dateibasiertes Routing (`app/(marketing)/page.tsx` etc.)
- `<Link to="...">` → `<Link href="...">`  (next/link)
- `useNavigate()` → `useRouter()` (next/navigation)
- `useLocation()` → `usePathname()` (next/navigation)
- `useParams()` → Props in dynamic routes
- `<Outlet>` → `{children}` in Layout

### 2. Client Components
- Alle interaktiven Komponenten brauchen `'use client'` directive
- Framer Motion, Lenis, useState/useEffect etc. sind Client-only

### 3. Fonts
- Google Fonts via `next/font/google` statt `<link>` im HTML
- ODER: weiterhin `<link>` im Root Layout (einfacher, 1:1 näher)

### 4. SEO/Meta
- `<Seo>` Komponente → Next.js `metadata` export pro Route
- Oder: Seo-Komponente beibehalten als Client Component (weniger invasiv)

### 5. Vite-Aliase
- `@/` alias → tsconfig paths in Next.js

## Übernahmestrategie

1. Next.js App erstellen: `apps/marketing`
2. Tailwind + PostCSS Config 1:1 kopieren
3. index.css 1:1 kopieren (nur Showcase + Template Style Teile)
4. Assets 1:1 nach `public/` kopieren
5. AgencyShowcase.tsx in einzelne Page-Dateien aufteilen (nur Routing-Schicht)
6. Alle Shared Components 1:1 kopieren
7. Alle Lib-Dateien 1:1 kopieren
8. Fonts über next/font oder <link> einbinden
9. SEO Meta via Next.js metadata API
10. Build + visueller Vergleich
