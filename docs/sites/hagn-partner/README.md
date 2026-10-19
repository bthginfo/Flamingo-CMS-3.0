# Hagn & Partner — isolierte CMS-Website

## Inhalt und Betrieb

Neue eigenständige Website für **Rechtsanwälte Hagn, Deckert, Stemmer & Partner PartG mbB**, Bergbräustr. 7, 85049 Ingolstadt. Eigenständiger Tenant `a1853e0f-ff90-45ee-8fb2-8bada3812f67`, Slug `hagn-partner`. Die technische Templatefamilie `consulting` ist keine fachliche Einordnung als Steuerberatung.

Standalone-Adresse: `https://flamingo-hagn-partner.vercel.app`. Die bestehende Kanzleidomain wird hierdurch nicht umgeschaltet. Dieser neue Host erhält bewusst `noindex,nofollow`, bis eine tatsächliche Domainumstellung vereinbart ist.

24 native CMS-Seiten erhalten die ursprünglichen sinnvollen Slugs. Die frühere Historien-Dublette und Konzept-/Sekretariatsseiten erhalten eigenständigen, sinnvollen Inhalt. Sieben aktuelle Anwaltsprofile, fünf ausführliche Rechtsgebiete, Terminvorbereitung, neun echte PDF-Formulare, Kontakt, Impressum und Datenschutz sind enthalten. Es gibt keine erfundenen Einzel-Rechtsgebietsseiten oder ein funktionsloses Mandantenportal.

## Redaktion im CMS

| Bereich | Bearbeitungsweg / Datenfeld |
|---|---|
| Alle Seiten und Reihenfolge | `/admin/pages`, jeweiliger Section-Builder |
| Haupttitel, Foto, Kontaktmarge, Linkregister | `editorialHero`, Layout `correspondence`; `headline`, `text`, `imagePrimary`, `imageAlt`, `imagePrimaryPosition`, `contactRows`, `links`, `linksLabel` |
| Anwälte und Sekretariat | `teamSpotlight`, Layout `directory`; `members[].name/role/image/imageAlt/imagePosition/focus/href` |
| Rechtsgebiete / PDF-Verzeichnis | `servicesGrid`, Layout `index`; `manualCards[].title/text/href` |
| Ausführliche Inhalte | `richText.content`, `textImage.text/items` |
| Fragen | `faq.items[].question/answer` |
| Abschlussaktionen | `ctaBand`, Layout `plain`; `headline/subline/ctaPrimary` |
| Farben je Section | Registrierte Farbrollen im Section-Farbeditor; keine globale Zwangsvererbung |
| Rahmen ohne Schatten im Kontakt | Kontakt-Section → Section-Farben → Design → Karten-Schatten → kein Schatten (`--token-card-shadow: none`); Formular und Infopaneele behalten ihre Rahmen |
| Marke, Schrift, Logo | `/admin/brand` |
| Zentrale Kontaktdaten und Zeiten | `/admin/contact` |
| Formularfelder / Antwortkonfiguration | `/admin/contact-form`, `/admin/mail`; Ziel `info@hagn-partner.de` |
| Navigation und Footer | `/admin/navigation` und Footer-Einstellungen |
| Suchmaschinen | `/admin/seo` und jeweilige Seiten-SEO; Schema-Typ `LegalService` ist im Editor und Renderer registriert |
| Betreiberinformationen | `/admin/legal` verweist auf bearbeitbare `legalContent`-Sections der Seiten |
| Fotos und Formulare | `/admin/media`; Originaldateien unter `public/hagn-partner`, neue Uploads über den konfigurierten Blob-Zugang |

Ein ursprüngliches Porträt trägt technisch den Dateinamen `gabriela-radlinger.jpg`; die dargestellte Person heißt korrekt **Gabriele Radlinger**. Die angegebenen Durchwahlen sind überwiegend Sekretariatskontakte, keine unbestätigten persönlichen Kontaktdaten.

## Reproduzierbarer Builder

`scripts/hagn-partner/prepare-content.mjs` exportiert:

```js
buildHagnContent({ tenantId, baseUrl, mediaBase, mediaMap, noindex: true })
```

Die Funktion erstellt deterministische IDs und greift auf keine Datenbank zu. Ergebnis:

```text
tenant, global, navigation, footer, pages[], sections[],
collections:[], items:[], seo, seoPages[], seoItems:[], media[],
active:{snapshot}, routeManifest[], sourceManifest
```

Seiten, Section- und SEO-Zeilen verwenden Datenbankfeldnamen mit Unterstrichen. Snapshot-Sections verwenden die vorhandenen camelCase-Renderfelder. `mediaMap` kann lokale Assetpfade auf später importierte CMS-URLs abbilden. `mediaBase` ist standardmäßig `/hagn-partner`.

Der Aufruf des Scripts schreibt `tmp/hagn-partner-2026-10-19/hagn-content.json` und `route-manifest.json`. Dabei werden tatsächliche Dateigrößen und SHA-256-Werte aus dem Herkunftsmanifest in die Medienzeilen übernommen. Der reine Funktionsaufruf enthält ohne diesen separaten Import bewusst keine Dateigrößenbehauptung (`size:0`). Für eine Veröffentlichung den erzeugten vollständigen CLI-Export verwenden.

`import-assets.mjs` importiert die bestehenden, vom Nutzer freigegebenen Originalmedien. Bereits vorhandene Dateien werden wiederverwendet. Das Herkunftsmanifest trennt Fotos von Logo und Dokumenten. Es gibt keine synthetischen Personen und keine Laufzeitabhängigkeit von der alten Website für Bilder oder Downloads.

## Prüfungen

- Echte SSR-Tests: `correspondence-hero.test.ts` prüft CMS-Änderungen an Kontakt, Bild und Linkregister, sichere URLs und sichtbare Qualifikationen im Profilverzeichnis.
- `scripts/hagn-partner/validate-content.ts` prüft offline die wirkliche Section-Registrierung, erlaubte Farbrollen, zusammengesetzte SEO-Titel, interne Medien und Dateiwerte. Aus `apps/renderer` mit dem vorhandenen TSX-Loader ausführen.
- Der kanonische Farbvertrag wird nach Templateänderungen mit `generate-section-color-contracts.cjs` erzeugt und mit `check-section-color-contracts.cjs` geprüft.
- Der Hauptagent führt die tatsächlichen Seiten-, Formular-, Mobil-, SEO- und Kontrastprüfungen am isolierten Standalone aus. Kein realer Versand in Qualitätstests.

## Rechtliche und redaktionelle Grenze

Primärquelle ist die bisherige Kanzleiwebsite, abgerufen am 19.10.2026. Die alte Seite enthält überholte TMG-/RStV- und Tracking-Vorlagentexte; diese wurden nicht als aktuelle Beschreibung übernommen. Betreiber-, Register- und Qualifikationsangaben sind faktenbezogen übernommen. Der aktuelle Sitz der Schlichtungsstelle ist anhand ihrer eigenen Website aktualisiert. Eine individuelle anwaltliche Freigabe, ein aktueller Versicherungsnachweis oder vertragliche Datenschutzprüfung wird nicht behauptet. Vor dem Wechsel der bestehenden öffentlichen Domain müssen Kanzleibetreiber insbesondere Versicherungsgeltungsbereich, Auftragsverarbeitung, Aufbewahrung und die übernommenen PDF-Inhalte bestätigen.

Technische Konfiguration laut Bereitstellung: Vercel-Serverfunktionen Frankfurt, isolierte Neon-Datenbank Frankfurt, IONOS SMTP; keine optionalen Tracker oder automatischen Karten. Bestehende Domains, zentrale Flamingo-Datenbank und andere Tenants werden bei diesem Inhaltsaufbau nicht angesprochen.
