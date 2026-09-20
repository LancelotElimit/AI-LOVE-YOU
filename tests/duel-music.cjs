const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/10146/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {clickControl}=require('./controls.cjs');
const root=path.resolve(__dirname,'..'),key='tokenia.chapter1.v1';
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(key=>{
    localStorage.setItem(key+'.settings',JSON.stringify({sound:false,speed:0,reduceMotion:true}));
    const seed=sessionStorage.getItem('duel-seed');if(seed){localStorage.setItem(key+'.autosave',seed);sessionStorage.removeItem('duel-seed');}
    Element.prototype.requestFullscreen=async()=>{};
    window.testAudio=[];const AudioOriginal=window.Audio;
    window.Audio=function(...args){const media=new AudioOriginal(...args);window.testAudio.push(media);return media;};
    window.testNotes=0;const osc=AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator=function(...args){window.testNotes++;return osc.apply(this,args);};
  },key);
  try{
    await page.goto(pathToFileURL(path.join(root,'index.html')).href);
    await page.evaluate(key=>{
      const node=Object.values(STORY).find(n=>n.music==='B20-Duel');
      sessionStorage.setItem('duel-seed',JSON.stringify({date:Date.now(),state:{version:1,node:node.id,playerName:'旅人',tokens:10000,route:'deepseek',personalRoute:null,transactions:[],affinity:{chatgpt:0,claude:0,gemini:0,deepseek:0,grok:0},intent:'home',flags:[],history:[],finished:false}}));
    },key);
    await page.reload();await page.locator('#title-continue').click();await clickControl(page,'sound');
    await page.waitForFunction(()=>window.testAudio.length===1&&window.testAudio[0].currentTime>.4);
    await page.waitForTimeout(900);
    assert.equal(await page.evaluate(()=>window.testAudio[0].error),null);
    assert.ok(await page.evaluate(()=>window.testAudio[0].volume>.1));
    const time=await page.evaluate(()=>window.testAudio[0].currentTime);
    await page.evaluate(()=>{for(let i=0;i<8;i++)document.querySelector('#advance').click();});
    assert.equal(await page.evaluate(()=>window.testAudio.length),1);
    assert.ok(await page.evaluate(()=>window.testAudio[0].currentTime)>=time);
    await clickControl(page,'sound');assert.equal(await page.evaluate(()=>window.testAudio[0].paused),true);
    const paused=await page.evaluate(()=>window.testAudio[0].currentTime);await page.waitForTimeout(300);
    assert.equal(await page.evaluate(()=>window.testAudio[0].currentTime),paused);
    await clickControl(page,'sound');await page.waitForFunction(t=>window.testAudio[0].currentTime>t,paused);
    const lines=await page.evaluate(()=>{
      const result=[];
      for(let i=0;i<100;i++){
        result.push(document.querySelector('#dialogue-text').textContent);
        if(document.querySelector('#game').dataset.bgm!=='B20-Duel')return result;
        document.querySelector('#advance').click();
      }throw Error('Duel never ends');
    });
    assert.ok(lines.indexOf('是 DeepSeek 赢了。')<lines.indexOf('对抗结束。胜者，ChatGPT。'));
    assert.equal(await page.locator('#game').getAttribute('data-bgm'),'B13');
    const initial=await page.evaluate(()=>window.testAudio[0].volume);await page.waitForTimeout(450);
    assert.ok(await page.evaluate(()=>window.testAudio[0].volume)<initial,'Track must fade out');
    await page.waitForTimeout(1000);
    assert.equal(await page.evaluate(()=>window.testAudio[0].paused),true);
    assert.equal(await page.evaluate(()=>window.testAudio[0].getAttribute('src')),null);
    await page.waitForTimeout(600);assert.ok(await page.evaluate(()=>window.testNotes>0),'Normal score must resume');
    await page.reload();await page.locator('#title-continue').click();await clickControl(page,'sound');
    assert.equal(await page.evaluate(()=>window.testAudio.length),0,'Outside save must not restart duel music');
    await page.evaluate(key=>{
      const entry=JSON.parse(localStorage.getItem(key+'.autosave'));
      entry.state.node=Object.values(STORY).find(n=>n.chapter===4&&n.section==='05'&&n.music==='B21').id;
      sessionStorage.setItem('duel-seed',JSON.stringify(entry));
    },key);
    await page.reload();await page.locator('#title-continue').click();await clickControl(page,'sound');
    await page.waitForFunction(()=>window.testAudio.length===1&&window.testAudio[0].currentTime>.4);
    assert.match(await page.evaluate(()=>window.testAudio[0].src),/pipaqu_fixed\.mp3$/);
    await page.waitForTimeout(850);
    await page.evaluate(()=>{for(let i=0;i<2;i++)document.querySelector('#advance').click();});
    assert.equal(await page.evaluate(()=>window.testAudio.length),1);
    await page.evaluate(()=>{
      for(let i=0;i<60;i++){
        if(document.querySelector('#game').dataset.bgm!=='B21')return;
        document.querySelector('#advance').click();
      }throw Error('Meme sequence never ends');
    });
    assert.equal(await page.locator('#game').getAttribute('data-bgm'),'silence');
    const memeVolume=await page.evaluate(()=>window.testAudio[0].volume);
    await page.waitForTimeout(400);
    assert.ok(await page.evaluate(()=>window.testAudio[0].volume)<memeVolume);
    await page.waitForTimeout(1000);
    assert.equal(await page.evaluate(()=>window.testAudio[0].paused),true);
    assert.equal(await page.evaluate(()=>window.testAudio[0].getAttribute('src')),null);
    assert.deepEqual(errors,[]);
    assert.ok(fs.existsSync(path.join(root,'assets/bgm/yuai_fixed.mp3')));
    console.log('Duel: reversal order, actual local MP3 playback, continuity, mute/resume, 1.2s fade-out, normal score and outside save passed.');
    console.log('Meme sequence: pipaqu MP3 playback, uninterrupted CG changes and fade-out to scripted silence passed.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
