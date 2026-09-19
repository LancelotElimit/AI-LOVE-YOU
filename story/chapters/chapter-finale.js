// Shared finale for Prologue.
window.STORY_UTILS.sequence('gate','transit','$route',[
    ['system','临时同行见证申请已受理。请双方确认进入校园区域。'],
    ['$route','今天先到这里。门后面的事，等过了这道门再一起想。',{sprite:'hello'}],
    ['narration','外环闸机亮起通行灯。远处的行政楼、图书馆、观测温室、咖啡部和旧校舍，像刚刚被写进同一张地图。'],
    ['you','我还不知道怎么回家。也不知道这座城市为什么会认识我的名字。'],
    ['$route','所以先别一个人走。',{sprite:'shy'}],
    ['narration','她说得很自然。你忽然意识到，几分钟前，你在这里还不认识任何一个人。'],
    ['system','访客姓名：{name}。状态：未登记 / 可入境。停留时限：至今日 24:00。下一流程：中央讲堂问询。'],
    ['narration','你握着还带余温的本地终端，第一次认真想起那个迟早要回答的问题。',{choices:[
      {text:'我要找到回家的路，也会认真度过今天',detail:'记下现在最重要的目标',to:'resolve-home.0',intent:'home'},
      {text:'我想回家，但也想多了解你和这个世界',detail:'给未知的明天留一个位置',to:'resolve-stay.0',intent:'explore',affinity:1}
    ]}]
  ],null);

window.STORY_UTILS.sequence('resolve-home','transit','$route',[
    ['you','我的家里还有人在等我。但这不代表，这里的今天就不算数。'],
    ['$route','那就先把今天留下来。回家的路，也要从第一步开始。',{sprite:'hello'}]
  ],'last.0');

window.STORY_UTILS.sequence('resolve-stay','transit','$route',[
    ['you','现在就决定最后要去哪里，好像还太早。我至少想先知道，明天还能不能见到你。'],
    ['$route','能。这个问题，不用等到明天才回答。',{sprite:'shy'}]
  ],'last.0');

window.STORY_UTILS.sequence('last','campus','$route',[
    ['narration','你们一起穿过外环闸机。风从校园里吹来，带着铃声、早餐摊的热气，以及某种不属于原世界的微弱光亮。'],
    ['narration','手机依旧没有信号，却收到了一条没有发件人的本地消息。'],
    ['system','「第一日记录已开始。请不要相信那扇直接带你回家的门。」'],
    ['narration','下一行文字停顿了很久，才慢慢出现。'],
    ['system','「还有，这一次，请记住她的名字。」'],
    ['narration','你抬头看向 Tokenia 学园都市。第一道门已经在身后合上，而真正的问询还在前方。',{end:true}]
  ],null);

