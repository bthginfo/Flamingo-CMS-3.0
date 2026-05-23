# Shop-Feature Plan (Kostenpflichtiges Addon)

## Preismodelle
- **Shop-Addon**: 999€ einmalig (Self-Service, Kunde richtet selbst ein)
- **Shop + Einrichtung durch Flamingo Media**: 1.450€ einmalig (wir richten alles ein: Produkte, Kategorien, Zahlungsanbieter, Versand, Steuern)

---

## Multi-Tenancy Architektur

**WICHTIG:** Alle Shop-Tabellen haben eine `tenant_id`-Spalte und werden per Row-Level-Security (WHERE tenant_id = X) isoliert. Es gibt KEINE separaten Tabellen pro Tenant — das bestehende Multi-Tenant-Pattern (wie pages, collections etc.) wird konsistent beibehalten.

Bei Provisionierung eines neuen Kunden:
1. Tenant wird erstellt (wie bisher)
2. `tenant_addons` Eintrag mit `addon_key: 'shop', active: false`
3. Aktivierung im CRM (Toggle) oder bei Erstprovisionierung → `active: true`
4. Bei Aktivierung: Default-Einstellungen werden in `shop_settings` geschrieben (Währung EUR, Standard-Steuer 19%, etc.)

---

## Datenbank-Schema (neue Tabellen)

```sql
── tenant_addons ──────────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
addon_key VARCHAR ('shop')
active BOOLEAN DEFAULT false
activated_at TIMESTAMP?
created_at TIMESTAMP

── shop_settings ──────────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants (UNIQUE)
currency VARCHAR DEFAULT 'EUR'
currency_symbol VARCHAR DEFAULT '€'
payment_methods JSONB  -- siehe Payment unten
bank_details JSONB?   -- {iban, bic, bank_name, account_holder} für Vorkasse
pickup_enabled BOOLEAN DEFAULT false
pickup_instructions TEXT?
stripe_public_key VARCHAR?
stripe_secret_key VARCHAR? (encrypted)
stripe_webhook_secret VARCHAR?
paypal_client_id VARCHAR?
paypal_secret VARCHAR? (encrypted)
paypal_mode VARCHAR DEFAULT 'sandbox' -- 'sandbox' | 'live'
order_prefix VARCHAR DEFAULT 'FM'  -- Bestellnummer-Prefix
invoice_prefix VARCHAR DEFAULT 'RE'
next_order_number INTEGER DEFAULT 1
next_invoice_number INTEGER DEFAULT 1
notification_email VARCHAR?  -- Verkäufer-Benachrichtigungen
low_stock_threshold INTEGER DEFAULT 5
created_at / updated_at TIMESTAMP

── product_categories ─────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
name VARCHAR
slug VARCHAR
description TEXT?
image VARCHAR?
parent_id UUID? FK → product_categories (für Unterkategorien)
sort_order INTEGER DEFAULT 0
created_at TIMESTAMP
UNIQUE(tenant_id, slug)

── products ───────────────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
category_id UUID? FK → product_categories
title VARCHAR
slug VARCHAR
description TEXT  -- Rich-Text (HTML)
short_description VARCHAR?  -- Für Produktliste
price_cents INTEGER
compare_price_cents INTEGER?  -- Streichpreis
currency VARCHAR DEFAULT 'EUR'
sku VARCHAR?
stock INTEGER DEFAULT 0
track_stock BOOLEAN DEFAULT true
is_digital BOOLEAN DEFAULT false  -- Kein Versand nötig
digital_file_url VARCHAR?  -- Download-Link nach Kauf
status ENUM (draft, active, archived)
images JSONB  -- ["url1", "url2", ...]
weight_grams INTEGER?
tax_class VARCHAR DEFAULT 'standard'  -- Verweis auf tax_rates
meta_title VARCHAR?
meta_description VARCHAR?
sort_order INTEGER DEFAULT 0
created_at / updated_at TIMESTAMP
UNIQUE(tenant_id, slug)

── product_variants ───────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
product_id UUID FK → products
name VARCHAR  -- z.B. "Rot / XL"
sku VARCHAR?
price_cents INTEGER?  -- NULL = Produktpreis verwenden
stock INTEGER DEFAULT 0
attributes JSONB  -- {"Farbe": "Rot", "Größe": "XL"}
image VARCHAR?
sort_order INTEGER DEFAULT 0
UNIQUE(tenant_id, product_id, name)

── variant_options ────────────────────────────────────
-- Definiert welche Varianten-Typen ein Produkt hat
id UUID PK
tenant_id UUID FK → tenants
product_id UUID FK → products
name VARCHAR  -- "Farbe", "Größe", "Material"
values JSONB  -- ["Rot", "Blau", "Grün"] oder ["S", "M", "L", "XL"]
sort_order INTEGER DEFAULT 0

── tax_rates ──────────────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
name VARCHAR  -- "Standard", "Ermäßigt", "Steuerfrei"
rate DECIMAL  -- 19.00, 7.00, 0.00
country VARCHAR DEFAULT 'DE'  -- ISO 3166-1 alpha-2
region VARCHAR?  -- Für länderspezifische Raten
is_default BOOLEAN DEFAULT false
applies_to_shipping BOOLEAN DEFAULT false
created_at TIMESTAMP
UNIQUE(tenant_id, name, country)

── shipping_zones ─────────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
name VARCHAR  -- "Deutschland", "EU", "Weltweit"
countries JSONB  -- ["DE"] oder ["AT", "CH", "FR", ...]
sort_order INTEGER DEFAULT 0

── shipping_methods ───────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
zone_id UUID FK → shipping_zones
name VARCHAR  -- "Standardversand", "Express", "Abholung"
price_cents INTEGER
free_above_cents INTEGER?  -- Kostenlos ab X€ Warenwert
min_weight_grams INTEGER?
max_weight_grams INTEGER?
estimated_days VARCHAR?  -- "3-5 Werktage"
active BOOLEAN DEFAULT true

── coupons ────────────────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
code VARCHAR  -- "SOMMER20"
type ENUM ('percent', 'fixed_amount', 'free_shipping')
value INTEGER  -- 20 (= 20%) oder 500 (= 5,00€)
min_order_cents INTEGER?  -- Mindestbestellwert
max_uses INTEGER?  -- Gesamtlimit
used_count INTEGER DEFAULT 0
max_uses_per_customer INTEGER?
applies_to ENUM ('all', 'specific_products', 'specific_categories')
applies_to_ids JSONB?  -- Product/Category IDs
valid_from TIMESTAMP?
valid_until TIMESTAMP?
active BOOLEAN DEFAULT true
created_at TIMESTAMP
UNIQUE(tenant_id, code)

── promotions ─────────────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
name VARCHAR
type ENUM (
  'free_shipping_above',    -- Ab X€ kostenloser Versand
  'buy_x_get_discount',     -- Kaufe X Stück → Y% Rabatt
  'bundle_discount',        -- Kaufe Produkt A+B → Rabatt
  'quantity_discount',      -- Mengenrabatt (ab 3 Stück -10%)
  'first_order_discount'    -- Erstbesteller-Rabatt
)
conditions JSONB  -- {"min_amount_cents": 5000} etc.
discount_value INTEGER  -- Prozent oder Cents
discount_type ENUM ('percent', 'fixed')
active BOOLEAN DEFAULT true
valid_from TIMESTAMP?
valid_until TIMESTAMP?
stackable BOOLEAN DEFAULT false  -- Mit anderen Promotions kombinierbar?
created_at TIMESTAMP

── orders ─────────────────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
order_number VARCHAR  -- Auto: FM-0001
status ENUM (
  'pending',      -- Bestellt, Zahlung ausstehend
  'paid',         -- Bezahlt
  'processing',   -- In Bearbeitung
  'shipped',      -- Versendet
  'delivered',    -- Zugestellt
  'cancelled',    -- Storniert
  'refunded'      -- Erstattet
)
customer_email VARCHAR
customer_name VARCHAR
customer_phone VARCHAR?
shipping_address JSONB  -- {street, city, zip, country, company?}
billing_address JSONB?  -- Falls abweichend
items JSONB  -- [{product_id, variant_id?, title, variant_name?, quantity, price_cents, tax_rate}]
subtotal_cents INTEGER
shipping_cents INTEGER
discount_cents INTEGER DEFAULT 0
tax_cents INTEGER
total_cents INTEGER
payment_method VARCHAR  -- 'stripe', 'paypal', 'prepayment', 'pickup'
payment_id VARCHAR?  -- Stripe/PayPal Transaction ID
payment_status VARCHAR?  -- 'pending', 'completed', 'refunded'
shipping_method VARCHAR?
tracking_number VARCHAR?
tracking_url VARCHAR?
coupon_code VARCHAR?
notes TEXT?  -- Interne Notizen (Verkäufer)
customer_notes TEXT?  -- Bemerkungen vom Käufer
ip_address VARCHAR?
created_at / updated_at TIMESTAMP

── order_status_history ───────────────────────────────
id UUID PK
order_id UUID FK → orders
old_status VARCHAR
new_status VARCHAR
note TEXT?
created_at TIMESTAMP

── customers ──────────────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
email VARCHAR
name VARCHAR
phone VARCHAR?
default_shipping_address JSONB?
default_billing_address JSONB?
order_count INTEGER DEFAULT 0
total_spent_cents INTEGER DEFAULT 0
first_order_at TIMESTAMP?
last_order_at TIMESTAMP?
created_at TIMESTAMP
UNIQUE(tenant_id, email)

── invoices ───────────────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
order_id UUID FK → orders
invoice_number VARCHAR  -- RE-2026-0001
pdf_url VARCHAR?
amount_net_cents INTEGER
tax_cents INTEGER
amount_gross_cents INTEGER
issued_at TIMESTAMP
UNIQUE(tenant_id, invoice_number)

── email_templates ────────────────────────────────────
id UUID PK
tenant_id UUID FK → tenants
trigger VARCHAR UNIQUE(tenant_id, trigger)
  -- 'order_confirmation'     → An Käufer nach Bestellung
  -- 'payment_received'       → An Käufer nach Zahlungseingang
  -- 'order_shipped'          → An Käufer mit Tracking
  -- 'order_delivered'        → An Käufer bei Zustellung
  -- 'order_cancelled'        → An Käufer bei Storno
  -- 'order_refunded'         → An Käufer bei Erstattung
  -- 'new_order_notification' → An Verkäufer bei neuer Bestellung
  -- 'low_stock_alert'        → An Verkäufer bei niedrigem Bestand
  -- 'digital_download'       → An Käufer mit Download-Link
subject VARCHAR
body TEXT  -- HTML mit Platzhaltern: {{order_number}}, {{customer_name}}, {{items_table}}, {{total}}, {{tracking_url}}, {{download_url}}
active BOOLEAN DEFAULT true
```

---

## Admin-CMS Menüstruktur

```
📦 Shop (Hauptmenüpunkt)
├── Dashboard
│   ├── Umsatz heute / Woche / Monat
│   ├── Bestellungen offen
│   ├── Top-Produkte
│   └── Low-Stock Warnungen
├── Produkte
│   ├── Alle Produkte (CRUD, Filter: Status/Kategorie)
│   ├── Neues Produkt (Titel, Beschreibung, Preis, Bilder, Varianten, Kategorie, Steuern, Digital/Physisch)
│   └── Kategorien (Baum-Struktur, Drag&Drop Sortierung)
├── Bestellungen
│   ├── Alle Bestellungen (Status-Filter, Suche, Datum-Range)
│   ├── Bestellung Detail
│   │   ├── Status ändern (Dropdown mit Historie)
│   │   ├── Tracking-Nummer eingeben → Mail an Käufer
│   │   ├── Storno mit Grund
│   │   ├── Erstattung (voll/teil)
│   │   └── Interne Notizen
│   └── Stornos & Erstattungen
├── Kunden
│   ├── Kundenliste (Suche, Sortierung nach Umsatz)
│   └── Kunden-Detail (Bestellhistorie, Gesamtumsatz)
├── Rabatte & Aktionen
│   ├── Coupons (Code, Typ, Wert, Gültigkeit, Limits)
│   └── Promotions (Regelbasiert: Ab X€ free shipping, Mengenrabatt, etc.)
├── Rechnungen
│   └── Alle Rechnungen (Auto-generiert, PDF-Download)
└── Einstellungen
    ├── Allgemein (Währung, Bestellprefix, Benachrichtigungs-E-Mail)
    ├── Zahlungsarten
    │   ├── Stripe (Public Key, Secret Key, Webhook Secret)
    │   ├── PayPal (Client ID, Secret, Sandbox/Live)
    │   ├── Vorkasse (IBAN, BIC, Bankname, Kontoinhaber)
    │   └── Abholung (Anweisungen/Adresse)
    ├── Versand
    │   ├── Versandzonen (Länder-Gruppen)
    │   └── Versandmethoden (Preis, Gewicht, Lieferzeit, "Ab X€ kostenlos")
    ├── Steuern
    │   ├── Steuerklassen (Standard 19%, Ermäßigt 7%, Steuerfrei)
    │   └── Länderspezifische Sätze (AT: 20%, CH: 7.7%, etc.)
    └── E-Mail-Templates
        └── Bestellbestätigung, Versandinfo, etc. (editierbar mit Platzhaltern)
```

---

## Payment-Anbindung (Admin-Hilfetext)

### Stripe Setup (empfohlen)
**Im Admin unter Shop → Einstellungen → Zahlungsarten → Stripe:**

> **So richtest du Stripe ein:**
> 1. Erstelle ein Konto auf [stripe.com](https://stripe.com)
> 2. Gehe zu **Developers → API Keys**
> 3. Kopiere den **Publishable Key** (beginnt mit `pk_live_...`)
> 4. Kopiere den **Secret Key** (beginnt mit `sk_live_...`)
> 5. Unter **Developers → Webhooks** → "Add Endpoint":
>    - URL: `https://deine-domain.de/api/webhooks/stripe`
>    - Events: `checkout.session.completed`, `payment_intent.succeeded`, `charge.refunded`
>    - Kopiere den **Webhook Signing Secret** (beginnt mit `whsec_...`)
>
> ⚠️ **Teste zuerst im Testmodus** (Keys mit `pk_test_` / `sk_test_`)!
>
> 💡 **Tipp:** Das Flamingo Media Team hilft gerne bei der Einrichtung.

### PayPal Setup
**Im Admin unter Shop → Einstellungen → Zahlungsarten → PayPal:**

> **So richtest du PayPal ein:**
> 1. Gehe zu [developer.paypal.com](https://developer.paypal.com)
> 2. Erstelle eine App unter **My Apps & Credentials**
> 3. Wähle **Live** (nicht Sandbox) für Echtbetrieb
> 4. Kopiere **Client ID** und **Secret**
>
> ⚠️ Du brauchst ein PayPal Business-Konto.

### Vorkasse / Überweisung
**Im Admin unter Shop → Einstellungen → Zahlungsarten → Vorkasse:**

> Käufer erhalten eine E-Mail mit deinen Bankdaten.
> Die Bestellung bleibt auf "Zahlung ausstehend" bis du den Zahlungseingang manuell bestätigst.
>
> Pflichtfelder: IBAN, BIC, Bankname, Kontoinhaber

### Abholung / Barzahlung
**Im Admin unter Shop → Einstellungen → Zahlungsarten → Abholung:**

> Käufer bezahlen bei Abholung. Gib eine Adresse und ggf. Öffnungszeiten an.
> Bestellungen gehen sofort auf Status "In Bearbeitung".

### Info-Banner (oben auf der Einstellungsseite)
> 🦩 **Braucht ihr Hilfe bei der Shop-Einrichtung?**
> Unser Team übernimmt die komplette Konfiguration eures Shops – Zahlungsanbieter, Versand, Steuern, Produkte.
> [Shop-Einrichtung anfragen →](mailto:hello@flamingomedia.online?subject=Shop-Einrichtung%20Anfrage)

---

## Zahlungsmethoden-Übersicht

| Methode | Automatische Bestätigung | Sofort-Versand möglich |
|---|---|---|
| Stripe (Karte) | ✅ Webhook | ✅ |
| PayPal | ✅ Webhook | ✅ |
| Vorkasse | ❌ Manuell bestätigen | ❌ Erst nach Zahlungseingang |
| Abholung | ✅ Sofort "In Bearbeitung" | ❌ Kein Versand |

---

## E-Mail-Benachrichtigungen

### An Käufer:
1. **Bestellbestätigung** — sofort nach Bestellung (Zusammenfassung, Zahlungsinfo bei Vorkasse)
2. **Zahlungseingang** — nach erfolgreicher Zahlung (Stripe/PayPal automatisch, Vorkasse manuell)
3. **Versandbestätigung** — mit Tracking-Nummer und Link
4. **Rechnung** — PDF im Anhang nach Zahlung
5. **Storno-Bestätigung** — bei Storno
6. **Erstattung** — bei Refund
7. **Digital-Download** — Download-Link nach Zahlung (bei digitalen Produkten)

### An Verkäufer:
1. **Neue Bestellung** — sofort bei Eingang
2. **Low-Stock Alert** — wenn Bestand unter Schwellwert fällt

### Template-Platzhalter:
```
{{shop_name}}, {{order_number}}, {{customer_name}}, {{customer_email}},
{{items_table}}, {{subtotal}}, {{shipping}}, {{tax}}, {{total}},
{{shipping_address}}, {{payment_method}}, {{tracking_number}},
{{tracking_url}}, {{download_url}}, {{bank_details}}, {{coupon_code}}
```

---

## Promotions & Rabatte (Typen)

| Typ | Beispiel | Logik |
|---|---|---|
| `free_shipping_above` | Ab 50€ kostenloser Versand | Versandkosten = 0 wenn subtotal >= X |
| `buy_x_get_discount` | 3 kaufen → 10% auf alle | Rabatt wenn quantity >= X |
| `quantity_discount` | Ab 5 Stück -15%, ab 10 Stück -25% | Staffelpreise |
| `bundle_discount` | Produkt A + B zusammen = -20% | Wenn beide im Warenkorb |
| `first_order_discount` | Erstbesteller -10% | Customer hat noch keine Order |
| `spend_x_save_y` | Ab 100€ = 10€ Rabatt | Fester Abzug ab Mindestbetrag |

---

## Frontend-Sektionen (neue Template-Components)

| Section Type | Beschreibung |
|---|---|
| `productGrid` | Produkt-Übersicht mit Kategorie-Filter, Sortierung (Preis, Name, Neu) |
| `productDetail` | Einzelprodukt: Galerie, Varianten-Selector, Preis, Warenkorb-Button, Beschreibung |
| `featuredProducts` | Highlight ausgewählter Produkte (z.B. Startseite) |
| `cartDrawer` | Slide-in Warenkorb (global, immer verfügbar) |
| `cartPage` | Volle Warenkorb-Seite (Alternative zu Drawer) |
| `checkoutPage` | Multi-Step: Kontakt → Adresse → Versand → Zahlung → Bestätigung |
| `orderConfirmation` | Danke-Seite mit Zusammenfassung + Download-Link (digital) |

---

## Warenkorb & Checkout Flow

```
1. Produkt auswählen (Variante, Menge)
   ↓
2. Warenkorb (Übersicht, Menge ändern, Coupon eingeben)
   ↓
3. Checkout Step 1: Kontaktdaten (E-Mail, Name, Telefon?)
   ↓
4. Checkout Step 2: Versandadresse (entfällt bei Digital/Abholung)
   ↓
5. Checkout Step 3: Versandmethode wählen (mit Preisen + Lieferzeit)
   ↓
6. Checkout Step 4: Zahlungsmethode
   - Stripe → Redirect zu Stripe Checkout
   - PayPal → PayPal Buttons
   - Vorkasse → Bankdaten anzeigen
   - Abholung → Abholadresse anzeigen
   ↓
7. Bestätigung (Order erstellt, E-Mails ausgelöst)
```

---

## Warenwirtschaft

- Bestandsverwaltung pro Produkt UND pro Variante
- Automatische Reduktion bei Bestellung (Status ≠ cancelled/refunded)
- Automatische Erhöhung bei Storno/Erstattung
- Low-Stock E-Mail wenn Bestand ≤ Schwellwert (konfigurierbar, Default: 5)
- "Ausverkauft" Badge im Frontend wenn stock = 0
- Digitale Produkte: kein Bestand nötig, Download-Link nach Zahlung
- Varianten mit eigenem Bestand (z.B. "Rot/M" = 5, "Blau/L" = 12)

---

## Rechnungserstellung

- Auto-Generierung bei Status-Wechsel zu "paid"
- PDF via `@react-pdf/renderer` (serverseitig)
- Fortlaufende Nummer: `{invoice_prefix}-{YYYY}-{0001}`
- Pflichtangaben (DE/AT):
  - Firmenname, Adresse, Steuernummer/USt-IdNr
  - Rechnungsnummer, Rechnungsdatum, Lieferdatum
  - Positionen mit Einzelpreis, Menge, Gesamtpreis
  - Netto, USt pro Satz, Brutto
- Automatischer Versand per Mail an Käufer
- Download im Admin-Bereich

---

## Upsell / Paywall im Admin

Für Kunden die das Shop-Addon NICHT aktiv haben:
- Menüpunkt "Shop" ist sichtbar in der Navigation
- Klick zeigt eine Paywall-Seite:

```
🦩 Shop-Modul

Erweitere deine Website um einen vollwertigen Online-Shop:
✓ Unbegrenzte Produkte & Kategorien
✓ Varianten (Größe, Farbe, etc.)
✓ Warenkorb & Checkout
✓ Stripe, PayPal, Vorkasse, Abholung
✓ Bestellverwaltung & Storno
✓ Automatische Rechnungen (PDF)
✓ Versandzonen & Versandmethoden
✓ Rabattcodes & Promotions
✓ E-Mail-Benachrichtigungen
✓ Warenwirtschaft mit Bestandsverwaltung
✓ Digitale Produkte (Downloads)
✓ Kundenverwaltung

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Shop-Addon: 999€ (einmalig)
Shop + Einrichtung: 1.450€ (einmalig)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Jetzt anfragen →]  ← sendet Mail an hello@flamingomedia.online
```

---

## CRM Integration

- `tenant_addons` Tabelle trackt welche Addons aktiv sind
- CRM Tenants-Detail zeigt: "Shop: ✅ Aktiv" oder "Shop: ❌ Nicht aktiv [Aktivieren]"
- Toggle im CRM um Shop für Kunden zu aktivieren/deaktivieren
- Bei Aktivierung: Default shop_settings + Default email_templates werden insertet

---

## Marketing-Seite (flamingomedia.online)

Neues Paket/Section auf der Website:

### Shop-Paket (999€ einmalig)
- Vollwertiger Online-Shop für deine Website
- Produkte, Kategorien, Varianten
- Warenkorb & moderner Checkout
- Stripe & PayPal Integration
- Bestellverwaltung im CMS
- Automatische Rechnungserstellung
- Versand & Steuern konfigurierbar
- Rabatte & Promotions
- E-Mail-Benachrichtigungen
- *Im monatlichen Hosting-Paket enthalten*

### Shop + Einrichtung (1.450€ einmalig)
- Alles aus dem Shop-Paket PLUS:
- Komplette Einrichtung durch das Flamingo Media Team
- Produkte & Kategorien werden angelegt
- Zahlungsanbieter werden konfiguriert
- Versandzonen & Steuern werden eingerichtet
- E-Mail-Templates werden angepasst
- Testbestellung & Qualitätssicherung
- 30 Min. Einführungs-Call

---

## Implementierungs-Reihenfolge

### Phase 1: Grundstruktur & Paywall
- DB Schema + Migrationen (alle Tabellen)
- `tenant_addons` Tabelle
- Admin-Navigation mit Addon-Check (Paywall-UI)
- CRM: Addon-Toggle pro Tenant
- Shop-Settings Seite im Admin

### Phase 2: Produkte & Kategorien
- Kategorie-CRUD (Baumstruktur)
- Produkt-CRUD (Titel, Beschreibung, Preis, Bilder, Status)
- Varianten-System (Optionen definieren → Varianten-Matrix)
- Bestandsverwaltung
- `productGrid` + `productDetail` Frontend-Sections

### Phase 3: Versand & Steuern
- Versandzonen (Länder-Gruppen)
- Versandmethoden (Preis, Gewicht, "kostenlos ab X€")
- Steuerklassen + länderspezifische Sätze
- Digitale Produkte (kein Versand)

### Phase 4: Warenkorb & Checkout
- Cart State (zustand + localStorage)
- Coupon-Validierung
- Promotion-Engine
- Multi-Step Checkout UI
- Stripe Checkout Integration + Webhooks
- PayPal Integration + Webhooks
- Vorkasse + Abholung

### Phase 5: Bestellungen & Fulfillment
- Order Management Admin UI
- Status-Workflow + Historie
- Tracking-Nummer eintragen → Mail
- Storno + Erstattung (Stripe Refund API)
- Kunden-Übersicht

### Phase 6: Rechnungen & E-Mails
- PDF-Rechnungsgenerierung
- E-Mail-Templates CRUD im Admin
- Trigger-basierter Versand (order_confirmed, payment_received, shipped, etc.)
- Low-Stock Alert

### Phase 7: Marketing & Launch
- Marketing-Seite Update (neues Paket)
- CRM Addon-Management
- Dokumentation / Hilfe-Texte im Admin

---

## Technische Entscheidungen

| Thema | Empfehlung |
|---|---|
| Cart State | `zustand` (localStorage persist, SSR-safe) |
| Payment | Stripe Checkout Sessions (hosted) — einfachster PCI-compliant Start |
| PayPal | PayPal JS SDK (Buttons) |
| PDF | `@react-pdf/renderer` (serverseitig, React-basiert) |
| E-Mail | Bestehender Nodemailer/SMTP Stack |
| Bilder | Bestehender Upload-Endpoint |
| Webhooks | Next.js Route Handler `/api/webhooks/stripe`, `/api/webhooks/paypal` |
| Encryption | Stripe/PayPal Secrets mit AES-256 verschlüsselt in DB |
| Validierung | `zod` für alle API-Inputs |

---

## Wichtige E-Commerce Best Practices (nicht vergessen)

- **DSGVO**: Bestelldaten-Löschung nach X Jahren, Cookie-Consent für Tracking
- **Widerrufsrecht**: 14-Tage Widerruf (Link in Bestellbestätigung)
- **AGB**: Checkbox im Checkout (Pflicht)
- **Preisauszeichnung**: Immer Bruttopreise für B2C, MwSt-Hinweis
- **Lieferzeiten**: Pflichtangabe im Checkout
- **Grundpreis**: Bei Gewichts-/Mengenware (z.B. €/kg) — optional für Phase 2+
- **Doppel-Opt-In**: Für Newsletter (separat vom Kauf)
- **Bestellzusammenfassung**: Letzte Seite vor "Kaufen" muss ALLE Kosten zeigen
- **Button-Text**: Muss "Zahlungspflichtig bestellen" oder ähnlich sein (gesetzlich)

