# Schubert scope and page strategy

These documents describe the standalone `schubert-design` and `schubert-grabdenkmal` tenants of the shared renderer. They do not define the CMS-wide identity. Product facts remain binding in [PRODUCT.md](PRODUCT.md); the selected replacement direction is in [REDESIGN.md](REDESIGN.md).

## Direction and implementation

The user selected **“Progressives Designstudio: Schwarz, starke Rasterbrüche, größere Schrift und mehr Bewegung.”** Design uses black and charcoal, ivory typography, mineral accents, oversized headlines and asymmetric genuine photography. Grabdenkmale retains warm light stone, a serif display face and calm contained photography. Neither hero uses glow.

The current system is extracted in [DESIGN.md](DESIGN.md), with panel extensions in [.impeccable/design.json](.impeccable/design.json). Source palettes, heading/body fonts, image fit and focal position are independent for each surface. Brand defaults resolve through local section, card, image, field and action colors.

## Route responsibilities

| Surface | Schubert Design | Schubert Grabdenkmale |
| --- | --- | --- |
| Home | Studio hero; three distinct kinetic editorial rows; asymmetric project-category spread; showroom image/text; practical consultation close | Photograph-led memorial hero; quiet manual image selector; reading interlude; simple process; calm consultation close |
| Leistungen | Compact studio opening; editorial material/application selector; service index; process | Memorial opening; service spread and index; topic-led image/text |
| Projekte / Galerie | Six genuine work categories in an asymmetric spread | Respectful examples and a gallery distinct from service navigation |
| Showroom / Ratgeber | Compact hero; editable cinematic chapters; practical visit information | Readable decisions, care guidance and native FAQ rows |
| Über uns | Studio hero; authentic workshop/people imagery; team and history | Memorial opening; genuine craft context; clear process |
| Kontakt | Compact practical opening; dark readable form; explicitly light location surface | Calm opening; clear contact options and accessible form |
| Legal | Dark reading surfaces with one H1 | Light reading surfaces with one H1 |
| Collection details | Six work categories with studio opening, real portfolio gallery and consultation link | Seven topic-specific services: prose/sequence, genuine image/detail, or editable consideration lists |

All 16 page routes and 13 collection detail routes remain. Existing page/item IDs and slugs are preserved. The prepared candidate has **29 routes and 99 section instances**; this is an observed implementation count, not a future content-length target. Work-category pages are not invented individual client case studies.

## CMS editing contract

All compositions use ordinary registered CMS sections and variants, including their schemas, structured editors, preview data, definitions and generated color contracts. No tenant landing page is concealed in JSX or a raw HTML field.

- `editorialHero`: studio or memorial layout, compact scale, headline, rich text, hint, primary/secondary labels and URLs, photograph, alt, fit and focal position. Text-only openings are supported.
- `kineticIdentity` editorial: three to six ordered statements with editable prefix/highlight/suffix, explanation and photograph; normal document flow with motion-safe image parallax.
- `categoryMosaic` spread: editable category images, fit/position/alt, descriptions, titles and links in a responsive asymmetric composition.
- `materialAtelier`: three to eight valid titled images with description, alt/position, optional destination/CTA and metadata; one list drives visible manual selection. Quiet uses contained photographs. Up to five metadata entries are displayed.
- `cinematicChapters`: three to six chapters; editable headline, intro, transition, truthful skip label and each chapter's title/text/image/link. Desktop chapter controls select native-scroll positions. Skip moves keyboard focus to the following content heading. Mobile and reduced motion show all chapters as ordered cards.
- `textImage`: image-left/image-right layout; headline, body, optional photograph, alt, cover/contain fit and CSS focal position; editable icon/title/text consideration items and actions. Photo frames consume the existing section corner field directly. Design Home/About use a sharp photo value; memorial photos, cards and controls keep their own corner roles. Legacy side values migrate only where an explicit layout is absent.

Shared lists, process, FAQ, rich text, legal, galleries, contact, map and CTA sections retain their normal editing paths. Service icons use supported content-appropriate Lucide names; contact Phone, Mail, MapPin and Clock3 remain functional. Images replace decorative service icons where the content calls for real work.

## Raster provenance

[RASTER-PROVENANCE.json](RASTER-PROVENANCE.json) is the portable inventory of every public raster referenced by the prepared canonical payloads. It records approved existing assets, public source URLs when verified, actual library filenames, known byte/checksum data, measurements where available and public content slots. It contains no credentials, tenant database rows or private content exports.

Legacy library dimensions may be 384×216 even when the inspected delivered stage image is 1600×900. The inventory keeps library metadata, delivered measurements and original-source dimensions distinct; unknown values stay unknown. New stage replacements and their exact contain/cover choices retain the measured applied provenance. No generated project media is used.

The memorial cover-slab service is intentionally text-led: the supplied genuine inventory does not verify an installed cover slab. A planted open grave is used for framing, not described as a cover. An existing inscribed memorial illustrates an existing grave without a claim that the photograph proves restoration.

## Evidence and release gates

The current deterministic transform is `scripts/schubert-launch/prepare-progressive.mjs`, operating on fresh isolated exports. Its paired `*-after.json` files and canonical `*-preview.json` files remain outside Git in `tmp/schubert-dark-2026-10-19/`. The canonical preview uses the exact publication builder without database credentials. The publication safeguards are described in [the operational README](../../../scripts/schubert-launch/README.md); use the progressive preparation entry point for this direction.

Source validation passed TypeScript, 35 focused tests, ten section-style contracts, section/editor parity and final color contract, mirror, coverage and crosstalk checks. Actual SSR, deterministic preparation, authored per-edge spacing, unconfigured-edge fallback and direct photo-radius consumption are covered. The canonical CMS round trip covered 29 routes and 99 instances with zero faults, including sanitation of the skip/link/fit/position fields. The Design publication dry run passed. These checks validate source and payload contracts; they do not establish visual or production acceptance.

Visual confirmation and independent visual disposition are separate from source checks. Consult the ignored operational release record, `tmp/schubert-dark-2026-10-19/release.json`, and its referenced capture, computed-CSS, reviewer and production reports to determine acceptance of a particular release. Actual deployment identities and publication results belong there. These permanent system documents do not establish release acceptance. Earlier launch evidence in `tmp/schubert-launch-2026-10-19/` is historical and is not acceptance of this redesign.

For each production release:

1. Record the actual independent visual verdict and its evidence for the intended source/CMS payload.
2. Require both standalone deployments to be **READY** on the same intended source revision.
3. Verify atomic content publication and successful cache invalidation for each isolated tenant database/renderer.
4. Check actual public page and collection routes, image delivery, one-H1 outlines, desktop/mobile reading, navigation, galleries and privacy/cookie controls. The temporary local `/quality/...` fixture is not shipped.
5. Confirm `schubert@schubertdesign.de`, `+49 841 97474-0` and Schrobenhausener Straße 132, 85051 Ingolstadt in the contact path. Keep hours consistent with the supplied company information.
6. Verify recipient and SMTP configuration. Connection verification is distinct from sending and receiving an explicitly authorized real inquiry; QA does not send one.
7. Preserve actual source/deployment identities, publication results, public evidence and remaining limitations in the local release record.

Each renderer keeps its own isolated Neon database. No preparation, review, documentation or publication step requires querying the protected central Flamingo database. Keep secrets and content exports outside tracked documentation.
