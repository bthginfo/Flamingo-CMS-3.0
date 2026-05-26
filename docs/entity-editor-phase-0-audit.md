# Entity Editor Phase 0 Audit

Stand: 2026-05-26

## Ziel

Dieses Audit beschreibt den aktuellen technischen Zustand vor einem Umbau zu einem gemeinsamen Entity Editor für Pages, Collection Overviews, Collection Items, Produkte und Produktkategorien.

Phase 0 verändert keine Produktivlogik. Ziel ist, Persistenz, Rendering, Admin-Actions, Preview, Publish und Risiken so zu erfassen, dass spätere Schritte additiv und rückrollbar umgesetzt werden können.

## Kernaussage

Ein gemeinsamer Entity Editor ist technisch machbar. Der Umbau darf aber nicht als Datenmodell-Big-Bang erfolgen.

Die aktuelle Anwendung nutzt mehrere Content-Pfade:

- Pages und Collection Overviews: `pages` + `page_sections`
- Collection Items: `collection_items.data`, inklusive optionaler `data.sections`
- Produkte: `products` + Varianten/Optionen, aktuell ohne freie Section-Struktur
- Produktkategorien: `product_categories`, aktuell ohne freie Section-Struktur
- Public Rendering: aktiver Snapshot wird aus Live-Tabellen gebaut und gecached
- Publish: markiert Pages als published und invalidiert Caches, nutzt aber nicht durchgängig `published_snapshots`

Bestehende Tenants können geschützt werden, wenn der Umbau adapterbasiert erfolgt und alte Datenformate weiter gelesen werden.

## Datenmodell

### Pages

Quelle: `packages/db/src/schema/index.ts`

`pages` enthält:

- `id`
- `tenantId`
- `title`
- `slug`
- `type`
- `status`
- `visible`
- `sortOrder`

`page_sections` enthält:

- `id`
- `tenantId`
- `pageId`
- `type`
- `variant`
- `titleInternal`
- `visible`
- `locked`
- `container`
- `spacingTop`
- `spacingBottom`
- `anchorId`
- `styleOverrides`
- `data`
- `sortOrder`

Das ist der stärkste und sauberste Content-Pfad. Er eignet sich als Referenzmodell für einen gemeinsamen Editor.

### Collection Overviews

Collection Overviews sind bereits als Pages modelliert:

- `pages.type = 'collection_overview'`
- Standard-Section: `collectionList`
- Erzeugung über `getOrCreateOverviewPageAction`

Das ist gut. Für diese Entität muss kein neues Content-Modell eingeführt werden. Sie kann direkt über den künftigen Page/Entity-Adapter laufen.

### Collection Items

`collection_items` enthält:

- `id`
- `tenantId`
- `collectionId`
- `slug`
- `title`
- `data`
- `published`
- `priority`

Sections liegen aktuell optional in `data.sections`. Der Item Editor normalisiert vorhandene Sections lokal und schreibt danach das gesamte `data` Objekt zurück.

Das ist funktional, aber weniger stark als `page_sections`, weil:

- keine separaten Section-Rows existieren
- keine locked Sections wie bei Pages existieren
- i18n nicht gleichwertig angeschlossen ist
- Preview-Payload unvollständiger ist
- SectionColorEditor nicht dieselbe Preview-Iframe-Quelle nutzt

### Produkte

`products` enthält Produktdaten, SEO-Felder, Bilder und Highlights, aber keine freie Section-Struktur.

Wichtige Felder:

- `title`
- `slug`
- `description`
- `shortDescription`
- `priceCents`
- `comparePriceCents`
- `sku`
- `stock`
- `status`
- `images`
- `metaTitle`
- `metaDescription`
- `highlights`

Produktdetailseiten werden aktuell über `ShopProductDetailSection` gerendert und laden Produktdaten über `/api/shop/products/[slug]`.

### Produktkategorien

`product_categories` enthält:

- `name`
- `slug`
- `description`
- `image`
- `parentId`
- `sortOrder`

Es gibt aktuell keine eigene Kategorie-Detailroute mit frei editierbaren Sections. Kategorien werden im Shop-Grid als Filter genutzt.

## Snapshot und Public Rendering

Quelle: `apps/renderer/src/lib/snapshot.ts`

`getActiveSnapshot(tenantId)` verwendet `unstable_cache` und ruft intern `getDraftSnapshot(tenantId)` auf.

`getDraftSnapshot` liest live aus:

- `pages`
- `page_sections`
- `collections`
- `collection_items`

Collection Items werden nur aufgenommen, wenn `published = true`.

Wichtiger Befund: Die Tabellen `published_snapshots` und `publish_history` existieren, werden aber im aktuell geprüften Public Rendering nicht als primäre Quelle verwendet.

Folge für den Umbau:

- Der Entity Editor sollte nicht davon ausgehen, dass Publish bereits ein vollständiges Snapshot-System für alle Entities ist.
- Rückwärtskompatibilität muss auf Tabellen-/JSON-Ebene gewahrt bleiben.
- Snapshot-Tabellen können später stärker genutzt werden, sollten aber nicht Voraussetzung für die erste Editor-Parität sein.

## Routing

### Normale Seiten

Route: `apps/renderer/src/app/[[...slug]]/page.tsx`

Rendert:

- aktiven Snapshot
- globale Brand-/Design-Variablen
- Header/Footer
- sichtbare Page Sections via `SectionRenderer`
- i18n-Auflösung für Locale-Prefixe

### Collection Items

Route: `apps/renderer/src/app/c/[collection]/[slug]/page.tsx`

Rendert:

- aktiven Snapshot
- Collection und Item aus `snapshot.collections`
- SEO über `seo_item`
- `CollectionDetail`
- darin Item Sections via `SectionRenderer`

Collection Item Rendering ist damit schon kompatibel mit dem Section-System, solange Sections in `item.data.sections` liegen.

### Produkte

Route: `apps/renderer/src/app/shop/[slug]/page.tsx`

Rendert:

- Header/Footer
- `ShopProductDetailSection`
- Produktdaten aus `products`
- keine freien Produkt-Sections

Ein späterer Produkt-Entity-Editor muss daher additiv eingebunden werden:

- ohne Custom Sections: alter PDP-Renderer bleibt aktiv
- mit Custom Sections: Sections rendern und Produktdaten als Kontext bereitstellen

### Produktkategorien

Aktuell gibt es keine gleichwertige Kategorie-Detailroute. Kategorien erscheinen über Shop-Grid/API als Filter.

Ein Kategorie-Editor braucht zuerst eine klare Zielroute:

- entweder `/shop?kategorie={slug}` als Preview-/Listing-Ziel
- oder neue Route `/shop/kategorie/[slug]`

Die zweite Variante ist stärker, aber invasiver.

## Admin-Actions

### Pages

Quelle: `apps/renderer/src/app/admin/pages/actions.ts`

Pages haben eigene Actions für:

- Page laden
- Page aktualisieren
- Section hinzufuegen
- Section-Daten aktualisieren
- Section-Metadaten aktualisieren
- Section loeschen
- Sections sortieren

Das ist der vollständigste Action-Satz.

### Collection Items

Quelle: `apps/renderer/src/app/admin/collections/actions.ts`

Collection Items haben:

- Item laden
- Item aktualisieren
- Item loeschen
- `data` komplett speichern

Es gibt keine granularen Section-Actions. Der Item Editor schreibt Sections in `data.sections`.

Das ist für einen Adapter ausreichend, solange der gemeinsame Editor nicht voraussetzt, dass jede Section einzeln persistiert wird.

### Shop

Quelle: `apps/renderer/src/app/admin/shop/actions.ts`

Produkte und Kategorien haben Actions für Stammdaten. Es gibt keine Actions für Entity-Sections.

Empfehlung für später:

- neue generische Entity-Content-Persistenz ergänzen
- Shop-Stammdaten nicht mit Layout-Content vermischen

## Preview und FAB

Quelle:

- `apps/renderer/src/components/admin/preview-context.tsx`
- `apps/renderer/src/components/publish-fab.tsx`
- `apps/renderer/src/app/admin/pages/[id]/page-editor.tsx`
- `apps/renderer/src/app/admin/collections/[key]/[itemId]/item-editor.tsx`
- `apps/renderer/src/app/live-preview/client.tsx`

Befund:

- Es gibt einen globalen `PublishFab`.
- Page Editor und Collection Item Editor verstecken den globalen FAB und nutzen lokale FABs.
- Page Editor sendet `sections`, `industry`, `styleVariant`, `locale`.
- Item Editor sendet nur `sections`, `industry`.
- Product Form setzt Preview-URL separat auf `/shop/{slug}`.

Empfehlung:

- PreviewTarget in den PreviewContext einführen.
- Lokale FABs erst entfernen, wenn Page und Item den globalen Save-/Preview-Vertrag erfüllen.
- Preview-Payload für alle Entities vereinheitlichen.

## Farben und Design-Tokens

Farbquellen:

- `apps/renderer/src/lib/styles.ts`
- `apps/renderer/src/lib/brand-colors.ts`
- `apps/renderer/src/lib/design-vars.ts`
- `styleOverrides` auf Section-Ebene
- `SectionColorEditor`

Befund:

- Das Grundprinzip ist korrekt: globale Defaults, Brand/Design Overrides, lokale Section Overrides.
- Es gibt aber mehrere konkurrierende Variablenfamilien.
- Einige Sections nutzen harte Tailwind-Farben oder eigene Daten-Farbfelder.
- Section Overrides funktionieren nur verlässlich, wenn die Section die entsprechenden CSS-Variablen konsumiert.

Empfehlung:

- kanonische Token-Liste definieren
- alte Token weiter mappen
- Sections schrittweise auf kanonische Token umstellen
- keine bestehenden Tenant-Farbwerte entfernen

## Admin-Editor-Parität

Page Editor ist aktuell stärker als Item Editor.

Page Editor hat:

- i18n
- Preview-Iframe-Ref für Color Editor
- `styleVariant`
- Page SEO
- granulare Section-Actions
- locked Sections

Item Editor hat:

- Sections in `data.sections`
- SEO Panel für Items
- lokale Section-Bearbeitung
- weniger Preview-Kontext
- keine gleichwertige i18n-Unterstützung

Empfehlung:

- zuerst `SectionStackEditor` extrahieren
- Page und Item daran anschließen
- Persistenz über Adapter trennen
- keine direkte Wiederverwendung des Page Editors für Items

## Validierung und Tests

Vorhanden:

- Root Scripts: `build`, `lint`, `typecheck`
- Renderer: `next build`
- DB: `typecheck`, `generate`, `push`
- diverse manuelle Check-/Seed-Skripte unter `scripts`

Nicht gefunden:

- dedizierte automatisierte Tests für Entity Editor
- Snapshot-Diff-Test zwischen altem und neuem Render-Input
- Registry-Test, der Section Registry, Admin Editor und Renderer vollständig abgleicht

Für den Umbau erforderlich:

- Typecheck
- Build
- Section Registry Audit
- Snapshot Shape Audit
- Preview Payload Audit
- manuelle Browser-Prüfung für Page, Item, Overview, Product, Category

## Hauptrisiken

1. Publish-Semantik ist nicht einheitlich.
   Pages haben `status`, Items haben `published`, Produkte haben `status`, Snapshots werden nicht primaer genutzt.

2. Produkt- und Kategorie-Layoutdaten haben noch keinen Speicherort.
   Ein Umbau braucht entweder neue JSONB-Felder oder eine generische Entity-Content-Tabelle.

3. Section-Farben sind nicht komplett standardisiert.
   Ein gemeinsamer Editor allein garantiert noch keine visuelle Steuerbarkeit.

4. Item Editor kann Page-Fähigkeiten nicht ohne Adapter-Parität erben.
   Persistenz und Preview müssen erst normalisiert werden.

5. i18n ist für Pages besser gelöst als für Items/Shop.
   Der gemeinsame Editor braucht einen Entity-weiten i18n-Vertrag.

## Sichere Umbaugrenze nach Phase 0

Der erste produktive Schritt sollte keine Datenmigration sein.

Sicherer erster Schritt:

1. Gemeinsamen `EditableSection` Type einführen.
2. Pure Mapper schreiben:
   - Page Section Row -> EditableSection
   - EditableSection -> Page Section Update
   - Collection Item JSON Section -> EditableSection
   - EditableSection[] -> `collection_items.data.sections`
3. `SectionStackEditor` aus Page/Item Editor extrahieren.
4. Bestehende Page- und Item-Actions unveraendert weiterverwenden.
5. Build/Typecheck und manuelle Preview prüfen.

Nicht in den ersten Schritt:

- keine Migration bestehender Daten
- keine Änderung der Public Routes
- keine Änderung am Publish-System
- keine Produkt-/Kategorie-Custom-Sections
- keine Entfernung alter Farbvariablen

## Empfehlung für Phase 1

Phase 1 sollte eine reine Refaktorierung ohne Verhaltensänderung sein:

- `EditableSection` und Hilfsmapper einführen
- `SectionStackEditor` extrahieren
- Page Editor weiter auf `page_sections` speichern lassen
- Item Editor weiter auf `collection_items.data.sections` speichern lassen
- gemeinsame Preview-Payload-Struktur vorbereiten, aber lokale FABs noch nicht entfernen

Erst wenn Phase 1 stabil ist, sollte Phase 2 die echte Editor-Parität herstellen.
