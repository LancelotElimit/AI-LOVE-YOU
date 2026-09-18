const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {pathToFileURL} = require('node:url');
let playwright;
try { playwright=require('playwright'); } catch { playwright=require('C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const root=path.resolve(__dirname,'..');
const url=pathToFileURL(path.join(root,'index.html')).href;
const key='tokenia.chapter1.v1';
const routes=['chatgpt','claude','gemini','deepseek','grok'];
const storyFiles=['story/core.js','story/chapters/opening.js','story/chapters/chatgpt.js','story/chapters/claude.js','story/chapters/gemini.js','story/chapters/deepseek.js','story/chapters/grok.js','story/chapters/chapter-finale.js','story/routes.js'];
const scope={window:{}};vm.createContext(scope);for(const file of storyFiles)vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),scope,{filename:file});
const nodes=scope.window.STORY;
for(const node of Object.values(nodes)){
  if(node.next)assert.ok(nodes[node.next],`Missing next from ${node.id}`);
  for(const choice of node.choices||[])assert.ok(nodes[choice.to],`Missing choice from ${node.id}`);
  assert.ok(node.end||node.next||node.choices,`Dead end ${node.id}`);
}
const reachable=new Set();function visit(id){if(reachable.has(id))return;reachable.add(id);const node=nodes[id];if(node.next)visit(node.next);for(const c of node.choices||[])visit(c.to);}visit('intro.0');assert.equal(reachable.size,Object.keys(nodes).length);
console.log(`Story graph: ${reachable.size} reachable passages, no broken links.`);
async function fresh(page){
  await page.goto(url);
  await page.evaluate(()=>sessionStorage.setItem('test-reset','1'));
  await page.reload();
  await page.locator('#title-new').click();
}
async function state(page){return page.evaluate(k=>JSON.parse(localStorage.getItem(k+'.autosave')).state,key);}
async function untilChoice(page){
  for(let attempt=0;attempt<3;attempt++){
    const stop=await page.evaluate(()=>{for(let i=0;i<300;i++){if(!document.querySelector('#station-screen').classList.contains('hidden'))return 'name';if(!document.querySelector('#choices').classList.contains('hidden'))return 'choice';document.querySelector('#advance').click();}throw Error('No choice reached');});
    if(stop==='choice')return;
    await page.locator('#player-name').fill('林澈');await page.locator('#station-submit').click();await page.waitForFunction(()=>document.querySelector('#station-screen').classList.contains('hidden'));
  }
  throw Error('Unable to pass name registration');
}
async function advanceToEnd(page,choiceIndex){return page.evaluate(choiceIndex=>{
  for(let i=0;i<300;i++){
    if(!document.querySelector('#ending').classList.contains('hidden'))return;
    const choices=document.querySelector('#choices');
    if(!choices.classList.contains('hidden'))choices.querySelectorAll('button')[choiceIndex].click();else document.querySelector('#advance').click();
  }throw Error('End not reached');
},choiceIndex);}
async function assertNoOverflow(page){
  const results=await page.evaluate(()=>{
    const bad=[];
    for(const selector of ['.topbar','.dialogue-area','.toolbar','.choices','.ending','#modal']){
      const el=document.querySelector(selector);if(el.classList.contains('hidden')||selector==='#modal'&&!el.open)continue;
      const r=el.getBoundingClientRect();if(r.left<-.5||r.right>innerWidth+.5)bad.push(selector+' outside viewport');
      if(el.scrollWidth>el.clientWidth+2)bad.push(selector+' horizontal overflow');
    }
    return bad;
  });assert.deepEqual(results,[]);
}
(async()=>{
  const browser=await playwright.chromium.launch({channel:'msedge',headless:true});
  const context=await browser.newContext({viewport:{width:1440,height:960}});
  const page=await context.newPage();
  await page.addInitScript(()=>{window.testOscillators=0;const create=AudioContext.prototype.createOscillator;AudioContext.prototype.createOscillator=function(...args){window.testOscillators++;return create.apply(this,args);};});
  await page.addInitScript(k=>{if(sessionStorage.getItem('test-reset')){localStorage.clear();localStorage.setItem(k+'.settings',JSON.stringify({sound:false,speed:0,reduceMotion:true}));sessionStorage.removeItem('test-reset');}},key);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const failed=[];page.on('requestfailed',r=>failed.push(r.url()));
  const qa=path.join(root,'qa');fs.mkdirSync(qa,{recursive:true});
  try{
    for(let r=0;r<routes.length;r++)for(let choiceIndex=0;choiceIndex<2;choiceIndex++){
      await fresh(page);await untilChoice(page);
      if(r===0&&choiceIndex===0){await assertNoOverflow(page);await page.screenshot({path:path.join(qa,'desktop-choices.png')});}
      await page.locator('.choice').nth(r).click();
      await page.locator('#character').evaluate(img=>img.decode());
      if(choiceIndex===0){
        await assertNoOverflow(page);await page.screenshot({path:path.join(qa,`desktop-${routes[r]}.png`)});
        if(r===1){
          await page.setViewportSize({width:390,height:844});await assertNoOverflow(page);await page.screenshot({path:path.join(qa,'mobile-claude.png')});
          await page.setViewportSize({width:1440,height:960});
        }
      }
      await advanceToEnd(page,choiceIndex);const s=await state(page);
      assert.equal(s.route,routes[r]);assert.equal(s.finished,true);assert.equal(s.intent,choiceIndex?'explore':'home');
      const expected=10000;
      assert.equal(s.tokens,expected);
      assert.deepEqual(s.flags,[]);
      await assertNoOverflow(page);
      console.log(`${routes[r]} branch ${choiceIndex+1}: complete; balance ${s.tokens}; affinity ${s.affinity[s.route]}.`);
    }
    await page.screenshot({path:path.join(qa,'desktop-ending.png')});
    await page.setViewportSize({width:390,height:844});await assertNoOverflow(page);await page.screenshot({path:path.join(qa,'mobile-ending.png')});
    await page.setViewportSize({width:1440,height:960});await fresh(page);
    await page.locator('#save').click();await page.locator('.save-slot').nth(1).getByRole('button').click();await page.locator('#close-modal').click();
    await page.locator('#advance').click();assert.equal((await state(page)).node,'intro.1');
    await page.locator('#load').click();await page.locator('.save-slot').nth(1).getByRole('button').click();assert.equal((await state(page)).node,'intro.0');
    await page.locator('#advance').click();await page.reload();assert.equal((await state(page)).node,'intro.1');await page.locator('#title-continue').click();
    await page.locator('#settings').click();await page.locator('#restart-button').click();await page.locator('#restart-confirm').click();assert.equal((await state(page)).node,'intro.0');
    console.log('Manual save/load, automatic resume and restart: passed.');
    await page.locator('#skip').click();await page.waitForTimeout(250);assert.equal((await state(page)).node,'intro.1');assert.equal(await page.locator('#skip').getAttribute('aria-pressed'),'false');
    await page.locator('#settings').click();await page.locator('#setting-delay').fill('1');await page.locator('#setting-delay').dispatchEvent('input');await page.locator('#close-modal').click();
    await page.locator('#auto').click();await page.waitForTimeout(2500);assert.notEqual((await state(page)).node,'intro.1');await page.locator('#auto').click();
    await page.locator('#settings').click();await page.locator('#setting-speed').fill('65');await page.locator('#setting-speed').dispatchEvent('input');await page.locator('#close-modal').click();
    await page.locator('#advance').click();assert.ok(await page.locator('#advance').evaluate(el=>el.classList.contains('typing')));const typedNode=(await state(page)).node;
    await page.locator('#advance').click();assert.equal((await state(page)).node,typedNode);assert.equal(await page.locator('#advance').evaluate(el=>el.classList.contains('typing')),false);
    await page.locator('#settings').click();await page.locator('#setting-speed').fill('0');await page.locator('#setting-speed').dispatchEvent('input');await page.locator('#close-modal').click();
    await page.locator('#save').click();
    const downloadPromise=page.waitForEvent('download');await page.locator('#export-save').click();const download=await downloadPromise;const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
    assert.equal(exported.state.node,typedNode);await page.locator('#close-modal').click();await page.locator('#advance').click();
    await page.locator('#load').click();await page.locator('#import-file').setInputFiles({name:'save.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});await page.waitForFunction(()=>!document.querySelector('#modal').open);assert.equal((await state(page)).node,typedNode);
    await page.locator('#load').click();await page.locator('#import-file').setInputFiles({name:'broken.json',mimeType:'application/json',buffer:Buffer.from('{"state":{"node":"no-such-node"}}')});await page.waitForTimeout(150);assert.equal((await state(page)).node,typedNode);assert.ok(await page.locator('#modal').evaluate(el=>el.open));await page.locator('#close-modal').click();
    console.log('Read-only skip, autoplay, typewriter, exported/imported saves and malformed import: passed.');
    await untilChoice(page);
    for(const size of [{width:390,height:844},{width:360,height:640},{width:844,height:390}]){
      await page.setViewportSize(size);await assertNoOverflow(page);await page.screenshot({path:path.join(qa,`choices-${size.width}x${size.height}.png`)});
      const last=page.locator('.choice').last();await last.scrollIntoViewIfNeeded();assert.ok(await last.isVisible());
    }
    await page.setViewportSize({width:390,height:844});await page.locator('.choice').nth(3).click();await page.locator('#character').evaluate(img=>img.decode());
    await untilChoice(page);await assertNoOverflow(page);await page.screenshot({path:path.join(qa,'mobile-model-shift-choice.png')});
    await page.locator('#settings').click();await assertNoOverflow(page);await page.screenshot({path:path.join(qa,'mobile-settings.png')});await page.locator('#close-modal').click();
    await page.locator('#sound').click();await page.waitForTimeout(800);assert.equal(await page.locator('#sound').getAttribute('aria-label'),'关闭声音');assert.ok(await page.evaluate(()=>window.testOscillators>3),'Audio synthesis should create music and click oscillators');
    await page.locator('#sound').click();assert.equal(await page.locator('#sound').getAttribute('aria-label'),'开启声音');
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
    console.log('Responsive layouts, audio toggle, image loads: passed. No browser errors.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
