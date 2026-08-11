-- Freitext-Schreiben are ordinary working documents, not legally immutable
-- invoices. Their generated PDFs can be replaced and the document can be
-- edited or deleted at any time.
DROP TRIGGER IF EXISTS "billing_free_text_documents_immutable_update" ON "billing_free_text_documents";
--> statement-breakpoint
DROP TRIGGER IF EXISTS "billing_free_text_documents_immutable_delete" ON "billing_free_text_documents";
--> statement-breakpoint
DROP FUNCTION IF EXISTS prevent_finalized_free_text_document_mutation();