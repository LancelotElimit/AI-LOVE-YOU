const scene=(title,location,image,cg=false)=>({index:'GEMINI ROUTE',title,location,note:'',image,cg,art:`<img class="scene-image" src="${image}" alt="" draggable="false">`});
const calm='gemini_meteor_white_jacket_calm';
const camera='gemini_meteor_white_jacket_camera_shy';
const curious='gemini_meteor_white_jacket_curious';
const happy='gemini_meteor_white_jacket_happy';
const focused='gemini_starmap_star_cape_focused';
const cue=(at,set)=>({at,set});
module.exports={
  scenes:{
    gm_station_day:scene('城外的小车站','Tokenia 城外 / 午后','assets/scene/bg/bg_gm_route_station_day.png'),
    gm_coastal_village:scene('海边村落','海边村落 / 下午至傍晚','assets/scene/bg/bg_gm_route_coastal_village.png'),
    gm_inn_rain:scene('山间驿站','山间驿站公共客厅 / 雨天','assets/scene/bg/bg_gm_route_mountain_inn_rain.png'),
    gm_inn_night:scene('山间驿站','山间驿站公共客厅 / 雨后夜晚','assets/scene/bg/bg_gm_route_mountain_inn_night.png'),
    gm_valley_clear:scene('山谷集合点','山谷安全集合点 / 雨后上午','assets/scene/bg/bg_gm_route_valley_after_rain.png'),
    gm_rainy_pause:scene('不需要拍下的晚上','山间驿站公共客厅 / 雨夜','assets/scene/cg/cg_gm_route_rainy_pause.png',true),
    gm_next_departure:scene('下一个地点，一起选','区域列车 / 新旅程的早晨','assets/scene/cg/cg_gm_route_next_departure.png',true)
  },
  sections:{
    '06':{initial:{bg:'observatory_terrace_afternoon',sprite:curious,music:'B12'},cues:[
      cue('你们去城外一座',{bg:'gm_station_day',sprite:camera,music:'B16'}),
      cue('你问她想不想一起入镜',{sprite:happy,music:'B17'}),
      cue('拍完后她立刻想删',{sprite:'gemini_meteor_white_jacket_surprised'}),
      cue('她保留了这张',{sprite:camera}),
      cue('学期内的短期采风申请',{music:'B12'}),
      cue('这个已经订好了',{sprite:camera,music:'B17'})
    ]},
    '07':{initial:{bg:'gm_coastal_village',sprite:curious,music:'B16'},cues:[
      cue('为核对路线展开星图披肩',{sprite:focused,music:'B02'}),
      cue('切回轻便的白夹克',{sprite:camera,music:'B16'}),
      cue('我以前只检查坐标对不对',{sprite:curious}),
      cue('展示邀请收进文件夹',{sprite:camera,music:'B17'})
    ]},
    '08':{initial:{bg:'gm_inn_rain',sprite:calm,music:'B25'},cues:[
      cue('她已经展开星图形态',{sprite:focused,music:'B02'}),
      cue('不想在今天表现得特别开心',{sprite:'gemini_starmap_star_cape_annoyed',music:'B25'}),
      cue('夜里灯闪了一下',{bg:'gm_inn_night',music:'B08'}),
      cue('换回白色旅行夹克',{sprite:calm,music:'B08'}),
      cue('她挨着你坐下',{bg:'gm_rainy_pause',cg:true,music:'B25'})
    ]},
    '09':{initial:{bg:'gm_valley_clear',sprite:calm,music:'B19'},cues:[
      cue('选择棱镜侧重的观察',{sprite:focused,music:'B20'}),
      cue('救援人员接走了迷路者',{music:'B09'}),
      cue('你们回到驿站时',{bg:'gm_inn_rain',music:'B02'}),
      cue('晚上，Gemini 收到财团的新提案',{bg:'gm_inn_night',music:'B02'}),
      cue('换回白夹克，将相机收进包里',{sprite:calm}),
      cue('我不是问你会不会一直跟来',{sprite:happy,music:'B17'})
    ]},
    '10':{initial:{bg:'activity_meeting_room_dusk',sprite:happy,music:'B18'},cues:[
      cue('放映室陆续空了',{sprite:calm,music:'B17'}),
      cue('财团再次来谈',{sprite:curious,music:'B02'})
    ]},
    'END-GOOD':{initial:{bg:'activity_meeting_room_dusk',sprite:happy,music:'B18'},cues:[
      cue('拉你去看照片真正拍摄的窗台',{bg:'gm_station_day',sprite:camera,music:'B16'}),
      cue('车窗里映着她',{bg:'gm_next_departure',cg:true,music:'B29'})
    ]},
    'END-NORMAL':{initial:{bg:'observatory_terrace_afternoon',sprite:calm,music:'B12'},cues:[
      cue('给你留了前一晚写好的纸条',{bg:'gm_station_day',sprite:happy,music:'B08'})
    ]},
    'END-BAD':{initial:{bg:'activity_meeting_room_dusk',sprite:'gemini_meteor_white_jacket_focused',music:'B19'},cues:[
      cue('广场上仍播放着她',{bg:'ch05_school_open_day',music:'B05'})
    ]}
  }
};
