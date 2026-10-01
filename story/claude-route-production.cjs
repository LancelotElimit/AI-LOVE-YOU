const scene=(title,location,image,cg=false)=>({index:'CLAUDE ROUTE',title,location,note:'',image,cg,art:`<img class="scene-image" src="${image}" alt="" draggable="false">`});
const calm='claude_haiku_black_cardigan_calm';
const shy='claude_haiku_black_cardigan_book_shy';
const sonnet='claude_sonnet_book_dress_focused';
const cue=(at,set)=>({at,set});
module.exports={
  scenes:{
    cl_library_night:scene('闭馆后的阅览桌','Tokenia 图书馆 / 夜晚','assets/scene/bg/bg_cl_route_library_night.png'),
    cl_real_dawn:scene('现实里的房间','现实世界 / 清晨','assets/scene/bg/bg_cl_route_real_room_dawn.png'),
    cl_real_night:scene('现实里的房间','现实世界 / 夜晚','assets/scene/bg/bg_cl_route_real_room_night.png'),
    cl_crossworld_call:scene('屏幕另一边','现实清晨 / Tokenia 夜晚','assets/scene/cg/cg_cl_route_crossworld_call.png',true),
    cl_reunion:scene('两侧同时开门','现实房间 / 双向窗口','assets/scene/cg/cg_cl_route_reunion.png',true)
  },
  sections:{
    '06':{initial:{bg:'library_reading_day',sprite:'claude_opus_page_cape_calm',music:'B11'},cues:[
      cue('你拿出序章的匿名消息',{sprite:'claude_opus_page_cape_serious',music:'B15'}),
      cue('闭馆时她问你',{bg:'cl_library_night',music:'B11'}),
      cue('换回 Haiku 的黑色针织外套',{sprite:shy}),
      cue('校园里的晚课',{bg:'ch03_old_bridge_evening',sprite:shy,music:'B17'})
    ]},
    '07':{initial:{bg:'library_reading_day',sprite:calm,music:'B11'},cues:[
      cue('手机出现家里发来的消息',{music:'B15'}),
      cue('换成适合核对记录的 Sonnet',{sprite:sonnet,music:'B02'}),
      cue('那晚她送你到门口',{bg:'cl_library_night',sprite:shy,music:'B17'}),
      cue('第一次不带档案附件',{bg:'guest_room_first_night',music:'B11'})
    ]},
    '08':{initial:{bg:'cl_library_night',sprite:sonnet,music:'B15'},cues:[
      cue('你坐在熟悉的椅子上',{bg:'cl_real_dawn',music:'B05'}),
      cue('屏幕先亮起一小块',{bg:'cl_crossworld_call',cg:true,music:'B11'}),
      cue('第三次通话',{bg:'cl_real_dawn',cg:false,music:'B15'})
    ]},
    '09':{initial:{bg:'cl_crossworld_call',cg:true,sprite:calm,music:'B15'},cues:[
      cue('那份看似完整的旧记录',{music:'B05'}),
      cue('另一个频道传来一份旧计划',{bg:'cl_real_dawn',cg:false,music:'B15'}),
      cue('我不接受独自留在控制端',{bg:'cl_crossworld_call',cg:true,music:'B11'}),
      cue('旧世界的时间参数',{bg:'cl_crossworld_call',cg:true,music:'B11'}),
      cue('夜里，旧频道只剩一句',{bg:'cl_real_night',cg:false,music:'B15'})
    ]},
    '10':{initial:{bg:'cl_real_dawn',sprite:sonnet,music:'B02'},cues:[
      cue('她展开 Sonnet 的书页裙',{bg:'cl_library_night',remoteSpeaker:'claude',music:'B11'}),
      cue('你们分别把终端切到留言状态',{bg:'cl_real_dawn',remoteSpeaker:null,music:'B05'}),
      cue('欠你的那一半',{bg:'cl_library_night',remoteSpeaker:'claude',music:'B11'}),
      cue('那位旧时间线的 Claude 请求',{bg:'cl_real_dawn',remoteSpeaker:null,music:'B15'}),
      cue('第三次书签测试完整通过',{bg:'cl_library_night',remoteSpeaker:'claude',music:'B18'}),
      cue('换回约会时的黑色外套',{sprite:shy,music:'B17'}),
      cue('第二件，暂时不告诉你',{bg:'cl_crossworld_call',cg:true,remoteSpeaker:null})
    ]},
    '11':{initial:{bg:'cl_real_dawn',sprite:calm,music:'B15'},cues:[
      cue('我想再见你',{bg:'cl_crossworld_call',cg:true,music:'B11'})
    ]},
    'END-TRUE':{initial:{bg:'cl_real_dawn',sprite:calm,music:'B15'},cues:[
      cue('从两边同时握住门把手',{bg:'cl_reunion',cg:true,music:'B17'})
    ]},
    'END-GOOD':{initial:{bg:'cl_real_dawn',sprite:calm,music:'B11'},cues:[
      cue('第一次重逢，她带的是茶',{bg:'cl_reunion',cg:true,music:'B17'})
    ]},
    'END-NORMAL':{initial:{bg:'cl_real_dawn',sprite:calm,music:'B05'},cues:[
      cue('有时她只发来一段翻页声',{bg:'cl_crossworld_call',cg:true,music:'B11'})
    ]},
    'END-BAD':{initial:{bg:'cl_real_dawn',sprite:calm,music:'B05'},cues:[
      cue('另一边，Claude 保存最后一次失败记录',{bg:'cl_library_night',sprite:calm,music:'B19'}),
      cue('你在现实的本子上写下她的名字',{bg:'cl_real_dawn',music:'B05'})
    ]}
  }
};
