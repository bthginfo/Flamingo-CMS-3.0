/** Repeatable launch refinement. Pure file transform; no network or database writes. */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
const dir = resolve(process.argv[2] || 'tmp/schubert-launch-2026-10-19');
const clone = value => structuredClone(value);
const p = text => `<p>${text}</p>`;
const a = (label, href) => ({ label, href });
const r = (collection, slug) => `/c/${collection}/${slug}`;
const address = 'Schrobenhausener Straße 132, 85051 Ingolstadt';
const maps = 'https://www.google.com/maps/search/?api=1&query=Schrobenhausener%20Stra%C3%9Fe%20132%2C%2085051%20Ingolstadt';
const phone = '+49 841 97474-0';
const phoneHref = 'tel:+49841974740';
const email = 'schubert@schubertdesign.de';
const shared = new Set(['editorialHero','zigzagShowcase','categoryMosaic','timeline','ctaSplit','signatureGrid']);
const tones = {
  '--token-section-bg':'#F7F4EF','--token-section-bg-alt':'#EDE8DF','--token-heading':'#222622',
  '--token-body':'#454740','--token-muted':'#62635B','--token-subheading':'#454740',
  '--token-accent':'#78613C','--token-icon':'#78613C','--token-link':'#6A532E','--token-link-hover':'#222622',
  '--token-eyebrow':'#6A532E','--token-card-bg':'#FFFFFF','--token-card-heading':'#222622',
  '--token-card-body':'#454740','--token-card-muted':'#62635B','--token-card-border':'#D6D1C7',
  '--token-divider':'#D6D1C7','--token-badge-bg':'#EDE8DF','--token-badge-text':'#6A532E','--token-badge-border':'#D6D1C7',
  '--token-btn-bg':'#222622','--token-btn-text':'#FFFFFF','--token-btn-secondary-bg':'transparent',
  '--token-btn-secondary-text':'#222622','--token-btn-secondary-border':'#9C9C92',
  '--token-on-dark-heading':'#FFFFFF','--token-on-dark-body':'#F2EFE8','--token-on-dark-muted':'#D7D2C8',
  '--token-label':'#454740','--token-input-bg':'#FFFFFF','--token-input-text':'#222622',
  '--token-input-placeholder':'#62635B','--token-input-border':'#9C9C92','--token-check':'#6A532E',
  '--token-stat-value':'#222622','--token-card-radius':'0.25rem','--token-button-radius':'0.25rem',
  '--token-shadow':'rgba(25,30,25,0.10)','--token-image-overlay':'rgba(10,15,10,0.65)',
};
const uid = seed => { const h=createHash('sha256').update(seed).digest('hex');return `${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`; };
const definition = type => `${type}.${shared.has(type)?'shared':type==='portfolioGallery'?'photography':'tradesman'}.v1`;
function clean(value) {
  if(Array.isArray(value))return value.map(clean);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([key])=>key!=='_premiumRedesign').map(([key,val])=>[key,clean(val)]));
  return value;
}
const hero=(headline,text,imagePrimary='',options={})=>['editorialHero',{headline,text:p(text),imagePrimary,imageAlt:options.imageAlt||headline,layout:'architectural',primaryCta:a('Beratung anfragen','/kontakt'),...options}];
const cta=(headline,subline,label='Beratung anfragen',href='/kontakt')=>['ctaBand',{layout:'plain',headline,subline,ctaPrimary:a(label,href)}];
const copy=(headline,text,image,options={})=>['textImage',{headline,text,image,imageAlt:headline,layout:'image-left',...options}];
const index=(headline,manualCards,subline='')=>['servicesGrid',{layout:'index',headline,subline,manualCards}];
const steps=(headline,entries)=>['processSteps',{layout:'simple',headline,steps:entries.map(([title,text])=>({title,text}))}];
const rich=(headline,content)=>['richText',{headline,content,titleAs:'h2'}];
const faq=(headline,items)=>['faq',{headline,items:items.map(([question,answer])=>({question,answer})),expandFirst:false}];
function makeSections(doc,page,specs,originals=[]) {
  return specs.map(([type,data,settings={}],i)=>({
    ...(originals[i]||{}),id:originals[i]?.id||uid(`${doc.tenant.id}/${page.id}/${i}`),tenant_id:doc.tenant.id,page_id:page.id,
    type,data:clean(data),locked:false,visible:true,variant:null,anchor_id:settings.anchorId||null,container:'default',sort_order:i,
    spacing_top:['textImage','richText','legalContent'].includes(type)?'none':'m',spacing_bottom:['textImage','richText','legalContent'].includes(type)?'none':'m',
    definition_key:definition(type),schema_version:1,title_internal:data.headline||type,style_overrides:{...tones,...(settings.style||{})},
  }));
}
function applyPages(doc,pages) {
  const sections=[];
  for(const page of doc.pages){const before=doc.sections.filter(s=>s.page_id===page.id).sort((x,y)=>x.sort_order-y.sort_order);if(!pages[page.slug])throw new Error(`No composition: ${page.slug}`);sections.push(...makeSections(doc,page,pages[page.slug],before));}
  doc.sections=sections;
}
function snapshot(row){return {id:row.id,type:row.type,data:row.data,variant:row.variant,visible:row.visible,locked:row.locked,anchorId:row.anchor_id,container:row.container,sortOrder:row.sort_order,spacingTop:row.spacing_top,spacingBottom:row.spacing_bottom,definitionKey:row.definition_key,schemaVersion:row.schema_version,styleOverrides:row.style_overrides};}
function applyItems(doc,configs){for(const item of doc.items){if(!configs[item.slug])throw new Error(`No item: ${item.slug}`);const rows=makeSections(doc,{id:item.id},configs[item.slug],item.data.sections||[]);item.data={...clean(item.data),image:rows[0].data.imagePrimary||'',excerpt:rows[0].data.text.replace(/<[^>]+>/g,''),sections:rows.map(snapshot)};}}
function applyGlobals(doc,memorial){
  doc.seo={...(doc.seo||{}),default_title:memorial?'Schubert Grabdenkmale in Ingolstadt':'Schubert Design · Bad, Naturstein & Fliese in Ingolstadt',title_template:memorial?'%s | Schubert Grabdenkmale':'%s | Schubert Design',default_description:memorial?'Persönliche Beratung, Gestaltung und Fertigung von Grabdenkmalen in Ingolstadt. Naturstein, Inschriften, Einfassungen, Pflege und Restaurierung bei Schubert.':'Bad, Naturstein und Fliese in Ingolstadt: Schubert Design begleitet Ihr Vorhaben von der Materialauswahl über Planung und Fertigung bis zum Einbau.',default_og_image:''};
  Object.assign(doc.global.brand,{pageBg:'#F7F4EF',sectionBg:'#F7F4EF',sectionBgAlt:'#EDE8DF',cardBg:'#FFFFFF',cardBorder:'#D6D1C7',headingColor:'#222622',bodyTextColor:'#454740',mutedTextColor:'#62635B',primaryColor:'#78613C',accentColor:'#78613C',iconColor:'#78613C',secondaryColor:'#62635B',linkColor:'#6A532E',linkHoverColor:'#222622',borderColor:'#D6D1C7',dividerColor:'#D6D1C7',badgeBg:'#EDE8DF',badgeText:'#6A532E',badgeBorder:'#D6D1C7',btnPrimaryBg:'#222622',btnPrimaryText:'#FFFFFF',btnSecondaryBg:'transparent',btnSecondaryText:'#222622',btnSecondaryBorder:'#9C9C92',btnOutlineBg:'transparent',btnOutlineText:'#222622',btnOutlineBorder:'#9C9C92',navBgColor:'#151A17',navLinkColor:'#F7F4EF',navBrandColor:'#F7F4EF',navLogoColor:'',topBarColor:'#151A17',footerColor:'#151A17',footerTextColor:'#DEDCD4',footerLinkColor:'#F7F4EF',cardRadius:'0.25rem',btnRadius:'0.25rem',companyName:memorial?'SCHUBERT Grabdenkmale':'Schubert Design',tagline:memorial?'Grabdenkmale und Naturstein in Ingolstadt':'Bad, Naturstein und Fliese in Ingolstadt',headingFont:memorial?'Cormorant Garamond':'Space Grotesk',bodyFont:memorial?'Inter':'Manrope'});
  Object.assign(doc.global.design,{sectionBg:'#F7F4EF',sectionBgAlt:'#EDE8DF',cardBg:'#FFFFFF',headingColor:'#222622',bodyColor:'#454740',mutedColor:'#62635B',accentColor:'#78613C',borderColor:'#D6D1C7',dividerColor:'#D6D1C7',btnBg:'#222622',btnText:'#FFFFFF',btnSecondaryBg:'transparent',btnSecondaryText:'#222622',btnSecondaryBorder:'#9C9C92',textPrimary:'#222622',textSecondary:'#454740',badgeBg:'#EDE8DF',badgeText:'#6A532E',imageOverlay:'rgba(10,15,10,0.65)'});
  doc.global.contact={...doc.global.contact,email,phone,address};
  doc.global.openingHours=[{day:'Montag',hours:'Geschlossen'},{day:'Dienstag bis Freitag',hours:'09:00–12:30 und 14:00–17:00 Uhr'},{day:'Samstag',hours:'10:00–15:00 Uhr'}];
  doc.navigation.items=(memorial?[['Leistungen','/leistungen'],['Galerie','/galerie'],['Ratgeber','/ratgeber'],['Über uns','/ueber-uns']]:[['Leistungen','/leistungen'],['Projekte','/projekte'],['Showroom','/showroom'],['Über uns','/ueber-uns']]).map(([label,href])=>({type:'link',label,href}));
  doc.navigation.cta={...doc.navigation.cta,label:memorial?'Persönliche Beratung':'Beratung anfragen',href:'/kontakt'};
  doc.footer.cta={variant:'classic',label:'',href:''};
  doc.footer.columns=[{title:memorial?'Grabgestaltung':'Entdecken',items:doc.navigation.items.map(({label,href})=>({text:label,href}))},{title:'Kontakt',items:[{text:phone,href:phoneHref},{text:email,href:`mailto:${email}`},{text:address,href:maps}]},{title:'Showroom',items:[{text:'Montag geschlossen'},{text:'Di–Fr 09:00–12:30 und 14:00–17:00 Uhr'},{text:'Sa 10:00–15:00 Uhr'}]}];
  doc.footer.legal_links=[{label:'Impressum',href:'/impressum'},{label:'Datenschutz',href:'/datenschutz'}];
}
const legalPages={
  impressum:[['legalContent',{headline:'Impressum',blocks:[
    {headline:'Anbieter dieser Website',text:'<p>SCHUBERT GmbH &amp; Co. KG<br>Schrobenhausener Straße 132<br>85051 Ingolstadt<br>Deutschland</p>'},
    {headline:'Kontakt',text:`<p>Telefon: <a href="${phoneHref}">${phone}</a><br>Fax: +49 841 97474-40<br>E-Mail: <a href="mailto:${email}">${email}</a></p>`},
    {headline:'Vertretung und Register',text:'<p>Vertreten durch Henry Schubert und Raphael Marc Schubert.</p><p>Registergericht: Amtsgericht Ingolstadt<br>Handelsregister: HRA 2172</p>'},
    {headline:'Umsatzsteuer',text:'<p>Umsatzsteuer-Identifikationsnummer: DE261337057</p>'},
  ]}]],
  datenschutz:[['legalContent',{headline:'Datenschutzerklärung',blocks:[
    {headline:'Verantwortlicher und Kontakt',text:`<p>Verantwortlich für die Datenverarbeitung auf dieser Website ist SCHUBERT GmbH &amp; Co. KG, ${address}. Für Fragen zum Datenschutz erreichen Sie uns unter <a href="mailto:${email}">${email}</a> oder <a href="${phoneHref}">${phone}</a>.</p>`},
    {headline:'Bereitstellung der Website',text:'<p>Die Website wird über Vercel bereitgestellt. Beim Aufruf werden technisch notwendige Verbindungsdaten verarbeitet, insbesondere IP-Adresse, Zeitpunkt, angeforderte Seite und Angaben zu Browser und Gerät. Diese Verarbeitung dient der sicheren, zuverlässigen Auslieferung und der Fehleranalyse. Rechtsgrundlage ist unser berechtigtes Interesse am sicheren Betrieb nach Art. 6 Abs. 1 lit. f DSGVO.</p><p>Bilder werden über Vercel Blob oder die zugehörige Schubert-Website ausgeliefert. Für gespeicherte Anfragen wird eine Neon-Datenbank in der Europäischen Union eingesetzt. Bei beteiligten Dienstleistern kann eine Verarbeitung außerhalb der EU stattfinden; hierfür gelten die vertraglichen Schutzmaßnahmen des jeweiligen Anbieters.</p>'},
    {headline:'Kontakt und Anfragen',text:'<p>Wenn Sie uns über das Formular, per E-Mail oder telefonisch kontaktieren, verarbeiten wir Ihre Kontaktdaten und die von Ihnen mitgeteilten Informationen zur Bearbeitung Ihrer Anfrage. Formularanfragen werden gespeichert und per E-Mail weitergeleitet. Pflichtfelder sind im Formular gekennzeichnet.</p><p>Die Verarbeitung beruht bei vorvertraglichen und vertraglichen Anfragen auf Art. 6 Abs. 1 lit. b DSGVO, bei anderen Anliegen auf unserem berechtigten Interesse an der Bearbeitung nach Art. 6 Abs. 1 lit. f DSGVO. Wir bewahren Daten nur so lange auf, wie es für das Anliegen und geltende gesetzliche Pflichten erforderlich ist. Bitte senden Sie nur Informationen, die für Ihr Anliegen nötig sind.</p>'},
    {headline:'Einwilligungen und lokale Einstellungen',text:'<p>Ihre Auswahl zu optionalen Funktionen wird lokal im Browser unter „flamingo_consent“ gespeichert. Sie können die Auswahl über die Cookie-Einstellungen im Seitenfuß ändern und optionale Einwilligungen mit Wirkung für die Zukunft widerrufen. Die Speicherung der Auswahl ist erforderlich, um Ihre Entscheidung zu beachten.</p>'},
    {headline:'Google Maps und Schriftarten',text:'<p>Google Maps wird erst nach Ihrer Einwilligung in funktionale Inhalte geladen. Dabei werden Verbindungsdaten, insbesondere Ihre IP-Adresse, an Google übertragen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO. Alternativ können Sie die Adresse ohne eingebettete Karte verwenden oder selbst einen externen Routenlink öffnen.</p><p>Die auf dieser Website verwendeten Google-Schriftarten werden über einen eigenen Schriftarten-Proxy ausgeliefert. Ihr Browser ruft die Schriftdateien über diese Website ab.</p>'},
    {headline:'Optionale Leistungsmessung',text:'<p>Nach Ihrer Einwilligung in die Kategorie Analytics kann Vercel Speed Insights technische Messwerte zur Ladeleistung und Nutzung der Website erfassen. Ohne diese Einwilligung wird diese optionale Messung nicht aktiviert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO; Sie können Ihre Auswahl jederzeit über die Cookie-Einstellungen ändern.</p>'},
    {headline:'Ihre Rechte',text:'<p>Sie haben nach Maßgabe der DSGVO insbesondere Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit. Einer Verarbeitung auf Grundlage berechtigter Interessen können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, widersprechen. Eine erteilte Einwilligung können Sie jederzeit für die Zukunft widerrufen.</p><p>Sie können sich außerdem bei einer Datenschutzaufsichtsbehörde beschweren, insbesondere beim Bayerischen Landesamt für Datenschutzaufsicht (BayLDA).</p>'},
  ]}]],
};
function contactSection(doc,memorial){return ['contact',{headline:memorial?'Schreiben Sie uns Ihr Anliegen':'Erzählen Sie uns von Ihrem Vorhaben',introText:memorial?'Ein neues Grabmal, eine Ergänzung oder Pflege: Eine kurze Beschreibung genügt für den ersten Kontakt. Wenn bekannt, nennen Sie bitte den Friedhof und die Grabart.':'Ob neues Bad, Naturstein oder Fliese: Beschreiben Sie kurz Ihre Wünsche. Vorhandene Maße und der gewünschte Zeitraum helfen uns bei der Vorbereitung.',infoCards:[{icon:'Phone',label:'Telefon',value:phone,href:phoneHref},{icon:'Mail',label:'E-Mail',value:email,href:`mailto:${email}`},{icon:'MapPin',label:'Besuchen Sie uns',value:address,href:maps},{icon:'Clock3',label:'Showroom',value:'Di–Fr 09:00–12:30 und 14:00–17:00 Uhr · Sa 10:00–15:00 Uhr'}],formEnabled:true,submitLabel:'Anfrage senden',showMap:false,...(doc.global.formFields?{formFields:doc.global.formFields}:{})}];}
function finish(doc){
  doc.seo.default_og_image=doc.sections.find(s=>s.page_id===doc.pages.find(page=>page.slug==='startseite')?.id)?.data.imagePrimary||'';
  doc.active.snapshot={...doc.active.snapshot,pages:doc.pages.map(page=>({...doc.active.snapshot.pages.find(p=>p.id===page.id),id:page.id,slug:page.slug,title:page.title,visible:page.visible,sections:doc.sections.filter(s=>s.page_id===page.id).map(snapshot)})),collections:doc.collections.map(col=>({...doc.active.snapshot.collections.find(c=>c.id===col.id),id:col.id,key:col.key,label:col.label,schema:col.schema,settings:col.settings,items:doc.items.filter(i=>i.collection_id===col.id&&i.published).map(i=>({id:i.id,slug:i.slug,title:i.title,priority:i.priority,createdAt:i.created_at,updatedAt:i.updated_at,data:i.data}))}))};
  for(const page of doc.active.snapshot.pages)if(page.sections.filter(s=>['editorialHero','legalContent'].includes(s.type)||(s.type==='richText'&&s.data.titleAs!=='h2')).length!==1)throw new Error(`H1 composition ${page.slug}`);
  for(const item of doc.items)if(item.data.sections.filter(s=>s.type==='editorialHero').length!==1)throw new Error(`H1 item ${item.slug}`);
  return doc;
}

function refineDesign(before){
  const doc=clean(clone(before));applyGlobals(doc,false);
  const old=slug=>before.sections.filter(s=>s.page_id===before.pages.find(p=>p.slug===slug).id).sort((x,y)=>x.sort_order-y.sort_order);
  const home=old('startseite');
  const tiles=home.find(s=>s.type==='categoryMosaic').data.items;
  const services=old('leistungen').find(s=>s.type==='serviceDetail').data.items;
  const servicePhotos=home.find(s=>s.type==='spotlightCards').data.cards;
  const showroom=old('showroom').find(s=>s.type==='scrollStory').data.steps;
  const workshop=old('ueber-uns').find(s=>s.type==='textImage').data.image;
  const bath=before.items.find(i=>i.slug==='baeder').data.sections[0].data.image;
  const map=old('kontakt').find(s=>s.type==='map');
  const rows=services.map((item,i)=>({...item,image:servicePhotos[i].image,mediaType:'image',ctaHref:i===0?r('projekte','baeder'):'/kontakt',ctaLabel:i===0?'Bäder ansehen':'Vorhaben besprechen'}));
  const pages={
    startseite:[
      hero('Räume mit Charakter. Aus Stein.','Bad, Naturstein und Fliese in Ingolstadt. Wir verbinden die Auswahl besonderer Materialien mit Planung, präziser Fertigung und fachgerechtem Einbau.',bath,{secondaryCta:a('Arbeiten entdecken','/projekte'),hint:'Schubert Design · Beratung, Showroom und Handwerk in Ingolstadt',imageAlt:'Badezimmer aus dem Schubert-Portfolio'}),
      copy('Ein Material. Viele Möglichkeiten.',p('Eine ruhige Wandfläche, ein individuelles Bad oder eine Treppe nach Maß: Naturstein bringt Struktur und Eigenständigkeit in einen Raum. Wir unterstützen Sie dabei, Material, Oberfläche und Anwendung zusammenzubringen.'),servicePhotos[2].image,{primaryCta:a('Unsere Leistungen','/leistungen'),imageAlt:'Natursteintreppe aus dem Schubert-Portfolio',layout:'image-right'}),
      ['categoryMosaic',{layout:'editorial',headline:'Einblicke in unsere Arbeit',subline:'Bäder, Wellness und Naturstein: Entdecken Sie Materialien und Details in realisierten Anwendungen.',items:['Bäder','Spas','Natursteine'].map(title=>({...tiles.find(i=>i.title===title),title:title==='Spas'?'Spa & Wellness':title==='Natursteine'?'Naturstein':title}))}],
      copy('Materialien sehen. Räume erleben.',p('In unserem Showroom in Ingolstadt werden aus Mustern begehbare Räume. Vergleichen Sie Naturstein, Fliesen und Badprodukte und entwickeln Sie mit uns eine Richtung für Ihr Vorhaben.'),showroom[0].image,{primaryCta:a('Showroom kennenlernen','/showroom'),imageAlt:'Schubert Showroom in Ingolstadt'}),
      cta('Was haben Sie vor?','Neues Bad, eine Fläche aus Naturstein oder ein konkretes Detail: Wir nehmen uns Zeit für Ihr Vorhaben.'),
    ],
    leistungen:[
      hero('Von der Idee bis zum Einbau.','Wir planen und realisieren Bäder, Naturstein- und Fliesenarbeiten. Ob einzelne Maßanfertigung oder kompletter Raum: Ausgangspunkt sind Ihre Wünsche und die Anforderungen vor Ort.',old('leistungen')[0].data.image,{compact:true,secondaryCta:a('Projekte ansehen','/projekte')}),
      ['serviceDetail',{headline:'Was wir für Sie umsetzen',items:rows}],
      index('Unterstützung für Ihr Projekt',[
        {title:'Architekten-Service',text:'Materialauswahl und technische Abstimmung für die Planung: Wir unterstützen mit Materialbibliothek, Mustern und Detailzeichnungen.',href:'/kontakt'},
        {title:'Montage',text:'Aufmaß, Fertigung und Einbau werden aufeinander abgestimmt. Die Ausführung übernehmen unsere eigenen Fachkräfte.',href:'/kontakt'},
        {title:'Pflege & Reparatur',text:'Wir kümmern uns um bestehende Natursteinflächen, Fugen und Imprägnierungen und besprechen, welche Überarbeitung sinnvoll ist.',href:'/kontakt'},
      ]),
      cta('Ein guter Anfang ist ein Gespräch.','Bringen Sie Ihre Fragen, Pläne oder ersten Materialideen mit. Gemeinsam klären wir den nächsten Schritt.'),
    ],
    projekte:[
      hero('Stein, der Räume prägt.','Entdecken Sie unser Portfolio vom privaten Bad bis zur gewerblichen Anwendung. Die Themenwelten zeigen unterschiedliche Arbeiten, Materialien und Details.','',{compact:true,primaryCta:{},secondaryCta:{}}),
      ['categoryMosaic',{layout:'editorial',headline:'Unsere Themenwelten',items:tiles.map(item=>({...item,title:item.title==='Natursteine'?'Naturstein':item.title==='Spas'?'Spa & Wellness':item.title==='Gastro'?'Gastronomie':item.title}))}],
      cta('Eine Idee für Ihre eigenen Räume?','Wir besprechen, wie Material, Gestaltung und Nutzung in Ihrem Projekt zusammenfinden.'),
    ],
    showroom:[
      hero('Erst erleben. Dann entscheiden.','Naturstein fühlt sich anders an, als er auf einem Bildschirm aussieht. In unserem Showroom können Sie Oberflächen, Farben und Badprodukte im Raum erleben.',showroom[0].image,{compact:true,primaryCta:a('Besuch besprechen','/kontakt'),hint:'Schrobenhausener Straße 132 · 85051 Ingolstadt'}),
      ['zigzagShowcase',{rows:[
        {headline:'Materialien im Zusammenspiel',text:p('Begehbare Badezimmer zeigen, wie Stein, Fliese, Armaturen und Licht gemeinsam wirken. So lässt sich vergleichen, welche Gestaltung zu Ihren Räumen passt.'),image:showroom[1].image,imageAlt:'Badausstellung im Schubert Showroom',links:[a('Bäder aus unserem Portfolio',r('projekte','baeder'))]},
        {headline:'Raum für Ihre Fragen',text:p('Von der ersten Orientierung bis zur konkreten Materialwahl: Wir besprechen Ihre Wünsche und zeigen passende Möglichkeiten. Für eine ausführliche Beratung stimmen Sie am besten vorab einen Termin mit uns ab.'),image:showroom[2].image,imageAlt:'Wellness- und Badgestaltung im Schubert Showroom',links:[a('Beratung anfragen','/kontakt')]},
      ]}],
      rich('Ihr Besuch in Ingolstadt',`<p>${address}</p><p>Montag geschlossen<br>Dienstag bis Freitag: 09:00–12:30 und 14:00–17:00 Uhr<br>Samstag: 10:00–15:00 Uhr</p><p><a href="${maps}">Route zum Showroom planen</a> · <a href="${phoneHref}">${phone}</a></p>`),
      cta('Wir freuen uns auf Ihren Besuch.','Für die persönliche Beratung können Sie uns vorab Ihr Anliegen und einen Terminwunsch nennen.','Besuch anfragen'),
    ],
    'ueber-uns':[
      hero('Handwerk mit Geschichte. Und Gefühl für heute.','Seit 1953 verbindet der Familienbetrieb Schubert die Arbeit mit Naturstein mit der Gestaltung von Räumen. Was uns antreibt: besondere Materialien, saubere Ausführung und der Blick für das Ganze.',workshop,{compact:true,imageAlt:'Natursteinbearbeitung in der Schubert-Manufaktur'}),
      copy('Technologie unterstützt. Handwerk entscheidet.',p('Marmor, Sandstein, Kalkstein, Travertin, Onyx, Basalt und Granit: Jeder Naturstein hat seinen eigenen Charakter. Wir verbinden technische Möglichkeiten mit Erfahrung in der Bearbeitung und einem Gespür für Material und Proportion.')+p('Beratung, Planung, Fertigung und Montage werden als zusammenhängende Aufgabe betrachtet. So bleibt die Idee vom ersten Gespräch bis zur Ausführung nachvollziehbar.'),old('ueber-uns')[0].data.image,{imageAlt:'Naturstein und Handwerk bei Schubert',layout:'image-right'}),
      ['team',{...old('ueber-uns').find(s=>s.type==='team').data,headline:'Ihre Ansprechpartner',subline:'Henry Schubert und Raphael Schubert führen den Familienbetrieb.',membersHeadline:''}],
      ['timeline',{...old('ueber-uns').find(s=>s.type==='timeline').data,badge:'',headline:'Schubert seit 1953',entries:old('ueber-uns').find(s=>s.type==='timeline').data.entries.filter(e=>['1953','1965','1984','2013','2020'].includes(e.year))}],
      cta('Lernen wir uns kennen.','Besuchen Sie unseren Showroom und sprechen Sie mit uns über Ihr Vorhaben.'),
    ],
    kontakt:[
      hero('Wir nehmen uns Zeit für Ihr Vorhaben.','Sie erreichen uns telefonisch, per E-Mail oder über das Formular. Für eine ausführliche Beratung im Showroom vereinbaren wir gerne einen persönlichen Termin.','',{compact:true,primaryCta:a('Anrufen',phoneHref),secondaryCta:a('Route planen',maps)}),
      contactSection(doc,false),['map',{...map.data,headline:'Hier finden Sie uns'}],
    ],...legalPages,
  };
  applyPages(doc,pages);
  const itemCopy={
    baeder:['Bäder, die zu Ihrem Alltag passen.','Vom Gäste-WC bis zum großzügigen Badezimmer: Hier sehen Sie eine Auswahl unserer Badgestaltungen. Materialien, Einbauten und Details zeigen, wie unterschiedlich ein persönliches Bad aussehen kann.','Ihr Bad beginnt mit Ihren Wünschen.','Nutzung, Raumaufteilung, Material und Pflege gehören zusammen. Wir beraten Sie zu einer kompletten Neugestaltung ebenso wie zu einer passenden Teillösung.'],
    spas:['Raum zum Abschalten.','Spa- und Wellnessbereiche mit Naturstein. Entdecken Sie unterschiedliche Raumstimmungen, Oberflächen und handwerkliche Details aus unserem Portfolio.','Wellness braucht gute Planung.','Ob Sauna, Dampfbad oder besondere Dusche: Wir besprechen die Möglichkeiten für Ihre Räume und stimmen Material und Nutzung aufeinander ab.'],
    naturstein:['Naturstein. Jedes Stück eigenständig.','Entdecken Sie Naturstein in unterschiedlichen Anwendungen: als Fläche, Bauteil oder bewusst gesetztes Detail. Struktur und Oberfläche geben jedem Raum einen eigenen Charakter.','Welcher Stein passt zu Ihrem Vorhaben?','Marmor, Kalkstein oder Granit unterscheiden sich in Ausdruck und Eigenschaften. Im Showroom vergleichen wir mit Ihnen Materialien und Oberflächen für den vorgesehenen Einsatz.'],
    wcs:['Kleine Räume. Klare Gestaltung.','Gäste-WCs aus unserem Portfolio zeigen, wie Material, Proportion und Ausstattung auch auf begrenzter Fläche zusammenwirken.','Aus wenig Fläche viel machen.','Wir besprechen Raumnutzung, Waschtisch, Stauraum und die passenden Oberflächen. Auch einzelne maßgefertigte Elemente können den Raum prägen.'],
    gastro:['Material für gelebte Gastlichkeit.','Naturstein und hochwertige Oberflächen in gastronomischen Räumen. Diese Auswahl zeigt Gestaltungsideen und Details aus unserem Portfolio.','Gestaltung trifft täglichen Betrieb.','Optik, Beanspruchung und Pflege müssen zusammenpassen. Gemeinsam klären wir, welche Materialien und Ausführungen für Ihre Anwendung sinnvoll sind.'],
    gewerbe:['Naturstein im gewerblichen Raum.','Eine Auswahl gewerblicher Anwendungen aus unserem Portfolio: Räume, Flächen und Details mit eigenständiger Materialwirkung.','Ihr Projekt im Zusammenhang planen.','Wir stimmen Materialauswahl, technische Details und Einbau auf Ihre Anforderungen ab und unterstützen auch die Zusammenarbeit mit Architekten und Planern.'],
  };
  const configs={};
  for(const item of before.items){
    const [headline,intro,ctaHeadline,ctaText]=itemCopy[item.slug];
    const gallery=item.data.sections.find(s=>s.type==='portfolioGallery').data;
    const images=gallery.images.map((image,i)=>({...image,alt:`${item.title}: ${image.category||'Projektbeispiel'}, Ansicht ${i+1}`}));
    configs[item.slug]=[hero(headline,intro,item.data.sections[0].data.image,{compact:true,primaryCta:{},secondaryCta:a('Alle Themenwelten','/projekte'),imageAlt:`${item.title} aus dem Schubert-Portfolio`}),['portfolioGallery',{headline:`Einblicke: ${item.title}`,subline:'Wählen Sie eine Bildgruppe oder öffnen Sie ein Bild für die große Ansicht.',images,badge:'',cta:{}}],cta(ctaHeadline,ctaText)];
  }
  applyItems(doc,configs);return finish(doc);
}

function refineGrab(before){
  const doc=clean(clone(before));applyGlobals(doc,true);
  const old=slug=>before.sections.filter(s=>s.page_id===before.pages.find(p=>p.slug===slug).id).sort((x,y)=>x.sort_order-y.sort_order);
  const photo=name=>'https://schubertgrabdenkmal.de/images/'+name;
  const gravestone=photo('8D2A3719Ochs.jpg');
  const detail=photo('8D2A3821Franz.jpg');
  const workshop=photo('Manufaktur-Export-5-min.jpg');
  const galleryImages=old('galerie').find(s=>s.type==='galleryGrid').data.images.map((image,i)=>({...image,alt:`Naturstein-Grabgestaltung aus der Schubert-Galerie, Ansicht ${i+1}`,caption:''}));
  const cards=old('leistungen').find(s=>s.type==='servicesGrid').data.manualCards;
  const card=slug=>clone(cards.find(c=>c.href.endsWith('/'+slug)));
  const quiet=(headline,text,image='',options={})=>hero(headline,text,image,{layout:'quiet',...options});
  const pages={
    startseite:[
      quiet('Ein Ort für das, was bleibt.','Grabdenkmale aus Naturstein in Ingolstadt. Wir begleiten Sie bei der Gestaltung eines persönlichen Erinnerungsortes – mit Zeit für Ihre Wünsche und Sorgfalt im Handwerk.',gravestone,{secondaryCta:a('Beispiele ansehen','/galerie'),hint:'SCHUBERT · Gestaltung, Fertigung und Erhalt von Grabdenkmalen',imagePosition:'62% center',imageAlt:'Schlichtes Naturstein-Grabdenkmal aus dem Schubert-Portfolio'}),
      index('Was Sie gerade brauchen',[
        {title:'Ein neues Grabmal gestalten',text:'Gemeinsam wählen wir Stein, Form, Schrift und Details für einen persönlichen Ort der Erinnerung.',href:r('leistungen','grabdenkmale')},
        {title:'Ein bestehendes Grabmal ergänzen',text:'Eine weitere Inschrift, eine Überarbeitung oder Restaurierung wird passend zum vorhandenen Denkmal geplant.',href:r('leistungen','restaurierung-nachbeschriftung')},
        {title:'Ein Grab pflegen und erhalten',text:'Wir besprechen Reinigung, Zustand und Wartung von Grabmal, Einfassung und Naturstein.',href:r('leistungen','grabpflege-wartung')},
        {title:'Sich in Ruhe beraten lassen',text:'Auch ohne fertige Vorstellung können Sie sich an uns wenden. Wir erklären die Möglichkeiten und den nächsten Schritt.',href:r('leistungen','beratung-planung')},
      ]),
      copy('Die Erinnerung gibt die Richtung vor.',p('Ein Grabmal soll zur verstorbenen Person, zur Familie und zum Ort passen. Form, Naturstein und Inschrift werden deshalb gemeinsam betrachtet.')+p('Wir nehmen Ihre Ideen auf und berücksichtigen die Vorgaben des Friedhofs sowie den gewünschten Pflegeaufwand. Aus diesen Entscheidungen entsteht ein stimmiges Ganzes.'),detail,{primaryCta:a('Gestaltungsmöglichkeiten','/leistungen'),imageAlt:'Naturstein-Grabmal mit gestalteter Inschrift'}),
      steps('Schritt für Schritt zu einer stimmigen Gestaltung',[
        ['Persönlich sprechen','Wir klären Grabart, Friedhof und Ihre Wünsche. Sie müssen noch keine fertige Gestaltungsidee mitbringen.'],
        ['Gemeinsam gestalten','Material, Form und Inschrift werden abgestimmt. Wir erläutern die Möglichkeiten und berücksichtigen die Friedhofsvorgaben.'],
        ['Sorgfältig umsetzen','Nach der Abstimmung folgen Fertigung und fachgerechtes Setzen. Auch für spätere Ergänzungen und Pflege sind wir ansprechbar.'],
      ]),
      cta('Sie müssen noch nicht alles wissen.','Ein erstes Gespräch hilft, die Möglichkeiten zu ordnen. Rufen Sie uns an oder schreiben Sie uns Ihr Anliegen.','Persönliche Beratung'),
    ],
    leistungen:[
      quiet('Gestalten. Ergänzen. Erhalten.','Ob neues Grabdenkmal oder Arbeit an einer bestehenden Grabstätte: Wir begleiten die passenden Schritte von der Beratung bis zur Ausführung.',detail,{compact:true,secondaryCta:a('Beispiele ansehen','/galerie'),imageAlt:'Grabgestaltung mit Naturstein und Inschrift'}),
      index('Ein Grab neu gestalten',['grabdenkmale','grabeinfassungen','abdeckplatten','grabaccessoires'].map(card),'Denkmal, Einfassung und Details werden als zusammenhängender Erinnerungsort geplant.'),
      index('Bestehendes bewahren',['grabpflege-wartung','restaurierung-nachbeschriftung'].map(card),'Pflege, Instandsetzung und Ergänzungen erhalten den Charakter eines bestehenden Grabmals.'),
      copy('Gute Entscheidungen brauchen Orientierung.',p('Welche Form ist möglich? Welcher Stein passt? Was gibt der Friedhof vor? In einer persönlichen Beratung erklären wir die Möglichkeiten und besprechen Ihre Fragen zu Gestaltung, Pflege und Ablauf.'),workshop,{primaryCta:a('Beratung & Planung',r('leistungen','beratung-planung')),imageAlt:'Natursteinbearbeitung in der Schubert-Manufaktur',layout:'image-right'}),
      cta('Welcher Schritt steht für Sie an?','Schildern Sie uns Ihre Situation. Gemeinsam klären wir, welche Unterstützung Sie brauchen.','Anliegen besprechen'),
    ],
    galerie:[
      quiet('Erinnerung hat viele Formen.','Diese Beispiele aus der Schubert-Galerie zeigen unterschiedliche Natursteine, Formen und Inschriften. Sie dienen als Ausgangspunkt für Ihre persönliche Gestaltung.','',{compact:true,primaryCta:{},secondaryCta:{}}),
      ['galleryGrid',{headline:'Einblicke in die Grabgestaltung',subline:'Öffnen Sie die Bilder, um Materialien und Details in Ruhe anzusehen.',images:galleryImages,columns:3}],
      cta('Was spricht Sie an?','Bringen Sie gerne ein Beispiel, eine eigene Idee oder eine Erinnerung zum Gespräch mit. Daraus entwickeln wir gemeinsam eine passende Richtung.'),
    ],
    ratgeber:[
      quiet('Orientierung für Ihre Entscheidung.','Ein Grabmal verbindet persönliche Wünsche mit den Möglichkeiten des Friedhofs und den Eigenschaften des Materials. Hier finden Sie Antworten für die ersten Schritte.','',{compact:true,primaryCta:a('Eine Frage stellen','/kontakt'),secondaryCta:{}}),
      rich('Was vor der Gestaltung wichtig ist','<h3>Grabart und Friedhof</h3><p>Notieren Sie, um welche Grabart es geht und auf welchem Friedhof sich die Grabstätte befindet. Maße und Vorgaben der Friedhofsverwaltung helfen, die Gestaltung von Anfang an passend zu planen.</p><h3>Material und Oberfläche</h3><p>Farbe, Struktur und Bearbeitung geben Naturstein seinen Ausdruck. Polierte, geschliffene und naturbelassene Flächen wirken unterschiedlich und stellen unterschiedliche Anforderungen an die Pflege.</p><h3>Inschrift und persönliche Zeichen</h3><p>Namen, Daten, Worte und Symbole brauchen Raum und müssen lesbar bleiben. Eigene Textideen, Fotos oder Skizzen können eine gute Grundlage für das Gespräch sein.</p><h3>Pflege im Alltag</h3><p>Überlegen Sie, wie viel Pflege langfristig möglich ist. Pflanzflächen, Teilabdeckungen und Vollabdeckungen haben unterschiedliche Anforderungen und müssen auf dem jeweiligen Friedhof zulässig sein.</p>'),
      faq('Häufige Fragen',[
        ['Was bringe ich zum ersten Gespräch mit?','Hilfreich sind Grabart, Friedhof, ungefähre Maße und vorhandene Vorgaben. Fotos der Grabstelle, eigene Ideen oder Textwünsche können Sie ergänzen. Auch ohne vollständige Unterlagen können Sie Kontakt aufnehmen.'],
        ['Wann sollte die Planung beginnen?','Sobald Grabart und Friedhof feststehen, können erste Möglichkeiten besprochen werden. Genehmigung, Fertigung und Montage benötigen Zeit; den passenden Ablauf klären wir für die konkrete Grabstätte.'],
        ['Welche Kosten kommen auf mich zu?','Material, Größe, Bearbeitung, Inschrift, Zubehör und Montage bestimmen den Aufwand. Ein persönliches Angebot entsteht, wenn diese Punkte und die Gegebenheiten vor Ort geklärt sind.'],
        ['Sind Abdeckplatten überall erlaubt?','Das hängt von der jeweiligen Friedhofssatzung ab. Vor der Planung werden Maße, zulässige Gestaltung und weitere Vorgaben geprüft.'],
        ['Kann ein bestehender Grabstein ergänzt werden?','Oft sind Nachbeschriftung, Schriftauffrischung oder Restaurierung möglich. Ein Foto und eine Prüfung des vorhandenen Steins helfen bei der Einschätzung.'],
        ['Wie sollte Naturstein gereinigt werden?','Die geeignete Pflege hängt von Stein, Oberfläche und Zustand ab. Lassen Sie sich vor dem Einsatz von Reinigungsmitteln beraten; ungeeignete Mittel oder Verfahren können den Stein und die Schrift beschädigen.'],
      ]),
      cta('Ihre Frage ist noch offen?','Wir besprechen Ihre konkrete Situation und erklären die Möglichkeiten verständlich.','Frage stellen'),
    ],
    'ueber-uns':[
      quiet('Handwerk mit Gespür für Erinnerung.','SCHUBERT ist ein Familienbetrieb für Naturstein in Ingolstadt. Bei Grabdenkmalen verbinden wir gestalterische Erfahrung mit der Sorgfalt für einen sehr persönlichen Ort.',workshop,{compact:true,imageAlt:'Arbeit an Naturstein in der Schubert-Manufaktur'}),
      copy('Von Menschen gestaltet. Von Hand gefertigt.',p('Ein Grabdenkmal entsteht aus vielen kleinen Entscheidungen. Naturstein, Proportion, Schrift und Oberfläche müssen zusammenpassen. Wir begleiten diese Entscheidungen und setzen sie handwerklich um.')+p('Dabei sehen wir auch das Bestehende: Eine Nachbeschriftung, eine behutsame Restaurierung oder die richtige Pflege kann einen vertrauten Erinnerungsort erhalten.'),photo('Manufaktur-Export-2-min.jpg'),{imageAlt:'Naturstein und Arbeit in der Schubert-Manufaktur',primaryCta:a('Unsere Leistungen','/leistungen')}),
      steps('So begleiten wir Sie',[
        ['Zuhören und klären','Ihre Wünsche, die Grabstätte und die Friedhofsvorgaben bilden die Grundlage. Wir erklären, welche Informationen für den nächsten Schritt hilfreich sind.'],
        ['Gestaltung abstimmen','Stein, Form, Inschrift und ergänzende Elemente werden gemeinsam besprochen. Auch Fragen zum Pflegeaufwand und Kostenrahmen gehören dazu.'],
        ['Sorgfältig ausführen','Fertigung und Montage werden auf die abgestimmte Gestaltung ausgerichtet. Für spätere Ergänzungen und den Erhalt bleiben wir ansprechbar.'],
      ]),
      cta('Lernen wir uns persönlich kennen.','Sie finden uns in der Schrobenhausener Straße 132 in Ingolstadt. Für ein ausführliches Gespräch stimmen wir gerne einen Termin mit Ihnen ab.'),
    ],
    kontakt:[
      quiet('Wir sind für Ihre Fragen da.','Für ein neues Grabmal, eine Ergänzung oder die Pflege einer bestehenden Grabstätte: Sie erreichen uns telefonisch, per E-Mail oder über das Formular.','',{compact:true,primaryCta:a('Anrufen',phoneHref),secondaryCta:a('Route planen',maps)}),
      contactSection(doc,true),
      rich('Ihr Besuch bei SCHUBERT',`<p>${address}</p><p>Showroom: Dienstag bis Freitag 09:00–12:30 und 14:00–17:00 Uhr, Samstag 10:00–15:00 Uhr. Montag geschlossen.</p><p>Für eine ausführliche Beratung vereinbaren Sie bitte vorab einen Termin.</p><p><a href="${maps}">Route planen</a></p>`),
    ],...legalPages,
  };
  applyPages(doc,pages);
  const itemDetails={
    grabdenkmale:{headline:'Ein persönlicher Ort der Erinnerung.',intro:'Einzel-, Doppel- und Urnengrabmale aus Naturstein. Gemeinsam gestalten wir ein Grabdenkmal, das zur Person, zur Familie und zum Ort passt.',image:gravestone,title:'Form, Stein und Inschrift zusammen denken',body:'Ein Grabdenkmal soll die Erinnerung sichtbar machen. Die Form kann klar und zurückhaltend oder stärker gestaltet sein. Entscheidend ist, wie Material, Proportion und Schrift zusammenwirken.',points:[['Naturstein auswählen','Farbe, Struktur und Oberfläche bestimmen den Charakter des Denkmals.'],['Schrift gestalten','Namen, Daten und persönliche Worte werden lesbar in die Form eingebunden.'],['Den Ort berücksichtigen','Maße und Gestaltung werden auf Grabart und Friedhofsvorgaben abgestimmt.']],steps:[['Wünsche besprechen','Wir klären Grabart, Friedhof und die Vorstellungen für Form, Material und Inschrift.'],['Entwurf abstimmen','Aus den besprochenen Elementen entsteht eine gemeinsame Gestaltungsrichtung. Offene Fragen werden vor der Ausführung geklärt.'],['Fertigen und setzen','Nach Abstimmung und erforderlicher Genehmigung folgen Fertigung und fachgerechte Montage.']],cta:'Ein Grabdenkmal gemeinsam gestalten'},
    grabeinfassungen:{headline:'Ein stimmiger Rahmen für die Grabstätte.',intro:'Grabeinfassungen aus Naturstein geben Einzel-, Doppel- und Urnengräbern eine klare Form und verbinden Grabmal und Fläche.',image:photo('SchubertCA3E6268-23.jpg'),title:'Proportion und praktische Details verbinden',body:'Eine Einfassung fasst die Grabfläche und stimmt den Übergang zu Wegen und Nachbargräbern ab. Material und Bearbeitung werden passend zum bestehenden oder neuen Denkmal gewählt.',points:[['Maße und Anschlüsse','Grabgröße, Höhen und angrenzende Flächen werden vor der Ausführung geklärt.'],['Material und Oberfläche','Die Einfassung soll sich in das gesamte Grabbild einfügen.'],['Pflege berücksichtigen','Pflanzflächen und mögliche Abdeckungen werden bei der Planung mitgedacht.']],steps:[['Bestand aufnehmen','Maße, Grabart, Denkmal und die Vorgaben des Friedhofs werden geprüft.'],['Ausführung wählen','Wir stimmen Stein, Oberfläche, Höhe und die Anschlüsse mit Ihnen ab.'],['Einfassung setzen','Die Elemente werden gefertigt, ausgerichtet und fachgerecht eingebaut.']],cta:'Die passende Einfassung besprechen'},
    abdeckplatten:{headline:'Eine ruhige Fläche. Bewusst gestaltet.',intro:'Teil- und Vollabdeckungen aus Naturstein verbinden Gestaltung und Pflegewunsch. Die Lösung wird auf Grabart und Friedhof abgestimmt.',image:photo('SchubertCA3E6268-23.jpg'),title:'Pflegewunsch und Gestaltung abwägen',body:'Eine Abdeckplatte kann die Grabfläche beruhigen und den Pflegeaufwand verändern. Teilflächen lassen Raum für Pflanzen; eine vollständige Abdeckung wirkt geschlossener. Welche Lösung möglich ist, bestimmt auch die Friedhofssatzung.',points:[['Aufteilung wählen','Pflanzbereich, freie Fläche und Zubehör werden gemeinsam angeordnet.'],['Stein abstimmen','Farbe und Oberfläche sollen zum Grabmal und zur Einfassung passen.'],['Zulässigkeit klären','Die geplante Abdeckung muss den Vorgaben des Friedhofs entsprechen.']],steps:[['Wünsche klären','Wir besprechen Pflegeaufwand, Grabgestaltung und vorhandene Bauteile.'],['Aufteilung planen','Maße, Material, Plattenaufteilung und technische Details werden abgestimmt.'],['Passgenau umsetzen','Nach Freigabe werden die Platten gefertigt und fachgerecht montiert.']],cta:'Möglichkeiten einer Abdeckung klären'},
    grabaccessoires:{headline:'Persönliche Details mit Bedeutung.',intro:'Laternen, Vasen, Kreuze, Bronzen und weitere Elemente können den Charakter einer Grabstätte ergänzen.',image:photo('8D2A3679Lang.jpg'),title:'Ergänzen, ohne das Ganze zu überladen',body:'Ein Licht, Blumen oder ein bewusst gewähltes Symbol können einem Grab einen persönlichen Ausdruck geben. Dabei zählen neben der Bedeutung auch Material, Proportion und eine sichere Befestigung.',points:[['Eine Richtung finden','Welche Zeichen und Gegenstände passen zur Person und zum bestehenden Denkmal?'],['Materialien abstimmen','Stein und ergänzende Elemente sollen in Farbe und Wirkung harmonieren.'],['Nutzung mitdenken','Erreichbarkeit, Reinigung und Befestigung werden bei der Auswahl berücksichtigt.']],steps:[['Ideen sammeln','Wir besprechen persönliche Wünsche und den vorhandenen Platz an der Grabstätte.'],['Passendes auswählen','Form, Material und Position werden auf das Grabmal abgestimmt.'],['Fachgerecht befestigen','Die ausgewählten Elemente werden passend zur Anlage und zum Material angebracht.']],cta:'Passende Details auswählen'},
    'grabpflege-wartung':{headline:'Erinnerungsorte sorgfältig erhalten.',intro:'Reinigung, Zustandsprüfung und Wartung für Grabmale, Einfassungen und Natursteinflächen.',image:photo('SNY00688Roth.jpg'),title:'Die richtige Pflege beginnt beim Stein',body:'Naturstein, Oberfläche und Schrift reagieren unterschiedlich auf Witterung und Reinigungsmittel. Wir sehen uns den Zustand an und besprechen, welche Pflege oder Instandsetzung angemessen ist.',points:[['Schonend reinigen','Die Behandlung richtet sich nach Steinart, Oberfläche und vorhandenen Verschmutzungen.'],['Zustand prüfen','Schrift, Fugen und sichtbare Veränderungen werden bei der Einschätzung berücksichtigt.'],['Erhalt planen','Wir erläutern sinnvolle Maßnahmen und Hinweise für die weitere Pflege.']],steps:[['Zustand einschätzen','Ein Foto und Angaben zur Grabstätte helfen beim ersten Kontakt. Falls nötig wird der Bestand vor Ort angesehen.'],['Maßnahmen abstimmen','Wir erklären, welche Reinigung oder Instandsetzung für das Material geeignet ist.'],['Pflege ausführen','Die vereinbarten Arbeiten werden fachgerecht durchgeführt. Sie erhalten Hinweise für den weiteren Umgang mit dem Stein.']],cta:'Pflege oder Wartung anfragen'},
    'restaurierung-nachbeschriftung':{headline:'Bewahren. Ergänzen. Weitertragen.',intro:'Bestehende Grabmale behutsam überarbeiten, Schriften auffrischen und Namen oder Daten passend ergänzen.',image:detail,title:'Den vorhandenen Charakter respektieren',body:'Bei einer Ergänzung zählt die Beziehung zum bestehenden Denkmal. Schriftart, Größe und Bearbeitung sollen zusammenpassen. Auch bei einer Restaurierung wird zuerst geprüft, was der Stein und die vorhandene Ausführung benötigen.',points:[['Schriftbild aufnehmen','Bestehende Buchstaben, Abstände und Bearbeitung bilden die Grundlage für eine Ergänzung.'],['Text abstimmen','Namen, Daten und weitere Angaben werden vor der Ausführung sorgfältig freigegeben.'],['Ausführung prüfen','Je nach Arbeit und Zustand wird die Umsetzung vor Ort oder in der Werkstatt geplant.']],steps:[['Bestand ansehen','Fotos, vorhandene Inschrift und Angaben zum Standort helfen, die Arbeit einzuschätzen.'],['Ergänzung freigeben','Umfang, Schriftbild und genauer Text werden gemeinsam abgestimmt.'],['Sorgfältig bearbeiten','Die vereinbarte Beschriftung oder Restaurierung erfolgt passend zum bestehenden Material.']],cta:'Eine Ergänzung oder Restaurierung besprechen'},
    'beratung-planung':{headline:'In Ruhe den nächsten Schritt finden.',intro:'Sie brauchen noch keine fertige Vorstellung. Wir unterstützen Sie bei Fragen zu Gestaltung, Material, Friedhofsvorgaben und Ablauf.',image:photo('Manufaktur-Export-2-min.jpg'),title:'Was Ihnen wichtig ist, steht am Anfang',body:'Eine persönliche Beratung ordnet die Möglichkeiten. Wir hören zu, erläutern Unterschiede und entwickeln mit Ihnen eine Richtung, die zur Grabstätte, zur Familie und zum gewünschten Pflegeaufwand passt.',points:[['Ihre Wünsche','Erinnerungen, eigene Ideen, Symbole oder Textwünsche können das Gespräch eröffnen.'],['Der Rahmen','Grabart, Friedhofssatzung, vorhandene Maße und ein Kostenrahmen geben Orientierung.'],['Der Ablauf','Wir erklären, welche Abstimmungen und Schritte bis zur Ausführung anstehen.']],steps:[['Anliegen schildern','Nennen Sie uns, soweit bekannt, Friedhof, Grabart und die Fragen, die Sie beschäftigen.'],['Möglichkeiten vergleichen','Wir besprechen Form, Stein, Inschrift, Pflegewunsch und die Vorgaben des Ortes.'],['Nächste Schritte vereinbaren','Aus dem Gespräch ergeben sich die Unterlagen, Entscheidungen und weiteren Termine für die Planung.']],cta:'Ein persönliches Gespräch vereinbaren'},
  };
  const configs={};
  for(const item of before.items){const d=itemDetails[item.slug];configs[item.slug]=[quiet(d.headline,d.intro,d.image,{compact:true,imageAlt:`${item.title}: Beispiel aus dem Schubert-Portfolio`,secondaryCta:a('Alle Leistungen','/leistungen')}),rich(d.title,p(d.body)+d.points.map(([title,text])=>`<h3>${title}</h3><p>${text}</p>`).join('')),steps('So gehen wir vor',d.steps),cta(d.cta,'Rufen Sie uns an oder schreiben Sie uns Ihr Anliegen. Wir klären mit Ihnen die Möglichkeiten und den nächsten Schritt.','Anliegen besprechen')];}
  applyItems(doc,configs);return finish(doc);
}

function replaceAssets(value,map){
  if(typeof value==='string')return map[value]||value;
  if(Array.isArray(value))return value.map(item=>replaceAssets(item,map));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,replaceAssets(item,map)]));
  return value;
}
mkdirSync(dir,{recursive:true});
const assetFile=resolve(dir,'asset-map.json');
const bundledAssetFile=new URL('./asset-map.json',import.meta.url);
const assetMap=JSON.parse(readFileSync(existsSync(assetFile)?assetFile:bundledAssetFile,'utf8').replace(/^\uFEFF/,''));
for(const [name,transform]of [['design',refineDesign],['grab',refineGrab]]){
  const before=JSON.parse(readFileSync(resolve(dir,`${name}-before.json`),'utf8').replace(/^\uFEFF/,''));
  const after=replaceAssets(transform(before),assetMap);
  writeFileSync(resolve(dir,`${name}-after.json`),JSON.stringify(after,null,2)+'\n');
  console.log(`${name}: ${after.pages.length} pages, ${after.sections.length} sections, ${after.items.length} collection details prepared. IDs and routes preserved.`);
}
