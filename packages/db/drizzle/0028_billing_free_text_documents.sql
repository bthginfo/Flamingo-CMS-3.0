CREATE TABLE "billing_free_text_documents" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
  "customer_id" uuid REFERENCES "customers"("id") ON DELETE RESTRICT,
  "status" varchar(20) DEFAULT 'draft' NOT NULL,
  "recipient_mode" varchar(20) DEFAULT 'customer' NOT NULL,
  "title" varchar(255) DEFAULT 'Neues Schreiben' NOT NULL,
  "subject" varchar(500) DEFAULT '' NOT NULL,
  "issue_date" timestamptz DEFAULT now() NOT NULL,
  "recipient_draft" jsonb,
  "content" jsonb DEFAULT '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb NOT NULL,
  "seller_snapshot" jsonb,
  "recipient_snapshot" jsonb,
  "finalization_token" uuid,
  "pdf_base64" text,
  "pdf_blob_url" text,
  "pdf_sha256" varchar(64),
  "document_sha256" varchar(64),
  "page_count" integer,
  "finalized_at" timestamptz,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "billing_free_text_documents_status_check" CHECK ("status" IN ('draft', 'finalizing', 'finalized')),
  CONSTRAINT "billing_free_text_documents_recipient_mode_check" CHECK ("recipient_mode" IN ('customer', 'custom')),
  CONSTRAINT "billing_free_text_documents_finalization_claim_check" CHECK (("status" = 'draft' AND "finalization_token" IS NULL) OR ("status" IN ('finalizing', 'finalized') AND "finalization_token" IS NOT NULL)),
  CONSTRAINT "billing_free_text_documents_finalized_artifact_check" CHECK ("status" <> 'finalized' OR ("seller_snapshot" IS NOT NULL AND "recipient_snapshot" IS NOT NULL AND "pdf_sha256" IS NOT NULL AND "document_sha256" IS NOT NULL AND "finalized_at" IS NOT NULL AND "page_count" > 0 AND ("pdf_base64" IS NOT NULL OR "pdf_blob_url" IS NOT NULL)))
);
--> statement-breakpoint
CREATE INDEX "billing_free_text_documents_tenant_status_idx" ON "billing_free_text_documents" ("tenant_id", "status", "updated_at");
--> statement-breakpoint
CREATE INDEX "billing_free_text_documents_customer_idx" ON "billing_free_text_documents" ("tenant_id", "customer_id");
--> statement-breakpoint
CREATE OR REPLACE FUNCTION prevent_finalized_free_text_document_mutation() RETURNS trigger AS $$
BEGIN
  -- Keep finalized artifacts immutable during ordinary writes. During tenant
  -- deprovisioning the parent row is already absent, so its FK cascade remains
  -- able to remove all tenant data as required by GDPR deletion workflows.
  IF OLD.status = 'finalized' AND NOT (
    TG_OP = 'DELETE' AND (
      current_setting('flamingo.tenant_maintenance_tenant', true) = OLD.tenant_id::text
      OR NOT EXISTS (SELECT 1 FROM tenants WHERE id = OLD.tenant_id)
    )
  ) THEN
    RAISE EXCEPTION 'finalized free-text documents are immutable';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER billing_free_text_documents_immutable_update
BEFORE UPDATE ON "billing_free_text_documents"
FOR EACH ROW EXECUTE FUNCTION prevent_finalized_free_text_document_mutation();
--> statement-breakpoint
CREATE TRIGGER billing_free_text_documents_immutable_delete
BEFORE DELETE ON "billing_free_text_documents"
FOR EACH ROW EXECUTE FUNCTION prevent_finalized_free_text_document_mutation();
