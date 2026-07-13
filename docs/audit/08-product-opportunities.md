# Product Opportunities

Stand: 11. Juli 2026. Die Priorisierung basiert auf beobachteten Produktproblemen, vorhandenen Architekturbausteinen und dem Ziel, zahlungsbereiten lokalen Betrieben schneller eine sichtbar bessere Website zu liefern.

## Bewertungsmodell

- **User Value, Differenzierung, Umsatz/Retention:** 1 (gering) bis 5 (sehr hoch).
- **Aufwand, Architekturrisiko:** 1 (gering) bis 5 (sehr hoch).
- **Timing:** bezeichnet den Start von Discovery/Design, nicht automatisch den Production-Release. Now = im aktuellen 90-Tage-Horizont untersuchen/prototypisieren, Next = nach UX-/Section-Fundament liefern, Later = erst nach belastbarer Identity/Telemetrie. Für Delivery-Reihenfolge ist `09-implementation-roadmap.md` autoritativ.

## Ranking

| Rang | Opportunity | Problem / Zielgruppe | Vorgeschlagene Experience | User Value | Differenzierung | Umsatz / Retention | Aufwand | Arch.-Risiko | Timing |
|---:|---|---|---|---:|---:|---:|---:|---:|---|
| 1 | **Quality Copilot** | Inhaber:innen erkennen fehlende CTAs, schwache Texte, Kontrastprobleme, defekte Links oder mobile Layout-Risiken nicht | Eine priorisierte Site-Health-Liste mit Erklärung, Preview, „Fix vorbereiten“ und expliziter Freigabe | 5 | 5 | 5 | 3 | 2 | Now |
| 2 | **Goal-based Page Composer** | 205 Section-Typen überfordern; Nutzer denken in Zielen, nicht Komponenten | „Was soll diese Seite erreichen?“ wählen; CMS schlägt eine editierbare Seitenstruktur mit begründeten Sections und realistischen Inhalten vor | 5 | 5 | 5 | 4 | 3 | Next |
| 3 | **Safe Publish Review** | Save-, Draft- und Live-Zustand sind unklar; Fehler werden erst nach Publish sichtbar | Vorher/Nachher-Diff, Desktop/Mobile-Smoke, Warnungen, Approval und garantierter Rollback auf letzten validen Snapshot | 5 | 4 | 5 | 4 | 3 | Now |
| 4 | **AI Site Plan API** | Weniger leistungsfähige AIs müssen heute interne Section-Details kennen und können gefährliche Vollzugriffe erhalten | Zielorientierter Plan-Endpunkt: discover -> propose -> validate -> dry-run -> apply; feldgenaue Fehler, Beispiele, Defaults, Scopes und Approval für Publish/Delete | 5 | 5 | 4 | 4 | 3 | Next |
| 5 | **Premium Demo Recipes** | 15/17 Einstiege der Portfolio-Stichprobe ohne Handwerk wirken wie Farbvarianten derselben langen Seite; das Produkt verkauft seine Bandbreite nicht | Sechs Experience-Familien, je Branche eigener Content-Plot, unterschiedliche Seitentypen, Funktionen und nachweisbare Conversion-Journey | 4 | 4 | 5 | 3 | 1 | Now |
| 6 | **Responsive Compare** | Mobile-Probleme werden im Editor leicht übersehen; aktueller Showcase startet mobil im Desktop-Preview | Synchroner Desktop/Tablet/Mobile-Vergleich, Fokus auf geänderte Section, Overflow-/Crop-/Kontrastwarnungen | 4 | 4 | 4 | 3 | 2 | Next |
| 7 | **Media Intelligence** | Falsche Bildmotive, schlechte Crops und riskantes Löschen verschlechtern reale Seiten | Usage Graph, Focal Point, Crop-Vorschau pro Breakpoint, Qualitätswarnung, Alt-Text-Workflow und sichere Ersetzung | 5 | 4 | 4 | 4 | 3 | Next |
| 8 | **Reusable Business Objects** | Öffnungszeiten, Kontakt, Haupt-CTA und Teamdaten werden mehrfach gepflegt und driften | Globale, typisierte Inhalte mit „überall aktualisieren“, Usage Preview und lokalen Overrides | 4 | 4 | 4 | 4 | 4 | Later |
| 9 | **Section Conversion Insights** | Nutzer wissen nicht, welche Sections tatsächlich Anfragen erzeugen | Datenschutzarme Events pro Section/CTA, verständliche Funnel-Hinweise und konkrete Optimierungsvorschläge | 4 | 4 | 5 | 4 | 3 | Later |
| 10 | **Guided Module Setup** | Shop, Booking, Forms und SEO besitzen viele abhängige Einstellungen und können halbkonfiguriert live gehen | Setup-Checklisten, Testmodus, Health Checks und blockierende Publish-Warnungen für fehlende Pflichtkonfiguration | 4 | 3 | 4 | 3 | 2 | Next |
| 11 | **Collaboration & Approval** | Agentur und Kunde können Änderungen nicht sauber besprechen oder freigeben | Kommentare an Section/Feld, Rollen, Review-Link, Approval, Aktivitätsverlauf | 4 | 3 | 4 | 5 | 4 | Later |
| 12 | **Scheduled/Localized Publishing** | Kampagnen und mehrsprachige Betriebe benötigen zeitgesteuerte, regionale Inhalte | Geplante Snapshots, Zeitzonen-Vorschau, Locale-Status und Fallback-Prüfung | 3 | 3 | 3 | 5 | 5 | Later |

## Voraussetzungen, Architektur-Fit und Risiken je Opportunity

| Opportunity | Vorhandener Architektur-Fit | Technische Voraussetzungen | Hauptrisiko / Gegenmaßnahme | Erwarteter Impact / Priorität |
|---|---|---|---|---|
| Quality Copilot | Contracts, Token-/DOM-Audits, Previewdaten und stabile Section-IDs sind vorhanden | ein Issue-Schema, Regeln, Screenshot-Worker, Dismiss/Feedback und Audit Trail | False Positives -> deterministische Regeln zuerst, Konfidenz und Preview | sehr hohe Activation/Retention und weniger Support; **P1/Now** |
| Goal-based Page Composer | Picker-Metadaten, Demo Recipes und Section Registry können Pläne erzeugen | Page-Goal-Taxonomie, kompatible Nachbarn, Content Budgets, idempotenter Plan-Service | monotone/falsche Pläne -> sechs Experience Families, Begründung und manuelle Freigabe | sehr hohe Time-to-value und Differenzierung; **P1/Next** |
| Safe Publish Review | Snapshots, Checksums, History, Rollback und Cache Tags existieren | atomarer Publish-Service, verlässlicher Diff, Screenshot-/Link-/Media-Checks | falsche Sicherheit bei unvollständigen Checks -> klarer Prüfumfang und fail-closed Kern | sehr hohes Vertrauen/Retention; **P1/Now** |
| AI Site Plan API | PAT API, Zod-Schemas und Section Contracts existieren | Scopes/Quotas, Revision/Idempotency, Plan/Validate/Dry-run/Apply, Approval | Modell erzeugt destruktive/falsche Writes -> enge Schemas, keine impliziten Deletes/Publishes | hohe Skalierung und AI-Paket-Umsatz; **P1/Next** |
| Premium Demo Recipes | 18 Seed-Quellen, Previewdaten und Module existieren | Content-/Media-Redaktion, Experience-Family-Metadaten, Demo Release Gate | Pflegeaufwand/erneute Konvergenz -> Owner, Content Budgets und regelmäßige Sales-QA | sehr hoher Sales-/Activation-Effekt bei geringem Architekturrisiko; **P1/Now** |
| Responsive Compare | Live Preview und Viewport-Steuerung existieren | synchronisierte Frames, Fokusprotokoll, overflow/crop/contrast rules | hoher Editor-Bundle-/CPU-Bedarf -> lazy load und optionaler Vergleich | hoher Qualitäts-/Vertrauenseffekt; **P2/Next** |
| Media Intelligence | Media Assets, Blob Adapter und Section-Mediafelder existieren | Usage Graph, Focal-/Crop-Metadaten, Magic-byte/re-encode pipeline, Jobs | Migration und teure Bildverarbeitung -> additive Metadaten, asynchrone Derivate | hoher sichtbarer Qualitäts- und Supporteffekt; **P2/Next** |
| Reusable Business Objects | Tenant Settings/Collections liefern Teile des Modells | typisierte Referenzen, Usage Graph, lokale Overrides, Migrations-/Delete-Regeln | weitreichende Referenzmigration -> versionierte Dual Reads und Usage Preview | hoher Retention-/Pflegeeffekt; **P3/Later** |
| Section Conversion Insights | Sections haben IDs; Consent-/Scriptmodell existiert | Eventvertrag, Consent, Retention, Attribution und Mindestdatenregeln | Privacy und Scheinkausalität -> keine PII, Schwellenwerte, keine falschen Versprechen | hoher Upsell-/Retention-Effekt nach stabiler Basis; **P3/Later** |
| Guided Module Setup | Shop/Booking/Form/SEO-Settings und Add-ons existieren | kanonische Health Checks, Testmodus, Setup State und blockierende Regeln | zu aggressive Blocker -> Severity/Override mit Erklärung | hohe Activation, weniger Fehlkonfiguration/Support; **P2/Next** |
| Collaboration & Approval | Snapshots/History bilden eine Ausgangsbasis | echte User/Role Identity, Revisions, Kommentare, Notifications und Audit Log | hohe Auth-/Workflow-Komplexität -> erst Identity-/Revision-Fundament | hoher Agentur-/Team-Tarifwert; **P3/Later** |
| Scheduled/Localized Publishing | i18n-Felder, Snapshots und History sind teilweise vorhanden | Locale-State-Machine, Job/Outbox, Zeitzonen/DST, per-locale Validation | kombinatorische Zustände und Fehlpublishing -> kleine Pilotoberfläche, idempotente Jobs | mittlerer Enterprise-/Retention-Wert; **P3/Later** |

## Wettbewerbsbenchmark (Primärquellen, Juli 2026)

| Produkt | Aktueller belegter Schwerpunkt | Konsequenz für Flamingo |
|---|---|---|
| Webflow | [AI Site Builder](https://help.webflow.com/hc/en-us/articles/38840145286035-Build-a-site-with-Webflow-s-AI-site-builder) erzeugt editierbare Multi-page-Struktur, Content und Theme; [Webflow AI](https://webflow.com/ai) kombiniert Section-/Copy-Generierung, Audits, Optimierung, Localization und Agent-/MCP-Zugriff | Nicht mit maximaler Designfreiheit konkurrieren. Flamingo muss beim lokalen Betrieb durch bessere Defaults, kontrollierte Apply-/Publish-Flows und sofort funktionierende Business-Recipes gewinnen |
| Wix/Wix Studio | [Native Business Solutions](https://www.wix.com/studio/business-solutions) bündeln Commerce, Booking, Events, Restaurants, Hotels, Rollen und mobile Verwaltung; der [AI Builder](https://www.wix.com/ai-website-builder) verspricht prompt-to-business-ready mit manueller Weiterbearbeitung | Flamingo kann Funktionsbreite kurzfristig nicht schlagen. Differenzierung: weniger Komplexität, Agenturqualität, lokale Inhalte, sicherer Betrieb und ein Health/Copilot, der konkrete Resultate hält |
| Squarespace | [Blueprint AI](https://www.squarespace.com/websites/create-a-portfolio) wird mit Templates, Commerce, Acuity Scheduling und Invoicing als geführter Einstieg kombiniert | Premium-Ästhetik allein reicht nicht. Flamingo braucht sichtbar bessere lokale Conversion-Stories und einen einfacheren Publish-/Recovery-Vertrag |

Der Benchmark bestätigt die Signature-Richtung, verschärft aber den Qualitätsmaßstab: „AI kann Text erzeugen“ ist kein Vorteil mehr. Differenzierend sind **deterministische Qualitätsprüfung, lokales Business-Modell, nachvollziehbarer Plan, sicherer Apply/Publish und betreibbare Demo-/Customer-Rezepte**.

## Frontend-/QA-Library Decision Ledger

| Kandidat | Status im Repo | Empfehlung | Begründung / Gate |
|---|---|---|---|
| [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/accessibility) | nur `@radix-ui/react-slot` | **gezielter Pilot** für Admin Dialog, AlertDialog, Popover, Tooltip, Select; nicht Public-Section-Styling ersetzen | bringt Fokus-/Keyboard-/ARIA-Verhalten, bleibt unstyled. Pilot muss React-19/Next-SSR, Bundle und Token-Wrapping bestehen |
| [React Aria Components](https://react-spectrum.adobe.com/react-aria/getting-started.html) | nicht installiert | **Alternative, nicht parallel global einführen**; evaluieren für Calendar/DatePicker/ComboBox, falls Booking-Primitive-Lücke bleibt | starke Assistive-tech-/Internationalisierungsbasis; Mischbetrieb mit Radix erhöht mentale/API-/Bundle-Kosten |
| [TanStack Virtual](https://tanstack.com/virtual/latest/docs/framework/react/react-virtual) | nicht installiert | **nur nach Messgrenze** für große Media-/Collection-Listen; Section Picker mit 205 Typen erst über Suche/Kuration lösen | Virtualisierung adressiert Rendering, nicht Informationsarchitektur. Aufnahme erst bei reproduziertem 500+/1.000-Item-Jank |
| [Floating UI](https://floating-ui.com/docs/usefloating) | nicht direkt installiert | nur für Preview-Overlays mit realem Collision-/Clipping-Problem; Admin-Overlays bevorzugt über ein Primitive-System | `flip`/`shift`/`size` lösen Positionierung, aber keine Dialog-/Focus-Semantik; keine doppelte Overlay-Infrastruktur |
| [dnd-kit Keyboard Sensor](https://docs.dndkit.com/guides/accessibility) | bereits installiert | **behalten und korrekt nutzen**: focusable activator, Keyboard Sensor, Screen-reader Instructions, Live Announcements plus Move-up/down | kein Dependency-Wechsel nötig; aktuelles Produkt schöpft vorhandene Accessibility-Funktion nicht aus |
| [Motion reduced-motion](https://motion.dev/docs/react-use-reduced-motion) | Framer Motion bereits installiert | **behalten, zentral konfigurieren**; Parallax/Autoplay bei User-Präferenz abschalten oder in Opacity überführen | Production-Route-Matrix bestätigt 10 Typen mit kontinuierlicher CSS-Animation; der unmittelbar nach Render messende Storybook-Stresslauf sieht zusätzlich in 95/271 Varianten noch laufende, teils nur endliche Entrance-Animation. Beides getrennt beheben und prüfen; eine neue Animationslibrary löst das nicht |
| [Storybook A11y/Visual Tests](https://storybook.js.org/docs/writing-tests/index) | Storybook 10 + A11y Add-on vorhanden | A11y `error` und Interaction Stories in CI; Pixel-Baselines zunächst mit vorhandener Infrastruktur, Chromatic nur bei gewünschtem SaaS-Review | Fixtures fehlen, nicht das Tool. [Storybook Visual Tests](https://storybook.js.org/docs/writing-tests/visual-testing) können später Review-Workflow liefern |
| [Playwright ARIA/Visual Snapshots](https://playwright.dev/docs/aria-snapshots) | bereits installiert | **Standard für kritische Journeys und Section-ARIA-Struktur**; kleine stabile Snapshots statt kompletter dynamischer Bäume | nutzt vorhandenes Tooling, kann Rollen/Namen/States sowie Pixel prüfen; Baseline-Änderungen müssen reviewpflichtig sein |

Entscheidungsregel für jede neue Runtime-Dependency: belegt ein reproduziertes Problem; unstyled/tokenfähig; Keyboard/SR/RTL/reduced-motion; SSR/RSC/React-19-kompatibel; tree-shakebar; aktiv gepflegt; Lizenz/Bündel gemessen; Exit-/Migration-Plan. **Für Hero/FAQ/Timeline-Redesign ist keine neue Library Voraussetzung.**

## Section-Strategie aus der vollständigen Extreme-State-Matrix

Der audit-only Katalog verdichtet 553 Definitionen/222 Typen auf 271 unterschiedliche `(type, component)`-Renderer-Varianten und prüft 14 Zustände je Variante. 3.794/3.794 Zustände rendern ohne Hard Failure. Das ist eine gute technische Basis, aber noch kein Premium-Beleg: Expanded-Content erzeugt Body-Overflow in acht Komponentenfamilien, 13 Varianten liefern unter Missing-Media-Stress gebrochene Bilder, und große Familien wiederholen Layout, Stockbilder und Dramaturgie nahezu unverändert. Die Production-Route-Matrix bleibt separat für 208 Typen/832 Viewports sowie RSC-/Hydrationverhalten zuständig.

### Premium-Referenzset im Bestand

Diese Sections sind die stärksten Ausgangspunkte für ein kleines, kuratiertes System; sie sind Referenzen, nicht automatisch releasefertige Komponenten:

| Aufgabe | Referenzen | Was übernommen werden sollte |
|---|---|---|
| Editorial Storytelling | `beforeAfterStoryPro`, `coupleStory`, `scrollStory`, `transformationStories`, `zigzagShowcase` | klarer Spannungsbogen, wechselnder Rhythmus, echte Vorher/Nachher- oder Prozesslogik |
| Vertrauen und Conversion | `consultationBooking`, `faqContactSplit`, `smartInquiry`, `proofWall`, `immersiveCtaBanner`, `offerCampaignStrip` | unmittelbarer nächster Schritt, Beweis nahe CTA, progressive statt beliebiger Formulare |
| Visual Showcase | `featureShowcase`, `galleryPro`, `locationHero`, `venueInfo`, `weddingFloristry`, `textImage.cafe` | starke Bildführung, bewusstes Cropping, weniger austauschbare Card-Grids |
| Service und Commerce | `serviceTabs`, `shopProductDetail`, `seasonalCampaign` | Entscheidungshilfe, Preis-/Leistungsnähe, reale Produkt- oder Angebotslogik |

`fitnessHero` und `floristHero` wirken visuell stark, sind strukturell aber zu ähnlich. Sie sollten zu getrennten Art Directions weiterentwickelt werden, nicht als Beleg für Branchenvielfalt gelten.

### Kuratieren statt weitere Varianten stapeln

1. Pro Zweck eine kanonische Primitive-Familie definieren: Hero, Proof, Service/Feature, Gallery, Story/Process, FAQ, Conversion und Commerce/Booking.
2. Je Familie höchstens 2–4 echte Art Directions erlauben. Eine neue Variante braucht andere Informationsarchitektur oder Interaktion; Farbe, Radius oder Bildseite reichen nicht.
3. Inhaltsbudgets und Fallbacks werden Teil des Contracts: Min/Max-Items, Heading-/Copy-Budget, erlaubte Media-Ratios, Placeholder/Skip-Verhalten, CTA-Pflicht und Empty State.
4. Jede Section erhält einen Qualitätsvertrag gegen Default, 1/2/odd/9 Items, Long/Translated Copy, Missing/Portrait/Landscape/Low-quality Media, Light/Dark, Reduced Motion, Tastatur und Zoom.
5. Die 271-Varianten-Matrix wird cohortweise zum CI-Gate; Production-Route-Tests bleiben für Next Image, RSC, Hydration und echte Tenant-Tokens bestehen.

Die größten Konsolidierungschancen liegen in FAQ, Contact/Form, Gallery, Hero, Story/Timeline, Testimonial und Team. Häufig leere oder unterfüllte Shells wie Embed, Logo-Marquee, Portfolio-/Package-/Service-Menüs, Text-/Video-Blocks und Checkout brauchen entweder einen belastbaren Empty State oder dürfen nicht publizierbar sein. Content und Medien sind dabei Teil des Produkts, nicht Seed-Nacharbeit.

## Signature Features

### 1. Quality Copilot: Qualität als kontrollierter Workflow

**Beobachtetes Problem.** Die Demos bestehen technische Quell-Audits, zeigen aber live dennoch unsichtbare CTAs, falsche Bilder, schwache Timeline-Rails, zu lange Seiten und mobile Überlagerungen. Reine Schema-Validierung reicht nicht.

**Experience.** Ein Health-Panel gruppiert Befunde nach „blockiert Veröffentlichung“, „sollte geprüft werden“ und „Idee“. Jeder Befund zeigt die betroffene Section in Desktop/Mobile, erklärt den Nutzen und erzeugt höchstens einen überprüfbaren Änderungsvorschlag. Keine stille AI-Mutation.

**Architektur-Fit und Voraussetzungen.** Vorhandene Section Contracts, Token-Audits, Snapshot-Diffs, DOM-Audits und PAT-Debugdaten liefern bereits viel Input. Nötig sind eine kanonische Issue-Struktur, stabile Section-IDs, Screenshot-Worker, deduplizierte Regeln und ein Approval-Protokoll.

**Strategischer Wert.** Das CMS verkauft nicht nur Editierbarkeit, sondern eine dauerhaft professionell wirkende Website. Das reduziert Support, erhöht Activation und schafft ein verständliches Premium-/Care-Paket.

**Risiken.** False Positives, AI-Halluzinationen und Warnmüdigkeit. Gegenmittel: deterministische Checks zuerst, Konfidenz anzeigen, Vorschau/Diff verpflichtend, Undo und Feedbackschleife.

### 2. Goal-based Page Composer: vom Geschäftsziel zur Seite

**Beobachtetes Problem.** Der Picker zeigt 205 Typen. Ein lokaler Betrieb kann kaum beurteilen, ob er `FeatureGrid`, `Process`, `ServiceCards` oder eine industriespezifische Variante braucht.

**Experience.** Nutzer wählen Seitentyp, Ziel, Angebot, Zielgruppe und gewünschte Aktion. Das System erstellt zunächst einen begründeten Seitenplan, etwa „Vertrauen -> Leistung -> Beweis -> Ablauf -> Anfrage“. Erst nach Bestätigung werden Sections angelegt. Jede Empfehlung besitzt 2–3 kuratierte Varianten, nicht die komplette Registry.

**Architektur-Fit und Voraussetzungen.** Section-Metadaten und Demo-Quellen existieren. Sie müssen um `pageGoals`, Inhaltsbudget, kompatible Nachbarn, Business-Module und Quality Constraints ergänzt werden. Der Composer verwendet dieselben Validierungs- und Apply-Endpunkte wie die AI API.

**Strategischer Wert.** Kürzere Time-to-Value, bessere Seitenstruktur und ein starkes Alleinstellungsmerkmal gegenüber frei-formigen Page Buildern. Monetarisierbar als Guided Launch bzw. AI-Paket.

**Risiken.** Monotone Ergebnisse und falsche Empfehlungen. Deshalb sechs Experience-Familien, diverse dramaturgische Recipes und nachvollziehbare Nutzerkontrolle.

### 3. Safe Publish Review: Sicherheit als Produktmerkmal

**Beobachtetes Problem.** Save-Zustände sind verteilt, die Live-RSC-Adminseite crasht und Snapshot-Fehler können auf Draft zurückfallen. Nutzer können nicht sicher beantworten: „Was geht jetzt live?“

**Experience.** Publish öffnet eine Review-Ansicht mit Inhaltsdiff, betroffenen URLs, automatisch geprüften Links/Medien/SEO/Kontrast und drei responsiven Screenshots. Der Commit ist atomar; ein eindeutig sichtbarer „letzten Stand wiederherstellen“-Pfad ist unmittelbar danach verfügbar.

**Architektur-Fit und Voraussetzungen.** Snapshots, Publish History, Checksums und Rollback existieren bereits. Zuerst müssen Snapshot Reads fail-closed und alle Publish-Schritte transaktional/idempotent werden.

**Strategischer Wert.** Reduziert Angst, Support und reale Ausfälle. Besonders wertvoll für ein CMS, das Nicht-Techniker selbst bedienen sollen.

## AI API: gute Ergebnisse auch mit schwächeren Modellen

Der aktuelle PAT-Zugriff ist technisch leistungsfähig, verlangt aber zu viel implizites Domänenwissen. Ein kleineres Modell benötigt eine enge, selbstbeschreibende Arbeitsfläche.

### Empfohlener Ablauf

```text
GET  /api/v1/capabilities
  -> Seitenziele, erlaubte Operations, Scopes, Limits
POST /api/v1/site-plans
  -> normalisierter Plan + Annahmen + fehlende Entscheidungen
POST /api/v1/site-plans/{id}/validate
  -> feldgenaue Fehler + reparierbare Vorschläge
POST /api/v1/site-plans/{id}/dry-run
  -> struktureller Diff + Preview URLs + Quality Issues
POST /api/v1/site-plans/{id}/apply
  -> idempotenter Draft-Commit
POST /api/v1/publishes
  -> separates Approval/Capability
```

### API-Guardrails

- kleine, zielorientierte Schemas statt freier Section-Rohdaten;
- diskriminierte Operationen mit Beispielen und Defaults;
- `clientRequestId`, Revision/ETag und idempotente Writes;
- Fehlerpfade wie `pages[0].sections[2].cta.href`, inklusive erlaubter Werte;
- `autoRepairable` nur für deterministische Normalisierung;
- Plan-/Apply-Limits, PAT-Scopes und Tenant-Quotas;
- Delete und Publish nie als Nebenwirkung eines Content-Writes;
- „replace all“ nur mit Revision und explizitem Modus;
- maschinenlesbare Rezeptbibliothek nach Page Goal, nicht zwingend Branche;
- Response enthält Unsicherheiten und Entscheidungen, die ein Mensch prüfen muss.

## Branchen: Rezept, nicht Systemgrenze

Eine harte Branchendifferenzierung ist für das CMS nicht sinnvoll. Die tatsächliche Architektur bestätigt das: Tenant, `definitionKey`, Sections, Collections und Module sind grundsätzlich branchenunabhängig. `industry` darf deshalb weder Autorisierungs-, Persistenz- noch Rendergrenze werden. Branchen bleiben wertvoll als austauschbare Verkaufs-, Demo-, Content- und Onboardingrezepte.

Empfohlene Trennung:

| Ebene | Rolle |
|---|---|
| Tenant | Daten-, Domain-, Rechte- und Publish-Grenze |
| Capabilities | Shop, Booking, Menu, Events, Portfolio, Blog etc. |
| Experience Family | Art Direction, Rhythmus, bevorzugte Sections und Medienlogik |
| Industry Recipe | vorausgefüllte Sprache, Seitenplan, Datenmodelle und Demo-Story |
| Preset | konkrete startbare Kombination, danach frei editierbar |

Sechs ausreichende Experience-Familien:

1. **Expertise & Trust** — Handwerk, Beratung, Medizin, Recht.
2. **Portfolio & Transformation** — Fotografie, Architektur, Beauty, Fitness.
3. **Hospitality & Occasion** — Hotel, Restaurant, Event, Hochzeit.
4. **Commerce & Product** — Retail, Food, lokale Produkte.
5. **Planning & Booking** — Services mit Termin, Ressourcen oder Anfrageprozess.
6. **Community & Live** — Vereine, Kultur, Events, News.

So können Branchen-Demos maximal unterschiedlich und überzeugend bleiben, ohne hunderte parallele Implementierungen zu erzwingen.

## Demo-Portfolio als Vertriebssystem

Jeder Demo-Tenant braucht eine eigene Aussage, nicht nur andere Farben.

- eine Haupt-Conversion und ein glaubwürdiges lokales Angebot;
- 4–7 kuratierte Seiten statt überall extrem langer Onepager;
- reale Inhaltslängen, Preise, Beweise, FAQs und lokale Details;
- Bildset mit konsistentem Motiv, Crop und Nutzungsrecht;
- mindestens ein sichtbares Business-Modul (Booking, Anfrage, Shop, Event, Collection);
- andere Experience Family, Navigation und Seitendramaturgie;
- messbare Story: „in 60 Sekunden versteht ein Interessent Angebot, Vertrauen und nächsten Schritt“;
- automatisierte Screenshots und Content-/Link-/Contrast-Checks vor Deployment.

Jedes Recipe sollte maschinenlesbar liefern: Zielgruppe und lokales Kernproblem, primäre Conversion, Seitenplan, erlaubte Premium-Sections, reale Inhaltsbudgets, benötigte Business Objects, Bildbriefing/Focal Points sowie Abnahmeszenario. Die Demo-Seeds verwenden dann dieselben Contracts wie Goal-based Composer und AI Site Plan API. So kann ein Tenant seine Branche später wechseln oder ganz ohne Branchenmetadatum starten, während die Demo-Galerie weiterhin starke vertikale Geschichten verkauft.

## Empfohlene Reihenfolge

1. Sicherheit, Publishing und Live-Admin stabilisieren.
2. Quality-Copilot-Regelmodell und Demo-QA zunächst deterministisch aufbauen.
3. Picker durch Goal-/Capability-Filter und kuratierte Recipes reduzieren.
4. AI Site Plan API auf denselben Contracts implementieren.
5. Responsive Compare und Media Intelligence ergänzen.
6. Analytics erst nach sauberem Event-/Consent-Modell; Collaboration/Localization erst nach Identity-/Revision-Modell.
