(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const KEY = 'tokenia.chapter1.v1';
  const defaultSettings = {sound:true,music:.18,sfx:.28,speed:26,autoDelay:2.8,reduceMotion:false,cgFit:false};
  let storageOK = true;
  function read(key,fallback){try{const value=localStorage.getItem(`${KEY}.${key}`);return value?JSON.parse(value):fallback;}catch{storageOK=false;return fallback;}}
  function write(key,value){try{localStorage.setItem(`${KEY}.${key}`,JSON.stringify(value));return true;}catch{storageOK=false;return false;}}
  let settings = {...defaultSettings,...read('settings',{})};
  let seen = new Set(read('seen',[]));
  let state;
  let typingTimer,autoTimer,skipTimer,toastTimer,stationTimer;
  let atTitle=true,hasJourney=false,connecting=false,composingName=false;
  let isTyping=false,auto=false,skipping=false,fullText='',characterId=undefined,characterSprite=undefined,currentBg=null;
  let soundEngine=null;
  let dialogueHidden=false,titleTimer,titleIndex=0;
  const titlePictures=['chatgpt_tea_break','claude_book_by_window','deepseek_delivery_done','gemini_greenhouse_camera','grok_rocket_alignment'];
  let spriteRequest=0;
  function startTitleSlideshow(){
    clearInterval(titleTimer);
    if(document.hidden)return;
    titleTimer=setInterval(()=>{
      const slides=$('title-background').children;
      slides[titleIndex].classList.remove('current');titleIndex=(titleIndex+1)%slides.length;slides[titleIndex].classList.add('current');
    },10000);
  }
  function setDialogueHidden(hidden){
    dialogueHidden=hidden;$('game').classList.toggle('dialogue-hidden',hidden);$('restore-dialogue').classList.toggle('hidden',!hidden);
    const button=$('toggle-dialogue');button.title=hidden?'恢复对话框':'隐藏对话框';button.setAttribute('aria-label',button.title);button.setAttribute('aria-pressed',String(hidden));button.innerHTML=`<i data-lucide="${hidden?'eye':'eye-off'}"></i>`;icons();
    if(hidden)stopPlayback();
  }
  function setControls(edge,visible){$('game').classList.toggle(`${edge}-controls-open`,visible);}
  function hideControls(){setControls('top',false);setControls('bottom',false);}
  async function enterFullscreen(){
    if(document.fullscreenElement)return;
    try{await document.documentElement.requestFullscreen();}catch{toast('未能自动全屏，可继续游玩或使用全屏按钮。');}
  }
  function updateFullscreen(){
    const active=!!document.fullscreenElement,button=$('fullscreen');
    button.innerHTML=`<i data-lucide="${active?'minimize':'maximize'}"></i>`;
    button.title=active?'退出全屏':'全屏';button.setAttribute('aria-label',button.title);icons();
  }
  const icons = () => window.lucide?.createIcons();
  const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const blank = () => ({version:1,node:'intro.0',playerName:'',tokens:10000,route:null,affinity:{chatgpt:0,claude:0,gemini:0,deepseek:0,grok:0},intent:null,flags:[],history:[],finished:false});
  const current = () => STORY[state.node];
  const chapterInfo = () => window.CHAPTERS?.[current().chapter||0];
  function eligible(node){return (node.when||[]).every(c=>(!c.route||state.route===c.route)&&(!c.notRoute||state.route!==c.notRoute)&&(!c.flag||state.flags.includes(c.flag))&&(!c.notFlag||!state.flags.includes(c.notFlag)));}
  function resolveNode(id){const visited=new Set();while(id&&STORY[id]&&!eligible(STORY[id])){if(visited.has(id))return null;visited.add(id);id=STORY[id].next;}return id&&STORY[id]?id:null;}
  function actualWho(node){return node.who==='$route'?state.route:node.who;}
  function named(text,saved=state){return text.replaceAll('{name}',saved.playerName||'旅人');}
  function actualText(node){return named(ROUTE_LINES[state.route]?.[node.id]||node.text);}
  function speakerName(who){return who==='you'?(state.playerName||'你'):(CAST[who]?.name||'旁白');}
  function toast(text){clearTimeout(toastTimer);$('toast').textContent=text;$('toast').classList.add('visible');toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2700);}
  function updateSoundIcon(){ $('sound').innerHTML=`<i data-lucide="${settings.sound?'volume-2':'volume-x'}"></i>`;$('sound').title=settings.sound?'关闭声音':'开启声音';$('sound').setAttribute('aria-label',$('sound').title);icons(); }
  function applySettings(){document.documentElement.classList.toggle('reduce-motion',settings.reduceMotion);$('game').classList.toggle('cg-fit',!!settings.cgFit);$('cg-fit').title=settings.cgFit?'铺满插画':'完整插画';$('cg-fit').setAttribute('aria-label',$('cg-fit').title);$('cg-fit').setAttribute('aria-pressed',String(!!settings.cgFit));updateSoundIcon();soundEngine?.volumes();write('settings',settings);}

  class AudioEngine {
    constructor(){
      const AudioContext=window.AudioContext||window.webkitAudioContext;
      if(!AudioContext)throw new Error('Web Audio unavailable');
      this.ctx=new AudioContext();this.music=this.ctx.createGain();this.effects=this.ctx.createGain();
      this.music.connect(this.ctx.destination);this.effects.connect(this.ctx.destination);
      this.cue=null;this.setCue('prologue');
      this.step=0;this.nextTime=this.ctx.currentTime+.12;this.volumes();
      this.timer=setInterval(()=>this.schedule(),200);
    }
    volumes(){const t=this.ctx.currentTime;this.music.gain.setTargetAtTime(settings.sound?settings.music:0,t,.12);this.effects.gain.setTargetAtTime(settings.sound?settings.sfx:0,t,.02);}
    async resume(){if(this.ctx.state==='suspended')await this.ctx.resume();if(this.nextTime<this.ctx.currentTime)this.nextTime=this.ctx.currentTime+.08;}
    setCue(id){
      if(this.cue===id)return;
      const time=this.ctx.currentTime,previous=this.bus;
      if(previous){previous.gain.cancelScheduledValues(time);previous.gain.setTargetAtTime(0,time,.65);setTimeout(()=>previous.disconnect(),8000);}
      this.cue=id;this.bus=this.ctx.createGain();this.bus.connect(this.music);this.bus.gain.setValueAtTime(0,time);this.bus.gain.setTargetAtTime(1,time,.8);
      this.step=0;this.nextTime=time+.12;
    }
    note(midi,time,duration,volume,voice='sine'){
      const base=this.ctx.createOscillator(),harm=this.ctx.createOscillator(),gain=this.ctx.createGain(),hg=this.ctx.createGain();
      base.type=voice;harm.type='triangle';base.frequency.value=440*Math.pow(2,(midi-69)/12);harm.frequency.value=base.frequency.value*2;hg.gain.value=.08;
      base.connect(gain);harm.connect(hg);hg.connect(gain);gain.connect(this.bus);
      gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(volume,time+.018);gain.gain.exponentialRampToValueAtTime(.001,time+duration);
      base.start(time);harm.start(time);base.stop(time+duration+.05);harm.stop(time+duration+.05);
      base.onended=()=>{base.disconnect();harm.disconnect();gain.disconnect();hg.disconnect();};
    }
    schedule(){
      if(this.ctx.state!=='running'||!settings.sound)return;
      const score=window.SCORES?.[this.cue];
      if(!score)return;
      if(this.nextTime<this.ctx.currentTime)this.nextTime=this.ctx.currentTime+.08;
      while(this.nextTime<this.ctx.currentTime+.65){
        const bar=Math.floor(this.step/16)%4,chord=score.chords[bar],pulse=score.sparse?8:4;
        if(this.step%pulse===0)this.note(score.root+chord[Math.floor(this.step/pulse)%4],this.nextTime,score.sparse?3.5:2.3,.12);
        if(this.step%16===0)this.note(score.root+chord[0]-12,this.nextTime,4,.09);
        const melodyNote=score.melody[this.step%score.melody.length];
        if(melodyNote!==null)this.note(score.root+melodyNote+(bar===2?-12:0),this.nextTime,score.sparse?2.8:1.8,.09,score.voice);
        this.step++;this.nextTime+=30/score.bpm;
      }
    }
    click(){if(!settings.sound)return;const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='sine';o.frequency.setValueAtTime(920,t);o.frequency.exponentialRampToValueAtTime(620,t+.04);g.gain.setValueAtTime(.16,t);g.gain.exponentialRampToValueAtTime(.001,t+.055);o.connect(g);g.connect(this.effects);o.start();o.stop(t+.06);o.onended=()=>{o.disconnect();g.disconnect();};}
  }
  function activateAudio(click=false){
    if(!settings.sound)return;
    try{if(!soundEngine)soundEngine=new AudioEngine();soundEngine.setCue(atTitle?'prologue':current().music||'prologue');soundEngine.resume().catch(()=>{});if(click)soundEngine.click();}catch{settings.sound=false;updateSoundIcon();toast('当前浏览器未能启用声音，仍可继续阅读。');}
  }
  function stopTimers(){clearInterval(typingTimer);clearTimeout(autoTimer);clearTimeout(skipTimer);clearTimeout(stationTimer);}
  function stopPlayback(){auto=false;skipping=false;clearTimeout(autoTimer);clearTimeout(skipTimer);$('auto').classList.remove('active');$('skip').classList.remove('active');$('auto').setAttribute('aria-pressed','false');$('skip').setAttribute('aria-pressed','false');}
  function persist(){if(hasJourney)write('autosave',{state:structuredClone(state),date:Date.now()});}
  function showTitle(){
    setDialogueHidden(false);startTitleSlideshow();
    persist();stopTimers();stopPlayback();atTitle=true;connecting=false;closeModal();
    hideControls();
    soundEngine?.setCue('prologue');
    $('station-screen').classList.add('hidden');$('game').classList.remove('station-active','portal-active');$('game').classList.add('at-title');$('title-screen').classList.remove('hidden');
    const entry=read('autosave',null);$('title-continue').disabled=!validSave(entry);
    $('title-memory').textContent=validSave(entry)?`${entry.state.playerName||'旅人'} · ${window.CHAPTERS?.[STORY[entry.state.node].chapter||0]?.title||'未登记的来访者'}${entry.state.finished?' · 已完成':''}`:'一场尚未开始的相遇';
    $('title-new').focus({preventScroll:true});
  }
  function leaveTitle(){clearInterval(titleTimer);const entering=atTitle;atTitle=false;hasJourney=true;hideControls();$('title-screen').classList.add('hidden');$('game').classList.remove('at-title');if(entering)void enterFullscreen();}
  function startNew(target='intro.0'){
    const previousName=state.playerName;stopTimers();stopPlayback();state=blank();
    if(target!=='intro.0')state.playerName=previousName||'旅人';
    closeModal();leaveTitle();enter(target);activateAudio();$('advance').focus({preventScroll:true});
  }
  function validName(name){return typeof name==='string'&&name===name.trim()&&Array.from(name).length>=1&&Array.from(name).length<=12&&/^[\p{L}\p{M}\p{N}_·. \-]+$/u.test(name);}
  function showStation(){
    stopPlayback();connecting=false;isTyping=false;$('advance').classList.remove('typing');$('game').classList.add('station-active');$('station-screen').classList.remove('hidden');
    $('station-form').classList.remove('connecting');$('player-name').disabled=false;$('station-submit').disabled=false;
    $('player-name').value=state.playerName||'';$('name-count').textContent=`${Array.from($('player-name').value).length} / 12`;
    $('name-error').textContent='';$('player-name').removeAttribute('aria-invalid');$('station-status').textContent='来源地址：未知　 /　 目的地：等待分配';
    requestAnimationFrame(()=>{if(!atTitle&&current().inputName&&!$('modal').open)$('player-name').focus({preventScroll:true});});
  }
  function submitName(event){
    event.preventDefault();if(atTitle||connecting||composingName||!current().inputName)return;
    const name=$('player-name').value.normalize('NFC').trim();
    if(!validName(name)){$('name-error').textContent=name?'请使用 1–12 个文字、数字、空格或 _ · . -。':'中转站还不知道该怎样称呼你。';$('player-name').setAttribute('aria-invalid','true');$('player-name').focus();return;}
    state.playerName=name;persist();connecting=true;activateAudio(true);$('name-error').textContent='';$('player-name').removeAttribute('aria-invalid');
    $('player-name').disabled=true;$('station-submit').disabled=true;$('station-form').classList.add('connecting');
    $('station-status').textContent=`${name}，身份已确认。正在接入未知目的地……`;
    seen.add(state.node);write('seen',[...seen]);
    stationTimer=setTimeout(()=>{if(atTitle||!current().inputName)return;connecting=false;enter(current().next);$('advance').focus({preventScroll:true});},settings.reduceMotion?150:1200);
  }
  function enter(id){
    id=resolveNode(id);
    if(!STORY[id]){toast('这段故事暂时没有连接。');return;}
    clearTimeout(toastTimer);$('toast').classList.remove('visible');
    state.node=id;const node=current();
    if(node.award&&!state.flags.includes(`award:${node.award.id}`)){state.affinity[node.award.to]+=node.award.amount;state.flags.push(`award:${node.award.id}`);}
    if(node.grant){state.tokens+=node.grant;toast(`维修报酬 +${node.grant} TK`);}
    state.history.push({id,who:actualWho(node),text:actualText(node)});
    persist();render(false);
  }
  function spriteFile(cid,sprite){
    if(new RegExp(`^${cid}_[a-z0-9_]+$`).test(sprite))return `${sprite}.png`;
    const files={
      chatgpt:{default:'ChatGPT-default1.png',hello:'ChatGPT-hello1.png',happy:'ChatGPT-default1.png',shy:'ChatGPT-shy1.png',angry:'ChatGPT-angry1.png'},
      claude:{default:'Claude-default.png',happy:'Claude-happy1.png',shy:'Claude-shy1.png',angry:'Claude-angry1.png'},
      gemini:{happy:'Gemini-happy1.png',shy:'Gemini-shy1.png',angry:'Gemini-angry1.png',angry2:'Gemini-angry2.png'},
      deepseek:{hello:'Deepseek-hello1.png',happy:'Deepseek-happy1.png',shy:'Deepseek-shy1.png',angry:'Deepseek-angry1.png'},
      grok:{hello:'Grok-hello1.png',happy:'Grok-happy1.png',shy:'Grok-shy1.png',angry:'Grok-angry1.png'}
    };
    return files[cid]?.[sprite]||`${cid}-transparent.png`;
  }
  function render(instant=false){
    if(dialogueHidden)setDialogueHidden(false);
    stopTimers();$('ending').classList.add('hidden');$('dialogue-area').classList.remove('hidden');$('game').classList.remove('ended');
    $('station-screen').classList.add('hidden');$('game').classList.remove('station-active');
    const node=current(),who=CAST[actualWho(node)]||CAST.narration,scene=SCENES[node.bg];
    $('game').classList.toggle('illustrated',!!scene.image);$('game').classList.toggle('showing-cg',!!scene.cg);
    $('cg-fit').classList.toggle('hidden',!scene.cg);
    $('game').dataset.bgm=node.music||'prologue';soundEngine?.setCue(node.music||'prologue');
    const chapter=node.chapter||0,chapterName=chapterInfo()?.title||'未登记的来访者';
    document.querySelector('.chapter-label').textContent=`${chapter?'CHAPTER '+chapter:'PROLOGUE'} / ${chapterName}`;
    if(currentBg!==node.bg){$('backdrop').innerHTML=scene.art;currentBg=node.bg;}
    $('scene-index').textContent=scene.index;$('scene-title').textContent=scene.title;$('location').textContent=scene.location;$('scene-note').textContent=scene.note;
    const cid=node.char==='$route'?state.route:node.char;
    const sprite=node.sprite||'default';
    if(characterId!==cid||characterSprite!==sprite){
      characterId=cid;characterSprite=sprite;
      const img=$('character'),request=++spriteRequest;img.hidden=true;$('character-wrap').classList.toggle('empty',!cid);
      if(cid){
        const filename=spriteFile(cid,sprite);
        img.src=`assets/${cid}/${filename}`;
        img.alt=`${CAST[cid].name} ${sprite==='default'?'默认':sprite}表情立绘`;
        img.decode().then(()=>{if(request===spriteRequest)img.hidden=false;}).catch(()=>{});
      }else{img.removeAttribute('src');img.alt='';}
    }
    $('game').classList.toggle('has-character',!!cid);$('game').classList.toggle('portal-active',!!node.portal);
    $('character-tag').style.display=cid?'flex':'none';if(cid){$('character-en').textContent=CAST[cid].name;$('character-role').textContent=CAST[cid].role;}
    document.documentElement.style.setProperty('--accent',cid?CAST[cid].color:who.color);
    $('speaker').textContent=speakerName(actualWho(node));$('speaker-sub').textContent=node.delivery||((actualWho(node)==='narration'||actualWho(node)==='you')?chapterName:who.sub);$('speaker-dot').style.background=who.color;
    $('speaker').classList.toggle('long-name',Array.from($('speaker').textContent).length>8);
    $('tokens').textContent=state.tokens.toLocaleString('en-US');$('route-label').textContent=chapter?`共同篇 · 第${chapter}章`:(state.route?`${CAST[state.route].name} · 同行见证人`:'序章 · 初来乍到');
    $('line-counter').textContent=String(state.history.filter(h=>h.who!=='choice').length).padStart(3,'0');
    const progress = {room:4,campus:15,transit:24,library:32,council:32,observatory:32,cafe:32,night:32,hall:68,sunset:91};
    $('progress').style.width=`${node.end?100:node.progress??((progress[node.bg]||0)+Math.min(8,Number(node.id.split('.').pop())/2))}%`;
    $('model-shift').classList.toggle('visible',!!node.shift);$('game').classList.toggle('shifting',!!node.shift);$('character-wrap').classList.remove('shift');
    if(node.shift){$('model-name').textContent=node.shift.name;$('model-detail').textContent=node.shift.detail;void $('character-wrap').offsetWidth;$('character-wrap').classList.add('shift');}
    $('choices').classList.add('hidden');$('game').classList.remove('choosing');
    fullText=actualText(node);$('dialogue-text').textContent='';
    if(node.inputName){showStation();return;}
    if(instant||settings.speed===0||skipping){completeText();}
    else{isTyping=true;$('advance').classList.add('typing');const chars=Array.from(fullText);let index=0;typingTimer=setInterval(()=>{index++;$('dialogue-text').textContent=chars.slice(0,index).join('');if(index>=chars.length)completeText();},settings.speed);}
  }
  function completeText(){
    clearInterval(typingTimer);isTyping=false;$('advance').classList.remove('typing');$('dialogue-text').textContent=fullText;
    seen.add(state.node);write('seen',[...seen]);
    if(current().choices){stopPlayback();renderChoices();}
    else if(auto&&!$('modal').open){autoTimer=setTimeout(advance,Math.max(1800,settings.autoDelay*1000+fullText.length*40));}
    else if(skipping){scheduleSkip();}
  }
  function renderChoices(){
    const choices=current().choices;$('choices').innerHTML='<header>你决定……</header>';
    choices.forEach((choice,i)=>{
      const button=document.createElement('button');button.className='choice';button.disabled=!!choice.cost&&state.tokens<choice.cost;
      button.innerHTML=`<span class="num">0${i+1}</span><span class="choice-copy"><strong>${escape(choice.text)}</strong><small>${escape(choice.detail||'')}${button.disabled?' · 余额不足':''}</small></span><i data-lucide="arrow-up-right"></i>`;
      button.addEventListener('click',()=>choose(i));$('choices').append(button);
    });$('choices').classList.remove('hidden');$('game').classList.add('choosing');icons();
  }
  function choose(index){
    if(dialogueHidden)return;
    const choice=current().choices?.[index];if(atTitle||!choice||isTyping||$('modal').open||(choice.cost||0)>state.tokens)return;
    activateAudio(true);state.history.push({id:state.node,who:'choice',text:choice.text});
    if(choice.route)state.route=choice.route;
    if(choice.cost)state.tokens-=choice.cost;
    if(choice.affinity&&(choice.affinityTo||state.route))state.affinity[choice.affinityTo||state.route]+=choice.affinity;
    if(choice.flag&&!state.flags.includes(choice.flag))state.flags.push(choice.flag);
    if(choice.intent)state.intent=choice.intent;
    enter(choice.to);
  }
  function advance(){
    if(dialogueHidden){setDialogueHidden(false);return;}
    if(atTitle||current().inputName||$('modal').open||state.finished)return;
    if(isTyping){completeText();return;}
    const node=current();if(node.choices)return;if(node.end){finish();return;}if(node.next)enter(node.next);
  }
  function scheduleSkip(){
    const next=resolveNode(current().next);
    if(current().inputName||current().choices||current().end||!next||!seen.has(next)){skipping=false;$('skip').classList.remove('active');$('skip').setAttribute('aria-pressed','false');toast('已到达未读剧情或选择处');return;}
    skipTimer=setTimeout(advance,95);
  }
  function toggleAuto(){if(atTitle||current().inputName)return;if(state.finished||current().choices){toast('请先作出选择');return;}const enabled=!auto;stopPlayback();auto=enabled;$('auto').classList.toggle('active',auto);$('auto').setAttribute('aria-pressed',String(auto));if(auto&&!isTyping)completeText();}
  function toggleSkip(){if(atTitle||current().inputName)return;if(skipping){stopPlayback();return;}if(!seen.has(state.node)||current().choices){toast('快进只跳过已读剧情');return;}stopPlayback();skipping=true;$('skip').classList.add('active');$('skip').setAttribute('aria-pressed','true');completeText();}

  function openModal(title,content,eyebrow='TOKENIA'){stopPlayback();$('modal-title').textContent=title;$('modal-eyebrow').textContent=eyebrow;$('modal-content').replaceChildren();if(typeof content==='string')$('modal-content').innerHTML=content;else $('modal-content').append(content);if(!$('modal').open)$('modal').showModal();icons();}
  function closeModal(){$('modal').close();}
  function bind(id,fn){$(id).addEventListener('click',fn);}
  function showSettings(){
    openModal('留一点自己的节奏',`
      <label class="setting-row"><div>声音<small>点击音与背景音乐</small></div><input id="setting-sound" type="checkbox" ${settings.sound?'checked':''}></label>
      <label class="setting-row"><div>背景音乐</div><input id="setting-music" aria-label="背景音乐音量" type="range" min="0" max="0.6" step="0.01" value="${settings.music}"></label>
      <label class="setting-row"><div>点击音效</div><input id="setting-sfx" aria-label="点击音效音量" type="range" min="0" max="0.8" step="0.01" value="${settings.sfx}"></label>
      <label class="setting-row"><div>文字间隔 <span id="speed-value">${settings.speed}</span> ms<small>0 为即时显示</small></div><input id="setting-speed" aria-label="文字显示间隔" type="range" min="0" max="65" step="1" value="${settings.speed}"></label>
      <label class="setting-row"><div>自动停留 <span id="delay-value">${settings.autoDelay}</span> s</div><input id="setting-delay" aria-label="自动播放停留时间" type="range" min="1" max="7" step="0.2" value="${settings.autoDelay}"></label>
      <label class="setting-row"><div>减少动态效果</div><input id="setting-motion" type="checkbox" ${settings.reduceMotion?'checked':''}></label>
      <div class="modal-actions"><button class="modal-button" id="about-button"><i data-lucide="info"></i>章节信息</button><button class="modal-button danger" id="restart-button"><i data-lucide="rotate-ccw"></i>重新开始</button></div>`,'PREFERENCES');
    for(const [id,key] of [['setting-music','music'],['setting-sfx','sfx'],['setting-speed','speed'],['setting-delay','autoDelay']])$(id).addEventListener('input',e=>{settings[key]=Number(e.target.value);if(key==='speed')$('speed-value').textContent=settings.speed;if(key==='autoDelay')$('delay-value').textContent=settings.autoDelay;applySettings();activateAudio();});
    $('setting-sound').addEventListener('change',e=>{settings.sound=e.target.checked;applySettings();activateAudio();});
    $('setting-motion').addEventListener('change',e=>{settings.reduceMotion=e.target.checked;applySettings();});
    bind('restart-button',()=>confirmRestart());bind('about-button',showAbout);
  }
  function showAbout(){openModal('AI Love You',`<div class="about"><p>序章 · 未登记的来访者<br>第一章 · 名字写在临时证上<br>第二章 · 课表之外的时间<br>第三章 · 没有写进地图的小路</p><p>你原本只是一个熬夜写代码的学生。直到五个窗口同时亮起，免费额度变成了口袋里唯一的财产。</p><p>人物、组织与能力均为虚构改编。</p><p>角色、背景与插画由你提供。音乐为本地合成的原创暂定配乐；图标使用 Lucide（ISC）。</p></div>`,'COMMON ROUTE');}
  function showRelationships(){
    const rows=Object.keys(ROUTE_LINES).map(id=>{
      const value=state.affinity[id],status=value>=40?'逐渐亲近':value>=20?'多了一点熟悉':value>=10?'开始了解':value>0?'记住了彼此':'初识';
      return `<div class="relationship-row"><div><strong>${CAST[id].name}</strong><small>${status}</small></div><span class="affinity-value">${value}</span><meter min="0" max="100" value="${Math.max(0,Math.min(100,value))}" aria-label="${CAST[id].name} 好感度 ${value}"></meter></div>`;
    }).join('');
    openModal('你们之间',rows,'RELATIONSHIPS');
  }
  function confirmRestart(target='intro.0'){
    openModal('从这里重新出发？',`<p class="empty-note">当前进度会被新的旅程替代，手动存档仍会保留。</p><div class="modal-actions"><button class="modal-button" id="restart-cancel">暂时不</button><button class="modal-button primary" id="restart-confirm">重新出发</button></div>`,'NEW JOURNEY');
    bind('restart-cancel',closeModal);bind('restart-confirm',()=>startNew(target));
  }
  function showHistory(){
    const body=document.createElement('div');
    state.history.forEach(item=>{const row=document.createElement('div');row.className='history-item';row.innerHTML=`<strong style="color:${CAST[item.who]?.color||'#977650'}">${escape(item.who==='choice'?'你的选择':speakerName(item.who))}</strong><p>${escape(item.text)}</p>`;body.append(row);});
    openModal('那些说过的话',body,'BACKLOG');requestAnimationFrame(()=>$('modal').scrollTop=$('modal').scrollHeight);
  }
  function validSave(entry){
    const s=entry?.state;
    if(s&&s.playerName!==undefined&&s.playerName!==''&&!validName(s.playerName))return false;
    return s&&s.version===1&&Object.hasOwn(STORY,s.node)&&Number.isFinite(s.tokens)&&s.tokens>=0&&s.tokens<=1e8&&Array.isArray(s.history)&&s.history.length<=5000&&s.history.every(h=>h&&typeof h.text==='string'&&h.text.length<10000)&&Array.isArray(s.flags)&&typeof s.finished==='boolean'&&['home','explore',null].includes(s.intent)&&s.affinity&&['chatgpt','claude','gemini','deepseek','grok'].every(k=>Number.isFinite(s.affinity[k]))&&(s.route===null||Object.hasOwn(ROUTE_LINES,s.route))&&(!s.finished||STORY[s.node].end)&&(s.route!==null||['intro','crossing','arrival'].includes(s.node.split('.')[0]));
  }
  function restore(entry){if(!validSave(entry)){toast('这份存档无法读取');return;}stopTimers();stopPlayback();state=structuredClone(entry.state);if(state.playerName===undefined)state.playerName='旅人';closeModal();leaveTitle();persist();render(true);if(state.finished)finish();toast('已回到那一刻');}
  function saveTo(slot){if(!write(`slot${slot}`,{state:structuredClone(state),date:Date.now()})){toast('浏览器未允许本地存储，请导出存档备份');return;}toast(`已保存到位置 ${slot}`);showSaves('save');}
  function showSaves(mode){
    const fragment=document.createElement('div');
    for(const slot of [0,1,2,3]){
      const entry=read(slot===0?'autosave':`slot${slot}`,null),valid=validSave(entry),row=document.createElement('div');row.className='save-slot';
      const heading=slot===0?'自动记录':`记忆 ${String(slot).padStart(2,'0')}`;
      row.innerHTML=`<div><strong>${heading}</strong><p>${valid?`${escape(new Date(entry.date).toLocaleString('zh-CN'))} · ${entry.state.tokens.toLocaleString('en-US')} TK`:'尚未留下记录'}</p>${valid?`<div class="slot-preview">${escape(entry.state.route?CAST[entry.state.route].name+' · ':'')}${escape(actualTextForSave(entry.state).slice(0,44))}…</div>`:''}</div>`;
      const button=document.createElement('button');button.className='modal-button';button.textContent=mode==='save'&&slot!==0?'写入':'读取';button.disabled=slot===0&&mode==='save'||mode==='load'&&!valid;
      button.addEventListener('click',()=>{if(mode==='load')restore(entry);else if(valid){openModal(`覆盖记忆 ${slot}？`,`<p class="empty-note">这个位置已有一份记录。覆盖后会换成你现在的进度。</p><div class="modal-actions"><button class="modal-button" id="overwrite-cancel">取消</button><button class="modal-button primary" id="overwrite-confirm">覆盖存档</button></div>`);bind('overwrite-cancel',()=>showSaves(mode));bind('overwrite-confirm',()=>saveTo(slot));}else saveTo(slot);});row.append(button);fragment.append(row);
    }
    const actions=document.createElement('div');actions.className='modal-actions';actions.innerHTML='<button class="modal-button" id="export-save"><i data-lucide="download"></i>导出当前存档</button><button class="modal-button" id="import-save"><i data-lucide="upload"></i>导入存档</button><input id="import-file" type="file" accept="application/json,.json" hidden>';fragment.append(actions);
    openModal(mode==='save'?'把这一刻留下':'回到某一刻',fragment,mode==='save'?'SAVE':'LOAD');
    bind('export-save',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({state,date:Date.now()},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`tokenia-${current().chapter?'chapter'+current().chapter:'prologue'}-save.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('存档已导出');});
    bind('import-save',()=>$('import-file').click());$('import-file').addEventListener('change',async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>2e6)throw new Error('size');const entry=JSON.parse(await file.text());if(!validSave(entry))throw new Error('invalid');restore(entry);}catch{toast('文件不是有效的旅程存档');}});
  }
  function actualTextForSave(saved){const node=STORY[saved.node];return named(ROUTE_LINES[saved.route]?.[node.id]||node.text,saved);}
  function finish(){
    stopTimers();stopPlayback();state.finished=true;persist();$('choices').classList.add('hidden');$('game').classList.remove('choosing');$('game').classList.add('ended');$('dialogue-area').classList.add('hidden');
    const chapter=current().chapter||0,info=chapterInfo(),next=current().continueTo;
    const witness=CAST[state.route]?.name||'未选择';
    $('ending').innerHTML=`<span class="eyebrow">${chapter?'CHAPTER '+chapter:'PROLOGUE'} / COMPLETE</span><h2>${info.ending}</h2><p class="end-copy">${info.copy}</p><div class="end-stats"><div><small>同行见证人</small><strong>${witness}</strong></div><div><small>可用 TOKEN</small><strong>${state.tokens.toLocaleString('en-US')}</strong></div></div><div class="end-rule"></div><p class="end-teaser">${next?'下一章 · '+window.CHAPTERS[STORY[next].chapter].title:'共同篇 · 未完待续'}</p><div class="modal-actions">${next?'<button class="modal-button primary" id="end-continue"><i data-lucide="arrow-right"></i>继续故事</button>':''}<button class="modal-button" id="end-save"><i data-lucide="save"></i>保存旅程</button>${chapter===0?'<button class="modal-button" id="end-replay"><i data-lucide="git-branch"></i>另一位见证人</button>':''}<button class="modal-button" id="end-history"><i data-lucide="list"></i>回看</button></div><p class="end-footer">${next?'共同篇 · 未锁定个人路线':`第${['','一','二','三'][chapter]||chapter}章完 · 后续章节待续`}</p>`;
    $('ending').classList.remove('hidden');bind('end-save',()=>showSaves('save'));bind('end-history',showHistory);
    if(chapter===0)bind('end-replay',()=>confirmRestart('arrival.0'));
    if(next)bind('end-continue',()=>{state.finished=false;enter(next);activateAudio();$('advance').focus({preventScroll:true});});
    icons();
  }
  bind('advance',()=>{activateAudio(true);advance();});bind('auto',()=>{setDialogueHidden(false);activateAudio(true);toggleAuto();});bind('skip',()=>{setDialogueHidden(false);activateAudio(true);toggleSkip();});
  bind('history',showHistory);bind('settings',showSettings);bind('save',()=>showSaves('save'));bind('load',()=>showSaves('load'));bind('close-modal',closeModal);
  bind('relationships',showRelationships);
  bind('toggle-dialogue',()=>setDialogueHidden(!dialogueHidden));
  bind('restore-dialogue',()=>setDialogueHidden(false));
  bind('cg-fit',()=>{settings.cgFit=!settings.cgFit;applySettings();});
  bind('top-edge',()=>setControls('top',!$('game').classList.contains('top-controls-open')));
  bind('bottom-edge',()=>setControls('bottom',!$('game').classList.contains('bottom-controls-open')));
  $('game').addEventListener('pointermove',event=>{
    if(atTitle||$('modal').open||event.pointerType==='touch')return;
    const topHeight=document.querySelector('.topbar').offsetHeight,bottomHeight=document.querySelector('.toolbar').offsetHeight;
    setControls('top',event.clientY<=($('game').classList.contains('top-controls-open')?topHeight:18));
    setControls('bottom',event.clientY>=innerHeight-($('game').classList.contains('bottom-controls-open')?bottomHeight:18));
  });
  $('game').addEventListener('pointerleave',event=>{if(event.pointerType!=='touch')hideControls();});
  $('game').addEventListener('pointerdown',event=>{if(!event.target.closest('.topbar,.toolbar,.edge-reveal,dialog'))hideControls();});
  bind('home',showTitle);bind('title-new',()=>{if(validSave(read('autosave',null)))confirmRestart();else startNew();});
  bind('title-continue',()=>{restore(read('autosave',null));activateAudio();});bind('title-load',()=>showSaves('load'));bind('title-settings',showSettings);
  $('station-form').addEventListener('submit',submitName);
  $('player-name').addEventListener('compositionstart',()=>{composingName=true;});$('player-name').addEventListener('compositionend',()=>{composingName=false;});
  $('player-name').addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.isComposing||composingName))e.preventDefault();});
  $('player-name').addEventListener('input',()=>{$('name-count').textContent=`${Array.from($('player-name').value.trim()).length} / 12`;$('name-error').textContent='';$('player-name').removeAttribute('aria-invalid');});
  bind('sound',()=>{settings.sound=!settings.sound;applySettings();activateAudio(true);toast(settings.sound?'声音已开启':'声音已关闭');});
  bind('brand',e=>{e.preventDefault();showAbout();});
  bind('fullscreen',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await enterFullscreen();}catch{toast('当前浏览器不支持全屏');}});
  document.addEventListener('fullscreenchange',updateFullscreen);
  $('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});
  document.addEventListener('keydown',e=>{
    if(e.ctrlKey||e.metaKey||e.altKey||e.repeat||e.isComposing)return;
    if($('modal').open||atTitle||current().inputName||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName))return;
    if(/INPUT|TEXTAREA|SELECT|BUTTON|A/.test(document.activeElement?.tagName)&&[' ','Enter'].includes(e.key))return;
    if(dialogueHidden){if([' ','Enter','Escape'].includes(e.key)){e.preventDefault();setDialogueHidden(false);}return;}
    if(e.key===' '||e.key==='Enter'){e.preventDefault();activateAudio(true);advance();}
    else if(/^[1-5]$/.test(e.key))choose(Number(e.key)-1);
    else if(e.key.toLowerCase()==='a')toggleAuto();else if(e.key.toLowerCase()==='h')showHistory();else if(e.key.toLowerCase()==='s')showSaves('save');else if(e.key.toLowerCase()==='l')showSaves('load');else if(e.key==='Escape'&&!document.fullscreenElement)showSettings();
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopPlayback();soundEngine?.ctx.suspend().catch(()=>{});}else if(settings.sound)soundEngine?.resume().catch(()=>{});});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clearInterval(titleTimer);else if(atTitle)startTitleSlideshow();});
  window.addEventListener('pagehide',()=>{persist();clearInterval(soundEngine?.timer);clearInterval(titleTimer);});
  $('character').addEventListener('error',()=>toast('角色图片加载失败，请保留 assets 文件夹。'));
  const stageObserver=new ResizeObserver(()=>{
    const rect=$('stage').getBoundingClientRect(),dialogue=$('dialogue-area').getBoundingClientRect();
    $('game').style.setProperty('--art-top',`${rect.top}px`);$('game').style.setProperty('--art-height',`${rect.height}px`);
    $('game').style.setProperty('--dialogue-top',`${dialogue.top}px`);
  });stageObserver.observe($('stage'));
  applySettings();state=blank();
  $('title-background').innerHTML=titlePictures.map((name,i)=>`<img class="title-slide${i===0?' current':''}" src="assets/scene/cg/cg_ch02_${name}.png" alt="" draggable="false">`).join('');$('backdrop').innerHTML=SCENES.room.art;
  showTitle();
  if(!storageOK)toast('浏览器限制了本地存储，可在存档页导出备份');
  for(const id of Object.keys(ROUTE_LINES)){
    for(const sprite of ['default','hello','happy','shy','angry','angry2']){
      const preload=new Image();preload.src=`assets/${id}/${spriteFile(id,sprite)}`;
    }
  }
})();
