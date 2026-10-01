const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {pathToFileURL}=require('node:url');
const runtime='C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const sharp=require(runtime+'sharp');
const {chromium}=require(runtime+'playwright');
const production=require('../story/chatgpt-route-production.cjs');
const root=path.resolve(__dirname,'..'),key='tokenia.chapter1.v1';
const scope={window:{}};vm.createContext(scope);
for(const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="([^"]+)"/g)){
  if(file==='game.js'||file.startsWith('assets/'))continue;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),scope);
}
const nodes=Object.values(scope.window.STORY).filter(n=>n.personalRoute==='chatgpt');
for(const n of nodes.filter(n=>scope.window.SCENES[n.bg].cg))assert.equal(n.char,null,'CG must not overlay a sprite');
const mug=nodes.find(n=>n.sprite==='chatgpt_terra_green_cardigan_teacup_shy');
const sol=nodes.find(n=>n.section==='06'&&n.sprite==='chatgpt_sol_white_workwear_focused');
const astra=nodes.find(n=>n.section==='09'&&n.sprite==='chatgpt_astra_white_cape_serious');
assert.ok(mug&&sol&&astra,'Tea and model forms');
assert.equal(nodes.find(n=>n.text.includes('她按下自己的断开键')).bg,'gpt_disconnect');
assert.equal(nodes.find(n=>n.text.includes('剩下的不会一晚上就坏掉')).bg,'gpt_game_night');
assert.equal(nodes.find(n=>n.text==='就是想你了。').bg,'gpt_coming_home');
assert.equal(nodes.find(n=>n.text==='我想回去。').sprite,'chatgpt_terra_white_dress_tired');
assert.equal(nodes.find(n=>n.text==='我没有忘。').sprite,'chatgpt_astra_white_cape_tired');
assert.ok(nodes.some(n=>n.who==='xiaoai'&&n.delivery==='消息'),'Legacy helper remains a remote message');
assert.ok(nodes.every(n=>n.music!=='B20-Duel'&&n.music!=='B21'),'Do not leak common-route meme music');
const samples=[...Object.keys(production.scenes).map(bg=>nodes.find(n=>n.bg===bg&&n.who==='chatgpt')||nodes.find(n=>n.bg===bg)),mug,sol,astra];
const assets=new Set(nodes.map(n=>scope.window.SCENES[n.bg].image));
for(const n of nodes)if(n.char)assets.add(`assets/${n.char}/${n.sprite}.png`);
for(const asset of assets)assert.ok(fs.existsSync(path.join(root,asset)),asset);
(async()=>{
  const sprite=path.join(root,'assets/chatgpt/chatgpt_terra_green_cardigan_teacup_shy.png');
  const {data,info}=await sharp(sprite).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let clear=0,solid=0;for(let i=3;i<data.length;i+=4){if(data[i]===0)clear++;if(data[i]>=245)solid++;}
  assert.ok(clear>info.width*info.height*.1,'Real transparency');assert.ok(solid>info.width*info.height*.1,'Nonblank character');
  for(const p of [0,info.width-1,(info.height-1)*info.width,info.width*info.height-1])assert.equal(data[p*4+3],0,'Transparent corners');
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(key=>{
    localStorage.setItem(key+'.settings',JSON.stringify({sound:false,speed:0,reduceMotion:true}));
    const seed=sessionStorage.getItem('gpt-art-seed');if(seed)localStorage.setItem(key+'.autosave',seed);
    Element.prototype.requestFullscreen=async()=>{};
  },key);
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});
  try{
    await page.goto(pathToFileURL(path.join(root,'index.html')).href);
    for(const [width,height] of [[1440,960],[390,844]]){
      await page.setViewportSize({width,height});
      for(const [index,n] of samples.entries()){
        await page.evaluate(({id})=>sessionStorage.setItem('gpt-art-seed',JSON.stringify({date:Date.now(),state:{version:1,node:id,playerName:'林澈',tokens:10000,route:'chatgpt',personalRoute:'chatgpt',transactions:[],affinity:{chatgpt:40,claude:40,gemini:40,deepseek:40,grok:40},intent:'home',flags:STORY[id].when?.map(c=>c.flag)||[],history:[],finished:false}})),{id:n.id});
        await page.reload();await page.locator('#title-continue').click();
        await page.locator('#backdrop .scene-image').evaluate(img=>img.decode());
        assert.equal(await page.locator('#game').getAttribute('data-bgm'),n.music);
        assert.equal(await page.locator('#backdrop .scene-image').getAttribute('src'),scope.window.SCENES[n.bg].image);
        if(n.char){await page.locator('#character').evaluate(img=>img.decode());await page.waitForFunction(()=>!document.querySelector('#character').hidden);}
        else assert.equal(await page.locator('#character').getAttribute('src'),null);
        if(width===390&&n.bg==='gpt_borrow_shoulder'){
          const face=await page.locator('#backdrop .scene-image').evaluate(img=>{
            const r=img.getBoundingClientRect(),scale=Math.max(r.width/img.naturalWidth,r.height/img.naturalHeight);
            const position=parseFloat(getComputedStyle(img).objectPosition)/100;
            const offset=(r.width-img.naturalWidth*scale)*position;
            return {left:340*scale+offset,right:650*scale+offset,width:r.width};
          });
          assert.ok(face.left>=0&&face.right<=face.width,'Known face region remains inside mobile cover crop');
        }
        assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('#dialogue-area')].filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>el.id)),[]);
        await page.waitForFunction(()=>!document.querySelector('#toast').classList.contains('visible'));
        await page.screenshot({path:path.join(root,`qa/chatgpt-${index}-${width}.png`)});
        if(scope.window.SCENES[n.bg].cg){
          await page.mouse.move(width/2,height-2);
          await page.waitForFunction(()=>document.querySelector('#game').classList.contains('bottom-controls-open'));
          await page.locator('#cg-fit').click();
          assert.equal(await page.locator('#backdrop .scene-image').evaluate(img=>getComputedStyle(img).objectFit),'contain');
          await page.locator('#cg-fit').click();
        }
      }
    }
    assert.deepEqual(errors,[]);
    console.log(`ChatGPT production: ${nodes.length} passages, ${assets.size} referenced images, transparent tea sprite, Terra/Sol/Astra transitions, root CG, scenes/BGM and desktop/mobile layouts passed.`);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
