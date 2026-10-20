'use client';

import { useEffect, useId, useState } from 'react';
import { ArrowDown, ArrowUp, Check, Copy, ImageIcon, Plus, Trash2 } from 'lucide-react';
import { ImageUploadField } from '@/components/image-upload-field';
import { ButtonField } from '@/components/button-field';
import { MediaBulkPickerButton } from '@/components/media-bulk-picker';
import { RichTextEditorField } from '@/components/rich-text-editor';
import { StringListField } from '@/components/string-list-field';
import { editorialItems, editorialItemPanelId, moveEditorialItem, duplicateEditorialItem, newEditorialItem, type EditorialItem } from '@/lib/perspective-editor-items';

type RecordData = Record<string, unknown>;
type Props = { type?: string; data: RecordData; onChange: (data: RecordData) => void; sectionId?: string };
const text = (value: unknown) => typeof value === 'string' ? value : '';
const record = (value: unknown): RecordData => value && typeof value === 'object' && !Array.isArray(value) ? value as RecordData : {};
const actionClass = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-zinc-700 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-30';

function TextField({ label, value, onChange, multiline = false, hint }: { label: string; value: unknown; onChange: (value: string) => void; multiline?: boolean; hint?: string }) {
  return <label className="block text-sm"><span className="mb-1.5 block font-medium text-zinc-700">{label}</span>{multiline ? <textarea rows={3} className="admin-input w-full resize-y" value={text(value)} onChange={event => onChange(event.target.value)} /> : <input className="admin-input w-full" value={text(value)} onChange={event => onChange(event.target.value)} />}{hint && <span className="mt-1.5 block text-xs leading-5 text-zinc-600">{hint}</span>}</label>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: unknown; options: [string, string][]; onChange: (value: string) => void }) {
  return <label className="block text-sm"><span className="mb-1.5 block font-medium text-zinc-700">{label}</span><select className="admin-input w-full" value={text(value) || options[0][0]} onChange={event => onChange(event.target.value)}>{options.map(([key, title]) => <option key={key} value={key}>{title}</option>)}</select></label>;
}

const FOCAL_POINTS = [
  ['left top', 'Oben links'], ['top', 'Oben mittig'], ['right top', 'Oben rechts'],
  ['left center', 'Mitte links'], ['center', 'Mitte'], ['right center', 'Mitte rechts'],
  ['left bottom', 'Unten links'], ['bottom', 'Unten mittig'], ['right bottom', 'Unten rechts'],
];

function MobileFocalField({ image, value, desktop, onChange }: { image: string; value: string; desktop: string; onChange: (value: string) => void }) {
  return <fieldset className="space-y-3 rounded-lg border border-zinc-200 p-3"><legend className="px-1 text-sm font-medium text-zinc-700">Bildausschnitt Mobil</legend><div className="flex items-start gap-4">
    <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded bg-zinc-100">{image ? <img src={image} alt="Vorschau des mobilen Bildausschnitts" className="h-full w-full object-cover" style={{ objectPosition: value || desktop || 'center' }} /> : <ImageIcon className="m-auto mt-10 text-zinc-400" size={20} />}</div>
    <div className="flex-1"><div className="grid w-32 grid-cols-3 gap-1" role="group" aria-label="Mobilen Fokuspunkt wählen">{FOCAL_POINTS.map(([position, label]) => <button key={position} type="button" aria-label={`Mobil: ${label}`} aria-pressed={value === position} onClick={() => onChange(position)} className={`flex min-h-10 items-center justify-center rounded border focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${value === position ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}>{value === position ? <Check size={16} aria-hidden="true" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}</button>)}</div><button type="button" className="mt-2 min-h-9 text-xs font-medium text-blue-700 underline underline-offset-4" onClick={() => onChange('')}>Desktop-Ausschnitt übernehmen</button></div>
  </div><TextField label="Mobiler Fokuspunkt – genauer Wert" value={value} onChange={onChange} hint="Zum Beispiel 60% 30%. Leer übernimmt den Desktop-Ausschnitt." /></fieldset>;
}

function ImageFields({ value, onChange, prefix = 'image', label = 'Bild' }: { value: RecordData; onChange: (next: RecordData) => void; prefix?: string; label?: string }) {
  const patch = (key: string, next: string) => onChange({ ...value, [key]: next });
  return <div className="space-y-4"><ImageUploadField label={label} value={text(value[prefix])} onChange={next => patch(prefix, next)} position={text(value[`${prefix}Position`]) || 'center'} onPositionChange={next => patch(`${prefix}Position`, next)} /><TextField label="Alternativtext" value={value[`${prefix}Alt`]} onChange={next => patch(`${prefix}Alt`, next)} hint="Beschreiben Sie das sichtbare Motiv. Dekorative Bilder können einen leeren Alternativtext haben." /><TextField label="Bildausschnitt Desktop – genauer Wert" value={value[`${prefix}Position`]} onChange={next => patch(`${prefix}Position`, next)} hint="Zum Beispiel 50% 35%. Der Fokuspunkt oben und dieser Wert steuern denselben Ausschnitt." /><MobileFocalField image={text(value[prefix])} value={text(value[`${prefix}MobilePosition`])} desktop={text(value[`${prefix}Position`])} onChange={next => patch(`${prefix}MobilePosition`, next)} /></div>;
}

function LinkField({ label, value, onChange }: { label: string; value: unknown; onChange: (value: RecordData) => void }) {
  const stored = record(value);
  return <ButtonField label={label} value={{ ...stored, label: text(stored.label), href: text(stored.href) }} onChange={next => onChange(next)} allowCustomHref iconFields="both" />;
}

function MotionFields({ data, onChange, allowImageEffect }: { data: RecordData; onChange: (value: RecordData) => void; allowImageEffect: boolean }) {
  const motion = text(data.motion) || 'none';
  return <details className="rounded-lg border border-zinc-200"><summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-zinc-800">Bewegung und Bildreaktion</summary><div className="space-y-4 border-t border-zinc-200 p-4"><SelectField label="Bewegung" value={motion} options={[[ 'none', 'Keine Bewegung' ], [ 'subtle', 'Zurückhaltend' ], [ 'expressive', 'Ausdrucksstark' ]]} onChange={value => onChange({ ...data, motion: value })} />{motion !== 'none' ? <>{allowImageEffect && <SelectField label="Bildbewegung" value={data.imageEffect} options={[[ 'none', 'Ruhiges Bild' ], [ 'parallax', 'Leichte Verschiebung beim Scrollen' ], [ 'kenBurns', 'Langsame Bildfahrt' ]]} onChange={value => onChange({ ...data, imageEffect: value })} />}<SelectField label="Bildreaktion bei Mausberührung" value={data.hoverEffect} options={[[ 'none', 'Keine Reaktion' ], [ 'zoom', 'Sanft vergrößern' ], [ 'lift', 'Sanft anheben' ]]} onChange={value => onChange({ ...data, hoverEffect: value })} /></> : <p className="text-xs leading-5 text-zinc-600">Bildfahrt, Verschiebung, Hover-Bewegung und sanftes Blättern sind ausgeschaltet.</p>}<p className="text-xs leading-5 text-zinc-600">Die Systemeinstellung „Bewegung reduzieren“ wird immer berücksichtigt.</p></div></details>;
}

export function PerspectiveContactBandEditor({ data, onChange }: Props) {
  const update = (key: string, value: unknown) => onChange({ ...data, [key]: value });
  return <div className="space-y-5" data-perspective-section-editor="contactBand"><TextField label="Überschrift" value={data.headline} onChange={value => update('headline', value)} multiline /><TextField label="Text" value={data.subline} onChange={value => update('subline', value)} multiline /><LinkField label="Primäre Aktion" value={data.ctaPrimary} onChange={value => update('ctaPrimary', value)} /><LinkField label="Sekundäre Aktion" value={data.ctaSecondary} onChange={value => update('ctaSecondary', value)} /></div>;
}

/** Scoped image editing: preserves the outer section/save/preview/translation pipeline. */
export function PerspectiveSectionEditor({ type, data, onChange, sectionId }: Props) {
  const repeatable = type === 'editorialReel' || type === 'imageAtlas';
  const items = editorialItems(data.items);
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id || null);
  const fallbackInstance = useId();
  const instance = sectionId || fallbackInstance;
  const selected = items.find(item => item.id === selectedId);
  const update = (key: string, value: unknown) => onChange({ ...data, [key]: value });
  const updateItems = (next: EditorialItem[]) => update('items', next);
  useEffect(() => { setSelectedId(items[0]?.id || null); }, [sectionId, type]); // Switch the selected editor with its section.
  useEffect(() => {
    if (repeatable && JSON.stringify(data.items || []) !== JSON.stringify(items)) onChange({ ...data, items });
    // IDs are repaired only when stored entries arrive; ordinary field edits stay immediate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeatable, data.items]);

  function addItems(images = [{ src: '', alt: '' }]) {
    const additions = images.map(image => newEditorialItem(crypto.randomUUID(), image.src, image.alt));
    updateItems([...items, ...additions]);
    setSelectedId(additions[0]?.id || null);
  }

  return <div className="space-y-6" data-perspective-section-editor={type} data-editor-section-id={sectionId}>
    <div className="space-y-4">
      {repeatable && <SelectField label="Überschriftenebene" value={data.titleAs || 'h2'} options={[[ 'h2', 'Abschnittsüberschrift (H2)' ], [ 'h1', 'Seitentitel (H1)' ]]} onChange={value => update('titleAs', value)} />}
      {type === 'editorialReel' && <SelectField label="Komposition" value={data.layout || 'showcase'} options={[[ 'opening', 'Großer Seiteneinstieg' ], [ 'showcase', 'Fotokapitel im Seitenverlauf' ]]} onChange={value => update('layout', value)} />}
      {type === 'photoChapter' && <SelectField label="Komposition" value={data.layout || 'feature'} options={[[ 'feature', 'Bild und Text' ], [ 'diptych', 'Versetztes Bildpaar' ], [ 'spread', 'Redaktionelle Bildstrecke' ], [ 'immersive', 'Text auf großem Bild' ]]} onChange={value => update('layout', value)} />}
      {type === 'perspectiveHero' && <SelectField label="Komposition" value={data.layout || 'panorama'} options={[[ 'panorama', 'Panorama mit Text im Bild' ], [ 'statement', 'Großer Titel über Bild' ], [ 'portrait', 'Porträt neben Text' ], [ 'journal', 'Redaktioneller Einstieg' ], [ 'compact', 'Kompakter Seitentitel' ]]} onChange={value => update('layout', value)} />}
      <TextField label={type === 'perspectiveHero' ? 'Seitentitel' : 'Überschrift'} value={data.headline} onChange={value => update('headline', value)} multiline />
      {repeatable ? <TextField label="Einleitung" value={data.intro} onChange={value => update('intro', value)} multiline /> : type === 'photoChapter' ? <RichTextEditorField label="Text" value={text(data.text)} onChange={value => update('text', value)} /> : <TextField label="Einleitung" value={data.text} onChange={value => update('text', value)} multiline />}
    </div>
    {repeatable ? <section className="space-y-4" aria-label="Bildkapitel bearbeiten"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-sm font-semibold text-zinc-900">{type === 'imageAtlas' ? 'Themenbilder' : 'Bildkapitel'} <span className="font-normal text-zinc-600">({items.length})</span></h3><div className="flex gap-3"><MediaBulkPickerButton onSelect={images => addItems(images)} /><button type="button" className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-zinc-700" onClick={() => addItems()}><Plus size={16} aria-hidden="true" />Eintrag hinzufügen</button></div></div>
      {items.length === 0 && <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-sm leading-6 text-zinc-600">Noch keine Einträge. Fügen Sie ein Thema hinzu oder wählen Sie mehrere Bilder aus der Mediathek.</p>}
      <ol className="m-0 list-none space-y-2 p-0">{items.map((item, index) => {
        const title = text(item.title) || 'Unbenannter Eintrag';
        const open = item.id === selectedId;
        const panelId = editorialItemPanelId(instance, item.id);
        return <li key={item.id} data-item-id={item.id} className={`overflow-hidden rounded-lg border ${open ? 'border-blue-500' : 'border-zinc-200'}`}><div className="flex items-center gap-1 pr-1"><button type="button" className="flex min-h-16 min-w-0 flex-1 items-center gap-3 px-3 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-50" aria-expanded={open} aria-controls={open ? panelId : undefined} onClick={() => setSelectedId(open ? null : item.id)}>{text(item.image) ? <img src={text(item.image)} alt="" className="h-11 w-14 shrink-0 rounded object-cover" style={{ objectPosition: text(item.imagePosition) || 'center' }} /> : <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded bg-zinc-100"><ImageIcon size={20} aria-hidden="true" /></span>}<span className="truncate font-medium">{title}</span></button><div className="flex shrink-0"><button type="button" className={actionClass} aria-label={`${title}: nach oben`} disabled={index === 0} onClick={() => updateItems(moveEditorialItem(items, item.id, -1))}><ArrowUp size={16} aria-hidden="true" /></button><button type="button" className={actionClass} aria-label={`${title}: nach unten`} disabled={index === items.length - 1} onClick={() => updateItems(moveEditorialItem(items, item.id, 1))}><ArrowDown size={16} aria-hidden="true" /></button><button type="button" className={actionClass} aria-label={`${title}: duplizieren`} onClick={() => { const id = crypto.randomUUID(); updateItems(duplicateEditorialItem(items, item.id, id)); setSelectedId(id); }}><Copy size={16} aria-hidden="true" /></button><button type="button" className={`${actionClass} hover:text-red-700`} aria-label={`${title}: entfernen`} onClick={() => { updateItems(items.filter(row => row.id !== item.id)); if (open) setSelectedId(items[index + 1]?.id || items[index - 1]?.id || null); }}><Trash2 size={16} aria-hidden="true" /></button></div></div>
          {open && selected && <div id={panelId} className="space-y-5 border-t border-zinc-200 p-4" data-item-editor={item.id}><TextField label="Titel" value={selected.title} onChange={value => updateItems(items.map(row => row.id === item.id ? { ...row, title: value } : row))} /><TextField label="Beschreibung" value={selected.text} onChange={value => updateItems(items.map(row => row.id === item.id ? { ...row, text: value } : row))} multiline /><ImageFields value={selected} onChange={value => updateItems(items.map(row => row.id === item.id ? { ...value, id: row.id } : row))} /><LinkField label="Link im Bild" value={selected.link} onChange={value => updateItems(items.map(row => row.id === item.id ? { ...row, link: value } : row))} /></div>}
        </li>;
      })}</ol>
    </section> : <>
      <ImageFields value={data} onChange={onChange} />
      {type === 'photoChapter' && data.layout !== 'immersive' && <details className="rounded-lg border border-zinc-200" open={Boolean(data.secondaryImage)}><summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-zinc-800">Zweites Bild</summary><div className="border-t border-zinc-200 p-4"><ImageFields value={data} onChange={onChange} prefix="secondaryImage" label="Zweites Bild" /></div></details>}
      <TextField label="Bildunterschrift (optional)" value={data.caption} onChange={value => update('caption', value)} />
      {type === 'perspectiveHero' && <><TextField label="Dachzeile (optional)" value={data.eyebrow} onChange={value => update('eyebrow', value)} /><StringListField label="Ergänzende Angaben" value={Array.isArray(data.meta) ? data.meta.filter((row): row is string => typeof row === 'string') : []} onChange={value => update('meta', value)} /></>}
    </>}
    {type === 'perspectiveHero' ? <><LinkField label="Primäre Aktion" value={data.primaryCta} onChange={value => update('primaryCta', value)} /><LinkField label="Sekundäre Aktion" value={data.secondaryCta} onChange={value => update('secondaryCta', value)} /></> : <LinkField label="Weiterführender Link (optional)" value={data.cta} onChange={value => update('cta', value)} />}
    <MotionFields data={data} onChange={onChange} allowImageEffect={type !== 'imageAtlas'} />
  </div>;
}
