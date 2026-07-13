# CMS-Admin UX Review

## Prüfgrundlage

- Reale Demo-Session über `https://www.demo.flamingomedia.online/admin/demo-login?industry=handwerk`.
- Desktop 1440, Tablet 768, Mobile 390.
- Runtime-Screenshots: kuratierte Auswahl im [Evidence Manifest](evidence/README.md); vollständige lokale Serie im Verification Log.
- Source Review von Layout, Sidebar, Page/Collection Editor, Preview-/Save-Kontext, Media, Navigation, Brand, SEO, Shop, Booking und Error States.
- Der statische `/demo/admin` ist eine separate Mock-Oberfläche und nicht repräsentativ für den realen Admin. Er ist mobil stark veraltet/beschädigt und sollte nicht als Produktdemo geführt werden.

## Gesamturteil

Der Desktop-Editor hat eine gute Basis: klare Seiten-/Section-Metapher, kompakte Section-Liste, Side-by-side-Preview, direkte Feldbearbeitung, Crash-Recovery, Before-Unload-Schutz, klare Addon-Bereiche und eine sichtbare Publish-Aktion. Für nichttechnische Kunden fehlen jedoch ein konsistentes Save-/Live-Modell, kuratierte Section-Auswahl, zuverlässige Kernrouten, mobile Arbeitsfähigkeit, echte Versions-/Undo-Flows und kontextbezogene Qualitätsführung.

Die größten UX-Fragen bleiben aktuell offen:

- **Wo bin ich?** Sidebar, Seiteneditor, Preview-Sidepanel und mehrere FABs konkurrieren.
- **Was wird geändert?** Globale vs. Seiten- vs. Section-Settings sind nicht immer sichtbar getrennt.
- **Ist es gespeichert?** Text, Farben, Reihenfolge, Add/Delete haben unterschiedliche Save-Semantik.
- **Ist es live?** Publish ist sichtbar, aber der genaue Diff und aktive Snapshot nicht.
- **Kann ich zurück?** Lokales Crash-Recovery ist stark; echte Undo-/Version-History fehlt im Flow.
- **Welche Section brauche ich?** 205 auswählbare Typen sind trotz Kategorien zu viel.

## Journey-Matrix

| Journey | Aktueller Flow | Friction / Risiko | Empfohlener Flow | Erwarteter Impact |
|---|---|---|---|---|
| 1. Erster Login | Passwort oder öffentlicher Demo-Login → Dashboard | Tour startet gleichzeitig mit Cookie-Banner und Tooltip; drei Overlays blockieren sich. Demo speichert gemeinsame Daten. | Consent/technische Admin-Cookies vor Tour klären; rollenabhängige 4-Schritt-Orientation; Demo als isolierte Sandbox. | Schnellere Orientierung, weniger Abbruch, kein Demo-Schaden. |
| 2. Dashboard | Kennzahlen, Schnellzugriff, Website-Health, Preview/Live/Publish | Gute Übersicht, aber „0 Bilder / alle gepflegt“ kann widersprüchlich wirken; Health ist nicht drill-down-fähig. | Aufgabenorientierter Health-Feed mit „Warum?“, betroffenen Seiten und direkter Reparatur. | Aktivierung, Qualität, weniger Support. |
| 3. Seiten verstehen | Sidebar „Seiten“, Liste, Editor | Live `/admin/pages` crasht reproduzierbar; ohne Liste ist Kernflow blockiert. | RSC-Ursache beheben; robuste Skeleton/Error Row; zuletzt bearbeitete Seiten auf Dashboard. | P1-Fix für Kernjourney. |
| 4. Seite erstellen | Titel → automatisch generierter Slug → Redirect Editor | Gleicher Titel/Slug endet im DB-Fehler; kein Seitentyp/Ziel/Starter-Flow. | Wizard: Seitenziel, Name, URL-Vorschlag, Recipe, Navigation ja/nein; Kollision inline. | Bessere Erstseite, weniger leere/beliebige Pages. |
| 5. Seite umbenennen/URL | Titel und Slug im Editor | Auswirkung auf Navigation/SEO/alte Links bleibt unklar; kein Redirect-Angebot. | URL-Impact-Panel, Redirect automatisch, Preview der finalen URL. | Verhindert Broken Links/SEO-Verlust. |
| 6. Section hinzufügen | Modal mit Suche, Kategorien, Empfehlungen und 205 Typen | Visuell ordentlich, aber kognitiv überladen; „Andere: Branche“ repliziert technische Historie. | Goal-first Picker: „Vertrauen“, „Leistung erklären“, „Anfrage“, „Buchen“, „Verkaufen“; 6–10 kuratierte Empfehlungen; Advanced Library separat. | Schnellere Auswahl, konsistent bessere Seiten. |
| 7. Section bearbeiten | Accordion-Card öffnet viele Felder; Rich Text, Icon, Media, Farbe | Lange Formulare, technische Feldnamen, uneinheitliche CTA-/Media-Strukturen; Sidepanel deutlich besser als reine Liste. | Progressive disclosure: Inhalt → Aktion → Media → Layout → Advanced; Live-Qualitätswarnungen; „gute Beispielbefüllung“. | Weniger Fehler, bessere Inhalte. |
| 8. Section direkt in Preview | Preview-Sidepanel, „Direkt bearbeiten“, Overlays | Starkes Konzept; kleine Vorschau im Sidepanel kann Details verschleiern; Fokuswechsel/Save-Status nicht eindeutig. | Element anklicken → zuständiges Feld fokussieren; Desktop/Tablet/Mobile nebeneinander optional; aktiver Edit-Kontext sichtbar. | Signature-Feature, weniger Sucharbeit. |
| 9. Reordering | Drag Handle, sofortiger Server-Write | Keine Tastatur-/Button-Alternative sichtbar; mehrere Einzelupdates, keine Fehler-Rücknahme. | Move up/down plus Drag; atomarer Command; Undo Toast; Position „3 von 10“. | Accessibility und Vertrauen. |
| 10. Hide/Delete | Eye/Delete pro Card; Browser-Confirm; Delete sofort | Icon-Dichte, keine klare Unterscheidung „Draft verstecken“ vs. „Live entfernen“; kein Undo; UI meldet Erfolg auch bei Action-Fehler. | Beschriftete Overflow-Actions, Impact-Hinweis, Soft Delete/Undo, Live-Diff. | Weniger versehentlicher Verlust. |
| 11. Speichern | Pending Text via Save, Farben debounced, Add/Delete/Reorder sofort | Nutzer kann Save-Status nicht korrekt ableiten; mehrere Toaster konkurrieren. | Einheitliche Draft-Command-Queue; global „Alle Änderungen gespeichert um …“; offline/retry; keine stillen Neben-Saves. | Kernvertrauen und weniger Doppelarbeit. |
| 12. Vorschau | FAB/Sidebar öffnet Sidepanel/Live Preview | Grundidee gut; mobile Toolbar und Tooltip überlagern Content; Preview und Public Demo hatten Theme-Parity-Fehler. | Ein Preview Center mit Viewportvergleich, Draft/Live-Toggle, Link-/Contrast-/Overflow-Checks. | Weniger Überraschungen nach Publish. |
| 13. Veröffentlichen | Save pending → Preflight → Publish → „Live!“ | Kein verständlicher Änderungsdiff, kein sichtbarer Snapshot/History-Link; Fehlertexte abstrakt. | Review Screen: geänderte Seiten/Sections/Settings, Warnungen, Device-Screenshots, Publish Note, Rollback-Link. | Sicherer Publish, Premium-Vertrauen. |
| 14. Fehler/Recovery | Error Boundary + Retry; LocalStorage Draft Restore | Crash-Recovery ist stark. Production RSC Error zeigt englischen Standardtext ohne Support-ID; Retry kann Endlosschleife sein. | Deutsche Fehlermeldung, Digest/Request-ID kopierbar, alternative Navigation, Draft exportieren, Statuspage/Support. | Weniger Panik/Supportzeit. |
| 15. Media Upload/Library | Upload/URL/Library; Assetliste mit Alt/Folder | Media-Read probt alle URLs und mutiert DB; keine klare Focal-/Crop-Vorschau; Demo kann Assets löschen. | Paginiert, background health, focal point, aspect presets, usage graph, „wo verwendet?“, safe delete. | Website-Qualität und Performance. |
| 16. Navigation/Footer | Eigener Bereich, Pages als Linkquelle | Gefahr verwaister Links bei Page Delete/Rename; globale Wirkung nicht prominent. | Automatisch aus Pages referenzieren, Broken-Link-Check, locales gemeinsam, Live-Diff im Header/Footer. | Weniger Broken Links. |
| 17. Marke & Design | Viele Brand-, Farb-, Font- und Designfelder | Token-Ebenen/Surface-Rollen sind für Nichtdesigner schwer; Demo/Preview-Parität war falsch. | Kuratierte Presets + „Erweitert“; semantische Vorschau („Fläche“, „Karte“, „auf Bild“), Contrast Guard. | Premium-Ergebnis ohne Designwissen. |
| 18. SEO | Global, Page Panel, Collection Item Panel | Breite Funktionalität, aber IA verteilt; keine Priorisierung nach Impact. | SEO Health Queue, SERP/Share Preview, structured-data suggestions, broken links, canonical/redirect. | Auffindbarkeit, Retention. |
| 19. Collections/News | Collection Manager → Items → Item Editor | Persistenz/Preview schwächer als Page Editor; Sections liegen in JSON; mentale Trennung „Inhalte & Daten“/„News“ nicht eindeutig. | Gemeinsamer Entity Editor mit Adapter; Collection-Templates, Status/Publish/Preview parity. | Weniger Lernaufwand, weniger technische Sonderfälle. |
| 20. Shop/Booking | Eigene Addon-Bereiche plus Sections | Mächtig, aber viele operative Zustände; wenig E2E-Coverage; Commerce-/Booking-Sektionen im allgemeinen Picker. | Capability Dashboard mit Setup-Checklist, Testmodus, Provider Health, E2E-Testbuchung/-bestellung. | Monetarisierbare Addons mit weniger Support. |
| 21. Tablet/Mobile Admin | Responsive Sidebar/Hamburger; Cards/Formulare stapeln | Bei 390 überlagern Tooltip und bottom actions Sections; Controls sehr dicht. Statisches `/demo/admin` lässt durch fixe 256px Sidebar nur ~134px Inhalt. | Mobile: read/review/quick edits; Drawer statt fixe Sidebar; eine Bottom Bar; schwere Layoutarbeit primär Tablet/Desktop. | Nutzbarer Notfall-/Unterwegs-Flow. |
| 22. Rückkehr nach Wochen | Sidebar und Dashboard | Kein „Was hat sich seitdem geändert?“, keine Aktivitäten/zuletzt bearbeitet/Guidance. | Activity Feed, Resume Draft, zuletzt bearbeitet, offene Qualitätsaufgaben. | Retention und geringere Wiederlernkosten. |

## Informationsarchitektur

Aktuelle Hauptgruppen sind grundsätzlich sinnvoll: Übersicht, Inhalte, Anfragen/Verkauf, Website, System. Schwächen:

- „Seiten“, „Inhalte & Daten“, „News & Blog“ und „Collections“ überlappen mental.
- Shop/Booking sind Fähigkeiten, erscheinen aber zusätzlich als Sections im globalen Picker.
- „Marke & Design“ mischt einfache Markenwerte mit hochkomplexen semantischen Tokens.
- „Preview“ existiert als Sidebar-Ziel, FAB und Editor-Sidepanel.
- „Speichern“ und „Veröffentlichen“ sind UI-weit vorhanden, aber nicht über einen einheitlichen Zustandsautomaten erklärt.

Empfohlene IA:

```text
Heute
Inhalte
  Seiten
  Beiträge & Daten
  Medien
Anfragen
  Inbox
  Buchungen / Shop (wenn aktiv)
Website
  Navigation
  Marke & Design
  SEO & Qualität
Veröffentlichen
  Änderungen prüfen
  Historie / Rollback
Einstellungen
```

## Accessibility

Positive Basis: semantische Buttons/Inputs in vielen Formularen, sichtbare Focus-Styles in Komponenten, Accordion-Verträge, Axe in Live-Demo-Suite, reduced-motion an einzelnen Stellen.

Prioritäten:

- vollständige Tastaturalternative zu Drag-and-drop;
- Fokus nach Modal/Section-Add/Delete/Fehler korrekt setzen;
- Tooltips nicht als einzige Erklärung;
- Icon-only Eye/Chevron/Delete zugänglich und mit ausreichender Zielgröße;
- Save-/Publish-/Validation-Status per `aria-live`;
- Picker-Suche/Kategorien als echte Dialog-/Listbox-Semantik;
- 200%-Zoom und 390px ohne Action-Overlays;
- Rich-Text-Toolbar und Preview-Overlays keyboard/screen-reader testen.

## Mobile-/Tablet-Befunde

- Live Editor bei 390: Section Cards passen grundsätzlich, aber Demo-Banner, Tooltip und Bottom Actions überlagern mehrere Zeilen.
- Header/Demo-Banner beansprucht zu viel vertikale Fläche; CTA „Zurück“ und Hamburger konkurrieren.
- Kleine Iconcluster sind touchkritisch.
- Preview-/Full Edit ist auf Tablet sinnvoller; Mobile sollte Quick Edit, Review, Publish-Status und Inbox priorisieren.
- `/demo/admin` ist eine separate statische Oberfläche und mobil nicht verwendbar; entfernen oder klar als Mock kennzeichnen.

## Quick Wins

1. `/admin/pages`-RSC-Crash beheben und Smoke-Test hinzufügen.
2. Tour erst nach Consent/Overlay-Cleanup starten.
3. Einen Save-Status und eine Bottom Action Bar verwenden.
4. Section-Picker standardmäßig auf zielbasierte Empfehlungen begrenzen.
5. Icon-Actions beschriften/Overflow-Menü + Undo.
6. Demo-Rolle serverseitig sichtbar read-only machen, bis Sandbox-Isolation existiert.
7. Mobile Tooltips/FABs nicht über Content fixieren.

## Größere Redesign-Chancen

- **Goal-based Composer:** Seite aus Ziel und Content-Inventory planen, nicht aus 205 Komponenten.
- **Preview Quality Center:** Draft/Live, responsive compare, contrast/overflow/broken links in einem Screen.
- **Command/History Model:** jede Änderung als rücknehmbare Operation mit Actor, Zeitpunkt und Publish-Zuordnung.
- **Unified Entity Editor:** Pages und Collection Items gleiche mentale Struktur, Persistenz über Adapter.
- **Design Guardrails:** Nutzer wählt Wirkung/Preset, System sichert Tokens, Crop, Dichte und Contrast.
