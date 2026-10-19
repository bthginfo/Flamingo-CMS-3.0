# Hagn & Partner — eigenständige Kanzlei-Edition

## Inhalt und Betrieb

Eigenständige Website für **Rechtsanwälte Hagn, Deckert, Stemmer & Partner PartG mbB**, Bergbräustr. 7, 85049 Ingolstadt. Tenant `a1853e0f-ff90-45ee-8fb2-8bada3812f67`, Slug `hagn-partner`, eigene isolierte Datenbank im Free-Plan. Die technische Templatefamilie `consulting` bezeichnet die Rendererfamilie.

Standalone-Adresse: [flamingo-hagn-partner.vercel.app](https://flamingo-hagn-partner.vercel.app). Die bestehende Kanzleidomain wurde nicht umgestellt. Der Standalone-Host bleibt `noindex,nofollow`.

Der fertig vorbereitete Stand vom 19.10.2026 enthält **24 native Seiten, 129 bearbeitbare Sections, 19 registrierte Sectiontypen und sechs fotografische beziehungsweise personengeführte Eröffnungsfamilien**. Edition, Portrait, Journal, Architectural, Cinematic und Directory geben den Hauptseiten unterschiedliche Kompositionen; Impressum und Datenschutz bleiben Leseseiten. Sieben Anwaltsprofile, fünf ausführliche Kernrechtsgebiete, Kanzleigeschichte, Ersttermin und Kosten, Sekretariat, neun PDF-Formulare und Kontakt sind enthalten. Die frühere Historien-Dublette sowie Konzept- und Sekretariatsrouten besitzen eigenständige Inhalte.

**Dokumentierter Freigabestand:** Diese Aufzeichnung beschreibt die eingefrorene Releasequelle, ihre Inhaltsdaten und die lokalen Prüfbelege. Produktionsbereitstellung und Livekontrolle werden separat in den Releasebelegen nachgewiesen. Die unten genannten Prüfungen belegen den lokalen Stand und die konkret nachgeprüften Korrekturen; sie bescheinigen keine neue Gesamtprüfung aller Appbereiche, Tabletansichten oder juristischen Inhalte.

## Redaktion im CMS

Alle 129 Sections sind native, registrierte Builder-Sections mit passendem `definitionKey` und `schemaVersion`. Texte, Medien, Listen, Aktionen und unterstützte Zustands-, Layout- und Farbwerte bleiben über CMS/API pflegbar.

| Bereich | Bearbeitungsweg / Datenfeld |
|---|---|
| Seiten, Reihenfolge und Sections | `/admin/pages`, jeweiliger Section-Builder |
| Fotografiegeführte Titel | `editorialHero.layout = edition / portrait / journal / architectural`; `headline`, `text`, `imagePrimary`, `imageAlt`, `imagePrimaryPosition`, `imageFit`, `primaryCta`, `secondaryCta`, `hint`, `contactRows` |
| Filmischer Auftakt | `cinematicHero`; `headline`, `subline`, `image`, `imageAlt`, `imagePosition`, `overlay`, `imageEffect`, `primaryCta`, `secondaryCta` |
| Anwälte und Sekretariat | `teamSpotlight.layout = directory`; `titleAs`, `headline`, `subline`, `members[].name/role/image/imageAlt/imagePosition/focus/href` |
| Große interaktive Themenbühne | `materialAtelier`; `preset`, `headline`, `subline`, `items[].title/text/image/imageAlt/imagePosition/meta/href/ctaLabel`, `cta` |
| Thematische Tabs | `serviceTabs`; `tabs[].label/title/text/image/imageAlt/imagePosition/features/cta` |
| Kapitel- und Bildstrecken | `cinematicChapters.chapters`, `scrollStory.steps`, `categoryMosaic.items`, `signatureGrid.image/traits/stats` |
| Verbundene Schritte | `signaturePath`; `pathPreset`, `items[].title/text/image/href/ctaLabel`, `cta`; bis zu sieben Elemente |
| Geführte Orientierung | `guidedChoice`; `questions`, `results`, `restartLabel`, `mode` |
| Rechtsgebiets- und PDF-Index | `servicesGrid.layout = index`; `manualCards[].title/text/href` |
| Lesetexte und Bild-/Text-Sections | `richText.content/titleAs`, `textImage.text/items/image/imageAlt/imagePosition/layout/primaryCta/secondaryCta` |
| Geschichte | `timeline.entries` |
| Fragen und Kontaktblock | `faqContactSplit.items[].question/answer`, `contactTitle`, `contactText`, `phone`, `email`, `cta` |
| Helle Schlussaktionen mit Foto | `ctaSplit`; `headline`, `text`, `image`, `imageAlt`, `imagePosition`, `checklist`, `primaryCta`, `secondaryCta`, `note`, `reversed` |
| Kontaktformular und Informationspaneele | `contact`; `headline`, `introText`, `infoCards`, `formFields`, `submitLabel`, `privacyHref`, `showMap` |
| Rechtstexte | `legalContent.headline/blocks`; `/admin/legal` verweist auf diese bearbeitbaren Sections |
| Farben je Section | Registrierte Rollen im Section-Farbeditor, einschließlich eigener Karten-, Foto-, Button-, Link-, Feld- und Zustandsrollen, soweit vom Sectiontyp unterstützt |
| Marke, Schrift und Logo | `/admin/brand`; DM Serif Display und Manrope, originales Kanzleilogo |
| Fester Header auf Papier | `/admin/brand` → Navigation & Header → Navigationsfläche → `solid`; `brand.navMode`, `navBgColor`, `navLinkColor`, `navBrandColor`. Der kompatible Modus `auto` bleibt unterstützt. |
| Zentrale Kontaktdaten und Zeiten | `/admin/contact` |
| Formularfelder und Antwortkonfiguration | `/admin/contact-form`, `/admin/mail`; Ziel `info@hagn-partner.de`, automatische Antwort im gelieferten Stand deaktiviert |
| Navigation und Footer | `/admin/navigation` und Footer-Einstellungen; Footer `classic`, ohne zusätzliche generische Footer-CTA |
| Suchmaschinen | `/admin/seo` und jeweilige Seiten-SEO; registriertes Schema `LegalService`, Canonicals, Titel, Beschreibung, OG-Bild und `noindex` |
| Fotos und Formulare | `/admin/media`; lokale Dateien unter `apps/renderer/public/hagn-partner`, spätere Uploads über den konfigurierten Blob-Zugang |

Hagn setzt `showKickers = false` in Signature Path, Scroll Story und Guided Choice sowie `showNumbers = false` in FAQ Contact Split. Diese Optionen unterdrücken wiederholte dekorative Zeilen und FAQ-Ziffern. Fachliche Texte, eigentliche Pfadmarkierungen und Bedienelemente bleiben sichtbar. Die normalen sekundären Cinematic-Aktionen zeigen ihre redaktionelle Beschriftung.

Ein Originalporträt trägt technisch den Dateinamen `gabriela-radlinger.jpg`; die Person heißt korrekt **Gabriele Radlinger**. Durchwahlen sind überwiegend Sekretariatskontakte. Alttext, Fokalpunkt und Fit werden an den jeweils unterstützten Feldern gepflegt; ein allgemeines Medienfeld erzeugt keine nicht registrierte Sectionoption.

## Medien und Designsystem

38 lokale Assets: **30 Originalmedien und acht ergänzende, lokal optimierte Symbolbilder**. Originales Logo, sieben Anwaltsporträts und neun PDFs sind erhalten. Der Bestand benötigt keine Laufzeitverbindung zur alten Kanzleiwebsite oder Unsplash. Die Symbolbilder werden weder als Kanzleiräume noch als Mitarbeiter, Mandanten oder Ingolstädter Standort ausgegeben.

[MEDIA-PROVENANCE.json](MEDIA-PROVENANCE.json) dokumentiert Quelle, Download, Urheberangabe, Symbolstatus, Dateigröße und SHA-256. Die Quellwebsite nennt Stefan Bösl Fotografie, Ingolstadt, für Kanzleifotografie und Porträts; dies ist keine pauschale Urheberschaftsbehauptung zu Logo und PDFs. Die acht zusätzlichen Rasterquellen wurden bestätigt; der abschließende Nachweis meldet null fehlende Quellen.

[DESIGN.md](DESIGN.md) enthält die tatsächlich verwendeten Farben, Typografie-, Abstands- und Komponentenwerte. [.impeccable/design.json](.impeccable/design.json) ergänzt Farbvorschauen, Schatten, Bewegung, Breakpoints und eigenständig darstellbare Komponenten. Die frühere Korrespondenzrichtung ist ersetzt. Die neue Kanzlei-Edition wurde aus dem Code entwickelt; es existiert kein freigegebener Comp, gegen den eine Bildtreue behauptet wird.

## Reproduzierbarer Builder

`scripts/hagn-partner/prepare-content.mjs` exportiert die deterministische Funktion:

```js
buildHagnContent({ tenantId, baseUrl, mediaBase, mediaMap, noindex: true })
```

Sie erstellt die Inhaltsdaten ohne Datenbankzugriff. `edition-content.mjs` bestimmt die Seitenkompositionen, `edition-copy.mjs` die erweiterten Inhalte, `content.mjs` die belegten Kanzlei-, Profil- und Rechtsgebietsdaten, `page-metadata.mjs` die Seitenmetadaten und `stock-media.mjs` die ergänzenden Medien. `mediaMap` kann lokale Assetpfade auf später importierte CMS-URLs abbilden; Standard für `mediaBase` ist `/hagn-partner`.

Der CLI-Aufruf aus dem Repository erzeugt den vollständigen Export und das Routenmanifest im aktuellen Rework-Verzeichnis:

```powershell
node scripts/hagn-partner/prepare-content.mjs
```

Standardausgabe: `tmp/hagn-rework-2026-10-19/hagn-content.json` und `route-manifest.json`. `HAGN_CONTENT_DIR` ändert das Ausgabeziel, `HAGN_SITE_URL` die Basisadresse. Der CLI-Schritt ergänzt Dateigrößen und Hashmetadaten anhand des vorhandenen Herkunftsmanifests. Der eingefrorene Export enthält positive Größen und Prüfsummen für alle 38 Medien und ist die Veröffentlichungsgrundlage.

```text
tenant, global, navigation, footer, pages[], sections[],
collections:[], items:[], seo, seoPages[], seoItems:[], media[],
active:{snapshot}, routeManifest[], sourceManifest
```

Seiten-, Section- und SEO-Zeilen verwenden Datenbankfeldnamen mit Unterstrichen. Snapshot-Sections verwenden die vorhandenen camelCase-Renderfelder. `import-assets.mjs` verwaltet die Originalmedien und verwendet vorhandene Dateien erneut. Der dokumentierte Builder erzeugt weder Tenantdaten anderer Kunden noch einen Datenbankimport.

Die Veröffentlichung verwendet `publish-content.ts` mit explizitem `HAGN_CONTENT_DIR` auf das aktuelle Rework-Verzeichnis: dessen historischer Standardpfad verweist noch auf das frühere Verzeichnis. Ohne `--apply` erzeugt es nur eine Zusammenfassung. Der schreibende Ablauf besitzt eine Isolationsprüfung, einen Vergleich des erwarteten aktiven Checksums und eine erneute Datenprüfung in der Transaktion; Root verwaltet Zugangsdaten und Veröffentlichung. `bootstrap.ts` dient der isolierten Erstbereitstellung und ist kein gewöhnlicher redaktioneller Aktualisierungsschritt.

## Prüfungen und Belege

Bereits abgeschlossene Source-Prüfungen sind in `tmp/hagn-rework-2026-10-19/implementation-source-gates.json` aufgezeichnet. Reproduzierbare Befehle, aus `apps/renderer`:

```powershell
node --import tsx --test src/lib/edition-sections.test.ts src/lib/site-header-mobile-contact.test.ts src/lib/color-validation.test.ts
node --import tsx ../../scripts/hagn-partner/validate-content.ts
```

Der erste Lauf bestand mit **22/22 Tests**. Die Offline-Validierung bestand für **129 registrierte Sections, 2097 erlaubte Farbrollen, 24 SEO-Zeilen, interne Routen und Anker sowie 38 Dateigrößen und SHA-256-Werte**. Sie prüft den wirklichen registrierten Datenvertrag, die Hagn-Navigationswahl, CTA-Beschriftungen und die ausgeblendeten dekorativen Elemente. Der Validator ergänzt Herkunftsdaten auch beim reinen Funktionsaufruf.

Nach Änderungen an Farbverträgen werden aus dem Repository ausgeführt:

```powershell
node scripts/generate-section-color-contracts.cjs
node scripts/check-section-color-contracts.cjs
```

Der dokumentierte Vertragscheck bestand. `renderer-type-final.json` und `marketing-type-verified.json` melden jeweils Exitcode 0. `cms-new-fields-proof.json` belegt eine echte CMS-Änderung an Layout und Alttext, Speichern, API-Lesen und exakte Wiederherstellung; der veröffentlichte Snapshot blieb dabei unberührt.

Die abgeschlossene Chrome-Prüfung in `review-2` umfasst **48 tatsächliche Zustände auf 24 Routen** bei Desktop (1440 × 1000) und Mobil (390 × 844), jeweils Viewport- und Ganzseitenaufnahme (**96 Routenaufnahmen**), vier zusätzliche Atelier-Zustände und das geöffnete Mobilmenü. `audit.json` enthält `faults: []`. Nach einem lokalen Next-Dev-Speicherabbruch wurden 22 gültige Desktopzustände beibehalten und 26 fehlende Zustände mit unverändert eingefrorener Quelle ergänzt.

Ein frischer externer Review und die anschließende begrenzte Bestätigung desselben Evaluators bewerteten die sieben materiellen Korrekturen als behoben: Headerabstand und Bildausschnitte, Fotoheader- und Mobilmenükontrast, deutsche Wortumbrüche, wiederholte Kicker und FAQ-Ziffern, editierbare CTA-Beschriftungen, H1/H2 im Personenverzeichnis und UTF-8-Labels. Das Ergebnis lautet **Frontend PASS / SHIP AFTER same-session verdict pass**. Diese Freigabe gilt für diese sieben nachgeprüften Punkte; die vollständige Routensichtung war der erste Reviewdurchgang. Sie ist keine neue Zertifizierung der gesamten App.

Der einmalige Detektorbericht enthält zwei alte, unveränderte Warnungen zu violetten CMS-Headerfarben. Sie wurden nicht als Hagn-Designtokens übernommen. Kein zweiter Detektorlauf wurde durchgeführt. In den Qualitätstests wurden keine echten Anfragen versendet.

## Rechtliche und redaktionelle Grenze

Faktenbasis ist die bestehende Kanzleiwebsite, abgerufen am 19.10.2026, ergänzt um dokumentierte offizielle Quellen. Überholte TMG-/RStV- und Tracking-Vorlagentexte wurden nicht als aktuelle Betriebsbeschreibung übernommen. Betreiber-, Register- und Qualifikationsangaben wurden faktenbezogen übertragen; die technischen Datenschutzhinweise beschreiben die neue Bereitstellung.

Eine individuelle anwaltliche Freigabe, ein aktueller Versicherungsnachweis und eine vertragliche Datenschutzprüfung werden nicht behauptet. Vor einer späteren Umstellung der bestehenden öffentlichen Domain sind insbesondere Versicherungsgeltungsbereich, Auftragsverarbeitung, Aufbewahrung und die übernommenen PDF-Inhalte durch den Betreiber zu bestätigen.

Die konfigurierte Bereitstellung verwendet Vercel-Serverfunktionen in Frankfurt, eine isolierte Neon-Datenbank in Frankfurt und IONOS SMTP. Es sind keine optionalen Tracker und keine automatisch geladenen Karten eingerichtet. Ein Kontaktformular allein begründet kein Mandat; hierfür ist die Annahme durch die Kanzlei erforderlich.
