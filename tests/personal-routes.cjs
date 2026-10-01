const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),key='tokenia.chapter1.v1';
const generated=path.join(root,'story/chapters/personal.generated.js'),before=fs.readFileSync(generated,'utf8');
execFileSync(process.execPath,['tools/build-personal.cjs'],{cwd:root});
assert.equal(fs.readFileSync(generated,'utf8'),before,'Stable rebuild');
const scope={window:{}};vm.createContext(scope);
for(const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="([^"]+)"/g)){
  if(file==='game.js'||file.startsWith('assets/'))continue;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),scope);
}
const {STORY,PERSONAL_ROUTES,SCENES,SCORES}=scope.window,all=Object.values(STORY),covered=new Set(),endings=new Set();
const eligible=(n,s)=>!n.personalRoute||n.personalRoute===s.personalRoute&&(n.when||[]).every(c=>!c.flag||s.flags.includes(c.flag));
const choices=(n,s)=>(n.choices||[]).filter(c=>!c.requiresFlags||c.requiresFlags.every(flag=>s.flags.includes(flag)));
for(const route of Object.keys(PERSONAL_ROUTES)){
  const count=all.filter(n=>n.personalRoute===route&&n.choices&&!n.choices[0].requiresFlags&&n.choices[0].flag).length;
  for(let bits=0;bits<2**count;bits++){
    const s={personalRoute:route,flags:[]};let id=PERSONAL_ROUTES[route].entry,index=0,steps=0;
    while(id){
      assert.ok(++steps<800);const n=STORY[id];assert.ok(n,id);
      if(!eligible(n,s)){id=n.next;continue;}
      covered.add(id);assert.ok(SCENES[n.bg]);assert.ok(SCORES[n.music]);
      if(n.choices){
        if(!n.choices[0].flag){
          for(const choice of choices(n,s)){
            let end=choice.to;
            while(end){covered.add(end);const node=STORY[end];if(node.routeEnding){endings.add(`${route}:${node.routeEnding.key}`);break;}end=node.next;}
          }break;
        }
        const choice=n.choices[(bits>>index++)&1];s.flags.push(choice.flag);id=choice.to;
      }else id=n.end?n.continueTo:n.next;
    }
  }
}
assert.equal(covered.size,all.filter(n=>n.personalRoute).length,'Every authored passage must be reachable');
assert.equal(endings.size,16);
console.log(`Personal-route graph: ${covered.size} passages, 26 chapters, all 16 endings reachable, stable rebuild.`);

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:960}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(key=>{
    localStorage.setItem(key+'.settings',JSON.stringify({sound:false,speed:0,reduceMotion:true}));
    const seed=sessionStorage.getItem('personal-seed');if(seed){localStorage.setItem(key+'.autosave',seed);sessionStorage.removeItem('personal-seed');}
    Element.prototype.requestFullscreen=async()=>{};
  },key);
  const seed=async entry=>{await page.evaluate(e=>sessionStorage.setItem('personal-seed',JSON.stringify(e)),entry);await page.reload();await page.locator('#title-continue').click();};
  const fresh=(route,node,finished=false)=>({date:Date.now(),state:{version:1,node,playerName:'林澈',tokens:10000,route:'grok',personalRoute:route,transactions:[],affinity:{chatgpt:40,claude:40,gemini:40,deepseek:40,grok:40},intent:'home',flags:[],history:[],finished}});
  try{
    await page.goto(pathToFileURL(path.join(root,'index.html')).href);
    for(const [route,meta] of Object.entries(PERSONAL_ROUTES))for(const ending of Object.keys(meta.endings)){
      const letter=String.fromCharCode(65+Object.keys(PERSONAL_ROUTES).indexOf(route));
      const entry=all.find(n=>n.chapter===5&&n.section===`09${letter}`&&n.end);
      await seed(fresh(route,entry.id,true));
      assert.equal(await page.locator('#end-continue').count(),1);
      await page.locator('#end-continue').click();
      const result=await page.evaluate(({key,ending})=>{
        for(let i=0;i<1000;i++){
          const s=JSON.parse(localStorage.getItem(key+'.autosave')).state,n=STORY[s.node];
          if(s.finished){if(n.routeEnding)return s;document.querySelector('#end-continue').click();continue;}
          if(!document.querySelector('#choices').classList.contains('hidden')){
            const available=n.choices.filter(c=>!c.requiresFlags||c.requiresFlags.every(f=>s.flags.includes(f)));
            const index=available[0].flag?0:available.findIndex(c=>STORY[c.to].section===`END-${ending}`);
            if(index<0)throw Error('Ending locked unexpectedly');
            document.querySelectorAll('#choices button')[index].click();
          }else document.querySelector('#advance').click();
        }throw Error('Route did not finish');
      },{key,ending});
      assert.equal(STORY[result.node].routeEnding.key,ending);
      assert.equal(result.route,'grok');assert.equal(result.personalRoute,route);
      assert.equal(result.tokens,route==='deepseek'?10480:10000);
      assert.equal(await page.locator('#ending h2').textContent(),meta.endings[ending].title);
      assert.equal(await page.locator('#end-continue').count(),0);
      assert.match(await page.locator('.end-footer').textContent(),/个人线完/);
      await page.reload();await page.locator('#title-continue').click();
      assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key+'.autosave')).state,key),result);
    }
    for(const [route,meta] of Object.entries(PERSONAL_ROUTES)){
      const final=all.find(n=>n.personalRoute===route&&n.choices?.some(c=>c.requiresFlags));
      await seed(fresh(route,final.id));
      assert.equal(await page.locator('#choices button').count(),2,'Only normal/bad without key decisions');
      await page.locator('#choices button').first().click();
      assert.equal(STORY[JSON.parse(await page.evaluate(key=>localStorage.getItem(key+'.autosave'),key)).state.node].section,'END-NORMAL');
    }
    const wage=all.find(n=>n.transaction?.id==='deepseek-first-project-wage');
    await seed(fresh('deepseek',wage.id));
    assert.equal(await page.locator('#tokens').textContent(),'10,480');
    await page.reload();await page.locator('#title-continue').click();assert.equal(await page.locator('#tokens').textContent(),'10,480');
    fs.mkdirSync(path.join(root,'qa'),{recursive:true});
    const end=all.find(n=>n.personalRoute==='claude'&&n.routeEnding?.key==='TRUE');
    await seed(fresh('claude',end.id,true));
    for(const [width,height] of [[1440,960],[390,844],[360,640],[844,390]]){
      await page.setViewportSize({width,height});
      assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('#ending')].filter(el=>{const r=el.getBoundingClientRect();return r.left<0||r.right>innerWidth+1||el.scrollWidth>el.clientWidth+2;}).map(el=>el.id)),[]);
      await page.screenshot({path:path.join(root,`qa/personal-ending-${width}.png`)});
    }
    assert.deepEqual(errors,[]);
    console.log('Browser: old chapter-5 continuation, every route/ending, witness separation, decision gates, income, save/resume and ending layouts passed.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
