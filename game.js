(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const KEY = 'tokenia.chapter1.v1';
  const defaultSettings = {sound:true,music:.18,sfx:.28,speed:26,autoDelay:2.8,reduceMotion:false};
  let storageOK = true;
  function read(key,fallback){try{const value=localStorage.getItem(`${KEY}.${key}`);return value?JSON.parse(value):fallback;}catch{storageOK=false;return fallback;}}
  function write(key,value){try{localStorage.setItem(`${KEY}.${key}`,JSON.stringify(value));return true;}catch{storageOK=false;return false;}}
  let settings = {...defaultSettings,...read('settings',{})};
  let seen = new Set(read('seen',[]));
  let state;
  let typingTimer,autoTimer,skipTimer,toastTimer,stationTimer;
  let atTitle=true,hasJourney=false,connecting=false,composingName=false;
  let isTyping=false,auto=false,skipping=false,fullText='',characterId=undefined,currentBg=null;
  let soundEngine=null;
  const icons = () => window.lucide?.createIcons();
  const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const blank = () => ({version:1,node:'intro.0',playerName:'',tokens:10000,route:null,affinity:{chatgpt:0,claude:0,gemini:0,deepseek:0,grok:0},intent:null,flags:[],history:[],finished:false});
  const current = () => STORY[state.node];
  function actualWho(node){return node.who==='$route'?state.route:node.who;}
  function named(text,saved=state){return text.replaceAll('{name}',saved.playerName||'旅人');}
  function actualText(node){return named(ROUTE_LINES[state.route]?.[node.id]||node.text);}
  function speakerName(who){return who==='you'?(state.playerName||'你'):(CAST[who]?.name||'旁白');}
  function toast(text){clearTimeout(toastTimer);$('toast').textContent=text;$('toast').classList.add('visible');toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2700);}
  function updateSoundIcon(){ $('sound').innerHTML=`<i data-lucide="${settings.sound?'volume-2':'volume-x'}"></i>`;$('sound').title=settings.sound?'关闭声音':'开启声音';$('sound').setAttribute('aria-label',$('sound').title);icons(); }
  function applySettings(){document.documentElement.classList.toggle('reduce-motion',settings.reduceMotion);updateSoundIcon();soundEngine?.volumes();write('settings',settings);}

  class AudioEngine {
    constructor(){
      const AudioContext=window.AudioContext||window.webkitAudioContext;
      if(!AudioContext)throw new Error('Web Audio unavailable');
      this.ctx=new AudioContext();this.music=this.ctx.createGain();this.effects=this.ctx.createGain();
      this.music.connect(this.ctx.destination);this.effects.connect(this.ctx.destination);
      this.step=0;this.nextTime=this.ctx.currentTime+.12;this.volumes();
      this.timer=setInterval(()=>this.schedule(),200);
    }
    volumes(){const t=this.ctx.currentTime;this.music.gain.setTargetAtTime(settings.sound?settings.music:0,t,.12);this.effects.gain.setTargetAtTime(settings.sound?settings.sfx:0,t,.02);}
    async resume(){if(this.ctx.state==='suspended')await this.ctx.resume();if(this.nextTime<this.ctx.currentTime)this.nextTime=this.ctx.currentTime+.08;}
    note(midi,time,duration,volume){
      const base=this.ctx.createOscillator(),harm=this.ctx.createOscillator(),gain=this.ctx.createGain(),hg=this.ctx.createGain();
      base.type='sine';harm.type='triangle';base.frequency.value=440*Math.pow(2,(midi-69)/12);harm.frequency.value=base.frequency.value*2;hg.gain.value=.08;
      base.connect(gain);harm.connect(hg);hg.connect(gain);gain.connect(this.music);
      gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(volume,time+.018);gain.gain.exponentialRampToValueAtTime(.001,time+duration);
      base.start(time);harm.start(time);base.stop(time+duration+.05);harm.stop(time+duration+.05);
      base.onended=()=>{base.disconnect();harm.disconnect();gain.disconnect();hg.disconnect();};
    }
    schedule(){
      if(this.ctx.state!=='running')return;
      // A quiet original 32-bar pentatonic piece, synthesized locally.
      const chords=[[48,55,60,64],[45,52,57,60],[41,48,53,57],[43,50,55,62]];
      const melody=[76,null,79,74,null,72,null,67,72,null,76,79,null,76,74,null,69,null,72,null,76,null,72,69,67,null,74,null,72,null,null,null];
      while(this.nextTime<this.ctx.currentTime+.65){
        const chord=chords[Math.floor(this.step/16)%4];
        if(this.step%4===0)this.note(chord[(this.step/4)%4],this.nextTime,3.8,.19);
        if(this.step%16===0)this.note(chord[0]-12,this.nextTime,5,.13);
        const melodyNote=melody[this.step%32];if(melodyNote!==null)this.note(melodyNote,this.nextTime,2.4,.105);
        this.step++;this.nextTime+=.47;
      }
    }
    click(){if(!settings.sound)return;const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='sine';o.frequency.setValueAtTime(920,t);o.frequency.exponentialRampToValueAtTime(620,t+.04);g.gain.setValueAtTime(.16,t);g.gain.exponentialRampToValueAtTime(.001,t+.055);o.connect(g);g.connect(this.effects);o.start();o.stop(t+.06);o.onended=()=>{o.disconnect();g.disconnect();};}
  }
  function activateAudio(click=false){
    if(!settings.sound)return;
    try{if(!soundEngine)soundEngine=new AudioEngine();soundEngine.resume().catch(()=>{});if(click)soundEngine.click();}catch{settings.sound=false;updateSoundIcon();toast('当前浏览器未能启用声音，仍可继续阅读。');}
  }
  function stopTimers(){clearInterval(typingTimer);clearTimeout(autoTimer);clearTimeout(skipTimer);clearTimeout(stationTimer);}
  function stopPlayback(){auto=false;skipping=false;clearTimeout(autoTimer);clearTimeout(skipTimer);$('auto').classList.remove('active');$('skip').classList.remove('active');$('auto').setAttribute('aria-pressed','false');$('skip').setAttribute('aria-pressed','false');}
  function persist(){if(hasJourney)write('autosave',{state:structuredClone(state),date:Date.now()});}
  function showTitle(){
    persist();stopTimers();stopPlayback();atTitle=true;connecting=false;closeModal();
    $('station-screen').classList.add('hidden');$('game').classList.remove('station-active','portal-active');$('game').classList.add('at-title');$('title-screen').classList.remove('hidden');
    const entry=read('autosave',null);$('title-continue').disabled=!validSave(entry);
    $('title-memory').textContent=validSave(entry)?`${entry.state.playerName||'旅人'} · ${entry.state.finished?'第一章已完成':SCENES[STORY[entry.state.node].bg].title}`:'一场尚未开始的相遇';
    $('title-new').focus({preventScroll:true});
  }
  function leaveTitle(){atTitle=false;hasJourney=true;$('title-screen').classList.add('hidden');$('game').classList.remove('at-title');}
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
    if(!STORY[id]){toast('这段故事暂时没有连接。');return;}
    clearTimeout(toastTimer);$('toast').classList.remove('visible');
    state.node=id;const node=current();
    if(node.grant){state.tokens+=node.grant;toast(`维修报酬 +${node.grant} TK`);}
    state.history.push({id,who:actualWho(node),text:actualText(node)});
    persist();render(false);
  }
  function render(instant=false){
    stopTimers();$('ending').classList.add('hidden');$('dialogue-area').classList.remove('hidden');$('game').classList.remove('ended');
    $('station-screen').classList.add('hidden');$('game').classList.remove('station-active');
    const node=current(),who=CAST[actualWho(node)]||CAST.narration,scene=SCENES[node.bg];
    if(currentBg!==node.bg){$('backdrop').innerHTML=scene.art;currentBg=node.bg;}
    $('scene-index').textContent=scene.index;$('scene-title').textContent=scene.title;$('location').textContent=scene.location;$('scene-note').textContent=scene.note;
    const cid=node.char==='$route'?state.route:node.char;
    if(characterId!==cid){characterId=cid;const img=$('character');$('character-wrap').classList.toggle('empty',!cid);if(cid){img.src=`assets/${cid}-transparent.png`;img.alt=`${CAST[cid].name} 透明底角色立绘`;}else{img.removeAttribute('src');img.alt='';}}
    $('game').classList.toggle('has-character',!!cid);$('game').classList.toggle('portal-active',!!node.portal);
    $('character-tag').style.display=cid?'flex':'none';if(cid){$('character-en').textContent=CAST[cid].name;$('character-role').textContent=CAST[cid].role;}
    document.documentElement.style.setProperty('--accent',cid?CAST[cid].color:who.color);
    $('speaker').textContent=speakerName(actualWho(node));$('speaker-sub').textContent=who.sub;$('speaker-dot').style.background=who.color;
    $('speaker').classList.toggle('long-name',Array.from($('speaker').textContent).length>8);
    $('tokens').textContent=state.tokens.toLocaleString('en-US');$('route-label').textContent=state.route?`${CAST[state.route].name} · 初遇篇`:'共同篇 · 初来乍到';
    $('line-counter').textContent=String(state.history.filter(h=>h.who!=='choice').length).padStart(3,'0');
    const progress = {room:4,campus:15,library:32,council:32,observatory:32,cafe:32,night:32,hall:68,sunset:91};
    $('progress').style.width=`${node.end?100:progress[node.bg]+Math.min(8,Number(node.id.split('.').pop())/2)}%`;
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
    const choice=current().choices?.[index];if(atTitle||!choice||isTyping||$('modal').open||(choice.cost||0)>state.tokens)return;
    activateAudio(true);state.history.push({id:state.node,who:'choice',text:choice.text});
    if(choice.route)state.route=choice.route;
    if(choice.cost)state.tokens-=choice.cost;
    if(choice.affinity&&state.route)state.affinity[state.route]+=choice.affinity;
    if(choice.flag)state.flags.push(choice.flag);
    if(choice.intent)state.intent=choice.intent;
    enter(choice.to);
  }
  function advance(){
    if(atTitle||current().inputName||$('modal').open||state.finished)return;
    if(isTyping){completeText();return;}
    const node=current();if(node.choices)return;if(node.end){finish();return;}if(node.next)enter(node.next);
  }
  function scheduleSkip(){
    const next=current().next;
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
  function showAbout(){openModal('越过屏幕的你',`<div class="about"><p>第一章 · 未登记的来访者</p><p>你原本只是一个熬夜写代码的学生。直到五个窗口同时亮起，免费额度变成了口袋里唯一的财产。</p><p>五位少女，五场相遇。你在这里的第一个选择，会被认真记住。</p><p>原始角色立绘由你提供。场景与音乐为本 Demo 原创；图标使用 Lucide（ISC）。人物、家系与能力均为虚构改编。</p><p>本章完成后，故事暂止于七日旁听的第一晚。</p></div>`,'CHAPTER 01');}
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
    bind('export-save',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({state,date:Date.now()},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='tokenia-chapter1-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('存档已导出');});
    bind('import-save',()=>$('import-file').click());$('import-file').addEventListener('change',async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>2e6)throw new Error('size');const entry=JSON.parse(await file.text());if(!validSave(entry))throw new Error('invalid');restore(entry);}catch{toast('文件不是有效的第一章存档');}});
  }
  function actualTextForSave(saved){const node=STORY[saved.node];return named(ROUTE_LINES[saved.route]?.[node.id]||node.text,saved);}
  function finish(){
    stopTimers();stopPlayback();state.finished=true;persist();$('choices').classList.add('hidden');$('game').classList.remove('choosing');$('game').classList.add('ended');$('dialogue-area').classList.add('hidden');
    const name=CAST[state.route].name;const affinity=state.affinity[state.route];
    $('ending').innerHTML=`<span class="eyebrow">CHAPTER 01 / COMPLETE</span><h2>今天，先留下来。</h2><p class="end-copy">回家的路还没有找到。<br>但在这个陌生的世界，<br>已经有人对你说了「明天见」。</p><div class="end-stats"><div><small>第一场相遇</small><strong>${name}</strong></div><div><small>可用 TOKEN</small><strong>${state.tokens.toLocaleString('en-US')}</strong></div><div><small>你们之间</small><strong>${affinity>=3?'多了一点默契':affinity>=2?'初生的信任':'记住了彼此'}</strong></div></div><div class="end-rule"></div><p class="end-teaser">第二章 · 七日旁听<br>${ROUTE_LINES[state.route].teaser}</p><div class="modal-actions"><button class="modal-button primary" id="end-save"><i data-lucide="save"></i>保存旅程</button><button class="modal-button" id="end-replay"><i data-lucide="git-branch"></i>另一场初遇</button><button class="modal-button" id="end-history"><i data-lucide="list"></i>回看</button></div><p class="end-footer">第一章 DEMO 完 · 第二章尚未开放</p>`;
    $('ending').classList.remove('hidden');bind('end-save',()=>showSaves('save'));bind('end-replay',()=>confirmRestart('arrival.7'));bind('end-history',showHistory);icons();
  }
  bind('advance',()=>{activateAudio(true);advance();});bind('auto',()=>{activateAudio(true);toggleAuto();});bind('skip',()=>{activateAudio(true);toggleSkip();});
  bind('history',showHistory);bind('settings',showSettings);bind('save',()=>showSaves('save'));bind('load',()=>showSaves('load'));bind('close-modal',closeModal);
  bind('home',showTitle);bind('title-new',()=>{if(validSave(read('autosave',null)))confirmRestart();else startNew();});
  bind('title-continue',()=>{restore(read('autosave',null));activateAudio();});bind('title-load',()=>showSaves('load'));bind('title-settings',showSettings);
  $('station-form').addEventListener('submit',submitName);
  $('player-name').addEventListener('compositionstart',()=>{composingName=true;});$('player-name').addEventListener('compositionend',()=>{composingName=false;});
  $('player-name').addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.isComposing||composingName))e.preventDefault();});
  $('player-name').addEventListener('input',()=>{$('name-count').textContent=`${Array.from($('player-name').value.trim()).length} / 12`;$('name-error').textContent='';$('player-name').removeAttribute('aria-invalid');});
  bind('sound',()=>{settings.sound=!settings.sound;applySettings();activateAudio(true);toast(settings.sound?'声音已开启':'声音已关闭');});
  bind('brand',e=>{e.preventDefault();showAbout();});
  bind('fullscreen',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('当前浏览器不支持全屏');}});
  $('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});
  document.addEventListener('keydown',e=>{
    if(e.ctrlKey||e.metaKey||e.altKey||e.repeat||e.isComposing)return;
    if($('modal').open||atTitle||current().inputName||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName))return;
    if(/INPUT|TEXTAREA|SELECT|BUTTON|A/.test(document.activeElement?.tagName)&&[' ','Enter'].includes(e.key))return;
    if(e.key===' '||e.key==='Enter'){e.preventDefault();activateAudio(true);advance();}
    else if(/^[1-5]$/.test(e.key))choose(Number(e.key)-1);
    else if(e.key.toLowerCase()==='a')toggleAuto();else if(e.key.toLowerCase()==='h')showHistory();else if(e.key.toLowerCase()==='s')showSaves('save');else if(e.key.toLowerCase()==='l')showSaves('load');else if(e.key==='Escape')showSettings();
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopPlayback();soundEngine?.ctx.suspend().catch(()=>{});}else if(settings.sound)soundEngine?.resume().catch(()=>{});});
  window.addEventListener('pagehide',()=>{persist();clearInterval(soundEngine?.timer);});
  $('character').addEventListener('error',()=>toast('角色图片加载失败，请保留 assets 文件夹。'));
  applySettings();state=blank();
  $('title-background').innerHTML=SCENES.campus.art;$('backdrop').innerHTML=SCENES.room.art;
  showTitle();
  if(!storageOK)toast('浏览器限制了本地存储，可在存档页导出备份');
  for(const id of Object.keys(ROUTE_LINES)){const preload=new Image();preload.src=`assets/${id}-transparent.png`;}
})();
