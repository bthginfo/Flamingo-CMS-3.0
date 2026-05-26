# Entity Editor Phase 0.5 Instrumentation

Stand: 2026-05-26

Diese Phase ergänzt Messinstrumente für den Entity-Editor-Umbau. Die Skripte verändern keine Daten.

## Skripte

### Section Registry Audit

```bash
pnpm audit:sections
pnpm audit:sections -- --out reports/section-registry.json
```

Prüft pro Section-Typ:

- im Admin auswählbar
- im Renderer registriert
- in API-Instructions dokumentiert
- dedizierter Data Editor vorhanden
- dediziertes Color Mapping vorhanden

Das Skript ist dateibasiert und benötigt keine Datenbank.

### Tenant Content Audit

```bash
pnpm audit:tenant -- --tenant <tenant-id-oder-slug>
pnpm audit:tenant -- --tenant <tenant-id-oder-slug> --out reports/tenant-before.json
```

Prüft pro Tenant:

- Pages, Page-Typen und Status
- Page Sections und Section-Typen
- Collections und Collection Items
- Item Sections in `collection_items.data.sections`
- Produkte und Kategorien
- SEO-Abdeckung
- verwendete Section-Typen

Das Skript liest nur Daten. Es benötigt `DATABASE_URL` und installierte Dependencies.

## Aktueller Section-Befund

Der erste Section-Registry-Lauf bestätigt die Premium-Section-Lücken:

- `verticalTimeline`: renderbar, auswählbar, API-Schema vorhanden, aber kein dedizierter Data Editor und kein dediziertes Color Mapping
- `beforeAfterSlider`: renderbar, auswählbar, API-Schema vorhanden, aber kein dedizierter Data Editor und kein dediziertes Color Mapping
- `horizontalScrollShowcase`: renderbar, auswählbar, API-Schema vorhanden, aber kein dedizierter Data Editor und kein dediziertes Color Mapping

Diese Punkte gehören in Phase 1.5.

## Einsatz im Umbau

Vor Phase 1:

```bash
pnpm audit:sections -- --out reports/sections-before.json
pnpm audit:tenant -- --tenant <test-tenant> --out reports/tenant-before.json
```

Nach Phase 1:

```bash
pnpm audit:sections -- --out reports/sections-after.json
pnpm audit:tenant -- --tenant <test-tenant> --out reports/tenant-after.json
pnpm audit:tenant:diff -- reports/tenant-before.json reports/tenant-after.json
```

Danach werden die JSON-Dateien verglichen. Wenn sich ohne bewusste Inhaltsänderung Section-Typen, Reihenfolgen, Style Overrides oder Item Sections verändern, ist das ein Stop-Signal.
