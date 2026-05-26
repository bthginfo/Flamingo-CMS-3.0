DO $$ BEGIN
 CREATE TYPE "crm_customer_status" AS ENUM ('aktiv', 'pausiert', 'gekündigt');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "crm_payment_status" AS ENUM ('offen', 'bezahlt', 'überfällig', 'storniert');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "crm_customers" (
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

CREATE TABLE IF NOT EXISTS "crm_customer_payments" (
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

DO $$ BEGIN
 ALTER TABLE "crm_customers" ADD CONSTRAINT "crm_customers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "crm_customers" ADD CONSTRAINT "crm_customers_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "crm_customer_payments" ADD CONSTRAINT "crm_customer_payments_customer_id_crm_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "crm_customers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "crm_customers_company_idx" ON "crm_customers" USING btree ("company");
CREATE INDEX IF NOT EXISTS "crm_customers_status_idx" ON "crm_customers" USING btree ("status");
CREATE INDEX IF NOT EXISTS "crm_customers_lead_idx" ON "crm_customers" USING btree ("lead_id");
CREATE INDEX IF NOT EXISTS "crm_customer_payments_customer_idx" ON "crm_customer_payments" USING btree ("customer_id");
CREATE INDEX IF NOT EXISTS "crm_customer_payments_status_idx" ON "crm_customer_payments" USING btree ("status");
