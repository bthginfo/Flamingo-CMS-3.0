ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "customer_number" varchar(80);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "customer_type" varchar(20) DEFAULT 'company' NOT NULL;
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "company_name" varchar(255);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "salutation" varchar(40);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "first_name" varchar(120);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "last_name" varchar(120);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "mobile" varchar(50);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "website" varchar(500);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "tax_number" varchar(100);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "vat_id" varchar(100);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "e_invoice_routing_id" varchar(100);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "buyer_reference" varchar(100);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "language" varchar(10) DEFAULT 'de' NOT NULL;
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "payment_term_days" integer DEFAULT 14 NOT NULL;
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "notes" text;
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "custom_fields" jsonb DEFAULT '{}'::jsonb NOT NULL;
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "archived_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "customers_tenant_number_idx" ON "customers" ("tenant_id", "customer_number");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customers_tenant_archived_idx" ON "customers" ("tenant_id", "archived_at");
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "customers" ADD CONSTRAINT "customers_type_check" CHECK ("customer_type" IN ('company', 'person'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "customer_custom_field_definitions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "field_key" varchar(80) NOT NULL,
  "label" varchar(120) NOT NULL,
  "field_type" varchar(20) DEFAULT 'text' NOT NULL,
  "options" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "required" boolean DEFAULT false NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "customer_custom_fields_type_check" CHECK ("field_type" IN ('text', 'textarea', 'number', 'date', 'email', 'phone', 'boolean', 'select'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "customer_custom_fields_tenant_key_idx" ON "customer_custom_field_definitions" ("tenant_id", "field_key");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_custom_fields_tenant_sort_idx" ON "customer_custom_field_definitions" ("tenant_id", "sort_order");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "billing_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "company_name" varchar(255), "legal_form" varchar(120), "street" varchar(255),
  "postal_code" varchar(30), "city" varchar(120), "country_code" varchar(2) DEFAULT 'DE' NOT NULL,
  "email" varchar(255), "phone" varchar(80), "website" varchar(500),
  "tax_number" varchar(100), "vat_id" varchar(100), "register_court" varchar(160),
  "register_number" varchar(100), "managing_director" varchar(255), "logo_url" varchar(1000),
  "bank_name" varchar(160), "account_holder" varchar(255), "iban" varchar(50), "bic" varchar(30),
  "invoice_prefix" varchar(20) DEFAULT 'RE' NOT NULL,
  "cancellation_prefix" varchar(20) DEFAULT 'ST' NOT NULL,
  "invoice_number_format" varchar(120) DEFAULT '{PREFIX}-{YYYY}-{NNNN}' NOT NULL,
  "cancellation_number_format" varchar(120) DEFAULT '{PREFIX}-{YYYY}-{NNNN}' NOT NULL,
  "sequence_reset" varchar(20) DEFAULT 'year' NOT NULL,
  "sequence_period" varchar(10),
  "next_invoice_number" integer DEFAULT 1 NOT NULL,
  "next_cancellation_number" integer DEFAULT 1 NOT NULL,
  "customer_prefix" varchar(20) DEFAULT 'KD' NOT NULL,
  "next_customer_number" integer DEFAULT 1 NOT NULL,
  "currency" varchar(3) DEFAULT 'EUR' NOT NULL,
  "default_payment_term_days" integer DEFAULT 14 NOT NULL,
  "default_intro_text" text, "default_closing_text" text, "default_footer" text,
  "small_business" boolean DEFAULT false NOT NULL,
  "small_business_notice" text DEFAULT 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.' NOT NULL,
  "sender_name" varchar(255),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "billing_settings_payment_term_check" CHECK ("default_payment_term_days" BETWEEN 0 AND 365),
  CONSTRAINT "billing_settings_counters_check" CHECK ("next_invoice_number" > 0 AND "next_cancellation_number" > 0 AND "next_customer_number" > 0),
  CONSTRAINT "billing_settings_sequence_reset_check" CHECK ("sequence_reset" IN ('never', 'year', 'month'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "billing_settings_tenant_idx" ON "billing_settings" ("tenant_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "billing_services" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "service_code" varchar(80), "name" varchar(255) NOT NULL, "description" text,
  "unit_code" varchar(10) DEFAULT 'C62' NOT NULL, "unit_label" varchar(40) DEFAULT 'Stück' NOT NULL,
  "unit_price_net_cents" integer NOT NULL, "tax_rate_basis_points" integer DEFAULT 1900 NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "billing_services_price_check" CHECK ("unit_price_net_cents" >= 0),
  CONSTRAINT "billing_services_tax_check" CHECK ("tax_rate_basis_points" BETWEEN 0 AND 10000)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "billing_services_tenant_code_idx" ON "billing_services" ("tenant_id", "service_code");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_services_tenant_active_idx" ON "billing_services" ("tenant_id", "active");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "billing_documents" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "customer_id" uuid REFERENCES "customers"("id") ON DELETE restrict,
  "original_document_id" uuid,
  "document_number" varchar(80),
  "document_type" varchar(20) DEFAULT 'invoice' NOT NULL,
  "status" varchar(20) DEFAULT 'draft' NOT NULL,
  "currency" varchar(3) DEFAULT 'EUR' NOT NULL,
  "issue_date" timestamp with time zone, "service_date_from" timestamp with time zone,
  "service_date_to" timestamp with time zone, "due_date" timestamp with time zone,
  "buyer_reference" varchar(100), "purchase_order_reference" varchar(100),
  "intro_text" text, "closing_text" text, "notes" text,
  "seller_snapshot" jsonb, "customer_snapshot" jsonb, "payment_snapshot" jsonb,
  "tax_breakdown" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "subtotal_net_cents" integer DEFAULT 0 NOT NULL, "tax_cents" integer DEFAULT 0 NOT NULL,
  "total_gross_cents" integer DEFAULT 0 NOT NULL,
  "pdf_base64" text, "xml_content" text,
  "pdf_sha256" varchar(64), "xml_sha256" varchar(64), "document_sha256" varchar(64),
  "finalized_at" timestamp with time zone, "sent_at" timestamp with time zone,
  "paid_at" timestamp with time zone, "cancelled_at" timestamp with time zone,
  "retention_until" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "billing_documents_original_fk" FOREIGN KEY ("original_document_id") REFERENCES "billing_documents"("id") ON DELETE restrict,
  CONSTRAINT "billing_documents_type_check" CHECK ("document_type" IN ('invoice', 'cancellation')),
  CONSTRAINT "billing_documents_status_check" CHECK ("status" IN ('draft', 'finalized', 'sent', 'paid', 'cancelled')),
  CONSTRAINT "billing_documents_amount_check" CHECK ("subtotal_net_cents" >= 0 AND "tax_cents" >= 0 AND "total_gross_cents" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "billing_documents_tenant_number_idx" ON "billing_documents" ("tenant_id", "document_number");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_documents_tenant_status_idx" ON "billing_documents" ("tenant_id", "status", "created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_documents_customer_idx" ON "billing_documents" ("tenant_id", "customer_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_documents_original_idx" ON "billing_documents" ("original_document_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "billing_document_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "document_id" uuid NOT NULL REFERENCES "billing_documents"("id") ON DELETE cascade,
  "service_id" uuid REFERENCES "billing_services"("id") ON DELETE set null,
  "position" integer DEFAULT 1 NOT NULL, "name" varchar(255) NOT NULL, "description" text,
  "quantity" numeric(12,3) DEFAULT '1' NOT NULL, "unit_code" varchar(10) DEFAULT 'C62' NOT NULL,
  "unit_label" varchar(40) DEFAULT 'Stück' NOT NULL, "unit_price_net_cents" integer NOT NULL,
  "discount_basis_points" integer DEFAULT 0 NOT NULL, "tax_rate_basis_points" integer DEFAULT 1900 NOT NULL,
  "line_net_cents" integer NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "billing_document_items_quantity_check" CHECK ("quantity" > 0),
  CONSTRAINT "billing_document_items_price_check" CHECK ("unit_price_net_cents" >= 0 AND "line_net_cents" >= 0),
  CONSTRAINT "billing_document_items_rates_check" CHECK ("discount_basis_points" BETWEEN 0 AND 10000 AND "tax_rate_basis_points" BETWEEN 0 AND 10000)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_document_items_document_idx" ON "billing_document_items" ("document_id", "position");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "billing_document_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "document_id" uuid NOT NULL REFERENCES "billing_documents"("id") ON DELETE restrict,
  "event_type" varchar(40) NOT NULL, "actor" varchar(120) DEFAULT 'admin' NOT NULL,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL, "previous_hash" varchar(64), "event_hash" varchar(64) NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_document_events_document_idx" ON "billing_document_events" ("document_id", "created_at");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "billing_document_events_hash_idx" ON "billing_document_events" ("tenant_id", "event_hash");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "billing_delivery_attempts" (
  "idempotency_key" uuid PRIMARY KEY NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "document_id" uuid NOT NULL REFERENCES "billing_documents"("id") ON DELETE restrict,
  "recipient" varchar(320) NOT NULL, "request_hash" varchar(64) NOT NULL,
  "status" varchar(20) DEFAULT 'sending' NOT NULL, "attempt_count" integer DEFAULT 1 NOT NULL,
  "message_id" varchar(500), "last_error_code" varchar(100),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "sent_at" timestamp with time zone,
  CONSTRAINT "billing_delivery_status_check" CHECK ("status" IN ('sending', 'sent', 'failed', 'uncertain'))
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_delivery_document_idx" ON "billing_delivery_attempts" ("document_id", "created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_delivery_status_idx" ON "billing_delivery_attempts" ("tenant_id", "status", "created_at");
--> statement-breakpoint

CREATE OR REPLACE FUNCTION flamingo_guard_billing_document() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' AND EXISTS (SELECT 1 FROM tenants WHERE id = OLD.tenant_id AND deployment_mode = 'standalone') THEN
    RETURN OLD;
  END IF;
  IF TG_OP = 'DELETE' AND OLD.status <> 'draft' THEN
    RAISE EXCEPTION 'Finalized billing documents cannot be deleted';
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status <> 'draft' AND NEW.status = 'draft' THEN
    RAISE EXCEPTION 'Finalized billing documents cannot return to draft';
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status <> 'draft' AND (
    NEW.tenant_id IS DISTINCT FROM OLD.tenant_id OR NEW.customer_id IS DISTINCT FROM OLD.customer_id OR
    NEW.original_document_id IS DISTINCT FROM OLD.original_document_id OR NEW.document_number IS DISTINCT FROM OLD.document_number OR
    NEW.document_type IS DISTINCT FROM OLD.document_type OR NEW.currency IS DISTINCT FROM OLD.currency OR
    NEW.issue_date IS DISTINCT FROM OLD.issue_date OR NEW.service_date_from IS DISTINCT FROM OLD.service_date_from OR
    NEW.service_date_to IS DISTINCT FROM OLD.service_date_to OR NEW.due_date IS DISTINCT FROM OLD.due_date OR
    NEW.buyer_reference IS DISTINCT FROM OLD.buyer_reference OR NEW.purchase_order_reference IS DISTINCT FROM OLD.purchase_order_reference OR
    NEW.intro_text IS DISTINCT FROM OLD.intro_text OR NEW.closing_text IS DISTINCT FROM OLD.closing_text OR NEW.notes IS DISTINCT FROM OLD.notes OR
    NEW.seller_snapshot IS DISTINCT FROM OLD.seller_snapshot OR NEW.customer_snapshot IS DISTINCT FROM OLD.customer_snapshot OR
    NEW.payment_snapshot IS DISTINCT FROM OLD.payment_snapshot OR NEW.tax_breakdown IS DISTINCT FROM OLD.tax_breakdown OR
    NEW.subtotal_net_cents IS DISTINCT FROM OLD.subtotal_net_cents OR NEW.tax_cents IS DISTINCT FROM OLD.tax_cents OR
    NEW.total_gross_cents IS DISTINCT FROM OLD.total_gross_cents OR NEW.pdf_base64 IS DISTINCT FROM OLD.pdf_base64 OR
    NEW.xml_content IS DISTINCT FROM OLD.xml_content OR NEW.pdf_sha256 IS DISTINCT FROM OLD.pdf_sha256 OR
    NEW.xml_sha256 IS DISTINCT FROM OLD.xml_sha256 OR NEW.document_sha256 IS DISTINCT FROM OLD.document_sha256 OR
    NEW.finalized_at IS DISTINCT FROM OLD.finalized_at OR NEW.retention_until IS DISTINCT FROM OLD.retention_until OR
    NEW.created_at IS DISTINCT FROM OLD.created_at
  ) THEN
    RAISE EXCEPTION 'Finalized billing document content is immutable';
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
DROP TRIGGER IF EXISTS billing_documents_immutable ON "billing_documents";
--> statement-breakpoint
CREATE TRIGGER billing_documents_immutable BEFORE UPDATE OR DELETE ON "billing_documents"
FOR EACH ROW EXECUTE FUNCTION flamingo_guard_billing_document();
--> statement-breakpoint

CREATE OR REPLACE FUNCTION flamingo_guard_billing_item() RETURNS trigger AS $$
DECLARE current_status varchar(20);
BEGIN
  IF TG_OP = 'DELETE' AND EXISTS (SELECT 1 FROM tenants WHERE id = OLD.tenant_id AND deployment_mode = 'standalone') THEN
    RETURN OLD;
  END IF;
  SELECT status INTO current_status FROM billing_documents WHERE id = COALESCE(NEW.document_id, OLD.document_id);
  IF current_status IS DISTINCT FROM 'draft' THEN
    RAISE EXCEPTION 'Items of finalized billing documents are immutable';
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
DROP TRIGGER IF EXISTS billing_document_items_immutable ON "billing_document_items";
--> statement-breakpoint
CREATE TRIGGER billing_document_items_immutable BEFORE INSERT OR UPDATE OR DELETE ON "billing_document_items"
FOR EACH ROW EXECUTE FUNCTION flamingo_guard_billing_item();
--> statement-breakpoint

CREATE OR REPLACE FUNCTION flamingo_guard_billing_event() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' AND EXISTS (SELECT 1 FROM tenants WHERE id = OLD.tenant_id AND deployment_mode = 'standalone') THEN
    RETURN OLD;
  END IF;
  RAISE EXCEPTION 'Billing audit events are append-only';
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
DROP TRIGGER IF EXISTS billing_document_events_append_only ON "billing_document_events";
--> statement-breakpoint
CREATE TRIGGER billing_document_events_append_only BEFORE UPDATE OR DELETE ON "billing_document_events"
FOR EACH ROW EXECUTE FUNCTION flamingo_guard_billing_event();
