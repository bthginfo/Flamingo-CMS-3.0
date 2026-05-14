# Flamingo CMS — Anleitung: Neue Branche implementieren

> **DIESES DOKUMENT IST DIE EINZIGE QUELLE DER WAHRHEIT.**
> Du bist eine KI, die eine neue Branche im Flamingo CMS implementiert. Lies dieses Dokument **vollständig**, bevor du eine einzige Zeile Code schreibst. Jede Aktion, die du ausführst, muss exakt den hier beschriebenen Regeln folgen.

---

## 🚨 ABSOLUT KRITISCHE REGELN

### GOLDENE REGEL: 100% FELD-ABDECKUNG

**Jedes einzelne Textstück, Bild, Link oder konfigurierbare Element, das im Renderer (Frontend) angezeigt wird, MUSS im Admin-Panel bearbeitbar sein. Keine Ausnahmen. 0% Toleranz.**

Das bedeutet konkret:
- **NIEMALS** benutzer-sichtbaren Text hartcodieren in Renderer-Templates. Immer `(data.feldName as string) || 'Standardwert'` verwenden.
- Jedes Feld das im Admin-Editor gemeldet wird (`onChange()`) MUSS im Renderer-Template gelesen werden.
- Jedes Feld das das Renderer-Template liest MUSS im Admin-Editor bearbeitbar sein.
- Globale Elemente (Nav CTA-Button, Footer CTA, Top-Bar Infos) sind über Settings editierbar.
- Section-Meta (Spacing, Container, Anchor, Variante) sind über den SectionMetaEditor editierbar.

### Pflicht-Workflow bei JEDER Template-/Editor-Änderung:

```
1. NEUES RENDERER-FELD HINZUFÜGEN?
   → SOFORT entsprechendes Editor-Feld in section-data-editor.tsx hinzufügen
   → SOFORT prüfen, dass onChange() den Schlüssel enthält

2. NEUES ADMIN-FELD HINZUFÜGEN?
   → SOFORT im Renderer-Template auslesen und rendern
   → SOFORT prüfen, dass data.feldName im Template steht

> **WICHTIG: Save-Flow**
> Editoren haben KEINE eigenen Speicher-Buttons mehr. Stattdessen verwenden sie das `onChange`-Pattern:
> Jeder Editor bekommt `{ data, onChange }` als Props. Bei jeder Änderung wird `onChange(newData)` aufgerufen.
> Der übergeordnete Page-Editor sammelt alle Änderungen und speichert sie über den globalen FAB-Button ("Speichern").

3. NACH JEDER ÄNDERUNG an einem Section-Type:
   → MENTAL CHECKLIST durchgehen (siehe unten)
   → Build ausführen und auf TypeScript-Errors prüfen
```

### Feld-Abdeckung Mental-Checkliste (bei JEDER Änderung):

```
□ Admin-Editor speichert Feld X → Renderer-Template liest Feld X?
□ Renderer-Template liest Feld Y → Admin-Editor hat Eingabe für Feld Y?
□ Kein hartcodierter deutscher Text im Renderer? (nur Fallback-Defaults nach ||)
□ Neue Section-Types in BEIDEN Registries eingetragen?
   - section-data-editor.tsx → EDITORS Map
   - section-renderer.tsx → SECTION_COMPONENTS Map
□ Alle Pages (nicht nur home!) prüfen — auch /c/[collection]/[slug]
```

### ❌ ANTI-PATTERN BEISPIELE — SO SIEHT EIN FEHLER AUS

**FEHLER 1: Hartcodierter Text im Renderer-Template**
```tsx
// ❌ FALSCH — "Kundenstimmen" ist nicht editierbar!
export function TestimonialsSection({ data }: Props) {
  return (
    <section>
      <span className="badge">Kundenstimmen</span>
      <h2>{(data.headline as string) || 'Was unsere Kunden sagen'}</h2>
      <p>4.9/5 aus 120 Bewertungen</p>  {/* ❌ Komplett hartcodiert! */}
    </section>
  );
}

// ✅ RICHTIG — Alles aus data.xxx, Fallback nur nach ||
export function TestimonialsSection({ data }: Props) {
  return (
    <section>
      <span className="badge">{(data.badgeText as string) || 'Kundenstimmen'}</span>
      <h2>{(data.headline as string) || 'Was unsere Kunden sagen'}</h2>
      <p>{(data.ratingValue as string) || '4.9'}/5 aus {(data.ratingCount as string) || '120'} Bewertungen</p>
    </section>
  );
}
```

**FEHLER 2: Editor onChange() fehlen Felder die das Template liest**
```tsx
// ❌ FALSCH — onChange() meldet NICHT badgeText, ratingValue, ratingCount
onChange({ headline: localData.headline, items: localData.items });

// ✅ RICHTIG — ALLE Felder die das Template liest sind in onChange()
onChange({
  headline: localData.headline,
  badgeText: localData.badgeText,
  ratingValue: localData.ratingValue,
  ratingCount: localData.ratingCount,
  items: localData.items,
});
```

**FEHLER 3: Neues Renderer-Feld ohne Admin-Editor**
```tsx
// Template liest data.storyHeadline → aber Editor hat kein Input-Feld dafür
// ❌ Der Admin kann den Text nie ändern!

// ✅ RICHTIG: Für JEDES data.xxx im Template MUSS ein <Field> oder <input> im Editor existieren
```

### 🛑 STOP-AND-VERIFY GATE (PFLICHT nach jeder Section)

Nach dem Erstellen/Ändern JEDER Section musst du folgende Verifikation durchführen:

```bash
# Schritt 1: Liste ALLE data.xxx Zugriffe im Template
grep -oP 'data\.\w+' apps/renderer/src/templates/<branche>/<section>.tsx | sort -u

# Schritt 2: Liste ALLE Keys im Editor onChange()
grep -A 50 'onChange(' apps/admin/src/app/admin/pages/[id]/section-data-editor.tsx | grep -oP '\b\w+(?=:)' | head -30

# Schritt 3: Vergleiche beide Listen — sie MÜSSEN identisch sein!
# Wenn ein Feld im Template fehlt → hinzufügen
# Wenn ein Feld im Editor fehlt → hinzufügen
```

**Du darfst NICHT zur nächsten Section weitergehen, bevor dieses Gate bestanden ist.**

### VERBOTEN — Niemals tun:
1. **KEIN Handwerk-Code anfassen.** `apps/renderer/src/templates/handwerk/` ist READ-ONLY.
2. **KEINEN existierenden Admin-Code für Handwerk ändern.**
3. **KEINE Annahmen treffen.** Wenn dir etwas unklar ist, FRAGE den Benutzer.
4. **KEINE generischen 1:1 Kopien.** Jede Branche muss eigene Identität haben.
5. **KEINE Seiteneffekte.** Nach deiner Arbeit muss Handwerk identisch funktionieren.
6. **KEINEN hartcodierten Text** in Renderer-Templates (siehe Goldene Regel).

### PFLICHT — Immer tun:
1. **Jeden Schritt begründen.** Vor jeder Aktion: erkläre in 1-2 Sätzen WARUM du das tust.
2. **100% Feld-Audit** nach jeder Section: Alle Felder im Editor ↔ alle Felder im Template abgleichen.
3. **Testen.** Nach jedem Meilenstein: Build ausführen und sicherstellen, dass keine Errors auftreten.
4. **ALLE Consumer-Pages prüfen** — `[[...slug]]/page.tsx` UND `c/[collection]/[slug]/page.tsx` müssen kompilieren.
5. **Am Ende verifizieren**, dass Handwerk noch funktioniert.

---

## 📐 ARCHITEKTUR-ÜBERSICHT

### Monorepo-Struktur
```
flamingo-cms/
├── apps/
│   ├── admin/        ← Tenant-Admin (Next.js 15, Port 3001)
│   ├── renderer/     ← Frontend-Renderer (Next.js 15, Port 3002)
│   ├── marketing/    ← Marketing-Website (Next.js 15, Port 3000)
│   └── crm/          ← CRM/Provisioning (Next.js 15, Port 3003)
├── packages/
│   ├── db/           ← Drizzle ORM Schema + DB-Client (Neon Postgres)
│   ├── schemas/      ← Zod Validierungsschemas
│   └── auth/         ← JWT Auth + Password Hashing
└── scripts/          ← Seed-Scripts
```

### Datenbank
- **ORM:** Drizzle ORM mit Neon Postgres
- **Schema:** `packages/db/src/schema/index.ts`
- **Schema pushen:** `cd packages/db && DATABASE_URL="..." npx drizzle-kit push`
- **Wichtig:** Nach Schema-Änderung IMMER `drizzle-kit push` ausführen

### Deployment
- Alle Apps deployen zu Vercel via GitHub push (auto-deploy auf `main`)
- Vercel Team: `juliusvingelheim-2692s-projects`
- Renderer Cache-Invalidierung: POST `/api/revalidate` mit `x-revalidate-secret` Header
- **WICHTIG:** Nach jedem `git push` abwarten ob der Vercel Build erfolgreich ist. Bei Fehlern sofort fixen.

### Wie die Renderer-Pipeline funktioniert
1. **Request** → `[[...slug]]/page.tsx` oder `c/[collection]/[slug]/page.tsx`
2. **Tenant-Auflösung** → `snapshot.ts:resolveTenant()` via Hostname
3. **Snapshot laden** → `snapshot.ts:getActiveSnapshot()` aus DB
4. **Tenant-Daten** → `tenant-data.ts` liefert nav (items + CTA), footer (columns + CTA), brand, contact, socialLinks
5. **Style-Vars** → `styles.ts:getStyleCssVars(industry, activeStyle)` → CSS Custom Properties auf Root-Div
6. **Rendern** → `<SectionRenderer>` mappt `section.type` auf React-Komponente
7. **Header** → `<SiteHeader>` bekommt navItems, brand, contact, cta
8. **Footer** → `<SiteFooter>` bekommt footer (mit CTA), brand, contact, socialLinks

### Wie der Section-Renderer funktioniert
```typescript
// section-renderer.tsx
const SECTION_COMPONENTS: Record<string, React.FC<Props>> = {
  hero: HeroSection,
  uspStrip: UspStripSection,
  // ... alle Section-Types
};
```
Für eine neue Branche: NEUEN branchen-agnostischen Wrapper erstellen (siehe Phase 1).

### Wie der Admin-Editor funktioniert
- `page-editor.tsx` hat `SECTION_TYPES[]` — verfügbare Section-Typen im Dropdown
- `section-data-editor.tsx` hat `EDITORS: Record<string, React.FC>` — Editor-Komponenten pro Type
- `SectionMetaEditor` (in page-editor.tsx) — Spacing, Container, Variante, Anchor-ID pro Section
- **Settings-Seiten:**
  - `/admin/brand` → Firmenname, Tagline, Logo, Farben
  - `/admin/contact` → Telefon, E-Mail, Adresse, Öffnungszeiten
  - `/admin/social` → Instagram, Facebook, Google, LinkedIn, YouTube, TikTok
  - `/admin/navigation` → Nav-Links + CTA-Button (Label + Link)
  - `/admin/navigation` (Footer-Tab) → Footer-Spalten, Legal-Links, Footer-CTA

### Save & Publish Flow
1. Admin bearbeitet Section → `updateSectionAction(sectionId, data, pageId)` → DB + `revalidatePath`
2. Admin klickt "Veröffentlichen" (FAB-Bar) → `publishAction()` → Snapshot + Renderer-Revalidierung
3. **WICHTIG:** Jede Server Action die Daten ändert MUSS `revalidatePath()` aufrufen!

### Style-System
- Styles: `apps/renderer/src/lib/styles.ts` — CSS Custom Properties pro Industry/Style
- Angewendet: Inline auf Root-Div via `getStyleCssVars()`
- Konsumiert: `globals.css` Component-Layer-Klassen
- DB-Enum für Industry: `packages/db/src/schema/index.ts` → `industryEnum`
```typescript
export const industryEnum = pgEnum('industry', [
  'tradesman', 'restaurant', 'salon', 'hotel', 'tourism',
  'consulting', 'medical', 'fitness', 'wedding', 'cafe', 'bar',
]);
```
**WICHTIG:** Der Key in `INDUSTRY_STYLES` muss dem DB-Enum entsprechen (`tradesman`, nicht `handwerk`).

---

## 🏗️ TECHNISCHE UMSETZUNG — Schritt für Schritt

### Phase 1: Architektur-Erweiterung (einmalig, falls noch nicht geschehen)

Der Section-Renderer muss branchen-agnostisch werden.

**Empfohlene Architektur:**

```
apps/renderer/src/templates/
├── handwerk/          ← BESTEHEND, NICHT ANFASSEN
├── restaurant/        ← NEU — eigenes Design
└── index.ts           ← NEU — Registry pro Branche
```

**Registry-Pattern (`templates/index.ts`):**
```typescript
import * as handwerk from './handwerk';
import * as restaurant from './restaurant';

export const INDUSTRY_TEMPLATES: Record<string, Record<string, React.FC<SectionProps>>> = {
  tradesman: { hero: handwerk.HeroSection, ... },
  restaurant: { hero: restaurant.HeroSection, menu: restaurant.MenuSection, ... },
};
```

**Wrapper erstellen:**
- `apps/renderer/src/components/industry-section-renderer.tsx` — wählt Template basierend auf Branche
- `apps/admin/src/app/admin/pages/[id]/industry-section-editor.tsx` — Admin-Wrapper

**BEVOR du irgendwas änderst:** Bestätigung vom Benutzer einholen!

### Phase 2: Branche implementieren

#### 2.1 Renderer-Templates

Erstelle `apps/renderer/src/templates/<branche>/` mit allen Section-Komponenten.

**Standard-Sections (müssen mindestens existieren):**
| Type | Beschreibung |
|------|-------------|
| `hero` | Heldenbild — eigenes Layout, NICHT von Handwerk kopiert |
| `uspStrip` | Vorteile-Leiste |
| `servicesGrid` | Leistungen/Angebote |
| `processSteps` | Ablauf-Timeline |
| `testimonials` | Kundenstimmen (mit editierbarem badgeText, ratingValue, ratingCount!) |
| `faq` | FAQ-Akkordeon |
| `ctaBand` | CTA-Banner (mit editierbarem badgeText!) |
| `contact` | Kontaktformular + Infos |
| `map` | Karteneinbettung |
| `team` | Team (mit editierbarem valuesHeadline, membersHeadline!) |
| `portfolio` | Projektgalerie |
| `richText` | Freitext/HTML |
| `stats` | Zahlen & Fakten |
| `galleryGrid` | Bildergalerie |
| `ctaLinks` | CTA-Buttons |
| `newsPreview` | News-Vorschau |
| `logoCloud` | Partner-Logos |
| `headerBanner` | Hinweisleiste (items + style) |
| `serviceDetail` | Detail-Leistungsbeschreibung |

**Branchen-spezifische Sections (Beispiele):**
| Branche | Sections |
|---------|----------|
| Restaurant | `menu` (Speisekarte), `reservierung`, `events` |
| Salon | `preisliste`, `buchung`, `vorherNachher` (Slider) |
| Hotel | `zimmer`, `verfuegbarkeit`, `angebote` |
| Medical | `leistungenDetail`, `sprechstunden`, `patientenInfo` |

**⚠️ BEI JEDER SECTION:**
1. Jedes Feld das gerendert wird → MUSS ein `data.xxx` Feld sein
2. Fallback: `(data.xxx as string) || 'Sinnvoller Standard'`
3. KEIN hartcodierter Text in `<span>`, `<h2>`, `<h3>` etc.
4. **Nach dem Erstellen: STOP-AND-VERIFY GATE durchführen (siehe oben)**

**Vollständiges Beispiel einer korrekt implementierten Section:**
```tsx
// apps/renderer/src/templates/restaurant/cta-band.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Props { data: Record<string, unknown>; meta?: Record<string, unknown> }

export default function CtaBandSection({ data }: Props) {
  const headline = (data.headline as string) || 'Reservieren Sie jetzt';
  const subline = (data.subline as string) || 'Wir freuen uns auf Ihren Besuch';
  const badgeText = (data.badgeText as string) || 'Jetzt buchen';
  const cta = (data.ctaPrimary as { label?: string; href?: string }) || {};

  return (
    <section className="py-20 bg-[var(--style-primary)]">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
        {badgeText && <span className="badge">{badgeText}</span>}
        <h2>{headline}</h2>
        <p>{subline}</p>
        {cta.label && cta.href && (
          <Link href={cta.href}>{cta.label}</Link>
        )}
      </motion.div>
    </section>
  );
}
// ✅ Felder: headline, subline, badgeText, ctaPrimary — ALLE im Editor onChange() vorhanden
```

#### 2.2 Admin-Editoren

Für jede branchen-spezifische Section einen Editor erstellen.

**KRITISCHE REGELN für Editoren:**
- `onChange()` MUSS ALLE Felder enthalten die das Template liest
- Wiederverwendbare Felder: `ImageUploadField`, `LinkField`, `IconPickerField` existieren in `apps/admin/src/components/`
- Shared Helper: `Field`, `SelectField` existieren in section-data-editor.tsx

**Verifizierung nach jedem Editor:**
```
Für Section-Type "xxx":
1. Editor onChange(): Welche Keys werden gemeldet? → Liste erstellen
2. Template: Welche data.xxx werden gelesen? → Liste erstellen
3. BEIDE Listen vergleichen → müssen identisch sein
```

#### 2.3 Style-Varianten

3 Stile in `styles.ts` hinzufügen — `classic`, `modern`, `bold`:
- `classic` — Zeitlos, warm, abgerundete Ecken, weiche Schatten
- `modern` — Minimalistisch, feine Borders, weight 500, tight tracking
- `bold` — Dynamisch, eckig (0 Radius), Offset-Schatten, Uppercase, weight 900

#### 2.4 Seed-Script

Erstelle `scripts/seed-<branche>-demo.ts`:
- Neuer Tenant mit passendem `industry` Enum-Wert
- Admin-Passwort: `demo2024`
- GlobalSettings (Brand, Contact, Social Links, Opening Hours)
- Navigation mit CTA + Footer mit CTA + Legal-Links
- Mindestens 5 Seiten mit realistischem Premium-Content (DEUTSCH)
- Collections mit Items (z.B. News)
- Published Snapshot
- Domain-Zuordnung

**Content-Qualität:** Deutsche Texte, professionell, fiktiv aber glaubwürdig. Unsplash-Bilder. Keine Platzhalter.

#### 2.5 Marketing-Seite

In `apps/marketing/src/showcase/Templates.tsx`:

1. **Neuen Eintrag zum `TEMPLATES`-Array hinzufügen** (falls die Branche noch nicht existiert):
```ts
{
  key: '<branche>',           // z.B. 'restaurant', 'salon'
  name: '<Anzeigename>',       // z.B. 'Restaurant'
  tagline: '<Kurze Tagline>',  // z.B. 'Reservierungen & Menükarten'
  description: '<2-3 Sätze die das Template beschreiben>',
  image: '/showcase/<branche>-preview.png',  // Screenshot in apps/marketing/public/showcase/
  color: '<Tailwind-Farbe>',   // z.B. 'amber', 'rose', 'emerald'
  features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
  status: 'live' as const,
}
```

2. **Falls Eintrag bereits mit `status: 'coming'` existiert:** Status auf `'live'` setzen.

3. **Preview-Screenshot erstellen:** Ein PNG-Screenshot der fertigen Demo-Seite unter `apps/marketing/public/showcase/<branche>-preview.png` ablegen.

---

## 📋 VOLLSTÄNDIGE CHECKLISTE

### Vorbereitung
- [ ] Dieses Dokument vollständig gelesen
- [ ] Zielbranche mit Benutzer bestätigt
- [ ] Design-Richtung abgestimmt

### Architektur (einmalig)
- [ ] Template Registry erstellt
- [ ] Industry Section Renderer erstellt
- [ ] Admin Wrapper erstellt
- [ ] Handwerk funktioniert noch identisch

### Templates (Renderer)
- [ ] Alle Standard-Sections implementiert (mindestens 19)
- [ ] Alle branchen-spezifischen Sections implementiert
- [ ] **100% FELD-AUDIT:** Jede Section → Admin-Felder = Renderer-Felder
- [ ] Keine hartcodierten Texte
- [ ] Template Registry erweitert
- [ ] Build erfolgreich: `pnpm build --filter @flamingo/renderer`

### Admin-Editoren
- [ ] Editoren für branchen-spezifische Sections
- [ ] Editor Registry erweitert
- [ ] **100% FELD-AUDIT:** Jeder Editor onChange() = Template data.xxx
- [ ] Build erfolgreich: `pnpm build --filter @flamingo/admin`

### Style-Varianten
- [ ] `classic`, `modern`, `bold` in styles.ts
- [ ] CSS Vars werden in globals.css konsumiert

### Demo-Content
- [ ] Seed-Script erstellt und ausgeführt
- [ ] Snapshot veröffentlicht
- [ ] Domain eingetragen

### Deployment & Verifikation
- [ ] Lokaler Build ERFOLGREICH: `cd C:\...\flamingo-cms && pnpm build --filter @flamingo/renderer && pnpm build --filter @flamingo/admin`
- [ ] `git push` → Vercel Build ERFOLGREICH (kein Error!)
- [ ] Handwerk unverändert
- [ ] Neue Branche rendert korrekt
- [ ] Admin-Editor für alle Sections funktioniert
- [ ] Alle 3 Stile funktionieren
- [ ] **FINALES FELD-AUDIT:** Jede Section auf jeder Seite prüfen

---

## 📂 DATEI-REFERENZEN

### READ-ONLY
| Datei | Zweck |
|-------|-------|
| `apps/renderer/src/templates/handwerk/*` | Alle 19 Handwerk-Templates |
| `apps/admin/src/app/admin/pages/[id]/section-data-editor.tsx` | Handwerk-Editoren |
| `apps/admin/src/app/admin/pages/[id]/page-editor.tsx` | Handwerk Section-Types |

### LESEN als Referenz
| Datei | Warum |
|-------|-------|
| `apps/renderer/src/templates/handwerk/hero.tsx` | Quality-Bar: Animationen, Framer Motion |
| `apps/renderer/src/lib/styles.ts` | Style-Varianten-Struktur |
| `scripts/seed-handwerk-demo.ts` | Seed-Script-Struktur |

### ERSTELLEN für neue Branche
| Datei | Zweck |
|-------|-------|
| `apps/renderer/src/templates/<branche>/*.tsx` | Section-Templates |
| `apps/renderer/src/templates/index.ts` | Template-Registry (einmalig) |
| `apps/renderer/src/components/industry-section-renderer.tsx` | Wrapper (einmalig) |
| `scripts/seed-<branche>-demo.ts` | Demo-Seed |

### Existierende Dateien die erweitert werden
| Datei | Was hinzufügen |
|-------|---------------|
| `apps/renderer/src/lib/styles.ts` | Neue industry styles (NICHT tradesman überschreiben!) |
| `apps/marketing/src/showcase/Templates.tsx` | TEMPLATES-Eintrag + Status auf 'live' |

---

## 🔗 AKTUELLE SECTION-TYPES & IHRE FELDER (Stand: Mai 2026)

Diese Liste zeigt exakt welche Felder pro Section-Type im Admin editierbar und im Renderer gerendert werden. **Nutze dies als Referenz für 100%-Abdeckung.**

| Section | Felder |
|---------|--------|
| **hero** | headline, subline, badgeText, variant, bgImage, trustItems[], primaryCta{label,href}, secondaryCta{label,href} |
| **uspStrip** | items[{icon,title,text}] |
| **servicesGrid** | headline, subline, badgeText, manualCards[{title,text,icon,image,mediaType}] |
| **processSteps** | headline, badgeText, steps[{title,text,icon}] |
| **testimonials** | headline, badgeText, ratingValue, ratingCount, items[{quote,name,context,rating}] |
| **faq** | headline, badgeText, items[{question,answer}] |
| **ctaBand** | headline, subline, badgeText, ctaPrimary{label,href} |
| **contact** | headline, introText, badgeText, submitLabel, formEnabled, infoCards[{icon,label,value}] |
| **map** | headline, embedUrl, height(s/m/l) |
| **serviceDetail** | headline, subline, badgeText, items[{title,text,icon,image,mediaType,features[],ctaLabel,ctaHref}] |
| **portfolio** | headline, subline, badgeText, projects[{title,category,description,image,stats[]}] |
| **team** | headline, subline, badgeText, storyHeadline, storyText, storyImage, valuesHeadline, membersHeadline, members[{name,role,image,bio}], stats[{value,label}], values[{icon,title,text,image,mediaType}] |
| **ctaLinks** | headline, subline, links[{label,href,icon,description}] |
| **newsPreview** | headline, subline, collectionKey, linkLabel, linkHref |
| **stats** | headline, stats[{value,suffix,prefix,label,icon}] |
| **logoCloud** | headline, subline, logos[{src,alt,href}] |
| **galleryGrid** | headline, subline, images[{src,alt,caption}] |
| **richText** | headline, content(HTML) |
| **headerBanner** | items[{text,link}], style(neutral/info/warning) |

### Globale Elemente (NICHT Section-Data)
| Element | Editierbar über | Gerendert in |
|---------|----------------|--------------|
| Nav-Links | Admin → Navigation → items[] | SiteHeader navItems |
| Nav CTA-Button | Admin → Navigation → cta{label,href} | SiteHeader CTA |
| Top-Bar Telefon | Admin → Kontakt → phone | SiteHeader top-bar |
| Top-Bar E-Mail | Admin → Kontakt → email | SiteHeader top-bar |
| Top-Bar Tagline | Admin → Marke → tagline | SiteHeader top-bar |
| Footer Spalten | Admin → Footer → columns[{title,items}] | SiteFooter columns |
| Footer Legal-Links | Admin → Footer → legalLinks[{label,href}] | SiteFooter bottom |
| Footer CTA | Admin → Footer → cta{label,href} | SiteFooter CTA banner |
| Logo | Admin → Marke → logoUrl | SiteHeader + SiteFooter |
| Firmenname | Admin → Marke → companyName | SiteHeader + SiteFooter |
| Adresse | Admin → Kontakt → address | SiteFooter |
| Social Links | Admin → Social → [platform URLs] | SiteFooter icons |

---

## 🎨 DESIGN-STANDARDS

### Qualitäts-Anforderungen
1. **Framer Motion** — Fade-in, slide-up, stagger bei Scroll
2. **Responsive** — Mobile-first, alle Breakpoints
3. **CSS Custom Properties** — Alle über `var(--style-*)` steuerbar
4. **Hover-States** — Jedes interaktive Element
5. **Dark Hero** — Hero hat dunklen Hintergrund
6. **Performance** — Next/Image, priority für above-fold
7. **2026-Feeling** — Glassmorphism, Gradient Meshes, Micro-Interactions

### Tech Stack
| Library | Zweck |
|---------|-------|
| Next.js 15 | Framework |
| React 19 | UI |
| Framer Motion 11 | Animationen |
| Lucide React | Icons |
| Tailwind CSS 3.4 | Styling |

### Vorhandene Custom-Komponenten
- `@/components/ui/spotlight` — Leuchteffekt
- `@/components/ui/text-generate-effect` — Text-Animation
- `@/components/ui/infinite-moving-cards` — Endlos-Karussell

---

## 🗄️ DATENBANK-SCHEMA (Relevante Tabellen)

### tenants
```sql
id UUID PK, name VARCHAR, slug VARCHAR UNIQUE, industry ENUM, active_style VARCHAR DEFAULT 'classic', status ENUM
```

### global_settings
```sql
tenant_id UUID FK, brand JSONB, contact JSONB, opening_hours JSONB, social_links JSONB
```

### navigation
```sql
tenant_id UUID FK, items JSONB, cta JSONB
```

### footer
```sql
tenant_id UUID FK, columns JSONB, legal_links JSONB, cta JSONB
```

### pages
```sql
tenant_id UUID FK, title VARCHAR, slug VARCHAR, type ENUM(free/collection_overview/legal/system), status ENUM, visible BOOL, sort_order INT
```

### page_sections
```sql
tenant_id UUID FK, page_id UUID FK, type VARCHAR, variant VARCHAR, data JSONB, sort_order INT, visible BOOL, container VARCHAR, spacing_top VARCHAR, spacing_bottom VARCHAR, anchor_id VARCHAR
```

### published_snapshots
```sql
tenant_id UUID FK, version INT, snapshot JSONB, checksum VARCHAR, is_active BOOL
```

### collections + collection_items
```sql
collections: tenant_id FK, key VARCHAR, label VARCHAR, schema JSONB
collection_items: collection_id FK, slug VARCHAR, title VARCHAR, data JSONB, published BOOL, priority INT
```

---

## 💬 KOMMUNIKATIONSPROTOKOLL

Bei jeder Interaktion:

1. **Sage, was du als nächstes tust** und warum
2. **Zeige den genauen Dateinamen** und beschreibe den Inhalt
3. **Warte auf Bestätigung** bevor du Architektur-Änderungen machst
4. **Nach jeder Section:** 100% Feld-Audit durchführen und Ergebnis zeigen
5. **Nach jeder Phase:** Build ausführen und Ergebnis zeigen
6. **Bei Fehlern:** Error zeigen, Ursache erklären, Fix vorschlagen

---

## 📝 ZUSAMMENFASSUNG

Du erstellst eine **vollständig eigenständige Branchen-Implementierung**, die:
1. ✅ Einen eigenen Satz Section-Templates hat (eigenes Design)
2. ✅ **100% Feld-Abdeckung** hat (Admin ↔ Renderer, keine Ausnahmen)
3. ✅ 3 Style-Varianten hat
4. ✅ Einen Demo-Tenant mit Premium-Content hat
5. ✅ Auf der Marketing-Seite als "Live" angezeigt wird
6. ✅ Den bestehenden Handwerk-Branch **in keiner Weise** beeinflusst
7. ✅ **Keinen hartcodierten benutzer-sichtbaren Text** enthält
