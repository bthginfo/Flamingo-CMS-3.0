import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const dataDir = resolve(process.env.SCHUBERT_CONTENT_DIR || 'tmp/schubert-launch-2026-10-19');
const round = process.env.SCHUBERT_QA_ROUND || '1';
const output = join(dataDir, `review-${round}`);
await mkdir(output, { recursive:true });
const base = (process.env.SCHUBERT_QA_URL || 'http://127.0.0.1:3019').replace(/\/$/,'');
const publicMode = process.env.SCHUBERT_QA_PUBLIC === '1';
const selectedRoutes = new Set((process.env.SCHUBERT_QA_ROUTES || '').split(',').filter(Boolean));
const selectedViewports = new Set((process.env.SCHUBERT_QA_VIEWPORTS || '').split(',').filter(Boolean));
const sites = { design:'https://flamingo-schubert-design.vercel.app', grab:'https://flamingo-schubert-grabdenkmal.vercel.app' };
const browser = await chromium.launch({channel:'chrome',headless:true});
const results = [];
const faults = [];
try {
  for (const [site, live] of Object.entries(sites)) {
    const exported = JSON.parse(await readFile(join(dataDir,`${site}-after.json`),'utf8'));
    let routes = exported.pages.filter(p=>p.visible).map(p=>p.slug==='startseite'?'':p.slug);
    for (const collection of exported.collections) for (const item of exported.items.filter(i=>i.published && i.collection_id===collection.id)) routes.push(`c/${collection.key}/${item.slug}`);
    if (selectedRoutes.size) routes = routes.filter(slug=>selectedRoutes.has(`${site}:${slug}`));
    if (!routes.length) continue;
    for (const viewport of [{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844}]) {
      if(selectedViewports.size && !selectedViewports.has(viewport.name)) continue;
      const context = await browser.newContext({viewport:{width:viewport.width,height:viewport.height},colorScheme:'light',reducedMotion:'reduce'});
      // A QA run never creates an enquiry or sends a message.
      await context.route('**/api/contact',route=>route.abort());
      await context.route('**/api/forms/**',route=>route.abort());
      const page = await context.newPage();
      const errors=[];
      page.on('pageerror',error=>errors.push(error.message.slice(0,1800)));
      for (const slug of routes) {
        errors.length=0;
        const url = publicMode ? `${live}/${slug}` : `${base}/quality/${site}/${slug}`;
        const name = `${site}-${slug.replaceAll('/','__') || 'home'}-${viewport.name}`;
        try {
          const response = await page.goto(url,{waitUntil:'domcontentloaded',timeout:55000});
          await page.locator('main').waitFor({state:'visible',timeout:20000});
          await page.locator('html[data-flamingo-hydrated="true"]').waitFor({state:'attached',timeout:20000});
          const necessary = page.getByRole('button',{name:'Nur notwendige',exact:true});
          if (await necessary.isVisible()) await necessary.click();
          await page.evaluate(async()=>{
            await document.fonts.ready;
            for(let y=0;y<document.documentElement.scrollHeight;y+=Math.max(500,innerHeight*.8)){
              scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,45));
            }
            await Promise.race([Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,12000))]);
            scrollTo({top:0,behavior:'instant'});
          });
          // Inspect the settled authored state, not a translucent in-view or
          // sticky-header transition. Do not override the website's styles.
          await page.evaluate(async()=>{
            let stable=0, previous='';
            const started=performance.now();
            while(stable<4 && performance.now()-started<2500){
              await new Promise(r=>setTimeout(r,100));
              const signature=scrollY+'|'+[...document.querySelectorAll('main [style],header,header [style],[data-site-header-topbar]')]
                .map(e=>{const c=getComputedStyle(e);return `${c.opacity}|${c.transform}|${c.backgroundColor}`;}).join(';');
              stable=signature===previous?stable+1:0;previous=signature;
            }
          });
          const checks = await page.evaluate(()=>({
            scrollY,
            headerTop:document.querySelector('header')?.getBoundingClientRect().top,
            h1:[...document.querySelectorAll('main h1')].map(x=>x.textContent?.trim()),
            width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,
            bodyText:document.querySelector('main')?.textContent?.length,
            overflow:[...document.querySelectorAll('main *')].filter(x=>{const r=x.getBoundingClientRect();const c=getComputedStyle(x);return r.width>0&&(r.right>innerWidth+2||r.left < -2)&&c.position!=='absolute'&&c.position!=='fixed';}).slice(0,8).map(x=>({tag:x.tagName,text:x.textContent?.slice(0,70),right:Math.round(x.getBoundingClientRect().right)})),
            images:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.currentSrc||i.src),
            emptyLinks:[...document.querySelectorAll('a')].filter(a=>!a.innerText?.trim()&&!a.getAttribute('aria-label')&&!a.querySelector('img[alt]:not([alt=""])')).map(a=>a.getAttribute('href')),
            forms:[...document.querySelectorAll('form')].map(f=>({required:f.querySelectorAll('[required]').length,invalid:!f.checkValidity(),privacy:!!f.querySelector('a[href*="datenschutz"]')})),
            placeholders:/Lorem ipsum|Bitte ersetzen|Bitte prüfen Sie.*CMS|magdalenajohanna\.com/i.test(document.querySelector('main')?.innerText||''),
          }));
          const axe = await new AxeBuilder({page}).withRules(['color-contrast','link-name','button-name','label','image-alt','heading-order','aria-valid-attr','aria-valid-attr-value']).analyze();
          const violations=axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary,html:n.html.slice(0,300)}))}));
          if (!slug || process.env.SCHUBERT_QA_CAPTURE_VIEWPORTS==='1') await page.screenshot({path:join(output,`${name}-viewport.png`)});
          await page.screenshot({path:join(output,`${name}.png`),fullPage:true});
          if(site==='design' && slug==='kontakt' && viewport.name==='desktop'){
            const mapHeading=page.getByRole('heading',{name:'Hier finden Sie uns',exact:true});
            const mapBlock=mapHeading.locator('..');
            await mapHeading.waitFor({state:'visible'});
            await mapBlock.screenshot({path:join(output,`${name}-map.png`)});
            await page.locator('footer').screenshot({path:join(output,`${name}-footer.png`)});
            const gate={headingVisible:await mapHeading.isVisible(),mapsBlocked:(await mapBlock.locator('iframe').count())===0,googleMapsNamed:(await mapBlock.innerText()).includes('Google Maps')};
            results.push({site,viewport:viewport.name,interaction:'contact-map-consent',...gate});
            if(!gate.headingVisible||!gate.mapsBlocked||!gate.googleMapsNamed)faults.push(`${name}-map-consent`);
          }
          if ((site==='design' && slug==='c/projekte/baeder') || (site==='grab' && slug==='galerie')) {
            const opener=page.getByRole('button',{name:/vergrößern$/}).first();
            if(await opener.count()){
              await opener.click();
              const dialog=page.getByRole('dialog',{name:'Bildansicht',exact:true,includeHidden:true});
              await dialog.waitFor({state:'visible'});
              const initialImage=await dialog.locator('img').first().getAttribute('src');
              await page.keyboard.press('ArrowRight');
              const changed=(await dialog.locator('img').first().getAttribute('src'))!==initialImage;
              const dialogAxe=await new AxeBuilder({page}).include('dialog[open]').withRules(['color-contrast','button-name']).analyze();
              await page.screenshot({path:join(output,`${name}-dialog.png`)});
              await page.keyboard.press('Escape');
              const closed=await dialog.evaluate(d=>!d.open);
              const focusRestored=await opener.evaluate(e=>e===document.activeElement);
              results.push({site,viewport:viewport.name,interaction:'gallery-keyboard',changed,closed,focusRestored,violations:dialogAxe.violations});
              if(!changed||!closed||!focusRestored||dialogAxe.violations.length)faults.push(`${name}-dialog`);
            }else{faults.push(`${name}-missing-gallery`);}
          }
          if (!slug) {
            const menuToggle=page.getByRole('button',{name:'Menü öffnen',exact:true});
            if(viewport.name==='mobile') await menuToggle.click();
            const navLink=page.locator('header a[href$="/leistungen"]:visible').first();
            await navLink.hover();
            await page.waitForTimeout(400);
            const navHover=await navLink.evaluate(e=>({color:getComputedStyle(e).color,configured:getComputedStyle(e).getPropertyValue('--nav-link-hover').trim()}));
            const navAxe=await new AxeBuilder({page}).include('header').withRules(['color-contrast','link-name','button-name']).analyze();
            results.push({site,viewport:viewport.name,interaction:'navigation-hover',...navHover,violations:navAxe.violations});
            if(navAxe.violations.length)faults.push(`${name}-navigation-hover`);
            if(viewport.name==='mobile') await page.keyboard.press('Escape');
            const settings=page.getByRole('button',{name:'Cookie-Einstellungen',exact:true});
            if(await settings.count()){
              await settings.click();
              const banner=page.getByRole('dialog',{name:'Cookie-Einstellungen',exact:true});
              await banner.waitFor({state:'visible'});
              const controls=await banner.getByRole('switch').count();
              await page.keyboard.press('Escape');
              const unchanged=await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('flamingo_consent')||'{}');return c.functional===false&&c.analytics===false&&c.marketing===false;});
              const closed=!(await banner.isVisible());
              const focusRestored=await settings.evaluate(e=>e===document.activeElement);
              results.push({site,viewport:viewport.name,interaction:'reopen-cookie-settings',controls,unchanged,closed,focusRestored});
              if(!controls||!unchanged||!closed||!focusRestored)faults.push(`${name}-cookie-settings`);
            }else{faults.push(`${name}-missing-cookie-settings`);}
          }
          const row={site,slug,viewport:viewport.name,status:response?.status(),...checks,violations,errors:errors.splice(0)};
          results.push(row);
          const count=violations.reduce((a,v)=>a+v.nodes.length,0);
          console.log(`${name}: HTTP ${row.status}; H1=${checks.h1.length}; contrast/semantics=${count}; overflow=${checks.scrollWidth>checks.width+2}; images=${checks.images.length}`);
          if(row.status!==200||checks.h1.length!==1||count||checks.scrollWidth>checks.width+2||checks.images.length||checks.emptyLinks.length||checks.placeholders||row.errors.length||checks.forms.some(f=>!f.privacy)) faults.push(name);
        } catch(error) { results.push({site,slug,viewport:viewport.name,error:error.message,errors:errors.splice(0)});faults.push(name);console.log(`${name}: ERROR ${error.message.slice(0,120)}`); }
      }
      // Cover the shared mobile navigation and focus recovery without form submission.
      if(viewport.name==='mobile'){
        await page.goto(publicMode?live:`${base}/quality/${site}/`,{waitUntil:'domcontentloaded'});
        const menu=page.getByRole('button',{name:'Menü öffnen',exact:true});
        if(await menu.isVisible()){
          await menu.click();await page.keyboard.press('Escape');
          results.push({site,interaction:'mobile-menu-escape',closed:(await menu.getAttribute('aria-expanded'))==='false',focusRestored:await menu.evaluate(e=>e===document.activeElement)});
        }
      }
      await context.close();
    }
  }
} finally { await browser.close(); }
await writeFile(join(output,'audit.json'),JSON.stringify({results,faults},null,2));
console.log(JSON.stringify({inspected:results.filter(x=>x.slug!==undefined).length,failed: faults.length,output}));
process.exitCode=faults.length?1:0;
