# Hagn & Partner — Perspektive

## Inhalt und dokumentierter Stand

Website für **Rechtsanwälte Hagn, Deckert, Stemmer & Partner PartG mbB**, Bergbräustr. 7, 85049 Ingolstadt. Tenant `a1853e0f-ff90-45ee-8fb2-8bada3812f67`, Slug `hagn-partner`, technische Rendererfamilie `consulting`. Die bestehende Kanzleidomain [hagn-partner.de](https://www.hagn-partner.de/) bleibt erhalten. Die konfigurierte Standalone-Adresse ist [flamingo-hagn-partner.vercel.app](https://flamingo-hagn-partner.vercel.app), im Export mit `noindex,nofollow`. Diese Konfiguration belegt keine Veröffentlichung dieses Quellstands.

Der eingefrorene Stand vom **20.10.2026** enthält **24 native Routen, 80 bearbeitbare Sections, zwölf verwendete Sectiontypen, 24 explizite SEO-Zeilen und 39 Medien**. Sieben Anwaltsprofile, fünf ausführliche Kernrechtsgebiete, Kanzlei, Geschichte, Konzept, Ersttermin, fünf Mitarbeiterinnen, neun PDF-Formulare, Kontakt, Impressum und Datenschutz bleiben enthalten.

Export: `tmp/hagn-showcase-2026-10-20/hagn-content.json`. SHA-256:

~~~text
704c79cf5253416a7694afedb0c8240df3226815aac6242f83f0b1ffecec2681
~~~

Diese Aufzeichnung beschreibt den endgültigen lokalen Quell- und Redaktionsstand. Lokale Kontrollbelege sind unten benannt. Authentifizierte Produktionsspeicherung, API-Rücklesen mit exaktem Wiederherstellen, Bereitstellung und öffentliche HTTP-Kontrollen sind bei dieser Aktualisierung noch ausstehende Releasebelege.

## Gestaltung und Seitenkompositionen

Die etablierte Identität bleibt Apple-informiert: **Manrope, Weiß und kühles Hellgrau, dunkle Marinetöne und blaue Links**, Original-Kanzleilogo und echte Personen-/Kanzleifotografie. Die aktuelle Komposition verwendet große unterschiedliche Bildproportionen, bewusste Asymmetrie, offene Fachtexte und optionale ruhige Bildbewegung.

Home eröffnet mit „Recht ist persönlich.“ und einem nativen Reel aus drei fotografischen Kapiteln. Es folgen eine zusammenhängende Einordnung, ein echter Kanzlei-/Gesprächsspread, drei ausgewählte Personen, ein fotografischer Erstterminübergang und ein kompakter Kontaktabschluss. Das Rechtsgebietsverzeichnis besitzt einen eigenständigen Atlas aus fünf vollständig verlinkten Bildflächen, einen offenen fachlichen Lesetext und einen kurzen Kontaktabschluss.

Der Export hat **zehn Eröffnungsfamilien, fünf unterschiedliche Kernrechtsgebietsfolgen und 15 fotografische Sections**. Der Inhaltsvalidator zählt nur noch **zwei funktionale Listen-/Gruppenabschnitte von 80**, zuvor 45 von 82. `topicExplorer` wird nicht mehr verwendet; seine Registrierung bleibt für bestehende Inhalte verfügbar. Biografien verwenden authentische begrenzte Porträts, fachliche Lesetexte und die tatsächlichen Sekretariatskontakte.

[DESIGN.md](DESIGN.md) führt die implementierten Tokens und wiederverwendbaren Regeln. [.impeccable/design.json](.impeccable/design.json) ergänzt Zustände, Bewegung, Breakpoints und isoliert darstellbare Quellmuster; synthetische Farbstreifen sind keine zusätzlichen CMS-Rollen. Der [kanonische Oberflächenvertrag](.impeccable/surfaces/readme-md.md) wurde aus dem vor der Implementierung bestehenden Brief vor der externen Bestätigung synchronisiert. Der historische Seed `3cb1de89` gehört zur früheren Weltwahl. In dieser Kompositionsiteration gab es keinen neuen Seedlauf, keine neu ausgewählte Katalogkarte und keinen freigegebenen Imagegen-Comp. Die tatsächlich angesehenen Referenzen und Captures stehen in `tmp/hagn-showcase-2026-10-20/research.md` und `reference-*.png`.

## Redaktion im CMS

Alle 80 Sections sind native Builder-Sections mit `definition_key` und `schema_version`. Die sieben gemeinsamen Perspektive-Verträge, einschließlich der beiden neuen Bildtypen, verwenden ihre `.shared.v1`-Definitionen und Schema-Version (1). Die verwendeten Typen sind `editorialReel` (1), `imageAtlas` (1), `perspectiveHero` (17), `photoChapter` (13), `richText` (17), `editorialBriefing` (1), `resourceList` (1), `teamSpotlight` (8), `ctaBand` (17), `contact` (1), `timeline` (1) und `legalContent` (2).

| Bereich | Bearbeitungsweg / Datenfelder |
|---|---|
| Seiten und Sections | `/admin/pages`: Reihenfolge, Sichtbarkeit, Section-Builder, Vorschau und Speichern |
| Fotografische Erzählung | `editorialReel`: `titleAs = h1/h2`, `layout = opening/showcase`, `headline`, `intro`, `items[]`, `cta`, `motion`, `imageEffect`, `hoverEffect` |
| Fotografischer Atlas | `imageAtlas`: `titleAs = h1/h2`, `headline`, `intro`, `items[]`, `cta`, `motion`, `hoverEffect`; kein unimplementiertes `imageEffect`-Feld |
| Bildkapitel in Reel und Atlas | `items[].id/title/text/image/imageAlt/imagePosition/imageMobilePosition/link` |
| Fotografischer Seitentitel | `perspectiveHero`: `layout = panorama/statement/portrait/journal/compact`, `eyebrow`, `headline`, `text`, `image`, `imageAlt`, `imagePosition`, `imageMobilePosition`, `caption`, `primaryCta`, `secondaryCta`, `meta`, `motion`, `imageEffect`, `hoverEffect` |
| Foto-Kapitel | `photoChapter`: `layout = feature/immersive/diptych/spread`, `headline`, bereinigter Rich Text `text`, `image`, `imageAlt`, `imagePosition`, `imageMobilePosition`, `secondaryImage`, `secondaryImageAlt`, `secondaryImagePosition`, `secondaryImageMobilePosition`, `caption`, `cta`, `motion`, `imageEffect`, `hoverEffect` |
| Offene Fachtexte | `richText`: `titleAs`, `headline`, `content` |
| Fachlicher Überblick | `editorialBriefing`: `layout = columns/sequence/dossier`, `headline`, `intro`, `groups[].title/text/items`, `stages[].title/text`, `note`, `cta` |
| Dokumente und Verweise | `resourceList`: `headline`, `intro`, `groups[].id/title/items`, je Ressource `title/description/href/format/actionLabel`, `note` |
| Anwälte und Sekretariat | `teamSpotlight.layout = contactSheet`: `titleAs`, `headline`, `subline`, `cta`; `members[].name/role/image/imageAlt/imagePosition/focus/href/contactName/phone/email` |
| Kompakter Kontaktabschluss | `ctaBand.layout = plain`: `headline`, `subline`, `ctaPrimary`, `ctaSecondary`; eigener Editor erhält beide Ziele und Symbole bei Textänderungen |
| Kontaktseite | `contact.layout = editorial`: `titleAs`, `headline`, `introText`, `infoCards[].icon/label/value/href`, `formEnabled`, `formFields`, `submitLabel`, `privacyHref`, `showMap`, `mapEmbedUrl` |
| Geschichte und Rechtsseiten | `timeline.entries`; `legalContent.headline/blocks`; `/admin/legal` führt zu den bearbeitbaren Sections |
| Farben je Section | Ausschließlich registrierte Rollen: normale Fläche/Schrift, Links/Aktionen, fotografische Vordergründe und Overlay sowie Felder, soweit tatsächlich unterstützt |
| Marke, Schriften und Logo | `/admin/brand`; `headingFont = Manrope`, `bodyFont = Manrope`, originales Kanzleilogo |
| Fester weißer Header | `/admin/brand` — Navigation & Header — Navigationsfläche `solid`; `navBgColor`, `navLinkColor`, `navBrandColor` |
| Zentrale Kontakte und Zeiten | `/admin/contact` |
| Formular und Antworten | `/admin/contact-form`, `/admin/mail`; Ziel `info@hagn-partner.de`; automatische Antwort im Export deaktiviert |
| Navigation, Footer und SEO | `/admin/navigation`, Footer-Einstellungen, `/admin/seo` und Seiten-SEO; Footer `classic`, zusätzliche Footer-CTA leer |
| Fotos und Dokumente | `/admin/media`; Ausgangsdateien unter `apps/renderer/public/hagn-partner` |

Der eigene Bildeditor zeigt Titel und Thumbnail jedes wiederholbaren Eintrags und öffnet gezielt dessen Details. Einträge lassen sich hinzufügen, aus der Mediathek mehrfach übernehmen, duplizieren, entfernen und nach oben/unten verschieben. IDs bleiben stabil und eindeutig. Die Bildfelder unterstützen Mediathek, Upload, direkte URL, Alttext, visuelle Fokalpunkte und genaue getrennte Desktop-/Mobilwerte. Leerer Mobilwert übernimmt den Desktopausschnitt; der mobile Ausschnitt gilt unter (768px).

Aktionen besitzen `label`, `href`, optional `iconPrefix` und `iconSuffix`. Der gemeinsame Buttoneditor unterstützt native lokale Pfade und Anker, `tel:`, `mailto:`, lokale PDFs und externe HTTPS-Ziele. Die tatsächlichen Renderer erhalten die Symbolwerte. Fehlender Suffix nutzt den kompatiblen Standardpfeil; ein explizit leerer Suffix bedeutet kein Symbol. Die beschriftete Symbolauswahl hat Fokusfalle, Escape und Fokuswiederherstellung sowie einen eigenen Entfernen-Schalter.

Bewegung ist `none/subtle/expressive`. Reel, Hero und Photo Chapter unterstützen `imageEffect = none/parallax/kenBurns`; Atlas unterstützt den tatsächlichen Bildhover `none/zoom/lift`. Der Editor zeigt diese Detailregler nur bei eingeschalteter Bewegung. `none` deaktiviert Bildfahrt, optionale Bildhoverbewegung und sanftes programmatisches Blättern. Die Systemeinstellung für reduzierte Bewegung gilt zusätzlich.

Fotografische Bildtitel und Bildlesetexte haben die eigenen CMS-Rollen `onDarkHeading` und `onDarkBody` (`--token-on-dark-heading`, `--token-on-dark-body`). `imageOverlay` steuert `--token-image-overlay`. Reel und Atlas halten die Deckkraft ihrer mit dem Text wachsenden Lesefläche mindestens bei (88%). Normale Textfarben bleiben unabhängig und wirken nicht auf benachbarte Flächen. Textbasierte Perspektive-Sections erhalten keinen funktionslosen Bild-Overlay-Regler.

Fehlende optionale Felder erscheinen als leere Bedienelemente; der Editor fügt keine Demoabsätze oder Demolistenzeilen in vorhandene Daten ein. Die generischen bestehenden Perspektive-Listen besitzen ebenfalls Duplizieren und Verschieben. Der unbenutzte `topicExplorer` bleibt kompatibel; seine Felder sind `headline`, `intro` und `items[].id/title/summary/detail/image/imageAlt/imagePosition/bullets/meta/cta`.

Das historische Asset `gabriela-radlinger.jpg` zeigt **Gabriele Radlinger**. Name und URL sind korrekt. Durchwahlen sind überwiegend zugeordnete Sekretariatskontakte und dürfen nicht als persönliche Anwaltsnummern umgedeutet werden.

## Interaktion und Kontakt

Reel verwendet native horizontale Scroll-Snap-Bedienung für Touch und Scrollen, ausdrückliche Vor-/Zurück-Schalter und Pfeiltasten/Home/End bei fokussierter Spur. Es gibt kein automatisches Weiterblättern. Alle Kapitel und Ziele stehen bereits serverseitig im Dokument. Reduzierte Bewegung setzt Sprünge ohne weiches Scrollen; Inhalte bleiben ohne JavaScript erreichbar.

Atlasflächen sind ganze native Anker ohne verschachtelte Links. Die Komponente unterstützt auch leere Listen sowie einen, zwei, fünf, sechs und andere Eintragszahlen. Die Bildreihenfolge ist über dieselben CMS-Aktionen veränderbar. Bildhover gilt ausschließlich für feine Zeiger bei erlaubter Bewegung. Sichtbarer Fokus, Überschriftenhierarchie und Bildbeschreibungen bleiben unabhängig davon vorhanden.

Die Originalporträts auf Profilseiten sind auf (430px) Breite bei einem Format von (13:12) begrenzt. Separate Ausschnitte und passende Bildgrößenhinweise erhalten die tatsächliche Quellauflösung. Feature-Fotoüberschriften verwenden bis (360px) eine auf die Inhaltsbreite begrenzte kleinere Schrift (`clamp(2.15rem,11.5vw,2.35rem)`) und automatische Silbentrennung; bei (320px) sind das (36,8px). Die feste Navigation reserviert die gemessene Höhe ausschließlich beim führenden Auftakt.

Die Kontaktseite bietet Telefon und E-Mail vor dem Formular. Name, E-Mail und Anliegen sind Pflichtfelder, Telefon optional. Das bestehende DynamicContactForm und der geteilte Versandweg bleiben die Implementierung. `showMap = false`; der externe Kartenanbieter öffnet erst über einen gewählten Link. Eine Anfrage allein begründet kein Mandat. Für diese Dokumentation werden keine echten Nachrichten versendet.

## Medien und Herkunft

**39 lokale Assets: 21 übernommene Rasterdateien, neun Kanzlei-PDFs und neun ergänzende Symbolbilder.** Alle 30 Rasterdateien haben Herkunftssidecars. Logo, sieben Anwaltsporträts, fünf Mitarbeiterinnen und neun Kanzlei-PDFs bleiben erhalten.

[MEDIA-PROVENANCE.json](MEDIA-PROVENANCE.json), [Originalmedien-Import](../../../scripts/hagn-partner/import-assets.mjs) und [Symbolbildinventar](../../../scripts/hagn-partner/stock-media.mjs) führen die Herkunft. Dateigröße, SHA-256 und vorhandene Credits stehen im Medienexport. Laufzeitmotive und PDFs liegen lokal; ursprüngliche Website-/Unsplash-Adressen bleiben Herkunftsnachweise.

Die Quellenwebsite nennt Stefan Bösl Fotografie, Ingolstadt, für Kanzleifotografie und Porträts. Diese Angabe behauptet keine pauschale Urheberschaft an Logo oder PDFs. öffentliche Produktionsregie und Herkunftsbeschreibungen wurden aus den Inhaltsabschnitten entfernt; Sidecars, strukturierte Herkunftsmetadaten und vorhandene rechtliche Credits bleiben erhalten. Alttexte beschreiben das Motiv. Symbolbilder werden nicht als echte Kanzleistandorte, Mitarbeiter oder Mandanten ausgegeben.

## Reproduzierbarer Builder

[prepare-content.mjs](../../../scripts/hagn-partner/prepare-content.mjs) exportiert die deterministische Funktion:

~~~js
buildHagnContent({ tenantId, baseUrl, mediaBase, mediaMap, noindex: true })
~~~

Sie baut ohne Datenbankzugriff. [perspective-content.mjs](../../../scripts/hagn-partner/perspective-content.mjs) bestimmt die Seitenkomposition; [perspective-copy.mjs](../../../scripts/hagn-partner/perspective-copy.mjs) und [content.mjs](../../../scripts/hagn-partner/content.mjs) führen Fachtexte und belegte Fakten. [page-metadata.mjs](../../../scripts/hagn-partner/page-metadata.mjs) führt SEO-Inhalte.

Für **diesen** Export aus dem Repository:

~~~powershell
$env:HAGN_CONTENT_DIR = 'tmp/hagn-showcase-2026-10-20'
node scripts/hagn-partner/prepare-content.mjs
~~~

Builder und Publisher verwenden ohne diese explizite Auswahl weiterhin standardmäßig `tmp/hagn-perspective-2026-10-20`. Das ist das frühere Exportverzeichnis. Der Showcase-Export ist ausdrücklich `tmp/hagn-showcase-2026-10-20`; bestehende Belege im früheren Ordner dürfen nicht als aktuelle Prüfung ausgegeben werden. `HAGN_SITE_URL` ändert die Basisadresse, `mediaMap` kann lokale Assetpfade auf importierte CMS-URLs abbilden; `mediaBase` ist standardmäßig `/hagn-partner`.

~~~text
tenant, global, navigation, footer, pages[], sections[],
collections:[], items:[], seo, seoPages[], seoItems:[], media[],
active:{snapshot}, routeManifest[], sourceManifest
~~~

Datenbankzeilen verwenden Unterstrich-Feldnamen, Snapshot-Sections die vorhandenen camelCase-Renderfelder. Der Builder filtert Farben gegen die tatsächlich registrierten Verträge und verlangt einen H1-tragenden Auftakt je Route.

[publish-content.ts](../../../scripts/hagn-partner/publish-content.ts) ist der getrennte Veröffentlichungsweg. Für diese Fassung muss ebenfalls `HAGN_CONTENT_DIR=tmp/hagn-showcase-2026-10-20` gesetzt sein. Ohne `--apply` erstellt der Publisher eine Zusammenfassung. Isolationsprüfung, erwarteter aktiver Checksum und Transaktionsvalidierung gehören zum bestehenden Ablauf. Die zentrale Flamingo-Datenbank wird nicht verwendet. Zugangsdaten, DB-Mutation und Bereitstellung liegen beim Releaseverantwortlichen; `bootstrap.ts` ist der isolierte Erstbereitstellungsweg.

## Quellprüfungen und Releasebelege

`tmp/hagn-showcase-2026-10-20/source-gate.json` bestätigt **24 Routen, 80 Sections, 1.528 gültige Farbrollen, 103 interne Linkprüfungen, 24 SEO-Titel, 39 Medien, 30 Raster-Herkunftssidecars, sieben Anwälte, fünf Mitarbeiterinnen und neun PDFs**. Zehn Eröffnungsfamilien und fünf unterschiedliche Kernrechtsgebietsfolgen sind nachgewiesen. Es gibt keine wiederholten narrativen Absätze von mindestens 28 Wörtern.

Die unabhängige Quellprüfung `source-proof.json` umfasst **119 Verweise einschließlich Objektzielen und Ankern**, 39 Asset-Prüfsummen, neun PDFs, null öffentliche Produktionsregie und die erhaltenen sieben Anwaltskontakte. Die unterschiedlichen Linkzahlen entstehen aus dem Prüfumfang. Impressum und Datenschutz sowie die belegten persönlichen Fakten bleiben unverändert.

Reproduzierbare reine Inhaltsprüfung aus `apps/renderer`:

~~~powershell
$env:HAGN_CONTENT_DIR = (Resolve-Path '../../tmp/hagn-showcase-2026-10-20').Path
node --import tsx --test src/lib/perspective-sections.test.ts
node --import tsx ../../scripts/hagn-partner/validate-content.ts
~~~

Vertragsprüfungen aus dem Repository:

~~~powershell
node scripts/check-section-color-contracts.cjs
node scripts/check-section-color-render-mirror.cjs
node scripts/audit-color-role-coverage.cjs --strict
node scripts/check-section-color-crosstalk.cjs
~~~

Der finale Komponenten-Handoff meldet 69 eindeutige fokussierte Testfälle und alle vier Farbvertragsprüfungen als bestanden. Die Dokumentation führt diese Läufe nicht erneut aus; das abschließende TypeScript-Ergebnis wird separat im Release-Handoff geführt.

`local-cms-proof.json` belegt lokal für Reel und Atlas Titel/Beschreibung, direkte Bild-URL, Alttext, beide Fokalpunkte, PDF-Ziel, Präfixsymbol, Suffixentfernung, Dialog-Escape/Fokusrückkehr, Duplizieren, Verschieben, Entfernen und Wiederherstellung. Beide Typen haben null gemeldete Axe-Verstöße, null Browserfehler und bei (390px) keine horizontale Überbreite. Dieser lokale Beleg enthält keine authentifizierte Produktionsspeicherung.

Die abschließende Browserbestätigung liegt unter `review-confirmation`, ergänzende Interaktionsbelege unter `behavior-proof.json`, sobald abgeschlossen. Externes Evaluatorurteil, authentifizierte Produktionsspeicherung mit API-Rücklesen und exaktem Wiederherstellen, Deployment und öffentliche HTTP-Belege gehören zum separaten Release-Handoff. Dieses Dokument behauptet diese noch ausstehenden Schritte nicht als abgeschlossen.

Der vorhandene `detector.json` führt drei ältere Bibliothekswarnungen in `globals.css`: Gradient-Text-Utility, Gray-on-Red-Match und Accordion-Seitenstreifen. Sie werden weder repariert noch als Hagn-Regeln übernommen. Für diese Dokumentationsaktualisierung wurde kein neuer Detektor-, Seed- oder Kontextlauf ausgeführt.

## Inhaltliche und rechtliche Grenze

Die Faktenbasis bleibt die Kanzleiwebsite und das dokumentierte Quelleninventar. Vollständiger Kanzleiname, Originalidentität, sieben Anwälte, fünf Mitarbeiterinnen, Qualifikationen, Zulassungsjahre, Sekretariatskontakte, Formulare und bestehende Rechtsdaten bleiben erhalten. Es gibt keine erfundenen Auszeichnungen, Fälle, Ergebnisse, Gebühren oder zusätzlichen Fähigkeiten.

Impressum und Datenschutz stammen aus dem vorhandenen Datenstand; diese Fassung verändert deren fachliche Inhalte nicht. Die Dokumentation bestätigt keine neue anwaltliche oder vertragliche Prüfung. Produktverpflichtungen und Grenzen stehen in [PRODUCT.md](PRODUCT.md).

Die Quellkonfiguration nennt Vercel-Serverfunktionen, eine isolierte Neon-Datenbank in Frankfurt und IONOS für E-Mail. Optionale Tracker sind nicht konfiguriert, Karten werden nicht automatisch geladen. Die Livekontrolle dieser Betriebsangaben gehört zu den Releasebelegen.
