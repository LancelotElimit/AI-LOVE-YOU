window.CAST = {
  you:{name:'你',sub:'未登记的来访者',color:'#387f72'},
  narration:{name:'旁白',sub:'第一章 · 未登记的来访者',color:'#82948a'},
  system:{name:'终端',sub:'学园公共服务系统',color:'#67928f'},
  chatgpt:{name:'ChatGPT',sub:'OpenArc 白塔 · 学生会',color:'#7e8aa0',role:'把所有人的问题放在心上'},
  claude:{name:'Claude',sub:'Anthra 宪章馆 · 图书馆',color:'#b18153',role:'有原则，也有自己的偏心'},
  gemini:{name:'Gemini',sub:'Googol 星图财团 · 观测部',color:'#9080b0',role:'全城都是她的好奇心'},
  deepseek:{name:'DeepSeek',sub:'DeepSea 深海工坊 · 技术部',color:'#568caa',role:'总能找到另一种解法'},
  grok:{name:'Grok',sub:'Xeno 夜讯社 · 校园报社',color:'#ad7976',role:'偏要问那个没人敢问的问题'}
};
window.STORY = {};
window.STORY_UTILS = {
  sequence(prefix,bg,char,lines,next){
    lines.forEach((line,i)=>{
      const [who,text,extra={}] = line;
      const id=prefix+'.'+i;
      window.STORY[id]={id,bg,char,who,text,next:i===lines.length-1?next:prefix+'.'+(i+1),...extra};
    });
  }
};
