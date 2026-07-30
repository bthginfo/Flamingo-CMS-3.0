import { put } from '@vercel/blob';
import { eq, desc, and } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
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
  | 'referenceReel'
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
  | 'aboutPortrait04'
  | 'aboutPortrait05'
  | 'aboutStill01'
  | 'aboutStill02'
  | 'aboutStill03'
  | 'eiszeitDetail01'
  | 'eiszeitDetail02'
  | 'portfolioStill01'
  | 'portfolioStill02'
  | 'aiLandscapeBefore'
  | 'aiLandscapeAfter';

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
  originalText?: string;
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
type SchuktuewProject = {
  slug: string;
  title: string;
  priority: number;
  data: Record<string, unknown> & {
    category?: string;
    description?: string;
    image?: string;
    gallery?: string[];
    video?: string;
    sourceUrl?: string;
    contentLead?: string;
    originalText?: string;
  };
};

function buildSchuktuewAiWorkflowSections(assets: UploadedAssets): PageConfig['sections'] {
  const darkAiStyle = {
    sectionBg: '#050505',
    sectionBgAlt: '#111111',
    cardBg: '#111111',
    headingColor: '#fff7ec',
    bodyColor: '#e8dfd4',
    mutedColor: '#b8aea2',
    cardHeadingColor: '#fff7ec',
    cardBodyColor: '#e8dfd4',
    cardMutedColor: '#b8aea2',
    labelColor: '#fff7ec',
    iconColor: '#ef233c',
    accentColor: '#ef233c',
    btnBg: '#fff7ec',
    btnText: '#050505',
    borderColor: 'rgba(255,247,236,.16)',
    dividerColor: 'rgba(255,247,236,.16)',
    shadowColor: 'rgba(0,0,0,.58)',
  };

  return [
    {
      type: 'glowHero',
      data: {
        eyebrow: 'AI Workflows',
        headline: 'Ich teste die Bildwelt, bevor wir sie produzieren.',
        subline: 'Ich nutze KI nicht als Selbstzweck. Sie hilft mir, Wirkung, Look, Zuschnitt und Ausgabe früh zu prüfen — bevor Foto, Film und Retusche Zeit kosten.',
        image: assets.archiveStill04,
        imagePosition: 'center 42%',
        glowColor: 'rgba(239,35,60,.46)',
        primaryCta: { label: 'Workflow besprechen', href: '/kontakt' },
        secondaryCta: { label: 'Arbeiten ansehen', href: '/portfolio' },
        facts: [
          { value: 'Looktests', label: 'vor der Produktion' },
          { value: 'Foto + Film', label: 'als ein System gedacht' },
          { value: 'Web · Social · Kampagne', label: 'direkt als Ausgabe geplant' },
        ],
      },
      styleOverrides: darkAiStyle,
    },
    {
      type: 'xrayReveal',
      container: 'wide',
      data: {
        badge: 'Vorher / Nachher',
        headline: 'Ein Motiv muss tragen, bevor es fertig aussieht.',
        subline: 'Ich prüfe Licht, Farbe, Tiefe und Format früh. So wird sichtbar, ob aus einem Motiv ein Website-Hero, Kampagnenbild oder Social-Asset werden kann.',
        imageBase: assets.aiLandscapeBefore,
        imageReveal: assets.aiLandscapeAfter,
        labelBase: 'Ausgangsmotiv',
        labelReveal: 'geprüfte Bildrichtung',
        caption: 'Die AI-Variante ist ein Prüfstand für Wirkung und Bildsprache — nicht das Endprodukt.',
        revealStyle: 'scan',
        aspectRatio: '16/9',
      },
      styleOverrides: darkAiStyle,
    },
    {
      type: 'transformationSequence',
      data: {
        badge: 'Produktionslogik',
        headline: 'Vom ersten Eindruck zur fertigen Strecke.',
        subline: 'Ich arbeite nicht linear von Shooting zu Export. Ich plane rückwärts vom späteren Einsatz: Wo erscheint das Motiv, wie nah muss es sein, welches Format braucht es?',
        states: [
          {
            kicker: '01 · Wirkung',
            title: 'Wofür soll das Bild arbeiten?',
            text: 'Ich kläre Zielgruppe, Haltung, Medium und gewünschte Reaktion. Ohne diese Richtung bleibt jedes Motiv austauschbar.',
            image: assets.businessCampaign,
            metricValue: 'Brief',
            metricLabel: 'vor Kamera und KI',
          },
          {
            kicker: '02 · Bildsprache',
            title: 'Der Look wird vorab geprüft.',
            text: 'Farbwelt, Licht, Perspektive und Zuschnitt werden getestet, damit die Produktion eine klare visuelle Linie bekommt.',
            image: assets.personalBranding,
            metricValue: 'Look',
            metricLabel: 'als Entscheidung',
          },
          {
            kicker: '03 · Produktion',
            title: 'Foto und Film entstehen zusammen.',
            text: 'Wenn Bewegung sinnvoll ist, denke ich Reels, Sequenzen und Still-Motive direkt am Set mit.',
            image: assets.heroPortrait,
            metricValue: 'Set',
            metricLabel: 'mit Ausgabe im Kopf',
          },
          {
            kicker: '04 · Ausgabe',
            title: 'Am Ende stehen verwendbare Assets.',
            text: 'Aus einem Look entstehen Zuschnitte und Varianten für Website, Social, Kampagne, Recruiting, Präsentation und Print.',
            image: assets.studioWide,
            metricValue: 'Assets',
            metricLabel: 'statt Rohdatenchaos',
          },
        ],
        cta: { label: 'Produktion planen', href: '/kontakt' },
      },
      styleOverrides: darkAiStyle,
    },
    {
      type: 'layeredAnatomy',
      data: {
        badge: 'Bildaufbau',
        headline: 'Ich zerlege ein Motiv nach seiner späteren Aufgabe.',
        subline: 'Nicht jede gute Aufnahme funktioniert automatisch als Website-Hero, Reel-Cover oder Kampagnenmotiv. Diese Fragen kläre ich früh.',
        mode: 'hotspots',
        baseImage: assets.businessCampaign,
        aspectRatio: '16/9',
        hotspots: [
          { id: 'message', x: 18, y: 28, title: 'Botschaft', text: 'Was soll auf den ersten Blick verstanden werden?' },
          { id: 'crop', x: 44, y: 58, title: 'Zuschnitt', text: 'Welche Fläche muss für Headline, Button oder Social-Crop frei bleiben?' },
          { id: 'look', x: 64, y: 34, title: 'Look', text: 'Welche Licht- und Farbentscheidung stärkt die Marke?' },
          { id: 'motion', x: 78, y: 68, title: 'Bewegung', text: 'Wo lohnt sich zusätzlich Film oder Reel statt nur Einzelbild?' },
          { id: 'delivery', x: 88, y: 24, title: 'Übergabe', text: 'Welche Formate werden wirklich gebraucht: Web, Social, Kampagne oder Print?' },
        ],
        cta: { label: 'Bildwelt besprechen', href: '/kontakt' },
      },
      styleOverrides: darkAiStyle,
    },
    {
      type: 'dayToNight',
      data: {
        badge: 'Ausgabe',
        headline: 'Ein Motiv muss in mehreren Situationen funktionieren.',
        subline: 'Ich plane nicht nur das schöne Einzelbild. Ich plane die Varianten, die später wirklich gebraucht werden.',
        scenes: [
          {
            id: 'website',
            time: 'Website',
            label: 'Hero',
            title: 'Erster Eindruck',
            text: 'Das Motiv braucht Ruheflächen, klare Blickführung und genug Kraft für Headline und CTA.',
            image: assets.businessCampaign,
            tint: 'rgba(239,35,60,.18)',
          },
          {
            id: 'social',
            time: 'Social',
            label: 'Cutdowns',
            title: 'Kurze Formate',
            text: 'Aus derselben Bildwelt entstehen Ausschnitte, Reel-Cover, Kurzclips und schnelle Varianten.',
            image: assets.heroPortrait,
            tint: 'rgba(255,247,236,.08)',
          },
          {
            id: 'campaign',
            time: 'Kampagne',
            label: 'Serie',
            title: 'Wiedererkennung',
            text: 'Farbe, Licht und Haltung bleiben konsistent, damit die Motive zusammengehören.',
            image: assets.personalBranding,
            tint: 'rgba(239,35,60,.14)',
          },
          {
            id: 'delivery',
            time: 'Übergabe',
            label: 'Assets',
            title: 'Verwendbare Dateien',
            text: 'Am Ende zählt, ob Bilder und Clips schnell in Website, Anzeigen, Präsentation oder Print eingesetzt werden können.',
            image: assets.studioWide,
            tint: 'rgba(0,0,0,.18)',
          },
        ],
        cta: { label: 'Ausgabe planen', href: '/kontakt' },
      },
      styleOverrides: darkAiStyle,
    },
    {
      type: 'livingBlueprint',
      data: {
        badge: 'Workflow-Karte',
        headline: 'So bleibt ein Projekt kontrolliert, ohne steif zu werden.',
        subline: 'Die Karte zeigt, welche Entscheidungen früh fallen und wo im Prozess noch Spielraum bleibt.',
        layout: 'blueprint',
        nodes: [
          { id: 'brief', title: 'Briefing', text: 'Ziel, Zielgruppe, Tonalität und Einsatzkanäle werden festgelegt.', icon: 'ClipboardList', metric: 'Richtung' },
          { id: 'looktests', title: 'Looktests', text: 'KI, Moodboard und Referenzen helfen, die visuelle Richtung sichtbar zu machen.', icon: 'Sparkles', metric: 'Prüfen' },
          { id: 'motif-plan', title: 'Motivplan', text: 'Ich plane Serien, Details, Portraits, Reels und Reserve-Crops vor.', icon: 'PanelsTopLeft', metric: 'Planen' },
          { id: 'production', title: 'Produktion', text: 'Foto und Film entstehen mit Führung, Licht und einem klaren Ausgabeziel.', icon: 'Camera', metric: 'Produzieren' },
          { id: 'finish', title: 'Finish', text: 'Auswahl, Retusche, Grading und Schnitt halten die Linie zusammen.', icon: 'SlidersHorizontal', metric: 'Schärfen' },
          { id: 'delivery', title: 'Übergabe', text: 'Sie bekommen sortierte Assets für Website, Social, Kampagne und Print.', icon: 'FolderCheck', metric: 'Nutzen' },
        ],
        cta: { label: 'Workflow besprechen', href: '/kontakt' },
      },
      styleOverrides: darkAiStyle,
    },
    {
      type: 'ctaBand',
      data: {
        badgeText: 'Nächster Schritt',
        headline: 'Lassen Sie uns zuerst die Bildrichtung klären.',
        subline: 'Dann entscheiden wir, ob Foto, Film, AI-Looktests oder eine Kombination daraus für Ihr Projekt sinnvoll ist.',
        ctaPrimary: { label: 'Projekt anfragen', href: '/kontakt', icon: 'ArrowRight' },
        ctaSecondary: { label: 'Portfolio ansehen', href: '/portfolio', icon: 'ArrowRight' },
      },
      styleOverrides: darkAiStyle,
    },
  ];
}

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
const MAX_CANVAS_ITEMS = Number(process.env.SCHUKTUEW_MAX_CANVAS_ITEMS || '28');
const STATIC_REFERENCE_REEL_URL = `${PREVIEW_URL}/seed-media/schuktuew/alexander-schuktuew-reference-reel.mp4`;

const LOCAL_ASSETS = {
  brandBox: 'C:/Users/vonin-ju/AppData/Local/Temp/codex-clipboard-e93ce390-ba23-47f5-be25-11f7029c7db0.png',
  agencyReel: 'C:/Users/vonin-ju/Downloads/AQO8KdTvkw4Kf6EUxVtCyFRf7F5LifMi8MNwfWLKzqGyyCAykS_K1Ax02ovczX6qyVJ5YWtmE9cfy4uV2rI4MhSDlPmaCCwex2tb3lI.mp4',
  golfReel: 'C:/Users/vonin-ju/Downloads/AQNn_ATz6o4QFuhcsAyoZO7tmcsysRQ9FVASQdNuH-e_4vkH7aiBNuRkTD2sGO1tYKSXSKthmsVOttqAf9IlWn0X4KGbR32PuZgETXg.mp4',
  referenceReel: 'C:/Users/vonin-ju/Downloads/AQPTd0f9OfQ7Dwnm1BWI6IycZzvFeL9Wg6fdkb7oBhPwUCCpyFBTnPyok_Zfac5dSEJzjZDawUBvUY5AA6XAU3Q8aa-GNmimbl3STKI.mp4',
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
  referenceReel: {
    source: STATIC_REFERENCE_REEL_URL,
    filename: 'alexander-schuktuew-reference-reel.mp4',
    contentType: 'video/mp4',
    alt: 'Hochformat-Video Referenzproduktion',
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
  aboutPortrait04: {
    source: 'https://static.wixstatic.com/media/74d7fc_ffa0ad65ea16474496df52bfda780375~mv2.jpg/v1/fit/w_1600,h_1600,q_86,enc_avif,quality_auto/74d7fc_ffa0ad65ea16474496df52bfda780375~mv2.jpg',
    filename: 'schuktuew-about-portrait-04.jpg',
    contentType: 'image/jpeg',
    alt: 'Portraitmotiv aus Alexander Schuktuews Info-Seite',
  },
  aboutPortrait05: {
    source: 'https://static.wixstatic.com/media/74d7fc_f5f882a83b4f47a0b93cb561cc06512e~mv2.jpg/v1/fit/w_1600,h_1600,q_86,enc_avif,quality_auto/74d7fc_f5f882a83b4f47a0b93cb561cc06512e~mv2.jpg',
    filename: 'schuktuew-about-portrait-05.jpg',
    contentType: 'image/jpeg',
    alt: 'Weitere Portraitarbeit aus der Info-Seite',
  },
  aboutStill01: {
    source: 'https://static.wixstatic.com/media/74d7fc_d7da0eba7ca8419ca37f3c0f961e7fae~mv2.jpg/v1/fit/w_1600,h_1600,q_86,enc_avif,quality_auto/74d7fc_d7da0eba7ca8419ca37f3c0f961e7fae~mv2.jpg',
    filename: 'schuktuew-about-still-01.jpg',
    contentType: 'image/jpeg',
    alt: 'Fotografisches Motiv aus der Über-mich-Seite',
  },
  aboutStill02: {
    source: 'https://static.wixstatic.com/media/74d7fc_10a823f1b184475fac7b2fddcf66085e~mv2.jpg/v1/fit/w_1600,h_1600,q_86,enc_avif,quality_auto/74d7fc_10a823f1b184475fac7b2fddcf66085e~mv2.jpg',
    filename: 'schuktuew-about-still-02.jpg',
    contentType: 'image/jpeg',
    alt: 'Dokumentarisches Motiv aus Alexander Schuktuews Info-Seite',
  },
  aboutStill03: {
    source: 'https://static.wixstatic.com/media/74d7fc_57ab9d72266e486bb8d6b516f1e684c6~mv2.png/v1/fit/w_1200,h_900,q_86,enc_avif,quality_auto/74d7fc_57ab9d72266e486bb8d6b516f1e684c6~mv2.png',
    filename: 'schuktuew-about-still-03.png',
    contentType: 'image/png',
    alt: 'Freies Projektmotiv aus Alexander Schuktuews Website',
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
  aiLandscapeBefore: {
    source: `${PREVIEW_URL}/seed-media/schuktuew/ai-workflow-landscape-before.png`,
    filename: 'schuktuew-ai-workflow-landscape-before.png',
    contentType: 'image/png',
    alt: 'Unbearbeitetes Landschaftsmotiv als Ausgangspunkt eines AI-Workflows',
  },
  aiLandscapeAfter: {
    source: `${PREVIEW_URL}/seed-media/schuktuew/ai-workflow-landscape-after.png`,
    filename: 'schuktuew-ai-workflow-landscape-after.png',
    contentType: 'image/png',
    alt: 'Optimierte Landschaftsbildwelt als Ergebnis eines kontrollierten AI-Workflows',
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
    console.warn(`Vercel Env konnte nicht geladen werden (${VERCEL_ENV_PROJECT}); nutze vorhandene lokale/GitHub-Env.`);
    return;
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

async function loadTenantVercelProjectEnv(projectId: string | null | undefined, mapKeys: Record<string, string> = {}) {
  const token = process.env.VERCEL_TOKEN?.trim();
  if (!token || !projectId) return;
  const response = await fetch(`https://api.vercel.com/v9/projects/${encodeURIComponent(projectId)}/env?limit=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => null) as { envs?: Array<{ key: string; value?: string; target?: string[] }> } | { error?: unknown } | null;
  if (!response.ok || !data || !('envs' in data)) return;
  for (const envVar of data.envs || []) {
    const targets = Array.isArray(envVar.target) ? envVar.target : [];
    if (targets.length && !targets.includes('production')) continue;
    const value = typeof envVar.value === 'string' ? envVar.value : '';
    if (!value || value.startsWith('__PLACEHOLDER')) continue;
    const envKey = mapKeys[envVar.key] || envVar.key;
    if ((envKey.endsWith('DATABASE_URL') || envKey === 'TENANT_DATABASE_URL') && !value.startsWith('postgres')) continue;
    if (!process.env[envKey]) process.env[envKey] = value;
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
  const existingAssets = await dataDb
    .select({ filename: schema.mediaAssets.filename, pathname: schema.mediaAssets.pathname, blobUrl: schema.mediaAssets.blobUrl })
    .from(schema.mediaAssets)
    .where(eq(schema.mediaAssets.tenantId, tenantId));
  const existingByName = new Map<string, string>();
  for (const asset of existingAssets) {
    if (asset.filename && asset.blobUrl) existingByName.set(asset.filename, asset.blobUrl);
    const basename = asset.pathname ? path.basename(asset.pathname) : '';
    if (basename && asset.blobUrl) existingByName.set(basename, asset.blobUrl);
  }

  for (const [key, spec] of Object.entries(ASSETS) as Array<[AssetKey, AssetSpec]>) {
    const canReadSource = !isLocalAsset(spec.source) || existsSync(spec.source);
    const canUpload = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()) && canReadSource;
    if (!canUpload) {
      const existingUrl = existingByName.get(spec.filename);
      if (existingUrl) {
        output[key] = existingUrl;
        console.log(`Asset wiederverwendet: ${key}`);
        continue;
      }
      if (!isLocalAsset(spec.source)) {
        output[key] = spec.source;
        console.log(`Asset extern verwendet: ${key}`);
        continue;
      }
      throw new Error(`Asset "${key}" fehlt lokal und wurde nicht in der Mediathek gefunden (${spec.filename}).`);
    }

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
  const decoded = value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&auml;/gi, 'ä')
    .replace(/&ouml;/gi, 'ö')
    .replace(/&uuml;/gi, 'ü')
    .replace(/&Auml;/g, 'Ä')
    .replace(/&Ouml;/g, 'Ö')
    .replace(/&Uuml;/g, 'Ü')
    .replace(/&szlig;/gi, 'ß')
    .replace(/&ndash;|&#8211;/gi, '–')
    .replace(/&mdash;|&#8212;/gi, '—')
    .replace(/\\u002F/g, '/');
  return decoded.includes('&') ? decoded
    .replace(/&auml;/gi, 'ä')
    .replace(/&ouml;/gi, 'ö')
    .replace(/&uuml;/gi, 'ü')
    .replace(/&Auml;/g, 'Ä')
    .replace(/&Ouml;/g, 'Ö')
    .replace(/&Uuml;/g, 'Ü')
    .replace(/&szlig;/gi, 'ß') : decoded;
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

function stripVisibleText(value: string) {
  return decodeHtml(value)
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isUsefulOriginalText(text: string) {
  if (text.length < 45 || text.length > 620) return false;
  if (/https?:\/\/|wix|parastorage|cookie|login|account|Use tab|top of page|Mehr$/i.test(text)) return false;
  if (/^(Kontakt|Portfolio|Imprint|Instagram|Facebook|PORTRAIT|SPORT|GOLF|CONVERSE|über mich)$/i.test(text)) return false;
  if ((text.match(/[{}[\]]/g) || []).length > 2) return false;
  if (!/[.!?]|Saison|Seiten|STÜCKZAHL|Auftrag|Serie|Portrait|Commercial|Fotograf/i.test(text)) return false;
  return true;
}

function extractOriginalText(html: string) {
  const body = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ');
  const candidates: string[] = [];
  for (const match of body.matchAll(/<(?:p|h[1-6]|span|div)[^>]*>([\s\S]{0,1600}?)<\/(?:p|h[1-6]|span|div)>/gi)) {
    const text = stripVisibleText(match[1] || '');
    if (!isUsefulOriginalText(text)) continue;
    if (candidates.some((existing) => existing === text || existing.includes(text) || text.includes(existing))) continue;
    candidates.push(text);
    if (candidates.length >= 5) break;
  }
  return candidates.join('\n\n');
}

function cleanOriginalTitle(value: string, slug: string) {
  const title = decodeHtml(value)
    .replace(/\s+[|–-]\s+Meinewebsite.*$/i, '')
    .replace(/\s+[|–-]\s+Meine\s+Website.*$/i, '')
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
      const originalText = extractOriginalText(html);
      const category = categoryFromSlug(slug);
      const project: ImportedProject = {
        slug,
        title,
        priority,
        sourceUrl: url,
        category,
        description: originalText || description,
        originalText,
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
  return { definitionKey: `${type}.shared.v1`, schemaVersion: 1 };
}

function regularSectionIdentity(type: string) {
  if (['editorialHero', 'contact', 'faq', 'ctaBand'].includes(type)) return { definitionKey: `${type}.photography.v1`, schemaVersion: 1 };
  return sectionIdentity(type);
}

const DARK_SECTION_STYLE = {
  '--token-section-bg': '#050505',
  '--token-section-bg-alt': '#0c0c0c',
  '--token-card-bg': '#101010',
  '--token-card-border': 'rgba(244,238,227,0.16)',
  '--token-heading': '#f7f2e8',
  '--token-body': '#ded6ca',
  '--token-muted': '#a79f95',
  '--token-card-heading': '#f7f2e8',
  '--token-card-body': '#ded6ca',
  '--token-card-muted': '#a79f95',
  '--token-accent': '#d11224',
  '--token-btn-bg': '#f4eee3',
  '--token-btn-text': '#080808',
};

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
        sourceUrl: 'https://www.schuktuew.com/commercial',
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
        sourceUrl: 'https://www.schuktuew.com/personal',
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
        sourceUrl: 'https://www.schuktuew.com/golf-1',
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
  function galleryFromImported(predicate: (project: ImportedProject) => boolean, limit = 24) {
    const seen = new Set<string>();
    const images: string[] = [];
    for (const project of extras.importedProjects || []) {
      if (!predicate(project)) continue;
      for (const image of project.gallery || []) {
        if (!image || seen.has(image)) continue;
        seen.add(image);
        images.push(image);
        if (images.length >= limit) return images;
      }
    }
    return images;
  }
  const curatedGalleryFallbacks: Record<string, string[]> = {
    'business-branding': galleryFromImported((project) => (
      ['commercial', 'efs-recruiting-campaign', 'clients-selection', 'konnekte', 'blackworks'].includes(project.slug)
    )),
    'personal-branding': galleryFromImported((project) => (
      ['personal', 'portraits', 'selfportraits', 'kajan-luc', 'juliane-pittermann'].includes(project.slug)
      || project.category === 'Portrait'
    )),
  };
  const curatedProjects = projects.map((project) => {
    const imported = importedBySourceUrl.get(project.data.sourceUrl);
    const fallbackGallery = curatedGalleryFallbacks[project.slug] || [];
    const preferFallback = ['business-branding', 'personal-branding'].includes(project.slug) && fallbackGallery.length > 0;
    const gallery = Array.from(new Set([
      ...(preferFallback ? fallbackGallery : []),
      project.data.image,
      ...(imported?.gallery || []),
      ...(!preferFallback ? fallbackGallery : []),
    ].filter(Boolean)));
    return { ...project, data: { ...project.data, image: gallery[0] || project.data.image, gallery, originalText: imported?.originalText, contentLead: imported?.originalText || project.data.description } };
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
        contentLead: project.originalText || project.description,
        originalText: project.originalText,
        image: project.image,
        gallery: project.gallery,
        sourceUrl: project.sourceUrl,
      },
    }));

  const projectStories: Record<string, {
    lead: string;
    facts: Array<{ label: string; value: string }>;
    angles: Array<{ title: string; text: string; icon: string }>;
  }> = {
    'business-branding': {
      lead: 'Ich entwickle starke Bildwelten für Kommunikation, Marketing und Employer Branding – klar, hochwertig und strategisch gedacht.',
      facts: [
        { label: 'Einsatz', value: 'Website · Kampagne · Recruiting' },
        { label: 'Region', value: 'Ingolstadt · München' },
        { label: 'Output', value: 'Portraits · Stills · Social Assets' },
      ],
      angles: [
        { title: 'Positionierung', text: 'Gemeinsam übersetzen wir Werte, Haltung und Identität in Bilder, die wirken, bevor ein Wort gesagt wird.', icon: 'Sparkles' },
        { title: 'Bildführung', text: 'Outfit, Posing, Ausdruck und Licht werden gezielt geführt, damit die Serie sicher und hochwertig wirkt.', icon: 'Aperture' },
        { title: 'Verwendung', text: 'Die Motive sind für Website, Kampagne, Social Media und Recruiting vorbereitet, ohne den Look zu verlieren.', icon: 'Layers' },
      ],
    },
    'personal-branding': {
      lead: 'Ich kreiere Portraits, die zeigen, wer Sie sind – und wofür Sie stehen. Präzise inszeniert, klar geführt und auf den Punkt.',
      facts: [
        { label: 'Fokus', value: 'Portrait · Personal Branding' },
        { label: 'Look', value: 'klar · ruhig · charakterstark' },
        { label: 'Einsatz', value: 'Website · Presse · Social' },
      ],
      angles: [
        { title: 'Ausdruck', text: 'Menschen zu fotografieren bedeutet für mich, eine Atmosphäre zu schaffen, in der Vertrauen entsteht.', icon: 'UserRound' },
        { title: 'Reduktion', text: 'Die Bildsprache bleibt klar, ruhig und direkt, damit Persönlichkeit nicht von Dekoration überdeckt wird.', icon: 'Focus' },
        { title: 'Vertrauen', text: 'Bilder sollen nicht nur gut aussehen, sondern Position stärken und Entscheidungen beeinflussen.', icon: 'ShieldCheck' },
      ],
    },
    'sport-golf': {
      lead: 'Sport, Bewegung und Timing werden so fotografiert und geschnitten, dass aus einem Moment Material für Social, Website und Kampagne entsteht.',
      facts: [
        { label: 'Format', value: 'Foto · Reel · Kampagne' },
        { label: 'Kontext', value: 'Golf · Sport · Bewegung' },
        { label: 'Output', value: '9:16 · Website · Social' },
      ],
      angles: [
        { title: 'Bewegung', text: 'Timing, Rhythmus und Blickführung entscheiden, ob Sportbilder Spannung behalten.', icon: 'Activity' },
        { title: 'Präzision', text: 'Ausschnitt, Moment und Licht werden so geführt, dass Dynamik kontrolliert bleibt.', icon: 'Target' },
        { title: 'Kanäle', text: 'Aus der Produktion entstehen Motive und Clips für mehrere Einsatzorte.', icon: 'Film' },
      ],
    },
    'eiszeit-erc-ingolstadt': {
      lead: 'Im Auftrag des ERC Ingolstadt begleitete ich das Team und das Leben um den Sport hautnah und durfte hinter die Kulissen des 1.-Liga-Betriebs sehen. Saison 23/24.',
      facts: [
        { label: 'Auftrag', value: 'ERC Ingolstadt' },
        { label: 'Saison', value: '23/24' },
        { label: 'Veröffentlichung', value: 'April 2024' },
        { label: 'Umfang', value: '240 Seiten · 2.000 Stück' },
      ],
      angles: [
        { title: 'Nähe', text: 'Die Arbeit zeigt nicht nur Spielmomente, sondern auch Umfeld, Vorbereitung und Atmosphäre.', icon: 'Eye' },
        { title: 'Dokumentation', text: 'Ein Saisonblick mit journalistischer Ruhe und Nähe zum Geschehen.', icon: 'BookOpen' },
        { title: 'Buchform', text: 'Veröffentlichung April 2024, Stückzahl 2.000, Umfang 240 Seiten.', icon: 'Library' },
      ],
    },
    converse: {
      lead: 'Serie zur Präsentation eines neuen Modells des ikonischen CONVERSE-Schuhs; gezeigt im Berliner Flagshipstore in Mitte.',
      facts: [
        { label: 'Marke', value: 'CONVERSE' },
        { label: 'Kontext', value: 'Flagshipstore Berlin-Mitte' },
        { label: 'Format', value: 'Commercial Serie' },
      ],
      angles: [
        { title: 'Kampagnenlook', text: 'Das Produkt wird nicht isoliert, sondern über Haltung, Umgebung und Stimmung erzählt.', icon: 'BadgeCheck' },
        { title: 'Serie', text: 'Mehrere Motive bauen einen konsistenten visuellen Kontext auf.', icon: 'Images' },
        { title: 'Ort', text: 'Der Berliner Flagshipstore wird Teil der Bildwirkung.', icon: 'MapPin' },
      ],
    },
    'buch-ingolstadt': {
      lead: 'Buch: „INGOLSTADT“, 2021 – aus 15 Jahren analoger Fotografie editiert. Stückzahl 500, 149 Seiten, Vorwort von Architekt A. Häusler.',
      facts: [
        { label: 'Format', value: 'Buchprojekt' },
        { label: 'Ort', value: 'Ingolstadt' },
        { label: 'Ansatz', value: 'dokumentarisch · frei' },
      ],
      angles: [
        { title: 'Ort', text: 'Ingolstadt wird als Bildraum betrachtet, nicht nur als Kulisse.', icon: 'Map' },
        { title: 'Serie', text: 'Ein Buchprojekt lebt von Rhythmus, Wiederholung und Brüchen zwischen den Motiven.', icon: 'BookOpen' },
        { title: 'Blick', text: 'Der dokumentarische Ansatz macht Alltägliches sichtbar.', icon: 'Camera' },
      ],
    },
  };

  function storyForProject(project: SchuktuewProject) {
    const fromMap = projectStories[project.slug];
    if (fromMap) return fromMap;
    const category = String(project.data.category || 'Projekt');
    const description = String(project.data.description || '').trim();
    const fragments = String(project.data.originalText || project.data.contentLead || description || '')
      .split(/\n{1,}/)
      .map((entry) => entry.replace(/\s+/g, ' ').trim())
      .filter((entry) => entry.length > 24)
      .slice(0, 3);
    const lead = fragments[0] || description || `Bildserie aus dem Bereich ${category} mit klarer visueller Linie.`;
    const second = fragments[1] || 'Die Motive zeigen die visuelle Linie der Serie und machen den Charakter des Projekts schnell erfassbar.';
    const third = fragments[2] || 'Die Motive zeigen, wie der Look auf Website, Social und Kampagne wirkt.';
    return {
      lead,
      facts: [
        { label: 'Bereich', value: category },
        { label: 'Umfang', value: `${project.data.gallery?.length || 1} Bilder` },
        { label: 'Einsatz', value: 'Portfolio · Website · Anfrage' },
      ],
      angles: [
        { title: 'Bildidee', text: lead, icon: 'Layers' },
        { title: 'Motive', text: second, icon: 'Images' },
        { title: 'Einsatz', text: third, icon: 'ArrowUpRight' },
      ],
    };
  }

  function galleryForProject(project: SchuktuewProject) {
    const gallery = Array.isArray(project.data.gallery) ? project.data.gallery.filter(Boolean) : [];
    return gallery.length ? gallery : [project.data.image].filter(Boolean) as string[];
  }

  function imageIdentity(value: unknown) {
    const source = String(value || '').trim();
    return mediaIdFromUrl(source) || source.split('?')[0] || source;
  }

  function pickDistinctImage(candidates: unknown[], seen: Set<string>) {
    for (const candidate of candidates) {
      const image = String(candidate || '').trim();
      if (!image) continue;
      const key = imageIdentity(image);
      if (seen.has(key)) continue;
      seen.add(key);
      return image;
    }
    const fallback = String(candidates.find(Boolean) || '').trim();
    if (fallback) seen.add(imageIdentity(fallback));
    return fallback;
  }

  function interleaveCanvasItems(items: GalleryImportItem[]) {
    const groups = new Map<string, GalleryImportItem[]>();
    for (const item of items) {
      const key = item.sourceUrl || item.title || item.category || 'misc';
      const group = groups.get(key) || [];
      group.push(item);
      groups.set(key, group);
    }
    const output: GalleryImportItem[] = [];
    const values = Array.from(groups.values());
    const max = Math.max(0, ...values.map((group) => group.length));
    for (let index = 0; index < max; index += 1) {
      for (const group of values) {
        const item = group[index];
        if (item) output.push(item);
      }
    }
    return output;
  }

  function projectSection(
    project: SchuktuewProject,
    type: string,
    index: number,
    data: Record<string, unknown>,
    container: 'default' | 'wide' | 'full' = 'default',
    spacingTop = 'l',
    spacingBottom = 'l',
  ) {
    return {
      id: `${project.slug}-${String(index).padStart(2, '0')}-${type}`,
      type,
      ...regularSectionIdentity(type),
      visible: true,
      locked: false,
      data,
      container,
      spacingTop,
      spacingBottom,
      styleOverrides: DARK_SECTION_STYLE,
    };
  }

  function sectionsForProject(project: SchuktuewProject) {
    const story = storyForProject(project);
    const gallery = galleryForProject(project);
    const category = String(project.data.category || 'Projekt');
    return [
      projectSection(project, 'collectionHero', 1, {
        category,
        headline: project.title,
        subline: story.lead,
        bgImage: project.data.image,
        overlayColor: '#050505',
        overlayOpacity: 0.66,
        primaryCta: { label: 'Projekt anfragen', href: '/kontakt' },
        secondaryCta: { label: 'Zurück zum Portfolio', href: '/portfolio' },
      }, 'full', 'none', 'none'),
      projectSection(project, 'statsCounter', 2, {
        badge: 'Fakten',
        headline: 'Projekt auf einen Blick.',
        subline: 'Bereich, Umfang und Einsatz der Arbeit.',
        layout: 'projectDossier',
        stats: story.facts.map((fact) => ({ value: fact.value, label: fact.label })),
      }, 'default', 'l', 'l'),
      projectSection(project, 'spotlightCards', 3, {
        badge: 'Projektprofil',
        headline: 'Was die Serie ausmacht.',
        subline: story.lead,
        cards: story.angles,
      }, 'default', 'xl', 'l'),
      projectSection(project, 'galleryPro', 4, {
        badge: 'Galerie',
        headline: `${project.title} in Bildern`,
        subline: 'Auswahl aus der Projektgalerie.',
        images: gallery.slice(0, 28).map((src, imageIndex) => ({
          src,
          alt: `${project.title} ${imageIndex + 1}`,
          category,
          caption: imageIndex === 0 ? `${category} · ${project.title}` : '',
        })),
      }, 'wide', 'l', 'xl'),
      projectSection(project, 'ctaBand', 5, {
        badgeText: 'Ähnliches Projekt',
        headline: 'Eine starke Bildwelt planen?',
        subline: 'Kurz Projektziel, Einsatzkanäle und Timing senden.',
        ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt', icon: 'ArrowRight' },
        ctaSecondary: { label: 'Portfolio ansehen', href: '/portfolio' },
      }, 'default', 'l', 'xl'),
    ];
  }

  function enrichProject(project: SchuktuewProject) {
    const story = storyForProject(project);
    const gallery = galleryForProject(project);
    return {
      ...project,
      data: {
        ...project.data,
        description: String(project.data.description || story.lead),
        contentLead: story.lead,
        facts: story.facts,
        gallery,
        sections: sectionsForProject({ ...project, data: { ...project.data, gallery, description: String(project.data.description || story.lead) } }),
      },
    };
  }

  const projectImageKeys = new Set<string>();
  const allProjects = [...curatedProjects, ...importedProjects]
    .map((project) => {
      const baseProject = project as SchuktuewProject;
      const distinctImage = pickDistinctImage(galleryForProject(baseProject), projectImageKeys) || baseProject.data.image;
      return enrichProject({ ...baseProject, data: { ...baseProject.data, image: distinctImage } });
    });
  const importedGalleryItems = interleaveCanvasItems(extras.galleryItems || []).map((item) => {
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
    { image: assets.aboutPortrait04, alt: 'Portraitmotiv', title: 'Portrait', caption: '', category: 'Portrait' },
    { image: assets.aboutPortrait05, alt: 'Portraitmotiv', title: 'Portrait', caption: '', category: 'Portrait' },
    { image: assets.aboutStill01, alt: 'Fotografisches Motiv', title: 'Still', caption: '', category: 'Archiv' },
    { image: assets.aboutStill02, alt: 'Dokumentarisches Motiv', title: 'Still', caption: '', category: 'Archiv' },
    { image: assets.aboutStill03, alt: 'Freies Projektmotiv', title: 'Freies Projekt', caption: '', category: 'Archiv' },
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
            text: '<p>Ich entwickle visuelle Auftritte für Unternehmen, Persönlichkeiten und Marken, die klar positionieren statt austauschbar zu wirken. Aus Ingolstadt und München entstehen Portraits, Kampagnenbilder, Reels und Content-Strecken mit einem präzisen Look.</p>',
            imagePrimary: assets.heroPortrait,
            imageSecondary: assets.brandBox,
            hideImageOnMobile: true,
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
            headline: 'Keine Standardfotos. Eine klare visuelle Positionierung.',
            subline: 'Sie bekommen bei mir keine gewöhnlichen Headshots. Sie bekommen Bilder, die Autorität, Selbstbewusstsein und Individualität sichtbar machen.',
            preset: 'editorial',
            statements: [
              { prefix: 'Ich arbeite', highlight: 'nicht einfach', suffix: 'als Fotograf.', text: 'Ich denke wie eine Marke und übersetze Werte, Haltung und Identität in Bilder, die wirken, bevor Sie ein Wort sagen.', image: assets.businessCampaign },
              { prefix: 'Ich entwickle', highlight: 'Bildwelten', suffix: 'für Ihr Business.', text: 'Kommunikation, Marketing und Employer Branding bekommen einen hochwertigen, strategisch gedachten visuellen Rahmen.', image: assets.personalBranding },
              { prefix: 'Ich kreiere', highlight: 'Portraits', suffix: 'auf den Punkt.', text: 'Präzise geführt, klar inszeniert und darauf konzentriert, wer Sie sind und wofür Sie stehen.', image: assets.portraitStudy },
            ],
            cta: { label: 'Anfrage starten', href: '/kontakt' },
          },
        },
        {
          type: 'aiWorkflowReel',
          data: {
            badge: 'AI Production System',
            headline: 'Foto, Film und Content aus einer Hand.',
            subline: 'Konzept, Bildwelt, Shooting, Schnitt und Formatadaption greifen ineinander. So entsteht ein konsistenter visueller Auftritt für Website, Social, Kampagne und Recruiting.',
            media: {
              videoSrc: assets.agencyReel,
              poster: '',
              caption: 'Produktion für Content, Kampagnen und Social Assets.',
            },
            steps: [
              { kicker: '01 · Richtung', title: 'Wirkung festlegen', text: 'Vor dem Shooting klären wir, wofür Ihr Auftritt stehen soll und welche Motive diese Wirkung tragen.', proof: 'Branding-Beratung & Moodboard' },
              { kicker: '02 · Produktion', title: 'Menschen sicher führen', text: 'Posing, Ausdruck, Licht und Raum werden so geführt, dass vor der Kamera Klarheit entsteht.', proof: 'Studio oder On-Location' },
              { kicker: '03 · Formate', title: 'Kanäle mitdenken', text: 'Website-Motive, Reels, Social Cuts und Kampagnenbilder werden nicht nachträglich improvisiert, sondern direkt eingeplant.', proof: 'Reels, Ads, Website, Social' },
              { kicker: '04 · Übergabe', title: 'Nutzbare Assets liefern', text: 'Sie bekommen Bild- und Filmdateien, die nicht nur gut aussehen, sondern Vertrauen aufbauen und Entscheidungen beeinflussen.', proof: 'Kampagnenfähig' },
            ],
            cta: { label: 'Produktion besprechen', href: '/kontakt' },
          },
        },
        {
          type: 'cameraExplodeScroll',
          data: {
            badge: 'Production System',
            headline: 'So wird aus einem Motiv ein kompletter Markenauftritt.',
            subline: 'Ich zerlege ein Projekt vor der Produktion in Wirkung, Bildsprache, Führung, Formate und Auslieferung. Dadurch entstehen nicht nur einzelne Bilder, sondern Assets für Website, Social, Kampagne und Recruiting.',
            brandImage: '',
            parts: [
              { id: 'briefing', label: 'Briefing', text: 'Ich kläre Ziel, Zielgruppe, Einsatzkanäle und gewünschte Wirkung, bevor Kamera oder AI ins Spiel kommen.', offsetX: -174, offsetY: -8, offsetZ: -42, color: '#151515' },
              { id: 'look', label: 'Bildsprache', text: 'Licht, Farbe, Perspektive und Setting werden als klare visuelle Linie für Marke, Mensch oder Kampagne angelegt.', offsetX: 164, offsetY: -46, offsetZ: 154, color: '#070707' },
              { id: 'direction', label: 'Führung', text: 'Vor der Kamera geht es um Haltung, Ausdruck und Sicherheit. Ich führe Menschen so, dass der Auftritt glaubwürdig wirkt.', offsetX: 82, offsetY: -146, offsetZ: 86, color: '#050505' },
              { id: 'ai-workflow', label: 'AI Workflow', text: 'KI nutze ich kontrolliert für Varianten, Planung und Adaptionen – nicht als Zufallsgenerator, sondern als Erweiterung der Bildwelt.', offsetX: 180, offsetY: 72, offsetZ: -132, color: '#d11224' },
              { id: 'finish', label: 'Finish', text: 'Auswahl, Retusche, Schnitt und Grading bringen Foto, Film und Reel-Material auf denselben visuellen Anspruch.', offsetX: -142, offsetY: 134, offsetZ: -148, color: '#f4eee3' },
              { id: 'assets', label: 'Assets', text: 'Geliefert werden nutzbare Dateien für Website, Social Media, Kampagnen, Recruiting, Präsentation und Print.', offsetX: 150, offsetY: 150, offsetZ: 142, color: '#c7ff4a' },
            ],
            cta: { label: 'Workflow ansehen', href: '/ai-workflows' },
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
            headline: 'Bewegtbild für Social, Sport und Kampagne.',
            subline: 'Ich produziere vertikale Filme für Markenauftritte, Sportkommunikation und Social Media – von der Idee bis zum fertigen Schnitt.',
            aspectRatio: '9/16',
            reels: [
              { eyebrow: 'Produktion', title: 'Foto, Film und Schnitt aus einer Hand', text: 'Ich entwickle Motive und Clips gemeinsam, damit der Auftritt über alle Kanäle zusammenpasst.', videoSrc: assets.agencyReel, poster: '', meta: 'Foto & Film', ctaLabel: 'Anfragen', ctaHref: '/kontakt' },
              { eyebrow: 'Golf', title: 'Bewegung, Timing und Präzision', text: 'Golf in Bewegung – fotografiert und geschnitten für Social Media, Website und Kampagne.', videoSrc: assets.golfReel, poster: '', meta: 'Sportfilm', ctaLabel: 'Sport ansehen', ctaHref: '/portfolio' },
              { eyebrow: 'Commercial', title: 'Kurze Filme mit klarer Idee', text: 'Konzept, Bildsprache und Schnitt greifen ineinander, damit auch im Hochformat ein eigenständiger Film entsteht.', videoSrc: assets.referenceReel, poster: '', meta: 'Commercial Reel', ctaLabel: 'Produktion planen', ctaHref: '/kontakt' },
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
            headline: 'Menschen, Marken und Bewegung.',
            intro: 'Ich fotografiere Portraits, Business- und Kampagnenmotive, Sport, Commercials und dokumentarische Buchprojekte.',
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
            headline: 'Portfolio als visuelle Landkarte.',
            subline: 'Eine reduzierte Bildlandkarte aus Portrait, Sport, Commercial und Buchprojekten – performant kuratiert statt überladen.',
            ctaLabel: 'Canvas öffnen',
            maxExplorerItems: 20,
            items: portfolioItems,
          },
        },
        {
          type: 'editorialCardMorph',
          data: {
            badge: 'Cases',
            headline: 'Ausgewählte Linien.',
            subline: 'Ausgewählte Projekte mit direktem Weg zur Detailseite und Galerie.',
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
      slug: 'projekte',
      title: 'Projekte',
      seo: {
        metaTitle: 'Projekte · Alexander Schuktuew',
        metaDescription: 'Fotoprojekte aus Portrait, Business Branding, Sport, Commercial und dokumentarischer Arbeit – mit Galerien und Projektkontext.',
        ogImage: assets.businessCampaign,
      },
      sections: [
        {
          type: 'editorialHero',
          data: {
            eyebrow: 'Projekte',
            headline: 'Jede Arbeit hat ihren eigenen Rhythmus.',
            text: '<p>Portrait, Kampagne, Sport und dokumentarische Projekte – hier sind die Serien mit Kontext, Auswahl und vollständiger Galerie gebündelt.</p>',
            imagePrimary: assets.businessCampaign,
            imageSecondary: assets.portraitStudy,
            primaryCta: { label: 'Projekt besprechen', href: '/kontakt' },
            secondaryCta: { label: 'Canvas öffnen', href: '/portfolio' },
            hint: 'Portrait · Business · Sport · Dokumentarisch',
          },
        },
        {
          type: 'collectionList',
          container: 'default',
          spacingTop: 'xl',
          spacingBottom: 'xl',
          data: {
            headline: 'Alle Projekte',
            subline: 'Serien, Kampagnen und freie Arbeiten mit eigener Detailseite und Galerie.',
            collectionKey: 'projekte',
            collectionBasePath: '/c/projekte',
            showImage: true,
            showDate: false,
            showExcerpt: true,
            showSortControls: true,
            sortBy: 'priority',
            columns: 3,
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
      sections: buildSchuktuewAiWorkflowSections(assets),
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
            text: '<p>Ich bin Alexander Schuktuew – Fotograf mit Schwerpunkt auf Portraitfotografie. Ich arbeite für Unternehmen, Editorial und freie Projekte aus dem Raum München und Ingolstadt.</p><p>Menschen zu fotografieren ist für mich keine rein technische Aufgabe, sondern ein Moment von Konzentration und Vertrauen. Ein Portrait funktioniert dann, wenn es mehr zeigt als Oberfläche.</p>',
            imagePrimary: assets.studioWide,
            imageSecondary: assets.portraitStudy,
            primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' },
            secondaryCta: { label: 'Portfolio', href: '/portfolio' },
            hint: 'Portrait · Commercial · Fashion · Sport',
          },
        },
        {
          type: 'spotlightCards',
          data: {
            badge: 'Werdegang',
            headline: 'Visual Journalism, Portrait und freie Projekte.',
            subline: 'Meine Arbeit bewegt sich zwischen dokumentarischer Genauigkeit und klar reduzierter Bildsprache.',
            cards: [
              { title: 'Visual Journalism', text: 'Meine Ausbildung an der Hochschule Hannover hat mich gelehrt, nicht nur Momente festzuhalten, sondern Geschichten zu erzählen, die wirken.', icon: 'BookOpen' },
              { title: 'Berlin / Oliver Mark', text: 'Als Assistent bei Oliver Mark habe ich erlebt, wie Portraits für Stern, GQ und ZEIT Magazin entstehen: mit Ruhe, Präsenz und präzisem Timing.', icon: 'Camera' },
              { title: 'Portraits mit Haltung', text: 'Ich fotografiere Menschen nicht als Rollen, sondern als Persönlichkeiten – reduziert, konzentriert und ohne unnötige Inszenierung.', icon: 'UserRound' },
              { title: 'Bücher & Ausstellungen', text: 'Parallel zur Auftragsarbeit entwickle ich freie Projekte, die in Buchform veröffentlicht und im Ausstellungskontext gezeigt wurden.', icon: 'Images' },
              { title: 'Arbeitsfelder', text: 'Portrait, Unternehmen, Editorial, Lifestyle, Sport und freie dokumentarische Projekte aus dem Raum Ingolstadt und München.', icon: 'MapPin' },
              { title: 'Referenzen', text: 'Auszug aus bisherigen Kontexten: Audi, Levi’s, Converse, Spiegel, Stadt Ingolstadt, ERC Ingolstadt, Solo Skate Magazin und weitere.', icon: 'BadgeCheck' },
            ],
            cta: { label: 'Anfrage senden', href: '/kontakt' },
          },
        },
        {
          type: 'galleryPro',
          data: {
            badge: 'Bildsprache',
            headline: 'Portraits, Stills und dokumentarische Motive.',
            subline: 'Auswahl aus Portrait, Studio, Buchprojekten und freien Arbeiten – dichter und näher an der ursprünglichen Info-Seite.',
            images: [
              { src: assets.studioWide, alt: 'Studioarbeit Alexander Schuktuew', category: 'Studio', caption: 'Studio und dokumentarischer Blick.' },
              { src: assets.portraitStudy, alt: 'Portraitarbeit Alexander Schuktuew', category: 'Portrait', caption: 'Portrait als reduzierte Präsenz.' },
              { src: assets.personalBranding, alt: 'Personal Branding Portrait', category: 'Portrait', caption: 'Bildsprache für Persönlichkeit und Marke.' },
              { src: assets.ingolstadtBook, alt: 'Buchprojekt Ingolstadt', category: 'Buchprojekt', caption: 'Freie fotografische Arbeit.' },
              { src: assets.aboutPortrait01, alt: 'Portraitmotiv', category: 'Portrait', caption: '' },
              { src: assets.aboutPortrait02, alt: 'Portraitmotiv', category: 'Portrait', caption: '' },
              { src: assets.aboutPortrait03, alt: 'Dokumentarisches Portraitmotiv', category: 'Portrait', caption: '' },
              { src: assets.aboutPortrait04, alt: 'Portraitmotiv', category: 'Portrait', caption: '' },
              { src: assets.aboutPortrait05, alt: 'Portraitmotiv', category: 'Portrait', caption: '' },
              { src: assets.aboutStill01, alt: 'Fotografisches Motiv', category: 'Archiv', caption: '' },
              { src: assets.aboutStill02, alt: 'Dokumentarisches Motiv', category: 'Archiv', caption: '' },
              { src: assets.aboutStill03, alt: 'Freies Projektmotiv', category: 'Archiv', caption: '' },
              { src: assets.eiszeitDetail01, alt: 'EISZEIT Buchdetail', category: 'Buchprojekt', caption: '' },
              { src: assets.eiszeitDetail02, alt: 'EISZEIT Portraitdetail', category: 'Buchprojekt', caption: '' },
            ],
          },
          container: 'wide',
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
        buttonColor: '#f4eee3',
        buttonTextColor: '#080808',
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
      cta: { label: 'Projekt anfragen', href: '/kontakt', variant: 'editorial' },
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
            { key: 'contentLead', label: 'Projekttext', type: 'textarea' },
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
    return { tenantId: existing.id, reused: true, vercelProjectId: existing.vercelProjectId, result: null as Awaited<ReturnType<typeof provisionTenant>> | null };
  }

  if (!process.env.SCHUKTUEW_DATABASE_URL?.trim()) {
    requireEnv(['CRM_CONFIG_ENCRYPTION_KEY', 'NEON_API_KEY']);
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
  return { tenantId: result.tenantId, reused: false, vercelProjectId: (result as { vercelProjectId?: string }).vercelProjectId, result };
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
    'DATABASE_URL',
  ];
  requireEnv(requiredEnv);

  const { tenantId, reused, vercelProjectId, result } = await getOrProvisionTenant();
  console.log(reused ? `Tenant reused: ${tenantId}` : `Tenant provisioniert: ${tenantId}`);

  if (!process.env.SCHUKTUEW_DATABASE_URL?.trim()) {
    await loadTenantVercelProjectEnv(vercelProjectId, { DATABASE_URL: 'SCHUKTUEW_DATABASE_URL' });
  }
  if (!process.env.SCHUKTUEW_DATABASE_URL?.trim()) {
    requireEnv(['CRM_CONFIG_ENCRYPTION_KEY']);
  }
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
