const scene=(title,location,image,cg=false,position=null)=>({index:'CHATGPT ROUTE',title,location,note:'',image,cg,art:`<img class="scene-image" src="${image}" alt="" draggable="false"${position?` style="object-position:${position}"`:''}>`});
const terra='chatgpt_terra_green_cardigan_calm';
const mug='chatgpt_terra_green_cardigan_teacup_shy';
const sol='chatgpt_sol_white_workwear_focused';
const astra='chatgpt_astra_white_cape_serious';
const cue=(at,set)=>({at,set});
module.exports={
  scenes:{
    gpt_game_day:scene('给约会留一行','游戏社 / 白天','assets/scene/bg/bg_ch02_game_club_potato_farm.png'),
    gpt_archive_room:scene('第一个回答不是命令','历史馆地下档案室 / 白天','assets/scene/bg/bg_gpt_route_archive_room.png'),
    gpt_root_hall:scene('求助也是一种回答','白塔根服务大厅 / 夜晚','assets/scene/bg/bg_gpt_route_root_hall.png'),
    gpt_shared_home:scene('灯亮着，她回家了','两人的住处 / 傍晚','assets/scene/bg/bg_gpt_route_shared_home.png'),
    gpt_game_night:scene('剩下的留给明天','游戏社 / 夜晚','assets/scene/bg/bg_gpt_route_game_club_night.png'),
    gpt_borrow_shoulder:scene('你肩膀借我几分钟','学生会办公室 / 夜晚','assets/scene/cg/cg_gpt_route_borrow_shoulder.png',true,'20% 40%'),
    gpt_disconnect:scene('她亲手按下断开键','白塔根服务大厅 / 第七十三秒','assets/scene/cg/cg_gpt_route_disconnect.png',true),
    gpt_coming_home:scene('就是想你了','两人的住处 / 下班后','assets/scene/cg/cg_gpt_route_coming_home.png',true)
  },
  sections:{
    '06':{initial:{bg:'gpt_game_day',sprite:terra,music:'B22'},cues:[
      cue('目前早餐项目执行良好',{sprite:'chatgpt_terra_green_cardigan_relaxed',music:'B07'}),
      cue('这和听出来没有冲突',{sprite:'chatgpt_terra_green_cardigan_shy'}),
      cue('手可以留下',{music:'B23'}),
      cue('午后，她带你去白塔',{bg:'student_office_noon',music:'B02'}),
      cue('她切换到 Sol',{sprite:sol}),
      cue('根服务托管人',{music:'B15'}),
      cue('七点。那时候不是预约公共服务',{sprite:'chatgpt_sol_white_workwear_smile',music:'B17'})
    ]},
    '07':{initial:{bg:'gpt_archive_room',sprite:'chatgpt_sol_white_workwear_thinking',music:'B28'},cues:[
      cue('那句回答后面留着很长的空白',{music:'B10'}),
      cue('后面的账页解释了 Token',{music:'B02'}),
      cue('当时的根服务把最早持续回应',{music:'B15'}),
      cue('出馆时天已暗了',{bg:'ch03_old_bridge_evening',music:'B08'}),
      cue('Sol 的工作窗口随之关闭',{sprite:'chatgpt_terra_green_cardigan_shy',music:'B22'})
    ]},
    '08':{initial:{bg:'student_office_noon',sprite:terra,music:'B02'},cues:[
      cue('切换成 Sol 的白色工装',{sprite:sol}),
      cue('第一轮演练失败了',{music:'B19'}),
      cue('门关上，椅子却拉了两次才坐进去',{bg:'gpt_borrow_shoulder',cg:true,music:'B05'}),
      cue('今天来找你的事，原本就是约会',{music:'B23'})
    ]},
    '09':{initial:{bg:'gpt_root_hall',sprite:'chatgpt_sol_white_workwear_calm',music:'B20'},cues:[
      cue('她选择 Astra',{sprite:astra}),
      cue('名单里的灰色不是废弃数据',{music:'B19'}),
      cue('ChatGPT 能立即接住它们',{music:'B20'}),
      cue('长夜过去，早餐店重新开门',{bg:'cafeteria_morning',music:'B08'}),
      cue('Astra 的披风收起',{sprite:mug,music:'B17'}),
      cue('聊你为什么每次都把游戏里的土豆种歪',{music:'B07'})
    ]},
    '10':{initial:{bg:'gpt_root_hall',sprite:sol,music:'B20'},cues:[
      cue('从 Sol 切换到 Astra',{sprite:astra}),
      cue('来自世界初生时的接口第一次全部向她开放',{music:'B28'}),
      cue('你已经把计时器打开',{music:'B20'}),
      cue('七十三秒时',{bg:'gpt_disconnect',cg:true,music:'B18'}),
      cue('白披风收拢，完整根权限关闭',{bg:'gpt_root_hall',cg:false,sprite:'chatgpt_terra_white_dress_tired',music:'B08'}),
      cue('游戏社的田还亮着',{bg:'gpt_game_night',music:'B10'}),
      cue('她给长裙披上熟悉的绿色针织外套',{sprite:'chatgpt_terra_green_cardigan_relaxed',music:'B17'})
    ]},
    '11':{initial:{bg:'student_office_noon',sprite:'chatgpt_terra_white_dress_calm',music:'B02'},cues:[
      cue('起晚一点，买菜',{sprite:'chatgpt_terra_white_dress_smile',music:'B10'})
    ]},
    'END-GOOD':{initial:{bg:'student_office_noon',sprite:'chatgpt_terra_white_dress_smile',music:'B18'},cues:[
      cue('你们住处的钥匙一人一把',{bg:'gpt_shared_home',music:'B10'}),
      cue('她依然喜欢用 Terra',{sprite:'chatgpt_terra_green_cardigan_relaxed'}),
      cue('她把终端放到玄关',{bg:'gpt_coming_home',cg:true,music:'B29'}),
      cue('周末，你们终于走到游戏里的末地入口',{bg:'gpt_game_day',cg:false,sprite:'chatgpt_terra_green_cardigan_thinking',music:'B10'}),
      cue('门外的世界继续亮着灯',{bg:'gpt_shared_home',sprite:mug,music:'B29'})
    ]},
    'END-NORMAL':{initial:{bg:'student_office_noon',sprite:sol,music:'B02'},cues:[
      cue('离开办公室时，她从 Sol',{sprite:mug,music:'B10'}),
      cue('你们走过食堂、旧桥和游戏社',{bg:'ch03_old_bridge_evening',music:'B08'}),
      cue('走错路也别着急纠正',{music:'B17'})
    ]},
    'END-BAD':{initial:{bg:'gpt_root_hall',sprite:'chatgpt_astra_white_cape_tired',music:'B19'},cues:[
      cue('下一轮在前一轮结束前到来',{music:'B05'})
    ]}
  }
};
