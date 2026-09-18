const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sharp=require('C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'..'),key='tokenia.chapter1.v1',url=pathToFileURL(path.join(root,'index.html')).href;
const qa=path.join(root,'qa');
async function saved(page){return page.evaluate(k=>JSON.parse(localStorage.getItem(k+'.autosave')),key);}
async function capture(page,name){await page.screenshot({path:path.join(qa,name+'.png')});}
async function goToLogin(page){await page.evaluate(()=>{for(let i=0;i<30;i++){if(!document.querySelector('#station-screen').classList.contains('hidden'))return;document.querySelector('#advance').click();}throw Error('No station');});}
async function checkLayout(page){
  const bad=await page.evaluate(()=>[...document.querySelectorAll('.title-menu,.station-form,.topbar,.dialogue-area,.choices,.name-field')].filter(e=>e.checkVisibility()).filter(e=>{const r=e.getBoundingClientRect();return r.left<-.5||r.right>innerWidth+.5||e.scrollWidth>e.clientWidth+2;}).map(e=>e.className));assert.deepEqual(bad,[]);
}
(async()=>{
  fs.mkdirSync(qa,{recursive:true});
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:960}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>errors.push(r.url()));
  await page.addInitScript(k=>{localStorage.setItem(k+'.settings',JSON.stringify({speed:0,sound:false,reduceMotion:true}));},key);
  try{
    await page.goto(url);await page.locator('.title-cast img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
    assert.equal(await saved(page),null);assert.ok(await page.locator('#title-continue').isDisabled());
    await checkLayout(page);await capture(page,'title-desktop');
    await page.setViewportSize({width:390,height:844});await checkLayout(page);await capture(page,'title-mobile');
    await page.locator('#title-settings').click();assert.ok(await page.locator('#modal').evaluate(e=>e.open));await page.locator('#close-modal').click();
    await page.locator('#title-new').click();await goToLogin(page);assert.equal((await saved(page)).state.node,'intro.6');
    await page.locator('#station-submit').click();assert.equal(await page.locator('#player-name').getAttribute('aria-invalid'),'true');
    for(const bad of ['   ','<script>','一二三四五六七八九十一二三']){await page.locator('#player-name').fill(bad);await page.locator('#station-submit').click();assert.equal((await saved(page)).state.node,'intro.6');assert.equal(await page.locator('#player-name').getAttribute('aria-invalid'),'true');}
    await page.locator('#player-name').fill('');await page.locator('#player-name').pressSequentially('hasl12');assert.equal(await page.locator('#modal').evaluate(e=>e.open),false);assert.equal((await saved(page)).state.node,'intro.6');
    await page.locator('#player-name').fill('林澈');
    await checkLayout(page);await capture(page,'station-mobile');
    await page.setViewportSize({width:1440,height:960});await capture(page,'station-desktop');
    await page.locator('#player-name').dispatchEvent('compositionstart');await page.locator('#station-form').dispatchEvent('submit');assert.equal((await saved(page)).state.playerName,'');await page.locator('#player-name').dispatchEvent('compositionend');
    await page.locator('#player-name').press('Enter');await page.waitForFunction(()=>document.querySelector('#station-screen').classList.contains('hidden'));
    assert.equal((await saved(page)).state.playerName,'林澈');assert.match(await page.locator('#dialogue-text').textContent(),/欢迎，林澈/);
    await page.locator('#advance').click();assert.equal(await page.locator('#speaker').textContent(),'林澈');
    await page.locator('#home').click();const before=await saved(page);await page.reload();assert.deepEqual((await saved(page)).state,before.state);assert.ok(await page.locator('#title-screen').isVisible());
    await page.locator('#title-new').click();await page.locator('#restart-cancel').click();assert.deepEqual((await saved(page)).state,before.state);
    await page.locator('#title-continue').click();assert.equal(await page.locator('#speaker').textContent(),'林澈');
    await page.evaluate(()=>{for(let i=0;i<30;i++){if(!document.querySelector('#choices').classList.contains('hidden'))return;document.querySelector('#advance').click();}throw Error('No routes');});
    const routeStart=await saved(page);
    for(const [index,id] of ['chatgpt','claude','gemini','deepseek','grok'].entries()){
      if(index){await page.locator('#load').click();await page.locator('#import-file').setInputFiles({name:'routes.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(routeStart))});await page.waitForFunction(()=>!document.querySelector('#modal').open);}
      await page.locator('.choice').nth(index).click();await page.locator('#character').evaluate(i=>i.decode());
      for(const [size,label] of [[{width:1440,height:960},'desktop'],[{width:390,height:844},'mobile']]){
        await page.setViewportSize(size);await checkLayout(page);
        const centered=await page.locator('#character-wrap').evaluate(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left+r.width/2-innerWidth/2)<1;});assert.ok(centered,id+' should be centered');
        await capture(page,`centered-${id}-${label}`);
      }
      const {data,info}=await sharp(path.join(root,`assets/${id}-transparent.png`)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
      let clear=0,opaque=0;for(let p=3;p<data.length;p+=info.channels){if(data[p]===0)clear++;if(data[p]>=250)opaque++;}
      assert.ok(clear>info.width*info.height*.15);assert.ok(opaque>info.width*info.height*.25);console.log(`${id}: centered desktop/mobile; genuine alpha channel verified.`);
    }
    await page.locator('#save').click();await page.locator('.save-slot').nth(1).getByRole('button').click();await page.locator('#close-modal').click();
    const namedSave=await saved(page);await page.locator('#home').click();await page.locator('#title-load').click();await page.locator('.save-slot').nth(1).getByRole('button').click();assert.equal((await saved(page)).state.playerName,'林澈');
    const legacy=structuredClone(namedSave);delete legacy.state.playerName;
    await page.locator('#load').click();await page.locator('#import-file').setInputFiles({name:'legacy.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(legacy))});await page.waitForFunction(()=>!document.querySelector('#modal').open);assert.equal((await saved(page)).state.playerName,'旅人');
    await page.locator('#home').click();await page.locator('#title-new').click();await page.locator('#restart-confirm').click();await goToLogin(page);
    for(const [size,label] of [[{width:360,height:640},'small'],[{width:844,height:390},'landscape']]){await page.setViewportSize(size);await checkLayout(page);await capture(page,'station-'+label);}
    await page.setViewportSize({width:360,height:640});await page.locator('#player-name').fill('一二三四五六七八九十甲乙');await page.locator('#station-submit').click();await page.waitForFunction(()=>document.querySelector('#station-screen').classList.contains('hidden'));
    assert.equal((await saved(page)).state.playerName,'一二三四五六七八九十甲乙');await page.locator('#advance').click();await checkLayout(page);await capture(page,'long-name-mobile');
    await page.locator('#home').click();await page.locator('#title-new').click();await page.locator('#restart-confirm').click();assert.equal((await saved(page)).state.playerName,'');
    await goToLogin(page);await page.locator('#home').click();await page.locator('#title-continue').click();assert.ok(await page.locator('#station-screen').isVisible());
    assert.deepEqual(errors,[]);console.log('Title navigation, name validation, IME, keyboard isolation, personalized dialogue, persistence and legacy saves: passed.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
