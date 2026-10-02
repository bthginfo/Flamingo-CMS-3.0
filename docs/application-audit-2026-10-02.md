# Flamingo: Anwendungsaudit vom 2. Oktober 2026

## Umfang

Erneute Prüfung von Renderer und Marketing-Anwendung mit Schwerpunkt auf CMS, Section-Verträgen, Beispieldaten, AI Content API und Shop. Die Änderungen beheben konkrete Fehler und ergänzen wiederholbare Prüfungen. Dieser Bericht ergänzt die älteren Audits unter `docs/audit/`.

## Behobene Fehler

| Bereich | Fehler | Änderung |
| --- | --- | --- |
| Individuelle Section-Farben | Texte auf inneren Bildflächen übernahmen normale Heading-/Body-Farben. Die inversen Rollen waren als Aliase gekoppelt. | `onDarkHeading`, `onDarkBody` und `onDarkMuted` sind eigenständige CMS-Felder. Renderer, Editor, API-Verträge und Instructions verwenden dieselbe Zuordnung. |
| Auswahlkarten | Eine globale Button-Regel überschrieb bereits korrekt zugeordnete Kartenhintergründe. Beschriftung und Hintergrund gehörten danach zu verschiedenen Farbpaaren. | Karten und explizite Token-Utilities sind von der Legacy-Regel ausgenommen. Das betrifft unter anderem Anfrageassistent, Offer Matcher und Advanced-Sections. |
| Branchenvorschauen | Die Vorschau verwendete teilweise globale statt zur Branche passende Farbwerte. | Die Vorschau erzeugt ihre kanonischen CSS-Tokens über denselben Brand-Resolver wie die Website. |
| Kontrast | Badges ohne Badge-Hintergrund, gedimmte Beschriftungen, dekorative Akzentfarben als kleine Texte sowie falsche Karten- und Bildrollen. | Korrekturen unter anderem für Hotel, Tattoo, Consulting, Shop, Before/After, Timeline und Advanced. Normale Texte werden auch gegen den alternativen Section-Hintergrund geprüft; Placeholder behalten die lesbare Input-Farbe. |
| Beispiele | Leere oder falsch strukturierte Video-, Logo-, Menü-, Legal-, News-, Salon- und Tourismus-Beispiele; unterschiedliche Hero-Daten im CMS und in der Vorschau. | Gemeinsame Beispieldaten und ein gemeinsamer Branchen-Hero-Generator. Tourismus-Texte, Dauer und Saisonzeiten verwenden die tatsächlich gerenderten Felder; die saisonale Auswahl enthält vier Jahreszeiten. |
| React und Vorschau | Hydration-Unterschiede in Advanced-Sections und Instagram; leere Camera-Section bei reduzierter Bewegung; unsichtbare Mobile-Dock-Vorschau. | Hydration-sichere Initialzustände, statischer Camera-Fallback, explizite Vorschau-Daten für Instagram und sichtbarer Dock in der isolierten Vorschau. |
| Bedienung | Unbenannte Controls und fehlende Formularzuordnungen; Before/After nur mit Pointer bedienbar. | Namen und Labels ergänzt; Before/After unterstützt Pfeiltasten sowie Home/End und meldet den Wert über ARIA. |
| CMS-Metadaten | Ein runtime-seitig erweitertes Metadatenobjekt konnte unzulässige Spalten in das Update einschleusen. | Explizite Feld-Allowlist und Typprüfung. Typwechsel, gesperrte Definitionen und Paid-Berechtigungen werden serverseitig geprüft. |
| CMS-Seiten | Duplizieren und Umordnen konnten teilweise Änderungen schreiben; Systemseiten und Fehlerantworten waren nicht überall sauber behandelt. | Atomare Duplikation und Reihenfolge-Updates mit Ownership-Prüfung; Schutz der Systemseiten und verständliche UI-Fehler. |
| AI API: Request Bodies | Ungültige Typen, Content-Types und sehr große Bodies wurden uneinheitlich behandelt. | Gemeinsamer Reader mit tatsächlichem 2-MiB-Stream-Limit, UTF-8-/JSON-Prüfung und definierten 400-/413-/415-Antworten. |
| AI API: Seiten | Ersetzen einer Seite konnte nach einer späteren Validierungs- oder Schreibstörung einen teilweise geänderten Zustand hinterlassen. | Vorabvalidierung aller Sections und Metadaten; zusammengehörige Schreiboperationen per Neon-HTTP-Batch, mit Seitensperre für Ersetzungen. |
| AI API: Collections/Navigation | Item-Zugriffe waren nicht überall an den angefragten Collection-Key gebunden; Teilupdates konnten ausgelassene Werte löschen. | Scoping nach Tenant, Collection-Key und Item-ID; Navigation und Lokalisierungen erhalten ausgelassene Werte. |
| AI API: Auth/Fehler | Unnötige Zusatzabfragen für Add-ons und häufige `lastUsed`-Writes; interne Fehlermeldungen und falsche 500-Antworten für verpackte Duplicate-Fehler. | Live-Berechtigungen im Auth-Select, `lastUsed` höchstens einmal pro Stunde aktualisiert; Fehlercode aus der `cause`-Kette ergibt korrekt 409. Logs verwenden Request-ID, Fehlername und SQLSTATE ohne SQL oder Request-Parameter. |
| Shop API | Ungültige Cent-/Bestandswerte, Rabattgrenzen, Datumsspannen, Versanddaten und Methoden; Kategorie-Updates löschten ausgelassene Felder. | Gemeinsame Eingabevalidierung, Tenant-Prüfung von Produktkategorien, atomare Versandzonen/-methoden, echte Teilupdates und explizite Null-Resets. |
| SumUp | Ein Fehler beim Benachrichtigen konnte nach erfolgreicher Zahlungsprüfung eine falsche Webhook-Fehlerantwort erzeugen. | Provider-Status wird geprüft; Fehler nach abgeschlossener Zahlungsbearbeitung werden getrennt behandelt. |
| Abhängigkeiten | Der Produktionsaudit meldete 30 bekannte Advisories, darunter 2 kritische. | Next.js, Nodemailer, Tiptap und betroffene transitive Abhängigkeiten aktualisiert; danach 0 bekannte Produktions-Advisories. |

Neon unterstützt atomare HTTP-Transaktionen über den [Drizzle Batch-Adapter](https://orm.drizzle.team/docs/batch-api). Die verwendete Next.js-Version 15.5.27 enthält unter anderem die Fixes für die [Windows-RCE](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36) und die [AVIF-RCE](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4).

## Verifikation

| Prüfung | Ergebnis |
| --- | --- |
| Automatisierte Tests | 625 bestanden: 545 Renderer, 80 Marketing |
| Produktionsbuilds | Renderer und Marketing bestanden |
| Browser-Matrix | 488 Zustände für 244 Implementierungen auf Desktop/Mobil: 0 Befunde; anschließend 6 erfolgreiche Wiederholungen für die zuletzt verbesserten Tourismus-Sections |
| Farbverträge und Render-Mirror | 54 Farbfelder, 25 Branchen × 242 Typen, keine fehlenden Rollenbindungen |
| Token-Kopplung | 34 Rollen, 8 Farbpaare und 4 Surface-Aliase ohne unerlaubte Kopplung |
| CMS-/API-Surface | Generierte Felder und Beispieldaten synchron |
| Section-Datenverträge | Keine Mismatches |
| Demo-Quelldaten | 18 Branchenkonfigurationen, keine gemeldeten Fehler |
| Environment-Vertrag | Keine fehlenden Build-Variablen |
| Credential-Literale | Keine Befunde in den geprüften versionierten Dateien |
| Feste Farbwerte | 62 Referenzen gegenüber der Baseline von 209, kein Regressionsbefund |
| Produktionsabhängigkeiten | 0 bekannte Advisories |

Manuell im Browser geprüft: Guided Choice einschließlich Zurück/Neustart; Anfrageassistent bis zur Kontaktstufe mit übernommener Auswahl und lesbaren Placeholdern; Preisberechnung einschließlich Add-ons und weiterer Sprache; Shop-Suche und Kategorieauswahl; unabhängige normale/Bild-Farben und Tastaturbedienung im Before/After; Hotel-Badges und die korrigierten Tourismus-Karten. Drei Produktions-Smoke-Requests mit ungültiger Authentifizierung an Instructions, Pages und Shop Settings lieferten wie erwartet 401.

Die wiederholbare Browserprüfung ist mit `pnpm audit:application-previews` verfügbar. Sie prüft HTTP-Status, Section-Abstürze, JavaScript-Fehler, leere Vorschauen, horizontales Überlaufen, Kontrast sowie Namen/Labels und relevante ARIA-Regeln. `QA_BASE_URL`, `QA_OUTPUT`, `QA_TYPES` und `QA_WORKERS` konfigurieren Ziel, Bericht, Typauswahl und Parallelität. Rohberichte und Screenshots liegen lokal unter dem ignorierten Verzeichnis `tmp/application-audit-2026-10-02/`.

## Datenbankverbrauch

Die bereits umgesetzten Cache-, Invalidation- und Cron-Änderungen bleiben aktiv. Das Auth-Update reduziert zusätzlich redundante Add-on-Abfragen und häufige PAT-Metadaten-Writes. Die vorherige Prüfung der 15 Datenbanken, Kosten und Free-Pläne ist im [Neon-Bericht vom 1. Oktober](neon-usage-audit-2026-10-01.md) dokumentiert. Ein Cache reduziert Abfragen; eine Garantie, bei beliebigem Traffic unter jedem Monatslimit zu bleiben, ergibt sich daraus nicht.

## Grenzen der Prüfung

- Die Browser-Matrix erfasst die gemeinsamen Beispieldaten und die native Branche jeder unterschiedlichen Implementierung. Sie deckt nicht jede Kombination aus realen Tenant-Daten, Sprache, Farbschema und Interaktionszustand ab.
- Automatischer Kontrast prüft berechenbare CSS-Flächen. Lesbarkeit über jedem einzelnen Bildpixel wurde damit nicht bewiesen.
- API-/CMS-Validatoren und atomare Schreibpfade wurden über Tests, Codeprüfung und Build verifiziert. Ein echter Rollback-/Parallelitätsversuch gegen eine isolierte Neon-Datenbank wurde nicht durchgeführt. Gleichzeitige unabhängige PATCH-Requests besitzen keine allgemeine optimistische Versionskontrolle.
- Es wurden keine echten Bestellungen, Abbuchungen, Formularanfragen oder E-Mail-Zustellungen ausgelöst. Provider- und SMTP-End-to-End-Tests bleiben separat erforderlich.
- Es erfolgte kein vollständiger manueller Screenreader-Test. Der Build weist weiterhin auf die dynamische `require`-Nutzung in `@e-invoice-eu/core` hin; beide Anwendungen müssen dennoch erfolgreich bauen.
