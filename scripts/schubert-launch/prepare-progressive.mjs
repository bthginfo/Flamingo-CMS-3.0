/** Pure, deterministic preparation from fresh isolated exports. No network or DB access. */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// Reuse the renderer's static contracts. These modules have no DB or network IO.
const require = createRequire(import.meta.url);
require('tsx/cjs');
const { getFieldsForSection } = require('../../apps/renderer/src/lib/section-color-resolver.ts');
const { FIELD_DEFS } = require('../../apps/renderer/src/lib/section-color-fields.ts');

const p = text => `<p>${text}</p>`;
const strip = text => String(text || '').replace(/<[^>]*>/g, '').trim();
const uid = seed => { const h = createHash('sha256').update(seed).digest('hex'); return `${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`; };
const shared = new Set(['editorialHero','categoryMosaic','kineticIdentity','materialAtelier','cinematicChapters','zigzagShowcase','timeline']);
const definition = type => `${type}.${shared.has(type) ? 'shared' : type === 'portfolioGallery' ? 'photography' : 'tradesman'}.v1`;
const a = (label, href) => ({ label, href });
const asset = hash => `https://pym48op3zqrtrvbi.public.blob.vercel-storage.com/media/${hash}.webp`;
const images = {
  quarry: asset('a4aa859ac89b462c4ca485c63751433b9a9a777e446ac677d4d24c5c16ac6f7a'),
  workshop: asset('3494020252cf4075f5694fbdb8c360d756e6ba6c3905d877ca4516aa443470d1'),
  stairs: asset('4c1049bbf44488bee01d1c60be39665b77fe0b3258ce6e9c6135ba266ac36ac4'),
  floor: asset('1e4d74ed705f1444248a74b830214783ef6157e74608a4c167483899e0a12915'),
};
const grabAsset = file => `https://hiev8p82d1yvmbaq.public.blob.vercel-storage.com/schubert/launch-2026-10-19/${file}.jpg`;
const memorialImages = {
  headstone: grabAsset('3ffc336c1dfe1737b025'),
  inscription: grabAsset('bb307196a5ef8ffda7fe'),
  edging: grabAsset('35e7e70415cfb2740130'),
  heart: grabAsset('59e11894c85b3790659a'),
};

export function palette(dark = false) {
  const bg = dark ? '#0B0D0C' : '#F2EFE7', alt = dark ? '#151916' : '#E6E2D7', card = dark ? '#1B201B' : '#FBFAF6';
  const heading = dark ? '#F4F1E9' : '#20271F', body = dark ? '#D3D4C9' : '#434B40', muted = dark ? '#ADB3A5' : '#5C6557';
  const accent = dark ? '#C7CF9E' : '#59643F', line = dark ? '#42493E' : '#CBCDBE', button = dark ? '#F4F1E9' : '#20271F', buttonText = dark ? '#141812' : '#FFFFFF';
  return {
    '--token-section-bg':bg,'--token-section-bg-alt':alt,'--token-card-bg':card,
    '--token-heading':heading,'--token-subheading':body,'--token-body':body,'--token-muted':muted,
    '--token-card-heading':heading,'--token-card-body':body,'--token-card-muted':muted,'--token-card-border':line,
    '--token-icon':accent,'--token-card-icon':accent,'--token-accent':accent,'--token-eyebrow':accent,
    '--token-link':accent,'--token-link-hover':heading,'--token-divider':line,
    '--token-btn-bg':button,'--token-btn-text':buttonText,'--token-btn-secondary-bg':'transparent',
    '--token-btn-secondary-text':heading,'--token-btn-secondary-border':dark ? '#7F8975' : '#8B9580',
    '--token-badge-bg':alt,'--token-badge-text':accent,'--token-badge-border':line,
    '--token-on-dark-heading':'#FFFFFF','--token-on-dark-body':'#F0F0E8','--token-on-dark-muted':'#D1D5C7',
    '--token-label':body,'--token-input-bg':dark ? alt : '#FBFAF6','--token-input-text':heading,
    '--token-input-border':dark ? '#7F8975' : '#8B9580','--token-check':accent,
    '--token-stat-value':heading,'--token-card-radius':'0.125rem','--token-button-radius':'0.125rem',
    '--token-shadow':'rgba(0,0,0,0.16)','--token-image-overlay':'rgba(0,0,0,0.68)',
  };
}

function sectionPalette(type, dark, extra = {}) {
  const allowed = new Set(getFieldsForSection(type, 'tradesman', definition(type)).map(field => FIELD_DEFS[field].cssVar));
  return Object.fromEntries(Object.entries({...palette(dark), ...extra}).filter(([cssVar]) => allowed.has(cssVar)));
}

const rowsFor = (doc, slug) => doc.sections.filter(s => s.page_id === doc.pages.find(page => page.slug === slug)?.id).sort((a,b) => a.sort_order - b.sort_order);
const find = (doc, slug, type) => rowsFor(doc,slug).find(s => s.type === type);
const spec = section => [section.type, structuredClone(section.data)];
const cta = (headline, subline, label = 'Beratung anfragen') => ['ctaBand',{ layout:'plain',headline,subline,ctaPrimary:a(label,'/kontakt') },{ light:true }];
const hero = (data, headline, compact = true) => ['editorialHero',{...structuredClone(data),layout:'studio',headline,compact,eyebrow:'',badgeText:''}];
const ownSpacing = type => ['editorialHero','kineticIdentity','materialAtelier','cinematicChapters','textImage','richText','legalContent'].includes(type);
const detailSpacing = section => ({...section,spacingTop:ownSpacing(section.type) ? 'none' : 'm',spacingBottom:ownSpacing(section.type) ? 'none' : 's'});

function snapshot(s) { return { id:s.id,type:s.type,data:s.data,variant:s.variant,visible:s.visible,locked:s.locked,anchorId:s.anchor_id,container:s.container,sortOrder:s.sort_order,spacingTop:s.spacing_top,spacingBottom:s.spacing_bottom,definitionKey:s.definition_key,schemaVersion:s.schema_version,styleOverrides:s.style_overrides }; }

function makeRows(doc, pageId, specs, originals, dark) {
  const used = new Set();
  return specs.map(([type,data,options = {}], index) => {
    const original = originals.find(s => s.type === type && !used.has(s.id));
    if (original) used.add(original.id);
    const tones = sectionPalette(type, dark && !options.light, options.style);
    const ownsSpace = ownSpacing(type);
    return {...(original || {}),id:original?.id || uid(`${doc.tenant.id}/progressive/${pageId}/${type}/${index}`),tenant_id:doc.tenant.id,page_id:pageId,type,data,visible:true,locked:false,variant:null,anchor_id:options.anchor || null,container:type === 'categoryMosaic' ? 'wide' : 'default',sort_order:index,spacing_top:ownsSpace ? 'none' : 'm',spacing_bottom:ownsSpace ? 'none' : 's',definition_key:definition(type),schema_version:1,title_internal:data.headline || type,style_overrides:tones};
  });
}

function globals(doc, dark) {
  const t = palette(dark);
  Object.assign(doc.global.brand, {
    pageBg:t['--token-section-bg'],sectionBg:t['--token-section-bg'],sectionBgAlt:t['--token-section-bg-alt'],cardBg:t['--token-card-bg'],cardBorder:t['--token-card-border'],
    headingColor:t['--token-heading'],bodyTextColor:t['--token-body'],mutedTextColor:t['--token-muted'],primaryColor:t['--token-accent'],accentColor:t['--token-accent'],secondaryColor:t['--token-muted'],iconColor:t['--token-icon'],
    linkColor:t['--token-link'],linkHoverColor:t['--token-link-hover'],borderColor:t['--token-card-border'],dividerColor:t['--token-divider'],badgeBg:t['--token-badge-bg'],badgeText:t['--token-badge-text'],badgeBorder:t['--token-badge-border'],
    btnPrimaryBg:t['--token-btn-bg'],btnPrimaryText:t['--token-btn-text'],btnSecondaryBg:'transparent',btnSecondaryText:t['--token-btn-secondary-text'],btnSecondaryBorder:t['--token-btn-secondary-border'],btnOutlineBg:'transparent',btnOutlineText:t['--token-btn-secondary-text'],btnOutlineBorder:t['--token-btn-secondary-border'],
    navBgColor:'#0B0D0C',topBarColor:'#0B0D0C',navLinkColor:'#F4F1E9',navBrandColor:'#F4F1E9',footerColor:'#0B0D0C',footerTextColor:'#D3D4C9',footerLinkColor:'#F4F1E9',cardRadius:'0.125rem',btnRadius:'0.125rem',
  });
  Object.assign(doc.global.design, {sectionBg:t['--token-section-bg'],sectionBgAlt:t['--token-section-bg-alt'],cardBg:t['--token-card-bg'],headingColor:t['--token-heading'],bodyColor:t['--token-body'],mutedColor:t['--token-muted'],textPrimary:t['--token-heading'],textSecondary:t['--token-body'],accentColor:t['--token-accent'],borderColor:t['--token-card-border'],dividerColor:t['--token-divider'],btnBg:t['--token-btn-bg'],btnText:t['--token-btn-text'],btnSecondaryBg:'transparent',btnSecondaryText:t['--token-btn-secondary-text'],btnSecondaryBorder:t['--token-btn-secondary-border'],badgeBg:t['--token-badge-bg'],badgeText:t['--token-badge-text']});
}

function finish(doc) {
  doc.active.snapshot = {...doc.active.snapshot,pages:doc.pages.map(page => ({...doc.active.snapshot.pages.find(p => p.id === page.id),id:page.id,slug:page.slug,title:page.title,visible:page.visible,sections:doc.sections.filter(s => s.page_id === page.id).sort((a,b) => a.sort_order-b.sort_order).map(snapshot)})),collections:doc.collections.map(col => ({...doc.active.snapshot.collections.find(c => c.id === col.id),id:col.id,key:col.key,label:col.label,schema:col.schema,settings:col.settings,items:doc.items.filter(i => i.collection_id === col.id && i.published).map(i => ({id:i.id,slug:i.slug,title:i.title,priority:i.priority,createdAt:i.created_at,updatedAt:i.updated_at,data:i.data}))}))};
  for (const page of doc.active.snapshot.pages) if (page.sections.filter(s => ['editorialHero','legalContent'].includes(s.type)).length !== 1) throw new Error(`H1 composition: ${page.slug}`);
  return doc;
}

export function prepareDesign(before) {
  const doc = structuredClone(before); globals(doc,true);
  const h = slug => find(before,slug,'editorialHero').data;
  const tiles = structuredClone(find(before,'projekte','categoryMosaic').data.items);
  const descriptions = {baeder:'Material, Licht und Nutzung im privaten Bad.',spas:'Räume für Ruhe und Erholung.',wcs:'Kleine Räume, präzise gestaltet.',naturstein:'Flächen, Stufen und Details aus Naturstein.',gastro:'Materialien für die Gastronomie.',gewerbe:'Naturstein in gewerblichen Räumen.'};
  const spread = items => ['categoryMosaic',{layout:'spread',headline:'Arbeiten. In ihren Facetten.',subline:'Echte Anwendungen aus unserem Portfolio. Die Themenwelten führen zu weiteren Ansichten.',items:items.map(item => ({...item,imageAlt:`${item.title} aus dem Schubert-Portfolio`,imagePosition:'center',description:descriptions[item.href.split('/').at(-1)] || ''}))}];
  const services = structuredClone(find(before,'leistungen','serviceDetail').data.items).map((item,index) => ({...item,icon:['Bath','PanelsTopLeft','Route','AppWindow'][index],ctaIcon:'ArrowUpRight'}));
  const showroomRows = find(before,'showroom','zigzagShowcase').data.rows;
  const pages = {
    startseite:[
      hero({...h('startseite'),text:p('Bad, Naturstein und Fliese in Ingolstadt. Von der Materialwahl über Planung und Fertigung bis zum Einbau.'),hint:'',secondaryCta:a('Portfolio','/projekte')},'Räume.\nAus Stein.',false),
      ['kineticIdentity',{headline:'Vom Material zum Raum.',subline:'Naturstein ist der Ausgangspunkt. Gestaltung und Handwerk machen daraus etwas Eigenes.',preset:'editorial',badge:'',statements:[
        {id:'material',prefix:'Die Natur gibt',highlight:'Charakter.',suffix:'',text:'Marmor, Kalkstein, Sandstein oder Granit: Farbe, Struktur und Oberfläche bestimmen die Wirkung. Wir helfen Ihnen, die passende Richtung zu finden.',image:images.quarry},
        {id:'praezision',prefix:'Das Handwerk gibt',highlight:'Form.',suffix:'',text:'Aufmaß, Planung und Fertigung gehören zusammen. In unserer Manufaktur werden aus dem Material präzise Flächen und individuelle Details.',image:images.workshop},
        {id:'raum',prefix:'Ihr Alltag gibt',highlight:'Sinn.',suffix:'',text:'Ein Bad, ein Boden, eine Treppe: Die Gestaltung muss zum Raum und zu seiner Nutzung passen. Wir begleiten Ihr Vorhaben bis zum fachgerechten Einbau.',image:images.stairs},
      ],cta:a('Leistungen entdecken','/leistungen')}],
      spread(tiles.filter(item => /baeder|spas|naturstein$/.test(item.href))),
      ['textImage',{...find(before,'startseite','textImage').data,headline:'Nicht nur ansehen.\nErleben.',text:p('Oberflächen spüren. Farben im Licht vergleichen. Ein Bad im Raum sehen. In unserem Showroom in Ingolstadt wird aus einer ersten Idee eine konkrete Vorstellung.'),image:h('showroom').imagePrimary,imageAlt:'Badausstellung im Schubert Showroom',layout:'image-left',primaryCta:a('Showroom besuchen','/showroom')},{style:{'--token-card-radius':'0rem'}}],
      cta('Was haben Sie vor?','Ein neues Bad, eine Fläche aus Naturstein oder ein besonderes Detail: Lassen Sie uns darüber sprechen.'),
    ],
    leistungen:[
      hero({...h('leistungen'),imagePrimary:images.quarry,imageAlt:'Struktur einer Natursteinwand im Steinbruch'},'Material.\nMöglichkeit. Raum.'),
      ['materialAtelier',{headline:'Wofür wir Stein bewegen.',subline:'Wählen Sie eine Anwendung. Bild, Möglichkeiten und der nächste Schritt gehören zusammen.',preset:'editorial',badge:'',items:services.map((item,index) => ({id:`anwendung-${index}`,title:item.title,text:strip(item.text),image:index === 1 ? images.floor : item.image,imageAlt:index === 1 ? 'Dunkler Plattenboden im Badezimmer' : item.title,imagePosition:index === 1 ? 'center bottom' : 'center',href:item.ctaHref,ctaLabel:item.ctaLabel || 'Beispiele ansehen',meta:item.features})),cta:{}}],
      spec(find(before,'leistungen','servicesGrid')),
      ['processSteps',{layout:'simple',headline:'Eine Idee. Ein durchgängiger Weg.',steps:[{title:'Beraten',text:'Wir klären Wünsche, Material, Nutzung und den Rahmen Ihres Vorhabens.'},{title:'Planen',text:'Aufmaß und Details übersetzen die Idee in eine ausführbare Planung.'},{title:'Fertigen',text:'In der Manufaktur wird das ausgewählte Material passgenau bearbeitet.'},{title:'Einbauen',text:'Unsere Fachkräfte übernehmen die Montage und die Abstimmung vor Ort.'}]}],
      cta('Das erste Detail ist ein Gespräch.','Erzählen Sie uns, was Sie verändern oder neu gestalten möchten.'),
    ],
    projekte:[hero(h('projekte'),'Stein. In Anwendung.'),spread(tiles),cta('Und Ihre Räume?','Gemeinsam finden wir heraus, wie Material, Gestaltung und Nutzung zusammenpassen.')],
    showroom:[
      hero(h('showroom'),'Material.\nIm Raum.'),
      ['cinematicChapters',{headline:'Vom ersten Eindruck zur eigenen Richtung.',intro:'Drei Perspektiven auf Ihren Besuch im Showroom.',skipLabel:'Bildgeschichte überspringen',transition:'push',badge:'',chapters:[
        {title:'Räume sehen.',text:'Begehbare Bäder zeigen Material, Licht und Proportion im Zusammenspiel.',image:h('showroom').imagePrimary,ctaLabel:'Bäder im Portfolio',ctaHref:'/c/projekte/baeder'},
        {title:'Details vergleichen.',text:'Oberflächen, Fliesen und Armaturen wirken nebeneinander anders als auf einem Bildschirm.',image:showroomRows[0].image,ctaLabel:'Leistungen entdecken',ctaHref:'/leistungen'},
        {title:'Fragen mitbringen.',text:'Für eine ausführliche Beratung stimmen Sie am besten vorab einen Termin mit uns ab.',image:showroomRows[1].image,ctaLabel:'Besuch besprechen',ctaHref:'/kontakt'},
      ]}],
      spec(find(before,'showroom','richText')),
      cta('Kommen Sie mit Ihren Ideen.','Gern besprechen wir vorab Ihr Anliegen und einen Termin für die persönliche Beratung.','Besuch anfragen'),
    ],
    'ueber-uns':[
      hero({...h('ueber-uns'),imagePrimary:images.workshop},'Seit 1953.\nFür das, was bleibt.'),
      ['textImage',{...find(before,'ueber-uns','textImage').data,image:images.quarry,imageAlt:'Natürliche Gesteinsschichten im Steinbruch',headline:'Am Anfang steht der Stein.'},{style:{'--token-card-radius':'0rem'}}],
      spec(find(before,'ueber-uns','team')),spec(find(before,'ueber-uns','timeline')),
      cta('Lernen wir uns kennen.','Besuchen Sie unseren Showroom und sprechen Sie mit uns über Ihr Vorhaben.'),
    ],
    kontakt:[hero(h('kontakt'),'Ihr Vorhaben.\nUnser Gespräch.'),spec(find(before,'kontakt','contact')),[...spec(find(before,'kontakt','map')),{light:true}]],
  };
  doc.sections = doc.pages.flatMap(page => makeRows(doc,page.id,pages[page.slug] || rowsFor(before,page.slug).map(spec),rowsFor(before,page.slug),true));
  for (const item of doc.items) {
    const old = item.data.sections;
    item.data.sections = old.map((section,index) => detailSpacing({...section,data:section.type === 'editorialHero' ? {...section.data,layout:'studio',compact:true,eyebrow:'',badgeText:''} : section.data,styleOverrides:sectionPalette(section.type, section.type !== 'ctaBand'),sortOrder:index}));
  }
  return finish(doc);
}

export function prepareGrab(before) {
  const doc = structuredClone(before); globals(doc,false);
  const item = slug => before.items.find(i => i.slug === slug);
  const itemImage = slug => item(slug).data.sections.find(s => s.type === 'editorialHero').data.imagePrimary;
  const memorialHero = (slug, compact = true) => ['editorialHero',{...find(before,slug,'editorialHero').data,layout:'memorial',compact,imageFit:'contain',eyebrow:'',badgeText:''}];
  const homeChoices = find(before,'startseite','servicesGrid').data.manualCards.slice(0,3);
  const pages = {
    startseite:[
      memorialHero('startseite',false),
      ['materialAtelier',{headline:'Was steht für Sie an?',subline:'Sie können mit einer Frage beginnen. Wir begleiten Sie von dort aus weiter.',preset:'quiet',badge:'',items:homeChoices.map((entry,index) => ({id:`anliegen-${index}`,title:entry.title,text:entry.text,imageAlt:['Naturstein-Grabdenkmal mit Bepflanzung','Bestehendes Grabdenkmal mit Inschrift und Bepflanzung','Naturstein-Einfassung mit Bepflanzung'][index],imagePosition:'center',ctaLabel:'Mehr erfahren',image:[memorialImages.headstone,memorialImages.inscription,memorialImages.edging][index],href:entry.href,meta:[]})),cta:{}}],
      ['richText',{headline:'Die Erinnerung gibt die Richtung vor.',titleAs:'h2',content:find(before,'startseite','textImage').data.text}],
      spec(find(before,'startseite','processSteps')),spec(find(before,'startseite','ctaBand')),
    ],
    leistungen:[memorialHero('leistungen'),...rowsFor(before,'leistungen').filter(s => s.type !== 'editorialHero').map(s => {
      if(s.type === 'servicesGrid') return ['servicesGrid',{...structuredClone(s.data),manualCards:s.data.manualCards.map(card => ({...card,icon:/pflege/.test(card.href) ? 'Brush' : /restaurierung/.test(card.href) ? 'LetterText' : /einfassung/.test(card.href) ? '' : /grabdenkmale/.test(card.href) ? '' : card.icon}))}];
      return spec(s);
    })],
    galerie:[memorialHero('galerie'),...rowsFor(before,'galerie').filter(s => s.type !== 'editorialHero').map(spec)],
    'ueber-uns':[memorialHero('ueber-uns'),...rowsFor(before,'ueber-uns').filter(s => s.type !== 'editorialHero').map(spec)],
    kontakt:[memorialHero('kontakt'),...rowsFor(before,'kontakt').filter(s => s.type !== 'editorialHero').map(spec)],
    ratgeber:[memorialHero('ratgeber'),...rowsFor(before,'ratgeber').filter(s => s.type !== 'editorialHero').map(spec)],
  };
  // An image-led spread gives the memorial service overview its own reading rhythm.
  const firstServiceIndex = pages.leistungen.findIndex(s => s[0] === 'servicesGrid');
  const firstService = pages.leistungen[firstServiceIndex][1];
  pages.leistungen[firstServiceIndex] = ['categoryMosaic',{layout:'spread',headline:firstService.headline,subline:firstService.subline,items:firstService.manualCards.map(card => ({title:card.title,href:card.href,image:card.href.endsWith('/abdeckplatten') ? '' : card.href.endsWith('/grabeinfassungen') ? memorialImages.edging : itemImage(card.href.split('/').at(-1)),imageAlt:card.href.endsWith('/grabeinfassungen') ? 'Naturstein-Einfassung mit Bepflanzung' : `${card.title}: Beispiel aus dem Schubert-Bildbestand`,imagePosition:'center',imageFit:'contain',description:card.href.endsWith('/abdeckplatten') ? `${card.text} Teilflächen lassen Raum für Pflanzen; die Zulässigkeit richtet sich nach dem Friedhof.` : card.text}))}];
  doc.sections = doc.pages.flatMap(page => makeRows(doc,page.id,pages[page.slug] || rowsFor(before,page.slug).map(spec),rowsFor(before,page.slug),false));
  for (const entry of doc.items) {
    entry.data.icon = /pflege/.test(entry.slug) ? 'Brush' : /restaurierung/.test(entry.slug) ? 'LetterText' : /abdeckplatten/.test(entry.slug) ? 'Layers' : '';
    const considerations = ['beratung-planung','grabpflege-wartung','abdeckplatten'].includes(entry.slug);
    const imageDetail = ['restaurierung-nachbeschriftung','grabaccessoires'].includes(entry.slug);
    if (entry.slug === 'abdeckplatten') entry.data.image = '';
    entry.data.sections = entry.data.sections.map((section,index) => {
      let type = section.type, data = structuredClone(section.data);
      if (type === 'editorialHero') {
        data = {...data,layout:'memorial',compact:true,imageFit:'contain',eyebrow:'',badgeText:''};
        if (entry.slug === 'abdeckplatten' || imageDetail) { data.imagePrimary = ''; data.imageAlt = ''; }
        if (entry.slug === 'grabeinfassungen') { data.imagePrimary = memorialImages.edging; data.imageAlt = 'Naturstein-Einfassung mit Bepflanzung'; }
      }
      if (type === 'richText' && (considerations || imageDetail)) {
        // Preserve the real prose and its considerations as independently editable list items.
        const intro = data.content.split('<h3>')[0];
        const items = [...data.content.matchAll(/<h3>(.*?)<\/h3><p>(.*?)<\/p>/g)].map(([,title,text]) => ({title:strip(title),text:strip(text),icon:''}));
        type = 'textImage';
        const inscription = entry.slug === 'restaurierung-nachbeschriftung';
        data = {headline:data.headline,text:intro,layout:'image-left',image:imageDetail ? (inscription ? memorialImages.inscription : memorialImages.heart) : '',imageAlt:imageDetail ? (inscription ? 'Bestehendes Grabdenkmal mit Inschrift und Bepflanzung' : 'Herzdetail aus Naturstein') : '',imageFit:'contain',imagePosition:'center',items,primaryCta:{},secondaryCta:{}};
      }
      if (type === 'processSteps' && (considerations || entry.slug === 'grabaccessoires')) {
        type = 'richText';
        data = {headline:considerations ? 'Für das persönliche Gespräch' : 'Auswahl und Befestigung',titleAs:'h2',content:`<ul>${data.steps.map(step => `<li><strong>${step.title}</strong>${p(step.text)}</li>`).join('')}</ul>`};
      }
      return detailSpacing({...section,type,data,definitionKey:definition(type),styleOverrides:sectionPalette(type,false),sortOrder:index});
    });
  }
  return finish(doc);
}

export function prepareDirectory(directory) {
  for (const [name,prepare] of [['design',prepareDesign],['grab',prepareGrab]]) {
    const before = JSON.parse(readFileSync(resolve(directory,`${name}-before.json`),'utf8'));
    const after = prepare(before);
    writeFileSync(resolve(directory,`${name}-after.json`),JSON.stringify(after,null,2)+'\n');
    const urls = new Set();
    const collect = value => { if(typeof value === 'string' && /^https?:\/\//.test(value) && /\.(webp|png|jpe?g)(\?|$)/i.test(value))urls.add(value); else if(Array.isArray(value))value.forEach(collect);else if(value&&typeof value==='object')Object.values(value).forEach(collect); };
    collect(after.sections); collect(after.items); collect(after.global.brand.logoUrl);
    writeFileSync(resolve(directory,`${name}-raster-provenance.json`),JSON.stringify([...urls].sort().map(url => ({url,source:'Existing approved Schubert CMS asset',baseline:`${name}-before.json`,generated:false})),null,2)+'\n');
    console.log(`${name}: ${after.pages.length} pages, ${after.items.length} details, ${after.sections.length} sections; no publication`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) prepareDirectory(resolve(process.argv[2] || 'tmp/schubert-dark-2026-10-19'));
