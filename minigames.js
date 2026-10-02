(() => {
  'use strict';
  const activities = {
    parts: {
      title:'合不上盖的零件盒', label:'帮忙收好零件', icon:'wrench', who:'deepseek',
      anchor:'你低头捧住杯子。她也低头整理零件。',
      intro:'DeepSeek：盒盖又卡住了……这几颗大的放回对应的格子就好，小的我来。',
      success:'DeepSeek 按下盒盖，终于听见清脆的一声“咔”。“谢谢。下次得换个大盒子。”她看了一眼价格标签，又把标签翻了过去。'
    },
    potatoes: {
      title:'今天只种这一排', label:'陪她种土豆', icon:'sprout', who:'chatgpt',
      anchor:'今天只种完这一排。你不用陪到很晚。',
      intro:'ChatGPT：叶子黄的已经熟了。收起来以后，在空地上补一颗……那些小的先留着。',
      success:'最后一块空地冒出新芽。ChatGPT 放下锄头，挨着你坐好。“这次没有少东西。”停了一会儿，她又说：“还多了个人。”'
    },
    route: {
      title:'一条真正走得通的路', label:'一起核对路线', icon:'map', who:'gemini',
      anchor:'她走回来，和你一起蹲低了一点。画面里多出半个收货筐',
      intro:'Gemini：从相机这里到路牌，得绕开维修围栏。每次只接上旁边的一格，我们沿着你画的线再走一遍。',
      success:'Gemini 沿着路线走到路牌前，回头向你挥手。“这次拍进去吧。”她站在箭头旁边，没有为了画面好看把自己挪开。'
    }
  };
  // Exact prose anchors survive regenerated chapter IDs and fail loudly if an event moves.
  for (const [id, activity] of Object.entries(activities)) {
    const matches=Object.values(window.STORY).filter(node=>node.text.includes(activity.anchor));
    if(matches.length!==1)throw Error(`Activity anchor ${id}: expected one passage, found ${matches.length}`);
    matches[0].activity=id;
  }
  const parts=[0,1,2,1,0,2];
  const blocked=[1,2,5,6,11,12];
  const ripe=[0,2,3,5,6,8];
  function initial(id){
    if(id==='parts')return {placed:[],selected:null};
    if(id==='potatoes')return {cells:Array.from({length:9},(_,i)=>ripe.includes(i)?0:2)};
    return {path:[0]};
  }
  function move(id, state, action){
    const next=JSON.parse(JSON.stringify(state));
    let message='';
    if(id==='parts') {
      if(action.type==='select'&&!next.placed.includes(action.value))next.selected=action.value;
      if(action.type==='slot'&&next.selected!==null){
        if(parts[next.selected]===action.value){next.placed.push(next.selected);next.selected=null;message='DeepSeek：对，就是这个格。';}
        else message='DeepSeek：那个格太窄了。先别硬塞，我以前试过……';
      }
    } else if(id==='potatoes') {
      const value=action.value;
      if(next.cells[value]===0){next.cells[value]=1;message='ChatGPT：收好了。这一格再补一颗。';}
      else if(next.cells[value]===1){next.cells[value]=2;message='ChatGPT：嗯，明天再来看它。';}
      else message='ChatGPT：这颗还小，先别拔。';
    } else {
      const last=next.path.at(-1),value=action.value;
      if(next.path.length>1&&value===next.path.at(-2)){next.path.pop();message='Gemini：退一步也算实地考察。';}
      else if(blocked.includes(value))message='Gemini：围栏还没拆，我们走旁边。';
      else if(!next.path.includes(value)&&Math.abs(last%4-value%4)+Math.abs(Math.floor(last/4)-Math.floor(value/4))===1){next.path.push(value);message='Gemini：这一段我记下了。';}
      else message='Gemini：中间这段也要能走过去才行。';
    }
    return {state:next,message,done:id==='parts'?next.placed.length===parts.length:id==='potatoes'?next.cells.every(value=>value===2):next.path.at(-1)===15};
  }
  function mount(id, onFinish){
    const config=activities[id],root=document.createElement('section');root.className=`activity activity-${id}`;
    root.innerHTML='<p class="activity-intro"></p><div class="activity-meter"></div><div class="activity-board"></div><p class="activity-response" role="status" aria-live="polite"></p><div class="activity-actions"></div>';
    root.querySelector('.activity-intro').textContent=config.intro;
    let state=initial(id),finished=false;
    const board=root.querySelector('.activity-board'),meter=root.querySelector('.activity-meter'),response=root.querySelector('.activity-response'),actions=root.querySelector('.activity-actions');
    function button(label,icon,action,extra=''){
      const b=document.createElement('button');b.type='button';b.title=label;b.setAttribute('aria-label',label);b.className=extra;
      b.innerHTML=`<i data-lucide="${icon}"></i><span></span>`;b.querySelector('span').textContent=label;
      b.addEventListener('click',action);return b;
    }
    function act(action){
      if(finished)return;
      const result=move(id,state,action);state=result.state;response.textContent=result.message;
      if(result.done){finished=true;onFinish('complete');response.textContent=config.success;}
      draw();
    }
    function draw(){
      const focusKey=root.contains(document.activeElement)?document.activeElement.dataset.key:null;
      board.replaceChildren();actions.replaceChildren();
      if(id==='parts'){
        meter.textContent=`已归位 ${state.placed.length} / 6`;
        const tray=document.createElement('div');tray.className='parts-tray';
        const icons=['circle','triangle','square'],names=['圆形垫片','三角接头','方形模块'];
        parts.forEach((shape,i)=>{
          const b=button(names[shape],icons[shape],()=>act({type:'select',value:i}),'part-piece');b.dataset.key=`piece-${i}`;
          b.disabled=finished||state.placed.includes(i);b.setAttribute('aria-pressed',String(state.selected===i));if(state.placed.includes(i))b.classList.add('placed');tray.append(b);
        });board.append(tray);
        const slots=document.createElement('div');slots.className='parts-slots';
        names.forEach((name,i)=>{const b=button(`${name}格`,icons[i],()=>act({type:'slot',value:i}),'part-slot');b.dataset.key=`slot-${i}`;b.disabled=finished;slots.append(b);});board.append(slots);
      }else if(id==='potatoes'){
        meter.textContent=`已补种 ${ripe.filter(i=>state.cells[i]===2).length} / 6`;
        board.classList.add('potato-field');
        state.cells.forEach((value,i)=>{
          const label=value===0?'成熟土豆':value===1?'空地':'新芽';
          const b=button(`${i+1}号田 · ${label}`,value===0?'leaf':value===1?'shovel':'sprout',()=>act({value:i}),'field-cell');b.querySelector('span').textContent=label;b.dataset.key=`cell-${i}`;b.dataset.stage=String(value);b.disabled=finished;board.append(b);
        });
      }else {
        meter.textContent=finished?'路牌就在这里':`已核对 ${state.path.length-1} 段步道`;
        board.classList.add('route-grid');
        for(let i=0;i<16;i++){
          const obstacle=blocked.includes(i),onPath=state.path.includes(i),label=i===0?'相机位置':i===15?'路牌':obstacle?'维修围栏':`步道 ${i+1}`;
          const icon=i===0?'camera':i===15?'signpost':obstacle?'construction':onPath?'footprints':'circle';
          const b=button(label,icon,()=>act({value:i}),'route-cell');b.dataset.key=`cell-${i}`;b.classList.toggle('on-path',onPath);b.classList.toggle('blocked',obstacle);b.setAttribute('aria-pressed',String(onPath));b.disabled=finished;board.append(b);
        }
      }
      if(!finished){
        actions.append(button('重新开始','rotate-ccw',()=>{state=initial(id);response.textContent='';draw();},'activity-reset'));
      }else actions.append(button('继续剧情','arrow-right',()=>onFinish('continue'),'modal-button primary'));
      window.lucide?.createIcons({root});
      if(focusKey){const candidates=[...root.querySelectorAll('[data-key]')];const target=candidates.find(b=>b.dataset.key===focusKey&&!b.disabled)||candidates.find(b=>!b.disabled)||actions.querySelector('button');target?.focus({preventScroll:true});}
    }
    draw();return root;
  }
  window.STORY_ACTIVITIES={activities,initial,move,mount};
})();
