# Flamingo CMS — Branchen-Spezifikation

> Diese Datei dient als Template für KI-Systeme, um eine neue Branche im Flamingo CMS vollständig umzusetzen.
> Kopiere diese Datei und fülle sie für die konkrete Branche aus.

---

## 1. Branche

- **Name:** z.B. "Restaurant & Gastronomie"
- **Slug:** z.B. `restaurant`
- **Zielgruppe:** Wer nutzt diese Website? (z.B. lokale Restaurants, Cafés, Bistros)
- **Referenz-Websites:** 2-3 echte Beispiel-URLs die als Inspiration dienen

---

## 2. Design-System

### Farbschema
- **Primärfarbe:** Hex + Beschreibung (z.B. `#2D5016` – warmes Dunkelgrün, Natur/Frische)
- **Sekundärfarbe:** Hex + Beschreibung
- **Akzentfarbe:** Hex + Beschreibung
- **Dunkler Hintergrund:** Hex (für Header/Footer)
- **Stimmung:** z.B. warm, einladend, rustikal, modern-clean

### Typografie
- **Display-Font:** z.B. "Playfair Display" (Headlines)
- **Body-Font:** z.B. "Inter" (Fließtext)
- **Stil:** z.B. elegant, handschriftlich, modern-sans

### Bildsprache
- **Stil:** z.B. warm-toned Food-Fotografie, Overhead-Shots, Ambiente-Bilder
- **Unsplash-Tags:** z.B. "restaurant interior", "food plating", "chef cooking"
- **Bildformat-Ratio:** z.B. 16:9 für Hero, 1:1 für Karten, 4:3 für Galerie

---

## 3. Sections (CMS-Bausteine)

Für jede Section: Name, Zweck, JSON-Schema der `data`-Felder, und Design-Beschreibung.

### 3.1 Hero
- **Varianten:** z.B. `fullscreen-video`, `split-image`, `parallax`
- **Felder:**
  ```json
  {
    "headline": "string",
    "subline": "string",
    "backgroundImage": "string (URL)",
    "backgroundVideo": "string (URL, optional)",
    "primaryCta": { "label": "string", "href": "string" },
    "secondaryCta": { "label": "string", "href": "string" },
    "variant": "string"
  }
  ```
- **Design-Hinweise:** z.B. "Vollbild-Hintergrundbild mit dunklem Overlay, weiße Schrift, CTA-Buttons in Akzentfarbe"

### 3.2 Speisekarte / Menü *(Branchen-spezifisch)*
- **Felder:**
  ```json
  {
    "categories": [{
      "name": "string",
      "items": [{
        "name": "string",
        "description": "string",
        "price": "string",
        "image": "string (URL, optional)",
        "tags": ["string"] // z.B. "vegan", "glutenfrei"
      }]
    }]
  }
  ```
- **Design-Hinweise:** z.B. "Elegante Karte mit Kategorien als Tabs, Preise rechts-bündig, optionale Bilder"

### 3.3 [Weitere Sections hier eintragen]
Schema für jede Section analog zu oben.

**Standard-Sections** (aus Handwerker-Vorlage übernehmen, anpassen falls nötig):
- `hero` — Heldenbild
- `uspStrip` — USP/Vorteile-Leiste
- `servicesGrid` — Leistungen/Angebot
- `processSteps` — Ablauf/Prozess
- `testimonials` — Bewertungen
- `faq` — Häufige Fragen
- `ctaBand` — Call-to-Action
- `ctaLinks` — CTA-Link-Leiste
- `contact` — Kontakt-Bereich
- `stats` — Zahlen/Statistiken
- `logoCloud` — Partner-Logos
- `galleryGrid` — Bildergalerie
- `newsPreview` — News/Blog-Vorschau

**Branchen-spezifische Sections** (neu zu entwickeln):
- Hier auflisten was _diese_ Branche zusätzlich braucht
- Pro Section: Name, Slug, Felder, Design

---

## 4. Seiten-Struktur

Welche Seiten hat die Demo-Website?

| Seite | Slug | Sections (in Reihenfolge) |
|-------|------|---------------------------|
| Startseite | `` (leer) | hero, uspStrip, servicesGrid, testimonials, ctaBand, contact |
| Speisekarte | `speisekarte` | hero, menuSection |
| Über uns | `ueber-uns` | hero, teamGrid, stats |
| Kontakt | `kontakt` | contact, mapEmbed, faq |

---

## 5. Demo-Content

Fiktiver aber realistischer Content für die Demo-Website.

### Firma
- **Name:** z.B. "Trattoria da Luigi"
- **Tagline:** z.B. "Authentische italienische Küche seit 1985"
- **Branche-spezifische Daten:** z.B. Öffnungszeiten, Reservierungs-Link

### Texte pro Section
Für jede Section den konkreten Demo-Text vorbereiten (Headlines, Beschreibungen, CTA-Labels, FAQ-Fragen etc.)

### Bilder
Unsplash-URLs für alle Bilder (Hero, Galerie, Team, Gerichte etc.)

---

## 6. Navigation & Footer

### Navigation
```json
[
  { "label": "Startseite", "href": "/" },
  { "label": "Speisekarte", "href": "/speisekarte" },
  { "label": "Über uns", "href": "/ueber-uns" },
  { "label": "Kontakt", "href": "/kontakt" }
]
```

### Footer-Spalten
```json
[
  {
    "title": "Öffnungszeiten",
    "items": [
      { "text": "Mo-Fr: 11:00 - 23:00" },
      { "text": "Sa-So: 10:00 - 24:00" }
    ]
  },
  {
    "title": "Kontakt",
    "items": [
      { "text": "Musterstraße 1, 10115 Berlin" },
      { "text": "030 / 123 456 78", "href": "tel:+493012345678" }
    ]
  }
]
```

---

## 7. Admin-Editor Anpassungen

Falls die Standard-Section-Editoren nicht reichen:

- **Neue Editor-Komponenten:** z.B. `MenuEditor` für Speisekarten-Bearbeitung
- **Neue Felder-Typen:** z.B. Preis-Feld mit Währungssymbol, Öffnungszeiten-Picker
- **Abweichungen vom Standard:** Was muss im `section-data-editor.tsx` ergänzt werden?

---

## 8. Renderer-Anpassungen

- **Neue Section-Renderer:** Pro branchen-spezifische Section eine React-Komponente
- **CSS/Tailwind-Anpassungen:** Branchen-spezifische Utility-Klassen oder Theme-Erweiterungen
- **Animationen:** z.B. Parallax-Scroll für Food-Bilder, Hover-Zoom auf Gerichten

---

## 9. Technische Implementierung (Checkliste)

- [ ] Design-Tokens in `tailwind.config.ts` des Renderers definieren (oder per CSS-Variablen aus Brand-Settings)
- [ ] Neue Section-Types in `packages/db` Schema registrieren (falls nötig)
- [ ] Section-Renderer Komponenten in `apps/renderer/src/components/sections/` erstellen
- [ ] Section-Editoren in `apps/admin/.../section-data-editor.tsx` ergänzen
- [ ] Editor-Map (`EDITORS`) um neue Types erweitern
- [ ] Demo-Tenant in DB anlegen (Tenant + GlobalSettings + Pages + Sections + Navigation + Footer)
- [ ] Seed-Script oder SQL für Demo-Content bereitstellen
- [ ] Snapshot publishen für den Demo-Tenant
- [ ] Marketing-Seite: Template-Karte für neue Branche auf `/vorlagen` hinzufügen
- [ ] Testen: Admin-Editor → Speichern → Publish → Renderer-Output prüfen

---

## 10. Datei-Referenzen

Wichtige Dateien im Flamingo CMS Monorepo:

| Zweck | Pfad |
|-------|------|
| DB-Schema | `packages/db/src/schema/index.ts` |
| Section-Renderer | `apps/renderer/src/components/sections/` |
| Section-Editor | `apps/admin/src/app/admin/pages/[id]/section-data-editor.tsx` |
| Tenant-Daten | `apps/renderer/src/lib/tenant-data.ts` |
| Snapshot/Publish | `apps/renderer/src/lib/snapshot.ts` |
| Brand-Settings | `apps/admin/src/app/admin/brand/brand-form.tsx` |
| Navigation-Editor | `apps/admin/src/app/admin/navigation/` |
| Footer-Editor | `apps/admin/src/app/admin/footer/` |
| Tailwind Config | `apps/renderer/tailwind.config.ts` |
| Marketing Vorlagen | `apps/marketing/src/app/vorlagen/` |
