import { put } from '@vercel/blob';
import { eq, desc, and } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createDb, type Database } from '@flamingo/db';
import * as schema from '../packages/db/src/schema';
import { provisionTenant } from '../apps/marketing/src/lib/provisioning';
import { getDb } from '../apps/marketing/src/lib/db';
import { getTenantDataDb } from '../apps/marketing/src/lib/tenant-data-db';

type AssetKey =
  | 'logo'
  | 'brandBox'
  | 'agencyReel'
  | 'golfReel'
  | 'heroPortrait'
  | 'studioWide'
  | 'businessCampaign'
  | 'personalBranding'
  | 'portraitStudy'
  | 'eiszeitCover'
  | 'eiszeitSpread'
  | 'golfFrame'
  | 'converseFrame'
  | 'ingolstadtBook'
  | 'archiveStill01'
  | 'archiveStill02'
  | 'archiveStill03'
  | 'archiveStill04'
  | 'aboutPortrait01'
  | 'aboutPortrait02'
  | 'aboutPortrait03'
  | 'aboutStill01'
  | 'eiszeitDetail01'
  | 'eiszeitDetail02'
  | 'portfolioStill01'
  | 'portfolioStill02';

type AssetSpec = {
  source: string;
  filename: string;
  contentType?: string;
  alt: string;
  caption?: string;
};

type UploadedAssets = Record<AssetKey, string>;
type GalleryImportItem = {
  image: string;
  alt: string;
  title: string;
  caption?: string;
  category: string;
  href: string;
  sourceUrl?: string;
  featured?: boolean;
};
type ImportedProject = {
  slug: string;
  title: string;
  priority: number;
  sourceUrl: string;
  category: string;
  description: string;
  image: string;
  gallery: string[];
};
type BuildExtras = {
  importedProjects?: ImportedProject[];
  galleryItems?: GalleryImportItem[];
};
type PageConfig = {
  slug: string;
  title: string;
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: string };
  sections: Array<{
    type: string;
    data: Record<string, unknown>;
    container?: string;
    spacingTop?: string;
    spacingBottom?: string;
    anchorId?: string;
    styleOverrides?: Record<string, unknown>;
  }>;
};

const DRY_RUN = process.argv.includes('--dry-run');
const SLUG = 'schuktuew';
const PROJECT_NAME = `flamingo-${SLUG}`;
const PREVIEW_URL = `https://${PROJECT_NAME}.vercel.app`;
const VERCEL_ENV_PROJECT = process.env.VERCEL_ENV_PROJECT || 'flamingo-cms-3-0';
const ORIGINAL_SITEMAP_URL = 'https://www.schuktuew.com/pages-sitemap.xml';
const ORIGINAL_PAGE_SKIP = new Set(['', 'contact-3', 'blog', 'info', 'press', 'imprint']);
const KNOWN_NON_PROJECT_MEDIA_IDS = new Set([
  '74d7fc_b8b5511660f44ed6bcddd0baba92a192~mv2',
]);
const MAX_ORIGINAL_PROJECTS = Number(process.env.SCHUKTUEW_MAX_ORIGINAL_PROJECTS || '80');
const MAX_IMAGES_PER_PROJECT = Number(process.env.SCHUKTUEW_MAX_IMAGES_PER_PROJECT || '28');
const MAX_CANVAS_ITEMS = Number(process.env.SCHUKTUEW_MAX_CANVAS_ITEMS || '64');

const LOCAL_ASSETS = {
  brandBox: 'C:/Users/vonin-ju/AppData/Local/Temp/codex-clipboard-e93ce390-ba23-47f5-be25-11f7029c7db0.png',
  agencyReel: 'C:/Users/vonin-ju/Downloads/AQO8KdTvkw4Kf6EUxVtCyFRf7F5LifMi8MNwfWLKzqGyyCAykS_K1Ax02ovczX6qyVJ5YWtmE9cfy4uV2rI4MhSDlPmaCCwex2tb3lI.mp4',
  golfReel: 'C:/Users/vonin-ju/Downloads/AQNn_ATz6o4QFuhcsAyoZO7tmcsysRQ9FVASQdNuH-e_4vkH7aiBNuRkTD2sGO1tYKSXSKthmsVOttqAf9IlWn0X4KGbR32PuZgETXg.mp4',
} satisfies Partial<Record<AssetKey, string>>;

const ASSETS: Record<AssetKey, AssetSpec> = {
  logo: {
    source: 'https://static.wixstatic.com/media/74d7fc_b8b5511660f44ed6bcddd0baba92a192~mv2.png/v1/crop/x_0,y_247,w_7000,h_6827/fill/w_324,h_316,al_c,q_90,enc_avif,quality_auto/signatur_logo_neu_mit_name_ohne%20Hintergrund.png',
    filename: 'alexander-schuktuew-logo.png',
    contentType: 'image/png',
    alt: 'Signatur-Logo Alexander Schuktuew',
  },
  brandBox: {
    source: LOCAL_ASSETS.brandBox,
    filename: 'alexander-schuktuew-brand-box.png',
    contentType: 'image/png',
    alt: 'Alexander Schuktuew Creative Studio Brandgrafik',
  },
  agencyReel: {
    source: LOCAL_ASSETS.agencyReel,
    filename: 'alexander-schuktuew-ai-workflow-reel.mp4',
    contentType: 'video/mp4',
    alt: 'Hochformat-Video zu AI-Workflow und Produktion aus einer Hand',
  },
  golfReel: {
    source: LOCAL_ASSETS.golfReel,
    filename: 'alexander-schuktuew-golf-reel.mp4',
    contentType: 'video/mp4',
    alt: 'Hochformat-Video Golfproduktion',
  },
  heroPortrait: {
    source: 'https://static.wixstatic.com/media/74d7fc_d49b1c446fe544e0b4ef0d97df15530a~mv2.jpg/v1/fill/w_1600,h_2000,al_c,q_86,enc_avif,quality_auto/74d7fc_d49b1c446fe544e0b4ef0d97df15530a~mv2.jpg',
    filename: 'schuktuew-hero-portrait.jpg',
    contentType: 'image/jpeg',
    alt: 'Portraitaufnahme aus dem Portfolio von Alexander Schuktuew',
  },
  studioWide: {
    source: 'https://static.wixstatic.com/media/74d7fc_8866c498135940e2af8518e3fdfd02d8%7Emv2.jpg/v1/fit/w_1800,h_958,al_c,q_86,enc_avif,quality_auto/74d7fc_8866c498135940e2af8518e3fdfd02d8%7Emv2.jpg',
    filename: 'schuktuew-studio-wide.jpg',
    contentType: 'image/jpeg',
    alt: 'Breites Bild aus Alexander Schuktuews Website',
  },
  businessCampaign: {
    source: 'https://static.wixstatic.com/media/74d7fc_a06e75c437b14953804f870734a9e24b~mv2.png/v1/fill/w_1665,h_930,q_86,enc_avif,quality_auto/74d7fc_a06e75c437b14953804f870734a9e24b~mv2.png',
    filename: 'schuktuew-business-campaign.png',
    contentType: 'image/png',
    alt: 'Business- und Branding-Fotografie',
  },
  personalBranding: {
    source: 'https://static.wixstatic.com/media/74d7fc_c4c7aca45b494b4eb2dccb5416b78e53~mv2.jpg/v1/fill/w_1665,h_1110,q_86,enc_avif,quality_auto/74d7fc_c4c7aca45b494b4eb2dccb5416b78e53~mv2.jpg',
    filename: 'schuktuew-personal-branding.jpg',
    contentType: 'image/jpeg',
    alt: 'Personal Branding Motiv',
  },
  portraitStudy: {
    source: 'https://static.wixstatic.com/media/74d7fc_6f808a8ce3144875a5691963d6ff3818~mv2.jpg/v1/fill/w_920,h_1385,q_86,enc_avif,quality_auto/74d7fc_6f808a8ce3144875a5691963d6ff3818~mv2.jpg',
    filename: 'schuktuew-portrait-study.jpg',
    contentType: 'image/jpeg',
    alt: 'Portraitstudie',
  },
  eiszeitCover: {
    source: 'https://static.wixstatic.com/media/74d7fc_679b693b746a4d88982a74afbb6bf678~mv2.jpg/v1/fill/w_1264,h_1788,fp_0.42_0.28,q_86,enc_avif,quality_auto/74d7fc_679b693b746a4d88982a74afbb6bf678~mv2.jpg',
    filename: 'schuktuew-eiszeit-cover.jpg',
    contentType: 'image/jpeg',
    alt: 'Buch EISZEIT Motiv',
  },
  eiszeitSpread: {
    source: 'https://static.wixstatic.com/media/74d7fc_e47b937913334ba3ad2ace7d67505e79~mv2.png/v1/fill/w_1800,h_1272,q_86,enc_avif,quality_auto/74d7fc_e47b937913334ba3ad2ace7d67505e79~mv2.png',
    filename: 'schuktuew-eiszeit-spread.png',
    contentType: 'image/png',
    alt: 'EISZEIT Buchstrecke',
  },
  golfFrame: {
    source: 'https://static.wixstatic.com/media/74d7fc_c5f3a877210f452d8c634e30df013e6a~mv2.jpg/v1/fill/w_1196,h_900,q_86,enc_avif,quality_auto/74d7fc_c5f3a877210f452d8c634e30df013e6a~mv2.jpg',
    filename: 'schuktuew-golf-frame.jpg',
    contentType: 'image/jpeg',
    alt: 'Golfproduktion Frame',
  },
  converseFrame: {
    source: 'https://static.wixstatic.com/media/74d7fc_fecce336996c4843be03fd7ce5c965a3~mv2.png/v1/fill/w_1479,h_985,al_c,q_86,enc_avif,quality_auto/Bildschirmfoto%202020-04-16%20um%2012_11_23_pn.png',
    filename: 'schuktuew-converse-frame.png',
    contentType: 'image/png',
    alt: 'Converse Projektmotiv',
  },
  ingolstadtBook: {
    source: 'https://static.wixstatic.com/media/74d7fc_08cc76f170b241caa7837ce1adf5a0fd~mv2.png/v1/fit/w_1600,h_1067,q_86,enc_avif,quality_auto/74d7fc_08cc76f170b241caa7837ce1adf5a0fd~mv2.png',
    filename: 'schuktuew-buch-ingolstadt.png',
    contentType: 'image/png',
    alt: 'Buch Ingolstadt Projektmotiv',
  },
  archiveStill01: {
    source: 'https://static.wixstatic.com/media/74d7fc_06a70cad48304b1fa78225570a667be8~mv2.jpg/v1/fit/w_1600,h_1600,q_86,enc_avif,quality_auto/74d7fc_06a70cad48304b1fa78225570a667be8~mv2.jpg',
    filename: 'schuktuew-archive-still-01.jpg',
    contentType: 'image/jpeg',
    alt: 'Portfolio-Motiv aus dem Schuktuew Archiv',
  },
  archiveStill02: {
    source: 'https://static.wixstatic.com/media/74d7fc_6349f6b1c253419e906ca3f32ab2db8e~mv2.jpg/v1/fit/w_1600,h_1600,q_86,enc_avif,quality_auto/74d7fc_6349f6b1c253419e906ca3f32ab2db8e~mv2.jpg',
    filename: 'schuktuew-archive-still-02.jpg',
    contentType: 'image/jpeg',
    alt: 'Fotografisches Portfolio-Motiv von Alexander Schuktuew',
  },
  archiveStill03: {
    source: 'https://static.wixstatic.com/media/74d7fc_879034e59a604956af32fad136f10c63~mv2.jpg/v1/fit/w_1600,h_1600,q_86,enc_avif,quality_auto/74d7fc_879034e59a604956af32fad136f10c63~mv2.jpg',
    filename: 'schuktuew-archive-still-03.jpg',
    contentType: 'image/jpeg',
    alt: 'Portfolio-Fotografie aus dem Schuktuew Archiv',
  },
  archiveStill04: {
    source: 'https://static.wixstatic.com/media/74d7fc_a3fa53e97c8e44b6ae2f9bdef3bd059c~mv2.jpg/v1/fit/w_1600,h_1600,q_86,enc_avif,quality_auto/74d7fc_a3fa53e97c8e44b6ae2f9bdef3bd059c~mv2.jpg',
    filename: 'schuktuew-archive-still-04.jpg',
    contentType: 'image/jpeg',
    alt: 'Editoriales Portfolio-Motiv von Alexander Schuktuew',
  },
  aboutPortrait01: {
    source: 'https://static.wixstatic.com/media/74d7fc_54e9d6588957403f94cdff1c758c7f1c~mv2.jpg/v1/fit/w_1600,h_1600,q_86,enc_avif,quality_auto/74d7fc_54e9d6588957403f94cdff1c758c7f1c~mv2.jpg',
    filename: 'schuktuew-about-portrait-01.jpg',
    contentType: 'image/jpeg',
    alt: 'Portraitmotiv von Alexander Schuktuew',
  },
  aboutPortrait02: {
    source: 'https://static.wixstatic.com/media/74d7fc_666cf08f881a4489a910caa78e30a222~mv2.jpg/v1/fit/w_1600,h_1600,q_86,enc_avif,quality_auto/74d7fc_666cf08f881a4489a910caa78e30a222~mv2.jpg',
    filename: 'schuktuew-about-portrait-02.jpg',
    contentType: 'image/jpeg',
    alt: 'Portraitarbeit aus dem Schuktuew Archiv',
  },
  aboutPortrait03: {
    source: 'https://static.wixstatic.com/media/74d7fc_4d2f073ec19c4c5498191cf84a071129~mv2.jpg/v1/fit/w_1600,h_1600,q_86,enc_avif,quality_auto/74d7fc_4d2f073ec19c4c5498191cf84a071129~mv2.jpg',
    filename: 'schuktuew-about-portrait-03.jpg',
    contentType: 'image/jpeg',
    alt: 'Dokumentarisches Portraitmotiv von Alexander Schuktuew',
  },
  aboutStill01: {
    source: 'https://static.wixstatic.com/media/74d7fc_d7da0eba7ca8419ca37f3c0f961e7fae~mv2.jpg/v1/fit/w_1600,h_1600,q_86,enc_avif,quality_auto/74d7fc_d7da0eba7ca8419ca37f3c0f961e7fae~mv2.jpg',
    filename: 'schuktuew-about-still-01.jpg',
    contentType: 'image/jpeg',
    alt: 'Fotografisches Motiv aus der Über-mich-Seite',
  },
  eiszeitDetail01: {
    source: 'https://static.wixstatic.com/media/74d7fc_5eae085b0ef946179ab2646810799825~mv2.png/v1/fit/w_1800,h_1400,q_86,enc_avif,quality_auto/74d7fc_5eae085b0ef946179ab2646810799825~mv2.png',
    filename: 'schuktuew-eiszeit-detail-01.png',
    contentType: 'image/png',
    alt: 'EISZEIT Buchdetail',
  },
  eiszeitDetail02: {
    source: 'https://static.wixstatic.com/media/74d7fc_cb8c3da211c443f4a571c78eb8c9d020~mv2.png/v1/fit/w_1600,h_1800,q_86,enc_avif,quality_auto/74d7fc_cb8c3da211c443f4a571c78eb8c9d020~mv2.png',
    filename: 'schuktuew-eiszeit-detail-02.png',
    contentType: 'image/png',
    alt: 'EISZEIT Portraitdetail',
  },
  portfolioStill01: {
    source: 'https://static.wixstatic.com/media/74d7fc_0fe69929ff2744a2a7195e4d0c2065a4~mv2.png/v1/fit/w_1600,h_1200,q_86,enc_avif,quality_auto/74d7fc_0fe69929ff2744a2a7195e4d0c2065a4~mv2.png',
    filename: 'schuktuew-portfolio-still-01.png',
    contentType: 'image/png',
    alt: 'Portfolioarbeit von Alexander Schuktuew',
  },
  portfolioStill02: {
    source: 'https://static.wixstatic.com/media/74d7fc_22f89a923b38480db2f965cfb28d06cd~mv2.jpg/v1/fit/w_1600,h_1200,q_86,enc_avif,quality_auto/74d7fc_22f89a923b38480db2f965cfb28d06cd~mv2.jpg',
    filename: 'schuktuew-portfolio-still-02.jpg',
    contentType: 'image/jpeg',
    alt: 'Weiteres Portfolio-Motiv aus dem Schuktuew Archiv',
  },
};

function isLocalAsset(source: string) {
  return /^[a-z]:\//i.test(source) || source.startsWith('/') || source.startsWith('\\');
}

function extname(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return ext || '.bin';
}

function mimeFromFilename(filename: string) {
  const ext = extname(filename);
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.avif') return 'image/avif';
  if (ext === '.mp4') return 'video/mp4';
  return 'application/octet-stream';
}

async function loadVercelProjectEnv() {
  const token = process.env.VERCEL_TOKEN?.trim();
  if (!token) return;
  const response = await fetch(`https://api.vercel.com/v9/projects/${encodeURIComponent(VERCEL_ENV_PROJECT)}/env?limit=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => null) as { envs?: Array<{ key: string; value?: string; target?: string[] }> } | { error?: unknown } | null;
  if (!response.ok || !data || !('envs' in data)) {
    throw new Error(`Vercel Env konnte nicht geladen werden (${VERCEL_ENV_PROJECT}).`);
  }
  for (const envVar of data.envs || []) {
    if (envVar.key === 'VERCEL_TOKEN') continue;
    const targets = Array.isArray(envVar.target) ? envVar.target : [];
    if (targets.length && !targets.includes('production')) continue;
    const value = typeof envVar.value === 'string' ? envVar.value : '';
    if (!value || value.startsWith('__PLACEHOLDER')) continue;
    if (!process.env[envVar.key]) process.env[envVar.key] = value;
  }
}

function requireEnv(keys: string[]) {
  const missing = keys.filter((key) => !process.env[key]?.trim() || process.env[key]?.startsWith('__PLACEHOLDER'));
  if (missing.length) {
    throw new Error(`Fehlende Env-Werte: ${missing.join(', ')}. Für Schuktuew-Standalone wird insbesondere NEON_API_KEY benötigt.`);
  }
}

async function readAsset(spec: AssetSpec) {
  if (isLocalAsset(spec.source)) {
    const body = await readFile(spec.source);
    return { body, contentType: spec.contentType || mimeFromFilename(spec.filename) };
  }
  const response = await fetch(spec.source, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Asset konnte nicht geladen werden: ${spec.filename} (${response.status})`);
  const body = Buffer.from(await response.arrayBuffer());
  return { body, contentType: spec.contentType || response.headers.get('content-type')?.split(';')[0] || mimeFromFilename(spec.filename) };
}

async function uploadAssets(dataDb: Database, tenantId: string): Promise<UploadedAssets> {
  const output = {} as UploadedAssets;
  for (const [key, spec] of Object.entries(ASSETS) as Array<[AssetKey, AssetSpec]>) {
    const { body, contentType } = await readAsset(spec);
    const pathname = `${tenantId}/media/schuktuew/${key}${extname(spec.filename)}`;
    const blob = await put(pathname, body, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    output[key] = blob.url;
    const [existing] = await dataDb.select({ id: schema.mediaAssets.id }).from(schema.mediaAssets)
      .where(and(eq(schema.mediaAssets.tenantId, tenantId), eq(schema.mediaAssets.blobUrl, blob.url)))
      .limit(1);
    if (!existing) {
      await dataDb.insert(schema.mediaAssets).values({
        tenantId,
        blobUrl: blob.url,
        pathname: blob.pathname,
        filename: spec.filename,
        mimeType: contentType,
        size: body.byteLength,
        alt: spec.alt,
        caption: spec.caption || null,
        folder: 'Schuktuew Relaunch',
        metadata: { source: isLocalAsset(spec.source) ? pathToFileURL(spec.source).toString() : spec.source, seed: 'schuktuew' },
      });
    }
    console.log(`Asset importiert: ${key}`);
  }
  return output;
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\\u002F/g, '/');
}

function slugFromUrl(url: string) {
  try {
    return new URL(url).pathname.replace(/^\/+|\/+$/g, '').trim();
  } catch {
    return '';
  }
}

function titleFromSlug(slug: string) {
  const special: Record<string, string> = {
    'clients-selection': 'Clients Selection',
    'rosa-hirn': 'Rosa Hirn',
    'zu-tisch-mit': 'Zu Tisch mit',
    'wedding-hochzeitsfotografie': 'Wedding / Hochzeitsfotografie',
    'eiszeitercingolstadteishockey': 'EISZEIT ERC Ingolstadt',
    'kajan-luc': 'Kajan & Luc',
    'efs-recruiting-campaign': 'EFS Recruiting Campaign',
    'tennis-player-elio-sayeed': 'Tennis Player Elio Sayeed',
    'new-book': 'New Book',
    selfportraits: 'Selfportraits',
    'snc-recs': 'SNC RECS',
    prrrrr: 'PRRRRR',
    'buch-ingolstadt': 'Buch Ingolstadt',
    'levi-s-skateboarding': "Levi's Skateboarding",
    'gutman-gladiators-hockey': 'Gutman Gladiators Hockey',
    'athlete-sofie-nixdorf': 'Athlete Sofie Nixdorf',
    'xx-ww-33': 'XX WW 33',
    'eps-51': 'EPS 51',
    'golf-1': 'Golf',
    'juliane-pittermann': 'Juliane Pittermann',
  };
  if (special[slug]) return special[slug];
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.length <= 3 ? part.toUpperCase() : `${part[0]?.toUpperCase() || ''}${part.slice(1)}`)
    .join(' ');
}

function categoryFromSlug(slug: string) {
  if (/(golf|tennis|soccer|skate|boulder|hockey|athlete|sport|gladiators)/i.test(slug)) return 'Sport';
  if (/(portrait|selfportrait|juliane|kajan|personal)/i.test(slug)) return 'Portrait';
  if (/(wedding|hochzeit)/i.test(slug)) return 'Wedding';
  if (/(commercial|converse|client|efs|recruiting|candy|liquid|blackworks)/i.test(slug)) return 'Commercial';
  if (/(book|buch|eiszeit|ingolstadt)/i.test(slug)) return 'Buchprojekt';
  if (/(film|recs|zenit|konnekte|rosa|tisch|prrrrr|eps|xx)/i.test(slug)) return 'Freie Arbeit';
  return 'Portfolio';
}

function extractMeta(html: string, key: string) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const propertyFirst = new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i');
  const contentFirst = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, 'i');
  return decodeHtml(propertyFirst.exec(html)?.[1] || contentFirst.exec(html)?.[1] || '').trim();
}

function cleanOriginalTitle(value: string, slug: string) {
  const title = decodeHtml(value)
    .replace(/\s+[|–-]\s+Alexander\s+Schuktuew.*$/i, '')
    .replace(/\s+[|–-]\s+Schuktuew.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  return title && !/^home$/i.test(title) ? title : titleFromSlug(slug);
}

function mediaIdFromUrl(url: string) {
  const decoded = decodeURIComponent(url);
  return decoded.match(/74d7fc_[^~\/]+~mv2/i)?.[0] || '';
}

function mediaScore(url: string) {
  const decoded = decodeURIComponent(url);
  const width = Number(decoded.match(/(?:^|[,_/])w_(\d+)/i)?.[1] || 0);
  const height = Number(decoded.match(/(?:^|[,_/])h_(\d+)/i)?.[1] || 0);
  return { width, height, score: (width || 900) * (height || 900) };
}

function normaliseWixImageUrl(url: string) {
  return decodeHtml(url)
    .replace(/\\\//g, '/')
    .replace(/%7E/gi, '~')
    .replace(/,\s*enc_auto/gi, '')
    .trim();
}

function extractWixImages(html: string) {
  const source = decodeHtml(html);
  const raw = new Set<string>();
  const direct = source.match(/https:\/\/static\.wixstatic\.com\/media\/[^"'<>\\\s)]+/g) || [];
  for (const url of direct) raw.add(normaliseWixImageUrl(url));
  const escaped = source.match(/https:\\\/\\\/static\.wixstatic\.com\\\/media\\\/[^"'<>\\\s)]+/g) || [];
  for (const url of escaped) raw.add(normaliseWixImageUrl(url));

  const bestById = new Map<string, string>();
  for (const url of raw) {
    if (!/\.(?:jpe?g|png|webp)(?:[/?#]|$)/i.test(url)) continue;
    const id = mediaIdFromUrl(url);
    if (!id || KNOWN_NON_PROJECT_MEDIA_IDS.has(id)) continue;
    if (/(favicon|icon|button|social|instagram|facebook|twitter|youtube|logo|signatur)/i.test(url)) continue;
    const size = mediaScore(url);
    if ((size.width && size.width < 360) || (size.height && size.height < 240)) continue;
    const previous = bestById.get(id);
    if (!previous || mediaScore(previous).score < size.score) bestById.set(id, url);
  }
  return Array.from(bestById.values());
}

async function fetchWithUserAgent(url: string) {
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; FlamingoCMS/1.0; +https://www.flamingomedia.online)',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });
  if (!response.ok) throw new Error(`Originalseite konnte nicht gelesen werden: ${url} (${response.status})`);
  return response.text();
}

async function importOriginalProjectGalleries(): Promise<{ importedProjects: ImportedProject[]; galleryItems: GalleryImportItem[] }> {
  const sitemapXml = await fetchWithUserAgent(ORIGINAL_SITEMAP_URL);
  const locs = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => decodeHtml(match[1] || '').trim()).filter(Boolean);
  const projectUrls = locs
    .map((url) => ({ url, slug: slugFromUrl(url) }))
    .filter((entry) => entry.slug && !ORIGINAL_PAGE_SKIP.has(entry.slug))
    .slice(0, MAX_ORIGINAL_PROJECTS);

  const importedProjects: ImportedProject[] = [];
  const galleryItems: GalleryImportItem[] = [];
  let priority = 100;
  const seenCanvasImages = new Set<string>();

  for (const { url, slug } of projectUrls) {
    try {
      const html = await fetchWithUserAgent(url);
      const images = extractWixImages(html).slice(0, MAX_IMAGES_PER_PROJECT);
      if (!images.length) continue;
      const title = cleanOriginalTitle(extractMeta(html, 'og:title') || extractMeta(html, 'twitter:title'), slug);
      const description = (extractMeta(html, 'description') || extractMeta(html, 'og:description') || '')
        .replace(/\s+/g, ' ')
        .replace(/^Alexander Schuktuew\s*[-|–]\s*/i, '')
        .trim();
      const category = categoryFromSlug(slug);
      const project: ImportedProject = {
        slug,
        title,
        priority,
        sourceUrl: url,
        category,
        description,
        image: images[0],
        gallery: images,
      };
      importedProjects.push(project);
      priority += 10;

      for (const [index, image] of images.entries()) {
        if (seenCanvasImages.has(image) || galleryItems.length >= MAX_CANVAS_ITEMS) continue;
        seenCanvasImages.add(image);
        galleryItems.push({
          image,
          alt: `${title} ${index + 1}`,
          title,
          caption: description,
          category,
          href: `/c/projekte/${slug}`,
          sourceUrl: url,
          featured: index === 0 && galleryItems.length % 9 === 0,
        });
      }
      console.log(`Originalgalerie importiert: ${slug} (${images.length} Bilder)`);
      await new Promise((resolve) => setTimeout(resolve, 180));
    } catch (error) {
      console.warn(`Originalgalerie übersprungen: ${slug} (${error instanceof Error ? error.message : String(error)})`);
    }
  }

  return { importedProjects, galleryItems };
}

function sectionIdentity(type: string) {
  return { definitionKey: `${type}.advanced.v1`, schemaVersion: 1 };
}

function regularSectionIdentity(type: string) {
  if (['editorialHero', 'contact', 'faq', 'ctaBand'].includes(type)) return { definitionKey: `${type}.photography.v1`, schemaVersion: 1 };
  return sectionIdentity(type);
}

function buildSite(assets: UploadedAssets, extras: BuildExtras = {}) {
  const brand = {
    companyName: 'Studio Alexander Schuktuew',
    tagline: 'Visual Solutions · Multidisciplinary Media Production',
    logoUrl: assets.logo,
    faviconUrl: assets.logo,
    logoDisplay: 'logo',
    primaryColor: '#f4eee3',
    secondaryColor: '#0a0a0a',
    accentColor: '#d11224',
    pageBg: '#050505',
    sectionBg: '#070707',
    sectionBgAlt: '#111111',
    cardBg: '#101010',
    headingColor: '#f7f2e8',
    bodyTextColor: '#ded6ca',
    mutedTextColor: '#a79f95',
    navBgColor: '#050505',
    navLinkColor: '#f7f2e8',
    navBrandColor: '#f7f2e8',
    navLogoColor: '#f7f2e8',
    topBarColor: '#d11224',
    footerColor: '#050505',
    footerTextColor: '#cfc7bb',
    footerLinkColor: '#ffffff',
    linkColor: '#f4eee3',
    linkHoverColor: '#d11224',
    btnPrimaryBg: '#f4eee3',
    btnPrimaryText: '#080808',
    btnSecondaryBg: '#111111',
    btnSecondaryText: '#f7f2e8',
    btnSecondaryBorder: '#38322c',
    btnOutlineBg: '#090909',
    btnOutlineText: '#f7f2e8',
    btnOutlineBorder: '#50483f',
    badgeBg: '#17110f',
    badgeText: '#f4eee3',
    badgeBorder: '#3a312b',
    cardBorder: '#2a2621',
    borderColor: '#2a2621',
    dividerColor: '#2a2621',
    iconColor: '#d11224',
    cardRadius: '1.55rem',
    btnRadius: '999px',
    headingFont: 'Space Grotesk',
    bodyFont: 'Inter',
    localSeo: {
      businessType: 'ProfessionalService',
      serviceArea: 'Ingolstadt, München',
      sameAs: ['https://www.schuktuew.com/', 'https://www.instagram.com/alexanderschuktuew/'],
      services: [
        { name: 'Business- & Branding-Fotografie', url: '/' },
        { name: 'Personal Branding Portraits', url: '/portfolio' },
        { name: 'Portraitfotografie', url: '/ueber-mich' },
        { name: 'Commercial Photography', url: '/portfolio' },
        { name: 'Fashion Photography', url: '/portfolio' },
        { name: 'Sports Photography', url: '/portfolio' },
        { name: 'AI-gestützte Foto- und Film-Workflows', url: '/ai-workflows' },
      ],
    },
  };

  const contact = {
    phone: '0176 38365914',
    email: 'contact@schuktuew.com',
    address: 'Ingolstadt · München',
  };

  const navigationItems = [
    { label: 'Portfolio', href: '/portfolio', type: 'link' },
    { label: 'AI Workflows', href: '/ai-workflows', type: 'link' },
    { label: 'Über mich', href: '/ueber-mich', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ];

  const footerColumns = [
    { title: 'Studio', items: [
      { text: 'Portfolio', href: '/portfolio' },
      { text: 'AI Workflows', href: '/ai-workflows' },
      { text: 'Über mich', href: '/ueber-mich' },
    ] },
    { title: 'Arbeiten', items: [
      { text: 'Portrait', href: '/portfolio' },
      { text: 'Business & Branding', href: '/portfolio' },
      { text: 'Sport & Golf', href: '/portfolio' },
      { text: 'EISZEIT', href: '/portfolio' },
    ] },
    { title: 'Kontakt', items: [
      { text: 'contact@schuktuew.com', href: 'mailto:contact@schuktuew.com' },
      { text: '0176 38365914', href: 'tel:+4917638365914' },
      { text: 'Ingolstadt · München' },
    ] },
  ];

  const projects = [
    {
      slug: 'business-branding',
      title: 'Business- & Branding-Fotografie',
      priority: 10,
      data: {
        category: 'Branding',
        description: 'Visuelle Auftritte für Unternehmen, Marken und Persönlichkeiten, die nicht austauschbar wirken wollen.',
        image: assets.businessCampaign,
        sourceUrl: 'https://www.schuktuew.com/',
      },
    },
    {
      slug: 'personal-branding',
      title: 'Personal Branding Portraits',
      priority: 20,
      data: {
        category: 'Portrait',
        description: 'Portraits, die Haltung, Persönlichkeit und Positionierung sichtbar machen.',
        image: assets.personalBranding,
        sourceUrl: 'https://www.schuktuew.com/',
      },
    },
    {
      slug: 'sport-golf',
      title: 'Golf & Sport',
      priority: 30,
      data: {
        category: 'Sport',
        description: 'Dynamische Sportproduktion im Hochformat- und Kampagnenkontext.',
        image: assets.golfFrame,
        video: assets.golfReel,
        sourceUrl: 'https://www.schuktuew.com/golf',
      },
    },
    {
      slug: 'eiszeit-erc-ingolstadt',
      title: 'Buch: EISZEIT',
      priority: 40,
      data: {
        category: 'Dokumentarisch',
        description: 'Begleitung des ERC Ingolstadt und des Lebens um den Sport hinter den Kulissen der Saison 23/24.',
        image: assets.eiszeitCover,
        sourceUrl: 'https://www.schuktuew.com/eiszeitercingolstadteishockey',
      },
    },
    {
      slug: 'converse',
      title: 'CONVERSE',
      priority: 50,
      data: {
        category: 'Commercial',
        description: 'Commercial-Arbeit aus dem Portfolio.',
        image: assets.converseFrame,
        sourceUrl: 'https://www.schuktuew.com/converse',
      },
    },
    {
      slug: 'buch-ingolstadt',
      title: 'Buch: INGOLSTADT',
      priority: 60,
      data: {
        category: 'Buchprojekt',
        description: 'Freies fotografisches Projekt aus dem Portfolio.',
        image: assets.ingolstadtBook,
        sourceUrl: 'https://www.schuktuew.com/buch-ingolstadt',
      },
    },
  ];

  const canonicalSlugBySourceUrl = new Map(projects.map((project) => [project.data.sourceUrl, project.slug]).filter(([sourceUrl]) => Boolean(sourceUrl)));
  const importedBySourceUrl = new Map((extras.importedProjects || []).map((project) => [project.sourceUrl, project]));
  const curatedProjects = projects.map((project) => {
    const imported = importedBySourceUrl.get(project.data.sourceUrl);
    const gallery = imported?.gallery?.length ? imported.gallery : [project.data.image].filter(Boolean);
    return { ...project, data: { ...project.data, gallery } };
  });
  const existingSourceUrls = new Set(canonicalSlugBySourceUrl.keys());
  const importedProjects = (extras.importedProjects || [])
    .filter((project) => project.image && project.gallery.length > 0 && !existingSourceUrls.has(project.sourceUrl))
    .map((project) => ({
      slug: project.slug,
      title: project.title,
      priority: project.priority,
      data: {
        category: project.category,
        description: project.description,
        image: project.image,
        gallery: project.gallery,
        sourceUrl: project.sourceUrl,
      },
    }));
  const allProjects = [...curatedProjects, ...importedProjects];
  const importedGalleryItems = (extras.galleryItems || []).map((item) => {
    const canonicalSlug = item.sourceUrl ? canonicalSlugBySourceUrl.get(item.sourceUrl) : null;
    return canonicalSlug ? { ...item, href: `/c/projekte/${canonicalSlug}` } : item;
  });
  const seenPortfolioImages = new Set<string>();
  const portfolioItems = [
    ...allProjects.map((project) => ({
      image: project.data.image,
      alt: project.title,
      title: project.title,
      caption: project.data.description,
      category: project.data.category,
      href: `/c/projekte/${project.slug}`,
      featured: ['business-branding', 'eiszeit-erc-ingolstadt'].includes(project.slug),
    })),
    ...importedGalleryItems,
    { image: assets.archiveStill01, alt: 'Portfolio-Motiv', title: 'Archivmotiv', caption: '', category: 'Archiv', featured: true },
    { image: assets.archiveStill02, alt: 'Portfolio-Motiv', title: 'Archivmotiv', caption: '', category: 'Archiv' },
    { image: assets.archiveStill03, alt: 'Portfolio-Motiv', title: 'Archivmotiv', caption: '', category: 'Editorial' },
    { image: assets.archiveStill04, alt: 'Portfolio-Motiv', title: 'Archivmotiv', caption: '', category: 'Archiv' },
    { image: assets.aboutPortrait01, alt: 'Portraitmotiv', title: 'Portrait', caption: '', category: 'Portrait', featured: true },
    { image: assets.aboutPortrait02, alt: 'Portraitmotiv', title: 'Portrait', caption: '', category: 'Portrait' },
    { image: assets.aboutPortrait03, alt: 'Dokumentarisches Portrait', title: 'Portrait', caption: '', category: 'Portrait' },
    { image: assets.aboutStill01, alt: 'Fotografisches Motiv', title: 'Still', caption: '', category: 'Archiv' },
    { image: assets.eiszeitDetail01, alt: 'EISZEIT Buchdetail', title: 'EISZEIT', caption: '', category: 'Buchprojekt', featured: true },
    { image: assets.eiszeitDetail02, alt: 'EISZEIT Portraitdetail', title: 'EISZEIT', caption: '', category: 'Buchprojekt' },
    { image: assets.portfolioStill01, alt: 'Portfolioarbeit', title: 'Portfolio', caption: '', category: 'Archiv' },
    { image: assets.portfolioStill02, alt: 'Portfolioarbeit', title: 'Portfolio', caption: '', category: 'Archiv' },
  ].filter((item) => {
    if (!item.image || seenPortfolioImages.has(item.image)) return false;
    seenPortfolioImages.add(item.image);
    return true;
  }).slice(0, MAX_CANVAS_ITEMS);

  const pages: PageConfig[] = [
    {
      slug: 'startseite',
      title: 'Startseite',
      seo: {
        metaTitle: 'Alexander Schuktuew · Foto, Film & AI Workflows',
        metaDescription: 'Studio Alexander Schuktuew aus Ingolstadt und München: Portrait, Business Branding, Sport und AI-gestützte Foto- und Filmproduktion.',
        ogImage: assets.brandBox,
      },
      sections: [
        {
          type: 'editorialHero',
          anchorId: 'top',
          data: {
            eyebrow: 'Studio Alexander Schuktuew',
            headline: 'Fotografie, Film und AI Workflows für Marken mit Haltung.',
            text: '<p>Fotografie für Unternehmen, Persönlichkeiten, für dich und dein Branding. Aus Ingolstadt und München entstehen visuelle Auftritte, die klar positionieren statt austauschbar zu wirken.</p>',
            imagePrimary: assets.heroPortrait,
            imageSecondary: assets.brandBox,
            primaryCta: { label: 'Termin buchen', href: '/kontakt' },
            secondaryCta: { label: 'Portfolio ansehen', href: '/portfolio' },
            hint: 'Ingolstadt · München · Visual Solutions',
          },
          styleOverrides: { sectionBg: '#050505', headingColor: '#f7f2e8', bodyColor: '#ded6ca', btnBg: '#f4eee3', btnText: '#080808' },
        },
        {
          type: 'kineticIdentity',
          data: {
            badge: 'Positionierung',
            headline: 'Kein Standardbild. Ein visueller Auftritt.',
            subline: 'Ein Auftritt entscheidet in Sekunden. Für Unternehmen, Marken und Persönlichkeiten entstehen Bilder, die Haltung, Vertrauen und Charakter sichtbar machen.',
            preset: 'editorial',
            statements: [
              { prefix: 'Keine', highlight: 'Headshots', suffix: 'von der Stange.', text: 'Sondern gezielt entwickelte Markenbilder, die Autorität, Selbstbewusstsein und Individualität sichtbar machen.', image: assets.businessCampaign },
              { prefix: 'Nicht nur', highlight: 'Fotograf', suffix: 'sondern Markenblick.', text: 'Alexander denkt den visuellen Auftritt strategisch: Werte, Haltung und Identität werden in Bildsprache übersetzt.', image: assets.personalBranding },
              { prefix: 'Portraits mit', highlight: 'Klarheit', suffix: 'und Charakter.', text: 'Zwischen dokumentarischer Genauigkeit und reduzierter Bildsprache geht es um Präsenz, Ruhe und den richtigen Moment.', image: assets.portraitStudy },
            ],
            cta: { label: 'Anfrage starten', href: '/kontakt' },
          },
        },
        {
          type: 'aiWorkflowReel',
          data: {
            badge: 'AI Production System',
            headline: 'Foto, Film und Content aus einer Hand.',
            subline: 'Konzept, Bildwelt, Shooting, Schnitt und Formatadaption greifen ineinander. So entsteht Content, der zur Marke passt und schneller einsatzbereit ist.',
            media: {
              videoSrc: assets.agencyReel,
              poster: assets.businessCampaign,
              caption: 'Produktion für Content, Kampagnen und Social Assets.',
            },
            steps: [
              { kicker: '01 · Direction', title: 'Visuelle Positionierung', text: 'Werte, Zielgruppe und Haltung werden in Moodboard, Licht, Look und Bildsprache übersetzt.', proof: 'Branding-Beratung & Moodboard' },
              { kicker: '02 · Production', title: 'Foto & Film aus einer Hand', text: 'Shooting im Studio oder on location, mit klarer Führung bei Posing, Ausdruck und Licht.', proof: 'Studio oder On-Location' },
              { kicker: '03 · Workflow', title: 'Formate schneller ableiten', text: 'Varianten, Zuschnitte und Content-Adaptionen werden früh mitgedacht. Die Bildsprache bleibt bewusst geführt.', proof: 'Reels, Ads, Website, Social' },
              { kicker: '04 · Output', title: 'Fertige Assets für echte Kanäle', text: 'Aus der Produktion entstehen Motive für Website, Kampagne, Recruiting, Personal Branding und Social Media.', proof: 'Kampagnenfähig' },
            ],
            cta: { label: 'Workflow besprechen', href: '/kontakt' },
          },
        },
        {
          type: 'cameraExplodeScroll',
          data: {
            badge: 'Behind the System',
            headline: 'Was aus einer Kamera herauskommt, wird vorher konstruiert.',
            subline: 'Ein starkes Bild entsteht aus Entscheidungen: Haltung, Licht, Motivführung, Nachbearbeitung und kanalreife Übergabe.',
            brandImage: assets.brandBox,
            parts: [
              { id: 'body', label: 'Brand Body', text: 'Markenkern, Haltung und Kontext bestimmen den Look.', offsetX: -128, offsetY: -20, color: '#f4eee3' },
              { id: 'lens', label: 'Lens', text: 'Das Motiv wird fokussiert, nicht nur aufgenommen.', offsetX: 0, offsetY: -118, color: '#080808' },
              { id: 'sensor', label: 'Sensor', text: 'Look, Retusche und Kanalformate werden früh eingeplant.', offsetX: 122, offsetY: -8, color: '#d11224' },
              { id: 'light', label: 'Light', text: 'Licht trennt normales Bild von Kampagnenwirkung.', offsetX: -84, offsetY: 96, color: '#ffffff' },
              { id: 'output', label: 'Output', text: 'Website, Ads, Social, Editorial und Sales bekommen konsistente Assets.', offsetX: 104, offsetY: 96, color: '#c7ff4a' },
            ],
            cta: { label: 'System ansehen', href: '/ai-workflows' },
          },
        },
        {
          type: 'materialAtelier',
          data: {
            badge: 'Arbeitsfelder',
            headline: 'Von Portrait bis Buchprojekt.',
            subline: 'Die wichtigsten Linien aus Portrait, Business, Sport, Commercial und Buchprojekten.',
            preset: 'editorial',
            items: [
              { id: 'business', kicker: 'Business', title: 'Branding & Kampagne', text: 'Starke Bildwelten für Kommunikation, Marketing und Employer Branding.', image: assets.businessCampaign, href: '/portfolio', meta: ['Branding', 'Campaign', 'Employer Branding'] },
              { id: 'portrait', kicker: 'Portrait', title: 'Persönlichkeiten sichtbar machen', text: 'Portraits, die zeigen, wer eine Person ist und wofür sie steht.', image: assets.personalBranding, href: '/ueber-mich', meta: ['Portrait', 'Personal Branding'] },
              { id: 'sport', kicker: 'Sport', title: 'Golf & Bewegung', text: 'Sportmotive und Reels im Kontext von Tempo, Präzision und Bewegung.', image: assets.golfFrame, href: '/portfolio', meta: ['Sport', 'Golf', 'Reel'] },
              { id: 'eiszeit', kicker: 'Buch', title: 'EISZEIT', text: 'Dokumentarisches Buchprojekt über den ERC Ingolstadt und das Leben um den Sport.', image: assets.eiszeitCover, href: '/portfolio', meta: ['ERC Ingolstadt', 'Saison 23/24'] },
              { id: 'commercial', kicker: 'Commercial', title: 'CONVERSE', text: 'Bestehende Commercial-Arbeit aus dem Portfolio.', image: assets.converseFrame, href: '/portfolio', meta: ['Commercial', 'Archive'] },
              { id: 'book', kicker: 'Buch', title: 'INGOLSTADT', text: 'Freie fotografische Arbeit im Buch- und Ausstellungskontext.', image: assets.ingolstadtBook, href: '/portfolio', meta: ['Book', 'Documentary'] },
            ],
            cta: { label: 'Portfolio öffnen', href: '/portfolio' },
          },
        },
        {
          type: 'verticalReelShowcase',
          data: {
            badge: 'Reels & Motion',
            headline: 'Hochformat bleibt Hochformat.',
            subline: 'Reels und Motion bleiben im vertikalen Format sichtbar und können direkt als Referenz wirken.',
            aspectRatio: '9/16',
            reels: [
              { eyebrow: 'Production', title: 'Alles aus einer Hand', text: 'Foto, Film, Schnitt und Content-Varianten für Markenauftritte.', videoSrc: assets.agencyReel, poster: assets.businessCampaign, meta: '9:16', ctaLabel: 'Anfragen', ctaHref: '/kontakt' },
              { eyebrow: 'Golf', title: 'Sport in Bewegung', text: 'Golf-Reel als eigener Sport-/Commercial-Kontext.', videoSrc: assets.golfReel, poster: assets.golfFrame, meta: 'Sport Reel', ctaLabel: 'Sport ansehen', ctaHref: '/portfolio' },
            ],
            cta: { label: 'Produktion planen', href: '/kontakt' },
          },
        },
      ],
    },
    {
      slug: 'portfolio',
      title: 'Portfolio',
      seo: {
        metaTitle: 'Portfolio · Alexander Schuktuew',
        metaDescription: 'Auswahl aus Portrait, Business Branding, Sport, Commercial und dokumentarischen Buchprojekten von Alexander Schuktuew.',
        ogImage: assets.businessCampaign,
      },
      sections: [
        {
          type: 'cinematicChapters',
          data: {
            badge: 'Portfolio',
            headline: 'Arbeiten als Kapitel, nicht als Bilderstapel.',
            intro: 'Portrait, Business, Sport, Commercial und Buchprojekte werden als klare Kapitel geführt.',
            transition: 'depth',
            chapters: [
              { kicker: 'Branding', title: 'Auftritt, der gewinnt.', text: 'Business- und Kampagnenbilder für Unternehmen, Marken und Persönlichkeiten.', image: assets.businessCampaign, ctaLabel: 'Anfragen', ctaHref: '/kontakt' },
              { kicker: 'Portrait', title: 'Präsenz vor Technik.', text: 'Portraitfotografie mit dokumentarischer Genauigkeit und klar reduzierter Bildsprache.', image: assets.portraitStudy, ctaLabel: 'Über Alexander', ctaHref: '/ueber-mich' },
              { kicker: 'Sport', title: 'Bewegung präzise geführt.', text: 'Sport und Golf als visuelle Bühne für Tempo, Konzentration und Form.', image: assets.golfFrame, ctaLabel: 'Kontakt', ctaHref: '/kontakt' },
              { kicker: 'Dokumentarisch', title: 'EISZEIT.', text: 'Im Auftrag des ERC Ingolstadt: eine Saison 23/24 hinter den Kulissen, veröffentlicht im April 2024.', image: assets.eiszeitSpread, ctaLabel: 'Projekt anfragen', ctaHref: '/kontakt' },
            ],
          },
        },
        {
          type: 'infiniteCanvas',
          data: {
            badge: 'Work Map',
            headline: 'Zieh dich durch die Bildwelt.',
            subline: 'Eine offene Bildlandkarte aus Portfolio, Portraits, Sport, Commercial und Buchprojekten.',
            ctaLabel: 'Canvas öffnen',
            items: portfolioItems,
          },
        },
        {
          type: 'editorialCardMorph',
          data: {
            badge: 'Cases',
            headline: 'Ausgewählte Linien.',
            subline: 'Jede Linie zeigt Kontext, Bildsprache und Einsatzfeld auf einen Blick.',
            layout: 'rail',
            items: allProjects.slice(0, 24).map((project) => ({
              id: project.slug,
              kicker: project.data.category,
              title: project.title,
              text: project.data.description,
              image: project.data.image,
              href: `/c/projekte/${project.slug}`,
              ctaLabel: 'Öffnen',
              facts: [],
            })),
          },
        },
      ],
    },
    {
      slug: 'ai-workflows',
      title: 'AI Workflows',
      seo: {
        metaTitle: 'AI Workflows · Alexander Schuktuew',
        metaDescription: 'AI-gestützte Foto- und Filmproduktion: Konzept, Shooting, Schnitt, Varianten und kanalreife Assets aus einer Hand.',
        ogImage: assets.brandBox,
      },
      sections: [
        {
          type: 'aiWorkflowReel',
          data: {
            badge: 'Workflow',
            headline: 'Von Markenidee zu kanalreifen Assets.',
            subline: 'Bildsprache, Führung und finale Entscheidung bleiben klar gestaltet. Varianten und Formate werden so vorbereitet, dass sie für Website, Social und Kampagne funktionieren.',
            media: { videoSrc: assets.agencyReel, poster: assets.businessCampaign, caption: 'Foto, Film, Reels, Website und Kampagne aus einem konsistenten Look.' },
            steps: [
              { kicker: 'Analyse', title: 'Marke lesen', text: 'Ziel, Haltung und Kontext werden vor dem Shooting geklärt.', proof: 'Moodboard statt Zufall' },
              { kicker: 'Produktion', title: 'Shooting führen', text: 'Licht, Ausdruck, Outfit und Location werden präzise geführt.', proof: 'Studio oder on location' },
              { kicker: 'Post', title: 'Look entwickeln', text: 'Retusche, Grading und Varianten werden konsistent angelegt.', proof: 'Ein Look, viele Formate' },
              { kicker: 'Distribution', title: 'Ausliefern', text: 'Website, Social, Ads und Sales bekommen passende Formate.', proof: 'Output-ready' },
            ],
            cta: { label: 'Workflow anfragen', href: '/kontakt' },
          },
        },
        {
          type: 'cameraExplodeScroll',
          data: {
            badge: 'Scroll Model',
            headline: 'Die Produktion wird zerlegt, damit das Ergebnis kontrollierbar wird.',
            subline: 'Von Briefing bis Übergabe: Jeder Teil der Produktion zahlt auf Wirkung, Wiedererkennbarkeit und Verwendbarkeit ein.',
            brandImage: assets.brandBox,
            parts: [
              { id: 'brief', label: 'Brief', text: 'Ziel und Kanäle klären.', offsetX: -132, offsetY: -22, color: '#f4eee3' },
              { id: 'lens', label: 'Look', text: 'Bildsprache und Licht definieren.', offsetX: 0, offsetY: -124, color: '#070707' },
              { id: 'sensor', label: 'Sensor', text: 'Varianten, Formate und Tempo.', offsetX: 124, offsetY: -10, color: '#d11224' },
              { id: 'shoot', label: 'Shoot', text: 'Produktion mit klarer Führung.', offsetX: -94, offsetY: 102, color: '#ffffff' },
              { id: 'asset', label: 'Assets', text: 'Kanalreife Übergabe.', offsetX: 106, offsetY: 98, color: '#c7ff4a' },
            ],
            cta: { label: 'Mit Alex sprechen', href: '/kontakt' },
          },
        },
      ],
    },
    {
      slug: 'ueber-mich',
      title: 'Über mich',
      seo: {
        metaTitle: 'Über mich · Alexander Schuktuew',
        metaDescription: 'Alexander Schuktuew: Portraitfotograf aus dem Raum München und Ingolstadt mit Hintergrund in Visual Journalism und dokumentarischer Fotografie.',
        ogImage: assets.studioWide,
      },
      sections: [
        {
          type: 'editorialHero',
          data: {
            eyebrow: 'Über mich',
            headline: 'Ruhig, präzise, auf den Menschen konzentriert.',
            text: '<p>Alexander Schuktuew ist Fotograf mit Schwerpunkt auf Portraitfotografie. Er arbeitet für Unternehmen, Editorial und freie Projekte aus dem Raum München und Ingolstadt.</p>',
            imagePrimary: assets.studioWide,
            imageSecondary: assets.portraitStudy,
            primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' },
            secondaryCta: { label: 'Portfolio', href: '/portfolio' },
            hint: 'Portrait · Commercial · Fashion · Sport',
          },
        },
        {
          type: 'signaturePath',
          data: {
            badge: 'Werdegang',
            headline: 'Visual Journalism, Berlin, eigene Projekte.',
            subline: 'Ausbildung, Assistenz, Portraitarbeit und freie Projekte prägen den fotografischen Blick.',
            pathPreset: 'flow',
            items: [
              { id: 'visual-journalism', title: 'Visual Journalism', text: 'Ausbildung im Bereich Visual Journalism an der Hochschule Hannover – dokumentarische Fotografie und erzählerischer Blick.', image: assets.studioWide },
              { id: 'berlin', title: 'Assistenz bei Oliver Mark', text: 'Zeit in Berlin als Assistent bei Oliver Mark, einem prägenden Portraitfotografen im deutschsprachigen Raum.', image: assets.portraitStudy },
              { id: 'portraits', title: 'Portrait als Präsenz', text: 'Ein starkes Portrait entsteht nicht durch Technik allein, sondern durch Präsenz, Ruhe und den richtigen Moment.', image: assets.personalBranding },
              { id: 'projects', title: 'Bücher & Ausstellungen', text: 'Eigene fotografische Projekte in Buchform und Ausstellungskontext, unter anderem in Ingolstadt.', image: assets.ingolstadtBook },
            ],
            cta: { label: 'Anfrage senden', href: '/kontakt' },
          },
        },
        {
          type: 'kineticIdentity',
          data: {
            badge: 'Arbeitsweise',
            headline: 'Menschen nicht als Rollen, sondern als Persönlichkeiten.',
            subline: 'Portraits entstehen aus Konzentration, Vertrauen und einem präzisen Blick für den richtigen Moment.',
            statements: [
              { prefix: 'Dokumentarische', highlight: 'Genauigkeit', suffix: '', text: 'Der Blick bleibt präzise und beobachtend.', image: assets.studioWide },
              { prefix: 'Reduzierte', highlight: 'Bildsprache', suffix: '', text: 'Weniger Ablenkung, mehr Charakter.', image: assets.portraitStudy },
              { prefix: 'Konzentration und', highlight: 'Vertrauen', suffix: '', text: 'Portraits funktionieren, wenn mehr sichtbar wird als Oberfläche.', image: assets.personalBranding },
            ],
            cta: { label: 'Projekt besprechen', href: '/kontakt' },
          },
        },
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      seo: {
        metaTitle: 'Kontakt · Alexander Schuktuew',
        metaDescription: 'Kontakt zu Studio Alexander Schuktuew in Ingolstadt und München: contact@schuktuew.com, 0176 38365914.',
        ogImage: assets.brandBox,
      },
      sections: [
        {
          type: 'contact',
          data: {
            badgeText: 'Kontakt',
            headline: 'Lass uns deinen visuellen Auftritt planen.',
            introText: 'Schreibe kurz, worum es geht: Business, Personal Branding, Sport, Editorial, Content-Produktion oder ein freies Projekt.',
            formEnabled: true,
            submitLabel: 'Anfrage senden',
            infoCards: [
              { icon: 'mail', label: 'E-Mail', value: 'contact@schuktuew.com' },
              { icon: 'phone', label: 'Telefon', value: '0176 38365914' },
              { icon: 'map-pin', label: 'Raum', value: 'Ingolstadt · München' },
            ],
            formFields: [
              { name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true },
              { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true },
              { name: 'project', label: 'Projektart', type: 'select', required: true, options: ['Business Branding', 'Personal Branding', 'Portrait', 'Sport/Golf', 'Content-Produktion', 'Editorial/Freies Projekt'] },
              { name: 'message', label: 'Kurzbeschreibung', type: 'textarea', required: true },
            ],
          },
        },
      ],
    },
    {
      slug: 'impressum',
      title: 'Impressum',
      seo: { metaTitle: 'Impressum · Alexander Schuktuew', metaDescription: 'Impressum von Studio Alexander Schuktuew.', ogImage: assets.logo },
      sections: [
        {
          type: 'contact',
          data: {
            badgeText: 'Impressum',
            headline: 'Studio Alexander Schuktuew',
            introText: 'Kontaktinformationen und Pflichtangaben.',
            formEnabled: false,
            infoCards: [
              { icon: 'mail', label: 'E-Mail', value: 'contact@schuktuew.com' },
              { icon: 'phone', label: 'Telefon', value: '0176 38365914' },
              { icon: 'globe', label: 'Website', value: 'schuktuew.com' },
            ],
          },
        },
      ],
    },
  ];

  return {
    brand,
    contact,
    socialLinks: { instagram: 'https://www.instagram.com/alexanderschuktuew/' },
    openingHours: [{ day: 'Termine', hours: 'Nach Vereinbarung' }],
    formFields: [
      { name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true },
      { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true },
      { name: 'message', label: 'Nachricht', type: 'textarea', required: true },
    ],
    design: {
      sectionBg: '#070707',
      sectionBgAlt: '#111111',
      cardBg: '#101010',
      headingColor: '#f7f2e8',
      bodyColor: '#ded6ca',
      mutedColor: '#a79f95',
      accentColor: '#d11224',
      btnBg: '#f4eee3',
      btnText: '#080808',
      cardRadius: '1.55rem',
      buttonRadius: '999px',
      cardShadow: '0 34px 110px rgba(0,0,0,0.45)',
      headingWeight: '850',
      headingTracking: '-0.065em',
    },
    navigation: {
      items: navigationItems,
      cta: {
        label: 'Termin buchen',
        href: '/kontakt',
        topBar: {
          enabled: true,
          text: 'Ingolstadt · München · Foto, Film & AI Workflows',
          linkLabel: 'Anfragen',
          linkHref: '/kontakt',
          bgColor: '#d11224',
          textColor: '#ffffff',
        },
      },
    },
    footer: {
      columns: footerColumns,
      legalLinks: [{ label: 'Impressum', href: '/impressum' }],
      cta: { label: 'Projekt anfragen', href: '/kontakt' },
    },
    seoGlobal: {
      defaultTitle: 'Alexander Schuktuew · Foto, Film & AI Workflows',
      titleTemplate: '%s | Alexander Schuktuew',
      defaultDescription: 'Studio Alexander Schuktuew aus Ingolstadt und München: Portrait, Business Branding, Sport und AI-gestützte Foto- und Filmproduktion.',
      defaultOgImage: assets.brandBox,
      canonicalBase: PREVIEW_URL,
      locale: 'de_DE',
      robots: 'index,follow',
    },
    collections: [
      {
        key: 'projekte',
        label: 'Projekte',
        schema: {
          fields: [
            { key: 'category', label: 'Kategorie', type: 'text' },
            { key: 'description', label: 'Beschreibung', type: 'textarea' },
            { key: 'image', label: 'Bild', type: 'image' },
            { key: 'gallery', label: 'Projektgalerie', type: 'image-list' },
            { key: 'video', label: 'Video', type: 'url' },
            { key: 'sourceUrl', label: 'Originalquelle', type: 'url' },
          ],
        },
        settings: { detailSectionType: 'collectionHero' },
        items: allProjects,
      },
    ],
    pages,
  };
}

async function getOrProvisionTenant() {
  const controlDb = getDb();
  const [existing] = await controlDb.select().from(schema.tenants).where(eq(schema.tenants.slug, SLUG)).limit(1);
  if (existing && existing.status === 'active') {
    if (existing.deploymentMode !== 'standalone') {
      throw new Error(`Tenant "${SLUG}" existiert bereits, ist aber nicht standalone. Kein automatischer Moduswechsel ohne Migration.`);
    }
    return { tenantId: existing.id, reused: true, result: null as Awaited<ReturnType<typeof provisionTenant>> | null };
  }

  const password = process.env.SCHUKTUEW_ADMIN_PASSWORD?.trim();
  if (!password || password.length < 12) {
    throw new Error('SCHUKTUEW_ADMIN_PASSWORD fehlt oder ist zu kurz. Bitte als Env setzen; das Script speichert es nur gehasht.');
  }

  const result = await provisionTenant({
    name: 'Alexander Schuktuew',
    slug: SLUG,
    industry: 'photography',
    password,
    companyName: 'Studio Alexander Schuktuew',
    tagline: 'Visual Solutions · Multidisciplinary Media Production',
    primaryColor: '#f4eee3',
    secondaryColor: '#0a0a0a',
    accentColor: '#d11224',
    phone: '0176 38365914',
    email: 'contact@schuktuew.com',
    address: 'Ingolstadt · München',
    deploymentMode: 'standalone',
  });
  return { tenantId: result.tenantId, reused: false, result };
}

async function getSchuktuewDataDb(tenantId: string) {
  const explicitUrl = process.env.SCHUKTUEW_DATABASE_URL?.trim();
  if (explicitUrl) {
    if (!explicitUrl.startsWith('postgres')) throw new Error('SCHUKTUEW_DATABASE_URL ist keine gültige Postgres-URL.');
    return createDb(explicitUrl);
  }
  return getTenantDataDb(tenantId);
}

async function seedTenant(dataDb: Database, tenantId: string, site: ReturnType<typeof buildSite>) {
  await dataDb.delete(schema.publishedSnapshots).where(eq(schema.publishedSnapshots.tenantId, tenantId));
  await dataDb.delete(schema.seoItem).where(eq(schema.seoItem.tenantId, tenantId));
  await dataDb.delete(schema.seoPage).where(eq(schema.seoPage.tenantId, tenantId));
  await dataDb.delete(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId));
  await dataDb.delete(schema.pages).where(eq(schema.pages.tenantId, tenantId));
  await dataDb.delete(schema.collectionItems).where(eq(schema.collectionItems.tenantId, tenantId));
  await dataDb.delete(schema.collections).where(eq(schema.collections.tenantId, tenantId));
  await dataDb.delete(schema.navigation).where(eq(schema.navigation.tenantId, tenantId));
  await dataDb.delete(schema.footer).where(eq(schema.footer.tenantId, tenantId));
  await dataDb.delete(schema.seoGlobal).where(eq(schema.seoGlobal.tenantId, tenantId));
  await dataDb.delete(schema.globalSettings).where(eq(schema.globalSettings.tenantId, tenantId));

  await dataDb.insert(schema.globalSettings).values({
    tenantId,
    brand: site.brand,
    contact: site.contact,
    socialLinks: site.socialLinks,
    openingHours: site.openingHours,
    design: site.design,
    formFields: site.formFields,
  });
  await dataDb.insert(schema.navigation).values({ tenantId, items: site.navigation.items, cta: site.navigation.cta });
  await dataDb.insert(schema.footer).values({ tenantId, columns: site.footer.columns, legalLinks: site.footer.legalLinks, cta: site.footer.cta });
  await dataDb.insert(schema.seoGlobal).values({ tenantId, ...site.seoGlobal });

  for (const collection of site.collections) {
    const [dbCollection] = await dataDb.insert(schema.collections).values({
      tenantId,
      key: collection.key,
      label: collection.label,
      schema: collection.schema,
      settings: collection.settings,
    }).returning();
    for (const item of collection.items) {
      await dataDb.insert(schema.collectionItems).values({
        tenantId,
        collectionId: dbCollection.id,
        slug: item.slug,
        title: item.title,
        data: item.data,
        published: true,
        priority: item.priority,
      });
    }
  }

  for (const [pageIndex, page] of site.pages.entries()) {
    const [dbPage] = await dataDb.insert(schema.pages).values({
      tenantId,
      title: page.title,
      slug: page.slug,
      type: page.slug === 'impressum' ? 'legal' : 'free',
      status: 'published',
      visible: true,
      sortOrder: pageIndex,
    }).returning();

    if (page.seo) {
      await dataDb.insert(schema.seoPage).values({
        tenantId,
        pageId: dbPage.id,
        metaTitle: page.seo.metaTitle || null,
        metaDescription: page.seo.metaDescription || null,
        ogImage: page.seo.ogImage || null,
      });
    }

    for (const [sectionIndex, section] of page.sections.entries()) {
      await dataDb.insert(schema.pageSections).values({
        tenantId,
        pageId: dbPage.id,
        type: section.type,
        ...regularSectionIdentity(section.type),
        sortOrder: sectionIndex,
        visible: true,
        container: section.container || 'default',
        spacingTop: section.spacingTop || 'l',
        spacingBottom: section.spacingBottom || 'l',
        anchorId: section.anchorId || null,
        styleOverrides: section.styleOverrides || null,
        data: section.data,
      });
    }
  }

  const allPages = await dataDb.select().from(schema.pages).where(eq(schema.pages.tenantId, tenantId));
  const allSections = await dataDb.select().from(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId));
  const allCollections = await dataDb.select().from(schema.collections).where(eq(schema.collections.tenantId, tenantId));
  const allItems = await dataDb.select().from(schema.collectionItems).where(eq(schema.collectionItems.tenantId, tenantId));
  const snapshot = {
    pages: allPages
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((page) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        visible: page.visible,
        sections: allSections
          .filter((section) => section.pageId === page.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((section) => ({
            id: section.id,
            type: section.type,
            definitionKey: section.definitionKey,
            schemaVersion: section.schemaVersion,
            variant: section.variant,
            visible: section.visible,
            locked: section.locked,
            sortOrder: section.sortOrder,
            container: section.container,
            spacingTop: section.spacingTop,
            spacingBottom: section.spacingBottom,
            anchorId: section.anchorId,
            data: section.data,
            styleOverrides: section.styleOverrides,
          })),
      })),
    collections: allCollections.map((collection) => ({
      id: collection.id,
      key: collection.key,
      label: collection.label,
      schema: collection.schema,
      settings: collection.settings,
      items: allItems
        .filter((item) => item.collectionId === collection.id && item.published)
        .sort((a, b) => a.priority - b.priority)
        .map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          data: item.data,
          priority: item.priority,
          createdAt: item.createdAt?.toISOString?.() || '',
          updatedAt: item.updatedAt?.toISOString?.() || '',
        })),
    })),
    generatedAt: new Date().toISOString(),
  };
  const checksum = createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
  const [previous] = await dataDb.select({ version: schema.publishedSnapshots.version })
    .from(schema.publishedSnapshots)
    .where(eq(schema.publishedSnapshots.tenantId, tenantId))
    .orderBy(desc(schema.publishedSnapshots.version))
    .limit(1);
  await dataDb.insert(schema.publishedSnapshots).values({
    tenantId,
    version: (previous?.version || 0) + 1,
    snapshot,
    checksum,
    isActive: true,
    createdBy: 'seed-schuktuew',
  });

  return {
    pages: site.pages.length,
    sections: site.pages.reduce((sum, page) => sum + page.sections.length, 0),
    collections: site.collections.length,
    items: site.collections.reduce((sum, collection) => sum + collection.items.length, 0),
  };
}

async function main() {
  const dryAssets = Object.fromEntries(Object.keys(ASSETS).map((key) => [key, `asset:${key}`])) as UploadedAssets;
  const drySite = buildSite(dryAssets);
  if (DRY_RUN) {
    console.log(`Dry run: ${drySite.pages.length} Seiten, ${drySite.pages.reduce((sum, page) => sum + page.sections.length, 0)} Sections, ${drySite.collections[0].items.length} Projekt-Items.`);
    for (const spec of Object.values(ASSETS).filter((asset) => isLocalAsset(asset.source))) await readFile(spec.source);
    console.log('Lokale Assets vorhanden.');
    return;
  }

  await loadVercelProjectEnv();
  const requiredEnv = [
    'VERCEL_TOKEN',
    'DATABASE_URL',
    'GITHUB_REPO_ID',
    'GITHUB_REPO_NUMERIC_ID',
    'BLOB_READ_WRITE_TOKEN',
  ];
  if (!process.env.SCHUKTUEW_DATABASE_URL?.trim()) {
    requiredEnv.push('CRM_CONFIG_ENCRYPTION_KEY', 'NEON_API_KEY');
  }
  requireEnv(requiredEnv);

  const { tenantId, reused, result } = await getOrProvisionTenant();
  console.log(reused ? `Tenant reused: ${tenantId}` : `Tenant provisioniert: ${tenantId}`);

  const dataDb = await getSchuktuewDataDb(tenantId);
  const uploadedAssets = await uploadAssets(dataDb, tenantId);
  const originalImport = await importOriginalProjectGalleries();
  const site = buildSite(uploadedAssets, originalImport);
  const seeded = await seedTenant(dataDb, tenantId, site);
  const controlDb = getDb();
  await controlDb.update(schema.tenants).set({ name: 'Alexander Schuktuew', industry: 'photography', status: 'active', isDemo: false, isLead: false, updatedAt: new Date() }).where(eq(schema.tenants.id, tenantId));
  await dataDb.update(schema.tenants).set({ name: 'Alexander Schuktuew', industry: 'photography', status: 'active', isDemo: false, isLead: false, updatedAt: new Date() }).where(eq(schema.tenants.id, tenantId));

  console.log(JSON.stringify({
    tenantId,
    previewUrl: result?.rendererUrl || PREVIEW_URL,
    adminUrl: result?.adminUrl || `${PREVIEW_URL}/admin`,
    seeded,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
