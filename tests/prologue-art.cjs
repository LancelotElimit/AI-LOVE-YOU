const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
    Element.prototype.requestFullscreen=()=>Promise.resolve();
    localStorage.setItem('tokenia.chapter1.v1.settings',JSON.stringify({speed:0,sound:false,reduceMotion:false}));
    const state={version:1,node:'arrival.13',playerName:'旅人',route:null,tokens:10000,intent:null,affinity:{chatgpt:0,claude:0,gemini:0,deepseek:0,grok:0},flags:[],history:[],finished:false};
    localStorage.setItem('tokenia.chapter1.v1.autosave',JSON.stringify({state,date:Date.now()}));
  });
  try {
    await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);await page.locator('#title-continue').click();
    await page.locator('#character').evaluate(i=>i.decode());assert.equal(await page.locator('#character').isVisible(),true);
    await page.locator('#backdrop img').evaluate(i=>i.decode());assert.match(await page.locator('#backdrop img').getAttribute('src'),/outer_ring_repair/);
    await page.locator('#advance').click();
    assert.equal(await page.locator('#character').isVisible(),false);
    assert.equal(await page.locator('#character-wrap').evaluate(e=>getComputedStyle(e).visibility),'hidden');
    await page.waitForTimeout(100);assert.equal(await page.locator('#character').isVisible(),false);
    await page.screenshot({path:path.resolve(__dirname,'../qa/prologue-narration-clean.png')});
    await page.locator('#advance').click();await page.locator('#character').evaluate(i=>i.decode());assert.equal(await page.locator('#character').isVisible(),true);
    await page.evaluate(()=>{for(let i=0;i<100;i++){if(!document.querySelector('#choices').classList.contains('hidden'))return;document.querySelector('#advance').click();}throw Error('No choice');});
    await page.waitForTimeout(100);assert.equal(await page.locator('#character').isVisible(),false);
    assert.equal(await page.locator('#character-wrap').evaluate(e=>getComputedStyle(e).opacity),'0');
    await page.locator('.choice').first().click();await page.locator('#character').evaluate(i=>i.decode());
    assert.equal(await page.locator('#character').isVisible(),true);assert.match(await page.locator('#character').getAttribute('src'),/chatgpt/);
    await page.evaluate(async()=>{for(const id of ['room','transit','campus']){if(!SCENES[id].image)throw Error(id);const i=new Image();i.src=SCENES[id].image;await i.decode();}});
    assert.deepEqual(errors,[]);console.log('Prologue backgrounds load; narration and choice leave no empty image frame; rapid switching retains correct sprite.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
