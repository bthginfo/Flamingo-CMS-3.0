CREATE TABLE IF NOT EXISTS "instagram_connections" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL,
  "ig_user_id" varchar(64) NOT NULL,
  "ig_username" varchar(64) NOT NULL,
  "ig_account_type" varchar(20) NOT NULL DEFAULT 'BUSINESS',
  "access_token_encrypted" text NOT NULL,
  "token_expires_at" timestamp with time zone NOT NULL,
  "last_synced_at" timestamp with time zone,
  "last_refreshed_at" timestamp with time zone NOT NULL DEFAULT now(),
  "sync_status" varchar(20) NOT NULL DEFAULT 'ok',
  "sync_error" text,
  "scopes" varchar(255) NOT NULL DEFAULT 'instagram_business_basic',
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instagram_connections" ADD CONSTRAINT "instagram_connections_tenant_id_tenants_id_fk"
   FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "instagram_connections_tenant_idx" ON "instagram_connections" ("tenant_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "instagram_connections_ig_user_idx" ON "instagram_connections" ("ig_user_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "instagram_posts" (
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
  "position" integer NOT NULL DEFAULT 0,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instagram_posts" ADD CONSTRAINT "instagram_posts_connection_id_instagram_connections_id_fk"
   FOREIGN KEY ("connection_id") REFERENCES "public"."instagram_connections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instagram_posts" ADD CONSTRAINT "instagram_posts_tenant_id_tenants_id_fk"
   FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "instagram_posts_connection_media_idx" ON "instagram_posts" ("connection_id", "ig_media_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "instagram_posts_tenant_idx" ON "instagram_posts" ("tenant_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "instagram_posts_position_idx" ON "instagram_posts" ("tenant_id", "position");
