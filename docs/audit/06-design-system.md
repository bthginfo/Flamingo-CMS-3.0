# Design-System-Audit

## Kurzurteil

Es existiert ein echtes Design-System, nicht nur lose Tailwind-Klassen: 54 deklarierte semantische Section-Slots, Brand-/Style-/Design-CSS-Variablen, generierte Section-Farbverträge, Contract-Resolver, DOM-Scan im Editor, Contrast-Helfer, Section-Definition-Registry und Storybook Section Lab. Das System ist ambitioniert und testbarer als viele CMS-Builder. Die 553 Registry-Definitionen lösen 222 kanonische Typen und 271 unterschiedliche `(type, component identity)`-Renderer-Varianten auf; genau diese 271 Varianten sind jetzt in einer 14-state-Matrix prüfbar.

Das Problem ist die Kaskade: mehrere Schichten schreiben dieselben Rollen, Base/Alt-Surfaces werden aliasiert, Demo/Public/Preview wenden nicht dieselben Schichten an und Spacing/Typografie/Motion sind weniger formalisiert als Farben. Deshalb können alle Token-Gates „grün“ sein, während eine konkrete Linie weiß auf weiß verschwindet.

## Aktuelle Architektur

| Ebene | Quellen | Verantwortung | Befund |
|---|---|---|---|
| Primitives/Registry | `packages/design-tokens/src/tokens.ts`, `section-color-editor.tsx` | 54 Slotnamen, Defaults, Beschreibungen | Vocabulary/Root-Fallback Gate besteht |
| Industry Style | `apps/renderer/src/lib/styles.ts` | Branchen-/Classic-Defaults | Enthält echte Unterschiede, wird später überschrieben |
| Brand | `lib/brand-colors.ts:getBrandCssVars` | Primär-/Akzentfarben, Text-/Surface-/Button-Defaults, Contrast | Schreibt Brand und Section-Rollen; fehlende Werte können Style-Rollen übermalen |
| Design | `lib/design-vars.ts` | freie semantische Designwerte | Public-Route nutzt sie; Demo-Shell nicht |
| Font | Brand-Felder + `font-proxy.ts` | Allowlisted Google-/Custom-Fonts | Public lädt Fonts; Demo ignoriert sie |
| Section Contract | `section-color-contracts-generated.ts`, Resolver | Welche Slots eine Section tatsächlich liest | Gute Idee; committed Output ist aktuell stale |
| Instance Override | `page_sections.styleOverrides` | einzelne Section | grammatikalisch normalisiert, inline scoped |
| Runtime | `section-renderer.tsx` | Definition, Wrapper, Alias/Fallback | Cross-Aliases können semantische Rollen kollabieren |
| Editor | Color Editor + Preview DOM-Scan | nur verwendete Slots zeigen | starkes Konzept; abhängig von Preview-Parität und synchronen Contracts |

## Was gut funktioniert

- `pnpm check:tokens` scannt 220 Templates, 3.042 CSS-Var-Referenzen, 54 deklarierte Slots; 5/5 Gates bestehen.
- Keine verbotenen direkten Legacy-Brand/Style-Referenzen in Templates laut Gate.
- Crosstalk-Audit findet keine riskanten Textrollen-Kopplungen.
- Hardcoded-Color-Regression sank auf 69 Referenzen gegenüber Baseline 209.
- Jede Section erhält einen Definition-Key und kann owner-spezifisch aufgelöst werden.
- Editor kann Color-Slots anhand des gerenderten DOM auf tatsächlich verwendete Rollen reduzieren.
- Contrast-Helfer unterstützen Hex/RGB/RGBA und Compositing; Unit-Tests decken Kernfälle ab.
- Font-Proxy erlaubt nur bekannte Familien und wehrt Injection ab.

## Bestätigte Drift und Fehler

### 1. Base und Alternate Surface kollabieren

`brand-colors.ts` berechnet sinngemäß:

```text
sectionBg    = brand.sectionBg    ?? #fff
sectionBgAlt = brand.sectionBgAlt ?? sectionBg ?? #f8fafc
```

Da `sectionBg` immer gesetzt ist, ist der `#f8fafc`-Fallback unerreichbar. Der Renderer aliasiert zusätzlich `--token-section-bg` und `--token-section-bg-alt` gegenseitig. Ergebnis: semantisch getrennte Flächen werden identisch.

Konkrete Auswirkung: Timeline-Rail liest `--token-section-bg-alt`, während Section-Hintergrund ebenfalls weiß ist. Computed Style live: Linie `rgb(255,255,255)` auf `rgb(255,255,255)`.

### 2. Demo, Public, Preview und Shop haben keinen gemeinsamen Theme Composer

Die reale Public Route kombiniert Style, Brand, Fonts und Design. `DemoPageShell` kombiniert nur Style+Brand und lässt `brandData.design`, Heading-/Body-Fonts und Custom Font Face weg. Collection-/Shop-/Preview-Pfade besitzen weitere eigene Mischungen.

Auswirkung: Demos beweisen nicht das tatsächliche Designsystem; Handwerk sollte Fraunces/Inter/Creme/Warm-Divider nutzen, zeigt aber Outfit/Slate/Weiß.

### 3. On-media ist kein vollständiger semantischer Zustand

Es existieren `on-dark`-Rollen, aber der sekundäre CTA auf einem composited Bild ist nicht als eigenes Paar abgesichert. Photography/Retail rendern den sekundären CTA fast unsichtbar. Contrast gegen eine Basissurface reicht für Media nicht.

### 4. Generator-/Editor-Drift

- `check:section-colors` schlägt fehl und meldet gleichzeitig 0 konkrete Slotänderungen.
- `check:section-surface` meldet `section-editor-field-defaults.ts` out of sync.
- Registry-Audit zählt 28 `*Verein`-Contract-Keys fälschlich als Types.

Die Gates existieren, ihre Deterministik/Diagnostik ist aber selbst Teil des Problems.

### 5. Dark-Palette-Stress zeigt fehlende semantische Rollentreue

In der künstlich dunklen Storybook-Palette meldet der Solid-background-Heuristiker bei **215 von 271** Renderer-Varianten mindestens ein Kontrastsignal; 30 Varianten bestehen, 26 sind nicht sinnvoll messbar. Das ist ausdrücklich kein Befund „215 Produktionsbugs“: Dark Mode ist kein unterstützter Modus, Hintergründe mit Bild/Gradient und Overlays begrenzen den Heuristiker.

Der Stress ist trotzdem architektonisch wertvoll. Ein belastbarer semantischer Contract muss ein Vorder-/Hintergrundpaar gemeinsam konsumieren. Komponenten, die in der dunklen Palette weiterhin lokale Light-defaults, falsch gekoppelte Aliases oder nicht zur Surface passende Textrollen nutzen, brechen diese Austauschbarkeit. Produktionsnahe Sichtprüfungen bestätigen denselben Fehlertyp unter anderem bei Tattoo-Sections, `flashDayBanner`, mehreren On-media-Heroes und `trialSessionCta`. Ziel ist nicht „Dark Mode sofort liefern“, sondern **jede verwendete Surface über eine dazugehörige Text-/Action-/Divider-Rolle auflösen**.

### 6. Visuelle Varianten sind häufig Daten-Duplikate statt Designvarianten

Die settled Kontaktbögen aller 271 Varianten zeigen eine zweite Driftform jenseits der Tokens:

- zehn FAQ-Varianten bleiben dieselbe Drei-Zeilen-Komposition mit anderen Tints/Borders;
- sechs Kontaktvarianten wiederholen denselben Split-Form-Aufbau;
- Hotel-, Restaurant-, Salon-, Tourismus- und Wedding-Galerien teilen Layout und identische Hospitality-Motive;
- viele Hero-Owner teilen Küchenbild und generische „Willkommen bei uns“-Copy;
- `story`- und Testimonial-Owner wirken überwiegend wie Palette-Swaps; Team-/Agent-/Tattoo-Sections recyceln Stock-Portraits.

Das Registry-Modell erlaubt Owner-Differenzierung, garantiert sie aber nicht. Eine Variante braucht eine nachweisbar andere Kompositionslogik, Content-Dichte oder Interaktion; ein neuer Owner-Key allein ist keine Premium-Variante.

## Typografie

Stärken:

- allowlisted Fontfamilien und Custom-Font-Unterstützung;
- Heading-/Body-Rollen über CSS Vars;
- responsive Tailwind-Typografie in vielen Templates.

Lücken:

- kein verbindlicher fluid type scale/token contract für Display/H1/H2/H3/body/small;
- lange Mobile-H1 (Consulting/Tattoo/Shop) laufen über 5–6 Zeilen;
- Font-Pairing ist frei statt kuratiert;
- Demo-Shell-Parität fehlt;
- Zeilenlänge/Absatzbreite und Editorial-Alignment variieren stark.

Empfehlung: 4–6 kuratierte Font-Paare, fluid `clamp()`-Skala, Max-Chars pro Heading/Body, optical sizing/weight defaults und automatische Warnung bei zu langer Headline.

## Spacing, Grid und Container

Es gibt Wrapper-Felder `container`, `spacingTop`, `spacingBottom`, Tailwind-Skalen und viele `max-w-*`-Container. Ein zusammenhängender Section-Rhythmus ist jedoch nicht erzwungen.

Bestätigte Folgen:

- FAQ nimmt unnötig eine Viewport-Höhe ein;
- Timeline verteilt kleine Textinseln über sehr große Höhe;
- `handwerk/text-image.tsx` rendert ein inneres `<section>` mit eigenem `py-20` im äußeren Section-Wrapper;
- häufige Card-on-card-Kompositionen addieren Padding, Radius und Schatten;
- Demoseiten erreichen 20.144px mobile Höhe.
- `serviceDetail` schneidet im Review das letzte Item an, `servicesGrid.florist` erzeugt ein schwaches 3+1-Orphan-Grid und Cart/Checkout/Thank-you verlieren kleinen Inhalt in übergroßer Weißfläche;
- `fitnessHero` kollidiert am unteren Rand, `tattooHero` bricht unruhig und `weddingMenu` bleibt stark linkslastig.

Empfehlung: semantische Space-Tokens (`section-compact/default/hero`, `stack-xs…xl`, `content-measure`, `gutter`) und Wrapper-Invariant: Template rendert keinen zweiten Section-Außenrhythmus.

## Radius, Shadow, Border

Cards verwenden viele unabhängige `rounded-xl/2xl/3xl`, Shadows und translucent borders. Token für Card-Radius/Shadow existieren, werden aber nicht durchgehend als Kompositionsregel genutzt. Das erzeugt den generischen „alles ist eine Karte“-Look.

Ziel:

- Surface darf cardless/editorial sein;
- ein primärer Radius pro Rezept plus kleine Kontrollradien;
- Hairline/Divider als eigene Rolle;
- Schatten nur für echte Layer/Elevation, nicht als Default-Decoration.

## Motion

Framer Motion ist breit eingesetzt. Frühere Section-Analyse fand `useInView`-Boilerplate in 68 Dateien. In der 271-Varianten-Matrix lief bei 95 Varianten unmittelbar nach dem Rendern trotz reduced motion noch Animation; das enthält auch endliche Entrance-Motion und darf nicht als 95 kontinuierliche Verstöße gelesen werden. Die Produktionsroute bestätigt zehn Typen mit kontinuierlicher CSS-Animation. Positive Effekte werden durch fehlende systemweite Regeln geschwächt:

- Marquees ohne Controls/Pause;
- horizontales Scroll-Storytelling ohne durchgehend bewiesenen mobile/reduced-motion Fallback;
- Header Blur/Transform triggert Compositor-Artefakte;
- Motion-Dauern/Easing sind nicht als zentrale Tokens erkennbar.

Ziel: `duration-fast/base/slow`, zwei Easing-Kurven, ein Reveal-Primitive, `prefers-reduced-motion` als Pflichtvertrag, keine Bedeutung nur durch Motion.

## Media-, Empty- und Content-Resilienz

Das System prüft URLs und Feldformen, aber noch nicht ausreichend, ob ein Abschnitt ohne verwendbares Medium oder mit unvollständigem Demo-Inhalt würdevoll bleibt. Der Missing-media-Stress erzeugt Browser-Broken-Images in 13 Varianten, darunter Agent-/Atmosphäre-/Before-after-, fünf Galerie-/Portfolio- und Logo-/Referenz-Renderer. Gleichzeitig bleiben `contactForm`, `embed`, `faqGallery`, `foodMenu`, `logoMarquee`, `portfolioGallery`, `packages`, `serviceMenu`, `textBlock`, `videoEmbed`, ein `story`-Owner und `shopCheckout` sichtbar leer oder unterfüllt. Ein valider Contract ist damit noch kein hochwertiger Zustand.

Benötigte Regeln:

1. Pflichtmedia: Editor blockiert Publish oder verlangt eine bewusst gewählte textuelle Ersatzdarstellung.
2. Optionales Media: DOM-Element entfällt vollständig; nie leeres `src` oder Browser-Broken-Image.
3. Collections: Min-/Ideal-/Max-Itemzahl und Odd-count-Layout sind Teil des Section-Contracts.
4. Demo-Media: Rezeptgebundene Motivtaxonomie, Focal Point, Alt/Caption, Quelle und Duplikatwarnung.
5. Empty/Error: eigener visueller State mit nächster Aktion; kein Titel ohne Inhalt und kein leerer Rahmen.

## Variant-Strategie

Aktuell:

- `activeStyle` ist praktisch `classic`;
- `variant` wird gespeichert, aber nicht konsistent über alle Templates ausgewertet;
- Owner-spezifische Renderer liefern echte Unterschiede für einzelne Branchen;
- Premium Shared Sections werden häufig als identische Palette-Swaps eingesetzt.

Empfehlung:

1. **Branche = Recipe**, nicht Renderer-Grenze.
2. **Experience Family = Kompositionslogik**: Hospitality, Expertise/Trust, Portfolio/Transformation, Commerce, Planning/Booking, Community/Live.
3. **Section Variant = wenige explizite, getestete Layoutvarianten** (`editorial`, `compact`, `media-led`), nicht freie Style-Namen.
4. **Theme Preset = Tokens/Fonts/Radius/Motion**, unabhängig von Content-Recipe.

## Zielarchitektur

```text
1. Primitives
   color ramps, type scale, space, radius, shadow, motion
        ↓
2. Tenant semantic theme
   canvas/surface/surface-alt/card, text roles, brand/accent,
   action pairs, on-media pairs, divider, focus
        ↓
3. Section contract
   which semantic roles + density + media/aspect this type needs
        ↓
4. Recipe defaults
   content order, recommended variants, imagery rules, density
        ↓
5. Instance overrides
   bounded role overrides, never raw arbitrary CSS
```

Eine Funktion `composeTenantTheme({style, brand, fonts, design})` muss von Public, Demo, Preview, Collection Item, Shop und Section Lab identisch verwendet werden.

## Guardrails

| Guardrail | Verhalten |
|---|---|
| Contrast pairs | Foreground/Background gemeinsam validieren; Media inklusive Overlay compositen |
| Surface distinctness | Warnen, wenn Divider/Rail/Card auf Zielsurface visuell verschwindet |
| Font pairing | kuratierte Pairings, Fallback/Loading Preview, max. 2 Familien |
| Responsive type | `clamp`, Headline-Zeilenbudget, lange-Wort-Test |
| Image focal point | Desktop/Mobile focal point + aspect preset + safe zone |
| Density | compact/default/editorial statt freie unbeschränkte Paddingwerte |
| Section health | fehlendes Media, zu wenige/viele Items, leere CTA, Duplicate Proof |
| Motion | reduced-motion Pflicht, Pause/Controls für Auto-Motion |
| Quality preview | Contrast, overflow, broken links, heading order, alt text pro Device |

## Migration

1. Theme-Paritätstests schreiben, bevor Variablen neu geschichtet werden.
2. Base/Alt/Divider Cross-Aliases entfernen; Legacywerte nur gleichnamig mappen.
3. Gemeinsamen Theme Composer einführen und alle Rendering-Pfade umstellen.
4. `secondary-on-media` + Focus/Disabled/Hover Paare ergänzen.
5. Contract-/Surface-Generatoren deterministisch reparieren und Outputs regenerieren.
6. High-frequency Sections (Hero, FAQ, Timeline, Feature, Bento, Stats, Testimonials) auf Spacing/typography/motion primitives migrieren.
7. Legacy `style-*` erst entfernen, wenn Tenant-Audit keine Nutzung mehr meldet.

Akzeptanz: Demo/Public/Preview haben identische computed tokens; alle 54 Slots lösen auf; Tier-1-Paare bestehen AA; Base/Alt bleiben unabhängig; reduced-motion deaktiviert nicht nur Animation, sondern bewahrt Information und Interaktion.
