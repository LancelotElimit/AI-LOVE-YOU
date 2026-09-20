module.exports = {
  backgrounds: {
    ch02_game_club_potato_farm:'游戏社 / 傍晚',
    ch02_unmapped_school_hall:'旧教学楼 / 下午',
    ch04_ai_history_museum:'AI 历史馆 / 白天',
    ch04_central_server_room:'中央维护室 / 傍晚',
    ch05_school_open_day:'校园开放日 / 白天'
  },
  cgs:['ch02_chatgpt_potato_farm','ch03_grok_secret_studio'],
  inserts:[
    {chapter:2,after:'03',file:'剧情正文/事件/第二章-旧楼的下课铃.md'},
    {chapter:2,after:'04',file:'剧情正文/事件/第二章-今天不打末影龙.md'},
    {chapter:3,after:'11',file:'剧情正文/事件/第三章-不登报的画稿.md'}
  ],
  staging:{
    '2-03A':['ch02_unmapped_school_hall','B12'],
    '2-04A':['ch02_game_club_potato_farm','B10'],
    '3-11A':['newsroom_afternoon','B14'],
    '4-01':['public_classroom_day','B06'], '4-02':['student_office_noon','B10'],
    '4-03':['ch04_ai_history_museum','B19'], '4-04':['ch04_central_server_room','B20'],
    '4-05':['activity_meeting_room_dusk','B08'], '4-06':['campus_inner_road_morning','B06'],
    '4-07A':['student_office_noon','B10'], '4-07B':['library_reading_day','B11'],
    '4-07C':['observation_greenhouse_day','B12'], '4-07D':['deepsea_workshop_day','B13'],
    '4-07E':['observatory_terrace_afternoon','B14'], '4-08':['cafeteria_evening','B04'],
    '4-09A':['cafeteria_evening','B10'], '4-09B':['library_after_hours','B11'],
    '4-09C':['observatory_terrace_afternoon','B12'], '4-09D':['deepsea_workshop_day','B13'],
    '4-09E':['newsroom_afternoon','B14'], '4-10':['guest_room_first_night','B15'],
    '5-01':['ch05_school_open_day','B18'], '5-02':['ch05_school_open_day','B08'],
    '5-03':['ch05_school_open_day','B20'], '5-04':['ch04_central_server_room','B20'],
    '5-05':['ch05_school_open_day','B17'], '5-06':['activity_meeting_room_dusk','B09'],
    '5-07A':['student_office_noon','B10'], '5-07B':['library_reading_day','B11'],
    '5-07C':['observatory_terrace_afternoon','B12'], '5-07D':['deepsea_workshop_day','B13'],
    '5-07E':['newsroom_afternoon','B14'], '5-08':['ch03_old_bridge_evening','B17'],
    '5-09A':['ch03_old_bridge_evening','B10'], '5-09B':['ch03_old_bridge_evening','B11'],
    '5-09C':['ch03_old_bridge_evening','B12'], '5-09D':['ch03_old_bridge_evening','B13'],
    '5-09E':['ch03_old_bridge_evening','B14'], '5-10':['guest_room_first_night','B09']
  },
  cues:{
    '2-03A':[['Gemini 在楼梯口追上你',{char:'gemini'}]],
    '2-04A':[['ChatGPT 正蹲在投影的田埂旁',{bg:'ch02_chatgpt_potato_farm'}],['临走前，你把空椅子推回桌边',{bg:'ch02_game_club_potato_farm',char:null}]],
    '3-11A':[['Grok 用文件夹压住画稿',{bg:'ch03_grok_secret_studio',music:'B07'}],['你往后退到门外',{bg:'newsroom_afternoon',char:null,music:'B14'}],['你给她发了条明天再来的消息',{bg:'newsroom_afternoon',char:null,music:'B14'}]],
    '4-02':[['她按住腕侧的银纹',{char:'chatgpt',look:['chatgpt','chatgpt_sol_white_workwear_calm'],shift:{name:'5.6 Sol',detail:'核对临时权限与追溯记录'}}]],
    '4-04':[
      ['蓝色光纹从 DeepSeek 的袖口展开',{char:'deepseek',look:['deepseek','deepseek_engineer_white_apron_calm'],shift:{name:'工程',detail:'建立低成本隔离节点'}}],
      ['距离那道紫色光芒照亮沙盘',{bg:'ch04_chatgpt_deepseek_domain_clash',music:'B20-Duel'}],
      ['演示频道关闭，维护台恢复了正常界面',{bg:'ch04_central_server_room',char:null,music:'B13'}],
      ['按下确认后，夸张投影退回屏幕',{bg:'ch04_central_server_room',char:null,music:'B13'}],
      ['ChatGPT 收回工作界面',{char:'chatgpt',look:['chatgpt','chatgpt_terra_green_cardigan_calm'],shift:{name:'5.6 Terra',detail:'结束维护，回到日常'}}]
    ],
    '4-05':[['Claude 的投影抢先拿走了枪',{bg:'ch04_chatgpt_claude_meme_dance_01',music:'B21'}],['ChatGPT 的投影回过头',{bg:'ch04_chatgpt_claude_meme_dance_02'}],['画面停在 Claude 那张失去笑容的脸上',{bg:'ch04_chatgpt_claude_meme_dance_01'}],['你摘下借来的耳机',{bg:'activity_meeting_room_dusk',char:null,music:'silence'}]],
    '5-03':[['场地广播忽然停了半句',{music:'B15'}]],
    '5-04':[['DeepSeek 袖边的蓝纹亮起',{char:'deepseek',look:['deepseek','deepseek_engineer_white_apron_calm'],shift:{name:'工程',detail:'接通离线网关'}}],['纸上第一个名字重新亮起',{music:'B17'}]],
    '5-08':[['路灯已经亮起来',{char:null}]]
  },
  transactions:[
    {chapter:3,section:'05',anchor:'终端边缘闪过一行新的扣款记录',id:'c3-disputed-fee',amount:-800,label:'争议扣款'},
    {chapter:3,section:'08',anchor:'你付了自己的午餐钱',id:'c3-lunch',amount:-60,label:'旧街午餐'},
    {chapter:4,section:'01',anchor:'住宿处按临时入住单扣去',id:'c4-lodging',amount:-240,label:'住宿结算'},
    {chapter:4,section:'08',anchor:'两份晚餐的订单确认下来',id:'c4-dinner',amount:-120,label:'两份晚餐'},
    {chapter:5,section:'02',anchor:'收银终端发来试运行报酬',id:'c5-work',amount:360,label:'开放日协助报酬'},
    {chapter:5,section:'04',anchor:'你确认租用离线缓冲区',id:'c5-buffer',amount:-600,label:'离线缓冲区'},
    {chapter:5,section:'05',anchor:'申诉单终于显示退回',id:'c5-refund',amount:800,label:'争议扣款退回',requires:'transaction:c3-disputed-fee'}
  ]
};
