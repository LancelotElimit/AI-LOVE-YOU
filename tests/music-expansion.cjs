const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {clickControl}=require('./controls.cjs');
const root=path.resolve(__dirname,'..'),key='tokenia.chapter1.v1';
const scope={window:{}};vm.createContext(scope);
for(const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="([^"]+)"/g)){
  if(file==='game.js'||file.startsWith('assets/'))continue;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),scope);
}
const ids=Array.from({length:8},(_,i)=>`B${i+22}`),scores=scope.window.SCORES;
const signatures=new Set();
for(const id of ids){
  const s=scores[id];assert.ok(s&&!s.src,id);
  assert.ok(s.bpm>=50&&s.bpm<=150);assert.equal(s.chords.length,4);
  assert.equal(s.melody.length,32);assert.ok(s.melody.some(n=>n!==null));
  assert.ok(s.melody.every(n=>n===null||Number.isFinite(n)));
  assert.ok(s.chords.every(c=>c.length===4&&c.every(Number.isFinite)));
  signatures.add(JSON.stringify([s.root,s.melody,s.chords]));
  assert.ok(Object.values(scope.window.STORY).some(n=>n.personalRoute&&n.music===id),`${id} is used in the story`);
}
assert.equal(signatures.size,8,'Independent musical phrases');
const readme=fs.readFileSync(path.join(root,'README.md'),'utf8');
const gallery=[...readme.matchAll(/<img src="([^"]+)" width="480" alt="([^"]+)"/g)];
assert.equal(gallery.length,6);
for(const [,src,alt] of gallery){assert.ok(alt);assert.ok(fs.existsSync(path.join(root,src)),src);assert.ok(src.startsWith('assets/scene/cg/'));}
assert.equal(scores['B20-Duel'].src,'assets/bgm/yuai_fixed.mp3');
assert.equal(scores.B21.src,'assets/bgm/pipaqu_fixed.mp3');
const game=fs.readFileSync(path.join(root,'game.js'),'utf8');
const engineSource=game.slice(game.indexOf('class AudioEngine {'),game.indexOf('function activateAudio('));
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(key=>{
    localStorage.setItem(key+'.settings',JSON.stringify({sound:true,speed:0,reduceMotion:true}));
    const seed=sessionStorage.getItem('bgm-seed');if(seed)localStorage.setItem(key+'.autosave',seed);
    Element.prototype.requestFullscreen=async()=>{};
    window.testNotes=0;const create=AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator=function(...args){window.testNotes++;return create.apply(this,args);};
  },key);
  try{
    await page.goto(pathToFileURL(path.join(root,'index.html')).href);
    const rendered=await page.evaluate(async({ids,engineSource})=>{
      const Engine=new Function(engineSource+';return AudioEngine;')(),results=[];
      for(const id of ids){
        const s=SCORES[id],duration=64*30/s.bpm+5;
        const ctx=new OfflineAudioContext(1,Math.ceil(duration*24000),24000);
        const engine=Object.create(Engine.prototype);engine.ctx=ctx;engine.bus=ctx.createGain();engine.bus.connect(ctx.destination);
        for(let step=0;step<64;step++){
          const bar=Math.floor(step/16)%4,chord=s.chords[bar],pulse=s.sparse?8:4,time=.12+step*30/s.bpm;
          if(step%pulse===0)engine.note(s.root+chord[Math.floor(step/pulse)%4],time,s.sparse?3.5:2.3,.12);
          if(step%16===0)engine.note(s.root+chord[0]-12,time,4,.09);
          const note=s.melody[step%s.melody.length];
          if(note!==null)engine.note(s.root+note+(bar===2?-12:0),time,s.sparse?2.8:1.8,.09,s.voice);
        }
        const buffer=await ctx.startRendering(),data=buffer.getChannelData(0);
        let peak=0,energy=0;for(const v of data){peak=Math.max(peak,Math.abs(v));energy+=v*v;}
        results.push({id,peak,rms:Math.sqrt(energy/data.length)});
      }
      return results;
    },{ids,engineSource});
    for(const r of rendered){assert.ok(r.peak>.02&&r.peak<1,`${r.id} nonblank, unclipped output`);assert.ok(r.rms>.005,`${r.id} audible output`);}
    for(const id of ids){
      await page.evaluate(({id})=>{
        const node=Object.values(STORY).find(n=>n.personalRoute&&n.music===id&&!n.when);
        if(!node)throw Error(`No unconditional sample for ${id}`);
        sessionStorage.setItem('bgm-seed',JSON.stringify({date:Date.now(),state:{version:1,node:node.id,playerName:'旅人',tokens:10000,route:node.personalRoute,personalRoute:node.personalRoute,transactions:[],affinity:{chatgpt:40,claude:40,gemini:40,deepseek:40,grok:40},intent:'home',flags:[],history:[],finished:false}}));
      },{id});
      await page.reload();await page.locator('#title-continue').click();
      assert.equal(await page.locator('#game').getAttribute('data-bgm'),id);
      await page.waitForFunction(()=>window.testNotes>4);
    }
    await clickControl(page,'sound');
    const muted=await page.evaluate(()=>window.testNotes);
    await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>window.testNotes),muted);
    await clickControl(page,'sound');await page.waitForFunction(count=>window.testNotes>count,muted);
    assert.deepEqual(errors,[]);
    console.log('8 new original scores: independent phrases, rendered audible/unclipped audio, live story playback, mute/resume and 6 README CG paths passed.');
    console.log(JSON.stringify(rendered));
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
