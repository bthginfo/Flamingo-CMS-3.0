---
name: "Schubert tenant websites"
description: "A progressive dark stone studio and a calm, light memorial identity, built from genuine Schubert work."
colors:
  design-black: "#0B0D0C"
  design-charcoal: "#151916"
  design-card: "#1B201B"
  ivory: "#F4F1E9"
  pale-copy: "#D3D4C9"
  design-muted: "#ADB3A5"
  mineral: "#C7CF9E"
  design-divider: "#42493E"
  design-control: "#7F8975"
  button-ink: "#141812"
  stone: "#F2EFE7"
  stone-alternate: "#E6E2D7"
  stone-card: "#FBFAF6"
  memorial-ink: "#20271F"
  memorial-body: "#434B40"
  memorial-muted: "#5C6557"
  olive: "#59643F"
  memorial-divider: "#CBCDBE"
  memorial-control: "#8B9580"
  inverse-heading: "#FFFFFF"
  inverse-body: "#F0F0E8"
  inverse-muted: "#D1D5C7"
  image-overlay: "rgba(0,0,0,0.68)"
typography:
  design-display:
    fontFamily: "Space Grotesk, Outfit, Inter, system-ui, sans-serif"
    fontSize: "clamp(3.6rem, 8vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  design-display-compact:
    fontFamily: "Space Grotesk, Outfit, Inter, system-ui, sans-serif"
    fontSize: "clamp(2.8rem, 6.2vw, 5.6rem)"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  memorial-display:
    fontFamily: "Cormorant Garamond, Outfit, Inter, system-ui, sans-serif"
    fontSize: "clamp(3rem, 5.6vw, 5.6rem)"
    fontWeight: 500
    lineHeight: 1.03
    letterSpacing: "-0.025em"
  memorial-display-compact:
    fontFamily: "Cormorant Garamond, Outfit, Inter, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 5vw, 4.6rem)"
    fontWeight: 500
    lineHeight: 1.03
    letterSpacing: "-0.025em"
  advanced-headline:
    fontSize: "clamp(2.15rem, 5.4vw, 5.8rem)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "-0.035em"
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
  action:
    fontSize: "0.9375rem"
    fontWeight: 650
    lineHeight: 1.25
  label:
    fontSize: "0.875rem"
    fontWeight: 650
    lineHeight: 1.4
rounded:
  surface: "0.125rem"
  photograph-sharp: "0rem"
  field: "1rem"
  control: "0.75rem"
  footer: "2rem"
  footer-wide: "3rem"
spacing:
  action-gap: "0.75rem"
  text-gap: "1.5rem"
  mobile-gutter: "1.5rem"
  content-gap: "2rem"
  small-screen-gutter: "2.5rem"
  large-screen-gutter: "3.5rem"
  section-s: "1.5rem"
  section-m: "3rem"
  inner-mobile: "1.75rem"
  inner-desktop: "3rem"
components:
  button-design-primary:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.button-ink}"
    rounded: "{rounded.surface}"
    padding: "0.7rem 1.2rem"
  button-design-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    rounded: "{rounded.control}"
    padding: "0.7rem 1.2rem"
  button-memorial-primary:
    backgroundColor: "{colors.memorial-ink}"
    textColor: "{colors.inverse-heading}"
    rounded: "{rounded.surface}"
    padding: "0.7rem 1.2rem"
  input-design:
    backgroundColor: "{colors.design-charcoal}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.field}"
    padding: "0.75rem 1rem"
  input-memorial:
    backgroundColor: "{colors.stone-card}"
    textColor: "{colors.memorial-ink}"
    rounded: "{rounded.field}"
    padding: "0.75rem 1rem"
  card-design:
    backgroundColor: "{colors.design-card}"
    textColor: "{colors.pale-copy}"
    rounded: "{rounded.surface}"
  card-memorial:
    backgroundColor: "{colors.stone-card}"
    textColor: "{colors.memorial-body}"
    rounded: "{rounded.surface}"
  navigation:
    backgroundColor: "{colors.design-black}"
    textColor: "{colors.ivory}"
---

# Design System: Schubert tenant websites

## Overview

**Creative North Star: "Stone interrupts the grid"**

Schubert Design is a progressive dark studio: black and warm charcoal, large grotesk type, ivory copy, mineral accents and genuine room and material photography. A wide headline establishes the page; offset images, alternating column spans and fine rules give the work an editorial rhythm. This records the implemented replacement for the rejected light Design composition.

Schubert Grabdenkmale keeps its own warm, light stone world. Serif headlines, contained memorial photography and quieter asymmetry support careful reading and personal choices. Both sites use the existing wordmark, authentic Schubert assets and ordinary editable CMS sections. These rules apply only to these two tenants. The approved direction is in [REDESIGN.md](REDESIGN.md); product facts remain in [PRODUCT.md](PRODUCT.md).

**Key Characteristics:**

- Dark editorial Design surfaces and separate light memorial surfaces.
- Oversized type, sharp image edges and varied column relationships.
- Genuine photography with explicit fit, focal position and independent foreground roles.
- Initially visible motion, useful selection controls and complete reduced-motion content.
- Normal CMS fields and variants rather than tenant-specific page markup.

## Colors

The palettes share a green mineral character while pairing every surface with its own readable foregrounds.

### Primary

- **Mineral** marks Design links, directional details and selected highlights on dark surfaces.
- **Olive** provides the accent on the light memorial palette and the deliberately light closing sections on Design.

### Neutral

- **Design Black**, **Design Charcoal** and **Design Card** separate page, alternate and bounded surfaces. **Ivory**, **Pale Copy** and **Design Muted** provide heading, body and secondary text. **Design Divider** and **Design Control** distinguish rules from control boundaries.
- **Stone**, **Stone Alternate** and **Stone Card** form the light palette. **Memorial Ink**, **Memorial Body** and **Memorial Muted** supply its text hierarchy. **Memorial Divider** and **Memorial Control** supply the corresponding boundaries.
- **Button Ink** is the foreground on the ivory Design action. **Inverse Heading**, **Inverse Body** and **Inverse Muted** are photograph/dark-story roles; **Image Overlay** supports their dark backing.
- Navigation and footer use Design Black with Ivory links and Pale Copy. Intentional light CTA sections and the Design contact-map section carry the complete light foreground set.

**The Surface Pair Rule.** A section owns its heading, body, muted, card, link, icon, button and field colors. Brand defaults resolve through those local roles; they do not repaint a light closing section or inverse photograph copy.

**The Photograph Rule.** Photograph text uses independent inverse roles and an intentional dark backing. Memorial photographs remain separate from marketing copy so inscriptions stay visible.

## Typography

**Design display/body:** Space Grotesk / Manrope. **Memorial display/body:** Cormorant Garamond / Inter. The configured tenant heading family drives display utilities. Outfit, Inter and system fallbacks remain available when a web font is unavailable.

### Hierarchy

- **Design display** is the wide studio headline; its compact branch serves interior and detail pages. Both use balanced wrapping, preserved line breaks and a maximum measure of 19 characters.
- **Memorial display** and its compact branch use a softer serif rhythm and a maximum measure of 15 characters.
- **Advanced headline** introduces richer editorial sections. Kinetic statement rows vary their size and column span in a three-part sequence.
- **Headline** is the shared section title. Category spread entries use medium display type at 30px, becoming 36px from the medium breakpoint.
- **Body** uses the tenant body family. Hero copy is 16px, becoming 18px at the medium breakpoint, with a line height of 1.8 and a 48-character measure. Shared section copy ranges to 18px and 65 characters; editorial item copy stays around 45–54 characters.
- **Action** and **Label** distinguish controls and explicit field labels from body copy. Functional hints remain smaller and subordinate.

**The Outline Rule.** Use one H1 for the page purpose, H2 for section openings and H3 for entries. Rich text beneath a hero must not introduce another H1.

## Layout

Studio, memorial, kinetic and atelier sections use a container up to 1440px. Studio headings precede a 12-column desktop grid. Home copy takes four columns and its image eight, with a 56px upward image offset; compact pages use five and seven columns with a 24px offset. On narrow screens, headline and copy precede the photograph. Home photographs move from 4:3 to 16:10; compact images use 16:9.

Memorial heroes put the contained photograph before copy in source order. Their desktop ratio is 1.3:1; the padded image field is 16:10, capped at 580px or 440px in the compact branch. Text-only openings are supported, including the cover-slab explanation where no installed cover photograph is verified.

Kinetic editorial rows alternate 5/7, reversed 6/5 and 7/4 column relationships with landscape and square media. Category spreads use a 12-column medium-screen grid: eight-column image, offset four-column image, then an eight-column image beginning in column four. Ratios are 16:11 and 4:5; captions sit below photographs on solid surfaces. Mobile becomes one ordered sequence.

Atelier editorial uses a 0.7:1.3 desktop split and a tall photograph; quiet memorial uses a left photograph in a 1.2:0.8 split and a padded 4:3 contain frame. Visible selection controls precede the image on mobile. Explicit CMS spacing owns each outer edge: none removes outer padding, while medium/small use the section spacing tokens. A template-owned wrapper adds none. Nested text/image and rich-text sections retain their own responsive inner padding. Theme defaults apply only to an outer edge without valid authored metadata; genuine cards retain their shared fallback.

The recurring horizontal gutter is 24px, increasing to 40px and then 56px where each section applies it. Breakpoints are 640px, 768px, 1024px and 1280px. Category spreads start at 768px, studio columns at 1024px, and cinematic stories use static cards below 768px. Shared buttons fill the row below 640px; studio actions deliberately keep natural widths and wrap.

## Elevation & Depth

Depth comes from surface changes, photographic scale, offsets and fine borders. Photographs and editorial rows do not require floating glass or glow. The shared primary action retains a small ambient shadow, increasing on fine-pointer hover; its exact shadow and motion are recorded in the sidecar. Contact fields use a small inset highlight and a bounded focus ring.

**The Material Rule.** Genuine stone, rooms and workmanship supply the visual texture. Neither Schubert hero adds glow or decorative glass.

## Shapes

Primary actions and ordinary cards use nearly square token corners. Secondary studio actions and native selection buttons retain the shared control radius. Studio and category photographs have sharp edges. Text/image photo frames consume the existing editable section corner token directly: Design Home/About use the sharp photograph value, while memorial photo frames retain the surface value. Card and control corner roles remain independent. Text fields resolve the shared classic rounded boundary (16px), while secondary studio/selection controls use 12px. These shared control aliases do not define photograph corners. The dark footer has rounded top corners, increasing at the medium breakpoint. Thin rules define selections, captions and editorial rows instead of enclosing every passage in a card.

## Components

### Buttons

Primary Design actions use ivory with dark copy; memorial and light-section primary actions use dark ink with white copy. Shared actions have a minimum 48px height and a 1px transparent border. The studio secondary action resolves the shared 12px control radius; primary actions use the surface token. Secondary actions are transparent with independent foreground and stronger control border. Text and directional SVG arrows inherit the same foreground. Fine-pointer hover lifts the action 2px and moves its arrow 3px; active returns to rest. Keyboard focus remains visible.

### Cards / Containers

Cards use local dark or light colors, independent heading/body roles, thin borders and the surface corner token. Contact information and form containers use bounded surfaces; editorial categories and service/process lists also use open compositions and rules. The classic footer contains contact, navigation, hours, legal links and cookie settings without a second promotional closing panel.

### Inputs / Fields

Fields use their local input surface, foreground and stronger boundary, with explicit labels above controls. Text controls have a minimum 48px height, 15px text and a rendered 16px field radius from the shared classic style. The implemented shared placeholder override uses the input foreground at full opacity; labels identify fields independently. Focus changes the border to the accent and adds a 3px ring at 16% accent. Privacy information, validation, failure and success feedback remain visible. SMTP connection verification alone does not prove delivery of an inquiry.

### Navigation

Dark navigation uses the existing wordmark, explicit routes and consultation link. The mobile menu supports Escape and returns focus to its trigger. Legal links, phone, email and cookie settings remain practical controls. Directional actions use supported Lucide arrows; service icons describe their content rather than relying on unknown-name fallbacks.

### Editorial hero

`editorialHero` selects studio or memorial through `layout`; `compact` changes interior-page scale. Headline, rich text, CTA labels/URLs, hint, image, alt, fit and focal position are normal CMS fields. The action-group gutter is omitted when neither CTA has a label. Studio type and image reveal by translation with all content visible from the first render. Type lasts 950ms and image 1100ms. Reduced motion presents the final composition immediately.

### Material atelier

`materialAtelier` displays three to eight valid titled images from one editable list. Focus or activation selects a row with `aria-pressed`, controlling the live photograph region. Each item supplies description, alt/focal position, optional link/CTA and up to five displayed metadata entries. Selection is manual. Editorial transitions last 350ms; quiet uses 200ms. Quiet photographs use contain fit and padding. Reduced motion removes transitions while retaining selection.

### Cinematic chapters and kinetic editorial

The showroom's `cinematicChapters` uses three to six editable chapters with title, text, photograph and link. Desktop uses a bounded native-scroll story with chapter buttons, current-step state and visible focus. The editable “Bildgeschichte überspringen” control transfers keyboard focus to the next content heading and clamps the scroll destination to at least the story section bottom. Mobile and reduced motion receive the complete ordered cards. Desktop image transitions last 650ms and copy 450ms; scrolling is not trapped.

Home `kineticIdentity` editorial keeps every statement in normal flow. Photographs move from −3% to 3% through the viewport at 1.08 scale when motion is allowed. The hydration-safe preference subscription responds to live reduced-motion changes without remounting content. Category spread image hover enlarges by 1.035 only when motion is allowed.

## Do's and Don'ts

### Do:

- **Do** preserve complete local surface, card, image, button and field color pairs.
- **Do** use the configured tenant display family and one purposeful H1.
- **Do** keep genuine images matched to the topic, distinguishing measured dimensions from legacy metadata.
- **Do** use contained memorial images and truthful text-only compositions when no relevant photograph is verified.
- **Do** keep text, links, items, images, focal positions and colors editable through normal CMS fields.
- **Do** preserve ordinary scrolling, visible selection controls and complete reduced-motion content.

### Don't:

- **Don't** introduce glow heroes or decorative glass on either Schubert website.
- **Don't** carry the rejected light Design palette into a new dark section or repaint the memorial site as the studio.
- **Don't** cover inscriptions with marketing copy or describe a planted open grave as an installed cover slab.
- **Don't** invent projects, testimonials, staff, prices, statistics, media filenames or unmeasured image sizes.
- **Don't** repeat a generic contact invitation in both a page section and a large footer panel.

Not canonized: unused shared badge/kicker styles and the shared footer's faint blurred background decoration are implementation residue, not a Schubert design rule. This documentation pass makes no UI repair and does not establish final visual or production acceptance.
