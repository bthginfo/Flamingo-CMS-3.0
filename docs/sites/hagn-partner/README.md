# Hagn & Partner — Perspektive

## Inhalt und dokumentierter Stand

Website für **Rechtsanwälte Hagn, Deckert, Stemmer & Partner PartG mbB**, Bergbräustr. 7, 85049 Ingolstadt. Tenant a1853e0f-ff90-45ee-8fb2-8bada3812f67, Slug hagn-partner, technische Rendererfamilie consulting. Die bestehende Kanzleidomain [hagn-partner.de](https://www.hagn-partner.de/) bleibt erhalten; die Standalone-Adresse ist [flamingo-hagn-partner.vercel.app](https://flamingo-hagn-partner.vercel.app), im gelieferten Export mit noindex,nofollow.

Die Quelle vom **20.10.2026** enthält **24 native Routen, 82 bearbeitbare Sections, neun verwendete Sectiontypen, 24 explizite SEO-Zeilen und 39 Medien**. Sie umfasst sieben Anwaltsprofile, fünf ausführliche Kernrechtsgebiete, Kanzlei, Geschichte, Konzept, Ersttermin, fünf Mitarbeiterinnen, neun PDF-Formulare, Kontakt, Impressum und Datenschutz.

Der eingefrorene Export liegt im ignorierten Arbeitsverzeichnis tmp/hagn-perspective-2026-10-20/hagn-content.json. Seine SHA-256 lautet:

~~~text
71dc61be094c52e8530651903854cb69c0cd8ce61c4ce98fdfba50002ce4bc5b
~~~

Diese Aufzeichnung beschreibt den Quellstand und die redaktionellen Verträge. Die abschließende Browserbestätigung, derselbe externe Evaluator, CMS-Livebelege, Produktionsbereitstellung und HTTP-Kontrollen werden separat im Releaseprozess geführt. Hier wird kein noch ausstehender Freigabeschritt als abgeschlossen dargestellt.

## Gestaltung und Seitenkompositionen

Die bestätigte Richtung ist Apple-informierte fotografische Produktdramaturgie: **Manrope für alle Schriftrollen, Weiß und kühles Hellgrau, dunkle Marinetöne und blaue Links**. Große Fotos, deutlich verschiedene Auftakte, offene Fachtexte und nützliche Listen bestimmen die Seiten.

Fünf perspectiveHero-Kompositionen sind tatsächlich verwendet: panorama, statement, portrait, journal und compact. Das offene contactSheet, die redaktionelle Kontaktseite und die Rechtsleseseiten ergeben insgesamt acht Eröffnungsformen. Die fünf ausführlichen Rechtsgebiete haben verschiedene Sectionfolgen. Home kombiniert sieben Kapitel; die Anwaltsporträts folgen einer gemeinsamen, sachlich sinnvollen Profilstruktur.

[DESIGN.md](DESIGN.md) dokumentiert die implementierten Tokens, Schriftgrößen, Maße und Regeln. [.impeccable/design.json](.impeccable/design.json) ergänzt Farbvorschauen, Zustände, Bewegung, Breakpoints und isoliert darstellbare Quellmuster. Die Farbstreifen sind synthetische Vorschauen und keine zusätzlichen CMS-Farbrollen. Der dokumentierte Stand ist aus dem Code abgeleitet; es liegt kein freigegebener Bild-Comp vor.

## Redaktion im CMS

Alle 82 Sections sind native Builder-Sections mit definition_key und schema_version. Die fünf neuen Typen verwenden ihre jeweiligen .shared.v1-Definitionen und schema_version = 1. Die Gesamtquelle verwendet perspectiveHero (19), editorialBriefing (25), topicExplorer (2), teamSpotlight (8), photoChapter (6), resourceList (18), contact (1), timeline (1) und legalContent (2).

| Bereich | Bearbeitungsweg / Datenfeld |
|---|---|
| Seiten, Reihenfolge, Sichtbarkeit und Sections | /admin/pages, jeweiliger Section-Builder |
| Fotografischer Seitentitel | perspectiveHero: layout = panorama / statement / portrait / journal / compact; eyebrow, headline, text, image, imageAlt, imagePosition, imageMobilePosition, caption, primaryCta, secondaryCta, meta |
| Foto-Kapitel | photoChapter: layout = feature / immersive / diptych; headline, text, image, imageAlt, imagePosition, secondaryImage, secondaryImageAlt, secondaryImagePosition, caption, cta |
| Themenindex | topicExplorer: headline, intro, items[].id/title/summary/detail/image/imageAlt/imagePosition/bullets/meta/cta |
| Fachlicher Überblick | editorialBriefing: layout = columns / sequence / dossier; headline, intro, groups[].title/text/items, stages[].title/text, note, cta |
| Dokumente und Verweise | resourceList: headline, intro, groups[].id/title/items; je Ressource title, description, href, format, actionLabel; note |
| Anwälte und Sekretariat | teamSpotlight.layout = contactSheet: titleAs, headline, subline, cta; members[].name/role/image/imageAlt/imagePosition/focus/href/contactName/phone/email |
| Kontakt | contact.layout = editorial: titleAs, headline, introText, infoCards[].icon/label/value/href, formEnabled, formFields, submitLabel, privacyHref, showMap, mapEmbedUrl |
| Geschichte | timeline.entries |
| Rechtsseiten | legalContent.headline/blocks; /admin/legal führt zu den bearbeitbaren Sections |
| Farben je Section | Ausschließlich registrierte Rollen im Farbeditor; helle, dunkle, fotografische, Aktions-, Link- und Feldrollen, soweit vom jeweiligen Typ unterstützt |
| Marke, Schriften und Logo | /admin/brand; headingFont = Manrope, bodyFont = Manrope, originales Kanzleilogo |
| Fester weißer Header | /admin/brand → Navigation & Header → Navigationsfläche = solid; brand.navMode, navBgColor, navLinkColor, navBrandColor |
| Zentrale Kontaktangaben und Zeiten | /admin/contact |
| Formular und Antwortkonfiguration | /admin/contact-form, /admin/mail; Ziel info@hagn-partner.de; automatische Antwort im Export deaktiviert |
| Navigation und Footer | /admin/navigation und Footer-Einstellungen; Footer classic, zusätzliche Footer-CTA leer |
| Suchmaschinen | /admin/seo und Seiten-SEO; LegalService, Canonicals, Titel, Beschreibung, OG-Bild und noindex |
| Fotos und Dokumente | /admin/media; Ausgangsdateien unter apps/renderer/public/hagn-partner |

Aktionen besitzen label und href. Rich Text wird in photoChapter.text, topicExplorer.items[].detail und editorialBriefing.groups[].text bereinigt ausgegeben; die anderen beschriebenen Einleitungen und Phasen sind Klartext. Die vorhandene Kontakt-Einleitung unterstützt bereinigtes HTML. Originalindizes von Listen bleiben den CMS-Bearbeitungspfaden zugeordnet.

Der Editor ergänzt fehlende optionale Felder aus vollständigen Formen als **leere Bedienelemente**; er fügt keine Demoabsätze oder Demolistenzeilen in vorhandene Daten ein. Layout und titleAs behalten ihren passenden Strukturstandard. Der Renderer verwendet bei ungültigem Layout panorama, feature beziehungsweise columns. Die kompatiblen älteren Team- und Kontaktlayouts bleiben registriert.

imagePosition steuert den normalen Fokalpunkt; nur perspectiveHero besitzt zusätzlich imageMobilePosition unter 768px. photoChapter besitzt zwei voneinander unabhängige Motive mit eigenen Alttexten und Ausschnitten. Die registrierte immersive-Variante ist im eingefrorenen Export unbenutzt. Das aktuelle Home-Panorama nutzt für Desktop 58% center und für Mobilgeräte 61% center; dies sind Bildentscheidungen für dieses Motiv.

Der [Panorama-Renderer](../../../apps/renderer/src/templates/shared/perspective-hero.tsx) meldet für die responsive Bildauswahl sizes = "(max-width: 767px) 1210px, 100vw". Der mobile Wert berücksichtigt die bei 680px Bühnenhöhe rund 1209px breite Bildebene eines 16:9-Motivs. Layout und CMS-Fokalpunkte bleiben davon unabhängig; die Dokumentation behauptet keine erneute visuelle Qualitätsprüfung.

Originalporträts werden als tatsächliche Personenbilder behandelt. Das historische Asset gabriela-radlinger.jpg zeigt **Gabriele Radlinger**; die Bezeichnung in Inhalt und URL ist korrekt. Durchwahlen sind überwiegend zugeordnete Sekretariatskontakte und dürfen nicht als persönliche Anwaltsnummern umgedeutet werden.

## Interaktion und Kontakt

Topic Explorer nutzt native details/summary: Das erste sichtbare Thema ist standardmäßig offen, Titel und Kurzbeschreibung bleiben im geschlossenen Zustand sichtbar. Die fachlichen Inhalte sind bereits serverseitig vorhanden. Der gemeinsame Name der Detailsgruppe erlaubt in unterstützenden Browsern jeweils ein offenes Thema; die native Einzelbedienung bleibt ohne diese Gruppierungsfunktion nutzbar.

Das contactSheet zeigt auf der Anwaltsseite alle sieben Originalporträts. Große Gruppen verwenden ab 768px zwei Spalten mit einer breiten letzten Zeile bei ungerader Personenzahl; die Home-Vorschau zeigt drei Personen. Einzelne fachliche Ansprechpartner erhalten ein kompakteres Bild-/Textmuster. Qualifikation, Schwerpunkt und Kontaktangaben erfordern keinen Hover.

Die Kontaktseite bietet Telefon und E-Mail vor dem Formular. Name, E-Mail und Anliegen sind Pflichtfelder, Telefon ist optional. Das bestehende DynamicContactForm und der geteilte Versandweg bleiben die Implementierung. showMap ist false; der externe Kartenanbieter wird erst über einen gewählten Link geöffnet. Eine Anfrage allein begründet kein Mandat.

Neue Inhaltskomponenten zeigen wesentliche Informationen beim ersten Rendern. Pfeilbewegungen nutzen motion-safe; der gemeinsame prefers-reduced-motion-Block kürzt CSS-Animationen und Übergänge und deaktiviert weiches Scrollen. Keine Scrollstrecke erzwingt ein Abspielen der Inhalte. Die vorhandene Navigation besitzt einen beschrifteten Mobilmenüdialog mit Fokusverwaltung.

## Medien und Herkunft

**39 lokale Assets: 30 übernommene Originalmedien und neun ergänzende Symbolbilder.** Die Originalmedien umfassen 21 Rasterdateien und neun PDFs; mit den Symbolbildern sind insgesamt 30 Rasterdateien enthalten. Logo, sieben Anwaltsporträts, fünf Mitarbeiterinnen und die neun Kanzlei-PDFs sind erhalten.

[MEDIA-PROVENANCE.json](MEDIA-PROVENANCE.json), [Originalmedien-Import](../../../scripts/hagn-partner/import-assets.mjs) und [Symbolbildinventar](../../../scripts/hagn-partner/stock-media.mjs) führen die Herkunft. Dateigröße, SHA-256 und vorhandene Credits werden in den Medienexport übernommen. Die laufzeitfähigen Motive und PDFs liegen lokal; die alten Website- und Unsplash-Adressen sind Herkunftsnachweise.

Die bisherige Kanzleiwebsite nennt Stefan Bösl Fotografie, Ingolstadt, für Kanzleifotografie und Porträts. Diese Quellenangabe ist keine pauschale Urheberschaftsbehauptung zu Logo oder PDF-Dateien. Symbolbilder werden in Alttext oder Bildnachweis kenntlich gemacht und zeigen keine behaupteten Kanzleimitarbeiter, Mandanten oder Kanzleistandorte. Der an Root gemeldete vollständige Herkunftsscan zählt 30 Raster und null fehlende Quellen.

## Reproduzierbarer Builder

[prepare-content.mjs](../../../scripts/hagn-partner/prepare-content.mjs) exportiert die deterministische Funktion:

~~~js
buildHagnContent({ tenantId, baseUrl, mediaBase, mediaMap, noindex: true })
~~~

Sie baut die Daten ohne Datenbankzugriff. [perspective-content.mjs](../../../scripts/hagn-partner/perspective-content.mjs) bestimmt die aktuellen Seitenfolgen und redaktionellen Inhalte; [content.mjs](../../../scripts/hagn-partner/content.mjs) enthält die belegten Kanzlei-, Personen- und Rechtsgebietsdaten. [page-metadata.mjs](../../../scripts/hagn-partner/page-metadata.mjs) führt die SEO-Inhalte, stock-media.mjs die ergänzenden Fotos.

Aus dem Repository:

~~~powershell
node scripts/hagn-partner/prepare-content.mjs
~~~

Die Standardausgabe ist tmp/hagn-perspective-2026-10-20/hagn-content.json und route-manifest.json. HAGN_CONTENT_DIR ändert das Ziel, HAGN_SITE_URL die Basisadresse. mediaMap kann lokale Assetpfade auf importierte CMS-URLs abbilden; mediaBase ist standardmäßig /hagn-partner.

~~~text
tenant, global, navigation, footer, pages[], sections[],
collections:[], items:[], seo, seoPages[], seoItems:[], media[],
active:{snapshot}, routeManifest[], sourceManifest
~~~

Datenbankzeilen nutzen Unterstrich-Feldnamen. Snapshot-Sections nutzen die vorhandenen camelCase-Renderfelder. Der Builder filtert Section-Farben gegen die wirklichen registrierten Verträge und verlangt einen H1-tragenden Auftakt je Route.

[publish-content.ts](../../../scripts/hagn-partner/publish-content.ts) ist der getrennte Veröffentlichungsweg. Der aktuelle Publisher verwendet wie der Builder standardmäßig tmp/hagn-perspective-2026-10-20. HAGN_CONTENT_DIR kann das gewünschte Exportverzeichnis ausdrücklich festlegen. Ohne --apply erstellt der Publisher eine Zusammenfassung. Isolationsprüfung, erwarteter aktiver Checksum und Transaktionsvalidierung gehören zu diesem bestehenden Ablauf. Zugangsdaten, DB-Mutation und Veröffentlichung liegen beim Releaseverantwortlichen. bootstrap.ts ist der isolierte Erstbereitstellungsweg.

## Quellprüfungen und Releasebelege

Die aktuelle Inhaltsprüfung liegt lokal in tmp/hagn-perspective-2026-10-20/source-gate.json. Die an Root gemeldeten Source Gates zählen **24 Routen, 82 Sections, 1333 Farbrollenprüfungen, 119 interne Links, 24 SEO-Zeilen und neun PDFs**. content-change-summary.json ergänzt den Inhaltsvergleich. Der eingefrorene Datenhash steht oben.

Reproduzierbare reine Quellprüfungen aus apps/renderer:

~~~powershell
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

Der Komponenten-Handoff meldet Renderer- und Marketing-Typecheck, check:section-colors und 50 eindeutige fokussierte Testfälle als bestanden. Diese Aufzeichnung führt diese Läufe nicht erneut aus.

Die Browserbestätigung schreibt getrennte lokale Belege nach review-confirmation/audit.json im selben ignorierten Arbeitsverzeichnis. Evaluatorurteil, CMS-Kontrollbelege, Deployment- und HTTP-Belege gehören zum abschließenden Release-Handoff. Sie werden durch die Quellprüfung oder dieses Dokument nicht ersetzt.

Der vorhandene Detektorbericht detector.json führt drei alte Warnungen in globals.css außerhalb der geänderten Zeilen: Gradient-Text-Utility (580), Gray-on-Red-Match (663) und Accordion-Seitenstreifen (1092). Sie wurden weder repariert noch als Hagn-Designregeln übernommen. Für diese Dokumentationsaktualisierung fand kein neuer Detektorlauf und keine Browserbedienung statt.

## Inhaltliche und rechtliche Grenze

Die Faktenbasis bleibt die Kanzleiwebsite und das dokumentierte Quelleninventar. Vollständiger Kanzleiname, Originalidentität, sieben Anwälte, fünf Mitarbeiterinnen, Qualifikationen, Telefonzuordnungen, Formulare und vorhandene Rechtsdaten bleiben erhalten. Neue Aussagen über Auszeichnungen, erfolgreiche Fälle, Fristen, Gebühren oder zusätzliche Fähigkeiten sind nicht Teil dieses Rebuilds.

Impressum und Datenschutz stammen aus dem bestehenden Datenstand; der Perspektive-Builder verändert deren fachliche Inhalte nicht. Diese Dokumentation bestätigt keine neue anwaltliche oder vertragliche Prüfung. Produktverpflichtungen und Grenzen stehen in [PRODUCT.md](PRODUCT.md).

Die Quellkonfiguration nennt Vercel-Serverfunktionen und eine isolierte Neon-Datenbank in Frankfurt sowie IONOS für E-Mail. Optionale Tracker sind nicht konfiguriert; Karten werden nicht automatisch geladen. Eine Livekontrolle dieser Betriebsangaben gehört zu den getrennten Releasebelegen. Es werden keine echten Anfragen für die Dokumentationsprüfung versendet.
