import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const sql = neon(databaseUrl);

await sql(`
DO $$ BEGIN
 CREATE TYPE "crm_blog_post_status" AS ENUM ('draft', 'published', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

await sql(`
CREATE TABLE IF NOT EXISTS "crm_blog_posts" (
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
`);

await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "crm_blog_posts_slug_idx" ON "crm_blog_posts" USING btree ("slug");`);
await sql(`CREATE INDEX IF NOT EXISTS "crm_blog_posts_status_idx" ON "crm_blog_posts" USING btree ("status");`);
await sql(`CREATE INDEX IF NOT EXISTS "crm_blog_posts_published_idx" ON "crm_blog_posts" USING btree ("published_at");`);

console.log('CRM blog post tables are ready.');
