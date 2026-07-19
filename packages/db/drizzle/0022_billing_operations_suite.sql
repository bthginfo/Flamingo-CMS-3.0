ALTER TABLE "billing_settings" ADD COLUMN IF NOT EXISTS "quote_prefix" varchar(20) DEFAULT 'AN' NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_settings" ADD COLUMN IF NOT EXISTS "credit_prefix" varchar(20) DEFAULT 'GS' NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_settings" ADD COLUMN IF NOT EXISTS "quote_number_format" varchar(120) DEFAULT '{PREFIX}-{YYYY}-{NNNN}' NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_settings" ADD COLUMN IF NOT EXISTS "credit_number_format" varchar(120) DEFAULT '{PREFIX}-{YYYY}-{NNNN}' NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_settings" ADD COLUMN IF NOT EXISTS "next_quote_number" integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_settings" ADD COLUMN IF NOT EXISTS "next_credit_number" integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_settings" ADD COLUMN IF NOT EXISTS "default_cash_discount_basis_points" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_settings" ADD COLUMN IF NOT EXISTS "default_cash_discount_days" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_settings" ADD COLUMN IF NOT EXISTS "default_reminder_days" integer DEFAULT 7 NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_settings" ADD COLUMN IF NOT EXISTS "default_reminder_fee_cents" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_settings" ADD COLUMN IF NOT EXISTS "payment_link_base_url" varchar(1000);
--> statement-breakpoint
ALTER TABLE "billing_settings" DROP CONSTRAINT IF EXISTS "billing_settings_counters_check";
--> statement-breakpoint
ALTER TABLE "billing_settings" ADD CONSTRAINT "billing_settings_counters_check" CHECK ("next_invoice_number" > 0 AND "next_cancellation_number" > 0 AND "next_quote_number" > 0 AND "next_credit_number" > 0 AND "next_customer_number" > 0);
--> statement-breakpoint
ALTER TABLE "billing_settings" ADD CONSTRAINT "billing_settings_discount_check" CHECK ("default_cash_discount_basis_points" BETWEEN 0 AND 10000 AND "default_cash_discount_days" BETWEEN 0 AND 365);
--> statement-breakpoint
ALTER TABLE "billing_settings" ADD CONSTRAINT "billing_settings_reminder_check" CHECK ("default_reminder_days" BETWEEN 1 AND 365 AND "default_reminder_fee_cents" >= 0);
--> statement-breakpoint

ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "tax_mode" varchar(30) DEFAULT 'standard' NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "tax_exemption_reason" text;
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "discount_type" varchar(10) DEFAULT 'percent' NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "discount_value" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "discount_cents" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "cash_discount_basis_points" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "cash_discount_days" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "payment_link_url" varchar(1000);
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "quote_valid_until" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "recurring_schedule_id" uuid;
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "amount_paid_cents" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "reminder_level" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "last_reminder_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "accepted_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "rejected_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "converted_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "billing_documents" DROP CONSTRAINT IF EXISTS "billing_documents_type_check";
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD CONSTRAINT "billing_documents_type_check" CHECK ("document_type" IN ('invoice', 'cancellation', 'credit_note', 'quote', 'advance_invoice', 'partial_invoice', 'final_invoice'));
--> statement-breakpoint
ALTER TABLE "billing_documents" DROP CONSTRAINT IF EXISTS "billing_documents_status_check";
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD CONSTRAINT "billing_documents_status_check" CHECK ("status" IN ('draft', 'issued', 'finalized', 'sent', 'partially_paid', 'paid', 'cancelled', 'accepted', 'rejected', 'expired', 'converted'));
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD CONSTRAINT "billing_documents_discount_check" CHECK ("discount_type" IN ('percent', 'fixed') AND "discount_value" >= 0 AND "discount_cents" >= 0 AND "cash_discount_basis_points" BETWEEN 0 AND 10000 AND "cash_discount_days" BETWEEN 0 AND 365);
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD CONSTRAINT "billing_documents_tax_mode_check" CHECK ("tax_mode" IN ('standard', 'small_business', 'reverse_charge', 'intra_eu', 'exempt'));
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD CONSTRAINT "billing_documents_payment_check" CHECK ("amount_paid_cents" >= 0 AND "reminder_level" BETWEEN 0 AND 99);
--> statement-breakpoint

ALTER TABLE "billing_document_items" ADD COLUMN IF NOT EXISTS "discount_type" varchar(10) DEFAULT 'percent' NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_document_items" ADD COLUMN IF NOT EXISTS "discount_value" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_document_items" ADD COLUMN IF NOT EXISTS "discount_cents" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
UPDATE "billing_document_items" SET "discount_value" = "discount_basis_points" WHERE "discount_value" = 0 AND "discount_basis_points" > 0;
--> statement-breakpoint
ALTER TABLE "billing_document_items" DROP CONSTRAINT IF EXISTS "billing_document_items_rates_check";
--> statement-breakpoint
ALTER TABLE "billing_document_items" ADD CONSTRAINT "billing_document_items_rates_check" CHECK ("discount_basis_points" BETWEEN 0 AND 10000 AND "discount_type" IN ('percent', 'fixed') AND "discount_value" >= 0 AND "discount_cents" >= 0 AND "tax_rate_basis_points" BETWEEN 0 AND 10000);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "billing_payments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "document_id" uuid NOT NULL REFERENCES "billing_documents"("id") ON DELETE restrict,
  "amount_cents" integer NOT NULL,
  "paid_at" timestamp with time zone NOT NULL,
  "method" varchar(30) DEFAULT 'bank_transfer' NOT NULL,
  "reference" varchar(255), "notes" text,
  "reversed_at" timestamp with time zone, "reversal_reason" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "billing_payments_amount_check" CHECK ("amount_cents" > 0),
  CONSTRAINT "billing_payments_method_check" CHECK ("method" IN ('bank_transfer', 'cash', 'card', 'paypal', 'stripe', 'other'))
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_payments_document_idx" ON "billing_payments" ("tenant_id", "document_id", "paid_at");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "billing_reminders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "document_id" uuid NOT NULL REFERENCES "billing_documents"("id") ON DELETE restrict,
  "level" integer NOT NULL, "fee_cents" integer DEFAULT 0 NOT NULL, "interest_cents" integer DEFAULT 0 NOT NULL,
  "reminder_date" timestamp with time zone NOT NULL, "due_date" timestamp with time zone NOT NULL,
  "status" varchar(20) DEFAULT 'draft' NOT NULL, "recipient" varchar(320), "message" text NOT NULL,
  "sent_at" timestamp with time zone, "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "billing_reminders_level_check" CHECK ("level" BETWEEN 1 AND 99 AND "fee_cents" >= 0 AND "interest_cents" >= 0),
  CONSTRAINT "billing_reminders_status_check" CHECK ("status" IN ('draft', 'sent', 'cancelled'))
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_reminders_document_idx" ON "billing_reminders" ("tenant_id", "document_id", "created_at");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "billing_recurring_schedules" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "customer_id" uuid NOT NULL REFERENCES "customers"("id") ON DELETE restrict,
  "name" varchar(255) NOT NULL, "status" varchar(20) DEFAULT 'active' NOT NULL,
  "interval_unit" varchar(20) DEFAULT 'month' NOT NULL, "interval_count" integer DEFAULT 1 NOT NULL,
  "start_at" timestamp with time zone NOT NULL, "end_at" timestamp with time zone,
  "next_run_at" timestamp with time zone NOT NULL, "last_run_at" timestamp with time zone,
  "delivery_mode" varchar(30) DEFAULT 'draft' NOT NULL, "recipient" varchar(320),
  "template" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "billing_recurring_status_check" CHECK ("status" IN ('active', 'paused', 'completed')),
  CONSTRAINT "billing_recurring_interval_check" CHECK ("interval_unit" IN ('day', 'week', 'month', 'year') AND "interval_count" BETWEEN 1 AND 120),
  CONSTRAINT "billing_recurring_delivery_check" CHECK ("delivery_mode" IN ('draft', 'finalize', 'finalize_send'))
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_recurring_due_idx" ON "billing_recurring_schedules" ("status", "next_run_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_recurring_tenant_idx" ON "billing_recurring_schedules" ("tenant_id", "status", "next_run_at");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "billing_recurring_runs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "schedule_id" uuid NOT NULL REFERENCES "billing_recurring_schedules"("id") ON DELETE restrict,
  "document_id" uuid REFERENCES "billing_documents"("id") ON DELETE restrict,
  "scheduled_for" timestamp with time zone NOT NULL, "status" varchar(20) DEFAULT 'running' NOT NULL,
  "error_code" varchar(100), "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "completed_at" timestamp with time zone,
  CONSTRAINT "billing_recurring_runs_status_check" CHECK ("status" IN ('running', 'completed', 'failed'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "billing_recurring_runs_schedule_time_idx" ON "billing_recurring_runs" ("schedule_id", "scheduled_for");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_recurring_runs_tenant_idx" ON "billing_recurring_runs" ("tenant_id", "created_at");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "billing_portal_links" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "document_id" uuid NOT NULL REFERENCES "billing_documents"("id") ON DELETE restrict,
  "token_hash" varchar(64) NOT NULL, "expires_at" timestamp with time zone NOT NULL,
  "revoked_at" timestamp with time zone, "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "billing_portal_links_token_idx" ON "billing_portal_links" ("token_hash");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_portal_links_document_idx" ON "billing_portal_links" ("tenant_id", "document_id", "created_at");
--> statement-breakpoint

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'billing_documents_recurring_schedule_fk') THEN
    ALTER TABLE "billing_documents" ADD CONSTRAINT "billing_documents_recurring_schedule_fk" FOREIGN KEY ("recurring_schedule_id") REFERENCES "billing_recurring_schedules"("id") ON DELETE restrict;
  END IF;
END $$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION flamingo_guard_billing_document() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' AND EXISTS (SELECT 1 FROM tenants WHERE id = OLD.tenant_id AND deployment_mode = 'standalone') THEN RETURN OLD; END IF;
  IF TG_OP = 'DELETE' AND OLD.status <> 'draft' THEN RAISE EXCEPTION 'Finalized billing documents cannot be deleted'; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status <> 'draft' AND NEW.status = 'draft' THEN RAISE EXCEPTION 'Finalized billing documents cannot return to draft'; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status <> 'draft' AND (
    NEW.tenant_id IS DISTINCT FROM OLD.tenant_id OR NEW.customer_id IS DISTINCT FROM OLD.customer_id OR
    NEW.original_document_id IS DISTINCT FROM OLD.original_document_id OR NEW.document_number IS DISTINCT FROM OLD.document_number OR
    NEW.document_type IS DISTINCT FROM OLD.document_type OR NEW.currency IS DISTINCT FROM OLD.currency OR
    NEW.issue_date IS DISTINCT FROM OLD.issue_date OR NEW.service_date_from IS DISTINCT FROM OLD.service_date_from OR
    NEW.service_date_to IS DISTINCT FROM OLD.service_date_to OR NEW.due_date IS DISTINCT FROM OLD.due_date OR
    NEW.buyer_reference IS DISTINCT FROM OLD.buyer_reference OR NEW.purchase_order_reference IS DISTINCT FROM OLD.purchase_order_reference OR
    NEW.intro_text IS DISTINCT FROM OLD.intro_text OR NEW.closing_text IS DISTINCT FROM OLD.closing_text OR NEW.notes IS DISTINCT FROM OLD.notes OR
    NEW.tax_mode IS DISTINCT FROM OLD.tax_mode OR NEW.tax_exemption_reason IS DISTINCT FROM OLD.tax_exemption_reason OR
    NEW.discount_type IS DISTINCT FROM OLD.discount_type OR NEW.discount_value IS DISTINCT FROM OLD.discount_value OR NEW.discount_cents IS DISTINCT FROM OLD.discount_cents OR
    NEW.cash_discount_basis_points IS DISTINCT FROM OLD.cash_discount_basis_points OR NEW.cash_discount_days IS DISTINCT FROM OLD.cash_discount_days OR
    NEW.payment_link_url IS DISTINCT FROM OLD.payment_link_url OR NEW.quote_valid_until IS DISTINCT FROM OLD.quote_valid_until OR
    NEW.recurring_schedule_id IS DISTINCT FROM OLD.recurring_schedule_id OR
    NEW.seller_snapshot IS DISTINCT FROM OLD.seller_snapshot OR NEW.customer_snapshot IS DISTINCT FROM OLD.customer_snapshot OR
    NEW.payment_snapshot IS DISTINCT FROM OLD.payment_snapshot OR NEW.tax_breakdown IS DISTINCT FROM OLD.tax_breakdown OR
    NEW.subtotal_net_cents IS DISTINCT FROM OLD.subtotal_net_cents OR NEW.tax_cents IS DISTINCT FROM OLD.tax_cents OR
    NEW.total_gross_cents IS DISTINCT FROM OLD.total_gross_cents OR NEW.pdf_base64 IS DISTINCT FROM OLD.pdf_base64 OR
    NEW.xml_content IS DISTINCT FROM OLD.xml_content OR NEW.pdf_sha256 IS DISTINCT FROM OLD.pdf_sha256 OR
    NEW.xml_sha256 IS DISTINCT FROM OLD.xml_sha256 OR NEW.document_sha256 IS DISTINCT FROM OLD.document_sha256 OR
    NEW.finalized_at IS DISTINCT FROM OLD.finalized_at OR NEW.retention_until IS DISTINCT FROM OLD.retention_until OR
    NEW.created_at IS DISTINCT FROM OLD.created_at
  ) THEN RAISE EXCEPTION 'Finalized billing document content is immutable'; END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION flamingo_guard_billing_payment() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'Billing payments cannot be deleted'; END IF;
  IF TG_OP = 'UPDATE' AND (
    OLD.tenant_id IS DISTINCT FROM NEW.tenant_id OR OLD.document_id IS DISTINCT FROM NEW.document_id OR
    OLD.amount_cents IS DISTINCT FROM NEW.amount_cents OR OLD.paid_at IS DISTINCT FROM NEW.paid_at OR
    OLD.method IS DISTINCT FROM NEW.method OR OLD.reference IS DISTINCT FROM NEW.reference OR OLD.notes IS DISTINCT FROM NEW.notes OR
    OLD.created_at IS DISTINCT FROM NEW.created_at OR OLD.reversed_at IS NOT NULL
  ) THEN RAISE EXCEPTION 'Billing payment entries are append-only; only a one-time reversal is allowed'; END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
DROP TRIGGER IF EXISTS billing_payments_append_only ON "billing_payments";
--> statement-breakpoint
CREATE TRIGGER billing_payments_append_only BEFORE UPDATE OR DELETE ON "billing_payments" FOR EACH ROW EXECUTE FUNCTION flamingo_guard_billing_payment();
