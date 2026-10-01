const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {pathToFileURL}=require('node:url');
const runtime='C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const sharp=require(runtime+'sharp');
const {chromium}=require(runtime+'playwright');
const production=require('../story/grok-route-production.cjs');
const root=path.resolve(__dirname,'..'),key='tokenia.chapter1.v1';
const scope={window:{}};vm.createContext(scope);
for(const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="([^"]+)"/g)){
  if(file==='game.js'||file.startsWith('assets/'))continue;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),scope);
}
const nodes=Object.values(scope.window.STORY).filter(n=>n.personalRoute==='grok');
for(const n of nodes.filter(n=>scope.window.SCENES[n.bg].cg))assert.equal(n.char,null,'CG must not overlay a sprite');
const sketchbook=nodes.find(n=>n.sprite==='grok_night_red_black_jacket_sketchbook_shy');
const blood=nodes.find(n=>n.section==='07'&&n.sprite==='grok_bloodmoon_red_black_workwear_focused');
assert.ok(sketchbook&&blood,'Private sketchbook and work form');
assert.equal(nodes.find(n=>n.text.includes('来。不是来看看你能不能赢')).music,'B17');
assert.equal(nodes.find(n=>n.text.includes('那本画着两个背影的画册')).bg,'gr_private_studio');
assert.equal(nodes.find(n=>n.text.includes('再回报社的小工作间时')).bg,'gr_private_studio');
assert.equal(nodes.find(n=>n.text.includes('今晚吃什么')).sprite,'grok_night_red_black_jacket_amused');
assert.ok(nodes.every(n=>n.music!=='B20-Duel'&&n.music!=='B21'),'Do not leak common-route meme music');
const samples=[...Object.keys(production.scenes).map(bg=>nodes.find(n=>n.bg===bg&&n.who==='grok')||nodes.find(n=>n.bg===bg)),sketchbook,blood];
const assets=new Set(nodes.map(n=>scope.window.SCENES[n.bg].image));
for(const n of nodes)if(n.char)assets.add(`assets/${n.char}/${n.sprite}.png`);
for(const asset of assets)assert.ok(fs.existsSync(path.join(root,asset)),asset);
(async()=>{
  const sprite=path.join(root,'assets/grok/grok_night_red_black_jacket_sketchbook_shy.png');
  const {data,info}=await sharp(sprite).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let clear=0,solid=0;for(let i=3;i<data.length;i+=4){if(data[i]===0)clear++;if(data[i]>=245)solid++;}
  assert.ok(clear>info.width*info.height*.1,'Real transparency');assert.ok(solid>info.width*info.height*.1,'Nonblank character');
  for(const p of [0,info.width-1,(info.height-1)*info.width,info.width*info.height-1])assert.equal(data[p*4+3],0,'Transparent corners');
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(key=>{
    localStorage.setItem(key+'.settings',JSON.stringify({sound:false,speed:0,reduceMotion:true}));
    const seed=sessionStorage.getItem('gr-art-seed');if(seed)localStorage.setItem(key+'.autosave',seed);
    Element.prototype.requestFullscreen=async()=>{};
  },key);
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});
  try{
    await page.goto(pathToFileURL(path.join(root,'index.html')).href);
    for(const [width,height] of [[1440,960],[390,844]]){
      await page.setViewportSize({width,height});
      for(const [index,n] of samples.entries()){
        await page.evaluate(({id})=>sessionStorage.setItem('gr-art-seed',JSON.stringify({date:Date.now(),state:{version:1,node:id,playerName:'林澈',tokens:10000,route:'grok',personalRoute:'grok',transactions:[],affinity:{chatgpt:40,claude:40,gemini:40,deepseek:40,grok:40},intent:'home',flags:STORY[id].when?.map(c=>c.flag)||[],history:[],finished:false}})),{id:n.id});
        await page.reload();await page.locator('#title-continue').click();
        await page.locator('#backdrop .scene-image').evaluate(img=>img.decode());
        assert.equal(await page.locator('#game').getAttribute('data-bgm'),n.music);
        assert.equal(await page.locator('#backdrop .scene-image').getAttribute('src'),scope.window.SCENES[n.bg].image);
        if(n.char){await page.locator('#character').evaluate(img=>img.decode());await page.waitForFunction(()=>!document.querySelector('#character').hidden);}
        else assert.equal(await page.locator('#character').getAttribute('src'),null);
        assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('#dialogue-area')].filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>el.id)),[]);
        await page.waitForFunction(()=>!document.querySelector('#toast').classList.contains('visible'));
        await page.screenshot({path:path.join(root,`qa/grok-${index}-${width}.png`)});
      }
    }
    assert.deepEqual(errors,[]);
    console.log(`Grok production: ${nodes.length} passages, ${assets.size} referenced images, transparent sketchbook sprite, model changes, scenes/BGM/CG and desktop/mobile layouts passed.`);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
