-- New "verein" (sports club / association) industry. Needed so a real tenant
-- can be created with industry='verein'. The code /demo/eishockey works via the
-- static demo fallback without this, but a live tenant requires the enum value.
-- ALTER TYPE ... ADD VALUE cannot run inside a transaction block; apply directly.
ALTER TYPE "industry" ADD VALUE IF NOT EXISTS 'verein';
