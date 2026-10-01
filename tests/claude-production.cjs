const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {pathToFileURL}=require('node:url');
const runtime='C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const sharp=require(runtime+'sharp');
const {chromium}=require(runtime+'playwright');
const production=require('../story/claude-route-production.cjs');
const root=path.resolve(__dirname,'..'),key='tokenia.chapter1.v1';
const scope={window:{}};vm.createContext(scope);
for(const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="([^"]+)"/g)){
  if(file==='game.js'||file.startsWith('assets/'))continue;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),scope);
}
const nodes=Object.values(scope.window.STORY).filter(n=>n.personalRoute==='claude');
const old=nodes.filter(n=>n.delivery==='旧时间线 · 消息');
assert.ok(old.length>=8,'Other timeline must be distinguishable');
for(const n of old){assert.equal(n.char,null);assert.ok(!scope.window.SCENES[n.bg].cg,'Old channel must not show current Claude call CG');}
for(const n of nodes.filter(n=>scope.window.SCENES[n.bg].cg))assert.equal(n.char,null,'CG must not overlay a sprite');
const book=nodes.find(n=>n.sprite==='claude_haiku_black_cardigan_book_shy');
const sonnet=nodes.find(n=>n.delivery==='消息'&&n.sprite==='claude_sonnet_book_dress_focused');
assert.ok(book&&sonnet,'Private and remote work poses');
const samples=[...Object.keys(production.scenes).map(bg=>nodes.find(n=>n.bg===bg)),book,sonnet,old[0]];
const assets=new Set(nodes.map(n=>scope.window.SCENES[n.bg].image));
for(const n of nodes)if(n.char)assets.add(`assets/${n.char}/${n.sprite}.png`);
for(const asset of assets)assert.ok(fs.existsSync(path.join(root,asset)),asset);
(async()=>{
  const sprite=path.join(root,'assets/claude/claude_haiku_black_cardigan_book_shy.png');
  const {data,info}=await sharp(sprite).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let clear=0,solid=0;for(let i=3;i<data.length;i+=4){if(data[i]===0)clear++;if(data[i]>=245)solid++;}
  assert.ok(clear>info.width*info.height*.15);assert.ok(solid>info.width*info.height*.15);
  for(const p of [0,info.width-1,(info.height-1)*info.width,info.width*info.height-1])assert.equal(data[p*4+3],0,'Transparent corners');
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(key=>{
    localStorage.setItem(key+'.settings',JSON.stringify({sound:false,speed:0,reduceMotion:true}));
    const seed=sessionStorage.getItem('cl-art-seed');if(seed)localStorage.setItem(key+'.autosave',seed);
    Element.prototype.requestFullscreen=async()=>{};
  },key);
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});
  try{
    await page.goto(pathToFileURL(path.join(root,'index.html')).href);
    for(const [width,height] of [[1440,960],[390,844]]){
      await page.setViewportSize({width,height});
      for(const [index,n] of samples.entries()){
        await page.evaluate(({id})=>sessionStorage.setItem('cl-art-seed',JSON.stringify({date:Date.now(),state:{version:1,node:id,playerName:'林澈',tokens:10000,route:'claude',personalRoute:'claude',transactions:[],affinity:{chatgpt:40,claude:40,gemini:40,deepseek:40,grok:40},intent:'home',flags:(n=>n.when?.map(c=>c.flag)||[])(STORY[id]),history:[],finished:false}})),{id:n.id});
        await page.reload();await page.locator('#title-continue').click();
        await page.locator('#backdrop .scene-image').evaluate(img=>img.decode());
        assert.equal(await page.locator('#game').getAttribute('data-bgm'),n.music);
        assert.equal(await page.locator('#backdrop .scene-image').getAttribute('src'),scope.window.SCENES[n.bg].image);
        if(n.char){await page.locator('#character').evaluate(img=>img.decode());await page.waitForFunction(()=>!document.querySelector('#character').hidden);}
        else assert.equal(await page.locator('#character').getAttribute('src'),null);
        if(n.delivery)assert.equal(await page.locator('#speaker-sub').textContent(),n.delivery);
        assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('#dialogue-area')].filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>el.id)),[]);
        await page.waitForFunction(()=>!document.querySelector('#toast').classList.contains('visible'));
        await page.screenshot({path:path.join(root,`qa/claude-${index}-${width}.png`)});
      }
    }
    assert.deepEqual(errors,[]);
    console.log(`Claude production: ${nodes.length} passages, ${assets.size} images, separate timeline messages, remote models, transparent sprite and desktop/mobile CG renders passed.`);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
