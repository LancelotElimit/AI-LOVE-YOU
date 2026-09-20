const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const third = require('../story/chapter-three-production.cjs');
const root = path.resolve(__dirname, '..');
const cast = ['chatgpt', 'claude', 'gemini', 'deepseek', 'grok'];
const names = ['ChatGPT', 'Claude', 'Gemini', 'DeepSeek', 'Grok'];
const chapters = [null, '名字写在临时证上', '课表之外的时间', '没有写进地图的小路'];
const baseLooks = {
  1: ['chatgpt_terra_white_dress_calm', 'claude_sonnet_book_dress_calm', 'gemini_meteor_white_jacket_calm', 'deepseek_eco_blue_maid_calm', 'grok_night_red_black_jacket_calm'],
  2: ['chatgpt_terra_green_cardigan_calm', 'claude_haiku_black_cardigan_calm', 'gemini_meteor_white_jacket_calm', 'deepseek_engineer_white_apron_calm', 'grok_night_red_black_jacket_calm'],
  3: ['chatgpt_terra_green_cardigan_calm', 'claude_haiku_black_cardigan_calm', 'gemini_meteor_white_jacket_calm', 'deepseek_eco_blue_jacket_calm', 'grok_night_red_black_jacket_calm']
};
const backgrounds = {
  campus_inner_road_morning: '校内步道 / 上午', lecture_hall_corridor_day: '中央讲堂 · 东侧走廊 / 白天',
  inquiry_room_day: '中央讲堂 · 会客室 / 白天', outer_ring_repair_bay_day: '外环 · 维修间 / 下午',
  cafeteria_evening: '校园食堂 / 傍晚', guest_room_first_night: '暂住楼 · 房间 / 夜晚',
  library_after_hours: '图书馆 / 闭馆后', guest_room_morning: '暂住楼 · 房间 / 清晨',
  cafeteria_morning: '校园食堂 / 早晨', public_classroom_day: '公开课教室 / 上午',
  observation_greenhouse_day: '观测部 · 温室 / 午后', newsroom_afternoon: '校园报社 / 白天',
  student_office_noon: '学生会 · 窗边 / 白天', library_reading_day: '图书馆 · 阅览区 / 白天',
  side_street_drink_shop_day: '校内小街 · 饮料店 / 上午', deepsea_workshop_day: '深海工坊 / 白天',
  parts_pickup_counter_day: '零件取货点 / 上午', observatory_terrace_afternoon: '观测部 · 露台 / 午后',
  activity_meeting_room_dusk: '活动楼 · 会议室 / 傍晚', activity_lobby_rain_evening: '活动楼 · 门厅 / 雨中',
  guest_room_rainy_night: '暂住楼 · 房间 / 雨夜'
};
const scenes = {};
for (const [key, location] of Object.entries(backgrounds)) {
  const filename = `bg_${key}.png${key === 'parts_pickup_counter_day' ? '.png' : ''}`;
  const src = `assets/scene/bg/${filename}`;
  if (!fs.existsSync(path.join(root, src))) throw Error(`Missing background: ${src}`);
  scenes[key] = {index:'COMMON ROUTE', title:location.split(' / ')[0], location, note:'', image:src,
    art:`<img class="scene-image" src="${src}" alt="" draggable="false">`};
}
for(const [key,[location,fallback]] of Object.entries(third.backgrounds)) {
  const desired=`assets/scene/bg/bg_${key}.png`,available=fs.existsSync(path.join(root,desired));
  const image=available?desired:scenes[fallback].image;
  scenes[key]={index:'CHAPTER 3',title:location.split(' / ')[0],location,note:'',image,placeholder:!available,
    art:`<img class="scene-image" src="${image}" alt="" draggable="false">`};
}
const cgNames = ['ch01_chatgpt_sol_pouring_water', 'ch01_claude_records_after_hours', 'ch01_deepseek_toolbox_balance', 'ch01_temporary_id_at_desk', 'ch01_unsent_message_night', 'ch02_chatgpt_tea_break', 'ch02_claude_book_by_window', 'ch02_deepseek_delivery_done', 'ch02_five_girls_under_eaves', 'ch02_gemini_greenhouse_camera', 'ch02_gemini_sour_drink', 'ch02_grok_rocket_alignment'];
for (const key of cgNames) {
  const src = `assets/scene/cg/cg_${key}.png`;
  if (!fs.existsSync(path.join(root, src))) throw Error(`Missing CG: ${src}`);
  scenes[key] = {index:'',title:'',location:'',note:'',cg:true,image:src,
    art:`<img class="scene-image" src="${src}" alt="" draggable="false">`};
}
// Each source scene has an explicit location and score. Performance notes stay out of dialogue.
const staging = {
  ...third.staging,
  '1-01':['campus_inner_road_morning','B01'], '1-02':['lecture_hall_corridor_day','silence'],
  '1-03':['inquiry_room_day','B02'], '1-04':['inquiry_room_day','silence'],
  '1-05':['inquiry_room_day','B02'], '1-06':['inquiry_room_day','B03'],
  '1-07':['outer_ring_repair_bay_day','B03'], '1-08':['inquiry_room_day','silence'],
  '1-09':['lecture_hall_corridor_day','B04'], '1-10':['guest_room_first_night','silence'],
  '1-11':['library_after_hours','silence'], '2-01':['guest_room_morning','silence'],
  '2-02':['public_classroom_day','silence'], '2-03':['observation_greenhouse_day','B12'],
  '2-04':['newsroom_afternoon','silence'], '2-05':['guest_room_first_night','B05'],
  '2-06':['campus_inner_road_morning','B06'], '2-07A':['student_office_noon','B10'],
  '2-07B':['library_reading_day','B11'], '2-07C':['side_street_drink_shop_day','B12'],
  '2-07D':['deepsea_workshop_day','B13'], '2-07E':['newsroom_afternoon','B14'],
  '2-08':['lecture_hall_corridor_day','B06'], '2-09A':['student_office_noon','B10'],
  '2-09B':['library_reading_day','B11'], '2-09C':['observatory_terrace_afternoon','B12'],
  '2-09D':['deepsea_workshop_day','B13'], '2-09E':['newsroom_afternoon','B14'],
  '2-10':['activity_meeting_room_dusk','B08'], '2-11':['activity_lobby_rain_evening','B08'],
  '2-12':['guest_room_rainy_night','B09']
};
// Cues use exact source anchors and are checked during compilation, so edits cannot silently orphan an image.
const cues = {
  ...third.cues,
  '1-01': [['闸机在身后合上。',{music:'silence'}],['你等了一会儿，没听见新的警报。',{music:'B01'}]],
  '1-03': [['ChatGPT 正把两份不同颜色的表格分开。',{char:'chatgpt'}],['另一边，橙发女孩合上一本薄册',{char:'claude'}]],
  '1-05': [['一束细光沿着发扣亮起。',{look:['chatgpt','chatgpt_sol_white_workwear_calm'],char:'chatgpt',music:'B10-Sol',shift:{name:'5.6 Sol',detail:'集中核对登记材料'}}],
    ['还记得要给你添水。',{bg:'ch01_chatgpt_sol_pouring_water'}],['你坐回去。ChatGPT 的视线',{bg:'inquiry_room_day',char:'chatgpt',look:['chatgpt','chatgpt_sol_white_workwear_focused']}]],
  '1-06': [['后半句显然不是对你们说的。',{char:null}],['我给值班人员开一次往返许可',{char:'chatgpt'}]],
  '1-07': [['回到维修区时',{char:'deepseek'}],
    ['她将工具箱放到脚边，掌心的蓝光',{char:'deepseek',look:['deepseek','deepseek_engineer_white_apron_calm'],shift:{name:'工程',detail:'并排核对登记记录'}}],
    ['她把一份整理好的记录发了出去',{music:'B13',look:['deepseek','deepseek_engineer_white_apron_calm']}],
    ['她扶着工作台起身',{bg:'ch01_deepseek_toolbox_balance'}],['她把凳子踢到',{bg:'outer_ring_repair_bay_day',char:'deepseek'}]],
  '1-08': [['照片上的人看起来',{music:'B07'}],['ChatGPT 已经换回',{char:'chatgpt',music:'B02',shift:{name:'5.6 Terra',detail:'继续日常安排'}}]],
  '1-09': [['第二张照片拍完时',{char:'deepseek',look:['deepseek','deepseek_engineer_white_apron_calm']}],
    ['到了食堂，她替自己买了份打包饭',{bg:'cafeteria_evening'}],['她说完就提着饭和工具箱走了',{char:null}]],
  '1-10': [['房间不大。',{music:'B05'}],['你先确认浴室和窗户',{bg:'ch01_temporary_id_at_desk'}],
    ['你从口袋里拿出手机',{bg:'ch01_unsent_message_night',music:'silence'}]],
  '1-11': [['图书馆最后一盏阅览灯关掉时',{bg:'ch01_claude_records_after_hours'}],['提前了七分钟',{music:'B15'}],['Claude 合上材料',{music:'silence'}]],
  '2-01': [['食堂的早餐牌比昨晚',{bg:'cafeteria_morning',music:'B06'}]],
  '2-03': [['有人踩在矮梯上调整镜头',{bg:'ch02_gemini_greenhouse_camera'}],['这里不是公开展览吗',{bg:'observation_greenhouse_day',char:'gemini'}]],
  '2-04': [['一间门没关严的屋子',{char:'grok'}],['视线碰上以后',{music:'B14'}]],
  '2-07A': [['学生会窗口前只剩下两个人',{char:'chatgpt'}],['她倒好茶',{bg:'ch02_chatgpt_tea_break'}],['十分钟到了',{bg:'student_office_noon',char:'chatgpt'}]],
  '2-07B': [['图书馆接待台上摊着几本旧书',{char:'claude',look:['claude','claude_haiku_black_cardigan_focused']}]],
  '2-07C': [['她把相机挂稳',{char:'gemini'}],['拍完以后，她买了杯',{bg:'ch02_gemini_sour_drink'}]],
  '2-07D': [['工坊门只开了半扇',{char:'deepseek',look:['deepseek','deepseek_eco_blue_jacket_calm']}],
    ['你们到取货点时',{bg:'parts_pickup_counter_day'}],['她在到达工坊后',{bg:'deepsea_workshop_day'}]],
  '2-07E': [['报社桌上比昨天整齐了一点',{char:'grok'}]],
  '2-09A': [['ChatGPT 收到你的询问后',{char:'chatgpt'}]],
  '2-09B': [['图书馆午后的座位比上午多',{char:'claude'}],['你在窗边读了几页',{bg:'ch02_claude_book_by_window'}],['借书时，你翻出书签',{bg:'library_reading_day',char:'claude'}]],
  '2-09C': [['Gemini 约你在观测部外侧',{char:'gemini'}]],
  '2-09D': [['工坊里的箱子已经拆开',{char:'deepseek',look:['deepseek','deepseek_eco_blue_jacket_calm']}],
    ['细细的蓝线沿着袖口展开',{char:'deepseek',look:['deepseek','deepseek_engineer_white_apron_calm'],shift:{name:'工程',detail:'交付前的最后检查'}}],
    ['好了。今天这一件结束。',{bg:'ch02_deepseek_delivery_done'}]],
  '2-09E': [['Grok 回复你时',{char:'grok'}],['你按住底座',{bg:'ch02_grok_rocket_alignment'}],['她将模型放回盒子',{bg:'newsroom_afternoon',char:'grok'}]],
  '2-11': [['你们走到楼下',{bg:'ch02_five_girls_under_eaves'}],['ChatGPT 打开伞',{bg:'activity_lobby_rain_evening',char:null}]],
  '2-12': [['现实那边仍然没有新消息',{music:'silence'}]]
};
const speakerIds = {'旁白':'narration','你':'you','系统':'system','值班同学':'attendant','同学':'student','老师':'teacher','食堂工作人员':'cafeteriaStaff','报社同学':'reporter','店主':'shopkeeper','孩子':'child'};
const expressions = {
  '1-03': [['坐吧。水是温的。','chatgpt_terra_white_dress_smile'],['Claude 把记录推过来','claude_sonnet_book_dress_focused']],
  '1-04': [['有没有提示音？','claude_sonnet_book_dress_confused'],['我想留存消息内容','claude_sonnet_book_dress_focused']],
  '1-05': [['外层会跟着变一点','chatgpt_sol_white_workwear_thinking']],
  '1-08': [['房间安排好了','chatgpt_terra_white_dress_smile']],
  '2-03': [['这张得撤了','gemini_meteor_white_jacket_curious'],['她重新看向取景框','gemini_meteor_white_jacket_focused'],['下次来，记得挑公开的时候','gemini_meteor_white_jacket_happy']],
  '2-04': [['问号不是你乱写的理由','grok_night_red_black_jacket_angry'],['行。不拍照，先记几句','grok_night_red_black_jacket_focused']],
  '2-07B': [['你的书签放在中间','claude_haiku_black_cardigan_unimpressed']],
  '2-07E': [['嗯，划掉。','grok_night_red_black_jacket_focused'],['我也在等它的采访记录','grok_night_red_black_jacket_focused']],
  '2-09B': [['这一条要管。','claude_haiku_black_cardigan_unimpressed']],
  '2-09E': [['我擦干净就是了。','grok_night_red_black_jacket_amused']]
};
names.forEach((name,i)=>speakerIds[name]=cast[i]);
const npc = Object.fromEntries(Object.entries(speakerIds).filter(([,id])=>!['narration','you','system',...cast].includes(id)).map(([name,id])=>[id,{name,sub:'',color:'#82948a'}]));
const conditionalRules = {
  '若序章没有选择 Claude：':{notRoute:'claude'}, '若序章选择了 Claude：':{route:'claude'},
  '若序章未选 Gemini：':{notRoute:'gemini'}, '若序章选过 Gemini：':{route:'gemini'},
  '若序章未选 Grok：':{notRoute:'grok'}, '若序章选过 Grok：':{route:'grok'},
  '若上午选择了 ChatGPT，且谈过“半个故事”：':{flag:'c2-07A-choice1:1'},
  '若上午选择了 ChatGPT，且选择安静相处：':{flag:'c2-07A-choice1:2'},
  '若本次谈过“半个故事”：':{flag:'c2-07A-choice1:1'},
  '若本次选择安静相处：':{flag:'c2-07A-choice1:2'},
  '若上午选择了其他人：':null,
  '若上午也选择了 DeepSeek：':{flag:'c2-slot1:deepseek'}
};
for(const [number,chinese] of [[2,'二'],[3,'三']])for(const [i,name] of names.entries()) {
  conditionalRules[`若第${chinese}章上午选择了 ${name}：`]={flag:`c${number}-slot1:${cast[i]}`};
  conditionalRules[`若第${chinese}章上午未见 ${name}：`]={notFlag:`c${number}-slot1:${cast[i]}`};
}
for(const name of ['ChatGPT','Claude']) {
  const id=speakerIds[name];
  conditionalRules[`若第二章两个时段都未见 ${name}：`]=[{notFlag:`c2-slot1:${id}`},{notFlag:`c2-slot2:${id}`}];
}
conditionalRules['若第二章上午见过 DeepSeek、下午未见：']=[{flag:'c2-slot1:deepseek'},{notFlag:'c2-slot2:deepseek'}];
// Reuse published IDs for unchanged passages, including when new dialogue is inserted between them.
const previousFile=path.join(root,'story/chapters/common.generated.js');
let previous={};
if(fs.existsSync(previousFile)) {
  const scope={window:{CAST:{},SCENES:{},STORY:{'last.5':{}}}};
  vm.runInNewContext(fs.readFileSync(previousFile,'utf8'),scope);
  previous=scope.window.STORY;
}
const nodes = {};
for (const chapter of [1,2,3]) {
  const file = `剧情正文/第${['','一','二','三'][chapter]}章-${chapters[chapter]}.md`;
  const source = fs.readFileSync(path.join(root,file),'utf8');
  const sections = [...source.matchAll(/^## (\d\d[A-E]?) · (.+)\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)];
  const chapterNodes = [];
  for (const [, section, title, body] of sections) {
    const key = `${chapter}-${section}`, config = staging[key];
    if (!config) throw Error(`Unstaged section ${key}`);
    const list = [], looks = Object.fromEntries(cast.map((id,i)=>[id,baseLooks[chapter][i]]));
    if (chapter === 1 && section === '06') looks.chatgpt = 'chatgpt_sol_white_workwear_calm';
    if (chapter === 3 && section === '11') looks.gemini='gemini_starmap_star_cape_calm';
    let stage = {bg:config[0],music:config[1],char:null};
    const letter = section.match(/^(07|09)([A-E])$/);
    const baseWhen = chapter >= 2 && letter ? [{flag:`c${chapter}-slot${letter[1] === '07' ? 1 : 2}:${cast[letter[2].charCodeAt(0)-65]}`}]:[];
    const prior=Object.values(previous).filter(n=>n.chapter===chapter&&n.section===section),used=new Set();let added=0;
    let when = [...baseWhen], single = false, choice = null, choiceIndex = 0, choiceHost = null, freeSlot = null;
    const pendingCues = (cues[key] || []).map(([anchor,patch])=>({anchor,patch,used:false}));
    function emit(who, text, extra = {}) {
      let shift;
      for (const cue of pendingCues) if (!cue.used && text.includes(cue.anchor)) {
        cue.used = true;
        const {look,shift:transition,...rest} = cue.patch;
        Object.assign(stage,rest);if (look) looks[look[0]] = look[1];if (transition) shift = transition;
      }
      const message = extra.delivery === '消息';
      const offscreen = chapter === 1 && section === '06' && who === 'deepseek';
      if (cast.includes(who) && !message && !offscreen) stage.char = who;
      const cg = scenes[stage.bg].cg;
      const char = cg || message || offscreen ? null : stage.char;
      const same=prior.find(n=>!used.has(n.id)&&n.who===who&&n.text===text&&JSON.stringify(n.when||[])===JSON.stringify(when));
      let id=same?.id||`c${chapter}.${section}.${list.length}`;
      if(!same&&prior.length){do{id=`c${chapter}.${section}.added${++added}`;}while(previous[id]||used.has(id));}
      used.add(id);
      const node = {id,chapter,section,title,bg:stage.bg,music:stage.music,who,text,char,
        ...(char ? {sprite:looks[char]} : {}), ...(when.length ? {when:[...when]} : {}),...extra};
      const expression=(expressions[key]||[]).find(([anchor])=>text.includes(anchor));
      if(expression&&!cg&&!message&&!offscreen){node.char=expression[1].split('_')[0];node.sprite=expression[1];}
      if (shift) node.shift = shift;
      list.push(node);
      if (choice && choice.to === null) choice.to = node.id;
      if (single) {when=[...baseWhen];single=false;stage.char=null;}
      return node;
    }
    for (const raw of body.split(/\r?\n/)) {
      const line = raw.trim();if (!line) continue;
      let match;
      if ((match=line.match(/^### 同行者是 (\w+)$/))) {stage.char=speakerIds[match[1]];when=[{route:stage.char}];continue;}
      if (line === '### 门口交接') {when=[...baseWhen];stage.char=null;continue;}
      if ((match=line.match(/^同行者为 (\w+) 时：$/))) {when=[{route:speakerIds[match[1]]}];single=true;continue;}
      if (Object.hasOwn(conditionalRules,line)) {
        const condition = conditionalRules[line] || {notFlag:`c2-slot1:${section === '09D' ? 'deepseek':'chatgpt'}`};
        when=[...baseWhen,...(Array.isArray(condition)?condition:[condition])];continue;
      }
      if (/^(分支)?汇合：$/.test(line)) {when=[...baseWhen];choice=null;continue;}
      if (line.startsWith('### 选择：')) {
        choiceIndex++;choiceHost=list.at(-1);
        if (!choiceHost || choiceHost.choices) throw Error(`Invalid choice anchor ${key}`);
        choiceHost.choices=[];continue;
      }
      if ((match=line.match(/^选项([一二])：(.+)$/))) {
        const value=match[1] === '一' ? 1:2;
        const flag=`c${chapter}-${section}-choice${choiceIndex}:${value}`;
        choice={text:match[2].replace(/。$/,''),flag,to:null};choiceHost.choices.push(choice);
        when=[...baseWhen,{flag}];continue;
      }
      if (/^### 第[一二]个自由时段$/.test(line)) {
        freeSlot=line.includes('第一个') ? 1:2;choiceHost=list.at(-1);choiceHost.choices=[];continue;
      }
      if (line === '玩家选项：') continue;
      if (line.startsWith('- ') && freeSlot) {
        const index=choiceHost.choices.length;
        choiceHost.choices.push({text:line.slice(2).replace(/。$/,''),flag:`c${chapter}-slot${freeSlot}:${cast[index]}`,to:`c${chapter}.${freeSlot === 1 ? '07':'09'}${String.fromCharCode(65+index)}.0`});continue;
      }
      if ((match=line.match(/^([^：]+)：(.+)$/))) {
        const label=match[1].replace(/（消息）$/,''), who=speakerIds[label];
        if (!who) throw Error(`Unknown speaker in ${key}: ${label}`);
        let text=match[2];const extra=match[1].endsWith('（消息）') ? {delivery:'消息'}:{};
        if (text.startsWith('借书时，你翻出书签。上午来过的话')) {
          const saved=when;when=[...baseWhen,{flag:'c2-slot1:claude'}];
          emit(who,'借书时，你翻出书签。Claude 看见书签已经移到了正确的位置。');
          when=[...baseWhen,{notFlag:'c2-slot1:claude'}];emit(who,'借书时，你翻出书签。Claude 将借阅期限指给你看。');when=saved;continue;
        }
        emit(who,text,extra);continue;
      }
      if (/^第[一二三]章完。$/.test(line)) continue;
      throw Error(`Unrecognized narrative instruction ${key}: ${line}`);
    }
    for (const cue of pendingCues) if (!cue.used) throw Error(`Missing cue ${key}: ${cue.anchor}`);
    if (baseWhen.length) list.findLast(n=>n.when.length===baseWhen.length).award={id:`c${chapter}-${section}`,to:cast[letter[2].charCodeAt(0)-65],amount:10};
    chapterNodes.push(...list);
  }
  chapterNodes.forEach((node,index)=>{
    node.progress=Math.round((Number(node.section.slice(0,2))-1)/(chapter===1?11:12)*100);
    if(index<chapterNodes.length-1) node.next=chapterNodes[index+1].id;
    else node.end=true;
    nodes[node.id]=node;
  });
}
for (const node of Object.values(nodes)) {
  if (node.sprite && !fs.existsSync(path.join(root,`assets/${node.char}/${node.sprite}.png`))) throw Error(`Missing sprite ${node.sprite}`);
  if (node.next && !nodes[node.next]) throw Error(`Broken next ${node.id}`);
  for(const choice of node.choices||[]) if(!nodes[choice.to]) throw Error(`Broken choice ${node.id}`);
}
for(const chapter of [1,2])Object.values(nodes).find(n=>n.chapter===chapter&&n.end).continueTo=`c${chapter+1}.01.0`;
const output = `// Generated by tools/build-common.cjs from the narrative manuscripts and checked performance cues.\n`+
  `Object.assign(window.CAST, ${JSON.stringify(npc,null,2)});\n`+
  `Object.assign(window.SCENES, ${JSON.stringify(scenes,null,2)});\n`+
  `Object.assign(window.STORY, ${JSON.stringify(nodes,null,2)});\n`+
  `window.STORY['last.5'].continueTo = 'c1.01.0';\n`+
  `window.CHAPTERS = ${JSON.stringify([{title:'未登记的来访者',ending:'第一道门，已经打开。',copy:'回家的路还没有找到。但在这个陌生的世界，已经有人陪你走进校园。'}, {title:chapters[1],ending:'今晚，有一扇能打开的门。',copy:'临时证上有了你的名字。那些没有送达的话，还留在枕边。'},{title:chapters[2],ending:'明天，八点半。',copy:'你已经认得活动楼。群里有人等着你的回复，明天的水杯也已经收好。'},{title:chapters[3],ending:'这一张，先留下。',copy:'今天去了校外，走了很多路。照片里的人，不需要再从头介绍。'}],null,2)};\n`;
fs.writeFileSync(path.join(root,'story/chapters/common.generated.js'),output,'utf8');
console.log(`Compiled ${Object.keys(nodes).length} passages, ${Object.values(nodes).filter(n=>n.choices).length} choices, ${Object.keys(scenes).length} images.`);
