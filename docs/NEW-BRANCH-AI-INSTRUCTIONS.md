# Flamingo CMS — Anleitung: Neue Branche implementieren

> **DIESES DOKUMENT IST DIE EINZIGE QUELLE DER WAHRHEIT.**
> Du bist eine KI, die eine neue Branche im Flamingo CMS implementiert. Lies dieses Dokument **vollständig**, bevor du eine einzige Zeile Code schreibst. Jede Aktion, die du ausführst, muss exakt den hier beschriebenen Regeln folgen.

---

## 🚨 ABSOLUT KRITISCHE REGELN

### VERBOTEN — Niemals tun:
1. **KEIN Handwerk-Code anfassen.** `apps/renderer/src/templates/handwerk/` ist READ-ONLY. Du darfst dort NICHTS ändern, löschen oder hinzufügen.
2. **KEINEN existierenden Admin-Code ändern.** `apps/admin/src/app/admin/pages/[id]/section-data-editor.tsx`, `page-editor.tsx` und alle Handwerk-bezogenen Dateien sind READ-ONLY.
3. **KEINEN globalen Renderer-Code ändern** — `apps/renderer/src/components/section-renderer.tsx`, `site-header.tsx`, `site-footer.tsx`, `[[...slug]]/page.tsx`, `snapshot.ts`, `tenant-data.ts`, `globals.css`, `tailwind.config.ts` sind READ-ONLY.
4. **KEINE Annahmen treffen.** Wenn dir etwas unklar ist, FRAGE den Benutzer. Entscheide niemals selbstständig über Architektur, Design oder Inhalte.
5. **KEINE generischen Kopien.** Handwerk darf als Referenz betrachtet, aber NIE 1:1 kopiert werden. Jede Branche muss eigene Identität haben.
6. **KEINE Seiteneffekte.** Nach deiner Arbeit muss `apps/renderer/src/templates/handwerk/` identisch sein wie vorher. Der Handwerk-Renderer und der Handwerk-Admin müssen exakt gleich funktionieren.

### PFLICHT — Immer tun:
1. **Jeden Schritt begründen.** Vor jeder Aktion: erkläre in 1-2 Sätzen WARUM du das tust.
2. **Bestätigung einholen.** Bevor du eine Datei erstellst/änderst, beschreibe was du vorhast und warte auf Zustimmung des Benutzers.
3. **Testen.** Nach jedem Meilenstein: Build ausführen (`pnpm build --filter @flamingo/renderer --filter @flamingo/admin`) und sicherstellen, dass keine Errors auftreten.
4. **Am Ende verifizieren**, dass Handwerk noch funktioniert: `curl -s localhost:3002 | grep "Meisterbetrieb"` (oder äquivalent).

---

## 📐 ARCHITEKTUR-ÜBERSICHT

### Monorepo-Struktur
```
flamingo-cms/
├── apps/
│   ├── admin/        ← Tenant-Admin (Next.js, Port 3001)
│   ├── renderer/     ← Frontend-Renderer (Next.js, Port 3002)
│   ├── marketing/    ← Marketing-Website (Next.js, Port 3000)
│   └── crm/          ← CRM/Provisioning (Next.js, Port 3003)
├── packages/
│   ├── db/           ← Drizzle ORM Schema + DB-Client
│   └── auth/         ← JWT Auth + Password Hashing
└── scripts/          ← Seed-Scripts
```

### Wie die Renderer-Pipeline funktioniert
1. **Request kommt rein** → `[[...slug]]/page.tsx`
2. **Tenant-Auflösung** → `snapshot.ts:resolveTenant()` — findet Tenant via Hostname (oder Fallback: erster aktiver Tenant)
3. **Snapshot laden** → `snapshot.ts:getActiveSnapshot()` — aktiver published snapshot aus DB
4. **Seite finden** → Slug-Match in den Snapshot-Pages
5. **Style-Vars laden** → `styles.ts:getStyleCssVars(industry, activeStyle)` → CSS Custom Properties
6. **Rendern** → `<SectionRenderer>` mappt `section.type` auf React-Komponente aus `SECTION_COMPONENTS`
7. **Header/Footer** → Global, aus `tenant-data.ts` (Navigation, Brand, Contact, Social Links)

### Wie der Section-Renderer funktioniert (`section-renderer.tsx`)
```typescript
const SECTION_COMPONENTS: Record<string, React.FC<Props>> = {
  hero: HeroSection,
  uspStrip: UspStripSection,
  // ... alle 18 Handwerk-Section-Types
};
```
**WICHTIG:** Dieser Import-Block importiert aktuell NUR aus `@/templates/handwerk/`. Für eine neue Branche musst du diesen Mechanismus erweitern — aber OHNE den bestehenden Code zu ändern. Siehe Abschnitt "Technische Umsetzung" weiter unten.

### Wie der Admin-Editor funktioniert
- `page-editor.tsx` hat `SECTION_TYPES[]` — die verfügbaren Section-Typen im Dropdown
- `section-data-editor.tsx` hat `EDITORS: Record<string, React.FC>` — die Editor-Komponenten pro Type
- Beide Dateien sind aktuell Handwerk-spezifisch und DÜRFEN NICHT geändert werden

### Wie das Style-System funktioniert (`styles.ts`)
```typescript
export const INDUSTRY_STYLES: Record<string, IndustryStyles> = {
  tradesman: { // ← DB-Enum-Wert, NICHT "handwerk"
    label: 'Handwerk',
    styles: {
      classic: { cssVars: { '--style-radius-sm': '0.5rem', ... } },
      modern: { cssVars: { ... } },
      bold: { cssVars: { ... } },
    },
  },
};
```
**WICHTIG:** Der Key muss dem DB-Enum-Wert entsprechen (z.B. `restaurant`, `salon`, `hotel`). Siehe `packages/db/src/schema/index.ts`:
```typescript
export const industryEnum = pgEnum('industry', [
  'tradesman', 'restaurant', 'salon', 'hotel', 'tourism',
  'consulting', 'medical', 'fitness', 'wedding', 'cafe', 'bar',
]);
```

### Wie die Marketing-Seite Branchen zeigt
In `apps/marketing/src/showcase/Templates.tsx` gibt es ein `TEMPLATES[]`-Array. Jede Branche hat:
```typescript
{ key: 'restaurant', name: 'Restaurant', tagline: '...', description: '...', 
  image: '...', color: '#...', features: ['...'], status: 'live' | 'coming' }
```
Wenn `status: 'live'`, wird ein "Live-Demo" Button angezeigt, der zu `/demo` verlinkt.

---

## 🏗️ TECHNISCHE UMSETZUNG — Schritt für Schritt

### Phase 1: Architektur-Erweiterung (einmalig, falls noch nicht geschehen)

Der Section-Renderer muss branchen-agnostisch werden. **Aktuell importiert er hartcodiert aus `handwerk/`.**

**LÖSUNG:** Der `section-renderer.tsx` und der Admin-Editor müssen so erweitert werden, dass sie die Branche des aktuellen Tenants kennen und die passenden Templates/Editoren laden.

> ⚠️ **DU DARFST DEN BESTEHENDEN CODE NICHT ÄNDERN.**
> Stattdessen: Erstelle einen NEUEN Section-Renderer-Wrapper, der basierend auf der Branche den richtigen Section-Component wählt. **FRAGE den Benutzer nach dem genauen Ansatz bevor du beginnst.**

**Empfohlene Architektur (muss vom Benutzer bestätigt werden):**

```
apps/renderer/src/templates/
├── handwerk/          ← BESTEHEND, NICHT ANFASSEN
│   ├── hero.tsx
│   ├── faq.tsx
│   └── ... (18 Dateien)
├── restaurant/        ← NEU
│   ├── hero.tsx       ← Eigene Hero-Implementierung
│   ├── menu.tsx       ← Branchen-spezifisch: Speisekarte
│   └── ...
└── index.ts           ← NEU: Registry die section-renderer.tsx nutzt
```

**Registry-Pattern (`templates/index.ts`):**
```typescript
// Dieses Pattern erlaubt es, Templates pro Branche zu registrieren
// OHNE bestehenden Code zu ändern
import * as handwerk from './handwerk';
import * as restaurant from './restaurant';

export const INDUSTRY_TEMPLATES: Record<string, Record<string, React.FC<SectionProps>>> = {
  tradesman: {
    hero: handwerk.HeroSection,
    uspStrip: handwerk.UspStripSection,
    // ... alle 18 bestehenden
  },
  restaurant: {
    hero: restaurant.HeroSection,
    menu: restaurant.MenuSection,
    // ... alle restaurant-spezifischen
  },
};
```

**ABER:** Dieses Pattern erfordert eine Änderung an `section-renderer.tsx` — was verboten ist. **DAHER:**
- Erstelle `apps/renderer/src/components/industry-section-renderer.tsx` als NEUEN Wrapper
- Ändere NUR `apps/renderer/src/app/[[...slug]]/page.tsx` — ersetze `<SectionRenderer>` durch `<IndustrySectionRenderer industry={tenantStyle.industry}>` (diese eine Änderung ist erlaubt und muss vom Benutzer bestätigt werden)
- Der bestehende `section-renderer.tsx` bleibt 100% unverändert als Fallback

Gleiches gilt für den Admin:
- Erstelle `apps/admin/src/app/admin/pages/[id]/industry-section-editor.tsx` als NEUEN Wrapper
- Der bestehende `section-data-editor.tsx` bleibt unverändert

### Phase 2: Branche implementieren

Für jede neue Branche müssen diese Dinge erstellt werden:

#### 2.1 Renderer-Templates
Erstelle `apps/renderer/src/templates/<branche>/` mit allen benötigten Section-Komponenten.

**Design-Anforderungen:**
- **Gleiche Qualität wie Handwerk.** Mindestens 18 Sections, davon einige branchen-spezifisch.
- **Moderne Libraries verwenden:** Framer Motion für Animationen, Lucide für Icons, Next/Image für Bilder.
- **2026-Feeling:** Glassmorphism, subtile Animationen, Gradient Meshes, Spotlight-Effekte, Micro-Interactions.
- **Responsive:** Mobile-first, alle Breakpoints (sm, md, lg, xl).
- **Tailwind CSS:** Alle Styles mit Tailwind, keine CSS-Module. Nutze die CSS Custom Properties aus dem Style-System (`var(--style-*)`).
- **Dark/Light Awareness:** Hero-Sections mit dunklem Hintergrund, Content-Sections hell.

**Standard-Sections (müssen existieren, aber komplett eigenes Design):**
| Type | Beschreibung |
|------|-------------|
| `hero` | Heldenbild — eigenes Layout & Animationen, NICHT von Handwerk kopiert |
| `uspStrip` | Vorteile-Leiste mit Icons |
| `servicesGrid` | Leistungen/Angebote als Karten |
| `processSteps` | Ablauf-Timeline |
| `testimonials` | Kundenstimmen mit Bewertungen |
| `faq` | Häufige Fragen (Akkordeon) |
| `ctaBand` | Call-to-Action Banner |
| `contact` | Kontaktformular + Infos |
| `map` | Karteneinbettung |
| `team` | Team-Vorstellung |
| `portfolio` | Referenz-/Projektgalerie |
| `richText` | Freitext/HTML (Impressum etc.) |
| `stats` | Zahlen & Fakten |
| `galleryGrid` | Bildergalerie |
| `ctaLinks` | CTA-Link-Buttons |
| `newsPreview` | News/Blog-Vorschau |
| `logoCloud` | Partner-Logos |

**Branchen-spezifische Sections (Beispiele):**
| Branche | Sections |
|---------|----------|
| Restaurant | `menu` (Speisekarte), `reservierung` (Reservierungs-Widget), `events` (Veranstaltungen) |
| Salon | `preisliste` (Behandlungen + Preise), `buchung` (Online-Buchung), `vorherNachher` (Slider) |
| Hotel | `zimmer` (Zimmerkatalog), `verfuegbarkeit` (Kalender), `angebote` (Saisonale Pakete) |
| Medical | `leistungenDetail` (Behandlungen), `sprechstunden` (Öffnungszeiten), `patientenInfo` |
| Consulting | `caseStudies` (Fallstudien), `expertise` (Kompetenzfelder), `insights` (Blog) |

#### 2.2 Admin-Editoren
Erstelle Editoren für jede branchen-spezifische Section. Der Editor muss alle Felder abdecken, die die Section braucht.

**Regeln:**
- Jeder Editor bekommt `{ data, onChange }` Props
- Verwende dieselben UI-Patterns wie die bestehenden Editoren (admin-input, admin-label CSS-Klassen)
- Wiederverwendbare Felder: `ImageUploadField`, `LinkField`, `IconPickerField` existieren bereits in `apps/admin/src/components/`
- Erstelle neue Felder nur wenn nötig (z.B. Preis-Feld, Zeitslot-Feld)

#### 2.3 Style-Varianten
Füge 3 Stil-Varianten in `apps/renderer/src/lib/styles.ts` hinzu:

```typescript
// In INDUSTRY_STYLES hinzufügen (NICHT tradesman überschreiben):
restaurant: {
  label: 'Restaurant',
  styles: {
    classic: { label: 'Klassisch', description: '...', cssVars: { ... } },
    modern: { label: 'Modern', description: '...', cssVars: { ... } },
    bold: { label: 'Bold', description: '...', cssVars: { ... } },
  },
},
```

**Design-Richtlinien für Stile:**
- `classic` — Zeitlos, warm, traditionell. Abgerundete Ecken, weiche Schatten.
- `modern` — Minimalistisch, clean, flat. Kleine Radien, keine Schatten, feine Borders.
- `bold` — Dynamisch, stark, auffällig. Eckig (0 Radius), Offset-Schatten, Uppercase.

#### 2.4 Seed-Script
Erstelle `scripts/seed-<branche>-demo.ts`:
- Erstellt einen neuen Tenant (nutzt den passenden industry-Enum-Wert)
- Admin-Passwort: `demo2024`
- Erstellt GlobalSettings (Brand, Contact, Social Links, Opening Hours)
- Erstellt Navigation + Footer
- Erstellt 5+ Seiten mit realistischem Premium-Content
- Erstellt Collections mit Items (z.B. News-Artikel, Speisekarten-Kategorien)
- Publiziert einen Snapshot
- Erstellt eine Domain-Zuordnung (z.B. `<slug>.flamingomedia.online`)

**Content-Qualität:**
- Deutsche Texte, professionell und realistisch
- Fiktive aber glaubwürdige Firma inkl. Adresse, Telefon, E-Mail
- Alle Bilder von Unsplash mit `?w=800&q=80` für Thumbnails, `?w=1920&q=80` für Heroes
- Keine Platzhalter-Texte wie "Lorem ipsum"
- Mindestens 5 FAQ-Fragen, 4 Testimonials, 4 Team-Mitglieder, 6 Leistungen

#### 2.5 Marketing-Seite
In `apps/marketing/src/showcase/Templates.tsx`:
- Ändere den `status` der neuen Branche von `'coming'` auf `'live'`
- Aktualisiere `description` und `features` falls nötig

#### 2.6 Demo-Playground
Die Demo-Playground Seite embedded die Admin-App in einem iFrame. Es ist bereits ein funktionierender Demo-Login implementiert unter `/admin/demo-login`. Für neue Branchen muss ein eigener Demo-Tenant existieren (via Seed-Script).

---

## 📋 VOLLSTÄNDIGE CHECKLISTE

Arbeite diese Punkte IN DIESER REIHENFOLGE ab. Hake jeden Punkt ab und zeige dem Benutzer den Fortschritt.

### Vorbereitung
- [ ] Dieses Dokument vollständig gelesen
- [ ] Zielbranche mit Benutzer bestätigt
- [ ] Farbschema, Stimmung und Designrichtung mit Benutzer abgestimmt
- [ ] Seitenstruktur und branchen-spezifische Sections mit Benutzer bestätigt

### Architektur (falls noch nicht vorhanden)
- [ ] `apps/renderer/src/templates/index.ts` — Industry Template Registry erstellen
- [ ] `apps/renderer/src/components/industry-section-renderer.tsx` — Branchen-aware Wrapper
- [ ] `apps/renderer/src/app/[[...slug]]/page.tsx` — Einmalige Änderung: IndustrySectionRenderer nutzen (BESTÄTIGUNG EINHOLEN)
- [ ] `apps/admin/src/app/admin/pages/[id]/industry-section-editor.tsx` — Admin-Wrapper
- [ ] Verifizieren: Handwerk funktioniert noch identisch

### Branchen-Templates (Renderer)
- [ ] `apps/renderer/src/templates/<branche>/hero.tsx`
- [ ] `apps/renderer/src/templates/<branche>/` — Alle Standard-Sections (mind. 17)
- [ ] `apps/renderer/src/templates/<branche>/` — Alle branchen-spezifischen Sections
- [ ] Template Registry um neue Branche erweitert
- [ ] Build: `pnpm build --filter @flamingo/renderer` ohne Errors

### Admin-Editoren
- [ ] Editoren für alle branchen-spezifischen Sections
- [ ] Editor Registry um neue Branche erweitert
- [ ] Build: `pnpm build --filter @flamingo/admin` ohne Errors

### Style-Varianten
- [ ] `classic` Stil in `styles.ts` hinzugefügt
- [ ] `modern` Stil in `styles.ts` hinzugefügt
- [ ] `bold` Stil in `styles.ts` hinzugefügt

### Demo-Content
- [ ] Seed-Script erstellt (`scripts/seed-<branche>-demo.ts`)
- [ ] Seed-Script ausgeführt
- [ ] Snapshot veröffentlicht
- [ ] Domain in `tenant_domains` Tabelle eingetragen

### Marketing-Seite
- [ ] Template-Status auf `'live'` gesetzt
- [ ] Features-Liste aktualisiert

### Vercel / Deployment
- [ ] Domain zum Renderer-Vercel-Projekt hinzugefügt (via CRM oder API)
- [ ] Push to main

### Finale Verifizierung
- [ ] Handwerk-Renderer zeigt identisches Design wie vorher
- [ ] Handwerk-Admin funktioniert identisch
- [ ] Neue Branche rendert korrekt im Renderer
- [ ] Neue Branche hat funktionierenden Admin-Editor
- [ ] Alle 3 Stile (classic/modern/bold) funktionieren
- [ ] Marketing-Seite zeigt neue Branche als "Live"
- [ ] `pnpm build` für alle Apps erfolgreich

---

## 📂 DATEI-REFERENZEN

### READ-ONLY (NICHT anfassen)
| Datei | Zweck |
|-------|-------|
| `apps/renderer/src/templates/handwerk/*` | Alle 18 Handwerk-Templates |
| `apps/renderer/src/components/section-renderer.tsx` | Aktueller Section-Renderer |
| `apps/renderer/src/components/site-header.tsx` | Header-Komponente |
| `apps/renderer/src/components/site-footer.tsx` | Footer-Komponente |
| `apps/renderer/src/globals.css` | Globale Styles |
| `apps/renderer/tailwind.config.ts` | Tailwind Config |
| `apps/admin/src/app/admin/pages/[id]/section-data-editor.tsx` | Handwerk Admin-Editoren |
| `apps/admin/src/app/admin/pages/[id]/page-editor.tsx` | Handwerk Section-Types |

### LESEN als Referenz, aber NICHT kopieren
| Datei | Warum relevant |
|-------|----------------|
| `apps/renderer/src/templates/handwerk/hero.tsx` | Zeigt Quality-Bar für Animationen, Framer Motion, Aceternity UI |
| `apps/renderer/src/templates/handwerk/testimonials.tsx` | Zeigt InfiniteMovingCards Pattern |
| `apps/renderer/src/lib/styles.ts` | Zeigt wie Style-Varianten definiert werden |
| `scripts/seed-handwerk-demo.ts` | Zeigt Seed-Script Struktur |

### ERSTELLEN (neue Dateien)
| Datei | Zweck |
|-------|-------|
| `apps/renderer/src/templates/<branche>/*.tsx` | Alle Section-Templates |
| `apps/renderer/src/templates/index.ts` | Industry Template Registry |
| `apps/renderer/src/components/industry-section-renderer.tsx` | Branchen-Wrapper |
| `apps/admin/src/app/admin/pages/[id]/industry-section-editor.tsx` | Admin Editor Wrapper |
| `apps/renderer/src/lib/styles.ts` | Neue Stile HINZUFÜGEN (nicht ersetzen!) |
| `apps/marketing/src/showcase/Templates.tsx` | Status auf 'live' ändern |
| `scripts/seed-<branche>-demo.ts` | Seed-Script |

### MINIMALE ÄNDERUNG erlaubt (nur mit Bestätigung)
| Datei | Was ändern |
|-------|-----------|
| `apps/renderer/src/app/[[...slug]]/page.tsx` | `<SectionRenderer>` → `<IndustrySectionRenderer>` |

---

## 🎨 DESIGN-STANDARDS

### Qualitäts-Mindestanforderungen
Jede Section muss folgendes bieten:
1. **Framer Motion Animationen** — Fade-in, slide-up, stagger-children bei Scroll
2. **Responsive Design** — Mobile, Tablet, Desktop. Keine Breakpoint-Bugs.
3. **CSS Custom Properties** — Alle Radien, Schatten, Gewichte über `var(--style-*)` steuerbar
4. **Hover-States** — Jedes interaktive Element hat einen sichtbaren Hover-Effekt
5. **Accessibility** — Semantisches HTML, alt-Texte, Keyboard-Navigation
6. **Loading States** — Next/Image mit priority für Above-the-fold, lazy für den Rest
7. **Dark Hero** — Erste Section (Hero) hat dunklen Hintergrund, weiße Schrift
8. **Performance** — Keine unnötigen Re-Renders, keine schweren Libraries

### Tech Stack
| Library | Version | Zweck |
|---------|---------|-------|
| Next.js | 15.x | Framework |
| React | 19.x | UI |
| Framer Motion | 11.x | Animationen |
| Lucide React | 0.475+ | Icons |
| Tailwind CSS | 3.4.x | Styling |
| @tailwindcss/typography | 0.5.x | Prose-Styles |

### Aceternity UI Patterns (bereits im Projekt)
Diese Custom-Komponenten existieren und können wiederverwendet werden:
- `@/components/ui/spotlight` — Leuchteffekt auf dunklem Hintergrund
- `@/components/ui/text-generate-effect` — Buchstabe-für-Buchstabe Text-Animation

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

### pages
```sql
tenant_id UUID FK, title VARCHAR, slug VARCHAR, type ENUM(free/collection_overview/legal/system), status ENUM, visible BOOL, sort_order INT
```

### page_sections
```sql
tenant_id UUID FK, page_id UUID FK, type VARCHAR, variant VARCHAR, data JSONB, sort_order INT, visible BOOL
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
3. **Warte auf "OK" oder "Weiter"** bevor du die Datei erstellst/änderst
4. **Nach jeder größeren Phase:** Build ausführen und Ergebnis zeigen
5. **Bei Fehlern:** Zeige den Error, erkläre die Ursache, schlage einen Fix vor — und warte auf Bestätigung

**Beispiel-Dialog:**
```
KI: "Ich erstelle jetzt apps/renderer/src/templates/restaurant/hero.tsx — 
    eine Fullscreen-Hero Section mit Video-Hintergrund Option, animiertem 
    Headline-Text und einem Reservierungs-CTA. Das Design nutzt Framer Motion 
    für Scroll-Parallax und Glassmorphism für die CTA-Buttons."
    
    Soll ich fortfahren?

User: OK

KI: [erstellt die Datei]
    ✅ hero.tsx erstellt (142 Zeilen)
    Nächster Schritt: menu.tsx — die Speisekarten-Section...
```

---

## 📝 ZUSAMMENFASSUNG DER AUFGABE

Du sollst eine **vollständig eigenständige Branchen-Implementierung** erstellen, die:
1. Einen komplett eigenen Satz von Section-Templates hat (eigenes Design!)
2. Eigene Admin-Editoren für branchen-spezifische Sections hat
3. 3 Style-Varianten (classic/modern/bold) hat
4. Einen vollständig befüllten Demo-Tenant mit Premium-Content hat
5. Auf der Marketing-Seite als "Live" angezeigt wird
6. Den bestehenden Handwerk-Branch **in keiner Weise** beeinflusst

**Das Ergebnis muss top-notch 2026 Webdesign sein.** Keine generischen Bootstrap-Layouts. Kein "das reicht"-Mentalität. Denke an Award-Winning Designs.
