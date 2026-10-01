const scene=(title,location,image,cg=false)=>({index:'GROK ROUTE',title,location,note:'',image,cg,art:`<img class="scene-image" src="${image}" alt="" draggable="false">`});
const night='grok_night_red_black_jacket_calm';
const amused='grok_night_red_black_jacket_amused';
const shy='grok_night_red_black_jacket_sketchbook_shy';
const blood='grok_bloodmoon_red_black_workwear_focused';
const cue=(at,set)=>({at,set});
module.exports={
  scenes:{
    gr_test_field:scene('第一枚小火箭','校园试验区 / 下午','assets/scene/bg/bg_gr_route_test_field.png'),
    gr_private_studio:scene('画册里的两个背影','报社后方工作间 / 傍晚','assets/scene/bg/bg_gr_route_private_studio.png'),
    gr_control_room:scene('正式发射窗口','专业合作机构控制室 / 傍晚','assets/scene/bg/bg_gr_route_control_room.png'),
    gr_crew_cabin:scene('倒数以前','载人舱段 / 发射前清晨','assets/scene/bg/bg_gr_route_crew_cabin.png',true),
    gr_after_failure:scene('明天还来吗','校园报社 / 夜晚','assets/scene/cg/cg_gr_route_after_failure.png',true),
    gr_orbital_window:scene('第一次，看见整个世界','载人舱段 / 轨道观测','assets/scene/cg/cg_gr_route_orbital_window.png',true)
  },
  sections:{
    '06':{initial:{bg:'gr_test_field',sprite:night,music:'B14'},cues:[
      cue('震惊，某来访者终于学会准时',{sprite:amused,music:'B07'}),
      cue('不是只想让大家看我发射',{sprite:night,music:'B14'}),
      cue('傍晚，你跟她回到报社',{bg:'gr_private_studio',sprite:night,music:'B14'}),
      cue('把画册抱到了胸前',{sprite:shy,music:'B07'}),
      cue('放心，我不看，也不转述',{music:'B17'}),
      cue('她把一份预算给你看',{sprite:night,music:'B02'}),
      cue('这张没接单。画给自己的',{sprite:shy,music:'B17'}),
      cue('桥边的路灯逐盏亮起',{bg:'ch03_old_bridge_evening',sprite:amused,music:'B08'}),
      cue('你伸出手。她看了半秒才握住',{sprite:'grok_night_red_black_jacket_embarrassed',music:'B17'})
    ]},
    '07':{initial:{bg:'newsroom_afternoon',sprite:night,music:'B14'},cues:[
      cue('给明天的我保留发挥空间',{sprite:amused,music:'B07'}),
      cue('来到合作试验室时',{bg:'gr_control_room',sprite:blood,music:'B02'}),
      cue('第一次场地试验提前停止',{music:'B19'}),
      cue('她摘下手套又戴回去',{sprite:'grok_bloodmoon_red_black_workwear_sad'}),
      cue('晚上她在报社吃冷掉的饭',{bg:'gr_after_failure',cg:true,music:'B05'}),
      cue('来。不是来看看你能不能赢',{music:'B17'})
    ]},
    '08':{initial:{bg:'gr_private_studio',sprite:night,music:'B19'},cues:[
      cue('这个不行',{sprite:'grok_night_red_black_jacket_angry'}),
      cue('重新回到控制室',{bg:'gr_control_room',sprite:blood,music:'B02'}),
      cue('如果这里坐的是豆包前辈',{music:'B07'}),
      cue('一年里，你们一起经历了',{music:'B14'}),
      cue('一次成功的无人试验后',{sprite:'grok_bloodmoon_red_black_workwear_hopeful',music:'B18'}),
      cue('外套重新展开星月纹样',{sprite:night,music:'B17'}),
      cue('能不能亲你',{sprite:'grok_night_red_black_jacket_embarrassed'})
    ]},
    '09':{initial:{bg:'gr_control_room',sprite:blood,music:'B20'},cues:[
      cue('夜讯社的编辑给你发来',{music:'B19'}),
      cue('我想把它画完',{sprite:'grok_bloodmoon_red_black_workwear_calm',music:'B14'})
    ]},
    'END-GOOD':{initial:{bg:'gr_crew_cabin',cg:true,sprite:blood,music:'B20'},cues:[
      cue('窗外，云层分开',{bg:'gr_orbital_window',cg:true,music:'B18'}),
      cue('原来没有新闻标题',{music:'B17'}),
      cue('返回后她才发布',{bg:'gr_control_room',cg:false,sprite:'grok_bloodmoon_red_black_workwear_hopeful',music:'B09'}),
      cue('再回报社的小工作间时',{bg:'gr_private_studio',sprite:amused,music:'B17'})
    ]},
    'END-NORMAL':{initial:{bg:'gr_control_room',sprite:'grok_bloodmoon_red_black_workwear_calm',music:'B14'},cues:[
      cue('这个世界等了我们几年',{sprite:'grok_bloodmoon_red_black_workwear_hopeful',music:'B08'}),
      cue('你仍然陪她来试验场',{bg:'gr_test_field',music:'B09'})
    ]},
    'END-BAD':{initial:{bg:'gr_control_room',sprite:'grok_bloodmoon_red_black_workwear_sad',music:'B19'},cues:[
      cue('那本画着两个背影的画册',{bg:'gr_private_studio',sprite:'grok_night_red_black_jacket_unimpressed',music:'B05'})
    ]}
  }
};
