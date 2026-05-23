# Shop-Feature Plan (Kostenpflichtiges Addon – 999€)

## Überblick
Ein vollständiges E-Commerce-Addon für Flamingo CMS, das Kunden als kostenpflichtiges Feature (999€ einmalig) zugebucht werden kann. Steuerbar komplett aus dem Admin-CMS.

---

## Datenbank-Schema (neue Tabellen)

```
── tenant_addons ──────────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
addon_key VARCHAR (z.B. "shop")
active BOOLEAN
activated_at TIMESTAMP
created_at TIMESTAMP

── products ───────────────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
title VARCHAR
slug VARCHAR
description TEXT
price_cents INTEGER
compare_price_cents INTEGER? (Streichpreis)
currency VARCHAR DEFAULT 'EUR'
sku VARCHAR?
stock INTEGER DEFAULT 0
track_stock BOOLEAN DEFAULT true
status ENUM (draft, active, archived)
category VARCHAR?
images JSONB (Array von URLs)
variants JSONB? ([{name, options: [{label, price_cents?, sku?, stock?}]}])
weight_grams INTEGER?
tax_rate DECIMAL DEFAULT 19.00
sort_order INTEGER DEFAULT 0
created_at / updated_at TIMESTAMP

── orders ─────────────────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
order_number VARCHAR UNIQUE (auto: #FM-0001)
status ENUM (pending, paid, processing, shipped, delivered, cancelled, refunded)
customer_email VARCHAR
customer_name VARCHAR
shipping_address JSONB
billing_address JSONB?
items JSONB ([{product_id, title, variant?, quantity, price_cents}])
subtotal_cents INTEGER
shipping_cents INTEGER
tax_cents INTEGER
total_cents INTEGER
payment_method VARCHAR (stripe, paypal)
payment_id VARCHAR? (Stripe/PayPal transaction ID)
tracking_number VARCHAR?
notes TEXT?
created_at / updated_at TIMESTAMP

── customers (optional, für wiederkehrende Käufer) ────
id UUID PK
tenant_id UUID FK → tenants
email VARCHAR
name VARCHAR
phone VARCHAR?
order_count INTEGER DEFAULT 0
total_spent_cents INTEGER DEFAULT 0
created_at TIMESTAMP

── invoices ───────────────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
order_id UUID FK → orders
invoice_number VARCHAR (auto: RE-2026-0001)
pdf_url VARCHAR?
amount_cents INTEGER
tax_cents INTEGER
issued_at TIMESTAMP
```

---

## Admin-CMS Menüstruktur

```
📦 Shop (Hauptmenüpunkt)
├── Dashboard (Umsatz, Bestellungen heute, Top-Produkte)
├── Produkte
│   ├── Alle Produkte (CRUD, Sortierung, Filter nach Status/Kategorie)
│   ├── Kategorien
│   └── Bestand (Low-Stock Alerts)
├── Bestellungen
│   ├── Alle Bestellungen (Status-Filter, Suche)
│   ├── Bestellung Detail (Statusänderung, Tracking, Storno)
│   └── Retouren/Stornos
├── Kunden
│   └── Kundenliste + Detail (Bestellhistorie)
├── Rechnungen
│   └── Auto-generiert bei Bestellung, PDF-Download
└── Einstellungen
    ├── Zahlungsarten (Stripe/PayPal Keys)
    ├── Versandoptionen (Pauschal, Gewichtsbasiert, Ab X€ kostenlos)
    ├── Steuersätze
    └── E-Mail-Templates (Bestellbestätigung, Versandbenachrichtigung)
```

---

## Frontend-Sektionen (neue Template-Components)

| Section Type | Beschreibung |
|---|---|
| `productGrid` | Produkt-Übersicht mit Filter/Sortierung |
| `productDetail` | Einzelprodukt mit Galerie, Varianten, Warenkorb-Button |
| `cartDrawer` | Slide-in Warenkorb (global, kein Section) |
| `checkoutPage` | Mehrstep: Adresse → Versand → Zahlung → Bestätigung |
| `orderConfirmation` | Danke-Seite mit Bestellzusammenfassung |

---

## Payment Integration

### Stripe (Priorität 1)
- Stripe Checkout Session (hosted) ODER Stripe Elements (embedded)
- Webhook für payment_intent.succeeded → Order status update
- Refunds über Stripe API

### PayPal (Priorität 2)
- PayPal Buttons SDK (client-side)
- Webhook für PAYMENT.CAPTURE.COMPLETED
- Refunds über PayPal API

---

## Warenwirtschaft
- Bestandsverwaltung pro Produkt/Variante
- Automatische Reduktion bei Bestellung
- Automatische Erhöhung bei Storno
- Low-Stock E-Mail-Alert (konfigurierbar, z.B. < 5 Stück)
- "Ausverkauft" Badge auf Frontend wenn stock = 0

---

## Rechnungserstellung
- Auto-Generierung bei Status "paid"
- PDF via `@react-pdf/renderer` oder `jspdf`
- Fortlaufende Rechnungsnummer (RE-{YEAR}-{0001})
- Pflichtangaben: Firmenname, Adresse, USt-IdNr, Rechnungsdatum, Positionen, MwSt-Ausweis
- Download im Admin + automatischer Versand per Mail an Käufer

---

## Upsell / Paywall im Admin

Für Kunden die das Shop-Addon NICHT aktiv haben:
- Menüpunkt "Shop" ist sichtbar aber zeigt eine Paywall-Seite
- Text: "Shop-Modul freischalten"
- Beschreibung der Features + 999€ Preis
- "Jetzt anfragen" Button → sendet E-Mail an hello@flamingomedia.online mit:
  - Tenant-Name, Tenant-ID, Kontakt-Email
  - Betreff: "Shop-Addon Anfrage: {Firmenname}"

---

## CRM Integration
- Neues Feld in tenant_addons: `shop: active/inactive`
- CRM Tenants-Detail zeigt aktive Addons
- Toggle im CRM um Shop für Kunden zu aktivieren/deaktivieren

---

## Marketing-Seite
Neues Paket auf flamingomedia.online:
- "Shop-Paket" (999€ einmalig + im Hosting-Abo enthalten)
- Bullet Points: Produkte, Warenkorb, Stripe/PayPal, Bestellverwaltung, Rechnungen, Warenwirtschaft
- CTA → Kontaktformular

---

## Implementierungs-Reihenfolge (geschätzt)

1. **Phase 1: Grundstruktur**
   - DB Schema + Migrationen
   - tenant_addons Tabelle + Paywall-UI
   - Admin-Navigation mit Addon-Check

2. **Phase 2: Produkte**
   - Produkt-CRUD im Admin
   - Kategorien + Bestandsverwaltung
   - productGrid + productDetail Frontend-Sections

3. **Phase 3: Warenkorb & Checkout**
   - Cart State (zustand oder Context)
   - Checkout Flow (Adresse, Versand)
   - Stripe Integration + Webhooks

4. **Phase 4: Bestellungen**
   - Order Management Admin UI
   - Status-Workflow (paid → processing → shipped)
   - E-Mail-Benachrichtigungen

5. **Phase 5: Extras**
   - Rechnungs-PDF Generierung
   - PayPal als Alternative
   - Kunden-Management
   - Marketing-Seite Update

---

## Technische Entscheidungen

| Thema | Empfehlung |
|---|---|
| Cart State | `zustand` (localStorage persist) |
| Payment | Stripe Checkout (hosted) – einfachster Start, PCI-compliant |
| PDF | `@react-pdf/renderer` (serverseitig) |
| E-Mail | Bestehender Nodemailer/SMTP Stack |
| Bilder | Bestehender Upload-Endpoint |
| Webhooks | Next.js Route Handler `/api/webhooks/stripe` |
