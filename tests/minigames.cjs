const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {pathToFileURL}=require('node:url');
const runtime='C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const {chromium}=require(runtime+'playwright');
const sharp=require(runtime+'sharp');
const root=path.resolve(__dirname,'..'),key='tokenia.chapter1.v1',scope={window:{}};
vm.createContext(scope);
for(const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="([^"]+)"/g)){
  if(file==='game.js'||file.startsWith('assets/'))continue;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),scope);
}
const {STORY,STORY_ACTIVITIES:api}=scope.window;
const entries=Object.entries(api.activities).map(([id,config])=>({id,config,node:Object.values(STORY).find(n=>n.activity===id)}));
assert.equal(entries.length,3);
assert.equal(entries[0].node.chapter,undefined);
assert.equal(entries[1].node.chapter,2);
assert.equal(entries[2].node.chapter,3);
let s=api.initial('parts');s=api.move('parts',s,{type:'select',value:0}).state;
assert.equal(api.move('parts',s,{type:'slot',value:1}).state.placed.length,0);
for(const [i,shape] of [0,1,2,1,0,2].entries()){
  s=api.move('parts',s,{type:'select',value:i}).state;
  const result=api.move('parts',s,{type:'slot',value:shape});s=result.state;
  assert.equal(result.done,i===5);
}
s=api.initial('potatoes');assert.equal(api.move('potatoes',s,{value:1}).state.cells[1],2);
for(const i of [0,2,3,5,6,8]){s=api.move('potatoes',s,{value:i}).state;s=api.move('potatoes',s,{value:i}).state;}
assert.equal(api.move('potatoes',s,{value:1}).done,true);
s=api.initial('route');assert.equal(api.move('route',s,{value:1}).state.path.length,1);
assert.equal(api.move('route',s,{value:15}).state.path.length,1);
s=api.move('route',s,{value:4}).state;s=api.move('route',s,{value:0}).state;assert.deepEqual(Array.from(s.path),[0]);
for(const i of [4,8,9,10,14,15])s=api.move('route',s,{value:i}).state;
assert.equal(s.path.at(-1),15);
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>errors.push(r.url()));
  await page.addInitScript(key=>{
    localStorage.setItem(key+'.settings',JSON.stringify({sound:false,speed:0,reduceMotion:true}));
    const seed=sessionStorage.getItem('activity-seed');if(seed)localStorage.setItem(key+'.autosave',seed);
    Element.prototype.requestFullscreen=async()=>{};
  },key);
  async function saved(){return page.evaluate(key=>JSON.parse(localStorage.getItem(key+'.autosave')).state,key);}
  async function seed(node){
    await page.evaluate(node=>sessionStorage.setItem('activity-seed',JSON.stringify({date:Date.now(),state:{version:1,node:node.id,playerName:'林澈',tokens:10000,route:node.chapter?'gemini':null,personalRoute:null,transactions:[],affinity:{chatgpt:0,claude:0,gemini:0,deepseek:0,grok:0},intent:null,flags:(node.when||[]).filter(c=>c.flag).map(c=>c.flag),history:[],finished:false}})),node);
    await page.reload();await page.locator('#title-continue').click();assert.ok(await page.locator('#story-activity').isVisible());
  }
  async function layout(){
    assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('.activity-board,.activity-actions,.activity-intro,#modal,#story-activity')].filter(e=>e.checkVisibility()).filter(e=>{const r=e.getBoundingClientRect();return e.scrollWidth>e.clientWidth+2||r.left<0||r.right>innerWidth;}).map(e=>e.className)),[]);
  }
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});
  try{
    await page.goto(pathToFileURL(path.join(root,'index.html')).href);
    for(const size of [{width:1440,height:960},{width:390,height:844},{width:360,height:640}]){
      await page.setViewportSize(size);
      for(const {id,node,config} of entries){
        await seed(node);const before=await saved();await layout();
        await page.evaluate(()=>document.querySelector('#auto').click());
        assert.equal(await page.locator('#auto').getAttribute('aria-pressed'),'false');
        // Optional passage continuation remains compatible with existing story playback.
        await page.locator('#advance').click();assert.notEqual((await saved()).node,node.id);
        assert.ok(!(await saved()).flags.some(f=>f.startsWith('activity:')));
        await seed(node);await page.locator('#story-activity').click();await layout();
        assert.equal(await page.locator('.activity [data-lucide]:not(svg)').count(),0,'Every game icon must render');
        assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('.activity-board button')].filter(b=>b.scrollHeight>b.clientHeight+2||b.scrollWidth>b.clientWidth+2).map(b=>b.getAttribute('aria-label'))),[],'Tile labels must fit');
        const capture=path.join(root,`qa/activity-${id}-${size.width}.png`);await page.screenshot({path:capture});
        assert.ok((await sharp(capture).stats()).channels.some(c=>c.stdev>20));
        await page.locator('#close-modal').click();assert.equal((await saved()).node,node.id);
        await page.locator('#story-activity').click();
        const first=page.locator('.activity-board button').first();await first.focus();await page.keyboard.press('Enter');
        assert.ok(await page.locator('#modal').evaluate(e=>e.open));assert.equal((await saved()).node,node.id);
        await page.locator('.activity-reset').click();
        if(id==='parts'){
          await page.locator('.part-piece').first().click();await page.locator('.part-slot').nth(1).click();assert.match(await page.locator('.activity-response').textContent(),/别硬塞/);
          for(const [i,shape] of [0,1,2,1,0,2].entries()){await page.locator('.part-piece').nth(i).click();await page.locator('.part-slot').nth(shape).click();}
        }else if(id==='potatoes'){
          await page.locator('.field-cell').nth(1).click();assert.match(await page.locator('.activity-response').textContent(),/还小/);
          for(const i of [0,2,3,5,6,8]){await page.locator('.field-cell').nth(i).click();await page.locator('.field-cell').nth(i).click();}
        }else{
          await page.locator('.route-cell').nth(1).click();assert.match(await page.locator('.activity-response').textContent(),/围栏/);
          await page.locator('.route-cell').nth(15).click();assert.match(await page.locator('.activity-response').textContent(),/中间/);
          for(const i of [4,8,9,10,14,15])await page.locator('.route-cell').nth(i).click();
        }
        assert.equal(await page.locator('.activity-response').textContent(),config.success);
        const after=await saved();assert.equal(after.tokens,before.tokens);assert.deepEqual(after.affinity,before.affinity);
        assert.equal(after.flags.filter(f=>f===`activity:${id}:complete`).length,1);assert.equal(after.history.filter(h=>h.text===config.success).length,1);
        await layout();await page.locator('#modal').getByRole('button',{name:'继续剧情',exact:true}).click();assert.notEqual((await saved()).node,node.id);
        // Reloading completed activity never grants or repeats a result.
        await page.evaluate(({key,state})=>sessionStorage.setItem('activity-seed',JSON.stringify({date:Date.now(),state})),{key,state:after});
        await page.reload();await page.locator('#title-continue').click();assert.ok(await page.locator('#story-activity').isHidden());
        await seed(node);await page.locator('#story-activity').click();await page.getByRole('button',{name:'交给她，继续剧情',exact:true}).click();
        assert.equal(await page.locator('.activity-response').textContent(),config.skip);assert.equal((await saved()).tokens,10000);
        assert.deepEqual((await saved()).affinity,before.affinity);await page.locator('#modal').getByRole('button',{name:'继续剧情',exact:true}).click();
        assert.notEqual((await saved()).node,node.id);
      }
    }
    assert.deepEqual(errors,[]);
    console.log('Three optional story activities: puzzle rules, mistakes, reset, keyboard, skip, no route/economy penalties, saved outcomes and nine desktop/mobile views passed.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
