CREATE TYPE "public"."actor_type" AS ENUM('admin', 'system', 'api');
CREATE TYPE "public"."booking_actor" AS ENUM('customer', 'admin', 'system');
CREATE TYPE "public"."booking_email_trigger" AS ENUM('booking_requested_customer', 'booking_requested_admin', 'booking_confirmed_customer', 'booking_cancelled_customer', 'booking_cancelled_admin');
CREATE TYPE "public"."booking_mode" AS ENUM('request', 'instant');
CREATE TYPE "public"."booking_resource_type" AS ENUM('table', 'room', 'space', 'room_unit', 'staff', 'equipment', 'generic');
CREATE TYPE "public"."booking_status" AS ENUM('requested', 'confirmed', 'cancelled_by_customer', 'cancelled_by_admin', 'completed', 'no_show');
CREATE TYPE "public"."booking_time_model" AS ENUM('time_slot', 'full_day', 'date_range');
CREATE TYPE "public"."coupon_applies_to" AS ENUM('all', 'specific_products', 'specific_categories');
CREATE TYPE "public"."coupon_type" AS ENUM('percent', 'fixed_amount', 'free_shipping');
CREATE TYPE "public"."crm_blog_post_status" AS ENUM('draft', 'published', 'archived');
CREATE TYPE "public"."crm_customer_status" AS ENUM('aktiv', 'pausiert', 'gekündigt');
CREATE TYPE "public"."crm_payment_status" AS ENUM('offen', 'bezahlt', 'überfällig', 'storniert');
CREATE TYPE "public"."deployment_mode" AS ENUM('shared', 'lead_shared', 'standalone');
CREATE TYPE "public"."discount_type" AS ENUM('percent', 'fixed');
CREATE TYPE "public"."domain_type" AS ENUM('primary', 'alias', 'preview');
CREATE TYPE "public"."draft_status" AS ENUM('dirty', 'saved', 'validated');
CREATE TYPE "public"."industry" AS ENUM('tradesman', 'restaurant', 'salon', 'hotel', 'tourism', 'consulting', 'medical', 'fitness', 'wedding', 'cafe', 'bar', 'photography', 'realestate', 'tattoo', 'ecommerce', 'retail', 'florist', 'location', 'verein');
CREATE TYPE "public"."inquiry_status" AS ENUM('neu', 'gelesen', 'beantwortet', 'archiviert');
CREATE TYPE "public"."invoice_type" AS ENUM('invoice', 'credit_note');
CREATE TYPE "public"."lead_status" AS ENUM('offen', 'kontaktiert', 'angenommen', 'abgelehnt');
CREATE TYPE "public"."order_status" AS ENUM('awaiting_payment', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE "public"."page_status" AS ENUM('draft', 'published', 'archived');
CREATE TYPE "public"."page_type" AS ENUM('free', 'collection_overview', 'legal', 'system');
CREATE TYPE "public"."product_status" AS ENUM('draft', 'active', 'archived');
CREATE TYPE "public"."promotion_type" AS ENUM('free_shipping_above', 'buy_x_get_discount', 'bundle_discount', 'quantity_discount', 'first_order_discount', 'spend_x_save_y');
CREATE TYPE "public"."publish_action" AS ENUM('publish', 'rollback', 'unpublish');
CREATE TYPE "public"."route_entity_type" AS ENUM('page', 'collection_item');
CREATE TYPE "public"."route_status" AS ENUM('active', 'redirect', 'gone');
CREATE TYPE "public"."script_category" AS ENUM('necessary', 'functional', 'analytics', 'marketing');
CREATE TYPE "public"."script_placement" AS ENUM('head', 'body_start', 'body_end');
CREATE TYPE "public"."submission_status" AS ENUM('new', 'read', 'archived');
CREATE TYPE "public"."tenant_status" AS ENUM('active', 'suspended', 'provisioning');
CREATE TABLE "admin_secrets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"password_hash" text NOT NULL,
	"password_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"actor_type" "actor_type" NOT NULL,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" uuid,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "billing_delivery_attempts" (
	"idempotency_key" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"recipient" varchar(320) NOT NULL,
	"request_hash" varchar(64) NOT NULL,
	"status" varchar(20) DEFAULT 'sending' NOT NULL,
	"attempt_count" integer DEFAULT 1 NOT NULL,
	"message_id" varchar(500),
	"last_error_code" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone,
	CONSTRAINT "billing_delivery_status_check" CHECK ("billing_delivery_attempts"."status" IN ('sending', 'sent', 'failed', 'uncertain'))
);

CREATE TABLE "billing_document_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"event_type" varchar(40) NOT NULL,
	"actor" varchar(120) DEFAULT 'admin' NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"previous_hash" varchar(64),
	"event_hash" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "billing_document_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"service_id" uuid,
	"position" integer DEFAULT 1 NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"quantity" numeric(12, 3) DEFAULT '1' NOT NULL,
	"unit_code" varchar(10) DEFAULT 'C62' NOT NULL,
	"unit_label" varchar(40) DEFAULT 'Stück' NOT NULL,
	"unit_price_net_cents" integer NOT NULL,
	"discount_basis_points" integer DEFAULT 0 NOT NULL,
	"discount_type" varchar(10) DEFAULT 'percent' NOT NULL,
	"discount_value" integer DEFAULT 0 NOT NULL,
	"discount_cents" integer DEFAULT 0 NOT NULL,
	"tax_rate_basis_points" integer DEFAULT 1900 NOT NULL,
	"line_net_cents" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "billing_document_items_quantity_check" CHECK ("billing_document_items"."quantity" > 0),
	CONSTRAINT "billing_document_items_price_check" CHECK ("billing_document_items"."unit_price_net_cents" >= 0 AND "billing_document_items"."line_net_cents" >= 0),
	CONSTRAINT "billing_document_items_rates_check" CHECK ("billing_document_items"."discount_basis_points" BETWEEN 0 AND 10000 AND "billing_document_items"."discount_type" IN ('percent', 'fixed') AND "billing_document_items"."discount_value" >= 0 AND "billing_document_items"."discount_cents" >= 0 AND "billing_document_items"."tax_rate_basis_points" BETWEEN 0 AND 10000)
);

CREATE TABLE "billing_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"customer_id" uuid,
	"original_document_id" uuid,
	"document_number" varchar(80),
	"document_type" varchar(20) DEFAULT 'invoice' NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"currency" varchar(3) DEFAULT 'EUR' NOT NULL,
	"issue_date" timestamp with time zone,
	"service_date_from" timestamp with time zone,
	"service_date_to" timestamp with time zone,
	"due_date" timestamp with time zone,
	"buyer_reference" varchar(100),
	"purchase_order_reference" varchar(100),
	"intro_text" text,
	"closing_text" text,
	"notes" text,
	"tax_mode" varchar(30) DEFAULT 'standard' NOT NULL,
	"tax_exemption_reason" text,
	"discount_type" varchar(10) DEFAULT 'percent' NOT NULL,
	"discount_value" integer DEFAULT 0 NOT NULL,
	"discount_cents" integer DEFAULT 0 NOT NULL,
	"cash_discount_basis_points" integer DEFAULT 0 NOT NULL,
	"cash_discount_days" integer DEFAULT 0 NOT NULL,
	"payment_link_url" varchar(1000),
	"quote_valid_until" timestamp with time zone,
	"recurring_schedule_id" uuid,
	"seller_snapshot" jsonb,
	"customer_snapshot" jsonb,
	"payment_snapshot" jsonb,
	"tax_breakdown" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"subtotal_net_cents" integer DEFAULT 0 NOT NULL,
	"tax_cents" integer DEFAULT 0 NOT NULL,
	"total_gross_cents" integer DEFAULT 0 NOT NULL,
	"amount_paid_cents" integer DEFAULT 0 NOT NULL,
	"reminder_level" integer DEFAULT 0 NOT NULL,
	"last_reminder_at" timestamp with time zone,
	"pdf_base64" text,
	"xml_content" text,
	"pdf_sha256" varchar(64),
	"xml_sha256" varchar(64),
	"document_sha256" varchar(64),
	"finalized_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"paid_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"accepted_at" timestamp with time zone,
	"rejected_at" timestamp with time zone,
	"converted_at" timestamp with time zone,
	"retention_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "billing_documents_type_check" CHECK ("billing_documents"."document_type" IN ('invoice', 'cancellation', 'credit_note', 'quote', 'advance_invoice', 'partial_invoice', 'final_invoice')),
	CONSTRAINT "billing_documents_status_check" CHECK ("billing_documents"."status" IN ('draft', 'issued', 'finalized', 'sent', 'partially_paid', 'paid', 'cancelled', 'accepted', 'rejected', 'expired', 'converted')),
	CONSTRAINT "billing_documents_amount_check" CHECK ("billing_documents"."subtotal_net_cents" >= 0 AND "billing_documents"."tax_cents" >= 0 AND "billing_documents"."total_gross_cents" >= 0),
	CONSTRAINT "billing_documents_discount_check" CHECK ("billing_documents"."discount_type" IN ('percent', 'fixed') AND "billing_documents"."discount_value" >= 0 AND "billing_documents"."discount_cents" >= 0 AND "billing_documents"."cash_discount_basis_points" BETWEEN 0 AND 10000 AND "billing_documents"."cash_discount_days" BETWEEN 0 AND 365),
	CONSTRAINT "billing_documents_tax_mode_check" CHECK ("billing_documents"."tax_mode" IN ('standard', 'small_business', 'reverse_charge', 'intra_eu', 'exempt')),
	CONSTRAINT "billing_documents_payment_check" CHECK ("billing_documents"."amount_paid_cents" >= 0 AND "billing_documents"."reminder_level" BETWEEN 0 AND 99)
);

CREATE TABLE "billing_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"amount_cents" integer NOT NULL,
	"paid_at" timestamp with time zone NOT NULL,
	"method" varchar(30) DEFAULT 'bank_transfer' NOT NULL,
	"reference" varchar(255),
	"notes" text,
	"reversed_at" timestamp with time zone,
	"reversal_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "billing_payments_amount_check" CHECK ("billing_payments"."amount_cents" > 0),
	CONSTRAINT "billing_payments_method_check" CHECK ("billing_payments"."method" IN ('bank_transfer', 'cash', 'card', 'paypal', 'stripe', 'other'))
);

CREATE TABLE "billing_portal_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "billing_recurring_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"schedule_id" uuid NOT NULL,
	"document_id" uuid,
	"scheduled_for" timestamp with time zone NOT NULL,
	"status" varchar(20) DEFAULT 'running' NOT NULL,
	"error_code" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "billing_recurring_runs_status_check" CHECK ("billing_recurring_runs"."status" IN ('running', 'completed', 'failed'))
);

CREATE TABLE "billing_recurring_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"interval_unit" varchar(20) DEFAULT 'month' NOT NULL,
	"interval_count" integer DEFAULT 1 NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone,
	"next_run_at" timestamp with time zone NOT NULL,
	"last_run_at" timestamp with time zone,
	"delivery_mode" varchar(30) DEFAULT 'draft' NOT NULL,
	"recipient" varchar(320),
	"template" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "billing_recurring_status_check" CHECK ("billing_recurring_schedules"."status" IN ('active', 'paused', 'completed')),
	CONSTRAINT "billing_recurring_interval_check" CHECK ("billing_recurring_schedules"."interval_unit" IN ('day', 'week', 'month', 'year') AND "billing_recurring_schedules"."interval_count" BETWEEN 1 AND 120),
	CONSTRAINT "billing_recurring_delivery_check" CHECK ("billing_recurring_schedules"."delivery_mode" IN ('draft', 'finalize', 'finalize_send'))
);

CREATE TABLE "billing_reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"level" integer NOT NULL,
	"fee_cents" integer DEFAULT 0 NOT NULL,
	"interest_cents" integer DEFAULT 0 NOT NULL,
	"reminder_date" timestamp with time zone NOT NULL,
	"due_date" timestamp with time zone NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"recipient" varchar(320),
	"message" text NOT NULL,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "billing_reminders_level_check" CHECK ("billing_reminders"."level" BETWEEN 1 AND 99 AND "billing_reminders"."fee_cents" >= 0 AND "billing_reminders"."interest_cents" >= 0),
	CONSTRAINT "billing_reminders_status_check" CHECK ("billing_reminders"."status" IN ('draft', 'sent', 'cancelled'))
);

CREATE TABLE "billing_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"service_code" varchar(80),
	"name" varchar(255) NOT NULL,
	"description" text,
	"unit_code" varchar(10) DEFAULT 'C62' NOT NULL,
	"unit_label" varchar(40) DEFAULT 'Stück' NOT NULL,
	"unit_price_net_cents" integer NOT NULL,
	"tax_rate_basis_points" integer DEFAULT 1900 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "billing_services_price_check" CHECK ("billing_services"."unit_price_net_cents" >= 0),
	CONSTRAINT "billing_services_tax_check" CHECK ("billing_services"."tax_rate_basis_points" BETWEEN 0 AND 10000)
);

CREATE TABLE "billing_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_name" varchar(255),
	"legal_form" varchar(120),
	"street" varchar(255),
	"postal_code" varchar(30),
	"city" varchar(120),
	"country_code" varchar(2) DEFAULT 'DE' NOT NULL,
	"email" varchar(255),
	"phone" varchar(80),
	"website" varchar(500),
	"tax_number" varchar(100),
	"vat_id" varchar(100),
	"register_court" varchar(160),
	"register_number" varchar(100),
	"managing_director" varchar(255),
	"logo_url" varchar(1000),
	"logo_display" varchar(20) DEFAULT 'logo_and_name' NOT NULL,
	"bank_name" varchar(160),
	"account_holder" varchar(255),
	"iban" varchar(50),
	"bic" varchar(30),
	"invoice_prefix" varchar(20) DEFAULT 'RE' NOT NULL,
	"cancellation_prefix" varchar(20) DEFAULT 'ST' NOT NULL,
	"quote_prefix" varchar(20) DEFAULT 'AN' NOT NULL,
	"credit_prefix" varchar(20) DEFAULT 'GS' NOT NULL,
	"invoice_number_format" varchar(120) DEFAULT '{PREFIX}-{YYYY}-{NNNN}' NOT NULL,
	"cancellation_number_format" varchar(120) DEFAULT '{PREFIX}-{YYYY}-{NNNN}' NOT NULL,
	"quote_number_format" varchar(120) DEFAULT '{PREFIX}-{YYYY}-{NNNN}' NOT NULL,
	"credit_number_format" varchar(120) DEFAULT '{PREFIX}-{YYYY}-{NNNN}' NOT NULL,
	"sequence_reset" varchar(20) DEFAULT 'year' NOT NULL,
	"sequence_period" varchar(10),
	"next_invoice_number" integer DEFAULT 1 NOT NULL,
	"next_cancellation_number" integer DEFAULT 1 NOT NULL,
	"next_quote_number" integer DEFAULT 1 NOT NULL,
	"next_credit_number" integer DEFAULT 1 NOT NULL,
	"customer_prefix" varchar(20) DEFAULT 'KD' NOT NULL,
	"next_customer_number" integer DEFAULT 1 NOT NULL,
	"currency" varchar(3) DEFAULT 'EUR' NOT NULL,
	"default_payment_term_days" integer DEFAULT 14 NOT NULL,
	"default_cash_discount_basis_points" integer DEFAULT 0 NOT NULL,
	"default_cash_discount_days" integer DEFAULT 0 NOT NULL,
	"default_reminder_days" integer DEFAULT 7 NOT NULL,
	"default_reminder_fee_cents" integer DEFAULT 0 NOT NULL,
	"payment_link_base_url" varchar(1000),
	"default_intro_text" text,
	"default_closing_text" text,
	"default_footer" text,
	"small_business" boolean DEFAULT false NOT NULL,
	"small_business_notice" text DEFAULT 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.' NOT NULL,
	"sender_name" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "billing_settings_payment_term_check" CHECK ("billing_settings"."default_payment_term_days" BETWEEN 0 AND 365),
	CONSTRAINT "billing_settings_counters_check" CHECK ("billing_settings"."next_invoice_number" > 0 AND "billing_settings"."next_cancellation_number" > 0 AND "billing_settings"."next_quote_number" > 0 AND "billing_settings"."next_credit_number" > 0 AND "billing_settings"."next_customer_number" > 0),
	CONSTRAINT "billing_settings_discount_check" CHECK ("billing_settings"."default_cash_discount_basis_points" BETWEEN 0 AND 10000 AND "billing_settings"."default_cash_discount_days" BETWEEN 0 AND 365),
	CONSTRAINT "billing_settings_reminder_check" CHECK ("billing_settings"."default_reminder_days" BETWEEN 1 AND 365 AND "billing_settings"."default_reminder_fee_cents" >= 0),
	CONSTRAINT "billing_settings_sequence_reset_check" CHECK ("billing_settings"."sequence_reset" IN ('never', 'year', 'month')),
	CONSTRAINT "billing_settings_logo_display_check" CHECK ("billing_settings"."logo_display" IN ('logo_and_name', 'logo_only', 'name_only'))
);

CREATE TABLE "booking_availability_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"resource_id" uuid,
	"service_id" uuid,
	"weekday" integer NOT NULL,
	"start_time" varchar(10) NOT NULL,
	"end_time" varchar(10) NOT NULL,
	"capacity" integer,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "booking_blackouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"resource_id" uuid,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"reason" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "booking_calendar_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"resource_id" uuid,
	"service_id" uuid,
	"type" varchar(20) DEFAULT 'available' NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"capacity" integer,
	"note" varchar(255),
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "booking_customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320),
	"phone" varchar(80),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "booking_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"customer_id" uuid,
	"service_id" uuid,
	"resource_id" uuid,
	"mode" "booking_mode" DEFAULT 'request' NOT NULL,
	"time_model" "booking_time_model" DEFAULT 'time_slot' NOT NULL,
	"status" "booking_status" DEFAULT 'requested' NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"customer_email" varchar(320),
	"customer_phone" varchar(80),
	"party_size" integer DEFAULT 1 NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"buffer_before_minutes" integer DEFAULT 0 NOT NULL,
	"buffer_after_minutes" integer DEFAULT 0 NOT NULL,
	"message" text,
	"intake_answers" jsonb DEFAULT '{}'::jsonb,
	"cancellation_token_hash" varchar(128),
	"cancellation_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "booking_resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"type" "booking_resource_type" DEFAULT 'generic' NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"capacity" integer DEFAULT 1 NOT NULL,
	"seats" integer,
	"image" varchar(500),
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "booking_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"duration_minutes" integer,
	"buffer_before_minutes" integer DEFAULT 0 NOT NULL,
	"buffer_after_minutes" integer DEFAULT 0 NOT NULL,
	"time_model_override" "booking_time_model",
	"price_label" varchar(100),
	"requires_resource" boolean DEFAULT false NOT NULL,
	"min_party_size" integer,
	"max_party_size" integer,
	"allowed_resource_types" jsonb DEFAULT '[]'::jsonb,
	"intake_questions" jsonb DEFAULT '[]'::jsonb,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "booking_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"mode" "booking_mode" DEFAULT 'request' NOT NULL,
	"time_model" "booking_time_model" DEFAULT 'time_slot' NOT NULL,
	"timezone" varchar(80) DEFAULT 'Europe/Berlin' NOT NULL,
	"interval_minutes" integer DEFAULT 30 NOT NULL,
	"min_notice_hours" integer DEFAULT 12 NOT NULL,
	"max_advance_days" integer DEFAULT 90 NOT NULL,
	"cancellation_allowed" boolean DEFAULT true NOT NULL,
	"cancellation_deadline_hours" integer DEFAULT 24 NOT NULL,
	"notification_email" varchar(255),
	"customer_email_enabled" boolean DEFAULT true NOT NULL,
	"admin_email_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "booking_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"booking_id" uuid NOT NULL,
	"from_status" "booking_status",
	"to_status" "booking_status" NOT NULL,
	"actor" "booking_actor" DEFAULT 'system' NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "collection_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"collection_id" uuid NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"key" varchar(100) NOT NULL,
	"label" varchar(255) NOT NULL,
	"schema" jsonb DEFAULT '{}'::jsonb,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "consent_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"key" varchar(50) NOT NULL,
	"label" varchar(100) NOT NULL,
	"description" text,
	"required" boolean DEFAULT false NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(50) NOT NULL,
	"type" "coupon_type" NOT NULL,
	"value" integer NOT NULL,
	"min_order_cents" integer,
	"max_uses" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	"max_uses_per_customer" integer,
	"applies_to" "coupon_applies_to" DEFAULT 'all' NOT NULL,
	"applies_to_ids" jsonb DEFAULT '[]'::jsonb,
	"valid_from" timestamp with time zone,
	"valid_until" timestamp with time zone,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "crm_blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title" varchar(180) NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"status" "crm_blog_post_status" DEFAULT 'draft' NOT NULL,
	"category" varchar(120),
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"cover_image" varchar(700),
	"cover_alt" varchar(255),
	"author_name" varchar(120) DEFAULT 'FlamingoMedia' NOT NULL,
	"meta_title" varchar(180),
	"meta_description" varchar(260),
	"og_image" varchar(700),
	"canonical_path" varchar(255),
	"reading_minutes" integer DEFAULT 1 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "crm_customer_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"type" varchar(50) DEFAULT 'setup' NOT NULL,
	"title" varchar(255) NOT NULL,
	"amount_cents" integer NOT NULL,
	"status" "crm_payment_status" DEFAULT 'offen' NOT NULL,
	"due_date" timestamp with time zone,
	"paid_at" timestamp with time zone,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "crm_customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"status" "crm_customer_status" DEFAULT 'aktiv' NOT NULL,
	"location" varchar(255),
	"industry" varchar(200),
	"website_old" varchar(500),
	"flamingo_link" varchar(500),
	"contact" varchar(255),
	"contact_first_name" varchar(100),
	"contact_last_name" varchar(100),
	"anrede" varchar(10),
	"responsible" varchar(100),
	"tenant_id" uuid,
	"lead_id" uuid,
	"admin_password" varchar(100),
	"package_name" varchar(120),
	"setup_price_cents" integer DEFAULT 0 NOT NULL,
	"hosting_monthly_cents" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "crm_email_deliveries" (
	"idempotency_key" uuid PRIMARY KEY NOT NULL,
	"purpose" varchar(40) NOT NULL,
	"entity_id" uuid NOT NULL,
	"request_hash" varchar(64) NOT NULL,
	"status" varchar(20) DEFAULT 'sending' NOT NULL,
	"attempt_count" integer DEFAULT 1 NOT NULL,
	"last_error_code" varchar(80),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone,
	CONSTRAINT "crm_email_deliveries_status_check" CHECK ("crm_email_deliveries"."status" IN ('sending', 'sent', 'failed', 'uncertain'))
);

CREATE TABLE "customer_custom_field_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"field_key" varchar(80) NOT NULL,
	"label" varchar(120) NOT NULL,
	"field_type" varchar(20) DEFAULT 'text' NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customer_custom_fields_type_check" CHECK ("customer_custom_field_definitions"."field_type" IN ('text', 'textarea', 'number', 'date', 'email', 'phone', 'boolean', 'select'))
);

CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"customer_number" varchar(80),
	"customer_type" varchar(20) DEFAULT 'company' NOT NULL,
	"company_name" varchar(255),
	"salutation" varchar(40),
	"first_name" varchar(120),
	"last_name" varchar(120),
	"phone" varchar(50),
	"mobile" varchar(50),
	"website" varchar(500),
	"tax_number" varchar(100),
	"vat_id" varchar(100),
	"e_invoice_routing_id" varchar(100),
	"buyer_reference" varchar(100),
	"language" varchar(10) DEFAULT 'de' NOT NULL,
	"payment_term_days" integer DEFAULT 14 NOT NULL,
	"notes" text,
	"custom_fields" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"default_shipping_address" jsonb,
	"default_billing_address" jsonb,
	"order_count" integer DEFAULT 0 NOT NULL,
	"total_spent_cents" integer DEFAULT 0 NOT NULL,
	"first_order_at" timestamp with time zone,
	"last_order_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customers_type_check" CHECK ("customers"."customer_type" IN ('company', 'person'))
);

CREATE TABLE "draft_states" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" uuid NOT NULL,
	"data" jsonb NOT NULL,
	"status" "draft_status" DEFAULT 'dirty' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "email_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"trigger" varchar(50) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);

CREATE TABLE "footer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"columns" jsonb DEFAULT '[]'::jsonb,
	"legal_links" jsonb DEFAULT '[]'::jsonb,
	"cta" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "form_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"idempotency_key" uuid,
	"request_hash" varchar(64),
	"name" varchar(200) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(50),
	"message" text NOT NULL,
	"page" varchar(200),
	"payload" jsonb DEFAULT '{"version":1,"fields":[]}'::jsonb NOT NULL,
	"status" "submission_status" DEFAULT 'new' NOT NULL,
	"notification_status" varchar(20),
	"auto_response_status" varchar(20),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "global_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"brand" jsonb DEFAULT '{}'::jsonb,
	"contact" jsonb DEFAULT '{}'::jsonb,
	"business_profile" jsonb DEFAULT 'null'::jsonb,
	"opening_hours" jsonb DEFAULT '[]'::jsonb,
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"design" jsonb DEFAULT '{}'::jsonb,
	"banners" jsonb DEFAULT '[]'::jsonb,
	"smtp" jsonb DEFAULT 'null'::jsonb,
	"auto_response" jsonb DEFAULT 'null'::jsonb,
	"form_fields" jsonb DEFAULT 'null'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" varchar(320) NOT NULL,
	"branche" varchar(100),
	"paket" varchar(100),
	"message" text NOT NULL,
	"source" varchar(100),
	"status" "inquiry_status" DEFAULT 'neu' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "instagram_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"ig_user_id" varchar(64) NOT NULL,
	"ig_username" varchar(64) NOT NULL,
	"ig_account_type" varchar(20) DEFAULT 'BUSINESS' NOT NULL,
	"access_token_encrypted" text NOT NULL,
	"token_expires_at" timestamp with time zone NOT NULL,
	"last_synced_at" timestamp with time zone,
	"last_refreshed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sync_status" varchar(20) DEFAULT 'ok' NOT NULL,
	"sync_error" text,
	"scopes" varchar(255) DEFAULT 'instagram_business_basic' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "instagram_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"connection_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	"ig_media_id" varchar(64) NOT NULL,
	"media_type" varchar(32) NOT NULL,
	"media_url" text NOT NULL,
	"thumbnail_url" text,
	"permalink" text NOT NULL,
	"caption" text,
	"timestamp" timestamp with time zone NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"invoice_number" varchar(50) NOT NULL,
	"type" "invoice_type" DEFAULT 'invoice' NOT NULL,
	"pdf_url" varchar(500),
	"amount_net_cents" integer NOT NULL,
	"tax_cents" integer NOT NULL,
	"amount_gross_cents" integer NOT NULL,
	"ref_invoice_number" varchar(50),
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company" varchar(255) NOT NULL,
	"email" varchar(255),
	"status" "lead_status" DEFAULT 'offen' NOT NULL,
	"location" varchar(255),
	"website_old" varchar(500),
	"flamingo_link" varchar(500),
	"contact" varchar(255),
	"contact_first_name" varchar(100),
	"contact_last_name" varchar(100),
	"anrede" varchar(10),
	"responsible" varchar(100),
	"tenant_id" uuid,
	"admin_password" varchar(100),
	"industry" varchar(200),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "marketing_rate_limits" (
	"key" varchar(160) PRIMARY KEY NOT NULL,
	"hits" integer DEFAULT 1 NOT NULL,
	"window_started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"blob_url" text NOT NULL,
	"pathname" varchar(500) NOT NULL,
	"filename" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"width" integer,
	"height" integer,
	"alt" text,
	"caption" text,
	"folder" varchar(200),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "navigation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb,
	"cta" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "order_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"old_status" varchar(50),
	"new_status" varchar(50) NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"customer_phone" varchar(50),
	"shipping_address" jsonb,
	"billing_address" jsonb,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"subtotal_cents" integer NOT NULL,
	"shipping_cents" integer DEFAULT 0 NOT NULL,
	"discount_cents" integer DEFAULT 0 NOT NULL,
	"tax_cents" integer NOT NULL,
	"total_cents" integer NOT NULL,
	"payment_method" varchar(50),
	"payment_id" varchar(255),
	"payment_status" varchar(50),
	"shipping_method" varchar(255),
	"tracking_number" varchar(255),
	"tracking_url" varchar(500),
	"coupon_code" varchar(50),
	"notes" text,
	"customer_notes" text,
	"idempotency_key" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "page_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"page_id" uuid NOT NULL,
	"type" varchar(100) NOT NULL,
	"definition_key" varchar(191),
	"schema_version" integer,
	"variant" varchar(50),
	"title_internal" varchar(255),
	"visible" boolean DEFAULT true NOT NULL,
	"locked" boolean DEFAULT false NOT NULL,
	"container" varchar(20) DEFAULT 'default' NOT NULL,
	"spacing_top" varchar(10) DEFAULT 'm' NOT NULL,
	"spacing_bottom" varchar(10) DEFAULT 'm' NOT NULL,
	"anchor_id" varchar(100),
	"style_overrides" jsonb,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "page_sections_schema_version_positive" CHECK ("page_sections"."schema_version" IS NULL OR "page_sections"."schema_version" > 0)
);

CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"type" "page_type" DEFAULT 'free' NOT NULL,
	"status" "page_status" DEFAULT 'draft' NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "product_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"image" varchar(500),
	"parent_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"sku" varchar(100),
	"price_cents" integer,
	"stock" integer DEFAULT 0 NOT NULL,
	"attributes" jsonb DEFAULT '{}'::jsonb,
	"image" varchar(500),
	"sort_order" integer DEFAULT 0 NOT NULL
);

CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"category_id" uuid,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"short_description" varchar(500),
	"price_cents" integer NOT NULL,
	"compare_price_cents" integer,
	"currency" varchar(10) DEFAULT 'EUR' NOT NULL,
	"sku" varchar(100),
	"stock" integer DEFAULT 0 NOT NULL,
	"track_stock" boolean DEFAULT true NOT NULL,
	"is_digital" boolean DEFAULT false NOT NULL,
	"digital_file_url" varchar(500),
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb,
	"weight_grams" integer,
	"tax_class" varchar(50) DEFAULT 'standard' NOT NULL,
	"meta_title" varchar(255),
	"meta_description" varchar(500),
	"highlights" jsonb DEFAULT '[]'::jsonb,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "promotions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "promotion_type" NOT NULL,
	"conditions" jsonb DEFAULT '{}'::jsonb,
	"discount_value" integer NOT NULL,
	"discount_type" "discount_type" NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"valid_from" timestamp with time zone,
	"valid_until" timestamp with time zone,
	"stackable" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "public_flow_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"flow" varchar(20) NOT NULL,
	"idempotency_key" uuid NOT NULL,
	"request_hash" varchar(64) NOT NULL,
	"status" varchar(20) DEFAULT 'processing' NOT NULL,
	"resource_id" uuid,
	"response" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "public_flow_requests_flow_check" CHECK ("public_flow_requests"."flow" IN ('booking', 'checkout')),
	CONSTRAINT "public_flow_requests_status_check" CHECK ("public_flow_requests"."status" IN ('processing', 'completed', 'failed', 'uncertain'))
);

CREATE TABLE "publish_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"snapshot_id" uuid NOT NULL,
	"previous_snapshot_id" uuid,
	"action" "publish_action" NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "published_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(100),
	"is_active" boolean DEFAULT false NOT NULL
);

CREATE TABLE "reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"date" varchar(20) NOT NULL,
	"time" varchar(10),
	"guests" integer DEFAULT 2 NOT NULL,
	"message" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"path" varchar(500) NOT NULL,
	"entity_type" "route_entity_type" NOT NULL,
	"entity_id" uuid NOT NULL,
	"collection_key" varchar(100),
	"status" "route_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "rsvp_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"attending" boolean DEFAULT true NOT NULL,
	"guest_count" integer DEFAULT 1 NOT NULL,
	"guest_names" text,
	"dietary" varchar(100),
	"allergies" text,
	"song_wish" varchar(255),
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "scripts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" "script_category" NOT NULL,
	"placement" "script_placement" DEFAULT 'head' NOT NULL,
	"code" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "seo_global" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"default_title" varchar(70),
	"title_template" varchar(100),
	"default_description" varchar(170),
	"default_og_image" text,
	"canonical_base" varchar(255),
	"locale" varchar(10) DEFAULT 'de_DE' NOT NULL,
	"robots" varchar(255) DEFAULT 'index,follow' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "seo_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"collection_item_id" uuid NOT NULL,
	"meta_title" varchar(70),
	"meta_description" varchar(170),
	"og_image" text,
	"canonical" text,
	"noindex" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "seo_page" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"page_id" uuid NOT NULL,
	"meta_title" varchar(70),
	"meta_description" varchar(170),
	"og_image" text,
	"canonical" text,
	"noindex" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "shipping_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"zone_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"price_cents" integer NOT NULL,
	"free_above_cents" integer,
	"min_weight_grams" integer,
	"max_weight_grams" integer,
	"estimated_days" varchar(50),
	"active" boolean DEFAULT true NOT NULL
);

CREATE TABLE "shipping_zones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"countries" jsonb DEFAULT '[]'::jsonb,
	"sort_order" integer DEFAULT 0 NOT NULL
);

CREATE TABLE "shop_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"currency" varchar(10) DEFAULT 'EUR' NOT NULL,
	"currency_symbol" varchar(5) DEFAULT '€' NOT NULL,
	"payment_methods" jsonb DEFAULT '[]'::jsonb,
	"bank_details" jsonb DEFAULT 'null'::jsonb,
	"pickup_enabled" boolean DEFAULT false NOT NULL,
	"pickup_instructions" text,
	"stripe_public_key" varchar(255),
	"stripe_secret_key" varchar(255),
	"stripe_webhook_secret" varchar(255),
	"paypal_client_id" varchar(255),
	"paypal_secret" varchar(255),
	"paypal_mode" varchar(10) DEFAULT 'sandbox' NOT NULL,
	"sumup_api_key" varchar(255),
	"sumup_merchant_code" varchar(100),
	"sumup_mode" varchar(10) DEFAULT 'sandbox' NOT NULL,
	"order_prefix" varchar(10) DEFAULT 'FM' NOT NULL,
	"invoice_prefix" varchar(10) DEFAULT 'RE' NOT NULL,
	"next_order_number" integer DEFAULT 1 NOT NULL,
	"next_invoice_number" integer DEFAULT 1 NOT NULL,
	"notification_email" varchar(255),
	"low_stock_threshold" integer DEFAULT 5 NOT NULL,
	"company_info" jsonb DEFAULT 'null'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "tax_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"rate" numeric(5, 2) NOT NULL,
	"country" varchar(2) DEFAULT 'DE' NOT NULL,
	"region" varchar(100),
	"is_default" boolean DEFAULT false NOT NULL,
	"applies_to_shipping" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "tenant_addons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"addon_key" varchar(50) NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"activated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "tenant_api_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"token_hash" varchar(128) NOT NULL,
	"label" varchar(100) DEFAULT 'AI Content Token' NOT NULL,
	"last_used_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"revoked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "tenant_database_connections" (
	"tenant_id" uuid PRIMARY KEY NOT NULL,
	"provider" varchar(30) DEFAULT 'neon' NOT NULL,
	"project_id" varchar(100) NOT NULL,
	"region" varchar(80),
	"database_name" varchar(100) DEFAULT 'flamingo' NOT NULL,
	"role_name" varchar(100) DEFAULT 'flamingo_owner' NOT NULL,
	"connection_uri_encrypted" text NOT NULL,
	"direct_connection_uri_encrypted" text NOT NULL,
	"status" varchar(20) DEFAULT 'provisioning' NOT NULL,
	"schema_version" integer DEFAULT 0 NOT NULL,
	"last_migrated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tenant_database_connections_status_check" CHECK ("tenant_database_connections"."status" IN ('provisioning', 'active', 'migration_failed', 'deleting'))
);

CREATE TABLE "tenant_domains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"domain" varchar(255) NOT NULL,
	"type" "domain_type" DEFAULT 'primary' NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"industry" "industry" NOT NULL,
	"active_style" varchar(50) DEFAULT 'classic' NOT NULL,
	"status" "tenant_status" DEFAULT 'active' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"is_lead" boolean DEFAULT false NOT NULL,
	"deployment_mode" "deployment_mode" DEFAULT 'shared' NOT NULL,
	"vercel_project_id" varchar(255),
	"i18n_enabled" boolean DEFAULT false NOT NULL,
	"i18n_max_languages" integer DEFAULT 2 NOT NULL,
	"i18n_default_locale" varchar(10) DEFAULT 'de' NOT NULL,
	"i18n_locales" text DEFAULT 'de' NOT NULL,
	"i18n_switcher_style" varchar(20) DEFAULT 'dropdown' NOT NULL,
	"i18n_switcher_position" varchar(20) DEFAULT 'nav-right' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_slug_unique" UNIQUE("slug")
);

CREATE TABLE "variant_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"values" jsonb DEFAULT '[]'::jsonb,
	"sort_order" integer DEFAULT 0 NOT NULL
);

ALTER TABLE "admin_secrets" ADD CONSTRAINT "admin_secrets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "billing_delivery_attempts" ADD CONSTRAINT "billing_delivery_attempts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "billing_delivery_attempts" ADD CONSTRAINT "billing_delivery_attempts_document_id_billing_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."billing_documents"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "billing_document_events" ADD CONSTRAINT "billing_document_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "billing_document_events" ADD CONSTRAINT "billing_document_events_document_id_billing_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."billing_documents"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "billing_document_items" ADD CONSTRAINT "billing_document_items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "billing_document_items" ADD CONSTRAINT "billing_document_items_document_id_billing_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."billing_documents"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "billing_document_items" ADD CONSTRAINT "billing_document_items_service_id_billing_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."billing_services"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "billing_documents" ADD CONSTRAINT "billing_documents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "billing_documents" ADD CONSTRAINT "billing_documents_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "billing_payments" ADD CONSTRAINT "billing_payments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "billing_payments" ADD CONSTRAINT "billing_payments_document_id_billing_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."billing_documents"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "billing_portal_links" ADD CONSTRAINT "billing_portal_links_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "billing_portal_links" ADD CONSTRAINT "billing_portal_links_document_id_billing_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."billing_documents"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "billing_recurring_runs" ADD CONSTRAINT "billing_recurring_runs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "billing_recurring_runs" ADD CONSTRAINT "billing_recurring_runs_schedule_id_billing_recurring_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."billing_recurring_schedules"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "billing_recurring_runs" ADD CONSTRAINT "billing_recurring_runs_document_id_billing_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."billing_documents"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "billing_recurring_schedules" ADD CONSTRAINT "billing_recurring_schedules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "billing_recurring_schedules" ADD CONSTRAINT "billing_recurring_schedules_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "billing_reminders" ADD CONSTRAINT "billing_reminders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "billing_reminders" ADD CONSTRAINT "billing_reminders_document_id_billing_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."billing_documents"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "billing_services" ADD CONSTRAINT "billing_services_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "billing_settings" ADD CONSTRAINT "billing_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_availability_rules" ADD CONSTRAINT "booking_availability_rules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_availability_rules" ADD CONSTRAINT "booking_availability_rules_resource_id_booking_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."booking_resources"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_availability_rules" ADD CONSTRAINT "booking_availability_rules_service_id_booking_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."booking_services"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_blackouts" ADD CONSTRAINT "booking_blackouts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_blackouts" ADD CONSTRAINT "booking_blackouts_resource_id_booking_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."booking_resources"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_calendar_blocks" ADD CONSTRAINT "booking_calendar_blocks_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_calendar_blocks" ADD CONSTRAINT "booking_calendar_blocks_resource_id_booking_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."booking_resources"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_calendar_blocks" ADD CONSTRAINT "booking_calendar_blocks_service_id_booking_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."booking_services"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_customers" ADD CONSTRAINT "booking_customers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_customer_id_booking_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."booking_customers"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_service_id_booking_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."booking_services"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_resource_id_booking_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."booking_resources"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "booking_resources" ADD CONSTRAINT "booking_resources_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_services" ADD CONSTRAINT "booking_services_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_settings" ADD CONSTRAINT "booking_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_status_history" ADD CONSTRAINT "booking_status_history_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_status_history" ADD CONSTRAINT "booking_status_history_booking_id_booking_requests_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking_requests"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "collections" ADD CONSTRAINT "collections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "consent_categories" ADD CONSTRAINT "consent_categories_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "crm_customer_payments" ADD CONSTRAINT "crm_customer_payments_customer_id_crm_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."crm_customers"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "crm_customers" ADD CONSTRAINT "crm_customers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "crm_customers" ADD CONSTRAINT "crm_customers_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "customer_custom_field_definitions" ADD CONSTRAINT "customer_custom_field_definitions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "customers" ADD CONSTRAINT "customers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "draft_states" ADD CONSTRAINT "draft_states_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "footer" ADD CONSTRAINT "footer_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "global_settings" ADD CONSTRAINT "global_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "instagram_connections" ADD CONSTRAINT "instagram_connections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "instagram_posts" ADD CONSTRAINT "instagram_posts_connection_id_instagram_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."instagram_connections"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "instagram_posts" ADD CONSTRAINT "instagram_posts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "leads" ADD CONSTRAINT "leads_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "navigation" ADD CONSTRAINT "navigation_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "orders" ADD CONSTRAINT "orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages" ADD CONSTRAINT "pages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "products" ADD CONSTRAINT "products_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "public_flow_requests" ADD CONSTRAINT "public_flow_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "publish_history" ADD CONSTRAINT "publish_history_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "publish_history" ADD CONSTRAINT "publish_history_snapshot_id_published_snapshots_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."published_snapshots"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "publish_history" ADD CONSTRAINT "publish_history_previous_snapshot_id_published_snapshots_id_fk" FOREIGN KEY ("previous_snapshot_id") REFERENCES "public"."published_snapshots"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "published_snapshots" ADD CONSTRAINT "published_snapshots_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "routes" ADD CONSTRAINT "routes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "rsvp_responses" ADD CONSTRAINT "rsvp_responses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "seo_global" ADD CONSTRAINT "seo_global_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "seo_item" ADD CONSTRAINT "seo_item_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "seo_item" ADD CONSTRAINT "seo_item_collection_item_id_collection_items_id_fk" FOREIGN KEY ("collection_item_id") REFERENCES "public"."collection_items"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "seo_page" ADD CONSTRAINT "seo_page_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "seo_page" ADD CONSTRAINT "seo_page_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "shipping_methods" ADD CONSTRAINT "shipping_methods_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "shipping_methods" ADD CONSTRAINT "shipping_methods_zone_id_shipping_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."shipping_zones"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "shipping_zones" ADD CONSTRAINT "shipping_zones_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "shop_settings" ADD CONSTRAINT "shop_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "tax_rates" ADD CONSTRAINT "tax_rates_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "tenant_addons" ADD CONSTRAINT "tenant_addons_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "tenant_api_tokens" ADD CONSTRAINT "tenant_api_tokens_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "tenant_database_connections" ADD CONSTRAINT "tenant_database_connections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "tenant_domains" ADD CONSTRAINT "tenant_domains_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "variant_options" ADD CONSTRAINT "variant_options_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "variant_options" ADD CONSTRAINT "variant_options_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
CREATE UNIQUE INDEX "admin_secrets_tenant_idx" ON "admin_secrets" USING btree ("tenant_id");
CREATE INDEX "audit_log_tenant_idx" ON "audit_log" USING btree ("tenant_id");
CREATE INDEX "audit_log_entity_idx" ON "audit_log" USING btree ("entity_type","entity_id");
CREATE INDEX "billing_delivery_document_idx" ON "billing_delivery_attempts" USING btree ("document_id","created_at");
CREATE INDEX "billing_delivery_status_idx" ON "billing_delivery_attempts" USING btree ("tenant_id","status","created_at");
CREATE INDEX "billing_document_events_document_idx" ON "billing_document_events" USING btree ("document_id","created_at");
CREATE UNIQUE INDEX "billing_document_events_hash_idx" ON "billing_document_events" USING btree ("tenant_id","event_hash");
CREATE INDEX "billing_document_items_document_idx" ON "billing_document_items" USING btree ("document_id","position");
CREATE UNIQUE INDEX "billing_documents_tenant_number_idx" ON "billing_documents" USING btree ("tenant_id","document_number");
CREATE INDEX "billing_documents_tenant_status_idx" ON "billing_documents" USING btree ("tenant_id","status","created_at");
CREATE INDEX "billing_documents_customer_idx" ON "billing_documents" USING btree ("tenant_id","customer_id");
CREATE INDEX "billing_documents_original_idx" ON "billing_documents" USING btree ("original_document_id");
CREATE INDEX "billing_payments_document_idx" ON "billing_payments" USING btree ("tenant_id","document_id","paid_at");
CREATE UNIQUE INDEX "billing_portal_links_token_idx" ON "billing_portal_links" USING btree ("token_hash");
CREATE INDEX "billing_portal_links_document_idx" ON "billing_portal_links" USING btree ("tenant_id","document_id","created_at");
CREATE UNIQUE INDEX "billing_recurring_runs_schedule_time_idx" ON "billing_recurring_runs" USING btree ("schedule_id","scheduled_for");
CREATE INDEX "billing_recurring_runs_tenant_idx" ON "billing_recurring_runs" USING btree ("tenant_id","created_at");
CREATE INDEX "billing_recurring_due_idx" ON "billing_recurring_schedules" USING btree ("status","next_run_at");
CREATE INDEX "billing_recurring_tenant_idx" ON "billing_recurring_schedules" USING btree ("tenant_id","status","next_run_at");
CREATE INDEX "billing_reminders_document_idx" ON "billing_reminders" USING btree ("tenant_id","document_id","created_at");
CREATE UNIQUE INDEX "billing_services_tenant_code_idx" ON "billing_services" USING btree ("tenant_id","service_code");
CREATE INDEX "billing_services_tenant_active_idx" ON "billing_services" USING btree ("tenant_id","active");
CREATE UNIQUE INDEX "billing_settings_tenant_idx" ON "billing_settings" USING btree ("tenant_id");
CREATE INDEX "booking_availability_tenant_idx" ON "booking_availability_rules" USING btree ("tenant_id");
CREATE INDEX "booking_availability_lookup_idx" ON "booking_availability_rules" USING btree ("tenant_id","weekday","active");
CREATE INDEX "booking_blackouts_tenant_idx" ON "booking_blackouts" USING btree ("tenant_id");
CREATE INDEX "booking_blackouts_lookup_idx" ON "booking_blackouts" USING btree ("tenant_id","starts_at","ends_at");
CREATE INDEX "booking_calendar_blocks_tenant_idx" ON "booking_calendar_blocks" USING btree ("tenant_id");
CREATE INDEX "booking_calendar_blocks_lookup_idx" ON "booking_calendar_blocks" USING btree ("tenant_id","starts_at","ends_at","active");
CREATE INDEX "booking_customers_tenant_idx" ON "booking_customers" USING btree ("tenant_id");
CREATE INDEX "booking_customers_tenant_email_idx" ON "booking_customers" USING btree ("tenant_id","email");
CREATE INDEX "booking_requests_tenant_idx" ON "booking_requests" USING btree ("tenant_id");
CREATE INDEX "booking_requests_calendar_idx" ON "booking_requests" USING btree ("tenant_id","starts_at","ends_at");
CREATE INDEX "booking_requests_status_idx" ON "booking_requests" USING btree ("tenant_id","status");
CREATE INDEX "booking_resources_tenant_idx" ON "booking_resources" USING btree ("tenant_id");
CREATE INDEX "booking_resources_tenant_active_idx" ON "booking_resources" USING btree ("tenant_id","active");
CREATE INDEX "booking_services_tenant_idx" ON "booking_services" USING btree ("tenant_id");
CREATE INDEX "booking_services_tenant_active_idx" ON "booking_services" USING btree ("tenant_id","active");
CREATE UNIQUE INDEX "booking_settings_tenant_idx" ON "booking_settings" USING btree ("tenant_id");
CREATE INDEX "booking_status_history_booking_idx" ON "booking_status_history" USING btree ("booking_id");
CREATE INDEX "booking_status_history_tenant_idx" ON "booking_status_history" USING btree ("tenant_id");
CREATE UNIQUE INDEX "collection_items_slug_idx" ON "collection_items" USING btree ("tenant_id","collection_id","slug");
CREATE INDEX "collection_items_tenant_idx" ON "collection_items" USING btree ("tenant_id");
CREATE INDEX "collection_items_collection_idx" ON "collection_items" USING btree ("collection_id");
CREATE UNIQUE INDEX "collections_tenant_key_idx" ON "collections" USING btree ("tenant_id","key");
CREATE UNIQUE INDEX "consent_categories_key_idx" ON "consent_categories" USING btree ("tenant_id","key");
CREATE UNIQUE INDEX "coupons_tenant_code_idx" ON "coupons" USING btree ("tenant_id","code");
CREATE UNIQUE INDEX "crm_blog_posts_slug_idx" ON "crm_blog_posts" USING btree ("slug");
CREATE INDEX "crm_blog_posts_status_idx" ON "crm_blog_posts" USING btree ("status");
CREATE INDEX "crm_blog_posts_published_idx" ON "crm_blog_posts" USING btree ("published_at");
CREATE INDEX "crm_customer_payments_customer_idx" ON "crm_customer_payments" USING btree ("customer_id");
CREATE INDEX "crm_customer_payments_status_idx" ON "crm_customer_payments" USING btree ("status");
CREATE INDEX "crm_customers_company_idx" ON "crm_customers" USING btree ("company");
CREATE INDEX "crm_customers_status_idx" ON "crm_customers" USING btree ("status");
CREATE INDEX "crm_customers_lead_idx" ON "crm_customers" USING btree ("lead_id");
CREATE INDEX "crm_email_deliveries_entity_idx" ON "crm_email_deliveries" USING btree ("purpose","entity_id");
CREATE INDEX "crm_email_deliveries_status_idx" ON "crm_email_deliveries" USING btree ("status","created_at");
CREATE UNIQUE INDEX "customer_custom_fields_tenant_key_idx" ON "customer_custom_field_definitions" USING btree ("tenant_id","field_key");
CREATE INDEX "customer_custom_fields_tenant_sort_idx" ON "customer_custom_field_definitions" USING btree ("tenant_id","sort_order");
CREATE UNIQUE INDEX "customers_tenant_email_idx" ON "customers" USING btree ("tenant_id","email");
CREATE UNIQUE INDEX "customers_tenant_number_idx" ON "customers" USING btree ("tenant_id","customer_number");
CREATE INDEX "customers_tenant_archived_idx" ON "customers" USING btree ("tenant_id","archived_at");
CREATE UNIQUE INDEX "draft_states_entity_idx" ON "draft_states" USING btree ("tenant_id","entity_type","entity_id");
CREATE INDEX "draft_states_tenant_idx" ON "draft_states" USING btree ("tenant_id");
CREATE UNIQUE INDEX "email_templates_tenant_trigger_idx" ON "email_templates" USING btree ("tenant_id","trigger");
CREATE UNIQUE INDEX "footer_tenant_idx" ON "footer" USING btree ("tenant_id");
CREATE INDEX "form_submissions_tenant_idx" ON "form_submissions" USING btree ("tenant_id");
CREATE INDEX "form_submissions_status_idx" ON "form_submissions" USING btree ("tenant_id","status");
CREATE UNIQUE INDEX "form_submissions_tenant_idempotency_idx" ON "form_submissions" USING btree ("tenant_id","idempotency_key");
CREATE UNIQUE INDEX "global_settings_tenant_idx" ON "global_settings" USING btree ("tenant_id");
CREATE INDEX "inquiries_status_idx" ON "inquiries" USING btree ("status");
CREATE UNIQUE INDEX "instagram_connections_tenant_idx" ON "instagram_connections" USING btree ("tenant_id");
CREATE INDEX "instagram_connections_ig_user_idx" ON "instagram_connections" USING btree ("ig_user_id");
CREATE UNIQUE INDEX "instagram_posts_connection_media_idx" ON "instagram_posts" USING btree ("connection_id","ig_media_id");
CREATE INDEX "instagram_posts_tenant_idx" ON "instagram_posts" USING btree ("tenant_id");
CREATE INDEX "instagram_posts_position_idx" ON "instagram_posts" USING btree ("tenant_id","position");
CREATE UNIQUE INDEX "invoices_tenant_number_idx" ON "invoices" USING btree ("tenant_id","invoice_number");
CREATE INDEX "invoices_order_idx" ON "invoices" USING btree ("order_id");
CREATE INDEX "marketing_rate_limits_expires_idx" ON "marketing_rate_limits" USING btree ("expires_at");
CREATE INDEX "media_assets_tenant_idx" ON "media_assets" USING btree ("tenant_id");
CREATE INDEX "media_assets_mime_idx" ON "media_assets" USING btree ("tenant_id","mime_type");
CREATE INDEX "media_assets_folder_idx" ON "media_assets" USING btree ("tenant_id","folder");
CREATE UNIQUE INDEX "media_assets_tenant_blob_idx" ON "media_assets" USING btree ("tenant_id","blob_url");
CREATE UNIQUE INDEX "navigation_tenant_idx" ON "navigation" USING btree ("tenant_id");
CREATE INDEX "order_status_history_order_idx" ON "order_status_history" USING btree ("order_id");
CREATE UNIQUE INDEX "orders_tenant_number_idx" ON "orders" USING btree ("tenant_id","order_number");
CREATE INDEX "orders_tenant_idx" ON "orders" USING btree ("tenant_id");
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("tenant_id","status");
CREATE UNIQUE INDEX "orders_idempotency_idx" ON "orders" USING btree ("tenant_id","idempotency_key");
CREATE INDEX "page_sections_page_idx" ON "page_sections" USING btree ("page_id");
CREATE INDEX "page_sections_tenant_idx" ON "page_sections" USING btree ("tenant_id");
CREATE INDEX "page_sections_definition_key_idx" ON "page_sections" USING btree ("definition_key");
CREATE UNIQUE INDEX "pages_tenant_slug_idx" ON "pages" USING btree ("tenant_id","slug");
CREATE INDEX "pages_tenant_idx" ON "pages" USING btree ("tenant_id");
CREATE UNIQUE INDEX "product_categories_tenant_slug_idx" ON "product_categories" USING btree ("tenant_id","slug");
CREATE INDEX "product_categories_tenant_idx" ON "product_categories" USING btree ("tenant_id");
CREATE UNIQUE INDEX "product_variants_unique_idx" ON "product_variants" USING btree ("tenant_id","product_id","name");
CREATE INDEX "product_variants_product_idx" ON "product_variants" USING btree ("product_id");
CREATE UNIQUE INDEX "products_tenant_slug_idx" ON "products" USING btree ("tenant_id","slug");
CREATE INDEX "products_tenant_idx" ON "products" USING btree ("tenant_id");
CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
CREATE INDEX "promotions_tenant_idx" ON "promotions" USING btree ("tenant_id");
CREATE UNIQUE INDEX "public_flow_requests_tenant_key_idx" ON "public_flow_requests" USING btree ("tenant_id","flow","idempotency_key");
CREATE INDEX "public_flow_requests_status_idx" ON "public_flow_requests" USING btree ("status","created_at");
CREATE INDEX "publish_history_tenant_idx" ON "publish_history" USING btree ("tenant_id");
CREATE INDEX "published_snapshots_active_idx" ON "published_snapshots" USING btree ("tenant_id","is_active");
CREATE INDEX "published_snapshots_tenant_idx" ON "published_snapshots" USING btree ("tenant_id");
CREATE UNIQUE INDEX "published_snapshots_one_active_per_tenant_idx" ON "published_snapshots" USING btree ("tenant_id") WHERE "published_snapshots"."is_active" = true;
CREATE INDEX "reservations_tenant_idx" ON "reservations" USING btree ("tenant_id");
CREATE UNIQUE INDEX "routes_tenant_path_idx" ON "routes" USING btree ("tenant_id","path");
CREATE INDEX "routes_tenant_idx" ON "routes" USING btree ("tenant_id");
CREATE INDEX "rsvp_responses_tenant_idx" ON "rsvp_responses" USING btree ("tenant_id");
CREATE INDEX "scripts_tenant_category_idx" ON "scripts" USING btree ("tenant_id","category");
CREATE UNIQUE INDEX "seo_global_tenant_idx" ON "seo_global" USING btree ("tenant_id");
CREATE UNIQUE INDEX "seo_item_idx" ON "seo_item" USING btree ("tenant_id","collection_item_id");
CREATE UNIQUE INDEX "seo_page_page_idx" ON "seo_page" USING btree ("tenant_id","page_id");
CREATE INDEX "shipping_methods_zone_idx" ON "shipping_methods" USING btree ("zone_id");
CREATE INDEX "shipping_zones_tenant_idx" ON "shipping_zones" USING btree ("tenant_id");
CREATE UNIQUE INDEX "shop_settings_tenant_idx" ON "shop_settings" USING btree ("tenant_id");
CREATE UNIQUE INDEX "tax_rates_tenant_name_country_idx" ON "tax_rates" USING btree ("tenant_id","name","country");
CREATE UNIQUE INDEX "tenant_addons_tenant_key_idx" ON "tenant_addons" USING btree ("tenant_id","addon_key");
CREATE INDEX "tenant_api_tokens_tenant_idx" ON "tenant_api_tokens" USING btree ("tenant_id");
CREATE INDEX "tenant_api_tokens_hash_idx" ON "tenant_api_tokens" USING btree ("token_hash");
CREATE UNIQUE INDEX "tenant_database_connections_project_idx" ON "tenant_database_connections" USING btree ("project_id");
CREATE INDEX "tenant_database_connections_status_idx" ON "tenant_database_connections" USING btree ("status");
CREATE UNIQUE INDEX "tenant_domains_domain_idx" ON "tenant_domains" USING btree ("domain");
CREATE INDEX "tenant_domains_tenant_idx" ON "tenant_domains" USING btree ("tenant_id");
CREATE INDEX "variant_options_product_idx" ON "variant_options" USING btree ("product_id");
