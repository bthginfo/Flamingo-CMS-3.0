import type { SectionContract, SectionFieldContract } from './section-contracts';
import { PERSPECTIVE_SECTION_PREVIEW_DATA } from './perspective-section-data';

const field = (key: string, label: string, type: SectionFieldContract['type'] = 'text', rest: Partial<SectionFieldContract> = {}): SectionFieldContract => ({ key, label, type, ...rest });
const cta = (key = 'cta', label = 'Weiterführender Link') => field(key, label, 'cta', { itemFields: [field('label', 'Beschriftung'), field('href', 'Link-Ziel')] });
const media = (prefix = 'image', label = 'Bild'): SectionFieldContract[] => [field(prefix, label, 'image', { supportsFocalPoint: true }), field(`${prefix}Alt`, 'Alternativtext'), field(`${prefix}Position`, 'Bildausschnitt')];
const base = (type: string, label: string, fields: SectionFieldContract[]): SectionContract => ({ type, label, category: 'shared', wrapper: 'fullBleed', defaultTheme: 'auto', fields, colorFields: [], colorSlots: [], previewData: PERSPECTIVE_SECTION_PREVIEW_DATA[type], maturity: 'formal', source: 'curated' });

export const PERSPECTIVE_SECTION_CONTRACTS: SectionContract[] = [
  base('perspectiveHero', 'Perspektivischer Einstieg', [
    field('layout', 'Komposition', 'select', { options: ['panorama', 'statement', 'portrait', 'journal', 'compact'] }),
    field('eyebrow', 'Dachzeile'), field('headline', 'Seitentitel', 'textarea', { required: true }), field('text', 'Einleitung', 'textarea'), ...media(), field('imageMobilePosition', 'Bildausschnitt auf Mobilgeräten'), field('caption', 'Bildunterschrift'), cta('primaryCta', 'Primäre Aktion'), cta('secondaryCta', 'Sekundäre Aktion'), field('meta', 'Ergänzende Angaben', 'list'),
  ]),
  base('photoChapter', 'Fotografisches Kapitel', [
    field('layout', 'Komposition', 'select', { options: ['feature', 'immersive', 'diptych'] }), field('headline', 'Überschrift', 'textarea'), field('text', 'Text', 'richText'), ...media(), ...media('secondaryImage', 'Zweites Bild'), field('caption', 'Bildunterschrift'), cta(),
  ]),
  base('topicExplorer', 'Themen entdecken', [
    field('headline', 'Überschrift'), field('intro', 'Einleitung', 'textarea'), field('items', 'Themen', 'list', { itemFields: [field('id', 'Stabile ID'), field('title', 'Thema', 'text', { required: true }), field('summary', 'Kurzbeschreibung', 'textarea'), field('detail', 'Vertiefung', 'richText'), ...media(), field('bullets', 'Konkrete Fragen', 'list'), field('meta', 'Ansprechpartner und Angaben', 'list'), cta()] }),
  ]),
  base('editorialBriefing', 'Redaktioneller Überblick', [
    field('layout', 'Komposition', 'select', { options: ['columns', 'sequence', 'dossier'] }), field('headline', 'Überschrift'), field('intro', 'Einleitung', 'textarea'), field('groups', 'Themenabschnitte', 'list', { itemFields: [field('title', 'Überschrift'), field('text', 'Text', 'richText'), field('items', 'Ergänzende Punkte', 'list')] }), field('stages', 'Phasen', 'list', { itemFields: [field('title', 'Phase'), field('text', 'Beschreibung', 'textarea')] }), field('note', 'Hinweis', 'textarea'), cta(),
  ]),
  base('resourceList', 'Unterlagen und Links', [
    field('headline', 'Überschrift'), field('intro', 'Einleitung', 'textarea'), field('groups', 'Gruppen', 'list', { itemFields: [field('id', 'Sprungmarke'), field('title', 'Gruppenüberschrift'), field('items', 'Unterlagen und Links', 'list', { itemFields: [field('title', 'Bezeichnung'), field('description', 'Verwendungszweck', 'textarea'), field('href', 'Link-Ziel'), field('format', 'Dateiformat'), field('actionLabel', 'Link-Beschriftung')] })] }), field('note', 'Hinweis', 'textarea'),
  ]),
];
