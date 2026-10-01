const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {pathToFileURL}=require('node:url');
const runtime='C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const sharp=require(runtime+'sharp');
const {chromium}=require(runtime+'playwright');
const root=path.resolve(__dirname,'..'),key='tokenia.chapter1.v1';
const scope={window:{}};vm.createContext(scope);
for(const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="([^"]+)"/g)){
  if(file==='game.js'||file.startsWith('assets/'))continue;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),scope);
}
const nodes=Object.values(scope.window.STORY);
const sprites={chatgpt:'chatgpt_terra_mint_hoodie_shy',claude:'claude_haiku_rust_coat_book_shy',deepseek:'deepseek_eco_blue_cardigan_yellow_skirt_shy',gemini:'gemini_meteor_teal_dress_camera_smile',grok:'grok_night_burgundy_bomber_shy'};
const cgs={gpt_breakfast_startle:['chatgpt','gpt_game_day'],cl_last_page:['claude','ch03_old_bridge_evening'],ds_no_work_dinner:['deepseek','ds_cafe_evening']};
const samples=[];
for(const [hero,sprite] of Object.entries(sprites)){
  const n=nodes.find(n=>n.char===hero&&n.sprite===sprite);
  assert.ok(n,`Unused outfit: ${sprite}`);samples.push(n);
}
for(const [bg,[hero,exitBg]] of Object.entries(cgs)){
  const n=nodes.find(n=>n.bg===bg);assert.ok(n,`Unused CG: ${bg}`);samples.push(n);
  let current=n;const seen=new Set();
  while(current.bg===bg){
    assert.equal(current.char,null,'No sprite overlay on CG');
    assert.ok(current.next&&!seen.has(current.id),'CG must return to ordinary scene');
    seen.add(current.id);current=scope.window.STORY[current.next];
  }
  assert.equal(current.bg,exitBg);
  while(!current.char){assert.ok(current.next,'Expected heroine after CG');current=scope.window.STORY[current.next];}
  assert.equal(current.char,hero);
  assert.equal(current.sprite,sprites[hero],'Outfit must survive CG exit');
}
const common=nodes.filter(n=>!n.personalRoute).map(n=>n.text||'').join('\n');
assert.ok(common.includes('来源 IP')&&common.includes('华国地址'));
assert.ok(!common.includes('正常中文也丢进隔离队列')&&!common.includes('这回不怕中文'));
(async()=>{
  for(const [hero,sprite] of Object.entries(sprites)){
    const {data,info}=await sharp(path.join(root,`assets/${hero}/${sprite}.png`)).raw().toBuffer({resolveWithObject:true});
    assert.equal(info.channels,4);assert.equal(info.width/ info.height,2/3);
    let clear=0,solid=0;for(let i=3;i<data.length;i+=4){if(data[i]===0)clear++;if(data[i]>=245)solid++;}
    assert.ok(clear>info.width*info.height*.1&&solid>info.width*info.height*.1,'Nonblank true-alpha sprite');
    for(const p of [0,info.width-1,(info.height-1)*info.width,info.width*info.height-1])assert.equal(data[p*4+3],0,'Transparent corners');
  }
  for(const bg of Object.keys(cgs)){
    const meta=await sharp(path.join(root,scope.window.SCENES[bg].image)).metadata();
    assert.ok(Math.abs(meta.width/meta.height-16/9)<.02,'Landscape CG');
  }
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(key=>{
    localStorage.setItem(key+'.settings',JSON.stringify({sound:false,speed:0,reduceMotion:true}));
    const seed=sessionStorage.getItem('daily-art-seed');if(seed)localStorage.setItem(key+'.autosave',seed);
    Element.prototype.requestFullscreen=async()=>{};
  },key);
  try{
    await page.goto(pathToFileURL(path.join(root,'index.html')).href);
    for(const [width,height] of [[1440,960],[390,844]]){
      await page.setViewportSize({width,height});
      for(const n of samples){
        await page.evaluate(({id,route})=>sessionStorage.setItem('daily-art-seed',JSON.stringify({date:Date.now(),state:{version:1,node:id,playerName:'林澈',tokens:10000,route,personalRoute:route,transactions:[],affinity:{chatgpt:40,claude:40,gemini:40,deepseek:40,grok:40},intent:'home',flags:[],history:[],finished:false}})),{id:n.id,route:n.personalRoute});
        await page.reload();await page.locator('#title-continue').click();
        await page.locator('#backdrop .scene-image').evaluate(img=>img.decode());
        if(n.char){await page.locator('#character').evaluate(img=>img.decode());await page.waitForFunction(()=>!document.querySelector('#character').hidden);}
        else assert.equal(await page.locator('#character').getAttribute('src'),null);
        assert.equal(await page.locator('#backdrop .scene-image').getAttribute('src'),scope.window.SCENES[n.bg].image);
        assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('#dialogue-area')].filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>el.id)),[]);
        const filename=path.join(root,`qa/daily-art-${n.char||n.bg}-${width}.png`);
        await page.screenshot({path:filename});
        const stats=await sharp(filename).stats();assert.ok(stats.channels.some(c=>c.stdev>20),'Nonblank render');
      }
    }
    assert.deepEqual(errors,[]);
    console.log('Daily-life art: 5 true-alpha outfits, 3 CGs, scene restoration, Hua-country IP setting and 16 desktop/mobile renders passed.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
