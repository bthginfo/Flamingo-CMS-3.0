# Schubert websites

Scope: `schubert-design` and `schubert-grabdenkmal` only. This is tenant documentation, not the product identity of Flamingo CMS or other renderer tenants.

## Purpose and visitors

**Schubert Design** helps homeowners, clients and architects in Ingolstadt explore bathrooms, natural stone and tile, see genuine examples, visit the showroom and request a consultation. Project detail routes describe categories of work; they are not invented individual client case studies.

**Schubert Grabdenkmale** helps families plan a memorial or arrange work on an existing grave. Visitors need understandable choices, respectful examples and a manageable next step. Explain design, materials, inscriptions, care and restoration without urgency or unsupported promises.

## Product truth

- Operator: SCHUBERT GmbH & Co. KG, Schrobenhausener Straße 132, 85051 Ingolstadt.
- Representatives: Henry Schubert and Raphael Marc Schubert.
- Register: Amtsgericht Ingolstadt, HRA 2172. VAT ID: DE261337057.
- Contact: `+49 841 97474-0`, `schubert@schubertdesign.de`.
- Preserve the real wordmark, supplied work photography and verified company history. Do not invent staff, projects, prices, testimonials or performance statistics.
- Showroom information comes from the supplied content and official company sources. A future change to opening hours must update both contact information and the footer.

## Durable commitments

- German copy uses clear, respectful “Sie” language and explains what visitors can do next.
- Reading surfaces and forms must remain legible at desktop and mobile sizes. Text on photographs has independent inverse color roles; memorial inscriptions must not be covered by marketing copy.
- The user explicitly rejected glow heroes. Preserve the recognizable stone, brass and charcoal identity through real material photography and restrained typography.
- Keep all existing public page and collection routes. Every rendered page has one H1 and a purposeful outline beneath it.
- Phone, email, internal navigation, privacy information and cookie settings must be usable with keyboard and touch.
- Contact delivery must use the tenant's actual recipient. SMTP connection verification is distinct from sending and receiving a real test inquiry.

## Operating boundary

Each site runs as an independent Vercel renderer with its own Neon database. Design work and publication must not require queries to the protected central Flamingo database. Keep public image dependencies on approved public assets. Credentials and content exports are operational inputs, not documentation assets.

## Evidence and acceptance

The source of truth is the prepared CMS payload from `scripts/schubert-launch/prepare-content.mjs`, paired with the current shared renderer implementation. Route strategy and deployment checks live in [README.md](README.md); visual rules live in [DESIGN.md](DESIGN.md).

Release acceptance requires the visual verdict and production gates in the scoped README. Documentation and technical local checks alone are not a production launch approval; run-specific release evidence stays in the local operational directory.
