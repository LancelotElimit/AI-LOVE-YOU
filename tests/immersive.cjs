const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {clickControl}=require('./controls.cjs');
const root=path.resolve(__dirname,'..'),key='tokenia.chapter1.v1',url=pathToFileURL(path.join(root,'index.html')).href;
const visible=async(page,selector)=>page.locator(selector).evaluate(el=>getComputedStyle(el).opacity==='1'&&getComputedStyle(el).pointerEvents!=='none');
async function center(page){await page.mouse.move(250,250);await page.waitForTimeout(250);}
async function seedCG(page) {
  await page.evaluate(key=>{
    const node=Object.values(STORY).find(n=>n.bg==='ch02_five_girls_under_eaves');
    const state={version:1,node:node.id,playerName:'林澈',tokens:10000,route:'deepseek',affinity:{chatgpt:0,claude:0,gemini:0,deepseek:0,grok:0},intent:'home',flags:[],history:[],finished:false};
    sessionStorage.setItem('immersive-seed',JSON.stringify({state,date:Date.now()}));
  },key);
  await page.reload();await page.locator('#title-continue').click();await center(page);
}
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(key=>{
    localStorage.setItem(key+'.settings',JSON.stringify({sound:false,speed:0,reduceMotion:true}));
    const seed=sessionStorage.getItem('immersive-seed');if(seed){localStorage.setItem(key+'.autosave',seed);sessionStorage.removeItem('immersive-seed');}
    window.fullscreenAttempts=0;const request=Element.prototype.requestFullscreen;
    Element.prototype.requestFullscreen=function(...args){window.fullscreenAttempts++;return request.apply(this,args);};
  },key);
  try {
    await page.goto(url);assert.equal(await page.evaluate(()=>fullscreenAttempts),0);
    await page.locator('#title-new').click();await center(page);
    assert.equal(await page.evaluate(()=>fullscreenAttempts),1);
    const entered=await page.evaluate(()=>!!document.fullscreenElement);
    console.log('Native browser fullscreen entered:',entered);
    assert.equal(await visible(page,'.topbar'),false);assert.equal(await visible(page,'.toolbar'),false);
    const before=await page.locator('#stage').boundingBox();assert.equal(before.y,0);
    await page.mouse.move(300,2);assert.equal(await visible(page,'.topbar'),true);
    await page.mouse.move(300,40);assert.equal(await visible(page,'.topbar'),true);
    assert.deepEqual(await page.locator('#stage').boundingBox(),before);
    await center(page);assert.equal(await visible(page,'.topbar'),false);
    await clickControl(page,'relationships');assert.equal(await page.locator('.relationship-row').count(),5);await page.locator('#close-modal').click();
    await clickControl(page,'save');assert.equal(await page.locator('#modal-title').textContent(),'把这一刻留下');await page.locator('#close-modal').click();
    await center(page);assert.equal(await visible(page,'.toolbar'),false);
    await page.locator('#home').focus();await page.keyboard.press('Tab');assert.equal(await visible(page,'.topbar'),true);
    await page.locator('#advance').focus();await center(page);
    if(entered){await clickControl(page,'fullscreen');await page.waitForFunction(()=>!document.fullscreenElement);await page.locator('#advance').click();assert.equal(await page.evaluate(()=>fullscreenAttempts),1);}
    await seedCG(page);assert.equal(await page.evaluate(()=>fullscreenAttempts),1);
    fs.mkdirSync(path.join(root,'qa'),{recursive:true});
    for(const [width,height] of [[1440,900],[1920,1080],[390,844],[844,390]]) {
      await page.setViewportSize({width,height});await center(page);await page.locator('#backdrop img').evaluate(i=>i.decode());
      const layout=await page.evaluate(()=>{
        const bg=document.querySelector('#backdrop').getBoundingClientRect(),img=document.querySelector('#backdrop img');
        return {x:bg.x,y:bg.y,w:bg.width,h:bg.height,vw:innerWidth,vh:innerHeight,fit:getComputedStyle(img).objectFit,overflow:document.documentElement.scrollWidth>innerWidth};
      });
      assert.equal(layout.x,0);assert.equal(layout.y,0);assert.equal(layout.w,layout.vw);assert.equal(layout.h,layout.vh);assert.equal(layout.fit,'cover');assert.equal(layout.overflow,false);
      await page.screenshot({path:path.join(root,`qa/immersive-cg-${width}.png`)});
    }
    await clickControl(page,'cg-fit');assert.equal(await page.locator('#backdrop img').evaluate(e=>getComputedStyle(e).objectFit),'contain');
    await clickControl(page,'cg-fit');assert.equal(await page.locator('#backdrop img').evaluate(e=>getComputedStyle(e).objectFit),'cover');
    await page.setViewportSize({width:1440,height:900});await page.mouse.move(400,2);await page.screenshot({path:path.join(root,'qa/immersive-topbar.png')});
    if(await page.evaluate(()=>!!document.fullscreenElement))await clickControl(page,'fullscreen');
    await clickControl(page,'home');await page.evaluate(()=>{Element.prototype.requestFullscreen=function(){window.fullscreenAttempts++;return Promise.reject(new Error('Denied for test'));};});
    await page.locator('#title-continue').click();await page.waitForTimeout(100);
    assert.ok(await page.locator('#dialogue-area').isVisible());assert.match(await page.locator('#toast').textContent(),/未能自动全屏/);
    assert.deepEqual(errors,[]);
    const touch=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
    await touch.addInitScript(key=>{
      localStorage.setItem(key+'.settings',JSON.stringify({sound:false,speed:0,reduceMotion:true}));
      Element.prototype.requestFullscreen=()=>Promise.reject(new Error('Unsupported'));
    },key);
    await touch.goto(url);await touch.locator('#title-new').tap();
    await touch.locator('#top-edge').tap();assert.equal(await visible(touch,'.topbar'),true);
    await touch.locator('#relationships').tap();assert.ok(await touch.locator('#modal').evaluate(e=>e.open));await touch.locator('#close-modal').tap();
    await touch.locator('#advance').tap();assert.equal(await visible(touch,'.topbar'),false);
    await touch.locator('#bottom-edge').tap();assert.equal(await visible(touch,'.toolbar'),true);
    await touch.locator('#save').tap();assert.ok(await touch.locator('#modal').evaluate(e=>e.open));
    await touch.close();
    console.log('Immersive controls: hover, keyboard, touch, unchanged layout, edge-to-edge CG, fullscreen entry/exit and denied-request fallback passed.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
