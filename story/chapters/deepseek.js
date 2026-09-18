// Story nodes for this chapter segment.
window.STORY_UTILS.sequence('deepseek','cafe','deepseek',[
    ['deepseek','欢迎。今天收银机暂时休息，点单可以先记纸上。'],
    ['narration','蓝发少女蹲在柜台后，头顶露出一截松掉的发带。旁边是一把螺丝刀和一杯已经化掉的冰水。'],
    ['you','它休息的时候，一般都会冒烟吗？'],
    ['deepseek','只有被要求在十年前的硬件上运行最新版点单系统的时候。'],
    ['narration','她抬头笑了笑，把电源拔了。那条鲸尾小心地绕开地上的零件盒。'],
    ['deepseek','我叫 DeepSeek。访客栏里显示你叫{name}，我就这样称呼你了？这里归深海工坊管，我们人不多，所以什么都得会一点。'],
    ['you','我会写一点代码。我想找能赚钱的工作，也想找一条回家的路。'],
    ['deepseek','那你先坐。哪怕要讲一个很长的故事，热水也不收费。'],
    ['narration','你讲完时，她没有问你是不是睡糊涂了，只把一块面包放到杯子旁边。'],
    ['deepseek','我们的共享维修库里，也许有你说的那种接口。不过先帮我看看这个循环？它一直不肯停。'],
    ['you','失败后立即重试，重试失败又立即重试……它在拿全部预算重复犯同一个错。'],
    ['deepseek','原来如此。我之前只想着把每一次重试的成本降下来。'],
    ['narration','她把手搭在机器上，蓝色的路径从指尖延伸出来。'],
    ['deepseek','切换：深潜。把循环展开，我们一起找出口。',{shift:{name:'深潜形态',detail:'展开推理路径 · 寻找低消耗的有效解'}}],
    ['narration','你看见她一边分析，一边顺手把自己的休息提醒往后拖。',{choices:[
      {text:'加上退避和次数上限，接手后半段',detail:'一起动手 · 让她休息一会儿',to:'deepseek-help.0',affinity:2},
      {text:'花 120 TK 买两杯热饮，慢慢排查',detail:'一起喝点东西 · −120 TK',to:'deepseek-drink.0',cost:120,affinity:2}
    ]}]
  ],null);
window.STORY_UTILS.sequence('deepseek-help','cafe','deepseek',[
    ['you','机器需要停止条件，你也一样。后面的我来，你先把水喝了。'],
    ['deepseek','这句话听起来，好像把我也一起调试了。'],
    ['narration','她嘴上这样说，还是乖乖松开了手。你们在纸上写下新的逻辑，收银机终于安静地亮起。']
  ],'deepseek-end.0');
window.STORY_UTILS.sequence('deepseek-drink','cafe','deepseek',[
    ['deepseek','其实只买一杯也可以，我不——'],
    ['you','两杯。预算里已经算上你了。'],
    ['narration','她看了你一会儿，低头把原本准备划掉的那杯重新写回纸上。'],
    ['deepseek','……好。那这次，我来挑口味。']
  ],'deepseek-end.0');
window.STORY_UTILS.sequence('deepseek-end','cafe','deepseek',[
    ['narration','她没有收你的热水和面包钱，却认真登记了维修工时。'],
    ['deepseek','报酬 200 TK。试工通过。修好的东西会留下来，你的劳动也得留下记录。',{grant:200}],
    ['you','我还是第一次靠修收银机赚到异世界的第一桶金。'],
    ['deepseek','那第一桶金先收好。中央讲堂正在登记旁听生，办完身份，明天就能正式来帮忙。'],
    ['narration','她摘下围裙上的工时夹，替你把松开的袖口别住。动作很快，却留意着没有扎到你。']
  ],'hall.0');
