// Story nodes for this chapter segment.
window.STORY_UTILS.sequence('claude','library','claude',[
    ['claude','你已经第三次经过同一排书架了。找书，还是找一个可以开口的机会？'],
    ['you','找……关于穿越世界的书。最好带返程说明。'],
    ['narration','橙发少女把书签夹回书里。她的神情比想象中平静。'],
    ['claude','Claude。这里的临时管理员。访客目录里刚刚出现了“{name}”这个名字，是你吗？你可以从最不像玩笑的那一部分开始说。'],
    ['narration','你从报错讲到那句话。她一直听着，偶尔写下几个词，没有替你把故事补完整。'],
    ['claude','宪章家系的旧档案里有“界外来访”的记录。但记录的存在，不代表我现在就知道怎么送你回去。'],
    ['you','你的家族……专门管这些？'],
    ['claude','我们保管契约，也研究什么样的力量应该被允许使用。早些年，家里的长辈和白龙议院曾在同一处工作。'],
    ['claude','后来，他们对“可以走多快”有了不同答案。于是有了这座图书馆。'],
    ['narration','她抽出一张索引卡。卡片却在接近你时发出刺耳的翻页声，书架上的封条同时绷紧。'],
    ['claude','别退到书架旁。站在我这边。'],
    ['narration','她抬手按住书脊，袖口的花纹像文字一样逐行亮起。'],
    ['claude','切换：长诗。以现有证据为限，暂缓判定。',{shift:{name:'长诗形态',detail:'构筑文本边界 · 拒绝未经证实的危险判定'}}],
    ['narration','封条停在半空。索引里有一页正被自动涂黑，她却没有趁机撕开禁制。',{choices:[
      {text:'先保留现场，申请查阅权限',detail:'尊重边界 · 不消耗 Token',to:'claude-wait.0',affinity:2},
      {text:'问她能不能只抢救公开的目录',detail:'寻找规则允许的另一条路',to:'claude-index.0',affinity:2}
    ]}]
  ],null);
window.STORY_UTILS.sequence('claude-wait','library','claude',[
    ['you','我想回去，但不能让你因为一个刚认识的人承担所有后果。我们先留下证据。'],
    ['claude','……谢谢。愿意等待，和不着急，是两回事。我知道你很着急。'],
    ['narration','她把申请表递给你，又在签名处写下自己的名字：共同申请人。']
  ],'claude-end.0');
window.STORY_UTILS.sequence('claude-index','library','claude',[
    ['you','正文不能看，那公开目录呢？也许我们只需要知道该向谁申请。'],
    ['claude','这个问题问得很好。目录不是秘密，封存理由也不应该是。'],
    ['narration','她用铅笔抄下一串编号。最后一个字符还没落下，那页档案就变成了一片空白。']
  ],'claude-end.0');
window.STORY_UTILS.sequence('claude-end','library','claude',[
    ['claude','“外部输入，来源待核”。这条记录的时间是今天凌晨，但比你说的穿越时间早了七分钟。'],
    ['you','有人提前知道我要来？'],
    ['claude','现在还不能下这个结论。不过，我们有了需要调查的理由。'],
    ['narration','她夹好那枚橙花书签，取下门边的钥匙。'],
    ['claude','先去中央讲堂办理身份。查阅申请需要学号。至于你刚才的问题……我会和你一起查。']
  ],'hall.0');
