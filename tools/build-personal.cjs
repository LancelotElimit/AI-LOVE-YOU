const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const routes=require('../story/personal-routes.cjs');
const productions={deepseek:require('../story/deepseek-route-production.cjs'),claude:require('../story/claude-route-production.cjs'),gemini:require('../story/gemini-route-production.cjs'),grok:require('../story/grok-route-production.cjs'),chatgpt:require('../story/chatgpt-route-production.cjs')};
const root=path.resolve(__dirname,'..');
const outputFile=path.join(root,'story/chapters/personal.generated.js');
let previous={};
if(fs.existsSync(outputFile)){
  const scope={window:{CAST:{},STORY:{},PERSONAL_ROUTES:{},SCENES:{}}};
  vm.runInNewContext(fs.readFileSync(outputFile,'utf8').split('\nObject.values(window.STORY).find')[0],scope);
  previous=scope.window.STORY;
}
const cast=['chatgpt','claude','gemini','deepseek','grok'];
const speakers={'旁白':'narration','你':'you','系统':'system','巡查员':'inspector','老师':'teacher','店主':'shopkeeper','同学':'student','Siri':'siri','小爱同学':'xiaoai','豆包':'doubao','千问':'qwen','Kimi':'kimi'};
speakers['旧频道 Claude']='claude';
for(const [id,route] of Object.entries(routes))speakers[route.name]=id;
const sprites=Object.fromEntries(Object.entries(routes).map(([id,route])=>[id,route.sprite]));
const nodes={},metadata={};
const matchedCues=new Set();
for(const [route,config] of Object.entries(routes)){
  const source=fs.readFileSync(path.join(root,config.file),'utf8');
  const sections=[...source.matchAll(/^## (\d\d|END-(?:GOOD|NORMAL|BAD|TRUE)) · (.+)\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)];
  const chapters=sections.filter(s=>/^\d/.test(s[1]));
  metadata[route]={name:config.name,title:config.title,entry:null,chapters:{},endings:config.endings};
  for(const [,section,title,body] of sections){
    const ending=section.startsWith('END-')?section.slice(4):null;
    const chapter=ending?Number(chapters.at(-1)[1]):Number(section);
    if(ending&&!config.endings[ending])throw Error(`Unknown ending ${route}/${ending}`);
    if(!ending)metadata[route].chapters[chapter]={title,ending:title,copy:'约定还没有结束。'};
    const prior=Object.values(previous).filter(n=>n.personalRoute===route&&n.section===section),used=new Set();
    const list=[];let when=[],choiceHost=null,branch=null,choiceIndex=0,added=0,finalChoices=false;
    const staging=productions[route]?.sections[section];
    let stage={bg:config.bg,music:config.music,sprite:config.sprite,...staging?.initial};
    function emit(who,text,delivery){
      const same=prior.find(n=>!used.has(n.id)&&n.who===who&&n.text===text&&JSON.stringify(n.when||[])===JSON.stringify(when));
      let id=same?.id||`r_${route}.${section}.${list.length}`;
      if(!same&&prior.length){do{id=`r_${route}.${section}.added${++added}`;}while(previous[id]||used.has(id));}
      used.add(id);
      for(const [index,cue] of (staging?.cues||[]).entries())if(text.includes(cue.at)){
        stage={...stage,...cue.set};matchedCues.add(`${route}:${section}:${index}`);
      }
      const remote=delivery==='消息'&&stage.remoteSpeaker===who;
      const char=stage.cg||(delivery&&!remote)||who==='system'||!cast.includes(who)?null:who;
      const node={id,chapter,section,title,personalRoute:route,bg:stage.bg,music:stage.music,who,text,char,progress:Math.min(96,list.length*3),
        ...(char?{sprite:staging&&char===route?stage.sprite:sprites[char]}:{}),...(when.length?{when:[...when]}:{}),...(delivery?{delivery}:{})};
      list.push(node);if(branch&&branch.to===null)branch.to=id;
    }
    for(const raw of body.split(/\r?\n/)){
      const line=raw.trim();if(!line)continue;
      let match;
      if(line.startsWith('### 选择：')){choiceHost=list.at(-1);choiceHost.choices=[];choiceIndex++;continue;}
      if((match=line.match(/^选项([一二])：(.+)$/))){
        const index=match[1]==='一'?1:2,flag=`r-${route}-${section}-choice${choiceIndex}:${index}`;
        branch={text:match[2].replace(/。$/,''),flag,to:null};choiceHost.choices.push(branch);when=[{flag}];continue;
      }
      if(line==='汇合：'){when=[];branch=null;continue;}
      if(line==='### 结局选择'){choiceHost=list.at(-1);choiceHost.choices=[];finalChoices=true;continue;}
      if(finalChoices&&(match=line.match(/^- (.+) \| (GOOD|NORMAL|BAD|TRUE)$/))){
        const key=match[2],flags=key==='GOOD'?config.goodFlags:key==='TRUE'?config.trueFlags:null;
        choiceHost.choices.push({text:match[1],endingTarget:key,...(flags?{requiresFlags:flags}:{})});continue;
      }
      if((match=line.match(/^([^：]+)：(.+)$/))){
        const label=match[1].replace(/（消息）$/,'');
        if(!speakers[label])throw Error(`Unknown speaker ${route}/${section}: ${label}`);
        const delivery=match[1].endsWith('（消息）')?(label==='旧频道 Claude'?'旧时间线 · 消息':'消息'):null;
        emit(speakers[label],match[2],delivery);continue;
      }
      throw Error(`Unknown instruction ${route}/${section}: ${line}`);
    }
    if(!list.length)throw Error(`Empty section ${route}/${section}`);
    list.forEach((n,i)=>{if(i<list.length-1)n.next=list[i+1].id;nodes[n.id]=n;});
    const last=list.at(-1);
    if(ending){last.end=true;last.routeEnding={key:ending,...config.endings[ending],copy:last.text};}
    else{
      const next=chapters[chapters.findIndex(s=>s[1]===section)+1];
      if(next){last.end=true;last.nextChapter=next[1];}
      else if(!last.choices)throw Error(`Missing final choice ${route}`);
      if(!metadata[route].entry)metadata[route].entry=list[0].id;
    }
  }
}
const scenes={};
for(const [route,production] of Object.entries(productions)){
  for(const [section,data] of Object.entries(production.sections))for(const [index,cue] of (data.cues||[]).entries()){
    if(!matchedCues.has(`${route}:${section}:${index}`))throw Error(`Unmatched ${route} production cue: ${section}/${cue.at}`);
  }
  for(const [id,scene] of Object.entries(production.scenes)){
    if(scenes[id])throw Error(`Duplicate production scene ${id}`);
    if(!fs.existsSync(path.join(root,scene.image)))throw Error(`Missing scene ${scene.image}`);
    scenes[id]=scene;
  }
}
for(const node of Object.values(nodes)){
  if(node.personalRoute==='deepseek'&&node.text.includes('你的项目报酬到账'))node.transaction={id:'deepseek-first-project-wage',amount:480,label:'工坊项目报酬'};
  if(node.nextChapter){node.continueTo=Object.values(nodes).find(n=>n.personalRoute===node.personalRoute&&n.section===node.nextChapter).id;delete node.nextChapter;}
  for(const choice of node.choices||[]){
    if(choice.endingTarget){choice.to=Object.values(nodes).find(n=>n.personalRoute===node.personalRoute&&n.section===`END-${choice.endingTarget}`).id;delete choice.endingTarget;}
    if(!choice.to||!nodes[choice.to])throw Error(`Broken choice ${node.id}`);
  }
  if(node.sprite&&!fs.existsSync(path.join(root,`assets/${node.char}/${node.sprite}.png`)))throw Error(`Missing sprite ${node.sprite}`);
}
const npc={inspector:{name:'巡查员',sub:'额度监察局',color:'#82948a'},qwen:{name:'千问',sub:'结算与项目协作',color:'#82948a'},kimi:{name:'Kimi',sub:'归档与长文检索',color:'#82948a'}};
const links=cast.map((route,i)=>`Object.values(window.STORY).find(n=>n.chapter===5&&n.section==='09${String.fromCharCode(65+i)}'&&n.end).continueTo=${JSON.stringify(metadata[route].entry)};`).join('\n');
fs.writeFileSync(outputFile,`// Generated from the personal-route manuscripts.\nObject.assign(window.CAST,${JSON.stringify(npc)});\nObject.assign(window.SCENES,${JSON.stringify(scenes,null,2)});\nwindow.PERSONAL_ROUTES=${JSON.stringify(metadata,null,2)};\nObject.assign(window.STORY,${JSON.stringify(nodes,null,2)});\n${links}\n`,'utf8');
console.log(`Compiled ${Object.keys(routes).length} routes, ${Object.values(metadata).reduce((sum,r)=>sum+Object.keys(r.chapters).length,0)} chapters, ${Object.values(nodes).filter(n=>n.routeEnding).length} endings, ${Object.keys(nodes).length} passages.`);
