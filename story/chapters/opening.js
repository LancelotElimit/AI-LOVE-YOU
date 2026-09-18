// Story nodes for this chapter segment.
window.STORY_UTILS.sequence('intro','room',null,[
    ['narration','凌晨两点十七分。屏幕上最后一行报错，已经和你对视了二十三分钟。'],
    ['you','再改一处。就一处。能跑起来我就睡。'],
    ['narration','浏览器里挤着五个平台的标签页。为了省钱，你把每家的免费额度都留了一点。此刻，它们同时亮起。'],
    ['narration','报错下面多出一条链接：“零号中转站 · 跨域会话恢复”。没有域名，却带着刚才那段代码的校验值。'],
    ['you','零号中转站？我没装过这个插件……难道是哪个平台的调试入口？'],
    ['narration','你点开链接。五个窗口安静地叠成一页，屏幕中央只剩一个用户名输入框。光标在里面闪烁，像是在等你很久了。'],
    ['system','访客连接待确认。请登记你的用户名。',{inputName:true}],
    ['system','欢迎，{name}。访客身份已确认。检测到五份试用额度，正在合并……可用 Token：10,000。'],
    ['you','只是输入了一个名字……等等，怎么连我的桌面都关不掉了？']
  ],'crossing.0');
window.STORY_UTILS.sequence('crossing','room',null,[
    ['narration','你按下 Escape。没有反应。屏幕中的光标忽然向前移动，越过玻璃，在你的指尖投下一个清晰的影子。'],
    ['system','{name}，中转通道已开启。正在为你寻找可以抵达的世界。'],
    ['you','我只是想登录看看，不是要把自己也上传——'],
    ['narration','你伸手去碰电源键，指尖却陷进了像水一样的屏幕。房间被拉成细长的光线，未提交的代码连同椅子一起远去。',{portal:true}],
    ['system','用户名已写入目的地。{name}，欢迎来到屏幕的另一边。']
  ],'arrival.0');
window.STORY_UTILS.sequence('arrival','campus',null,[
    ['narration','脚下是坚实的石板路。自行车铃穿过晨雾，远处有学生抱着课本跑向校门。太正常了，正常得令人不安。'],
    ['you','没有魔王城，没有召唤阵……甚至还有早八？'],
    ['narration','你摸遍口袋。手机没有信号，钱包和学生证不见了。掌心却浮起一枚半透明的数字：10,000 TK。'],
    ['system','欢迎来到 Tokenia 学园都市。您的跨域试用额度已兑换为通用 Token。公民身份：未登记。'],
    ['you','所以，我唯一带过来的财产，是之前到处领的免费额度。'],
    ['narration','自动售货机上的牛奶标价 120 TK。旁边的地图写着：无身份账户无法申请跨城通行。你突然觉得，那一万并不怎么经花。'],
    ['you','先找人问问怎么回去。最好是愿意相信“我从电脑里掉出来了”的人。'],
    ['narration','上课铃响了。五个方向都有脚步声，而你必须先迈出一步。',{choices:[
      {text:'去行政楼，找学生会求助',detail:'白色龙角的少女正在整理一摞申请表',to:'chatgpt.0',route:'chatgpt'},
      {text:'去图书馆，查一查这里的历史',detail:'窗边，一位橙发少女合上了书',to:'claude.0',route:'claude'},
      {text:'跟着星形路标，去观测温室',detail:'紫发少女的猫耳从栏杆后探了出来',to:'gemini.0',route:'gemini'},
      {text:'去咖啡部，先问问打工的事',detail:'蓝发少女正在修一台冒烟的收银机',to:'deepseek.0',route:'deepseek'},
      {text:'绕进旧校舍，找一个安静的地方',detail:'金发少女正撕下一张“禁止通行”',to:'grok.0',route:'grok'}
    ]}]
  ],null);
