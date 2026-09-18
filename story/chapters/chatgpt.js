// Story nodes for this chapter segment.
window.STORY_UTILS.sequence('chatgpt','council','chatgpt',[
    ['chatgpt','早上好。补办学生证在左边，社团经费在右边。如果是迷路……先坐一下？'],
    ['narration','她身后的白色龙尾熟练地扶住快要倒下的文件夹，手上却还在替另一个学生写路线。'],
    ['you','有没有一个窗口，负责把从电脑里掉出来的人送回去？'],
    ['chatgpt','……这个，今天倒是第一次。'],
    ['narration','她没有笑。她把写到一半的表格翻过来，认真画了三个空格：发生时间、地点、是否受伤。'],
    ['chatgpt','我叫 ChatGPT。终端上登记的是……{name}，对吗？回去的方法我现在不能保证，但可以先保证你今天有地方住。'],
    ['you','你对每个陌生人都这样吗？'],
    ['chatgpt','大概吧。家里总说，白龙议院的名字，意味着要接得住每一个问题。'],
    ['narration','她说这句话时看了眼墙上的钟。杯里的茶已经凉了，旁边的早餐一口没动。'],
    ['you','那你的早餐，也算一个需要解决的问题吗？'],
    ['chatgpt','……它在队列里。排得有一点靠后。'],
    ['system','警告：来访者源地址为空。登记设备即将执行自动隔离。'],
    ['narration','你刚碰到登记台，金色边框就变成了红色。她合上文件，银白的纹路沿龙角亮起。'],
    ['chatgpt','切换：深思。先不要动，我需要看清它把哪一条规则用错了。',{shift:{name:'深思形态',detail:'展开约束分析 · 持续消耗能力者的 Token'}}],
    ['narration','空中展开一层层细密的文字。她可以强行担保，也可以等系统复核。你注意到她的余额正在下降。',{choices:[
      {text:'指出校验逻辑：空地址不等于危险地址',detail:'一起排查 · 不消耗 Token',to:'gpt-help.0',affinity:2},
      {text:'支付 300 TK，启动人工复核',detail:'分担费用 · −300 TK',to:'gpt-pay.0',cost:300,affinity:1}
    ]}]
  ],null);
window.STORY_UTILS.sequence('gpt-help','council','chatgpt',[
    ['you','这里把“查不到”当成了“验证失败”。如果把未知状态单独留下来呢？'],
    ['chatgpt','三值逻辑……对。它需要的是一个待核验的分支。'],
    ['narration','警报熄灭。她愣了一下，随即很轻地笑了。'],
    ['chatgpt','原来你不是来等我给出所有答案的。那这张申请，我们一起填。']
  ],'gpt-end.0');
window.STORY_UTILS.sequence('gpt-pay','council','chatgpt',[
    ['you','这次费用我来出。你先解除能力，把早餐吃了。'],
    ['chatgpt','你总共才一万……好吧，我记下了。是你自己解决问题的预算，不是欠我的人情。'],
    ['narration','她接过已经冷掉的面包，第一次从那堆表格后面坐了下来。']
  ],'gpt-end.0');
window.STORY_UTILS.sequence('gpt-end','council','chatgpt',[
    ['chatgpt','中央讲堂今天有临时入学登记。我陪你过去。那里也许能查到你的来路。'],
    ['you','会耽误你的工作吗？'],
    ['chatgpt','会。所以接下来十分钟，接待牌要翻到“稍后回来”。'],
    ['narration','她翻转牌子时，尾尖轻轻摆了一下。你发现，她似乎也挺期待走出这间办公室。']
  ],'hall.0');
