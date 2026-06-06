# Demo Tenant Filler

Premium content per Branche, eingespielt über die öffentliche Content-API
(`https://flamingo-renderer.vercel.app/api/v1/*`). Ein Skript pro Tenant.

Wichtig: Das Befüllen der Demo-Tenants läuft über PAT/API und braucht keinen
Git-Push. Ein Push ist nur nötig, wenn sich Code, Runner, API-Instructions,
Dokumentation oder der Status im Repo ändern sollen. Tenant-Content selbst ist
nach `publish` live und triggert keinen Vercel-Build.

## Schnellstart

```bash
# 1) (einmalig) Hol dir die offizielle Playbook-Doku für genau diesen Tenant
node scripts/demo-tenants/fetch-instructions.cjs handwerk
#    → schreibt _cache/instructions-handwerk.json + .txt

# 2) Tenant befüllen (wipe + brand + nav + pages + collections + publish + validate)
node scripts/demo-tenants/handwerk.cjs
```

## Was wo liegt

| Pfad                                  | Zweck                                                                                              |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `_lib/api.cjs`                        | Minimaler HTTPS-Client, ein Wrapper pro Endpoint. Keine externen Abhängigkeiten.                   |
| `_lib/runner.cjs`                     | `run(tenantSpec)` — wipt vorhandenen Content, schreibt brand/contact/design/nav/footer/pages/etc., publiziert und validiert. |
| `fetch-instructions.cjs <tenant>`     | Speichert die per-Tenant API-Anweisung (`GET /instructions`) lokal. Enthält Textanweisung, strukturiertes AI-Playbook, Style-System und Section-Style-Contracts. **Vor jedem neuen Tenant zuerst aufrufen.** |
| `handwerk.cjs`                        | Vollständige Referenz-Implementierung. Template für alle weiteren Tenants.                         |
| `STATUS.md`                           | Welcher Tenant ist fertig, was steht noch offen.                                                   |
| `HANDOFF-PROMPT.md`                   | Konkreter Prompt, den die nächste AI bekommt.                                                      |
| `_cache/`                             | Lokal gespeicherte Instructions-Dumps (nicht committen → in .gitignore).                           |

## Goldene Regeln

1. **Nie zwei Tenants parallel.** Ein Tenant von Brand bis Publish, dann der nächste.
2. **Immer zuerst `fetch-instructions.cjs <tenant>` ausführen.** Jeder Tenant hat
   eigene `availableSectionTypes`, eigene Addons (Shop, Booking), eigene Pflicht­seiten.
3. **Inhalte müssen echt klingen.** Keine Floskeln ("Wir bieten Ihnen…"), keine
   AI-Stocksätze, branchen­spezifisch, lokal verankert (Stadt, Region, Geschichte).
4. **Mindestens 6 Sections auf der Startseite**, 3–5 auf jeder Unterseite,
   Array-Felder mit mind. 3 Einträgen.
5. **Farbkontrast prüfen.** Bei dunklen Hintergründen `--token-on-dark-*`
   überschreiben, bei eigenem `--token-btn-bg` immer `--token-btn-text` mitschreiben.
6. **Variation zwischen Tenants.** Keine zwei Tenants teilen sich Hero-Struktur,
   Bilder oder Sektionsreihenfolge. Brand-Palette spürbar anders, Typografie anders.
7. **Bilder von Unsplash** (`https://images.unsplash.com/photo-XXXXXX?auto=format&fit=crop&w=1920&q=80`).
   Themenspezifisch, lizenzfrei, nicht generisch.
8. **Validate vor Publish.** Der Runner ruft beides automatisch, aber bei
   `colorIssues` oder `contentIssues` musst du das Tenant-Spec anpassen und neu laufen lassen.

## Template-Workflow für einen neuen Tenant

```bash
# 1) Instructions holen
node scripts/demo-tenants/fetch-instructions.cjs restaurant

# 2) handwerk.cjs als Vorlage kopieren
cp scripts/demo-tenants/handwerk.cjs scripts/demo-tenants/restaurant.cjs

# 3) restaurant.cjs umarbeiten:
#    - PAT austauschen (aus fetch-instructions.cjs übernehmen)
#    - Identität neu erfinden (Name, Stadt, Geschichte, Brand-Palette, Fonts)
#    - availableSectionTypes / instructions.txt lesen und sektions-spezifisch wählen
#      (z.B. Restaurant: reservation, menuShowcase, eventCalendar statt servicesGrid)
#    - Inhalte komplett neu schreiben
#    - Collections branchen-typisch (Restaurant: speisekarte, events, team)

# 4) Laufen lassen
node scripts/demo-tenants/restaurant.cjs

# 5) Auf der Live-Site prüfen, ggf. anpassen, erneut laufen lassen
#    (wipe=true entfernt vorherigen Run sauber)

# 6) STATUS.md aktualisieren
```

## Push-Policy

- **Kein Push pro Tenant nötig**, wenn nur Live-Content über die API befüllt
  wurde und die Repo-Skripte nicht dokumentiert werden müssen.
- **Push sinnvoll**, wenn ein neues `<tenant>.cjs`, `STATUS.md` oder ein
  Runner-/Renderer-Fix festgehalten werden soll.
- **Push zwingend**, wenn die Live-API-Instructions oder Renderer-Code geändert
  wurden. Sonst sehen andere AIs weiterhin die alte API-Doku.

## Sicherheit

- Die PATs in `fetch-instructions.cjs` sind **Demo-Tenant-Tokens**.
  Sie wirken nur auf isolierte Demo-Daten der jeweiligen Renderer-Subdomain.
- Trotzdem nicht öffentlich teilen. Repo ist privat.
