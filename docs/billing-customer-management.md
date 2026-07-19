# Rechnungen & Kunden

## Product boundary

`billing` is a paid tenant add-on independent from the shop. Shop customers are reused as one customer master instead of creating a second, conflicting customer editor. Shop order invoices remain legacy order documents; manually created invoices use the dedicated billing document model.

Recommended public price: **499 € setup + 29 €/month**, or **799 € setup including customer/service import + 29 €/month**.

## Document lifecycle

1. A draft can be edited and deleted.
2. Finalization validates seller, customer, tax identity, address, service date and positions.
3. A single atomic SQL statement allocates the sequential document number. Formats support `{PREFIX}`, `{YYYY}`, `{YY}`, `{MM}` and a padded counter such as `{NNNN}`. Counters can run globally or reset for a new year/month number range.
4. PDF and XRechnung UBL are generated once, hashed and stored privately in the tenant database together with immutable seller/customer/payment snapshots.
5. Database triggers prevent editing or deleting finalized document content and position rows. Audit events are append-only and hash chained.
6. Corrections create a linked cancellation/credit document. The original is never overwritten.
7. SMTP delivery uses the hardened tenant/platform SMTP transport and attaches both the PDF and XRechnung. Delivery attempts are durable and idempotent.

## Retention and legal operations

- The module stores `retention_until` eight years after issue and is technically designed for a traceable, immutable document archive.
- Do not market the software itself as “GoBD certified”. GoBD compliance also depends on roles, operating procedures, backups, exports, access controls and the customer’s documented processes.
- XRechnung uses the `XRECHNUNG-UBL` profile based on EN 16931. The generator validates the structural schema; business rules are additionally guarded by Flamingo readiness checks. Format dependencies must be updated and golden invoices revalidated when KoSIT publishes a new version.
- Company-specific tax treatment, exemptions and invoice content still require the customer’s tax adviser.

Primary references:

- German VAT invoice requirements: https://www.gesetze-im-internet.de/ustg_1980/__14.html
- Eight-year retention: https://www.gesetze-im-internet.de/ustg_1980/__14b.html
- BMF electronic-invoice FAQ: https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html
- Official GoBD handbook: https://amtliche-handbuecher.bundesfinanzministerium.de/ao/2025/Anhaenge/BMF-Schreiben-und-gleichlautende-Laendererlasse/Anhang-33/anhang-33.html
- XRechnung coordination: https://xeinkauf.de/xrechnung/
