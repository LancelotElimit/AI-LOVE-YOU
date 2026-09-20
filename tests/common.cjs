const {clickControl}=require('./controls.cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {pathToFileURL} = require('node:url');
const deps = 'C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const {chromium} = require(deps+'playwright');
const sharp = require(deps+'sharp');
const root = path.resolve(__dirname,'..'),key='tokenia.chapter1.v1';
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const scope = {window:{}};vm.createContext(scope);
for (const [,file] of html.matchAll(/<script defer src="([^"]+)"/g)) {
  if (file === 'game.js' || file.startsWith('assets/')) continue;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),scope,{filename:file});
}
const {STORY,SCENES,SCORES}=scope.window,cast=['chatgpt','claude','gemini','deepseek','grok'];
const eligible=(node,state)=>(node.when||[]).every(c=>(!c.route||state.route===c.route)&&(!c.notRoute||state.route!==c.notRoute)&&(!c.flag||state.flags.includes(c.flag))&&(!c.notFlag||!state.flags.includes(c.notFlag)));
const fresh=(route='deepseek',node='last.5')=>({state:{version:1,node,playerName:'林澈',tokens:10000,route,affinity:Object.fromEntries(cast.map(id=>[id,0])),intent:'home',flags:[],history:[],finished:node==='last.5'},date:Date.now()});
const covered=new Set();
for (const node of Object.values(STORY)) {
  assert.ok(SCENES[node.bg],node.id);
  assert.ok(node.end||node.next||node.choices,`Dead end ${node.id}`);
  for (const next of [node.next,node.continueTo,...(node.choices||[]).map(c=>c.to)].filter(Boolean)) assert.ok(STORY[next],`${node.id} -> ${next}`);
  if (node.music) assert.ok(node.music==='silence'||SCORES[node.music],node.music);
  if (node.sprite?.includes('_')) assert.ok(fs.existsSync(path.join(root,`assets/${node.char}/${node.sprite}.png`)));
  if (node.chapter) assert.ok(!/上午来过的话|没来过的话|若序章|分支汇合|玩家选项/.test(node.text));
}
for (const witness of cast) for(const morning of cast) for(const afternoon of cast) for(const answer of [0,1]) {
  const state=fresh(witness).state;let id='c1.01.0',steps=0,slots=0;
  while(id) {
    assert.ok(++steps<1500,'Traversal loop');const node=STORY[id];if(node.chapter>2)break;
    if (!eligible(node,state)){id=node.next;continue;}
    covered.add(id);
    if(node.award&&!state.flags.includes(`award:${node.award.id}`)){state.affinity[node.award.to]+=node.award.amount;state.flags.push(`award:${node.award.id}`);}
    if (node.choices) {
      const choice=node.choices.length===5 ? node.choices[cast.indexOf(++slots===1?morning:afternoon)] : node.choices[answer];
      state.flags.push(choice.flag);id=choice.to;
    } else id=node.end?node.continueTo:node.next;
  }
  assert.equal(slots,2);assert.equal(state.route,witness);
  for(const heroine of cast) assert.equal(state.affinity[heroine],10*Number(heroine===morning)+10*Number(heroine===afternoon));
}
const commonNodes=Object.values(STORY).filter(n=>n.chapter&&n.chapter<=2);
assert.equal(covered.size,commonNodes.length,'Every common passage must be reachable across legitimate choices');
const cgs=[...new Set([...covered].map(id=>STORY[id].bg).filter(bg=>SCENES[bg].cg))];
assert.equal(cgs.length,13);
console.log(`250 complete route combinations: ${covered.size} passages, 13 CGs, isolated affection, two free periods.`);
async function seed(page,entry) {
  await page.evaluate(entry=>sessionStorage.setItem('common-test-seed',JSON.stringify(entry)),entry);
  await page.reload();await page.locator('#title-continue').click();
}
async function layout(page) {
  const bad=await page.evaluate(()=>[...document.querySelectorAll('.topbar,.dialogue-area,.choices,.ending,#modal')].filter(el=>el.checkVisibility()&&(el.tagName!=='DIALOG'||el.open)).filter(el=>{
    const r=el.getBoundingClientRect();return r.left<-.5||r.right>innerWidth+.5||el.scrollWidth>el.clientWidth+2;
  }).map(el=>el.id||el.className));assert.deepEqual(bad,[]);
}
async function readState(page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key+'.autosave')).state,key);}
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:960}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>{if(r.failure().errorText!=='net::ERR_ABORTED')errors.push(r.url()+': '+r.failure().errorText);});
  await page.addInitScript(key=>{
    localStorage.setItem(key+'.settings',JSON.stringify({sound:false,speed:0,reduceMotion:true}));
    const entry=sessionStorage.getItem('common-test-seed');if(entry){localStorage.setItem(key+'.autosave',entry);sessionStorage.removeItem('common-test-seed');}
  },key);
  await page.addInitScript(()=>{window.testOscillators=0;const create=AudioContext.prototype.createOscillator;AudioContext.prototype.createOscillator=function(...args){window.testOscillators++;return create.apply(this,args);};});
  try {
    await page.goto(pathToFileURL(path.join(root,'index.html')).href);
    for (const [morning,afternoon,answer] of [[0,0,0],[0,0,1],[1,1,1],[2,2,0],[3,3,1],[4,4,0],[1,3,0]]) {
      await seed(page,fresh());
      await page.locator('#end-continue').click();assert.equal((await readState(page)).node,'c1.01.0');
      const result=await page.evaluate(({morning,afternoon,answer,key})=>{
        let slots=0;const chapters=[];
        for(let i=0;i<1000;i++) {
          const save=JSON.parse(localStorage.getItem(key+'.autosave')).state;
          if(save.finished){const chapter=STORY[save.node].chapter;chapters.push(chapter);const next=document.querySelector('#end-continue');if(next&&chapter<2){next.click();continue;}return {save,slots,chapters};}
          const choices=[...document.querySelectorAll('#choices button')];
          if(!document.querySelector('#choices').classList.contains('hidden')) choices[choices.length===5?(++slots===1?morning:afternoon):answer].click();
          else document.querySelector('#advance').click();
        }throw Error('Could not finish chapters');
      },{morning,afternoon,answer,key});
      assert.deepEqual(result.chapters,[1,2]);assert.equal(result.slots,2);assert.equal(result.save.route,'deepseek');
      for(let i=0;i<cast.length;i++)assert.equal(result.save.affinity[cast[i]],10*Number(i===morning)+10*Number(i===afternoon));
      assert.ok(result.save.history.some(h=>h.who==='attendant'));
      await page.reload();await page.locator('#title-continue').click();assert.ok(await page.locator('#ending').isVisible());assert.equal(await page.locator('#end-continue').count(),1);
    }
    fs.mkdirSync(path.join(root,'qa'),{recursive:true});
    const shots = [
      ['common-sol',commonNodes.find(n=>n.shift).id],
      ['common-five-choices',commonNodes.find(n=>n.choices?.length===5).id],
      ['common-gpt-cg',commonNodes.find(n=>n.bg==='ch02_chatgpt_tea_break').id],
      ['common-rain-cg',commonNodes.find(n=>n.bg==='ch02_five_girls_under_eaves').id]
    ];
    for(const [name,id] of shots) {
      const entry=fresh('deepseek',id);entry.state.flags=['c2-slot1:chatgpt'];await seed(page,entry);
      const expected=STORY[id];assert.equal(await page.locator('#game').getAttribute('data-bgm'),expected.music);
      if(SCENES[expected.bg].cg)assert.ok(await page.locator('#character-wrap').evaluate(el=>el.classList.contains('empty')));
      await page.locator('#backdrop img').evaluate(img=>img.decode());
      if(expected.char)await page.locator('#character').evaluate(img=>img.decode());
      for(const [width,height] of [[1440,960],[390,844],[360,640],[844,390]]) {
        await page.setViewportSize({width,height});await layout(page);await page.screenshot({path:path.join(root,`qa/${name}-${width}.png`)});
      }
      const before=await readState(page);await page.reload();await page.locator('#title-continue').click();assert.deepEqual(await readState(page),before);
    }
    await page.setViewportSize({width:390,height:844});await clickControl(page,'relationships');
    assert.equal(await page.locator('.relationship-row').count(),5);await layout(page);await page.screenshot({path:path.join(root,'qa/common-relationships.png')});await page.locator('#close-modal').click();
    for(const bg of Object.values(SCENES).filter(s=>s.image)) {
      const {data,info}=await sharp(path.join(root,bg.image)).resize(32,32).removeAlpha().raw().toBuffer({resolveWithObject:true});
      let min=255,max=0;for(const byte of data){min=Math.min(min,byte);max=Math.max(max,byte);}assert.ok(max-min>30,bg.image+' is blank');assert.equal(info.channels,3);
    }
    const night=commonNodes.find(n=>n.chapter===1&&n.section==='10'&&n.music==='B05');
    await seed(page,fresh('deepseek',night.id));await clickControl(page,'sound');await page.waitForTimeout(1200);
    assert.ok(await page.evaluate(()=>window.testOscillators>4),'Scene music should schedule notes');
    await page.evaluate(()=>{for(let i=0;i<15;i++){document.querySelector('#advance').click();if(document.querySelector('#game').dataset.bgm==='silence')return;}throw Error('Missing silence cue');});
    const silentCount=await page.evaluate(()=>window.testOscillators);await page.waitForTimeout(1200);
    assert.equal(await page.evaluate(()=>window.testOscillators),silentCount,'Silence must stop new music notes');
    await clickControl(page,'sound');assert.equal(await page.locator('#sound').getAttribute('aria-label'),'开启声音');
    assert.deepEqual(errors,[]);
    console.log('Browser: old-save continuation, chapter transitions, all heroines, repeated/mixed visits, save/resume, affection panel, images, four viewport sizes, scene music and silence passed.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
