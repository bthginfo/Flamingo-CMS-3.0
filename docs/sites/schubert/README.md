# Schubert scope and page strategy

These documents describe two tenants of the shared Flamingo renderer. They do not define the CMS-wide design system.

## Direction contract

- **Thesis:** present real stone craftsmanship clearly, with useful information and readable solid surfaces.
- **World:** warm stone, brass and charcoal; genuine work photography; restrained corners; architectural Design typography and quieter memorial typography.
- **Story:** explain the offer, show relevant examples, clarify decisions and lead to personal consultation.
- **First viewport:** a legible editorial opening, with real imagery beside the copy and no glow. Describe the offer and place without a generic welcome headline.
- **Form:** adjacent copy and photography on desktop; copy followed by imagery on mobile. Details, lists and galleries adapt to their information instead of repeating one card formula.

## Route responsibilities

| Surface | Schubert Design | Schubert Grabdenkmale |
| --- | --- | --- |
| Home | Bathrooms, natural stone and tile; real applications; selected work; showroom and consultation | Memorial choices; personal consultation; examples; understandable process and help with existing graves |
| Leistungen | Detailed applications and practical service support | Seven services grouped into meaningful choices for new and existing graves |
| Projekte / Galerie | One project-category overview, with six category detail routes | Respectful examples, separate from the service overview |
| Showroom / Ratgeber | Visit, material selection, practical showroom information | Decisions, care and frequently asked questions |
| Über uns | Family craft, genuine people and history | Experience and a careful approach to personal memorial work |
| Kontakt | Short practical opening, contact options, accessible form and location information | Calm practical opening, contact options and accessible form |
| Legal | Readable operator and privacy information | Readable operator and privacy information |
| Collection details | Six genuine work categories; no invented case studies | Seven distinct service explanations with specific considerations and steps |

All 16 page routes and 13 collection details remain available. Content preparation currently creates 98 sections across page and item compositions; this is an implementation count, not a target for future content length.

## Source acceptance and production gates

The repeatable transform and publication commands are documented in [the operational README](../../../scripts/schubert-launch/README.md). Source tokens and reusable rules are in [DESIGN.md](DESIGN.md), with panel extensions in [.impeccable/design.json](.impeccable/design.json).

- Ten unchanged original assets have public replacements; the bundled media manifest records source, SHA-256, size and dimensions. Preparation falls back to the bundled asset map when no operational map is supplied, and publication registers these assets in Grab's media library without replacing existing rows.
- Technical local acceptance passed: 29 routes at desktop and mobile sizes, giving 58 route/viewport checks. All returned HTTP 200 with one H1, no axe violations, broken images, horizontal overflow or runtime errors.
- Fourteen interaction checks passed for navigation hover, galleries, cookie controls and mobile-menu Escape/focus restoration.
- TypeScript and section surface/color contract gates passed.
- Independent visual acceptance is a separate release gate. Record the actual verdict and its evidence in the local release record; technical checks alone do not establish visual approval.
- SMTP connection verification succeeded without sending an email. Actual inquiry delivery has not been proven by that check.

For each production release:

1. Both standalone deployments must be **READY** on the same intended code revision, including shared template corrections.
2. Verify the atomic content publication result and successful tenant cache invalidation for each isolated database/renderer.
3. Check the real production page and collection routes, image delivery, heading outlines, mobile navigation and privacy/cookie controls. Use the audit's public mode; the temporary local `/quality/...` fixture route is not shipped.
4. Verify the tenant contact destination and SMTP configuration. Distinguish connection verification from an explicitly authorized end-to-end inquiry test.
5. Store the actual source revision, deployment identities, publication results, production evidence and limitations in a local release record.

Run-specific evidence deliberately stays outside Git in `tmp/schubert-launch-2026-10-19/`, including `audit-final.json`, `*-publication.json` and `release.json`. Preserve it for the release and recovery without committing exports or secrets. This document records durable gates rather than requiring a new source commit for every deployment status update.
