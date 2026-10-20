import type { SectionContract, SectionFieldContract } from './section-contracts';
import { PERSPECTIVE_SECTION_PREVIEW_DATA } from './perspective-section-data';

const field = (key: string, label: string, type: SectionFieldContract['type'] = 'text', rest: Partial<SectionFieldContract> = {}): SectionFieldContract => ({ key, label, type, ...rest });
const cta = (key = 'cta', label = 'Weiterführender Link') => field(key, label, 'cta', { itemFields: [field('label', 'Beschriftung'), field('href', 'Link-Ziel'), field('iconPrefix', 'Symbol vor dem Text'), field('iconSuffix', 'Symbol nach dem Text (leer = kein Symbol)')] });
const media = (prefix = 'image', label = 'Bild', mobile = true): SectionFieldContract[] => [field(prefix, label, 'image', { supportsFocalPoint: true }), field(`${prefix}Alt`, 'Alternativtext'), field(`${prefix}Position`, 'Bildausschnitt Desktop'), ...(mobile ? [field(`${prefix}MobilePosition`, 'Bildausschnitt Mobil')] : [])];
const motion = [field('motion', 'Bewegung', 'select', { options: ['none', 'subtle', 'expressive'] }), field('hoverEffect', 'Bildreaktion', 'select', { options: ['none', 'zoom', 'lift'] })];
const imageEffect = field('imageEffect', 'Bildbewegung', 'select', { options: ['none', 'parallax', 'kenBurns'] });
const visualItems = field('items', 'Bildkapitel', 'list', { itemFields: [field('id', 'Stabile ID'), field('title', 'Titel'), field('text', 'Beschreibung', 'textarea'), ...media(), cta('link', 'Link im Bild')] });
const base = (type: string, label: string, fields: SectionFieldContract[]): SectionContract => ({ type, label, category: 'shared', wrapper: 'fullBleed', defaultTheme: 'auto', fields, colorFields: [], colorSlots: [], previewData: PERSPECTIVE_SECTION_PREVIEW_DATA[type], maturity: 'formal', source: 'curated' });

export const PERSPECTIVE_SECTION_CONTRACTS: SectionContract[] = [
  base('editorialReel', 'Fotografische Erzählung', [field('titleAs', 'Überschriftenebene', 'select', { options: ['h1', 'h2'] }), field('layout', 'Komposition', 'select', { options: ['opening', 'showcase'] }), field('headline', 'Überschrift', 'textarea'), field('intro', 'Einleitung', 'textarea'), visualItems, cta(), ...motion, imageEffect]),
  base('imageAtlas', 'Fotografischer Themenatlas', [field('titleAs', 'Überschriftenebene', 'select', { options: ['h1', 'h2'] }), field('headline', 'Überschrift', 'textarea'), field('intro', 'Einleitung', 'textarea'), visualItems, cta(), ...motion]),
  base('perspectiveHero', 'Perspektivischer Einstieg', [
    field('layout', 'Komposition', 'select', { options: ['panorama', 'statement', 'portrait', 'journal', 'compact'] }),
    field('eyebrow', 'Dachzeile'), field('headline', 'Seitentitel', 'textarea', { required: true }), field('text', 'Einleitung', 'textarea'), ...media(), field('caption', 'Bildunterschrift'), cta('primaryCta', 'Primäre Aktion'), cta('secondaryCta', 'Sekundäre Aktion'), field('meta', 'Ergänzende Angaben', 'list'), ...motion, imageEffect,
  ]),
  base('photoChapter', 'Fotografisches Kapitel', [
    field('layout', 'Komposition', 'select', { options: ['feature', 'immersive', 'diptych', 'spread'] }), field('headline', 'Überschrift', 'textarea'), field('text', 'Text', 'richText'), ...media(), ...media('secondaryImage', 'Zweites Bild'), field('caption', 'Bildunterschrift'), cta(), ...motion, imageEffect,
  ]),
  base('topicExplorer', 'Themen entdecken', [
    field('headline', 'Überschrift'), field('intro', 'Einleitung', 'textarea'), field('items', 'Themen', 'list', { itemFields: [field('id', 'Stabile ID'), field('title', 'Thema', 'text', { required: true }), field('summary', 'Kurzbeschreibung', 'textarea'), field('detail', 'Vertiefung', 'richText'), ...media('image', 'Bild', false), field('bullets', 'Konkrete Fragen', 'list'), field('meta', 'Ansprechpartner und Angaben', 'list'), cta()] }),
  ]),
  base('editorialBriefing', 'Redaktioneller Überblick', [
    field('layout', 'Komposition', 'select', { options: ['columns', 'sequence', 'dossier'] }), field('headline', 'Überschrift'), field('intro', 'Einleitung', 'textarea'), field('groups', 'Themenabschnitte', 'list', { itemFields: [field('title', 'Überschrift'), field('text', 'Text', 'richText'), field('items', 'Ergänzende Punkte', 'list')] }), field('stages', 'Phasen', 'list', { itemFields: [field('title', 'Phase'), field('text', 'Beschreibung', 'textarea')] }), field('note', 'Hinweis', 'textarea'), cta(),
  ]),
  base('resourceList', 'Unterlagen und Links', [
    field('headline', 'Überschrift'), field('intro', 'Einleitung', 'textarea'), field('groups', 'Gruppen', 'list', { itemFields: [field('id', 'Sprungmarke'), field('title', 'Gruppenüberschrift'), field('items', 'Unterlagen und Links', 'list', { itemFields: [field('title', 'Bezeichnung'), field('description', 'Verwendungszweck', 'textarea'), field('href', 'Link-Ziel'), field('format', 'Dateiformat'), field('actionLabel', 'Link-Beschriftung')] })] }), field('note', 'Hinweis', 'textarea'),
  ]),
];
