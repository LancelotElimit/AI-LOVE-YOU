const scene=(title,location,image,cg=false)=>({index:'DEEPSEEK ROUTE',title,location,note:'',image,cg,art:`<img class="scene-image" src="${image}" alt="" draggable="false">`});
const eco='deepseek_eco_blue_jacket_calm';
const shy='deepseek_eco_blue_jacket_shy';
const hesitant='deepseek_eco_blue_jacket_hesitant';
const drink='deepseek_eco_blue_jacket_hotdrink';
const engineer='deepseek_engineer_white_apron_focused';
const cue=(at,set)=>({at,set});
module.exports={
  scenes:{
    ds_workshop_evening:scene('深海工坊','深海工坊 / 傍晚','assets/scene/bg/bg_ds_route_workshop_evening.png'),
    ds_cafe_evening:scene('街角面馆','街角面馆 / 晚饭时间','assets/scene/bg/bg_ds_route_cafe_evening.png'),
    ds_workshop_midnight:scene('深海工坊','深海工坊 / 深夜','assets/scene/bg/bg_ds_route_workshop_midnight.png'),
    ds_today_six:scene('今天六点关门','工坊门外 / 夕阳','assets/scene/cg/cg_ds_route_today_six.png',true)
  },
  sections:{
    '06':{initial:{bg:'ds_workshop_evening',sprite:eco,music:'B13'},cues:[
      cue('你们坐到桌边',{bg:'ds_cafe_evening',sprite:drink,music:'B04'}),
      cue('你们回工坊列范围',{bg:'ds_workshop_evening',sprite:eco,music:'B13'}),
      cue('那晚饭呢',{sprite:shy})
    ]},
    '07':{initial:{bg:'deepsea_workshop_day',sprite:eco,music:'B13'},cues:[
      cue('她进入工程形态',{sprite:engineer}),
      cue('第一晚试运行',{bg:'ds_workshop_midnight',sprite:'deepseek_engineer_white_apron_flustered',music:'B19'}),
      cue('修复花了两天',{bg:'deepsea_workshop_day',sprite:'deepseek_engineer_white_apron_happy',music:'B13'}),
      cue('现在能庆功了',{bg:'ds_cafe_evening',sprite:drink,music:'B04'})
    ]},
    '08':{initial:{bg:'deepsea_workshop_day',sprite:engineer,music:'B13'},cues:[
      cue('周五晚上',{bg:'ds_workshop_midnight',sprite:'deepseek_engineer_white_apron_flustered',music:'B05'}),
      cue('她第一次把店钥匙',{bg:'ds_workshop_evening',sprite:hesitant,music:'B08'}),
      cue('想和你坐一会儿',{sprite:shy}),
      cue('推开热饮店的门',{bg:'ds_cafe_evening',sprite:drink,music:'B17'})
    ]},
    '09':{initial:{bg:'deepsea_workshop_day',sprite:hesitant,music:'B02'},cues:[
      cue('周末，公司第一次',{bg:'ds_workshop_evening',sprite:eco,music:'B13'}),
      cue('现在我可以喜欢你',{sprite:shy,music:'B17'})
    ]},
    '10':{initial:{bg:'ds_workshop_evening',sprite:eco,music:'B02'},cues:[]},
    'END-GOOD':{initial:{bg:'deepsea_workshop_day',sprite:'deepseek_engineer_white_apron_happy',music:'B18'},cues:[
      cue('DeepSeek 在门上挂起',{bg:'ds_workshop_evening',sprite:eco,music:'B17'}),
      cue('你们经过热饮店',{bg:'ds_today_six',cg:true,music:'B17'})
    ]},
    'END-NORMAL':{initial:{bg:'deepsea_workshop_day',sprite:eco,music:'B13'},cues:[
      cue('晚上她在门口等你',{bg:'ds_workshop_evening',sprite:drink,music:'B08'})
    ]},
    'END-BAD':{initial:{bg:'ds_workshop_midnight',sprite:hesitant,music:'B19'},cues:[
      cue('以后我的报价里会有我',{sprite:eco,music:'B05'})
    ]}
  }
};
