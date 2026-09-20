module.exports = {
  backgrounds: {
    ch03_old_street_day:['外环旧街 / 白天','side_street_drink_shop_day'],
    ch03_bookstall_day:['外环旧街 · 旧书摊 / 白天','side_street_drink_shop_day'],
    ch03_old_bridge_evening:['外环旧街 · 旧桥 / 傍晚','campus_inner_road_morning']
  },
  staging: {
    '3-01':['campus_inner_road_morning','B01'], '3-02':['campus_inner_road_morning','B16'],
    '3-03':['ch03_old_street_day','B16'], '3-04':['ch03_old_street_day','B16'],
    '3-05':['ch03_old_street_day','B08'], '3-06':['ch03_old_street_day','B16'],
    '3-07A':['ch03_old_street_day','B10'], '3-07B':['ch03_bookstall_day','B11'],
    '3-07C':['ch03_old_street_day','B12'], '3-07D':['ch03_old_street_day','B13'],
    '3-07E':['ch03_old_street_day','B14'], '3-08':['ch03_old_street_day','B08'],
    '3-09A':['ch03_old_street_day','B10'], '3-09B':['ch03_bookstall_day','B11'],
    '3-09C':['ch03_old_street_day','B12'], '3-09D':['ch03_old_street_day','B13'],
    '3-09E':['ch03_old_street_day','B14'], '3-10':['ch03_old_street_day','B12'],
    '3-11':['ch03_old_bridge_evening','B17'], '3-12':['guest_room_first_night','B09']
  },
  cues: {
    '3-01':[['DeepSeek 正蹲在导览器旁',{char:'deepseek'}]],
    '3-07A':[['ChatGPT 在两处休息点之间',{char:'chatgpt'}]],
    '3-07B':[['旧书摊借着屋檐',{char:'claude'}]],
    '3-07C':[['街角的拱窗',{char:'gemini'}]],
    '3-07D':[['导览器在旧街的弯口',{char:'deepseek'}]],
    '3-07E':[['Grok 在一家小店对面',{char:'grok'}]],
    '3-09A':[['ChatGPT 把手册交到你手里',{char:'chatgpt'}]],
    '3-09B':[['旧书摊旁有一张空长椅',{char:'claude'}]],
    '3-09C':[['Gemini 让你站在支路入口',{char:'gemini'}]],
    '3-09D':[['DeepSeek 已经把导览器的记录',{char:'deepseek'}]],
    '3-09E':[['Grok 借用店外的小桌',{char:'grok'}]],
    '3-10':[['她将相机挂稳，抬手拨开肩边的长发。',{char:'gemini',look:['gemini','gemini_starmap_star_cape_calm'],shift:{name:'星图',detail:'核对多组路线与拍摄位置'},music:'B12-Map'}]],
    '3-11':[['Gemini 收好最后一张路线图',{char:'gemini',look:['gemini','gemini_meteor_white_jacket_calm'],shift:{name:'流星',detail:'回到眼前的取景框'}}],['回程时，没人排出刚才的站位',{char:null}]],
    '3-12':[['群里，Gemini 又发来',{music:'B15'}],['你回到已经确认过的照片',{music:'B17'}],['现实那边依旧没有新消息',{music:'silence'}]]
  }
};
