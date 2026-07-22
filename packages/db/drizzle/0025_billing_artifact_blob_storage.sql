ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "pdf_blob_url" text;
--> statement-breakpoint
ALTER TABLE "billing_documents" ADD COLUMN IF NOT EXISTS "xml_blob_url" text;
