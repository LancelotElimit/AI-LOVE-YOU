const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {clickControl}=require('./controls.cjs');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try {
    await page.clock.install();
    await page.addInitScript(()=>{
      const key='tokenia.chapter1.v1';localStorage.setItem(key+'.settings',JSON.stringify({sound:false,speed:0,reduceMotion:true}));
      Element.prototype.requestFullscreen=()=>Promise.resolve();
      const state={version:1,node:'c2.11.0',playerName:'旅人',tokens:10000,route:'deepseek',affinity:{chatgpt:0,claude:0,gemini:0,deepseek:0,grok:0},intent:'home',flags:[],history:[],finished:false};
      localStorage.setItem(key+'.autosave',JSON.stringify({state,date:Date.now()}));
    });
    await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
    await page.locator('.title-slide').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
    assert.equal(await page.locator('.title-slide').count(),5);
    const first=await page.locator('.title-slide.current').getAttribute('src');
    await page.clock.runFor(10000);assert.match(await page.locator('.title-slide.current').getAttribute('src'),/claude/);
    await page.clock.runFor(40000);assert.equal(await page.locator('.title-slide.current').getAttribute('src'),first);
    await page.screenshot({path:path.resolve(__dirname,'../qa/title-slideshow.png')});
    await page.locator('#title-continue').click();
    await clickControl(page,'toggle-dialogue');await page.mouse.move(700,400);
    assert.equal(await page.locator('#advance').isVisible(),false);
    assert.equal(await page.locator('#restore-dialogue').isVisible(),true);
    const node=await page.evaluate(()=>JSON.parse(localStorage.getItem('tokenia.chapter1.v1.autosave')).state.node);
    await page.clock.runFor(10000);assert.equal(await page.locator('.title-slide.current').getAttribute('src'),first);
    await page.screenshot({path:path.resolve(__dirname,'../qa/dialogue-hidden.png')});
    await page.locator('#restore-dialogue').click({position:{x:300,y:200}});
    assert.equal(await page.locator('#advance').isVisible(),true);
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('tokenia.chapter1.v1.autosave')).state.node),node);
    await page.setViewportSize({width:390,height:844});await clickControl(page,'toggle-dialogue');await clickControl(page,'toggle-dialogue');
    assert.equal(await page.locator('#advance').isVisible(),true);
    const overflow=await page.locator('.toolbar').evaluate(e=>e.scrollWidth>e.clientWidth);assert.equal(overflow,false);
    await clickControl(page,'home');await page.clock.runFor(10000);assert.match(await page.locator('.title-slide.current').getAttribute('src'),/claude/);
    assert.deepEqual(errors,[]);console.log('Five-image 10s loop, pause outside title, dialogue hide/restore without advancing, mobile toolbar: passed.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
