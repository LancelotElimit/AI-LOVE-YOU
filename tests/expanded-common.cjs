const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),key='tokenia.chapter1.v1',cast=['chatgpt','claude','gemini','deepseek','grok'];
const scope={window:{}};vm.createContext(scope);
for(const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="([^"]+)"/g)){
  if(file==='game.js'||file.startsWith('assets/'))continue;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),scope);
}
const {STORY,SCENES,SCORES}=scope.window,nodes=Object.values(STORY);
const final=nodes.find(n=>n.chapter===5&&n.section==='08'&&n.choices);
const fresh=node=>({state:{version:1,node,playerName:'林澈',tokens:10000,route:'claude',personalRoute:null,transactions:[],affinity:Object.fromEntries(cast.map(id=>[id,20])),intent:'home',flags:[],history:[],finished:false},date:Date.now()});
const expansion=require('../story/common-expansion.cjs');
const art=[...Object.keys(expansion.backgrounds),...expansion.cgs,'ch04_chatgpt_deepseek_domain_clash','ch04_chatgpt_claude_meme_dance_01','ch04_chatgpt_claude_meme_dance_02'];
for(const bg of art){assert.ok(nodes.some(n=>n.bg===bg),`${bg} unused`);assert.ok(fs.existsSync(path.join(root,SCENES[bg].image)));}
for(const n of nodes.filter(n=>n.chapter>=4)){assert.ok(n.music==='silence'||SCORES[n.music]);assert.ok(n.end||n.next||n.choices);}
assert.equal(final.choices.length,6);
assert.equal(nodes.filter(n=>n.chapter===5&&n.end).length,6);

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:960}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>{if(r.failure().errorText!=='net::ERR_ABORTED')errors.push(r.url());});
  await page.addInitScript(key=>{
    localStorage.setItem(key+'.settings',JSON.stringify({sound:false,speed:0,reduceMotion:true}));
    const entry=sessionStorage.getItem('expanded-seed');
    if(entry){localStorage.setItem(key+'.autosave',entry);sessionStorage.removeItem('expanded-seed');}
    Element.prototype.requestFullscreen=async()=>{};
  },key);
  const seed=async entry=>{await page.evaluate(e=>sessionStorage.setItem('expanded-seed',JSON.stringify(e)),entry);await page.reload();await page.locator('#title-continue').click();};
  const read=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key+'.autosave')).state,key);
  try{
    await page.goto(pathToFileURL(path.join(root,'index.html')).href);
    for(const [hero,publicFunding] of [[0,false],[1,true],[2,false],[3,true],[4,false],[-1,true]]){
      await seed(fresh('c3.01.0'));
      const result=await page.evaluate(({hero,publicFunding,key})=>{
        for(let i=0;i<1500;i++){
          const s=JSON.parse(localStorage.getItem(key+'.autosave')).state,n=STORY[s.node];
          if(s.finished){if(n.chapter===5)return s;document.querySelector('#end-continue').click();continue;}
          if(!document.querySelector('#choices').classList.contains('hidden')){
            const buttons=[...document.querySelectorAll('#choices button')];
            let index=0;
            if(n.chapter===5&&n.section==='08')index=hero<0?buttons.length-1:0;
            else if(n.chapter===5&&n.section==='04')index=publicFunding?1:0;
            else if(buttons.length===5)index=Math.max(0,hero);
            buttons[index].click();
          }else document.querySelector('#advance').click();
        }throw Error('Unfinished expanded common route');
      },{hero,publicFunding,key});
      assert.equal(result.personalRoute,hero<0?null:cast[hero]);
      assert.equal(result.route,'claude','Witness must remain separate');
      assert.equal(result.tokens,publicFunding?9940:9340);
      assert.equal(new Set(result.transactions.map(t=>t.id)).size,result.transactions.length);
      assert.equal(result.affinity[cast[Math.max(0,hero)]],70);
      assert.equal(await page.locator('#end-continue').count(),0);
      assert.match(await page.locator('.end-teaser').textContent(),hero<0?/暂未选择/:/个人线/);
      await page.reload();await page.locator('#title-continue').click();assert.deepEqual(await read(),result);
    }
    const old=fresh(nodes.find(n=>n.chapter===3&&n.end).id);delete old.state.transactions;delete old.state.personalRoute;
    old.state.finished=true;await seed(old);assert.equal((await read()).tokens,9200);
    await page.reload();await page.locator('#title-continue').click();assert.equal((await read()).tokens,9200);

    const fee=nodes.find(n=>n.transaction?.id==='c3-disputed-fee');
    const low=fresh(fee.id);low.state.tokens=37;await seed(low);assert.equal((await read()).tokens,0);
    const refund=nodes.find(n=>n.transaction?.id==='c5-refund');
    const after=await read();after.node=refund.id;await seed({state:after,date:Date.now()});assert.equal((await read()).tokens,37);
    await page.reload();await page.locator('#title-continue').click();assert.equal((await read()).tokens,37);

    const poor=fresh(nodes.find(n=>n.chapter===5&&n.section==='04'&&n.choices).id);poor.state.tokens=0;await seed(poor);
    assert.equal(await page.locator('#choices button').nth(0).isDisabled(),true);
    assert.equal(await page.locator('#choices button').nth(1).isEnabled(),true);
    const gate=fresh(final.id);gate.state.affinity.chatgpt=39;gate.state.flags=['award:c4-07A'];await seed(gate);
    assert.equal(await page.locator('#choices button').count(),1);
    gate.state.affinity.chatgpt=40;await seed(gate);assert.equal(await page.locator('#choices button').count(),2);
    gate.state.flags=[];await seed(gate);assert.equal(await page.locator('#choices button').count(),1);

    fs.mkdirSync(path.join(root,'qa'),{recursive:true});
    for(const bg of art){
      const n=nodes.find(n=>n.bg===bg),entry=fresh(n.id);entry.state.flags=(n.when||[]).map(c=>c.flag).filter(Boolean);
      await seed(entry);await page.locator('#backdrop img').evaluate(img=>img.decode());
      assert.equal(await page.locator('#backdrop img').getAttribute('src'),SCENES[bg].image);
      if(SCENES[bg].cg)assert.equal(await page.locator('#character-wrap').evaluate(el=>el.classList.contains('empty')),true);
      for(const [width,height] of [[1440,960],[390,844]]){
        await page.setViewportSize({width,height});await page.screenshot({path:path.join(root,`qa/expanded-${bg}-${width}.png`)});
      }
    }
    const all=fresh(final.id);all.state.affinity=Object.fromEntries(cast.map(id=>[id,40]));all.state.flags=cast.map((_,i)=>`award:c4-07${String.fromCharCode(65+i)}`);
    await seed(all);assert.equal(await page.locator('#choices button').count(),6);
    for(const [width,height] of [[1440,960],[390,844],[360,640],[844,390]]){
      await page.setViewportSize({width,height});
      assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('.dialogue-area,.choices')].filter(el=>{const r=el.getBoundingClientRect();return r.left<0||r.right>innerWidth+1||el.scrollWidth>el.clientWidth+2;}).map(el=>el.className)),[]);
      await page.screenshot({path:path.join(root,`qa/expanded-final-${width}.png`)});
    }
    await page.locator('#choices button').last().click();
    assert.equal((await read()).node,'c5.10.0');
    assert.deepEqual(errors,[]);
    console.log('Expanded common route: all five locks + defer, paid/public funding, legacy saves, idempotent accounting, low balances, affection gates, 10 assets and responsive layouts passed.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
