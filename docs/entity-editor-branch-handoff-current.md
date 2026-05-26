# Entity Editor Branch Handoff

Stand: 2026-05-26  
Branch: `codex/entity-editor-foundation`  
Letzter geprüfter Commit: `1f64d55`

Dieses Dokument ist die aktuelle Übergabe für die nächste KI bzw. den nächsten Entwickler. Der Branch ist bewusst weitgehend DB-frei geblieben. Persistenz- und Migrationsthemen sind unten separat aufgeführt.

## Was umgesetzt wurde

### Editor-Fundament

- Gemeinsame Editor-Grundlage für Page Sections, Collection Item Sections und Collection Overview Pages.
- Collection Items nutzen dieselbe Section-Stack-Infrastruktur wie Pages.
- Collection Overview Pages werden über bestehende Page-Mechanik und `collectionList` abbildbar.
- Produkt-Editor nutzt die gemeinsame schwebende Action Bar für Speichern/Vorschau, bleibt aber beim bestehenden Produktdatenmodell.
- Preview-Verhalten ist vereinheitlicht: je nach Entity wird die passende Page, das Item, die PDP oder ein Fallback geöffnet.

### Section Registry und Admin-Verdrahtung

- Alle admin-auswählbaren Sections sind in Renderer, API-Instructions, Admin-Editor und Color Mapping auditierbar.
- `scripts/audit-section-registry.ts` prüft Registry-Drift.
- Letzter Audit-Stand: `withIssues: 0`.
- Alte Sections haben jetzt ein korrektes Color Mapping statt generischem Fallback.
- Sections ohne spezialisierten Editor sind über den strukturierten Basis-Editor editierbar.

### Premium Sections

Neue Shared Premium Sections:

- `cinematicHero`
- `spotlightCards`
- `scrollStory`
- `premiumComparison`

Für diese vier Sections umgesetzt:

- Renderer-Components unter `apps/renderer/src/templates/shared/`
- Registrierung in `apps/renderer/src/templates/index.ts`
- Admin-Auswahl in `section-types.ts`
- konkrete Admin-Editoren in `section-data-editor.tsx`
- Color Mapping in `section-color-editor.tsx`
- API-Instructions in `app/api/v1/instructions/route.ts`
- Preview-Daten in `section-preview-data.ts`
- Showcase-/Preview-Verfügbarkeit

### Dynamische Showcase Preview

`/demo/showcase` ist jetzt ein dynamischer Section-Katalog:

- zieht die Section-Liste automatisch aus `getSectionTypesForIndustry(...)`
- zeigt Suche und Kategorie-Filter
- rendert die aktuell gewählte Section in einem iframe über `/section-preview`
- nutzt dieselbe Preview-Route wie der CMS-Editor
- vermeidet doppelte manuelle Pflege einer riesigen Showcase-Seite

### Preview Coverage

- Alle `143` admin-auswählbaren Section-Typen haben Preview-Daten.
- `missingDataCount: 0`.
- Collection- und Shop-Sections haben statische Preview-Fallbacks, damit sie nicht leer wirken, wenn keine Tenant-/Shop-API-Daten verfügbar sind.
- Shop-Grid, Shop-Featured-Products und Shop-Kategorien bevorzugen Preview-Daten, bevor sie API-Daten laden.

## Validierung

Zuletzt erfolgreich ausgeführt:

```bash
npx tsx scripts/audit-section-registry.ts --out reports/section-registry-current.json --fail-on-issues
pnpm typecheck
pnpm --filter @flamingo/renderer build
```

Ergebnis:

- Registry-Audit grün
- Typecheck grün
- Renderer-Build grün

Bekannter, unveränderter Build-Hinweis:

- Next.js warnt wegen mehrerer Lockfiles und wählt `C:\Users\vonin-ju\package-lock.json` als Workspace Root. Das ist nicht durch diesen Branch entstanden.

## Bewusst nicht umgesetzt

Keine neuen DB-Tabellen, Spalten oder Migrationen.

Nicht Teil dieses Branches:

- freie Section-Stacks für Produkte
- freie Section-Stacks für Produktkategorien
- neues generisches Entity-Content-Modell
- Migration bestehender Tenant-Daten
- Umstellung des Public Renderers auf `published_snapshots` als primäre Renderquelle
- neues Draft-/Publish-System für alle Entity-Typen

## Offene DB-Themen für die nächste KI

### 1. Produkt-Sections

Aktuell haben Produkte keine freie Section-Struktur. Produkte bleiben in `products`, Varianten in `product_variants`, Optionen in `variant_options`.

Zu entscheiden:

- Soll ein Produkt eigene Sections bekommen?
- Ergänzt der Section-Stack die aktuelle PDP oder ersetzt er sie?
- Wo werden Produkt-Sections gespeichert?
- Wie wird Preview für unveröffentlichte Produkt-Sections abgebildet?
- Wie greifen Produktdaten und Layoutdaten ineinander?

Empfohlene Richtung:

- Produkt-Stammdaten bleiben in `products`.
- Layoutdaten werden separat gespeichert.
- Bestehende PDP bleibt Fallback, wenn kein Produkt-Section-Stack existiert.

### 2. Kategorie-Sections

Produktkategorien haben aktuell nur Stammdaten:

- `name`
- `slug`
- `description`
- `image`
- `parentId`
- `sortOrder`

Zu entscheiden:

- Gibt es künftig echte Kategorie-Seiten, z.B. `/shop/kategorie/[slug]`?
- Oder bleibt Kategorie nur ein Filter auf `/shop?kategorie={slug}`?
- Wo werden Kategorie-Sections gespeichert?
- Wie funktioniert Preview/Publish für Kategorien?

### 3. Generische Entity-Persistenz

Mögliche Modelle:

```sql
entity_content
  id
  tenant_id
  entity_type
  entity_id
  data jsonb
  created_at
  updated_at
```

Oder granularer:

```sql
entity_sections
  id
  tenant_id
  entity_type
  entity_id
  type
  variant
  title_internal
  visible
  locked
  container
  spacing_top
  spacing_bottom
  anchor_id
  style_overrides jsonb
  data jsonb
  sort_order
  created_at
  updated_at
```

Empfehlung:

- Mini-RFC schreiben, bevor DB-Migrationen gebaut werden.
- Rückwärtskompatibilität priorisieren: bestehende Tenants dürfen keine Inhalte, Designs oder Shop-Daten verlieren.

### 4. Publish und Snapshot

Das Schema enthält bereits `published_snapshots` und `publish_history`, aber der öffentliche Renderer nutzt weiterhin die bestehende Snapshot-/Live-Datenlogik.

Zu entscheiden:

- Wird `published_snapshots` primäre Renderquelle?
- Wie werden Pages, Collection Items, Produkte und Kategorien gemeinsam veröffentlicht?
- Braucht jedes Entity eigenen Draft-Status?
- Wie funktionieren Rollback und Cache-Invalidierung?

### 5. i18n für Nicht-Page-Entities

Zu entscheiden:

- einheitliches i18n-Format für Sections in Collection Items, Produkten und Kategorien
- ob Titel/Slug/SEO pro Locale zentral modelliert werden
- ob bestehendes `_localized`-Format beibehalten oder normalisiert wird

## Empfohlene nächste Schritte

1. Deployment des Branches oder Preview-Deployment erstellen.
2. `/demo/showcase` visuell testen: Suche, Kategorie-Filter, iframe-Preview, Vollansicht.
3. Stichproben im Admin:
   - Page Editor
   - Collection Item Editor
   - Product Editor Action Bar
   - neue Premium Sections
   - Color Overrides
4. DB-Mini-RFC für Produkt-/Kategorie-Sections schreiben.
5. Erst danach DB-Migrationen planen.

## Relevante Commits

- `697bea6` `Unify entity editor foundation`
- `522d79d` `Wire premium sections and color overrides`
- `5026d33` `Complete section color mappings`
- `63b0e87` `Close section registry editor gaps`
- `3f2ea5d` `Add premium shared sections`
- `789e7b0` `Add dynamic section showcase preview`
- `1f64d55` `Complete section preview coverage`
