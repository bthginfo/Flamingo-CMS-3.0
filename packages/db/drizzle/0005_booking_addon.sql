CREATE TYPE "booking_mode" AS ENUM ('request', 'instant');
CREATE TYPE "booking_time_model" AS ENUM ('time_slot', 'full_day', 'date_range');
CREATE TYPE "booking_resource_type" AS ENUM ('table', 'room', 'space', 'room_unit', 'staff', 'equipment', 'generic');
CREATE TYPE "booking_status" AS ENUM ('requested', 'confirmed', 'cancelled_by_customer', 'cancelled_by_admin', 'completed', 'no_show');
CREATE TYPE "booking_actor" AS ENUM ('customer', 'admin', 'system');
CREATE TYPE "booking_email_trigger" AS ENUM ('booking_requested_customer', 'booking_requested_admin', 'booking_confirmed_customer', 'booking_cancelled_customer', 'booking_cancelled_admin');

CREATE TABLE "booking_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL,
  "mode" "booking_mode" DEFAULT 'request' NOT NULL,
  "time_model" "booking_time_model" DEFAULT 'time_slot' NOT NULL,
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

CREATE TABLE "booking_resources" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL,
  "type" "booking_resource_type" DEFAULT 'generic' NOT NULL,
  "name" varchar(255) NOT NULL,
  "description" text,
  "capacity" integer DEFAULT 1 NOT NULL,
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
  "time_model_override" "booking_time_model",
  "price_label" varchar(100),
  "requires_resource" boolean DEFAULT false NOT NULL,
  "allowed_resource_types" jsonb DEFAULT '[]'::jsonb,
  "active" boolean DEFAULT true NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
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
  "message" text,
  "cancellation_token_hash" varchar(128),
  "cancellation_reason" text,
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

ALTER TABLE "booking_settings" ADD CONSTRAINT "booking_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE cascade;
ALTER TABLE "booking_resources" ADD CONSTRAINT "booking_resources_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE cascade;
ALTER TABLE "booking_services" ADD CONSTRAINT "booking_services_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE cascade;
ALTER TABLE "booking_availability_rules" ADD CONSTRAINT "booking_availability_rules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE cascade;
ALTER TABLE "booking_availability_rules" ADD CONSTRAINT "booking_availability_rules_resource_id_booking_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "booking_resources"("id") ON DELETE cascade;
ALTER TABLE "booking_availability_rules" ADD CONSTRAINT "booking_availability_rules_service_id_booking_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "booking_services"("id") ON DELETE cascade;
ALTER TABLE "booking_blackouts" ADD CONSTRAINT "booking_blackouts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE cascade;
ALTER TABLE "booking_blackouts" ADD CONSTRAINT "booking_blackouts_resource_id_booking_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "booking_resources"("id") ON DELETE cascade;
ALTER TABLE "booking_customers" ADD CONSTRAINT "booking_customers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE cascade;
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE cascade;
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_customer_id_booking_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "booking_customers"("id") ON DELETE set null;
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_service_id_booking_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "booking_services"("id") ON DELETE set null;
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_resource_id_booking_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "booking_resources"("id") ON DELETE set null;
ALTER TABLE "booking_status_history" ADD CONSTRAINT "booking_status_history_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE cascade;
ALTER TABLE "booking_status_history" ADD CONSTRAINT "booking_status_history_booking_id_booking_requests_id_fk" FOREIGN KEY ("booking_id") REFERENCES "booking_requests"("id") ON DELETE cascade;

CREATE UNIQUE INDEX "booking_settings_tenant_idx" ON "booking_settings" ("tenant_id");
CREATE INDEX "booking_resources_tenant_idx" ON "booking_resources" ("tenant_id");
CREATE INDEX "booking_resources_tenant_active_idx" ON "booking_resources" ("tenant_id", "active");
CREATE INDEX "booking_services_tenant_idx" ON "booking_services" ("tenant_id");
CREATE INDEX "booking_services_tenant_active_idx" ON "booking_services" ("tenant_id", "active");
CREATE INDEX "booking_availability_tenant_idx" ON "booking_availability_rules" ("tenant_id");
CREATE INDEX "booking_availability_lookup_idx" ON "booking_availability_rules" ("tenant_id", "weekday", "active");
CREATE INDEX "booking_blackouts_tenant_idx" ON "booking_blackouts" ("tenant_id");
CREATE INDEX "booking_blackouts_lookup_idx" ON "booking_blackouts" ("tenant_id", "starts_at", "ends_at");
CREATE INDEX "booking_customers_tenant_idx" ON "booking_customers" ("tenant_id");
CREATE INDEX "booking_customers_tenant_email_idx" ON "booking_customers" ("tenant_id", "email");
CREATE INDEX "booking_requests_tenant_idx" ON "booking_requests" ("tenant_id");
CREATE INDEX "booking_requests_calendar_idx" ON "booking_requests" ("tenant_id", "starts_at", "ends_at");
CREATE INDEX "booking_requests_status_idx" ON "booking_requests" ("tenant_id", "status");
CREATE INDEX "booking_status_history_booking_idx" ON "booking_status_history" ("booking_id");
CREATE INDEX "booking_status_history_tenant_idx" ON "booking_status_history" ("tenant_id");
