const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {pathToFileURL}=require('node:url');
const runtime='C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const {chromium}=require(runtime+'playwright');
const sharp=require(runtime+'sharp');
const root=path.resolve(__dirname,'..'),key='tokenia.chapter1.v1';
const scope={window:{}};vm.createContext(scope);
for(const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="([^"]+)"/g)){
  if(file==='game.js'||file.startsWith('assets/'))continue;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),scope);
}
const {STORY,SCENES}=scope.window;
let node=STORY['intro.0'];const opening=[];
while(!node.choices){assert.ok(!opening.includes(node),'No opening cycle');opening.push(node);assert.ok(node.next);node=STORY[node.next];}
assert.equal(node.id,'witness-choice.11');assert.equal(node.choices.length,5);
assert.ok(opening.length>130,'Separated encounters need space before choosing');
assert.equal(STORY['crossing.4'].next,'repair-morning.0');
assert.equal(STORY['repair-morning.0'].delivery,'DeepSeek 视角');
assert.equal(STORY['first-records.0'].delivery,'Claude 视角');
assert.equal(STORY['first-records.4'].delivery,'你的视角');
assert.ok(!opening.map(n=>n.text).join('\n').includes('剩下那个 Xeno'));
for(const n of Object.values(STORY).filter(n=>!n.chapter)){
  assert.ok(SCENES[n.bg],n.bg);
  if(SCENES[n.bg].cg)assert.equal(n.char,null,'No standing sprite pasted over a CG');
}
for(let i=0;i<8;i++){assert.equal(STORY['gemini.'+i].char,null);assert.equal(STORY['gemini.'+i].bg,'prologue_gemini_call');}
assert.equal(STORY['gemini.8'].char,'gemini');assert.equal(STORY['gemini.8'].bg,'transit');
const samples=['repair-morning.0','first-counter.1','first-call.3','first-records.0','first-headlines.3','gemini.8'];
const expectedExits=[['first-counter.5','first-counter.6'],['first-call.20','first-call.21'],['first-records.8','first-records.9'],['first-headlines.7','first-headlines.8']];
for(const [last,next] of expectedExits){assert.equal(STORY[last].next,next);assert.equal(STORY[next].bg,'transit');}
(async()=>{
  for(const id of samples.slice(0,5)){
    const asset=path.join(root,SCENES[STORY[id].bg].image);assert.ok(fs.existsSync(asset));
    const m=await sharp(asset).metadata();assert.ok(Math.abs(m.width/m.height-16/9)<.02);
  }
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>errors.push(r.url()));
  await page.addInitScript(key=>{
    localStorage.setItem(key+'.settings',JSON.stringify({sound:false,speed:0,reduceMotion:true}));
    const seed=sessionStorage.getItem('encounter-seed');if(seed)localStorage.setItem(key+'.autosave',seed);
    Element.prototype.requestFullscreen=async()=>{};
  },key);
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});
  try{
    await page.goto(pathToFileURL(path.join(root,'index.html')).href);
    for(const [width,height] of [[1440,960],[390,844]]){
      await page.setViewportSize({width,height});
      for(const id of samples){
        await page.evaluate(id=>sessionStorage.setItem('encounter-seed',JSON.stringify({date:Date.now(),state:{version:1,node:id,playerName:'林澈',tokens:10000,route:id.startsWith('gemini.')?'gemini':null,transactions:[],affinity:{chatgpt:0,claude:0,gemini:0,deepseek:0,grok:0},intent:null,flags:[],history:[],finished:false}})),id);
        await page.reload();await page.locator('#title-continue').click();
        await page.locator('#backdrop .scene-image').evaluate(img=>img.decode());
        assert.equal(await page.locator('#backdrop .scene-image').getAttribute('src'),SCENES[STORY[id].bg].image);
        if(STORY[id].char){await page.locator('#character').evaluate(img=>img.decode());await page.waitForFunction(()=>!document.querySelector('#character').hidden);}
        else assert.equal(await page.locator('#character').getAttribute('src'),null);
        if(STORY[id].delivery)assert.equal(await page.locator('#speaker-sub').textContent(),STORY[id].delivery);
        assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('#dialogue-area')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.id)),[]);
        await page.waitForFunction(()=>!document.querySelector('#toast').classList.contains('visible'));
        const file=path.join(root,`qa/prologue-encounter-${id}-${width}.png`);
        await page.screenshot({path:file});
        const stats=await sharp(file).stats();assert.ok(stats.channels.some(c=>c.stdev>20),'Nonblank artwork');
      }
    }
    assert.deepEqual(errors,[]);
    console.log(`Prologue encounters: ${opening.length} passages before choice, two character viewpoints, five work CGs, remote/physical Gemini distinction, CG exits and 12 desktop/mobile renders passed.`);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
