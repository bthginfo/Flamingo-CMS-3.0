# Entity Editor DB Handoff

Stand: 2026-05-26

Dieses Dokument sammelt alle Datenbank- und Persistenzthemen, die bewusst nicht Teil der ersten Entity-Editor-Umsetzung sind.

## Aktuelle Umsetzungsgrenze

Der Entity-Editor-Branch baut zunächst nur Dinge, die ohne DB-Migration möglich sind:

- gemeinsamer `EditableSection`-Typ
- Mapper für bestehende Page Sections und Collection Item Sections
- gemeinsamer Section-Editor
- bessere Admin-Parität zwischen Page und Collection Item
- Registry-/Tenant-Audits
- Preview-/Action-Bar-Vereinheitlichung, soweit ohne Datenmodelländerung möglich

Nicht in diesem Branch:

- neue Tabellen
- neue Spalten
- Migration bestehender Tenant-Daten
- Umstellung der Public Renderquelle auf `published_snapshots`
- neues Draft-/Publish-System

## Bereits ohne DB umgesetzt

- Pages und Collection Items nutzen dieselbe Editor-Infrastruktur für Section-Stacks.
- Collection Overview Pages können im Page Editor über den bestehenden `collectionList`-Section-Typ bearbeitet werden.
- Der Produkt-Editor nutzt dieselbe schwebende `EditorActionBar` für Vorschau und Speichern, bleibt aber beim bestehenden Produktdatenmodell.
- Produkt-Vorschau zeigt für gespeicherte Produkte auf die bestehende PDP-Route `/shop/[slug]`; neue, noch nicht gespeicherte Produkte fallen auf `/live-preview` zurück.

## Offene DB-Themen

### 1. Custom Sections für Produkte

Aktuell haben Produkte keine freie Section-Struktur. Produktdaten liegen in `products`, Varianten in `product_variants`, Optionen in `variant_options`.

Aktueller Code-Audit:

- `ProductForm` editiert nur Produkt-Stammdaten und SEO-Felder.
- `createProduct`/`updateProduct` persistieren keine Section-Stacks.
- Die öffentliche PDP in `apps/renderer/src/app/shop/[slug]/page.tsx` rendert `ShopProductDetailSection` aus dem Live-Produktdatensatz.
- Ein voller Section-Editor für Produkte wäre ohne Persistenz nur scheinbar editierbar und wurde deshalb nicht eingebaut.

Zu entscheiden:

- Wo werden Produkt-Sections gespeichert?
- Sollen Produkt-Stammdaten und Layoutdaten strikt getrennt bleiben?
- Wie wird i18n für Produkt-Sections modelliert?
- Wie wird Preview für unveröffentlichte Produkt-Sections umgesetzt?
- Ersetzt ein Produkt-Section-Stack die aktuelle PDP vollständig oder ergänzt er sie unter/über dem Standard-Produktdetail?

Empfohlene Richtung:

- Produkt-Stammdaten bleiben in `products`.
- Layout/Sections liegen in einer generischen Entity-Content-Struktur.
- Ohne Custom Sections bleibt der bestehende PDP-Renderer aktiv.

### 2. Custom Sections für Produktkategorien

Produktkategorien haben aktuell nur Stammdaten:

- `name`
- `slug`
- `description`
- `image`
- `parentId`
- `sortOrder`

Aktueller Code-Audit:

- Der Admin-Bereich für Kategorien ist eine CRUD-Liste mit Inline-Formular.
- Es gibt im aktuellen Code keine dedizierte öffentliche Kategorie-Detailroute, die eine Kategorie-Preview eindeutig rendern könnte.
- Kategorie-Sections brauchen deshalb zuerst eine Routen- und Persistenzentscheidung.

Zu entscheiden:

- Gibt es künftig echte Kategorie-Seiten, z.B. `/shop/kategorie/[slug]`?
- Oder bleibt Kategorie nur ein Filter auf `/shop?kategorie={slug}`?
- Wo werden Kategorie-Sections gespeichert?
- Wie werden Kategorie-Seiten im Admin gespeichert, veröffentlicht und in der Vorschau geöffnet?

### 3. Generische Entity-Content-Persistenz

Mögliche Optionen:

1. JSONB-Felder direkt auf `products` und `product_categories`
2. generische Tabelle `entity_content`
3. generische Tabelle `entity_sections`

Bewertung:

- JSONB-Felder sind am schnellsten, koppeln Layout aber an Shop-Tabellen.
- `entity_content` ist flexibel und hält Shop-Tabellen schlank.
- `entity_sections` wäre am ähnlichsten zu `page_sections`, ist aber mehr Schema-Aufwand.

Empfohlene Richtung für spätere Entscheidung:

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

Alternativ, wenn granulare Section-Updates auch für Produkte/Kategorien wichtig werden:

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

### 4. Publish-/Snapshot-System

Das Schema enthält `published_snapshots` und `publish_history`, aber der öffentliche Renderer baut den aktiven Snapshot aktuell aus Live-Tabellen und cached ihn.

Zu entscheiden:

- Soll `published_snapshots` künftig die primäre Renderquelle werden?
- Wie werden Pages, Collection Items, Produkte und Kategorien gemeinsam veröffentlicht?
- Braucht jedes Entity einen eigenen Draft-Status?
- Wie funktioniert Rollback?
- Wie wird Cache-Invalidierung pro Entity gelöst?

Empfehlung:

- Nicht während Page/Item-Editor-Parität umbauen.
- Erst nach stabilem Editor eine eigene Publish-/Snapshot-RFC schreiben.

### 5. i18n für Nicht-Page-Entities

Pages haben bereits i18n-Handling in Section-Daten. Collection Items werden über API-Instructions teilweise unterstützt, der Admin ist aber nicht gleichwertig.

Zu entscheiden:

- Einheitliches i18n-Format für Sections in Items, Produkten und Kategorien
- Ob Titel/Slug/SEO pro Locale ebenfalls zentral modelliert werden
- Ob bestehendes `_localized`-Format beibehalten oder normalisiert wird

## Übergabeempfehlung

Die andere KI sollte zuerst eine Mini-RFC für diese Punkte schreiben, bevor DB-Migrationen umgesetzt werden:

1. Speicherort für Produkt-/Kategorie-Sections
2. Zielroute für Kategorie-Seiten
3. Draft-/Publish-Semantik für alle Entity-Typen
4. i18n-Datenformat für Nicht-Page-Entities
5. Migrations- und Rollback-Strategie

Bis diese Entscheidungen getroffen sind, bleibt der Entity-Editor-Umbau bewusst DB-frei.
