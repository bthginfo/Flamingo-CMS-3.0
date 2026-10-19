---
name: Schubert tenant websites
description: Real stone craftsmanship on light reading surfaces, with restrained brass and charcoal.
colors:
  brass: "#78613C"
  brass-link: "#6A532E"
  stone: "#F7F4EF"
  stone-alternate: "#EDE8DF"
  paper: "#FFFFFF"
  charcoal: "#151A17"
  ink: "#222622"
  body-ink: "#454740"
  muted-ink: "#62635B"
  divider: "#D6D1C7"
  control-border: "#9C9C92"
  footer-copy: "#DEDCD4"
typography:
  design-display:
    fontFamily: "Space Grotesk, Outfit, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 4.5vw, 4.6rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  memorial-display:
    fontFamily: "Cormorant Garamond, Outfit, system-ui, sans-serif"
    fontSize: "clamp(2.65rem, 4.6vw, 4.8rem)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  headline:
    fontSize: "clamp(2rem, 5vw, 3.75rem)"
    lineHeight: 1.04
  design-body:
    fontFamily: "Manrope, Inter, system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.75
  memorial-body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.75
  label:
    fontSize: "0.875rem"
    fontWeight: 650
    lineHeight: 1.4
rounded:
  surface: "0.25rem"
  field: "0.75rem"
  footer: "2rem"
spacing:
  action-gap: "0.75rem"
  text-gap: "1.5rem"
  mobile-gutter: "1.5rem"
  content-gap: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.surface}"
    padding: "0.7rem 1.2rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "0.7rem 1.2rem"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0.75rem 1rem"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.body-ink}"
    rounded: "{rounded.surface}"
  navigation:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.stone}"
---

# Design System: Schubert tenant websites

## Overview

**Creative North Star: "Stone, clearly presented"**

The two Schubert websites share a material identity: warm stone surfaces, dark ink, restrained brass and genuine work photography. Text occupies solid surfaces, so rooms, craftsmanship and memorial inscriptions can be seen without competing with copy.

Schubert Design uses architectural sans-serif typography; Schubert Grabdenkmale uses a softer serif display face with a neutral body face. Both use clear section boundaries, useful information and measured space. These rules apply only to the two Schubert tenants.

**Key Characteristics:**

- Light reading surfaces with dark, independent text roles.
- Genuine work photography with deliberate framing.
- Distinct display typography for the two visitor contexts.
- Quiet controls and a practical, restrained footer.

## Colors

The palette expresses stone, brass and charcoal through functional surface roles.

### Primary

- **Brass** marks meaningful icons and restrained accents.
- **Brass Link** is the darker accent used for links and selected small foreground details on light surfaces.

### Neutral

- **Stone** is the main reading surface; **Stone Alternate** separates related content.
- **Paper** supports form fields and card surfaces.
- **Ink**, **Body Ink** and **Muted Ink** separate headings, reading copy and secondary information.
- **Charcoal** grounds navigation and the footer; **Footer Copy** supports text on that surface.
- **Divider** separates content; **Control Border** provides the stronger boundary used by fields and secondary actions.

**The Surface Pair Rule.** Bind each surface to its own heading, body, muted, input and icon roles. A page palette change must not leave an old per-section foreground behind.

**The Photograph Rule.** Photograph overlays use independent inverse roles. Do not derive photo text from the dark ink used on the surrounding light page.

## Typography

**Design display/body:** Space Grotesk / Manrope. **Memorial display/body:** Cormorant Garamond / Inter. The renderer's configured tenant heading stack must also drive display utilities, rather than falling back to the renderer's unrelated default face.

The display sizes in frontmatter come from the architectural and quiet hero branches. Hero copy is generally 16px, becoming 18px on larger screens, with a line height of 1.8 and a maximum measure of 49 characters. Section copy uses readable measures around 65 characters; small practical information remains distinct from body copy.

**The Outline Rule.** Use one H1 for the page purpose, H2 for sections and H3 for entries. Rich text beneath a hero must not introduce another H1.

## Layout

Editorial heroes use a container up to 1440px. At large screens, solid copy and authentic photography form adjacent columns in a 0.9:1.1 ratio. On narrow screens, copy precedes the image. Compact interior-page heroes reduce vertical space; the home hero retains a larger image field.

Reading modules use constrained measures and deliberate spacing. Service indexes use dividing rules and collapse from two columns to one; simple process lists collapse from three columns to one. Galleries preserve useful image framing. The recurring mobile gutter is 24px; larger breakpoints expand gutters and gaps rather than shrinking copy.

## Elevation & Depth

Tonal separation and thin borders provide most depth. Small ambient button and card shadows remain in shared primitives; they are support for interaction, not floating hero decoration. The primary button uses the observed shadow `0 8px 24px rgba(25,30,25,0.10)` and a 220ms state transition.

**The Material Rule.** Let genuine stone and room photography carry visual interest. The Schubert hero variants do not add glow, decorative glass or blurred orbs.

## Shapes

Buttons and ordinary surfaces use restrained corners. Form fields retain their larger, clearly bounded radius. The dark footer uses a rounded top edge, with a light reading or contact surface immediately above it. Keep photographs intact; avoid placing marketing copy over memorial inscriptions.

## Components

### Buttons

Primary actions use dark ink with white copy and a minimum 48px height. Secondary actions retain dark copy, a transparent surface and the stronger control border. Copy and arrows inherit the same foreground. State changes use the existing subtle translation, brightness and visible focus treatment.

### Cards / Containers

Use paper surfaces, independent card text roles and thin dividers where a card is needed. Services and processes also have quieter index/list variants; do not wrap every paragraph in a raised card.

### Inputs / Fields

Fields use white surfaces, ink values and muted placeholders, with explicit labels above them. The label, placeholder, input value, border and error roles are separate. The form includes a linked privacy explanation, visible validation, failure feedback and success feedback. A successful visual review does not establish actual email delivery.

### Navigation

Navigation uses the dark tenant surface and existing wordmark. Internal routes and the consultation action remain explicit. The mobile menu must support keyboard dismissal and return focus to its trigger. The classic footer presents navigation, contact information, opening hours, legal links and cookie settings without repeating a generic promotional closing box.

### Editorial hero

The architectural and quiet variants place headline, explanation and useful actions on a solid light surface beside one authentic photograph. They also support text-only openings. The quiet variant uses the memorial serif face and gentler typography; neither variant relies on animation to make the first content visible.

## Do's and Don'ts

### Do:

- **Do** preserve the independent section, card, image and form color roles.
- **Do** use the configured tenant heading family throughout display text.
- **Do** keep real work imagery matched to the page topic and use respectful memorial framing.
- **Do** check the complete page outline, mobile navigation, controls and contact path.

### Don't:

- **Don't** introduce glow heroes on either Schubert website.
- **Don't** use brass as a substitute for readable body copy on light surfaces.
- **Don't** repeat the same generic contact invitation in a page section and a large footer box.
- **Don't** invent testimonials, projects, staff, prices or statistics to fill a layout.
