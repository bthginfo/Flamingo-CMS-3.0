CREATE TABLE IF NOT EXISTS "tenant_database_connections" (
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
  CONSTRAINT "tenant_database_connections_tenant_id_tenants_id_fk"
    FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade,
  CONSTRAINT "tenant_database_connections_status_check"
    CHECK ("status" IN ('provisioning', 'active', 'migration_failed', 'deleting'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tenant_database_connections_project_idx"
  ON "tenant_database_connections" USING btree ("project_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tenant_database_connections_status_idx"
  ON "tenant_database_connections" USING btree ("status");
