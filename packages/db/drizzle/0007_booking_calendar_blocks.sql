CREATE TABLE IF NOT EXISTS "booking_calendar_blocks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "resource_id" uuid REFERENCES "booking_resources"("id") ON DELETE cascade,
  "service_id" uuid REFERENCES "booking_services"("id") ON DELETE cascade,
  "type" varchar(20) DEFAULT 'available' NOT NULL,
  "starts_at" timestamp with time zone NOT NULL,
  "ends_at" timestamp with time zone NOT NULL,
  "capacity" integer,
  "note" varchar(255),
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "booking_calendar_blocks_tenant_idx" ON "booking_calendar_blocks" ("tenant_id");
CREATE INDEX IF NOT EXISTS "booking_calendar_blocks_lookup_idx" ON "booking_calendar_blocks" ("tenant_id", "starts_at", "ends_at", "active");
