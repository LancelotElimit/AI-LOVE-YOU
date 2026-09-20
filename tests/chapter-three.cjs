const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const {pathToFileURL} = require('node:url');
const {chromium} = require('C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..'), key = 'tokenia.chapter1.v1';
const generated = path.join(root, 'story/chapters/common.generated.js');
const before = fs.readFileSync(generated, 'utf8');
execFileSync(process.execPath, ['tools/build-common.cjs'], {cwd:root});
assert.equal(fs.readFileSync(generated, 'utf8'), before, 'Rebuilding must retain published passage IDs');
const scope = {window:{}};vm.createContext(scope);
for (const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="([^"]+)"/g)) {
  if(file==='game.js'||file.startsWith('assets/'))continue;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),scope,{filename:file});
}
const {STORY,SCENES,SCORES}=scope.window, cast=['chatgpt','claude','gemini','deepseek','grok'];
const nodes=Object.values(STORY).filter(n=>n.chapter===3), covered=new Set();
const eligible=(n,s)=>(n.when||[]).every(c=>(!c.flag||s.flags.includes(c.flag))&&(!c.notFlag||!s.flags.includes(c.notFlag)));
const fresh=node=>({state:{version:1,node,playerName:'林澈',tokens:10000,route:'claude',affinity:{chatgpt:10,claude:0,gemini:0,deepseek:0,grok:10},intent:'home',flags:['c2-slot1:chatgpt','c2-slot2:grok','award:c2-07A','award:c2-09E'],history:[],finished:!!STORY[node].end},date:Date.now()});
for(const morning of cast)for(const afternoon of cast)for(const answer of [0,1]) {
  const state=fresh('c3.01.0').state;let id=state.node,steps=0,slots=0;
  while(id) {
    assert.ok(++steps<600,'Traversal loop');const node=STORY[id];if(node.chapter>3)break;
    if(!eligible(node,state)){id=node.next;continue;}
    covered.add(id);assert.ok(SCENES[node.bg],node.id);
    assert.ok(node.music==='silence'||SCORES[node.music],node.id);
    assert.ok(!/若第三章|玩家选项|汇合：/.test(node.text),node.id);
    if(node.award&&!state.flags.includes(`award:${node.award.id}`)) {
      state.affinity[node.award.to]+=node.award.amount;state.flags.push(`award:${node.award.id}`);
    }
    if(node.choices) {
      const choice=node.choices[node.choices.length===5?cast.indexOf(++slots===1?morning:afternoon):answer];
      assert.ok(STORY[choice.to]);state.flags.push(choice.flag);id=choice.to;
    } else id=node.end?node.continueTo:node.next;
  }
  assert.equal(slots,2);assert.equal(state.route,'claude');
  for(const who of cast)assert.equal(state.affinity[who],10*(Number(who==='chatgpt')+Number(who==='grok')+Number(who===morning)+Number(who===afternoon)));
}
assert.equal(covered.size,nodes.length,'All third-chapter passages reachable');
const star=nodes.find(n=>n.shift?.name==='星图'),meteor=nodes.find(n=>n.shift?.name==='流星');
assert.equal(star.sprite,'gemini_starmap_star_cape_calm');assert.match(star.text,/披肩/);
assert.equal(meteor.sprite,'gemini_meteor_white_jacket_calm');assert.match(meteor.text,/收回/);
for(const bg of Object.values(SCENES).filter(s=>s.image))assert.ok(fs.existsSync(path.join(root,bg.image)),bg.image);
for(const bg of ['ch03_old_street_day','ch03_bookstall_day','ch03_old_bridge_evening']) {
  assert.equal(SCENES[bg].image,`assets/scene/bg/bg_${bg}.png`);
  assert.equal(SCENES[bg].placeholder,false,`${bg} must use the supplied artwork`);
}
for(const node of nodes.filter(n=>n.section!=='11A'&&Number(n.section.slice(0,2))>=3&&Number(n.section.slice(0,2))<=11)) {
  assert.ok(node.bg.startsWith('ch03_'),`${node.id} must stay outside campus`);
}
console.log(`Chapter 3: 50 branch combinations, ${covered.size} reachable passages, affection retained, stable rebuild.`);

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:960}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>{if(r.failure().errorText!=='net::ERR_ABORTED')errors.push(r.url());});
  await page.addInitScript(key=>{
    localStorage.setItem(key+'.settings',JSON.stringify({sound:false,speed:0,reduceMotion:true}));
    const seed=sessionStorage.getItem('ch3-seed');if(seed){localStorage.setItem(key+'.autosave',seed);sessionStorage.removeItem('ch3-seed');}
    Element.prototype.requestFullscreen=async()=>{};
  },key);
  const seed=async entry=>{
    await page.evaluate(entry=>sessionStorage.setItem('ch3-seed',JSON.stringify(entry)),entry);
    await page.reload();await page.locator('#title-continue').click();
  };
  try {
    await page.goto(pathToFileURL(path.join(root,'index.html')).href);
    const previousEnd=Object.values(STORY).find(n=>n.chapter===2&&n.end).id;
    for(const [morning,afternoon,answer] of [[0,0,0],[1,1,1],[2,2,0],[3,3,1],[4,4,0],[0,3,1],[2,1,1]]) {
      await seed(fresh(previousEnd));await page.locator('#end-continue').click();
      const result=await page.evaluate(({morning,afternoon,answer,key})=>{
        let slots=0;
        for(let i=0;i<600;i++) {
          const state=JSON.parse(localStorage.getItem(key+'.autosave')).state;
          if(state.finished)return {state,slots};
          const choices=document.querySelector('#choices');
          if(!choices.classList.contains('hidden')) {
            const buttons=[...choices.querySelectorAll('button')];
            buttons[buttons.length===5?(++slots===1?morning:afternoon):answer].click();
          } else document.querySelector('#advance').click();
        }throw Error('Chapter 3 did not finish');
      },{morning,afternoon,answer,key});
      assert.equal(STORY[result.state.node].chapter,3);assert.equal(result.slots,2);assert.equal(result.state.route,'claude');
      for(const [i,who] of cast.entries())assert.equal(result.state.affinity[who],10*(Number(i===0)+Number(i===4)+Number(i===morning)+Number(i===afternoon)));
      assert.equal(await page.locator('#end-continue').count(),1);assert.match(await page.locator('.end-teaser').textContent(),/没有人申请过的权限/);
      await page.reload();await page.locator('#title-continue').click();assert.ok(await page.locator('#ending').isVisible());
    }
    fs.mkdirSync(path.join(root,'qa'),{recursive:true});
    for(const node of [star,meteor,nodes.find(n=>n.choices?.length===5),nodes.find(n=>n.section==='07B')]) {
      const entry=fresh(node.id);entry.state.flags.push(...(node.when||[]).map(c=>c.flag).filter(Boolean));
      await seed(entry);await page.locator('#backdrop img').evaluate(img=>img.decode());
      assert.equal(await page.locator('#backdrop img').getAttribute('src'),SCENES[node.bg].image);
      if(node.char)await page.locator('#character').evaluate(img=>img.decode());
      for(const [width,height] of [[1440,960],[390,844],[360,640],[844,390]]) {
        await page.setViewportSize({width,height});
        const overflow=await page.evaluate(()=>[...document.querySelectorAll('.dialogue-area,.choices,.title-edition')].filter(el=>el.checkVisibility()).filter(el=>{
          const r=el.getBoundingClientRect();return r.left<-.5||r.right>innerWidth+.5||el.scrollWidth>el.clientWidth+2;
        }).map(el=>el.className));assert.deepEqual(overflow,[]);
        await page.screenshot({path:path.join(root,`qa/ch3-${node.id}-${width}.png`)});
      }
      const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key+'.autosave')).state,key);
      await page.reload();await page.locator('#title-continue').click();
      assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key+'.autosave')).state,key),saved);
    }
    assert.deepEqual(errors,[]);
    console.log('Browser: chapter 2 continuation, five heroines, mixed visits, model changes, save/resume, four viewport sizes passed.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
